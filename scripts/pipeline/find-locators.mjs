/**
 * Where in its filing each sourced item of a registered entry rests — READ ONLY. It proposes a `locator` (the printed
 * heading of the section, e.g. 「【沿革】」) for every item that cites an EDINET 有報 and has none, and writes nothing in
 * src/data: the proposals are a report for a person (docs/continuous-pipeline-design.md, the locator backfill plan).
 *
 *   node --env-file=.env.local scripts/pipeline/find-locators.mjs <company-id> [...]   [--json out/locators.json]
 *   node --env-file=.env.local scripts/pipeline/find-locators.mjs --all [--limit N]    [--json out/locators.json]
 *
 * How, without guessing: the item's own clues — the amounts it quotes (converted to the 百万円 the filing prints), the
 * years and dates it names, 「quoted」 terms, a related company's name — are looked up in the filing's XBRL text sections.
 * The section that contains the most clues is proposed only when it contains strictly more than any other; a tie is
 * settled only by the item kind's own section (a history event by 【沿革】, a related company by 【関係会社の状況】),
 * and otherwise left "ambiguous". An item with no clue found anywhere is "not-found". Figures rows are extracted from the
 * five-year summary by the pipeline itself, so theirs is known, not searched ("mechanical").
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { textBlocks } from "../research/amendments.mjs";
import { downloadDocument, readCsvRows } from "../research/edinet.mjs";
import { docIdOf } from "./source-meta.mjs";

/** XBRL text sections → the heading the 有報 prints. Only these sections are searched. */
export const HEADINGS = /** @type {[RegExp, string][]} */ ([
  [/^BusinessResultsOf(Group|ReportingCompany)TextBlock$/, "【主要な経営指標等の推移】"],
  [/^CompanyHistoryTextBlock$/, "【沿革】"],
  [/^DescriptionOfBusinessTextBlock$/, "【事業の内容】"],
  [/^OverviewOfAffiliatedEntitiesTextBlock$/, "【関係会社の状況】"],
  [/^InformationAboutEmployeesTextBlock$/, "【従業員の状況】"],
  [/^BusinessPolicyBusinessEnvironmentIssuesToAddressEtcTextBlock$/, "【経営方針、経営環境及び対処すべき課題等】"],
  [/^(DisclosureOfSustainabilityRelatedFinancialInformation|Governance|Strategy|RiskManagement|MetricsAndTargets)TextBlock$/, "【サステナビリティに関する考え方及び取組】"],
  [/^BusinessRisksTextBlock$/, "【事業等のリスク】"],
  [/^ManagementAnalysisOfFinancialPositionOperatingResultsAndCashFlowsTextBlock$/, "【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】"],
  [/^CriticalContracts(ForOperation)?TextBlock$/, "【経営上の重要な契約等】"],
  [/^ResearchAndDevelopmentActivitiesTextBlock$/, "【研究開発活動】"],
  [/^OverviewOfCapitalExpendituresEtcTextBlock$/, "【設備投資等の概要】"],
  [/^MajorFacilitiesTextBlock$/, "【主要な設備の状況】"],
  [/^MajorShareholdersTextBlock$/, "【大株主の状況】"],
  [/^ShareholdingsTextBlock$/, "【株式の保有状況】"],
  [/^(NotesSegmentInformation\w*Consolidated\w*|InformationAboutGeographicalAreas\w*|InformationAboutMajorCustomers\w*|DescriptionOfReportableSegments)TextBlock$/, "【経理の状況】（セグメント情報等）"],
  [/^NotesRevenue\w*Consolidated\w*TextBlock$/, "【経理の状況】（収益認識関係）"],
  [/^InformationAboutParentCompanyEtcOfReportingCompanyTextBlock$/, "【提出会社の親会社等の情報】"],
]);

export const headingOf = (/** @type {string} */ element) => HEADINGS.find(([re]) => re.test(element))?.[1] ?? null;

/** The section an item kind belongs to — used only to settle a tie, never to place an item no clue was found for. */
const HOME = { history: "【沿革】", relatedCompanies: "【関係会社の状況】" };

/** A clue found in more sections than this is ignored. */
export const MAX_SPREAD = 3;

const norm = (/** @type {string} */ s) => s.normalize("NFKC").replace(/\s+/g, "");
const PROSE = new Set(["name", "title", "description", "significance", "text", "basis"]);
const textOf = (/** @type {any} */ v, /** @type {string | null} */ key = null) => {
  if (typeof v === "string") return key === null || PROSE.has(key) ? v : "";
  if (Array.isArray(v)) return v.map((x) => textOf(x, key)).join("\n");
  if (v && typeof v === "object") return Object.entries(v).filter(([k]) => k !== "children").map(([k, x]) => textOf(x, k)).join("\n");
  return "";
};
const withCommas = (/** @type {number} */ n) => n.toLocaleString("en-US");

