import type { Metadata } from "next";
import Link from "next/link";
import { ANALYSIS_PERSPECTIVE_GUIDE } from "@/lib/company-analysis";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { formatIndicatorValue, indicators, indicatorsForIndustry, latestObservation, observationPeriodLabel } from "@/lib/indicators";
import { companyRepository } from "@/lib/repositories";
import { INDUSTRY_IDS } from "@/types/company";

export const metadata: Metadata = {
  title: "企業分析（5観点）",
  description:
    "日本企業百科事典の分析レイヤー。規模と地位・成長・収益性・財務の安定・外部環境との接続の5観点で、有価証券報告書の印字値と計算値だけから会社を読みます。スコアや格付けは作りません。",
  alternates: { canonical: "/analysis" },
};

/**
 * The entrance to the analysis layer (JCE-078): what the five perspectives are, the rules every
 * figure follows, and the index into industries and indicators. One page, however many companies —
 * the per-company analysis lives on each company's report page, never on a route of its own.
 */
export default async function AnalysisPage() {
  const companies = await companyRepository.list();
  const counts = new Map<string, number>();
  for (const c of companies) {
    const primary = (c.industries.find((i) => i.primary) ?? c.industries[0])?.industryId;
    if (primary) counts.set(primary, (counts.get(primary) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-5 pb-16 md:px-8 md:pt-5">
      <p className="eyebrow" aria-hidden>Analysis</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">企業分析（5観点）</h1>
      <p className="prose-ja mt-3 text-muted-foreground">
        企業の数字を、規模と地位・成長・収益性・財務の安定・外部環境との接続の5観点で読む仕組みです。各社のレポートページ（企業ページの「企業レポート」）に、その会社の分析が付いています。
      </p>
      <p className="prose-ja mt-3 text-muted-foreground">
        使う数字は、有価証券報告書の印字値と、そこから計算した値（計算値）だけです。計算値には計算式を併記し、業界の分布は主たる産業が同じ掲載企業のうち最新期が1年以内に終わる会社から作ります。分布を示せる会社が5社に満たない指標では、中央値も含め分布は出しません。5観点を合成したスコアや格付けは作らず、買い・売りの推奨や株価の指標も扱いません。
      </p>
      <p className="prose-ja mt-3 text-muted-foreground">
        各観点の要点（自社の値と業界の中央値）は無料で公開しています。分布の全体像（四分位・順位・パーセンタイル）、複数期の推移、経済指標との接続は分析レイヤーの範囲で、提供の形を準備しています。
      </p>

      <h2 className="mt-10 font-serif text-xl font-semibold">5観点</h2>
      <div className="mt-4 space-y-6">
        {ANALYSIS_PERSPECTIVE_GUIDE.map((p, i) => (
          <section key={p.id}>
            <h3 className="font-serif text-lg font-semibold">
              {i + 1}. {p.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{p.intro}</p>
          </section>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-xl font-semibold">業界別の分析</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        業界ページから、その業界の企業一覧と数字へ進めます。各社の分析は企業レポートの中にあります。
      </p>
      <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {INDUSTRY_IDS.map((id) => {
          const linked = indicatorsForIndustry(id);
          return (
            <li key={id} className="text-sm leading-6">
              <Link href={`/industries/${id}`} className="underline underline-offset-4">
                {INDUSTRY_LABELS[id].name}
              </Link>
              <span className="figures ml-2 text-muted-foreground">{counts.get(id) ?? 0}社</span>
              {linked.length > 0 && (
                <span className="block text-xs text-muted-foreground">
                  関連指標: {linked.map(({ indicator }) => indicator.name).join("、")}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="mt-10 font-serif text-xl font-semibold">経済指標</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        観点5（外部環境との接続）の土台になる公的統計のスナップショットです。公表した機関の値をそのまま収録し、月次で更新します。環境の提示であり、予測ではありません。
      </p>
      <ul className="mt-4 space-y-2">
        {indicators.map((indicator) => {
          const latest = latestObservation(indicator);
          return (
            <li key={indicator.id} className="text-sm leading-6">
              <Link href={`/indicators/${indicator.id}`} className="underline underline-offset-4">
                {indicator.name}
              </Link>
              {latest && (
                <span className="figures block text-muted-foreground sm:ml-2 sm:inline sm:whitespace-nowrap">
                  {observationPeriodLabel(indicator, latest.date)}: {formatIndicatorValue(indicator, latest.value)}
                  {indicator.unit}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
