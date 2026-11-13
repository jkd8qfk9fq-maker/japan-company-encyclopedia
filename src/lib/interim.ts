import type { Company, InterimRecord } from "@/types/company";

/**
 * 半期の動き (JCE-045): the newest first half beside the same half a year earlier, and beside the last full year.
 * Three readings per line (売上高・利益・純利益): the half's figure, its change against the previous year's half
 * (前年同期比), and the half as a share of the previous full year (通期に対する割合) — all arithmetic on figures as
 * printed, each with a formula. Nothing is annualised or forecast.
 */

export type InterimLine = {
  key: "revenue" | "profit" | "netIncome";
  label: string;
  current: number | null;
  prior: number | null;
  /** (current − prior) ÷ |prior|, when both are printed and prior is not zero. */
  change: number | null;
  /** current ÷ the previous full year's figure of the same line, when both are printed and positive. */
  shareOfLastYear: number | null;
};

export type InterimView = {
  current: InterimRecord;
  prior: InterimRecord | null;
  lastFullYear: { fiscalYear: string } | null;
  lines: InterimLine[];
  /** Every half the entry holds, oldest first, for the small chart. */
  halves: InterimRecord[];
};

export function interimView(company: Company): InterimView | null {
  const halves = [...(company.interimFinancials ?? [])].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  const current = halves.at(-1);
  if (!current) return null;
  const priorEnd = `${Number(current.periodEnd.slice(0, 4)) - 1}${current.periodEnd.slice(4)}`;
  const prior = halves.find((h) => h.periodEnd === priorEnd) ?? null;
  // The last full year before this half: the annual record whose period ends in the fiscal year the half follows.
  const annual = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).filter((r) => r.periodEnd < current.periodEnd).at(-1) ?? null;

  const line = (key: InterimLine["key"], label: string, pick: (r: { revenue: number | null; profit: number | null; netIncome: number | null }) => number | null): InterimLine => {
    const c = pick(current);
    const p = prior ? pick(prior) : null;
    const y = annual ? pick(annual) : null;
    return {
      key,
      label,
      current: c,
      prior: p,
      change: c !== null && p !== null && p !== 0 ? (c - p) / Math.abs(p) : null,
      shareOfLastYear: c !== null && y !== null && y > 0 ? c / y : null,
    };
  };
  return {
    current,
    prior,
    lastFullYear: annual ? { fiscalYear: annual.fiscalYear } : null,
    lines: [
      line("revenue", current.revenueLabel, (r) => r.revenue),
      ...(current.profit !== null && current.profitLabel ? [line("profit", current.profitLabel, (r) => r.profit)] : []),
      line("netIncome", current.netIncomeLabel, (r) => r.netIncome),
    ],
    halves,
  };
}
