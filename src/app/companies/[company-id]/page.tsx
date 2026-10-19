import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyView } from "@/components/company/company-view";
import { RecordView } from "@/components/company/record-view";
import { companyRepository } from "@/lib/repositories";
import { toPlainText } from "@/lib/rich-text";
import { SITE_NAME, siteUrl } from "@/lib/site";

/*
 * Every published company is prerendered, and any other id is a real 404 —
 * not a 200 with "not found" text, which search engines index as a page.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const companies = await companyRepository.list();
  return companies.map((c) => ({ "company-id": c.id }));
}

/**
 * What a search result or a link preview says about an entry with no description
 * yet. Deliberately about the page rather than about the company: nobody has
 * researched what this company does, and a plausible sentence here would be the
 * same fabrication the entry itself refuses to make.
 */
function metaFallback(company: { officialName: string; code: string }) {
  return `${company.officialName}（証券コード ${company.code}）の有価証券報告書にもとづく財務データ。解説は未作成です。`;
}

export async function generateMetadata({ params }: PageProps<"/companies/[company-id]">): Promise<Metadata> {
  const company = await companyRepository.get((await params)["company-id"]);
  if (!company) return {};
  const description = company.description ? toPlainText(company.description) : metaFallback(company);
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
    twitter: { card: "summary", title: `${company.name}とは？｜${SITE_NAME}`, description },
  };
}

export default async function CompanyPage({ params }: PageProps<"/companies/[company-id]">) {
  const company = await companyRepository.get((await params)["company-id"]);
  if (!company) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: company.officialName,
    alternateName: [company.name, company.nameEn].filter(Boolean),
    description: company.description ? toPlainText(company.description) : metaFallback(company),
    tickerSymbol: company.code,
    url: siteUrl(`/companies/${company.id}`),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped so a string in the data cannot close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <RecordView companyId={company.id} />

      <CompanyView company={company} />
    </article>
  );
}
