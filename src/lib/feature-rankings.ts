import { median, revenueGrowth5y } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company, IndustryId } from "@/types/company";
import type { Feature } from "@/types/feature";

/**
 * 特集×業界の企業ランキング (JCE-119): a feature's industry table links here instead of to the industry
 * page — the companies of that industry, ordered by the very figure the feature aggregates into its
 * median. Each company's value comes from the same input through the same function the feature itself
 * uses (`revenueGrowth5y`, the printed figure, or — for the overseas ratio — the printed regional
 * revenue recomputed at full precision, the input `buildIndustryFigures` medians; `companyMetrics`
 * rounds that ratio to 0.1pt for display, so it is not reused here), so a ranking can never disagree
 * with the feature's table. The order is the value's own order, never a score or a verdict on a company
 * (the wording rule of the industry rankings, JCE-062).
 */

const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`;
const times2 = (v: number) => `${v.toFixed(2)}倍`;
const manYen = (v: number) =>
  `${(v / 10000).toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}万円`;
const manYen0 = (v: number) => `${Math.round(v / 10000).toLocaleString("ja-JP")}万円`;
const people = (n: number) => `${n.toLocaleString("ja-JP", { maximumFractionDigits: 1 })}人`;
const yen = (v: number) => `${Number.isInteger(v) ? v.toLocaleString("ja-JP") : v.toFixed(1)}円`;

/** The industry a company is counted under, the same primary-industry rule as the features and `buildIndustryFigures`. */
function primaryIndustryId(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

/** The latest printed year of a company, by period end — the year the features' "latest" figures read. */
function latestRecord(company: Company) {
  return [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
}

type Extracted = { value: number; detail: string };

export type FeatureRankingDef = {
  /** The feature's item, e.g. 海外売上高比率 — the ranking's title and measure. */
  metric: string;
  /** The value column's heading, with 計算値 where the value is computed. */
  valueLabel: string;
  /** What `detail` holds: 対象期 for a single year, 期間 for the growth span. */
  detailLabel: string;
  formula: string;
  /** Who is counted and how a missing figure is handled. */
  basis: string;
  /** A caution the feature's own prose carries, repeated here so the order is not read past it. */
  caution?: string;
  format: (value: number) => string;
  extract: (company: Company) => Extracted | null;
};

export const FEATURE_RANKING_DEFS: Record<string, FeatureRankingDef> = {
  "overseas-sales-geography": {
    metric: "海外売上高比率",
    valueLabel: "海外売上高比率（計算値）",
    detailLabel: "対象期",
    formula: "日本以外の売上高 ÷ 地域別売上高の合計（会社ごと）。地域別の売上高は有価証券報告書の印字値です",
    basis:
      "有価証券報告書の「地域ごとの情報」に地域別の売上高を印字した会社だけを対象にします。地域別の情報がない会社は除き、0%とは扱いません。",
    format: pct1,
    extract: (company) => {
      // The same rule as `buildIndustryFigures`' overseas ratio: exactly one domestic region, full precision.
      const regional = company.regionalRevenue;
      if (!regional || regional.items.filter((i) => i.domestic).length !== 1) return null;
      const total = regional.items.reduce((sum, i) => sum + i.amount, 0);
      if (total <= 0) return null;
      const overseas = regional.items.filter((i) => !i.domestic).reduce((sum, i) => sum + i.amount, 0);
      return { value: overseas / total, detail: regional.fiscalYear };
    },
  },
  "average-salary-by-industry": {
    metric: "平均年間給与",
    valueLabel: "平均年間給与",
    detailLabel: "対象期",
    formula: "有価証券報告書「従業員の状況」の平均年間給与（提出会社）の印字どおり。計算値は並びと中央値だけです",
    basis:
      "平均年間給与を印字した会社だけを対象にします。金額は連結グループ全体ではなく、報告書を提出した会社単体の平均です。",
    format: manYen,
    extract: (company) => {
      const workforce = company.workforce;
      return workforce && workforce.averageAnnualSalary !== null
        ? { value: workforce.averageAnnualSalary, detail: workforce.fiscalYear }
        : null;
    },
  },
  "five-year-revenue-growth": {
    metric: "5期の売上成長",
    valueLabel: "5期の伸び（計算値）",
    detailLabel: "期間",
    formula: "最新期の売上高 ÷ 5期前の売上高（会社ごと）。売上高は有価証券報告書の印字値です",
    basis: "5期分の売上高がそろった会社だけを対象にします。売上高が0以下の期がある会社は除きます。",
    format: times2,
    extract: (company) => {
      const growth = revenueGrowth5y(company);
      if (growth === null) return null;
      const records = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
      return { value: growth, detail: `${records[0]!.fiscalYear}→${records.at(-1)!.fiscalYear}` };
    },
  },
  "employees-by-industry": {
    metric: "従業員数",
    valueLabel: "従業員数",
    detailLabel: "対象期",
    formula:
      "各社の最新期の従業員数（有価証券報告書「主要な経営指標等の推移」の印字どおり）。計算値は並びと中央値だけです",
    basis:
      "最新期に人数を印字した会社だけを対象にします。連結財務諸表を作る会社ではグループ全体の人数で、提出会社だけの人数（「従業員の状況」）とは数え方が違います。",
    format: people,
    extract: (company) => {
      const latest = latestRecord(company);
      return latest && latest.employees !== null ? { value: latest.employees, detail: latest.fiscalYear } : null;
    },
  },
  "how-many-companies-pay-dividends": {
    metric: "1株当たり配当額",
    valueLabel: "1株当たり配当額",
    detailLabel: "対象期",
    formula:
      "有価証券報告書「主要な経営指標等の推移」に印字された1株当たり配当額（提出会社）の印字どおり。計算値は並びだけです",
    basis:
      "特集の項目は「配当を出す会社の割合」ですが、割合は業界の集計で会社には帰属しません。そのためこのページでは、各社に印字された1株当たり配当額を並べます。配当額が読み取れなかった会社は除きます（配当を出していないとは限りません）。",
    caution:
      "この金額は株式分割の経緯や発行済株式総数の違いで大きく変わるため、金額の大小を会社どうしで比べても、株主への戻し方の手厚さは測れません。株価から求める配当利回りは、このサイトでは株価を扱わないため出しません。",
    format: yen,
    extract: (company) => {
      const shareFacts = company.shareFacts;
      return shareFacts && shareFacts.dividendPerShare !== null
        ? { value: shareFacts.dividendPerShare, detail: shareFacts.fiscalYear }
        : null;
    },
  },
  "revenue-per-employee-by-industry": {
    metric: "従業員1人あたり売上高",
    valueLabel: "従業員1人あたり売上高（計算値）",
    detailLabel: "対象期",
    formula: "最新期の売上高 ÷ 従業員数（会社ごと）。売上高と従業員数は有価証券報告書の印字値です",
    basis:
      "売上高と従業員数の両方がそろった会社だけを対象にします。各社の数字はその会社の報告書が印字した同じ期のもので、連結・単体の区分は会社によって異なります。",
    caution:
      "この数字は効率の順位ではありません。売上を人数で割ったものは、事業の形の違い——何を売り、どんな資産と人で回しているか——を映す数字です。",
    format: manYen0,
    extract: (company) => {
      const latest = latestRecord(company);
      return latest && latest.revenue !== null && latest.employees !== null && latest.employees > 0
        ? { value: latest.revenue / latest.employees, detail: latest.fiscalYear }
        : null;
    },
  },
};

export type FeatureRankingRow = {
  rank: number;
  companyId: string;
  name: string;
  value: number;
  valueText: string;
  detail: string;
};

export type FeatureRanking = {
  featureId: string;
  industryId: IndustryId;
  industryName: string;
  metric: string;
  valueLabel: string;
  detailLabel: string;
  formula: string;
  basis: string;
  caution?: string;
  format: (value: number) => string;
  rows: FeatureRankingRow[];
  /** The median of the ranked values — the same figure the feature's industry table shows for this industry. */
  medianValue: number | null;
};

/** Ties share a rank (1, 2, 2, 4); the order within a tie is by name, so it is stable — the rankings' rule (JCE-062). */
export function buildFeatureRanking(
  featureId: string,
  industryId: string,
  companies: Company[],
): FeatureRanking | null {
  const def = FEATURE_RANKING_DEFS[featureId];
  const label = (INDUSTRY_LABELS as Record<string, { name: string }>)[industryId];
  if (!def || !label) return null;
  const picked = companies
    .filter((c) => primaryIndustryId(c) === industryId)
    .map((c) => ({ company: c, v: def.extract(c) }))
    .filter((x): x is { company: Company; v: Extracted } => x.v !== null)
    .sort((a, b) => b.v.value - a.v.value || a.company.name.localeCompare(b.company.name, "ja"));
  if (picked.length === 0) return null;
  const rows: FeatureRankingRow[] = [];
  picked.forEach(({ company, v }, k) => {
    const prev = rows[k - 1];
    rows.push({
      rank: prev && prev.value === v.value ? prev.rank : k + 1,
      companyId: company.id,
      name: company.name,
      value: v.value,
      valueText: def.format(v.value),
      detail: v.detail,
    });
  });
  return {
    featureId,
    industryId: industryId as IndustryId,
    industryName: label.name,
    metric: def.metric,
    valueLabel: def.valueLabel,
    detailLabel: def.detailLabel,
    formula: def.formula,
    basis: def.basis,
    caution: def.caution,
    format: def.format,
    rows,
    medianValue: median(picked.map((x) => x.v.value)),
  };
}

const RANKING_HREF = /^\/features\/([^/]+)\/rankings\/([^/]+)$/;

/**
 * The (feature, industry) pairs a feature's tables actually link to, read off the built features
 * themselves — the ranking routes are generated for exactly these pairs, so a table link can never
 * land on a missing page and no unlinked page is generated.
 */
export function featureRankingLinks(features: Feature[]): { featureId: string; industryId: string }[] {
  const seen = new Map<string, { featureId: string; industryId: string }>();
  for (const feature of features) {
    for (const block of feature.body) {
      if (block.type !== "data-table") continue;
      for (const row of block.rows) {
        const match = row.href?.match(RANKING_HREF);
        if (match) seen.set(`${match[1]}/${match[2]}`, { featureId: match[1]!, industryId: match[2]! });
      }
    }
  }
  return [...seen.values()];
}
