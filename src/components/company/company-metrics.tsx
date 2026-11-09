import { SourceList } from "@/components/sources/source-list";
import type { CompanyMetrics as Metrics } from "@/lib/company-metrics";
import type { Source } from "@/types/source";

/**
 * 比較の目安 (JCE-038): the figures readers line companies up by. Ratios are computed from printed figures and say
 * so, with their formula; 平均年間給与 and 平均勤続年数 are the filing company's own (提出会社), as the filing prints
 * them. A figure the entry does not have is left out, not shown as a dash.
 */
export function CompanyMetrics({ metrics, sources }: { metrics: Metrics; sources: Source[] }) {
  const w = metrics.workforce;
  const tenure =
    w && w.averageTenureYears !== null
      ? w.averageTenureMonths !== null
        ? `${w.averageTenureYears}年${w.averageTenureMonths}か月`
        : `${w.averageTenureYears}年`
      : null;

  const items = [
    metrics.netProfitMargin && {
      label: "純利益率（計算値）",
      value: `${metrics.netProfitMargin.percent.toFixed(1)}%`,
      note: `${metrics.netProfitMargin.formula}（${metrics.netProfitMargin.fiscalYear}）`,
    },
    metrics.overseasSalesRatio && {
      label: "海外売上高比率（計算値）",
      value: `${metrics.overseasSalesRatio.percent.toFixed(1)}%`,
      note: `${metrics.overseasSalesRatio.formula}（${metrics.overseasSalesRatio.fiscalYear}）`,
    },
    w && w.averageAnnualSalary !== null && {
      label: "平均年間給与（提出会社）",
      value: `${Math.round(w.averageAnnualSalary / 10_000).toLocaleString("ja-JP")}万円`,
      note: `${w.fiscalYear}${w.employees !== null ? `・提出会社の従業員${w.employees.toLocaleString("ja-JP")}人` : ""}`,
    },
    tenure && { label: "平均勤続年数（提出会社）", value: tenure, note: w!.fiscalYear },
    metrics.topBusinesses.length > 0 && { label: "主な事業", value: metrics.topBusinesses.join("・"), note: null },
  ].filter((item): item is { label: string; value: string; note: string | null } => Boolean(item));
  if (items.length === 0) return null;

  const sourceIds = [
    ...new Set([...(metrics.netProfitMargin?.sourceIds ?? []), ...(metrics.overseasSalesRatio?.sourceIds ?? []), ...(w?.sourceIds ?? [])]),
  ];

  return (
    <div className="mb-12">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">比較の目安</h3>
      <dl className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="bg-card p-4">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="figures mt-1 font-serif text-lg font-semibold">{item.value}</dd>
            {item.note && <dd className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</dd>}
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        「計算値」は有価証券報告書に印字された数値から当サイトが計算したものです。給与と勤続年数は提出会社（グループ全体ではない）の値です。
      </p>
      {sourceIds.length > 0 && <SourceList sources={sources} sourceIds={sourceIds} />}
    </div>
  );
}
