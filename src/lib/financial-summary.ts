import type { FinancialRecord } from "@/types/company";

/**
 * The free financial section's summary and tools: the latest year's figures as printed, each beside its 前期比, and
 * the five-year table as CSV.
 *
 * 前期比 is computed from two printed figures (最新期 ÷ 前期 − 1), labelled 計算値 with that formula (JCE-038, JCE-047).
 * It is left out — not shown as a dash — when the two years are not comparable: a different accounting standard, a
 * different revenue scope (`revenueBasis`), a figure that is missing, or a base of zero or below, where a percentage
 * says nothing ("赤字から黒字" is not a percentage).
 */

export type SummaryKey = "revenue" | "profit" | "netIncome" | "totalAssets" | "netAssets" | "employees";

export type SummaryItem = {
  key: SummaryKey;
  /** The filing's own wording for the line, e.g. 売上収益 or 経常利益. */
  label: string;
  value: number;
  unit: "yen" | "people";
  /** 最新期 ÷ 前期 − 1, or null when the two years cannot be compared. */
  change: number | null;
};

export type FinancialSummary = { fiscalYear: string; previousYear: string | null; items: SummaryItem[] };

export const CHANGE_FORMULA = "最新期 ÷ 前期 − 1";

function byPeriod(records: FinancialRecord[]): FinancialRecord[] {
  return [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
}

const LINES: { key: SummaryKey; label: (r: FinancialRecord) => string | null; pick: (r: FinancialRecord) => number | null; unit: "yen" | "people" }[] = [
  { key: "revenue", label: (r) => r.revenueLabel, pick: (r) => r.revenue, unit: "yen" },
  { key: "profit", label: (r) => r.profitLabel, pick: (r) => r.profit, unit: "yen" },
  { key: "netIncome", label: (r) => r.netIncomeLabel, pick: (r) => r.netIncome, unit: "yen" },
  { key: "totalAssets", label: (r) => r.totalAssetsLabel ?? "総資産", pick: (r) => r.totalAssets, unit: "yen" },
  { key: "netAssets", label: (r) => r.netAssetsLabel ?? "純資産", pick: (r) => r.netAssets, unit: "yen" },
  { key: "employees", label: () => "従業員数（連結）", pick: (r) => r.employees, unit: "people" },
];

export function changeBetween(latest: number | null, previous: number | null): number | null {
  if (latest === null || previous === null || previous <= 0) return null;
  return latest / previous - 1;
}

export function financialSummary(records: FinancialRecord[]): FinancialSummary | null {
  const sorted = byPeriod(records);
  const latest = sorted.at(-1);
  if (!latest) return null;
  const previous = sorted.at(-2) ?? null;
  const sameStandard = previous !== null && previous.accountingStandard === latest.accountingStandard;
  const sameScope = previous !== null && previous.revenueBasis === latest.revenueBasis;

  const items = LINES.flatMap((line): SummaryItem[] => {
    const value = line.pick(latest);
    const label = line.label(latest);
    if (value === null || label === null) return [];
    // Revenue and net income follow the revenue scope; a changed scope makes their 前期比 a different perimeter.
    const comparable = sameStandard && (line.key === "revenue" || line.key === "netIncome" ? sameScope : true);
    return [{ key: line.key, label, value, unit: line.unit, change: comparable ? changeBetween(value, line.pick(previous!)) : null }];
  });
  return { fiscalYear: latest.fiscalYear, previousYear: previous?.fiscalYear ?? null, items };
}

const STANDARD: Record<FinancialRecord["accountingStandard"], string> = { ifrs: "IFRS", jgaap: "日本基準", usgaap: "米国会計基準" };

const cell = (value: string | number | null) => {
  if (value === null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

/**
 * The five-year table as printed, in yen (not rounded to 百万円), one row per year, with each line's own label so a
 * spreadsheet never mixes 経常利益 with 営業利益 under one heading. A BOM keeps Excel from reading it as Shift_JIS.
 */
export function financialCsv(companyName: string, records: FinancialRecord[]): string {
  const sorted = byPeriod(records);
  const header = ["年度", "決算日", "売上の項目", "売上（円）", "利益の項目", "利益（円）", "純利益の項目", "純利益（円）", "総資産（円）", "純資産（円）", "従業員数（人）", "会計基準"];
  const rows = sorted.map((r) => [
    r.fiscalYear,
    r.periodEnd,
    r.revenueLabel,
    r.revenue,
    r.profitLabel,
    r.profit,
    r.netIncomeLabel,
    r.netIncome,
    r.totalAssets,
    r.netAssets,
    r.employees,
    STANDARD[r.accountingStandard],
  ]);
  const lines = [
    [`${companyName} 主要な経営指標等の推移（有価証券報告書に印字された数値・日本企業百科事典）`],
    header,
    ...rows,
  ];
  return `﻿${lines.map((line) => line.map(cell).join(",")).join("\r\n")}\r\n`;
}
