import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import {
  formatIndicatorValue,
  getIndicator,
  indicators,
  industriesForIndicator,
  latestObservation,
  observationPeriodLabel,
  previousObservation,
} from "@/lib/indicators";
import { formatDateJa } from "@/lib/utils/format";
import { SITE_NAME } from "@/lib/site";
import type { Indicator } from "@/types/indicator";

/*
 * One page per indicator (JCE-078 §4) — the only per-indicator route; the count grows with the
 * indicator list, never with the company count. Values are the publisher's own, held as a monthly
 * snapshot; the page shows the latest value, the one before it, a year of movement and the recent
 * observations, with the source named. An indicator is environment, not a forecast.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return indicators.map((i) => ({ "indicator-id": i.id }));
}

export async function generateMetadata({ params }: PageProps<"/indicators/[indicator-id]">): Promise<Metadata> {
  const indicator = getIndicator((await params)["indicator-id"]);
  if (!indicator) return {};
  return {
    title: indicator.name,
    description: `${indicator.name}（${indicator.source.name}）の公表値を収録したページ。最新値と前回値、直近1年の推移と観測値を、出典つきで示します。`,
    alternates: { canonical: `/indicators/${indicator.id}` },
    openGraph: { title: `${indicator.name}｜${SITE_NAME}`, type: "article" },
  };
}

/** A small server-rendered line of the last twelve observations: shape only, the table carries the figures. */
function Sparkline({ indicator }: { indicator: Indicator }) {
  const points = indicator.observations.slice(-12);
  if (points.length < 2) return null;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = 280;
  const height = 64;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => `${(i * step).toFixed(1)},${(height - 6 - ((p.value - min) / span) * (height - 12)).toFixed(1)}`).join(" ");
  return (
    <figure className="mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm" role="img" aria-label={`${indicator.name}の直近${points.length}回の推移`}>
        <polyline points={coords} fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <figcaption className="mt-1 text-xs text-muted-foreground">
        直近{points.length}回（{observationPeriodLabel(indicator, points[0]!.date)}〜{observationPeriodLabel(indicator, points.at(-1)!.date)}）の推移。最小{" "}
        {formatIndicatorValue(indicator, min)}、最大 {formatIndicatorValue(indicator, max)}（いずれも公表値）。
      </figcaption>
    </figure>
  );
}

export default async function IndicatorPage({ params }: PageProps<"/indicators/[indicator-id]">) {
  const indicator = getIndicator((await params)["indicator-id"]);
  if (!indicator) notFound();

  const latest = latestObservation(indicator);
  const previous = previousObservation(indicator);
  const change = latest && previous && previous.value !== 0 ? latest.value / previous.value - 1 : null;
  const recent = [...indicator.observations].reverse().slice(0, 24);
  const related = industriesForIndicator(indicator.id);

  return (
    <div className="mx-auto max-w-3xl px-5 pt-5 pb-16 md:px-8 md:pt-5">
      <p className="text-sm">
        <Link href="/analysis" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
          ← 企業分析（5観点）へ
        </Link>
      </p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">{indicator.name}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        出典:{" "}
        <a href={indicator.source.url} target="_blank" rel="noopener" className="underline underline-offset-4">
          {indicator.source.name}
        </a>
        ・単位: {indicator.unit}・頻度: {indicator.frequency === "monthly" ? "月次" : "四半期"}・スナップショット時点: {formatDateJa(indicator.updatedAt)}
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        公表された値をそのまま収録したものです。この指標は企業を取り巻く環境を示すもので、特定の会社や業界の業績を予測するものではありません。
      </p>

      {latest && (
        <section className="mt-8">
          <h2 className="font-serif text-lg font-semibold">最新の値</h2>
          <p className="figures mt-2 text-2xl font-semibold">
            {formatIndicatorValue(indicator, latest.value)}
            <span className="ml-1 text-base font-normal">{indicator.unit}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {observationPeriodLabel(indicator, latest.date)}
            {previous && (
              <>
                ・前回（{observationPeriodLabel(indicator, previous.date)}）: {formatIndicatorValue(indicator, previous.value)}
                {indicator.unit}
                {change !== null && (
                  <>
                    ・前回比 {(change * 100).toFixed(1).replace("-", "−")}%（計算値: 最新値 ÷ 前回値 − 1）
                  </>
                )}
              </>
            )}
          </p>
          <Sparkline indicator={indicator} />
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold">最近の観測値</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="border-collapse text-sm">
            <thead>
              <tr className="border-b border-foreground/40 text-left">
                <th scope="col" className="py-2 pr-6 font-medium">期間</th>
                <th scope="col" className="py-2 text-right font-medium">値（{indicator.unit}）</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.date} className="border-b border-border/70">
                  <td className="py-1.5 pr-6 whitespace-nowrap">{observationPeriodLabel(indicator, o.date)}</td>
                  <td className="figures py-1.5 text-right whitespace-nowrap">{formatIndicatorValue(indicator, o.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          直近{recent.length}回を表示しています。全期間の値は出典のページで確認できます。
        </p>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-lg font-semibold">この指標を並べる業界</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {related.map(({ industryId, note }) => (
              <li key={industryId}>
                <Link href={`/industries/${industryId}`} className="underline underline-offset-4">
                  {INDUSTRY_LABELS[industryId].name}
                </Link>
                <span className="block text-muted-foreground">{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
