import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";

/**
 * The industry figures (JCE-041): what the released companies' own filings add up to, industry by industry.
 *
 * Everything here is arithmetic on figures as printed — sums, one ratio of two sums, a median of per-company
 * ratios — computed at build time from `financials` and `regionalRevenue`, never written by hand or by an agent,
 * and each carries its formula. A company whose figure is missing is left out of that figure's sum and counted
 * in `excluded`, never approximated. Nothing here is a stock-market measure (CLAUDE.md invariant 4).
 */

export type IndustrySum = { total: number; companies: number; excluded: number };
export type IndustryRatio = { value: number; formula: string; companies: number };

export type RankedCompany = {
  id: string;
  name: string;
  fiscalYear: string;
  revenue: number;
  /** 純利益 ÷ 売上高 of the same year, when both are printed. */
  netProfitMargin: number | null;
  /** Latest revenue ÷ the oldest of the five years, when the series is complete. */
  revenueGrowth5y: number | null;
};

export type IndustryFigures = {
  id: IndustryId;
  name: string;
  companies: number;
  revenue: IndustrySum;
  netIncome: IndustrySum;
  employees: IndustrySum;
  /** Σ純利益 ÷ Σ売上高 over the companies that print both. */
  netProfitMargin: IndustryRatio | null;
  /** Median over companies of (latest revenue ÷ revenue five years earlier). */
  revenueGrowth5y: IndustryRatio | null;
  /** Revenue of the three largest companies ÷ the industry's revenue. */
  top3Share: IndustryRatio | null;
  /** Median over companies of the overseas sales ratio printed in their 地域ごとの情報. */
  overseasSalesRatio: IndustryRatio | null;
  /** How many companies' latest year ends in each fiscal year label — the sums are not of one date. */
  fiscalYears: { fiscalYear: string; companies: number }[];
  ranking: RankedCompany[];
};

export type IndustryFlowCount = { from: IndustryId; to: IndustryId; ties: number };

export type IndustryFiguresData = {
  industries: IndustryFigures[];
  /** Seller industry → buyer industry, counted from `supplier` / `customer` relations, each pair once. */
  flows: IndustryFlowCount[];
  totals: { companies: number; revenue: number; netIncome: number; employees: number };
};

const RANKING_SIZE = 10;

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

