import { changeBetween } from "@/lib/financial-summary";
import { median, quantile, revenueGrowth5y } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";

/**
 * The premium report's computed layer (JCE-073): figures computed from printed figures only, each labelled
 * 計算値 with its formula, beside the distribution of the company's own industry — median, quartiles, rank and
 * percentile over every released company of that industry under the one definition this site uses.
 *
 * The family rule is the one JCE-038/043/044 already keep: a metric whose inputs are not all printed is left
 * out, never approximated; a position is a position, never a verdict (invariant 4 — no ROE, no ROA, nothing
 * from a market). The three ratios of JCE-038 live in prose; the wider set lives here, in a table. This layer
 * is built so /compare (JCE-061) can reuse the same metrics and positions rather than growing a second set.
 */

export type MetricUnit = "percent" | "percent-change" | "times" | "yen-per-person";

/** Where one value sits in a list of values: the distribution the report prints beside a computed figure. */
export type IndustryPosition = {
  median: number;
  /** First quartile (25th percentile), by the same interpolation as the median. */
  q1: number;
  /** Third quartile (75th percentile). */
  q3: number;
  /** 1 = highest value; ties share the higher rank. */
  rank: number;
  /** How many companies the distribution rests on, this company included. */
  members: number;
  /** The share of the industry's companies below this value, 0–100: a position, not a score. */
  percentile: number;
};

export type ReportMetric = {
  key: string;
  title: string;
  formula: string;
  unit: MetricUnit;
  /** The company's own value: a fraction for percent units (0.1 = 10%), a ratio for times, yen for yen-per-person. */
  value: number;
  fiscalYear: string;
  /** The sources of the records this value rests on, so the figure can be traced like any other on the site. */
  sourceIds: string[];
  /** Null when the industry has too few companies printing the figure for a distribution to mean anything. */
  industry: IndustryPosition | null;
};

export type ReportMetrics = {
  industryId: IndustryId | null;
  industryName: string | null;
  metrics: ReportMetric[];
};

/** Below this many values a quartile is noise dressed as a distribution; the metric then stands on its own. */
export const MIN_DISTRIBUTION = 5;

export function industryPosition(own: number, values: number[]): IndustryPosition | null {
  if (values.length < MIN_DISTRIBUTION) return null;
  const med = median(values);
  const q1 = quantile(values, 0.25);
  const q3 = quantile(values, 0.75);
  if (med === null || q1 === null || q3 === null) return null;
  return {
    median: med,
    q1,
    q3,
    rank: values.filter((v) => v > own).length + 1,
    members: values.length,
    percentile: Math.round((values.filter((v) => v < own).length / values.length) * 100),
  };
}

