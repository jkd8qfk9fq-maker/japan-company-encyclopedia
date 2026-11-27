import Link from "next/link";
import { ChartTabs } from "@/components/company/chart-tabs";
import { countParts, deltaAgainst, Donut, FigureCard, IndexSparkline, MultiIndexChart, partsOf, PerformanceTable } from "@/components/industry/industry-charts";
import type { IndexSeries, IndustryFigures, IndustryFiguresData, SizeRow } from "@/lib/industry-figures";
import { formatYen } from "@/lib/utils/format";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

/**
 * The industry figures (JCE-041), drawn on the server: ranked bars, one hue, widest first, the value at the tip.
 * No script, no chart library — a bar is a div whose width is the share of the largest value, so the page stays
 * plain HTML and reads the same with styles off (the value is in the text). Every ratio prints its formula, and
 * every sum says how many companies it adds up, so a reader never takes a partial sum for the whole.
 */

const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
const times = (value: number) => `${value.toFixed(2)}倍`;
const people = (value: number) => (value >= 10000 ? `${(value / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万人` : `${value.toLocaleString("ja-JP")}人`);
const manYen = (value: number) => `${Math.round(value / 10000).toLocaleString("ja-JP")}万円`;

function Bars({
  rows,
  max,
  format,
}: {
  rows: { key: string; label: React.ReactNode; value: number; note?: string }[];
  max?: number;
  format: (value: number) => string;
}) {
  const top = max ?? Math.max(0, ...rows.map((r) => r.value));
  return (
    <ol className="m-0 list-none p-0">
      {rows.map((row) => (
        <li key={row.key} className="grid grid-cols-[7.5em_1fr_auto] items-center gap-3 py-1 text-sm sm:grid-cols-[11em_1fr_auto]">
          <span className="truncate">{row.label}</span>
          <span className="relative block h-5" aria-hidden>
            <span
              className="absolute inset-y-0 left-0 rounded-r-[4px] bg-foreground"
              style={{ width: `${top > 0 ? Math.max(0.5, (Math.max(0, row.value) / top) * 100) : 0}%` }}
            />
          </span>
          <span className="figures whitespace-nowrap text-right text-muted-foreground">
            {format(row.value)}
            {row.note && <span className="ml-1 text-xs">(<L s={row.note} />)</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Formula({ text, companies }: { text: React.ReactNode; companies: number }) {
  return (
    <p className="mt-2 text-xs leading-5 text-muted-foreground">
      <span data-l="ja">計算値：{text}。{companies}社。
    </span><span data-l="en">Computed: {text}. {companies} companies.</span></p>
  );
}

/** The hub view: every industry side by side. */
export function IndustryFiguresOverview({ data }: { data: IndustryFiguresData }) {
  const { industries, totals } = data;
  const withMargin = industries.filter((i) => i.netProfitMargin);
  const withGrowth = industries.filter((i) => i.revenueGrowth5y);
  const withTop3 = industries.filter((i) => i.top3Share);
  const withOverseas = industries.filter((i) => i.overseasSalesRatio);
  const link = (i: IndustryFigures) => (
    <Link href={`/industries/${i.id}#figures`} className="hover:underline">
      <L s={i.name} />
    </Link>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
        <FigureCard label={<T m={{ ja: "売上高の合計", en: "Total revenue" }} />} value={formatYen(totals.revenue)} context={`${industries.reduce((a, i) => a + i.revenue.companies, 0)}社の最新期`} />
        <FigureCard label={<T m={{ ja: "純利益の合計", en: "Total net income" }} />} value={formatYen(totals.netIncome)} context={`純利益率 ${data.reference.netProfitMargin !== null ? percent(data.reference.netProfitMargin) : "—"}`} />
        <FigureCard label={<T m={{ ja: "5期の売上高の伸び", en: "Revenue growth over 5 years" }} />} value={data.reference.revenueGrowth5y !== null ? times(data.reference.revenueGrowth5y) : "—"} context={<T m={{ ja: "全社の中央値", en: "Median of all companies" }} />} />
        <FigureCard label={<T m={{ ja: "掲載企業", en: "Listed companies" }} />} value={`${totals.companies.toLocaleString("ja-JP")}社`} context={`${industries.length}業界・従業員 ${Math.round(totals.employees / 10000).toLocaleString("ja-JP")}万人`} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <Donut
          title={<T m={{ ja: "売上高の構成（業界別）", en: "Revenue breakdown (by industry)" }} />}
          parts={partsOf(industries.map((i) => ({ id: i.id, name: i.name, value: i.revenue.total })))}
          format={formatYen}
          centre={{ value: formatYen(totals.revenue).replace(/円$/, ""), label: "円・合計" }}
          hrefOf={(id) => `/industries/${id}#figures`}
        />
        <Donut
          title={<T m={{ ja: "従業員数の構成（業界別）", en: "Employees breakdown (by industry)" }} />}
          parts={partsOf(industries.map((i) => ({ id: i.id, name: i.name, value: i.employees.total })))}
          format={(v) => `${Math.round(v / 10000).toLocaleString("ja-JP")}万人`}
          centre={{ value: `${Math.round(totals.employees / 10000).toLocaleString("ja-JP")}万`, label: "人・合計" }}
          hrefOf={(id) => `/industries/${id}#figures`}
        />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 sm:grid-cols-4">
        <FigureCard label={<T m={{ ja: "総資産の合計", en: "Total assets (sum)" }} />} value={formatYen(totals.totalAssets)} context={`${industries.reduce((a, i) => a + i.totalAssets.companies, 0)}社の最新期`} />
        <FigureCard label={<T m={{ ja: "自己資本比率", en: "Equity ratio" }} />} value={data.reference.equityRatio !== null ? percent(data.reference.equityRatio) : "—"} context={<T m={{ ja: "純資産の合計 ÷ 総資産の合計", en: "Total net assets ÷ total assets" }} />} />
        <FigureCard label={<T m={{ ja: "従業員1人あたり売上高", en: "Revenue per employee" }} />} value={data.reference.revenuePerEmployee !== null ? manYen(data.reference.revenuePerEmployee) : "—"} context={<T m={{ ja: "売上高の合計 ÷ 従業員数の合計", en: "Total revenue ÷ total employees" }} />} />
        <FigureCard label={<T m={{ ja: "最新期が赤字の会社", en: "Companies with a loss in the latest fiscal year" }} />} value={`${totals.lossMaking}社`} context={`純利益を印字した${totals.withNetIncome}社のうち`} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <Donut
          title={<T m={{ ja: "純利益の構成（業界別）", en: "Net income breakdown (by industry)" }} />}
          parts={partsOf(industries.filter((i) => i.netIncome.total > 0).map((i) => ({ id: i.id, name: i.name, value: i.netIncome.total })))}
          format={formatYen}
          centre={{ value: formatYen(industries.filter((i) => i.netIncome.total > 0).reduce((a, i) => a + i.netIncome.total, 0)).replace(/円$/, ""), label: "円・黒字の業界" }}
          hrefOf={(id) => `/industries/${id}#figures`}
        />
        <Donut
          title={<T m={{ ja: "総資産の構成（業界別）", en: "Total assets breakdown (by industry)" }} />}
          parts={partsOf(industries.map((i) => ({ id: i.id, name: i.name, value: i.totalAssets.total })))}
          format={formatYen}
          centre={{ value: formatYen(totals.totalAssets).replace(/円$/, ""), label: "円・合計" }}
          hrefOf={(id) => `/industries/${id}#figures`}
        />
        <Donut
          title={<T m={{ ja: "売上高の規模別の会社数", en: "Companies by revenue size" }} />}
          parts={countParts(data.sizeBands)}
          format={(v) => `${v.toLocaleString("ja-JP")}社`}
          centre={{ value: `${data.sizeBands.reduce((a, b) => a + b.companies, 0)}`, label: "社" }}
        />
        <Donut
          title={<T m={{ ja: "会計基準別の会社数", en: "Companies by accounting standard" }} />}
          parts={countParts(data.standards)}
          format={(v) => `${v.toLocaleString("ja-JP")}社`}
          centre={{ value: `${data.standards.reduce((a, b) => a + b.companies, 0)}`, label: "社" }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <T m={{ ja: "純利益の構成は、純利益の合計がプラスの業界だけで描いています（マイナスの業界は円の一部にできないため）。総資産は銀行・保険など金融の会社が預金や保険契約の分だけ大きく出ます。", en: "The net income breakdown shows only industries with positive total net income (industries with negative totals can't be drawn as part of a circle). Total assets appear larger for financial companies such as banks and insurers, because of deposits and insurance contracts." }} />
      </p>

      <div className="mt-10">
        <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "業界の規模", en: "Industry size" }} /></h3>
        <p className="mt-1 text-sm text-muted-foreground"><T m={{ ja: "各社の最新期の売上高の合計。決算期は会社ごとに異なります。括弧は合計に入った会社数。", en: "Total of each company's revenue in its latest fiscal year. Fiscal year-ends differ by company. Figures in parentheses show the number of companies included in the total." }} /></p>
        <div className="mt-4">
          <Bars rows={industries.map((i) => ({ key: i.id, label: link(i), value: i.revenue.total, note: `${i.revenue.companies}社` }))} format={formatYen} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "純利益率", en: "Net margin" }} /></h3>
          <Formula text={<T m={{ ja: "純利益の合計 ÷ 売上高の合計（両方が印字された会社）", en: "Total net income ÷ total revenue (companies reporting both)" }} />} companies={withMargin.reduce((a, i) => a + i.netProfitMargin!.companies, 0)} />
          <div className="mt-3">
            <Bars rows={[...withMargin].sort((a, b) => b.netProfitMargin!.value - a.netProfitMargin!.value).map((i) => ({ key: i.id, label: link(i), value: i.netProfitMargin!.value }))} format={percent} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "5期の売上高の伸び", en: "Revenue growth over 5 years" }} /></h3>
          <Formula text={<T m={{ ja: "最新期の売上高 ÷ 5期前の売上高（会社ごと）の中央値。1.00倍が横ばい", en: "Median, across companies, of latest-fiscal-year revenue ÷ revenue 5 fiscal years earlier. 1.00x means flat." }} />} companies={withGrowth.reduce((a, i) => a + i.revenueGrowth5y!.companies, 0)} />
          <div className="mt-3">
            <Bars rows={[...withGrowth].sort((a, b) => b.revenueGrowth5y!.value - a.revenueGrowth5y!.value).map((i) => ({ key: i.id, label: link(i), value: i.revenueGrowth5y!.value }))} format={times} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "上位3社への集中", en: "Concentration in the top 3 companies" }} /></h3>
          <Formula text={<T m={{ ja: "売上高の上位3社の合計 ÷ 業界の売上高の合計。高いほど少数の会社に集まっている", en: "Total revenue of the top 3 companies by revenue ÷ total industry revenue. The higher it is, the more concentrated in a few companies." }} />} companies={withTop3.reduce((a, i) => a + i.top3Share!.companies, 0)} />
          <div className="mt-3">
            <Bars rows={[...withTop3].sort((a, b) => b.top3Share!.value - a.top3Share!.value).map((i) => ({ key: i.id, label: link(i), value: i.top3Share!.value }))} max={1} format={percent} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "海外売上高比率", en: "Overseas revenue ratio" }} /></h3>
          <Formula text={<T m={{ ja: "日本以外の売上高 ÷ 地域別売上高の合計（会社ごと）の中央値。地域別の情報を印字した会社だけ", en: "Median, across companies, of non-Japan revenue ÷ total revenue by region. Only companies reporting regional information." }} />} companies={withOverseas.reduce((a, i) => a + i.overseasSalesRatio!.companies, 0)} />
          <div className="mt-3">
            <Bars
              rows={[...withOverseas].sort((a, b) => b.overseasSalesRatio!.value - a.overseasSalesRatio!.value).map((i) => ({ key: i.id, label: link(i), value: i.overseasSalesRatio!.value, note: `${i.overseasSalesRatio!.companies}社` }))}
              max={1}
              format={percent}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "自己資本比率", en: "Equity ratio" }} /></h3>
          <Formula text={<T m={{ ja: "純資産の合計 ÷ 総資産の合計（両方が印字された会社）。借りたお金に頼らない度合い", en: "Total net assets ÷ total assets (companies reporting both). Shows how little it relies on borrowed money." }} />} companies={industries.reduce((a, i) => a + (i.equityRatio?.companies ?? 0), 0)} />
          <div className="mt-3">
            <Bars rows={industries.filter((i) => i.equityRatio).sort((a, b) => b.equityRatio!.value - a.equityRatio!.value).map((i) => ({ key: i.id, label: link(i), value: i.equityRatio!.value }))} max={1} format={percent} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "従業員1人あたり売上高", en: "Revenue per employee" }} /></h3>
          <Formula text={<T m={{ ja: "売上高の合計 ÷ 従業員数の合計（両方が印字された会社）。人手で稼ぐか、仕組みで稼ぐか", en: "Total revenue ÷ total employees (companies reporting both). Does it earn through people or through systems?" }} />} companies={industries.reduce((a, i) => a + (i.revenuePerEmployee?.companies ?? 0), 0)} />
          <div className="mt-3">
            <Bars rows={industries.filter((i) => i.revenuePerEmployee).sort((a, b) => b.revenuePerEmployee!.value - a.revenuePerEmployee!.value).map((i) => ({ key: i.id, label: link(i), value: i.revenuePerEmployee!.value }))} format={manYen} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "最新期が赤字の会社の割合", en: "Share of companies with a loss in the latest fiscal year" }} /></h3>
          <Formula text={<T m={{ ja: "純利益がマイナスの会社数 ÷ 純利益を印字した会社数", en: "Companies with negative net income ÷ companies reporting net income" }} />} companies={totals.withNetIncome} />
          <div className="mt-3">
            <Bars rows={industries.filter((i) => i.lossMaking.of > 0).sort((a, b) => b.lossMaking.companies / b.lossMaking.of - a.lossMaking.companies / a.lossMaking.of).map((i) => ({ key: i.id, label: link(i), value: i.lossMaking.companies / i.lossMaking.of, note: `${i.lossMaking.companies}/${i.lossMaking.of}社` }))} max={1} format={percent} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "平均年間給与の中央値", en: "Median average annual salary" }} /></h3>
          <Formula text={<T m={{ ja: "各社の平均年間給与（提出会社・印字どおり）の中央値。グループ全体ではなく、有価証券報告書を出した会社の値", en: "Median of each company's average annual salary (filing company only, as reported). Not the whole group; the value for the company that filed the annual securities report." }} />} companies={industries.reduce((a, i) => a + (i.salaryMedian?.companies ?? 0), 0)} />
          <div className="mt-3">
            <Bars rows={industries.filter((i) => i.salaryMedian).sort((a, b) => b.salaryMedian!.value - a.salaryMedian!.value).map((i) => ({ key: i.id, label: link(i), value: i.salaryMedian!.value, note: `${i.salaryMedian!.companies}社` }))} format={manYen} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "全業界の5期の推移（指数）", en: "5-year trend across all industries (index)" }} /></h3>
        <p className="mt-1 text-sm text-muted-foreground"><T m={{ ja: "5期前を100とした指数。項目ごとに、その項目が5期そろった会社だけを足し合わせています。", en: "Index with 5 fiscal years ago = 100. For each item, only companies with all 5 fiscal years of data for that item are summed." }} /></p>
        <div className="mt-4 max-w-2xl">
          <MultiIndexChart
            lines={[
              { series: data.index.all, name: `売上高（${data.index.all.companies}社）`, style: "strong" },
              { series: data.indexes.totalAssets.all, name: `総資産（${data.indexes.totalAssets.all.companies}社）`, style: "medium" },
              { series: data.indexes.employees.all, name: `従業員数（${data.indexes.employees.all.companies}社）`, style: "dashed" },
            ]}
          />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "業界ごとの5期の推移（指数）", en: "5-year trend by industry (index)" }} /></h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          <T m={{ ja: "5期そろった会社だけを同じ顔ぶれで足し合わせ、5期前を100とした指数。濃い線が業界、薄い線が全業界。右端の数字が最新期。", en: "Index with 5 fiscal years ago = 100, summing the same set of companies that have all 5 fiscal years of data. Dark line is the industry; light line is all industries. The number at the right edge is the latest fiscal year." }} />
        </p>
        <ChartTabs
          tabs={[
            { id: "revenue", label: <T m={{ ja: "売上高", en: "Revenue" }} /> },
            { id: "assets", label: <T m={{ ja: "総資産", en: "Total assets" }} /> },
            { id: "employees", label: <T m={{ ja: "従業員数", en: "Employees" }} /> },
          ]}
        >
          {[data.index, data.indexes.totalAssets, data.indexes.employees].map((set, k) => (
            <ul key={k} className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 lg:grid-cols-4">
              {set.industries.filter((s) => s.values.length === 5).map((s) => (
                <li key={s.id} className="min-w-0">
                  <p className="truncate text-sm">
                    <Link href={`/industries/${s.id}#figures`} className="hover:underline"><L s={s.name} /></Link>
                    <span className="figures ml-1 text-xs text-muted-foreground"><span data-l="ja">{s.companies}社</span><span data-l="en">{`${s.companies} companies`}</span></span>
                  </p>
                  <IndexSparkline series={s} reference={set.all} />
                </li>
              ))}
            </ul>
          ))}
        </ChartTabs>
      </div>

      <div className="mt-12">
        <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "業界別パフォーマンス", en: "Industry performance" }} /></h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground"><T m={{ ja: "各業界の値を、全業界の値と比べたもの。", en: "Each industry's values compared with the values for all industries." }} /></p>
        <PerformanceTable industries={industries} reference={data.reference} />
      </div>

      <details className="mt-10">
        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"><T m={{ ja: "表で見る（全指標）", en: "View as table (all metrics)" }} /></summary>
        <div className="mt-4 overflow-x-auto">
          <table className="figures w-full min-w-[56rem] text-sm">
            <thead>
              <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium"><T m={{ ja: "業界", en: "Industry" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "企業", en: "Companies" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "売上高", en: "Revenue" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "純利益率", en: "Net margin" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "5期の伸び", en: "5-year growth" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "上位3社", en: "Top 3 companies" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "海外比率", en: "Overseas ratio" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "自己資本比率", en: "Equity ratio" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "1人あたり売上", en: "Revenue per employee" }} /></th>
                <th className="py-2 pr-3 text-right font-medium"><T m={{ ja: "赤字", en: "Loss-making" }} /></th>
                <th className="py-2 text-right font-medium"><T m={{ ja: "従業員", en: "Employees" }} /></th>
              </tr>
            </thead>
            <tbody>
              {industries.map((i) => (
                <tr key={i.id} className="border-b border-border">
                  <td className="py-2 pr-3">{link(i)}</td>
                  <td className="py-2 pr-3 text-right">{i.companies}</td>
                  <td className="py-2 pr-3 text-right"><F s={formatYen(i.revenue.total)} /></td>
                  <td className="py-2 pr-3 text-right">{i.netProfitMargin ? percent(i.netProfitMargin.value) : "—"}</td>
                  <td className="py-2 pr-3 text-right">{i.revenueGrowth5y ? times(i.revenueGrowth5y.value) : "—"}</td>
                  <td className="py-2 pr-3 text-right">{i.top3Share ? percent(i.top3Share.value) : "—"}</td>
                  <td className="py-2 pr-3 text-right">{i.overseasSalesRatio ? `${percent(i.overseasSalesRatio.value)} (${i.overseasSalesRatio.companies})` : "—"}</td>
                  <td className="py-2 pr-3 text-right">{i.equityRatio ? percent(i.equityRatio.value) : "—"}</td>
                  <td className="py-2 pr-3 text-right">{i.revenuePerEmployee ? manYen(i.revenuePerEmployee.value) : "—"}</td>
                  <td className="py-2 pr-3 text-right">{i.lossMaking.of > 0 ? `${i.lossMaking.companies}/${i.lossMaking.of}` : "—"}</td>
                  <td className="py-2 text-right">{i.employees.companies > 0 ? `${Math.round(i.employees.total / 10000).toLocaleString("ja-JP")}万人` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="mt-8 text-xs leading-5 text-muted-foreground">
        <T m={{ ja: "掲載企業の有価証券報告書に印字された数値を、そのまま足し合わせ、割り算したものです。推定や補間はしていません。数値の無い会社は、その項目の合計から外しています。株価や投資指標は扱いません。出典は各企業のページにあります。", en: "Figures printed in the annual securities reports of listed companies are summed and divided as they are. No estimates or interpolation are used. Companies without a figure are excluded from the total for that item. Stock prices and investment indicators are not covered. Sources are on each company's page." }} />
      </p>
    </div>
  );
}

function SizeBars({ rows, format }: { rows: SizeRow[]; format: (v: number) => string }) {
  return (
    <Bars
      rows={rows.map((c) => ({
        key: c.id,
        label: (
          <Link href={`/companies/${c.id}`} className="hover:underline">
            <L s={c.name} />
          </Link>
        ),
        value: c.value,
      }))}
      format={format}
    />
  );
}

/** Donut parts for the largest companies of one figure, plus the rest of the industry as ほかN社. */
function companyParts(rows: SizeRow[], total: number, companies: number) {
  const rest = total - rows.reduce((a, c) => a + c.value, 0);
  return partsOf([...rows.map((c) => ({ id: c.id, name: c.name, value: c.value })), ...(rest > 0 ? [{ id: "other", name: `ほか${companies - rows.length}社`, value: rest }] : [])]);
}

/**
 * One industry's block, on its own page: the figures against the all-industry reference, five ways of splitting the
 * industry (by company for revenue and headcount, by size, by accounting standard, Japan against abroad), the
 * five-year indexes of revenue, assets and headcount together, and the largest companies by each size measure.
 */
export function IndustryFiguresBlock({
  figures,
  reference,
  index,
  all,
  assetsIndex,
  employeesIndex,
}: {
  figures: IndustryFigures;
  reference: IndustryFiguresData["reference"];
  index: IndexSeries | null;
  all: IndexSeries;
  assetsIndex: IndexSeries | null;
  employeesIndex: IndexSeries | null;
}) {
  const revenueParts = companyParts(figures.ranking.map((c) => ({ id: c.id, name: c.name, value: c.revenue })), figures.revenue.total, figures.revenue.companies);
  const employeeParts = companyParts(figures.rankingByEmployees, figures.employees.total, figures.employees.companies);
  const yen = (v: number) => formatYen(v);
  const lossShare = figures.lossMaking.of > 0 ? figures.lossMaking.companies / figures.lossMaking.of : null;
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3">
        <FigureCard label={<T m={{ ja: "売上高の合計", en: "Total revenue" }} />} value={formatYen(figures.revenue.total)} context={`${figures.revenue.companies}社の最新期`} />
        <FigureCard label={<T m={{ ja: "純利益の合計", en: "Total net income" }} />} value={formatYen(figures.netIncome.total)} context={`${figures.netIncome.companies}社`} />
        <FigureCard
          label={<T m={{ ja: "純利益率", en: "Net margin" }} />}
          value={figures.netProfitMargin ? percent(figures.netProfitMargin.value) : "—"}
          delta={figures.netProfitMargin && reference.netProfitMargin !== null ? deltaAgainst(figures.netProfitMargin.value, reference.netProfitMargin, (v) => percent(v), "全業界") : null}
          context={figures.netProfitMargin ? `${figures.netProfitMargin.companies}社` : undefined}
        />
        <FigureCard
          label={<T m={{ ja: "5期の売上高の伸び", en: "Revenue growth over 5 years" }} />}
          value={figures.revenueGrowth5y ? times(figures.revenueGrowth5y.value) : "—"}
          delta={figures.revenueGrowth5y && reference.revenueGrowth5y !== null ? deltaAgainst(figures.revenueGrowth5y.value, reference.revenueGrowth5y, (v) => `${v.toFixed(2)}倍`, "全業界") : null}
          context={figures.revenueGrowth5y ? `${figures.revenueGrowth5y.companies}社の中央値` : undefined}
        />
        <FigureCard
          label={<T m={{ ja: "自己資本比率", en: "Equity ratio" }} />}
          value={figures.equityRatio ? percent(figures.equityRatio.value) : "—"}
          delta={figures.equityRatio && reference.equityRatio !== null ? deltaAgainst(figures.equityRatio.value, reference.equityRatio, (v) => percent(v), "全業界") : null}
          context={figures.equityRatio ? `${figures.equityRatio.companies}社` : undefined}
        />
        <FigureCard
          label={<T m={{ ja: "従業員1人あたり売上高", en: "Revenue per employee" }} />}
          value={figures.revenuePerEmployee ? manYen(figures.revenuePerEmployee.value) : "—"}
          delta={figures.revenuePerEmployee && reference.revenuePerEmployee !== null ? deltaAgainst(figures.revenuePerEmployee.value, reference.revenuePerEmployee, manYen, "全業界") : null}
          context={figures.revenuePerEmployee ? `${figures.revenuePerEmployee.companies}社` : undefined}
        />
        <FigureCard label={<T m={{ ja: "上位3社への集中", en: "Concentration in the top 3 companies" }} />} value={figures.top3Share ? percent(figures.top3Share.value) : "—"} context={figures.top3Share ? `${figures.top3Share.companies}社` : undefined} />
        <FigureCard label={<T m={{ ja: "海外売上高比率", en: "Overseas revenue ratio" }} />} value={figures.overseasSalesRatio ? percent(figures.overseasSalesRatio.value) : "—"} context={figures.overseasSalesRatio ? `${figures.overseasSalesRatio.companies}社の中央値` : "地域別の情報が無い"} />
        <FigureCard label={<T m={{ ja: "最新期が赤字の会社", en: "Companies with a loss in the latest fiscal year" }} />} value={`${figures.lossMaking.companies}社`} context={lossShare !== null ? `${figures.lossMaking.of}社のうち ${percent(lossShare)}` : undefined} />
        <FigureCard label={<T m={{ ja: "売上高の中央値", en: "Median revenue" }} />} value={figures.revenueMedian !== null ? formatYen(figures.revenueMedian) : "—"} context={<T m={{ ja: "真ん中の会社の大きさ", en: "Size of the middle company" }} />} />
        <FigureCard label={<T m={{ ja: "平均年間給与の中央値", en: "Median average annual salary" }} />} value={figures.salaryMedian ? manYen(figures.salaryMedian.value) : "—"} context={figures.salaryMedian ? `${figures.salaryMedian.companies}社・提出会社` : undefined} />
        <FigureCard label={<T m={{ ja: "従業員数の合計", en: "Total employees" }} />} value={figures.employees.companies > 0 ? people(figures.employees.total) : "—"} context={figures.employees.companies > 0 ? `${figures.employees.companies}社` : undefined} />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <T m={{ ja: "計算値：純利益率＝純利益の合計 ÷ 売上高の合計。5期の伸び＝最新期の売上高 ÷ 5期前の売上高。自己資本比率＝純資産の合計 ÷ 総資産の合計。1人あたり売上高＝売上高の合計 ÷ 従業員数の合計。上位3社＝売上高の上位3社の合計 ÷ 業界の合計。海外比率＝日本以外の売上高 ÷ 地域別売上高の合計。給与は各社が印字した提出会社の平均年間給与。各社の最新期を使い、決算期は会社ごとに異なります。▲▼は全業界の値との比較で、良し悪しの判定ではありません。", en: "Computed: Net margin = total net income ÷ total revenue. 5-year growth = latest fiscal year revenue ÷ revenue 5 fiscal years ago. Equity ratio = total net assets ÷ total assets. Revenue per employee = total revenue ÷ total employees. Top 3 = total revenue of the top 3 companies by revenue ÷ industry total. Overseas ratio = revenue outside Japan ÷ total revenue by region. Salary is the average annual salary of the filing company as printed by each company. Each company's latest fiscal year is used, and fiscal year-ends differ by company. ▲▼ show comparison with the all-industry value and are not a judgment of good or bad." }} />
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {revenueParts.length > 0 && (
          <Donut title={`${figures.name}業界の売上高の構成`} parts={revenueParts} format={yen} centre={{ value: `${figures.revenue.companies}社`, label: figures.name }} hrefOf={(id) => `/companies/${id}`} />
        )}
        {employeeParts.length > 1 && (
          <Donut title={`${figures.name}業界の従業員数の構成`} parts={employeeParts} format={people} centre={{ value: people(figures.employees.total).replace(/人$/, ""), label: "人・合計" }} hrefOf={(id) => `/companies/${id}`} />
        )}
        {figures.sizeBands.length > 1 && (
          <Donut title="売上高の規模別の会社数" parts={countParts(figures.sizeBands)} format={(v) => `${v}社`} centre={{ value: `${figures.sizeBands.reduce((a, b) => a + b.companies, 0)}`, label: "社" }} />
        )}
        {figures.domesticOverseas && figures.domesticOverseas.overseas > 0 && (
          <Donut
            title={<T m={{ ja: "売上高の国内・海外", en: "Revenue: domestic and overseas" }} />}
            parts={[
              { id: "domestic", name: "日本", value: figures.domesticOverseas.domestic, share: figures.domesticOverseas.domestic / (figures.domesticOverseas.domestic + figures.domesticOverseas.overseas) },
              { id: "overseas", name: "日本以外", value: figures.domesticOverseas.overseas, share: figures.domesticOverseas.overseas / (figures.domesticOverseas.domestic + figures.domesticOverseas.overseas) },
            ]}
            format={yen}
            centre={{ value: `${figures.domesticOverseas.companies}社`, label: "地域別を印字" }}
          />
        )}
        {figures.standards.length > 1 && (
          <Donut title="会計基準別の会社数" parts={countParts(figures.standards)} format={(v) => `${v}社`} centre={{ value: `${figures.standards.reduce((a, b) => a + b.companies, 0)}`, label: "社" }} />
        )}
      </div>
      {figures.domesticOverseas && (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          <span data-l="ja">国内・海外は、地域ごとの情報を印字した{figures.domesticOverseas.companies}社の金額の合計（日本と、それ以外の地域の合計）。会社により売上高・売上収益など項目名と決算期が異なります。
        </span><span data-l="en">Domestic and overseas are the total amounts of the {figures.domesticOverseas.companies} companies that print regional information (Japan, and the total of all other regions). Item names such as revenue and fiscal year-ends differ by company.</span></p>
      )}

      {index && index.values.length === 5 && (
        <div className="mt-10">
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "5期の推移（指数）", en: "5-year trend (index)" }} /></h3>
          <p className="mt-1 text-sm text-muted-foreground"><span data-l="ja">5期前＝100。項目ごとに、その項目が5期そろった会社の合計。細い線は全業界の売上高（{all.companies}社）。</span><span data-l="en">5 fiscal years ago = 100. For each item, the total of companies with all 5 fiscal years of data for that item. The thin line is revenue for all industries ({all.companies} companies).</span></p>
          <div className="mt-4 max-w-2xl">
            <MultiIndexChart
              lines={[
                { series: index, name: `売上高（${index.companies}社）`, style: "strong" },
                ...(assetsIndex ? [{ series: assetsIndex, name: `総資産（${assetsIndex.companies}社）`, style: "medium" as const }] : []),
                ...(employeesIndex ? [{ series: employeesIndex, name: `従業員数（${employeesIndex.companies}社）`, style: "dashed" as const }] : []),
                { series: all, name: "全業界の売上高", style: "faint" },
              ]}
            />
          </div>
        </div>
      )}

      {figures.ranking.length > 0 && (
        <div className="mt-10">
          <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "大きい順", en: "Largest first" }} /></h3>
          <p className="mt-1 mb-4 text-sm text-muted-foreground"><T m={{ ja: "最新期の印字どおりの数値。売上高の括弧は純利益率と、5期の売上高の伸び。", en: "Figures as printed for the latest fiscal year. The figures in parentheses for revenue are net margin and 5-year revenue growth." }} /></p>
          <ChartTabs
            tabs={[
              { id: "revenue", label: <T m={{ ja: "売上高", en: "Revenue" }} /> },
              ...(figures.rankingByEmployees.length > 0 ? [{ id: "employees", label: <T m={{ ja: "従業員数", en: "Employees" }} /> }] : []),
              ...(figures.rankingByAssets.length > 0 ? [{ id: "assets", label: <T m={{ ja: "総資産", en: "Total assets" }} /> }] : []),
            ]}
          >
            {[
              <Bars
                key="revenue"
                rows={figures.ranking.map((c) => ({
                  key: c.id,
                  label: (
                    <Link href={`/companies/${c.id}`} className="hover:underline">
                      <L s={c.name} />
                    </Link>
                  ),
                  value: c.revenue,
                  note: [c.netProfitMargin !== null ? percent(c.netProfitMargin) : null, c.revenueGrowth5y !== null ? times(c.revenueGrowth5y) : null].filter(Boolean).join("・") || undefined,
                }))}
                format={formatYen}
              />,
              ...(figures.rankingByEmployees.length > 0 ? [<SizeBars key="employees" rows={figures.rankingByEmployees} format={people} />] : []),
              ...(figures.rankingByAssets.length > 0 ? [<SizeBars key="assets" rows={figures.rankingByAssets} format={formatYen} />] : []),
            ]}
          </ChartTabs>
        </div>
      )}
    </div>
  );
}
