import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { INDUSTRY_IMAGES } from "@/assets/industries";
import { SearchSuggest } from "@/components/search/search-suggest";
import { AdSlot } from "@/components/ads/ad-slot";
import { JapanMap, JapanMapLegend } from "@/components/region/japan-map";
import { ReaderTrail } from "@/components/company/reader-trail";
import { FeaturedCompanyCard } from "@/components/home/featured-company-card";
import { toCompanySummary } from "@/lib/company-summary";
import { featuredCompanies, recentlyUpdated, shortDate } from "@/lib/home";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { PREFECTURES } from "@/lib/prefectures";
import { companiesByPrefecture } from "@/lib/regions";
import { companyRepository, featureRepository, industryRepository, termRepository } from "@/lib/repositories";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { INDUSTRY_IDS } from "@/types/company";

export const metadata = {
  title: { absolute: `${SITE_NAME}｜何をしている会社かがわかる` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

/** Section title with the 朱 rule (see globals.css .seal-mark). */
function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="seal-mark font-serif text-[1.375rem] leading-tight font-semibold">
      {children}
    </h2>
  );
}

/**
 * The front page, after the operator's design reference (2026-10-11): a hero with search and three
 * facts about the site, then three columns — where to start, companies with their numbers, and what
 * to read next. Everything shown is something the site has: the reference's market-cap filters,
 * fiscal-year filters, compare tool, logos, saved-companies link and market-wide chart are not built
 * and are left out rather than drawn as dead controls. No stock data, no rankings (CLAUDE.md invariant 4).
 */
