/**
 * Apply a company's 訂正有価証券報告書 to its registered entry — one company, on request.
 *
 *   node scripts/pipeline/apply-amendment.mjs <company-id>                    dry run: show what would change, run the gates, write nothing
 *   node scripts/pipeline/apply-amendment.mjs <company-id> --apply            write the entry, a Revision and the state
 *   node scripts/pipeline/apply-amendment.mjs <company-id> --apply --flag-text   also mark a published entry needs-attention if the corrected text differs
 *
 * A correction that exists is not a reason to rewrite anything. The entry changes only when
 * the filing of record prints DIFFERENT five-year figures from the original the entry was
 * built from — then `financials` is re-read from the filing of record, the source the
 * figures cite follows it, and a Revision records the old and new values. If the figures are
 * the same it records that the check was made (in the pipeline state) and touches nothing
 * else, and no Revision is written.
 *
 * It refuses when the registered values do not agree with the ORIGINAL filing either: that
 * entry predates a better extractor, which is a different problem from an amendment and
 * must not be repaired under its name.
 *
 * Text is never rewritten. `--flag-text` only sets `needs-attention` (with the sections
 * that changed) on a published entry, because its prose may quote what the correction
 * replaced — yamaha-motor's regional revenue, restated in 2026-08 with every total unchanged.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { amendmentIdentity, diffTextBlocks, entryMismatches, financialsDifferences } from "../research/amendments.mjs";
import { cacheDir, downloadDocument, jstToday, readCsvRows } from "../research/edinet.mjs";
import { PROSE_ELEMENTS, fiveYearFigures, packFor } from "../research/evidence-pack.mjs";
import { loadState, saveState } from "./company-state.mjs";
import { assertMachineWrite } from "./ownership.mjs";

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
const apply = args.includes("--apply");
const flagText = args.includes("--flag-text");
if (!id) {
  console.error("usage: node scripts/pipeline/apply-amendment.mjs <company-id> [--apply] [--flag-text]");
  process.exit(1);
}

const root = process.cwd();
// The pipeline's one clock for dates: the date in Japan (finalize.mjs, refresh-financials.mjs).
const today = jstToday();
const entryPath = join(root, "src/data/companies", `${id}.json`);
const stagedRelative = `pipeline/staging/${id}.json`;
const stagedPath = join(root, stagedRelative);
const VITEST = "node_modules/vitest/vitest.mjs";
const run = (/** @type {string[]} */ a, env = {}) => execFileSync(process.execPath, a, { cwd: root, encoding: "utf8", env: { ...process.env, ...env } });
const fail = (/** @type {string} */ message, code = 1) => {
  console.error(message);
  process.exit(code);
};
const yen = (/** @type {any} */ v) => (typeof v === "number" ? `${(v / 1000).toLocaleString("ja-JP")}千円` : String(v));

if (!existsSync(entryPath)) fail(`${id}: 登録済みエントリーがありません。未登録の会社は、登録（finalize）の時点で有効文書から作られます`);
const entry = JSON.parse(readFileSync(entryPath, "utf8"));
const stateBefore = loadState(id);
const identity = stateBefore.identity;
if (!identity?.docID || !identity?.code) fail(`${id}: pipeline/state に identity がありません`);
const original = identity.originalDocID ?? identity.docID;
const tier = entry.status?.state ?? "published";

