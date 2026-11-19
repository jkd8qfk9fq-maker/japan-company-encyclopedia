import type { CompanyReport as Report, Placement, ReportMetric, Share, Unit } from "@/lib/company-report";
import { formatDateJa, formatYen } from "@/lib/utils/format";
import type { Company } from "@/types/company";
import { ReportPrintButton } from "./report-print-button";

/**
 * 企業レポート (JCE-073), drawn on the server and shown to premium readers: one page that can be printed or saved as
 * PDF and handed to someone else. Modelled on the first page of a credit report, with the rating replaced by what
 * this site can stand behind — the printed figures, their sources, and arithmetic on them labelled 計算値.
 */

const format = (unit: Unit, v: number) => {
  if (unit === "yen") return formatYen(v);
  if (unit === "percent") return `${(v * 100).toFixed(1)}%`;
  if (unit === "times") return `${v.toFixed(2)}倍`;
  return `${Math.round(v / 10_000).toLocaleString("ja-JP")}万円`;
};

const yen = (v: number | null) => (v === null ? "—" : formatYen(v));

function PlacementCells({ unit, placement }: { unit: Unit; placement: Placement | null }) {
  if (!placement) return <td colSpan={3} className="px-2 py-1.5 text-muted-foreground">業界内で比べられる会社がありません</td>;
  return (
    <>
      <td className="figures px-2 py-1.5 text-right whitespace-nowrap">{format(unit, placement.median)}</td>
      <td className="figures px-2 py-1.5 text-right whitespace-nowrap">
        {format(unit, placement.q1)} 〜 {format(unit, placement.q3)}
      </td>
      <td className="figures px-2 py-1.5 text-right whitespace-nowrap">
        {placement.members}社中 {placement.rank}位（上位{placement.topPercent}%）
      </td>
    </>
  );
}

