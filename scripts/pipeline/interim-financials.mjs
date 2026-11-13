/**
 * 半期報告書 (EDINET docTypeCode 160, 訂正 170) → `interimFinancials` on a company entry (JCE-045).
 *
 *   node scripts/pipeline/interim-financials.mjs <company-id> [more-ids …] [--apply]
 *   node scripts/pipeline/interim-financials.mjs --all [--limit N] [--apply] [--report f.json]
 *
 * Since April 2024 the quarterly report is gone from EDINET; what remains there is the 半期報告書 for the
 * first half, and its own 主要な経営指標等の推移 prints the half's cumulative revenue, profit and net income
 * beside the same half of the previous year. This script reads those two columns from the filing's XBRL
 * (the type=5 CSV, like the annual extractor) and adds them as `interimFinancials` rows — never touching
 * `financials`, the five full years, and never estimating: a line the filing does not tag is null.
 *
 * Which companies have something new is decided from the entry and the cached day indexes alone, as
 * refresh-financials does: the newest 半期報告書 whose period end is later than the newest half the entry holds.
 * Without --apply nothing under src/data is written. With --apply the entry, its new source and a Revision are
 * written — never git. The EDINET key and the day-index cache are those of refresh-financials; this script is
 * run from the same workflow (tests/single-detector.test.ts), not from a schedule of its own.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { downloadDocument, indexDir, jstToday, readCsvRows } from "../research/edinet.mjs";
import { loadEntries } from "./jobs.mjs";
import { assertMachineWrite } from "./ownership.mjs";

const HALF_YEAR_REPORT = new Set(["160", "170"]);

/** Top line, profit line and net income: the same summary elements the annual extractor trusts, by element id. */
const REVENUE_ELEMENTS = [
  "NetSalesSummaryOfBusinessResults",
  "RevenueIFRSSummaryOfBusinessResults",
  "RevenuesUSGAAPSummaryOfBusinessResults",
  "OperatingRevenue1SummaryOfBusinessResults",
  "OperatingRevenueSummaryOfBusinessResults",
  "OrdinaryIncomeSummaryOfBusinessResults",
  "NetSalesAndOperatingRevenueSummaryOfBusinessResults",
  "TotalOperatingRevenuesSummaryOfBusinessResults",
  "BusinessRevenueSummaryOfBusinessResults",
  "IncomeIFRSSummaryOfBusinessResults",
  "Revenue2IFRSSummaryOfBusinessResults",
  "OperatingRevenue2SummaryOfBusinessResults",
  "GrossOperatingRevenueSummaryOfBusinessResults",
  "PremiumAndOtherIncomeSummaryOfBusinessResults",
  "InsurancePremiumsAndOthersSummaryOfBusinessResults",
  "InsurancePremiumsAndOtherIncomeSummaryOfBusinessResults",
  "RevenueKeyFinancialData",
  "BusinessRevenueKeyFinancialData",
  "OperatingRevenuesKeyFinancialData",
];
const PROFIT_ELEMENTS = [
  "OrdinaryIncomeLossSummaryOfBusinessResults",
  "ProfitLossBeforeTaxIFRSSummaryOfBusinessResults",
  "ProfitLossBeforeTaxUSGAAPSummaryOfBusinessResults",
  "OperatingIncomeLossSummaryOfBusinessResults",
  "OperatingProfitLossIFRSSummaryOfBusinessResults",
];
const NET_INCOME_ELEMENTS = [
  "ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults",
  "ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults",
  "NetIncomeLossAttributableToOwnersOfParentUSGAAPSummaryOfBusinessResults",
  "NetIncomeLossSummaryOfBusinessResults",
];
const STANDARD = { IFRS: "ifrs", "Japan GAAP": "jgaap", "US GAAP": "usgaap" };

const strip = (/** @type {string} */ label) => label.replace(/、経営指標等$/, "").trim();
const isoDates = (/** @type {string} */ text) => [...String(text ?? "").matchAll(/\d{4}-\d{2}-\d{2}/g)].map((m) => m[0]);

/**
 * One column of the half-year summary: the first listed element tagged in the given context, consolidated
 * unless the filer has no consolidated statements (then its NonConsolidated rows are the only table).
 */
