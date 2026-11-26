import type { Metadata } from "next";
import { CompanyDirectory } from "@/components/company/company-directory";
import { toCompanySummary } from "@/lib/company-summary";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository } from "@/lib/repositories";
import { INDUSTRY_IDS } from "@/types/company";
import { T } from "@/components/i18n/t";

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
    <div className="mx-auto max-w-6xl px-5 pt-5 pb-8 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Companies</p>
      <h1 className="mt-1 flex items-baseline gap-3 font-serif text-[1.75rem] font-semibold md:text-[2.5rem]">
        <span data-l="ja">企業
        <span className="figures font-sans text-sm font-normal text-muted-foreground"><span data-l="ja">{companies.length.toLocaleString("ja-JP")}社</span><span data-l="en">{companies.length.toLocaleString("ja-JP")} companies</span></span></span><span data-l="en">Companies <span className="figures font-sans text-sm font-normal text-muted-foreground"><span data-l="ja">{companies.length.toLocaleString("ja-JP")}社</span><span data-l="en">{companies.length.toLocaleString("ja-JP")} companies</span></span></span>
      </h1>
      {/*
        JCE-080: the header is compressed (the hub intro's type tier, tighter margins) so the search
        field and the first companies land in a phone's first view — with .prose-ja's double line
        height the introduction alone cost ~440px and no company was visible without scrolling.
        The words are unchanged.
      */}
      {/* 2026-11-23: the introduction folds behind one line, so the search and the list open the first screen. */}
      <details className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
        <span data-l="ja"><summary className="cursor-pointer text-xs text-muted-foreground"><T m={{ ja: "この一覧について", en: "About this list" }} /></summary>
        日本企業百科事典に掲載している日本の上場企業{companies.length.toLocaleString("ja-JP")}社の一覧です。各社の記載は有価証券報告書（EDINET）に基づいて書かれていて、企業ページでは事業の内容・財務・沿革を出典とともに読めます。掲載の線引きは、記載を出典で検証できたかどうかです。数字だけを先に集めた会社は、本文と出典がそろうまでこの一覧には出していないため、ここにある会社はすべて「何をしている会社か」を読める会社です。会社名ではなく、何をしている会社なのかから選んでください。
      </span><span data-l="en"><summary className="cursor-pointer text-xs text-muted-foreground"><T m={{ ja: "この一覧について", en: "About this list" }} /></summary>This is a list of {companies.length.toLocaleString("ja-JP")} listed Japanese companies featured in the Japanese Company Encyclopedia. Each company&apos;s entry is written from its annual securities report (EDINET), and on each company page you can read about its business, financials, and history along with sources. We include a company only if its entry can be verified against sources. Companies for which we have gathered only numbers are left off this list until the text and sources are ready, so every company here is one where you can read what it does. Choose by what a company does, not by its name.</span></details>
      <div className="mt-4">
        <CompanyDirectory companies={summaries} industries={industries} />
      </div>
    </div>
  );
}
