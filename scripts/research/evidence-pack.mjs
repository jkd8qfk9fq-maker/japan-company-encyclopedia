/**
 * Builds an "evidence pack" for one company from its 有価証券報告書 XBRL, so a
 * research agent spends tokens on judgement instead of on finding and reading
 * PDFs.
 *
 *   node scripts/research/evidence-pack.mjs <company-id> <4-digit code> [--from 2026-06-01] [--to 2026-06-30]
 *
 * Writes to <RESEARCH_CACHE>/evidence/<company-id>/:
 *   summary.json          — filing metadata, five-year figures (in yen, tagged), restatement check
 *   indicators.txt        — 主要な経営指標等の推移 as printed, to confirm the tagged values
 *   history.txt           — 沿革
 *   business.txt          — 事業の内容
 *   affiliates.txt        — 関係会社の状況
 *   segments.txt          — セグメント情報 (report segments, and the revenue table)
 *   facilities.txt        — 主要な設備の状況
 *   sections.json         — every other TextBlock, by name, for anything else
 *
 * Both the current and the previous year's filing are read: the previous one
 * is how a restatement is detected, mechanically, instead of by eye.
 *
 * The figures are the filing's own tagged values in yen; nothing is converted
 * or rounded here. Labels come from the filing too (売上高 / 営業収益 / 収益 /
 * 経常収益 …) — the entry must use them verbatim.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir, downloadDocument, findAnnualReports, readCsvRows, textBlockToText } from "./edinet.mjs";

/**
 * Which tagged line is the top line, and which is net income — by element ID,
 * never by label. Labels vary per filer ("売上収益（IFRS）", "営業収益",
 * "当期利益又は当期損失（△）：親会社の所有者に帰属（IFRS）"), but the element is
 * fixed by the taxonomy.
 *
 * The lists are exact on purpose. Substring matching is dangerous here:
 * OrdinaryIncome is 経常収益 (a bank's top line) while OrdinaryIncomeLoss is
 * 経常利益 (a profit), and ProfitLossIFRS is 当期利益 *including*
 * non-controlling interests, which must never be presented as net income.
 * An unrecognised filer fails loudly below rather than producing an entry with
 * a silently missing or wrong row.
 */
const REVENUE_ELEMENTS = new Set([
  "NetSalesSummaryOfBusinessResults", // 売上高 (J-GAAP)
  "RevenueIFRSSummaryOfBusinessResults", // 売上収益 (IFRS)
  "RevenuesUSGAAPSummaryOfBusinessResults", // 売上高 (US GAAP)
  "OperatingRevenue1SummaryOfBusinessResults", // 営業収益
  "OperatingRevenueSummaryOfBusinessResults",
  "OrdinaryIncomeSummaryOfBusinessResults", // 経常収益 (銀行・保険)
  // 生命保険持株会社 may tag 保険料等収入 as its top line instead of 経常収益
  // (第一ライフグループ tags no OrdinaryIncome row at all). Which wording the
  // filing prints is settled by indicators.txt, and the entry must explain that
  // an insurer's top line is not a manufacturer's 売上高.
  "PremiumAndOtherIncomeSummaryOfBusinessResults",
  "NetSalesAndOperatingRevenueSummaryOfBusinessResults",
  "TotalOperatingRevenuesSummaryOfBusinessResults",
  "BusinessRevenueSummaryOfBusinessResults", // 営業収益
  // Some IFRS filers tag 収益 as plain "Income" — ユキグニファクトリー prints
  // 「収益」 at 53,449百万円 above 税引前利益 4,195百万円. NOT_REVENUE excludes every
  // element containing "Income" so that a profit row is never mistaken for a top
  // line, so these two are listed as deliberate exceptions rather than by
  // weakening that rule. If one were ever the wrong row, verify-financials would
  // catch it: the printed label has to end 高／収益／収入／計.
  "IncomeIFRSSummaryOfBusinessResults",
  "IncomeIFRSKeyFinancialData",
  // Extensions a filer coins when the taxonomy has no element for its top line.
  // Each is unambiguously a top line by name, and the printed-label rule in
  // verify-financials — the row must end 高／収益／収入／計 — is what confirms it.
  "BusinessRevenueKeyFinancialData", // 営業収益
  "GrossSalesKeyFinancialData", // 総売上高
  "Revenue2KeyFinancialData",
]);
const NET_INCOME_ELEMENTS = new Set([
  "ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults", // 親会社株主に帰属する当期純利益
  "ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults", // 親会社の所有者に帰属する当期利益
  "NetIncomeLossAttributableToOwnersOfParentUSGAAPSummaryOfBusinessResults",
  "NetIncomeLossSummaryOfBusinessResults",
]);

/**
 * The profit line between revenue and net income, as the filing's own five-year
 * table prints it. It is NOT 営業利益: almost no filer puts operating profit in
 * 主要な経営指標等の推移 — J-GAAP prints 経常利益 and IFRS/US GAAP print 税引前利益,
 * and those are the figures that exist for five years. The entry stores whichever
 * the filer prints, with the filer's own label.
 */
const PROFIT_ELEMENTS = [
  "OrdinaryIncomeLossSummaryOfBusinessResults", // 経常利益又は経常損失（△）
  "ProfitLossBeforeTaxIFRSSummaryOfBusinessResults", // 税引前利益（IFRS）
  "ProfitLossBeforeTaxUSGAAPSummaryOfBusinessResults", // 税引前利益（US GAAP）
  // 総合商社 print 収益 / 売上総利益 / 当期純利益 and tag no pre-tax row at all,
  // so 売上総利益 is the line their own five-year table puts between the top line
  // and net income. Last in preference order: it is a different measure from the
  // rows above, which is exactly why profitLabel travels with the figure.
  "GrossProfitIFRSSummaryOfBusinessResults",
  // Last resort: a handful of filers (デンソー, 日本製鉄, ニコン, 住友商事) print
  // 営業利益 in their five-year table and no 経常利益 or 税引前利益 at all. The
  // column is defined as "the row this filing prints between its top line and
  // net income", so where that row IS 営業利益, that is the honest value — the
  // reason it sits last is that it is a different measure from the rows above,
  // not that it is unusable. profitLabel says which it is.
  "OperatingIncomeSummaryOfBusinessResults",
  "OperatingIncomeLossSummaryOfBusinessResults",
  "OperatingProfitLossIFRSSummaryOfBusinessResults",
  "OperatingIncomeIFRSSummaryOfBusinessResults",
  "OperatingProfitIFRSSummaryOfBusinessResults",
  "OperatingProfitLossIFRSKeyFinancialData",
];
const TOTAL_ASSETS_ELEMENTS = [
  "TotalAssetsSummaryOfBusinessResults",
  "TotalAssetsIFRSSummaryOfBusinessResults",
  "TotalAssetsUSGAAPSummaryOfBusinessResults",
];
/**
 * 純資産. Preference order matters: the total (純資産額 / 資本合計) comes first,
 * and parent-attributable equity is only a fallback for filers that tag no total —
 * the same parent-versus-total distinction that matters for net income.
 */