function Composition({ title, label, fiscalYear, items }: { title: string; label: string; fiscalYear: string; items: Share[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold">{title}</h4>
      <ul className="mt-1.5 space-y-1">
        {items.map((i) => (
          <li key={i.name} className="grid grid-cols-[minmax(0,1fr)_5rem_3.5rem] items-center gap-2 text-xs">
            <span className="truncate" title={i.name}>{i.name}</span>
            <span className="h-1.5 rounded-full bg-muted">
              <span className="block h-full rounded-full bg-navy dark:bg-ink" style={{ width: `${Math.min(100, i.percent)}%` }} />
            </span>
            <span className="figures text-right">{i.percent}%</span>
          </li>
        ))}
      </ul>
      <p className="mt-1 text-[0.6875rem] text-muted-foreground">
        割合は計算値：{label} ÷ 合計（{fiscalYear}）
      </p>
    </div>
  );
}

export function CompanyReportBlock({ company, report, siteUrl }: { company: Company; report: Report; siteUrl: string }) {
  const latest = report.periods.at(-1)!;
  const sources = company.sources.filter((s) => report.sourceIds.includes(s.id));
  const computed = report.metrics.filter((m: ReportMetric) => m.computed || m.placement);
  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center gap-3">
        <ReportPrintButton />
        <p className="text-xs text-muted-foreground">A4 1〜2枚。ブラウザの印刷画面で「PDFに保存」を選ぶと PDF になります。</p>
      </div>

      <article id="company-report" aria-label={`${company.name}の企業レポート`} className="rounded-md border border-border bg-card p-5 text-sm md:p-8 print:border-0 print:p-0">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-foreground pb-3">
          <div>
            <p className="text-[0.6875rem] tracking-[0.12em] text-muted-foreground">日本企業百科事典 企業レポート</p>
            <h3 className="mt-1 font-serif text-2xl font-semibold">{company.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {[company.officialName, company.code && `証券コード ${company.code}`, report.industryName && `${report.industryName}業界`].filter(Boolean).join("・")}
            </p>
          </div>
          <p className="text-xs text-muted-foreground sm:text-right">
            最新期 {latest.fiscalYear}
            <br />
            全数値の出典は末尾に記載
          </p>
        </header>

        {company.description && (
          <section className="mt-4">
            <h4 className="text-xs font-semibold">事業の概要</h4>
            <p className="mt-1 leading-7">{company.description}</p>
          </section>
        )}

        <section className="mt-5">
          <h4 className="text-xs font-semibold">5期の数字（有価証券報告書の印字値）</h4>
          <div className="mt-1.5 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-xs">
              <caption className="sr-only">5期の数字（有価証券報告書の印字値）</caption>
              <thead>
                <tr className="border-b border-foreground text-left">
                  <th scope="col" className="sticky left-0 bg-card px-2 py-1.5 font-medium">決算期</th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">{latest.revenueLabel}</th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">{latest.profitLabel ?? "利益"}</th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">{latest.netIncomeLabel}</th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">総資産</th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">純資産</th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">従業員</th>
                </tr>
              </thead>
              <tbody>
                {report.periods.map((p) => (
                  <tr key={p.periodEnd} className="border-b border-border">
                    <th scope="row" className="sticky left-0 bg-card px-2 py-1.5 text-left font-normal whitespace-nowrap">{p.fiscalYear}</th>
                    <td className="figures px-2 py-1.5 text-right whitespace-nowrap">{yen(p.revenue)}</td>
                    <td className="figures px-2 py-1.5 text-right whitespace-nowrap">{yen(p.profit)}</td>
                    <td className="figures px-2 py-1.5 text-right whitespace-nowrap">{yen(p.netIncome)}</td>
                    <td className="figures px-2 py-1.5 text-right whitespace-nowrap">{yen(p.totalAssets)}</td>
                    <td className="figures px-2 py-1.5 text-right whitespace-nowrap">{yen(p.netAssets)}</td>
                    <td className="figures px-2 py-1.5 text-right">{p.employees === null ? "—" : `${p.employees.toLocaleString("ja-JP")}人`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
<p className="no-print mt-1 text-[0.6875rem] text-muted-foreground sm:hidden">表は横にスクロールできます。</p>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">「—」は、その期の有価証券報告書に印字がない数字です（推計では埋めていません）。</p>
        </section>

        {(report.segments || report.regions) && (
          <section className="mt-5 grid gap-5 sm:grid-cols-2 print:grid-cols-2">
            {report.segments && <Composition title="事業別の売上の構成" {...report.segments} />}
            {report.regions && <Composition title="地域別の売上の構成" {...report.regions} />}
          </section>
        )}

        {computed.length > 0 && (
          <section className="mt-5">
            <h4 className="text-xs font-semibold">
              業界の中での位置
              {report.industryName
                ? `（${report.industryName}業界・掲載企業${report.industryMembers}社のうち、最新期がこの会社と1年以内に終わる${report.comparableMembers}社）`
                : ""}
            </h4>
            <div className="mt-1.5 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-xs">
                <caption className="sr-only">業界の中での位置</caption>
                <thead>
                  <tr className="border-b border-foreground text-left">
                    <th scope="col" className="sticky left-0 bg-card px-2 py-1.5 font-medium">指標</th>
                    <th scope="col" className="px-2 py-1.5 text-right font-medium whitespace-nowrap">この会社</th>
                    <th scope="col" className="px-2 py-1.5 text-right font-medium whitespace-nowrap">業界の中央値</th>
                    <th scope="col" className="px-2 py-1.5 text-right font-medium whitespace-nowrap">第1〜第3四分位</th>
                    <th scope="col" className="px-2 py-1.5 text-right font-medium whitespace-nowrap">大きい順の位置</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.map((m) => (
                    <tr key={m.key} className="border-b border-border align-top">
                      <th scope="row" className="sticky left-0 max-w-[11rem] bg-card px-2 py-1.5 text-left font-normal">
                        {m.label}
                        <span className="block text-[0.6875rem] text-muted-foreground">
                          {m.computed ? `計算値：${m.formula}` : m.formula}
                          {m.note && `・${m.note}`}
                        </span>
                      </th>
                      <td className="figures px-2 py-1.5 text-right font-semibold whitespace-nowrap">{format(m.unit, m.value)}</td>
                      <PlacementCells unit={m.unit} placement={m.placement} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-1 text-[0.6875rem] leading-5 text-muted-foreground">
              位置は大きさの順で、良し悪しの判定ではありません。第1〜第3四分位は、業界の会社を小さい順に並べた真ん中の半分の範囲です。計算値はすべて、同じ期に印字された数字どうしの割り算です。
            </p>
          </section>
        )}

        <section className="mt-5">
          <h4 className="text-xs font-semibold">出典</h4>
          <ol className="mt-1.5 list-decimal space-y-0.5 pl-5 text-[0.6875rem] leading-5">
            {sources.map((s) => (
              <li key={s.id}>
                {s.title}（{s.publisher}
                {s.publishedAt ? `・${formatDateJa(s.publishedAt)}` : ""}
                {s.docId ? `・EDINET ${s.docId}` : ""}）<span className="break-all text-muted-foreground"> {s.url}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-5 border-t border-border pt-3 text-[0.6875rem] leading-5 text-muted-foreground">
          <p>
            このレポートは、有価証券報告書に印字された数字と、それを割り算した計算値だけでできています。株価・時価総額・バリュエーション、信用評価や格付け、投資の推奨は含みません。
          </p>
          <p className="mt-1">
            プレミアムプランの方は、出典の記載を残したまま、このレポートを印刷・PDFにして社内外の方に提示できます。
            出典：日本企業百科事典 {siteUrl}/companies/{company.id}
          </p>
        </footer>
      </article>
    </div>
  );
}
