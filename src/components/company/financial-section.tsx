import { SourceList } from "@/components/sources/source-list";
import { formatMillionYen } from "@/lib/utils/format";
import type { AccountingStandard, FinancialRecord } from "@/types/company";
import type { Source } from "@/types/source";
import { FinancialBars } from "./financial-bars";

function spanLabel(records: FinancialRecord[]): string {
  return records.length === 1 ? records[0].fiscalYear : `${records[0].fiscalYear}〜${records.at(-1)!.fiscalYear}`;
}

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
  const standards = [...new Set(sorted.map((r) => r.accountingStandard))];
  const revenueLabels = [...new Set(sorted.map((r) => r.revenueLabel))];
  const netIncomeLabels = [...new Set(sorted.map((r) => r.netIncomeLabel))];
  // The added columns are only drawn when the filings actually carry them: a
  // bank prints no 営業利益 row at all, and an empty column would read as a gap
  // in the data rather than as a fact about the company.
  const labelsOf = (pick: (r: FinancialRecord) => string | null) => [...new Set(sorted.map(pick).filter((l): l is string => Boolean(l)))];
  const profitLabels = labelsOf((r) => r.profitLabel);
  const totalAssetsLabels = labelsOf((r) => r.totalAssetsLabel);
  const netAssetsLabels = labelsOf((r) => r.netAssetsLabel);
  const hasProfit = sorted.some((r) => r.profit !== null);
  const hasTotalAssets = sorted.some((r) => r.totalAssets !== null);
  const hasNetAssets = sorted.some((r) => r.netAssets !== null);
  const hasEmployees = sorted.some((r) => r.employees !== null);
  const sourceIds = [...new Set(sorted.flatMap((r) => r.sourceIds))];
  const notes = sorted.filter((r) => r.note);
  // Years whose two columns measure different perimeters, so their gap is not a margin.
  const mismatched = sorted.filter(
    (r) => r.revenueBasis !== undefined && r.netIncomeBasis !== undefined && r.revenueBasis !== r.netIncomeBasis,
  );
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
      <div className="grid gap-10 md:grid-cols-2">
        <FinancialBars
          records={sorted}
          pick={(r) => r.revenue}
          title={revenueLabels.length === 1 ? revenueLabels[0] : "売上"}
          fill="var(--chart-revenue)"
          latestFill="var(--chart-net-income)"
          breakOnBasis
        />
        <FinancialBars
          records={sorted}
          pick={(r) => r.netIncome}
          title={netIncomeLabels.length === 1 ? netIncomeLabels[0] : "純利益"}
          fill="color-mix(in oklab, var(--chart-net-income) 45%, var(--background))"
          latestFill="var(--chart-net-income)"
          breakOnBasis={false}
        />
      </div>
      <p className="figures mt-4 text-xs text-muted-foreground">
        {spanLabel(sorted)}・連結。2つのグラフは目盛りが別です（数値はそれぞれの棒に表示）。
      </p>

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
        {mismatched.length > 0 && (
          <p className="font-medium text-foreground">
            {mismatched.length === sorted.length ? "全年度" : spanLabel(mismatched)}は、売上と純利益の集計範囲が異なります（売上：
            {mismatched.at(-1)!.revenueBasis}／純利益：{mismatched.at(-1)!.netIncomeBasis}）。この期間の2本の棒の差は、利益率を表しません。
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
        <p>グラフの数値は単位未満を四捨五入しています。正確な数値は下の表をご覧ください。</p>
      </div>

      <details className="group mt-6">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
          数値を表で見る
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="figures w-full min-w-[46rem] border-collapse text-sm">
            <caption className="pb-2 text-left text-xs text-muted-foreground">
              単位：百万円{hasEmployees ? "（従業員数は人）" : ""}
            </caption>
            <thead>
              <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-semibold">年度</th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">売上</th>
                {hasProfit && <th scope="col" className="py-2 pr-4 text-right font-semibold">利益</th>}
                <th scope="col" className="py-2 pr-4 text-right font-semibold">純利益</th>
                {hasTotalAssets && <th scope="col" className="py-2 pr-4 text-right font-semibold">総資産</th>}
                {hasNetAssets && <th scope="col" className="py-2 pr-4 text-right font-semibold">純資産</th>}
                {hasEmployees && <th scope="col" className="py-2 pr-4 text-right font-semibold">従業員数</th>}
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
                  {hasProfit && (
                    <td className="py-2.5 pr-4 text-right">
                      {r.profit === null ? "—" : formatMillionYen(r.profit)}
                    </td>
                  )}
                  <td className="py-2.5 pr-4 text-right">
                    {r.netIncome === null ? "確認できず" : formatMillionYen(r.netIncome)}
                  </td>
                  {hasTotalAssets && (
                    <td className="py-2.5 pr-4 text-right">
                      {r.totalAssets === null ? "—" : formatMillionYen(r.totalAssets)}
                    </td>
                  )}
                  {hasNetAssets && (
                    <td className="py-2.5 pr-4 text-right">
                      {r.netAssets === null ? "—" : formatMillionYen(r.netAssets)}
                    </td>
                  )}
                  {hasEmployees && (
                    <td className="py-2.5 pr-4 text-right">
                      {r.employees === null ? "—" : r.employees.toLocaleString("ja-JP")}
                    </td>
                  )}
                  <td className="py-2.5 text-xs">{STANDARD_NAME[r.accountingStandard]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/*
            The headings are short so the table stays readable, but 「利益」 and
            「純資産」 are not the same line at every company — a 商社 prints
            売上総利益 where a manufacturer prints 経常利益 or 税引前利益, and some
            filers report equity attributable to the parent rather than the total.
            So the filing's own wording is stated here rather than hidden behind a
            tidy column header.
          */}
          <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
            {hasProfit && (
              <div className="flex gap-2">
                <dt className="shrink-0">「利益」は</dt>
                <dd>有価証券報告書が売上と純利益の間に掲げている行です（{profitLabels.join("・")}）。</dd>
              </div>
            )}
            {hasTotalAssets && totalAssetsLabels.length > 0 && (
              <div className="flex gap-2">
                <dt className="shrink-0">「総資産」は</dt>
                <dd>{totalAssetsLabels.join("・")}。</dd>
              </div>
            )}
            {hasNetAssets && netAssetsLabels.length > 0 && (
              <div className="flex gap-2">
                <dt className="shrink-0">「純資産」は</dt>
                <dd>{netAssetsLabels.join("・")}。</dd>
              </div>
            )}
            {hasEmployees && (
              <div className="flex gap-2">
                <dt className="shrink-0">従業員数は</dt>
                <dd>各年度末時点の連結従業員数です。</dd>
              </div>
            )}
          </dl>
        </div>
      </details>

      <SourceList sources={sources} sourceIds={sourceIds} className="mt-2" />
    </div>
  );
}
