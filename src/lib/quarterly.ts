import type { Company } from "@/types/company";

/**
 * 四半期の動き (JCE-049): the current fiscal year's cumulative figures — 第1四半期, 中間期 (第2四半期), 第3四半期 — each
 * beside the same period a year earlier, and the previous fiscal year's full year as the end of its line.
 *
 * Q1 and Q3 are EDINET DB's structured 決算短信; the first half is the 半期報告書 from EDINET; the full year is the
 * 有価証券報告書. Two lines only — 売上 and 純利益 — because the profit line between them differs by source (営業利益 in
 * 決算短信, the filing's own line in the 半期報告書) and a column mixing them would compare different things.
 * 前年同期比 is computed (今期 ÷ 前年同期 − 1), never over a base of zero or a loss. Nothing is annualised or forecast.
 */

export type QuarterlySource = "edinet-db" | "hanki" | "yuho";

export type QuarterlyPoint = {
  key: "q1" | "h1" | "q3" | "fy";
  label: string;
  revenue: number | null;
  netIncome: number | null;
  priorRevenue: number | null;
  priorNetIncome: number | null;
  revenueChange: number | null;
  netIncomeChange: number | null;
  source: QuarterlySource | null;
  priorSource: QuarterlySource | null;
  sourceIds: string[];
};

export type QuarterlyView = {
  /** e.g. "2027年3月期" — the fiscal year in progress. */
  fiscalYear: string;
  priorFiscalYear: string;
  points: QuarterlyPoint[];
  /** True when any figure on the view came from EDINET DB: the attribution and its disclaimer must then be shown. */
  usesEdinetDb: boolean;
};

const monthIndex = (iso: string) => Number(iso.slice(0, 4)) * 12 + Number(iso.slice(5, 7)) - 1;
const fiscalLabel = (index: number) => `${Math.floor(index / 12)}年${(index % 12) + 1}月期`;

export function changeOf(current: number | null, prior: number | null): number | null {
  if (current === null || prior === null || prior <= 0) return null;
  return current / prior - 1;
}

export function quarterlyView(company: Company): QuarterlyView | null {
  const quarters = company.quarterlyEarnings ?? [];
  // A half alone is enough: before the first quarters arrive, the section is the 半期報告書's half and last year's.
  if (quarters.length === 0 && (company.interimFinancials ?? []).length === 0) return null;
  // Fiscal years are keyed by the month index of their end: a half ending in September belongs to the year ending March.
  const q = (fyEnd: number, quarter: 1 | 3) => quarters.find((r) => monthIndex(r.fiscalYearEnd) === fyEnd && r.quarter === quarter) ?? null;
  const h = (fyEnd: number) => (company.interimFinancials ?? []).find((r) => monthIndex(r.periodEnd) + 6 === fyEnd) ?? null;
  const fy = (fyEnd: number) => company.financials.find((r) => monthIndex(r.periodEnd) === fyEnd) ?? null;

  const ends = [...quarters.map((r) => monthIndex(r.fiscalYearEnd)), ...(company.interimFinancials ?? []).map((r) => monthIndex(r.periodEnd) + 6)];
  // The year in progress: the latest year with a quarter or a half, and no full year yet.
  const current = Math.max(...ends);
  if (fy(current)) return null;
  const prior = current - 12;

  type Row = { revenue: number | null; netIncome: number | null; sourceIds: string[] } | null;
  const point = (key: QuarterlyPoint["key"], label: string, now: Row, before: Row, source: QuarterlySource, priorSource: QuarterlySource): QuarterlyPoint => ({
    key,
    label,
    revenue: now?.revenue ?? null,
    netIncome: now?.netIncome ?? null,
    priorRevenue: before?.revenue ?? null,
    priorNetIncome: before?.netIncome ?? null,
    revenueChange: changeOf(now?.revenue ?? null, before?.revenue ?? null),
    netIncomeChange: changeOf(now?.netIncome ?? null, before?.netIncome ?? null),
    source: now ? source : null,
    priorSource: before ? priorSource : null,
    sourceIds: [...new Set([...(now?.sourceIds ?? []), ...(before?.sourceIds ?? [])])],
  });
  const points = [
    point("q1", "第1四半期", q(current, 1), q(prior, 1), "edinet-db", "edinet-db"),
    point("h1", "中間期", h(current), h(prior), "hanki", "hanki"),
    point("q3", "第3四半期", q(current, 3), q(prior, 3), "edinet-db", "edinet-db"),
    point("fy", "通期", null, fy(prior), "yuho", "yuho"),
  ].filter((p) => p.revenue !== null || p.priorRevenue !== null);
  if (!points.some((p) => p.revenue !== null)) return null;
  return {
    fiscalYear: fiscalLabel(current),
    priorFiscalYear: fiscalLabel(prior),
    points,
    usesEdinetDb: points.some((p) => p.source === "edinet-db" || p.priorSource === "edinet-db"),
  };
}
