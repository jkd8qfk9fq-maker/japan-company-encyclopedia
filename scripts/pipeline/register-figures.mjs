/**
 * Register many companies at the figures-only tier in one pass.
 *
 *   node scripts/pipeline/register-figures.mjs --limit 100 [--register]
 *
 * `finalize.mjs --figures-only` does one company and runs the whole test suite
 * for it. That is right for an entry someone wrote, and wrong for 3,900: the
 * suite takes about ten seconds, which alone would be eleven hours.
 *
 * So the checks are batched, not skipped. Every entry is staged and put through
 * the schema and the integrity rules in a single vitest pass over the staging
 * directory; every entry's figures are re-verified against the filing's own XBRL
 * individually, because that check is per-company by nature and costs no startup.
 * Only then are the files written, and the full repository suite and tsc run once
 * over the result. If anything fails, the whole batch is put back.
 *
 * All-or-nothing per batch is deliberate. A partial write would leave the index,
 * the revisions and the entries disagreeing, and the next run would have to
 * reason about a half-registered state — which is exactly the situation §27 says
 * never to create.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadState, reapDeadReservations, release, reserve, saveState, setStage } from "./company-state.mjs";
import { packProblem, readPack, rebuildPack } from "./pack.mjs";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const limit = Number(arg("limit", "50"));
const write = process.argv.includes("--register");
// --ids a,b,c: only these companies (a pilot, or a retry of ones a person fixed).
const onlyIds = arg("ids", null) ? new Set(arg("ids", "").split(",").map((x) => x.trim()).filter(Boolean)) : null;

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const stagingDir = join(root, "pipeline/staging");
const companiesDir = join(root, "src/data/companies");
const indexPath = join(companiesDir, "index.ts");

const VITEST = "node_modules/vitest/vitest.mjs";
const TSC = "node_modules/typescript/lib/tsc.js";
const run = (args, env = {}) => execFileSync(process.execPath, args, { cwd: root, encoding: "utf8", env: { ...process.env, ...env } });

// ------------------------------------------------------------------ which companies
const published = new Set(
  readdirSync(companiesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, "")),
);

/**
 * A company is ready when the mechanical stages finished and nothing has been
 * written for it. One that has agent fragments is left alone: it is on its way to
 * a full entry, and registering it as figures-only would have to be undone.
 */
const resultsDir = join(root, "pipeline/results");
const hasFragments = existsSync(resultsDir)
  ? new Set(readdirSync(resultsDir).map((f) => f.replace(/-[a-zA-Z]+\.json$/, "")))
  : new Set();

/**
 * Companies a researcher is working on right now.
 *
 * A fragment on disk only protects a company the agent has already reached. A
 * bulk run and a researcher overlapped once, and this batch registered 富士電機 as
 * figures-only while its five segments and ten history events were still being
 * written — the entry then could not be created, because one already existed.
 * Whoever dispatches an agent writes the ids here first; the file is local
 * working state, like the rest of pipeline/.
 */
// A previous run that was killed leaves its reservations behind; release the ones whose process is gone.
const reaped = reapDeadReservations();
if (reaped.length > 0) console.log(`死んだプロセスの予約を ${reaped.length} 件解放しました`);

const reservedPath = join(root, "pipeline/reserved.tsv");
const reserved = existsSync(reservedPath)
  ? new Set(
      readFileSync(reservedPath, "utf8")
        .split(/\r?\n/)
        .map((l) => l.split("\t")[0].trim())
        .filter((l) => l && !l.startsWith("#")),
    )
  : new Set();

