/**
 * 訂正有価証券報告書 (docTypeCode 130) tracking.
 *
 * EDINET links every correction to the filing it amends with `parentDocID`, and
 * serves no per-filer or per-document search — only one index per calendar day.
 * So "which corrections does this filing have?" is answered here from a reverse
 * index (original docID → corrections), built once from the day indexes the
 * pipeline already caches and extended only by the days that arrive afterwards.
 * Nothing re-scans the past: `checkedThrough` is the last day folded in, and a
 * weekly refresh reads only the days after it.
 *
 * Why not a date window (the old ±21 days around the filing): a correction
 * arrives a median 28 days after the original and up to 464 days after it, and
 * the 9 of 241 that changed a key figure all arrived after day 42 (2026-10-02
 * survey). A window cannot be wide enough without also reaching the NEXT year's
 * 有報, which is why the original is still located by a local window, and its
 * corrections by `parentDocID`.
 *
 * What counts as the document of record: a correction on EDINET is a complete
 * re-submission (260 of 260 surveyed carried every text section and the
 * five-year table, with the DEI amendment flag set), so the LATEST correction
 * supersedes the original and the corrections before it. If the latest one is
 * missing something the pack needs it is not adopted — the original stays the
 * document of record and the company is flagged, never silently downgraded.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { documentsOn, indexDir as indexDirOf, textBlockToText } from "./edinet.mjs";

export const AMENDMENT_TYPE = "130";

/** The five series every entry's `financials` row carries from the five-year table. */
export const FIGURE_KINDS = ["revenue", "profit", "netIncome", "totalAssets", "netAssets"];

/** Where the reverse index lives: durable (not the temp cache) and small. */
export const indexFile = (/** @type {string} */ root = process.cwd()) => join(root, "pipeline/amendments-index.json");

// ----------------------------------------------------------------- the reverse index

/** @typedef {{ docID: string, parentDocID: string, submitDateTime: string, docDescription: string, edinetCode: string|null, secCode: string|null }} AmendmentRow */
/** @typedef {{ version: number, checkedThrough: string|null, coveredFrom: string|null, byParent: Record<string, AmendmentRow[]> }} AmendmentIndex */

/** @returns {AmendmentIndex} */
export function emptyIndex() {
  return { version: 1, checkedThrough: null, coveredFrom: null, byParent: {} };
}

/**
 * The corrections in one day's index results. A row with no parent cannot be
 * attached to anything and is dropped; EDINET has served a parent on all 2,321
 * corrections seen so far.
 * @param {any[]} results
 * @returns {AmendmentRow[]}
 */
export function amendmentRows(results) {
  return (results ?? [])
    .filter((r) => r.docTypeCode === AMENDMENT_TYPE && r.parentDocID)
    .map((r) => ({
      docID: r.docID,
      parentDocID: r.parentDocID,
      submitDateTime: r.submitDateTime,
      docDescription: r.docDescription ?? "",
      edinetCode: r.edinetCode ?? null,
      secCode: r.secCode ?? null,
    }));
}

/**
 * Fold rows into the index in place, oldest first within each parent, once each.
 * @param {AmendmentIndex} index
 * @param {AmendmentRow[]} rows
 * @returns {AmendmentRow[]} the rows that were new
 */
export function addAmendments(index, rows) {
  const added = [];
  for (const row of rows) {
    const list = (index.byParent[row.parentDocID] ??= []);
    if (list.some((r) => r.docID === row.docID)) continue;
    list.push(row);
    list.sort((a, b) => a.submitDateTime.localeCompare(b.submitDateTime) || a.docID.localeCompare(b.docID));
    added.push(row);
  }
  return added;
}

/**
 * Every correction of an original, oldest first.
 *
 * A correction is expected to name the ORIGINAL as its parent (every one of the
 * 2,321 surveyed does) — but a parent is followed, not assumed: a correction that
 * names another correction is still the original's, so chains resolve to one flat
 * list rather than silently dropping the later link.
 * @param {AmendmentIndex} index
 * @param {string} originalDocID
 * @returns {AmendmentRow[]}
 */
