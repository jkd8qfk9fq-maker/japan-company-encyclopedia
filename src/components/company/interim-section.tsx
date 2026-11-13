import type { InterimView } from "@/lib/interim";
import { formatYen } from "@/lib/utils/format";

/**
 * 半期の動き (JCE-045), drawn on the server: for each line, the half's figure with its 前年同期比 and its share of the
 * last full year, and a pair of bars — the previous year's half in grey, this year's in ink — on one scale, so
 * the change is read from the bars' lengths and the number says the same thing. Server-rendered, no script.
 */

const pct = (v: number) => `${v >= 0 ? "+" : "−"}${(Math.abs(v) * 100).toFixed(1)}%`;

export function InterimSection({ view }: { view: InterimView }) {
  const halfLabel = (end: string) => `${end.slice(0, 4)}年${Number(end.slice(5, 7))}月中間期`;
  return (
    <div className="mb-12">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">半期の動き（プレミアム）</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        半期報告書に印字された{halfLabel(view.current.periodEnd)}（{view.current.periodStart.replace(/-/g, "/")}〜{view.current.periodEnd.replace(/-/g, "/")}）の数値。
        {view.prior && `濃い棒が今期、薄い棒が前年の同じ半期（${halfLabel(view.prior.periodEnd)}）。`}
        {view.current.note && `${view.current.note}。`}
      </p>
      <ul className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-3">
        {view.lines.map((line) => {
          const max = Math.max(Math.abs(line.current ?? 0), Math.abs(line.prior ?? 0)) || 1;
          const width = (v: number | null) => (v === null ? 0 : Math.max(1, (Math.abs(v) / max) * 100));
          return (
            <li key={line.key} className="min-w-0">
              <p className="text-sm font-medium">{line.label}</p>
              <p className="figures mt-1 font-serif text-[1.375rem] leading-tight font-semibold">{line.current === null ? "—" : formatYen(line.current)}</p>
              {line.change !== null && (
                <p className="figures mt-1 text-xs" style={{ color: line.change >= 0 ? "oklch(0.45 0.12 150)" : "oklch(0.5 0.17 25)" }}>
                  {line.change >= 0 ? "▲" : "▼"} 前年同期比 {pct(line.change)}
                  {line.prior !== null && <span className="text-muted-foreground">（前年 {formatYen(line.prior)}）</span>}
                </p>
              )}
              {line.change === null && line.prior === null && <p className="figures mt-1 text-xs text-muted-foreground">前年の同じ半期の数値なし</p>}
              <div className="mt-2 space-y-1" aria-hidden>
                {line.prior !== null && <div className="h-3 rounded-r-[3px] bg-foreground/30" style={{ width: `${width(line.prior)}%` }} />}
                {line.current !== null && <div className={`h-3 rounded-r-[3px] ${line.current < 0 ? "bg-foreground/60" : "bg-foreground"}`} style={{ width: `${width(line.current)}%` }} />}
              </div>
              {line.shareOfLastYear !== null && view.lastFullYear && (
                <p className="figures mt-1 text-xs text-muted-foreground">
                  前期通期（{view.lastFullYear.fiscalYear}）の{(line.shareOfLastYear * 100).toFixed(0)}%
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        計算値：前年同期比＝（今期の半期 − 前年の同じ半期）÷ 前年の同じ半期。通期に対する割合＝今期の半期 ÷ 前期通期。半期の数値は期首からの累計で、年換算や見通しは含みません。{view.current.accountingStandard === "ifrs" ? "IFRS" : view.current.accountingStandard === "usgaap" ? "米国基準" : "日本基準"}。
      </p>
    </div>
  );
}