export default async function HomePage() {
  const [companies, features, researchedIndustries, terms, regions] = await Promise.all([
    companyRepository.list(),
    featureRepository.list(),
    industryRepository.list(),
    termRepository.list(),
    companiesByPrefecture(),
  ]);
  const summaries = companies.map(toCompanySummary);
  const featured = featuredCompanies(companies);
  const recent = recentlyUpdated(companies);

  const researched = new Set(researchedIndustries.map((i) => i.id));
  const industries = INDUSTRY_IDS.map((id) => ({
    id,
    ...INDUSTRY_LABELS[id],
    count: summaries.filter((c) => c.industries.some((i) => i.id === id)).length,
  })).filter((i) => i.count > 0 || researched.has(i.id));
  const topIndustries = [...industries].sort((a, b) => b.count - a.count).slice(0, 8);
  const prefecturesWithCompanies = PREFECTURES.filter((p) => regions.counts[p.id] > 0);
  const topPrefectures = [...prefecturesWithCompanies].sort((a, b) => regions.counts[b.id] - regions.counts[a.id]).slice(0, 6);

  // Search examples are companies with a written page, so a click always lands on something worth reading.
  const examples = featured.length > 0 ? featured : recent;

  // What to read next: features when there are any, otherwise the glossary.
  const reading =
    features.length > 0
      ? { heading: "特集を読む", href: "/features", all: "特集をすべて見る", items: features.slice(0, 3).map((f) => ({ key: f.id, href: `/features/${f.id}`, title: f.title, text: f.subtitle ?? "" })) }
      : terms.length > 0
        ? { heading: "用語を知る", href: "/terms", all: "用語集を見る", items: terms.slice(0, 3).map((t) => ({ key: t.id, href: `/terms#${t.id}`, title: t.term, text: t.description })) }
        : null;

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="home-hero" className="border-b border-border bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-5 py-10 md:px-8 md:py-12 lg:grid-cols-[21rem_minmax(0,1fr)_21rem] lg:items-center lg:gap-10">
          <div>
            <h1 id="home-hero" className="font-serif text-[1.75rem] leading-[1.5] font-semibold sm:text-[2rem] lg:text-[1.875rem]">
              企業を知ることは、
              <br />
              日本経済を知ること。
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              日本の上場企業を、ビジネス・財務・沿革の3つの軸から、一次情報に基づいてわかりやすく解説します。
            </p>
          </div>

          <div>
            <SearchSuggest id="home-search" variant="hero" />
            {examples.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">検索例</span>
                {examples.slice(0, 5).map((c) => (
                  <Link
                    key={c.id}
                    href={`/search?q=${encodeURIComponent(c.name)}`}
                    className="inline-flex min-h-8 items-center rounded-full border border-border bg-card px-3.5 text-xs hover:border-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">掲載企業</dt>
              <dd className="mt-1 font-serif text-[2rem] leading-none font-semibold">
                <span className="figures">{companies.length.toLocaleString("ja-JP")}</span>
                <span className="ml-1 text-sm">社</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">業界</dt>
              <dd className="mt-1 font-serif text-[2rem] leading-none font-semibold">
                <span className="figures">{industries.length}</span>
                <span className="ml-1 text-sm">分類</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">本社のある都道府県</dt>
              <dd className="mt-1 font-serif text-[2rem] leading-none font-semibold">
                <Link href="/prefectures" className="hover:underline hover:underline-offset-4">
                  <span className="figures">{prefecturesWithCompanies.length}</span>
                  <span className="ml-1 text-sm">都道府県</span>
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">一次資料を重視</dt>
              <dd className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <FileText className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden />
                有価証券報告書・EDINETなどの公開資料に基づく情報
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <ReaderTrail companies={summaries} />

      {/* WHERE: head offices on the map. Every prefecture is a link; the list beside it is the same data in words. */}
      <section aria-labelledby="home-map" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <div>
            <SectionTitle id="home-map">本社所在地から探す</SectionTitle>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              掲載企業の本社がある都道府県を、地図に色の濃さで示しました。都道府県を選ぶと、そこに本社がある企業を市区町村ごとに一覧できます。
            </p>
            <ol className="mt-6 grid max-w-md grid-cols-2 gap-x-6 border-t border-border">
              {topPrefectures.map((p) => (
                <li key={p.id} className="border-b border-border">
                  <Link href={`/prefectures/${p.id}`} className="group flex min-h-11 items-baseline justify-between gap-3 py-2 text-sm">
                    <span className="group-hover:underline group-hover:underline-offset-4">{p.name}</span>
                    <span className="figures text-xs text-muted-foreground">{regions.counts[p.id].toLocaleString("ja-JP")}社</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link
              href="/prefectures"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground px-5 text-sm hover:bg-foreground hover:text-background"
            >
              47都道府県の一覧と地図を見る
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <figure className="m-0">
            <JapanMap counts={regions.counts} className="mx-auto max-w-[30rem]" />
            <figcaption className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <JapanMapLegend />
              <span className="text-[0.6875rem] text-muted-foreground">出典：金融庁 EDINETコードリスト（加工）</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* WHAT: industries, each with its photograph. Ordered by how many companies the encyclopedia has in them. */}
      <section aria-labelledby="home-industries" className="mx-auto max-w-7xl px-5 pt-12 md:px-8 md:pt-16">
        <div className="flex items-baseline justify-between gap-4">
          <SectionTitle id="home-industries">業界から探す</SectionTitle>
          <Link href="/industries" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm text-ink">
            すべての業界を見る
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topIndustries.map((industry) => (
            <li key={industry.id}>
              <Link href={`/industries/${industry.id}`} className="group block overflow-hidden rounded-md border border-border bg-card">
                <span className="relative block aspect-[16/10] bg-muted">
                  <Image
                    src={INDUSTRY_IMAGES[industry.id]}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 40rem) 18rem, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </span>
                <span className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                  <span className="font-serif text-[0.9375rem] font-semibold group-hover:underline group-hover:underline-offset-4">
                    {industry.name}
                  </span>
                  <span className="figures text-xs text-muted-foreground">{industry.count}社</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* WHO: companies with their numbers, and what to read next. */}
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
        {/* COMPANIES */}
        <section aria-labelledby="home-featured" className="min-w-0">
          <div className="flex items-baseline justify-between gap-4">
            <SectionTitle id="home-featured">解説つきの企業</SectionTitle>
            <Link href="/companies" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm text-ink">
              すべての企業を見る
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            事業の構造・ビジネスモデル・沿革までを、有価証券報告書に基づいて書いた企業です。
          </p>
          <div className="mt-6 grid gap-5">
            {featured.map((company) => (
              <FeaturedCompanyCard key={company.id} company={company} />
            ))}
          </div>
        </section>

        {/* WHAT TO READ NEXT */}
        <aside aria-label="読みもの" className="grid content-start gap-10">
          {reading && (
            <section aria-labelledby="home-reading">
              <SectionTitle id="home-reading">{reading.heading}</SectionTitle>
              <ul className="mt-5 border-t border-border">
                {reading.items.map((item) => (
                  <li key={item.key} className="border-b border-border">
                    <Link href={item.href} className="group block py-4">
                      <span className="flex items-start justify-between gap-3 font-serif text-base leading-snug font-semibold">
                        <span className="group-hover:underline group-hover:underline-offset-4">{item.title}</span>
                        <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      </span>
                      {item.text && <span className="mt-1.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">{item.text}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={reading.href} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink">
                {reading.all}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>
          )}

          <section aria-labelledby="home-recent">
            <SectionTitle id="home-recent">最近更新された企業</SectionTitle>
            <ul className="mt-5 border-t border-border">
              {recent.map((company) => {
                const primary = company.industries.find((i) => i.primary) ?? company.industries[0];
                return (
                  <li key={company.id} className="border-b border-border">
                    <Link href={`/companies/${company.id}`} className="group flex items-start justify-between gap-3 py-3.5">
                      <span className="min-w-0">
                        <span className="block truncate font-serif text-[0.9375rem] font-semibold group-hover:underline group-hover:underline-offset-4">
                          {company.name}
                        </span>
                        <span className="figures mt-0.5 block text-xs text-muted-foreground">
                          {company.code}
                          {primary && ` ｜ ${INDUSTRY_LABELS[primary.industryId].name}`}
                        </span>
                      </span>
                      <time dateTime={company.updatedAt} className="figures shrink-0 pt-0.5 text-xs text-muted-foreground">
                        {shortDate(company.updatedAt)}
                      </time>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>

      <AdSlot placement="home-feature" />
    </>
  );
}
