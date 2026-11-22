import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

/** 企業タイプ診断, a separate YUGENQ service (the DISCOVER feed links to it too). */
const SHINDAN_URL = "https://shindan.kigyo-hyakka.com/";

/** The free-trial survey form (YUGENQ account): the 無料の分析体験 entry point, also linked from Instagram. */
const TRIAL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSei-pGt3NT9g_eH_1ZfABzO418OrbfqSSYo2F5Z8H4HxNT7lQ/viewform";

/** The doors into the services, shown right under the search box (JCE-087). */
const SERVICE_ENTRIES: { eyebrow: string; title: string; text: string; href: string; external?: boolean }[] = [
  { eyebrow: "学習", title: "有報の読み方入門", text: "実際の決算を使い、読む→予測する→検証する力を鍛える、3〜4分のマイクロレッスン。", href: "/learn" },
  { eyebrow: "決算定期便", title: "今週の開示", text: "決算が出た企業を、検証済みの数字と読み方つきで届けます。", href: "/digest" },
  { eyebrow: "分析", title: "5観点で読む企業分析", text: "規模・成長・収益性・財務の安定・外部環境との接続を、計算値と業界の中での位置で読みます。", href: "/analysis" },
  { eyebrow: "企業", title: "企業を探す", text: "上場企業の解説と財務データ。何をしている会社かが、まずわかります。", href: "/companies" },
  { eyebrow: "無料体験", title: "無料の分析体験", text: "1社を5ステップで読み解く体験のご案内。約3分のアンケートから申し込めます。", href: TRIAL_FORM_URL, external: true },
];

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
 * The front page. Since JCE-087 the first screen carries no slogan: a compact search, the doors into the
 * services (learn / digest / analysis / companies / the free trial), and the site's counts as one line —
 * then DISCOVER, the diagnosis, the daily habits, and three columns of reading. Everything shown is
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

  // What to read next: features when there are any, otherwise the glossary.
  const reading =
    features.length > 0
      ? { heading: "特集を読む", href: "/features", all: "特集をすべて見る", items: features.slice(0, 3).map((f) => ({ key: f.id, href: `/features/${f.id}`, title: f.title, text: f.subtitle ?? "" })) }
      : terms.length > 0
        ? { heading: "用語を知る", href: "/terms", all: "用語集を見る", items: terms.slice(0, 3).map((t) => ({ key: t.id, href: `/terms#${t.id}`, title: t.term, text: t.description })) }
        : null;

  return (
    <>
      {/* HERO (JCE-087): no slogan. The first screen is the search box and the doors into the services,
          so a reader reaches what they came for in one tap; the site's counts follow as one quiet line. */}
      <section aria-labelledby="home-hero" className="border-b border-border bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
          <h1 id="home-hero" className="sr-only">
            {SITE_NAME}
          </h1>
          <div className="mx-auto max-w-2xl">
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

          <nav aria-label="サービスへの入口" className="mt-8">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_ENTRIES.map((entry) => {
                const card = (
                  <>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.6875rem] font-semibold tracking-[0.2em] text-seal">{entry.eyebrow}</span>
                      <span className="mt-1 block font-serif text-lg leading-snug font-semibold">{entry.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{entry.text}</span>
                    </span>
                    <ArrowRight className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                  </>
                );
                const className = "group flex h-full items-start gap-4 rounded-md border border-border bg-card px-4 py-4 transition-colors hover:border-foreground";
                return (
                  <li key={entry.title}>
                    {entry.external ? (
                      <a href={entry.href} target="_blank" rel="noopener noreferrer" className={className}>
                        {card}
                        <span className="sr-only">（新しいタブで開きます）</span>
                      </a>
                    ) : (
                      <Link href={entry.href} className={className}>
                        {card}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* D10 counts, compressed to one line (JCE-087): still counted from the entries themselves. */}
          <p className="mt-8 border-t border-border pt-5 text-xs leading-6 text-muted-foreground">
            掲載企業 <span className="figures font-semibold text-foreground">{companies.length.toLocaleString("ja-JP")}</span>社
            <span aria-hidden className="mx-1.5">・</span>
            業界 <span className="figures font-semibold text-foreground">{industries.length}</span>分類
            <span aria-hidden className="mx-1.5">・</span>
            本社のある都道府県{" "}
            <Link href="/prefectures" className="hover:underline hover:underline-offset-4">
              <span className="figures font-semibold text-foreground">{prefecturesWithCompanies.length}</span>都道府県
            </Link>
            <span aria-hidden className="mx-1.5">・</span>
            出典にした資料 <span className="figures font-semibold text-foreground">{sourceCount.toLocaleString("ja-JP")}</span>件
            <span aria-hidden className="mx-1.5">・</span>
            転記した決算 <span className="figures font-semibold text-foreground">{yearCount.toLocaleString("ja-JP")}</span>期分
            （有価証券報告書・EDINETなどの一次資料に基づく）
          </p>
        </div>
      </section>

      {/* DISCOVER (JCE-046): for the reader with nothing to look up yet. */}
      <section aria-labelledby="home-discover" className="bg-neutral-950 text-white">
        <Link href="/discover" className="group mx-auto flex max-w-7xl items-center gap-5 px-5 py-6 md:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-amber-300">DISCOVER</p>
            <h2 id="home-discover" className="mt-1 font-serif text-[1.25rem] leading-snug font-semibold">
              調べたい会社がなくても。スワイプで、知らなかった会社に出会う。
            </h2>
            <p className="mt-1 text-xs text-white/60">今日の3社・つながる会社をたどる・マイ企業図鑑</p>
          </div>
          <ArrowRight className="size-6 shrink-0 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </section>

      {/* 企業タイプ診断: the YUGENQ diagnosis on its own site, in its own words. The answers stay in the reader's browser. */}
      <section aria-labelledby="home-shindan" className="border-b border-border bg-paper">
        <a href={SHINDAN_URL} className="group mx-auto flex max-w-7xl items-center gap-5 px-5 py-6 md:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-muted-foreground">企業タイプ診断</p>
            <h2 id="home-shindan" className="mt-1 font-serif text-[1.25rem] leading-snug font-semibold">
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

      {/* JCE-052: two short daily habits beside DISCOVER. Links, not widgets: the home page stays light. */}
      <section aria-label="毎日の楽しみ" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-px bg-border sm:grid-cols-2">
          <Link href="/quiz" className="group flex items-center gap-4 bg-background px-5 py-5 md:px-8">
            <span className="min-w-0 flex-1">
              <span className="block text-[0.6875rem] font-semibold tracking-[0.2em] text-seal">今日の1問</span>
              <span className="mt-1 block font-serif text-lg font-semibold">売上が大きいのはどっち？ 毎日1問、30秒。</span>
            </span>
            <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link href="/network" className="group flex items-center gap-4 bg-background px-5 py-5 md:px-8">
            <span className="min-w-0 flex-1">
              <span className="block text-[0.6875rem] font-semibold tracking-[0.2em] text-seal">企業ネットワーク</span>
              <span className="mt-1 block font-serif text-lg font-semibold">取引先、競合、親会社。立体の地図で回して、たどる。</span>
            </span>
            <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </section>

      <ReaderTrail companies={summaries.map(({ id, name }) => ({ id, name }))} />

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