const byPeriod = (records: FinancialRecord[]): FinancialRecord[] => [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
const latestOf = (c: Company): FinancialRecord | undefined => byPeriod(c.financials).at(-1);

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

const ratio = (num: number | null, den: number | null) => (num !== null && den !== null && den > 0 ? num / den : null);

/**
 * 純利益率 can only be read when the two lines cover the same perimeter: where a filing prints revenue without
 * a business its net income still includes (Sony's financial business, `netIncomeBasis`), the ratio of the two
 * is not a margin and is left out — the same distinction the five-year table's notes draw.
 */
function marginReadable(r: FinancialRecord): boolean {
  return r.netIncomeBasis === undefined || r.netIncomeBasis === r.revenueBasis;
}

/** 最新期 ÷ 前期 − 1 under the free summary's comparability rule (JCE-047): same standard, same revenue scope. */
function changeOf(c: Company, pick: (r: FinancialRecord) => number | null): number | null {
  const records = byPeriod(c.financials);
  const latest = records.at(-1);
  const previous = records.at(-2);
  if (!latest || !previous) return null;
  if (previous.accountingStandard !== latest.accountingStandard || previous.revenueBasis !== latest.revenueBasis) return null;
  return changeBetween(pick(latest), pick(previous));
}

function overseasOf(c: Company): number | null {
  const regional = c.regionalRevenue;
  if (!regional || regional.items.filter((i) => i.domestic).length !== 1) return null;
  const total = regional.items.reduce((acc, i) => acc + i.amount, 0);
  if (total <= 0) return null;
  return regional.items.filter((i) => !i.domestic).reduce((acc, i) => acc + i.amount, 0) / total;
}

type Def = {
  key: string;
  unit: MetricUnit;
  title: (c: Company) => string;
  formula: (c: Company) => string;
  read: (c: Company) => number | null;
  fiscalYear: (c: Company) => string | null;
  sourceIds: (c: Company) => string[];
};

const latestYear = (c: Company) => latestOf(c)?.fiscalYear ?? null;
const latestSources = (c: Company) => latestOf(c)?.sourceIds ?? [];

const DEFS: Def[] = [
  {
    key: "net-margin",
    unit: "percent",
    title: () => "純利益率",
    formula: (c) => {
      const r = latestOf(c)!;
      return `${r.netIncomeLabel} ÷ ${r.revenueLabel}`;
    },
    read: (c) => {
      const r = latestOf(c);
      return r && marginReadable(r) ? ratio(r.netIncome, r.revenue) : null;
    },
    fiscalYear: latestYear,
    sourceIds: latestSources,
  },
  {
    key: "profit-margin",
    unit: "percent",
    title: (c) => `${latestOf(c)?.profitLabel ?? "利益"}率`,
    formula: (c) => {
      const r = latestOf(c)!;
      return `${r.profitLabel} ÷ ${r.revenueLabel}`;
    },
    read: (c) => {
      const r = latestOf(c);
      return r ? ratio(r.profit, r.revenue) : null;
    },
    fiscalYear: latestYear,
    sourceIds: latestSources,
  },
  {
    key: "equity-ratio",
    unit: "percent",
    title: () => "自己資本比率",
    formula: (c) => {
      const r = latestOf(c)!;
      return `${r.netAssetsLabel ?? "純資産"} ÷ ${r.totalAssetsLabel ?? "総資産"}`;
    },
    read: (c) => {
      const r = latestOf(c);
      return r ? ratio(r.netAssets, r.totalAssets) : null;
    },
    fiscalYear: latestYear,
    sourceIds: latestSources,
  },
  {
    key: "asset-turnover",
    unit: "times",
    title: () => "総資産回転率",
    formula: (c) => {
      const r = latestOf(c)!;
      return `${r.revenueLabel} ÷ ${r.totalAssetsLabel ?? "総資産"}`;
    },
    read: (c) => {
      const r = latestOf(c);
      return r ? ratio(r.revenue, r.totalAssets) : null;
    },
    fiscalYear: latestYear,
    sourceIds: latestSources,
  },
  {
    key: "revenue-per-employee",
    unit: "yen-per-person",
    title: () => "従業員1人あたり売上高",
    formula: (c) => `${latestOf(c)!.revenueLabel} ÷ 従業員数（連結）`,
    read: (c) => {
      const r = latestOf(c);
      return r ? ratio(r.revenue, r.employees) : null;
    },
    fiscalYear: latestYear,
    sourceIds: latestSources,
  },
  {
    key: "net-income-per-employee",
    unit: "yen-per-person",
    title: () => "従業員1人あたり純利益",
    formula: (c) => `${latestOf(c)!.netIncomeLabel} ÷ 従業員数（連結）`,
    read: (c) => {
      const r = latestOf(c);
      return r && r.employees !== null && r.employees > 0 && r.netIncome !== null ? r.netIncome / r.employees : null;
    },
    fiscalYear: latestYear,
    sourceIds: latestSources,
  },
  {
    key: "overseas-ratio",
    unit: "percent",
    title: () => "海外売上高比率",
    formula: (c) => {
      const regional = c.regionalRevenue!;
      const domestic = regional.items.find((i) => i.domestic)!;
      return `${domestic.region}以外の${regional.label} ÷ 地域別の${regional.label}の合計`;
    },
    read: overseasOf,
    fiscalYear: (c) => c.regionalRevenue?.fiscalYear ?? null,
    sourceIds: (c) => c.regionalRevenue?.sourceIds ?? [],
  },
  {
    key: "revenue-growth-1y",
    unit: "percent-change",
    title: () => "売上高の前期比",
    formula: (c) => `最新期の${latestOf(c)!.revenueLabel} ÷ 前期の${latestOf(c)!.revenueLabel} − 1`,
    read: (c) => changeOf(c, (r) => r.revenue),
    fiscalYear: latestYear,
    sourceIds: latestSources,
  },
  {
    key: "net-income-growth-1y",
    unit: "percent-change",
    title: () => "純利益の前期比",
    formula: (c) => `最新期の${latestOf(c)!.netIncomeLabel} ÷ 前期の${latestOf(c)!.netIncomeLabel} − 1`,
    read: (c) => changeOf(c, (r) => r.netIncome),
    fiscalYear: latestYear,
    sourceIds: latestSources,
  },
  {
    key: "revenue-growth-5y",
    unit: "percent-change",
    title: () => "売上高の5期の伸び",
    formula: () => "最新期の売上高 ÷ 5期前の売上高 − 1",
    read: (c) => {
      const growth = revenueGrowth5y(c);
      return growth === null ? null : growth - 1;
    },
    fiscalYear: latestYear,
    sourceIds: (c) => {
      const records = byPeriod(c.financials);
      return [...new Set([...(records[0]?.sourceIds ?? []), ...(records.at(-1)?.sourceIds ?? [])])];
    },
  },
];

/**
 * The company's computed metrics with their industry positions. `companies` is the released population (the
 * repository's list); the industry is the company's primary one, the same roster 業界比較 (JCE-043) uses.
 */
export function reportMetrics(company: Company, companies: Company[]): ReportMetrics {
  const industryId = primaryIndustry(company);
  const members = industryId ? companies.filter((c) => primaryIndustry(c) === industryId) : [];
  if (industryId && !members.some((c) => c.id === company.id)) members.push(company);

  const metrics: ReportMetric[] = [];
  for (const def of DEFS) {
    const value = def.read(company);
    const fiscalYear = def.fiscalYear(company);
    if (value === null || fiscalYear === null) continue;
    const values = members.map((c) => def.read(c)).filter((v): v is number => v !== null);
    metrics.push({
      key: def.key,
      title: def.title(company),
      formula: def.formula(company),
      unit: def.unit,
      value,
      fiscalYear,
      sourceIds: def.sourceIds(company),
      industry: industryPosition(value, values),
    });
  }
  return {
    industryId,
    industryName: industryId ? INDUSTRY_LABELS[industryId].name : null,
    metrics,
  };
}