export function amendmentsOf(index, originalDocID) {
  const seen = new Set([originalDocID]);
  /** @type {AmendmentRow[]} */
  const out = [];
  const queue = [originalDocID];
  while (queue.length > 0) {
    const parent = /** @type {string} */ (queue.shift());
    for (const row of index.byParent[parent] ?? []) {
      if (seen.has(row.docID)) continue;
      seen.add(row.docID);
      out.push(row);
      queue.push(row.docID);
    }
  }
  return out.sort((a, b) => a.submitDateTime.localeCompare(b.submitDateTime) || a.docID.localeCompare(b.docID));
}

/** @param {string} iso */
const nextDay = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
/** Yesterday, UTC. Today's index is still filling up and `documentsOn` caches what it is given. */
const yesterday = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};

/** @returns {AmendmentIndex} */
export function loadIndex(/** @type {string} */ root = process.cwd()) {
  const file = indexFile(root);
  if (!existsSync(file)) return emptyIndex();
  return { ...emptyIndex(), ...JSON.parse(readFileSync(file, "utf8")) };
}

export function saveIndex(/** @type {AmendmentIndex} */ index, /** @type {string} */ root = process.cwd()) {
  const file = indexFile(root);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(index)}\n`);
}

/**
 * Fold in the cached day indexes after `checkedThrough` — local files only, no
 * API call. Days from today on are left alone (still incomplete).
 * @param {AmendmentIndex} index
 * @param {string} [dir]
 * @returns {AmendmentRow[]} corrections that were new to the index
 */
export function extendFromCache(index, dir = indexDirOf()) {
  if (!existsSync(dir)) return [];
  const today = new Date().toISOString().slice(0, 10);
  const after = index.checkedThrough ?? "0000-00-00";
  const days = readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.slice(0, 10))
    .filter((d) => d > after && d < today)
    .sort();
  const added = [];
  for (const day of days) {
    const json = JSON.parse(readFileSync(join(dir, `${day}.json`), "utf8"));
    added.push(...addAmendments(index, amendmentRows(json.results)));
    index.checkedThrough = day;
    index.coveredFrom ??= day;
  }
  return added;
}

/**
 * Read the days after `checkedThrough` from EDINET (each cached by `documentsOn`
 * as usual) up to yesterday. One request per missing day — a week's refresh is
 * about five. Stops at the first day EDINET cannot serve and leaves
 * `checkedThrough` at the last good one, so a gap is never papered over.
 * @param {AmendmentIndex} index
 * @param {string} [through]
 * @returns {Promise<{ added: AmendmentRow[], error: string|null }>}
 */
export async function refreshFromEdinet(index, through = yesterday()) {
  const added = [];
  let day = index.checkedThrough ? nextDay(index.checkedThrough) : null;
  if (!day) return { added, error: "索引が空です（まずキャッシュ済みの日次索引から作ること）" };
  try {
    for (; day <= through; day = nextDay(day)) {
      const json = await documentsOn(day);
      added.push(...addAmendments(index, amendmentRows(json.results)));
      index.checkedThrough = day;
    }
  } catch (error) {
    return { added, error: String(/** @type {Error} */ (error).message).slice(0, 200) };
  }
  return { added, error: null };
}

/**
 * The index, brought as current as the cache allows — and, with `fetch`, as
 * current as EDINET allows. Never throws on a network problem: the caller gets
 * `error` and `checkedThrough`, and records how fresh its answer was.
 * @param {{ fetch?: boolean, root?: string, indexDir?: string }} [options]
 */
export async function ensureIndex({ fetch = false, root = process.cwd(), indexDir } = {}) {
  const index = loadIndex(root);
  const before = JSON.stringify(index);
  const added = extendFromCache(index, indexDir);
  let error = null;
  if (fetch) {
    const refreshed = await refreshFromEdinet(index);
    added.push(...refreshed.added);
    error = refreshed.error;
  }
  if (JSON.stringify(index) !== before) saveIndex(index, root);
  return { index, added, error };
}

// ---------------------------------------------------------------- the document of record

/**
 * Which filing is the document of record for an original and its corrections.
 *
 * `completenessOf` is asked about the LATEST correction only: it either supersedes
 * everything before it or it blocks. A blocked correction is not skipped in
 * favour of an earlier one — the earlier one is superseded too, and guessing which
 * parts of it still stand is exactly the judgement this refuses to make.
 *
 * @param {string} originalDocID
 * @param {{ docID: string }[]} amendments oldest first
 * @param {(docID: string) => { complete: boolean, missing: string[] }} [completenessOf]
 */
export function chooseEffective(originalDocID, amendments, completenessOf = () => ({ complete: true, missing: [] })) {
  const amendmentDocIDs = amendments.map((a) => a.docID);
  const latest = amendments.at(-1);
  if (!latest) {
    return { originalDocID, amendmentDocIDs, effectiveDocID: originalDocID, effectiveIsAmendment: false, status: "none", blockedBy: null, missing: /** @type {string[]} */ ([]) };
  }
  const check = completenessOf(latest.docID);
  if (!check.complete) {
    return { originalDocID, amendmentDocIDs, effectiveDocID: originalDocID, effectiveIsAmendment: false, status: "incomplete", blockedBy: latest.docID, missing: check.missing };
  }
  return { originalDocID, amendmentDocIDs, effectiveDocID: latest.docID, effectiveIsAmendment: true, status: "adopted", blockedBy: null, missing: [] };
}

const hasText = (/** @type {any[]} */ rows, /** @type {string} */ element) => rows.some((r) => (r["要素ID"] ?? "").endsWith(`:${element}`) && String(r["値"] ?? "").trim() !== "");
/** What the pack reads from a filing, by name. */
const REQUIRED = /** @type {[string, (rows: any[]) => boolean][]} */ ([
  ["沿革", (rows) => hasText(rows, "CompanyHistoryTextBlock")],
  ["事業の内容", (rows) => hasText(rows, "DescriptionOfBusinessTextBlock")],
  ["主要な経営指標等の表", (rows) => rows.some((r) => /(SummaryOfBusinessResults|KeyFinancialData)$/.test(r["要素ID"] ?? "") && r["単位"] === "円")],
  ["表紙の会社名", (rows) => hasText(rows, "CompanyNameCoverPage")],
]);

/**
 * Does a filing carry what the evidence pack reads? Judged against the original
 * when one is given: a filing that never had a section is not "missing" it, so a
 * company whose original has no 沿革 block is not blocked for its amendment's.
 * @param {any[]} rows the filing's XBRL rows (empty if EDINET serves no CSV)
 * @param {any[]|null} [referenceRows]
 */
export function filingCompleteness(rows, referenceRows = null) {
  if (!rows || rows.length === 0) return { complete: false, missing: ["XBRL（CSV）"] };
  const required = referenceRows ? REQUIRED.filter(([, present]) => present(referenceRows)) : REQUIRED;
  const missing = required.filter(([, present]) => !present(rows)).map(([name]) => name);
  return { complete: missing.length === 0, missing };
}

// --------------------------------------------------------------- what the pipeline records

/**
 * `identity.corrections`, as it has always meant: the 訂正 docIDs the search window
 * of that moment showed. intake.mjs wrote an empty list for every company whatever
 * the pack saw, so the research log said 「なし」 beside a correction that existed;
 * both writers now take it from the pack in the same way.
 * @param {any} summary a pack's summary.json
 * @returns {string[]}
 */
export const windowCorrections = (summary) => (summary?.corrections ?? []).map((/** @type {any} */ c) => c.docID);

/**
 * The tracked amendment state a pack found, as `identity.amendments`. Separate from
 * `identity.corrections` on purpose: that one is a snapshot of what a window showed;
 * this one is the authoritative chain by parentDocID and the filing of record.
 * @param {any} summary
 */
export function amendmentIdentity(summary) {
  const a = summary?.amendments;
  if (!a) return null;
  return {
    originalDocID: a.originalDocID,
    effectiveDocID: a.effectiveDocID,
    amendmentDocIDs: a.amendmentDocIDs,
    status: a.status,
    blockedBy: a.blockedBy ?? null,
    checkedThrough: a.checkedThrough ?? null,
  };
}

/**
 * The research log's 訂正報告書 cell. The tracked chain (by parentDocID) is what is true;
 * `identity.corrections` is only what a search window once showed, and was an empty list
 * for every bulk-built company — so a log built from it alone said 「なし」 beside a
 * correction that existed (4cs-hd, found 2026-10-02).
 * @param {{ docID?: string, originalDocID?: string, corrections?: string[], amendments?: { amendmentDocIDs?: string[] }|null }} identity
 * @param {AmendmentIndex} index
 */
export function correctionsCell(identity, index) {
  const original = identity.originalDocID ?? identity.docID ?? "";
  const chain = amendmentsOf(index, original).map((a) => a.docID);
  const seen = [...new Set([...chain, ...(identity.amendments?.amendmentDocIDs ?? []), ...(identity.corrections ?? [])])];
  const through = index.checkedThrough ?? "索引なし";
  if (seen.length === 0) return `なし（${through} まで確認）`;
  const effective = identity.docID && identity.docID !== original ? `／有効文書 ${identity.docID}` : "";
  return `${seen.join(", ")}${effective}（${through} まで確認）`;
}

// ------------------------------------------------------------------------ differences

/** @param {any} figures @param {string} kind @returns {Map<string, number[]>} year → sorted distinct values */
function valuesByYear(figures, kind) {
  /** @type {Map<string, Set<number>>} */
  const years = new Map();
  for (const series of figures?.[kind] ?? []) {
    for (const y of series.years ?? []) {
      const value = y.value ?? y.yen;
      if (typeof value !== "number") continue;
      if (!years.has(y.fiscalYearEnd)) years.set(y.fiscalYearEnd, new Set());
      /** @type {Set<number>} */ (years.get(y.fiscalYearEnd)).add(value);
    }
  }
  return new Map([...years].map(([year, values]) => [year, [...values].sort((a, b) => a - b)]));
}

/**
 * Do two filings print the same five-year figures?
 *
 * Compared per (series, fiscal year) as the SET of values the filing tags — not
 * per element name, so a correction that re-tags 売上高 under another element
 * with the same number is not reported as a change, and one that moves a number
 * is. Covers all five series the entry stores; a year present in one filing and
 * absent in the other is a difference.
 * @param {any} before figures of one filing (the pack's `figures`)
 * @param {any} after
 * @param {string[]} [kinds] the series to compare (default: the five an entry stores)
 */
export function diffFigures(before, after, kinds = FIGURE_KINDS) {
  /** @type {{ kind: string, fiscalYearEnd: string, before: number[], after: number[] }[]} */
  const differences = [];
  for (const kind of kinds) {
    const a = valuesByYear(before, kind);
    const b = valuesByYear(after, kind);
    for (const year of [...new Set([...a.keys(), ...b.keys()])].sort()) {
      const x = a.get(year) ?? [];
      const y = b.get(year) ?? [];
      if (JSON.stringify(x) !== JSON.stringify(y)) differences.push({ kind, fiscalYearEnd: year, before: x, after: y });
    }
  }
  const latestYear = differences.map((d) => d.fiscalYearEnd).sort().at(-1) ?? null;
  return { changed: differences.length > 0, differences, latestYearChanged: differences.some((d) => d.fiscalYearEnd === latestYear && d.kind === "revenue") };
}

/**
 * Where a REGISTERED entry's `financials` disagree with a filing's figures: each
 * stored value must be one the filing tags for that year. Reported separately from
 * diffFigures because it says something different — an entry can disagree with a
 * filing its extractor has since improved on (stale) without any correction.
 * @param {any} figures
 * @param {{ financials?: any[] }} entry
 */
export function entryMismatches(figures, entry) {
  /** @type {{ fiscalYear: string, field: string, registered: number, filing: number[] }[]} */
  const out = [];
  for (const kind of FIGURE_KINDS) {
    const byYear = valuesByYear(figures, kind);
    for (const row of entry.financials ?? []) {
      const registered = row[kind];
      if (typeof registered !== "number") continue;
      const filing = byYear.get(row.periodEnd) ?? [];
      if (!filing.includes(registered)) out.push({ fiscalYear: row.fiscalYear, field: kind, registered, filing });
    }
  }
  return out;
}

/**
 * Differences between two `financials` arrays on the five stored series. A year that is
 * in only one of them is a difference too (a correction can add or drop a column).
 * @param {any[]} registered
 * @param {any[]} drafted
 */
export function financialsDifferences(registered, drafted) {
  const byYear = (/** @type {any[]} */ rows) => new Map((rows ?? []).map((r) => [r.periodEnd, r]));
  const a = byYear(registered);
  const b = byYear(drafted);
  /** @type {{ fiscalYear: string, field: string, registered: number|string|null, effective: number|string|null }[]} */
  const out = [];
  for (const year of [...new Set([...a.keys(), ...b.keys()])].sort()) {
    const x = a.get(year);
    const y = b.get(year);
    if (!x || !y) {
      out.push({ fiscalYear: (x ?? y).fiscalYear, field: "(行)", registered: x ? "あり" : "なし", effective: y ? "あり" : "なし" });
      continue;
    }
    for (const kind of FIGURE_KINDS) {
      if ((x[kind] ?? null) !== (y[kind] ?? null)) out.push({ fiscalYear: x.fiscalYear, field: kind, registered: x[kind] ?? null, effective: y[kind] ?? null });
    }
  }
  return out;
}

/** Normalised text of every non-empty TextBlock by element local name. */
function textBlocks(/** @type {any[]} */ rows) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const r of rows) {
    const id = r["要素ID"] ?? "";
    if (!/TextBlock$/.test(id) || !String(r["値"] ?? "").trim()) continue;
    out[id.replace(/^.*:/, "")] = textBlockToText(r["値"]).replace(/\s+/g, "").normalize("NFKC");
  }
  return out;
}

/**
 * Which of the named text sections read differently in two filings. `elements` is
 * the set the pipeline actually reads (see PROSE_ELEMENTS in evidence-pack.mjs):
 * a correction that only touches, say, the 資本金の推移 table is not a change to
 * anything an entry's prose rests on.
 * @param {any[]} before
 * @param {any[]} after
 * @param {string[]} elements full element ids, e.g. "jpcrp_cor:CompanyHistoryTextBlock"
 */
export function diffTextBlocks(before, after, elements) {
  const a = textBlocks(before);
  const b = textBlocks(after);
  const changed = [];
  for (const element of elements) {
    const key = element.replace(/^.*:/, "");
    if ((a[key] ?? null) !== (b[key] ?? null)) changed.push(key);
  }
  return { changed: [...new Set(changed)], any: changed.length > 0 };
}

// --------------------------------------------------------------- what an amendment changed

/** Cover-page and DEI facts that change on every re-filing (提出回数, 訂正フラグ …) and mean nothing. */
const FILING_METADATA = /(^jpdei_cor:|CoverPage$|DEI$)/;
const NUMERIC_VALUE = /^-?[0-9][0-9,]*(\.[0-9]+)?$/;

/** Every numeric fact outside the cover page, by element and context: the sorted values it carries. */
function numericFacts(/** @type {any[]} */ rows) {
  /** @type {Map<string, string[]>} */
  const facts = new Map();
  for (const r of rows) {
    const id = r["要素ID"] ?? "";
    const value = String(r["値"] ?? "").trim();
    if (!id || FILING_METADATA.test(id) || /TextBlock$/.test(id) || !NUMERIC_VALUE.test(value)) continue;
    const key = `${id}|${r["コンテキストID"] ?? ""}|${r["ユニットID"] ?? ""}`;
    facts.set(key, [...(facts.get(key) ?? []), value].sort());
  }
  return facts;
}

/** A number of the financial statements or the five-year table, as opposed to a disclosure (役員報酬, 保有株式数 …). */
const FINANCIAL_FACT = /^(jppfs_cor|jpigp_cor):|(SummaryOfBusinessResults|KeyFinancialData)$|NumberOfEmployees/;

/**
 * Which numeric facts differ between two filings of the same report — every number the filing
 * tags, not only the five series the pack extracts (キャッシュ・フロー, 資本金, 発行済株式数 …). A fact
 * present in only one filing is a difference. Split into the numbers of the financial statements and
 * five-year table ("financial") and every other disclosed number ("other": 役員報酬, 保有株式数 …),
 * because only the first changes what an entry says about the company's results.
 * @param {any[]} before
 * @param {any[]} after
 */
export function diffNumericFacts(before, after) {
  const a = numericFacts(before);
  const b = numericFacts(after);
  const out = { financial: { count: 0, elements: /** @type {Set<string>} */ (new Set()) }, other: { count: 0, elements: /** @type {Set<string>} */ (new Set()) } };
  for (const key of new Set([...a.keys(), ...b.keys()])) {
    if (JSON.stringify(a.get(key) ?? null) === JSON.stringify(b.get(key) ?? null)) continue;
    const id = key.split("|")[0];
    const bucket = FINANCIAL_FACT.test(id) ? out.financial : out.other;
    bucket.count++;
    bucket.elements.add(id.replace(/^.*:/, ""));
  }
  return { financial: { count: out.financial.count, elements: [...out.financial.elements].sort() }, other: { count: out.other.count, elements: [...out.other.elements].sort() } };
}

/** The local names of every TextBlock whose text differs (or exists on one side only). */
function changedTextBlocks(/** @type {any[]} */ before, /** @type {any[]} */ after) {
  const a = textBlocks(before);
  const b = textBlocks(after);
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => (a[k] ?? null) !== (b[k] ?? null)).sort();
}

/**
 * What a 訂正 changed against its original, and what that means for an entry built on it:
 *
 *   financial-change  a figure differs — one of the series the pack extracts (the five, and 従業員数)
 *                     or any other number of the financial statements / five-year table
 *   text-change       no figure differs, but a section an entry's prose rests on reads differently
 *   record-only       neither: only the cover (提出回数, 訂正フラグ, 書類名), sections no entry quotes, and
 *                     disclosed numbers outside the statements (役員報酬 …), which are listed, not judged
 *
 * Mechanical and complete over the two filings' XBRL — it replaces reading a 訂正 by eye, and is why
 * "訂正の中身を確認できない" is not by itself a reason to hold an entry back.
 * @param {{ figures: { changed: boolean, differences: any[] }, baseRows: any[], rows: any[], proseElements: string[] }} input
 */
export function classifyAmendment({ figures, baseRows, rows, proseElements }) {
  const numeric = diffNumericFacts(baseRows, rows);
  const changedBlocks = changedTextBlocks(baseRows, rows);
  const prose = new Set(proseElements.map((e) => e.replace(/^.*:/, "")));
  const proseTextChanged = changedBlocks.filter((k) => prose.has(k));
  const otherTextChanged = changedBlocks.filter((k) => !prose.has(k));
  const classification = figures.changed || numeric.financial.count > 0 ? "financial-change" : proseTextChanged.length > 0 ? "text-change" : "record-only";
  return {
    classification,
    numericFactsChanged: numeric.financial.count,
    numericElements: numeric.financial.elements.slice(0, 12),
    otherNumericChanged: numeric.other.elements.slice(0, 12),
    proseTextChanged,
    otherTextChanged,
  };
}