const NET_ASSETS_ELEMENTS = [
  "NetAssetsSummaryOfBusinessResults", // 純資産額 (J-GAAP, incl. NCI)
  "TotalEquityIFRSSummaryOfBusinessResults", // 資本合計 (IFRS, incl. NCI)
  "EquityIncludingPortionAttributableToNonControllingInterestUSGAAPSummaryOfBusinessResults",
  "EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults", // 親会社の所有者に帰属する持分
  "EquityAttributableToOwnersOfParentUSGAAPSummaryOfBusinessResults", // 株主資本
];
/**
 * Elements that name their accounting standard come FIRST, and the unmarked
 * `NumberOfEmployees` last. 東京海上HD prints two five-year tables and tags the
 * IFRS table's headcount with the unmarked element while the J-GAAP table gets
 * NumberOfEmployeesJapanGAAPKeyFinancialData — so preferring the unmarked one
 * put an IFRS-scope 67,526 into an otherwise J-GAAP row whose real figure is
 * 51,717, showing a 31% jump in staff that never happened.
 */
const EMPLOYEE_ELEMENTS = [
  "NumberOfEmployeesJapanGAAPKeyFinancialData",
  "NumberOfEmployeesJGAAPSummaryOfBusinessResults",
  "NumberOfEmployeesIFRSSummaryOfBusinessResults",
  "NumberOfEmployees",
];

/**
 * A filer whose top line has no standard element tags it with its own extension
 * element instead, in the filer's namespace and with no label at all — Toyota's
 * 営業収益 is `…:OperatingRevenuesIFRSKeyFinancialData`, Sony's
 * 売上高及び金融ビジネス収入 is `…:SalesAndFinancialServicesRevenueIFRSKeyFinancialData`.
 * These are matched by shape, so every candidate is kept and the researcher
 * confirms which line the filing actually prints against indicators.txt.
 */
const REVENUE_EXTENSION = /^(?:Total)?(?:Net)?(?:Sales|Revenue|Revenues|OperatingRevenue|OperatingRevenues)[A-Za-z]*$/;
/** Never a top line: a profit, a margin, or a comprehensive-income row. */
const NOT_REVENUE = /(Profit|Income|Loss|Margin|Ratio|Comprehensive|PerShare|Cost|Expenses)/;

/**
 * A filer whose profit row has no standard element tags it with its own
 * extension, exactly as it does for a non-standard top line — 日本製鉄 prints
 * 事業利益 as `…:BusinessProfitIFRSKeyFinancialData`, with no taxonomy label.
 * Matched only after every standard element has been tried.
 */
const PROFIT_EXTENSION = /^(?:Business|Core|Gross|Operating|Recurring|Ordinary)?(?:Profit|Income)(?:BeforeTax|BeforeIncomeTax|Loss)?[A-Za-z]*$/;
/** Never the profit row: net income itself, comprehensive income, or a ratio. */
const NOT_PROFIT = /(AttributableToOwners|NonControlling|Comprehensive|PerShare|Ratio|Margin|Tax(?:Expense|es)|Equity|Asset)/;
/** 相対年度 → offset from the filing's own fiscal year. */
const YEAR_OFFSET = { 当期: 0, 前期: 1, 前々期: 2, 三期前: 3, 四期前: 4 };

/**
 * Each file takes the first element present. A J-GAAP filer tags a section under
 * jpcrp_cor / jpdei_cor; an IFRS filer tags the financial-statement notes under
 * jpigp_cor instead, which is why the segment note needs both spellings — without
 * the IFRS one, the most important section of the pack is silently absent.
 */
const SECTIONS = {
  "indicators.txt": ["jpcrp_cor:BusinessResultsOfGroupTextBlock"],
  "history.txt": ["jpcrp_cor:CompanyHistoryTextBlock"],
  "business.txt": ["jpcrp_cor:DescriptionOfBusinessTextBlock"],
  "affiliates.txt": ["jpcrp_cor:OverviewOfAffiliatedEntitiesTextBlock"],
  "segments.txt": [
    "jpcrp_cor:NotesSegmentInformationEtcConsolidatedFinancialStatementsTextBlock",
    "jpigp_cor:NotesSegmentInformationConsolidatedFinancialStatementsIFRSTextBlock",
  ],
  "segment-overview.txt": ["jpcrp_cor:DescriptionOfReportableSegmentsTextBlock"],
  // Present only when the company changed its reportable segments — exactly the
  // case the protocol asks a researcher to reason about.
  "segment-changes.txt": [
    "jpigp_cor:DisclosureOfChangesInReportableSegmentsIFRSTextBlock",
    "jpcrp_cor:NotesChangesInReportableSegmentsEtcConsolidatedFinancialStatementsTextBlock",
  ],
  "facilities.txt": ["jpcrp_cor:MajorFacilitiesTextBlock"],
  // MD&A. Always useful, and the only place a US GAAP filer's segment figures
  // survive: those filers put every note into one TextBlock that EDINET
  // truncates (see below), losing セグメント情報 entirely.
  "md-and-a.txt": ["jpcrp_cor:ManagementAnalysisOfFinancialPositionOperatingResultsAndCashFlowsTextBlock"],
  "notes-usgaap.txt": ["jpcrp_cor:NotesToConsolidatedFinancialStatementsUSGAAPTextBlock"],
};

