/**
 * The registration pipeline's backlog: what exists, where each company is, what to do next.
 *
 *   node scripts/pipeline/queue.mjs status                        stage counts (entries, pipeline/state)
 *   node scripts/pipeline/queue.mjs jobs [--list --stage S]       every company by job stage, with reasons
 *   node scripts/pipeline/queue.mjs plan [--limit N] [--detail]  DRY RUN: what each queue would do next
 *                                                                 (--detail: one line per company about to be registered)
 *   node scripts/pipeline/queue.mjs check                         consistency of state / entries / reservations
 *   node scripts/pipeline/queue.mjs reap                          release reservations whose process has died
 *   node scripts/pipeline/queue.mjs next <group1|group2|finalize> [--limit N]     read-only
 *   node scripts/pipeline/queue.mjs claim <group1|group2|finalize> --limit N [--owner NAME]
 *
 * Everything but `claim` is read-only. `claim` is the one way a worker takes work: it picks
 * the next N and reserves them in a single locked step, so two workers can never receive the
 * same company (`next` followed by a separate reserve could — that is what `claim` replaces).
 * `plan` makes no network request: it reports what is NOT in the EDINET cache, so the number
 * of downloads a run will cost is known before it starts.
 *
 * `check` exits 1 when it finds an error-level problem (a duplicate company, a reservation
 * on a company that is already published, a registered company with no entry …); a mass run
 * starts only from a clean `check`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { auditIndexCache, cacheDir } from "../research/edinet.mjs";
import { STAGES, allStates, claim, ownerAlive, readyForStage, reapDeadReservations, reservations } from "./company-state.mjs";
import { packProblem, readPack } from "./pack.mjs";
import { describeEvents, scanPostFilingEvents } from "./post-filing.mjs";
import { checkConsistency, intakeCandidates, loadAmendmentActions, loadEntries, loadIntakeFailures, loadJobs, loadUniverse, universeWindow, universeWindowEnd } from "./jobs.mjs";

const [command, ...rest] = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = rest.indexOf(`--${name}`);
  return i !== -1 && rest[i + 1] ? rest[i + 1] : fallback;
};
const limit = Number(flag("limit", "Infinity"));

const tally = (items, key) => {
  const t = {};
  for (const item of items) t[key(item)] = (t[key(item)] ?? 0) + 1;
  return t;
};
const fmt = (t) => Object.entries(t).map(([k, v]) => `${k}:${v}`).join("  ");
/** The day indexes behind the universe window: which days the cache has lost, cannot read, or took too early. */
const indexAudit = () => {
  const window = universeWindow();
  return window ? { ...window, ...auditIndexCache(window.from, window.to) } : null;
};
/** Post-filing candidates for every company with a state, as one line each (acknowledged documents left out). */
const postFilingEvents = () => {
  const companies = allStates()
    .filter((s) => s.identity?.code && s.identity.submitted)
    .map((s) => ({ id: s.companyId, code: s.identity.code, submitted: s.identity.submitted, filerName: s.identity.filerName, periodEnd: s.identity.periodEnd, acknowledged: new Set(s.identity.postFilingAcknowledged ?? []) }));
  const found = scanPostFilingEvents(companies);
  const lines = new Map();
  for (const c of companies) {
    const events = (found.get(c.id) ?? []).filter((e) => !c.acknowledged.has(e.docID));
    if (events.length > 0) lines.set(c.id, describeEvents(events));
  }
  return lines;
};
const docCached = (docID) => existsSync(join(cacheDir(), "documents", `${docID}-5.zip`));
const shortReason = (r, n = 70) => r.replace(/[0-9A-Za-z-]{6,}/g, "…").slice(0, n);

