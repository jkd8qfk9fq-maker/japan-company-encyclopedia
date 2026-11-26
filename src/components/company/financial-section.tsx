import { Donut, partsOf } from "@/components/industry/industry-charts";
import { SourceList } from "@/components/sources/source-list";
import { changeBetween, financialCsv } from "@/lib/financial-summary";
import { formatMillionYen, formatYen } from "@/lib/utils/format";
import type { AccountingStandard, Business, Company, FinancialRecord } from "@/types/company";
import { ChartTabs } from "./chart-tabs";
import { FinancialBars } from "./financial-bars";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";

/** 前期比 of one table cell, only between comparable years (same standard; revenue and net income in the same scope). */
function ChangeNote({ records, index, pick, scoped }: { records: FinancialRecord[]; index: number; pick: (r: FinancialRecord) => number | null; scoped: boolean }) {
  if (index === 0) return null;
  const r = records[index];
  const prev = records[index - 1];
  if (r.accountingStandard !== prev.accountingStandard || (scoped && r.revenueBasis !== prev.revenueBasis)) return null;
  const change = changeBetween(pick(r), pick(prev));
  if (change === null) return null;
  return (
    <span className="block text-[0.6875rem] text-muted-foreground">
      {change >= 0 ? "▲" : "▼"}
      {Math.abs(change * 100).toFixed(1)}%
    </span>
  );
}

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
 * that it keeps. No market data, no colour for "good" or "bad"; the computed ratios of JCE-038 sit above this
 * section in CompanyMetrics, labelled as computed.
 */
function flatten(businesses: Business[]): Business[] {
  return businesses.flatMap((b) => [b, ...flatten(b.children ?? [])]);
}

/**
 * What the latest revenue is made of, as the filing prints it: by business (セグメント情報) and by region
 * (地域ごとの情報). Each is one year's printed amounts, split as printed — the shares are computed (JCE-038).
 */
function Breakdown({ company }: { company: Company }) {
  const names = new Map(flatten(company.businesses).map((b) => [b.id, b.shortName ?? b.name]));
  const segment = company.segmentRevenue;
  const regional = company.regionalRevenue;
  const segmentParts = segment ? partsOf(segment.items.map((i) => ({ id: i.businessId, name: names.get(i.businessId) ?? i.businessId, value: i.amount }))) : [];
  const regionalParts = regional ? partsOf(regional.items.map((i, k) => ({ id: `region-${k}`, name: i.region, value: i.amount }))) : [];
  if (segmentParts.length < 2 && regionalParts.length < 2) return null;
  const sourceIds = [...new Set([...(segmentParts.length > 1 ? segment!.sourceIds : []), ...(regionalParts.length > 1 ? regional!.sourceIds : [])])];
  return (
    <div className="mt-12">
      <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "売上の内訳", en: "Revenue breakdown" }} /></h3>
      <p className="mt-1 text-sm text-muted-foreground"><T m={{ ja: "有価証券報告書のセグメント情報・地域ごとの情報に印字された金額。割合は計算値です。", en: "Amounts as printed in the segment information and geographic information of the annual securities report. Percentages are computed." }} /></p>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {segmentParts.length > 1 && (
          <Donut
            title={`事業別の${segment!.label}（${segment!.fiscalYear}）`}
            parts={segmentParts}
            format={formatYen}
            centre={{ value: `${segment!.items.length}`, label: "事業" }}
          />
        )}
        {regionalParts.length > 1 && (
          <Donut
            title={`地域別の${regional!.label}（${regional!.fiscalYear}）`}
            parts={regionalParts}
            format={formatYen}
            centre={{ value: `${regional!.items.length}`, label: "地域" }}
          />
        )}
      </div>
      <SourceList sources={company.sources} sourceIds={sourceIds} variant="refs" className="mt-4" />
    </div>
  );
}

