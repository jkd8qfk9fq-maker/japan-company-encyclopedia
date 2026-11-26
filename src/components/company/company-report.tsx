import Link from "next/link";
import { ArrowLeft, BarChart3, Coins, Globe, ListOrdered, Users, Wallet, type LucideIcon } from "lucide-react";
import { RichText } from "@/components/rich-text/rich-text";
import { PredictionPanel } from "@/components/engagement/prediction-panel";
import { predictionDataFor } from "@/lib/predictions";
import { reportMetrics, type ReportMetric } from "@/lib/report-metrics";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyAnalysis } from "@/lib/company-analysis";
import { financialSummary, type SummaryKey } from "@/lib/financial-summary";
import { meaningSummary } from "@/lib/meaning-layer";
import { MIN_RADAR_AXES, radarAxes } from "@/lib/perspective-radar";
import { formatAnalysisValue } from "@/lib/analysis-format";
import { formatDateJa, formatYen } from "@/lib/utils/format";
import type { Company, FinancialRecord } from "@/types/company";
import type { Revision } from "@/types/revision";
import { PremiumGate } from "./premium-gate";
import { MeaningGate } from "./analysis-gate";
import { CompanyAnalysisSection, MeaningBlock, MeaningEntrance } from "./company-analysis";
import { DataProvenance } from "./data-provenance";
import { ReportPrintButton } from "./report-print-button";
import { Donut, PerspectiveRadar, PositionBar, TrendChart } from "./report-charts";
import styles from "./company-report.module.css";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

/**
 * The premium company report (JCE-073): one printable summary of a company, modelled on the first page of a
 * credit report with the rating replaced by verified facts — the company's own description, five periods of
 * printed figures, what the latest revenue is made of, and the computed layer (計算値) with the company's
 * position in its industry. Every figure traces to the sources listed at the end. Nothing here is a rating
 * or advice (invariant 4); the free company page keeps all of the underlying facts.
 *
 * JCE-114 (operator: 「見にくい。目次と、指標とチャートで理解でき、数字は PDF で印刷できる、畳んだ形に」): the report is
 * laid out as numbered chapters with a table of contents — headline cards and the summary sentences first, then each
 * chapter as a chart with its full table folded beneath it (「数字の表」). The folds open for printing
 * (report-print-button.tsx), so the PDF carries every table the screen hides. What the mockup showed beside the
 * figures that this site may not show — 時価総額・PER・PBR・配当利回り, a photograph of the company — is left out
 * (invariant 4; no photographs on company pages).
 */

const byPeriod = (records: FinancialRecord[]): FinancialRecord[] => [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));

