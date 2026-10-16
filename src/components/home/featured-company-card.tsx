import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { computeChartGeometry } from "@/lib/charts/financial-chart-geometry";
import { chartRecords, latestRecord } from "@/lib/home";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { formatYen, formatYenAxis } from "@/lib/utils/format";
import type { Company } from "@/types/company";

const WIDTH = 440;
const HEIGHT = 200;

/**
 * A front-page card: what the company is, its latest revenue and net income, and the same chart the
 * company page draws (shared axis from zero — see financial-chart-geometry.ts), five years, static.
 * Revenue and net income are the only financials the site shows; no ratio, no ranking, no change.
 *
 * A Server Component: the chart here has no hover and is a fixed size scaled by the viewBox, so
 * nothing about it needs the browser. Every number it draws is also written in the card as text.
 */
export function FeaturedCompanyCard({ company }: { company: Company }) {
  const latest = latestRecord(company);
  const records = chartRecords(company);
  const g = computeChartGeometry(records, WIDTH, HEIGHT);
  const primary = company.industries.find((i) => i.primary) ?? company.industries[0];
  const label = records
    .map((r) => `${r.fiscalYear}：売上 ${formatYen(r.revenue ?? 0)}、純利益 ${formatYen(r.netIncome ?? 0)}`)
    .join("。");

  return (
    <article className="group relative grid grid-cols-[minmax(0,1fr)] gap-6 border border-border bg-card p-6 transition-colors hover:border-foreground md:grid-cols-[minmax(16rem,0.85fr)_minmax(0,1.15fr)] md:p-7">
      <div className="flex min-w-0 flex-col">
        <h3 className="font-serif text-[1.375rem] leading-snug font-semibold">
          <Link
            href={`/companies/${company.id}`}
            className="outline-offset-4 after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4"
          >
            {company.name}
          </Link>
        </h3>
        <p className="figures mt-1 text-sm text-muted-foreground">
          {company.code}
          {primary && <span aria-hidden> ｜ </span>}
          {primary && INDUSTRY_LABELS[primary.industryId].name}
        </p>
        <p className="mt-4 line-clamp-3 text-[0.9375rem] leading-7">{company.description}</p>
        {latest && latest.revenue !== null && latest.netIncome !== null && (
          <div className="mt-auto pt-6">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-muted-foreground">売上高</dt>
                <dd className="figures mt-1 font-serif text-[1.125rem] font-semibold whitespace-nowrap">{formatYen(latest.revenue)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">純利益</dt>
                <dd className="figures mt-1 font-serif text-[1.125rem] font-semibold whitespace-nowrap">{formatYen(latest.netIncome)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted-foreground">{latest.fiscalYear}</p>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-muted-foreground">業績推移</p>
          <ul className="flex items-center gap-4 text-xs text-muted-foreground" aria-hidden>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px]" style={{ background: "var(--chart-revenue)" }} />
              売上高
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px]" style={{ background: "var(--chart-net-income)" }} />
              純利益
            </li>
          </ul>
        </div>
        <svg viewBox={`0 0 ${g.width} ${g.height}`} role="img" aria-label={label} className="mt-2 block h-auto w-full">
          {g.ticks.map((tick) => (
            <g key={tick.value}>
              <line x1={g.plot.x} x2={g.plot.x + g.plot.width} y1={tick.y} y2={tick.y} stroke="var(--border)" strokeWidth={1} shapeRendering="crispEdges" />
              <text x={g.plot.x - 8} y={tick.y} textAnchor="end" dominantBaseline="middle" className="figures fill-muted-foreground text-[11px]">
                {formatYenAxis(tick.value)}
              </text>
            </g>
          ))}
          {g.bands.map((band) => (
            <g key={band.record.periodEnd}>
              {band.bars.map((bar) =>
                bar.path ? (
                  <path key={bar.series} d={bar.path} fill={bar.series === "revenue" ? "var(--chart-revenue)" : "var(--chart-net-income)"} />
                ) : null,
              )}
              <text x={band.centerX} y={g.plot.y + g.plot.height + 22} textAnchor="middle" className="figures fill-muted-foreground text-[11px]">
                {band.record.periodEnd.slice(0, 4)}
              </text>
            </g>
          ))}
          <line x1={g.plot.x} x2={g.plot.x + g.plot.width} y1={g.baselineY} y2={g.baselineY} stroke="var(--foreground)" strokeWidth={1} shapeRendering="crispEdges" />
        </svg>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
          この企業を読む
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </p>
      </div>
    </article>
  );
}
