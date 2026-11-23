/**
 * Full statements (JCE-092): read one consolidated fiscal year's income statement and balance sheet
 * out of a filing's XBRL (EDINET type=5 CSV) and add them to the entry as `financialStatements`,
 * for the learning layer's Phase B exercises.
 *
 * Why mechanical: the figures, their labels and their order are all in the tagged XBRL, so reading
 * them by hand would only add a transcription step that can go wrong. What a person must still do
 * is decide WHICH rows are kept — that choice is the element map below, and it is deliberately
 * narrow: the rows the Phase B exercises read, plus the section totals those rows sit inside.
 * Rows no exercise uses (allowances, lease obligations, provisions) are not transcribed.
 *
 * Nothing is kept on trust. Before a year is written it must agree, exactly, with the entry's own
 * `financials` record for the same year (revenue, the middle profit line, net income, total assets,
 * net assets — all read earlier from the same filing's five-year table) and its own stage
 * arithmetic must close (revenue − cost of sales = gross profit, and so on down both statements).
 * A year that fails either check is reported and skipped, never repaired by hand.
 *
 * Usage:
 *   node scripts/research/statement-details.mjs <company-id> [<company-id> ...] [--write]
 * Without --write it prints what it would add. Needs EDINET_API_KEY (see scripts/research/edinet.mjs).
 *
 * --write --bulk (JCE-098): the mass-expansion mode. Cache-only — a company whose filing is not
 * already in the local document cache is skipped, never fetched — and, following the JCE-097
 * backfill precedent for mechanical bulk additions, it writes no per-company revision file and
 * does not touch `updatedAt`; the batch is recorded in docs/decisions.md instead. Each company
 * prints one machine-readable result line (BULK-RESULT …) for the batch log.
 *
 * Cash flow (JCE-102): the same reading also takes the two cash-flow rows the analysis layer's
 * C2 module rests on — the operating-cash-flow total and the filer's own acquisition-of-fixed-assets
 * outflow — into `cashFlowStatement`. The operating total is kept only where it agrees exactly with
 * the same filing's 経営指標等 summary of the same figure; a year that fails that check keeps its
 * P/L and B/S and simply carries no cash-flow rows. `--write --cashflow` is the backfill mode for
 * entries that already hold statements: cache-only, no revision, no `updatedAt` (the JCE-097/098
 * bulk precedent), one CF-RESULT line per company. Extra cache roots may be named in
 * RESEARCH_CACHE_FALLBACKS (colon-separated) — the pipeline keeps more than one evidence cache.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir, downloadDocument, readCsvRows } from "./edinet.mjs";

const root = process.cwd();
const TODAY = "2026-11-23";

/** The filer's label for a stage row names both signs ("営業利益又は営業損失（△）"); the printed row names one. */
function stageLabel(label, amount) {
  let out = label.replace(/（平成\d+年\d+月\d+日財規等改正後）/g, "").replace(/（IFRS）$/, "").trim();
  if (out.includes("又は")) {
    const [positive, negative] = out.split("又は");
    out = amount < 0 ? negative.replace(/（△）/g, "").trim() : positive.trim();
  }
  // The IFRS taxonomy's sign convention: "営業利益（△損失）" — the printed row is one or the other.
  const ifrsSign = /^(.+?)（△(.+?)）$/.exec(out);
  if (ifrsSign) {
    out = amount < 0 ? `${ifrsSign[1].replace(/利益$/, "")}${ifrsSign[2]}` : ifrsSign[1];
  }
  return out;
}

/** A note item's taxonomy label carries its section as a suffix ("給料及び手当、販売費及び一般管理費"); the printed item is the head. */
function itemLabel(label, section) {
  const suffix = `、${section}`;
  return label.endsWith(suffix) ? label.slice(0, -suffix.length) : label;
}

/**
 * One slot of a statement: either a single element read as one role, or every element matching a
 * pattern read as items of one role, in the order the filing's CSV first shows them.
 */
