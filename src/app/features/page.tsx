import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Coins, Gauge, Globe, Tag, TrendingUp, Users, Wallet, type LucideIcon } from "lucide-react";
import { FEATURE_IMAGES, FEATURES_HERO_IMAGE } from "@/assets/features";
import { FeatureCard, accentFor } from "@/components/feature/feature-card";
import { featureRepository } from "@/lib/repositories";
import type { Feature } from "@/types/feature";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

export const metadata: Metadata = {
  title: "特集",
  description: "企業と業界を、一つの問いから読み解く特集。数字はすべて有価証券報告書から。",
  alternates: { canonical: "/features" },
};

/** An icon per theme, so the theme row and the category grid can be read without reading. Unknown themes get a tag. */
const TOPIC_ICONS: Record<string, LucideIcon> = {
  海外売上: Globe,
  給与: Wallet,
  成長: TrendingUp,
  雇用: Users,
  配当: Coins,
  生産性: Gauge,
};
const iconFor = (topic: string) => TOPIC_ICONS[topic] ?? Tag;

/** Each theme once, in list order, with the newest feature on it — where its chip and tile lead. */
function themesOf(features: Feature[]) {
  const themes = new Map<string, { topic: string; first: Feature; count: number }>();
  for (const f of features) {
    if (!f.topic) continue;
    const t = themes.get(f.topic);
    if (t) t.count += 1;
    else themes.set(f.topic, { topic: f.topic, first: f, count: 1 });
  }
  return [...themes.values()];
}

/**
 * The features list, laid out like the magazine and news front pages readers scan every day (JCE-113): a photograph
 * band with the page's name, the themes as a row of chips, the newest feature as a lead with its headline figures,
 * then 新着 as a thumbnail list beside a sidebar. The sidebar of those sites ranks by page views; this site has no
 * view counts it may show, so its list ranks nothing — it puts each feature's headline figure first (数字で選ぶ), the
 * one thing a reader here chooses by. Every figure is the feature's own computed keyFigure.
 */
