import type { Company } from "@/types/company";

/**
 * The figures readers use to compare companies (JCE-038): the latest year's size from the filing as printed, two
 * ratios computed from printed figures, and the filing company's 従業員の状況.
 *
 * The ratios are computed here, never written by hand or by an agent, so a ratio cannot disagree with the
 * figures it is shown beside; each carries the formula in the filing's own labels. A ratio whose inputs are not
 * all printed for the same year is left out, never approximated.
 */

export type Ratio = { percent: number; formula: string; fiscalYear: string; sourceIds: string[] };

export type CompanyMetrics = {
  fiscalYear: string;
  netProfitMargin: Ratio | null;
  overseasSalesRatio: Ratio | null;
  workforce: Company["workforce"] | null;
  /** Up to three top-level businesses, largest printed segment revenue first (else the entry's own order). */
  topBusinesses: string[];
};

const round1 = (value: number) => Math.round(value * 10) / 10;

export function companyMetrics(company: Company): CompanyMetrics | null {
  const latest = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
  if (!latest) return null;

  const netProfitMargin: Ratio | null =
    latest.revenue !== null && latest.revenue > 0 && latest.netIncome !== null
      ? {
          percent: round1((latest.netIncome / latest.revenue) * 100),
          formula: `${latest.netIncomeLabel} ÷ ${latest.revenueLabel}`,
          fiscalYear: latest.fiscalYear,
          sourceIds: latest.sourceIds,
        }
      : null;

  let overseasSalesRatio: Ratio | null = null;
  const regional = company.regionalRevenue;
  if (regional && regional.items.filter((i) => i.domestic).length === 1) {
    const total = regional.items.reduce((sum, i) => sum + i.amount, 0);
    const overseas = regional.items.filter((i) => !i.domestic).reduce((sum, i) => sum + i.amount, 0);
    const domestic = regional.items.find((i) => i.domestic)!;
    if (total > 0) {
      overseasSalesRatio = {
        percent: round1((overseas / total) * 100),
        formula: `${domestic.region}以外の${regional.label} ÷ 地域別の${regional.label}の合計`,
        fiscalYear: regional.fiscalYear,
        sourceIds: regional.sourceIds,
      };
    }
  }

  const amounts = new Map((company.segmentRevenue?.items ?? []).map((i) => [i.businessId, i.amount]));
  const order = company.businesses.map((b, i) => ({ name: b.shortName ?? b.name, amount: amounts.get(b.id), i }));
  const ranked = amounts.size > 0
    ? order.sort((a, b) => (b.amount ?? -1) - (a.amount ?? -1) || a.i - b.i)
    : order;

  return {
    fiscalYear: latest.fiscalYear,
    netProfitMargin,
    overseasSalesRatio,
    workforce: company.workforce ?? null,
    topBusinesses: ranked.slice(0, 3).map((b) => b.name),
  };
}