if (command === "status") {
  console.log("src/data/companies/:");
  for (const [state, n] of Object.entries(tally(loadEntries(), (e) => e.tier))) console.log(`  ${state}: ${n}`);

  const states = allStates();
  console.log(`\npipeline/state/: ${states.length} 件`);
  for (const stage of STAGES) {
    const byStatus = tally(states, (s) => s.stages[stage].status);
    console.log(`  ${stage.padEnd(18)} ${Object.entries(byStatus).map(([k, v]) => `${k}:${v}`).join(" ")}`);
  }

  console.log("\n次に進められる件数（pipeline/reserved.tsv に載っている会社は除く）:");
  console.log(`  group1   ready: ${readyForStage("group1").length}`);
  console.log(`  group2   ready: ${readyForStage("group2").length}`);
  console.log(`  finalize ready: ${readyForStage("finalize").length}`);
} else if (command === "jobs") {
  const jobs = loadJobs();
  console.log(`会社 ${jobs.length} 社（universe + state + エントリーの和）\n`);
  console.log(`job stage:  ${fmt(tally(jobs, (j) => j.job.stage))}`);
  console.log(`予約中 ${jobs.filter((j) => j.job.reserved).length} / 再試行できる ${jobs.filter((j) => j.job.retryable).length}`);
  const attention = jobs.filter((j) => j.job.stage === "needs-attention");
  if (attention.length > 0) {
    console.log(`\nneeds-attention ${attention.length} 社 — 理由の内訳:`);
    const reasons = tally(attention.flatMap((j) => j.job.reasons.map((r) => shortReason(r))), (r) => r);
    for (const [r, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${String(n).padStart(4)}  ${r}`);
  }
  if (rest.includes("--list")) for (const j of jobs.filter((x) => x.job.stage === (flag("stage") ?? "needs-attention"))) console.log(`${j.id}\t${j.job.reasons.join(" | ")}`);
} else if (command === "plan") {
  // ---- DRY RUN. Reads files; writes nothing; asks EDINET nothing. ----
  const jobs = loadJobs();
  const universe = loadUniverse();
  const states = allStates();
  const failures = loadIntakeFailures();
  const take = (list) => list.slice(0, Number.isFinite(limit) ? limit : list.length);
  console.log("== plan（dry-run: 何も書かず、EDINET にも問い合わせない）==\n");
  console.log(`対象 ${jobs.length} 社   job stage: ${fmt(tally(jobs, (j) => j.job.stage))}\n`);

  const candidates = intakeCandidates(universe, states, new Set(failures.keys()));
  const need = candidates.filter((c) => !docCached(c.docID));
  console.log(`1. intake（id 割当・証拠パック・draft）: ${candidates.length} 社が対象`);
  console.log(`   有報が EDINET キャッシュに無く、取得が必要: ${need.length} 件（残りはキャッシュ済み）`);
  for (const c of take(candidates).slice(0, 5)) console.log(`   · ${c.code} ${c.filerName} docID ${c.docID} ${docCached(c.docID) ? "（キャッシュ有）" : "（要取得）"}`);
  console.log(`   intake の再試行候補: ${failures.size} 社（抽出器を直せば再実行で拾われる）`);

  const intake = jobs.filter((j) => j.job.stage === "intake" && !j.job.reserved);
  console.log(`2. register-figures（数値のみ登録）: ${intake.length} 社が対象（証拠パック・draft 済みで未登録）`);
  if (rest.includes("--detail")) {
    const stateById = new Map(states.map((s) => [s.companyId, s]));
    const actions = {};
    for (const j of intake) {
      const identity = stateById.get(j.id)?.identity ?? {};
      const pack = readPack(j.id);
      const problem = packProblem(pack, identity);
      const doc = identity.originalDocID ?? identity.docID;
      const action = problem ? `パックを作り直す（${problem}）` : "そのまま検査して登録";
      actions[action] = (actions[action] ?? 0) + 1;
      console.log(`   ${j.id.padEnd(34)} ${String(j.code).padEnd(5)} ${(j.name ?? "").slice(0, 16).padEnd(16)} ${j.job.stage}${j.job.reserved ? " 予約中" : ""}  pack=${pack ? `v${pack.extractorVersion ?? 1}` : "なし"}  EDINET ${doc}${docCached(identity.docID ?? doc) ? "（キャッシュ有）" : "（要取得）"}  → ${action}`);
    }
    console.log(`   予定: ${fmt(actions)}`);
  }

  const label = { group1: "エージェント: businessStructure, history", group2: "エージェント: businessModel, industry, relatedCompanies, terms", finalize: "全エージェント工程が済み、昇格待ち" };
  let n = 3;
  for (const stage of ["group1", "group2", "finalize"]) {
    const ready = readyForStage(stage);
    console.log(`${n++}. ${stage}: ${ready.length} 社が対象（${label[stage]}）`);
    for (const id of take(ready).slice(0, 3)) console.log(`   · ${id}`);
  }

  const attention = jobs.filter((j) => j.job.stage === "needs-attention");
  console.log(`\nneeds-attention 候補 ${attention.length} 社（自動では進めない。人が確認する）`);
  const reasons = tally(attention.flatMap((j) => j.job.reasons.map((x) => shortReason(x, 60))), (x) => x);
  for (const [r, c] of Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 6)) console.log(`   ${String(c).padStart(4)}  ${r}`);
  console.log(`再試行候補 ${jobs.filter((j) => j.job.retryable).length} 社 / 予約中 ${reservations().length} 件`);

  // The amendment index is only as current as its last refresh.
  const indexPath = join(process.cwd(), "pipeline/amendments-index.json");
  if (existsSync(indexPath)) {
    const through = JSON.parse(readFileSync(indexPath, "utf8")).checkedThrough;
    const behind = through ? Math.floor((Date.now() - Date.parse(`${through}T00:00:00Z`)) / 86_400_000) : null;
    const open = [...loadAmendmentActions().values()].filter((a) => !["none", "record-only"].includes(a)).length;
    console.log(`\n訂正有報の索引: ${through ?? "なし"} まで確認${behind !== null && behind > 7 ? `（${behind} 日前。登録の前に node scripts/pipeline/amendment-audit.mjs --refresh）` : ""}。要対応の訂正 ${open} 社`);
  }
  console.log("\nこの plan は何も変更していません。");
} else if (command === "check") {
  const problems = checkConsistency({ states: allStates(), entries: loadEntries(), universe: loadUniverse(), reservations: reservations(), ownerAlive, universeWindowEnd: universeWindowEnd(), indexAudit: indexAudit(), postFilingEvents: postFilingEvents() });
  const errors = problems.filter((p) => p.level === "error");
  const warns = problems.filter((p) => p.level === "warn");
  console.log(`check: エラー ${errors.length} / 警告 ${warns.length}`);
  for (const [level, list] of [["ERROR", errors], ["WARN", warns]]) {
    for (const [rule, count] of Object.entries(tally(list, (p) => p.rule))) {
      console.log(`\n[${level}] ${rule}（${count} 件）`);
      for (const p of list.filter((x) => x.rule === rule).slice(0, 8)) console.log(`  ${p.id}: ${p.message}`);
      if (count > 8) console.log(`  … ほか ${count - 8} 件`);
    }
  }
  if (problems.length === 0) console.log("問題なし");
  process.exit(errors.length > 0 ? 1 : 0);
} else if (command === "reap") {
  // Releases only reservations whose owning process is gone (owner name:pid). Anything it cannot judge stays.
  const released = reapDeadReservations();
  console.log(released.length > 0 ? `解放: ${released.length} 件（${released.slice(0, 5).join(", ")}${released.length > 5 ? " …" : ""}）` : "解放する予約はありません");
} else if (command === "next") {
  const stage = rest[0];
  if (!["group1", "group2", "finalize"].includes(stage)) {
    console.error("usage: node scripts/pipeline/queue.mjs next <group1|group2|finalize> [--limit N]");
    process.exit(1);
  }
  const ids = readyForStage(stage).slice(0, limit);
  for (const id of ids) console.log(id);
  if (ids.length === 0) console.error(`(該当なし: ${stage})`);
} else if (command === "claim") {
  const stage = rest[0];
  if (!["group1", "group2", "finalize"].includes(stage) || !Number.isFinite(limit)) {
    console.error("usage: node scripts/pipeline/queue.mjs claim <group1|group2|finalize> --limit N [--owner NAME]");
    process.exit(1);
  }
  const ids = claim(stage, limit, flag("owner", "worker") ?? "worker");
  for (const id of ids) console.log(id);
  if (ids.length === 0) console.error(`(該当なし: ${stage})`);
} else {
  console.error("usage: node scripts/pipeline/queue.mjs <status | jobs | plan | check | reap | next | claim> …");
  process.exit(1);
}