export default async function FeaturesPage() {
  const features = await featureRepository.list();
  const [lead, ...rest] = features;
  const themes = themesOf(features);

  return (
    <div className="pb-16">
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Image src={FEATURES_HERO_IMAGE} alt="" fill priority placeholder="blur" sizes="100vw" className="-z-10 object-cover opacity-60" />
        {/* Navy from the left, so the title sits on a calm field and the photograph shows on the right. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/10" />
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-[oklch(0.82_0.08_80)]" aria-hidden>
            FEATURES <span className="h-px w-10 bg-current" />
          </p>
          <h1 className="mt-3 font-serif text-[2.75rem] leading-none font-semibold md:text-[4.5rem]"><T m={{ ja: "特集", en: "Features" }} /></h1>
          <p className="mt-5 max-w-xl font-serif text-[1.0625rem] leading-relaxed text-white/90 md:text-xl"><T m={{ ja: "一つの問いから、企業と業界をまたいで読む。", en: "Read across companies and industries, starting from a single question." }} /></p>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/65 md:text-sm"><T m={{ ja: "数字はすべて掲載企業の有価証券報告書から計算しています。", en: "All figures are calculated from the annual securities reports of the companies listed." }} /></p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {themes.length > 0 && (
          <nav aria-label="テーマ" className="relative z-10 -mt-6 flex items-center gap-3 overflow-x-auto rounded-2xl border border-border bg-card px-4 py-3 shadow-sm md:px-6">
            <span className="shrink-0 text-sm font-semibold"><T m={{ ja: "テーマ", en: "Themes" }} /></span>
            <ul className="flex gap-2">
              {themes.map(({ topic, first }) => {
                const Icon = iconFor(topic);
                return (
                  <li key={topic} className="shrink-0">
                    <Link href={`/features/${first.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium hover:border-foreground/40 hover:bg-muted">
                      <Icon className="size-4" aria-hidden /> {topic}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {!lead ? (
          <p className="mt-14 border-t border-foreground pt-8 text-muted-foreground"><T m={{ ja: "特集はまだ公開していません。", en: "No features have been published yet." }} /></p>
        ) : (
          <>
            <div className="mt-8 md:mt-10">
              <FeatureCard feature={lead} index={0} size="lead" />
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:gap-12">
              {rest.length > 0 && (
                <section aria-labelledby="latest-title">
                  <h2 id="latest-title" className="flex items-center gap-3 border-b border-border pb-3 font-serif text-xl font-semibold md:text-2xl">
                    <span data-l="ja" lang="ja"><span aria-hidden className="h-6 w-1 rounded-full bg-seal" /> 新着の特集
                  </span><span data-l="en" lang="en"><span aria-hidden className="h-6 w-1 rounded-full bg-seal" /> Latest features</span></h2>
                  <ul className="divide-y divide-border border-b border-border">
                    {rest.map((f, i) => (
                      <li key={f.id}><FeatureCard feature={f} index={i + 1} size="row" /></li>
                    ))}
                  </ul>
                </section>
              )}

              <aside className="space-y-6">
                <section aria-labelledby="figures-title" className="overflow-hidden rounded-2xl border border-border bg-card">
                  <h2 id="figures-title" className="bg-navy px-5 py-3.5 font-serif text-base font-semibold text-white"><T m={{ ja: "数字で選ぶ", en: "Browse by numbers" }} /></h2>
                  <ol className="divide-y divide-border px-4">
                    {features.map((f, i) => {
                      const k = f.keyFigures?.[0];
                      const image = FEATURE_IMAGES[f.id];
                      return (
                        <li key={f.id}>
                          <Link href={`/features/${f.id}`} className="group flex items-center gap-3 py-3.5">
                            <span className="figures flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{i + 1}</span>
                            <span className={`relative size-14 shrink-0 overflow-hidden rounded-md ${image ? "bg-foreground" : accentFor(i)}`}>
                              {image && <Image src={image} alt="" fill sizes="3.5rem" className="object-cover" />}
                            </span>
                            <span className="min-w-0">
                              <span className="line-clamp-2 text-sm leading-snug font-semibold group-hover:underline"><L s={f.title} /></span>
                              {k && (
                                <span className="mt-1 block text-xs text-muted-foreground">
                                  <span className="figures font-semibold text-foreground"><F s={k.value} /></span> <L s={k.label} />
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </section>

                {themes.length > 0 && (
                  <section aria-labelledby="themes-title" className="rounded-2xl border border-border bg-muted/40 p-5">
                    <h2 id="themes-title" className="font-serif text-base font-semibold"><T m={{ ja: "テーマから探す", en: "Browse by theme" }} /></h2>
                    <ul className="mt-4 grid grid-cols-3 gap-2">
                      {themes.map(({ topic, first, count }) => {
                        const Icon = iconFor(topic);
                        return (
                          <li key={topic}>
                            <Link href={`/features/${first.id}`} className="flex h-full flex-col items-center gap-1.5 rounded-lg bg-card px-1 py-3 text-center text-xs font-medium shadow-sm hover:bg-muted">
                              <Icon className="size-5" aria-hidden />
                              {topic}
                              {count > 1 && <span className="figures text-[0.6875rem] text-muted-foreground"><span data-l="ja" lang="ja">{count}本</span><span data-l="en" lang="en">{count} features</span></span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
              </aside>
            </div>
          </>
        )}

        <Link href="/about" className="group relative isolate mt-14 flex flex-col gap-5 overflow-hidden rounded-2xl bg-navy px-6 py-8 text-white md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_30%,oklch(0.45_0.09_258),transparent_60%)]" />
          <div>
            <p className="text-sm text-white/75"><T m={{ ja: "有価証券報告書で読む、日本の上場企業", en: "Japanese listed companies, read through annual securities reports" }} /></p>
            <p className="mt-2 font-serif text-[1.5rem] leading-snug font-semibold md:text-[2rem]"><T m={{ ja: "何をしている会社かが、わかる。", en: "Understand what a company does." }} /></p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/70 px-5 py-2.5 text-sm font-medium group-hover:bg-white group-hover:text-navy md:self-auto">
            <span data-l="ja" lang="ja">日本企業百科事典について <ArrowRight className="size-4" aria-hidden /></span><span data-l="en" lang="en">About the Japanese Company Encyclopedia <ArrowRight className="size-4" aria-hidden /></span>
          </span>
        </Link>
      </div>
    </div>
  );
}
