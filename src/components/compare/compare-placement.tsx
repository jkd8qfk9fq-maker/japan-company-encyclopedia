"use client";

// A Client Component: it is drawn inside the 見比べ tool, for the companies the reader picked in the browser.

import { useEffect, useState } from "react";
import { expandReportRow, type CompareMetric, type CompareReportIndex, type CompareReportRow, type CompareRow } from "@/lib/compare";
import { formatMetric } from "@/lib/utils/format";

/**
 * 業界の中での位置 (JCE-073) for two to five companies: each company's computed layer exactly as its 企業レポート shows
 * it — the value, its industry's median, middle half and the company's rank — side by side. Each company is placed
 * among its own industry; the table never ranks the chosen companies against each other.
 */

const ORDER = ["revenue", "revenue-growth-5y", "profit-margin", "net-margin", "equity-ratio", "revenue-per-employee", "overseas-ratio", "average-salary"];

const distinct = (values: string[]) => [...new Set(values)];

/** When the filings word a line differently, the row says what the formula is in plain words; each company's own
 * wording stays in its 企業レポート. */
const PLAIN_FORMULA: Record<string, string> = {
  "profit-margin": "印字された利益の行 ÷ 売上高（同じ期）",
  "net-margin": "純利益 ÷ 売上高（同じ期、各社が印字した行）",
};

const sameDistribution = (metrics: CompareMetric[]) => {
  const first = metrics[0]?.placement;
  return metrics.length > 1 && first && metrics.every((m) => m.placement && m.placement.members === first.members && m.placement.median === first.median && m.placement.q1 === first.q1 && m.placement.q3 === first.q3) ? first : null;
};

/** Where the rank sits from the smallest (0) to the largest (1), the scale the 帯 and 中央値 are drawn on. */
const position = (rank: number, members: number) => (members <= 1 ? 0.5 : (members - rank) / (members - 1));

function Cell({ metric, showLabel, shared }: { metric: CompareMetric | undefined; showLabel: boolean; shared: boolean }) {
  if (!metric) return <td className="px-2 py-2.5 align-top text-muted-foreground">データなし</td>;
  const p = metric.placement;
  return (
    <td className="px-2 py-2.5 align-top">
      {showLabel && <span className="block text-[0.6875rem] text-muted-foreground">{metric.label}</span>}
      <span className="figures font-semibold">{formatMetric(metric.unit, metric.value)}</span>
      {p ? (
        <>
          <span className="relative mt-2 block h-2 rounded-full bg-muted" aria-hidden>
            <span className="absolute inset-y-0 left-1/4 right-1/4 bg-navy/25 dark:bg-ink/30" />
            <span className="absolute inset-y-[-2px] left-1/2 w-px bg-foreground/60" />
            <span
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background bg-navy dark:bg-ink"
              style={{ left: `${position(p.rank, p.members) * 100}%` }}
            />
          </span>
          <span className="mt-1.5 block text-[0.6875rem] leading-5 text-muted-foreground">
            <span className="figures">{p.members}社中 {p.rank}位（上位{p.topPercent}%）</span>
            {!shared && (
              <>
                <br />
                中央値 <span className="figures">{formatMetric(metric.unit, p.median)}</span>
                <br />
                第1〜第3四分位 <span className="figures whitespace-nowrap">{formatMetric(metric.unit, p.q1)} 〜 {formatMetric(metric.unit, p.q3)}</span>
              </>
            )}
          </span>
          {metric.note && <span className="block text-[0.6875rem] leading-5 text-muted-foreground">{metric.note}</span>}
        </>
      ) : (
        <span className="mt-1 block text-[0.6875rem] text-muted-foreground">業界内で比べられる会社がありません</span>
      )}
    </td>
  );
}

