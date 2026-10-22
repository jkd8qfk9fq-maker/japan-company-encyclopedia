/**
 * Report-only audit of 訂正有価証券報告書 across the companies the pipeline knows.
 *
 *   node scripts/pipeline/amendment-audit.mjs                 every company; writes the report, prints those with amendments
 *   node scripts/pipeline/amendment-audit.mjs <id> [<id> …]   just these
 *   node scripts/pipeline/amendment-audit.mjs --refresh       daily: read ONLY the days since the last check
 *     [--from-entries] [--report out/amendment-report.json] [--summary out/amendment-summary.md]
 *
 * --from-entries (and automatically when pipeline/state is absent, as in GitHub Actions): the filing each company is
 * built on is read from its ENTRY — the source its newest figures cite, followed back to the original when it is itself
 * a correction — instead of from pipeline/state, which lives only on the machine that registers companies.
 *
 * For each company: originalDocID → its corrections (reverse index by parentDocID) →
 * the filing of record (effectiveDocID) → did the five-year figures change → did the
 * text sections an entry's prose rests on change → what to do. It never writes a
 * company entry, a Revision or a pipeline state: `action` is a recommendation for a
 * person, and applying one is `apply-amendment.mjs`, one company at a time.
 *
 * `--refresh` is the standing check. The index remembers `checkedThrough`, the last
 * day it folded in, so a refresh reads the few days since — never the past again —
 * and reports the corrections that arrived for companies the pipeline tracks.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  amendmentsOf,
  chooseEffective,
  diffFigures,
  diffTextBlocks,
  ensureIndex,
  entryMismatches,
  filingCompleteness,
  loadIndex,
} from "../research/amendments.mjs";
import { downloadDocument, readCsvRows, scrubSecrets } from "../research/edinet.mjs";
import { PROSE_ELEMENTS, fiveYearFigures } from "../research/evidence-pack.mjs";

/**
 * What to do about a company, from its facts. A recommendation only.
 *
 * A figures-only entry has no prose, so a changed text section is nothing to it; a
 * published one quotes the text, so a changed section means what it says may no longer
 * match the filing of record — and it is flagged, never rewritten by this tooling.
 * @param {{ tier: string, status: string, financialChanged: boolean, textChanged: boolean }} facts
 */
export function auditAction({ tier, status, financialChanged, textChanged }) {
  if (status === "none") return "none";
  if (status === "error") return "error";
  if (status === "incomplete") return "needs-attention";
  if (tier === "no-entry") return "use-effective-at-registration";
  const published = tier === "published" || tier === "needs-attention";
  if (financialChanged && published && textChanged) return "update-financials+needs-attention";
  if (financialChanged) return "update-financials";
  if (published && textChanged) return "needs-attention";
  return "record-only";
}

const rowsOf = async (/** @type {string} */ docID) => {
  const zip = await downloadDocument(docID, 5);
  return zip ? readCsvRows(zip) : [];
};
const tryFigures = (/** @type {any[]} */ rows, /** @type {string} */ periodEnd) => {
  if (rows.length === 0) return null;
  try {
    return fiveYearFigures(rows, periodEnd);
  } catch {
    return null;
  }
};

/** The 訂正報告書 cell of an existing research log, or null if it has none. */
function logCell(/** @type {string} */ id) {
  const path = join(process.cwd(), "docs/research", `${id}.md`);
  if (!existsSync(path)) return null;
  return /\|\s*訂正報告書\s*\|\s*([^|]*?)\s*\|/.exec(readFileSync(path, "utf8"))?.[1] ?? null;
}

/**
 * Audit one company.
 * @param {{ id: string, state: any, entry: any|null, index: any }} input
 */
