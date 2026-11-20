import Link from "next/link";
import { RichText } from "@/components/rich-text/rich-text";
import { reportMetrics, type ReportMetric } from "@/lib/report-metrics";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { formatDateJa, formatYen } from "@/lib/utils/format";
import type { Company, FinancialRecord } from "@/types/company";
import { PremiumGate } from "./premium-gate";
import { ReportPrintButton } from "./report-print-button";
import styles from "./company-report.module.css";

/**
 * The premium company report (JCE-073): one printable summary of a company, modelled on the first page of a
 * credit report with the rating replaced by verified facts — the company's own description, five periods of
 * printed figures, what the latest revenue is made of, and the computed layer (計算値) with the company's
 * position in its industry. Every figure traces to the sources listed at the end. Nothing here is a rating
 * or advice (invariant 4); the free company page keeps all of the underlying facts.
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

export function CompanyReport({ company, companies }: { company: Company; companies: Company[] }) {
  const records = byPeriod(company.financials);
  const latest = records.at(-1);
  const lines = records.length > 0 ? printedLines(records) : [];
  const layer = reportMetrics(company, companies);
  const primary = company.industries.find((i) => i.primary) ?? company.industries[0];
  const industryName = primary ? INDUSTRY_LABELS[primary.industryId].name : null;

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

  return (
    <div className={`company-report mx-auto max-w-4xl px-5 pt-7 pb-16 md:px-8 ${styles.report}`}>
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link href={`/companies/${company.id}`} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          ← {company.name}のページへ
        </Link>
        <ReportPrintButton />
      </div>

      <header className="mt-6 border-b-2 border-foreground pb-5">
        <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">PREMIUM REPORT ／ 企業レポート</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">{company.name}</h1>
        <p className="figures mt-2 text-sm text-muted-foreground">
          {company.officialName} ・ 証券コード {company.code}
          {industryName && <> ・ {industryName}</>}
          {latest && <> ・ 最新期 {latest.fiscalYear}</>}
        </p>
        {company.description && (
          <div className="prose-ja mt-3 max-w-3xl">
            <RichText text={company.description} />
          </div>
        )}
      </header>

      <div id="report" className="mt-8 scroll-mt-24">
        <PremiumGate
          title={`${company.name}の企業レポート`}
          teaser="5期の印字値、売上の内訳（事業別・地域別）、計算値の指標と業界の中での位置（中央値・四分位・順位）を、印刷してそのまま提示できる1枚のレポートにまとめたものです。数値はすべて有価証券報告書の印字値と、そこから計算した値だけで、出典を末尾に付けています。"
          returnAnchor="report"
        >
          <div className="space-y-10">
            {records.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-semibold">5期の数字（有価証券報告書の印字値）</h2>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <caption className="sr-only">5期の数字（有価証券報告書の印字値）</caption>
                    <thead>
                      <tr className="border-b border-foreground/40 text-left">
                        <th scope="col" className="sticky left-0 bg-background py-2 pr-3 font-medium whitespace-nowrap">項目</th>
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
                          <th scope="row" className="sticky left-0 bg-background py-1.5 pr-3 text-left font-normal whitespace-nowrap">{line.label}</th>
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
                <p className="mt-1 text-xs text-muted-foreground sm:hidden">表は横にスクロールできます。</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  金額は有価証券報告書の「主要な経営指標等の推移」に印字されたとおり。項目名は最新期の有報の表記です。
                </p>
              </section>
            )}

            {(company.segmentRevenue || company.regionalRevenue) && (
              <section>
                <h2 className="font-serif text-lg font-semibold">売上の内訳</h2>
                <p className="mt-1 text-sm text-muted-foreground">有価証券報告書のセグメント情報・地域ごとの情報に印字された金額。割合は計算値です。</p>
                <div className="mt-4 grid gap-8 md:grid-cols-2">
                  {company.segmentRevenue && (
                    <Composition
                      title={`事業別の${company.segmentRevenue.label}`}
                      fiscalYear={company.segmentRevenue.fiscalYear}
                      parts={company.segmentRevenue.items.map((i) => ({ name: businessNames.get(i.businessId) ?? i.businessId, amount: i.amount }))}
                    />
                  )}
                  {company.regionalRevenue && (
                    <Composition
                      title={`地域別の${company.regionalRevenue.label}`}
                      fiscalYear={company.regionalRevenue.fiscalYear}
                      parts={company.regionalRevenue.items.map((i) => ({ name: i.region, amount: i.amount }))}
                    />
                  )}
                </div>
              </section>
            )}

            {layer.metrics.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-semibold">計算値と、業界の中での位置</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                  印字値から計算した値（計算値）です。業界の分布は、主たる産業が同じ掲載企業
                  {layer.industryName && `（${layer.industryName}）`}
                  {layer.industryMembers > 0
                    ? `${layer.industryMembers}社のうち、最新期がこの会社と1年以内に終わる${layer.comparableMembers}社の最新期から同じ計算をしたもので`
                    : "の各社の最新期から同じ計算をしたもので"}
                  、中央値・四分位・順位・パーセンタイル（その値より小さい会社の割合）を並べています。位置を示すもので、会社の良し悪しを判定するものではありません。
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <caption className="sr-only">計算値と、業界の中での位置</caption>
                    <thead>
                      <tr className="border-b border-foreground/40 text-left">
                        <th scope="col" className="sticky left-0 bg-background py-2 pr-3 font-medium whitespace-nowrap">指標（計算値）</th>
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
                          <th scope="row" className="sticky left-0 max-w-[11rem] bg-background py-2 pr-3 text-left font-normal">
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
                <p className="mt-1 text-xs text-muted-foreground sm:hidden">表は横にスクロールできます。</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  「—」は、その指標を計算できる会社が業界に少なく、分布を示していないものです（自社の値は印字値から計算できています）。前期比は、会計基準と売上の範囲が前期と同じ場合だけ計算しています。
                </p>
              </section>
            )}

            {usedSources.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-semibold">出典</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6">
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
              </section>
            )}

            <footer className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
              <p>
                日本企業百科事典のプレミアムレポートです。数値は有価証券報告書など上記の出典に印字された値と、そこから計算した値（計算値）だけを使い、株価・評価・推奨は含みません。データ時点: {formatDateJa(company.updatedAt)}。
                プレミアムプランの特典として、このレポートは印刷して第三者への提示にも使えます。
              </p>
            </footer>
          </div>
        </PremiumGate>
      </div>
    </div>
  );
}
