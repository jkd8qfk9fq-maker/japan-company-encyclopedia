import { companyMetrics } from "@/lib/company-metrics";
import { companyReport, type Unit } from "@/lib/company-report";
import { revenueGrowth5y } from "@/lib/industry-figures";
import type { CompactMetric, CompareIndex, CompareReportIndex, CompareRow } from "@/lib/compare";
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

/**
 * Printed yen and 万円 figures stay whole; a ratio keeps eight significant digits, far below the 0.1% and 0.01倍 the
 * table prints — tests/compare.test.ts checks every printed string is the same as from the unrounded value.
 */
export const roundForIndex = (unit: Unit, v: number) => (unit === "yen" || unit === "man-yen" ? Math.round(v) : Number(v.toPrecision(8)));

/**
 * SERVER ONLY (build time): 業界の中での位置 for every released company, from the same `companyReport` its 企業レポート
 * uses (JCE-073), keyed by id, written compactly (`CompareReportIndex`).
 */
export function buildCompareReportIndex(companies: Company[], asOf: string): CompareReportIndex {
  const reports = companies.flatMap((company) => {
    const report = companyReport(company, companies);
    return report ? [{ id: company.id, report }] : [];
  });

  // The most common wording of each metric is written once; a row carries its own only when it differs.
  const counts = new Map<string, Map<string, { n: number; label: string; formula: string; computed: boolean; unit: Unit }>>();
  for (const { report } of reports) {
    for (const m of report.metrics) {
      const byWording = counts.get(m.key) ?? new Map();
      const wording = `${m.label}\u0000${m.formula}`;
      const seen = byWording.get(wording) ?? { n: 0, label: m.label, formula: m.formula, computed: m.computed, unit: m.unit };
      seen.n += 1;
      byWording.set(wording, seen);
      counts.set(m.key, byWording);
    }
  }
  const definitions: CompareReportIndex["definitions"] = {};
  for (const [key, byWording] of counts) {
    const { label, formula, computed, unit } = [...byWording.values()].sort((a, b) => b.n - a.n)[0]!;
    definitions[key] = { label, formula, computed, unit };
  }

  const distributions: CompareReportIndex["distributions"] = [];
  const distributionIds = new Map<string, number>();
  const rows: CompareReportIndex["rows"] = {};
  for (const { id, report } of reports) {
    const metrics: CompactMetric[] = report.metrics.map((m) => {
      const d = definitions[m.key]!;
      const compact: CompactMetric = { key: m.key, value: roundForIndex(m.unit, m.value) };
      if (m.label !== d.label || m.formula !== d.formula) Object.assign(compact, { label: m.label, formula: m.formula });
      if (m.note) compact.note = m.note;
      if (m.placement) {
        const p = m.placement;
        const dist: [number, number, number, number] = [p.members, roundForIndex(m.unit, p.median), roundForIndex(m.unit, p.q1), roundForIndex(m.unit, p.q3)];
        const k = `${m.key}:${dist.join(",")}`;
        if (!distributionIds.has(k)) distributionIds.set(k, distributions.push(dist) - 1);
        compact.distribution = distributionIds.get(k)!;
        compact.rank = p.rank;
      }
      return compact;
    });
    rows[id] = {
      industry: report.industryName,
      industryMembers: report.industryMembers,
      comparableMembers: report.comparableMembers,
      fiscalYear: report.periods.at(-1)!.fiscalYear,
      metrics,
    };
  }
  return { asOf, definitions, distributions, rows };
}
