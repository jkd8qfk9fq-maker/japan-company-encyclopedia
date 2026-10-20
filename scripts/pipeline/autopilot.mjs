/**
 * The registration autopilot: give it companies, it does everything up to the point a person must decide.
 *
 *   node scripts/pipeline/autopilot.mjs enqueue <id|code> [...]  [--file ids.txt]   add candidates to the queue
 *   node scripts/pipeline/autopilot.mjs suggest [--limit N] [--sector 業種]           next candidates worth queueing
 *   node scripts/pipeline/autopilot.mjs run [--limit N] [--ids a,b] [--executor claude-cli|work-orders]
 *                                         [--model sonnet] [--budget 3] [--total-budget 15] [--allow-web]
 *   node scripts/pipeline/autopilot.mjs status [--json] [--refresh-report out/refresh-report.json]
 *   node scripts/pipeline/autopilot.mjs review <id>                                   print the review sheet
 *   node scripts/pipeline/autopilot.mjs approve <id> --confirm --hash <hash>          register (after YOU read the sheet)
 *   node scripts/pipeline/autopilot.mjs update <id> [--plan]   a registered company with a newer 有報: rewrite only what
 *                                         changed (start-update.mjs), then run → review → approve as for a registration
 *   node scripts/pipeline/autopilot.mjs retry <id>          clear a hold/pause and run again (finished steps are not redone)
 *   node scripts/pipeline/autopilot.mjs redo <id> group1|group2     set that group's fragments aside and have it rewritten
 *   node scripts/pipeline/autopilot.mjs ack <id>             record that you looked at the post-filing events (advance --ack-post-filing)
 *   node scripts/pipeline/autopilot.mjs discard <id>        drop a company from the queue (its fragments stay on disk)
 *   node scripts/pipeline/autopilot.mjs check               npm run content:check, recorded
 *   node scripts/pipeline/autopilot.mjs history [<id>] [--tail N]
 *
 * It never registers on its own, never runs git, and never writes src/data except through `approve`, which runs
 * the existing registration (advance.mjs --register → finalize.mjs) after the person has confirmed the sheet.
 * New registrations and the yearly update of registered companies are different lanes: this is the first; the
 * second is refresh-financials.mjs for the figures (detected daily by the GitHub Actions workflow, proposed as a pull
 * request) and `update` here for the explanation, which goes through the same review sheet and approval.
 *
 * See docs/auto-registration.md.
 */
