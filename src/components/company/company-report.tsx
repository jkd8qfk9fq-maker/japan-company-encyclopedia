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
import { CompanyAnalysisSection, MeaningBlock } from "./company-analysis";
import { DataProvenance } from "./data-provenance";
import { ReportPrintButton } from "./report-print-button";
import { Donut, PerspectiveRadar, PositionBar, TrendChart } from "./report-charts";
import styles from "./company-report.module.css";

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

type Line = { label: string; pick: (r: FinancialRecord) => number | null; format: (v: number) => string; shown: boolean };

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
    { label: "従業員数（連結）", pick: (r) => r.employees, format: (v) => `${v.toLocaleString("ja-JP")}人`, shown: any((r) => r.employees) },
  ];
  return lines.filter((l) => l.shown);
}

function Composition({ title, parts, fiscalYear }: { title: string; parts: { name: string; amount: number }[]; fiscalYear: string }) {
  const total = parts.reduce((acc, p) => acc + p.amount, 0);
  if (parts.length < 2 || total <= 0) return null;
  const sorted = [...parts].sort((a, b) => b.amount - a.amount);
  return (
    <div>
      <h3 className="font-serif text-base font-semibold">
        {title}（{fiscalYear}）
      </h3>
      <table className="mt-3 w-full border-collapse text-sm">
        <tbody>
          {sorted.map((p) => (
            <tr key={p.name} className="border-b border-border/70">
              <td className="py-1.5 pr-3">{p.name}</td>
              <td className="figures py-1.5 pr-3 text-right whitespace-nowrap">{formatYen(p.amount)}</td>
              <td className="figures py-1.5 text-right whitespace-nowrap text-muted-foreground">{((p.amount / total) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A full table folded under its chart: closed on screen, opened by the print path so the PDF holds it. */
function Fold({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group mt-4 rounded-lg border border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
        {label}
        <span className="text-xs text-muted-foreground print:hidden">
          <span className="group-open:hidden">開く ＋</span>
          <span className="hidden group-open:inline">閉じる －</span>
        </span>
      </summary>
      <div className="border-t border-border px-4 pt-2 pb-4">{children}</div>
    </details>
  );
}

function Chapter({ id, number, title, lead, children }: { id: string; number: number; title: string; lead?: string; children: React.ReactNode }) {
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

function KpiCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string; note: string | null }) {
  return (
    <li className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="size-4 text-ink" aria-hidden />
        {label}
      </p>
      <p className="figures mt-2 text-[1.375rem] leading-tight font-semibold md:text-[1.625rem]">{value}</p>
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
    { id: "overview", title: "企業概要と要点", shown: true },
    { id: "performance", title: "業績の推移", shown: records.length > 0 },
    { id: "structure", title: "事業と地域の構成", shown: Boolean(company.segmentRevenue || company.regionalRevenue) },
    { id: "position", title: "業界の中での位置", shown: layer.metrics.length > 0 },
    { id: "analysis", title: "5観点の分析", shown: analysis.perspectives.length > 0 },
    { id: "check", title: "予測と答え合わせ", shown: true },
    { id: "sources", title: "出典とデータの来歴", shown: true },
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
              <ArrowLeft className="size-4" aria-hidden /> {company.name}のページへ
            </Link>
            <ReportPrintButton className="inline-flex items-center gap-2 rounded-md border border-white/60 px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-navy" />
          </div>
          <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-[oklch(0.82_0.08_80)] print:text-muted-foreground">PREMIUM ANALYSIS ／ 企業レポート</p>
          <h1 className="mt-2 font-serif text-[2rem] leading-tight font-semibold md:text-[3rem]">{company.name}</h1>
          <p className="figures mt-2 text-sm text-white/75 print:text-muted-foreground">
            {company.officialName} ・ 証券コード {company.code}
            {industryName && <> ・ {industryName}</>}
          </p>
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-white/30 px-4 py-1.5 text-xs text-white/85 print:border-border print:text-muted-foreground">
            {latest && <span>最新期 {latest.fiscalYear}</span>}
            <span aria-hidden>|</span>
            <span>データ時点 {formatDateJa(company.updatedAt)}</span>
            <span aria-hidden>|</span>
            <span>出典：有価証券報告書（EDINET）</span>
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
                <ListOrdered className="size-3.5" aria-hidden /> 目次
              </p>
              {toc}
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-xs leading-5 text-muted-foreground">
              <p>このレポートは PDF で保存できます。畳んである数字の表も、すべて開いた状態で印刷されます。</p>
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
                  <KpiCard icon={Globe} label="海外売上高比率" value={percent(overseas.value)} note={`計算値（${overseas.fiscalYear}）`} />
                ) : (
                  employees && <KpiCard icon={Users} label={employees.label} value={`${employees.value.toLocaleString("ja-JP")}人`} note={change(employees.change)} />
                )}
              </ul>
            )}
            {summary && (
              <p className="mt-2 text-xs text-muted-foreground">
                {summary.fiscalYear}の印字値。前期比は計算値（最新期 ÷ 前期 − 1）で、会計基準と売上の範囲が前期と同じ場合だけ示します。
              </p>
            )}
            {meaning.length > 0 && <MeaningBlock sentences={meaning} />}
          </Chapter>

          <PremiumGate
            title={`${company.name}の企業レポート`}
            teaser="5期の印字値、売上の内訳（事業別・地域別）、計算値の指標と業界の中での位置（中央値・四分位・順位）を、印刷してそのまま提示できる1枚のレポートにまとめたものです。数値はすべて有価証券報告書の印字値と、そこから計算した値だけで、出典を末尾に付けています。"
            returnAnchor="performance"
          >
            <div className="space-y-14">
              {records.length > 0 && (
                <Chapter
                  id="performance"
                  number={ch("performance").number}
                  title={ch("performance").title}
                  lead="棒は有価証券報告書「主要な経営指標等の推移」の印字値、線は利益の行を売上で割った計算値です。"
                >
                  <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                    <TrendChart records={records} />
                  </div>
                  <Fold label={`5期の数字の表（${lines.length}項目・印字値）`}>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <caption className="sr-only">5期の数字（有価証券報告書の印字値）</caption>
                        <thead>
                          <tr className="border-b border-foreground/40 text-left">
                            <th scope="col" className="sticky left-0 bg-card py-2 pr-3 font-medium whitespace-nowrap">項目</th>
                            {records.map((r) => (
                              <th scope="col" key={r.periodEnd} className="figures py-2 pr-3 text-right font-medium whitespace-nowrap">
                                {r.fiscalYear}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {lines.map((line) => (
                            <tr key={line.label} className="border-b border-border/70">
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
                      金額は有価証券報告書の「主要な経営指標等の推移」に印字されたとおり。項目名は最新期の有報の表記です。表は横にスクロールできます。
                    </p>
                  </Fold>
                </Chapter>
              )}

              {(company.segmentRevenue || company.regionalRevenue) && (
                <Chapter
                  id="structure"
                  number={ch("structure").number}
                  title={ch("structure").title}
                  lead="有価証券報告書のセグメント情報・地域ごとの情報に印字された金額から、それぞれの割合を計算しています。"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {company.segmentRevenue && (
                      <div className="rounded-xl border border-border bg-card p-4 md:p-5">
                        <h3 className="font-serif text-base font-semibold">事業別の{company.segmentRevenue.label}<span className="figures ml-1 text-sm font-normal text-muted-foreground">（{company.segmentRevenue.fiscalYear}）</span></h3>
                        <div className="mt-4"><Donut title={`事業別の${company.segmentRevenue.label}`} parts={segmentParts} unitLabel={company.segmentRevenue.label} /></div>
                      </div>
                    )}
                    {company.regionalRevenue && (
                      <div className="rounded-xl border border-border bg-card p-4 md:p-5">
                        <h3 className="font-serif text-base font-semibold">地域別の{company.regionalRevenue.label}<span className="figures ml-1 text-sm font-normal text-muted-foreground">（{company.regionalRevenue.fiscalYear}）</span></h3>
                        <div className="mt-4"><Donut title={`地域別の${company.regionalRevenue.label}`} parts={regionParts} unitLabel={company.regionalRevenue.label} /></div>
                      </div>
                    )}
                  </div>
                  <Fold label="金額の表（印字値）">
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
                      <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-full bg-[var(--ink)]" />この会社</span>
                      <span className="inline-flex items-center gap-1.5"><span className="h-3 w-0.5 bg-muted-foreground" />業界の中央値</span>
                      <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-5 rounded-full bg-[var(--chart-revenue)]/35" />業界の中ほど半分（第1〜第3四分位）</span>
                    </p>
                  )}
                  <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                    {layer.metrics.map((m) => (
                      <li key={m.key} className="grid gap-2 px-4 py-3.5 sm:grid-cols-[minmax(0,13rem)_6.5rem_minmax(0,1fr)] sm:items-center sm:gap-4 md:px-5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{m.fiscalYear}・計算値</p>
                        </div>
                        <p className="figures text-lg font-semibold sm:text-right">{formatValue(m, m.value)}</p>
                        {m.industry ? (
                          <div>
                            <PositionBar value={m.value} median={m.industry.median} q1={m.industry.q1} q3={m.industry.q3} />
                            <p className="figures mt-1 text-xs text-muted-foreground">
                              中央値 {formatValue(m, m.industry.median)} ・ {m.industry.rank}位 / {m.industry.members}社
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">業界で比べられる会社が少ないため、分布は示していません。</p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <Fold label="計算式と分布の表（中央値・四分位・順位・パーセンタイル）">
                    <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
                      業界の分布は、主たる産業が同じ掲載企業
                      {layer.industryName && `（${layer.industryName}）`}
                      {layer.industryMembers > 0
                        ? `${layer.industryMembers}社のうち、最新期がこの会社と1年以内に終わる${layer.comparableMembers}社の最新期から同じ計算をしたもので`
                        : "の各社の最新期から同じ計算をしたもので"}
                      す。パーセンタイルは、その値より小さい会社の割合です。
                    </p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <caption className="sr-only">計算値と、業界の中での位置</caption>
                        <thead>
                          <tr className="border-b border-foreground/40 text-left">
                            <th scope="col" className="sticky left-0 bg-card py-2 pr-3 font-medium whitespace-nowrap">指標（計算値）</th>
                            <th scope="col" className="py-2 pr-3 font-medium whitespace-nowrap">自社</th>
                            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">業界の中央値</th>
                            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">四分位（第1〜第3）</th>
                            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">順位</th>
                            <th scope="col" className="py-2 text-right font-medium whitespace-nowrap">パーセンタイル</th>
                          </tr>
                        </thead>
                        <tbody>
                          {layer.metrics.map((m) => (
                            <tr key={m.key} className="border-b border-border/70 align-top">
                              <th scope="row" className="sticky left-0 max-w-[11rem] bg-card py-2 pr-3 text-left font-normal">
                                <span className="whitespace-nowrap">{m.title}</span>
                                <span className="block text-xs text-muted-foreground">
                                  {m.formula}（{m.fiscalYear}）
                                </span>
                                {m.note && <span className="block text-xs text-muted-foreground">{m.note}</span>}
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
                      「—」は、その指標を計算できる会社が業界に少なく、分布を示していないものです（自社の値は印字値から計算できています）。前期比は、会計基準と売上の範囲が前期と同じ場合だけ計算しています。
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
              lead="規模と地位・成長・収益性・財務の安定・外部環境との接続の5つの問いで、数字を読みます。各観点を開くと、自社の値と業界の中央値の表が出ます。5観点を合成したスコアや格付けは作りません。"
            >
              {positionedAxes >= MIN_RADAR_AXES && (
                <div className="mb-6 grid items-center gap-6 rounded-xl border border-border bg-card p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-6">
                  <figure>
                    <PerspectiveRadar axes={axes} />
                    <figcaption className="mt-2 text-center text-xs leading-5 text-muted-foreground">
                      外側ほど、その指標の値が業界{analysis.industryName && `（${analysis.industryName}）`}の中で大きい。点線は業界の中央値。
                    </figcaption>
                  </figure>
                  <div>
                    <h3 className="font-serif text-base font-semibold">5観点の業界内の位置</h3>
                    <ul className="mt-3 divide-y divide-border">
                      {axes.map((a) => (
                        <li key={a.perspective} className="py-2.5">
                          <p className="flex items-baseline justify-between gap-3 text-sm">
                            <span className="font-medium">{a.perspectiveTitle}</span>
                            <span className="figures font-semibold">{a.percentile === null ? "分布なし" : `パーセンタイル ${a.percentile}`}</span>
                          </p>
                          <p className="figures mt-0.5 text-xs text-muted-foreground">
                            {a.indicator}
                            {a.row && <> {formatAnalysisValue(a.row, a.row.value)}（{a.row.fiscalYear}）</>}
                            {a.row?.industry && <> ・ {a.row.industry.rank}位 / {a.row.industry.members}社</>}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      各軸は観点ごとの代表の指標1つで、パーセンタイルは業界でその値より小さい会社の割合です。大きいことは良いことを意味せず（自己資本比率や海外売上高比率は会社の形を示すもの）、5つを足したり面積で比べたりする点数ではありません。
                    </p>
                  </div>
                </div>
              )}
              <CompanyAnalysisSection company={company} companies={companies} analysis={analysis} folded />
            </Chapter>
          )}

          <Chapter id="check" number={ch("check").number} title={ch("check").title} lead="次の期の数字を予想し、有報が出たら答え合わせをします（この章は無料です）。">
            <PredictionPanel companyId={company.id} data={predictionDataFor(company, { explain: true })} />
          </Chapter>

          <Chapter id="sources" number={ch("sources").number} title={ch("sources").title}>
            {usedSources.length > 0 && (
              <ul className="space-y-2 text-sm leading-6">
                {usedSources.map((s) => (
                  <li key={s.id}>
                    <span className="font-medium">{s.title}</span>
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
                日本企業百科事典のプレミアムレポートです。数値は有価証券報告書など上記の出典に印字された値と、そこから計算した値（計算値）だけを使い、株価・評価・推奨は含みません。データ時点: {formatDateJa(company.updatedAt)}。
                プレミアムプランの特典として、このレポートは印刷して第三者への提示にも使えます。
              </p>
            </footer>
          </Chapter>
        </div>
      </div>
    </div>
  );
}
