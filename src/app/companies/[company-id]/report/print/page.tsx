import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyReport } from "@/components/company/company-report";
import { ReportPrintToolbar } from "@/components/company/report-print-toolbar";
import reportStyles from "@/components/company/company-report.module.css";
import { companyRepository, revisionRepository } from "@/lib/repositories";
import { SITE_NAME } from "@/lib/site";

/*
 * The report's print page (JCE-135): the same report rendered as the sheet itself — light theme,
 * every folded table open from the start, and a screen-only toolbar — for readers whose browser
 * cannot open the print dialog from the report page (in-app browsers, home-screen web apps),
 * where the button used to do nothing at all. The content is CompanyReport itself, gates included,
 * so the paid boundary is exactly the report's: what a browser may not see on the report it does
 * not see here either. Not indexed, like the report; the canonical stays the report's URL.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const companies = await companyRepository.list();
  return companies.map((c) => ({ "company-id": c.id }));
}

export async function generateMetadata({ params }: PageProps<"/companies/[company-id]/report/print">): Promise<Metadata> {
  const company = await companyRepository.get((await params)["company-id"]);
  if (!company) return {};
  return {
    title: `${company.name}の企業レポート（印刷用）`,
    description: `${company.officialName}（証券コード ${company.code}）のプレミアムレポートの印刷用ページ。数字の表をすべて開いた状態で表示します。`,
    alternates: { canonical: `/companies/${company.id}/report` },
    robots: { index: false, follow: true },
    openGraph: { title: `${company.name}の企業レポート｜${SITE_NAME}`, type: "article" },
  };
}

export default async function CompanyReportPrintPage({ params }: PageProps<"/companies/[company-id]/report/print">) {
  const company = await companyRepository.get((await params)["company-id"]);
  if (!company) notFound();
  const companies = await companyRepository.list();
  const revisions = await revisionRepository.listCorrectionsForTarget("company", company.id);
  return (
    <div className={reportStyles.sheet}>
      <ReportPrintToolbar companyId={company.id} />
      <CompanyReport company={company} companies={companies} revisions={revisions} printView />
    </div>
  );
}