import { execFile, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { cacheDir, scrubSecrets } from "../research/edinet.mjs";
import { claudeAvailable, cleanEnv, createExecutor } from "./ai-executor.mjs";
import { SETTLED, approvalProblems, buildReviewSheet, enqueue, hashOf, newRecord, now, operatorList, resolveCandidates, tally } from "./autopilot-lib.mjs";
import { PauseRun, processCompany } from "./autopilot-engine.mjs";
import { approvalFor } from "./approvers.mjs";
import { loadState, release, reservations, setStage } from "./company-state.mjs";
import { changedFields, layerOf } from "./ownership.mjs";
import { mergeEntry } from "./merge-fragments.mjs";
import { loadLedger, loadRegistry, policyFindings, writeRelatedCandidates } from "./policy-context.mjs";
import { errorsOf } from "./prose-policy.mjs";
import { inScope, updateScope } from "./update-scope.mjs";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const dir = join(root, "pipeline/autopilot");
const sub = (/** @type {string} */ n) => {
  const p = join(dir, n);
  mkdirSync(p, { recursive: true });
  return p;
};
const readJson = (/** @type {string} */ p, /** @type {any} */ fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback);
/** Atomic: a crash leaves the old file, never half of a new one. */
const writeJson = (/** @type {string} */ p, /** @type {any} */ v) => {
  mkdirSync(join(p, ".."), { recursive: true });
  const tmp = `${p}.tmp-${process.pid}`;
  writeFileSync(tmp, `${JSON.stringify(v, null, 2)}\n`);
  renameSync(tmp, p);
};

const args = process.argv.slice(3);
const flag = (/** @type {string} */ name, /** @type {string | null} */ fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const has = (/** @type {string} */ name) => args.includes(`--${name}`);
const VALUE_FLAGS = new Set(["file", "limit", "ids", "executor", "model", "budget", "total-budget", "hash", "tail", "sector", "refresh-report", "approver", "basis"]);
const positional = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--") && VALUE_FLAGS.has(args[i - 1].slice(2))));

// --------------------------------------------------------------------------------------------- storage
const queuePath = join(dir, "queue.json");
const runPath = (/** @type {string} */ id) => join(sub("runs"), `${id}.json`);
const loadQueue = () => readJson(queuePath, { version: 1, items: [] });
const loadRecord = (/** @type {string} */ id) => readJson(runPath(id), null);
const saveRecord = (/** @type {any} */ r) => writeJson(runPath(r.id), r);
const event = (/** @type {string} */ id, /** @type {string} */ type, /** @type {object} */ data = {}) => {
  mkdirSync(dir, { recursive: true });
  appendFileSync(join(dir, "history.jsonl"), `${scrubSecrets(JSON.stringify({ at: now(), id, type, ...data }))}\n`);
};
const allRecords = () => (existsSync(join(dir, "runs")) ? readdirSync(join(dir, "runs")).filter((f) => f.endsWith(".json")).map((f) => readJson(join(dir, "runs", f), null)).filter(Boolean) : []);

// --------------------------------------------------------------------------------------------- real effects
/** Children get the key through --env-file; this process never holds it, and nothing here prints it. */
const nodeArgs = (/** @type {string[]} */ rest) => [...(existsSync(join(root, ".env.local")) ? ["--env-file=.env.local"] : []), ...rest];
const runNode = async (/** @type {string[]} */ rest, /** @type {NodeJS.ProcessEnv} */ env = process.env) => {
  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, rest, { cwd: root, env, maxBuffer: 64 * 1024 * 1024, timeout: 25 * 60_000 });
    return { code: 0, out: scrubSecrets(`${stdout}${stderr ? `\n${stderr}` : ""}`) };
  } catch (/** @type {any} */ e) {
    return { code: typeof e.code === "number" ? e.code : 1, out: scrubSecrets(`${e.stdout ?? ""}${e.stderr ?? ""}${e.stdout || e.stderr ? "" : String(e.message)}`) };
  }
};

/**
 * A cheap fingerprint of the places a model must not write — the content, the pipeline code, the agent
 * definitions: any change after a model call is a hold. One line per file, "path<TAB>size<TAB>mtime", so the hold can
 * name the files. (A person editing those files while the queue runs causes the same hold: edit between runs.)
 */
function fingerprint() {
  const parts = [];
  const walk = (/** @type {string} */ d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else {
        const s = statSync(p);
        parts.push(`${p.slice(root.length + 1).replaceAll("\\", "/")}\t${s.size}\t${s.mtimeMs}`);
      }
    }
  };
  for (const d of ["src/data", "scripts", ".claude"]) if (existsSync(join(root, d))) walk(join(root, d));
  return parts.sort().join("\n");
}

const registryMaps = () => {
  const byId = loadRegistry(root);
  return { byId, byCode: new Map([...byId.values()].map((e) => [e.code, e])) };
};

const fragmentPath = (/** @type {string} */ id, /** @type {string} */ stage) => join(root, "pipeline/results", `${id}-${stage}.json`);
const updating = (/** @type {string} */ id) => loadRecord(id)?.mode === "update";
/** During an update only the rewritten part's findings count (update-scope.mjs); otherwise all of them. */
const scopeOf = (/** @type {string} */ id) => (updating(id) ? updateScope(loadState(id).identity) : null);
const scoped = (/** @type {string} */ id, /** @type {import("./prose-policy.mjs").Finding[]} */ findings) => findings.filter((f) => inScope(f.path, scopeOf(id)));
const GROUP_FILES = { group1: ["businessStructure", "history"], group2: ["businessModel", "industry", "relatedCompanies", "terms"] };

