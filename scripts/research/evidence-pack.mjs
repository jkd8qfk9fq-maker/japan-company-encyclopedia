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
import { FIGURE_KINDS, amendmentsOf, chooseEffective, classifyAmendment, diffFigures, ensureIndex, filingCompleteness } from "./amendments.mjs";

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
  "RevenueKeyFinancialData", // 収益 — plain, no series number (丸井グループ, 日本紙パルプ商事)
  "Revenue2IFRSSummaryOfBusinessResults", // IFRS filers' own numbered variant (デジタルガレージ)
  "OperatingRevenue2SummaryOfBusinessResults", // 営業収益 — a second numbered variant
  // 総営業収入: コンビニ・小売チェーンの top line, distinct from 営業収益 because it is
  // gross of amounts a 加盟店 collects on the company's behalf (ワークマン, ミニストップ).
  "GrossOperatingRevenueSummaryOfBusinessResults",
  // 保険料等収入, worded two more ways than PremiumAndOtherIncome above — 生命保険会社
  // (かんぽ生命保険) and 生命保険持株会社 (T&Dホールディングス) each coin their own extension.
  "InsurancePremiumsAndOthersSummaryOfBusinessResults",
  "InsurancePremiumsAndOtherIncomeSummaryOfBusinessResults",
  "InsuranceRevenueIFRSKeyFinancialData", // 保険収益 (IFRS 保険会社, ライフネット生命保険)
  "OperatingBusinessRevenueKeyFinancialData", // 営業収益
  "OperatingRevenuesKeyFinancialData", // 営業収益 — plural form of OperatingRevenue above
]);
const NET_INCOME_ELEMENTS = new Set([
  "ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults", // 親会社株主に帰属する当期純利益
  "ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults", // 親会社の所有者に帰属する当期利益
  "NetIncomeLossAttributableToOwnersOfParentUSGAAPSummaryOfBusinessResults",
  "NetIncomeLossSummaryOfBusinessResults",
  // A plain "Profit" extension, safe only because it is picked up solely for a
  // non-consolidated filer (連結決算の有無=false): a company with no subsidiaries
  // has no non-controlling interests to conflate with, so 「当期純利益」 needs no
  // attribution wording (東京製鐵). A CONSOLIDATED filer coining the same element
  // name for an un-split total would still be caught — verify-financials's
  // PARENT_ATTRIBUTION check is not skipped for a consolidated filer — so this is
  // not a blanket acceptance of "Profit" as parent-attributable.
  "ProfitSummaryOfBusinessResults",
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
  // 主要な経営指標等の推移. The group table first; the 提出会社 one for a company
  // that publishes no consolidated statements, which prints only that — 52 of 496
  // packs had no indicators.txt at all, and without it no label can be checked
  // against the filing s own printing.
  "indicators.txt": ["jpcrp_cor:BusinessResultsOfGroupTextBlock", "jpcrp_cor:BusinessResultsOfReportingCompanyTextBlock"],
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
function printedLabel(indicators, years, prefer = null) {
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
      /*
        Every occurrence, not just the first.

        Two rows of the same table can print identical numbers: a company with no
        non-controlling interests prints the same figures for 「当期利益」 and for
        「親会社の所有者に帰属する当期利益」. indexOf found the first, so the
        parent-attributable element was labelled with the total row's wording —
        exactly the confusion verify-financials refuses, and it refused it.

        `prefer` says which one the element means. A label that matches it wins
        wherever it appears; otherwise the first readable one stands, and the
        verifier is left to complain about it.
      */
      const needle = printed(a) + printed(b);
      let fallback = null;
      for (let at = table.indexOf(needle); at !== -1; at = table.indexOf(needle, at + 1)) {
        const found = labelBefore(table, at);
        if (!found) continue;
        if (!prefer || prefer.test(found)) return found;
        fallback ??= found;
      }
      if (fallback) return fallback;
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
      if (first < 0) continue;
      const second = table.indexOf(printed, first + 1);
      // Ambiguous unless `prefer` can tell the occurrences apart.
      if (second !== -1 && !prefer) continue;
      let fallback = null;
      for (let at = first; at !== -1; at = table.indexOf(printed, at + 1)) {
        const found = labelBefore(table, at);
        if (!found) continue;
        if (prefer?.test(found)) return found;
        fallback ??= found;
      }
      if (second === -1 && fallback) return fallback;
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
  // A company that changed its fiscal year end prints SIX columns in this table
  // while XBRL still tags five periods — 大福 and 住友重機械工業 both moved March→
  // December and print a short transition period alongside it. The pair we
  // matched then does not start at the row's first column: one more figure from
  // the SAME row sits directly before it with nothing between them, e.g.
  // 「32,39035,87741,248…」 where 32,390 is the untagged transition-period column.
  // Walking back only one figure lands between two numbers of the same row —
  // an empty string, not a label — so when that happens the walk retries from
  // before THAT figure too, however many same-row columns deep it has to go.
  let cursor = at;
  for (let guard = 0; guard < 10; guard++) {
    const prefix = table.slice(0, cursor);
    // Three or more digits, OR any △-prefixed number however short. A loss of
    // 「△47」 is a figure, and requiring three digits made the walk-back stop
    // after it and hand back 「△47」 as the label — a number where a row heading
    // belongs. Footnote markers, which this length rule exists to skip, are
    // never written with △.
    const previousFigure = [...prefix.matchAll(/△\s*[0-9０-９][0-9０-９,，]*|[0-9０-９][0-9０-９,，]{2,}/g)].pop();
    const start = previousFigure ? previousFigure.index + previousFigure[0].length : 0;
    if (previousFigure && prefix.slice(start).trim() === "") {
      cursor = previousFigure.index;
      continue;
    }
    let label = prefix.slice(start);
    let previous;
    do {
      previous = label;
      label = label
        // A unit printed BEFORE the row heading — 西日本旅客鉄道 prints 「百万円  営業収益  1,031,103…」,
        // so the walk back from the figures picked the unit up as the label's first word and the
        // page said 「百万円営業収益」. Only the money units: 「人件費」 begins with 人.
        .replace(/^(?:百万円|千円)\s*/, "")
        // Remnants of the 決算年月 header immediately above the first row. Some filings print the
        // header as 「2025年９月期」 (GMO ペイメントゲートウェイ), so a 期 directly after the month is
        // part of the header too — it used to survive and the label read 「期売上収益」.
        .replace(/^(?:[0-9０-９]{1,4}\s*年)?\s*(?:[0-9０-９]{1,2}\s*月\s*期?)?\s*(?:[0-9０-９]{1,2}\s*日)?/, "")
        .replace(/^[年月日度回次)）\s]+/, "")
        // A footnote marker attached to the row label: 「売上高（注）２」.
        .replace(/[（(]\s*注\s*[）)]\s*[0-9０-９]*\s*$/, "")
        // A memo sub-line folded into the same row's label: 証券会社 print
        // 「営業収益（うち受入手数料）」 where the parenthetical is a breakdown note
        // for the row underneath, not part of the row's own name — 「うち」 always
        // signals one (会沢証券グループ). Runs before the unit strip below only
        // because the loop retries either order; what matters is that neither
        // treats the other's target as part of the label.
        .replace(/[（(]\s*うち[^（）()]*\s*[）)]$/, "")
        // A trailing unit, including the 「(百万円)」 form — but never a
        // parenthetical that is part of the label itself, such as
        // 「当期利益(親会社の所有者に帰属)」.
        .replace(/[（(]\s*(百万円|千円|billion|円|名|人|％|%)\s*[）)]$/, "")
        // Dashes: a filing prints an absent year as a dash, and the columns run
        // together, so a company whose early years are empty leaves a run of them
        // sitting between the unit and the first real figure — 「売上高(千円)――――」.
        // Only ― (U+2015), － and - were listed, and the class missed ─ ‐ ‒ – — ⼀
        // and the ASCII/full-width variants EDINET actually uses. It cost 428
        // rejected labels across one run: the walk-back is right and the tidy-up
        // was leaving the dashes behind.
        .replace(/(百万円|千円|円|名|人|％|%|〃|[－—―─‐‒–~〜ー−-]|、|：|:|\s)+$/, "")
        .trim();
    } while (label !== previous);
    if (label.length >= 2 && label.length <= 40) return label;
    return null;
  }
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
/** The 主要な経営指標等の推移 rows: the standard summary elements, or, for a line the taxonomy has
 * no element for, a KeyFinancialData extension. */
const summaryRows = (rows) => rows.filter((r) => /(SummaryOfBusinessResults|KeyFinancialData)$/.test(r["要素ID"]) && r["単位"] === "円");
/** Non-consolidated rows carry the dimension in their context id. */
const isNonConsolidatedRow = (r) => /NonConsolidated/i.test(r["コンテキストID"] ?? "");

/**
 * Is this filing's five-year series the 提出会社 one, because it has no consolidated statements?
 *
 * A filer that has stopped consolidating still tags its old consolidated columns
 * (years before it stopped, and 「－」 after) beside a full 提出会社 table, so
 * "no consolidated rows at all" is not the only way to have no consolidated
 * statements. アビスト, FY2025: consolidated rows exist for FY2021–22 only, and
 * taking them threw away the five-year 提出会社 table. Fall back to the 提出会社
 * series when there is no numeric consolidated balance sheet for the CURRENT
 * year and there is a 提出会社 one. Still never to fill a gap in a consolidated
 * table: a filer whose consolidated statements cover the current year keeps them.
 *
 * One decision, three readers — the series, the printed table its labels are read
 * from, and the indicators.txt a researcher confirms against — because the labels
 * of one table cannot be found in the other (the 提出会社 table prints 当期純利益,
 * the consolidated one 親会社株主に帰属する当期純利益).
 */
function usesFilerOnlySeries(rows) {
  const inTable = summaryRows(rows);
  const consolidated = inTable.filter((r) => !isNonConsolidatedRow(r));
  const currentTotalAssets = (list) =>
    list.some(
      (r) =>
        /^TotalAssets/.test(r["要素ID"].replace(/^.*:/, "")) &&
        /^CurrentYear/.test(r["コンテキストID"] ?? "") &&
        Number.isFinite(Number(r["値"])),
    );
  return consolidated.length === 0 || (!currentTotalAssets(consolidated) && currentTotalAssets(inTable.filter(isNonConsolidatedRow)));
}

/** Which 主要な経営指標等の推移 table to print, first choice first. */
function indicatorsElements(filerOnly) {
  const [group, filer] = SECTIONS["indicators.txt"];
  return filerOnly ? [filer, group] : [group, filer];
}

function fiveYearFigures(rows, periodEnd, missing = [], indicatorsText = null) {
  const inTable = summaryRows(rows);
  const isNonConsolidated = isNonConsolidatedRow;
  const consolidated = inTable.filter((r) => !isNonConsolidated(r));
  const nonConsolidated = usesFilerOnlySeries(rows);
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
        // The filer's printed wording when it can be found; otherwise the taxonomy's,
        // with the standard名 it appends stripped — 「売上収益（IFRS）」 is the taxonomy
        // talking, and no filing prints it that way.
        taxonomyLabel: candidate.label,
        // An element that names the parent's owners must not be labelled with the
        // row that includes non-controlling interests, however identical the
        // numbers happen to be in a year with none.
        label:
          printedLabel(
            indicatorsText,
            candidate.years.map((y) => ({ value: y.yen })),
            /AttributableToOwnersOfParent/.test(candidate.element) ? /帰属/ : null,
          ) ?? candidate.label?.replace(/[（(](IFRS|US ?GAAP|日本基準|JGAAP)[）)]/g, "").trim() ?? null,
      }));
  };
  /**
   * The first element present, in preference order — one series, not a list of
   * candidates, so a mechanical backfill is deterministic. `rowsFor` keeps its
   * own unit filter because employee counts are people, not yen.
   */
  const pickSeries = (elements, { unit = "円", extension = null, unmarked = [] } = {}) => {
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
    // `unmarked` names the few jpcrp_cor elements that carry a five-year column
    // WITHOUT the table's suffix. 従業員数 is the case: most filers tag it as the
    // plain `jpcrp_cor:NumberOfEmployees` (the same element the 従業員の状況 section
    // uses), so requiring a suffix left it empty for ~99% of the filings checked
    // (602 of 609 cached) — 2026-09-28 turned a no-op filter into this one. Only
    // the exact names listed are let through, and the context test above is what
    // keeps a segment's or a region's headcount out: those carry a dimension.
    const isUnmarked = (r) => unmarked.some((name) => r["要素ID"] === `jpcrp_cor:${name}`);
    const pool = rows.filter(
      (r) =>
        (/(SummaryOfBusinessResults|KeyFinancialData)$/.test(r["要素ID"]) || isUnmarked(r)) &&
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
      const tagged = list
        .map((r) => ({ relative: relativeYear(r), row: r }))
        .filter(({ relative }) => relative)
        .map(({ relative, row }) => ({
          relative,
          fiscalYearEnd: shiftYear(periodEnd, YEAR_OFFSET[relative]),
          value: Number(row["値"]),
        }))
        .filter((y) => Number.isFinite(y.value))
        .sort((a, b) => a.fiscalYearEnd.localeCompare(b.fiscalYearEnd));
      // The plain NumberOfEmployees is printed in more than one place (the five-year
      // table AND 従業員の状況), so the same year can arrive twice. Identical repeats
      // collapse to one; a year whose repeats DISAGREE is left out — a headcount that
      // cannot be pinned to one number is null, not a pick between two.
      const years = unmarked.includes(element)
        ? [...Map.groupBy(tagged, (y) => y.fiscalYearEnd).values()].filter((group) => new Set(group.map((y) => y.value)).size === 1).map((group) => group[0])
        : tagged;
      if (years.length === 0) continue;
      const taxonomy = (list[0]["項目名"] ?? "").replace(/、経営指標等$/, "") || null;
      found.push({
        element,
        // The filing's own wording wins; the taxonomy label is the fallback.
        label:
          printedLabel(indicatorsText, years) ??
          taxonomy
            ?.replace(/[（(](IFRS|US ?GAAP|日本基準|JGAAP)[）)]/g, "")
            .replace(/又は.*$/, "")
            .trim() ??
          null,
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
    employees: pickSeries(EMPLOYEE_ELEMENTS, { unit: null, unmarked: ["NumberOfEmployees"] }),
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
 * The year-end months 主要な経営指標等の推移 prints on its 決算年月 row, oldest first —
 * ["2021-03", "2022-03", "2022-12", …]. Null when the table prints no such row.
 * @param {string | null} indicatorsText
 * @returns {string[] | null}
 */
export function printedYearEnds(indicatorsText) {
  if (!indicatorsText) return null;
  const text = indicatorsText.normalize("NFKC").replace(/\s+/g, "");
  const row = /決算年月((?:\d{4}年\d{1,2}月)+)/.exec(text);
  if (!row) return null;
  return [...row[1].matchAll(/(\d{4})年(\d{1,2})月/g)].map((m) => `${m[1]}-${String(m[2]).padStart(2, "0")}`);
}

/**
 * The printed 決算年月 row, oldest first, or null when it cannot be read or oriented: most filers
 * print oldest first, a few newest first, and a row with 当期 at neither end is not read at all.
 * @param {string | null} indicatorsText
 * @param {string | null | undefined} currentPeriodEnd YYYY-MM-DD
 */
function orientedYearEnds(indicatorsText, currentPeriodEnd) {
  const printed = printedYearEnds(indicatorsText);
  if (!printed || !currentPeriodEnd) return null;
  const current = currentPeriodEnd.slice(0, 7);
  if (printed.at(-1) === current) return printed;
  return printed[0] === current ? [...printed].reverse() : null;
}

/**
 * Fiscal years inside the five-year window that are not twelve months long — the transition
 * period after a change of year end (住友重機械工業's 2022年12月期 is nine months: April to
 * December). The figures are real but cover a different span from every other column, so the
 * table must say so; the pack cannot write that sentence, and a person has to.
 * @param {string | null} indicatorsText
 * @param {string | null | undefined} currentPeriodEnd YYYY-MM-DD
 * @returns {{ yearEnd: string, months: number }[]}
 */
export function detectIrregularPeriods(indicatorsText, currentPeriodEnd) {
  const printed = orientedYearEnds(indicatorsText, currentPeriodEnd);
  if (!printed) return [];
  const monthIndex = (/** @type {string} */ ym) => Number(ym.slice(0, 4)) * 12 + Number(ym.slice(5, 7));
  const out = [];
  for (let i = Math.max(1, printed.length - 5); i < printed.length; i++) {
    const months = monthIndex(printed[i]) - monthIndex(printed[i - 1]);
    if (months !== 12) out.push({ yearEnd: printed[i], months });
  }
  return out;
}

/**
 * Did the filer change its fiscal year end inside the five-year window?
 *
 * The pack dates every column by shifting the current year end back a whole number of years,
 * which is wrong for any column that pre-dates a change of year end: 住友重機械工業's 第126期 ended
 * 2022年3月 but sits in a column dated 2021-12-31, because it moved from March to December in 2022.
 * The filing says so itself — the 決算年月 row prints each column's real month — so the two are
 * compared. A difference is NOT corrected here: the printed row gives only a month, never the day,
 * and the short transition year needs its length stated. It is reported, and the company goes to a
 * person rather than being registered with a year-end that never existed.
 * Columns are matched by RELATIVE year (当期 is the last printed column, 前期 the one before), not
 * by position in the pack's list: a filer whose XBRL tags only some of the years would otherwise
 * be compared against the wrong columns.
 * @param {string | null} indicatorsText
 * @param {{ fiscalYearEnd: string, relative: string }[]} years the pack's dated columns
 * @param {string} currentPeriodEnd the filing's own current year end (YYYY-MM-DD), used to find which
 *   end of the printed row is 当期 — most filers print oldest first, a few newest first, and a row
 *   that puts 当期 at neither end is not read at all rather than guessed at
 * @returns {{ printed: string[], assumed: string[] } | null} the disagreeing columns, oldest first
 */
export function detectFiscalYearChange(indicatorsText, years, currentPeriodEnd) {
  const printed = orientedYearEnds(indicatorsText, currentPeriodEnd);
  if (!printed) return null;
  const pairs = years
    .filter((y) => y.relative in YEAR_OFFSET && printed.length > YEAR_OFFSET[y.relative])
    .map((y) => ({ assumed: y.fiscalYearEnd.slice(0, 7), printed: printed[printed.length - 1 - YEAR_OFFSET[y.relative]] }))
    .sort((a, b) => a.assumed.localeCompare(b.assumed));
  const wrong = pairs.filter((p) => p.assumed !== p.printed);
  return wrong.length === 0 ? null : { printed: wrong.map((p) => p.printed), assumed: wrong.map((p) => p.assumed) };
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
      ? [
          "## 訂正有価証券報告書",
          "",
          ...corrections.map(
            (c) =>
              `- ${c.docDescription} (docID \`${c.docID}\`, 提出 ${c.submitDateTime})${c.docID === filing.docID ? " — **このパックの有効文書**" : ""}${c.complete === false ? ` — 不完全（${c.missing.join("・")}）` : ""}${c.classification ? ` — 分類 ${c.classification}` : ""}${c.comparedToBase ? ` — 原本との差異: ${JSON.stringify(c.comparedToBase)}` : ""}`,
          ),
          "",
        ]
      : []),
    "## 本文ファイル",
    "",
    ...Object.entries(sections).map(([file, s]) => `- \`${file}\` (${s.characters.toLocaleString("ja-JP")}字)`),
    "- `sections.json` — その他の全テキストブロック",
    "",
  ].join("\n");
}

/** A figures comparison as the pack stores it: the verdict and the first differences, not all of them. */
const summarizeDiff = (diff) => ({ changed: diff.changed, differenceCount: diff.differences.length, differences: diff.differences.slice(0, 12) });

/**
 * The filing of record for an original 有報: its latest 訂正 when that is complete,
 * otherwise the original (see amendments.mjs for why).
 *
 * The corrections come from the reverse index, never from the search window the
 * original was located with — the window is a locality device for finding the
 * original, and a correction arrives a median 28 and up to 464 days after it.
 * Every correction is compared with the original on all five series the entry
 * stores, so a correction that changes 総資産 but not 売上 is reported too.
 *
 * Never throws on the index: if EDINET cannot be reached for the newest days the
 * answer carries how far it was checked.
 */
async function resolveAmendments(original, originalRows, originalFigures) {
  const { index, error } = await ensureIndex({ fetch: true });
  const list = amendmentsOf(index, original.docID);
  const loaded = new Map();
  for (const a of list) {
    const zip = await downloadDocument(a.docID, 5);
    loaded.set(a.docID, zip ? readCsvRows(zip) : []);
  }
  // Memoised: completeness and the comparison both need the five-year figures.
  const read = new Map();
  const figuresOf = (docID) => {
    if (read.has(docID)) return read.get(docID);
    const rows = loaded.get(docID) ?? [];
    let result;
    if (rows.length === 0) result = { figures: null, why: "XBRL（CSV）がない" };
    else {
      try {
        result = { figures: fiveYearFigures(rows, original.resolvedPeriodEnd), why: null };
      } catch (e) {
        result = { figures: null, why: String(e.message).slice(0, 120) };
      }
    }
    read.set(docID, result);
    return result;
  };
  const completenessOf = (docID) => {
    const structural = filingCompleteness(loaded.get(docID) ?? [], originalRows);
    if (!structural.complete) return structural;
    const probe = figuresOf(docID);
    return probe.figures ? structural : { complete: false, missing: [`5年表を抽出できない（${probe.why}）`] };
  };
  const choice = chooseEffective(original.docID, list, completenessOf);
  const records = list.map((a) => {
    const { figures, why } = figuresOf(a.docID);
    const check = completenessOf(a.docID);
    return {
      docID: a.docID,
      parentDocID: a.parentDocID,
      periodEnd: original.resolvedPeriodEnd,
      submitDateTime: a.submitDateTime,
      docDescription: a.docDescription,
      complete: check.complete,
      missing: check.missing,
      comparedToBase: figures ? summarizeDiff(diffFigures(originalFigures, figures, [...FIGURE_KINDS, "employees"])) : { note: why },
      // What the correction changed, from the two filings' XBRL end to end (see classifyAmendment).
      ...(figures && (loaded.get(a.docID) ?? []).length > 0
        ? classifyAmendment({ figures: diffFigures(originalFigures, figures, [...FIGURE_KINDS, "employees"]), baseRows: originalRows, rows: loaded.get(a.docID), proseElements: PROSE_ELEMENTS })
        : {}),
    };
  });
  const effectiveRecord = records.find((r) => r.docID === choice.effectiveDocID);
  const filing = choice.effectiveIsAmendment
    ? { ...original, docID: effectiveRecord.docID, docTypeCode: "130", docDescription: effectiveRecord.docDescription, submitDateTime: effectiveRecord.submitDateTime, originalDocID: original.docID }
    : { ...original, originalDocID: original.docID };
  return {
    choice,
    records,
    filing,
    rows: choice.effectiveIsAmendment ? loaded.get(choice.effectiveDocID) : originalRows,
    checkedThrough: index.checkedThrough,
    indexError: error,
  };
}

/**
 * Which generation of extraction logic built a pack. Bump it whenever a change here alters
 * what a pack CONTAINS for a filing that has not changed — a new element accepted, a
 * different basis chosen, the filing of record resolved differently. A pack written by an
 * older generation is stale: nothing registered is touched, but a company that is not yet
 * registered (or not yet promoted) is rebuilt before it is, so a fix to the extractor
 * reaches every future registration without anyone remembering to re-run packs by hand.
 *
 *   1  (implicit — packs written before this field existed)
 *   2  素の NumberOfEmployees を従業員数として採る（2026-10-02）。訂正有報の有効文書から作る
 *   3  決算期の変更を検出する（summary.fiscalYearChange）。登録前のパックを作り直す
 *   4  行見出しの前に印字された単位（百万円）をラベルに含めない
 *   5  変則決算（12か月でない期）を検出する（summary.irregularPeriods）
 *   6  ヘッダー「９月期」の「期」をラベルに含めない。200文字以下の短いTextBlockも sections.json に残す
 *   7  訂正有報の分類（record-only / text-change / financial-change）を amendments.records に持つ
 */
export const EXTRACTOR_VERSION = 7;

async function packFor(companyId, code4, from, to) {
  const reports = await findAnnualReports(code4, from, to);
  if (reports.length === 0) throw new Error(`no 有価証券報告書 for ${code4} between ${from} and ${to}`);
  // The original, located by the local window. Its corrections are NOT looked for in
  // that window — see resolveAmendments.
  const original = pickBase(reports);
  if (!original) throw new Error(`no filing with a readable fiscal year for ${code4} between ${from} and ${to}`);
  const originalRead = await figuresFor(original);
  if (!originalRead) throw new Error(`EDINET がこの書類のXBRL（CSV）を提供していない: ${original.docID}`);
  const amendment = await resolveAmendments(original, originalRead.rows, originalRead.figures);
  // Everything below is read from the filing of record: figures, labels, cover
  // page, text sections.
  const latest = amendment.filing;
  const rows = amendment.rows;
  const missing = [];
  // 主要な経営指標等の推移 as printed, so each series can carry the filer's own
  // wording rather than the taxonomy's.
  // The same preference list the section files use, rather than a second copy of
  // the consolidated element: a filer with no consolidated statements prints the
  // table only as 提出会社の経営指標等, and this line silently disagreed with
  // SECTIONS about that — the pack had indicators.txt while the labels were still
  // resolved against nothing.
  const indicatorsRow = indicatorsElements(usesFilerOnlySeries(rows)).reduce(
    (found, element) => found ?? rows.find((r) => r["要素ID"] === element && r["値"]) ?? null,
    null,
  );
  const indicatorsText = indicatorsRow ? textBlockToText(indicatorsRow["値"]) : null;
  const figures = fiveYearFigures(rows, latest.resolvedPeriodEnd, missing, indicatorsText);

  const warnings = [];
  const fiscalYearChange = detectFiscalYearChange(
    indicatorsText,
    (figures.revenue ?? []).flatMap((c) => c.years),
    latest.resolvedPeriodEnd,
  );
  if (fiscalYearChange) {
    warnings.push(
      `決算期の変更: 有報は 決算年月 を ${fiscalYearChange.printed.join(" / ")} と印字しているが、このパックは各年を ${fiscalYearChange.assumed.join(" / ")} として日付を付けている。` +
        "年度ラベルと期末日が実際と違うので、人が直すまで登録しないこと（変則決算の期間の長さも記す）",
    );
  }
  const irregularPeriods = detectIrregularPeriods(indicatorsText, latest.resolvedPeriodEnd);
  if (irregularPeriods.length > 0) {
    warnings.push(
      `変則決算: ${irregularPeriods.map((p) => `${p.yearEnd} の期は ${p.months} か月`).join("、")}。` +
        "決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと",
    );
  }
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

  // 訂正有価証券報告書 of THIS filing come from the reverse index (resolveAmendments),
  // however late they were filed. Say which document the pack was built from, and
  // what the corrections changed against the original, so neither is discovered by eye.
  const { choice } = amendment;
  const changedRecords = amendment.records.filter((r) => r.comparedToBase?.changed);
  if (choice.status === "adopted") {
    warnings.push(
      `訂正有価証券報告書（${latest.docDescription}、docID ${latest.docID}）を有効文書としてこのパックを作った。原本は docID ${original.docID}。` +
        (changedRecords.length > 0
          ? `原本との主要財務の差異: ${changedRecords.map((r) => `${r.docID}（${r.comparedToBase.differenceCount}件）`).join("・")} — amendments.records[].comparedToBase を見ること`
          : "原本と主要財務（5系列・従業員数）は同一"),
    );
    // The verdict on what the correction changed. A researcher cannot read a 訂正 against its original
    // by eye, and "中身を確認できない" is not a reason to hold an entry back once this has said.
    const verdict = amendment.records.find((r) => r.docID === latest.docID);
    if (verdict?.classification === "record-only") {
      warnings.push(`訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは${[...verdict.otherTextChanged, ...verdict.otherNumericChanged].length > 0 ? `${[...verdict.otherTextChanged, ...verdict.otherNumericChanged].join("・")}（エントリーが引用しない節・開示数値）` : "表紙の項目"}だけ。「訂正の中身を確認できない」を理由に needsReview にしない`);
    } else if (verdict?.classification === "financial-change") {
      warnings.push(`訂正有報の分類: financial-change — 数値が原本と異なる（主要財務 ${verdict.comparedToBase?.differenceCount ?? 0} 件／その他の数値 ${verdict.numericFactsChanged} 件: ${verdict.numericElements.join("・") || "なし"}）。このパックの数値は有効文書のもの。原本の数値を出典にした記述が混ざっていないか確認すること`);
    } else if (verdict?.classification === "text-change") {
      warnings.push(`訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（${verdict.proseTextChanged.join("・")}）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること`);
    }
  } else if (choice.status === "incomplete") {
    warnings.push(
      `最新の訂正有価証券報告書（docID ${choice.blockedBy}）に ${choice.missing.join("・")} が無く、有効文書として採用していない（原本 docID ${original.docID} を使用）。needs-attention として人が確認すること`,
    );
  }
  if (amendment.indexError) {
    warnings.push(`訂正有報の索引を ${amendment.checkedThrough ?? "不明"} までしか確認できていない: ${amendment.indexError}`);
  }
  // The search window still sees corrections of OTHER years (and the base's own,
  // if they fell inside it). Kept as it was recorded — what the window showed —
  // with the comparison taken from the index for the base year.
  const corrections = [];
  for (const report of reports) {
    if (report.docTypeCode !== "130") continue;
    const periodEnd = resolvePeriodEnd(report);
    const record = { docID: report.docID, periodEnd, submitDateTime: report.submitDateTime, docDescription: report.docDescription };
    if (periodEnd === original.resolvedPeriodEnd && report.submitDateTime > original.submitDateTime) {
      record.comparedToBase = amendment.records.find((r) => r.docID === report.docID)?.comparedToBase ?? { note: "訂正の索引にない" };
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
    // Array order is preference order, not CSV order: a consolidated filer tags
    // both the group table and the 提出会社 one, and which came first in the file
    // would otherwise decide which the pack shows.
    let row = null;
    // indicators.txt follows the basis of the series (see usesFilerOnlySeries); the
    // other sections have a fixed preference.
    for (const element of file === "indicators.txt" ? indicatorsElements(figures.nonConsolidated) : elements) {
      row = rows.find((r) => r["要素ID"] === element && r["値"]);
      if (row) break;
    }
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
  const others = extraSections(rows, Object.values(SECTIONS).flat());
  if (!sectionIndex["segments.txt"]) {
    // The absence of the consolidated segment note says nothing about the accounting standard: a
    // company that files single-entity statements only (トヨコー, 光世証券) has the note under the
    // individual-statement element, which lives in sections.json. Say where it is, not why it is
    // missing — the standard is read from the filing (表紙・経理の状況), never from this.
    const individual = others.find((b) => /セグメント情報/.test(b.name ?? ""));
    warnings.push(
      individual
        ? `連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.json の「${individual.name}」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）`
        : sectionIndex["md-and-a.txt"]
          ? "連結のセグメント情報のテキストブロックが無い。セグメント別の売上・利益は md-and-a.txt に記載されていることが多いので、そこから採り、ログにその旨を書くこと（会計基準はこの有無からは判断できない）"
          : "セグメント情報のテキストブロックが見つからない。有報本文でセグメント情報を確認すること",
    );
  }
  writeFileSync(join(dir, "sections.json"), JSON.stringify(others, null, 2), "utf8");

  writeFileSync(join(dir, "brief.md"), brief(companyId, code4, latest, cover, figures, previous, warnings, amendment.records, sectionIndex), "utf8");

  const summary = {
    companyId,
    securitiesCode: code4,
    // The filing of record (a complete latest 訂正, else the original); `originalDocID`
    // is always the original, so a pack can be matched to the universe row it came from.
    filing: latest,
    coverPage: cover,
    otherFilingsInWindow: reports.filter((r) => r.docID !== original.docID && r.docID !== latest.docID),
    corrections,
    // Authoritative: every 訂正 of the original by parentDocID, oldest first, and which
    // filing is of record. `checkedThrough` is how current the index was when asked.
    amendments: {
      originalDocID: original.docID,
      amendmentDocIDs: choice.amendmentDocIDs,
      effectiveDocID: choice.effectiveDocID,
      effectiveIsAmendment: choice.effectiveIsAmendment,
      status: choice.status,
      blockedBy: choice.blockedBy,
      missing: choice.missing,
      checkedThrough: amendment.checkedThrough,
      indexError: amendment.indexError,
      records: amendment.records,
    },
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
    fiscalYearChange,
    irregularPeriods,
    sections: sectionIndex,
    otherSections: others.map((o) => o.name),
    extractorVersion: EXTRACTOR_VERSION,
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(dir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
  return { dir, summary };
}

// Declared ABOVE the command-line block on purpose: that block runs packFor at module load, and packFor reaches
// PROSE_ELEMENTS (classifyAmendment) for any company with a 訂正. A const declared below it is still in its
// temporal dead zone then, and the rebuild failed with "Cannot access PROSE_ELEMENTS before initialization".
/**
 * The text sections an entry's prose is read from: every section file the pack writes
 * (bar the indicators table, which is financial), plus the regional and revenue notes and the
 * shareholder tables agents read out of sections.json. A correction that changes one of
 * these changes something a published entry may quote — 2026-08 yamaha-motor, whose
 * regional revenue was restated while every total stayed the same.
 */
export const PROSE_ELEMENTS = [
  ...Object.entries(SECTIONS)
    .filter(([file]) => file !== "indicators.txt")
    .flatMap(([, elements]) => elements),
  "jpigp_cor:InformationAboutGeographicalAreasIFRSTextBlock",
  "jpigp_cor:NotesRevenueConsolidatedFinancialStatementsIFRSTextBlock",
  "jpcrp_cor:MajorShareholdersTextBlock",
  "jpcrp_cor:ShareholdingsTextBlock",
];

if (process.argv[1]?.endsWith("evidence-pack.mjs")) {
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
  if (summary.amendments.amendmentDocIDs.length > 0) {
    console.log(`amendments: ${summary.amendments.amendmentDocIDs.join(", ")} → 有効文書 ${summary.amendments.effectiveDocID}（${summary.amendments.status}）`);
  }
  console.log("sections:", Object.entries(summary.sections).map(([f, s]) => `${f} (${s.characters})`).join(", "));
}


/**
 * Every TextBlock that has no file of its own, by name — `sections.json`.
 *
 * A block used to need MORE than 200 characters of raw value to be kept. That dropped exactly the
 * short blocks that say something by being short: 【提出会社の親会社等の情報】 「親会社等はありません」
 * (53 characters), a 【株式の保有状況】 that says the company holds no investment shares (171), an
 * 追加情報 note on a past error (179). A researcher then could not tell "the filing has no such
 * section" from "the extractor dropped it", and wrote exactly that doubt into the entry. The only
 * blocks worth dropping are the ones with nothing in them once the markup is gone.
 * @param {any[]} rows XBRL rows of the filing
 * @param {string[]} taken element ids already written to a .txt file of their own
 */
export function extraSections(rows, taken) {
  return rows
    .filter((r) => /TextBlock/.test(r["要素ID"]) && !taken.includes(r["要素ID"]) && r["値"])
    .map((r) => ({ name: r["項目名"], element: r["要素ID"], text: textBlockToText(r["値"]) }))
    .filter((block) => /[^\s－\-‐–—―・]/.test(block.text));
}

export { SECTIONS, compare, figuresFor, fiveYearFigures, packFor, pickBase, resolvePeriodEnd };
