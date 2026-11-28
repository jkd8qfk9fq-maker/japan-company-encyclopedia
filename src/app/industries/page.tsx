import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HUB_IMAGES, INDUSTRY_IMAGES } from "@/assets/industries";
import { IndustryHero } from "@/components/industry/industry-hero";
import { ArrowRight } from "lucide-react";
import { CompanySection } from "@/components/company/company-section";
import { PremiumGate } from "@/components/company/premium-gate";
import { IndustryFiguresOverview } from "@/components/industry/industry-figures";
import { IndustryFlowMap } from "@/components/industry/industry-flow-map";
import { SectionTabs, type SectionLink } from "@/components/navigation/section-tabs";
import { listIndustryPages } from "@/lib/industries";
import { buildIndustryFigures } from "@/lib/industry-figures";
import { buildIndustryMap } from "@/lib/industry-map";
import { companyRepository } from "@/lib/repositories";
import { T } from "@/components/i18n/t";
import { L } from "@/components/i18n/label";

export const metadata: Metadata = {
  title: "業界",
  description: "日本の産業を、業界ごとの構造、業界どうしの取引のつながり、そこにいる企業から理解する。",
  alternates: { canonical: "/industries" },
};

/**
 * The industries hub: one page, tabs at every width (operator request, 2026-10-20) — the industries and the industry
 * map. Each tab is rendered on the server and stays in the document; the tabs only choose which one is on screen.
 */
