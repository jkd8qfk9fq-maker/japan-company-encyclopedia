import { RELATIONSHIP_LABEL } from "./related-companies";
import { segmentShares } from "@/lib/strategy";
import { formatYenAxis } from "@/lib/utils/format";
import type { Company, FinancialRecord, RelationshipKind } from "@/types/company";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

/**
 * The company's first-view dashboard (2026-11-23 redesign, after the operator's mockup): the five years as one small
 * chart, what the revenue is made of, and the first tie — the three things a reader asks after "how big".
 * Dense, not cluttered: each block is a summary that links to the section holding the detail and its sources.
 * Only printed figures and their direct arithmetic; a block with no data is not drawn (JCE-026).
 */

const byPeriod = (records: FinancialRecord[]) => [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));

/** Ties worth a first look, in this order: who owns it, who it sells to and buys from, then the rest. */
const TIE_ORDER: RelationshipKind[] = ["parent", "major-shareholder", "customer", "supplier", "business-partner", "subsidiary", "affiliate", "other-affiliated-company", "technology", "competitor", "same-industry", "same-business-model"];

function TrendChart({ records }: { records: FinancialRecord[] }) {
  const years = byPeriod(records)
    .filter((r) => r.revenue !== null)
    .slice(-5);
  if (years.length < 2) return null;
  const W = 320;
  const H = 128;
  const left = 4;
  const right = 4;
  const top = 18;
  const bottom = 20;
  const plotH = H - top - bottom;
  const maxRevenue = Math.max(...years.map((y) => y.revenue!), 1);
  const incomes = years.map((y) => y.netIncome).filter((v): v is number => v !== null);
  // Net income has its own scale, from zero (or its lowest loss) to its highest — the bars and the line are read
  // against their own labels, never against each other.
  const lo = Math.min(0, ...incomes);
  const hi = Math.max(0, ...incomes);
  const span = hi - lo || 1;
  const slot = (W - left - right) / years.length;
  const barW = Math.min(30, slot * 0.5);
  const x = (i: number) => left + slot * i + slot / 2;
  const yBar = (v: number) => top + plotH - (v / maxRevenue) * plotH;
  const yLine = (v: number) => top + plotH - ((v - lo) / span) * plotH;
  const points = years.map((y, i) => (y.netIncome === null ? null : `${x(i)},${yLine(y.netIncome)}`)).filter(Boolean);
  const last = years.at(-1)!;
  return (
    <figure className="m-0">
      <figcaption className="flex items-baseline justify-between gap-2 text-[0.6875rem] text-muted-foreground">
        <span className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden className="size-2 rounded-[2px] bg-(--chart-revenue)" />
            <L s={last.revenueLabel} />
          </span>
          <span className="inline-flex items-center gap-1">
            <span data-l="ja" lang="ja"><span aria-hidden className="size-2 rounded-full bg-(--chart-net-income)" />
            純利益（別の目盛り）
          </span><span data-l="en" lang="en"><span aria-hidden className="size-2 rounded-full bg-(--chart-net-income)" />Net income (separate scale)</span></span>
        </span>
        <span className="figures"><span data-l="ja" lang="ja">{years.length}期</span><span data-l="en" lang="en">Fiscal year {years.length}</span></span>
      </figcaption>
      {/* The first and latest revenue as text, not on the bars: a label inside a bar fails on a thin one. */}
      <p className="figures mt-1 text-xs">
        <span className="text-muted-foreground"><F s={years[0]!.fiscalYear} /></span> <F s={formatYenAxis(years[0]!.revenue!)} />
        <span className="mx-1 text-muted-foreground">→</span>
        <span className="text-muted-foreground"><F s={last.fiscalYear} /></span> <span className="font-semibold"><F s={formatYenAxis(last.revenue!)} /></span>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${years[0]!.fiscalYear}から${last.fiscalYear}までの${last.revenueLabel}と純利益`} className="mt-1 h-auto max-h-44 w-full">
        <line x1={left} x2={W - right} y1={top + plotH} y2={top + plotH} stroke="currentColor" strokeOpacity={0.25} />
        {years.map((y, i) => (
          <g key={y.periodEnd}>
            <rect x={x(i) - barW / 2} y={yBar(y.revenue!)} width={barW} height={top + plotH - yBar(y.revenue!)} rx={2} fill="var(--chart-revenue)" />
            <text x={x(i)} y={H - 6} textAnchor="middle" className="figures fill-muted-foreground text-[9px]">
              {y.fiscalYear.replace(/年(\d+)月期/, "/$1")}
            </text>
          </g>
        ))}
        {points.length > 1 && <polyline points={points.join(" ")} fill="none" stroke="var(--chart-net-income)" strokeWidth={2} />}
        {years.map((y, i) =>
          y.netIncome === null ? null : (
            <circle key={y.periodEnd} cx={x(i)} cy={yLine(y.netIncome)} r={3} fill="var(--background)" stroke="var(--chart-net-income)" strokeWidth={2} />
          ),
        )}
      </svg>
    </figure>
  );
}

function Composition({ company }: { company: Company }) {
  const shares = segmentShares(company);
  if (!shares) return null;
  const top = shares.items.slice(0, 4);
  const rest = shares.items.slice(4).reduce((sum, i) => sum + i.percent, 0);
  const items = rest > 0 ? [...top.map((i) => ({ name: i.name, percent: i.percent })), { name: "そのほか", percent: Math.round(rest * 10) / 10 }] : top;
  // Donut as stroke segments on one circle: circumference 100, so each segment's length is its percent; each starts
  // where the previous ones end (offset 25 puts the first at twelve o'clock).
  const offsets = items.map((_, i) => 25 - items.slice(0, i).reduce((sum, it) => sum + it.percent, 0));
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 42 42" aria-hidden className="size-[4.5rem] shrink-0">
        <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--muted)" strokeWidth="6" />
        {items.map((item, i) => (
            <circle
              key={item.name}
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              stroke={`var(--segment-${(i % 6) + 1})`}
              strokeWidth="6"
              strokeDasharray={`${item.percent} ${100 - item.percent}`}
              strokeDashoffset={offsets[i]}
            />
        ))}
      </svg>
      <ul className="min-w-0 flex-1 space-y-0.5 text-xs">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: `var(--segment-${(i % 6) + 1})` }} />
            <span className="min-w-0 flex-1 truncate"><L s={item.name} /></span>
            <span className="figures shrink-0 tabular-nums">{item.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CompanySnapshot({ company, related }: { company: Company; related: { id: string; name: string }[] }) {
  const names = new Map(related.map((r) => [r.id, r.name]));
  const ties = [...company.relatedCompanies]
    .filter((r) => names.has(r.companyId))
    .sort((a, b) => TIE_ORDER.indexOf(a.relationship) - TIE_ORDER.indexOf(b.relationship));
  const shares = segmentShares(company);
  const hasChart = company.financials.filter((r) => r.revenue !== null).length >= 2;
  if (!hasChart && !shares && ties.length === 0) return null;

  return (
    <div className="mt-3 grid gap-2.5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {hasChart && (
        <a href="#financials" className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/40">
          <p className="seal-mark text-[0.8125rem] font-semibold"><T m={{ ja: "業績の推移（連結）", en: "Performance trends (consolidated)" }} /></p>
          <div className="mt-1.5">
            <TrendChart records={company.financials} />
          </div>
        </a>
      )}
      {(shares || ties.length > 0) && (
        <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1">
          {shares && (
            <a href="#business" className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/40">
              <p className="seal-mark text-[0.8125rem] font-semibold"><T m={{ ja: "事業の構成", en: "Business breakdown" }} /></p>
              <p className="mt-0.5 mb-1.5 text-[0.625rem] text-muted-foreground">
                <span data-l="ja" lang="ja"><L s={shares.label} />・<F s={shares.fiscalYear} />（計算値）
              </span><span data-l="en" lang="en"><L s={shares.label} /> · <F s={shares.fiscalYear} /> (computed)</span></p>
              <Composition company={company} />
            </a>
          )}
          {ties.length > 0 && (
            <a href="#connections" className="flex flex-col rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/40">
              <p className="seal-mark text-[0.8125rem] font-semibold"><T m={{ ja: "関連企業", en: "Related companies" }} /></p>
              <ul className="mt-1.5 space-y-1 text-xs">
                {ties.slice(0, 3).map((t) => (
                  <li key={`${t.companyId}-${t.relationship}`} className="min-w-0">
                    <span className="block truncate font-semibold">{names.get(t.companyId)}</span>
                    <span className="text-[0.625rem] text-muted-foreground">{RELATIONSHIP_LABEL[t.relationship]}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-auto pt-1.5 text-[0.6875rem] text-ink"><span data-l="ja" lang="ja">全{ties.length}件を見る →</span><span data-l="en" lang="en">See all {ties.length} →</span></span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
