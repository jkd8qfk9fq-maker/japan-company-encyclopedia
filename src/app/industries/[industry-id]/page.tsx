import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { CompanyCard } from "@/components/company/company-card";
import { CompanySection } from "@/components/company/company-section";
import { SectionTabs, type SectionLink } from "@/components/navigation/section-tabs";
import { IndustryStructure } from "@/components/industry/industry-structure";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { toCompanySummary } from "@/lib/company-summary";
import { listIndustryPages } from "@/lib/industries";
import { buildIndustryMap } from "@/lib/industry-map";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository, featureRepository, industryRepository } from "@/lib/repositories";
import { toPlainText } from "@/lib/rich-text";
import { formatDateJa } from "@/lib/utils/format";
import type { IndustryId } from "@/types/company";

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
  return { listing, industry, companies, features, map: buildIndustryMap(all) };
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
    openGraph: { title: `${name}業界の仕組み`, description, url: `/industries/${data.listing.id}` },
  };
}

export default async function IndustryPage({ params }: PageProps<"/industries/[industry-id]">) {
  const data = await load((await params)["industry-id"]);
  if (!data) notFound();
  const { listing, industry, companies, features, map } = data;
  const sells = map.flows.filter((f) => f.from === listing.id);
  const buys = map.flows.filter((f) => f.to === listing.id && f.from !== listing.id);
  const name = (id: string) => map.industries.find((i) => i.id === id)?.name ?? id;

  // Tabs, at every width (operator request, 2026-10-20): what the industry is, who is in it, who it trades with.
  const sections: SectionLink[] = [
    { id: "about", label: "仕組み" },
    { id: "companies", label: `企業 ${companies.length}` },
    ...(sells.length + buys.length > 0 ? [{ id: "connections", label: "つながり" }] : []),
    ...(features.length > 0 ? [{ id: "features", label: "特集" }] : []),
  ];

  return (
    <article>
      <header className="mx-auto max-w-6xl px-5 pt-10 pb-6 md:px-8 md:pt-14">
        <p className="text-xs tracking-[0.18em] text-muted-foreground">
          <Link href="/industries" className="hover:text-foreground hover:underline">
            業界
          </Link>{" "}
          ／ {listing.name}
        </p>
        <p className="wordmark mt-3 text-[clamp(2.25rem,8vw,4.5rem)]" aria-hidden>
          {listing.nameEn}
        </p>
        <h1 className="mt-2 font-serif text-[1.75rem] font-semibold md:text-[2.25rem]">{listing.name}業界</h1>
      </header>

      <SectionTabs sections={sections} containerId="industry-tabs" tabbed="always" />

      <div id="industry-tabs">
        <CompanySection id="about" eyebrow="About" title={industry?.structure === "chain" ? "業界の流れ" : "業界の仕組み"}>
          {industry ? (
            <>
              <p className="max-w-3xl text-[1.0625rem] leading-[1.95]">
                <RichText text={industry.description} />
              </p>
              <SourceList sources={industry.sources} sourceIds={industry.sourceIds} className="mt-2" />
              {industry.categories.length > 0 && (
                <div className="mt-10 max-w-4xl">
                  <IndustryStructure industry={industry} companies={companies} />
                </div>
              )}
              <p className="figures mt-10 text-xs text-muted-foreground">最終更新 {formatDateJa(industry.updatedAt)}</p>
            </>
          ) : (
            <p className="max-w-3xl text-[0.9375rem] leading-7 text-muted-foreground">
              この業界の仕組みの解説は、出典を確認したうえで準備中です。「企業」と「つながり」のタブで、この業界の企業と取引の関係を見られます。
            </p>
          )}
        </CompanySection>

        <CompanySection id="companies" eyebrow="Companies" title={`${listing.name}業界の企業`}>
          {companies.length > 0 ? (
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <li key={company.id}>
                  <CompanyCard company={toCompanySummary(company)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">この業界の企業はまだ掲載していません。</p>
          )}
        </CompanySection>

        {sells.length + buys.length > 0 && (
          <CompanySection
            id="connections"
            eyebrow="Connections"
            title="どの業界と取引している？"
            lead="掲載企業の有価証券報告書に「仕入先」「顧客」として書かれた関係から。出典は各企業のページにあります。"
          >
            <div className="grid gap-8 md:grid-cols-2">
              {[
                { title: "この業界から売る先", flows: sells, other: (f: (typeof sells)[number]) => f.to },
                { title: "この業界が仕入れる元", flows: buys, other: (f: (typeof sells)[number]) => f.from },
              ].map((side) =>
                side.flows.length > 0 ? (
                  <div key={side.title}>
                    <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">{side.title}</h3>
                    <ul className="mt-3 divide-y divide-border border-y border-border">
                      {side.flows.map((flow) => (
                        <li key={`${flow.from}>${flow.to}`} className="py-3">
                          <p className="flex items-baseline justify-between gap-3">
                            <Link href={`/industries/${side.other(flow)}`} className="font-serif font-semibold hover:underline">
                              {name(side.other(flow))}
                            </Link>
                            <span className="figures text-xs text-muted-foreground">{flow.pairs.length}組</span>
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
              産業マップで全体を見る
            </Link>
          </CompanySection>
        )}

        {features.length > 0 && (
          <CompanySection id="features" eyebrow="Feature" title="特集">
            <ul className="border-t border-foreground">
              {features.map((feature) => (
                <li key={feature.id} className="border-b border-border">
                  <Link href={`/features/${feature.id}`} className="block py-6 font-serif text-xl font-semibold hover:underline">
                    {feature.title}
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