const ready = readdirSync(join(root, "pipeline/state"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .filter((id) => !published.has(id) && !hasFragments.has(id) && !reserved.has(id))
  .filter((id) => {
    const state = loadState(id);
    if (state.stages.registration.status === "needs-review") return false;
    // The pack itself is not required to be on disk: it lives in the cache, which does not
    // survive every session, and a missing or stale one is rebuilt below before anything is staged.
    return state.stages.edinet.status === "completed" && Boolean(state.identity?.docID && state.identity?.code);
  })
  .filter((id) => !onlyIds || onlyIds.has(id))
  .sort()
  .slice(0, limit);

if (ready.length === 0) {
  console.log("登録できる会社がありません（edinet 工程が完了し、まだ何も書かれていない会社が対象です）");
  process.exit(0);
}

// ---------------------------------------------------------------- hold, refresh, screen
// Hold every company for the length of the run, so the queue cannot hand one to an agent
// that this batch is about to register. A company someone else already holds is left out.
const held = [];
process.on("exit", () => {
  for (const id of held) release(id);
});
for (const id of [...ready]) {
  if (reserve(id, `register-figures:${process.pid}`)) held.push(id);
  else ready.splice(ready.indexOf(id), 1);
}

/**
 * A pack built by an older extractor is rebuilt before it is registered from — this is what
 * carries an extractor fix (the employee counts, the filing of record) to every company not yet
 * registered. And a latest 訂正 that lacks what the pack needs is NOT adopted: the original
 * would be registered under a correction nobody has read, so the company is parked for a person.
 */
const unfit = [];
for (const id of [...ready]) {
  const identity = loadState(id).identity ?? {};
  try {
    if (packProblem(readPack(id), identity)) rebuildPack(id, identity);
    const pack = readPack(id);
    const problem = packProblem(pack, identity);
    if (problem) throw new Error(`証拠パックを使えない（${problem}）`);
    if (pack.fiscalYearChange) {
      // The pack dated the early columns by counting whole years back from the current year end,
      // and the filing prints different months. Registering it would publish a year-end that never existed.
      const why = `決算期の変更: 有報の決算年月 ${pack.fiscalYearChange.printed.join("・")} に対しパックは ${pack.fiscalYearChange.assumed.join("・")}。年度ラベルと変則決算の期間を人が直してから登録すること`;
      setStage(id, "registration", "needs-review", why);
      unfit.push({ id, reason: `needs-attention: ${why}` });
      ready.splice(ready.indexOf(id), 1);
    } else if ((pack.irregularPeriods ?? []).length > 0) {
      // A transition period after a change of year end is real data over a different span; shown as a
      // plain year it misleads, and only a person can write the note that says how long it was.
      const why = `変則決算: ${pack.irregularPeriods.map((x) => `${x.yearEnd} の期は ${x.months} か月`).join("、")}。financials の note にその旨を書いてから登録すること`;
      setStage(id, "registration", "needs-review", why);
      unfit.push({ id, reason: `needs-attention: ${why}` });
      ready.splice(ready.indexOf(id), 1);
    } else if (pack.amendments?.status === "incomplete") {
      const why = `最新の訂正 ${pack.amendments.blockedBy} に ${(pack.amendments.missing ?? []).join("・")} が無く採用できない。原本のまま登録してよいか人が判断すること`;
      setStage(id, "registration", "needs-review", `訂正有価証券報告書: ${why}`);
      unfit.push({ id, reason: `needs-attention: ${why}` });
      ready.splice(ready.indexOf(id), 1);
    }
  } catch (error) {
    unfit.push({ id, reason: `証拠パックの準備に失敗: ${String(error.message).split("\n")[0].slice(0, 120)}` });
    ready.splice(ready.indexOf(id), 1);
  }
}
for (const u of unfit) console.log(`  SKIP ${u.id} — ${u.reason}`);
if (ready.length === 0) {
  console.log("登録できる会社が残りませんでした");
  process.exit(unfit.length > 0 ? 1 : 0);
}

// ------------------------------------------------------------------ build and stage
rmSync(stagingDir, { recursive: true, force: true });
mkdirSync(stagingDir, { recursive: true });

let staged = [];
const skipped = [];
for (const id of ready) {
  try {
    const out = run(["scripts/pipeline/finalize.mjs", id, "--figures-only", "--stage-only"]);
    if (!existsSync(join(stagingDir, `${id}.json`))) throw new Error(out.trim().split("\n").at(-1) ?? "staged file missing");
    staged.push(id);
  } catch (error) {
    const child = `${error.stdout ?? ""}${error.stderr ?? ""}`.split("\n").find((l) => l.trim()) ?? error.message;
    const reason = child.replace(/\s+/g, " ").slice(0, 160);
    // A company whose 上場金融商品取引所名 reads 非上場 files an 有報 without having
    // listed shares — it has public bonds, or enough shareholders to oblige it, or
    // was listed once. It can have no `listings`, and this is an encyclopedia of
    // listed companies, so it is parked rather than retried. 139 of them were being
    // re-attempted and re-reported in every single batch.
    if (/非上場|上場金融商品取引所名「」|上場金融商品取引所名「該当ありません/.test(reason)) {
      setStage(id, "registration", "needs-review", `上場していないため数値のみの層にも載せられない: ${reason}`);
    }
    skipped.push({ id, reason });
  }
}
console.log(`組み立て: ${staged.length} 社${skipped.length > 0 ? ` / 見送り ${skipped.length} 社` : ""}`);
for (const s of skipped) console.log(`  SKIP ${s.id} — ${s.reason}`);
if (staged.length === 0) process.exit(1);

// --------------------------------------------------------------------- batch checks
// Per company, because it is per company by nature and costs no vitest startup:
// does every figure still equal what EDINET tagged? The draft came from the same
// pack, so this is close to a tautology — but it is what would notice a draft
// left behind by an older version of the extractor.
const mismatched = [];
for (const id of staged) {
  try {
    run(["scripts/research/verify-financials.mjs", id, "--entry", `pipeline/staging/${id}.json`]);
  } catch (error) {
    const detail = `${error.stdout ?? ""}${error.stderr ?? ""}`
      .split("\n")
      .filter((l) => l.includes("≠") || l.includes("不一致") || l.includes("見当たりません"))
      .join(" ")
      .slice(0, 200);
    mismatched.push(`${id}: ${detail || "verify-financials が失敗"}`);
  }
}
// A company that fails is dropped from this batch, not made to block it. Its id
// stays unregistered, so the next run retries it for free once whatever the
// verifier objected to is fixed — and one unreadable label should not hold up a
// hundred and forty-six sound entries.
if (mismatched.length > 0) {
  console.log(`\n数値が有報のXBRLと一致しないため、この回は見送る ${mismatched.length} 社:`);
  for (const m of mismatched) console.log(`  - ${m}`);
  const failing = new Set(mismatched.map((m) => m.split(":")[0]));
  for (const id of failing) rmSync(join(stagingDir, `${id}.json`), { force: true });
  staged = staged.filter((id) => !failing.has(id));
  if (staged.length === 0) {
    console.error("登録できる会社が残りませんでした");
    process.exit(1);
  }
}
console.log(`数値の照合: ${staged.length} 社が一致`);

try {
  run([VITEST, "run", "tests/validate-file.test.ts"], { CONTENT_DIR: "pipeline/staging" });
  console.log("スキーマ・整合性ルール: OK");
} catch (error) {
  console.error(`${error.stdout ?? ""}${error.stderr ?? ""}`.slice(-4000));
  console.error("\nスキーマまたは整合性ルールに違反している会社があります。登録しません");
  process.exit(1);
}

if (!write) {
  console.log(`\n--register を付けると ${staged.length} 社を登録します`);
  process.exit(0);
}

// ------------------------------------------------------------------------ register
// A JavaScript identifier cannot start with a digit, and securities codes reach
// the id through the English name: 「4Cs HD」 gave the import name 4csHd, which is
// a parse error that took down a whole 148-company batch. The prefix is only
// about the local binding; the id, the file name and the URL are untouched.
const camel = (id) => {
  const name = id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  return /^[0-9]/.test(name) ? `c${name}` : name;
};
const keyFor = (id) => (/^[a-z][a-zA-Z0-9]*$/.test(camel(id)) && !id.includes("-") ? id : `"${id}"`);

const indexBefore = readFileSync(indexPath, "utf8");
const written = [];
const revert = () => {
  for (const p of written) rmSync(p, { force: true });
  writeFileSync(indexPath, indexBefore);
};

try {
  let index = indexBefore;
  for (const id of staged) {
    const entry = JSON.parse(readFileSync(join(stagingDir, `${id}.json`), "utf8"));
    const entryPath = join(companiesDir, `${id}.json`);
    if (existsSync(entryPath)) throw new Error(`${id}: 既存エントリーがあります`);
    writeFileSync(entryPath, `${JSON.stringify(entry, null, 2)}\n`);
    written.push(entryPath);

    const identity = loadState(id).identity ?? {};
    const revisionId = `${today}-company-${id}-initial`;
    const revisionPath = join(root, "src/data/revisions", `${revisionId}.json`);
    if (existsSync(revisionPath)) throw new Error(`${id}: 改訂記録が既にあります`);
    writeFileSync(
      revisionPath,
      `${JSON.stringify(
        {
          id: revisionId,
          targetType: "company",
          targetId: id,
          changedAt: today,
          reason: "初版（数値のみ）。EDINETの有価証券報告書から機械的に作成し、XBRLと突き合わせた。解説は未作成",
          summary: `${entry.officialName} 有価証券報告書（docID ${identity.docID ?? "不明"}）の5年分の指標を登録パイプラインが登録`,
        },
        null,
        2,
      )}\n`,
    );
    written.push(revisionPath);

    // Import lines are alphabetical; the map is registration order.
    const lines = index.split("\n");
    const isImport = (l) => /^import \w+ from "\.\/[a-z0-9-]+\.json";$/.test(l);
    const fileOf = (l) => l.match(/"\.\/([a-z0-9-]+)\.json"/)[1];
    const importIdx = lines.findIndex((l) => isImport(l) && fileOf(l) > id);
    const lastImport = lines.reduce((acc, l, i) => (isImport(l) ? i : acc), -1);
    lines.splice(importIdx === -1 ? lastImport + 1 : importIdx, 0, `import ${camel(id)} from "./${id}.json";`);
    const closeIdx = lines.findIndex((l) => l.startsWith("}).map("));
    lines.splice(closeIdx, 0, `  ${keyFor(id)}: ${camel(id)},`);
    index = lines.join("\n");
  }
  writeFileSync(indexPath, index);

  run([VITEST, "run", "tests/data-integrity.test.ts"]);
  run([TSC, "--noEmit"]);
} catch (error) {
  revert();
  console.error(`${String(error.message).slice(0, 300)}\n${String(error.stdout ?? "").slice(-3000)}`);
  console.error(`\n登録を取り消しました（${staged.length} 社すべて元に戻しました）`);
  process.exit(1);
}

for (const id of staged) {
  const state = loadState(id);
  state.registeredAt = new Date().toISOString();
  saveState(state);
  for (const stage of ["sourceValidation", "qualityControl"]) setStage(id, stage, "completed", "数値のみの一括登録で検査");
  setStage(id, "registration", "completed", "数値のみで登録（解説は未作成）");
}
rmSync(stagingDir, { recursive: true, force: true });

console.log(`\n登録しました: ${staged.length} 社（状態は figures-only）`);
console.log("コミットは人が行うこと（パイプラインは git を触りません）");
