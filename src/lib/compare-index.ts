import { companyMetrics } from "@/lib/company-metrics";
import { revenueGrowth5y } from "@/lib/industry-figures";
import { compareShardOf, type CompareIndex, type CompareLightIndex, type CompareRow, type CompareShard } from "@/lib/compare";
import type { Company } from "@/types/company";

/** SERVER ONLY (build time): one row per released company, from the figures its page already shows. */
export function compareRow(company: Company, industryName: (id: string) => string | null): CompareRow {
  const years = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  const latest = years.at(-1) ?? null;
  const metrics = companyMetrics(company);
  const growth = revenueGrowth5y(company);
  const primary = company.industries.find((r) => r.primary) ?? company.industries[0];
  const source = latest?.sourceIds.map((id) => company.sources.find((s) => s.id === id)).find((s) => s !== undefined) ?? null;
  return {
    id: company.id,
    name: company.name,
    industry: primary ? industryName(primary.industryId) : null,
    fiscalYear: latest?.fiscalYear ?? null,
    revenue: latest?.revenue ?? null,
    revenueLabel: latest?.revenueLabel ?? null,
    netIncome: latest?.netIncome ?? null,
    netIncomeLabel: latest?.netIncomeLabel ?? null,
    netMargin: metrics?.netProfitMargin?.percent ?? null,
    growth5y: growth === null ? null : Math.round(growth * 100) / 100,
    growthFrom: growth === null ? null : (years[0]?.fiscalYear ?? null),
    overseas: metrics?.overseasSalesRatio?.percent ?? null,
    employees: latest?.employees ?? null,
    source: source ? { title: source.title, url: source.url } : null,
  };
}

export function buildCompareIndex(companies: Company[], industryName: (id: string) => string | null, asOf: string): CompareIndex {
  return { asOf, rows: companies.map((c) => compareRow(c, industryName)) };
}

/** The light index (JCE-149): the same rows, cut down to what searching and peer suggestions read. */
export function buildCompareLightIndex(companies: Company[], industryName: (id: string) => string | null, asOf: string): CompareLightIndex {
  return {
    asOf,
    rows: companies.map((c) => {
      const r = compareRow(c, industryName);
      return { id: r.id, name: r.name, industry: r.industry, revenue: r.revenue };
    }),
  };
}

/** One shard of the full rows (JCE-149): only the companies whose id hashes to `shard`. */
export function buildCompareShard(companies: Company[], industryName: (id: string) => string | null, asOf: string, shard: number): CompareShard {
  return { asOf, rows: companies.filter((c) => compareShardOf(c.id) === shard).map((c) => compareRow(c, industryName)) };
}
