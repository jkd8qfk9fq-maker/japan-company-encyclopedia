import Link from "next/link";
import type { IndexSeries, IndustryFigures } from "@/lib/industry-figures";
import { formatYen } from "@/lib/utils/format";

/**
 * The chart forms of the figures tab (JCE-042), after the look of the operator's economic data book: a row of
 * "latest" cards with a ▲▼ against a reference, a donut for one whole split into a few parts, small line charts
 * side by side for the five-year index, and a performance table. All server-rendered SVG — no script, no chart
 * library — in the site's own ink: one hue stepped light to dark for parts of a whole, the foreground for the
 * line, and the surface colour as the 2px gap that separates touching marks. Text never takes a data colour.
 */

const percent = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;

/** The parts of a whole, largest first, the tail past `max` folded into その他. */
export function partsOf<T extends { id: string; name: string; value: number }>(items: T[], max = 6): { id: string; name: string; value: number; share: number }[] {
  // An item passed in as "other" (the rest of a whole) always comes last, however large it is.
  const named = [...items].filter((i) => i.value > 0 && i.id !== "other").sort((a, b) => b.value - a.value);
  const rest = items.filter((i) => i.value > 0 && i.id === "other");
  const total = named.reduce((acc, i) => acc + i.value, 0) + rest.reduce((acc, i) => acc + i.value, 0);
  if (total <= 0) return [];
  const head = named.slice(0, max);
  const tail = named.slice(max).reduce((acc, i) => acc + i.value, 0) + rest.reduce((acc, i) => acc + i.value, 0);
  const otherName = rest.length === 1 && named.length <= max ? rest[0].name : "その他";
  const parts = tail > 0 ? [...head, { id: "other", name: otherName, value: tail }] : head;
  return parts.map((p) => ({ id: p.id, name: p.name, value: p.value, share: p.value / total }));
}

/** Six steps of the site's ink, light to dark, so the largest part is the darkest; その他 is the lightest. */
const STEPS = ["oklch(0.22 0 0)", "oklch(0.36 0 0)", "oklch(0.5 0 0)", "oklch(0.62 0 0)", "oklch(0.74 0 0)", "oklch(0.84 0 0)", "oklch(0.91 0 0)"];
const inkOf = (i: number, n: number, id: string) => (id === "other" ? STEPS[STEPS.length - 1] : STEPS[Math.min(i, STEPS.length - 2)] ?? STEPS[n]);

/**
 * A donut: one whole split into at most seven parts, the share printed on each part that has room, the names and
 * values in a list beside it (the list is the legend, and it reads with styles off). Drawn as stroked arcs with a
 * 2px gap of surface between them.
 */
