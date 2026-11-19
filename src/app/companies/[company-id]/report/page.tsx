import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyReport } from "@/components/company/company-report";
import { companyRepository } from "@/lib/repositories";
import { SITE_NAME } from "@/lib/site";

/*
 * The premium report (JCE-073) of every published company, prerendered like the company page it belongs to.
 * Not indexed: the page is a plan arrangement of the company page's public facts, and a search result should
 * land on the entry itself.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const companies = await companyRepository.list();
  return companies.map((c) => ({ "company-id": c.id }));
}

export async function generateMetadata({ params }: PageProps<"/companies/[company-id]/report">): Promise<Metadata> {
  const company = await companyRepository.get((await params)["company-id"]);
  if (!company) return {};
  return {
    title: `${company.name}の企業レポート`,
    description: `${company.officialName}（証券コード ${company.code}）のプレミアムレポート。有価証券報告書の印字値5期、売上の内訳、計算値と業界の中での位置を印刷できる形にまとめています。`,
    alternates: { canonical: `/companies/${company.id}/report` },
    robots: { index: false, follow: true },
    openGraph: { title: `${company.name}の企業レポート｜${SITE_NAME}`, type: "article" },
  };
}

export default async function CompanyReportPage({ params }: PageProps<"/companies/[company-id]/report">) {
  const company = await companyRepository.get((await params)["company-id"]);
  if (!company) notFound();
  const companies = await companyRepository.list();
  return <CompanyReport company={company} companies={companies} />;
}
