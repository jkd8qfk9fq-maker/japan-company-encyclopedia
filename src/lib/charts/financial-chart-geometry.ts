import type { FinancialRecord } from "@/types/company";

/**
 * Geometry for the revenue + net income chart, kept free of React so the
 * scale — the part that can lie — is unit-tested.
 *
 * ONE y-axis, in yen, starting at zero. The spec allows a dual axis "when
 * necessary"; it is not necessary here, and it would be harmful: two scales
 * let the net-income series be stretched to any visual height, which would
 * show a beginner a profit margin that does not exist. On a shared axis the
 * net-income column is shorter than the revenue column by exactly as much as
 * profit is smaller than sales — which is the thing worth understanding.
 */

export const CHART_MARGIN = { top: 16, right: 8, bottom: 36, left: 72 } as const;
export const BAR_MAX_WIDTH = 24;
export const BAR_GAP = 2;
export const BAR_RADIUS = 4;

export type ChartBar = {
  series: "revenue" | "netIncome";
  x: number;
  width: number;
  /** null when the value is not available: nothing is drawn, a marker says so. */
  y: number | null;
  height: number;
  value: number | null;
  path: string | null;
};

export type ChartBand = {
  index: number;
  record: FinancialRecord;
  x: number;
  width: number;
  centerX: number;
  bars: [ChartBar, ChartBar];
};

export type ChartGeometry = {
  width: number;
  height: number;
  plot: { x: number; y: number; width: number; height: number };
  baselineY: number;
  ticks: { value: number; y: number }[];
  bands: ChartBand[];
  /**
   * x positions between bands where the series stops being comparable: the
   * accounting standard changes, or what the revenue figure covers changes.
   */
  breaks: { x: number; before: FinancialRecord; after: FinancialRecord; reason: "standard" | "basis" }[];
};

/** A "nice" step (1, 2, 2.5, 5 × 10^k) giving roughly `count` intervals. */
export function niceStep(range: number, count: number): number {
  if (range <= 0) return 1;
  const raw = range / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

/**
 * A column with a rounded data end and a square base. For a negative value
 * the data end is at the bottom, so the rounding flips.
 */
export function columnPath(x: number, baselineY: number, width: number, valueY: number): string {
  const height = Math.abs(baselineY - valueY);
  const r = Math.min(BAR_RADIUS, width / 2, height);
  if (valueY <= baselineY) {
    const top = valueY;
    return [
      `M${x} ${baselineY}`,
      `V${top + r}`,
      `Q${x} ${top} ${x + r} ${top}`,
      `H${x + width - r}`,
      `Q${x + width} ${top} ${x + width} ${top + r}`,
      `V${baselineY}`,
      "Z",
    ].join(" ");
  }
  const bottom = valueY;
  return [
    `M${x} ${baselineY}`,
    `V${bottom - r}`,
    `Q${x} ${bottom} ${x + r} ${bottom}`,
    `H${x + width - r}`,
    `Q${x + width} ${bottom} ${x + width} ${bottom - r}`,
    `V${baselineY}`,
    "Z",
  ].join(" ");
}

export function computeChartGeometry(
  records: FinancialRecord[],
  width: number,
  height: number,
): ChartGeometry {
  const sorted = [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  const plot = {
    x: CHART_MARGIN.left,
    y: CHART_MARGIN.top,
    width: Math.max(0, width - CHART_MARGIN.left - CHART_MARGIN.right),
    height: Math.max(0, height - CHART_MARGIN.top - CHART_MARGIN.bottom),
  };

  const values = sorted.flatMap((r) => [r.revenue, r.netIncome]).filter((v): v is number => v !== null);
  // Zero is always inside the domain: a column that does not start at zero misstates its value.
  const dataMax = Math.max(0, ...values);
  const dataMin = Math.min(0, ...values);
  const step = niceStep(dataMax - dataMin, 4);
  const domainMax = Math.ceil(dataMax / step) * step || step;
  const domainMin = Math.floor(dataMin / step) * step;

  const y = (v: number) => plot.y + ((domainMax - v) / (domainMax - domainMin)) * plot.height;
  const baselineY = y(0);

  const ticks: { value: number; y: number }[] = [];
  for (let v = domainMin; v <= domainMax + step / 2; v += step) {
    const value = Math.round(v); // avoid float drift like 2.9999999e12
    ticks.push({ value, y: y(value) });
  }

  const n = Math.max(sorted.length, 1);
  const bandWidth = plot.width / n;
  const barWidth = Math.max(4, Math.min(BAR_MAX_WIDTH, (bandWidth * 0.64 - BAR_GAP) / 2));

  const bands: ChartBand[] = sorted.map((record, index) => {
    const bandX = plot.x + index * bandWidth;
    const centerX = bandX + bandWidth / 2;
    const make = (series: ChartBar["series"], offset: number): ChartBar => {
      const value = series === "revenue" ? record.revenue : record.netIncome;
      const x = centerX + offset;
      if (value === null) return { series, x, width: barWidth, y: null, height: 0, value, path: null };
      const valueY = y(value);
      return {
        series,
        x,
        width: barWidth,
        y: valueY,
        height: Math.abs(baselineY - valueY),
        value,
        path: columnPath(x, baselineY, barWidth, valueY),
      };
    };
    return {
      index,
      record,
      x: bandX,
      width: bandWidth,
      centerX,
      bars: [make("revenue", -barWidth - BAR_GAP / 2), make("netIncome", BAR_GAP / 2)],
    };
  });

  const breaks = sorted.flatMap((record, i): ChartGeometry["breaks"] => {
    if (i === 0) return [];
    const before = sorted[i - 1];
    const x = plot.x + i * bandWidth;
    // A standard change is named first: it is the more fundamental break.
    if (record.accountingStandard !== before.accountingStandard) return [{ x, before, after: record, reason: "standard" }];
    if ((record.revenueBasis ?? null) !== (before.revenueBasis ?? null)) return [{ x, before, after: record, reason: "basis" }];
    return [];
  });

  return { width, height, plot, baselineY, ticks, bands, breaks };
}
