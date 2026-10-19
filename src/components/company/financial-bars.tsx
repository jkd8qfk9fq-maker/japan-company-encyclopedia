import { chooseScale, columnPath } from "@/lib/charts/financial-chart-geometry";
import type { FinancialRecord } from "@/types/company";

const W = 560;
const H = 260;
const PLOT = { left: 12, right: 548, top: 28, bottom: 222 };

/** One unit per chart, so every label in it reads the same way: 億円 from 10億円 up, else 百万円. */
function unitFor(values: number[]) {
  const max = Math.max(0, ...values.map(Math.abs));
  return max >= 1e9 ? { divisor: 1e8, name: "億円" } : { divisor: 1e6, name: "百万円" };
}

function yearLabel(record: FinancialRecord, all: FinancialRecord[]) {
  const year = record.periodEnd.slice(0, 4);
  // A changed fiscal year end puts two periods in one calendar year; the month tells them apart.
  const shared = all.filter((r) => r.periodEnd.slice(0, 4) === year).length > 1;
  return shared ? `${year}.${record.periodEnd.slice(5, 7)}` : year;
}

/**
 * One series as columns, after the approved mockup: revenue and net income are drawn as two charts side by side,
 * each from zero on its own scale and each labelled with its own values, so neither is read off the other's axis.
 * The latest year is the dark column. A null year draws no column and says "—"; a negative year hangs below the
 * baseline. Where the series stops being comparable (accounting standard, or what revenue covers) a dashed line
 * splits the years and says why. Server-rendered SVG: no script, sharp at any size; on a phone the same values
 * are drawn as horizontal bars, so labels stay at their real size.
 */
export function FinancialBars({
  records,
  pick,
  title,
  latestFill,
  fill,
  breakOnBasis,
}: {
  records: FinancialRecord[];
  pick: (r: FinancialRecord) => number | null;
  title: string;
  latestFill: string;
  fill: string;
  breakOnBasis: boolean;
}) {
  const values = records.map(pick);
  const present = values.filter((v): v is number => v !== null);
  if (present.length === 0) return null;

  const unit = unitFor(present);
  const show = (v: number) => {
    const n = v / unit.divisor;
    const text = Math.abs(n).toLocaleString("ja-JP", { maximumFractionDigits: 0 });
    return v < 0 ? `−${text}` : text;
  };
  const scale = chooseScale(Math.min(0, ...present), Math.max(0, ...present));
  const y = (v: number) =>
    PLOT.bottom - ((v - scale.domainMin) / (scale.domainMax - scale.domainMin)) * (PLOT.bottom - PLOT.top);
  const baseline = y(0);
  const slot = (PLOT.right - PLOT.left) / records.length;
  const barWidth = Math.min(56, slot * 0.56);
  const maxAbs = Math.max(...present.map(Math.abs));

  const breaks = records.slice(1).flatMap((r, i) => {
    const before = records[i];
    if (before.accountingStandard !== r.accountingStandard) return [{ index: i + 1, reason: "会計基準の変更" }];
    if (breakOnBasis && before.revenueBasis !== r.revenueBasis) return [{ index: i + 1, reason: "集計範囲の変更" }];
    return [];
  });

  const label = `${title}の推移。${records
    .map((r, i) => `${r.fiscalYear} ${values[i] === null ? "確認できず" : `${show(values[i]!)}${unit.name}`}`)
    .join("、")}`;

  return (
    <figure className="m-0">
      <figcaption className="text-sm font-medium">
        {title} <span className="font-normal text-muted-foreground">（{unit.name}）</span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="mt-3 hidden h-auto w-full sm:block">
        <line x1={PLOT.left} x2={PLOT.right} y1={baseline} y2={baseline} stroke="var(--foreground)" strokeWidth={1} />
        {breaks.map((b) => {
          const x = PLOT.left + slot * b.index;
          return (
            <g key={b.index}>
              <line x1={x} x2={x} y1={PLOT.top - 18} y2={PLOT.bottom + 6} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
              <text x={x + 4} y={PLOT.top - 8} fontSize={11} fill="var(--muted-foreground)">
                {b.reason}
              </text>
            </g>
          );
        })}
        {records.map((r, i) => {
          const v = values[i];
          const cx = PLOT.left + slot * i + slot / 2;
          const latest = i === records.length - 1;
          return (
            <g key={r.periodEnd}>
              {v !== null && (
                <path d={columnPath(cx - barWidth / 2, baseline, barWidth, y(v))} fill={latest ? latestFill : fill} />
              )}
              <text
                x={cx}
                y={v === null ? baseline - 8 : v >= 0 ? y(v) - 7 : y(v) + 16}
                fontSize={13}
                textAnchor="middle"
                fill="var(--foreground)"
                fontWeight={latest ? 700 : 400}
                className="figures"
              >
                {v === null ? "—" : show(v)}
              </text>
              <text x={cx} y={H - 12} fontSize={12} textAnchor="middle" fill="var(--muted-foreground)">
                {yearLabel(r, records)}
              </text>
            </g>
          );
        })}
      </svg>

      <ul aria-label={label} className="mt-3 space-y-2 sm:hidden">
        {records.map((r, i) => {
          const v = values[i];
          const latest = i === records.length - 1;
          return (
            <li key={r.periodEnd} className="grid grid-cols-[3.25rem_1fr_4.5rem] items-center gap-2 text-xs">
              <span className={latest ? "font-semibold" : "text-muted-foreground"}>{yearLabel(r, records)}</span>
              <span className="h-3.5">
                {v !== null && (
                  <span
                    className="block h-full rounded-[2px]"
                    style={{
                      width: `${Math.max(2, (Math.abs(v) / maxAbs) * 100)}%`,
                      // A loss is the same length as a profit of that size, drawn as an outline: no red, no green.
                      background: v < 0 ? "transparent" : latest ? latestFill : fill,
                      border: v < 0 ? `1.5px solid ${latestFill}` : undefined,
                    }}
                  />
                )}
              </span>
              <span className={`figures text-right ${latest ? "font-semibold" : ""}`}>{v === null ? "—" : show(v)}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
