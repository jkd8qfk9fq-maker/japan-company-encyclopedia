import { profitLineKind } from "@/lib/report-metrics";
import { formatYen } from "@/lib/utils/format";
import type { FinancialRecord } from "@/types/company";
import { L } from "@/components/i18n/label";

/**
 * The premium report's charts (JCE-114): server-rendered SVG, so they print and save to PDF exactly as shown and
 * need no script. Each draws figures the report already prints in its tables — the bars are the five-year summary
 * as printed, the line and the shares are 計算値 from those same figures — and none carries a figure of its own.
 * Colours separate series, never good from bad: nothing here is green for up or red for down.
 */

const DIGITS = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 });

/** One unit for a whole axis: 兆円 from 10兆円 up (below it 兆 steps are too coarse to read), else 億円, else 百万円. */
function axisUnit(max: number) {
  if (max >= 1e13) return { divisor: 1e12, name: "兆円" };
  if (max >= 1e9) return { divisor: 1e8, name: "億円" };
  return { divisor: 1e6, name: "百万円" };
}

/** A round step for about four gridlines. */
function niceStep(max: number) {
  const raw = max / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw)!;
}

/**
 * 業績の推移: revenue and the printed profit line as paired columns on one axis, and the profit line's share of
 * revenue (計算値) as a line on its own axis. A year without a figure draws no column; the line is drawn only
 * where the profit line is one the margin can be read from (経常利益・税引前利益・営業利益), as in the computed layer.
 */