export async function auditCompany({ id, state, entry, index }) {
  const identity = state.identity;
  const original = identity.originalDocID ?? identity.docID;
  const amendments = amendmentsOf(index, original);
  const tier = entry ? (entry.status?.state ?? "published") : "no-entry";
  const log = logCell(id);
  const row = {
    companyId: id,
    tier,
    originalDocID: original,
    amendmentDocIDs: amendments.map((a) => a.docID),
    effectiveDocID: original,
    status: amendments.length === 0 ? "none" : "pending",
    financialChanged: false,
    financialDifferences: 0,
    textChanged: false,
    textChangedSections: /** @type {string[]} */ ([]),
    registeredMismatch: /** @type {number|null} */ (null),
    registeredMismatchOriginal: /** @type {number|null} */ (null),
    logCell: log,
    // A log that says 「なし」 while corrections exist contradicts the filing.
    logContradiction: amendments.length > 0 && log !== null && /^なし/.test(log),
    action: "none",
    note: "",
  };
  if (amendments.length === 0) return row;

  try {
    const periodEnd = identity.periodEnd;
    const originalRows = await rowsOf(original);
    const loaded = new Map();
    for (const a of amendments) loaded.set(a.docID, await rowsOf(a.docID));
    const completenessOf = (/** @type {string} */ docID) => {
      const rows = loaded.get(docID) ?? [];
      const structural = filingCompleteness(rows, originalRows);
      if (!structural.complete) return structural;
      return tryFigures(rows, periodEnd) ? structural : { complete: false, missing: ["5年表を抽出できない"] };
    };
    const choice = chooseEffective(original, amendments, completenessOf);
    row.status = choice.status;
    row.effectiveDocID = choice.effectiveDocID;
    if (choice.status === "incomplete") {
      row.note = `最新の訂正 ${choice.blockedBy} に ${choice.missing.join("・")} が無く採用しない`;
    } else if (choice.effectiveIsAmendment) {
      const effectiveRows = /** @type {any[]} */ (loaded.get(choice.effectiveDocID));
      const before = tryFigures(originalRows, periodEnd);
      const after = tryFigures(effectiveRows, periodEnd);
      const figures = diffFigures(before, after);
      row.financialChanged = figures.changed;
      row.financialDifferences = figures.differences.length;
      const text = diffTextBlocks(originalRows, effectiveRows, PROSE_ELEMENTS);
      row.textChanged = text.any;
      row.textChangedSections = text.changed;
      if (entry) {
        row.registeredMismatch = entryMismatches(after, entry).length;
        row.registeredMismatchOriginal = entryMismatches(before, entry).length;
      }
    }
  } catch (error) {
    row.status = "error";
    row.note = String(/** @type {Error} */ (error).message).slice(0, 160);
  }
  row.action = auditAction(row);
  return row;
}

/**
 * The filing an entry is built on, from the entry alone: the EDINET source its newest figures cite. If that document is
 * itself a correction in the index, the original is its parent (a chain is followed to the end). Pure.
 * @param {any} entry
 * @param {any} index
 * @returns {{ code: string, docID: string, originalDocID: string, periodEnd: string } | null}
 */
export function identityFromEntry(entry, index) {
  const latest = [...(entry.financials ?? [])].sort((a, b) => String(a.periodEnd).localeCompare(String(b.periodEnd))).at(-1);
  const source = (entry.sources ?? []).find((/** @type {any} */ s) => (latest?.sourceIds ?? []).includes(s.id));
  const docID = source?.docId ?? /(S[0-9A-Z]{7})\.pdf/.exec(source?.url ?? "")?.[1];
  if (!latest || !docID) return null;
  /** @type {Map<string, string>} */
  const parentOf = new Map();
  for (const rows of Object.values(index.byParent ?? {})) for (const r of /** @type {any[]} */ (rows)) parentOf.set(r.docID, r.parentDocID);
  let original = docID;
  for (let i = 0; i < 10 && parentOf.has(original); i++) original = /** @type {string} */ (parentOf.get(original));
  return { code: entry.code, docID, originalDocID: original, periodEnd: latest.periodEnd };
}

/** Every registered entry, with the filing it is built on read from the entry (no pipeline/state needed). */
function companiesFromEntries(/** @type {string[]} */ only, /** @type {any} */ index) {
  const dir = join(process.cwd(), "src/data/companies");
  const out = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const entry = JSON.parse(readFileSync(join(dir, file), "utf8"));
    if (only.length > 0 && !only.includes(entry.id)) continue;
    const identity = identityFromEntry(entry, index);
    if (identity) out.push({ id: entry.id, state: { companyId: entry.id, identity }, entry });
  }
  return out;
}

/**
 * The report's summary for a person (the job summary and the pull request body). Pure.
 * @param {{ before: string | null, after: string, added: number, error: string | null, rows: any[] }} r
 */
export function refreshSummary({ before, after, added, error, rows }) {
  const lines = [`## 訂正有価証券報告書の監査（索引 ${before ?? "なし"} → ${after}、新しい訂正 ${added} 件）`, ""];
  if (error) lines.push(`**索引の取得が途中で止まりました:** ${error}（次の実行で続きから読みます）`, "");
  if (rows.length === 0) lines.push("掲載中の会社に新しい訂正はありません。");
  else {
    lines.push("| 会社 | 区分 | 新しい訂正 | 財務が変わる | 本文が変わる | 推奨 |", "|---|---|---|---|---|---|");
    for (const r of rows) lines.push(`| ${r.companyId} | ${r.tier} | ${r.fresh.join(", ")} | ${r.financialChanged ? "はい" : "いいえ"} | ${r.textChanged ? `はい（${r.textChangedSections.length}節）` : "いいえ"} | ${r.action} |`);
    lines.push("", "推奨が update-financials・needs-attention のものは、手元で `node scripts/pipeline/apply-amendment.mjs <id>`（ドライラン）で確かめてから `--apply`。この監査はエントリーを変えない。");
  }
  return `${lines.join("\n")}\n`;
}

