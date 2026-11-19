import { median, overseasRatio, revenueGrowth5y } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { segmentShares } from "@/lib/strategy";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";

/**
 * 企業レポート (JCE-073): one company's printed figures arranged to be printed and handed on, with the computed
 * layer beside them — each metric a ratio or a size computed from figures as printed, labelled 計算値 with its
 * formula, and where it sits among the released companies of the same industry: the median, the middle half
 * (first to third quartile), the rank and the share of companies above it. Nothing here is a judgement: no rating,
 * no score, no price or valuation (invariant 4), and a figure a filing does not print gives no metric, never an
 * estimate.
 */

export type Unit = "yen" | "percent" | "times" | "man-yen";

export type Placement = {
  /** Companies of the industry that have this metric, the company included. */
  members: number;
  median: number;
  q1: number;
  q3: number;
  /** 1 = highest value; ties share the higher rank. */
  rank: number;
  /** The rank as a share of members, rounded up: 3rd of 40 → 上位8%. */
  topPercent: number;
};

export type ReportMetric = {
  key: string;
  label: string;
  /** How the value is made; printed figures say so instead of a formula. */
  formula: string;
  computed: boolean;
  unit: Unit;
  value: number;
  fiscalYear: string;
  placement: Placement | null;
  /** Why the comparison set is narrower than the industry, when it is. */
  note?: string;
};

export type Share = { name: string; amount: number; percent: number };

export type CompanyReport = {
  industryId: IndustryId | null;
  industryName: string | null;
  /** Released companies of the industry, the company included. */
  industryMembers: number;
  /** Up to five years, oldest first, as printed. */
  periods: FinancialRecord[];
  metrics: ReportMetric[];
  segments: { label: string; fiscalYear: string; items: Share[] } | null;
  regions: { label: string; fiscalYear: string; items: Share[] } | null;
  /** Every source a figure in the report comes from. */
  sourceIds: string[];
};

