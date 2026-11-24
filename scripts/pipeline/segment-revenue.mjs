/**
 * Revenue by business, transcribed from the segment note's XBRL (JCE-038) — not typed by an agent.
 *
 * The segment note tags each reportable segment's 外部顧客への売上高 (J-GAAP `jpcrp_cor:RevenuesFromExternalCustomers`,
 * IFRS `jpigp_cor:RevenueFromExternalCustomersIFRS`) in a context named after the filer's own segment member
 * (checked against real filings, 2026-11-09). The member's name is English; its Japanese name is in the filing's
 * label linkbase, and THAT is what is matched against the entry's businesses — exactly, after removing a trailing
 * 「事業」「セグメント」「部門」 — so a business gets an amount only when the filing calls the segment by its name.
 *
 * Two checks keep a wrong set out: the reportable members must add up to the filing's own ReportableSegmentsMember
 * total (a product-axis or regional member mixed in would not), and every member with an amount must map to a
 * different business. Anything else is no table, never a partial or guessed one. US GAAP filers do not tag these.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { downloadDocument } from "../research/edinet.mjs";

/**
 * The three spellings seen in real filings (2026-11-09): J-GAAP RevenuesFromExternalCustomers, IFRS
 * RevenueFromExternalCustomersIFRS (アイシン) and SalesToExternalCustomersIFRS (AGC).
 */
const ELEMENT = /^(?:jpcrp_cor|jpigp_cor):(?:Revenues?From|SalesTo)ExternalCustomers(?:IFRS)?$/;
/**
 * The taxonomy's own その他 members: outside the reportable segments (most filers), or inside them (愛知製鋼 FY2025
 * tags its その他 as OtherReportableSegmentsMember, counted in the reportable total).
 */
const OTHER = "OperatingSegmentsNotIncludedInReportableSegmentsAndOtherRevenueGeneratingBusinessActivitiesMember";
const OTHER_REPORTABLE = "OtherReportableSegmentsMember";
/** A filer's own member in a context id: `jpcrp030000-asr_E01163-000` + `ConstructionAnd…Member`. */
const FILER_MEMBER = /^(jpcrp\d{6}-[a-z]{3}_[A-Z]\d{5}-\d{3})([A-Za-z0-9]+Member)$/;

const amountOf = (/** @type {string} */ v) => {
  const s = String(v).replace(/,/g, "").trim();
  if (/^[－\-—]$/.test(s) || s === "") return 0;
  const n = Number(s);
  return Number.isSafeInteger(n) ? n : null;
};

/**
 * One year's external revenue per segment member, as tagged — the current year (`CurrentYearDuration`) or the
 * prior year's column of the same note (`Prior1YearDuration`, JCE-097). Null when the filing tags none, or when
 * the members do not add up to its own total.
 * @param {Record<string, string>[]} rows the type=5 CSV rows
 * @param {string} [period] the duration context of the year to read
 * @returns {{ label: string, items: { member: string, other: boolean, amount: number }[] } | null}
 */
export function segmentRevenueFacts(rows, period = "CurrentYearDuration") {
  const elements = [...new Set(rows.map((r) => r["要素ID"]).filter((e) => ELEMENT.test(e ?? "")))];
  for (const element of elements) {
    const facts = memberFacts(rows, element, period);
    if (facts) return { label: facts.label.replace(/[（(]IFRS[)）]/g, "").trim() || "外部顧客への売上高", items: facts.items };
  }
  return null;
}

/**
 * One element's values per segment member for one year, held to the same rules as the revenue table: every member
 * tagged once, and the members adding up (within the note's rounding) to the filing's own reportable or overall total.
 * Shared by the revenue table and the segment profit block (JCE-110), so both read members the same way.
 * @param {Record<string, string>[]} rows
 * @param {string} element the full element id, e.g. jppfs_cor:OperatingIncome
 * @param {string} period
 * @returns {{ label: string, items: { member: string, other: boolean, amount: number }[] } | null}
 */