/** EDINET caps a CSV cell at 30,000 characters, cutting long TextBlocks mid-sentence. */
const CSV_CELL_LIMIT = 30000;

/**
 * The filing's cover page and DEI header: 商号, 英訳名, 証券コード, 会計基準,
 * 事業年度, 上場金融商品取引所名. Every one of these is a field an entry needs and
 * none of them is in the body sections, so without this a researcher goes looking
 * for a company web page — which is slower, is a weaker source, and has repeatedly
 * 403'd or 404'd, leaving `nameEn` unfilled when the filing had it all along.
 */
function coverPage(rows) {
  const out = {};
  for (const row of rows) {
    const id = row["要素ID"] ?? "";
    const name = row["項目名"] ?? "";
    const value = (row["値"] ?? "").trim();
    if (!value || value === "－" || value.length > 200) continue;
    if (!/CoverPage$|DEI$/.test(id) && !name.startsWith("上場金融商品取引所名")) continue;
    if (/TextBlock/.test(id)) continue;
    out[name || id] = value;
  }
  return out;
}

/**
 * The label 主要な経営指標等の推移 actually prints for a series, recovered by
 * finding that series' own figures in the printed table and reading backwards.
 *
 * The taxonomy label is not good enough for the page: it carries suffixes no
 * filing prints (「親会社の所有者に帰属する持分（IFRS）」 where 三菱商事 prints
 * 「当社の所有者に帰属する持分」), and some elements carry no label at all
 * (GrossProfitIFRS, whose row 商社 print as 「売上総利益」). Researchers already
 * take revenueLabel and netIncomeLabel from this table by hand; this does the
 * same for the four series filled mechanically.
 *
 * Returns null when the figures cannot be located, and the caller falls back to
 * a cleaned taxonomy label rather than inventing wording.
 */
function printedLabel(indicators, years) {
  if (!indicators || years.length === 0) return null;
  const table = indicators.replace(/\s+/g, "");
  // The printed table is in 百万円 for money and bare counts for people, and its
  // columns run together with no separator, so two consecutive values in a row
  // are a strong, unambiguous anchor.
  //
  // 千円 is here because smaller companies print their five-year table in it —
  // ベルグアース prints 「親会社株主に帰属する当期純利益(千円)」 and 48,327. Without it
  // no printed row was ever found for such a filer, every label fell back to the
  // taxonomy s long form 「…当期純利益又は親会社株主に帰属する当期純損失（△）」 which
  // the filing does not print, and verify-financials rejected the entry. Tried
  // after 百万円 so a large cap still matches on its own unit first.
  for (const divisor of [1_000_000, 1_000, 1]) {
    for (let i = 0; i + 1 < years.length; i++) {
      const a = years[i].value / divisor;
      const b = years[i + 1].value / divisor;
      if (!Number.isInteger(a) || !Number.isInteger(b)) continue;
      // A loss prints as 「△179,522」, not "-179,522", so a pair containing a
      // negative year never matched and the label silently fell back to the
      // taxonomy's — which is where 「経常利益」 came from when the filing prints
      // 「経常利益又は経常損失（△）」. Two of three packs in one batch had it.
      const printed = (n) => (n < 0 ? `△${Math.abs(n).toLocaleString("en-US")}` : n.toLocaleString("en-US"));
      const at = table.indexOf(printed(a) + printed(b));
      if (at < 0) continue;
      const found = labelBefore(table, at);
      if (found) return found;
    }
  }

  /*
    One value, when the filing prints only one.

    A company that began consolidating in its latest year files 主要な経営指標等の推移
    with 「－」 in the other four columns — アートナー prints 12,046,664 for 2026年1月期
    and nothing before it. The pair anchor above cannot form, so every label fell
    back to the taxonomy's, and verify-financials rejected the entry. Twelve of one
    150-company batch were this.

    The value must occur exactly once in the table: a single number is a far weaker
    anchor than two adjacent ones, and 「－」 columns make near-misses likely, so
    ambiguity is refused rather than guessed at.
  */
  for (const divisor of [1_000_000, 1_000, 1]) {
    for (const year of years) {
      const n = year.value / divisor;
      if (!Number.isInteger(n)) continue;
      const printed = n < 0 ? `△${Math.abs(n).toLocaleString("en-US")}` : n.toLocaleString("en-US");
      const first = table.indexOf(printed);
      if (first < 0 || table.indexOf(printed, first + 1) !== -1) continue;
      const found = labelBefore(table, first);
      if (found) return found;
    }
  }
  return null;
}

/**
 * The row heading immediately before a figure in the flattened table.
 *
 * Walks back to the end of the previous *figure*, not the previous digit.
 * A row label often carries a footnote marker — コマツ prints
 * 「売上高（注）２（百万円）」 — and stopping at that ２ left nothing but 「）（百万円）」,
 * so the label silently fell back to the taxonomy's 「売上高（US GAAP）」, which the
 * filing never prints. Real figures are three or more digits, usually
 * comma-grouped; footnote markers are not.
 */
function labelBefore(table, at) {
      const prefix = table.slice(0, at);
      const previousFigure = [...prefix.matchAll(/[0-9０-９][0-9０-９,，]{2,}/g)].pop();
      const start = previousFigure ? previousFigure.index + previousFigure[0].length : 0;
      let label = prefix.slice(start);
      let previous;
      do {
        previous = label;
        label = label
          // Remnants of the 決算年月 header immediately above the first row.
          .replace(/^(?:[0-9０-９]{1,4}\s*年)?\s*(?:[0-9０-９]{1,2}\s*月)?\s*(?:[0-9０-９]{1,2}\s*日)?/, "")
          .replace(/^[年月日度回次)）\s]+/, "")
          // A footnote marker attached to the row label: 「売上高（注）２」.
          .replace(/[（(]\s*注\s*[）)]\s*[0-9０-９]*\s*$/, "")
          // A trailing unit, including the 「(百万円)」 form — but never a
          // parenthetical that is part of the label itself, such as
          // 「当期利益(親会社の所有者に帰属)」.
          .replace(/[（(]\s*(百万円|千円|billion|円|名|人|％|%)\s*[）)]$/, "")
          .replace(/(百万円|千円|円|名|人|％|%|〃|－|—|-|、|：|:|\s)+$/, "")
          .trim();
      } while (label !== previous);
      if (label.length >= 2 && label.length <= 40) return label;
  return null;
}