function pick(rows, elements, context, nonConsolidated) {
  const wanted = nonConsolidated ? `${context}_NonConsolidatedMember` : context;
  for (const element of elements) {
    const row = rows.find((r) => r["要素ID"] === `jpcrp_cor:${element}` && (r["コンテキストID"] ?? "") === wanted && r["単位"] === "円" && Number.isFinite(Number(r["値"])));
    if (row) return { value: Number(row["値"]), label: strip(row["項目名"] ?? ""), element, period: isoDates(row["期間・時点"]) };
  }
  return null;
}

/** A DEI value by element id, or by the printed name when a filer's CSV leaves the id blank. */
function dei(rows, element, name) {
  const row = rows.find((r) => r["要素ID"] === `jpdei_cor:${element}`) ?? (name ? rows.find((r) => (r["項目名"] ?? "") === name) : undefined);
  return row ? String(row["値"] ?? "").trim() : "";
}

/**
 * The half-year figures of one 半期報告書, from its CSV rows: the current half (CurrentYTDDuration) and the
 * same half of the previous year (Prior1YTDDuration), each cited to this filing.
 * @returns {{ current: object, prior: object | null, docID: string } | null} null when no top line is tagged
 */
export function extractInterim(rows, { docID, sourceId }) {
  const consolidated = dei(rows, "WhetherConsolidatedFinancialStatementsArePreparedDEI", "連結決算の有無、DEI");
  const nonConsolidated = /^false$/i.test(consolidated);
  const standard = STANDARD[dei(rows, "AccountingStandardsDEI", "会計基準、DEI")] ?? null;
  const fiscalYearEnd = dei(rows, "CurrentFiscalYearEndDateDEI", "当事業年度終了日、DEI");
  const periodEnd = dei(rows, "CurrentPeriodEndDateDEI", "当会計期間終了日、DEI");
  const periodStart = dei(rows, "CurrentFiscalYearStartDateDEI", "当事業年度開始日、DEI");

  const column = (context, start, end) => {
    const revenue = pick(rows, REVENUE_ELEMENTS, context, nonConsolidated);
    if (!revenue) return null;
    const profit = pick(rows, PROFIT_ELEMENTS, context, nonConsolidated);
    const net = pick(rows, NET_INCOME_ELEMENTS, context, nonConsolidated);
    const [s, e] = revenue.period.length === 2 ? revenue.period : [start, end];
    if (!e) return null;
    return {
      fiscalYear: `${e.slice(0, 4)}年${Number(e.slice(5, 7))}月期`,
      period: "H1",
      periodStart: s || `${Number(e.slice(0, 4)) - (Number(e.slice(5, 7)) < 10 ? 1 : 0)}-${String(((Number(e.slice(5, 7)) + 6) % 12) + 1).padStart(2, "0")}-01`,
      periodEnd: e,
      revenue: revenue.value,
      revenueLabel: revenue.label || "売上高",
      profit: profit?.value ?? null,
      profitLabel: profit?.label || null,
      netIncome: net?.value ?? null,
      netIncomeLabel: net?.label || "当期純利益",
      currency: "JPY",
      accountingStandard: standard ?? "jgaap",
      ...(nonConsolidated ? { note: "提出会社単体（連結財務諸表を作成していないため）" } : {}),
      sourceIds: [sourceId],
      locator: "【主要な経営指標等の推移】",
    };
  };

  const current = column("CurrentYTDDuration", periodStart, periodEnd);
  if (!current) return null;
  // The year label is the fiscal year the half belongs to, which the DEI states outright.
  if (fiscalYearEnd) current.fiscalYear = `${fiscalYearEnd.slice(0, 4)}年${Number(fiscalYearEnd.slice(5, 7))}月期`;
  const prior = column("Prior1YTDDuration", "", "");
  if (prior) {
    const shift = (/** @type {string} */ d) => `${Number(d.slice(0, 4)) - 1}${d.slice(4)}`;
    if (prior.period.length !== 2) {
      prior.periodStart = shift(current.periodStart);
      prior.periodEnd = shift(current.periodEnd);
    }
    prior.fiscalYear = fiscalYearEnd ? `${Number(fiscalYearEnd.slice(0, 4)) - 1}年${Number(fiscalYearEnd.slice(5, 7))}月期` : shift(current.fiscalYear);
  }
  return { current, prior, docID };
}