const byPeriod = (records: FinancialRecord[]) => [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
const latestOf = (c: Company) => byPeriod(c.financials).at(-1);
const ratio = (num: number | null | undefined, den: number | null | undefined) =>
  num !== null && num !== undefined && den !== null && den !== undefined && den > 0 ? num / den : null;

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

/** The q-quantile with linear interpolation between ranks — the same rule `median` uses at q = 0.5. */
export function quantile(values: number[], q: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export function placementOf(own: number, values: number[]): Placement | null {
  const med = median(values);
  const q1 = quantile(values, 0.25);
  const q3 = quantile(values, 0.75);
  if (med === null || q1 === null || q3 === null) return null;
  const rank = values.filter((v) => v > own).length + 1;
  return { members: values.length, median: med, q1, q3, rank, topPercent: Math.ceil((rank / values.length) * 100) };
}

type Definition = {
  key: string;
  label: (latest: FinancialRecord) => string;
  formula: (latest: FinancialRecord) => string;
  computed: boolean;
  unit: Unit;
  read: (c: Company) => number | null;
  /** Narrows the industry to the companies this metric is comparable with. */
  comparableWith?: (company: Company) => { keep: (c: Company) => boolean; note: string } | null;
};

const DEFINITIONS: Definition[] = [
  { key: "revenue", label: (l) => l.revenueLabel, formula: () => "有価証券報告書の印字値", computed: false, unit: "yen", read: (c) => latestOf(c)?.revenue ?? null },
  { key: "revenue-growth-5y", label: () => "5期の売上高の伸び", formula: () => "最新期の売上高 ÷ 5期前の売上高", computed: true, unit: "times", read: revenueGrowth5y },
  {
    key: "profit-margin",
    label: (l) => `${l.profitLabel ?? "利益"}率`,
    formula: (l) => `${l.profitLabel ?? "利益"} ÷ 売上高`,
    computed: true,
    unit: "percent",
    read: (c) => {
      const l = latestOf(c);
      return l?.profitLabel ? ratio(l.profit, l.revenue) : null;
    },
    // 経常利益 (J-GAAP) and 税引前利益 (IFRS, US GAAP) are different lines; only the same line is ranked together.
    comparableWith: (company) => {
      const label = latestOf(company)?.profitLabel;
      return label ? { keep: (c) => latestOf(c)?.profitLabel === label, note: `${label}を印字する会社だけで比べています` } : null;
    },
  },
  { key: "net-margin", label: () => "純利益率", formula: (l) => `${l.netIncomeLabel} ÷ 売上高`, computed: true, unit: "percent", read: (c) => ratio(latestOf(c)?.netIncome, latestOf(c)?.revenue) },
  { key: "equity-ratio", label: () => "自己資本比率", formula: () => "純資産 ÷ 総資産", computed: true, unit: "percent", read: (c) => ratio(latestOf(c)?.netAssets, latestOf(c)?.totalAssets) },
  { key: "revenue-per-employee", label: () => "従業員1人あたり売上高", formula: () => "売上高 ÷ 従業員数（連結）", computed: true, unit: "yen", read: (c) => ratio(latestOf(c)?.revenue, latestOf(c)?.employees) },
  { key: "overseas-ratio", label: () => "海外売上高比率", formula: () => "海外の地域の売上高 ÷ 地域別の売上高の合計", computed: true, unit: "percent", read: overseasRatio },
  { key: "average-salary", label: () => "平均年間給与（提出会社）", formula: () => "有価証券報告書の印字値", computed: false, unit: "man-yen", read: (c) => c.workforce?.averageAnnualSalary ?? null },
];

export function companyReport(company: Company, released: Company[]): CompanyReport | null {
  const periods = byPeriod(company.financials).slice(-5);
  const latest = periods.at(-1);
  if (!latest) return null;
  const industryId = primaryIndustry(company);
  const industry = industryId ? released.filter((c) => primaryIndustry(c) === industryId) : [];

  const metrics: ReportMetric[] = [];
  for (const d of DEFINITIONS) {
    const value = d.read(company);
    if (value === null) continue;
    const narrow = d.comparableWith?.(company) ?? null;
    const peers = narrow ? industry.filter(narrow.keep) : industry;
    const values = peers.map(d.read).filter((v): v is number => v !== null);
    // A placement needs the company itself among the values and at least one other company to stand beside.
    const placement = industryId && values.length >= 2 ? placementOf(value, values) : null;
    metrics.push({
      key: d.key,
      label: d.label(latest),
      formula: d.formula(latest),
      computed: d.computed,
      unit: d.unit,
      value,
      fiscalYear: latest.fiscalYear,
      placement,
      ...(narrow && placement ? { note: narrow.note } : {}),
    });
  }

  const seg = segmentShares(company);
  const regional = company.regionalRevenue;
  const regionalTotal = regional ? regional.items.reduce((sum, i) => sum + i.amount, 0) : 0;

  return {
    industryId,
    industryName: industryId ? INDUSTRY_LABELS[industryId].name : null,
    industryMembers: industry.length,
    periods,
    metrics,
    segments: seg ? { label: seg.label, fiscalYear: seg.fiscalYear, items: seg.items.map((i) => ({ name: i.name, amount: i.amount, percent: i.percent })) } : null,
    regions:
      regional && regionalTotal > 0 && regional.items.length >= 2
        ? {
            label: regional.label,
            fiscalYear: regional.fiscalYear,
            items: [...regional.items]
              .filter((i) => i.amount > 0)
              .sort((a, b) => b.amount - a.amount)
              .map((i) => ({ name: i.region, amount: i.amount, percent: Math.round((i.amount / regionalTotal) * 1000) / 10 })),
          }
        : null,
    sourceIds: [
      ...new Set([
        ...periods.flatMap((p) => p.sourceIds),
        ...(company.segmentRevenue?.sourceIds ?? []),
        ...(regional?.sourceIds ?? []),
        ...(company.workforce?.sourceIds ?? []),
      ]),
    ],
  };
}
