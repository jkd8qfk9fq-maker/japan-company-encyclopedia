import { median, revenueGrowth5y, revenueIndexSeries, type IndexSeries } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";

/**
 * 業界比較 (JCE-043): where one company's printed figures sit among the released companies of its own industry.
 *
 * Every number here is arithmetic on figures as printed — a rank in a sorted list, a median, a ratio of two
 * printed figures of the same year — computed at build time, with the formula and the count of companies it
 * compares against. A company without the figure has no comparison for it (null), never an estimate. A rank is a
 * position by size or by a ratio, labelled as such; it is not a judgement of a good or bad company (invariant 4).
 */

export type Compared = {
  /** The company's own value. */
  value: number;
  /** The median of the industry's companies that print the figure (the company included). */
  industryMedian: number;
  /** 1 = highest value among `members`. */
  rank: number;
  members: number;
  formula: string;
  fiscalYear: string;
};

export type IndustryComparison = {
  industryId: IndustryId;
  industryName: string;
  /** Released companies in the industry, the company included. */
  members: number;
  revenue: { value: number; rank: number; members: number; share: number; fiscalYear: string } | null;
  netProfitMargin: Compared | null;
  revenueGrowth5y: Compared | null;
  overseasSalesRatio: Compared | null;
  averageAnnualSalary: Compared | null;
  /** The company's own five-year revenue as an index (oldest year = 100) beside the industry's index. */
  index: { company: IndexSeries | null; industry: IndexSeries | null };
};

const latestOf = (c: Company): FinancialRecord | undefined => [...c.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

function marginOf(c: Company): number | null {
  const r = latestOf(c);
  return r && r.revenue !== null && r.revenue > 0 && r.netIncome !== null ? r.netIncome / r.revenue : null;
}

function overseasOf(c: Company): number | null {
  const regional = c.regionalRevenue;
  if (!regional || regional.items.filter((i) => i.domestic).length !== 1) return null;
  const total = regional.items.reduce((acc, i) => acc + i.amount, 0);
  if (total <= 0) return null;
  return regional.items.filter((i) => !i.domestic).reduce((acc, i) => acc + i.amount, 0) / total;
}

const salaryOf = (c: Company): number | null => c.workforce?.averageAnnualSalary ?? null;

/** Rank 1 = the highest value; ties share the higher rank. */
function compare(company: Company, members: Company[], pick: (c: Company) => number | null, formula: string, fiscalYear: string): Compared | null {
  const own = pick(company);
  if (own === null) return null;
  const values = members.map(pick).filter((v): v is number => v !== null);
  const med = median(values);
  if (med === null) return null;
  return { value: own, industryMedian: med, rank: values.filter((v) => v > own).length + 1, members: values.length, formula, fiscalYear };
}

/** The company's own five-year revenue index: the same rule as the industry's, applied to one company. */
export function companyIndex(company: Company): IndexSeries | null {
  const one = revenueIndexSeries([company]).all;
  return one.values.length === 5 ? { ...one, id: "all", name: company.name } : null;
}

export function industryComparison(company: Company, companies: Company[]): IndustryComparison | null {
  const industryId = primaryIndustry(company);
  if (!industryId) return null;
  const members = companies.filter((c) => primaryIndustry(c) === industryId);
  if (!members.some((c) => c.id === company.id)) members.push(company);
  // One company alone has nothing to be compared with.
  if (members.length < 3) return null;

  const latest = latestOf(company);
  const fiscalYear = latest?.fiscalYear ?? "";
  const withRevenue = members.map((c) => ({ c, r: latestOf(c) })).filter((x): x is { c: Company; r: FinancialRecord } => x.r !== undefined && x.r.revenue !== null);
  const total = withRevenue.reduce((acc, x) => acc + x.r.revenue!, 0);
  const revenue =
    latest && latest.revenue !== null
      ? {
          value: latest.revenue,
          rank: withRevenue.filter((x) => x.r.revenue! > latest.revenue!).length + 1,
          members: withRevenue.length,
          share: total > 0 ? latest.revenue / total : 0,
          fiscalYear,
        }
      : null;

  const industrySeries = revenueIndexSeries(members).all;
  return {
    industryId,
    industryName: INDUSTRY_LABELS[industryId].name,
    members: members.length,
    revenue,
    netProfitMargin: compare(company, members, marginOf, "純利益 ÷ 売上高（各社の最新期）", fiscalYear),
    revenueGrowth5y: compare(company, members, revenueGrowth5y, "最新期の売上高 ÷ 5期前の売上高", fiscalYear),
    overseasSalesRatio: compare(company, members, overseasOf, "日本以外の売上高 ÷ 地域別売上高の合計", company.regionalRevenue?.fiscalYear ?? fiscalYear),
    averageAnnualSalary: compare(company, members, salaryOf, "【従業員の状況】の平均年間給与（提出会社）", company.workforce?.fiscalYear ?? fiscalYear),
    index: {
      company: companyIndex(company),
      industry: industrySeries.values.length === 5 ? { ...industrySeries, id: industryId, name: INDUSTRY_LABELS[industryId].name } : null,
    },
  };
}