/** Every company the pipeline has resolved an identity for, with its entry if it has one. */
function companies(/** @type {string[]} */ only) {
  const root = process.cwd();
  const out = [];
  for (const file of readdirSync(join(root, "pipeline/state")).filter((f) => f.endsWith(".json"))) {
    const state = JSON.parse(readFileSync(join(root, "pipeline/state", file), "utf8"));
    if (!state.identity?.docID) continue;
    if (only.length > 0 && !only.includes(state.companyId)) continue;
    const entryPath = join(root, "src/data/companies", `${state.companyId}.json`);
    out.push({ id: state.companyId, state, entry: existsSync(entryPath) ? JSON.parse(readFileSync(entryPath, "utf8")) : null });
  }
  return out;
}

const COLUMNS = ["companyId", "tier", "originalDocID", "amendmentDocIDs", "effectiveDocID", "status", "financialChanged", "textChanged", "textChangedSections", "registeredMismatch", "logContradiction", "action", "note"];
const cell = (/** @type {any} */ v) => (Array.isArray(v) ? v.join(";") : v ?? "");

async function main() {
  const args = process.argv.slice(2);
  const refresh = args.includes("--refresh");
  const showAll = args.includes("--all");
  const valueOf = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
  const reportPath = valueOf("--report");
  const summaryPath = valueOf("--summary");
  const only = args.filter((a, i) => !a.startsWith("--") && !["--report", "--summary"].includes(args[i - 1]));
  const fromEntries = args.includes("--from-entries") || !existsSync(join(process.cwd(), "pipeline/state"));

  if (refresh) {
    const before = loadIndex().checkedThrough;
    const { index, added, error: rawError } = await ensureIndex({ fetch: true });
    const error = rawError ? scrubSecrets(String(rawError)) : null;
    console.log(`索引: ${before ?? "なし"} → ${index.checkedThrough}（新しい訂正 ${added.length} 件${error ? `。取得中に停止: ${error}` : ""}）`);
    const tracked = fromEntries ? companiesFromEntries(only, index) : companies(only);
    const byOriginal = new Map(tracked.map((c) => [c.state.identity.originalDocID ?? c.state.identity.docID, c]));
    const newIds = new Set(added.map((a) => a.docID));
    const hits = [];
    for (const [original, company] of byOriginal) {
      const fresh = amendmentsOf(index, original).filter((a) => newIds.has(a.docID));
      if (fresh.length === 0) continue;
      const row = await auditCompany({ ...company, index });
      hits.push({ ...row, fresh: fresh.map((a) => `${a.docID}@${a.submitDateTime.slice(0, 10)}`) });
      console.log(`${row.companyId}\t${row.tier}\t新規 ${hits.at(-1)?.fresh.join(",")}\t財務=${row.financialChanged}\t本文=${row.textChanged}\t${row.action}`);
    }
    if (hits.length === 0) console.log("追跡中の会社に新しい訂正はありません。");
    const result = { before, after: index.checkedThrough, added: added.length, error, source: fromEntries ? "entries" : "pipeline/state", companies: tracked.length, rows: hits };
    if (reportPath) writeFileSync(reportPath, `${JSON.stringify(result, null, 1)}\n`);
    if (summaryPath) writeFileSync(summaryPath, refreshSummary(result));
    process.exit(error ? 1 : 0);
  }

  const { index } = await ensureIndex({ fetch: false });
  const rows = [];
  const list = companies(only);
  let done = 0;
  for (const company of list) {
    const row = await auditCompany({ ...company, index });
    if (row.status !== "none" || showAll) rows.push(row);
    if (++done % 500 === 0) console.error(`… ${done}/${list.length}`);
  }
  const base = join(process.cwd(), "pipeline/amendment-audit");
  writeFileSync(`${base}.json`, `${JSON.stringify({ checkedThrough: index.checkedThrough, rows }, null, 1)}\n`);
  writeFileSync(`${base}.tsv`, `${COLUMNS.join("\t")}\n${rows.map((r) => COLUMNS.map((c) => cell(/** @type {any} */ (r)[c])).join("\t")).join("\n")}\n`);
  const tally = /** @type {Record<string, number>} */ ({});
  for (const r of rows) tally[r.action] = (tally[r.action] ?? 0) + 1;
  console.log(`検査: ${list.length} 社、訂正あり ${rows.filter((r) => r.status !== "none").length} 社（索引 ${index.checkedThrough} まで）`);
  console.log("action:", JSON.stringify(tally));
  console.log(`logContradiction（研究ログが「なし」だが訂正がある）: ${rows.filter((r) => r.logContradiction).map((r) => r.companyId).join(", ") || "なし"}`);
  console.log(`報告: pipeline/amendment-audit.tsv / .json`);
  // Companies a person has to look at now.
  for (const r of rows.filter((r) => ["update-financials", "update-financials+needs-attention", "needs-attention", "use-effective-at-registration", "error"].includes(r.action))) {
    console.log(`${r.companyId}\t${r.tier}\t${r.action}\t財務=${r.financialChanged}\t本文=${r.textChanged}${r.textChangedSections.length ? `[${r.textChangedSections.join("+")}]` : ""}\t有効=${r.effectiveDocID}`);
  }
}

if (process.argv[1]?.endsWith("amendment-audit.mjs")) await main();