export function ComparePlacement({ shown }: { shown: CompareRow[] }) {
  const [index, setIndex] = useState<CompareReportIndex | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // One file for everyone, fetched only here: which companies are on the table stays in the browser.
    fetch("/compare-report.json")
      .then((r) => (r.ok ? (r.json() as Promise<CompareReportIndex>) : Promise.reject(new Error(String(r.status)))))
      .then(setIndex, () => setFailed(true));
  }, []);

  if (failed) return <p className="text-sm text-muted-foreground">業界の中での位置を読み込めませんでした。通信状態を確かめて、もう一度開いてください。</p>;
  if (!index) return <p className="text-sm text-muted-foreground">業界の中での位置を読み込んでいます…</p>;

  const rows = shown.map((r) => ({ company: r, report: expandReportRow(index, r.id) }));
  const reports = rows.map((r) => r.report).filter((r): r is CompareReportRow => r !== null);
  const keys = ORDER.filter((key) => reports.some((r) => r.metrics.some((m) => m.key === key)));
  const industries = distinct(reports.map((r) => r.industry ?? "業界なし"));

  return (
    <section aria-labelledby="compare-placement-title">
      <h2 id="compare-placement-title" className="font-serif text-xl font-semibold">業界の中での位置</h2>
      <p className="mt-1 max-w-3xl text-xs leading-6 text-muted-foreground">
        各社を、それぞれの業界の掲載企業（最新期が1年以内に終わる会社）の中に置いたときの位置です。
        {industries.length > 1 && "業界が違う会社どうしの順位は、そのままは比べられません。"}
        数字はすべて有価証券報告書の印字値と、それを割り算した計算値です。
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{shown.map((r) => r.name).join("・")}の業界の中での位置</caption>
          <thead>
            <tr className="border-b border-foreground text-left">
              <th scope="col" className="sticky left-0 z-10 w-36 min-w-[7.5rem] bg-background px-2 py-2.5 text-xs font-medium text-muted-foreground">指標</th>
              {rows.map(({ company, report }) => (
                <th key={company.id} scope="col" className="min-w-[9.5rem] px-2 py-2.5 align-bottom">
                  <span className="font-medium">{company.name}</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {report ? `${report.industry ?? "業界なし"}・${report.comparableMembers}社と比較・${report.fiscalYear}` : "決算期なし"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => {
              const metrics = rows.map(({ report }) => report?.metrics.find((m) => m.key === key));
              const present = metrics.filter((m): m is CompareMetric => m !== undefined);
              const labels = distinct(present.map((m) => m.label));
              const formulas = distinct(present.map((m) => m.formula));
              const computed = present[0]!.computed;
              const formula = formulas.length > 1 && PLAIN_FORMULA[key] ? PLAIN_FORMULA[key] : formulas.join("／");
              const shared = sameDistribution(present);
              const unit = present[0]!.unit;
              return (
                <tr key={key} className="border-b border-border">
                  <th scope="row" className="sticky left-0 z-10 min-w-[7.5rem] bg-background px-2 py-2.5 text-left align-top font-medium">
                    {labels.join("／")}
                    <span className="mt-0.5 block text-[0.6875rem] font-normal leading-5 text-muted-foreground">
                      {computed ? `計算値：${formula}` : formula}
                    </span>
                    {shared && (
                      <span className="mt-1 block text-[0.6875rem] font-normal leading-5">
                        業界の中央値 <span className="figures">{formatMetric(unit, shared.median)}</span>
                        <br />
                        第1〜第3四分位 <span className="figures whitespace-nowrap">{formatMetric(unit, shared.q1)} 〜 {formatMetric(unit, shared.q3)}</span>
                      </span>
                    )}
                  </th>
                  {metrics.map((m, i) => (
                    <Cell key={rows[i]!.company.id} metric={m} showLabel={labels.length > 1} shared={shared !== null} />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="no-print mt-1 text-[0.6875rem] text-muted-foreground sm:hidden">表は横にスクロールできます。</p>
      <p className="mt-2 text-[0.6875rem] leading-5 text-muted-foreground">
        帯は業界の真ん中の半分（第1〜第3四分位）、縦線は中央値、点はその会社で、左ほど小さく右ほど大きい値です。位置は大きさの順で、良し悪しの判定ではありません。利益率は、同じ利益の行（経常利益・税引前利益など）を印字する会社どうしで比べています。
      </p>
    </section>
  );
}