/** 相対年度, falling back to the context id (extension rows often leave it blank). */
function relativeYear(row) {
  const stated = row["相対年度"];
  if (stated && stated in YEAR_OFFSET) return stated;
  const context = row["コンテキストID"] ?? "";
  if (/^CurrentYear/.test(context)) return "当期";
  const prior = /^Prior(\d)Year/.exec(context);
  return prior ? { 1: "前期", 2: "前々期", 3: "三期前", 4: "四期前" }[prior[1]] : null;
}

/**
 * Five-year figures from one filing, labels as filed.
 *
 * Consolidated rows, except for a filer that has no consolidated statements at
 * all. A company with no subsidiaries files 主要な経営指標等の推移 solely on a
 * 提出会社 basis, every row carrying NonConsolidatedMember — so excluding that
 * dimension threw away the only table it has, and the extractor failed with
 * 「no revenue element matched」 on 11 of the first 40 companies drawn from the
 * whole listed universe. Those are not exotic filings; they are most small caps.
 *
 * The fallback is deliberately all-or-nothing: it is used only when the filing
 * tags no consolidated summary row whatsoever, never to fill a gap in a
 * consolidated table. `nonConsolidated` is returned so the pack, the draft and
 * ultimately the page can say the figures are the parent company alone — the same
 * distinction `revenueBasis` exists for.
 */
function fiveYearFigures(rows, periodEnd, missing = [], indicatorsText = null) {
  const inTable = rows.filter(
    (r) =>
      // 主要な経営指標等の推移 is tagged either with the standard summary elements
      // or, for a line the taxonomy has no element for, a KeyFinancialData extension.
      /(SummaryOfBusinessResults|KeyFinancialData)$/.test(r["要素ID"]) && r["単位"] === "円",
  );
  // Non-consolidated rows carry the dimension in their context id.
  const isNonConsolidated = (r) => /NonConsolidated/i.test(r["コンテキストID"] ?? "");
  const consolidated = inTable.filter((r) => !isNonConsolidated(r));
  const nonConsolidated = consolidated.length === 0;
  const summary = nonConsolidated ? inTable.filter(isNonConsolidated) : consolidated;
  const pick = (elements, extension) => {
    const rowsFor = summary.filter((r) => {
      const local = r["要素ID"].replace(/^.*:/, "");
      if (elements.has(local)) return true;
      if (!extension || r["要素ID"].startsWith("jpcrp_cor:") || r["要素ID"].startsWith("jpigp_cor:")) return false;
      const stem = local.replace(/(IFRS|USGAAP|JPGAAP)?KeyFinancialData$/, "").replace(/SummaryOfBusinessResults$/, "");
      return extension.test(stem) && !NOT_REVENUE.test(stem);
    });
    const byElement = new Map();
    for (const r of rowsFor) {
      if (!byElement.has(r["要素ID"])) byElement.set(r["要素ID"], []);
      byElement.get(r["要素ID"]).push(r);
    }
    // A filer tags one element for the line it actually reports; if several
    // match, keep them all and let the researcher confirm against indicators.txt.
    return [...byElement.entries()]
      .map(([element, list]) => ({
        element,
        // Extension elements carry no taxonomy label at all, and the taxonomy's
        // wording is not what the filing prints anyway, so the printed table is
        // read first. The researcher still confirms the label in indicators.txt.
        label: (list[0]["項目名"] ?? "").replace(/、経営指標等$/, "") || null,
        years: list
          .map((r) => ({ row: r, relative: relativeYear(r) }))
          .filter(({ relative }) => relative)
          .map(({ row, relative }) => ({
            relative,
            fiscalYearEnd: shiftYear(periodEnd, YEAR_OFFSET[relative]),
            yen: Number(row["値"]),
          }))
          // A column the filing prints as 「－」 parses to NaN — the IFRS 移行日
          // column carries balances but no revenue or profit. Keeping those made
          // the restatement check report a difference on every such row, because
          // NaN never equals NaN, and sent a researcher hunting a restatement
          // that never happened (スズキ, 2026-09-20).
          .filter((y) => Number.isFinite(y.yen))
          .sort((a, b) => a.fiscalYearEnd.localeCompare(b.fiscalYearEnd)),
      }))
      .filter((candidate) => candidate.years.length > 0)
      .map((candidate) => ({
        ...candidate,
        taxonomyLabel: candidate.label,
        label: printedLabel(indicatorsText, candidate.years.map((y) => ({ value: y.yen }))) ?? candidate.label,
      }));
  };
  /**
   * The first element present, in preference order — one series, not a list of
   * candidates, so a mechanical backfill is deterministic. `rowsFor` keeps its
   * own unit filter because employee counts are people, not yen.
   */
  const pickSeries = (elements, { unit = "円", extension = null } = {}) => {
    // A bare year context only. Employee counts are also tagged per segment and
    // per sub-company, and those carry extra dimensions in the context. The one
    // dimension that is allowed is NonConsolidatedMember, and only for a filer
    // that publishes no consolidated statements — for whom that IS the five-year
    // table. Without this these four series came back empty on every such filer
    // while revenue and net income were found, so an entry would have silently
    // shown four blank columns for a company that prints all six.
    const context = nonConsolidated
      ? /^(Current|Prior\d)Year(Instant|Duration)_NonConsolidatedMember$/
      : /^(Current|Prior\d)Year(Instant|Duration)$/;
    const pool = rows.filter(
      (r) =>
        /(SummaryOfBusinessResults|KeyFinancialData)$/.test(r["要素ID"]) &&
        context.test(r["コンテキストID"] ?? "") &&
        (unit === null || r["単位"] === unit),
    );
    // All matching elements, in preference order — not just the first. A filer
    // that changed accounting standard mid-series tags 経常利益 for its J-GAAP
    // years and 税引前利益 for its IFRS years, and the entry needs both
    // (スズキ, 移行日 2023-04-01).
    const found = [];
    for (const element of elements) {
      const list = pool.filter((r) => r["要素ID"].replace(/^.*:/, "") === element);
      if (list.length === 0) continue;
      const years = list
        .map((r) => ({ relative: relativeYear(r), row: r }))
        .filter(({ relative }) => relative)
        .map(({ relative, row }) => ({
          relative,
          fiscalYearEnd: shiftYear(periodEnd, YEAR_OFFSET[relative]),
          value: Number(row["値"]),
        }))
        .filter((y) => Number.isFinite(y.value))
        .sort((a, b) => a.fiscalYearEnd.localeCompare(b.fiscalYearEnd));
      if (years.length === 0) continue;
      const taxonomy = (list[0]["項目名"] ?? "").replace(/、経営指標等$/, "") || null;
      found.push({
        element,
        // The filing's own wording wins; the taxonomy label is the fallback.
        label: printedLabel(indicatorsText, years) ?? taxonomy?.replace(/（(IFRS|US GAAP)）/g, "").replace(/又は.*$/, "").trim() ?? null,
        taxonomyLabel: taxonomy,
        years,
      });
    }
    // Only if no standard element matched: a filer-specific extension carrying
    // a non-standard row (事業利益 …). Kept last so it can never displace a
    // standard 経常利益 or 税引前利益.
    if (found.length === 0 && extension) {
      for (const row of pool) {
        const local = row["要素ID"].replace(/^.*:/, "");
        if (row["要素ID"].startsWith("jpcrp_cor:") || row["要素ID"].startsWith("jpigp_cor:") || row["要素ID"].startsWith("jppfs_cor:")) continue;
        const stem = local.replace(/(IFRS|USGAAP|JPGAAP)?KeyFinancialData$/, "").replace(/SummaryOfBusinessResults$/, "");
        if (!extension.test(stem) || NOT_PROFIT.test(stem)) continue;
        const list = pool.filter((r) => r["要素ID"] === row["要素ID"]);
        const years = list
          .map((r) => ({ relative: relativeYear(r), row: r }))
          .filter(({ relative }) => relative)
          .map(({ relative, row: r }) => ({ relative, fiscalYearEnd: shiftYear(periodEnd, YEAR_OFFSET[relative]), value: Number(r["値"]) }))
          .filter((y) => Number.isFinite(y.value))
          .sort((a, b) => a.fiscalYearEnd.localeCompare(b.fiscalYearEnd));
        if (years.length === 0) continue;
        found.push({ element: local, label: printedLabel(indicatorsText, years), taxonomyLabel: null, years });
        break;
      }
    }
    return found.length > 0 ? found : null;
  };

  const figures = {
    revenue: pick(REVENUE_ELEMENTS, REVENUE_EXTENSION),
    netIncome: pick(NET_INCOME_ELEMENTS, null),
    profit: pickSeries(PROFIT_ELEMENTS, { extension: PROFIT_EXTENSION }),
    totalAssets: pickSeries(TOTAL_ASSETS_ELEMENTS),
    netAssets: pickSeries(NET_ASSETS_ELEMENTS),
    employees: pickSeries(EMPLOYEE_ELEMENTS, { unit: null }),
  };
  // A filer whose top line or net-income element is not in the allowlist must be
  // added to it deliberately, after checking what the filing prints. Returning an
  // empty list here would hand a researcher a pack with a missing row and no sign
  // that anything was wrong.
  for (const [kind, list] of [
    ["revenue", figures.revenue],
    ["netIncome", figures.netIncome],
  ]) {
    if (list.length === 0) {
      const available = [...new Set(summary.map((r) => r["要素ID"].replace(/^.*:/, "")))].join(", ");
      throw new Error(
        `no ${kind} element matched. Check 主要な経営指標等の推移 and add the right element to ` +
          `${kind === "revenue" ? "REVENUE_ELEMENTS" : "NET_INCOME_ELEMENTS"}. Tagged here: ${available}`,
      );
    }
  }
  // These four are not fatal: a filer may genuinely not print one (銀行 tag no
  // 営業利益 line at all), and a missing series becomes a null column, not a guess.
  for (const kind of ["profit", "totalAssets", "netAssets", "employees"]) {
    if (!figures[kind]) missing.push(kind);
  }
  figures.nonConsolidated = nonConsolidated;
  return figures;
}

