"use client";

import { useEffect, useRef, useState } from "react";
import { computeChartGeometry } from "@/lib/charts/financial-chart-geometry";
import { formatYen, formatYenAxis } from "@/lib/utils/format";
import type { AccountingStandard, FinancialRecord } from "@/types/company";

const HEIGHT = 300;
const DEFAULT_WIDTH = 640;

const STANDARD_SHORT: Record<AccountingStandard, string> = {
  ifrs: "IFRS",
  jgaap: "日本基準",
  usgaap: "米国基準",
};

/**
 * Revenue and net income, one chart, one axis (see financial-chart-geometry.ts
 * for why not two).
 *
 * Client only for two things a server cannot know: the rendered width (so
 * axis text stays at its real size on a phone instead of being scaled down
 * with a viewBox) and hover/focus. Every value shown on hover is also in the
 * legend (latest year) and in the table view (all years), so nothing is
 * reachable only by pointing.
 */
export function FinancialChart({
  records,
  revenueLabel,
  netIncomeLabel,
}: {
  records: FinancialRecord[];
  revenueLabel: string;
  netIncomeLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const g = computeChartGeometry(records, width, HEIGHT);
  const activeBand = active === null ? null : g.bands[active];
  const compactLabels = g.bands.length > 0 && g.bands[0].width < 72;

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={g.width}
        height={g.height}
        role="img"
        aria-label={`${revenueLabel}と${netIncomeLabel}の推移。数値は下の表でも確認できます。`}
        className="block overflow-visible"
        onPointerLeave={() => setActive(null)}
      >
        {/* Grid: hairline, recessive, solid. */}
        {g.ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={g.plot.x}
              x2={g.plot.x + g.plot.width}
              y1={tick.y}
              y2={tick.y}
              stroke="var(--border)"
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
            <text
              x={g.plot.x - 10}
              y={tick.y}
              textAnchor="end"
              dominantBaseline="middle"
              className="figures fill-muted-foreground text-[11px]"
            >
              {formatYenAxis(tick.value)}
            </text>
          </g>
        ))}

        {/* Where the accounting standard changes, the series is not strictly comparable. Say so on the chart. */}
        {g.standardBreaks.map((br) => (
          <g key={br.x}>
            <line
              x1={br.x}
              x2={br.x}
              y1={g.plot.y}
              y2={g.plot.y + g.plot.height}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
            <text x={br.x + 6} y={g.plot.y + 10} className="fill-muted-foreground text-[11px]">
              {STANDARD_SHORT[br.after.accountingStandard]}へ変更
            </text>
          </g>
        ))}

        {g.bands.map((band) => (
          <g
            key={band.record.periodEnd}
            tabIndex={0}
            role="group"
            aria-label={`${band.record.fiscalYear}：${revenueLabel} ${
              band.record.revenue === null ? "確認できず" : formatYen(band.record.revenue)
            }、${netIncomeLabel} ${
              band.record.netIncome === null ? "確認できず" : formatYen(band.record.netIncome)
            }`}
            onPointerEnter={() => setActive(band.index)}
            onFocus={() => setActive(band.index)}
            onBlur={() => setActive(null)}
            className="outline-none focus-visible:[&>rect:first-child]:stroke-ink"
          >
            {/* The whole band is the hit target, not the 24px column. */}
            <rect
              x={band.x}
              y={g.plot.y}
              width={band.width}
              height={g.plot.height}
              fill={active === band.index ? "var(--muted)" : "transparent"}
              opacity={0.6}
              strokeWidth={1.5}
            />
            {band.bars.map((bar) =>
              bar.path ? (
                <path
                  key={bar.series}
                  d={bar.path}
                  fill={bar.series === "revenue" ? "var(--chart-revenue)" : "var(--chart-net-income)"}
                />
              ) : (
                <text
                  key={bar.series}
                  x={bar.x + bar.width / 2}
                  y={g.baselineY - 6}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  —
                </text>
              ),
            )}
            <text
              x={band.centerX}
              y={g.plot.y + g.plot.height + 22}
              textAnchor="middle"
              className="figures fill-muted-foreground text-[11px]"
            >
              {compactLabels ? band.record.fiscalYear.replace(/年.*$/, "") : band.record.fiscalYear}
            </text>
          </g>
        ))}

        {/* Baseline last, so it sits on top of the column bases. */}
        <line
          x1={g.plot.x}
          x2={g.plot.x + g.plot.width}
          y1={g.baselineY}
          y2={g.baselineY}
          stroke="var(--foreground)"
          strokeWidth={1}
          shapeRendering="crispEdges"
        />
      </svg>

      {activeBand && (
        <div
          role="presentation"
          className="pointer-events-none absolute top-0 z-10 w-max max-w-60 rounded-md border border-border bg-popover px-3 py-2.5 text-sm shadow-md"
          style={{
            left: Math.min(Math.max(activeBand.centerX - 90, 0), Math.max(g.width - 200, 0)),
          }}
        >
          <p className="text-xs text-muted-foreground">
            {activeBand.record.fiscalYear}（{STANDARD_SHORT[activeBand.record.accountingStandard]}）
          </p>
          {activeBand.bars.map((bar) => (
            <p key={bar.series} className="mt-1 flex items-center gap-2">
              <span
                aria-hidden
                className="h-0.5 w-3 shrink-0 rounded-full"
                style={{
                  background: bar.series === "revenue" ? "var(--chart-revenue)" : "var(--chart-net-income)",
                }}
              />
              <span className="figures font-semibold">
                {bar.value === null ? "確認できず" : formatYen(bar.value)}
              </span>
              <span className="text-xs text-muted-foreground">
                {bar.series === "revenue" ? activeBand.record.revenueLabel : "純利益"}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