export function TrendChart({ records }: { records: FinancialRecord[] }) {
  const rows = records.filter((r) => r.revenue !== null);
  if (rows.length < 2) return null;
  const latest = rows.at(-1)!;
  const profitLabel = latest.profitLabel;
  const values = rows.flatMap((r) => [r.revenue ?? 0, r.profit ?? 0]);
  const unit = axisUnit(Math.max(...values));
  const top = Math.max(...values.map((v) => v / unit.divisor));
  const bottom = Math.min(0, ...values.map((v) => v / unit.divisor));
  const step = niceStep(top - bottom);
  const yMax = Math.ceil(top / step) * step;
  const yMin = Math.floor(bottom / step) * step;

  const margins = rows.map((r) =>
    profitLineKind(r.profitLabel) && r.profit !== null && r.revenue !== null && r.revenue > 0 ? r.profit / r.revenue : null,
  );
  const shown = margins.filter((m): m is number => m !== null);
  const mMax = shown.length ? Math.max(0.01, ...shown) : 0;
  const mMin = shown.length ? Math.min(0, ...shown) : 0;
  const mStep = shown.length ? niceStep(mMax - mMin) : 1;
  const mTop = Math.ceil(mMax / mStep) * mStep;
  const mBottom = Math.floor(mMin / mStep) * mStep;

  const caption = (
    <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--ink)]" /><L s={latest.revenueLabel} /></span>
        {profitLabel && <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--chart-revenue)]" /><L s={profitLabel} /></span>}
        {shown.length > 0 && (
          <span className="inline-flex items-center gap-1.5"><span data-l="ja"><span className="h-0.5 w-4 bg-seal" />{profitLabel}÷{latest.revenueLabel}（計算値・右目盛）</span><span data-l="en"><span className="h-0.5 w-4 bg-seal" />{profitLabel} ÷ {latest.revenueLabel} (computed, right axis)</span></span>
        )}
        <span className="ml-auto"><span data-l="ja">単位：<L s={unit.name} /></span><span data-l="en">Unit: <L s={unit.name} /></span></span>
      </figcaption>
  );

  // Drawn twice: a wide chart for tablets and up, a narrow one for phones, so the labels keep a readable size
  // instead of shrinking with the whole drawing (the same approach as the company page's FinancialBars).
  const draw = (W: number, H: number, compact: boolean) => {
  const P = { left: 46, right: shown.length ? 48 : 12, top: 18, bottom: 34 };
  const plotW = W - P.left - P.right;
  const plotH = H - P.top - P.bottom;
  const y = (v: number) => P.top + plotH * (1 - (v - yMin) / (yMax - yMin));
  const ym = (v: number) => P.top + plotH * (1 - (v - mBottom) / (mTop - mBottom || 1));
  const slot = plotW / rows.length;
  const barW = Math.min(34, slot * 0.3);
  const cx = (i: number) => P.left + slot * (i + 0.5);
  const ticks: number[] = [];
  for (let v = yMin; v <= yMax + 1e-9; v += step) ticks.push(Number(v.toFixed(6)));
  const mTicks: number[] = [];
  if (shown.length) for (let v = mBottom; v <= mTop + 1e-9; v += mStep) mTicks.push(Number(v.toFixed(6)));
  const linePoints = margins.map((m, i) => (m === null ? null : `${cx(i)},${ym(m)}`));

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${latest.revenueLabel}と${profitLabel ?? "利益"}の${rows.length}期の推移`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.left} x2={W - P.right} y1={y(t)} y2={y(t)} className="stroke-border" strokeWidth={t === 0 ? 1.2 : 0.6} />
            <text x={P.left - 6} y={y(t) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">{DIGITS.format(t)}</text>
          </g>
        ))}
        {mTicks.map((t) => (
          <text key={t} x={W - P.right + 6} y={ym(t) + 4} className="fill-muted-foreground text-[11px]">{(t * 100).toFixed(Math.abs(mStep) < 0.01 ? 1 : 0)}%</text>
        ))}
        {rows.map((r, i) => {
          const rev = r.revenue! / unit.divisor;
          const pro = r.profit === null ? null : r.profit / unit.divisor;
          return (
            <g key={r.periodEnd}>
              <rect x={cx(i) - barW - 2} width={barW} y={Math.min(y(rev), y(0))} height={Math.abs(y(0) - y(rev))} rx={2} className="fill-[var(--ink)]">
                <title>{`${r.fiscalYear} ${r.revenueLabel} ${formatYen(r.revenue!)}`}</title>
              </rect>
              {pro !== null && (
                <rect x={cx(i) + 2} width={barW} y={Math.min(y(pro), y(0))} height={Math.max(1, Math.abs(y(0) - y(pro)))} rx={2} className="fill-[var(--chart-revenue)]">
                  <title>{`${r.fiscalYear} ${r.profitLabel} ${formatYen(r.profit!)}`}</title>
                </rect>
              )}
              <text x={cx(i)} y={H - 12} textAnchor="middle" className="fill-muted-foreground text-[11px]">{compact ? r.periodEnd.slice(0, 4) : r.fiscalYear}</text>
            </g>
          );
        })}
        {linePoints.some(Boolean) && (
          <>
            <polyline points={linePoints.filter(Boolean).join(" ")} fill="none" className="stroke-seal" strokeWidth={2} />
            {margins.map((m, i) =>
              m === null ? null : (
                <g key={i}>
                  <circle cx={cx(i)} cy={ym(m)} r={4} className="fill-background stroke-seal" strokeWidth={2} />
                  <text x={cx(i)} y={ym(m) - 9} textAnchor="middle" className="fill-foreground text-[10.5px] font-semibold">{(m * 100).toFixed(1)}%</text>
                </g>
              ),
            )}
          </>
        )}
      </svg>
    );
  };

  return (
    <figure>
      {caption}
      <div className="mt-2 hidden sm:block">{draw(640, 300, false)}</div>
      <div className="mt-2 sm:hidden">{draw(340, 260, true)}</div>
    </figure>
  );
}

const SHADES = ["var(--ink)", "var(--chart-revenue)", "oklch(0.72 0.07 250)", "oklch(0.83 0.04 250)", "oklch(0.62 0.03 250)", "oklch(0.9 0.02 250)"];

/** A part's share as a ring: the largest part is named in the centre, the legend lists every part with its share. */
export function Donut({ title, parts, unitLabel }: { title: string; parts: { name: string; amount: number }[]; unitLabel: string }) {
  const positive = parts.filter((p) => p.amount > 0).sort((a, b) => b.amount - a.amount);
  const total = positive.reduce((n, p) => n + p.amount, 0);
  if (positive.length < 2 || total <= 0) return null;
  // Past six parts the ring stops being readable; the rest are folded into one slice, named as such.
  const head = positive.slice(0, 5);
  const restAmount = positive.slice(5).reduce((n, p) => n + p.amount, 0);
  const slices = restAmount > 0 ? [...head, { name: `その他の${positive.length - 5}区分`, amount: restAmount }] : head;
  const R = 70;
  const C = 2 * Math.PI * R;
  // Where each slice starts along the ring, precomputed so the render itself assigns nothing.
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((n, p) => n + (p.amount / total) * C, 0));
  return (
    <figure className="flex flex-col items-center gap-5 sm:flex-row md:flex-col xl:flex-row">
      <svg viewBox="0 0 180 180" className="size-40 shrink-0" role="img" aria-label={`${title}の構成`}>
        <g transform="rotate(-90 90 90)">
          {slices.map((s, i) => {
            const len = (s.amount / total) * C;
            const el = (
              <circle key={s.name} cx={90} cy={90} r={R} fill="none" stroke={SHADES[i % SHADES.length]} strokeWidth={26} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-starts[i]!}>
                <title>{`${s.name} ${((s.amount / total) * 100).toFixed(1)}%`}</title>
              </circle>
            );
            return el;
          })}
        </g>
        <text x={90} y={88} textAnchor="middle" className="fill-foreground text-[22px] font-semibold">{((slices[0]!.amount / total) * 100).toFixed(1)}%</text>
        <text x={90} y={108} textAnchor="middle" className="fill-muted-foreground text-[10px]">{slices[0]!.name.length > 9 ? `${slices[0]!.name.slice(0, 8)}…` : slices[0]!.name}</text>
      </svg>
      <figcaption className="w-full min-w-0">
        <p className="text-xs text-muted-foreground"><span data-l="ja"><L s={unitLabel} />に占める割合（計算値）</span><span data-l="en">Share of <L s={unitLabel} /> (computed)</span></p>
        <ul className="mt-2 space-y-2">
          {slices.map((s, i) => (
            <li key={s.name} className="flex items-baseline gap-2 text-sm">
              <span className="mt-1 size-2.5 shrink-0 rounded-full" style={{ background: SHADES[i % SHADES.length] }} />
              <span className="min-w-0 flex-1"><L s={s.name} /></span>
              <span className="figures font-semibold">{((s.amount / total) * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

/**
 * Where the company's value sits in its industry: the band is the middle half of the industry (第1〜第3四分位), the
 * tick its median, the dot this company. The track spans just the values drawn, so it shows order, not a scale to
 * read figures off — the numbers stand beside it.
 */
export function PositionBar({ value, median, q1, q3 }: { value: number; median: number; q1: number; q3: number }) {
  const lo = Math.min(value, q1, median);
  const hi = Math.max(value, q3, median);
  const pad = (hi - lo) * 0.12 || Math.abs(hi) * 0.1 || 1;
  const at = (v: number) => `${((v - (lo - pad)) / (hi - lo + 2 * pad)) * 100}%`;
  return (
    <div className="relative h-5" aria-hidden>
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
      <div className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-[var(--chart-revenue)]/35" style={{ left: at(q1), width: `calc(${at(q3)} - ${at(q1)})` }} />
      <div className="absolute top-0 h-5 w-0.5 bg-muted-foreground" style={{ left: at(median) }} />
      <div className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-[var(--ink)] shadow" style={{ left: at(value) }} />
    </div>
  );
}

/**
 * The five perspectives as a radar (JCE-118): each axis is one named indicator's percentile within the industry
 * (perspective-radar.ts). Rings at 25 / 50 / 75 mark the industry's quartiles, the dashed 50 ring its median. The
 * points are joined only to give the shape; the area is not a figure and nothing is summed. An axis without a
 * distribution keeps its label, says 分布なし and has no point.
 */
export function PerspectiveRadar({ axes }: { axes: { perspectiveTitle: string; indicator: string; percentile: number | null }[] }) {
  // Wide enough that the side labels (外部環境との接続) fit beside the ring rather than off the drawing.
  const W = 460;
  const H = 360;
  const cx = W / 2;
  const cy = 188;
  const R = 122;
  const n = axes.length;
  const angle = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const at = (i: number, p: number) => [cx + Math.cos(angle(i)) * R * (p / 100), cy + Math.sin(angle(i)) * R * (p / 100)] as const;
  const ring = (p: number) => axes.map((_, i) => at(i, p).join(",")).join(" ");
  const shown = axes.map((a, i) => (a.percentile === null ? null : at(i, a.percentile)));
  const polygon = shown.filter((pt): pt is readonly [number, number] => pt !== null).map((pt) => pt.join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[34rem]" role="img" aria-label={`5観点の業界内の位置：${axes.map((a) => `${a.perspectiveTitle}（${a.indicator}）${a.percentile ?? "分布なし"}`).join("、")}`}>
      {[25, 75, 100].map((p) => (
        <polygon key={p} points={ring(p)} fill="none" className="stroke-border" strokeWidth={p === 100 ? 1.2 : 0.8} />
      ))}
      <polygon points={ring(50)} fill="none" className="stroke-muted-foreground" strokeWidth={1.2} strokeDasharray="4 3" />
      {axes.map((_, i) => {
        const [x, y] = at(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="stroke-border" strokeWidth={0.8} />;
      })}
      {polygon && <polygon points={polygon} className="fill-[var(--chart-revenue)] stroke-[var(--ink)]" fillOpacity={0.3} strokeWidth={2} strokeLinejoin="round" />}
      {shown.map((pt, i) =>
        pt === null ? null : (
          <circle key={i} cx={pt[0]} cy={pt[1]} r={4.5} className="fill-[var(--ink)] stroke-background" strokeWidth={1.5} />
        ),
      )}
      {axes.map((a, i) => {
        const [x, y] = at(i, 100);
        const dx = Math.cos(angle(i));
        const anchor = Math.abs(dx) < 0.2 ? "middle" : dx > 0 ? "start" : "end";
        const lx = x + dx * 10;
        const ly = y + Math.sin(angle(i)) * 14 + (Math.sin(angle(i)) < -0.5 ? -16 : 0);
        return (
          <text key={a.perspectiveTitle} x={lx} y={ly} textAnchor={anchor} className="text-[13px]">
            <tspan className="fill-foreground font-semibold">{a.perspectiveTitle}</tspan>
            <tspan x={lx} dy={16} className="fill-muted-foreground text-[11.5px]">
              {a.percentile === null ? "分布なし" : `${a.indicator.length > 8 ? `${a.indicator.slice(0, 7)}…` : a.indicator} ${a.percentile}`}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
