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
          {/*
            Photograph tiles, after the operator's request to design the list through its images (2026-11-01). Two
            across on a phone, three to four on a wide screen, all the same size: the order is the taxonomy's and
            nothing here ranks industries. Now that most industries are researched, the exception is what gets a mark.
          */}
          <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
            {industries.map((industry) => {
              const members = membersOf(industry.id);
              const lines = linesOf(industry.id);
              return (
                <li key={industry.id}>
                  <Link
                    href={`/industries/${industry.id}`}
                    className="group relative flex h-full min-h-44 flex-col justify-end overflow-hidden rounded-md bg-foreground text-white sm:min-h-60"
                  >
                    <Image
                      src={INDUSTRY_IMAGES[industry.id]}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(min-width: 64rem) 18rem, (min-width: 48rem) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/0" />
                    <span className="relative flex flex-col p-3 sm:p-4">
                      <span className="wordmark text-[0.8125rem] tracking-[0.06em] opacity-85 sm:text-sm" aria-hidden>
                        {industry.nameEn}
                      </span>
                      <span className="mt-1 font-serif text-lg leading-tight font-semibold sm:text-2xl">{industry.name}</span>
                      {/* A few of its companies, on screens wide enough to read them: what the industry is, by example. */}
                      {members.length > 0 && (
                        <span className="mt-1.5 line-clamp-2 hidden text-xs leading-5 opacity-85 sm:block">
                          {members.slice(0, 4).map((c) => c.name).join("・")}
                          {members.length > 4 && ` ほか${members.length - 4}社`}
                        </span>
                      )}
                      <span className="mt-2 flex flex-wrap items-center gap-1.5 text-[0.6875rem]">
                        <span className="figures rounded-full bg-white/90 px-2 py-0.5 text-black">{industry.companyCount}社</span>
                        {lines > 0 && <span className="figures rounded-full border border-white/70 px-2 py-0.5">線 {lines}本</span>}
                        {!industry.researched && <span className="rounded-full bg-black/45 px-2 py-0.5 ring-1 ring-white/60">解説は準備中</span>}
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