const percent = (v: number) => `${(v * 100).toFixed(1).replace("-", "−")}%`;
const percentChange = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(1)}%`;
const times = (v: number) => `${v.toFixed(2)}倍`;

function formatValue(metric: ReportMetric, value: number): string {
  switch (metric.unit) {
    case "percent":
      return percent(value);
    case "percent-change":
      return percentChange(value);
    case "times":
      return times(value);
    case "yen-per-person":
      return formatYen(value);
  }
}

type Line = { label: React.ReactNode; pick: (r: FinancialRecord) => number | null; format: (v: number) => string; shown: boolean };

function printedLines(records: FinancialRecord[]): Line[] {
  const latest = records.at(-1)!;
  const any = (pick: (r: FinancialRecord) => number | null) => records.some((r) => pick(r) !== null);
  const yen = (v: number) => formatYen(v);
  const lines: Line[] = [
    { label: latest.revenueLabel, pick: (r) => r.revenue, format: yen, shown: any((r) => r.revenue) },
    { label: latest.profitLabel ?? "利益", pick: (r) => r.profit, format: yen, shown: any((r) => r.profit) },
    { label: latest.netIncomeLabel, pick: (r) => r.netIncome, format: yen, shown: any((r) => r.netIncome) },
    { label: latest.totalAssetsLabel ?? "総資産", pick: (r) => r.totalAssets, format: yen, shown: any((r) => r.totalAssets) },
    { label: latest.netAssetsLabel ?? "純資産", pick: (r) => r.netAssets, format: yen, shown: any((r) => r.netAssets) },
    { label: <T m={{ ja: "従業員数（連結）", en: "Employees (consolidated)" }} />, pick: (r) => r.employees, format: (v) => `${v.toLocaleString("ja-JP")}人`, shown: any((r) => r.employees) },
  ];
  return lines.filter((l) => l.shown);
}

function Composition({ title, parts, fiscalYear }: { title: React.ReactNode; parts: { name: string; amount: number }[]; fiscalYear: string }) {
  const total = parts.reduce((acc, p) => acc + p.amount, 0);
  if (parts.length < 2 || total <= 0) return null;
  const sorted = [...parts].sort((a, b) => b.amount - a.amount);
  return (
    <div>
      <h3 className="font-serif text-base font-semibold">
        {title}（<F s={fiscalYear} />）
      </h3>
      <table className="mt-3 w-full border-collapse text-sm">
        <tbody>
          {sorted.map((p) => (
            <tr key={p.name} className="border-b border-border/70">
              <td className="py-1.5 pr-3"><L s={p.name} /></td>
              <td className="figures py-1.5 pr-3 text-right whitespace-nowrap"><F s={formatYen(p.amount)} /></td>
              <td className="figures py-1.5 text-right whitespace-nowrap text-muted-foreground">{((p.amount / total) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A full table folded under its chart: closed on screen, opened by the print path so the PDF holds it. */
function Fold({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <details className="group mt-4 rounded-lg border border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
        {label}
        <span className="text-xs text-muted-foreground print:hidden">
          <span className="group-open:hidden"><T m={{ ja: "開く ＋", en: "Open +" }} /></span>
          <span className="hidden group-open:inline"><T m={{ ja: "閉じる －", en: "Close −" }} /></span>
        </span>
      </summary>
      <div className="border-t border-border px-4 pt-2 pb-4">{children}</div>
    </details>
  );
}

function Chapter({ id, number, title, lead, children }: { id: string; number: number; title: React.ReactNode; lead?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <h2 id={`${id}-title`} className="flex items-baseline gap-3 border-b border-border pb-3 font-serif text-xl font-semibold md:text-2xl">
        <span className="figures text-seal">{number}.</span>
        {title}
      </h2>
      {lead && <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{lead}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const CARD_ICONS: Partial<Record<SummaryKey, LucideIcon>> = { revenue: BarChart3, profit: Coins, netIncome: Wallet, employees: Users };

function KpiCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: React.ReactNode; value: string; note: React.ReactNode | null }) {
  return (
    <li className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="size-4 text-ink" aria-hidden />
        {label}
      </p>
      <p className="figures mt-2 text-[1.375rem] leading-tight font-semibold md:text-[1.625rem]"><F s={value} /></p>
      {note && <p className="figures mt-1 text-xs text-muted-foreground">{note}</p>}
    </li>
  );
}

export function CompanyReport({ company, companies, revisions }: { company: Company; companies: Company[]; revisions: Revision[] }) {
  const records = byPeriod(company.financials);
  const latest = records.at(-1);
  const lines = records.length > 0 ? printedLines(records) : [];
  const layer = reportMetrics(company, companies);
  const primary = company.industries.find((i) => i.primary) ?? company.industries[0];
  const industryName = primary ? INDUSTRY_LABELS[primary.industryId].name : null;
  const summary = financialSummary(company.financials);
  const analysis = companyAnalysis(company, companies);
  const meaning = meaningSummary(analysis.perspectives.flatMap((p) => p.groups));
  const axes = radarAxes(analysis);
  const positionedAxes = axes.filter((a) => a.percentile !== null).length;

  const businessNames = new Map<string, string>();
  const collect = (bs: Company["businesses"]) => bs.forEach((b) => {
    businessNames.set(b.id, b.shortName ?? b.name);
    if (b.children) collect(b.children);
  });
  collect(company.businesses);

  const usedSourceIds = [
    ...new Set([
      ...records.flatMap((r) => r.sourceIds),
      ...(company.segmentRevenue?.sourceIds ?? []),
      ...(company.regionalRevenue?.sourceIds ?? []),
      ...layer.metrics.flatMap((m) => m.sourceIds),
    ]),
  ];
  const usedSources = usedSourceIds.map((id) => company.sources.find((s) => s.id === id)).filter((s) => s !== undefined);

  // The headline cards: the printed lines with their 前期比 (computed under the free summary's comparability rule),
  // then 海外売上高比率 — one of the three ratios the site shows — where the filing prints regions, else employees.
  const overseas = layer.metrics.find((m) => m.key === "overseas-ratio");
  const cardItems = (summary?.items ?? []).filter((i) => i.key === "revenue" || i.key === "profit" || i.key === "netIncome");
  const employees = summary?.items.find((i) => i.key === "employees");
  const change = (v: number | null) => (v === null ? null : `前期比 ${percentChange(v)}`);

  const segmentParts = company.segmentRevenue?.items.map((i) => ({ name: businessNames.get(i.businessId) ?? i.businessId, amount: i.amount })) ?? [];
  const regionParts = company.regionalRevenue?.items.map((i) => ({ name: i.region, amount: i.amount })) ?? [];
  const positioned = layer.metrics.filter((m) => m.industry);

  const chapters = [
    { id: "overview", title: <T m={{ ja: "企業概要と要点", en: "Company overview and key points" }} />, shown: true },
    { id: "performance", title: <T m={{ ja: "業績の推移", en: "Performance trends" }} />, shown: records.length > 0 },
    { id: "structure", title: <T m={{ ja: "事業と地域の構成", en: "Business and regional breakdown" }} />, shown: Boolean(company.segmentRevenue || company.regionalRevenue) },
    { id: "position", title: <T m={{ ja: "業界の中での位置", en: "Position within the industry" }} />, shown: layer.metrics.length > 0 },
    { id: "analysis", title: <T m={{ ja: "5観点の分析", en: "Five-perspective analysis" }} />, shown: analysis.perspectives.length > 0 },
    { id: "check", title: <T m={{ ja: "予測と答え合わせ", en: "Forecasts and results check" }} />, shown: true },
    { id: "sources", title: <T m={{ ja: "出典とデータの来歴", en: "Sources and data provenance" }} />, shown: true },
  ]
    .filter((c) => c.shown)
    .map((c, i) => ({ ...c, number: i + 1 }));
  const ch = (id: string) => chapters.find((c) => c.id === id)!;

  const toc = (
    <ol className="space-y-0.5 text-sm">
      {chapters.map((c) => (
        <li key={c.id}>
          <a href={`#${c.id}`} className="flex gap-2 rounded-md px-3 py-2 leading-snug hover:bg-muted">
            <span className="figures text-muted-foreground">{c.number}.</span>
            {c.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className={`company-report pb-16 ${styles.report}`}>
      <header className="bg-navy text-white print:bg-transparent print:text-foreground">
        <div className="mx-auto max-w-6xl px-5 pt-6 pb-8 md:px-8 md:pt-8 md:pb-12">
          <div className="flex items-center justify-between gap-4 print:hidden">
            <Link href={`/companies/${company.id}`} className="inline-flex items-center gap-1 text-sm text-white/75 hover:text-white hover:underline">
              <span data-l="ja" lang="ja"><ArrowLeft className="size-4" aria-hidden /> <L s={company.name} />のページへ
            </span><span data-l="en" lang="en">Go to the page for <ArrowLeft className="size-4" aria-hidden /> <L s={company.name} /></span></Link>
            <ReportPrintButton className="inline-flex items-center gap-2 rounded-md border border-white/60 px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-navy" />
          </div>
          <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-[oklch(0.82_0.08_80)] print:text-muted-foreground"><T m={{ ja: "PREMIUM ANALYSIS ／ 企業レポート", en: "PREMIUM ANALYSIS / Company report" }} /></p>
          <h1 className="mt-2 font-serif text-[2rem] leading-tight font-semibold md:text-[3rem]"><L s={company.name} /></h1>
          <p className="figures mt-2 text-sm text-white/75 print:text-muted-foreground">
            <span data-l="ja" lang="ja">{company.officialName} ・ 証券コード {company.code}
            {industryName && <> <span data-l="ja" lang="ja">・ {industryName}</span><span data-l="en" lang="en">· {industryName}</span></>}</span><span data-l="en" lang="en">{company.officialName} · Securities code {company.code}{industryName && <> <span data-l="ja" lang="ja">・ {industryName}</span><span data-l="en" lang="en">· {industryName}</span></>}</span>
          </p>
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-white/30 px-4 py-1.5 text-xs text-white/85 print:border-border print:text-muted-foreground">
            {latest && <span><span data-l="ja" lang="ja">最新期 <F s={latest.fiscalYear} /></span><span data-l="en" lang="en">Latest fiscal year <F s={latest.fiscalYear} /></span></span>}
            <span aria-hidden>|</span>
            <span><span data-l="ja" lang="ja">データ時点 <F s={formatDateJa(company.updatedAt)} /></span><span data-l="en" lang="en">Data as of <F s={formatDateJa(company.updatedAt)} /></span></span>
            <span aria-hidden>|</span>
            <span><T m={{ ja: "出典：有価証券報告書（EDINET）", en: "Sources: annual securities reports (EDINET)" }} /></span>
          </p>
        </div>
      </header>

      <nav aria-label="章" className="border-b border-border bg-card print:hidden lg:hidden">
        <ol className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2 text-sm">
          {chapters.map((c) => (
            <li key={c.id} className="shrink-0">
              <a href={`#${c.id}`} className="block rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-muted">
                <span className="figures text-muted-foreground">{c.number}.</span> {c.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 md:px-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:pt-10 print:block print:px-0">
        <aside className="hidden print:hidden lg:block" aria-label="目次">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border border-border bg-card p-2">
              <p className="flex items-center gap-1.5 px-3 pt-2 pb-1 text-xs font-semibold tracking-[0.12em] text-muted-foreground">
                <span data-l="ja" lang="ja"><ListOrdered className="size-3.5" aria-hidden /> 目次
              </span><span data-l="en" lang="en"><ListOrdered className="size-3.5" aria-hidden /> contents</span></p>
              {toc}
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-xs leading-5 text-muted-foreground">
              <p><T m={{ ja: "このレポートは PDF で保存できます。畳んである数字の表も、すべて開いた状態で印刷されます。", en: "This report can be saved as a PDF. Collapsed number tables are also printed fully expanded." }} /></p>
              <ReportPrintButton className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted" />
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-14">
          <Chapter id="overview" number={ch("overview").number} title={ch("overview").title}>
            {company.description && (
              <div className="prose-ja max-w-3xl">
                <RichText text={company.description} />
              </div>
            )}
            {(cardItems.length > 0 || overseas || employees) && (
              <ul className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {cardItems.map((i) => (
                  <KpiCard key={i.key} icon={CARD_ICONS[i.key] ?? BarChart3} label={i.label} value={formatYen(i.value)} note={change(i.change)} />
                ))}
                {overseas ? (
                  <KpiCard icon={Globe} label={<T m={{ ja: "海外売上高比率", en: "Overseas revenue ratio" }} />} value={percent(overseas.value)} note={`計算値（${overseas.fiscalYear}）`} />
                ) : (
                  employees && <KpiCard icon={Users} label={employees.label} value={`${employees.value.toLocaleString("ja-JP")}人`} note={change(employees.change)} />
                )}
              </ul>
            )}
            {summary && (
              <p className="mt-2 text-xs text-muted-foreground">
                <span data-l="ja" lang="ja"><F s={summary.fiscalYear} />の印字値。前期比は計算値（最新期 ÷ 前期 − 1）で、会計基準と売上の範囲が前期と同じ場合だけ示します。
              </span><span data-l="en" lang="en">Printed values for <F s={summary.fiscalYear} />. Year on year is a computed value (latest fiscal year ÷ prior fiscal year − 1) and is shown only when the accounting standard and revenue scope match the prior fiscal year.</span></p>
            )}
            {meaning.length > 0 && (
              <MeaningGate fallback={<MeaningEntrance sentences={meaning} />}>
                <MeaningBlock sentences={meaning} />
              </MeaningGate>
            )}
          </Chapter>

          <PremiumGate
            title={`${company.name}の企業レポート`}
            teaser={<T m={{ ja: "5期の印字値、売上の内訳（事業別・地域別）、計算値の指標と業界の中での位置（中央値・四分位・順位）を、印刷してそのまま提示できる1枚のレポートにまとめたものです。数値はすべて有価証券報告書の印字値と、そこから計算した値だけで、出典を末尾に付けています。", en: "A one-page report you can print and present as is, covering five fiscal years of printed values, the revenue breakdown (by business and by region), and computed metrics with the company's position within its industry (median, quartiles, rank). All figures are only the values printed in annual securities reports and values computed from them, with sources listed at the end." }} />}
            returnAnchor="performance"
          >
            <div className="space-y-14">
              {records.length > 0 && (
                <Chapter
                  id="performance"
                  number={ch("performance").number}
                  title={ch("performance").title}
                  lead={<T m={{ ja: "棒は有価証券報告書「主要な経営指標等の推移」の印字値、線は利益の行を売上で割った計算値です。", en: "Bars show values printed in the \"Key management indicators\" section of the annual securities report; lines show computed values of each profit line divided by revenue." }} />}
                >
                  <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                    <TrendChart records={records} />
                  </div>
                  <Fold label={`5期の数字の表（${lines.length}項目・印字値）`}>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <caption className="sr-only"><T m={{ ja: "5期の数字（有価証券報告書の印字値）", en: "Five fiscal years of figures (printed values from annual securities reports)" }} /></caption>
                        <thead>
                          <tr className="border-b border-foreground/40 text-left">
                            <th scope="col" className="sticky left-0 bg-card py-2 pr-3 font-medium whitespace-nowrap"><T m={{ ja: "項目", en: "Item" }} /></th>
                            {records.map((r) => (
                              <th scope="col" key={r.periodEnd} className="figures py-2 pr-3 text-right font-medium whitespace-nowrap">
                                <F s={r.fiscalYear} />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {lines.map((line, lineIndex) => (
                            <tr key={lineIndex} className="border-b border-border/70">
                              <th scope="row" className="sticky left-0 bg-card py-1.5 pr-3 text-left font-normal whitespace-nowrap">{line.label}</th>
                              {records.map((r) => {
                                const v = line.pick(r);
                                return (
                                  <td key={r.periodEnd} className="figures py-1.5 pr-3 text-right whitespace-nowrap">
                                    {v === null ? "—" : line.format(v)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      <T m={{ ja: "金額は有価証券報告書の「主要な経営指標等の推移」に印字されたとおり。項目名は最新期の有報の表記です。表は横にスクロールできます。", en: "Amounts are as printed in the \"Key management indicators\" section of the annual securities report. Item names follow the latest fiscal year's report. The table scrolls horizontally." }} />
                    </p>
                  </Fold>
                </Chapter>
              )}

              {(company.segmentRevenue || company.regionalRevenue) && (
                <Chapter
                  id="structure"
                  number={ch("structure").number}
                  title={ch("structure").title}
                  lead={<T m={{ ja: "有価証券報告書のセグメント情報・地域ごとの情報に印字された金額から、それぞれの割合を計算しています。", en: "Shares are computed from the amounts printed in the segment information and geographic information of the annual securities report." }} />}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {company.segmentRevenue && (
                      <div className="rounded-xl border border-border bg-card p-4 md:p-5">
                        <h3 className="font-serif text-base font-semibold"><span data-l="ja" lang="ja">事業別の<L s={company.segmentRevenue.label} /><span className="figures ml-1 text-sm font-normal text-muted-foreground">（<F s={company.segmentRevenue.fiscalYear} />）</span></span><span data-l="en" lang="en"><L s={company.segmentRevenue.label} /><span className="figures ml-1 text-sm font-normal text-muted-foreground">（<F s={company.segmentRevenue.fiscalYear} />）</span> by business</span></h3>
                        <div className="mt-4"><Donut title={`事業別の${company.segmentRevenue.label}`} parts={segmentParts} unitLabel={company.segmentRevenue.label} /></div>
                      </div>
                    )}
                    {company.regionalRevenue && (
                      <div className="rounded-xl border border-border bg-card p-4 md:p-5">
                        <h3 className="font-serif text-base font-semibold"><span data-l="ja" lang="ja">地域別の<L s={company.regionalRevenue.label} /><span className="figures ml-1 text-sm font-normal text-muted-foreground">（<F s={company.regionalRevenue.fiscalYear} />）</span></span><span data-l="en" lang="en"><L s={company.regionalRevenue.label} /><span className="figures ml-1 text-sm font-normal text-muted-foreground">（<F s={company.regionalRevenue.fiscalYear} />）</span> by region</span></h3>
                        <div className="mt-4"><Donut title={`地域別の${company.regionalRevenue.label}`} parts={regionParts} unitLabel={company.regionalRevenue.label} /></div>
                      </div>
                    )}
                  </div>
                  <Fold label={<T m={{ ja: "金額の表（印字値）", en: "Amounts table (printed values)" }} />}>
                    <div className="grid gap-8 md:grid-cols-2">
                      {company.segmentRevenue && (
                        <Composition title={`事業別の${company.segmentRevenue.label}`} fiscalYear={company.segmentRevenue.fiscalYear} parts={segmentParts} />
                      )}
                      {company.regionalRevenue && (
                        <Composition title={`地域別の${company.regionalRevenue.label}`} fiscalYear={company.regionalRevenue.fiscalYear} parts={regionParts} />
                      )}
                    </div>
                  </Fold>
                </Chapter>
              )}

              {layer.metrics.length > 0 && (
                <Chapter
                  id="position"
                  number={ch("position").number}
                  title={ch("position").title}
                  lead={`印字値から計算した値（計算値）と、主たる産業が同じ掲載企業${layer.industryName ? `（${layer.industryName}）` : ""}の中での位置です。位置を示すもので、会社の良し悪しを判定するものではありません。`}
                >
                  {positioned.length > 0 && (
                    <p className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><span data-l="ja" lang="ja"><span className="size-3 rounded-full bg-[var(--ink)]" />この会社</span><span data-l="en" lang="en"><span className="size-3 rounded-full bg-[var(--ink)]" />This company</span></span>
                      <span className="inline-flex items-center gap-1.5"><span data-l="ja" lang="ja"><span className="h-3 w-0.5 bg-muted-foreground" />業界の中央値</span><span data-l="en" lang="en"><span className="h-3 w-0.5 bg-muted-foreground" />Industry median</span></span>
                      <span className="inline-flex items-center gap-1.5"><span data-l="ja" lang="ja"><span className="h-2.5 w-5 rounded-full bg-[var(--chart-revenue)]/35" />業界の中ほど半分（第1〜第3四分位）</span><span data-l="en" lang="en"><span className="h-2.5 w-5 rounded-full bg-[var(--chart-revenue)]/35" />Middle half of the industry (1st to 3rd quartile)</span></span>
                    </p>
                  )}
                  <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                    {layer.metrics.map((m) => (
                      <li key={m.key} className="grid gap-2 px-4 py-3.5 sm:grid-cols-[minmax(0,13rem)_6.5rem_minmax(0,1fr)] sm:items-center sm:gap-4 md:px-5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium"><L s={m.title} /></p>
                          <p className="text-xs text-muted-foreground"><span data-l="ja" lang="ja"><F s={m.fiscalYear} />・計算値</span><span data-l="en" lang="en"><F s={m.fiscalYear} /> · computed</span></p>
                        </div>
                        <p className="figures text-lg font-semibold sm:text-right">{formatValue(m, m.value)}</p>
                        {m.industry ? (
                          <div>
                            <PositionBar value={m.value} median={m.industry.median} q1={m.industry.q1} q3={m.industry.q3} />
                            <p className="figures mt-1 text-xs text-muted-foreground">
                              <span data-l="ja" lang="ja">中央値 {formatValue(m, m.industry.median)} ・ {m.industry.rank}位 / {m.industry.members}社
                            </span><span data-l="en" lang="en">Median {formatValue(m, m.industry.median)} · No. {m.industry.rank} of {m.industry.members} companies</span></p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground"><T m={{ ja: "業界で比べられる会社が少ないため、分布は示していません。", en: "The distribution is not shown because few companies in the industry are comparable." }} /></p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <Fold label={<T m={{ ja: "計算式と分布の表（中央値・四分位・順位・パーセンタイル）", en: "Formulas and distribution table (median, quartiles, rank, percentile)" }} />}>
                    <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
                      <span data-l="ja" lang="ja">業界の分布は、主たる産業が同じ掲載企業
                      {layer.industryName && `（${layer.industryName}）`}
                      {layer.industryMembers > 0
                        ? `${layer.industryMembers}社のうち、最新期がこの会社と1年以内に終わる${layer.comparableMembers}社の最新期から同じ計算をしたもので`
                        : <T m={{ ja: "の各社の最新期から同じ計算をしたもので", en: "computed the same way from each company's latest fiscal year in" }} />}
                      す。パーセンタイルは、その値より小さい会社の割合です。
                    </span><span data-l="en" lang="en">The industry distribution covers {layer.industryName && `（${layer.industryName}）`} listed companies with the same primary industry{layer.industryMembers > 0
                        ? `${layer.industryMembers}社のうち、最新期がこの会社と1年以内に終わる${layer.comparableMembers}社の最新期から同じ計算をしたもので`
                        : <T m={{ ja: "の各社の最新期から同じ計算をしたもので", en: "computed the same way from each company's latest fiscal year in" }} />}. The percentile is the share of companies with a smaller value.</span></p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <caption className="sr-only"><T m={{ ja: "計算値と、業界の中での位置", en: "Computed values and position within the industry" }} /></caption>
                        <thead>
                          <tr className="border-b border-foreground/40 text-left">
                            <th scope="col" className="sticky left-0 bg-card py-2 pr-3 font-medium whitespace-nowrap"><T m={{ ja: "指標（計算値）", en: "Metric (computed)" }} /></th>
                            <th scope="col" className="py-2 pr-3 font-medium whitespace-nowrap"><T m={{ ja: "自社", en: "Company" }} /></th>
                            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap"><T m={{ ja: "業界の中央値", en: "Industry median" }} /></th>
                            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap"><T m={{ ja: "四分位（第1〜第3）", en: "Quartiles (1st–3rd)" }} /></th>
                            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap"><T m={{ ja: "順位", en: "Rank" }} /></th>
                            <th scope="col" className="py-2 text-right font-medium whitespace-nowrap"><T m={{ ja: "パーセンタイル", en: "Percentile" }} /></th>
                          </tr>
                        </thead>
                        <tbody>
                          {layer.metrics.map((m) => (
                            <tr key={m.key} className="border-b border-border/70 align-top">
                              <th scope="row" className="sticky left-0 max-w-[11rem] bg-card py-2 pr-3 text-left font-normal">
                                <span className="whitespace-nowrap"><L s={m.title} /></span>
                                <span className="block text-xs text-muted-foreground">
                                  <L s={m.formula} />（<F s={m.fiscalYear} />）
                                </span>
                                {m.note && <span className="block text-xs text-muted-foreground"><L s={m.note} /></span>}
                              </th>
                              <td className="figures py-2 pr-3 font-medium whitespace-nowrap">{formatValue(m, m.value)}</td>
                              <td className="figures py-2 pr-3 text-right whitespace-nowrap">{m.industry ? formatValue(m, m.industry.median) : "—"}</td>
                              <td className="figures py-2 pr-3 text-right whitespace-nowrap">
                                {m.industry ? `${formatValue(m, m.industry.q1)} 〜 ${formatValue(m, m.industry.q3)}` : "—"}
                              </td>
                              <td className="figures py-2 pr-3 text-right whitespace-nowrap">
                                {m.industry ? `${m.industry.rank}位 / ${m.industry.members}社` : "—"}
                              </td>
                              <td className="figures py-2 text-right whitespace-nowrap">{m.industry ? m.industry.percentile : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      <T m={{ ja: "「—」は、その指標を計算できる会社が業界に少なく、分布を示していないものです（自社の値は印字値から計算できています）。前期比は、会計基準と売上の範囲が前期と同じ場合だけ計算しています。", en: "\"—\" means few companies in the industry allow this metric to be computed, so no distribution is shown (the company's own value can be computed from printed values). Year on year is computed only when the accounting standard and revenue scope match the prior fiscal year." }} />
                    </p>
                  </Fold>
                </Chapter>
              )}
            </div>
          </PremiumGate>

          {analysis.perspectives.length > 0 && (
            <Chapter
              id="analysis"
              number={ch("analysis").number}
              title={ch("analysis").title}
              lead={<T m={{ ja: "規模と地位・成長・収益性・財務の安定・外部環境との接続の5つの問いで、数字を読みます。各観点を開くと、自社の値と業界の中央値の表が出ます。5観点を合成したスコアや格付けは作りません。", en: "The numbers are read through five questions: scale and standing, growth, profitability, financial stability, and connection to the external environment. Opening each perspective shows a table of the company's value and the industry median. No combined score or rating of the five perspectives is created." }} />}
            >
              {positionedAxes >= MIN_RADAR_AXES && (
                <div className="mb-6 grid items-center gap-6 rounded-xl border border-border bg-card p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-6">
                  <figure>
                    <PerspectiveRadar axes={axes} />
                    <figcaption className="mt-2 text-center text-xs leading-5 text-muted-foreground">
                      <span data-l="ja" lang="ja">外側ほど、その指標の値が業界{analysis.industryName && `（${analysis.industryName}）`}の中で大きい。点線は業界の中央値。
                    </span><span data-l="en" lang="en">The further out, the larger the metric&apos;s value within the industry {analysis.industryName && `（${analysis.industryName}）`}. The dotted line is the industry median.</span></figcaption>
                  </figure>
                  <div>
                    <h3 className="font-serif text-base font-semibold"><T m={{ ja: "5観点の業界内の位置", en: "Position within the industry on five perspectives" }} /></h3>
                    <ul className="mt-3 divide-y divide-border">
                      {axes.map((a) => (
                        <li key={a.perspective} className="py-2.5">
                          <p className="flex items-baseline justify-between gap-3 text-sm">
                            <span className="font-medium"><L s={a.perspectiveTitle} /></span>
                            <span className="figures font-semibold">{a.percentile === null ? <T m={{ ja: "分布なし", en: "No distribution" }} /> : `パーセンタイル ${a.percentile}`}</span>
                          </p>
                          <p className="figures mt-0.5 text-xs text-muted-foreground">
                            <L s={a.indicator} />
                            {a.row && <> {formatAnalysisValue(a.row, a.row.value)}（<F s={a.row.fiscalYear} />）</>}
                            {a.row?.industry && <> <span data-l="ja" lang="ja">・ {a.row.industry.rank}位 / {a.row.industry.members}社</span><span data-l="en" lang="en">· No. {a.row.industry.rank} of {a.row.industry.members} companies</span></>}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      <T m={{ ja: "各軸は観点ごとの代表の指標1つで、パーセンタイルは業界でその値より小さい会社の割合です。大きいことは良いことを意味せず（自己資本比率や海外売上高比率は会社の形を示すもの）、5つを足したり面積で比べたりする点数ではありません。", en: "Each axis is one representative metric per perspective, and the percentile is the share of companies in the industry with a smaller value. Larger does not mean better (equity ratio and overseas revenue ratio describe a company's shape), and the five are not scores to be added up or compared by area." }} />
                    </p>
                  </div>
                </div>
              )}
              <CompanyAnalysisSection company={company} companies={companies} analysis={analysis} folded />
            </Chapter>
          )}

          <Chapter id="check" number={ch("check").number} title={ch("check").title} lead={<T m={{ ja: "次の期の数字を予想し、有報が出たら答え合わせをします（この章は無料です）。", en: "Forecast the next fiscal year's figures, then check the results once the annual securities report is out (this chapter is free)." }} />}>
            <PredictionPanel companyId={company.id} data={predictionDataFor(company, { explain: true })} />
          </Chapter>

          <Chapter id="sources" number={ch("sources").number} title={ch("sources").title}>
            {usedSources.length > 0 && (
              <ul className="space-y-2 text-sm leading-6">
                {usedSources.map((s) => (
                  <li key={s.id}>
                    <span className="font-medium"><L s={s.title} /></span>
                    <span className="text-muted-foreground">
                      （{s.publisher}
                      {s.publishedAt && ` ・ ${formatDateJa(s.publishedAt)}`}
                      {s.docId && ` ・ EDINET文書ID ${s.docId}`}）
                    </span>
                    <span className="figures block text-xs break-all text-muted-foreground">{s.url}</span>
                  </li>
                ))}
              </ul>
            )}
            <DataProvenance company={company} metrics={layer.metrics} revisions={revisions} />
            <footer className="mt-8 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
              <p>
                <span data-l="ja" lang="ja">日本企業百科事典のプレミアムレポートです。数値は有価証券報告書など上記の出典に印字された値と、そこから計算した値（計算値）だけを使い、株価・評価・推奨は含みません。データ時点: <F s={formatDateJa(company.updatedAt)} />。
                プレミアムプランの特典として、このレポートは印刷して第三者への提示にも使えます。
              </span><span data-l="en" lang="en">A Premium report from the Japan Company Encyclopedia. It uses only values printed in the sources above, such as annual securities reports, and values computed from them (computed values), and includes no stock prices, ratings, or recommendations. Data as of <F s={formatDateJa(company.updatedAt)} />. As a Premium plan benefit, this report can be printed and shown to third parties.</span></p>
            </footer>
          </Chapter>
        </div>
      </div>
    </div>
  );
}