export function FinancialSection({ company }: { company: Company }) {
  const { name: companyName, financials: records, sources } = company;
  if (records.length === 0) {
    return (
      <p className="prose-ja text-muted-foreground">
        <span data-l="ja">{companyName}の業績データは、出典を確認できた範囲がまだないため掲載していません。
      </span><span data-l="en">Performance data for {companyName} is not shown because there is not yet a range for which sources could be confirmed.</span></p>
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

  const pair = (a: React.ReactNode, b: React.ReactNode) => <div className="grid gap-10 md:grid-cols-2">{a}{b}</div>;
  // Only the charts the filings can fill: a bank prints no 営業利益, and an empty tab would read as missing data.
  const charts = [
    {
      id: "revenue",
      label: <T m={{ ja: "売上と純利益", en: "Revenue and net income" }} />,
      panel: pair(
        <FinancialBars records={sorted} pick={(r) => r.revenue} title={revenueLabels.length === 1 ? revenueLabels[0] : "売上"} fill="var(--chart-revenue)" latestFill="var(--chart-net-income)" breakOnBasis />,
        <FinancialBars
          records={sorted}
          pick={(r) => r.netIncome}
          title={netIncomeLabels.length === 1 ? netIncomeLabels[0] : "純利益"}
          fill="color-mix(in oklab, var(--chart-net-income) 45%, var(--background))"
          latestFill="var(--chart-net-income)"
          breakOnBasis={false}
        />,
      ),
    },
    hasProfit && {
      id: "profit",
      label: profitLabels.length === 1 ? profitLabels[0] : "利益",
      panel: (
        <div className="max-w-2xl">
          <FinancialBars records={sorted} pick={(r) => r.profit} title={profitLabels.length === 1 ? profitLabels[0] : "利益"} fill="color-mix(in oklab, var(--chart-net-income) 45%, var(--background))" latestFill="var(--chart-net-income)" breakOnBasis={false} />
        </div>
      ),
    },
    (hasTotalAssets || hasNetAssets) && {
      id: "assets",
      label: <T m={{ ja: "総資産と純資産", en: "Total assets and net assets" }} />,
      panel: pair(
        hasTotalAssets && <FinancialBars records={sorted} pick={(r) => r.totalAssets} title={totalAssetsLabels.length === 1 ? totalAssetsLabels[0] : "総資産"} fill="var(--chart-revenue)" latestFill="var(--chart-net-income)" breakOnBasis={false} />,
        hasNetAssets && <FinancialBars records={sorted} pick={(r) => r.netAssets} title={netAssetsLabels.length === 1 ? netAssetsLabels[0] : "純資産"} fill="color-mix(in oklab, var(--chart-net-income) 45%, var(--background))" latestFill="var(--chart-net-income)" breakOnBasis={false} />,
      ),
    },
    hasEmployees && {
      id: "employees",
      label: <T m={{ ja: "従業員数", en: "Employees" }} />,
      panel: (
        <div className="max-w-2xl">
          <FinancialBars records={sorted} pick={(r) => r.employees} title="従業員数（連結）" fill="var(--chart-revenue)" latestFill="var(--chart-net-income)" breakOnBasis={false} people />
        </div>
      ),
    },
  ].filter(Boolean) as { id: string; label: React.ReactNode; panel: React.ReactElement }[];
  const csv = financialCsv(companyName, sorted);

  return (
    <div>
      <ChartTabs tabs={charts.map((c) => ({ id: c.id, label: c.label }))}>{charts.map((c) => c.panel)}</ChartTabs>
      <p className="figures mt-4 text-xs text-muted-foreground">
        <span data-l="ja">{spanLabel(sorted)}・連結。グラフは数字ごとに目盛りが別です（数値はそれぞれの棒に表示）。
      </span><span data-l="en">{spanLabel(sorted)}, consolidated. Each chart has its own scale (values are shown on each bar).</span></p>

      <Breakdown company={company} />

      <div className="mt-8 max-w-3xl space-y-2 text-xs leading-6 text-muted-foreground">
        {standards.length === 1 ? (
          <p><span data-l="ja">すべての年度が{STANDARD_NAME[standards[0]]}による数値です。</span><span data-l="en">All fiscal years use figures under {STANDARD_NAME[standards[0]]}.</span></p>
        ) : (
          <p>
            <span data-l="ja">会計基準が異なる年度を含みます（
            {standards.map((s) => STANDARD_NAME[s]).join("・")}
            ）。基準をまたぐ年度の数値は、厳密には比較できません。
          </span><span data-l="en">Includes fiscal years under different accounting standards ({standards.map((s) => STANDARD_NAME[s]).join("・")}). Figures across standards are not strictly comparable.</span></p>
        )}
        {revenueLabels.length > 1 && (
          <p><span data-l="ja">売上にあたる項目の名称が年度により異なります（{revenueLabels.join("・")}）。</span><span data-l="en">The name of the item corresponding to revenue differs by fiscal year ({revenueLabels.join("・")}).</span></p>
        )}
        {bases.length > 1 && (
          <p>
            <span data-l="ja">売上の集計範囲が年度により異なります（
            {bases.map((b) => `${b.years}：${b.basis}`).join("／")}
            ）。範囲をまたぐ年度の売上は、そのままでは比較できません。
          </span><span data-l="en">The scope of revenue aggregation differs by fiscal year ({bases.map((b) => `${b.years}：${b.basis}`).join("／")}). Revenue across different scopes cannot be compared as is.</span></p>
        )}
        {mismatched.length > 0 && (
          <p className="font-medium text-foreground">
            <span data-l="ja">{mismatched.length === sorted.length ? <T m={{ ja: "全年度", en: "All years" }} /> : spanLabel(mismatched)}は、売上と純利益の集計範囲が異なります（売上：
            {mismatched.at(-1)!.revenueBasis}／純利益：{mismatched.at(-1)!.netIncomeBasis}）。この期間の2本の棒の差は、利益率を表しません。
          </span><span data-l="en">For {mismatched.length === sorted.length ? <T m={{ ja: "全年度", en: "All years" }} /> : spanLabel(mismatched)}, the scope of revenue and net income differs (revenue: {mismatched.at(-1)!.revenueBasis} / net income: {mismatched.at(-1)!.netIncomeBasis}). The gap between the two bars in this period does not represent the profit margin.</span></p>
        )}
        {notes.map((r) => (
          <p key={r.periodEnd}>
            <F s={r.fiscalYear} />：{r.note}
          </p>
        ))}
        {netIncomeLabels.length > 1 && (
          <p><span data-l="ja">純利益にあたる項目の名称が年度により異なります（{netIncomeLabels.join("・")}）。</span><span data-l="en">The name of the item corresponding to net income differs by fiscal year ({netIncomeLabels.join("・")}).</span></p>
        )}
        <p><T m={{ ja: "グラフの数値は単位未満を四捨五入しています。正確な数値は下の表をご覧ください。", en: "Chart values are rounded to the nearest unit. See the table below for exact figures." }} /></p>
      </div>

      <details className="group mt-6">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
          <span data-l="ja"><span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
          数値を表で見る
        </span><span data-l="en">View <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span> figures in a table</span></summary>
        <p className="mt-1 text-xs text-muted-foreground">
          {/* A data: link, so the file is made on the server with the page and the download needs no script or request. */}
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
            download={`${company.id}-financials.csv`}
            className="inline-flex min-h-9 items-center rounded-full border border-border px-3 text-foreground hover:border-foreground"
          >
            <T m={{ ja: "CSVでダウンロード", en: "Download as CSV" }} />
          </a>
          <span className="ml-2"><T m={{ ja: "円単位・印字どおりの値。各値の下は前期比（計算値）。", en: "Values in yen, as printed. Below each value is the year-on-year change (computed)." }} /></span>
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="figures w-full min-w-[46rem] border-collapse text-sm">
            <caption className="pb-2 text-left text-xs text-muted-foreground">
              <span data-l="ja">単位：百万円{hasEmployees ? <T m={{ ja: "（従業員数は人）", en: "(employees in people)" }} /> : ""}</span><span data-l="en">Unit: million yen{hasEmployees ? <T m={{ ja: "（従業員数は人）", en: "(employees in people)" }} /> : ""}</span>
            </caption>
            <thead>
              <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-semibold"><T m={{ ja: "年度", en: "Fiscal year" }} /></th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold"><T m={{ ja: "売上", en: "Revenue" }} /></th>
                {hasProfit && <th scope="col" className="py-2 pr-4 text-right font-semibold"><T m={{ ja: "利益", en: "Profit" }} /></th>}
                <th scope="col" className="py-2 pr-4 text-right font-semibold"><T m={{ ja: "純利益", en: "Net income" }} /></th>
                {hasTotalAssets && <th scope="col" className="py-2 pr-4 text-right font-semibold"><T m={{ ja: "総資産", en: "Total assets" }} /></th>}
                {hasNetAssets && <th scope="col" className="py-2 pr-4 text-right font-semibold"><T m={{ ja: "純資産", en: "Net assets" }} /></th>}
                {hasEmployees && <th scope="col" className="py-2 pr-4 text-right font-semibold"><T m={{ ja: "従業員数", en: "Employees" }} /></th>}
                <th scope="col" className="py-2 font-semibold"><T m={{ ja: "会計基準", en: "Accounting standard" }} /></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.periodEnd} className="border-b border-border">
                  <th scope="row" className="py-2.5 pr-4 text-left font-normal"><F s={r.fiscalYear} /></th>
                  <td className="py-2.5 pr-4 text-right">
                    {r.revenue === null ? <T m={{ ja: "確認できず", en: "Not confirmed" }} /> : formatMillionYen(r.revenue)}
                    <ChangeNote records={sorted} index={i} pick={(x) => x.revenue} scoped />
                  </td>
                  {hasProfit && (
                    <td className="py-2.5 pr-4 text-right">
                      {r.profit === null ? "—" : formatMillionYen(r.profit)}
                      <ChangeNote records={sorted} index={i} pick={(x) => x.profit} scoped={false} />
                    </td>
                  )}
                  <td className="py-2.5 pr-4 text-right">
                    {r.netIncome === null ? <T m={{ ja: "確認できず", en: "Not confirmed" }} /> : formatMillionYen(r.netIncome)}
                    <ChangeNote records={sorted} index={i} pick={(x) => x.netIncome} scoped />
                  </td>
                  {hasTotalAssets && (
                    <td className="py-2.5 pr-4 text-right">
                      {r.totalAssets === null ? "—" : formatMillionYen(r.totalAssets)}
                      <ChangeNote records={sorted} index={i} pick={(x) => x.totalAssets} scoped={false} />
                    </td>
                  )}
                  {hasNetAssets && (
                    <td className="py-2.5 pr-4 text-right">
                      {r.netAssets === null ? "—" : formatMillionYen(r.netAssets)}
                      <ChangeNote records={sorted} index={i} pick={(x) => x.netAssets} scoped={false} />
                    </td>
                  )}
                  {hasEmployees && (
                    <td className="py-2.5 pr-4 text-right">
                      {r.employees === null ? "—" : r.employees.toLocaleString("ja-JP")}
                      <ChangeNote records={sorted} index={i} pick={(x) => x.employees} scoped={false} />
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
                <dt className="shrink-0"><T m={{ ja: "「利益」は", en: "\"Profit\" is" }} /></dt>
                <dd><span data-l="ja">有価証券報告書が売上と純利益の間に掲げている行です（{profitLabels.join("・")}）。</span><span data-l="en">the line the annual securities report presents between revenue and net income ({profitLabels.join("・")}).</span></dd>
              </div>
            )}
            {hasTotalAssets && totalAssetsLabels.length > 0 && (
              <div className="flex gap-2">
                <dt className="shrink-0"><T m={{ ja: "「総資産」は", en: "\"Total assets\" is" }} /></dt>
                <dd>{totalAssetsLabels.join("・")}。</dd>
              </div>
            )}
            {hasNetAssets && netAssetsLabels.length > 0 && (
              <div className="flex gap-2">
                <dt className="shrink-0"><T m={{ ja: "「純資産」は", en: "\"Net assets\" is" }} /></dt>
                <dd>{netAssetsLabels.join("・")}。</dd>
              </div>
            )}
            {hasEmployees && (
              <div className="flex gap-2">
                <dt className="shrink-0"><T m={{ ja: "従業員数は", en: "Employees are" }} /></dt>
                <dd><T m={{ ja: "各年度末時点の連結従業員数です。", en: "the consolidated number of employees at the end of each fiscal year." }} /></dd>
              </div>
            )}
          </dl>
        </div>
      </details>

      <SourceList sources={sources} sourceIds={sourceIds} variant="refs" className="mt-2" />
    </div>
  );
}
