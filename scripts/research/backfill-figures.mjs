/**
 * Fill 利益 / 総資産 / 純資産 / 従業員数 into published entries from their
 * evidence pack.
 *
 *   node scripts/research/backfill-figures.mjs [company-id …]   (default: all)
 *   node scripts/research/backfill-figures.mjs --check          (report only)
 *
 * These four columns were added after 25 companies had already been researched.
 * Re-running the researchers would cost a fortune and, worse, would re-derive
 * facts that are already tagged in the filings — so they are copied from the
 * filing's own five-year table instead, the same way revenue and net income are.
 * Nothing here is computed, converted or inferred: a year the filing does not
 * cover stays null.
 *
 * Per-year series selection matters. A filer that changed accounting standard
 * mid-series prints 経常利益 for its J-GAAP years and 税引前利益 for its IFRS
 * years (スズキ), so each year takes the first series that actually covers it,
 * and keeps that series' own printed label.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { cacheDir } from "./edinet.mjs";

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const wanted = args.filter((a) => !a.startsWith("--"));

const companiesDir = join(process.cwd(), "src/data/companies");
const ids =
  wanted.length > 0
    ? wanted
    : readdirSync(companiesDir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, ""));

/** Which accounting standard a tagged element belongs to. */
const standardOf = (element) => (/IFRS/.test(element) ? "ifrs" : /USGAAP/.test(element) ? "usgaap" : "jgaap");

/**
 * The value for one fiscal year from a list of series, with its printed label,
 * preferring the standard the row is reported on.
 *
 * In the year a company changes standards its filing prints both tables, so the
 * same fiscal year has an IFRS 税引前利益 and a J-GAAP 経常利益. Taking whichever
 * came first gave スズキ rows with IFRS revenue beside J-GAAP equity — figures
 * that are each individually correct and cannot be added up or compared.
 */
function valueFor(list, periodEnd, standard = null) {
  const covering = (list ?? []).filter((s) => s.years.some((y) => y.fiscalYearEnd === periodEnd));
  const preferred = standard ? covering.filter((s) => standardOf(s.element) === standard) : covering;
  const series = (preferred.length > 0 ? preferred : covering)[0];
  if (!series) return { value: null, label: null };
  const year = series.years.find((y) => y.fiscalYearEnd === periodEnd);
  return { value: year.value, label: series.label };
}

/** Keep the JSON key order stable and readable rather than appending at the end. */
const ORDER = [
  "fiscalYear",
  "periodEnd",
  "revenue",
  "revenueLabel",
  "profit",
  "profitLabel",
  "netIncome",
  "netIncomeLabel",
  "totalAssets",
  "totalAssetsLabel",
  "netAssets",
  "netAssetsLabel",
  "employees",
  "currency",
  "accountingStandard",
  "revenueBasis",
  "netIncomeBasis",
  "note",
  "sourceIds",
];
const orderRow = (row) => {
  const out = {};
  for (const key of ORDER) if (key in row) out[key] = row[key];
  for (const key of Object.keys(row)) if (!(key in out)) out[key] = row[key];
  return out;
};

let changed = 0;
const report = [];
for (const id of ids) {
  const entryPath = join(companiesDir, `${id}.json`);
  const packPath = join(cacheDir(), "evidence", id, "summary.json");
  if (!existsSync(entryPath)) continue;
  if (!existsSync(packPath)) {
    report.push(`SKIP ${id} — no evidence pack`);
    continue;
  }
  const entry = JSON.parse(readFileSync(entryPath, "utf8"));
  const pack = JSON.parse(readFileSync(packPath, "utf8"));
  const filled = { profit: 0, totalAssets: 0, netAssets: 0, employees: 0 };

  entry.financials = entry.financials.map((row) => {
    // The researcher already decided which standard each year is reported on.
    const profit = valueFor(pack.figures.profit, row.periodEnd, row.accountingStandard);
    const totalAssets = valueFor(pack.figures.totalAssets, row.periodEnd, row.accountingStandard);
    const netAssets = valueFor(pack.figures.netAssets, row.periodEnd, row.accountingStandard);
    // Employee counts are not standard-specific.
    const employees = valueFor(pack.figures.employees, row.periodEnd);
    if (profit.value !== null) filled.profit++;
    if (totalAssets.value !== null) filled.totalAssets++;
    if (netAssets.value !== null) filled.netAssets++;
    if (employees.value !== null) filled.employees++;
    return orderRow({
      ...row,
      profit: profit.value,
      profitLabel: profit.label,
      totalAssets: totalAssets.value,
      totalAssetsLabel: totalAssets.label,
      netAssets: netAssets.value,
      netAssetsLabel: netAssets.label,
      employees: employees.value,
    });
  });

  const years = entry.financials.length;
  const summary = Object.entries(filled)
    .map(([k, v]) => `${k} ${v}/${years}`)
    .join("  ");
  report.push(`${filled.profit === years && filled.totalAssets === years ? "OK  " : "GAP "} ${id.padEnd(34)} ${summary}`);
  if (!checkOnly) {
    writeFileSync(entryPath, `${JSON.stringify(entry, null, 2)}\n`);
    changed++;
  }
}

console.log(report.join("\n"));
console.log(checkOnly ? `\n${report.length} entries inspected (no files written)` : `\n${changed} entries written`);