export function Donut({
  parts,
  title,
  format,
  centre,
  hrefOf,
}: {
  parts: ReturnType<typeof partsOf>;
  title: string;
  format: (value: number) => string;
  centre: { value: string; label: string };
  /** Where a part leads: an industry's figures on the hub, a company's page on an industry page. その他 leads nowhere,
   * and so does every part when this is left out (a company's own businesses and regions). */
  hrefOf?: (id: string) => string | null;
}) {
  const R = 64;
  const W = 28;
  // Each part is a filled ring sector, not a dashed stroke: browsers hit-test a dashed stroke as if it
  // were solid, so with dashes the last circle drawn caught every tap and no part could be opened.
  const starts = parts.map((_, i) => parts.slice(0, i).reduce((acc, q) => acc + q.share, 0));
  const arcs = parts.map((p, i) => ({ ...p, ink: inkOf(i, parts.length, p.id), path: sector(starts[i], starts[i] + p.share, R, W), mid: starts[i] + p.share / 2, href: p.id === "other" || !hrefOf ? null : hrefOf(p.id) }));
  const label = `${title}。${parts.map((p) => `${p.name} ${percent(p.share)}`).join("、")}`;
  return (
    <figure className="m-0 grid items-center gap-6 sm:grid-cols-[11rem_1fr]">
      <svg viewBox="0 0 180 180" role="img" aria-label={label} className="mx-auto h-auto w-44">
        <g transform="translate(90 90)">
          {arcs.map((a) =>
            a.href === null ? (
              <path key={a.id} d={a.path} fill={a.ink} />
            ) : (
              // Each part can be tapped, not only its name in the list beside the ring.
              <a key={a.id} href={a.href} aria-label={`${a.name} ${percent(a.share)}`}>
                <path d={a.path} fill={a.ink} className="cursor-pointer transition-opacity hover:opacity-80" />
              </a>
            ),
          )}
        </g>
        {arcs
          .filter((a) => a.share >= 0.07)
          .map((a) => {
            const angle = a.mid * 2 * Math.PI - Math.PI / 2;
            const x = 90 + Math.cos(angle) * R;
            const y = 90 + Math.sin(angle) * R;
            const dark = STEPS.indexOf(a.ink) < 3;
            return (
              <text key={a.id} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fill={dark ? "#fff" : "#111"} className="figures" pointerEvents="none">
                {percent(a.share, 0)}
              </text>
            );
          })}
        <text x={90} y={86} textAnchor="middle" fontSize={15} fontWeight={600} fill="currentColor" className="figures">
          {centre.value}
        </text>
        <text x={90} y={102} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.6}>
          {centre.label}
        </text>
      </svg>
      <figcaption>
        <p className="text-sm font-medium">{title}</p>
        <ol className="m-0 mt-2 list-none p-0 text-sm">
          {arcs.map((a) => (
            <li key={a.id} className="grid grid-cols-[0.75rem_1fr_auto_3.5em] items-center gap-2 py-0.5">
              <span className="inline-block size-3 rounded-sm" style={{ background: a.ink }} aria-hidden />
              <span className="truncate">{a.href === null ? a.name : <Link href={a.href} className="hover:underline">{a.name}</Link>}</span>
              <span className="figures text-muted-foreground">{format(a.value)}</span>
              <span className="figures text-right text-muted-foreground">{percent(a.share)}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

/** A small line chart of a five-point index, drawn for small multiples: the industry in ink, the reference in grey. */
export function IndexSparkline({ series, reference, width = 220, height = 96 }: { series: IndexSeries; reference?: IndexSeries; width?: number; height?: number }) {
  const all = [...series.values, ...(reference?.values ?? [])];
  if (series.values.length < 2) return null;
  const lo = Math.min(100, ...all) - 2;
  const hi = Math.max(100, ...all) + 2;
  const pad = { l: 8, r: 40, t: 10, b: 18 };
  const x = (i: number, n: number) => pad.l + (i / (n - 1)) * (width - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (height - pad.t - pad.b);
  const path = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i, vals.length).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const last = series.values.at(-1)!;
  const label = `${series.name}の売上高の指数。${series.labels.map((l, i) => `${l}年 ${series.values[i].toFixed(0)}`).join("、")}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="h-auto w-full">
      <line x1={pad.l} x2={width - pad.r} y1={y(100)} y2={y(100)} stroke="currentColor" strokeOpacity={0.18} strokeWidth={1} />
      {reference && reference.values.length === series.values.length && (
        <path d={path(reference.values)} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      )}
      <path d={path(series.values)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(series.values.length - 1, series.values.length)} cy={y(last)} r={4} fill="currentColor" stroke="var(--background)" strokeWidth={2} />
      <text x={x(series.values.length - 1, series.values.length) + 8} y={y(last)} dominantBaseline="central" fontSize={11} fontWeight={600} fill="currentColor" className="figures">
        {last.toFixed(0)}
      </text>
      <text x={pad.l} y={height - 4} fontSize={9} fill="currentColor" opacity={0.6} className="figures">
        {series.labels[0]}
      </text>
      <text x={width - pad.r} y={height - 4} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.6} className="figures">
        {series.labels.at(-1)}
      </text>
    </svg>
  );
}

/** A "latest" card after the data book: the figure, then ▲▼ against a reference, then a line of context. */
export function FigureCard({ label, value, delta, context }: { label: string; value: string; delta?: { text: string; up: boolean | null } | null; context?: string }) {
  return (
    <div className="border-t border-foreground py-3 pr-3 sm:py-4">
      <p className="text-[0.625rem] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{label}</p>
      <p className="figures mt-1 font-serif text-[1.375rem] leading-tight font-semibold sm:text-[1.75rem]">{value}</p>
      {delta && (
        <p className="figures mt-1 text-xs" style={delta.up === null ? undefined : { color: delta.up ? "oklch(0.45 0.12 150)" : "oklch(0.5 0.17 25)" }}>
          {delta.up === null ? "" : delta.up ? "▲ " : "▼ "}
          {delta.text}
        </p>
      )}
      {context && <p className="figures mt-0.5 text-xs text-muted-foreground">{context}</p>}
    </div>
  );
}

/** ▲ above / ▼ below a reference value, printed as the data book prints a surprise: never a judgement of good or bad. */
export function deltaAgainst(value: number, reference: number, format: (v: number) => string, referenceName: string): { text: string; up: boolean | null } {
  const diff = value - reference;
  if (Math.abs(diff) < 1e-9) return { text: `${referenceName}と同じ`, up: null };
  return { text: `${format(Math.abs(diff))}（vs. ${referenceName} ${format(reference)}）`, up: diff > 0 };
}

/** The performance table after the data book's 国別パフォーマンス: each industry against the all-industry reference. */
export function PerformanceTable({ industries, reference }: { industries: IndustryFigures[]; reference: { netProfitMargin: number | null; revenueGrowth5y: number | null } }) {
  const mark = (value: number | null | undefined, ref: number | null) => {
    if (value == null || ref == null) return { text: "—", up: null as boolean | null };
    const diff = value - ref;
    return { text: Math.abs(diff) < 1e-9 ? "＝" : diff > 0 ? "▲" : "▼", up: Math.abs(diff) < 1e-9 ? null : diff > 0 };
  };
  const tone = (up: boolean | null) => (up === null ? undefined : { color: up ? "oklch(0.45 0.12 150)" : "oklch(0.5 0.17 25)" });
  return (
    <div className="overflow-x-auto">
      <table className="figures w-full min-w-[36rem] text-sm">
        <thead>
          <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
            <th className="py-2 pr-3 font-medium">業界</th>
            <th className="py-2 pr-3 text-right font-medium">企業</th>
            <th className="py-2 pr-3 text-right font-medium">売上高</th>
            <th className="py-2 pr-3 text-right font-medium">純利益率</th>
            <th className="py-2 pr-1 text-right font-medium">vs 全体</th>
            <th className="py-2 pr-3 text-right font-medium">5期の伸び</th>
            <th className="py-2 pr-1 text-right font-medium">vs 全体</th>
            <th className="py-2 text-right font-medium">上位3社</th>
          </tr>
        </thead>
        <tbody>
          {industries.map((i) => {
            const m = mark(i.netProfitMargin?.value, reference.netProfitMargin);
            const g = mark(i.revenueGrowth5y?.value, reference.revenueGrowth5y);
            return (
              <tr key={i.id} className="border-b border-border">
                <td className="py-2 pr-3">
                  <Link href={`/industries/${i.id}#figures`} className="hover:underline">
                    {i.name}
                  </Link>
                </td>
                <td className="py-2 pr-3 text-right">{i.companies}</td>
                <td className="py-2 pr-3 text-right">{formatYen(i.revenue.total)}</td>
                <td className="py-2 pr-3 text-right">{i.netProfitMargin ? percent(i.netProfitMargin.value) : "—"}</td>
                <td className="py-2 pr-1 text-right" style={tone(m.up)}>{m.text}</td>
                <td className="py-2 pr-3 text-right">{i.revenueGrowth5y ? `${i.revenueGrowth5y.value.toFixed(2)}倍` : "—"}</td>
                <td className="py-2 pr-1 text-right" style={tone(g.up)}>{g.text}</td>
                <td className="py-2 text-right">{i.top3Share ? percent(i.top3Share.value) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted-foreground">▲＝全業界の値を上回る　▼＝下回る（良し悪しの判定ではありません）。全業界の純利益率は全社の純利益の合計 ÷ 売上高の合計、5期の伸びは全社の中央値。</p>
    </div>
  );
}

/**
 * The ring sector from share `from` to share `to` (0 = twelve o'clock, clockwise), centred on the origin,
 * with a 2px gap of surface at its end like the ring had before.
 */
function sector(from: number, to: number, r: number, width: number): string {
  const outer = r + width / 2;
  const inner = r - width / 2;
  const gap = (to - from) * 2 * Math.PI * r > 2 ? 2 / r : 0;
  const a0 = from * 2 * Math.PI;
  // A single part covering the whole ring would be a zero-length arc; stop just short of a full turn.
  const a1 = Math.max(a0, Math.min(to * 2 * Math.PI - gap, a0 + 2 * Math.PI - 1e-4));
  const at = (radius: number, angle: number) => `${(Math.sin(angle) * radius).toFixed(2)} ${(-Math.cos(angle) * radius).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${at(outer, a0)}A${outer} ${outer} 0 ${large} 1 ${at(outer, a1)}L${at(inner, a1)}A${inner} ${inner} 0 ${large} 0 ${at(inner, a0)}Z`;
}

/**
 * Several five-point indexes on one axis (JCE-047): each line labelled at its right end with its name and latest
 * value, told apart by weight and dash rather than colour, so it reads in print and for colour-blind readers.
 * Every series is 100 at its oldest year; lines whose rosters differ say so in the caption, not here.
 */
export function MultiIndexChart({ lines, width = 560, height = 220 }: { lines: { series: IndexSeries; name: string; style: "strong" | "medium" | "dashed" | "faint" }[]; width?: number; height?: number }) {
  const drawn = lines.filter((l) => l.series.values.length === 5);
  if (drawn.length === 0) return null;
  const all = drawn.flatMap((l) => l.series.values);
  const lo = Math.min(100, ...all) - 3;
  const hi = Math.max(100, ...all) + 3;
  const pad = { l: 34, r: 150, t: 12, b: 24 };
  const x = (i: number) => pad.l + (i / 4) * (width - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (height - pad.t - pad.b);
  const path = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const STYLE = {
    strong: { width: 2.5, dash: undefined, opacity: 1 },
    medium: { width: 2, dash: "6 4", opacity: 0.85 },
    dashed: { width: 2, dash: "2 4", opacity: 0.85 },
    faint: { width: 2, dash: undefined, opacity: 0.3 },
  } as const;
  // Right-end labels are nudged apart so two lines ending close together stay readable.
  const ends = drawn.map((l) => ({ l, y: y(l.series.values.at(-1)!) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
  const labels = drawn[0].series.labels;
  const ticks = [lo + 3, 100, hi - 3].filter((v, i, a) => a.indexOf(v) === i && (v === 100 || Math.abs(v - 100) > 8));
  const aria = drawn.map((l) => `${l.name} ${l.series.values.map((v) => v.toFixed(0)).join("→")}`).join("。");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`5期の指数（5期前＝100）。${aria}`} className="h-auto w-full">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity={t === 100 ? 0.3 : 0.1} strokeWidth={1} />
          <text x={pad.l - 6} y={y(t)} textAnchor="end" dominantBaseline="central" fontSize={10} fill="currentColor" opacity={0.6} className="figures">
            {t.toFixed(0)}
          </text>
        </g>
      ))}
      {drawn.map((l) => {
        const s = STYLE[l.style];
        return <path key={l.name} d={path(l.series.values)} fill="none" stroke="currentColor" strokeOpacity={s.opacity} strokeWidth={s.width} strokeDasharray={s.dash} strokeLinejoin="round" strokeLinecap="round" />;
      })}
      {ends.map(({ l, y: ly }) => (
        <text key={l.name} x={width - pad.r + 8} y={ly} dominantBaseline="central" fontSize={11} fill="currentColor" opacity={STYLE[l.style].opacity < 0.5 ? 0.6 : 1} className="figures">
          <tspan fontWeight={600}>{l.series.values.at(-1)!.toFixed(0)}</tspan> {l.name}
        </text>
      ))}
      {labels.map((label, i) => (
        <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.6} className="figures">
          {label}
        </text>
      ))}
    </svg>
  );
}

/** A count of companies as donut parts (size bands, accounting standards), in the order given, not by size. */
export function countParts(parts: { id: string; name: string; companies: number }[]) {
  const total = parts.reduce((acc, p) => acc + p.companies, 0);
  return parts.filter((p) => p.companies > 0).map((p) => ({ id: p.id, name: p.name, value: p.companies, share: total > 0 ? p.companies / total : 0 }));
}
