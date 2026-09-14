import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { CompanyCard } from "@/components/company/company-card";
import { IndustryStructure } from "@/components/industry/industry-structure";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { toCompanySummary } from "@/lib/company-summary";
import { listIndustryPages } from "@/lib/industries";
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
  const [industry, companies, features] = await Promise.all([
    industryRepository.get(industryId),
    companyRepository.listByIndustry(industryId),
    featureRepository.listByIndustry(industryId),
  ]);
  return { listing, industry, companies, features };
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
  const { listing, industry, companies, features } = data;

  return (
    <article>
      <header className="mx-auto max-w-6xl px-5 pt-12 md:px-8 md:pt-20">
        <p className="wordmark text-[clamp(2.75rem,10vw,6.5rem)]" aria-hidden>
          {listing.nameEn}
        </p>
        <h1 className="mt-4 font-serif text-[2rem] font-semibold md:text-[2.75rem]">{listing.name}業界</h1>
        {industry ? (
          <div className="mt-8 max-w-3xl">
            <p className="text-[1.1875rem] leading-[1.95] md:text-[1.375rem]">
              <RichText text={industry.description} />
            </p>
            <SourceList sources={industry.sources} sourceIds={industry.sourceIds} className="mt-3" />
          </div>
        ) : (
          <p className="prose-ja mt-8 max-w-3xl text-muted-foreground">
            この業界の仕組みの解説は、出典を確認したうえで準備中です。いまは、この業界に属する企業を掲載しています。
          </p>
        )}
      </header>

      {industry && industry.categories.length > 0 && (
        <section aria-labelledby="industry-structure" className="mt-16 bg-paper py-16 md:mt-24 md:py-24">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <p className="eyebrow" aria-hidden>Structure</p>
            <h2 id="industry-structure" className="mt-3 font-serif text-[1.75rem] font-semibold md:text-[2.25rem]">
              {industry.structure === "chain" ? "業界の流れ" : "業界の分類"}
            </h2>
            <div className="mt-10 max-w-4xl">
              <IndustryStructure industry={industry} companies={companies} />
            </div>
          </div>
        </section>
      )}

      <AdSlot placement="industry-inline" />

      <section aria-labelledby="industry-companies" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="eyebrow" aria-hidden>Companies</p>
        <h2 id="industry-companies" className="mt-3 font-serif text-[1.75rem] font-semibold md:text-[2.25rem]">
          {listing.name}業界の企業
        </h2>
        {companies.length > 0 ? (
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <li key={company.id}>
                <CompanyCard company={toCompanySummary(company)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-muted-foreground">この業界の企業はまだ掲載していません。</p>
        )}
      </section>

      {features.length > 0 && (
        <section aria-labelledby="industry-features" className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <h2 id="industry-features" className="eyebrow">Feature</h2>
          <ul className="mt-4 border-t border-foreground">
            {features.map((feature) => (
              <li key={feature.id} className="border-b border-border">
                <Link href={`/features/${feature.id}`} className="block py-6 font-serif text-xl font-semibold hover:underline">
                  {feature.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {industry && (
        <footer className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="figures border-t border-border pt-8 text-xs text-muted-foreground">
            最終更新 {formatDateJa(industry.updatedAt)}
          </p>
        </footer>
      )}
    </article>
  );
}
