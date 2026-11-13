import Link from "next/link";
import { IndexSparkline } from "@/components/industry/industry-charts";
import type { Compared, IndustryComparison as Comparison } from "@/lib/industry-comparison";
import { formatYen } from "@/lib/utils/format";

/**
 * 業界比較 (JCE-043), drawn on the server: where the company's printed figures sit among its industry's released
 * companies — a rank out of N and the industry median for each ratio, with ▲▼ against the median (a position, not
 * a verdict), the company's share of the industry's revenue, and its own five-year index beside the industry's.
 * The same visual grammar as the industry figures: cards, ▲▼, a small line chart; no data colour on text.
 */

const percent = (v: number) => `${(v * 100).toFixed(1)}%`;
const times = (v: number) => `${v.toFixed(2)}倍`;
const man = (v: number) => `${Math.round(v / 10_000).toLocaleString("ja-JP")}万円`;

function Card({ label, item, format, higherIs }: { label: string; item: Compared; format: (v: number) => string; higherIs: string }) {
  const diff = item.value - item.industryMedian;
  const up = Math.abs(diff) < 1e-9 ? null : diff > 0;
  return (
    <div className="border-t border-foreground py-3 pr-3 sm:py-4">
      <p className="text-[0.625rem] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{label}</p>
      <p className="figures mt-1 font-serif text-[1.375rem] leading-tight font-semibold sm:text-[1.625rem]">{format(item.value)}</p>
      <p className="figures mt-1 text-xs" style={up === null ? undefined : { color: up ? "oklch(0.45 0.12 150)" : "oklch(0.5 0.17 25)" }}>
        {up === null ? "業界の中央値と同じ" : `${up ? "▲" : "▼"} ${format(Math.abs(diff))}（vs. 業界の中央値 ${format(item.industryMedian)}）`}
      </p>
      <p className="figures mt-0.5 text-xs text-muted-foreground">
        {item.members}社中 {item.rank}位（{higherIs}）・{item.fiscalYear}
      </p>
    </div>
  );
}

export function IndustryComparisonBlock({ comparison }: { comparison: Comparison }) {
  const c = comparison;
  return (
    <div className="mb-12">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">業界比較（プレミアム）</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        <Link href={`/industries/${c.industryId}#figures`} className="underline underline-offset-2 hover:text-foreground">
          {c.industryName}業界
        </Link>
        の掲載企業{c.members}社の中での位置。順位は大きさの順であって、良し悪しの判定ではありません。
      </p>
      <div className="mt-4 grid grid-cols-2 gap-x-4 sm:grid-cols-3">
        {c.revenue && (
          <div className="border-t border-foreground py-3 pr-3 sm:py-4">
            <p className="text-[0.625rem] leading-4 text-muted-foreground sm:text-xs sm:leading-5">売上高</p>
            <p className="figures mt-1 font-serif text-[1.375rem] leading-tight font-semibold sm:text-[1.625rem]">{formatYen(c.revenue.value)}</p>
            <p className="figures mt-1 text-xs text-muted-foreground">
              {c.revenue.members}社中 {c.revenue.rank}位・業界の{percent(c.revenue.share)}
            </p>
            <p className="figures mt-0.5 text-xs text-muted-foreground">{c.revenue.fiscalYear}</p>
          </div>
        )}
        {c.netProfitMargin && <Card label="純利益率（計算値）" item={c.netProfitMargin} format={percent} higherIs="高い順" />}
        {c.revenueGrowth5y && <Card label="5期の売上高の伸び（計算値）" item={c.revenueGrowth5y} format={times} higherIs="高い順" />}
        {c.overseasSalesRatio && <Card label="海外売上高比率（計算値）" item={c.overseasSalesRatio} format={percent} higherIs="高い順" />}
        {c.averageAnnualSalary && <Card label="平均年間給与（提出会社）" item={c.averageAnnualSalary} format={man} higherIs="高い順" />}
      </div>

      {c.index.company && c.index.industry && (
        <div className="mt-6 max-w-sm">
          <p className="text-sm font-medium">5期の売上高の推移（指数）</p>
          <p className="mt-1 text-xs text-muted-foreground">
            5期前＝100。濃い線がこの会社、薄い線が{c.industryName}業界（5期そろった{c.index.industry.companies}社の合計）。
          </p>
          <div className="mt-2">
            <IndexSparkline series={c.index.company} reference={c.index.industry} width={320} height={140} />
          </div>
        </div>
      )}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        比較の相手は、この百科事典に掲載された同じ業界の会社だけです（上場企業すべてではありません）。計算値は有価証券報告書に印字された数値の割り算で、中央値は各社の値を並べた真ん中の値です。▲▼は中央値との差で、良し悪しの判定ではありません。
      </p>
    </div>
  );
}