const PL_SLOTS = [
  // A filer whose top line is 営業収益 (a retailer with financial-services and other operating
  // revenue) prints that total as OperatingRevenue1; 売上高 alone is then only a component of it,
  // and the entry's own revenue figure is the total. The plain form prints NetSales.
  // IFRS (JCE-102): the top line is RevenueIFRS （売上収益） or NetSalesIFRS （売上高） — the two
  // taxonomies' names never coexist in one filing, and the cross-check against the entry's own
  // revenue figure rejects a wrong pick exactly.
  { elements: ["OperatingRevenue1", "NetSales", "RevenueIFRS", "NetSalesIFRS"], role: "revenue", first: true },
  { elements: ["CostOfSales", "CostOfSalesIFRS"], role: "cost-of-sales" },
  { elements: ["GrossProfit", "GrossProfitIFRS"], role: "gross-profit" },
  { elements: ["OperatingRevenueFromFinancialServicesBusiness", "OtherOperatingRevenue1RevOA", "OperatingRevenue2"], role: "other-operating-revenue-item" },
  { element: "OperatingGrossProfit", role: "operating-gross-profit" },
  { elements: ["SellingGeneralAndAdministrativeExpenses", "SellingGeneralAndAdministrativeExpensesIFRS"], role: "selling-general-and-administrative-expenses" },
  { pattern: /SGA$/, exclude: ["SellingGeneralAndAdministrativeExpenses"], role: "sga-item", section: "販売費及び一般管理費" },
  { elements: ["OperatingIncome", "OperatingProfitLossIFRS"], role: "operating-income" },
  { pattern: /NOI$/, role: "non-operating-income-item", section: "営業外収益" },
  { element: "NonOperatingIncome", role: "non-operating-income" },
  { pattern: /NOE$/, role: "non-operating-expense-item", section: "営業外費用" },
  { element: "NonOperatingExpenses", role: "non-operating-expense" },
  { element: "OrdinaryIncome", role: "ordinary-income" },
  { pattern: /EI$/, exclude: ["ExtraordinaryIncome"], role: "extraordinary-income-item", section: "特別利益" },
  { element: "ExtraordinaryIncome", role: "extraordinary-income" },
  { pattern: /EL$/, exclude: ["ExtraordinaryLoss"], role: "extraordinary-loss-item", section: "特別損失" },
  { element: "ExtraordinaryLoss", role: "extraordinary-loss" },
  { elements: ["IncomeBeforeIncomeTaxes", "ProfitLossBeforeTaxIFRS"], role: "income-before-income-taxes" },
  { element: "IncomeTaxesCurrent", role: "income-taxes-item" },
  { element: "IncomeTaxesDeferred", role: "income-taxes-item" },
  { elements: ["IncomeTaxes", "IncomeTaxExpenseIFRS"], role: "income-taxes" },
  { element: "ProfitLossFromContinuingOperationsIFRS", role: "continuing-profit" },
  { element: "ProfitLossFromDiscontinuedOperationsIFRS", role: "discontinued-profit" },
  { elements: ["ProfitLoss", "ProfitLossIFRS"], role: "net-income" },
  { elements: ["ProfitLossAttributableToNonControllingInterests", "ProfitLossAttributableToNonControllingInterestsIFRS"], role: "non-controlling-interests" },
  { elements: ["ProfitLossAttributableToOwnersOfParent", "ProfitLossAttributableToOwnersOfParentIFRS"], role: "net-income-attributable-to-parent" },
];

const PPE_CATEGORIES = [
  "BuildingsAndStructures",
  "MachineryEquipmentAndVehicles",
  "MachineryAndEquipment",
  "Vehicles",
  "ToolsFurnitureAndFixtures",
  "LeaseAssets",
  "RightOfUseAssetsPPE",
  "OtherPPE",
  "ConstructionInProgress",
  "Land",
];

/**
 * IFRS balance-sheet names (JCE-102), each verified against the cached filings' XBRL before
 * being added. Two conventions differ from JGAAP and are deliberate: the entry's 純資産 for an
 * IFRS filer is the parent-attributable equity (that is what `financials` records), so
 * EquityAttributableToOwnersOfParentIFRS takes the total-net-assets role and no line takes
 * total-shareholders-equity; and borrowings are not split into loans and bonds by the IFRS
 * taxonomy (InterestBearingLiabilities is one combined figure), so no borrowing role is filled
 * for IFRS — D2 stays suppressed there rather than read a combined figure as loans.
 */
const IFRS_PPE_NET = [
  "BuildingsAndStructuresIFRS",
  "MachineryAndVehiclesIFRS",
  "ToolsFurnitureAndFixturesIFRS",
  "LandIFRS",
  "ConstructionInProgressIFRS",
  "RightOfUseAssetsIFRS",
];

