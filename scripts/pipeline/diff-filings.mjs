/**
 * Which parts of a company's explanation a newer 有価証券報告書 actually changes — so only those are rewritten.
 *
 *   node --env-file=.env.local scripts/pipeline/diff-filings.mjs <company-id> [--json]
 *
 * Compares the text sections of the filing the explanation was written from with the newest filing (both read from
 * EDINET's XBRL CSV, cached), and maps each section to the stages that rest on it. A stage is rewritten only when its
 * sections changed by more than a threshold; otherwise it is kept as it is (and keeps citing the older filing, with that
 * filing's point in time). Numbers and dates are ignored when comparing — every filing changes them — so what counts is a
 * change in what the company says.
 *
 * The second signal is the published text itself: a stage whose sentences quote the old filing's period (「2025年6月期の
 * 売上収益は…」「2025年6月30日現在…」) is stale once a newer filing exists, even if the filing's wording did not change —
 * the comparison above cannot see that, because it ignores the numbers on purpose (found on zero, 2026-10-19: its kept
 * businesses quoted FY2025 thirteen times beside a rewritten FY2026 business model). Such a stage is rewritten too, with
 * the reason "figures". In history only the `significance` lines count: an event is dated and does not go stale, but
 * "why it matters" often states the present (「現在も主要な顧客です（2025年6月期の売上収益は…）」), and that does.
 *
 * Reads only; writes nothing. docs/continuous-pipeline-design.md §4.5.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { textBlocks } from "../research/amendments.mjs";
import { downloadDocument, readCsvRows } from "../research/edinet.mjs";
import { newestFilings } from "./refresh-financials.mjs";
import { docIdOf } from "./source-meta.mjs";
import { STAGE_FIELDS } from "./merge-fragments.mjs";
import { sourceIdsIn } from "./update-scope.mjs";

/** The sections of the filing each stage rests on (XBRL element names without the prefix). */
export const STAGE_SECTIONS = {
  businessStructure: ["DescriptionOfBusinessTextBlock", "DescriptionOfReportableSegmentsTextBlock", "NotesSegmentInformationEtcConsolidatedFinancialStatementsTextBlock", "NotesSegmentInformationConsolidatedFinancialStatementsIFRSTextBlock", "MajorFacilitiesTextBlock"],
  history: ["CompanyHistoryTextBlock"],
  businessModel: ["DescriptionOfBusinessTextBlock", "ManagementAnalysisOfFinancialPositionOperatingResultsAndCashFlowsTextBlock", "BusinessPolicyBusinessEnvironmentIssuesToAddressEtcTextBlock"],
  industry: ["DescriptionOfBusinessTextBlock", "DescriptionOfReportableSegmentsTextBlock"],
  relatedCompanies: ["OverviewOfAffiliatedEntitiesTextBlock", "ShareholdingsTextBlock", "MajorShareholdersTextBlock"],
};

/**
 * How much a stage's sections must change before it is rewritten. History grows by appending a few lines to a long
 * table, so a small share of new text is already a new event.
 */
export const THRESHOLDS = { businessStructure: 0.25, history: 0.04, businessModel: 0.3, industry: 0.35, relatedCompanies: 0.3 };

/** The stages whose text states figures as of a point in time (history only in its significance lines). */
export const DATED_STAGES = ["businessStructure", "businessModel", "history", "relatedCompanies"];

/** How prose names a filing's period: 2025年6月期, 2025年6月30日, 2025年6月末. */
export function periodLabels(/** @type {string} */ periodEnd) {
  const [y, m, d] = periodEnd.split("-").map(Number);
  return [`${y}年${m}月期`, `${y}年${m}月${d}日`, `${y}年${m}月末`];
}

/**
 * For each dated stage, how many times its published text names the old filing's period. Pure.
 * @param {any} entry the published entry
 * @param {string | null} oldPeriodEnd
 * @returns {Record<string, number>}
 */