export function memberFacts(rows, element, period = "CurrentYearDuration") {
  const head = new RegExp(`^${period}(_|$)`);
  const strip = new RegExp(`^${period}_?`);
  {
    const tagged = rows.filter((r) => r["要素ID"] === element && head.test(r["コンテキストID"] ?? ""));
    if (tagged.length === 0) return null;
    /** @type {Map<string, Set<number | null>>} */
    const byContext = new Map();
    for (const r of tagged) {
      const context = r["コンテキストID"].replace(strip, "");
      if (!byContext.has(context)) byContext.set(context, new Set());
      byContext.get(context)?.add(amountOf(r["値"]));
    }
    const one = (/** @type {string} */ context) => {
      const values = byContext.get(context);
      return values && values.size === 1 ? [...values][0] : null;
    };
    const items = [];
    for (const context of byContext.keys()) {
      const match = FILER_MEMBER.exec(context);
      if (!match && context !== OTHER && context !== OTHER_REPORTABLE) continue;
      const amount = one(context);
      if (amount === null) return null; // tagged twice with different values: no table rather than a pick
      items.push({ member: match ? `${match[1]}_${match[2]}` : context, other: !match, amount });
    }
    const reportable = items.filter((i) => !i.other || i.member === OTHER_REPORTABLE);
    if (reportable.length === 0) return null;
    // Checked against whichever total the filing prints: the reportable segments' (A&Aマテリアル), or the one that
    // includes その他 (AGC prints only that). Each figure is rounded to the note's unit, so the members may miss the
    // total by one unit each (A&A FY2025: 23,067 + 22,575 against a printed 45,643百万円); a member from another axis
    // would miss by far more.
    const sum = (/** @type {{ amount: number }[]} */ list) => list.reduce((s, i) => s + i.amount, 0);
    const checks = [
      [one("ReportableSegmentsMember"), reportable],
      [one("TotalOfReportableSegmentsAndOthersMember"), items],
    ].filter(([total]) => total !== null && total !== undefined);
    if (checks.length === 0) return null;
    const fits = checks.some(([total, list]) => {
      const unit = [.../** @type {any[]} */ (list).map((i) => i.amount), total].every((a) => a % 1_000_000 === 0) ? 1_000_000 : 1_000;
      return Math.abs(sum(/** @type {any[]} */ (list)) - /** @type {number} */ (total)) <= unit * /** @type {any[]} */ (list).length;
    });
    if (!fits) return null;
    return { label: (tagged[0]["項目名"] ?? "").trim(), items };
  }
}

/** The measures filers tag segment profit with, as found in real filings (2026-11-24 probe: ADEKA, アキレス, AGS, SUBARU). */
const SEGMENT_PROFIT_ELEMENTS = ["jppfs_cor:OperatingIncome", "jppfs_cor:OrdinaryIncome", "jpigp_cor:OperatingProfitLossIFRS", "jpigp_cor:ProfitLossBeforeTaxIFRS"];
/** The segment's own sales including inter-segment sales — the base a segment's profit is earned on. */
const SEGMENT_SALES_ELEMENTS = ["jppfs_cor:NetSales", "jppfs_cor:OperatingRevenue1", "jpigp_cor:RevenueIFRS"];

/**
 * Segment profit and the segment's own sales for one year (JCE-110 第3段階), or the reason there are none. Exactly one
 * profit element and one sales element must be tagged per member and close against the filing's own total; two
 * candidates that both close (a filer tagging 営業利益 and 経常利益 per segment) is ambiguous and gives nothing.
 * @param {Record<string, string>[]} rows
 * @param {string} [period]
 */
export function segmentProfitFacts(rows, period = "CurrentYearDuration") {
  const pick = (elements) => {
    const found = elements.map((e) => memberFacts(rows, e, period)).filter((f) => f !== null);
    return found.length === 1 ? found[0] : found.length === 0 ? { problem: "none" } : { problem: "ambiguous" };
  };
  const profit = pick(SEGMENT_PROFIT_ELEMENTS);
  if ("problem" in profit) return { problem: profit.problem === "none" ? "セグメント利益が無いか、合計と一致しない" : "セグメント利益の要素が複数ある" };
  const sales = pick(SEGMENT_SALES_ELEMENTS);
  if ("problem" in sales) return { problem: sales.problem === "none" ? "セグメントの売上高が無いか、合計と一致しない" : "セグメントの売上高の要素が複数ある" };
  return { profit, sales };
}

