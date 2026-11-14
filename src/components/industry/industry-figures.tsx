import Link from "next/link";
import { ChartTabs } from "@/components/company/chart-tabs";
import { countParts, deltaAgainst, Donut, FigureCard, IndexSparkline, MultiIndexChart, partsOf, PerformanceTable } from "@/components/industry/industry-charts";
import type { IndexSeries, IndustryFigures, IndustryFiguresData, SizeRow } from "@/lib/industry-figures";
import { formatYen } from "@/lib/utils/format";

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
            {row.note && <span className="ml-1 text-xs">({row.note})</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Formula({ text, companies }: { text: string; companies: number }) {
  return (
    <p className="mt-2 text-xs leading-5 text-muted-foreground">
      計算値：{text}。{companies}社。
    </p>
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
      {i.name}
    </Link>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
        <FigureCard label="売上高の合計" value={formatYen(totals.revenue)} context={`${industries.reduce((a, i) => a + i.revenue.companies, 0)}社の最新期`} />
        <FigureCard label="純利益の合計" value={formatYen(totals.netIncome)} context={`純利益率 ${data.reference.netProfitMargin !== null ? percent(data.reference.netProfitMargin) : "—"}`} />
        <FigureCard label="5期の売上高の伸び" value={data.reference.revenueGrowth5y !== null ? times(data.reference.revenueGrowth5y) : "—"} context="全社の中央値" />
        <FigureCard label="掲載企業" value={`${totals.companies.toLocaleString("ja-JP")}社`} context={`${industries.length}業界・従業員 ${Math.round(totals.employees / 10000).toLocaleString("ja-JP")}万人`} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <Donut
          title="売上高の構成（業界別）"
          parts={partsOf(industries.map((i) => ({ id: i.id, name: i.name, value: i.revenue.total })))}
          format={formatYen}
          centre={{ value: formatYen(totals.revenue).replace(/円$/, ""), label: "円・合計" }}
          hrefOf={(id) => `/industries/${id}#figures`}
        />
        <Donut
          title="従業員数の構成（業界別）"
          parts={partsOf(industries.map((i) => ({ id: i.id, name: i.name, value: i.employees.total })))}
          format={(v) => `${Math.round(v / 10000).toLocaleString("ja-JP")}万人`}
          centre={{ value: `${Math.round(totals.employees / 10000).toLocaleString("ja-JP")}万`, label: "人・合計" }}
          hrefOf={(id) => `/industries/${id}#figures`}
        />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 sm:grid-cols-4">
        <FigureCard label="総資産の合計" value={formatYen(totals.totalAssets)} context={`${industries.reduce((a, i) => a + i.totalAssets.companies, 0)}社の最新期`} />
        <FigureCard label="自己資本比率" value={data.reference.equityRatio !== null ? percent(data.reference.equityRatio) : "—"} context="純資産の合計 ÷ 総資産の合計" />
        <FigureCard label="従業員1人あたり売上高" value={data.reference.revenuePerEmployee !== null ? manYen(data.reference.revenuePerEmployee) : "—"} context="売上高の合計 ÷ 従業員数の合計" />
        <FigureCard label="最新期が赤字の会社" value={`${totals.lossMaking}社`} context={`純利益を印字した${totals.withNetIncome}社のうち`} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <Donut
          title="純利益の構成（業界別）"
          parts={partsOf(industries.filter((i) => i.netIncome.total > 0).map((i) => ({ id: i.id, name: i.name, value: i.netIncome.total })))}
          format={formatYen}
          centre={{ value: formatYen(industries.filter((i) => i.netIncome.total > 0).reduce((a, i) => a + i.netIncome.total, 0)).replace(/円$/, ""), label: "円・黒字の業界" }}
          hrefOf={(id) => `/industries/${id}#figures`}
        />
        <Donut
          title="総資産の構成（業界別）"
          parts={partsOf(industries.map((i) => ({ id: i.id, name: i.name, value: i.totalAssets.total })))}
          format={formatYen}
          centre={{ value: formatYen(totals.totalAssets).replace(/円$/, ""), label: "円・合計" }}
          hrefOf={(id) => `/industries/${id}#figures`}
        />
        <Donut
          title="売上高の規模別の会社数"
          parts={countParts(data.sizeBands)}
          format={(v) => `${v.toLocaleString("ja-JP")}社`}
          centre={{ value: `${data.sizeBands.reduce((a, b) => a + b.companies, 0)}`, label: "社" }}
        />
        <Donut
          title="会計基準別の会社数"
          parts={countParts(data.standards)}
          format={(v) => `${v.toLocaleString("ja-JP")}社`}
          centre={{ value: `${data.standards.reduce((a, b) => a + b.companies, 0)}`, label: "社" }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        純利益の構成は、純利益の合計がプラスの業界だけで描いています（マイナスの業界は円の一部にできないため）。総資産は銀行・保険など金融の会社が預金や保険契約の分だけ大きく出ます。
      </p>

      <div className="mt-10">
        <h3 className="font-serif text-lg font-semibold">業界の規模</h3>
        <p className="mt-1 text-sm text-muted-foreground">各社の最新期の売上高の合計。決算期は会社ごとに異なります。括弧は合計に入った会社数。</p>
        <div className="mt-4">
          <Bars rows={industries.map((i) => ({ key: i.id, label: link(i), value: i.revenue.total, note: `${i.revenue.companies}社` }))} format={formatYen} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-lg font-semibold">純利益率</h3>
          <Formula text="純利益の合計 ÷ 売上高の合計（両方が印字された会社）" companies={withMargin.reduce((a, i) => a + i.netProfitMargin!.companies, 0)} />
          <div className="mt-3">
            <Bars rows={[...withMargin].sort((a, b) => b.netProfitMargin!.value - a.netProfitMargin!.value).map((i) => ({ key: i.id, label: link(i), value: i.netProfitMargin!.value }))} format={percent} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">5期の売上高の伸び</h3>
          <Formula text="最新期の売上高 ÷ 5期前の売上高（会社ごと）の中央値。1.00倍が横ばい" companies={withGrowth.reduce((a, i) => a + i.revenueGrowth5y!.companies, 0)} />
          <div className="mt-3">
            <Bars rows={[...withGrowth].sort((a, b) => b.revenueGrowth5y!.value - a.revenueGrowth5y!.value).map((i) => ({ key: i.id, label: link(i), value: i.revenueGrowth5y!.value }))} format={times} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">上位3社への集中</h3>
          <Formula text="売上高の上位3社の合計 ÷ 業界の売上高の合計。高いほど少数の会社に集まっている" companies={withTop3.reduce((a, i) => a + i.top3Share!.companies, 0)} />
          <div className="mt-3">
            <Bars rows={[...withTop3].sort((a, b) => b.top3Share!.value - a.top3Share!.value).map((i) => ({ key: i.id, label: link(i), value: i.top3Share!.value }))} max={1} format={percent} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">海外売上高比率</h3>
          <Formula text="日本以外の売上高 ÷ 地域別売上高の合計（会社ごと）の中央値。地域別の情報を印字した会社だけ" companies={withOverseas.reduce((a, i) => a + i.overseasSalesRatio!.companies, 0)} />
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
          <h3 className="font-serif text-lg font-semibold">自己資本比率</h3>
          <Formula text="純資産の合計 ÷ 総資産の合計（両方が印字された会社）。借りたお金に頼らない度合い" companies={industries.reduce((a, i) => a + (i.equityRatio?.companies ?? 0), 0)} />
          <div className="mt-3">
            <Bars rows={industries.filter((i) => i.equityRatio).sort((a, b) => b.equityRatio!.value - a.equityRatio!.value).map((i) => ({ key: i.id, label: link(i), value: i.equityRatio!.value }))} max={1} format={percent} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">従業員1人あたり売上高</h3>
          <Formula text="売上高の合計 ÷ 従業員数の合計（両方が印字された会社）。人手で稼ぐか、仕組みで稼ぐか" companies={industries.reduce((a, i) => a + (i.revenuePerEmployee?.companies ?? 0), 0)} />
          <div className="mt-3">
            <Bars rows={industries.filter((i) => i.revenuePerEmployee).sort((a, b) => b.revenuePerEmployee!.value - a.revenuePerEmployee!.value).map((i) => ({ key: i.id, label: link(i), value: i.revenuePerEmployee!.value }))} format={manYen} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">最新期が赤字の会社の割合</h3>
          <Formula text="純利益がマイナスの会社数 ÷ 純利益を印字した会社数" companies={totals.withNetIncome} />
          <div className="mt-3">
            <Bars rows={industries.filter((i) => i.lossMaking.of > 0).sort((a, b) => b.lossMaking.companies / b.lossMaking.of - a.lossMaking.companies / a.lossMaking.of).map((i) => ({ key: i.id, label: link(i), value: i.lossMaking.companies / i.lossMaking.of, note: `${i.lossMaking.companies}/${i.lossMaking.of}社` }))} max={1} format={percent} />
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">平均年間給与の中央値</h3>
          <Formula text="各社の平均年間給与（提出会社・印字どおり）の中央値。グループ全体ではなく、有価証券報告書を出した会社の値" companies={industries.reduce((a, i) => a + (i.salaryMedian?.companies ?? 0), 0)} />
          <div className="mt-3">
            <Bars rows={industries.filter((i) => i.salaryMedian).sort((a, b) => b.salaryMedian!.value - a.salaryMedian!.value).map((i) => ({ key: i.id, label: link(i), value: i.salaryMedian!.value, note: `${i.salaryMedian!.companies}社` }))} format={manYen} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-serif text-lg font-semibold">全業界の5期の推移（指数）</h3>
        <p className="mt-1 text-sm text-muted-foreground">5期前を100とした指数。項目ごとに、その項目が5期そろった会社だけを足し合わせています。</p>
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
        <h3 className="font-serif text-lg font-semibold">業界ごとの5期の推移（指数）</h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          5期そろった会社だけを同じ顔ぶれで足し合わせ、5期前を100とした指数。濃い線が業界、薄い線が全業界。右端の数字が最新期。
        </p>
        <ChartTabs
          tabs={[
            { id: "revenue", label: "売上高" },
            { id: "assets", label: "総資産" },
            { id: "employees", label: "従業員数" },
          ]}
        >
          {[data.index, data.indexes.totalAssets, data.indexes.employees].map((set, k) => (
            <ul key={k} className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 lg:grid-cols-4">
              {set.industries.filter((s) => s.values.length === 5).map((s) => (
                <li key={s.id} className="min-w-0">
                  <p className="truncate text-sm">
                    <Link href={`/industries/${s.id}#figures`} className="hover:underline">{s.name}</Link>
                    <span className="figures ml-1 text-xs text-muted-foreground">{s.companies}社</span>
                  </p>
                  <IndexSparkline series={s} reference={set.all} />
                </li>
              ))}
            </ul>
          ))}
        </ChartTabs>
      </div>

      <div className="mt-12">
        <h3 className="font-serif text-lg font-semibold">業界別パフォーマンス</h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">各業界の値を、全業界の値と比べたもの。</p>
        <PerformanceTable industries={industries} reference={data.reference} />
      </div>

      <details className="mt-10">
        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">表で見る（全指標）</summary>
        <div className="mt-4 overflow-x-auto">
          <table className="figures w-full min-w-[56rem] text-sm">
            <thead>
              <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">業界</th>
                <th className="py-2 pr-3 text-right font-medium">企業</th>
                <th className="py-2 pr-3 text-right font-medium">売上高</th>
                <th className="py-2 pr-3 text-right font-medium">純利益率</th>
                <th className="py-2 pr-3 text-right font-medium">5期の伸び</th>
                <th className="py-2 pr-3 text-right font-medium">上位3社</th>
                <th className="py-2 pr-3 text-right font-medium">海外比率</th>
                <th className="py-2 pr-3 text-right font-medium">自己資本比率</th>
                <th className="py-2 pr-3 text-right font-medium">1人あたり売上</th>
                <th className="py-2 pr-3 text-right font-medium">赤字</th>
                <th className="py-2 text-right font-medium">従業員</th>
              </tr>
            </thead>
            <tbody>
              {industries.map((i) => (
                <tr key={i.id} className="border-b border-border">
                  <td className="py-2 pr-3">{link(i)}</td>
                  <td className="py-2 pr-3 text-right">{i.companies}</td>
                  <td className="py-2 pr-3 text-right">{formatYen(i.revenue.total)}</td>
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
        掲載企業の有価証券報告書に印字された数値を、そのまま足し合わせ、割り算したものです。推定や補間はしていません。数値の無い会社は、その項目の合計から外しています。株価や投資指標は扱いません。出典は各企業のページにあります。
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
            {c.name}
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
        <FigureCard label="売上高の合計" value={formatYen(figures.revenue.total)} context={`${figures.revenue.companies}社の最新期`} />
        <FigureCard label="純利益の合計" value={formatYen(figures.netIncome.total)} context={`${figures.netIncome.companies}社`} />
        <FigureCard
          label="純利益率"
          value={figures.netProfitMargin ? percent(figures.netProfitMargin.value) : "—"}
          delta={figures.netProfitMargin && reference.netProfitMargin !== null ? deltaAgainst(figures.netProfitMargin.value, reference.netProfitMargin, (v) => percent(v), "全業界") : null}
          context={figures.netProfitMargin ? `${figures.netProfitMargin.companies}社` : undefined}
        />
        <FigureCard
          label="5期の売上高の伸び"
          value={figures.revenueGrowth5y ? times(figures.revenueGrowth5y.value) : "—"}
          delta={figures.revenueGrowth5y && reference.revenueGrowth5y !== null ? deltaAgainst(figures.revenueGrowth5y.value, reference.revenueGrowth5y, (v) => `${v.toFixed(2)}倍`, "全業界") : null}
          context={figures.revenueGrowth5y ? `${figures.revenueGrowth5y.companies}社の中央値` : undefined}
        />
        <FigureCard
          label="自己資本比率"
          value={figures.equityRatio ? percent(figures.equityRatio.value) : "—"}
          delta={figures.equityRatio && reference.equityRatio !== null ? deltaAgainst(figures.equityRatio.value, reference.equityRatio, (v) => percent(v), "全業界") : null}
          context={figures.equityRatio ? `${figures.equityRatio.companies}社` : undefined}
        />
        <FigureCard
          label="従業員1人あたり売上高"
          value={figures.revenuePerEmployee ? manYen(figures.revenuePerEmployee.value) : "—"}
          delta={figures.revenuePerEmployee && reference.revenuePerEmployee !== null ? deltaAgainst(figures.revenuePerEmployee.value, reference.revenuePerEmployee, manYen, "全業界") : null}
          context={figures.revenuePerEmployee ? `${figures.revenuePerEmployee.companies}社` : undefined}
        />
        <FigureCard label="上位3社への集中" value={figures.top3Share ? percent(figures.top3Share.value) : "—"} context={figures.top3Share ? `${figures.top3Share.companies}社` : undefined} />
        <FigureCard label="海外売上高比率" value={figures.overseasSalesRatio ? percent(figures.overseasSalesRatio.value) : "—"} context={figures.overseasSalesRatio ? `${figures.overseasSalesRatio.companies}社の中央値` : "地域別の情報が無い"} />
        <FigureCard label="最新期が赤字の会社" value={`${figures.lossMaking.companies}社`} context={lossShare !== null ? `${figures.lossMaking.of}社のうち ${percent(lossShare)}` : undefined} />
        <FigureCard label="売上高の中央値" value={figures.revenueMedian !== null ? formatYen(figures.revenueMedian) : "—"} context="真ん中の会社の大きさ" />
        <FigureCard label="平均年間給与の中央値" value={figures.salaryMedian ? manYen(figures.salaryMedian.value) : "—"} context={figures.salaryMedian ? `${figures.salaryMedian.companies}社・提出会社` : undefined} />
        <FigureCard label="従業員数の合計" value={figures.employees.companies > 0 ? people(figures.employees.total) : "—"} context={figures.employees.companies > 0 ? `${figures.employees.companies}社` : undefined} />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        計算値：純利益率＝純利益の合計 ÷ 売上高の合計。5期の伸び＝最新期の売上高 ÷ 5期前の売上高。自己資本比率＝純資産の合計 ÷ 総資産の合計。1人あたり売上高＝売上高の合計 ÷ 従業員数の合計。上位3社＝売上高の上位3社の合計 ÷ 業界の合計。海外比率＝日本以外の売上高 ÷ 地域別売上高の合計。給与は各社が印字した提出会社の平均年間給与。各社の最新期を使い、決算期は会社ごとに異なります。▲▼は全業界の値との比較で、良し悪しの判定ではありません。
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
            title="売上高の国内・海外"
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
          国内・海外は、地域ごとの情報を印字した{figures.domesticOverseas.companies}社の金額の合計（日本と、それ以外の地域の合計）。会社により売上高・売上収益など項目名と決算期が異なります。
        </p>
      )}

      {index && index.values.length === 5 && (
        <div className="mt-10">
          <h3 className="font-serif text-lg font-semibold">5期の推移（指数）</h3>
          <p className="mt-1 text-sm text-muted-foreground">5期前＝100。項目ごとに、その項目が5期そろった会社の合計。細い線は全業界の売上高（{all.companies}社）。</p>
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
          <h3 className="font-serif text-lg font-semibold">大きい順</h3>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">最新期の印字どおりの数値。売上高の括弧は純利益率と、5期の売上高の伸び。</p>
          <ChartTabs
            tabs={[
              { id: "revenue", label: "売上高" },
              ...(figures.rankingByEmployees.length > 0 ? [{ id: "employees", label: "従業員数" }] : []),
              ...(figures.rankingByAssets.length > 0 ? [{ id: "assets", label: "総資産" }] : []),
            ]}
          >
            {[
              <Bars
                key="revenue"
                rows={figures.ranking.map((c) => ({
                  key: c.id,
                  label: (
                    <Link href={`/companies/${c.id}`} className="hover:underline">
                      {c.name}
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