/**
 * The newest 半期報告書 per 4-digit securities code in the cached day indexes (withdrawn filings excluded).
 * @returns {Map<string, { docID: string, docTypeCode: string, submitted: string, periodEnd: string, filerName: string }>}
 */
export function newestHalfYearReports(dir = indexDir(), onlyAfter = "") {
  const best = new Map();
  if (!existsSync(dir)) return best;
  for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".json") || file.slice(0, 10) <= onlyAfter) continue;
    for (const row of JSON.parse(readFileSync(join(dir, file), "utf8")).results ?? []) {
      if (!HALF_YEAR_REPORT.has(row.docTypeCode) || !row.secCode) continue;
      if (row.withdrawalStatus && row.withdrawalStatus !== "0") continue;
      const code = row.secCode.slice(0, 4);
      const known = best.get(code);
      if (!known || row.submitDateTime > known.submittedAt) {
        best.set(code, { docID: row.docID, docTypeCode: row.docTypeCode, submittedAt: row.submitDateTime, submitted: row.submitDateTime.slice(0, 10), periodEnd: row.periodEnd ?? "", filerName: row.filerName ?? "" });
      }
    }
  }
  return best;
}

/** The newest half the entry already holds ("" if none). */
export const latestHalf = (/** @type {any} */ entry) => (entry.interimFinancials ?? []).reduce((/** @type {string} */ m, /** @type {any} */ r) => (r.periodEnd > m ? r.periodEnd : m), "");

/**
 * Merge the extracted halves into the entry's `interimFinancials`: a half already present (same period end) is
 * replaced only by a 訂正 (170) of the same filing, otherwise kept; the list stays oldest first.
 */
export function planInterim(entry, extracted, filing, source) {
  const existing = entry.interimFinancials ?? [];
  const incoming = [extracted.prior, extracted.current].filter(Boolean);
  const added = [];
  const replaced = [];
  let next = [...existing];
  for (const half of incoming) {
    const i = next.findIndex((h) => h.period === half.period && h.periodEnd === half.periodEnd);
    if (i === -1) {
      next.push(half);
      added.push(half);
    } else if (filing.docTypeCode === "170" && next[i].sourceIds[0] !== source.id) {
      replaced.push(next[i]);
      next[i] = half;
    }
  }
  next = next.sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  const sources = added.length + replaced.length > 0 && !entry.sources.some((s) => s.id === source.id) ? [...entry.sources, source] : entry.sources;
  return { next, added, replaced, sources };
}

export function sourceFor(filing, today) {
  const half = filing.periodEnd ? `${filing.periodEnd.slice(0, 4)}年${Number(filing.periodEnd.slice(5, 7))}月` : filing.submitted.slice(0, 4);
  return {
    id: `hanki-${(filing.periodEnd || filing.submitted).slice(0, 7).replace("-", "")}`,
    title: `半期報告書（${half}中間期）${filing.docTypeCode === "170" ? "（訂正）" : ""}`,
    publisher: "EDINET（金融庁）",
    url: `https://disclosure2.edinet-fsa.go.jp/WZEK0040.aspx?S100=${filing.docID}`,
    publishedAt: filing.submitted,
    accessedAt: today,
    docId: filing.docID,
    ...(filing.periodEnd ? { asOf: filing.periodEnd } : {}),
  };
}

const VITEST = "node_modules/.bin/vitest";
function run(args, env = {}) {
  execFileSync("node", args, { stdio: "pipe", env: { ...process.env, ...env } });
}

