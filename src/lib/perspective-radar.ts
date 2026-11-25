import type { AnalysisPerspectiveId, AnalysisRow, CompanyAnalysis } from "@/lib/company-analysis";

/**
 * The five perspectives as one picture (JCE-115): for each perspective, one named indicator and where the company's
 * value sits in its industry — the percentile the analysis tables already print (the share of the industry's
 * companies whose value is below this one). The outer the point, the larger the value within the industry; the
 * 50 ring is the industry median.
 *
 * It is not a score. Each axis is a single printed or computed indicator, chosen in a fixed order and named on the
 * chart — never an average of a perspective's rows — and the five are not added, weighted or turned into an area
 * figure (spec §7, JCE-078: positions per perspective, never combined). Larger is not better either: a high
 * 自己資本比率 or 海外売上高比率 describes a shape, not a merit. An axis whose indicator has no distribution
 * (too few comparable companies, or the figure is not printed) is drawn as 分布なし, never guessed.
 */

export type RadarAxis = {
  perspective: AnalysisPerspectiveId;
  perspectiveTitle: string;
  /** The indicator the axis reads, from the row itself (e.g. 売上収益, 経常利益率). */
  indicator: string;
  row: AnalysisRow | null;
  /** 0–100, or null when the indicator has no industry distribution. */
  percentile: number | null;
};

/** For each perspective, the indicators tried in order; the first with an industry distribution is used. */
const AXIS_KEYS: Record<AnalysisPerspectiveId, string[]> = {
  scale: ["printed-revenue"],
  growth: ["revenue-growth-5y", "revenue-growth-1y"],
  profitability: ["profit-margin", "net-margin"],
  stability: ["equity-ratio"],
  environment: ["overseas-ratio"],
};

const AXIS_ORDER: AnalysisPerspectiveId[] = ["scale", "growth", "profitability", "stability", "environment"];

/** Fallback names for an axis whose indicator is missing altogether. */
const DEFAULT_INDICATOR: Record<AnalysisPerspectiveId, string> = {
  scale: "売上高",
  growth: "売上高の伸び",
  profitability: "利益率",
  stability: "自己資本比率",
  environment: "海外売上高比率",
};

const TITLES: Record<AnalysisPerspectiveId, string> = {
  scale: "規模と地位",
  growth: "成長",
  profitability: "収益性",
  stability: "財務の安定",
  environment: "外部環境との接続",
};

export function radarAxes(analysis: CompanyAnalysis): RadarAxis[] {
  const rows = new Map(analysis.perspectives.flatMap((p) => p.rows).map((r) => [r.key, r]));
  return AXIS_ORDER.map((id) => {
    const candidates = AXIS_KEYS[id].map((k) => rows.get(k)).filter((r): r is AnalysisRow => r !== undefined);
    const row = candidates.find((r) => r.industry) ?? candidates[0] ?? null;
    return {
      perspective: id,
      perspectiveTitle: TITLES[id],
      indicator: row?.title ?? DEFAULT_INDICATOR[id],
      row,
      percentile: row?.industry ? row.industry.percentile : null,
    };
  });
}

/** Below three positioned axes a polygon says nothing a list would not; the chart is then left out. */
export const MIN_RADAR_AXES = 3;