/**
 * The entry's `segmentRevenue.profit` (JCE-110), or the reason there is none: every business of the revenue table gets
 * its segment's profit and own sales, or nothing is stored — never a partial set beside a full revenue table.
 * @param {ReturnType<typeof segmentProfitFacts>} facts
 * @param {Map<string, string>} labels member id → Japanese name (memberLabels)
 * @param {{ id: string, name: string, shortName?: string }[]} businesses
 * @param {{ items: { businessId: string }[] }} revenue the entry's segmentRevenue
 */
export function segmentProfitBlock(facts, labels, businesses, revenue) {
  if ("problem" in facts) return { problem: facts.problem };
  const profit = mapSegmentsToBusinesses(facts.profit, labels, businesses);
  if ("problem" in profit) return { problem: `利益: ${profit.problem}` };
  const sales = mapSegmentsToBusinesses(facts.sales, labels, businesses);
  if ("problem" in sales) return { problem: `売上: ${sales.problem}` };
  const salesOf = new Map(sales.items.map((i) => [i.businessId, i.amount]));
  const profitOf = new Map(profit.items.map((i) => [i.businessId, i.amount]));
  const items = [];
  for (const { businessId } of revenue.items) {
    const p = profitOf.get(businessId);
    const s = salesOf.get(businessId);
    if (p === undefined || s === undefined) return { problem: `事業 ${businessId} の利益または売上がない` };
    if (s <= 0) return { problem: `事業 ${businessId} の売上が正でない` };
    items.push({ businessId, profit: p, sales: s });
  }
  const label = facts.profit.label.replace(/[（(]IFRS[)）]/g, "").replace(/又は.*$/, "").replace(/（△.*?）$/, "").trim();
  return { label: label || "セグメント利益", items };
}

/**
 * Japanese standard labels of a filing's own elements, by element id, from its label linkbase (*_lab.xml).
 * @param {string[]} documents the linkbase files' text
 */