/**
 * The same fiscal year end, `years` earlier.
 *
 * Naively subtracting from the day number is wrong for a February year end: a
 * 2月期 filer's 2026-02-28 is two years after 2024-02-**29**, because 2024 was a
 * leap year. That put a date on セブン＆アイ's page that never existed as a
 * fiscal year end. So when the base date is the last day of its month, the
 * result is the last day of that month in the target year; otherwise the day is
 * kept as-is (キーエンス closes on the 20th, not a month end).
 */
function shiftYear(isoDate, years) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const target = y - years;
  const lastDayOfMonth = (year) => new Date(Date.UTC(year, m, 0)).getUTCDate();
  const day = d === lastDayOfMonth(y) ? lastDayOfMonth(target) : d;
  return `${target}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * The fiscal year a filing reports on. EDINET leaves `periodEnd` null on a
 * 訂正有価証券報告書, but its title still names the period
 * ("訂正有価証券報告書－第157期(2025/04/01－2026/03/31)"), so read it from there
 * rather than dropping the filing.
 */
function resolvePeriodEnd(filing) {
  if (filing.periodEnd) return filing.periodEnd;
  const match = /－(\d{4})\/(\d{2})\/(\d{2})\)/.exec(filing.docDescription ?? "");
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

/**
 * The filing to build the pack from: the newest 有価証券報告書 (120) for the
 * newest fiscal year. A 訂正 (130) is never the base — it amends an original,
 * and is checked separately so an amendment is reported, not silently adopted.
 */
function pickBase(reports) {
  const dated = reports.map((r) => ({ ...r, resolvedPeriodEnd: resolvePeriodEnd(r) })).filter((r) => r.resolvedPeriodEnd);
  const originals = dated.filter((r) => r.docTypeCode === "120");
  const pool = originals.length > 0 ? originals : dated;
  return pool.sort(
    (a, b) => b.resolvedPeriodEnd.localeCompare(a.resolvedPeriodEnd) || b.submitDateTime.localeCompare(a.submitDateTime),
  )[0];
}

/**
 * Compare this filing's five-year figures against last year's filing.
 *
 * Keyed on the ELEMENT, not the label. Labels are the filer's own printed
 * wording and can change between filings — 三菱ケミカルグループ reclassified
 * 田辺三菱製薬 as a discontinued operation and re-presented the prior year, and
 * with a label-keyed comparison nothing matched, so the check reported
 * "comparedRows: 0, differences: []" and the caller printed
 * 「修正再表示なし」. It was hiding a 459,839百万円 restatement.
 *
 * Zero compared rows therefore means "could not compare", never "no change",
 * and the caller has to say so.
 */
function compare(current, previous) {
  const flat = (figures) =>
    new Map(figures.flatMap((f) => f.years.map((y) => [`${f.element}|${y.fiscalYearEnd}`, y.yen ?? y.value])));
  const now = flat(current);
  const before = flat(previous);
  const differences = [];
  for (const [key, value] of before) {
    if (now.has(key) && now.get(key) !== value) {
      differences.push({ key, previousFiling: value, latestFiling: now.get(key) });
    }
  }
  const comparedRows = [...before.keys()].filter((k) => now.has(k)).length;
  return comparedRows === 0
    ? { comparedRows: 0, differences: [], note: "前期有報と突き合わせられる行がない（一致ではない）。前期有報を直接読んで確認すること" }
    : { comparedRows, differences };
}

/** A filing's five-year figures, or null if EDINET has no CSV for it. */
async function figuresFor(filing) {
  const zip = await downloadDocument(filing.docID, 5);
  if (!zip) return null;
  const rows = readCsvRows(zip);
  return { rows, figures: fiveYearFigures(rows, filing.resolvedPeriodEnd ?? resolvePeriodEnd(filing)) };
}

/**
 * Everything a researcher needs before opening a section file, on one page.
 *
 * Without it each researcher reads summary.json — 14KB of JSON carrying a
 * section index and per-year context ids it never uses — just to recover the
 * cover-page fields and ten figures. This is the same data, ~1KB, already in
 * the units the entry stores.
 */
const BRIEF_COVER_FIELDS = [
  "会社名",
  "英訳名",
  "提出者名",
  "証券コード",
  "会計基準",
  "事業年度",
  "当事業年度終了日",
  "当会計期間終了日",
  "上場金融商品取引所名",
  "連結決算の有無",
];

function brief(companyId, code4, filing, cover, figures, previous, warnings, corrections, sections) {
  const yen = (n) => n.toLocaleString("ja-JP");
  const million = (n) => (n / 1_000_000).toLocaleString("ja-JP");
  const rows = [];
  for (const [kind, list] of [
    ["売上", figures.revenue],
    ["純利益", figures.netIncome],
  ]) {
    for (const candidate of list) {
      rows.push(`\n**${kind}** — XBRL label \`${candidate.label ?? "(無題・拡張要素)"}\` [\`${candidate.element}\`]`);
      rows.push("");
      rows.push("| 決算期 | 円 | 百万円 |");
      rows.push("|---|---:|---:|");
      for (const y of candidate.years) rows.push(`| ${y.fiscalYearEnd} | ${yen(y.yen)} | ${million(y.yen)} |`);
    }
  }
  for (const [kind, list, unit] of [
    ["利益（売上と純利益の間の行）", figures.profit, "yen"],
    ["総資産", figures.totalAssets, "yen"],
    ["純資産", figures.netAssets, "yen"],
    ["従業員数", figures.employees, "people"],
  ]) {
    if (!list) {
      rows.push(`\n**${kind}** — この有報の5年表にはない（空欄のままでよい。理由をログに書くこと）`);
      continue;
    }
    for (const series of list) {
      rows.push(`\n**${kind}** — 印字ラベル \`${series.label ?? "(無題)"}\` [\`${series.element}\`]`);
      rows.push("");
      rows.push(unit === "yen" ? "| 決算期 | 円 | 百万円 |" : "| 決算期 | 人 |");
      rows.push(unit === "yen" ? "|---|---:|---:|" : "|---|---:|");
      for (const y of series.years) {
        rows.push(unit === "yen" ? `| ${y.fiscalYearEnd} | ${yen(y.value)} | ${million(y.value)} |` : `| ${y.fiscalYearEnd} | ${yen(y.value)} |`);
      }
    }
  }
  const restatement = previous?.figures
    ? (() => {
        const d = [...compare(figures.revenue, previous.figures.revenue).differences, ...compare(figures.netIncome, previous.figures.netIncome).differences];
        const rows = compare(figures.revenue, previous.figures.revenue).comparedRows + compare(figures.netIncome, previous.figures.netIncome).comparedRows;
        if (d.length > 0) return `**前期有報と差異あり — 理由を有報で特定し、ログに記録すること**\n\n\`\`\`json\n${JSON.stringify(d, null, 2)}\n\`\`\``;
        return rows === 0
          ? "**前期有報と突き合わせられる行がない。一致ではない** — 前期有報を直接読み、非継続事業への組替えや修正再表示がないか確認すること"
          : `前期有報と重複年度は全て一致（修正再表示なし・${rows}行）`;
      })()
    : "前期有報が窓内に見つからず、比較していない";

  return [
    `# ${companyId} — evidence brief`,
    "",
    "数値は有報のXBRLタグそのもの。**円の値をそのままコピーすること**（換算・四捨五入・手入力をしない）。",
    "ラベルは taxonomy ではなく `indicators.txt` の印字どおりに採ること。",
    "",
    "## 表紙・DEI",
    "",
    // Only the fields an entry actually uses. cover-page.txt keeps the rest
    // (提出先, 府令, 電話番号, 事務連絡者…), which no company page has ever needed.
    ...Object.entries(cover)
      .filter(([k]) => BRIEF_COVER_FIELDS.some((f) => k.startsWith(f)))
      .map(([k, v]) => `- **${k}**: ${v}`),
    "- （表紙のその他の項目は `cover-page.txt`）",
    "",
    `- **証券コード（検索に使用）**: ${code4}`,
    `- **有報**: ${filing.docDescription} / docID \`${filing.docID}\` / 提出 ${filing.submitDateTime} / 決算期 ${filing.resolvedPeriodEnd}`,
    "",
    "## 5年間の数値",
    ...rows,
    "",
    "## 修正再表示チェック",
    "",
    restatement,
    "",
    ...(warnings.length > 0 ? ["## 注意", "", ...warnings.map((w) => `- ${w}`), ""] : []),
    ...(corrections.length > 0
      ? ["## 訂正有価証券報告書", "", ...corrections.map((c) => `- ${c.docDescription} (docID \`${c.docID}\`, 提出 ${c.submitDateTime})${c.comparedToBase ? ` — 本体との差異: ${JSON.stringify(c.comparedToBase)}` : ""}`), ""]
      : []),
    "## 本文ファイル",
    "",
    ...Object.entries(sections).map(([file, s]) => `- \`${file}\` (${s.characters.toLocaleString("ja-JP")}字)`),
    "- `sections.json` — その他の全テキストブロック",
    "",
  ].join("\n");
}

