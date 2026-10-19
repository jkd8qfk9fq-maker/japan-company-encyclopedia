import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listIndustryPages } from "@/lib/industries";

export const metadata: Metadata = {
  title: "業界一覧",
  description: "日本の産業を、業界ごとの構造と、そこにいる企業から理解する。",
  alternates: { canonical: "/industries" },
};

export default async function IndustriesPage() {
  const industries = await listIndustryPages();

  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>Industries</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[3rem]">業界</h1>
      <p className="prose-ja mt-4 max-w-2xl text-muted-foreground">
        企業を、業界の中での位置から見る。業界の仕組みを知ると、会社の役割が見えてきます。
      </p>

      <Link
        href="/industries/map"
        className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground px-5 text-sm font-medium hover:bg-foreground hover:text-background"
      >
        産業マップで、業界どうしのつながりを見る
        <ArrowRight className="size-4" aria-hidden />
      </Link>

      <ul className="mt-14 grid border-t border-foreground sm:grid-cols-2">
        {industries.map((industry) => (
          <li key={industry.id} className="border-b border-border sm:odd:border-r sm:odd:pr-8 sm:even:pl-8">
            <Link href={`/industries/${industry.id}`} className="group flex min-h-24 items-center justify-between gap-4 py-6">
              <span>
                <span className="block font-serif text-[1.625rem] font-semibold group-hover:underline group-hover:underline-offset-4">
                  {industry.name}
                </span>
                <span className="eyebrow mt-1 block">{industry.nameEn}</span>
              </span>
              <span className="text-right text-sm text-muted-foreground">
                <span className="figures block">{industry.companyCount}社</span>
                {industry.researched && <span className="mt-0.5 block text-xs">構造の解説あり</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
