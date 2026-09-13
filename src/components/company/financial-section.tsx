import { SourceList } from "@/components/sources/source-list";
import { formatMillionYen, formatYen } from "@/lib/utils/format";
import type { AccountingStandard, FinancialRecord } from "@/types/company";
import type { Source } from "@/types/source";
import { FinancialChart } from "./financial-chart";

const STANDARD_NAME: Record<AccountingStandard, string> = {
  ifrs: "国際会計基準（IFRS）",
  jgaap: "日本基準",
  usgaap: "米国会計基準",
};

/**
 * "財務" — context, not a scorecard. Two figures a beginner can connect to the
 * business they just read about: how much the company sells, and how much of
 * that it keeps. No ratios, no market data, no colour for "good" or "bad".
 */
export function FinancialSection({
  companyName,
  records,
  sources,
}: {
  companyName: string;
  records: FinancialRecord[];
  sources: Source[];
}) {
  if (records.length === 0) {
    return (
      <p className="prose-ja text-muted-foreground">
        {companyName}の業績データは、出典を確認できた範囲がまだないため掲載していません。
      </p>
    );
  }

  const sorted = [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  const latest = sorted.at(-1)!;
  const standards = [...new Set(sorted.map((r) => r.accountingStandard))];
  const revenueLabels = [...new Set(sorted.map((r) => r.revenueLabel))];
  const netIncomeLabels = [...new Set(sorted.map((r) => r.netIncomeLabel))];
  const sourceIds = [...new Set(sorted.flatMap((r) => r.sourceIds))];
  const notes = sorted.filter((r) => r.note);
  // Consecutive years sharing a revenue scope, e.g. "2022年3月期〜2023年3月期：金融事業を含む".
  const bases = sorted.reduce<{ basis: string; first: string; last: string }[]>((runs, r) => {
    const basis = r.revenueBasis;
    if (!basis) return runs;
    const last = runs.at(-1);
    if (last && last.basis === basis) last.last = r.fiscalYear;
    else runs.push({ basis, first: r.fiscalYear, last: r.fiscalYear });
    return runs;
  }, []).map((run) => ({ basis: run.basis, years: run.first === run.last ? run.first : `${run.first}〜${run.last}` }));

  return (
    <div>
      {/* Legend first, carrying the latest year's values: identity is never colour alone. */}
      <dl className="flex flex-wrap gap-x-10 gap-y-5">
        <div>
          <dt className="flex items-center gap-2 text-sm text-muted-foreground">
            <span aria-hidden className="size-3 rounded-[3px] bg-(--chart-revenue)" />
            {latest.revenueLabel}
          </dt>
          <dd className="figures mt-1 font-serif text-[1.75rem] font-semibold md:text-[2rem]">
            {latest.revenue === null ? "確認できず" : formatYen(latest.revenue)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-2 text-sm text-muted-foreground">
            <span aria-hidden className="size-3 rounded-[3px] bg-(--chart-net-income)" />
            純利益
            <span className="text-xs">（{latest.netIncomeLabel}）</span>
          </dt>
          <dd className="figures mt-1 font-serif text-[1.75rem] font-semibold md:text-[2rem]">
            {latest.netIncome === null ? "確認できず" : formatYen(latest.netIncome)}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted-foreground">{latest.fiscalYear}・連結</p>

      <div className="mt-10">
        <FinancialChart
          records={sorted}
          revenueLabel={latest.revenueLabel}
          netIncomeLabel="純利益"
        />
      </div>

      <div className="mt-8 max-w-3xl space-y-2 text-xs leading-6 text-muted-foreground">
        {standards.length === 1 ? (
          <p>すべての年度が{STANDARD_NAME[standards[0]]}による数値です。</p>
        ) : (
          <p>
            会計基準が異なる年度を含みます（
            {standards.map((s) => STANDARD_NAME[s]).join("・")}
            ）。基準をまたぐ年度の数値は、厳密には比較できません。
          </p>
        )}
        {revenueLabels.length > 1 && (
          <p>売上にあたる項目の名称が年度により異なります（{revenueLabels.join("・")}）。</p>
        )}
        {bases.length > 1 && (
          <p>
            売上の集計範囲が年度により異なります（
            {bases.map((b) => `${b.years}：${b.basis}`).join("／")}
            ）。範囲をまたぐ年度の売上は、そのままでは比較できません。
          </p>
        )}
        {notes.map((r) => (
          <p key={r.periodEnd}>
            {r.fiscalYear}：{r.note}
          </p>
        ))}
        {netIncomeLabels.length > 1 && (
          <p>純利益にあたる項目の名称が年度により異なります（{netIncomeLabels.join("・")}）。</p>
        )}
        <p>表示額は億円単位で四捨五入しています。正確な数値は下の表をご覧ください。</p>
      </div>

      <details className="group mt-6">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
          数値を表で見る
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="figures w-full min-w-[32rem] border-collapse text-sm">
            <caption className="pb-2 text-left text-xs text-muted-foreground">単位：百万円</caption>
            <thead>
              <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-semibold">年度</th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">売上</th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">純利益</th>
                <th scope="col" className="py-2 font-semibold">会計基準</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.periodEnd} className="border-b border-border">
                  <th scope="row" className="py-2.5 pr-4 text-left font-normal">{r.fiscalYear}</th>
                  <td className="py-2.5 pr-4 text-right">
                    {r.revenue === null ? "確認できず" : formatMillionYen(r.revenue)}
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    {r.netIncome === null ? "確認できず" : formatMillionYen(r.netIncome)}
                  </td>
                  <td className="py-2.5 text-xs">{STANDARD_NAME[r.accountingStandard]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <SourceList sources={sources} sourceIds={sourceIds} className="mt-2" />
    </div>
  );
}
