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
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir, downloadDocument, readCsvRows } from "./edinet.mjs";

const root = process.cwd();
const TODAY = "2026-11-23";

/** The filer's label for a stage row names both signs ("営業利益又は営業損失（△）"); the printed row names one. */
function stageLabel(label, amount) {
  let out = label.replace(/（平成\d+年\d+月\d+日財規等改正後）/g, "").trim();
  if (out.includes("又は")) {
    const [positive, negative] = out.split("又は");
    out = amount < 0 ? negative.replace(/（△）/g, "").trim() : positive.trim();
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
  { elements: ["OperatingRevenue1", "NetSales"], role: "revenue", first: true },
  { element: "CostOfSales", role: "cost-of-sales" },
  { element: "GrossProfit", role: "gross-profit" },
  { elements: ["OperatingRevenueFromFinancialServicesBusiness", "OtherOperatingRevenue1RevOA", "OperatingRevenue2"], role: "other-operating-revenue-item" },
  { element: "OperatingGrossProfit", role: "operating-gross-profit" },
  { element: "SellingGeneralAndAdministrativeExpenses", role: "selling-general-and-administrative-expenses" },
  { pattern: /SGA$/, exclude: ["SellingGeneralAndAdministrativeExpenses"], role: "sga-item", section: "販売費及び一般管理費" },
  { element: "OperatingIncome", role: "operating-income" },
  { pattern: /NOI$/, role: "non-operating-income-item", section: "営業外収益" },
  { element: "NonOperatingIncome", role: "non-operating-income" },
  { pattern: /NOE$/, role: "non-operating-expense-item", section: "営業外費用" },
  { element: "NonOperatingExpenses", role: "non-operating-expense" },
  { element: "OrdinaryIncome", role: "ordinary-income" },
  { pattern: /EI$/, exclude: ["ExtraordinaryIncome"], role: "extraordinary-income-item", section: "特別利益" },
  { element: "ExtraordinaryIncome", role: "extraordinary-income" },
  { pattern: /EL$/, exclude: ["ExtraordinaryLoss"], role: "extraordinary-loss-item", section: "特別損失" },
  { element: "ExtraordinaryLoss", role: "extraordinary-loss" },
  { element: "IncomeBeforeIncomeTaxes", role: "income-before-income-taxes" },
  { element: "IncomeTaxesCurrent", role: "income-taxes-item" },
  { element: "IncomeTaxesDeferred", role: "income-taxes-item" },
  { element: "IncomeTaxes", role: "income-taxes" },
  { element: "ProfitLoss", role: "net-income" },
  { element: "ProfitLossAttributableToNonControllingInterests", role: "non-controlling-interests" },
  { element: "ProfitLossAttributableToOwnersOfParent", role: "net-income-attributable-to-parent" },
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

const BS_SLOTS = [
  { element: "CashAndDeposits", role: "cash-and-deposits" },
  { elements: ["NotesAndAccountsReceivableTrade", "NotesAndAccountsReceivableTradeAndContractAssets"], role: "accounts-receivable" },
  { elements: ["MerchandiseAndFinishedGoods", "Merchandise", "WorkInProcess", "RawMaterialsAndSupplies", "OtherInventories", "Inventories"], role: "inventories" },
  { element: "CostsOnUncompletedConstructionContractsCNS", role: "inventories", section: "建設業" },
  { element: "OtherCA", role: "other-current-assets" },
  { element: "CurrentAssets", role: "total-current-assets" },
  { ppe: true },
  { element: "PropertyPlantAndEquipment", role: "total-property-plant-and-equipment" },
  { element: "Goodwill", role: "goodwill" },
  { elements: ["Software", "SoftwareInProgress", "OtherIA"], role: "intangible-asset-item" },
  { element: "IntangibleAssets", role: "total-intangible-assets" },
  { element: "InvestmentsAndOtherAssets", role: "total-investments-and-other-assets" },
  { element: "NoncurrentAssets", role: "total-non-current-assets" },
  { element: "Assets", role: "total-assets" },
  { elements: ["NotesAndAccountsPayableTrade", "NotesAndAccountsPayableTradeAndContractLiabilities"], role: "accounts-payable" },
  { element: "ShortTermLoansPayable", role: "short-term-borrowings" },
  { element: "CurrentPortionOfLongTermLoansPayable", role: "current-portion-of-long-term-borrowings" },
  { elements: ["CurrentPortionOfBonds", "ShortTermBondsPayable"], role: "current-portion-of-bonds" },
  { element: "OtherCL", role: "other-current-liabilities" },
  { element: "CurrentLiabilities", role: "total-current-liabilities" },
  { element: "BondsPayable", role: "bonds" },
  { element: "LongTermLoansPayable", role: "long-term-borrowings" },
  { element: "OtherNCL", role: "other-non-current-liabilities" },
  { element: "NoncurrentLiabilities", role: "total-non-current-liabilities" },
  { element: "Liabilities", role: "total-liabilities" },
  { element: "CapitalStock", role: "share-capital" },
  { element: "CapitalSurplus", role: "capital-surplus" },
  { element: "RetainedEarnings", role: "retained-earnings" },
  { element: "TreasuryStock", role: "treasury-shares" },
  { element: "ShareholdersEquity", role: "total-shareholders-equity" },
  { element: "ValuationAndTranslationAdjustments", role: "accumulated-other-comprehensive-income" },
  { element: "SubscriptionRightsToShares", role: "share-acquisition-rights" },
  { element: "NonControllingInterests", role: "non-controlling-interests" },
  { element: "NetAssets", role: "total-net-assets" },
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
  } else if (gross !== null && sga !== null && op !== null) {
    close("粗利−販管費＝営業利益", gross - sga, op);
  }
  if (op !== null && noi !== null && noe !== null && ord !== null) close("営業＋営業外収益−営業外費用＝経常", op + noi - noe, ord);
  if (ord !== null && pre !== null) close("経常＋特別利益−特別損失＝税引前", ord + (ei ?? 0) - (el ?? 0), pre);
  if (pre !== null && tax !== null && net !== null) close("税引前−法人税等＝当期純利益", pre - tax, net);
  if (net !== null && attr !== null) close("当期純利益−非支配帰属＝親会社帰属", net - (nci ?? 0), attr);
  const ca = one(bs, "total-current-assets"), nca = one(bs, "total-non-current-assets"), ta = one(bs, "total-assets");
  const cl = one(bs, "total-current-liabilities"), ncl = one(bs, "total-non-current-liabilities"), tl = one(bs, "total-liabilities"), na = one(bs, "total-net-assets");
  if (ca !== null && nca !== null && ta !== null) close("流動資産＋固定資産＝総資産", ca + nca, ta);
  if (cl !== null && ncl !== null && tl !== null) close("流動負債＋固定負債＝負債", cl + ncl, tl);
  if (tl !== null && na !== null && ta !== null) close("負債＋純資産＝総資産", tl + na, ta);
  const se = one(bs, "total-shareholders-equity"), aoci = one(bs, "accumulated-other-comprehensive-income");
  const rights = one(bs, "share-acquisition-rights"), nciBs = one(bs, "non-controlling-interests");
  if (se !== null && aoci !== null && na !== null) close("株主資本＋評価・換算差額等＋新株予約権＋非支配株主持分＝純資産", se + aoci + (rights ?? 0) + (nciBs ?? 0), na, 5);
  // Section totals against their transcribed items, where a total is printed and items were kept.
  if (sga !== null && byRole(pl, "sga-item").length > 0) {
    const s = sum(pl, "sga-item");
    if (s > sga) problems.push(`販管費内訳の合計 ${s} が販管費 ${sga} を超える`);
  }
  return problems;
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const bulk = args.includes("--bulk");
  const ids = args.filter((a) => !a.startsWith("--"));
  if (ids.length === 0) throw new Error("company id を1つ以上指定してください");
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
    const docId = source.docId ?? /S[0-9A-Z]{7}/.exec(source.url ?? "")?.[0];
    if (!docId) {
      console.log(`${id}: 書類IDが特定できない`);
      if (bulk) console.log(`BULK-RESULT ${id} no-doc-id`);
      continue;
    }
    if (bulk && !existsSync(join(cacheDir(), "documents", `${docId}-5.zip`))) {
      console.log(`BULK-RESULT ${id} not-cached ${docId}`);
      continue;
    }
    const zip = await downloadDocument(docId, 5).catch(() => null);
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
      let pl, bs;
      try {
        pl = buildLines(contextRows(rows, `${ctx}Duration`), PL_SLOTS, "pl");
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
      built.push({
        fiscalYear: rec.fiscalYear,
        periodEnd: rec.periodEnd,
        accountingStandard: rec.accountingStandard,
        // JCE-098 (asFiledIn): the document actually read. Both years come out of this one filing,
        // so naming it is what lets a later change inside the block claim to be as-filed.
        docId,
        incomeStatement: pl,
        balanceSheet: bs,
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
