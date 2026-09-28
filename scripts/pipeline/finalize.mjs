/**
 * The pipeline's last three stages, all deterministic and all free of model tokens:
 * **sourceValidation**, **qualityControl** and **registration**.
 *
 *   node scripts/pipeline/finalize.mjs <company-id>              # gate only
 *   node scripts/pipeline/finalize.mjs <company-id> --register   # gate, then register
 *
 * The assembled entry is written to `pipeline/staging/<id>.json` and gated
 * THERE, not in src/data/companies. That ordering is the point: the spec puts
 * sourceValidation and qualityControl before registration, and an entry with a
 * wrong figure or a missing citation must never exist inside src/data even
 * briefly. Registration is the only step that writes into the repository, and it
 * reverts every file it touched if the suite then fails — so a failed
 * registration leaves the tree exactly as it found it, rather than a
 * half-registered company for the next run to trip over.
 *
 * No git operation happens here (§29). Registration writes files; committing
 * them is a human action.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mergeEntry } from "./merge-fragments.mjs";
import { loadState, saveState, setStage, syncAgentStages } from "./company-state.mjs";

const companyId = process.argv[2];
const register = process.argv.includes("--register");
if (!companyId) {
  console.error("usage: node scripts/pipeline/finalize.mjs <company-id> [--register]");
  process.exit(1);
}

const root = process.cwd();
const entryPath = join(root, "src/data/companies", `${companyId}.json`);
const indexPath = join(root, "src/data/companies/index.ts");
const stagedRelative = `pipeline/staging/${companyId}.json`;
const today = new Date().toISOString().slice(0, 10);

// npx is a .cmd shim on Windows, which execFile cannot launch directly. Naming
// the shim is better than shell: true, which passes the arguments through a shell
// unescaped.
const bin = (cmd) => (cmd === "npx" && process.platform === "win32" ? "npx.cmd" : cmd);
const run = (cmd, args, env = {}) =>
  execFileSync(bin(cmd), args, { cwd: root, encoding: "utf8", env: { ...process.env, ...env } });

/** Every sourceId cited anywhere in the entry, so an uncited source becomes visible. */
function citedSourceIds(entry) {
  const ids = new Set();
  const add = (node) => (node?.sourceIds ?? []).forEach((id) => ids.add(id));
  const walk = (list) => (list ?? []).forEach((b) => (add(b), walk(b.children)));
  walk(entry.businesses);
  add(entry.businessModel);
  for (const list of [entry.financials, entry.history, entry.relatedCompanies]) (list ?? []).forEach(add);
  return ids;
}

// ------------------------------------------------------------- assemble and stage
function stageEntry() {
  // The agents left their fragments on disk without recording anything; do that
  // now, so the state file reflects the work before the gate runs on it.
  syncAgentStages(companyId);
  const merged = mergeEntry(companyId);
  if (merged.missing.length > 0) throw new Error(`工程が未完了です（${merged.missing.join(", ")}）`);
  mkdirSync(join(root, "pipeline/staging"), { recursive: true });
  const path = join(root, stagedRelative);
  writeFileSync(path, `${JSON.stringify(merged.entry, null, 2)}\n`);
  return { ...merged, path };
}

// -------------------------------------------------------- stage: sourceValidation
/**
 * Are the entry's sources the document the figures actually came from?
 *
 * The docID check is the one that earns its keep. The figures are extracted
 * mechanically from one specific EDINET document; an agent citing a different or
 * invented document would produce an entry whose numbers are right and whose
 * provenance is wrong — the single failure the figure verifier cannot see,
 * because it compares the entry against the pack and never looks at the URL.
 */
