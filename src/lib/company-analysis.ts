import { changeBetween } from "@/lib/financial-summary";
import {
  industryPosition,
  PEER_WINDOW_DAYS,
  reportMetrics,
  type IndustryPosition,
  type MetricUnit,
  type ReportMetric,
} from "@/lib/report-metrics";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";

/**
 * The five-perspective analysis layer (JCE-078, Phase 1): the report's computed layer (JCE-073,
 * `report-metrics.ts`) regrouped under five perspectives — 規模と地位 / 成長 / 収益性 / 財務の安定 /
 * 外部環境との接続 — with the printed figures' own positions added for 規模と地位 and the net-assets
 * trend for 財務の安定. Everything here is built from the same inputs as the report: printed figures
 * of the latest period, peers of the primary industry whose latest year ends within
 * PEER_WINDOW_DAYS, and distributions only at MIN_DISTRIBUTION or more (inside `industryPosition`).
 *
 * The layer never compresses the five perspectives into one number: no score, no grade, no verdict
 * (spec §7). A position is a position. Computed values are labelled 計算値 with their formula, printed
 * values 印字値, and the two are never mixed in one row.
 *
 * Free / paid boundary (spec §2, §5): the free part of the analysis is each row's own value and the
 * industry median; the distribution as a whole (quartiles, rank, percentile), the multi-period
 * trends and the indicator links are the paid part, gated separately in `plan.ts`
 * (ANALYSIS_FEATURES_OPEN) — never by re-closing what JCE-075 opened.
 */

export type AnalysisUnit = MetricUnit | "yen" | "people";

export type AnalysisRow = {
  key: string;
  title: string;
  /** The formula for a computed row; for a printed row, where the figure is printed. */
  formula: string;
  /** 計算値 (computed from printed figures) or 印字値 (as the filing prints it). */
  kind: "computed" | "printed";
  unit: AnalysisUnit;
  value: number;
  fiscalYear: string;
  sourceIds: string[];
  industry: IndustryPosition | null;
  note?: string;
};

export type AnalysisPerspectiveId = "scale" | "growth" | "profitability" | "stability" | "environment";

export type AnalysisSeriesPoint = { fiscalYear: string; periodEnd: string; value: number };

export type AnalysisPerspective = {
  id: AnalysisPerspectiveId;
  title: string;
  /** What this perspective reads, in structural terms only — never a causal claim. */
  intro: string;
  rows: AnalysisRow[];
  /** Printed trend shown in the paid part (成長: 売上高, 財務の安定: 純資産). */
  series?: { title: string; points: AnalysisSeriesPoint[] };
};

export type CompanyAnalysis = {
  industryId: IndustryId | null;
  industryName: string | null;
  industryMembers: number;
  comparableMembers: number;
  perspectives: AnalysisPerspective[];
};

