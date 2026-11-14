import { SourceList } from "@/components/sources/source-list";
import type { QuarterlyPoint, QuarterlyView } from "@/lib/quarterly";
import { formatYen } from "@/lib/utils/format";
import type { Source } from "@/types/source";

const change = (v: number | null) => (v === null ? null : `${v >= 0 ? "▲" : "▼"}${Math.abs(v * 100).toFixed(1)}%`);
const SOURCE_NOTE = { "edinet-db": "決算短信（EDINET DB）", hanki: "半期報告書", yuho: "有価証券報告書" } as const;

/**
 * 四半期の動き (JCE-049), free: the year in progress quarter by quarter, cumulative, against the same point a year
 * earlier. Pairs of bars on one scale per line — last year in grey, this year in ink — so the gap is read from the
 * lengths, and the number says the same. Server-rendered, no script.
 *
 * EDINET DB's terms ask a public service to show its attribution and its disclaimer wherever its data is shown; both
 * are printed under the table whenever a figure here came from it.
 */
export function QuarterlySection({ view, sources }: { view: QuarterlyView; sources: Source[] }) {
  const max = Math.max(1, ...view.points.flatMap((p) => [p.revenue ?? 0, p.priorRevenue ?? 0]));
  const sourceIds = [...new Set(view.points.flatMap((p) => p.sourceIds))];
  return (
    <div className="mb-12">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">四半期の動き（累計）</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {view.fiscalYear}の期首からの累計。濃い棒が今期、薄い棒が前期（{view.priorFiscalYear}）の同じ時点です。
      </p>

      <ul className="mt-4 space-y-3" aria-label={`${view.fiscalYear}の売上の累計`}>
        {view.points.map((p) => (
          <Bars key={p.key} point={p} max={max} />
        ))}
      </ul>

      {/* One row per period rather than a table: six columns of 兆・億 figures do not fit a phone. */}
      <dl className="mt-6 divide-y divide-border border-y border-foreground/80 text-sm">
        {view.points.map((p) => (
          <div key={p.key} className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1 py-3 sm:grid-cols-[6rem_1fr_1fr]">
            <dt className="row-span-2 sm:row-span-1">
              {p.label}
              <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">{SOURCE_NOTE[(p.source ?? p.priorSource)!]}</span>
            </dt>
            <Figure name="売上" now={p.revenue} prior={p.priorRevenue} delta={p.revenueChange} pending={p.key !== "fy"} />
            <Figure name="純利益" now={p.netIncome} prior={p.priorNetIncome} delta={p.netIncomeChange} pending={p.key !== "fy" && p.revenue === null} />
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        前年同期比は計算値：今期の累計 ÷ 前期の同じ時点の累計 − 1（前期が0以下のときは付けません）。▲▼は増減の向きで、良し悪しではありません。純利益は親会社株主（所有者）に帰属する純利益。通期の行は前期の有価証券報告書の数値です。
      </p>
      {view.usesEdinetDb && (
        <div className="mt-3 rounded-md border border-border bg-card p-3 text-xs leading-5 text-muted-foreground">
          <p>
            第1・第3四半期の数値は、会社が発表した決算短信を
            <a href="https://edinetdb.jp/" className="mx-0.5 font-medium text-foreground underline underline-offset-2" rel="noopener">
              Powered by EDINET DB
            </a>
            が構造化したデータです（百万円未満は切り捨て）。中間期は半期報告書、通期は有価証券報告書（いずれも EDINET）から。
          </p>
          <p className="mt-1">
            EDINET DB のデータは公開資料を機械的に処理した情報で、投資助言ではありません。解析の過程で誤差が生じることがあるため、重要な判断には会社の決算短信の原本をご確認ください。当サイトは EDINET DB の数値を、同じ会社の半期報告書・有価証券報告書の数値と照合してから掲載しています。
          </p>
        </div>
      )}
      <SourceList sources={sources} sourceIds={sourceIds} className="mt-2" />
    </div>
  );
}

function Figure({ name, now, prior, delta, pending }: { name: string; now: number | null; prior: number | null; delta: number | null; pending: boolean }) {
  return (
    <dd className="figures min-w-0">
      <span className="text-xs text-muted-foreground">{name} </span>
      <span className="font-medium">{now !== null ? formatYen(now) : pending ? "未発表" : "—"}</span>
      {delta !== null && <span className="ml-1.5 text-xs">{change(delta)}</span>}
      {prior !== null && <span className="block text-xs text-muted-foreground">前期 {formatYen(prior)}</span>}
    </dd>
  );
}

function Bars({ point, max }: { point: QuarterlyPoint; max: number }) {
  const width = (v: number | null) => (v === null || v <= 0 ? 0 : Math.max(1, (v / max) * 100));
  return (
    <li className="grid grid-cols-[4.5rem_1fr] items-center gap-3 text-xs sm:grid-cols-[6rem_1fr]">
      <span className="text-muted-foreground">{point.label}</span>
      <span className="space-y-1">
        <span className="flex items-center gap-2">
          <span className="block h-2.5 rounded-r-[3px] bg-foreground/25" style={{ width: `${width(point.priorRevenue)}%` }} aria-hidden />
          {point.priorRevenue !== null && <span className="figures shrink-0 text-muted-foreground">{formatYen(point.priorRevenue)}</span>}
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-2.5 rounded-r-[3px] bg-foreground" style={{ width: `${width(point.revenue)}%` }} aria-hidden />
          <span className="figures shrink-0 font-medium">{point.revenue !== null ? formatYen(point.revenue) : point.key === "fy" ? "" : "未発表"}</span>
        </span>
      </span>
    </li>
  );
}