export function memberLabels(documents) {
  /** @type {Map<string, string>} */
  const labels = new Map();
  const attrs = (/** @type {string} */ tag) => Object.fromEntries([...tag.matchAll(/([\w:.-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  for (const text of documents) {
    const locs = new Map(); // xlink:label → element id
    for (const m of text.matchAll(/<(?:[\w-]+:)?loc\b[^>]*>/g)) {
      const a = attrs(m[0]);
      if (a["xlink:href"] && a["xlink:label"]) locs.set(a["xlink:label"], a["xlink:href"].split("#")[1]);
    }
    const resources = new Map(); // xlink:label → text, standard role in Japanese only
    for (const m of text.matchAll(/<(?:[\w-]+:)?label\b([^>]*)>([^<]*)<\/(?:[\w-]+:)?label>/g)) {
      const a = attrs(m[1]);
      const role = a["xlink:role"] ?? "http://www.xbrl.org/2003/role/label";
      if (role === "http://www.xbrl.org/2003/role/label" && (a["xml:lang"] ?? "ja") === "ja") resources.set(a["xlink:label"], m[2].trim());
    }
    for (const m of text.matchAll(/<(?:[\w-]+:)?labelArc\b[^>]*>/g)) {
      const a = attrs(m[0]);
      const id = locs.get(a["xlink:from"]);
      const label = resources.get(a["xlink:to"]);
      if (id && label && !labels.has(id)) labels.set(id, label);
    }
  }
  return labels;
}

/** The label linkbase files of an extracted type=1 zip. */
export function labelDocuments(/** @type {string} */ extractedDir) {
  const publicDoc = join(extractedDir, "XBRL", "PublicDoc");
  if (!existsSync(publicDoc)) return [];
  return readdirSync(publicDoc).filter((f) => /_lab\.xml$/.test(f)).map((f) => readFileSync(join(publicDoc, f), "utf8"));
}

const normalize = (/** @type {string | undefined} */ s) =>
  (s ?? "").normalize("NFKC").replace(/\s+/g, "").replace(/(事業|セグメント|部門)$/, "");

/**
 * The entry's `segmentRevenue` items: each tagged member matched by its Japanese name to one top-level business.
 * @param {{ items: { member: string, other: boolean, amount: number }[] }} facts
 * @param {Map<string, string>} labels
 * @param {{ id: string, name: string, shortName?: string }[]} businesses
 * @returns {{ items: { businessId: string, amount: number }[] } | { problem: string }}
 */
export function mapSegmentsToBusinesses(facts, labels, businesses) {
  const used = new Set();
  const items = [];
  for (const fact of facts.items) {
    const name = fact.other ? "その他" : labels.get(fact.member);
    if (!name) return { problem: `セグメント ${fact.member} の日本語名がラベルにない` };
    const business = businesses.find((b) => normalize(b.name) === normalize(name) || (b.shortName && normalize(b.shortName) === normalize(name)));
    if (!business) {
      if (fact.amount === 0) continue;
      return { problem: `セグメント「${name}」に当たる事業がない` };
    }
    if (used.has(business.id)) return { problem: `事業「${business.name}」に2つのセグメントが当たる` };
    used.add(business.id);
    items.push({ businessId: business.id, amount: fact.amount });
  }
  return items.length > 0 ? { items } : { problem: "対応する事業がない" };
}

const DOMESTIC = new Set(["日本", "本邦", "国内"]);
const UNIT = { 百万円: 1_000_000, 千円: 1_000, 円: 1 };

/**
 * 地域ごとの情報 (売上高) from a note's text, in yen: `{ label, items: [{ region, domestic, amount }] }`, or null.
 *
 * EDINET's CSV gives the note as text with the table cells run together — 「日本2,175,2162,316,889米国…合計4,896,104
 * 5,117,764」 (アイシン FY2025): a region name, then the prior and the current year's figure. Read that way, a misread
 * is likely, so nothing is returned unless the regions add up to the printed 合計 AND the 合計 is the consolidated
 * revenue the entry already has (`revenueYen`, from the five-year table). A note that omits the table (「本邦の外部顧客
 * への売上高が…90％を超えるため、記載を省略」) gives null: the share is then not computable, and is not estimated.
 * @param {string} text the note (an IFRS geographical-areas block, or the J-GAAP segment note that contains it)
 * @param {number | null} revenueYen
 */
export function regionalRevenueFromText(text, revenueYen) {
  if (!text || !revenueYen) return null;
  const flat = text.normalize("NFKC").replace(/\s+/g, "");
  // The first heading: revenue comes before 非流動資産 in the note (AGC's says 「地域別」 for both). The J-GAAP note's
  // prior-year table is cut off before this is called (regionalNoteOf starts at the last 「地域ごとの情報」).
  const headings = ["地域ごとの情報", "地域に関する情報", "地域別"].map((h) => flat.indexOf(h)).filter((i) => i !== -1);
  const from = headings.length > 0 ? Math.min(...headings) : 0;
  const unitMatch = /単位:?(百万円|千円|円)/.exec(flat.slice(from));
  if (!unitMatch) return null;
  const unit = UNIT[/** @type {keyof typeof UNIT} */ (unitMatch[1])];
  const start = from + unitMatch.index + unitMatch[0].length;
  const end = flat.indexOf("合計", start);
  if (end === -1) return null;
  const numbers = (/** @type {string} */ blob) => [...blob.matchAll(/\d{1,3}(?:,\d{3})*/g)].map((m) => Number(m[0].replace(/,/g, "")));
  const totalBlob = /^合計([\d,]+)/.exec(flat.slice(end));
  if (!totalBlob) return null;
  const total = numbers(totalBlob[1]).at(-1);
  const rows = [...flat.slice(start, end).matchAll(/([^\d,()（）△\-－]+?)([\d,]+)(?=[^\d,]|$)/g)]
    .map((m) => ({ region: m[1].replace(/^[)）]/, ""), values: numbers(m[2]) }))
    // Column headings carry dates (「自2025年4月1日」), which read as rows of small numbers; a region row's figures
    // are the table's columns, so a row whose count differs from the 合計 row's is not a region.
    .filter((r) => r.values.length === numbers(totalBlob[1]).length && !/^[自至年月日期]+$/.test(r.region))
    .filter((r) => !/^[(（]?うち/.test(r.region));
  if (rows.length < 2 || total === undefined) return null;
  // A region printed twice (「その他」 under アジア and under 米州) is a two-level table read flat: the amounts may add
  // up, but which その他 is which is lost. No table rather than an ambiguous one.
  if (new Set(rows.map((r) => r.region)).size !== rows.length) return null;
  const current = rows.map((r) => ({ region: r.region, amount: /** @type {number} */ (r.values.at(-1)) }));
  const sum = current.reduce((s, r) => s + r.amount, 0);
  if (Math.abs(sum - total) > rows.length) return null; // each figure is rounded to the unit: one unit per row
  if (Math.abs(total * unit - revenueYen) > unit) return null;
  const domestic = current.filter((r) => DOMESTIC.has(r.region));
  if (domestic.length !== 1) return null;
  return { items: current.map((r) => ({ region: r.region, domestic: DOMESTIC.has(r.region), amount: r.amount * unit })) };
}

/**
 * The text 地域ごとの情報 is read from: IFRS filers tag it as its own block; J-GAAP filers print it inside the segment
 * note, from its last 「地域ごとの情報」 (the current year's) on. Kept short so the pack does not carry the whole note.
 * @param {Record<string, string>[]} rows
 */
export function regionalNoteOf(rows) {
  const current = rows.filter((r) => /^CurrentYear/.test(r["コンテキストID"] ?? ""));
  const own = current.find((r) => /InformationAboutGeographicalAreas\w*TextBlock$/.test(r["要素ID"] ?? ""));
  if (own) return String(own["値"]).slice(0, 6000);
  const note = current.find((r) => /NotesSegmentInformation\w*TextBlock$/.test(r["要素ID"] ?? ""));
  if (!note) return null;
  const text = String(note["値"]);
  const at = text.lastIndexOf("地域ごとの情報");
  return at === -1 ? null : text.slice(at, at + 6000);
}

/**
 * The entry's `segmentRevenue` for its newest year, or null. `facts` carries each member's Japanese name already
 * (`name`), as packs and drafts store it.
 * @param {{ label: string, items: { member: string, other: boolean, amount: number, name?: string | null }[] } | null | undefined} facts
 * @param {{ id: string, name: string, shortName?: string }[]} businesses
 * @param {{ fiscalYear: string, periodEnd: string, revenue: number | null }} year
 * @param {string} sourceId
 */
export function segmentRevenueBlock(facts, businesses, year, sourceId) {
  if (!facts || businesses.length < 2) return null;
  const labels = new Map(facts.items.filter((i) => i.name).map((i) => [i.member, /** @type {string} */ (i.name)]));
  const mapped = mapSegmentsToBusinesses(facts, labels, businesses);
  if ("problem" in mapped) return null;
  // The segments must measure the revenue line the entry shows. When they add up to more than it, the note is on a
  // wider basis (第一生命: segments on 経常収益 against 保険料等収入; retailers whose segments add rental income to
  // 売上高), and printing them as 「外部顧客への売上高」 beside that revenue would mislead: no table.
  const sum = mapped.items.reduce((total, i) => total + i.amount, 0);
  if (year.revenue == null || sum > year.revenue + 1_000_000 * mapped.items.length) return null;
  return { fiscalYear: year.fiscalYear, periodEnd: year.periodEnd, label: facts.label, items: mapped.items, sourceIds: [sourceId], locator: "【セグメント情報】" };
}

/**
 * The entry's `regionalRevenue` for its newest year, or null.
 * @param {string | null | undefined} note from regionalNoteOf
 * @param {{ fiscalYear: string, periodEnd: string, revenue: number | null, revenueLabel?: string }} year
 * @param {string} sourceId
 */
export function regionalRevenueBlock(note, year, sourceId) {
  const parsed = note ? regionalRevenueFromText(note, year.revenue) : null;
  if (!parsed) return null;
  return {
    fiscalYear: year.fiscalYear,
    periodEnd: year.periodEnd,
    label: year.revenueLabel ?? "売上高",
    items: parsed.items,
    sourceIds: [sourceId],
    locator: "【関連情報】（地域ごとの情報）",
  };
}

/** Segment facts with each member's Japanese name attached, as packs and drafts store them. */
export function namedSegmentFacts(/** @type {Record<string, string>[]} */ rows, /** @type {string[]} */ labelDocs, /** @type {string} */ period = "CurrentYearDuration") {
  const facts = segmentRevenueFacts(rows, period);
  if (!facts) return null;
  const labels = memberLabels(labelDocs);
  return { label: facts.label, items: facts.items.map((i) => ({ ...i, name: i.other ? "その他" : (labels.get(i.member) ?? null) })) };
}

/**
 * The financial record a segment year's prior column belongs to (JCE-097): the record immediately before the
 * segment year, ending a normal twelve months earlier. A gap outside 340–400 days means a year is missing
 * between them or a fiscal-year change sits in between, and the filing's prior column is then not that
 * record's year — no prior block rather than a difference across two different filings' years.
 * @param {{ fiscalYear: string, periodEnd: string }[]} financials
 * @param {string} periodEnd the segment year's period end
 */
export function priorRecordFor(financials, periodEnd) {
  const sorted = [...financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  const at = sorted.findIndex((r) => r.periodEnd === periodEnd);
  if (at <= 0) return null;
  const prev = sorted[at - 1];
  const gapDays = (Date.parse(periodEnd) - Date.parse(prev.periodEnd)) / 86_400_000;
  return gapDays >= 340 && gapDays <= 400 ? prev : null;
}

/**
 * The entry's `segmentRevenue.previous` from the prior column of the same filing, or null. The same
 * all-or-nothing rules as the current year's block: every tagged member must map to a business, and the
 * members must fit within the prior year's revenue line — a partial prior set is never stored.
 * @param {{ items: { member: string, other: boolean, amount: number, name?: string | null }[] } | null | undefined} priorFacts
 * @param {{ id: string, name: string, shortName?: string }[]} businesses
 * @param {{ fiscalYear: string, periodEnd: string, revenue: number | null }} priorYear
 * @returns {{ fiscalYear: string, periodEnd: string, items: { businessId: string, amount: number }[] } | null}
 */
export function segmentRevenuePreviousBlock(priorFacts, businesses, priorYear) {
  if (!priorFacts || businesses.length < 2) return null;
  const labels = new Map(priorFacts.items.filter((i) => i.name).map((i) => [i.member, /** @type {string} */ (i.name)]));
  const mapped = mapSegmentsToBusinesses(priorFacts, labels, businesses);
  if ("problem" in mapped) return null;
  const sum = mapped.items.reduce((total, i) => total + i.amount, 0);
  if (priorYear.revenue == null || sum > priorYear.revenue + 1_000_000 * mapped.items.length) return null;
  return { fiscalYear: priorYear.fiscalYear, periodEnd: priorYear.periodEnd, items: mapped.items };
}

/** The label linkbases of a filing (its type=1 zip, which the five-year table's dates already download). */
export async function labelDocumentsFor(/** @type {string} */ docID) {
  const zip = await downloadDocument(docID, 1);
  if (!zip) return [];
  const dir = `${zip}-extracted`;
  if (!existsSync(dir)) {
    if (readFileSync(zip).subarray(0, 2).toString("latin1") !== "PK") return [];
    mkdirSync(dir, { recursive: true });
    execFileSync("unzip", ["-o", "-q", zip, "-d", dir]);
  }
  return labelDocuments(dir);
}