/** @type {import("./autopilot-engine.mjs").Deps} */
const deps = {
  load: loadRecord,
  save: saveRecord,
  event,
  cache: cacheDir(),
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  release,
  fingerprint,
  executor: /** @type {any} */ (null),
  identity: (id) => {
    const e = loadRegistry(root).get(id);
    const rec = loadRecord(id);
    // The agent is asked only for the stages still to write: a stage rewritten earlier in this update is done.
    const update = rec?.mode === "update" ? { ...rec.update, stages: rec.update.stages.filter((/** @type {string} */ s) => !existsSync(fragmentPath(id, s))) } : null;
    return { name: e?.name ?? id, code: e?.code ?? "", update };
  },
  facts: (id) => {
    const { byId, byCode } = registryMaps();
    const entry = byId.get(id) ?? null;
    const sameCode = entry ? [...byId.values()].filter((e) => e.code === entry.code && e.id !== id).map((e) => e.id) : [];
    const state = loadState(id);
    const parked = state?.stages?.registration?.status === "needs-review" ? String(state.stages.registration.note ?? "needs-review") : null;
    const rec = loadRecord(id);
    const owner = reservations().find((r) => r.id === id)?.owner ?? null;
    void byCode;
    return { entry, sameCode, ledger: entry ? (loadLedger(root).get(entry.code) ?? null) : null, registrationNote: parked, reservedBy: rec && rec.step !== "queued" ? null : owner, update: rec?.mode === "update" };
  },
  advance: async (id) => {
    writeRelatedCandidates(id, { root }); // the mechanical list of names the agent may link; free, and rebuilt if the pack changed
    return (await runNode(nodeArgs(["scripts/pipeline/advance.mjs", id, ...(updating(id) ? ["--update"] : [])]))).out;
  },
  order: (id, group, kind, prompt) => {
    const p = join(sub("orders"), `${id}-${group}-${kind}.md`);
    writeFileSync(p, `${prompt}\n`);
    return p;
  },
  fragmentsExist: (id, group) => GROUP_FILES[group].every((s) => existsSync(fragmentPath(id, s))),
  checkGroup: (id, group) => {
    const files = GROUP_FILES[group].map((s) => fragmentPath(id, s));
    const unreadable = files.filter((f) => {
      try {
        JSON.parse(readFileSync(f, "utf8"));
        return false;
      } catch {
        return true;
      }
    });
    if (unreadable.length > 0) return { missing: true, figuresOk: false, figuresOutput: "", findings: [] };
    const merged = mergeEntry(id);
    return { missing: false, ...figures(id), findings: scoped(id, policyFindings(merged.entry, { root })) };
  },
  sheet: async (id, record) => {
    const stagedPath = join(root, "pipeline/staging", `${id}.json`);
    const text = readFileSync(stagedPath, "utf8");
    const entry = JSON.parse(text);
    const merged = mergeEntry(id);
    const all = policyFindings(entry, { root });
    const findings = scoped(id, all);
    const state = loadState(id);
    const registry = loadRegistry(root);
    const hash = hashOf(text);
    const published = join(root, "src/data/companies", `${id}.json`);
    const previous = updating(id) && existsSync(published) ? JSON.parse(readFileSync(published, "utf8")) : null;
    const scope = scopeOf(id);
    const kept = scope ? { count: errorsOf(all).length - errorsOf(findings).length, stages: scope.kept } : null;
    const built = buildReviewSheet({
      entry,
      findings,
      notes: { warnings: merged.warnings ?? [], needsReview: merged.needsReview ?? [], taxonomyGaps: merged.taxonomyGaps ?? [] },
      gate: { sourceValidation: `${state.stages.sourceValidation.status}: ${state.stages.sourceValidation.note ?? ""}`, qualityControl: `${state.stages.qualityControl.status}: ${state.stages.qualityControl.note ?? ""}` },
      registry,
      ledger: loadLedger(root),
      record,
      hash,
      previous,
      kept,
    });
    const reviewDir = sub("review");
    const path = join(reviewDir, `${id}.md`);
    writeFileSync(path, built.markdown);
    writeJson(join(reviewDir, `${id}.json`), { id, hash, readiness: built.readiness, errors: built.errors, reviews: built.reviews, at: now() });
    return { path, hash, readiness: built.readiness, errors: built.errors, reviews: built.reviews };
  },
};

/** After a model call: do the figures in the prose match the filing? A program; its exit code is the answer. */
function figures(/** @type {string} */ id) {
  const r = spawnSync(process.execPath, ["scripts/pipeline/check-prose-figures.mjs", id, "--fragments"], { cwd: root, encoding: "utf8", env: process.env });
  return { figuresOk: r.status === 0, figuresOutput: scrubSecrets(`${r.stdout ?? ""}${r.stderr ?? ""}`) };
}