/** One company: find, read, plan and (with --apply) write. Never throws; the outcome says what happened. */
export async function refreshInterim(id, { apply, newest, today, root = process.cwd() }) {
  const entryPath = join(root, "src/data/companies", `${id}.json`);
  const entryText = readFileSync(entryPath, "utf8");
  const entry = JSON.parse(entryText);
  const base = { id, name: entry.name };
  const filing = newest.get(entry.code);
  if (!filing) return { ...base, result: "none", detail: "半期報告書が索引にない" };
  if (filing.periodEnd && filing.periodEnd <= latestHalf(entry) && filing.docTypeCode !== "170") return { ...base, result: "current", detail: `${latestHalf(entry)} まで登録済み` };
  const source = sourceFor(filing, today);
  let extracted;
  try {
    const zip = await downloadDocument(filing.docID, 5);
    extracted = extractInterim(readCsvRows(zip), { docID: filing.docID, sourceId: source.id });
  } catch (error) {
    return { ...base, result: "failed", detail: `読み取れない: ${String(error?.message ?? error).slice(0, 200)}` };
  }
  if (!extracted) return { ...base, result: "failed", detail: "半期の売上高の行が見つからない（要素が未対応）" };
  const plan = planInterim(entry, extracted, filing, source);
  if (plan.added.length + plan.replaced.length === 0) return { ...base, result: "current", detail: "新しい半期はない" };
  const halves = plan.added.map((h) => `${h.fiscalYear} ${h.period}`).join("・");
  if (!apply) return { ...base, result: "would-update", detail: `${halves} を追加（出典 ${source.id}、docID ${filing.docID}）`, added: plan.added };

  const next = { ...entry, interimFinancials: plan.next, sources: plan.sources, updatedAt: today };
  assertMachineWrite(entry, next, "interim-financials");
  const stagedRelative = `pipeline/staging/${id}.json`;
  const stagedPath = join(root, stagedRelative);
  mkdirSync(join(root, "pipeline/staging"), { recursive: true });
  writeFileSync(stagedPath, `${JSON.stringify(next, null, 2)}\n`);
  try {
    run([VITEST, "run", "tests/validate-file.test.ts"], { CONTENT_FILE: stagedRelative });
  } catch (error) {
    return { ...base, result: "failed", detail: `検査に通らない: ${String(error?.message ?? error).slice(0, 200)}` };
  } finally {
    rmSync(stagedPath, { force: true });
  }
  const revisionBase = `${today}-company-${id}-interim-added`;
  let revisionId = revisionBase;
  for (let n = 2; existsSync(join(root, "src/data/revisions", `${revisionId}.json`)); n++) revisionId = `${revisionBase}-${n}`;
  const revision = {
    id: revisionId,
    targetType: "company",
    targetId: id,
    changedAt: today,
    reason: "半期報告書が提出されたため、半期の財務データを追加した（五年の年次データと解説は変更していない）",
    summary: `半期報告書（docID ${filing.docID}、提出 ${filing.submitted}）から ${halves} を追加`,
    before: plan.replaced.length ? plan.replaced : undefined,
    after: plan.added,
  };
  writeFileSync(entryPath, `${JSON.stringify(next, null, 2)}\n`);
  writeFileSync(join(root, "src/data/revisions", `${revisionId}.json`), `${JSON.stringify(revision, null, 2)}\n`);
  return { ...base, result: "updated", detail: `${halves} を追加（改訂記録 ${revisionId}）`, added: plan.added };
}

if (process.argv[1]?.endsWith("interim-financials.mjs")) {
  const args = process.argv.slice(2);
  const flag = (name) => args.includes(`--${name}`);
  const value = (name) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : undefined);
  const skip = new Set(["--limit", "--report"].map((f) => args.indexOf(f) + 1).filter((i) => i > 0));
  let ids = args.filter((a, i) => !a.startsWith("--") && !skip.has(i));
  if (flag("all")) ids = loadEntries().filter((e) => e.status?.state === "published").map((e) => e.id);
  if (value("limit")) ids = ids.slice(0, Number(value("limit")));
  if (ids.length === 0) {
    console.error("usage: node scripts/pipeline/interim-financials.mjs <company-id …> | --all [--limit N] [--apply] [--report f.json]");
    process.exit(1);
  }
  const today = jstToday();
  const newest = newestHalfYearReports();
  const outcomes = [];
  for (const id of ids) {
    const outcome = await refreshInterim(id, { apply: flag("apply"), newest, today });
    outcomes.push(outcome);
    console.log(`${outcome.id}: ${outcome.result} — ${outcome.detail}`);
  }
  if (value("report")) writeFileSync(value("report"), `${JSON.stringify({ today, apply: flag("apply"), outcomes }, null, 2)}\n`);
  const counts = outcomes.reduce((c, o) => ({ ...c, [o.result]: (c[o.result] ?? 0) + 1 }), {});
  console.log(Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(" / "));
}