const BS_SLOTS = [
  { elements: ["CashAndDeposits", "CashAndCashEquivalentsIFRS"], role: "cash-and-deposits" },
  // Trade receivables (JCE-102, for C2's working capital): the combined line where the filer
  // prints one, otherwise its printed components — the two forms are alternatives in the
  // taxonomy, and a filer's 電子記録債権・契約資産 are separate lines of the same 売上債権.
  {
    elements: [
      "NotesAndAccountsReceivableTrade",
      "NotesAndAccountsReceivableTradeAndContractAssets",
      "NotesReceivableTrade",
      "AccountsReceivableTrade",
      "AccountsReceivableTradeAndContractAssets",
      "ElectronicallyRecordedMonetaryClaimsOperatingCA",
      "ContractAssets",
    ],
    role: "accounts-receivable",
  },
  { elements: ["AccountsReceivableFromCompletedConstructionContractsCNS", "NotesReceivableAccountsReceivableFromCompletedConstructionContractsAndOtherCNS"], role: "accounts-receivable", section: "建設業" },
  { elements: ["TradeAndOtherReceivablesCAIFRS", "TradeReceivablesCAIFRS"], role: "accounts-receivable" },
  { elements: ["MerchandiseAndFinishedGoods", "Merchandise", "WorkInProcess", "RawMaterialsAndSupplies", "OtherInventories", "Inventories", "InventoriesCAIFRS"], role: "inventories" },
  { element: "CostsOnUncompletedConstructionContractsCNS", role: "inventories", section: "建設業" },
  { elements: ["OtherCA", "OtherCurrentAssetsCAIFRS"], role: "other-current-assets" },
  { elements: ["CurrentAssets", "CurrentAssetsIFRS"], role: "total-current-assets" },
  { ppe: true },
  { ifrsPpe: true },
  { elements: ["PropertyPlantAndEquipment", "PropertyPlantAndEquipmentIFRS"], role: "total-property-plant-and-equipment" },
  { elements: ["Goodwill", "GoodwillIFRS"], role: "goodwill" },
  { elements: ["Software", "SoftwareInProgress", "OtherIA", "SoftwareIFRS"], role: "intangible-asset-item" },
  { elements: ["IntangibleAssets", "IntangibleAssetsIFRS"], role: "total-intangible-assets" },
  { element: "InvestmentsAndOtherAssets", role: "total-investments-and-other-assets" },
  { elements: ["NoncurrentAssets", "NonCurrentAssetsIFRS"], role: "total-non-current-assets" },
  { elements: ["Assets", "AssetsIFRS"], role: "total-assets" },
  {
    elements: [
      "NotesAndAccountsPayableTrade",
      "NotesAndAccountsPayableTradeAndContractLiabilities",
      "NotesPayableTrade",
      "AccountsPayableTrade",
      "ElectronicallyRecordedObligationsOperatingCL",
      "OperatingAccountsPayable",
    ],
    role: "accounts-payable",
  },
  { elements: ["AccountsPayableForConstructionContractsCNS", "NotesPayableAccountsPayableForConstructionContractsAndOtherCNS"], role: "accounts-payable", section: "建設業" },
  { elements: ["TradeAndOtherPayablesCLIFRS", "TradePayablesCLIFRS"], role: "accounts-payable" },
  { element: "ShortTermLoansPayable", role: "short-term-borrowings" },
  { element: "CurrentPortionOfLongTermLoansPayable", role: "current-portion-of-long-term-borrowings" },
  { elements: ["CurrentPortionOfBonds", "ShortTermBondsPayable"], role: "current-portion-of-bonds" },
  { elements: ["OtherCL", "OtherCurrentLiabilitiesCLIFRS"], role: "other-current-liabilities" },
  { elements: ["CurrentLiabilities", "TotalCurrentLiabilitiesIFRS"], role: "total-current-liabilities" },
  { element: "BondsPayable", role: "bonds" },
  { element: "LongTermLoansPayable", role: "long-term-borrowings" },
  { elements: ["OtherNCL", "OtherNonCurrentLiabilitiesNCLIFRS"], role: "other-non-current-liabilities" },
  { elements: ["NoncurrentLiabilities", "NonCurrentLabilitiesIFRS"], role: "total-non-current-liabilities" },
  { elements: ["Liabilities", "LiabilitiesIFRS"], role: "total-liabilities" },
  { elements: ["CapitalStock", "ShareCapitalIFRS"], role: "share-capital" },
  { elements: ["CapitalSurplus", "CapitalSurplusIFRS"], role: "capital-surplus" },
  { elements: ["RetainedEarnings", "RetainedEarningsIFRS"], role: "retained-earnings" },
  { elements: ["TreasuryStock", "TreasurySharesIFRS"], role: "treasury-shares" },
  { element: "ShareholdersEquity", role: "total-shareholders-equity" },
  { elements: ["ValuationAndTranslationAdjustments", "OtherComponentsOfEquityIFRS"], role: "accumulated-other-comprehensive-income" },
  { element: "SubscriptionRightsToShares", role: "share-acquisition-rights" },
  { elements: ["NonControllingInterests", "NonControllingInterestsIFRS"], role: "non-controlling-interests" },
  { elements: ["NetAssets", "EquityAttributableToOwnersOfParentIFRS"], role: "total-net-assets" },
];

/** Rows of one context as element local-name → { label, amount }, in first-appearance order. Throws on a disagreement. */
function contextRows(rows, context) {
  const map = new Map();
  for (const r of rows) {
    if (r["コンテキストID"] !== context) continue;
    if (r["単位"] !== "円") continue;
    const raw = (r["値"] ?? "").trim();
    if (raw === "" || raw === "－" || raw === "-") continue;
    const amount = Number(raw);
    if (!Number.isFinite(amount)) continue;
    const element = (r["要素ID"] ?? "").split(":").pop();
    const label = r["項目名"] ?? "";
    const prev = map.get(element);
    if (prev) {
      if (prev.amount !== amount) throw new Error(`${context}: ${element} が2つの値を持つ (${prev.amount} / ${amount})`);
      continue;
    }
    map.set(element, { label, amount });
  }
  return map;
}

function buildLines(map, slots, kind) {
  const lines = [];
  const push = (role, entry, section) => {
    const label = section ? itemLabel(entry.label, section) : stageLabel(entry.label, entry.amount);
    // A filer-specific (extension taxonomy) item whose name the XBRL-to-CSV conversion does not
    // carry has no verifiable printed label. It is left out rather than named by guess — the
    // total it belongs to is a separate line and stays exact.
    if (!label.trim()) return;
    // The same printed item can be tagged twice (statement body and a note) with the same value.
    if (lines.some((l) => l.role === role && l.label === label && l.amount === entry.amount)) return;
    lines.push({ role, label, amount: entry.amount });
  };
  for (const slot of slots) {
    if (slot.ifrsPpe) {
      // IFRS prints each PPE category at its carrying amount directly (no gross/accumulated pair
      // in the statement body), so each category is one net line.
      for (const name of IFRS_PPE_NET) {
        const entry = map.get(name);
        if (entry) push("ppe-net", entry);
      }
      continue;
    }
    if (slot.ppe) {
      for (const cat of PPE_CATEGORIES) {
        const gross = map.get(cat);
        const accum = map.get(`AccumulatedDepreciation${cat}`);
        const net = map.get(`${cat}Net`);
        if (cat === "Land" || cat === "ConstructionInProgress") {
          if (gross) push("ppe-net", gross);
          continue;
        }
        if (gross) push("ppe-gross", gross);
        if (accum) push("accumulated-depreciation", accum);
        if (net) push("ppe-net", net);
      }
      continue;
    }
    if (slot.pattern) {
      for (const [element, entry] of map) {
        if (!slot.pattern.test(element)) continue;
        if (slot.exclude?.includes(element)) continue;
        push(slot.role, entry, slot.section);
      }
      continue;
    }
    const names = slot.elements ?? [slot.element];
    for (const name of names) {
      const entry = map.get(name);
      if (entry) {
        push(slot.role, entry, slot.section);
        if (slot.first) break;
      }
    }
  }
  return lines;
}