// --------------------------------------------------------------------------------------------- commands
const command = process.argv[2];

async function main() {
  switch (command) {
    case "enqueue": {
      const fromFile = flag("file");
      const tokens = [...positional, ...(fromFile ? readFileSync(fromFile, "utf8").split(/[\s,]+/).filter((t) => t && !t.startsWith("#")) : [])];
      if (tokens.length === 0) return usage();
      const { add, skipped } = resolveCandidates(tokens, registryMaps());
      const queue = loadQueue();
      const added = enqueue(queue, add);
      writeJson(queuePath, queue);
      for (const id of added) event(id, "enqueued");
      console.log(`キューに追加: ${added.length} 社（すでにキューにある ${add.length - added.length} 社）${added.length ? `: ${added.join(", ")}` : ""}`);
      for (const s of skipped) console.log(`  追加しない: ${s.token} — ${s.reason}`);
      return;
    }
    case "suggest": {
      const limit = Number(flag("limit", "15"));
      const sector = flag("sector");
      const ledger = loadLedger(root);
      const inQueue = new Set(loadQueue().items.map((/** @type {any} */ i) => i.id));
      const reserved = new Set(reservations().map((r) => r.id));
      const rows = [];
      for (const f of readdirSync(join(root, "src/data/companies")).filter((x) => x.endsWith(".json"))) {
        const e = JSON.parse(readFileSync(join(root, "src/data/companies", f), "utf8"));
        if (e.status?.state !== "figures-only" || inQueue.has(e.id) || reserved.has(e.id)) continue;
        const lg = ledger.get(e.code);
        if (!lg || lg.listing !== "上場") continue;
        if (sector && lg.industry !== sector) continue;
        const latest = [...(e.financials ?? [])].sort((a, b) => String(b.periodEnd).localeCompare(String(a.periodEnd)))[0];
        rows.push({ id: e.id, code: e.code, name: e.name, industry: lg.industry, revenue: latest?.revenue ?? 0, year: latest?.fiscalYear ?? "" });
      }
      rows.sort((a, b) => b.revenue - a.revenue);
      console.log(`候補（数値のみ・上場・未キュー・予約なし${sector ? `・${sector}` : ""}）。売上高の大きい順:`);
      for (const r of rows.slice(0, limit)) console.log(`  ${r.id.padEnd(40)} ${r.code}  ${r.industry}  ${r.year}  ${Math.round(r.revenue / 1e8).toLocaleString()}億円`);
      console.log(`（該当 ${rows.length} 社。キューに入れる: node scripts/pipeline/autopilot.mjs enqueue <id> …）`);
      return;
    }
    case "run":
      return await run();
    case "status":
      return status();
    case "review": {
      const id = positional[0];
      const p = join(dir, "review", `${id}.md`);
      if (!id || !existsSync(p)) return console.error(`${id}: 確認シートがありません（状態が ready / ready-with-flags の会社だけ）`), process.exit(1);
      return console.log(readFileSync(p, "utf8"));
    }
    case "approve":
      return await approve();
    case "update":
      return await startUpdate();
    case "retry":
    case "redo":
    case "discard":
    case "ack":
      return await fixups();
    case "check":
      return await contentCheck();
    case "history": {
      const id = positional[0] ?? null;
      const tail = Number(flag("tail", "40"));
      const p = join(dir, "history.jsonl");
      if (!existsSync(p)) return console.log("履歴はまだありません");
      const lines = readFileSync(p, "utf8").split("\n").filter(Boolean).filter((l) => !id || JSON.parse(l).id === id);
      return console.log(lines.slice(-tail).join("\n"));
    }
    default:
      return usage();
  }
}

function usage() {
  console.error("usage: node scripts/pipeline/autopilot.mjs <enqueue|suggest|run|status|review|approve|update|retry|redo|ack|discard|check|history> …（冒頭のコメントを参照）");
  process.exit(1);
}