export function staleReferences(entry, oldPeriodEnd) {
  /** @type {Record<string, number>} */
  const out = {};
  if (!oldPeriodEnd) return out;
  const labels = periodLabels(oldPeriodEnd);
  for (const stage of DATED_STAGES) {
    const fields = (STAGE_FIELDS[/** @type {keyof typeof STAGE_FIELDS} */ (stage)] ?? []).filter((f) => f !== "financialNotes");
    const values = stage === "history" ? (entry.history ?? []).map((/** @type {any} */ h) => h.significance ?? "") : fields.map((f) => entry[f] ?? null);
    const text = JSON.stringify(values).normalize("NFKC");
    out[stage] = labels.reduce((n, l) => n + text.split(l).length - 1, 0);
  }
  return out;
}

/** The fiscal year end the old filing describes: its source's asOf, or the newest figures row that cites it. */
export function periodOfDoc(/** @type {any} */ entry, /** @type {string} */ docId) {
  const ids = new Set((entry.sources ?? []).filter((/** @type {any} */ s) => (s.docId ?? docIdOf(s.url)) === docId).map((/** @type {any} */ s) => s.id));
  const asOf = (entry.sources ?? []).find((/** @type {any} */ s) => ids.has(s.id) && s.asOf)?.asOf;
  if (asOf) return asOf;
  const rows = (entry.financials ?? []).filter((/** @type {any} */ f) => (f.sourceIds ?? []).some((/** @type {string} */ i) => ids.has(i)));
  return rows.map((/** @type {any} */ f) => f.periodEnd).sort().at(-1) ?? null;
}

/** What a section says, without what changes every year: digits, dates, amounts, punctuation and spaces. */
export const signature = (/** @type {string | undefined} */ text) =>
  (text ?? "").normalize("NFKC").replace(/[0-9０-９.,，．%％△▲\-－−()（）\s「」『』、。・:：/]/g, "").replace(/(年|月|日|期|百万円|千円|億円|円|株|名|人|社|件)/g, "");

const bigrams = (/** @type {string} */ s) => {
  /** @type {Map<string, number>} */
  const m = new Map();
  for (let i = 0; i < s.length - 1; i++) m.set(s.slice(i, i + 2), (m.get(s.slice(i, i + 2)) ?? 0) + 1);
  return m;
};

/**
 * 0 = the same thing said; 1 = nothing in common (or present in only one filing). Dice coefficient on character bigrams
 * of the signatures — cheap, deterministic, and blind to reworded numbers.
 */
export function changeRatio(/** @type {string | undefined} */ before, /** @type {string | undefined} */ after) {
  const a = signature(before);
  const b = signature(after);
  if (!a && !b) return 0;
  if (!a || !b) return 1;
  const A = bigrams(a);
  const B = bigrams(b);
  let common = 0;
  for (const [g, n] of A) common += Math.min(n, B.get(g) ?? 0);
  const total = a.length - 1 + (b.length - 1);
  return total <= 0 ? 0 : Math.round((1 - (2 * common) / total) * 1000) / 1000;
}

/**
 * The plan: for each stage, how much its sections changed and whether it is rewritten. Pure.
 * @param {Record<string, string>} oldBlocks section text by element, from the filing the explanation rests on
 * @param {Record<string, string>} newBlocks the same, from the newest filing
 * @param {Record<string, number>} [stale] staleReferences of the published entry
 */
export function planUpdate(oldBlocks, newBlocks, thresholds = THRESHOLDS, stale = {}) {
  /** @type {Record<string, number>} */
  const sections = {};
  for (const element of new Set(Object.values(STAGE_SECTIONS).flat())) {
    if (oldBlocks[element] === undefined && newBlocks[element] === undefined) continue;
    sections[element] = changeRatio(oldBlocks[element], newBlocks[element]);
  }
  const stages = Object.entries(STAGE_SECTIONS).map(([stage, elements]) => {
    const ratios = elements.filter((e) => e in sections).map((e) => sections[e]);
    const ratio = ratios.length === 0 ? 0 : Math.max(...ratios);
    const threshold = thresholds[/** @type {keyof typeof THRESHOLDS} */ (stage)];
    const staleCount = stale[stage] ?? 0;
    const reason = ratio >= threshold ? "text" : staleCount > 0 ? "figures" : null;
    return { stage, ratio, threshold, stale: staleCount, reason, rewrite: reason !== null };
  });
  return { sections, stages, rewrite: stages.filter((s) => s.rewrite).map((s) => s.stage) };
}

