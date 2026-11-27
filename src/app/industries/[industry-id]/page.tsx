import Image from "next/image";
import { OG_IMAGES } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { CompanyCard } from "@/components/company/company-card";
import { CompanySection } from "@/components/company/company-section";
import { PremiumGate } from "@/components/company/premium-gate";
import { SectionTabs, type SectionLink } from "@/components/navigation/section-tabs";
import { INDUSTRY_IMAGES } from "@/assets/industries";
import { IndustryFiguresBlock } from "@/components/industry/industry-figures";
import { JobPath } from "@/components/industry/job-path";
import { IndustryNetwork } from "@/components/industry/industry-network";
import { ValueChain } from "@/components/industry/value-chain";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { toCompanySummary } from "@/lib/company-summary";
import { listIndustryPages } from "@/lib/industries";
import { buildIndustryFigures } from "@/lib/industry-figures";
import { buildIndustryMap } from "@/lib/industry-map";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository, featureRepository, industryRepository } from "@/lib/repositories";
import { toPlainText } from "@/lib/rich-text";
import { formatDateJa } from "@/lib/utils/format";
import type { IndustryId } from "@/types/company";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await listIndustryPages()).map((i) => ({ "industry-id": i.id }));
}

async function load(id: string) {
  const pages = await listIndustryPages();
  const listing = pages.find((p) => p.id === id);
  if (!listing) return null;
  const industryId = listing.id as IndustryId;
  const [industry, companies, features, all] = await Promise.all([
    industryRepository.get(industryId),
    companyRepository.listByIndustry(industryId),
    featureRepository.listByIndustry(industryId),
    companyRepository.list(),
  ]);
  const data = buildIndustryFigures(all);
  const figures = data.industries.find((i) => i.id === industryId) ?? null;
  const index = data.index.industries.find((i) => i.id === industryId) ?? null;
  const assetsIndex = data.indexes.totalAssets.industries.find((i) => i.id === industryId) ?? null;
  const employeesIndex = data.indexes.employees.industries.find((i) => i.id === industryId) ?? null;
  return { listing, industry, companies, features, map: buildIndustryMap(all), figures, reference: data.reference, index, indexAll: data.index.all, assetsIndex, employeesIndex };
}

export async function generateMetadata({ params }: PageProps<"/industries/[industry-id]">): Promise<Metadata> {
  const data = await load((await params)["industry-id"]);
  if (!data) return {};
  const name = INDUSTRY_LABELS[data.listing.id].name;
  const description = data.industry
    ? toPlainText(data.industry.description).slice(0, 120)
    : `${name}業界に属する日本の上場企業。`;
  return {
    title: `${name}業界の仕組み`,
    description,
    alternates: { canonical: `/industries/${data.listing.id}` },
    openGraph: { images: OG_IMAGES, title: `${name}業界の仕組み`, description, url: `/industries/${data.listing.id}` },
  };
}

