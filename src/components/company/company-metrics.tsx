import { SourceList } from "@/components/sources/source-list";
import type { CompanyMetrics as Metrics } from "@/lib/company-metrics";
import type { Source } from "@/types/source";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";

/**
 * 比較の目安 (JCE-038): the figures readers line companies up by. Ratios are computed from printed figures and say
 * so, with their formula; 平均年間給与 and 平均勤続年数 are the filing company's own (提出会社), as the filing prints
 * them. A figure the entry does not have is left out, not shown as a dash.
 */
export function CompanyMetrics({ metrics, sources }: { metrics: Metrics; sources: Source[] }) {
  const w = metrics.workforce;
  const s = metrics.shareFacts;
  const tenure =
    w && w.averageTenureYears !== null
      ? w.averageTenureMonths !== null
        ? `${w.averageTenureYears}年${w.averageTenureMonths}か月`
        : `${w.averageTenureYears}年`
      : null;

  const items = [
    metrics.netProfitMargin && {
      label: <T m={{ ja: "純利益率（計算値）", en: "Net margin (computed)" }} />,
      value: `${metrics.netProfitMargin.percent.toFixed(1)}%`,
      note: `${metrics.netProfitMargin.formula}（${metrics.netProfitMargin.fiscalYear}）`,
    },
    metrics.overseasSalesRatio && {
      label: <T m={{ ja: "海外売上高比率（計算値）", en: "Overseas revenue ratio (computed)" }} />,
      value: `${metrics.overseasSalesRatio.percent.toFixed(1)}%`,
      note: `${metrics.overseasSalesRatio.formula}（${metrics.overseasSalesRatio.fiscalYear}）`,
    },
    w && w.averageAnnualSalary !== null && {
      label: <T m={{ ja: "平均年間給与（提出会社）", en: "Average annual salary (filing company)" }} />,
      value: `${Math.round(w.averageAnnualSalary / 10_000).toLocaleString("ja-JP")}万円`,
      note: `${w.fiscalYear}${w.employees !== null ? `・提出会社の従業員${w.employees.toLocaleString("ja-JP")}人` : ""}`,
    },
    tenure && { label: <T m={{ ja: "平均勤続年数（提出会社）", en: "Average years of service (filing company)" }} />, value: tenure, note: w!.fiscalYear },
    s && s.dividendPerShare !== null && {
      label: <T m={{ ja: "1株当たり配当額（提出会社）", en: "Dividend per share (filing company)" }} />,
      value: `${s.dividendPerShare.toLocaleString("ja-JP", { maximumFractionDigits: 2 })}円`,
      note: `${s.fiscalYear}・有価証券報告書の印字`,
    },
    s && s.issuedShares !== null && {
      label: <T m={{ ja: "発行済株式総数（提出会社）", en: "Total shares issued (filing company)" }} />,
      value: `${s.issuedShares.toLocaleString("ja-JP")}株`,
      note: `${s.fiscalYear}末・有価証券報告書の印字`,
    },
    metrics.topBusinesses.length > 0 && { label: <T m={{ ja: "主な事業", en: "Main businesses" }} />, value: metrics.topBusinesses.join("・"), note: null },
  ].filter(Boolean) as { label: React.ReactNode; value: string; note: React.ReactNode | null }[];
  if (items.length === 0) return null;

  const sourceIds = [
    ...new Set([...(metrics.netProfitMargin?.sourceIds ?? []), ...(metrics.overseasSalesRatio?.sourceIds ?? []), ...(w?.sourceIds ?? []), ...(s?.sourceIds ?? [])]),
  ];

  return (
    <div className="mb-12">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground"><T m={{ ja: "比較の目安", en: "Comparison guide" }} /></h3>
      {/* Cells grow to fill their row, so two or four figures leave no empty slot showing the divider colour. */}
      <dl className="mt-3 flex flex-wrap gap-px overflow-hidden rounded-md border border-border bg-border">
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className="min-w-[14rem] flex-1 basis-56 bg-card p-4">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="figures mt-1 font-serif text-lg font-semibold"><F s={item.value} /></dd>
            {item.note && <dd className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</dd>}
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        <span data-l="ja" lang="ja">「計算値」は有価証券報告書に印字された数値から当サイトが計算したものです。
        {w && <T m={{ ja: "給与と勤続年数は提出会社（グループ全体ではない）の値です。", en: "Salary and years of service are for the filing company alone, not the whole group." }} />}
        {s && <T m={{ ja: "1株当たり配当額と発行済株式総数は有価証券報告書に印字された値で、株価・時価総額・配当利回りは扱いません。", en: "Dividend per share and total shares issued are values printed in the annual securities report. Share price, market capitalization and dividend yield are not covered." }} />}</span><span data-l="en" lang="en">&quot;Computed&quot; means calculated by this site from values printed in the annual securities report. {w && <T m={{ ja: "給与と勤続年数は提出会社（グループ全体ではない）の値です。", en: "Salary and years of service are for the filing company alone, not the whole group." }} />}{s && <T m={{ ja: "1株当たり配当額と発行済株式総数は有価証券報告書に印字された値で、株価・時価総額・配当利回りは扱いません。", en: "Dividend per share and total shares issued are values printed in the annual securities report. Share price, market capitalization and dividend yield are not covered." }} />}</span>
      </p>
      {sourceIds.length > 0 && <SourceList sources={sources} sourceIds={sourceIds} variant="refs" />}
    </div>
  );
}
