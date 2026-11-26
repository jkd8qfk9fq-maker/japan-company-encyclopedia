import { CHANGE_FORMULA, type FinancialSummary } from "@/lib/financial-summary";
import { formatYen } from "@/lib/utils/format";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

const signed = (change: number) => `${change >= 0 ? "▲" : "▼"}${Math.abs(change * 100).toFixed(1)}%`;

/**
 * The latest year at a glance (JCE-047): each printed line with its 前期比. The arrow says which way the number moved,
 * not whether that is good — no red, no green, the same ▲▼ the industry figures use.
 */
export function FinancialSummaryRow({ summary }: { summary: FinancialSummary }) {
  if (summary.items.length === 0) return null;
  const withChange = summary.items.some((i) => i.change !== null);
  return (
    <div className="mb-10">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground"><span data-l="ja"><F s={summary.fiscalYear} />の数字</span><span data-l="en"><F s={summary.fiscalYear} /> figures</span></h3>
      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        {summary.items.map((item) => (
          <div key={item.key} className="bg-card p-4">
            {/* Wrapped, not truncated: IFRS filers' 純利益 and 純資産 lines both begin 「親会社の所有者に帰属する…」. */}
            <dt className="text-xs leading-snug text-muted-foreground"><L s={item.label} /></dt>
            <dd className="figures mt-1 font-serif text-lg font-semibold">
              {item.unit === "people" ? `${item.value.toLocaleString("ja-JP")}人` : formatYen(item.value)}
            </dd>
            {item.change !== null && (
              <dd className="figures mt-0.5 text-xs text-muted-foreground">
                <span data-l="ja">前期比 <span className="font-medium text-foreground">{signed(item.change)}</span></span><span data-l="en">Year on year <span className="font-medium text-foreground">{signed(item.change)}</span></span>
              </dd>
            )}
          </div>
        ))}
      </dl>
      {withChange && summary.previousYear && (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          <span data-l="ja">前期比は計算値：{CHANGE_FORMULA}（{summary.previousYear}との比較）。会計基準や売上の範囲が変わった年、前期が0以下の項目には付けていません。▲▼は増減の向きで、良し悪しではありません。
        </span><span data-l="en">Year-on-year change is computed: {CHANGE_FORMULA} (compared with {summary.previousYear}). It is not shown for years when accounting standards or the scope of revenue changed, or for items where the prior year was 0 or less. ▲▼ show the direction of change, not good or bad.</span></p>
      )}
    </div>
  );
}