/**
 * The EDINET document the explanation was written from. After a partial update its parts rest on different filings;
 * the oldest is compared, so a change since any of them is seen (at worst a stage is rewritten that need not be).
 */
export function explanationDocId(/** @type {any} */ entry) {
  const cited = sourceIdsIn(["businesses", "businessModel", "history", "relatedCompanies", "perspectives"].map((f) => entry[f]));
  const docs = (entry.sources ?? [])
    .filter((/** @type {any} */ s) => cited.has(s.id) && (s.docId ?? docIdOf(s.url)))
    .sort((/** @type {any} */ a, /** @type {any} */ b) => String(a.publishedAt ?? a.asOf ?? "").localeCompare(String(b.publishedAt ?? b.asOf ?? "")));
  return docs.length === 0 ? null : (docs[0].docId ?? docIdOf(docs[0].url));
}

/** One line of the plan, for a person. */
export const stageLine = (/** @type {{ stage: string, ratio: number, threshold: number, stale?: number, reason?: string | null, rewrite: boolean }} */ s) =>
  `  ${s.rewrite ? "書き直す" : "そのまま"}  ${s.stage.padEnd(18)} 変化 ${s.ratio.toFixed(3)}（しきい値 ${s.threshold}）${s.stale ? `・旧期の数字や日付 ${s.stale} 箇所` : ""}${s.reason === "figures" ? " ← 数字・年度だけが古い" : ""}`;

async function rowsOf(/** @type {string} */ docID) {
  const zip = await downloadDocument(docID, 5);
  if (!zip) throw new Error(`${docID} の XBRL を取得できない`);
  return readCsvRows(zip);
}

/** For one registered company: the two filings and the plan. */
export async function diffCompany(/** @type {string} */ id, root = process.cwd()) {
  const entry = JSON.parse(readFileSync(join(root, "src/data/companies", `${id}.json`), "utf8"));
  if (entry.status?.state === "figures-only") return { id, kind: "no-explanation", detail: "数値のみのエントリー（解説がない）" };
  const oldDoc = explanationDocId(entry);
  const newest = newestFilings().get(entry.code);
  if (!oldDoc) return { id, kind: "unknown-source", detail: "解説がどの有報に基づくか分からない" };
  if (!newest || newest.docID === oldDoc) return { id, kind: "current", detail: `解説は最新の有報（${oldDoc}）に基づいている` };
  const oldPeriodEnd = periodOfDoc(entry, oldDoc);
  const plan = planUpdate(textBlocks(await rowsOf(oldDoc)), textBlocks(await rowsOf(newest.docID)), THRESHOLDS, staleReferences(entry, oldPeriodEnd));
  return { id, kind: plan.rewrite.length > 0 ? "rewrite" : "keep", oldDoc, oldPeriodEnd, newDoc: newest.docID, newPeriodEnd: newest.periodEnd, newSubmitted: newest.submitted, ...plan };
}

if (process.argv[1]?.endsWith("diff-filings.mjs")) {
  const id = process.argv[2];
  if (!id) {
    console.error("usage: node --env-file=.env.local scripts/pipeline/diff-filings.mjs <company-id> [--json]");
    process.exit(1);
  }
  const result = await diffCompany(id);
  if (process.argv.includes("--json")) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`${id}: ${result.kind}${"detail" in result ? ` — ${result.detail}` : ` （${result.oldDoc} → ${result.newDoc}）`}`);
    for (const s of "stages" in result ? result.stages ?? [] : []) console.log(stageLine(s));
  }
}
