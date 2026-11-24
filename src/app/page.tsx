import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartColumn, Compass, Layers, Network, SlidersHorizontal, Sparkles, type LucideIcon } from "lucide-react";
import { HUB_IMAGES, INDUSTRY_IMAGES } from "@/assets/industries";
import { CompanyMark } from "@/components/company/company-mark";
import { SearchSuggest } from "@/components/search/search-suggest";
import { AdSlot } from "@/components/ads/ad-slot";
import { JapanMap, JapanMapLegend } from "@/components/region/japan-map";
import { ReaderTrail } from "@/components/company/reader-trail";
import { FeaturedCompanyCard } from "@/components/home/featured-company-card";
import { toCompanySummary } from "@/lib/company-summary";
import { toPlainText } from "@/lib/rich-text";
import { featuredCompanies, recentlyUpdated, shortDate } from "@/lib/home";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { PREFECTURES } from "@/lib/prefectures";
import { companiesByPrefecture } from "@/lib/regions";
import { companyRepository, featureRepository, industryRepository, termRepository } from "@/lib/repositories";
import { MICRO_LESSON_IDS } from "@/lib/micro-lessons";
import { SITE_DESCRIPTION, SITE_NAME, TRAINING_APP_NAME } from "@/lib/site";
import { INDUSTRY_IDS } from "@/types/company";

/** 企業タイプ診断, a separate YUGENQ service (the DISCOVER feed links to it too). */
const SHINDAN_URL = "https://shindan.kigyo-hyakka.com/";

/** The free-trial survey form (YUGENQ account): the 無料の分析体験 entry point, also linked from Instagram. */
const TRIAL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSei-pGt3NT9g_eH_1ZfABzO418OrbfqSSYo2F5Z8H4HxNT7lQ/viewform";

/** A figure tile of the home strip: a stretched link makes the whole tile open the list it counts. */
const TILE = "relative bg-card/90 px-3 py-2.5 backdrop-blur transition-colors hover:bg-muted";

/** The doors into the services (JCE-087), as a compact icon grid since the 2026-11-23 redesign. */
const SERVICE_DOORS: { label: string; note: string; href: string; icon: LucideIcon; external?: boolean }[] = [
  { label: "業界", note: "業界から探す", href: "/industries", icon: Layers },
  { label: "発見", note: "今日の3社", href: "/discover", icon: Compass },
  { label: "分析", note: "5観点で読む", href: "/analysis", icon: ChartColumn },
  { label: "つながり", note: "立体でたどる", href: "/network", icon: Network },
  { label: "財務で探す", note: "条件で絞る", href: "/screening", icon: SlidersHorizontal },
  { label: "無料体験", note: "1社を読み解く", href: TRIAL_FORM_URL, icon: Sparkles, external: true },
];

export const metadata = {
  title: { absolute: `${SITE_NAME}｜何をしている会社かがわかる` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

/** Section title with the 朱 rule (see globals.css .seal-mark). */
function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="seal-mark text-lg leading-tight font-semibold md:text-[1.375rem]">
      {children}
    </h2>
  );
}