// The filing of record, read fresh: the pack is built from the latest complete 訂正.
const shift = (/** @type {number} */ days) => {
  const d = new Date(`${identity.submitted}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  const iso = d.toISOString().slice(0, 10);
  return iso > today ? today : iso;
};
await packFor(id, identity.code, shift(-21), shift(21));
run(["scripts/research/draft-entry.mjs", id]);
const summary = JSON.parse(readFileSync(join(cacheDir(), "evidence", id, "summary.json"), "utf8"));
const draft = JSON.parse(readFileSync(join(cacheDir(), "evidence", id, "draft-entry.json"), "utf8"));
const amend = summary.amendments;

console.log(`${id}（${tier}） 原本 ${original} → 訂正 ${amend.amendmentDocIDs.join(", ") || "なし"} → 有効文書 ${amend.effectiveDocID}（${amend.status}、索引 ${amend.checkedThrough} まで）`);
if (amend.status === "none") fail("訂正はありません。何もしません。", 0);
if (amend.status === "incomplete") fail(`最新の訂正 ${amend.blockedBy} に ${amend.missing.join("・")} が無く、採用できません。needs-attention として人が確認してください`, 2);

const effective = amend.records.find((/** @type {any} */ r) => r.docID === amend.effectiveDocID);
const figuresChanged = Boolean(effective?.comparedToBase?.changed);

// Is the registered entry consistent with the ORIGINAL? If not, it is stale, not amended.
const periodEnd = identity.periodEnd;
const originalRows = readCsvRows(/** @type {string} */ (await downloadDocument(original, 5)));
const effectiveRows = readCsvRows(/** @type {string} */ (await downloadDocument(amend.effectiveDocID, 5)));
const originalFigures = fiveYearFigures(originalRows, periodEnd);
const staleAgainstOriginal = entryMismatches(originalFigures, entry);

const differences = financialsDifferences(entry.financials, draft.financials);
const textDiff = diffTextBlocks(originalRows, effectiveRows, PROSE_ELEMENTS);
console.log(`主要財務（原本→有効文書）: ${figuresChanged ? `変更あり（${effective.comparedToBase.differenceCount}件）` : "同一"} ／ 登録値と有効文書の差: ${differences.length}件 ／ 本文系の変更: ${textDiff.any ? textDiff.changed.join(", ") : "なし"}`);

/** Record that the amendments were checked, without touching any content. */
function recordCheck(/** @type {string} */ result) {
  const state = loadState(id);
  state.identity = { ...state.identity, originalDocID: original, amendments: amendmentIdentity(summary), amendmentCheck: { at: today, result, effectiveDocID: amend.effectiveDocID } };
  saveState(state);
}

if (staleAgainstOriginal.length > 0 && figuresChanged) {
  fail(`登録値が原本の有報とも一致しません（${staleAgainstOriginal.length}件。例 ${staleAgainstOriginal[0].fiscalYear} ${staleAgainstOriginal[0].field}）。古い抽出器で作られた可能性があり、訂正とは別の問題です。先に再生成してください`, 3);
}

const update = figuresChanged && differences.length > 0;
let nextStatus = entry.status;
if (flagText && textDiff.any && (tier === "published" || tier === "needs-attention")) {
  const note = `訂正有価証券報告書（docID ${amend.effectiveDocID}）で ${textDiff.changed.join("・")} が変更された。解説が訂正前の記述に依拠している可能性があるため、原本との差分を確認すること`;
  nextStatus = { state: "needs-attention", notes: [...(tier === "needs-attention" ? entry.status.notes : []), note] };
}
const statusChanged = JSON.stringify(nextStatus) !== JSON.stringify(entry.status);

if (!update && !statusChanged) {
  console.log(figuresChanged ? "登録値は既に有効文書と一致しています。エントリーは変更しません。" : "主要財務は同一です。エントリーも Revision も変更しません。");
  if (apply) {
    recordCheck(figuresChanged ? "already-current" : "identical");
    console.log("確認結果を pipeline/state に記録しました。");
  }
  process.exit(0);
}

// -------------------------------------------------------------------- the planned change
const sourceId = draft.financials[0]?.sourceIds?.[0];
if (update && !entry.sources.some((/** @type {any} */ s) => s.id === sourceId)) fail(`財務が引用する出典 ${sourceId} が sources にありません`);
const next = {
  ...entry,
  ...(update
    ? {
        financials: draft.financials,
        sources: entry.sources.map((/** @type {any} */ s) =>
          s.id === sourceId
            ? { ...s, title: draft._有報.replace(/\s*\(docID [^)]+\)/, ""), url: `https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/${draft._docID}.pdf`, ...(draft._提出日 ? { publishedAt: draft._提出日 } : {}), accessedAt: today }
            : s,
        ),
      }
    : {}),
  status: nextStatus,
  updatedAt: today,
};
// A correction changes figures and the entry's state, never the explanation (docs/continuous-pipeline-design.md §4.1).
assertMachineWrite(entry, next, "apply-amendment");

if (update) {
  console.log("\n財務の変更（登録値 → 有効文書）:");
  for (const d of differences) console.log(`  ${d.fiscalYear} ${d.field}: ${yen(d.registered)} → ${yen(d.effective)}`);
  console.log(`出典 ${sourceId}: docID ${original} → ${draft._docID}（${draft._有報.replace(/\s*\(docID [^)]+\)/, "")}）`);
}
if (statusChanged) console.log(`\nstatus: ${JSON.stringify(entry.status)} → ${JSON.stringify(nextStatus)}`);

// ------------------------------------------------------------------------------- gates
mkdirSync(join(root, "pipeline/staging"), { recursive: true });
writeFileSync(stagedPath, `${JSON.stringify(next, null, 2)}\n`);
try {
  // verify-financials checks the financials, and a status-only change leaves them
  // exactly as registered — so it is not a gate for that change. (It would also
  // fail it for a reason unrelated to the correction: an entry whose employee
  // counts come from the plain `NumberOfEmployees` element, e.g. yamaha-motor,
  // has no matching series in the pack at all.)
  if (update) {
    const verify = run(["scripts/research/verify-financials.mjs", id, "--entry", stagedRelative]);
    console.log(`\nverify-financials: OK — ${verify.split("\n")[0]}`);
  } else {
    console.log("\nverify-financials: 対象外（財務は変更しない）");
  }
  run([VITEST, "run", "tests/validate-file.test.ts"], { CONTENT_FILE: stagedRelative });
  console.log("schema / integrity（validate-file）: OK");
} catch (error) {
  rmSync(stagedPath, { force: true });
  fail(`検査に通らないため変更しません:\n${String(/** @type {any} */ (error).stdout ?? error).slice(-1500)}`, 4);
}
rmSync(stagedPath, { force: true });

if (!apply) {
  console.log("\nドライランです。何も書いていません。反映するには --apply を付けてください。");
  process.exit(0);
}

// ------------------------------------------------------------------------------ write
const revisionBase = `${today}-company-${id}-amendment-${update ? "applied" : "flagged"}`;
let revisionId = revisionBase;
for (let n = 2; existsSync(join(root, "src/data/revisions", `${revisionId}.json`)); n++) revisionId = `${revisionBase}-${n}`;
const revisionPath = join(root, "src/data/revisions", `${revisionId}.json`);
const entryBefore = readFileSync(entryPath, "utf8");
const changedFields = differences.map((d) => `${d.fiscalYear}${d.field}`);
const revision = {
  id: revisionId,
  targetType: "company",
  targetId: id,
  changedAt: today,
  reason: update
    ? "有価証券報告書に訂正有価証券報告書が提出され、主要財務の数値が変わったため、財務データを有効な文書（最新の訂正）から取り直し、出典を訂正有報に合わせた"
    : "訂正有価証券報告書で本文系の記載が変更されており、公開済みの解説が訂正前の記述に依拠している可能性があるため要確認にした",
  summary: update
    ? `${draft._有報.replace(/\s*\(docID [^)]+\)/, "")}（docID ${draft._docID}、提出 ${draft._提出日}）に基づき、${changedFields.length}項目を更新（原本 docID ${original}）`
    : `訂正（docID ${amend.effectiveDocID}）で ${textDiff.changed.join("・")} が変更。解説は自動では書き換えていない`,
  ...(update ? { before: differences.map((d) => ({ fiscalYear: d.fiscalYear, field: d.field, value: d.registered })), after: differences.map((d) => ({ fiscalYear: d.fiscalYear, field: d.field, value: d.effective })) } : {}),
};
try {
  writeFileSync(entryPath, `${JSON.stringify(next, null, 2)}\n`);
  writeFileSync(revisionPath, `${JSON.stringify(revision, null, 2)}\n`);
  const state = loadState(id);
  state.identity = {
    ...state.identity,
    originalDocID: original,
    ...(update ? { docID: draft._docID } : {}),
    amendments: amendmentIdentity(summary),
    amendmentCheck: { at: today, result: update ? "applied" : "flagged", effectiveDocID: amend.effectiveDocID },
  };
  saveState(state);
  run([VITEST, "run", "tests/data-integrity.test.ts"]);
} catch (error) {
  writeFileSync(entryPath, entryBefore);
  rmSync(revisionPath, { force: true });
  saveState(stateBefore);
  fail(`統合テストに通らなかったため元に戻しました:\n${String(/** @type {any} */ (error).stdout ?? error).slice(-1500)}`, 5);
}
console.log(`\n反映しました: src/data/companies/${id}.json / 改訂記録 ${revisionId}.json`);
console.log("コミットは人が行うこと（このスクリプトは git を触りません）");
