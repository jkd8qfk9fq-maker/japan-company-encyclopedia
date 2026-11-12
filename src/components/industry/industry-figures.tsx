import Link from "next/link";
import { deltaAgainst, Donut, FigureCard, IndexSparkline, partsOf, PerformanceTable } from "@/components/industry/industry-charts";
import type { IndexSeries, IndustryFigures, IndustryFiguresData } from "@/lib/industry-figures";
import { formatYen } from "@/lib/utils/format";

/**
 * The industry figures (JCE-041), drawn on the server: ranked bars, one hue, widest first, the value at the tip.
 * No script, no chart library — a bar is a div whose width is the share of the largest value, so the page stays
 * plain HTML and reads the same with styles off (the value is in the text). Every ratio prints its formula, and
 * every sum says how many companies it adds up, so a reader never takes a partial sum for the whole.
 */

const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
const times = (value: number) => `${value.toFixed(2)}倍`;

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
        />
        <Donut
          title="従業員数の構成（業界別）"
          parts={partsOf(industries.map((i) => ({ id: i.id, name: i.name, value: i.employees.total })))}
          format={(v) => `${Math.round(v / 10000).toLocaleString("ja-JP")}万人`}
          centre={{ value: `${Math.round(totals.employees / 10000).toLocaleString("ja-JP")}万`, label: "人・合計" }}
        />
      </div>

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

      <div className="mt-12">
        <h3 className="font-serif text-lg font-semibold">5期の売上高の推移（指数）</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          5期そろった会社だけを同じ顔ぶれで足し合わせ、5期前を100とした指数。濃い線が業界、薄い線が全業界（{data.index.all.companies}社）。右端の数字が最新期。
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 lg:grid-cols-4">
          {data.index.industries.filter((s) => s.values.length === 5).map((s) => (
            <li key={s.id} className="min-w-0">
              <p className="truncate text-sm">
                <Link href={`/industries/${s.id}#figures`} className="hover:underline">{s.name}</Link>
                <span className="figures ml-1 text-xs text-muted-foreground">{s.companies}社</span>
              </p>
              <IndexSparkline series={s} reference={data.index.all} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h3 className="font-serif text-lg font-semibold">業界別パフォーマンス</h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">各業界の値を、全業界の値と比べたもの。</p>
        <PerformanceTable industries={industries} reference={data.reference} />
      </div>

      <details className="mt-10">
        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">表で見る（全指標）</summary>
        <div className="mt-4 overflow-x-auto">
          <table className="figures w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">業界</th>
                <th className="py-2 pr-3 text-right font-medium">企業</th>
                <th className="py-2 pr-3 text-right font-medium">売上高</th>
                <th className="py-2 pr-3 text-right font-medium">純利益率</th>
                <th className="py-2 pr-3 text-right font-medium">5期の伸び</th>
                <th className="py-2 pr-3 text-right font-medium">上位3社</th>
                <th className="py-2 pr-3 text-right font-medium">海外比率</th>
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

/** One industry's block, on its own page: the figures against the all-industry reference, the split, the trend, the ten largest companies. */
export function IndustryFiguresBlock({ figures, reference, index, all }: { figures: IndustryFigures; reference: IndustryFiguresData["reference"]; index: IndexSeries | null; all: IndexSeries }) {
  const restOfIndustry = figures.revenue.total - figures.ranking.reduce((a, c) => a + c.revenue, 0);
  const parts = partsOf([
    ...figures.ranking.map((c) => ({ id: c.id, name: c.name, value: c.revenue })),
    ...(restOfIndustry > 0 ? [{ id: "other", name: `ほか${figures.revenue.companies - figures.ranking.length}社`, value: restOfIndustry }] : []),
  ]);
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3">
        <FigureCard label="売上高の合計" value={formatYen(figures.revenue.total)} context={`${figures.revenue.companies}社の最新期`} />
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
        <FigureCard label="上位3社への集中" value={figures.top3Share ? percent(figures.top3Share.value) : "—"} context={figures.top3Share ? `${figures.top3Share.companies}社` : undefined} />
        <FigureCard label="海外売上高比率" value={figures.overseasSalesRatio ? percent(figures.overseasSalesRatio.value) : "—"} context={figures.overseasSalesRatio ? `${figures.overseasSalesRatio.companies}社の中央値` : "地域別の情報が無い"} />
        <FigureCard label="従業員数の合計" value={figures.employees.companies > 0 ? `${Math.round(figures.employees.total / 10000).toLocaleString("ja-JP")}万人` : "—"} context={figures.employees.companies > 0 ? `${figures.employees.companies}社` : undefined} />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        計算値：純利益率＝純利益の合計 ÷ 売上高の合計。5期の伸び＝最新期の売上高 ÷ 5期前の売上高。上位3社＝売上高の上位3社の合計 ÷ 業界の合計。海外比率＝日本以外の売上高 ÷ 地域別売上高の合計。各社の最新期を使い、決算期は会社ごとに異なります。▲▼は全業界の値との比較で、良し悪しの判定ではありません。
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {parts.length > 0 && (
          <Donut title={`${figures.name}業界の売上高の構成`} parts={parts} format={formatYen} centre={{ value: `${figures.revenue.companies}社`, label: figures.name }} />
        )}
        {index && index.values.length === 5 && (
          <div>
            <p className="text-sm font-medium">5期の売上高の推移（指数）</p>
            <p className="mt-1 text-xs text-muted-foreground">5期そろった{index.companies}社の合計。5期前＝100。薄い線は全業界（{all.companies}社）。</p>
            <div className="mt-3 max-w-sm">
              <IndexSparkline series={index} reference={all} width={320} height={140} />
            </div>
          </div>
        )}
      </div>

      {figures.ranking.length > 0 && (
        <div className="mt-10">
          <h3 className="font-serif text-lg font-semibold">売上高の大きい順</h3>
          <p className="mt-1 text-sm text-muted-foreground">最新期の売上高。括弧は純利益率と、5期の売上高の伸び。</p>
          <div className="mt-4">
            <Bars
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
            />
          </div>
        </div>
      )}
    </div>
  );
}
