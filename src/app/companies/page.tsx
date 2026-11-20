import type { Metadata } from "next";
import { CompanyDirectory } from "@/components/company/company-directory";
import { toCompanySummary } from "@/lib/company-summary";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository } from "@/lib/repositories";
import { INDUSTRY_IDS } from "@/types/company";

export const metadata: Metadata = {
  title: "企業一覧",
  description: "掲載している日本の上場企業の一覧。企業名・証券コード・業界から探せます。",
  alternates: { canonical: "/companies" },
};

export default async function CompaniesPage() {
  const companies = await companyRepository.list();
  const summaries = companies.map(toCompanySummary);

  // Only industries that currently have a company: an empty filter is a dead end.
  const industries = INDUSTRY_IDS.map((id) => ({
    id,
    name: INDUSTRY_LABELS[id].name,
    count: summaries.filter((c) => c.industries.some((i) => i.id === id)).length,
  })).filter((i) => i.count > 0);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>Companies</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[3rem]">企業</h1>
      <p className="prose-ja mt-4 max-w-2xl text-muted-foreground">
        日本企業百科事典に掲載している日本の上場企業{companies.length.toLocaleString("ja-JP")}社の一覧です。各社の記載は有価証券報告書（EDINET）に基づいて書かれていて、企業ページでは事業の内容・財務・沿革を出典とともに読めます。掲載の線引きは、記載を出典で検証できたかどうかです。数字だけを先に集めた会社は、本文と出典がそろうまでこの一覧には出していないため、ここにある会社はすべて「何をしている会社か」を読める会社です。会社名ではなく、何をしている会社なのかから選んでください。
      </p>
      <div className="mt-12">
        <CompanyDirectory companies={summaries} industries={industries} />
      </div>
    </div>
  );
}