/**
 * The clues an item gives about where it came from. Pure.
 * @param {any} item
 * @param {string} kind businesses | businessModel | history | relatedCompanies | perspectives
 * @param {{ counterpartNames?: string[] }} [ctx]
 */
export function cluesOf(item, kind, ctx = {}) {
  const text = norm(textOf(item));
  const clues = new Set();
  // Amounts, as the filing prints them: 「1,234百万円」 stays 1,234; 「695億19百万円」 and 「2.5兆円」 become 百万円.
  for (const m of text.matchAll(/(?:([\d,.]+)兆)?(?:([\d,.]+)億)?([\d,]+)?百万円/g)) {
    const [, cho, oku, million] = m;
    const n = Math.round(Number((cho ?? "0").replace(/,/g, "")) * 1_000_000 + Number((oku ?? "0").replace(/,/g, "")) * 100 + Number((million ?? "0").replace(/,/g, "")));
    if (n >= 1000) clues.add(withCommas(n));
  }
  for (const m of text.matchAll(/\d{1,3}(?:,\d{3})+/g)) clues.add(m[0]);
  for (const m of text.matchAll(/\d{4}年\d{1,2}月/g)) clues.add(m[0]);
  for (const m of text.matchAll(/「([^「」]{3,40})」/g)) clues.add(m[1]);
  if (kind === "history" && item.year) clues.add(`${item.year}年`);
  for (const n of ctx.counterpartNames ?? []) if (n.length >= 2) clues.add(norm(n));
  return [...clues];
}

/**
 * Propose a locator for one item from the filing's sections. Pure.
 * @param {string[]} clues
 * @param {Record<string, string>} blocks element → text (textBlocks)
 * @param {string} kind
 * @returns {{ result: "proposed" | "ambiguous" | "not-found", locator?: string, how?: "unique" | "home-tiebreak", matched: string[], score: number, runnerUp: number, candidates?: string[] }}
 */
export function locate(clues, blocks, kind) {
  /** @type {Map<string, Set<string>>} */
  const byHeading = new Map();
  for (const [element, body] of Object.entries(blocks)) {
    const heading = headingOf(element);
    if (!heading) continue;
    const hits = byHeading.get(heading) ?? new Set();
    for (const c of clues) if (body.includes(c)) hits.add(c);
    byHeading.set(heading, hits);
  }
  // A clue printed in many sections (the fiscal year 「2025年6月」, the company's own name) says nothing about which one.
  /** @type {Map<string, number>} */
  const spread = new Map();
  for (const s of byHeading.values()) for (const c of s) spread.set(c, (spread.get(c) ?? 0) + 1);
  const telling = (/** @type {string} */ c) => (spread.get(c) ?? 0) <= MAX_SPREAD;
  const ranked = [...byHeading.entries()].map(([h, s]) => ({ h, s: [...s].filter(telling) })).filter((r) => r.s.length > 0).sort((a, b) => b.s.length - a.s.length);
  if (ranked.length === 0) return { result: "not-found", matched: [], score: 0, runnerUp: 0 };
  const top = ranked[0];
  const runnerUp = ranked[1]?.s.length ?? 0;
  const home = HOME[/** @type {keyof typeof HOME} */ (kind)];
  // An item whose own section also matched is not moved elsewhere by a count: a history event dated 2001年4月 that
  // 【沿革】 lists by its year belongs there even if 【経営上の重要な契約等】 also prints the month. A person decides.
  if (home && top.h !== home && ranked.some((r) => r.h === home)) return { result: "ambiguous", matched: top.s, score: top.s.length, runnerUp, candidates: [top.h, home] };
  if (top.s.length > runnerUp) return { result: "proposed", locator: top.h, how: "unique", matched: top.s, score: top.s.length, runnerUp };
  const tied = ranked.filter((r) => r.s.length === top.s.length);
  const own = tied.find((r) => r.h === home);
  if (own) return { result: "proposed", locator: own.h, how: "home-tiebreak", matched: own.s, score: own.s.length, runnerUp };
  return { result: "ambiguous", matched: top.s, score: top.s.length, runnerUp, candidates: tied.map((r) => r.h) };
}

