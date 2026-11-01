import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HUB_IMAGES, INDUSTRY_IMAGES } from "@/assets/industries";
import { IndustryHero } from "@/components/industry/industry-hero";
import { ArrowRight } from "lucide-react";
import { CompanySection } from "@/components/company/company-section";
import { IndustryFlowMap } from "@/components/industry/industry-flow-map";
import { SectionTabs, type SectionLink } from "@/components/navigation/section-tabs";
import { listIndustryPages } from "@/lib/industries";
import { buildIndustryMap } from "@/lib/industry-map";
import { companyRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "業界",
  description: "日本の産業を、業界ごとの構造、業界どうしの取引のつながり、そこにいる企業から理解する。",
  alternates: { canonical: "/industries" },
};

/**
 * The industries hub: one page, tabs at every width (operator request, 2026-10-20) — the industries and the industry
 * map. Each tab is rendered on the server and stays in the document; the tabs only choose which one is on screen.
 */
export default async function IndustriesPage() {
  const [industries, companies] = await Promise.all([listIndustryPages(), companyRepository.list()]);
  const map = buildIndustryMap(companies);
  const pairs = map.flows.reduce((sum, flow) => sum + flow.pairs.length, 0);
  const linesOf = (id: string) => map.flows.filter((f) => f.from === id || f.to === id).length;
  const membersOf = (id: string) => map.industries.find((i) => i.id === id)?.companies.filter((c) => c.primary) ?? [];

  const sections: SectionLink[] = [
    { id: "list", label: "業界一覧" },
    { id: "map", label: "産業マップ" },
  ];

  return (
    <div>
      <header className="mx-auto max-w-6xl px-5 pt-8 pb-6 md:px-8 md:pt-10">
        <IndustryHero image={HUB_IMAGES.header} eyebrow="Industries" title="業界から、日本の産業を見る" priority />
        <h1 className="mt-6 font-serif text-[1.875rem] font-semibold md:text-[2.5rem]">業界</h1>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-7 text-muted-foreground">
          企業を、業界の中での位置と、業界どうしのつながりから見る。業界の仕組みを知ると、会社の役割が見えてきます。
        </p>
      </header>

      <SectionTabs sections={sections} containerId="industries-tabs" tabbed="always" />

      <div id="industries-tabs">
        <CompanySection id="list" eyebrow="Industries" title="業界一覧" lead="業界を選ぶと、その業界の仕組み・企業・つながりが開きます。">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const members = membersOf(industry.id);
              const lines = linesOf(industry.id);
              return (
                <li key={industry.id}>
                  <Link
                    href={`/industries/${industry.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-foreground"
                  >
                    <span className="relative block aspect-[16/7] bg-muted">
                      <Image
                        src={INDUSTRY_IMAGES[industry.id]}
                        alt=""
                        fill
                        placeholder="blur"
                        sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </span>
                    <span className="flex flex-1 flex-col p-4">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-serif text-xl font-semibold group-hover:underline">{industry.name}</span>
                      <span className="figures text-xs text-muted-foreground">{industry.companyCount}社</span>
                    </span>
                    <span className="eyebrow mt-0.5">{industry.nameEn}</span>
                    {members.length > 0 && (
                      <span className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {members.slice(0, 5).map((c) => c.name).join("・")}
                        {members.length > 5 && ` ほか${members.length - 5}社`}
                      </span>
                    )}
                    <span className="mt-auto flex flex-wrap gap-1.5 pt-3 text-[0.6875rem]">
                      {industry.researched && (
                        <span className="rounded-full bg-foreground px-2 py-0.5 text-background">構造の解説あり</span>
                      )}
                      {lines > 0 && (
                        <span className="rounded-full border border-ink px-2 py-0.5 text-ink">取引の線 {lines}本</span>
                      )}
                    </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </CompanySection>

        <CompanySection
          id="map"
          eyebrow="Industry Map"
          title="業界から業界へ"
          lead={
            <>
              掲載企業の有価証券報告書に「仕入先」「顧客」として書かれた関係だけを集め、売る側の業界から買う側の業界へ線を引いています（
              <span className="figures">{map.industries.length}</span>業界・取引の組<span className="figures">{pairs}</span>
              件）。産業を選ぶと、その産業の企業と取引のつながりが開きます。出典は各企業のページにあります。
            </>
          }
        >
          <IndustryHero image={HUB_IMAGES.map} eyebrow="Industry Map" title="業界から業界へ、モノとサービスの流れ" />
          <div className="mt-8">
            <IndustryFlowMap data={map} />
          </div>
        </CompanySection>
      </div>

      <p className="mx-auto max-w-6xl px-5 pb-12 text-xs text-muted-foreground md:px-8">
        <Link href="/companies" className="inline-flex min-h-11 items-center gap-1.5 hover:text-foreground">
          企業の一覧から探す
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </p>
    </div>
  );
}