async function packFor(companyId, code4, from, to) {
  const reports = await findAnnualReports(code4, from, to);
  if (reports.length === 0) throw new Error(`no 有価証券報告書 for ${code4} between ${from} and ${to}`);
  const latest = pickBase(reports);
  if (!latest) throw new Error(`no filing with a readable fiscal year for ${code4} between ${from} and ${to}`);
  const { rows } = await figuresFor(latest);
  const missing = [];
  // 主要な経営指標等の推移 as printed, so each series can carry the filer's own
  // wording rather than the taxonomy's.
  const indicatorsRow = rows.find((r) => r["要素ID"] === "jpcrp_cor:BusinessResultsOfGroupTextBlock" && r["値"]);
  const indicatorsText = indicatorsRow ? textBlockToText(indicatorsRow["値"]) : null;
  const figures = fiveYearFigures(rows, latest.resolvedPeriodEnd, missing, indicatorsText);

  const warnings = [];
  if (missing.length > 0) {
    warnings.push(
      `${missing.join("・")} が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと`,
    );
  }
  // More than one tagged candidate means the filer tags a line the entry must not
  // confuse with the top line (売上総利益, 当期利益 including minorities…). Only
  // revenue and net income: several series for 利益/総資産/純資産 is normal and
  // expected when a filer changed accounting standard mid-series.
  for (const [kind, list] of [
    ["revenue", figures.revenue],
    ["netIncome", figures.netIncome],
  ]) {
    if (list.length > 1) {
      warnings.push(
        `${kind} の候補が ${list.length} 件ある（${list.map((c) => c.label ?? c.element).join(" / ")}）。` +
          `indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと`,
      );
    }
  }

  // 訂正有価証券報告書 amend a filing already submitted. One covering the base
  // year is compared against the base, so the amendment is reported rather than
  // discovered by eye; one covering an earlier year still has to be read.
  const corrections = [];
  for (const report of reports) {
    if (report.docTypeCode !== "130") continue;
    const periodEnd = resolvePeriodEnd(report);
    const record = { docID: report.docID, periodEnd, submitDateTime: report.submitDateTime, docDescription: report.docDescription };
    if (periodEnd === latest.resolvedPeriodEnd && report.submitDateTime > latest.submitDateTime) {
      const amended = await figuresFor({ ...report, resolvedPeriodEnd: periodEnd });
      record.comparedToBase = amended
        ? { revenue: compare(amended.figures.revenue, figures.revenue), netIncome: compare(amended.figures.netIncome, figures.netIncome) }
        : { note: "EDINET serves no CSV for this correction — read the PDF" };
      warnings.push(`${report.docDescription} が提出されている。差異は corrections[].comparedToBase を参照し、リサーチログに記録すること`);
    } else {
      warnings.push(`${report.docDescription} が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること`);
    }
    corrections.push(record);
  }

  // Previous year's filing, for the restatement check.
  //
  // Searched from the previous fiscal year END, not by shifting this filing's
  // submission date back a year. アサヒGHD filed its 2025年12月期 有報 on
  // 2026-07-27 — seven months after the year end, which the filing attributes to
  // a cyberattack — so the shifted window looked in July 2025 and missed the
  // prior report filed normally in March. A filing that arrives late must not
  // silently lose its restatement check.
  const previousPeriodEnd = shiftYear(latest.resolvedPeriodEnd, 1);
  const tenMonthsOn = new Date(`${previousPeriodEnd}T00:00:00Z`);
  tenMonthsOn.setUTCMonth(tenMonthsOn.getUTCMonth() + 10);
  const previousWindow = [previousPeriodEnd, tenMonthsOn.toISOString().slice(0, 10)];
  let previous = null;
  try {
    const older = await findAnnualReports(code4, previousWindow[0], previousWindow[1]);
    const olderBase = pickBase(older);
    if (olderBase) {
      const read = await figuresFor(olderBase);
      previous = read ? { filing: olderBase, figures: read.figures } : { error: "no CSV for the previous filing" };
      for (const report of older) {
        if (report.docTypeCode !== "130") continue;
        warnings.push(`前期の窓に ${report.docDescription} がある。過年度の修正再表示の可能性があるため内容を確認すること`);
      }
    }
  } catch (error) {
    previous = { error: String(error) };
  }

  const cover = coverPage(rows);
  const dir = join(cacheDir(), "evidence", companyId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "cover-page.txt"),
    Object.entries(cover)
      .map(([k, v]) => `${k}\t${v}`)
      .join("\n"),
    "utf8",
  );
  const sectionIndex = {};
  for (const [file, elements] of Object.entries(SECTIONS)) {
    const row = rows.find((r) => elements.includes(r["要素ID"]) && r["値"]);
    if (!row) continue;
    const truncated = row["値"].length >= CSV_CELL_LIMIT;
    const text = textBlockToText(row["値"]);
    writeFileSync(join(dir, file), text, "utf8");
    sectionIndex[file] = { element: row["要素ID"], characters: text.length, truncated };
    if (truncated) {
      warnings.push(`${file} はEDINETのCSVが3万字で打ち切っており、末尾が欠けている。欠けた部分を根拠に使わないこと`);
    }
  }
  // The restatement check compares this filing against the previous one, so it
  // cannot see a restatement the PREVIOUS filing already made: ENEOS reclassified
  // metals as 非継続事業 and re-presented 第14期 in its prior 有報, and this
  // filing's comparison reported 「28 行一致」 — true, and not the same scope.
  // A match is not proof of an unchanged perimeter.
  // A filer with a non-listed class share can have its DEI 上場金融商品取引所名
  // read off that class's row: INPEX's says 「非上場・非登録」 for its single
  // 甲種類株式 while its 1.26 billion ordinary shares are on TSE Prime. Taken at
  // face value the entry would have had no listings at all and failed the schema.
  const exchangeField = cover["上場金融商品取引所名又は登録認可金融商品取引業協会名"] ?? "";
  if (/非上場|非登録/.test(exchangeField) && cover["証券コード、DEI"]) {
    warnings.push(
      `表紙の上場金融商品取引所名が「${exchangeField}」だが証券コードがある。種類株式の行を拾っている可能性が高いので、発行済株式の表で普通株式の上場先を確認すること`,
    );
  }

  // A warning that fires on every company tells a researcher nothing and teaches
  // them to skip the whole list. The bare word 組替 did exactly that — it matched
  // 「組替調整額」, a standard line in every 包括利益 note, and fired on 38 of 38
  // companies. Narrowed to the wording a filer uses when it has actually
  // re-presented the comparative period, this list fires on 27 of those 38, so
  // its ABSENCE now means something too. Every case the check was built for still
  // trips it: ENEOS on 非継続事業, 清水建設 and パナソニックHD on the reclassification
  // wording, ソニーG and ニトリHD on both.
  const scopeWords = [
    ["非継続事業", /非継続事業/],
    ["財務諸表の組替え", /(財務諸表|注記|表示|科目)の組替え|組替え(て表示|ています|を行)/],
    ["遡及適用", /遡及適用/],
    ["遡及修正", /遡及修正/],
  ];
  const scopeHits = scopeWords.filter(([, re]) => rows.some((r) => re.test(r["値"] ?? ""))).map(([label]) => label);
  if (scopeHits.length > 0) {
    warnings.push(
      `本文に ${scopeHits.join("・")} の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること`,
    );
  }
  if (!sectionIndex["segments.txt"]) {
    warnings.push(
      sectionIndex["md-and-a.txt"]
        ? "セグメント情報のテキストブロックがない（US GAAP採用会社に多い）。セグメント別の売上・利益は md-and-a.txt に記載されているので、そこから採り、ログにその旨を書くこと"
        : "セグメント情報のテキストブロックが見つからない。有報本文でセグメント情報を確認すること",
    );
  }
  const taken = Object.values(SECTIONS).flat();
  const others = rows
    .filter((r) => /TextBlock/.test(r["要素ID"]) && !taken.includes(r["要素ID"]) && r["値"]?.length > 200)
    .map((r) => ({ name: r["項目名"], element: r["要素ID"], text: textBlockToText(r["値"]) }));
  writeFileSync(join(dir, "sections.json"), JSON.stringify(others, null, 2), "utf8");

  writeFileSync(join(dir, "brief.md"), brief(companyId, code4, latest, cover, figures, previous, warnings, corrections, sectionIndex), "utf8");

  const summary = {
    companyId,
    securitiesCode: code4,
    filing: latest,
    coverPage: cover,
    otherFilingsInWindow: reports.filter((r) => r.docID !== latest.docID),
    corrections,
    warnings,
    figures,
    previousFiling: previous?.filing ?? null,
    // All six series, not just revenue and net income. 清水建設 finalised the
    // purchase-price allocation for an acquisition and restated 総資産額 and
    // 純資産額 only — its revenue and net income were untouched, so a check
    // that looked at those two alone reported a clean match while two balance
    // figures had moved.
    restatementCheck: previous?.figures
      ? Object.fromEntries(
          ["revenue", "netIncome", "profit", "totalAssets", "netAssets", "employees"]
            .filter((kind) => figures[kind] && previous.figures[kind])
            .map((kind) => [kind, compare(figures[kind], previous.figures[kind])]),
        )
      : { note: previous?.error ?? "previous filing not found in window" },
    sections: sectionIndex,
    otherSections: others.map((o) => o.name),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(dir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
  return { dir, summary };
}

const [companyId, code4, ...rest] = process.argv.slice(2);
if (!companyId || !code4) {
  console.error("usage: node scripts/research/evidence-pack.mjs <company-id> <4-digit code> [--from YYYY-MM-DD] [--to YYYY-MM-DD]");
  process.exit(1);
}
const options = Object.fromEntries(rest.map((a, i, all) => (a.startsWith("--") ? [a.slice(2), all[i + 1]] : [])).filter((e) => e.length));
const { dir, summary } = await packFor(companyId, code4, options.from ?? "2026-06-01", options.to ?? "2026-06-30");

console.log(`${companyId} (${code4}) → ${dir}`);
console.log(`filing: ${summary.filing.filerName} | ${summary.filing.docDescription} | 提出 ${summary.filing.submitDateTime} | 決算期 ${summary.filing.periodEnd} | docID ${summary.filing.docID}`);
if (summary.otherFilingsInWindow.length) {
  console.log(`other filings in window: ${summary.otherFilingsInWindow.map((f) => `${f.docTypeCode}:${f.docID}(${f.submitDateTime})`).join(", ")}`);
}
for (const kind of ["revenue", "netIncome"]) {
  for (const candidate of summary.figures[kind]) {
    console.log(`${kind}: ${candidate.label} [${candidate.element}]`);
    for (const y of candidate.years) console.log(`   ${y.fiscalYearEnd}  ${y.yen.toLocaleString("ja-JP")} 円  (${(y.yen / 1_000_000).toLocaleString("ja-JP")} 百万円)`);
  }
}
console.log(
  "cover page:",
  ["会社名、表紙", "英訳名、表紙", "会計基準、DEI"].map((k) => `${k}=${summary.coverPage[k] ?? "-"}`).join(" | "),
);
console.log("restatement check:", JSON.stringify(summary.restatementCheck));
for (const warning of summary.warnings) console.log(`WARNING: ${warning}`);
for (const correction of summary.corrections) {
  if (correction.comparedToBase) console.log(`correction ${correction.docID} vs base:`, JSON.stringify(correction.comparedToBase));
}
console.log("sections:", Object.entries(summary.sections).map(([f, s]) => `${f} (${s.characters})`).join(", "));