const byPeriod = (records: FinancialRecord[]): FinancialRecord[] => [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
const latestOf = (c: Company): FinancialRecord | undefined => byPeriod(c.financials).at(-1);

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

/** The same peer set the report's distributions rest on: primary industry, latest year within the window. */
function comparablePeers(company: Company, companies: Company[]): Company[] {
  const industryId = primaryIndustry(company);
  if (!industryId) return [];
  const members = companies.filter((c) => primaryIndustry(c) === industryId);
  if (!members.some((c) => c.id === company.id)) members.push(company);
  const ownEnd = latestOf(company)?.periodEnd;
  if (ownEnd === undefined) return members;
  return members.filter((c) => {
    const end = latestOf(c)?.periodEnd;
    return end !== undefined && Math.abs(Date.parse(end) - Date.parse(ownEnd)) <= PEER_WINDOW_DAYS * 86_400_000;
  });
}

const fromMetric = (m: ReportMetric): AnalysisRow => ({
  key: m.key,
  title: m.title,
  formula: m.formula,
  kind: "computed",
  unit: m.unit,
  value: m.value,
  fiscalYear: m.fiscalYear,
  sourceIds: m.sourceIds,
  industry: m.industry,
  ...(m.note ? { note: m.note } : {}),
});

type PrintedDef = {
  key: string;
  pick: (r: FinancialRecord) => number | null;
  title: (r: FinancialRecord) => string;
  unit: AnalysisUnit;
};

const PRINTED_DEFS: PrintedDef[] = [
  { key: "printed-revenue", pick: (r) => r.revenue, title: (r) => r.revenueLabel, unit: "yen" },
  { key: "printed-total-assets", pick: (r) => r.totalAssets, title: (r) => r.totalAssetsLabel ?? "総資産", unit: "yen" },
  { key: "printed-net-assets", pick: (r) => r.netAssets, title: (r) => r.netAssetsLabel ?? "純資産", unit: "yen" },
  { key: "printed-employees", pick: (r) => r.employees, title: () => "従業員数（連結）", unit: "people" },
];

/** 規模と地位: the printed figures themselves, positioned in the industry — no computation but the position. */
function printedRows(company: Company, peers: Company[]): AnalysisRow[] {
  const latest = latestOf(company);
  if (!latest) return [];
  const rows: AnalysisRow[] = [];
  for (const def of PRINTED_DEFS) {
    const value = def.pick(latest);
    if (value === null) continue;
    const values = peers.map((c) => {
      const r = latestOf(c);
      return r ? def.pick(r) : null;
    }).filter((v): v is number => v !== null);
    rows.push({
      key: def.key,
      title: def.title(latest),
      formula: "有価証券報告書の「主要な経営指標等の推移」に印字された値",
      kind: "printed",
      unit: def.unit,
      value,
      fiscalYear: latest.fiscalYear,
      sourceIds: latest.sourceIds,
      industry: industryPosition(value, values),
    });
  }
  return rows;
}

/** 純資産の前期比, under the free summary's comparability rule: same accounting standard as the year before. */
function netAssetsChange(c: Company): number | null {
  const records = byPeriod(c.financials);
  const latest = records.at(-1);
  const previous = records.at(-2);
  if (!latest || !previous) return null;
  if (previous.accountingStandard !== latest.accountingStandard) return null;
  return changeBetween(latest.netAssets, previous.netAssets);
}

function netAssetsChangeRow(company: Company, peers: Company[]): AnalysisRow | null {
  const latest = latestOf(company);
  const value = netAssetsChange(company);
  if (!latest || value === null) return null;
  const values = peers.map(netAssetsChange).filter((v): v is number => v !== null);
  return {
    key: "net-assets-growth-1y",
    title: "純資産の前期比",
    formula: `最新期の${latest.netAssetsLabel ?? "純資産"} ÷ 前期の${latest.netAssetsLabel ?? "純資産"} − 1`,
    kind: "computed",
    unit: "percent-change",
    value,
    fiscalYear: latest.fiscalYear,
    sourceIds: latest.sourceIds,
    industry: industryPosition(value, values),
  };
}

function seriesOf(company: Company, pick: (r: FinancialRecord) => number | null): AnalysisSeriesPoint[] {
  return byPeriod(company.financials)
    .map((r) => {
      const value = pick(r);
      return value === null ? null : { fiscalYear: r.fiscalYear, periodEnd: r.periodEnd, value };
    })
    .filter((p): p is AnalysisSeriesPoint => p !== null);
}

/** The five perspectives and what each reads — shared with the /analysis guide page. */
export const ANALYSIS_PERSPECTIVE_GUIDE: { id: AnalysisPerspectiveId; title: string; intro: string }[] = [
  {
    id: "scale",
    title: "規模と地位",
    intro: "規模は印字値そのもので比べます。順位とパーセンタイルは、主たる産業が同じ掲載企業の中での位置で、会社の良し悪しを判定するものではありません。",
  },
  {
    id: "growth",
    title: "成長",
    intro: "伸びは印字値から計算した値（計算値）です。前期比は、会計基準と売上の範囲が前期と同じ場合だけ計算しています。",
  },
  {
    id: "profitability",
    title: "収益性",
    intro: "収益性は印字値から計算した比率（計算値）です。利益率は、同種の利益行（経常利益・税引前利益・営業利益）を印字する会社同士でだけ比べます。",
  },
  {
    id: "stability",
    title: "財務の安定",
    intro: "純資産と総資産の関係（自己資本比率）と、純資産の推移で読みます。有利子負債や手元流動性など、現在の財務レコードに無い項目は扱いません。",
  },
  {
    id: "environment",
    title: "外部環境との接続",
    intro: "売上がどこで生まれているか（事業別・地域別の構成と海外売上高比率）から、会社を取り巻く環境との接続を読みます。経済指標は環境の提示であり、業績との因果を示すものではありません。",
  },
];

export function companyAnalysis(company: Company, companies: Company[]): CompanyAnalysis {
  const layer = reportMetrics(company, companies);
  const peers = comparablePeers(company, companies);
  const byKey = new Map(layer.metrics.map((m) => [m.key, m]));
  const pick = (keys: string[]): AnalysisRow[] =>
    keys.map((k) => byKey.get(k)).filter((m): m is ReportMetric => m !== undefined).map(fromMetric);

  const stabilityRows = pick(["equity-ratio"]);
  const netAssetsRow = netAssetsChangeRow(company, peers);
  if (netAssetsRow) stabilityRows.push(netAssetsRow);

  const rowsById: Record<AnalysisPerspectiveId, AnalysisRow[]> = {
    scale: printedRows(company, peers),
    growth: pick(["revenue-growth-1y", "net-income-growth-1y", "revenue-growth-5y"]),
    profitability: pick(["net-margin", "profit-margin", "asset-turnover", "revenue-per-employee", "net-income-per-employee"]),
    stability: stabilityRows,
    environment: pick(["overseas-ratio"]),
  };
  const seriesById: Partial<Record<AnalysisPerspectiveId, AnalysisPerspective["series"]>> = {
    growth: { title: "売上高の推移（印字値）", points: seriesOf(company, (r) => r.revenue) },
    stability: { title: "純資産の推移（印字値）", points: seriesOf(company, (r) => r.netAssets) },
  };

  return {
    industryId: layer.industryId,
    industryName: layer.industryName,
    industryMembers: layer.industryMembers,
    comparableMembers: layer.comparableMembers,
    perspectives: ANALYSIS_PERSPECTIVE_GUIDE.map((meta) => ({
      ...meta,
      rows: rowsById[meta.id],
      ...(seriesById[meta.id] && seriesById[meta.id]!.points.length >= 2 ? { series: seriesById[meta.id] } : {}),
    })).filter((p) => p.rows.length > 0),
  };
}