export default async function IndustryPage({ params }: PageProps<"/industries/[industry-id]">) {
  const data = await load((await params)["industry-id"]);
  if (!data) notFound();
  const { listing, industry, companies, features, map, figures, reference, index, indexAll, assetsIndex, employeesIndex } = data;
  const sells = map.flows.filter((f) => f.from === listing.id);
  const buys = map.flows.filter((f) => f.to === listing.id && f.from !== listing.id);
  const name = (id: string) => map.industries.find((i) => i.id === id)?.name ?? id;
  const links = industry?.links ?? [];
  const hasConnections = sells.length + buys.length + links.length > 0;

  // Tabs, at every width (operator request, 2026-10-20): what the industry is, who is in it, who it trades with.
  const sections: SectionLink[] = [
    { id: "about", label: <T m={{ ja: "仕組み", en: "How it works" }} /> },
    { id: "companies", label: `企業 ${companies.length}` },
    ...(hasConnections ? [{ id: "connections", label: <T m={{ ja: "つながり", en: "Connections" }} /> }] : []),
    ...(figures ? [{ id: "figures", label: <T m={{ ja: "数字", en: "Numbers" }} /> }] : []),
    ...(features.length > 0 ? [{ id: "features", label: <T m={{ ja: "特集", en: "Features" }} /> }] : []),
  ];

  return (
    <article>
      {/* 2026-11-23 (JCE-099): the industry's photograph is the header's ground — one image, not a band in the
          first tab — so the tabs and the explanation start within a phone's first screen. */}
      <header className="relative overflow-hidden border-b border-border">
        <Image src={INDUSTRY_IMAGES[listing.id]} alt="" fill priority placeholder="blur" sizes="100vw" className="object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        <div className="relative mx-auto max-w-6xl px-5 pt-5 pb-5 md:px-8 md:pt-10 md:pb-8">
          <p className="text-xs tracking-[0.18em] text-muted-foreground">
            <Link href="/industries" className="hover:text-foreground hover:underline">
              <T m={{ ja: "業界", en: "Industry" }} />
            </Link>{" "}
            ／ <L s={listing.name} />
          </p>
          {/* A label, not a poster (JCE-077, the company hero rule): break-words stays, "Telecommunications"
              is wider than a 320px screen even at this size. */}
          <p className="wordmark mt-2 text-[clamp(1.125rem,4vw,1.5rem)] break-words" aria-hidden>
            {listing.nameEn}
          </p>
          <h1 className="mt-1 font-serif text-[1.75rem] leading-tight font-semibold md:text-[2.25rem]"><span data-l="ja"><L s={listing.name} />業界</span><span data-l="en"><L s={listing.name} /> industry</span></h1>
        </div>
      </header>

      <SectionTabs sections={sections} containerId="industry-tabs" tabbed="always" />

      <div id="industry-tabs">
        {/* JCE-080: the first panel under the tabs gives up the section's full top padding — the tabs already separate it from the header. */}
        <CompanySection id="about" eyebrow="About" title={industry?.structure === "chain" ? "業界の流れ" : "業界の仕組み"} className="pt-8 md:pt-12">
          {industry ? (
            <div>
              {/* 2026-11-25 (operator): the full explanation pushed the flow diagram below the first screen. It is
                  shown as three lines in a smaller size and opens in place, so the diagram is what the reader meets. */}
              <details className="group max-w-3xl">
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <p className="line-clamp-3 text-[0.9375rem] leading-[1.85] group-open:line-clamp-none md:text-base">
                    <RichText text={industry.description} />
                  </p>
                  <span className="mt-1 inline-flex min-h-8 items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                    <span className="group-open:hidden"><T m={{ ja: "続きを読む ＋", en: "Read more +" }} /></span>
                    <span className="hidden group-open:inline"><T m={{ ja: "閉じる －", en: "Close −" }} /></span>
                  </span>
                </summary>
              </details>
              <SourceList sources={industry.sources} sourceIds={industry.sourceIds} className="mt-2" />
              {industry.categories.length > 0 && (
                <div className="mt-6">
                  <ValueChain industry={industry} companies={companies} />
                </div>
              )}
            </div>
          ) : (
            <p className="mt-6 max-w-3xl text-[0.9375rem] leading-7 text-muted-foreground">
              <T m={{ ja: "この業界の工程の解説は、出典を確認したうえで準備中です。下の図は、掲載企業の有価証券報告書に書かれた取引の関係から描いています。", en: "An explanation of this industry's processes is in preparation, pending source verification. The diagram below is drawn from the business relationships described in the annual securities reports of the companies listed." }} />
            </p>
          )}

          <div className="mt-14">
            <h3 className="seal-mark font-serif text-xl font-semibold"><T m={{ ja: "企業と、つながる業界", en: "Companies and connected industries" }} /></h3>
            <div className="mt-6">
              <IndustryNetwork industryId={listing.id} data={map} />
            </div>
          </div>
          {companies.length > 0 && <JobPath industryName={listing.name} industryId={listing.id as IndustryId} companies={companies} />}
          {industry && <p className="figures mt-10 text-xs text-muted-foreground"><span data-l="ja">最終更新 <F s={formatDateJa(industry.updatedAt)} /></span><span data-l="en">Last updated <F s={formatDateJa(industry.updatedAt)} /></span></p>}
        </CompanySection>

        <CompanySection id="companies" eyebrow="Companies" title={`${listing.name}業界の企業`}>
          {/* `companies` is listByIndustry: every company related to this industry, including ones whose
              primary industry is another (the figures block below counts primary industry only). */}
          <p className="mb-4 text-xs leading-5 text-muted-foreground">
            <T m={{ ja: "この業界に関係する企業を表示しています（主たる業界が他の業界の企業を含みます）。", en: "This list shows every company related to this industry, including companies whose primary industry is another one." }} />
          </p>
          {companies.length > 0 ? (
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <li key={company.id}>
                  <CompanyCard company={toCompanySummary(company)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground"><T m={{ ja: "この業界の企業はまだ掲載していません。", en: "No companies in this industry have been listed yet." }} /></p>
          )}
        </CompanySection>

        {/* The industry's figures (JCE-041): sums and ratios of the members' printed figures, computed at build time. */}
        {figures && (
          <CompanySection
            id="figures"
            eyebrow="Figures"
            title={`${listing.name}業界の数字`}
            lead={`主たる業界がこの業界の掲載企業${figures.companies}社の有価証券報告書の数値を足し合わせたものです。推定はしていません。`}
            tone="paper"
          >
            {/* Premium since JCE-051 (operator, 2026-11-15). */}
            <PremiumGate
              title={`${figures.name}業界の数字`}
              returnAnchor="figures"
              teaser={`${figures.name}業界の掲載企業${figures.companies}社について、売上高・純利益・総資産・従業員数の合計と、純利益率・自己資本比率・1人あたり売上高などの全業界との比較、会社ごと・規模別・国内外の構成（円グラフ）、5期の推移（指数）、売上高・従業員数・総資産の大きい順を読めます。`}
            >
              <IndustryFiguresBlock figures={figures} reference={reference} index={index} all={indexAll} assetsIndex={assetsIndex} employeesIndex={employeesIndex} />
            </PremiumGate>
          </CompanySection>
        )}

        {hasConnections && (
          <CompanySection
            id="connections"
            eyebrow="Connections"
            title={<T m={{ ja: "どの業界と取引している？", en: "Which industries does it trade with?" }} />}
            lead={<T m={{ ja: "業界として何を仕入れ、どこへ売るかと、掲載企業の有価証券報告書に「仕入先」「顧客」として書かれた企業どうしの関係。", en: "What the industry buys and where it sells, and the relationships between companies described as \"suppliers\" and \"customers\" in the annual securities reports of listed companies." }} />}
          >
            {industry && links.length > 0 && (
              <div className="mb-10 grid gap-8 md:grid-cols-2">
                {[
                  { title: <T m={{ ja: "仕入れる元の業界", en: "Industries it buys from" }} />, direction: "from" as const },
                  { title: <T m={{ ja: "売る先の業界", en: "Industries it sells to" }} />, direction: "to" as const },
                ].map((side) => {
                  const rows = links.filter((l) => l.direction === side.direction);
                  return rows.length > 0 ? (
                    <div key={side.direction}>
                      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">{side.title}</h3>
                      <ul className="mt-3 divide-y divide-border border-y border-border">
                        {rows.map((link) => (
                          <li key={link.industryId} className="py-3">
                            <Link href={`/industries/${link.industryId}`} className="font-serif font-semibold hover:underline">
                              <T m={{ ja: INDUSTRY_LABELS[link.industryId].name, en: INDUSTRY_LABELS[link.industryId].nameEn }} />
                            </Link>
                            <p className="mt-1 text-sm leading-6">
                              <RichText text={link.description} />
                            </p>
                            <SourceList sources={industry.sources} sourceIds={link.sourceIds} className="mt-1" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            <div className="grid gap-8 md:grid-cols-2">
              {[
                { title: <T m={{ ja: "この業界から売る先", en: "Where this industry sells" }} />, flows: sells, other: (f: (typeof sells)[number]) => f.to },
                { title: <T m={{ ja: "この業界が仕入れる元", en: "Where this industry buys" }} />, flows: buys, other: (f: (typeof sells)[number]) => f.from },
              ].map((side, sideIndex) =>
                side.flows.length > 0 ? (
                  <div key={sideIndex}>
                    <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">{side.title}</h3>
                    <ul className="mt-3 divide-y divide-border border-y border-border">
                      {side.flows.map((flow) => (
                        <li key={`${flow.from}>${flow.to}`} className="py-3">
                          <p className="flex items-baseline justify-between gap-3">
                            <Link href={`/industries/${side.other(flow)}`} className="font-serif font-semibold hover:underline">
                              {name(side.other(flow))}
                            </Link>
                            <span className="figures text-xs text-muted-foreground"><span data-l="ja">{flow.pairs.length}組</span><span data-l="en">{`${flow.pairs.length} pairs`}</span></span>
                          </p>
                          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            {flow.pairs.map((pair) => (
                              <li key={`${pair.sellerId}>${pair.buyerId}`}>
                                <Link href={`/companies/${pair.sellerId}`} className="link-ink">
                                  {pair.sellerName}
                                </Link>
                                {" → "}
                                <Link href={`/companies/${pair.buyerId}`} className="link-ink">
                                  {pair.buyerName}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
            <Link href="/industries#map" className="mt-6 inline-flex min-h-11 items-center text-sm link-ink">
              <T m={{ ja: "産業マップで全体を見る", en: "See the whole picture on the industry map" }} />
            </Link>
          </CompanySection>
        )}

        {features.length > 0 && (
          <CompanySection id="features" eyebrow="Feature" title={<T m={{ ja: "特集", en: "Features" }} />}>
            <ul className="border-t border-foreground">
              {features.map((feature) => (
                <li key={feature.id} className="border-b border-border">
                  <Link href={`/features/${feature.id}`} className="block py-6 font-serif text-xl font-semibold hover:underline">
                    <L s={feature.title} />
                  </Link>
                </li>
              ))}
            </ul>
          </CompanySection>
        )}
      </div>

      <AdSlot placement="industry-inline" />
    </article>
  );
}