// ---------------------------------------------------------------------------------------- run
async function run() {
  const lock = join(dir, ".run.lock");
  mkdirSync(dir, { recursive: true });
  if (existsSync(lock)) {
    const pid = Number(readFileSync(lock, "utf8"));
    let alive = false;
    try {
      process.kill(pid, 0);
      alive = true;
    } catch (/** @type {any} */ e) {
      alive = e.code === "EPERM";
    }
    if (alive) return console.error(`すでに autopilot が実行中（pid ${pid}）。二重に走らせません`), process.exit(1);
  }
  writeFileSync(lock, String(process.pid));
  const unlock = () => rmSync(lock, { force: true });
  process.on("exit", unlock);

  // A run starts only from a clean consistency check (duplicate companies, reservations on finished companies, …):
  // the same rule docs/pipeline.md sets for every mass run. Warnings do not stop it; errors do.
  if (!has("skip-check")) {
    const check = await runNode(["scripts/pipeline/queue.mjs", "check"]);
    if (check.code !== 0) return console.error(`queue.mjs check がエラーを報告しました。直してから実行してください（--skip-check で無視できますが、勧めません）:\n${check.out.split("\n").slice(0, 12).join("\n")}`), process.exit(1);
  }

  const limit = Number(flag("limit", "Infinity"));
  const only = flag("ids")?.split(",") ?? null;
  const totalBudget = Number(flag("total-budget", "15"));
  const mode = flag("executor") ?? ((await claudeAvailable()) ? "claude-cli" : "work-orders");
  deps.executor = createExecutor({ mode: /** @type {any} */ (mode), model: flag("model", "sonnet") ?? "sonnet", budgetUsd: Number(flag("budget", "3")), allowWeb: has("allow-web"), cwd: root, env: cleanEnv(process.env) });

  const queue = loadQueue();
  const todo = queue.items.map((/** @type {any} */ i) => i.id).filter((/** @type {string} */ id) => !only || only.includes(id)).filter((/** @type {string} */ id) => {
    const r = loadRecord(id);
    return !r || !SETTLED.has(r.status);
  });
  if (todo.length === 0) return console.log("処理する会社がありません（キューが空、またはすべて確認待ち・保留・登録済み）。status で一覧を見る");
  console.log(`実行: ${Math.min(todo.length, limit)} 社 / キュー ${todo.length} 社（executor: ${mode}${mode === "claude-cli" ? `、1回あたり上限 $${flag("budget", "3")}、合計上限 $${totalBudget}` : "：AI の作業は注文書に書き出す"}）`);

  // The total budget is for THIS run: what earlier runs spent does not count against it.
  const spentBefore = allRecords().reduce((s, r) => s + (r.cost?.usd ?? 0), 0);
  let spent = 0;
  let n = 0;
  for (const id of todo) {
    if (n >= limit) break;
    n += 1;
    const t0 = Date.now();
    try {
      const rec = await processCompany(id, deps);
      spent += 0;
      console.log(`  ${id}: ${rec.status}${rec.holds.length ? `（${rec.holds.map((/** @type {any} */ h) => h.kind).join(", ")}）` : ""} ${Math.round((Date.now() - t0) / 1000)}秒 モデル${rec.cost.calls}回 $${rec.cost.usd.toFixed(2)}`);
      spent = allRecords().reduce((s, r) => s + (r.cost?.usd ?? 0), 0) - spentBefore;
      if (mode === "claude-cli" && spent >= totalBudget) return console.log(`合計の上限 $${totalBudget} に達したので止めます（status で確認）`);
    } catch (/** @type {any} */ e) {
      if (e instanceof PauseRun) {
        console.log(`  ${id}: 一時停止（${e.record.pause?.kind}${e.record.pause?.hint ? `: ${e.record.pause.hint}` : ""}）。キュー全体を止めます。解けたら同じコマンドで再開（終わった工程はやり直さない）`);
        return;
      }
      // Anything unexpected is recorded against this company and the queue moves on: one company never stops the others.
      const rec = loadRecord(id) ?? { id };
      const msg = scrubSecrets(String(e?.stack ?? e).slice(0, 500));
      console.log(`  ${id}: 想定外のエラー — ${msg.split("\n")[0]}`);
      const r = { ...rec, errors: [...(rec.errors ?? []), { at: now(), step: "internal", kind: "internal", message: msg }], holds: [...(rec.holds ?? []), { kind: "internal-error", reason: msg.split("\n")[0] }], status: "held", updatedAt: now() };
      if (rec.id) saveRecord(r);
      event(id, "error", { step: "internal", message: msg.split("\n")[0] });
    }
  }
  status();
}

