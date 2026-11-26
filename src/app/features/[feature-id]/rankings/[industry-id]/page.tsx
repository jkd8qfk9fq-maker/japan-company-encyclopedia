import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { features } from "@/data/features";
import { buildFeatureRanking, featureRankingLinks } from "@/lib/feature-rankings";
import { companyRepository, featureRepository } from "@/lib/repositories";
import { T } from "@/components/i18n/t";
import { L } from "@/components/i18n/label";

export const dynamicParams = false;

/**
 * The routes are exactly the (feature, industry) pairs the features' industry tables link to
 * (JCE-119): derived from the built features, so a link can never land on a missing page.
 */
export function generateStaticParams() {
  const pairs = featureRankingLinks(features);
  // An empty list would make the build treat the segment as unused; a placeholder
  // param that 404s keeps the route valid with zero pairs (the features page's rule).
  return pairs.length > 0
    ? pairs.map((p) => ({ "feature-id": p.featureId, "industry-id": p.industryId }))
    : [{ "feature-id": "none", "industry-id": "none" }];
}

type Props = { params: Promise<{ "feature-id": string; "industry-id": string }> };

async function load(featureId: string, industryId: string) {
  const feature = await featureRepository.get(featureId);
  if (!feature) return null;
  const ranking = buildFeatureRanking(featureId, industryId, await companyRepository.list());
  return ranking ? { feature, ranking } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "feature-id": featureId, "industry-id": industryId } = await params;
  const loaded = await load(featureId, industryId);
  if (!loaded) return {};
  const { feature, ranking } = loaded;
  return {
    title: `${ranking.industryName}の${ranking.metric}ランキング`,
    description: `特集「${feature.title}」の${ranking.metric}を、${ranking.industryName}に属する会社ごとに高い順に並べました。${ranking.formula}。`,
    alternates: { canonical: `/features/${featureId}/rankings/${industryId}` },
  };
}

export default async function FeatureRankingPage({ params }: Props) {
  const { "feature-id": featureId, "industry-id": industryId } = await params;
  const loaded = await load(featureId, industryId);
  if (!loaded) notFound();
  const { feature, ranking } = loaded;
  const max = Math.max(...ranking.rows.map((r) => Math.abs(r.value)), 0);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8">
      <p className="text-sm">
        <Link href={`/features/${feature.id}`} className="underline underline-offset-2">
          <span data-l="ja">特集「<L s={feature.title} />」
        </span><span data-l="en">Feature: &quot;<L s={feature.title} />&quot;</span></Link>
      </p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">
        <span data-l="ja">{ranking.industryName}の{ranking.metric}ランキング
      </span><span data-l="en">{ranking.metric} ranking of {ranking.industryName}</span></h1>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        <span data-l="ja">特集「<L s={feature.title} />」で業界の中央値を並べた{ranking.metric}を、{ranking.industryName}に属する会社ごとに
        高い順に並べたものです。対象は{ranking.valueLabel}が分かる{ranking.rows.length.toLocaleString("ja-JP")}社で、
        {ranking.medianValue !== null && (
          <>
            <span data-l="ja">中央値は{ranking.format(ranking.medianValue)}でした。
          </span><span data-l="en">The median was {ranking.format(ranking.medianValue)}.</span></>
        )}
        並びは値そのものの順序で、会社の良し悪しを示すものではありません。
      </span><span data-l="en">In the feature &quot;<L s={feature.title} />&quot;, this ranks the industry median {ranking.metric} from highest to lowest for the companies in {ranking.industryName}. It covers {ranking.rows.length.toLocaleString("ja-JP")} companies with known {ranking.valueLabel}. {ranking.medianValue !== null && (
          <>
            <span data-l="ja">中央値は{ranking.format(ranking.medianValue)}でした。
          </span><span data-l="en">The median was {ranking.format(ranking.medianValue)}.</span></>
        )}The ordering reflects the values themselves and does not indicate how good or bad a company is.</span></p>

      <ol className="mt-8 divide-y divide-border border-y border-border">
        {ranking.rows.map((row) => (
          <li key={row.companyId} className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 py-3 text-sm">
            <span className="figures text-muted-foreground"><span data-l="ja">{row.rank}位</span><span data-l="en">No. {row.rank}</span></span>
            <span>
              <Link href={`/companies/${row.companyId}`} className="font-medium underline-offset-2 hover:underline">
                <L s={row.name} />
              </Link>
              <span className="mt-1 block h-1.5 rounded-full bg-muted" aria-hidden>
                <span
                  className="block h-1.5 rounded-full bg-navy"
                  style={{ width: `${max > 0 ? Math.max(2, (Math.abs(row.value) / max) * 100) : 0}%` }}
                />
              </span>
            </span>
            <span className="text-right">
              <span className="figures font-medium">{row.valueText}</span>
              <span className="block text-xs text-muted-foreground">
                {ranking.detailLabel} {row.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>

      {ranking.caution && <p className="mt-4 text-xs leading-6 text-muted-foreground">{ranking.caution}</p>}

      <section aria-labelledby="method" className="mt-10 rounded-md border border-border bg-paper p-5 text-sm leading-7">
        <h2 id="method" className="font-serif text-lg font-semibold">
          <T m={{ ja: "算出方法", en: "Methodology" }} />
        </h2>
        <dl className="mt-2 grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <dt className="text-muted-foreground"><T m={{ ja: "計算式", en: "Formula" }} /></dt>
          <dd><L s={ranking.formula} /></dd>
          <dt className="text-muted-foreground"><T m={{ ja: "対象企業", en: "Companies covered" }} /></dt>
          <dd>
            <span data-l="ja"><L s={ranking.basis} />会社は主な業界1つに数えます。
          </span><span data-l="en"><L s={ranking.basis} />Each company is counted in one main industry.</span></dd>
          <dt className="text-muted-foreground"><T m={{ ja: "特集", en: "Features" }} /></dt>
          <dd>
            <span data-l="ja"><Link href={`/features/${feature.id}`} className="underline underline-offset-2">
              <L s={feature.title} />
            </Link>
            （業界別の中央値はこちら）
          </span><span data-l="en"><Link href={`/features/${feature.id}`} className="underline underline-offset-2">
              <L s={feature.title} />
            </Link> (industry medians here)</span></dd>
          <dt className="text-muted-foreground"><T m={{ ja: "業界", en: "Industry" }} /></dt>
          <dd>
            <Link href={`/industries/${ranking.industryId}`} className="underline underline-offset-2">
              <span data-l="ja">{ranking.industryName}の業界ページ
            </span><span data-l="en">{ranking.industryName} industry page</span></Link>
          </dd>
          <dt className="text-muted-foreground"><T m={{ ja: "更新", en: "Updated" }} /></dt>
          <dd><T m={{ ja: "掲載データの更新にあわせて、サイトの公開時に自動で集計し直します。", en: "Recalculated automatically when the site is published, in step with updates to the data." }} /></dd>
        </dl>
      </section>
    </div>
  );
}