/** Every sourced item of an entry, with a path a person can find it by. */
export function sourcedItems(/** @type {any} */ entry) {
  const out = [];
  const businesses = (/** @type {any[]} */ list, /** @type {string} */ at) =>
    (list ?? []).forEach((b, i) => {
      out.push({ path: `${at}[${i}]`, kind: "businesses", item: b });
      businesses(b.children, `${at}[${i}].children`);
    });
  businesses(entry.businesses, "businesses");
  if (entry.businessModel) out.push({ path: "businessModel", kind: "businessModel", item: entry.businessModel });
  (entry.history ?? []).forEach((/** @type {any} */ h, /** @type {number} */ i) => out.push({ path: `history[${i}]`, kind: "history", item: h }));
  (entry.relatedCompanies ?? []).forEach((/** @type {any} */ r, /** @type {number} */ i) => out.push({ path: `relatedCompanies[${i}]`, kind: "relatedCompanies", item: r }));
  for (const [k, p] of Object.entries(entry.perspectives ?? {})) {
    for (const part of /** @type {const} */ (["disclosed", "analysis"])) if (/** @type {any} */ (p)?.[part]) out.push({ path: `perspectives.${k}.${part}`, kind: "perspectives", item: /** @type {any} */ (p)[part] });
  }
  (entry.financials ?? []).forEach((/** @type {any} */ f, /** @type {number} */ i) => out.push({ path: `financials[${i}]`, kind: "financials", item: f }));
  return out;
}

/** @type {Map<string, Record<string, string>>} */
const blockCache = new Map();
async function blocksOf(/** @type {string} */ docId) {
  if (!blockCache.has(docId)) {
    const zip = await downloadDocument(docId, 5);
    blockCache.set(docId, zip ? textBlocks(readCsvRows(zip)) : {});
  }
  return /** @type {Record<string, string>} */ (blockCache.get(docId));
}

/** The proposals for one registered entry. Reads the entry and the filings; writes nothing. */
export async function findLocators(/** @type {string} */ id, root = process.cwd()) {
  const entry = JSON.parse(readFileSync(join(root, "src/data/companies", `${id}.json`), "utf8"));
  const namesOf = (/** @type {string} */ other) => {
    const p = join(root, "src/data/companies", `${other}.json`);
    if (!existsSync(p)) return [];
    const e = JSON.parse(readFileSync(p, "utf8"));
    return [e.officialName, e.name].filter(Boolean).map((n) => String(n).replace(/株式会社|\(株\)|（株）/g, ""));
  };
  const rows = [];
  for (const { path, kind, item } of sourcedItems(entry)) {
    if (item.locator) {
      rows.push({ path, kind, result: "already-set", locator: item.locator });
      continue;
    }
    const source = (entry.sources ?? []).find((/** @type {any} */ s) => (item.sourceIds ?? []).includes(s.id) && (s.docId ?? docIdOf(s.url)));
    const docId = source ? (source.docId ?? docIdOf(source.url)) : null;
    if (!docId) {
      rows.push({ path, kind, result: "no-edinet-source" });
      continue;
    }
    if (kind === "financials") {
      rows.push({ path, kind, docId, result: "proposed", locator: "【主要な経営指標等の推移】", how: "mechanical", matched: [], score: 0, runnerUp: 0 });
      continue;
    }
    const clues = cluesOf(item, kind, { counterpartNames: kind === "relatedCompanies" ? namesOf(item.companyId) : [] });
    rows.push({ path, kind, docId, ...locate(clues, await blocksOf(docId), kind) });
  }
  /** @type {Record<string, number>} */
  const counts = {};
  for (const r of rows) counts[r.result] = (counts[r.result] ?? 0) + 1;
  return { id, tier: entry.status?.state, counts, rows };
}

if (process.argv[1]?.endsWith("find-locators.mjs")) {
  const args = process.argv.slice(2);
  const valueOf = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
  const jsonPath = valueOf("--json");
  const limit = Number(valueOf("--limit") ?? "Infinity");
  const named = args.filter((a, i) => !a.startsWith("--") && !["--json", "--limit"].includes(args[i - 1]));
  const dir = join(process.cwd(), "src/data/companies");
  const ids = args.includes("--all")
    ? readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(dir, f), "utf8"))).filter((e) => e.status?.state !== "figures-only").map((e) => e.id).slice(0, limit)
    : named;
  if (ids.length === 0) {
    console.error("usage: node --env-file=.env.local scripts/pipeline/find-locators.mjs <company-id> [...] | --all [--limit N]  [--json <file>]");
    process.exit(1);
  }
  const results = [];
  /** @type {Record<string, number>} */
  const total = {};
  for (const id of ids) {
    const r = await findLocators(id);
    results.push(r);
    for (const [k, v] of Object.entries(r.counts)) total[k] = (total[k] ?? 0) + v;
    console.log(`${id}: ${Object.entries(r.counts).map(([k, v]) => `${k} ${v}`).join("・")}`);
  }
  console.log(`\n合計（${ids.length} 社）: ${Object.entries(total).map(([k, v]) => `${k} ${v}`).join("・")}`);
  console.log("読み取りのみ。src/data は変えていない。");
  if (jsonPath) {
    mkdirSync(dirname(jsonPath), { recursive: true });
    writeFileSync(jsonPath, `${JSON.stringify({ total, results }, null, 1)}\n`);
    console.log(`詳細: ${jsonPath}`);
  }
}