// ---------------------------------------------------------------------------------------- status
function status() {
  const records = allRecords();
  const t = tally(records);
  console.log(`\n登録キュー: ${loadQueue().items.length} 社 ／ ${Object.entries(t).map(([k, v]) => `${k} ${v}`).join("、") || "記録なし"}`);
  const list = operatorList(records);
  if (list.length === 0) console.log("あなたの確認が必要なものはありません。");
  else {
    console.log("\nあなたが確認するもの（上から順に）:");
    for (const r of list) console.log(`  [${r.status}] ${r.id}${r.why ? ` — ${r.why}` : ""}\n      → ${r.next}`);
  }
  const report = flag("refresh-report");
  if (report && existsSync(report)) {
    // The other lane: registered companies whose newest 有報 is newer than their figures (refresh-financials, detected daily).
    const j = readJson(report, null);
    const c = j?.counts;
    if (c) {
      console.log(`\n登録済み企業の財務更新（別の経路。${j.date} の検知）: 新しい有報あり ${c.withNewFiling} 社 ／ 更新できる ${c.wouldUpdate + c.updated} ／ 保留 ${c.held} ／ 失敗 ${c.failed}`);
      for (const o of (j.outcomes ?? []).filter((/** @type {any} */ x) => ["held", "failed"].includes(x.result)).slice(0, 8)) console.log(`  [${o.result}] ${o.id}: ${o.detail}`);
      console.log("  → 更新できるものは npm run content:refresh-financials -- <id> --apply（差分を見てから commit）");
    } else console.log("\n登録済み企業の財務更新: 報告の形式が読めません");
  } else console.log("\n登録済み企業の財務更新は別の経路です（GitHub Actions の refresh-report → npm run content:refresh-financials）。--refresh-report <file> で一覧に出せます。");
  const stamp = readJson(join(dir, "last-check.json"), null);
  const since = records.filter((r) => r.status === "registered" && (!stamp || (r.approval?.at ?? "") > stamp.at)).length;
  console.log(`content:check: ${stamp ? `最終 ${stamp.at}（${stamp.ok ? "合格" : "不合格"}）` : "未実施"} ／ 最後の実施以降に登録した会社 ${since} 社${since >= 5 ? " → check を実行" : ""}`);
  if (has("json")) console.log(JSON.stringify({ tally: t, operator: list }, null, 2));
}

