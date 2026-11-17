import { companyMetrics } from "@/lib/company-metrics";
import { revenueGrowth5y } from "@/lib/industry-figures";
import type { ScreeningIndex, ScreeningRow } from "@/lib/screening";
import type { Company } from "@/types/company";

/** SERVER ONLY (build time): one row per released company, from figures the site already prints or computes. */
export function screeningRow(company: Company, prefecture: string | null): ScreeningRow {
  const latest = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1) ?? null;
  const metrics = companyMetrics(company);
  const growth = revenueGrowth5y(company);
  const primary = company.industries.find((r) => r.primary)?.industryId;
  const industries = [...new Set([...(primary ? [primary] : []), ...company.industries.map((r) => r.industryId)])];
  return {
    id: company.id,
    name: company.name,
    industries,
    prefecture,
    fiscalYear: latest?.fiscalYear ?? null,
    revenue: latest?.revenue ?? null,
    growth5y: growth === null ? null : Math.round(growth * 100) / 100,
    netMargin: metrics?.netProfitMargin?.percent ?? null,
    overseas: metrics?.overseasSalesRatio?.percent ?? null,
    employees: latest?.employees ?? null,
  };
}

export function buildScreeningIndex(
  companies: Company[],
  prefectureOf: (id: string) => string | null,
  industries: { id: string; name: string }[],
  asOf: string,
): ScreeningIndex {
  return { asOf, industries, rows: companies.map((c) => screeningRow(c, prefectureOf(c.id))) };
}