/**
 * The type=5 zip for a document, from the primary cache root or a fallback root
 * (RESEARCH_CACHE_FALLBACKS). Bulk modes are cache-only: a document no root holds is skipped,
 * never fetched.
 */
function cachedZipPath(docId) {
  const roots = [cacheDir(), ...(process.env.RESEARCH_CACHE_FALLBACKS ?? "").split(":").filter(Boolean)];
  for (const r of roots) {
    const p = join(r, "documents", `${docId}-5.zip`);
    if (existsSync(p)) return p;
  }
  return null;
}

/* ---------- cash flow (JCE-102) ---------- */

const CF_OP_ELEMENT = {
  jgaap: "NetCashProvidedByUsedInOperatingActivities",
  ifrs: "NetCashProvidedByUsedInOperatingActivitiesIFRS",
};
const CF_OP_SUMMARY_ELEMENT = {
  jgaap: "NetCashProvidedByUsedInOperatingActivitiesSummaryOfBusinessResults",
  ifrs: "CashFlowsFromUsedInOperatingActivitiesIFRSSummaryOfBusinessResults",
};
/**
 * The filer's own fixed-asset acquisition outflow, in the order a reader would prefer it: the
 * tangible-fixed-assets line first, then the filer's combined fixed-asset line (有形・無形を分けない
 * 会社はその行が設備投資の印字そのもの). IFRS names follow the same order.
 */
const CF_CAPEX_ELEMENTS = [
  "PurchaseOfPropertyPlantAndEquipmentInvCF",
  "PurchaseOfNoncurrentAssetsInvCF",
  "PurchaseOfPropertyPlantAndEquipmentAndIntangibleAssetsInvCF",
  "PurchaseOfPropertyPlantAndEquipmentInvCFIFRS",
  "PurchaseOfPropertyPlantAndEquipmentAndIntangibleAssetsInvCFIFRS",
];

/** A capex row's taxonomy label carries its section as a suffix, like a note item's does. */
function cfItemLabel(label) {
  return label.replace(/、投資活動によるキャッシュ・フロー（IFRS）$/, "").replace(/、投資活動によるキャッシュ・フロー$/, "").trim();
}

/**
 * The two cash-flow rows of one context, or the reason they cannot be kept. The operating total
 * must agree exactly with the same filing's 経営指標等 summary of the same figure where the filing
 * prints one — the same discipline the P/L and B/S are held to against the five-year record.
 */
function buildCashFlow(map, standard) {
  const op = map.get(CF_OP_ELEMENT[standard] ?? CF_OP_ELEMENT.jgaap);
  if (!op) return { lines: null, reason: "営業キャッシュフローの行が読めない" };
  const summary = map.get(CF_OP_SUMMARY_ELEMENT[standard] ?? CF_OP_SUMMARY_ELEMENT.jgaap);
  if (summary && summary.amount !== op.amount) {
    return { lines: null, reason: `営業キャッシュフローが経営指標等の値と一致しない (${op.amount} ≠ ${summary.amount})` };
  }
  let capex = null;
  for (const name of CF_CAPEX_ELEMENTS) {
    const entry = map.get(name);
    if (entry) { capex = entry; break; }
  }
  if (!capex) return { lines: null, reason: "設備投資（固定資産の取得）の行が読めない" };
  const capexLabel = cfItemLabel(capex.label);
  if (!capexLabel) return { lines: null, reason: "設備投資の行名が読めない" };
  return {
    lines: [
      { role: "operating-cash-flow", label: stageLabel(op.label, op.amount), amount: op.amount },
      { role: "capital-expenditure", label: capexLabel, amount: capex.amount },
    ],
  };
}

const byRole = (lines, role) => lines.filter((l) => l.role === role);
const one = (lines, role) => byRole(lines, role)[0]?.amount ?? null;
const sum = (lines, role) => byRole(lines, role).reduce((a, l) => a + l.amount, 0);