// ---------------------------------------------------------------------------------------- approve
async function approve() {
  const id = positional[0];
  if (!id) return usage();
  const rec = loadRecord(id);
  const staged = join(root, "pipeline/staging", `${id}.json`);
  const stagedText = existsSync(staged) ? readFileSync(staged, "utf8") : null;
  const hash = stagedText === null ? null : hashOf(stagedText);
  const existing = join(root, "src/data/companies", `${id}.json`);
  const problems = approvalProblems({
    record: rec,
    confirmed: has("confirm"),
    typedHash: flag("hash"),
    stagedHash: hash,
    policyErrors: stagedText === null ? 0 : errorsOf(scoped(id, policyFindings(JSON.parse(stagedText), { root }))).length,
    entryTier: existsSync(existing) ? (JSON.parse(readFileSync(existing, "utf8")).status?.state ?? "published") : null,
    update: rec?.mode === "update",
  });
  if (problems.length > 0) {
    if (rec?.status === "registered") return console.log(`${id}: すでに登録済みです（${rec.approval?.at}）。何もしません`);
    return fatal(`${id}: 承認できません\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  }
  const before = existsSync(existing) ? JSON.parse(readFileSync(existing, "utf8")) : {};
  const fields = changedFields(before, JSON.parse(/** @type {string} */ (stagedText))).filter((f) => layerOf(f) === "detail");
  const approval = approvalFor({ id: flag("approver"), root, at: now(), reviewHash: hash, fields, basis: flag("basis") });
  const approver = approval.approver;
  const proxy = approver.kind === "agent";
  if (proxy) console.log(`AI エージェントの実行として記録します（${approver.name}、${approval.onBehalfOf?.name} の権限で。正式な承認ではない）`);
  event(id, "approve", { hash, approver: approver.id, ...(proxy ? { onBehalfOf: approval.onBehalfOf?.id } : {}) });
  const r = await runNode(nodeArgs(["scripts/pipeline/advance.mjs", id, "--register", ...(rec.mode === "update" ? ["--update"] : [])]), { ...process.env, REGISTRATION_APPROVAL: JSON.stringify(approval) });
  console.log(r.out.trim());
  if (!/^registered\s*$/m.test(r.out)) {
    rec.holds.push({ kind: "register-failed", reason: r.out.replace(/\s+/g, " ").slice(-300) });
    Object.assign(rec, { status: "held", step: "register", updatedAt: now() });
    saveRecord(rec);
    event(id, "held", { kind: "register-failed" });
    return fatal(`${id}: 登録に失敗しました。ファイルは元に戻っています（finalize の仕様）。status を見てください`);
  }
  Object.assign(rec, { status: "registered", step: "registered", approval: { at: approval.approvedAt, hash, approver: approver.id, ...(proxy ? { proxy: true } : {}) }, updatedAt: now() });
  saveRecord(rec);
  release(id);
  event(id, "registered", { hash });
  console.log(`${id}: 登録しました。コミットは人が行います。内容の確認: npm run content:diff`);
}

// ---------------------------------------------------------------------------------------- update
/**
 * A registered company whose newest 有報 is newer than its explanation: start-update.mjs compares the two filings and,
 * when something changed, sets the company up so that only those stages are rewritten. From there it is an ordinary
 * queue item (run → review sheet with before/after → approve). Nothing is rewritten when nothing changed enough.
 */
async function startUpdate() {
  const id = positional[0];
  if (!id) return usage();
  const rec = loadRecord(id);
  // An update that is waiting for a person (or held) may be re-planned; one that is being worked on may not.
  const replanning = rec?.mode === "update" && ["ready", "ready-with-flags", "held", "queued"].includes(rec.status);
  if (rec && !replanning && !["registered", "discarded"].includes(rec.status)) return fatal(`${id}: autopilot の処理中です（${rec.status}）。終わってから update する`);
  const r = await runNode(nodeArgs(["scripts/pipeline/start-update.mjs", id, ...(has("plan") ? [] : ["--apply"])]));
  const last = r.out.trim().split("\n").filter((l) => l.startsWith("{")).pop();
  const plan = last ? JSON.parse(last) : null;
  console.log(r.out.split("\n").filter((l) => !l.startsWith("{")).join("\n").trim());
  if (r.code !== 0 || !plan) return fatal(`${id}: 更新の準備に失敗しました\n${r.out.slice(-600)}`);
  if (plan.kind === "replanned") {
    Object.assign(rec, { status: "queued", step: "prechecked", holds: [], review: null, awaiting: null, pause: null, update: { ...rec.update, stages: plan.rewrite, retainedStages: plan.retainedStages }, updatedAt: now() });
    saveRecord(rec);
    event(id, "update-replanned", { added: plan.added, stages: plan.rewrite });
    return console.log(`${id}: 更新の範囲を広げました。追加: ${plan.added.join("・") || "なし"}（書き直す: ${plan.rewrite.join("・")}、公開中のまま: ${plan.retainedStages.join("・")}）。run で続ける`);
  }
  if (replanning) return fatal(`${id}: 更新の途中ですが、新しい計画を立てられませんでした（${plan.kind}${plan.detail ? `: ${plan.detail}` : ""}）`);
  if (plan.kind !== "started") {
    event(id, "update-skipped", { kind: plan.kind });
    return console.log(`${id}: ${plan.kind}${plan.detail ? ` — ${plan.detail}` : ""}${plan.kind === "planned" ? "（--plan のため何も変えていない）" : ""}`);
  }
  // The registration's record is kept beside the runs; this update is a new run of the same company.
  if (rec) renameSync(runPath(id), join(sub("archive"), `${id}-run-${Date.now()}.json`));
  saveRecord({ ...newRecord(id), mode: "update", update: { stages: plan.rewrite, oldDoc: plan.oldDoc, newDoc: plan.newDoc, retainedStages: plan.retainedStages } });
  const queue = loadQueue();
  if (!queue.items.some((/** @type {any} */ i) => i.id === id)) {
    enqueue(queue, [id], now(), "update");
    writeJson(queuePath, queue);
  }
  event(id, "update-started", { oldDoc: plan.oldDoc, newDoc: plan.newDoc, stages: plan.rewrite });
  console.log(`${id}: ${plan.oldDoc} → ${plan.newDoc}。書き直す工程: ${plan.rewrite.join("・")}（公開中のまま: ${plan.retainedStages.join("・")}）。run で続ける`);
}

// ---------------------------------------------------------------------------------------- retry / redo / discard / ack
async function fixups() {
  const id = positional[0];
  if (!id) return usage();
  const rec = loadRecord(id) ?? null;
  if (!rec && command !== "ack") return fatal(`${id}: autopilot の記録がありません`);
  if (command === "ack") {
    const r = await runNode(nodeArgs(["scripts/pipeline/advance.mjs", id, "--ack-post-filing"]));
    event(id, "ack-post-filing");
    return console.log(r.out.trim());
  }
  if (command === "discard") {
    Object.assign(rec, { status: "discarded", updatedAt: now() });
    saveRecord(rec);
    const queue = loadQueue();
    queue.items = queue.items.filter((/** @type {any} */ i) => i.id !== id);
    writeJson(queuePath, queue);
    release(id);
    event(id, "discard");
    return console.log(`${id}: キューから外しました（成果物は pipeline/results に残っています）`);
  }
  if (command === "redo") {
    const group = positional[1];
    if (group !== "group1" && group !== "group2") return fatal("redo <id> group1|group2");
    const archive = join(sub("archive"), `${id}-${group}-${Date.now()}`);
    mkdirSync(archive, { recursive: true });
    // In an update only the rewritten stages are redone; the kept ones are the published text and stay.
    const stages = rec.mode === "update" ? GROUP_FILES[group].filter((s) => rec.update.stages.includes(s)) : GROUP_FILES[group];
    for (const s of stages) {
      if (existsSync(fragmentPath(id, s))) renameSync(fragmentPath(id, s), join(archive, `${id}-${s}.json`));
      // The state would still say "completed" and advance would go straight to finalize with the fragment missing.
      setStage(id, s, "pending", `redo: 成果物を ${archive} に退避`);
    }
    rec.attempts[group === "group1" ? "agent1" : "agent2"] = 0;
    rec.attempts[group === "group1" ? "repair1" : "repair2"] = 0;
    event(id, "redo", { group, archive });
    console.log(`${id}: ${group} の成果物を ${archive} に退避しました。書き直しを依頼します`);
  } else event(id, "retry");
  const queue = loadQueue();
  if (!queue.items.some((/** @type {any} */ i) => i.id === id)) {
    enqueue(queue, [id]);
    writeJson(queuePath, queue);
  }
  Object.assign(rec, { status: "queued", step: "prechecked", holds: [], pause: null, awaiting: null, review: null, updatedAt: now() });
  // A person asked for another go: every attempt counter starts again (the cost and the history stay).
  if (command === "retry") rec.attempts = Object.fromEntries(Object.keys(rec.attempts).map((k) => [k, 0]));
  saveRecord(rec);
  console.log(`${id}: 保留を解きました。run で続きから処理します（終わった工程はやり直しません）`);
}

// ---------------------------------------------------------------------------------------- content check
async function contentCheck() {
  const steps = [
    ["整合性テスト", ["node_modules/vitest/vitest.mjs", "run", "tests/data-integrity.test.ts"]],
    ["型検査", ["node_modules/typescript/lib/tsc.js", "--noEmit"]],
    ["lint", ["node_modules/eslint/bin/eslint.js", "src", "tests", "scripts"]],
  ];
  let ok = true;
  for (const [label, rest] of /** @type {[string, string[]][]} */ (steps)) {
    const r = await runNode(rest);
    console.log(`  ${label}: ${r.code === 0 ? "合格" : "不合格"}`);
    if (r.code !== 0) {
      ok = false;
      console.log(r.out.split("\n").slice(-20).join("\n"));
      break;
    }
  }
  writeJson(join(dir, "last-check.json"), { at: now(), ok });
  event("-", "content-check", { ok });
  process.exit(ok ? 0 : 1);
}

function fatal(/** @type {string} */ message) {
  console.error(message);
  process.exit(1);
}

if (process.argv[1]?.endsWith("autopilot.mjs")) {
  main().catch((e) => {
    console.error(scrubSecrets(String(e?.stack ?? e)));
    process.exit(1);
  });
}