function sourceValidation(entry) {
  const state = loadState(companyId);
  const problems = [];
  const notes = [];
  const docID = state.identity?.docID;

  if ((entry.sources ?? []).length === 0) problems.push("出典が1つもありません");
  for (const s of entry.sources ?? []) {
    const where = `出典「${s.id}」`;
    if (!/^https:\/\//.test(s.url)) problems.push(`${where}: URL が https:// で始まりません`);
    if (/wikipedia\.org/i.test(s.url)) problems.push(`${where}: Wikipedia は出典にできません`);
    if (!s.accessedAt) problems.push(`${where}: accessedAt がありません`);
    for (const [key, value] of [
      ["accessedAt", s.accessedAt],
      ["publishedAt", s.publishedAt],
    ]) {
      if (value && value > today) problems.push(`${where}: ${key} が未来の日付です（${value}）`);
    }
    const host = s.url.replace(/^https:\/\//, "").split("/")[0];
    if (!/(^|\.)edinet-fsa\.go\.jp$/.test(host)) {
      // Not a refusal: a company's own IR page is a legitimate primary source.
      // But nothing mechanical verified it, so it is surfaced instead of waved
      // through.
      notes.push(`${where}: EDINET 以外のホスト（${host}）。一次資料かどうかは人が確認すること`);
    } else if (docID && !s.url.includes(docID)) {
      problems.push(`${where}: EDINET の URL に docID ${docID} が入っていません（数値を取り出した書類と別の書類を引用しています）`);
    }
  }

  const cited = citedSourceIds(entry);
  const known = new Set((entry.sources ?? []).map((s) => s.id));
  for (const id of cited) if (!known.has(id)) problems.push(`出典「${id}」が引用されていますが出典一覧にありません`);
  for (const id of known) if (!cited.has(id)) notes.push(`出典「${id}」はどこからも引用されていません`);

  // Identity must survive assembly: code and official name come from EDINET's own
  // index, and no agent is allowed to have changed them.
  if (state.identity) {
    if (entry.code !== state.identity.code) {
      problems.push(`証券コード ${entry.code} が identity 工程の ${state.identity.code} と違います`);
    }
    if (entry.officialName !== state.identity.filerName) {
      notes.push(`正式名称「${entry.officialName}」が EDINET の提出者名「${state.identity.filerName}」と違います`);
    }
  }

  let figureReport = "";
  try {
    figureReport = run("node", ["scripts/research/verify-financials.mjs", companyId, "--entry", stagedRelative]);
  } catch (error) {
    figureReport = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    problems.push("数値の照合に失敗しました（verify-financials.mjs の出力を見ること）");
  }

  // The figures in the prose, which verify-financials cannot see: it checks the
  // financials rows against the XBRL tags, and most of the numbers a reader
  // actually reads are inside a sentence an agent wrote.
  try {
    figureReport += run("node", ["scripts/pipeline/check-prose-figures.mjs", companyId, "--entry", stagedRelative]);
  } catch (error) {
    figureReport += `${error.stdout ?? ""}${error.stderr ?? ""}`;
    problems.push("本文中の金額に有報の裏付けがないものがあります（check-prose-figures.mjs の出力を見ること）");
  }
  return { problems, notes, figureReport };
}

// ---------------------------------------------------------- stage: qualityControl
/** Schema + the shared integrity rules, on the staged file, through the existing test. */
function qualityControl() {
  try {
    return { ok: true, output: run("npx", ["vitest", "run", "tests/validate-file.test.ts"], { CONTENT_FILE: stagedRelative }) };
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

// ------------------------------------------------------------ stage: registration
const camel = (id) => id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const keyFor = (id) => (id.includes("-") ? `"${id}"` : id);

/**
 * Insert the import alphabetically and append the map entry, leaving every other
 * byte of index.ts untouched. The map is in registration order, not alphabetical:
 * `companies` is the reading order of the site, so a new company goes last.
 */
function addToIndex(source) {
  const lines = source.split("\n");
  const isImport = (l) => /^import \w+ from "\.\/[a-z0-9-]+\.json";$/.test(l);
  const fileOf = (l) => l.match(/"\.\/([a-z0-9-]+)\.json"/)[1];
  const importIdx = lines.findIndex((l) => isImport(l) && fileOf(l) > companyId);
  const lastImport = lines.reduce((acc, l, i) => (isImport(l) ? i : acc), -1);
  if (lastImport === -1) throw new Error("index.ts に import 行が見つかりません");
  lines.splice(importIdx === -1 ? lastImport + 1 : importIdx, 0, `import ${camel(companyId)} from "./${companyId}.json";`);

  const closeIdx = lines.findIndex((l) => l.startsWith("}).map("));
  if (closeIdx === -1) throw new Error("index.ts の末尾（}).map(…）が見つかりません");
  lines.splice(closeIdx, 0, `  ${keyFor(companyId)}: ${camel(companyId)},`);
  return lines.join("\n");
}

/**
 * The research log for a pipeline-built company.
 *
 * Deliberately not an imitation of the hand-written logs in docs/research/: it
 * records what the pipeline actually knows — which document, which stage did
 * what, and every warning each agent raised. Those warnings are the substantive
 * part, because they are where an agent says what the filing did not support.
 */
function researchLog(entry, validation, merged) {
  const state = loadState(companyId);
  const id = state.identity ?? {};
  const cell = (s) => String(s ?? "").replace(/\|/g, "\\|");
  const stageLines = Object.entries(state.stages)
    .map(([stage, s]) => `| ${stage} | ${s.status} | ${s.attempts ?? 0} | ${cell(s.note)} |`)
    .join("\n");
  const list = (items) => (items.length === 0 ? "なし。" : items.map((w) => `- ${w}`).join("\n"));

  return `# ${entry.name ?? entry.officialName} — research log

Registered: ${today}（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（\`scripts/research/evidence-pack.mjs\`）、
\`scripts/research/verify-financials.mjs\` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ${cell(id.filerName)} |
| 証券コード | ${cell(id.code)} |
| docID | \`${cell(id.docID)}\` |
| 提出日 | ${cell(id.submitted)} |
| 決算期 | ${cell(id.periodEnd)} |
| 訂正報告書 | ${(id.corrections ?? []).length === 0 ? "なし" : id.corrections.join(", ")} |

entry の \`sources\`: ${(entry.sources ?? []).map((s) => `\`${s.id}\` ${s.url}`).join(" / ") || "なし"}

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
${stageLines}

## 数値の照合（verify-financials.mjs）

\`\`\`
${validation.figureReport.trim()}
\`\`\`

## 出典の検証

${list(validation.notes)}

## エージェントの判断記録（fragment warnings）

${list(merged.warnings)}

## 要確認（status に反映）

${list(merged.needsReview)}
`;
}

function registration(entry, validation, merged) {
  if (existsSync(entryPath)) throw new Error("既存エントリーがあるため上書きしません");
  const logPath = join(root, "docs/research", `${companyId}.md`);
  const revisionId = `${today}-company-${companyId}-initial`;
  const revisionPath = join(root, "src/data/revisions", `${revisionId}.json`);
  if (existsSync(revisionPath)) throw new Error(`改訂記録 ${revisionId}.json が既にあります`);
  if (existsSync(logPath)) throw new Error(`リサーチログ docs/research/${companyId}.md が既にあります`);

  const indexBefore = readFileSync(indexPath, "utf8");
  const written = [];
  const revert = () => {
    for (const p of written) rmSync(p, { force: true });
    writeFileSync(indexPath, indexBefore);
  };

  try {
    writeFileSync(entryPath, `${JSON.stringify(entry, null, 2)}\n`);
    written.push(entryPath);

    const id = loadState(companyId).identity ?? {};
    const revision = {
      id: revisionId,
      targetType: "company",
      targetId: companyId,
      changedAt: today,
      reason: "初版。登録パイプラインが EDINET の一次資料から作成し、リサーチログに根拠を記録した",
      summary: `${entry.officialName} 有価証券報告書（docID ${id.docID ?? "不明"}、提出 ${id.submitted ?? "不明"}）に基づき登録パイプラインが作成`,
    };
    writeFileSync(revisionPath, `${JSON.stringify(revision, null, 2)}\n`);
    written.push(revisionPath);

    writeFileSync(logPath, researchLog(entry, validation, merged));
    written.push(logPath);

    writeFileSync(indexPath, addToIndex(indexBefore));

    // The gate. The whole-repository integrity suite is what catches anything
    // that only breaks in the presence of the other entries: a duplicate id, an
    // industry page that does not list the company back, a revision pointing at
    // nothing.
    run("npx", ["vitest", "run", "tests/data-integrity.test.ts"]);
    run("npx", ["tsc", "--noEmit"]);
  } catch (error) {
    revert();
    throw new Error(
      `登録を取り消しました（ファイルは元に戻しました）: ${String(error.message).slice(0, 200)}\n${String(error.stdout ?? "").slice(-3000)}`,
    );
  }
}

// --------------------------------------------------------------------------- main
let merged;
try {
  merged = stageEntry();
} catch (error) {
  setStage(companyId, "sourceValidation", "failed", String(error.message));
  console.error(`${companyId}: ${error.message}`);
  process.exit(1);
}
console.log(`${companyId}: ${stagedRelative} に組み立てました（fragments ${merged.fragments}/${merged.stageCount}）`);

setStage(companyId, "sourceValidation", "running");
const validation = sourceValidation(merged.entry);
for (const n of validation.notes) console.log(`  注意: ${n}`);
if (validation.problems.length > 0) {
  for (const p of validation.problems) console.error(`  不備: ${p}`);
  console.error(validation.figureReport);
  setStage(companyId, "sourceValidation", "failed", validation.problems.join(" / "));
  process.exit(1);
}
setStage(companyId, "sourceValidation", "completed", `出典 ${merged.entry.sources.length} 件・数値照合OK（注意 ${validation.notes.length} 件）`);
console.log("  sourceValidation: OK");

setStage(companyId, "qualityControl", "running");
const quality = qualityControl();
if (!quality.ok) {
  console.error(quality.output.slice(-4000));
  setStage(companyId, "qualityControl", "failed", "スキーマまたは整合性ルールに違反（validate-file の出力を見ること）");
  process.exit(1);
}
setStage(companyId, "qualityControl", "completed", "スキーマ・整合性ルールともOK");
console.log("  qualityControl: OK");

if (!register) {
  console.log(`\n--register を付けると登録します（src/data/companies/${companyId}.json、index.ts、改訂記録、リサーチログ）`);
  process.exit(0);
}

setStage(companyId, "registration", "running");
try {
  registration(merged.entry, validation, merged);
} catch (error) {
  setStage(companyId, "registration", "failed", String(error.message).slice(0, 300));
  console.error(error.message);
  process.exit(1);
}
const state = loadState(companyId);
state.registeredAt = new Date().toISOString();
saveState(state);
setStage(companyId, "registration", "completed", `登録済み（状態 ${merged.entry.status.state}）`);
rmSync(merged.path, { force: true });
console.log("  registration: OK — 統合テストと型チェックを通過");
console.log(`\n登録しました: src/data/companies/${companyId}.json / docs/research/${companyId}.md / 改訂記録 / index.ts`);
console.log("コミットは人が行うこと（パイプラインは git を触りません）");