/**
 * The front page. Since JCE-087 the first screen carries no slogan: a compact search, the doors into the
 * encyclopedia's tools, and the site's counts as one line — then the second pillar, 分析訓練 (JCE-108: the
 * course, the daily question and the digest are in that app, not spread over this page), DISCOVER, the
 * diagnosis, and three columns of reading. Everything shown is
 * something the site has: the reference's market-cap filters, fiscal-year filters, compare tool, logos,
 * saved-companies link and market-wide chart are not built and are left out rather than drawn as dead
 * controls. No stock data, no rankings (CLAUDE.md invariant 4).
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
  // D10: counts of what the entries actually hold, never an estimate of readers or use.
  const sourceCount = companies.reduce((acc, c) => acc + c.sources.length, 0);
  const yearCount = companies.reduce((acc, c) => acc + c.financials.length, 0);
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
  // The swiped row: the largest written companies (featuredCompanies orders by revenue as printed).
  const spotlight = featuredCompanies(companies, 8);
  // Ties written in the released entries, each counted once from the side that records it.
  const tieCount = companies.reduce((acc, c) => acc + c.relatedCompanies.length, 0);
  const latestUpdate = recent[0]?.updatedAt ?? null;

  // What to read next: features when there are any, otherwise the glossary.
  const reading =
    features.length > 0
      ? { heading: "特集を読む", href: "/features", all: "特集をすべて見る", items: features.slice(0, 3).map((f) => ({ key: f.id, href: `/features/${f.id}`, title: f.title, text: f.subtitle ?? "" })) }
      : terms.length > 0
        ? { heading: "用語を知る", href: "/terms", all: "用語集を見る", items: terms.slice(0, 3).map((t) => ({ key: t.id, href: `/terms#${t.id}`, title: t.term, text: t.description })) }
        : null;

  return (
    <>
      {/* HERO (2026-11-23 redesign, after the operator's mockup): the promise in one line over the night photograph,
          the search right under it, then the site's own figures as a strip of tiles — the place a market ticker
          would sit on a finance site. Never a share price or index (invariant 4): only counts of what the
          encyclopedia holds, each computed from the entries. */}
      <section aria-labelledby="home-hero" className="relative overflow-hidden border-b border-border">
        <Image src={HUB_IMAGES.map} alt="" fill priority placeholder="blur" sizes="100vw" className="object-cover opacity-45" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 pt-7 pb-5 md:px-8 md:pt-14 md:pb-8">
          <h1 id="home-hero" className="font-serif text-[1.875rem] leading-[1.3] font-semibold tracking-[0.04em] text-balance md:text-[2.75rem]">
            日本企業を、
            <br />
            構造から理解する。
          </h1>
          <p className="mt-2 text-sm text-foreground/80 md:text-base">何をしている会社か、誰とつながっているか。有価証券報告書から。</p>
          <div className="mt-5 max-w-2xl">
            <SearchSuggest id="home-search" variant="hero" />
          </div>
          {examples.length > 0 && (
            <div className="-mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0">
              <span className="shrink-0 text-xs text-muted-foreground">検索例</span>
              {examples.slice(0, 6).map((c) => (
                <Link
                  key={c.id}
                  href={`/companies/${c.id}`}
                  className="inline-flex min-h-9 shrink-0 items-center rounded-full border border-border bg-card/80 px-3.5 text-xs backdrop-blur hover:border-foreground"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {/* D10 counts as tiles: still counted from the entries themselves, never readers or use. */}
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            <div className={TILE}>
              <dt className="text-[0.6875rem] text-muted-foreground">掲載企業</dt>
              <dd className="figures mt-0.5 text-xl leading-tight font-semibold">
                {companies.length.toLocaleString("ja-JP")}
                <span className="ml-0.5 text-xs font-normal text-muted-foreground">社</span>
              </dd>
              <Link href="/companies" className="absolute inset-0">
                <span className="sr-only">掲載企業の一覧へ</span>
              </Link>
            </div>
            <div className={TILE}>
              <dt className="text-[0.6875rem] text-muted-foreground">業界</dt>
              <dd className="figures mt-0.5 text-xl leading-tight font-semibold">
                {industries.length}
                <span className="ml-0.5 text-xs font-normal text-muted-foreground">分類</span>
              </dd>
              <Link href="/industries" className="absolute inset-0">
                <span className="sr-only">業界の一覧へ</span>
              </Link>
            </div>
            <div className={TILE}>
              <dt className="text-[0.6875rem] text-muted-foreground">企業のつながり</dt>
              <dd className="figures mt-0.5 text-xl leading-tight font-semibold">
                {tieCount.toLocaleString("ja-JP")}
                <span className="ml-0.5 text-xs font-normal text-muted-foreground">本</span>
              </dd>
              <Link href="/network" className="absolute inset-0">
                <span className="sr-only">企業ネットワークへ</span>
              </Link>
            </div>
            <div className={TILE}>
              <dt className="text-[0.6875rem] text-muted-foreground">最新の更新</dt>
              <dd className="figures mt-0.5 text-xl leading-tight font-semibold">
                {latestUpdate ? shortDate(latestUpdate) : "—"}
              </dd>
              <Link href="/digest" className="absolute inset-0">
                <span className="sr-only">今週の開示へ</span>
              </Link>
            </div>
          </dl>
          <p className="mt-2 text-[0.6875rem] text-muted-foreground">
            出典にした資料 <span className="figures">{sourceCount.toLocaleString("ja-JP")}</span>件・転記した決算{" "}
            <span className="figures">{yearCount.toLocaleString("ja-JP")}</span>期分（有価証券報告書・EDINET などの一次資料）
          </p>
        </div>
      </section>

      {/* The largest written companies, swiped sideways: a dense card each — mark, name, code, industry, one line. */}
      {examples.length > 0 && (
        <section aria-labelledby="home-companies" className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="home-companies" className="seal-mark text-base font-semibold">解説つきの主な企業</h2>
              <Link href="/companies" className="inline-flex min-h-11 items-center gap-1 text-xs text-ink">
                すべて見る
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
            <ul className="-mx-4 mt-2 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:px-0">
              {spotlight.map((c) => {
                const primary = c.industries.find((i) => i.primary) ?? c.industries[0];
                return (
                  <li key={c.id} className="w-[82%] shrink-0 snap-start md:w-auto">
                    <Link href={`/companies/${c.id}`} className="flex h-full gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/40">
                      <CompanyMark name={c.name} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate font-semibold">{c.name}</span>
                          <span className="figures shrink-0 rounded bg-muted px-1.5 text-[0.625rem] text-muted-foreground">
                            {c.code}
                            {primary ? `・${INDUSTRY_LABELS[primary.industryId].name}` : ""}
                          </span>
                        </span>
                        <span className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{c.description ? toPlainText(c.description) : ""}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* The doors into the services as one compact grid (JCE-087's cards, condensed): icon, name, what it is. */}
      <nav aria-label="サービスへの入口" className="border-b border-border">
        <ul className="mx-auto grid max-w-7xl grid-cols-3 gap-px bg-border md:grid-cols-6">
          {SERVICE_DOORS.map(({ href, label, note, icon: Icon, external }) => (
            <li key={label} className="bg-background">
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-20 flex-col items-center justify-center gap-1 px-1 py-3 text-center transition-colors hover:bg-card">
                  <Icon className="size-5 text-ink" aria-hidden strokeWidth={1.75} />
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[0.625rem] leading-3 text-muted-foreground">{note}</span>
                  <span className="sr-only">（新しいタブで開きます）</span>
                </a>
              ) : (
                <Link href={href} className="flex min-h-20 flex-col items-center justify-center gap-1 px-1 py-3 text-center transition-colors hover:bg-card">
                  <Icon className="size-5 text-ink" aria-hidden strokeWidth={1.75} />
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[0.625rem] leading-3 text-muted-foreground">{note}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* The second pillar (JCE-108): 分析訓練, the training app — the course, the daily question, the week's
          filings and the review queue in one place, instead of four separate rows here. */}
      <section aria-labelledby="home-training" className="border-b border-border">
        <Link href="/learn" className="group mx-auto flex max-w-7xl items-center gap-4 px-4 py-5 md:px-8 md:py-6">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-[#3fa91c]">{TRAINING_APP_NAME} ・ 学習アプリ</p>
            <h2 id="home-training" className="mt-1 text-[1.0625rem] leading-snug font-semibold md:text-[1.25rem]">
              決算を、予想してから読む。有報が読めるようになる、1日5分。
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              レッスン<span className="figures">{MICRO_LESSON_IDS.length}</span>本・今日の1問・決算定期便・復習。進み具合はこのブラウザにだけ残ります。
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#2e7d12] px-4 py-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5">
            はじめる
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </Link>
      </section>

      {/* DISCOVER (JCE-046): for the reader with nothing to look up yet. */}
      <section aria-labelledby="home-discover" className="border-b border-border bg-card">
        <Link href="/discover" className="group mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-seal">DISCOVER</p>
            <h2 id="home-discover" className="mt-0.5 text-base leading-snug font-semibold">
              調べたい会社がなくても。スワイプで、知らなかった会社に出会う。
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">今日の3社・つながる会社をたどる・マイ企業図鑑</p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-seal transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </section>

      {/* 企業タイプ診断: the YUGENQ diagnosis on its own site, in its own words. The answers stay in the reader's browser. */}
      <section aria-labelledby="home-shindan" className="border-b border-border bg-paper">
        <a href={SHINDAN_URL} className="group mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-muted-foreground">企業タイプ診断</p>
            <h2 id="home-shindan" className="mt-0.5 text-base leading-snug font-semibold">
              あなたに近いのは、どんなタイプの会社？
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              60の産業 × 16の性格。質問に答えると、自分に近い産業と企業がわかります。回答はブラウザの外に送られません。
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform group-hover:translate-x-0.5">
            診断する
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </a>
      </section>

      <ReaderTrail companies={summaries.map(({ id, name }) => ({ id, name }))} />

      {/* WHERE: head offices on the map. Every prefecture is a link; the list beside it is the same data in words. */}
      <section aria-labelledby="home-map" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-8 md:px-8 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
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
      <section aria-labelledby="home-industries" className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-14">
        <div className="flex items-baseline justify-between gap-4">
          <SectionTitle id="home-industries">業界から探す</SectionTitle>
          <Link href="/industries" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm text-ink">
            すべての業界を見る
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-8 md:px-8 md:py-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
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