export default async function IndustriesPage() {
  const [industries, companies] = await Promise.all([listIndustryPages(), companyRepository.list()]);
  const map = buildIndustryMap(companies);
  const figures = buildIndustryFigures(companies);
  const pairs = map.flows.reduce((sum, flow) => sum + flow.pairs.length, 0);
  const linesOf = (id: string) => map.flows.filter((f) => f.from === id || f.to === id).length;
  const membersOf = (id: string) => map.industries.find((i) => i.id === id)?.companies.filter((c) => c.primary) ?? [];

  const sections: SectionLink[] = [
    { id: "list", label: <T m={{ ja: "業界一覧", en: "All industries" }} /> },
    { id: "map", label: <T m={{ ja: "産業マップ", en: "Industry map" }} /> },
    { id: "figures", label: <T m={{ ja: "数字で見る", en: "By the Numbers" }} /> },
  ];

  return (
    <div>
      {/* 2026-11-23 (JCE-099): the photograph is the header's ground, not a band above it — the title and the
          lead sit on it, so the tabs and the first industries land in a phone's first screen. */}
      <header className="relative overflow-hidden border-b border-border">
        <Image src={HUB_IMAGES.header} alt="" fill priority placeholder="blur" sizes="100vw" className="object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        <div className="relative mx-auto max-w-6xl px-5 pt-6 pb-5 md:px-8 md:pt-12 md:pb-8">
          <p className="eyebrow" aria-hidden>Industries</p>
          <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]"><T m={{ ja: "業界から、日本の産業を見る", en: "Japan's Economy, Seen Through Industries" }} /></h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/80">
            <T m={{ ja: "企業を、業界の中での位置と、業界どうしのつながりから見る。業界の仕組みを知ると、会社の役割が見えてきます。", en: "See each company by its place within its industry and the links between industries. Understanding how an industry works reveals the role a company plays." }} />
          </p>
        </div>
      </header>

      <SectionTabs sections={sections} containerId="industries-tabs" tabbed="always" />

      <div id="industries-tabs">
        {/* JCE-080: the first panel under the tabs gives up the section's full top padding — the tabs already separate it from the header. */}
        <CompanySection id="list" eyebrow="Industries" title={<T m={{ ja: "業界一覧", en: "All industries" }} />} lead={<T m={{ ja: "業界を選ぶと、その業界の仕組み・企業・つながりが開きます。", en: "Select an industry to open its structure, companies, and connections." }} />} className="pt-8 md:pt-12">
          {/*
            Photograph tiles, after the operator's request to design the list through its images (2026-11-01). Two
            across on a phone, three to four on a wide screen, all the same size: the order is the taxonomy's and
            nothing here ranks industries. Now that most industries are researched, the exception is what gets a mark.
          */}
          <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
            {industries.map((industry, i) => {
              const members = membersOf(industry.id);
              const lines = linesOf(industry.id);
              return (
                <li key={industry.id}>
                  <Link
                    href={`/industries/${industry.id}`}
                    className="group relative flex h-full min-h-44 flex-col justify-end overflow-hidden rounded-md bg-foreground text-white sm:min-h-60"
                  >
                    <Image
                      src={INDUSTRY_IMAGES[industry.id]}
                      alt=""
                      fill
                      priority={i < 4}
                      placeholder="blur"
                      sizes="(min-width: 64rem) 18rem, (min-width: 48rem) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/10" />
                    <span className="relative flex flex-col p-3 sm:p-4">
                      <span className="wordmark text-[0.8125rem] tracking-[0.06em] opacity-85 sm:text-sm" aria-hidden>
                        {industry.nameEn}
                      </span>
                      <span className="mt-1 font-serif text-lg leading-tight font-semibold sm:text-2xl"><L s={industry.name} /></span>
                      {/* A few of its companies, on screens wide enough to read them: what the industry is, by example. */}
                      {members.length > 0 && (
                        <span className="mt-1.5 line-clamp-2 hidden text-xs leading-5 opacity-85 sm:block">
                          {members.slice(0, 4).map((c) => c.name).join("・")}
                          {members.length > 4 && ` ほか${members.length - 4}社`}
                        </span>
                      )}
                      <span className="mt-2 flex flex-wrap items-center gap-1.5 text-[0.6875rem]">
                        <span className="figures rounded-full bg-white/90 px-2 py-0.5 text-black"><span data-l="ja">{industry.companyCount}社</span><span data-l="en">{`${industry.companyCount} companies`}</span></span>
                        {lines > 0 && <span className="figures rounded-full border border-white/70 px-2 py-0.5"><span data-l="ja">線 {lines}本</span><span data-l="en">{`${lines} lines`}</span></span>}
                        {!industry.researched && <span className="rounded-full bg-black/45 px-2 py-0.5 ring-1 ring-white/60"><T m={{ ja: "解説は準備中", en: "Explanation coming soon" }} /></span>}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* The tiles' counts are `listIndustryPages`' companyCount: every industry a company relates to
              (src/lib/industries.ts), not its primary industry only — the note keeps the total from being
              read against the published-company count, which is primary-based. */}
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            <T m={{ ja: "各業界の社数は、その業界に関係する企業を数えています。複数の業界に関係する企業はそれぞれの業界に数えるため、合計は掲載企業数より多くなります。", en: "Each industry's count covers every company related to that industry. A company related to several industries is counted in each of them, so the counts add up to more than the number of published companies." }} />
          </p>
        </CompanySection>

        <CompanySection
          id="map"
          eyebrow="Industry Map"
          title={<T m={{ ja: "業界から業界へ", en: "Industry to Industry" }} />}
          lead={
            <>
              <span data-l="ja">掲載企業の有価証券報告書に「仕入先」「顧客」として書かれた関係だけを集め、売る側の業界から買う側の業界へ線を引いています（
              <span className="figures">{map.industries.length}</span>業界・取引の組<span className="figures">{pairs}</span>
              件）。産業を選ぶと、その産業の企業と取引のつながりが開きます。出典は各企業のページにあります。
            </span><span data-l="en">We collect only the relationships described as &quot;suppliers&quot; or &quot;customers&quot; in the annual securities reports of listed companies, and draw lines from the selling industry to the buying industry (<span className="figures">{map.industries.length}</span> industries, <span className="figures">{pairs}</span> trading pairs). Select an industry to open its companies and trading links. Sources are on each company&apos;s page.</span></>
          }
        >
          <IndustryHero image={HUB_IMAGES.map} eyebrow="Industry Map" title={<T m={{ ja: "業界から業界へ、モノとサービスの流れ", en: "The Flow of Goods and Services, Industry to Industry" }} />} />
          <div className="mt-8">
            <IndustryFlowMap data={map} />
          </div>
        </CompanySection>

        {/* The industry figures (JCE-041): what the filings add up to, industry by industry. Computed at build time. */}
        <CompanySection
          id="figures"
          eyebrow="Figures"
          title={<T m={{ ja: "数字で見る", en: "By the Numbers" }} />}
          lead={
            <>
              <span data-l="ja">掲載企業<span className="figures">{figures.totals.companies}</span>社の有価証券報告書の数値を、業界ごとに足し合わせたものです。規模、純利益率、5期の伸び、上位3社への集中、海外売上高比率。すべて印字された数値の計算値で、推定はしていません。
            </span><span data-l="en">Figures from the annual securities reports of <span className="figures">{figures.totals.companies}</span> listed companies, summed by industry: scale, net margin, 5-year growth, concentration in the top 3 companies, and overseas revenue ratio. All are computed from printed figures; nothing is estimated.</span></>
          }
        >
          {/* Premium since JCE-051 (operator, 2026-11-15). */}
          <PremiumGate
            title={<T m={{ ja: "業界の数字", en: "Industry Numbers" }} />}
            returnAnchor="figures"
            teaser={<T m={{ ja: "全業界の売上高・純利益・総資産・従業員数の合計と、その業界別の構成（円グラフ）、純利益率・5期の伸び・自己資本比率・従業員1人あたり売上高・赤字の会社の割合・平均年間給与の中央値の業界別比較、5期の推移（指数）を、掲載企業の有価証券報告書の数値から読めます。", en: "From the annual securities reports of listed companies, see totals for revenue, net income, total assets, and employees across all industries, with a breakdown by industry (pie charts). Compare industries by net margin, 5-year growth, equity ratio, revenue per employee, share of loss-making companies, and median average annual salary, and view 5-year trends (indexed)." }} />}
          >
            <IndustryFiguresOverview data={figures} />
          </PremiumGate>
        </CompanySection>
      </div>

      <p className="mx-auto max-w-6xl px-5 pb-12 text-xs text-muted-foreground md:px-8">
        <Link href="/companies" className="inline-flex min-h-11 items-center gap-1.5 hover:text-foreground">
          <span data-l="ja">企業の一覧から探す
          <ArrowRight className="size-3.5" aria-hidden /></span><span data-l="en">Browse the company list <ArrowRight className="size-3.5" aria-hidden /></span>
        </Link>
      </p>
    </div>
  );
}