function checkYear(pl, bs, rec) {
  const problems = [];
  const eq = (what, a, b) => {
    if (a === null || b === null) return;
    if (a !== b) problems.push(`${what}: ${a} ≠ ${b}`);
  };
  // Stage arithmetic is checked to the filing's own printed unit: every line is stated in 百万円
  // (rounded or truncated independently), so a sum of printed lines can sit a few units away from
  // the printed total — one unit per printed value involved, roughly. The tolerance is therefore
  // counted in values, not fixed: a three-value stage check allows ¥2,000,000, the four-component
  // net-assets composition ¥4,000,000. Anything beyond that is a real disagreement and fails the year.
  const close = (what, a, b, values = 3) => {
    if (a === null || b === null) return;
    if (Math.abs(a - b) > (values - 1) * 1_000_000) problems.push(`${what}: ${a} ≠ ${b}`);
  };
  // Against the entry's own five-year record of the same filing.
  eq("売上", one(pl, "revenue"), rec.revenue);
  if (rec.profitLabel === "経常利益") eq("経常利益", one(pl, "ordinary-income"), rec.profit);
  if (rec.profitLabel?.includes("税引前")) eq("税引前利益", one(pl, "income-before-income-taxes"), rec.profit);
  if (rec.netIncomeLabel.includes("親会社")) eq("純利益（親会社帰属）", one(pl, "net-income-attributable-to-parent"), rec.netIncome);
  else eq("純利益", one(pl, "net-income"), rec.netIncome);
  eq("総資産", one(bs, "total-assets"), rec.totalAssets);
  eq("純資産", one(bs, "total-net-assets"), rec.netAssets);
  // The statements' own arithmetic.
  const rev = one(pl, "revenue"), cost = one(pl, "cost-of-sales"), gross = one(pl, "gross-profit");
  const sga = one(pl, "selling-general-and-administrative-expenses"), op = one(pl, "operating-income");
  const noi = one(pl, "non-operating-income"), noe = one(pl, "non-operating-expense"), ord = one(pl, "ordinary-income");
  const ei = one(pl, "extraordinary-income"), el = one(pl, "extraordinary-loss"), pre = one(pl, "income-before-income-taxes");
  const tax = one(pl, "income-taxes"), net = one(pl, "net-income"), nci = one(pl, "non-controlling-interests"), attr = one(pl, "net-income-attributable-to-parent");
  if (rev !== null && cost !== null && gross !== null) close("売上−原価＝粗利", rev - cost, gross);
  const opGross = one(pl, "operating-gross-profit");
  if (opGross !== null) {
    // The 営業収益 form: other operating revenue joins after gross profit, and SG&A comes off the
    // operating gross profit rather than the gross profit.
    if (gross !== null) close("粗利＋その他の営業収益＝営業総利益", gross + sum(pl, "other-operating-revenue-item"), opGross, 5);
    if (sga !== null && op !== null) close("営業総利益−販管費＝営業利益", opGross - sga, op);
  } else if (rec.accountingStandard !== "ifrs" && gross !== null && sga !== null && op !== null) {
    // IFRS operating profit also carries other income/expenses and the equity-method result
    // between gross profit and operating profit, so this stage does not close there; the IFRS
    // year is held instead to the exact checks against the entry's own record above and to the
    // stages below it （税引前−法人税等＝当期純利益, and the balance-sheet identities).
    close("粗利−販管費＝営業利益", gross - sga, op);
  }
  if (op !== null && noi !== null && noe !== null && ord !== null) close("営業＋営業外収益−営業外費用＝経常", op + noi - noe, ord);
  if (ord !== null && pre !== null) close("経常＋特別利益−特別損失＝税引前", ord + (ei ?? 0) - (el ?? 0), pre);
  const cont = one(pl, "continuing-profit"), disc = one(pl, "discontinued-profit");
  if (cont !== null) {
    // IFRS with discontinued operations: the printed pre-tax is the continuing-operations
    // figure, so the stage closes in two steps — pre-tax less tax is the continuing profit,
    // and continuing plus discontinued is the net profit (JCE-103, verified on Bridgestone).
    if (pre !== null && tax !== null) close("税引前−法人税等＝継続事業からの当期純利益", pre - tax, cont);
    if (net !== null) close("継続＋非継続＝当期純利益", cont + (disc ?? 0), net);
  } else if (pre !== null && tax !== null && net !== null) close("税引前−法人税等＝当期純利益", pre - tax, net);
  if (net !== null && attr !== null) close("当期純利益−非支配帰属＝親会社帰属", net - (nci ?? 0), attr);
  const ca = one(bs, "total-current-assets"), nca = one(bs, "total-non-current-assets"), ta = one(bs, "total-assets");
  const cl = one(bs, "total-current-liabilities"), ncl = one(bs, "total-non-current-liabilities"), tl = one(bs, "total-liabilities"), na = one(bs, "total-net-assets");
  if (ca !== null && nca !== null && ta !== null) close("流動資産＋固定資産＝総資産", ca + nca, ta);
  if (cl !== null && ncl !== null && tl !== null) close("流動負債＋固定負債＝負債", cl + ncl, tl);
  if (tl !== null && na !== null && ta !== null) {
    // For IFRS the transcribed 純資産 is the parent-attributable equity alone, so the identity
    // closes only with non-controlling interests added back (JCE-102).
    const nciForIdentity = rec.accountingStandard === "ifrs" ? (one(bs, "non-controlling-interests") ?? 0) : 0;
    close("負債＋純資産＝総資産", tl + na + nciForIdentity, ta, nciForIdentity !== 0 ? 4 : 3);
  }
  const se = one(bs, "total-shareholders-equity"), aoci = one(bs, "accumulated-other-comprehensive-income");
  const rights = one(bs, "share-acquisition-rights"), nciBs = one(bs, "non-controlling-interests");
  if (se !== null && aoci !== null && na !== null) close("株主資本＋評価・換算差額等＋新株予約権＋非支配株主持分＝純資産", se + aoci + (rights ?? 0) + (nciBs ?? 0), na, 5);
  if (rec.accountingStandard === "ifrs" && na !== null) {
    // The IFRS composition: 純資産 here is the parent-attributable equity, whose printed
    // components are capital, surplus, retained earnings, treasury shares and other components
    // of equity. No shareholders'-equity total is transcribed for IFRS (see BS_SLOTS).
    const cap = one(bs, "share-capital"), surplus = one(bs, "capital-surplus"), retained = one(bs, "retained-earnings");
    const treasury = one(bs, "treasury-shares");
    if (cap !== null && surplus !== null && retained !== null && treasury !== null && aoci !== null) {
      close("資本金＋資本剰余金＋利益剰余金＋自己株式＋その他の資本の構成要素＝親会社帰属持分", cap + surplus + retained + treasury + aoci, na, 6);
    }
  }
  // Section totals against their transcribed items, where a total is printed and items were kept.
  if (sga !== null && byRole(pl, "sga-item").length > 0) {
    const s = sum(pl, "sga-item");
    if (s > sga) problems.push(`販管費内訳の合計 ${s} が販管費 ${sga} を超える`);
  }
  return problems;
}

