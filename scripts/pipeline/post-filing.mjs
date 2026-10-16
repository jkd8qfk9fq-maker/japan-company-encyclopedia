/**
 * Did something happen to a company AFTER the 有報 it is built on that a reader of its page would
 * need to know — read from the cached EDINET day indexes, nothing else?
 *
 * Four of the 20 pilot companies were found, only during quality review, to have changed their name,
 * been taken over or lost their listing after the 有報 was filed; nothing in the pipeline looked.
 * This looks, and ONLY looks: it reports candidate documents, never interprets them and never
 * rewrites an entry. What it can see mechanically:
 *
 *   name-change    a later filing by the same filer (same EDINET code) carries a different 提出者名.
 *   stopped-filing the 有報 it is built on ended 14 months ago or more and no later 有報 exists. A
 *                  company that files annually has the next one within ~3 months of year end, so this is
 *                  how a delisting (aeon-delight's last was 2025年2月期) shows in EDINET. It says
 *                  "stopped", not why — a person confirms the listing status.
 *   tender-offer   a 意見表明報告書 / 公開買付届出書 / 公開買付報告書 (or their 訂正) that is about the
 *                  company — filed by it, or naming it as the subject or issuer.
 *
 * Deliberately NOT here: 臨時報告書. Its 提出事由 is an item number of the Cabinet Office ordinance
 * (第19条第2項第○号); the routine 議決権行使結果 (9号の2) alone is half of all of them, and the other items
 * are too many and too common (a majority of companies would be flagged) to mean "look at this".
 * 上場廃止 and 株式併合 are not visible in a day index at all — a delisting is known from the
 * exchange, not from EDINET — so they stay a human question.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { indexDir } from "../research/edinet.mjs";

/** 意見表明報告書 290/300, 公開買付届出書 240/250, 公開買付報告書 270/280, 公開買付撤回届出書 260. */
const TENDER_OFFER_TYPES = new Set(["240", "250", "260", "270", "280", "290", "300"]);
/** 大量保有報告書 / 変更報告書: filed by a shareholder, so the filer's name says nothing about the company. */
const HOLDER_REPORTS = new Set(["350", "360"]);

/** A name as EDINET prints it, comparable: full-width → half-width, no spaces. */
export const normalizeName = (/** @type {string | null | undefined} */ name) => (name ?? "").normalize("NFKC").replace(/\s+/g, "");

/**
 * @typedef {{ kind: "name-change" | "tender-offer" | "stopped-filing", date: string, docID: string, description: string, from?: string, to?: string }} PostFilingEvent
 */

/**
 * @param {{ id: string, code: string, submitted: string, filerName?: string, periodEnd?: string }[]} companies
 * @param {string} [root] cache root (default: the EDINET cache)
 * @param {string} [today] YYYY-MM-DD the stopped-filing test is made against
 * @returns {Map<string, PostFilingEvent[]>} company id → events, oldest first (companies without any are absent)
 */
export function scanPostFilingEvents(companies, root = undefined, today = new Date().toISOString().slice(0, 10)) {
  const dir = root ? join(root, "index") : indexDir();
  const out = new Map();
  if (!existsSync(dir) || companies.length === 0) return out;
  const byCode = new Map(companies.map((c) => [c.code, c]));
  const earliest = companies.map((c) => c.submitted).filter(Boolean).sort()[0] ?? "";

  // One pass: keep only rows that could matter (a wanted company's own filings, or any tender-offer document).
  /** @type {{ day: string, row: any }[]} */
  const kept = [];
  /** @type {Map<string, string>} securities code (4) → EDINET code, from the company's own filings */
  const edinetOf = new Map();
  for (const file of readdirSync(dir).sort()) {
    const day = file.slice(0, 10);
    if (!file.endsWith(".json") || day < earliest) continue;
    for (const row of JSON.parse(readFileSync(join(dir, file), "utf8")).results ?? []) {
      const code = row.secCode?.slice(0, 4);
      const own = code && byCode.has(code);
      if (own && row.edinetCode && !HOLDER_REPORTS.has(row.docTypeCode) && !TENDER_OFFER_TYPES.has(row.docTypeCode)) edinetOf.set(code, row.edinetCode);
      if (own || TENDER_OFFER_TYPES.has(row.docTypeCode)) kept.push({ day, row });
    }
  }
  const codeOfEdinet = new Map([...edinetOf].map(([code, edinet]) => [edinet, code]));

  const add = (/** @type {string} */ id, /** @type {PostFilingEvent} */ event) => out.set(id, [...(out.get(id) ?? []), event]);
  for (const { day, row } of kept) {
    const ownCode = row.secCode?.slice(0, 4);
    if (TENDER_OFFER_TYPES.has(row.docTypeCode)) {
      const code = (ownCode && byCode.has(ownCode) && ownCode) || codeOfEdinet.get(row.subjectEdinetCode) || codeOfEdinet.get(row.issuerEdinetCode);
      const company = code && byCode.get(code);
      if (company && day > company.submitted) add(company.id, { kind: "tender-offer", date: day, docID: row.docID, description: row.docDescription });
      continue;
    }
    const company = ownCode && byCode.get(ownCode);
    if (!company || day <= company.submitted || HOLDER_REPORTS.has(row.docTypeCode)) continue;
    if (edinetOf.get(ownCode) !== row.edinetCode || !company.filerName || !row.filerName) continue;
    if (normalizeName(row.filerName) !== normalizeName(company.filerName)) {
      add(company.id, { kind: "name-change", date: day, docID: row.docID, description: row.docDescription, from: company.filerName, to: row.filerName });
    }
  }
  // A 有報 that ended long ago with none after it.
  const limit = new Date(Date.parse(`${today}T00:00:00Z`) - 14 * 30.5 * 86_400_000).toISOString().slice(0, 10);
  const laterAnnual = new Set(kept.filter(({ day, row }) => row.docTypeCode === "120" && byCode.get(row.secCode?.slice(0, 4))?.submitted < day).map(({ row }) => row.secCode.slice(0, 4)));
  for (const company of companies) {
    if (company.periodEnd && company.periodEnd < limit && !laterAnnual.has(company.code)) {
      add(company.id, { kind: "stopped-filing", date: company.periodEnd, docID: `stopped-${company.periodEnd}`, description: `決算期末 ${company.periodEnd} から14か月以上、次の有報が出ていない` });
    }
  }
  // One name-change per new name (the first filing under it), tender-offer documents all kept.
  for (const [id, events] of out) {
    const seen = new Set();
    out.set(id, events.filter((e) => e.kind !== "name-change" || (!seen.has(e.to) && seen.add(e.to))).sort((a, b) => a.date.localeCompare(b.date)));
  }
  return out;
}

/** One line a person can act on. */
export function describeEvents(/** @type {PostFilingEvent[]} */ events) {
  return events
    .slice(0, 4)
    .map((e) => (e.kind === "stopped-filing" ? e.description : e.kind === "name-change" ? `提出者名が ${e.from} → ${e.to}（${e.date}、${e.docID}）` : `${e.description}（${e.date}、${e.docID}）`))
    .join("／");
}
