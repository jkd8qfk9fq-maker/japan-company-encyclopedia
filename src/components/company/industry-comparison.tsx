import Link from "next/link";
import { IndexSparkline } from "@/components/industry/industry-charts";
import type { Compared, IndustryComparison as Comparison } from "@/lib/industry-comparison";
import { formatYen } from "@/lib/utils/format";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";

/**
 * 業界比較 (JCE-043), drawn on the server: where the company's printed figures sit among its industry's released
 * companies — a rank out of N and the industry median for each ratio, with ▲▼ against the median (a position, not
 * a verdict), the company's share of the industry's revenue, and its own five-year index beside the industry's.
 * The same visual grammar as the industry figures: cards, ▲▼, a small line chart; no data colour on text.
 */

const percent = (v: number) => `${(v * 100).toFixed(1)}%`;
const times = (v: number) => `${v.toFixed(2)}倍`;
const man = (v: number) => `${Math.round(v / 10_000).toLocaleString("ja-JP")}万円`;

function Card({ label, item, format, higherIs }: { label: React.ReactNode; item: Compared; format: (v: number) => string; higherIs: React.ReactNode }) {
  const diff = item.value - item.industryMedian;
  const up = Math.abs(diff) < 1e-9 ? null : diff > 0;
  return (
    <div className="border-t border-foreground py-3 pr-3 sm:py-4">
      <p className="text-[0.625rem] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{label}</p>
      <p className="figures mt-1 font-serif text-[1.375rem] leading-tight font-semibold sm:text-[1.625rem]">{format(item.value)}</p>
      <p className="figures mt-1 text-xs" style={up === null ? undefined : { color: up ? "oklch(0.45 0.12 150)" : "oklch(0.5 0.17 25)" }}>
        {up === null ? <T m={{ ja: "業界の中央値と同じ", en: "Same as industry median" }} /> : `${up ? "▲" : "▼"} ${format(Math.abs(diff))}（vs. 業界の中央値 ${format(item.industryMedian)}）`}
      </p>
      <p className="figures mt-0.5 text-xs text-muted-foreground">
        <span data-l="ja" lang="ja">{item.members}社中 {item.rank}位（{higherIs}）・<F s={item.fiscalYear} /></span><span data-l="en" lang="en">No. {item.rank} of {item.members} companies ({higherIs}) · <F s={item.fiscalYear} /></span>
      </p>
    </div>
  );
}

export function IndustryComparisonBlock({ comparison }: { comparison: Comparison }) {
  const c = comparison;
  return (
    <div className="mb-12">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground"><T m={{ ja: "業界比較（プレミアム）", en: "Industry comparison (Premium)" }} /></h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        <span data-l="ja" lang="ja"><Link href={`/industries/${c.industryId}#figures`} className="underline underline-offset-2 hover:text-foreground">
          <span data-l="ja" lang="ja">{c.industryName}業界
        </span><span data-l="en" lang="en">{c.industryName} industry</span></Link>
        の掲載企業{c.members}社の中での位置。順位は大きさの順であって、良し悪しの判定ではありません。
      </span><span data-l="en" lang="en">Position among the {c.members} companies listed in <Link href={`/industries/${c.industryId}#figures`} className="underline underline-offset-2 hover:text-foreground">
          <span data-l="ja" lang="ja">{c.industryName}業界
        </span><span data-l="en" lang="en">{c.industryName} industry</span></Link>. Rank reflects size, not a judgment of good or bad.</span></p>
      <div className="mt-4 grid grid-cols-2 gap-x-4 sm:grid-cols-3">
        {c.revenue && (
          <div className="border-t border-foreground py-3 pr-3 sm:py-4">
            <p className="text-[0.625rem] leading-4 text-muted-foreground sm:text-xs sm:leading-5"><T m={{ ja: "売上高", en: "Revenue" }} /></p>
            <p className="figures mt-1 font-serif text-[1.375rem] leading-tight font-semibold sm:text-[1.625rem]"><F s={formatYen(c.revenue.value)} /></p>
            <p className="figures mt-1 text-xs text-muted-foreground">
              <span data-l="ja" lang="ja">{c.revenue.members}社中 {c.revenue.rank}位・業界の{percent(c.revenue.share)}</span><span data-l="en" lang="en">No. {c.revenue.rank} of {c.revenue.members} companies · {percent(c.revenue.share)} in the industry</span>
            </p>
            <p className="figures mt-0.5 text-xs text-muted-foreground"><F s={c.revenue.fiscalYear} /></p>
          </div>
        )}
        {c.netProfitMargin && <Card label={<T m={{ ja: "純利益率（計算値）", en: "Net margin (computed)" }} />} item={c.netProfitMargin} format={percent} higherIs={<T m={{ ja: "高い順", en: "Highest first" }} />} />}
        {c.revenueGrowth5y && <Card label={<T m={{ ja: "5期の売上高の伸び（計算値）", en: "5-year revenue growth (computed)" }} />} item={c.revenueGrowth5y} format={times} higherIs={<T m={{ ja: "高い順", en: "Highest first" }} />} />}
        {c.overseasSalesRatio && <Card label={<T m={{ ja: "海外売上高比率（計算値）", en: "Overseas revenue ratio (computed)" }} />} item={c.overseasSalesRatio} format={percent} higherIs={<T m={{ ja: "高い順", en: "Highest first" }} />} />}
        {c.averageAnnualSalary && <Card label={<T m={{ ja: "平均年間給与（提出会社）", en: "Average annual salary (filing company)" }} />} item={c.averageAnnualSalary} format={man} higherIs={<T m={{ ja: "高い順", en: "Highest first" }} />} />}
      </div>

      {c.index.company && c.index.industry && (
        <div className="mt-6 max-w-sm">
          <p className="text-sm font-medium"><T m={{ ja: "5期の売上高の推移（指数）", en: "5-year revenue trend (index)" }} /></p>
          <p className="mt-1 text-xs text-muted-foreground">
            <span data-l="ja" lang="ja">5期前＝100。濃い線がこの会社、薄い線が{c.industryName}業界（5期そろった{c.index.industry.companies}社の合計）。
          </span><span data-l="en" lang="en">5 years ago = 100. The dark line is this company; the light line is the {c.industryName} industry (total of {c.index.industry.companies} companies with all 5 years available).</span></p>
          <div className="mt-2">
            <IndexSparkline series={c.index.company} reference={c.index.industry} width={320} height={140} />
          </div>
        </div>
      )}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <T m={{ ja: "比較の相手は、この百科事典に掲載された同じ業界の会社だけです（上場企業すべてではありません）。計算値は有価証券報告書に印字された数値の割り算で、中央値は各社の値を並べた真ん中の値です。▲▼は中央値との差で、良し悪しの判定ではありません。", en: "Comparisons are only with companies in the same industry listed in this encyclopedia (not all listed companies). Computed values are divisions of figures printed in annual securities reports, and the median is the middle value when companies' figures are lined up in order. ▲▼ show the difference from the median, not a judgment of good or bad." }} />
      </p>
    </div>
  );
}