/**
 * The --cashflow backfill (JCE-102): add `cashFlowStatement` to the statement blocks an entry
 * already holds, reading the very filing each block names (its docId). Cache-only, and a block
 * whose newest year is no longer the entry's newest record is left alone — which context of the
 * filing a year sits in is then no longer provable from the entry.
 */
function cashflowBackfill(ids, write) {
  for (const id of ids) {
    const entryPath = join(root, "src/data/companies", `${id}.json`);
    const entry = JSON.parse(readFileSync(entryPath, "utf8"));
    if (!entry.financialStatements) {
      console.log(`CF-RESULT ${id} no-statements`);
      continue;
    }
    const records = [...entry.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
    const latestEnd = records.at(-1)?.periodEnd;
    const blocks = entry.financialStatements;
    if (blocks.some((s) => !s.docId)) {
      console.log(`CF-RESULT ${id} block-without-docid`);
      continue;
    }
    if (blocks.map((s) => s.periodEnd).sort().at(-1) !== latestEnd) {
      console.log(`CF-RESULT ${id} stale-block`);
      continue;
    }
    const next = blocks.map((s) => ({ ...s }));
    const byDoc = new Map();
    next.forEach((s, i) => {
      if (!byDoc.has(s.docId)) byDoc.set(s.docId, []);
      byDoc.get(s.docId).push(i);
    });
    let added = 0;
    const notes = [];
    for (const [docId, idxs] of byDoc) {
      const zip = cachedZipPath(docId);
      if (!zip) {
        notes.push(`not-cached ${docId}`);
        continue;
      }
      let rows;
      try {
        rows = readCsvRows(zip);
      } catch (error) {
        notes.push(`unreadable-csv ${docId}: ${error.message}`);
        continue;
      }
      const currentEnd = idxs.map((i) => next[i].periodEnd).sort().at(-1);
      for (const i of idxs) {
        const s = next[i];
        if (s.cashFlowStatement) continue;
        const ctx = s.periodEnd === currentEnd ? "CurrentYear" : "Prior1Year";
        let cf;
        try {
          cf = buildCashFlow(contextRows(rows, `${ctx}Duration`), s.accountingStandard);
        } catch (error) {
          notes.push(`${s.fiscalYear}: ${error.message}`);
          continue;
        }
        if (!cf.lines) {
          notes.push(`${s.fiscalYear}: ${cf.reason}`);
          continue;
        }
        // Keep the field order the schema and the JCE-098 blocks use: after balanceSheet.
        const { sourceIds, ...rest } = s;
        next[i] = { ...rest, cashFlowStatement: cf.lines, sourceIds };
        added++;
      }
    }
    if (added > 0 && write) {
      writeFileSync(entryPath, `${JSON.stringify({ ...entry, financialStatements: next }, null, 2)}\n`);
    }
    console.log(`CF-RESULT ${id} added=${added}${notes.length > 0 ? ` notes=${notes.join("／")}` : ""}`);
  }
}

/**
 * The --balance-sheet backfill (JCE-102): re-read the filing each block names and widen the
 * balance sheet where the element map has grown (trade-receivable / trade-payable components,
 * for C2's working capital). Purely additive by construction: a year is rewritten only where
 * the rebuilt P/L equals the registered P/L line for line, the rebuilt B/S still passes every
 * cross-check, and every registered B/S line is still present — anything else is reported and
 * left exactly as registered. Cache-only, no revision, no `updatedAt` (the bulk precedent).
 */
function balanceSheetBackfill(ids, write) {
  const key = (l) => `${l.role} ${l.label} ${l.amount}`;
  for (const id of ids) {
    const entryPath = join(root, "src/data/companies", `${id}.json`);
    const entry = JSON.parse(readFileSync(entryPath, "utf8"));
    if (!entry.financialStatements) {
      console.log(`BS-RESULT ${id} no-statements`);
      continue;
    }
    const records = [...entry.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
    const latestEnd = records.at(-1)?.periodEnd;
    const blocks = entry.financialStatements;
    if (blocks.some((s) => !s.docId)) {
      console.log(`BS-RESULT ${id} block-without-docid`);
      continue;
    }
    if (blocks.map((s) => s.periodEnd).sort().at(-1) !== latestEnd) {
      console.log(`BS-RESULT ${id} stale-block`);
      continue;
    }
    const next = blocks.map((s) => ({ ...s }));
    const byDoc = new Map();
    next.forEach((s, i) => {
      if (!byDoc.has(s.docId)) byDoc.set(s.docId, []);
      byDoc.get(s.docId).push(i);
    });
    let widened = 0;
    const notes = [];
    for (const [docId, idxs] of byDoc) {
      const zip = cachedZipPath(docId);
      if (!zip) {
        notes.push(`not-cached ${docId}`);
        continue;
      }
      let rows;
      try {
        rows = readCsvRows(zip);
      } catch (error) {
        notes.push(`unreadable-csv ${docId}: ${error.message}`);
        continue;
      }
      const currentEnd = idxs.map((i) => next[i].periodEnd).sort().at(-1);
      for (const i of idxs) {
        const s = next[i];
        const rec = records.find((r) => r.periodEnd === s.periodEnd);
        if (!rec) {
          notes.push(`${s.fiscalYear}: 対応する財務レコードがない`);
          continue;
        }
        const ctx = s.periodEnd === currentEnd ? "CurrentYear" : "Prior1Year";
        let pl, bs;
        try {
          pl = buildLines(contextRows(rows, `${ctx}Duration`), PL_SLOTS, "pl");
          bs = buildLines(contextRows(rows, `${ctx}Instant`), BS_SLOTS, "bs");
        } catch (error) {
          notes.push(`${s.fiscalYear}: ${error.message}`);
          continue;
        }
        const plSame = pl.length === s.incomeStatement.length && pl.every((l, j) => key(l) === key(s.incomeStatement[j]));
        if (!plSame) {
          notes.push(`${s.fiscalYear}: 再構築した損益計算書が登録済みと一致しない`);
          continue;
        }
        const problems = checkYear(pl, bs, rec);
        if (problems.length > 0) {
          notes.push(`${s.fiscalYear}: 照合不一致 — ${problems.join("／")}`);
          continue;
        }
        const before = new Set(s.balanceSheet.map(key));
        const after = new Set(bs.map(key));
        if (![...before].every((k) => after.has(k))) {
          notes.push(`${s.fiscalYear}: 再構築で登録済みの行が欠ける`);
          continue;
        }
        if (bs.length > s.balanceSheet.length) {
          next[i] = { ...s, balanceSheet: bs };
          widened++;
        }
      }
    }
    if (widened > 0 && write) {
      writeFileSync(entryPath, `${JSON.stringify({ ...entry, financialStatements: next }, null, 2)}\n`);
    }
    console.log(`BS-RESULT ${id} widened=${widened}${notes.length > 0 ? ` notes=${notes.join("／")}` : ""}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const bulk = args.includes("--bulk");
  const ids = args.filter((a) => !a.startsWith("--"));
  if (ids.length === 0) throw new Error("company id を1つ以上指定してください");
  if (args.includes("--cashflow")) {
    cashflowBackfill(ids, write);
    return;
  }
  if (args.includes("--balance-sheet")) {
    balanceSheetBackfill(ids, write);
    return;
  }
  for (const id of ids) {
    const entryPath = join(root, "src/data/companies", `${id}.json`);
    const entry = JSON.parse(readFileSync(entryPath, "utf8"));
    if (bulk && entry.financialStatements) {
      console.log(`BULK-RESULT ${id} already-has-statements`);
      continue;
    }
    const records = [...entry.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
    const latest = records.at(-1);
    const source = entry.sources.find((s) => latest.sourceIds.includes(s.id)) ?? entry.sources.find((s) => s.id === latest.sourceIds[0]);
    let docId = source.docId ?? /S[0-9A-Z]{7}/.exec(source.url ?? "")?.[0];
    if (!docId) {
      // The newest record may cite a source carrying no document id while the entry holds the
      // filing itself under another source (the eight of JCE-102: advantest, toyota, …). A source
      // whose title names a 有価証券報告書 and which carries a docId is a candidate — never more
      // than a candidate: a year's figures are kept only where they agree exactly with the entry's
      // own records of the same filing, which a wrong document cannot do.
      docId = entry.sources.find((s) => s.docId && s.title.includes("有価証券報告書") && !s.title.includes("半期"))?.docId;
    }
    if (!docId) {
      console.log(`${id}: 書類IDが特定できない`);
      if (bulk) console.log(`BULK-RESULT ${id} no-doc-id`);
      continue;
    }
    let zip;
    if (bulk) {
      zip = cachedZipPath(docId);
      if (!zip) {
        console.log(`BULK-RESULT ${id} not-cached ${docId}`);
        continue;
      }
    } else {
      zip = await downloadDocument(docId, 5).catch(() => null);
    }
    console.log(`${id}: docID ${docId}`);
    if (!zip) {
      console.log("  CSVを取得できない");
      if (bulk) console.log(`BULK-RESULT ${id} no-csv ${docId}`);
      continue;
    }
    let rows;
    try {
      rows = readCsvRows(zip);
    } catch (error) {
      console.log(`  CSVを読めない — ${error.message}`);
      if (bulk) console.log(`BULK-RESULT ${id} unreadable-csv ${docId}`);
      continue;
    }
    const years = [
      { ctx: "Prior1Year", rec: records.at(-2) },
      { ctx: "CurrentYear", rec: latest },
    ];
    const built = [];
    for (const { ctx, rec } of years) {
      if (!rec) continue;
      let pl, bs, durMap;
      try {
        durMap = contextRows(rows, `${ctx}Duration`);
        pl = buildLines(durMap, PL_SLOTS, "pl");
        bs = buildLines(contextRows(rows, `${ctx}Instant`), BS_SLOTS, "bs");
      } catch (error) {
        console.log(`  ${rec.fiscalYear}: 読み取り失敗 — ${error.message}`);
        continue;
      }
      // A year whose key stages did not read at all (an IFRS filer's CSV, whose elements this map
      // does not cover) must fail loudly — with every line missing, each check below skips itself
      // and the year would "pass" empty.
      const missing = [];
      if (one(pl, "revenue") === null) missing.push("売上（にあたる行）");
      if (one(pl, "operating-income") === null && one(pl, "ordinary-income") === null) missing.push("営業利益・経常利益");
      if (one(pl, "net-income-attributable-to-parent") === null && one(pl, "net-income") === null) missing.push("純利益");
      if (one(bs, "total-assets") === null) missing.push("総資産");
      if (one(bs, "total-net-assets") === null) missing.push("純資産");
      if (missing.length > 0) {
        console.log(`  ${rec.fiscalYear}: 必須の行が読めないため不採用 — ${missing.join("・")}`);
        continue;
      }
      const problems = checkYear(pl, bs, rec);
      if (problems.length > 0) {
        console.log(`  ${rec.fiscalYear}: 照合不一致のため不採用 — ${problems.join("／")}`);
        continue;
      }
      console.log(`  ${rec.fiscalYear}: 照合OK (P/L ${pl.length}行 / B/S ${bs.length}行)`);
      // JCE-102: the year's cash-flow rows ride along where they read and cross-check; a year
      // whose cash flow cannot be kept still keeps its P/L and B/S, with no cash-flow rows.
      const cf = buildCashFlow(durMap, rec.accountingStandard);
      if (!cf.lines) console.log(`  ${rec.fiscalYear}: CFは付けない — ${cf.reason}`);
      built.push({
        fiscalYear: rec.fiscalYear,
        periodEnd: rec.periodEnd,
        accountingStandard: rec.accountingStandard,
        // JCE-098 (asFiledIn): the document actually read. Both years come out of this one filing,
        // so naming it is what lets a later change inside the block claim to be as-filed.
        docId,
        incomeStatement: pl,
        balanceSheet: bs,
        ...(cf.lines ? { cashFlowStatement: cf.lines } : {}),
        sourceIds: rec.sourceIds,
      });
    }
    if (built.length === 0) {
      console.log("  採用できる年度がない");
      if (bulk) console.log(`BULK-RESULT ${id} no-usable-year standard=${latest.accountingStandard}`);
      continue;
    }
    if (!write) {
      for (const b of built) {
        console.log(`  --- ${b.fiscalYear} P/L ---`);
        for (const l of b.incomeStatement) console.log(`    [${l.role}] ${l.label}: ${l.amount}`);
        console.log(`  --- ${b.fiscalYear} B/S ---`);
        for (const l of b.balanceSheet) console.log(`    [${l.role}] ${l.label}: ${l.amount}`);
        if (b.cashFlowStatement) {
          console.log(`  --- ${b.fiscalYear} CF ---`);
          for (const l of b.cashFlowStatement) console.log(`    [${l.role}] ${l.label}: ${l.amount}`);
        }
      }
      continue;
    }
    if (bulk) {
      // JCE-098 bulk mode: the field only — no updatedAt change, no per-company revision
      // (the JCE-097 backfill precedent; the batch is recorded in docs/decisions.md).
      writeFileSync(entryPath, `${JSON.stringify({ ...entry, financialStatements: built }, null, 2)}\n`);
      console.log(`BULK-RESULT ${id} written years=${built.map((b) => b.fiscalYear).join("|")} standard=${latest.accountingStandard}`);
      continue;
    }
    const next = { ...entry, financialStatements: built, updatedAt: TODAY };
    writeFileSync(entryPath, `${JSON.stringify(next, null, 2)}\n`);
    const revisionBase = `${TODAY}-company-${id}-statements-added`;
    let revisionId = revisionBase;
    for (let n = 2; existsSync(join(root, "src/data/revisions", `${revisionId}.json`)); n++) revisionId = `${revisionBase}-${n}`;
    const revision = {
      id: revisionId,
      targetType: "company",
      targetId: id,
      changedAt: TODAY,
      reason: "学習 Phase B（JCE-092）のために、有価証券報告書の連結損益計算書・連結貸借対照表の全文（行の並びと印字値）を EDINET の XBRL から追加した。既存の数値と解説は変更していない",
      summary: `${built.map((b) => b.fiscalYear).join("・")} の連結損益計算書・連結貸借対照表を追加。売上・経常利益・純利益・総資産・純資産が既存の financials と一致し、段階の検算が閉じることを確認した`,
      after: built,
    };
    writeFileSync(join(root, "src/data/revisions", `${revisionId}.json`), `${JSON.stringify(revision, null, 2)}\n`);
    console.log(`  書き込み完了（改訂記録 ${revisionId}）`);
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
