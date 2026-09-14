import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { BusinessList } from "@/components/company/business-list";
import { BusinessModel } from "@/components/company/business-model";
import { CompanyHero } from "@/components/company/company-hero";
import { CompanyIndustries } from "@/components/company/company-industries";
import { CompanySection } from "@/components/company/company-section";
import { FinancialSection } from "@/components/company/financial-section";
import { HistoryTimeline } from "@/components/company/history-timeline";
import { RecordView } from "@/components/company/record-view";
import { RelatedCompanies } from "@/components/company/related-companies";
import { SectionNavigation, type SectionLink } from "@/components/company/section-navigation";
import { companyRepository } from "@/lib/repositories";
import { toPlainText } from "@/lib/rich-text";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { formatDateJa } from "@/lib/utils/format";

/*
 * Every published company is prerendered, and any other id is a real 404 —
 * not a 200 with "not found" text, which search engines index as a page.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const companies = await companyRepository.list();
  return companies.map((c) => ({ "company-id": c.id }));
}

export async function generateMetadata({ params }: PageProps<"/companies/[company-id]">): Promise<Metadata> {
  const company = await companyRepository.get((await params)["company-id"]);
  if (!company) return {};
  const description = toPlainText(company.description);
  const path = `/companies/${company.id}`;
  return {
    title: `${company.name}とは？`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${company.name}とは？｜${SITE_NAME}`,
      description,
      url: path,
      type: "article",
    },
  };
}

export default async function CompanyPage({ params }: PageProps<"/companies/[company-id]">) {
  const company = await companyRepository.get((await params)["company-id"]);
  if (!company) notFound();

  const sections: SectionLink[] = [
    { id: "overview", label: "概要" },
    ...(company.businesses.length > 0 ? [{ id: "business", label: "事業" }] : []),
    ...(company.businessModel ? [{ id: "business-model", label: "ビジネスモデル" }] : []),
    { id: "financials", label: "財務" },
    ...(company.history.length > 0 ? [{ id: "history", label: "歴史" }] : []),
    { id: "industry", label: "業界" },
    ...(company.relatedCompanies.length > 0 ? [{ id: "related-companies", label: "関連企業" }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: company.officialName,
    alternateName: [company.name, company.nameEn].filter(Boolean),
    description: toPlainText(company.description),
    tickerSymbol: company.code,
    url: new URL(`/companies/${company.id}`, SITE_URL).toString(),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped so a string in the data cannot close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <RecordView companyId={company.id} />

      <CompanyHero company={company} />
      <SectionNavigation sections={sections} />

      {company.businesses.length > 0 && (
        <CompanySection id="business" eyebrow="Business" title="何をしている会社？">
          <BusinessList businesses={company.businesses} sources={company.sources} />
        </CompanySection>
      )}

      {company.businessModel && (
        <CompanySection id="business-model" eyebrow="Business Model" title="どうやって儲けている？" tone="paper">
          <BusinessModel model={company.businessModel} sources={company.sources} />
        </CompanySection>
      )}

      <CompanySection id="financials" eyebrow="Financials" title="売上と利益">
        <FinancialSection companyName={company.name} records={company.financials} sources={company.sources} />
      </CompanySection>

      {company.history.length > 0 && (
        <CompanySection
          id="history"
          eyebrow="History"
          title="いまの形になるまで"
          lead="すべての出来事ではなく、現在の事業につながる転換点だけを選んでいます。"
          tone="paper"
        >
          <HistoryTimeline events={company.history} sources={company.sources} />
        </CompanySection>
      )}

      <CompanySection id="industry" eyebrow="Industry" title="業界のどこにいる？">
        <CompanyIndustries company={company} />
      </CompanySection>

      {company.relatedCompanies.length > 0 && (
        <CompanySection id="related-companies" eyebrow="Related Companies" title="つながりのある企業">
          <RelatedCompanies relations={company.relatedCompanies} sources={company.sources} />
        </CompanySection>
      )}

      <AdSlot placement="company-bottom" />

      <footer className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="border-t border-border pt-8 text-xs leading-6 text-muted-foreground">
          <p className="figures">最終更新 {formatDateJa(company.updatedAt)}</p>
          <p>
            この項目は公開資料に基づいて作成されています。誤りを見つけた場合は、ページ上部の「誤りを報告」からお知らせください。
          </p>
        </div>
      </footer>
    </article>
  );
}
