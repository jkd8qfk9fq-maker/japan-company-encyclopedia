import { median, type IndustryFigures, type IndustryFiguresData } from "@/lib/industry-figures";
import type { IndustryId } from "@/types/company";

/**
 * 業界ランキング (JCE-062): industries ordered by one of the figures the 業界の数字 tab already computes from printed
 * figures (JCE-042/047). Nothing is computed here but the order: each value is the same one `buildIndustryFigures`
 * gives the industry pages, so a ranking cannot disagree with them. Rebuilt with the site, so it follows the data.
 *
 * Wording is an order (「高い順」), never a verdict on an industry.
 */

export const RANKING_IDS = ["overseas-sales", "revenue-growth", "employee-growth", "net-margin"] as const;
export type RankingId = (typeof RANKING_IDS)[number];

/** An industry with fewer companies behind its figure is listed apart, not ranked: one or two companies are not an industry. */
export const MIN_COMPANIES = 5;

export type RankingRow = { rank: number; id: IndustryId; name: string; value: number; companies: number };
export type Ranking = {
  id: RankingId;
  title: string;
  /** What the value is, in a few words, for the table head and the share image. */
  measure: string;
  formula: string;
  /** Who is counted and how a missing figure is handled. */
  basis: string;
  format: (value: number) => string;
  /** A gap between two values of this ranking: percentage points for a share, a multiple for a growth. */
  formatDifference: (value: number) => string;
  rows: RankingRow[];
  /** Industries left out, with the number of companies behind their figure (0 = no company prints it). */
  excluded: { id: IndustryId; name: string; companies: number }[];
};

type Def = Omit<Ranking, "id" | "rows" | "excluded"> & {
  pick: (industry: IndustryFigures, data: IndustryFiguresData) => { value: number; companies: number } | null;
};

const percent = (v: number) => `${(v * 100).toFixed(1)}%`;
const times = (v: number) => `${v.toFixed(2)}倍`;
const points = (v: number) => `${(v * 100).toFixed(1)}ポイント`;

const DEFS: Record<RankingId, Def> = {
  "overseas-sales": {
    title: "海外売上高比率が高い業界",
    measure: "海外売上高比率（中央値）",
    formula: "日本以外の売上高 ÷ 地域別売上高の合計（会社ごと）の中央値",
    basis: "有価証券報告書の「地域ごとの情報」に日本と日本以外の売上高を印字した会社だけを数えます。地域別の情報がない会社は除き、0%とは扱いません。",
    format: percent,
    formatDifference: points,
    pick: (i) => i.overseasSalesRatio,
  },
  "revenue-growth": {
    title: "売上高の伸びが大きい業界",
    measure: "5期の売上高の伸び（中央値）",
    formula: "最新期の売上高 ÷ 5期前の売上高（会社ごと）の中央値。1.00倍が横ばい",
    basis: "5期分の売上高がそろった会社だけを数えます。期がそろわない会社・売上高が0以下の期がある会社は除きます。",
    format: times,
    formatDifference: times,
    pick: (i) => i.revenueGrowth5y,
  },
  "employee-growth": {
    title: "従業員数の伸びが大きい業界",
    measure: "5期の従業員数の伸び（業界の合計）",
    formula: "5期そろった会社の従業員数（連結）の合計で、最新期 ÷ 5期前",
    basis: "5期分の従業員数がそろった会社だけを、同じ顔ぶれで足し合わせます。期がそろわない会社は除きます。会社の入れ替わりによる増減は含みません。",
    format: times,
    formatDifference: times,
    pick: (i, data) => {
      const series = data.indexes.employees.industries.find((s) => s.id === i.id);
      return series && series.values.length === 5 ? { value: series.values[4]! / 100, companies: series.companies } : null;
    },
  },
  "net-margin": {
    title: "純利益率が高い業界",
    measure: "純利益率（業界の合計）",
    formula: "業界の純利益の合計 ÷ 売上高の合計（最新期）",
    basis: "最新期の売上高と純利益の両方を印字した会社だけを数えます。赤字の会社も含めて合計します。",
    format: percent,
    formatDifference: points,
    pick: (i) => i.netProfitMargin,
  },
};

/** Ties share a rank (1, 2, 2, 4); the order within a tie is by name, so it is stable. */
export function buildRanking(id: RankingId, data: IndustryFiguresData): Ranking {
  const { pick, ...def } = DEFS[id];
  const picked = data.industries.map((i) => ({ i, v: pick(i, data) }));
  const ranked = picked
    .filter((p): p is { i: IndustryFigures; v: { value: number; companies: number } } => p.v !== null && p.v.companies >= MIN_COMPANIES)
    .sort((a, b) => b.v.value - a.v.value || a.i.name.localeCompare(b.i.name, "ja"));
  const rows: RankingRow[] = [];
  ranked.forEach(({ i, v }, k) => {
    const prev = rows[k - 1];
    rows.push({ rank: prev && prev.value === v.value ? prev.rank : k + 1, id: i.id, name: i.name, value: v.value, companies: v.companies });
  });
  const excluded = picked
    .filter((p) => p.v === null || p.v.companies < MIN_COMPANIES)
    .map(({ i, v }) => ({ id: i.id, name: i.name, companies: v?.companies ?? 0 }));
  return { id, ...def, rows, excluded };
}

export const buildRankings = (data: IndustryFiguresData) => RANKING_IDS.map((id) => buildRanking(id, data));

/**
 * The one-paragraph reading of a ranking (JCE-074): its top industry and the middle of its own order, taken from
 * the rows themselves — the paragraph above the table can therefore never disagree with the table under it.
 */
export type RankingReading = { top: RankingRow; medianValue: number };

export function rankingReading(ranking: Ranking): RankingReading | null {
  const top = ranking.rows[0];
  if (!top) return null;
  const medianValue = median(ranking.rows.map((r) => r.value));
  return medianValue === null ? null : { top, medianValue };
}

/** Every string the share images draw, so the subset font can be checked to cover them (tests/rankings.test.ts). */
export const SHARE_IMAGE_TEXT = [
  ...RANKING_IDS.flatMap((id) => [DEFS[id].title, DEFS[id].measure]),
  "日本企業百科事典",
  "業界ランキング",
  "位",
  "社",
  "有価証券報告書の数値から集計",
  "対象",
  "倍%.・0123456789",
];