function byPeriod(records: FinancialRecord[]): FinancialRecord[] {
  return [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function sum(companies: Company[], pick: (latest: FinancialRecord) => number | null): IndustrySum {
  let total = 0;
  let counted = 0;
  for (const company of companies) {
    const latest = byPeriod(company.financials).at(-1);
    const value = latest ? pick(latest) : null;
    if (value === null) continue;
    total += value;
    counted += 1;
  }
  return { total, companies: counted, excluded: companies.length - counted };
}

/** Latest revenue ÷ the earliest of the five printed years; null unless the window is complete and both positive. */
export function revenueGrowth5y(company: Company): number | null {
  const records = byPeriod(company.financials);
  if (records.length < 5) return null;
  const first = records[0].revenue;
  const last = records.at(-1)!.revenue;
  return first !== null && last !== null && first > 0 && last > 0 ? last / first : null;
}

function overseasRatio(company: Company): number | null {
  const regional = company.regionalRevenue;
  if (!regional || regional.items.filter((i) => i.domestic).length !== 1) return null;
  const total = regional.items.reduce((acc, i) => acc + i.amount, 0);
  if (total <= 0) return null;
  const overseas = regional.items.filter((i) => !i.domestic).reduce((acc, i) => acc + i.amount, 0);
  return overseas / total;
}

function rank(companies: Company[]): RankedCompany[] {
  return companies
    .map((company) => ({ company, latest: byPeriod(company.financials).at(-1) }))
    .filter((x): x is { company: Company; latest: FinancialRecord } => x.latest !== undefined && x.latest.revenue !== null)
    .sort((a, b) => b.latest.revenue! - a.latest.revenue!)
    .map(({ company, latest }) => ({
      id: company.id,
      name: company.name,
      fiscalYear: latest.fiscalYear,
      revenue: latest.revenue!,
      netProfitMargin: latest.netIncome !== null && latest.revenue! > 0 ? latest.netIncome / latest.revenue! : null,
      revenueGrowth5y: revenueGrowth5y(company),
    }));
}

function figuresOf(id: IndustryId, companies: Company[]): IndustryFigures {
  const revenue = sum(companies, (r) => r.revenue);
  const netIncome = sum(companies, (r) => r.netIncome);
  const employees = sum(companies, (r) => r.employees);

  const both = companies
    .map((c) => byPeriod(c.financials).at(-1))
    .filter((r): r is FinancialRecord => r !== undefined && r.revenue !== null && r.revenue > 0 && r.netIncome !== null);
  const marginDen = both.reduce((acc, r) => acc + r.revenue!, 0);
  const netProfitMargin =
    both.length > 0 && marginDen > 0
      ? { value: both.reduce((acc, r) => acc + r.netIncome!, 0) / marginDen, formula: "純利益の合計 ÷ 売上高の合計（両方が印字された会社）", companies: both.length }
      : null;

  const growths = companies.map(revenueGrowth5y).filter((v): v is number => v !== null);
  const growthMedian = median(growths);
  const revenueGrowth = growthMedian !== null ? { value: growthMedian, formula: "最新期の売上高 ÷ 5期前の売上高（会社ごと）の中央値", companies: growths.length } : null;

  const ranked = rank(companies);
  const top3Share =
    revenue.total > 0 && ranked.length > 0
      ? { value: ranked.slice(0, 3).reduce((acc, c) => acc + c.revenue, 0) / revenue.total, formula: "売上高の上位3社の合計 ÷ 業界の売上高の合計", companies: ranked.length }
      : null;

  const overseas = companies.map(overseasRatio).filter((v): v is number => v !== null);
  const overseasMedian = median(overseas);
  const overseasSalesRatio = overseasMedian !== null ? { value: overseasMedian, formula: "日本以外の売上高 ÷ 地域別売上高の合計（会社ごと）の中央値", companies: overseas.length } : null;

  const years = new Map<string, number>();
  for (const c of companies) {
    const latest = byPeriod(c.financials).at(-1);
    if (latest) years.set(latest.fiscalYear, (years.get(latest.fiscalYear) ?? 0) + 1);
  }

  return {
    id,
    name: INDUSTRY_LABELS[id].name,
    companies: companies.length,
    revenue,
    netIncome,
    employees,
    netProfitMargin,
    revenueGrowth5y: revenueGrowth,
    top3Share,
    overseasSalesRatio,
    fiscalYears: [...years.entries()].map(([fiscalYear, n]) => ({ fiscalYear, companies: n })).sort((a, b) => b.companies - a.companies),
    ranking: ranked.slice(0, RANKING_SIZE),
  };
}

/**
 * Figures for every industry with at least one company, largest revenue first, plus the seller → buyer counts
 * between industries. Pass released companies: nothing unpublished should add to a public sum.
 */
export function buildIndustryFigures(companies: Company[]): IndustryFiguresData {
  const groups = new Map<IndustryId, Company[]>();
  for (const company of companies) {
    const id = primaryIndustry(company);
    if (!id) continue;
    groups.set(id, [...(groups.get(id) ?? []), company]);
  }
  const industries = [...groups.entries()].map(([id, cs]) => figuresOf(id, cs)).sort((a, b) => b.revenue.total - a.revenue.total);

  const industryOf = new Map(companies.map((c) => [c.id, primaryIndustry(c)]));
  const pairs = new Map<string, { from: IndustryId; to: IndustryId }>();
  for (const company of companies) {
    const own = industryOf.get(company.id);
    if (!own) continue;
    for (const relation of company.relatedCompanies) {
      if (relation.relationship !== "supplier" && relation.relationship !== "customer") continue;
      const other = industryOf.get(relation.companyId);
      if (!other || relation.companyId === company.id) continue;
      const [sellerId, buyerId, from, to] =
        relation.relationship === "customer" ? [company.id, relation.companyId, own, other] : [relation.companyId, company.id, other, own];
      pairs.set(`${sellerId}>${buyerId}`, { from, to });
    }
  }
  const counts = new Map<string, IndustryFlowCount>();
  for (const { from, to } of pairs.values()) {
    const key = `${from}>${to}`;
    const flow = counts.get(key) ?? { from, to, ties: 0 };
    flow.ties += 1;
    counts.set(key, flow);
  }

  return {
    industries,
    flows: [...counts.values()].sort((a, b) => b.ties - a.ties),
    totals: {
      companies: industries.reduce((acc, i) => acc + i.companies, 0),
      revenue: industries.reduce((acc, i) => acc + i.revenue.total, 0),
      netIncome: industries.reduce((acc, i) => acc + i.netIncome.total, 0),
      employees: industries.reduce((acc, i) => acc + i.employees.total, 0),
    },
  };
}
