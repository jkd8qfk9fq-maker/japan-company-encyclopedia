import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReaderTrail } from "@/components/company/reader-trail";
import { toCompanySummary } from "@/lib/company-summary";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository, featureRepository, industryRepository } from "@/lib/repositories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE_EN } from "@/lib/site";
import { INDUSTRY_IDS } from "@/types/company";

export const metadata = {
  title: { absolute: `${SITE_NAME}｜何をしている会社かがわかる` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

/**
 * The front page is an editorial cover, not a dashboard: no market data, no
 * rankings, no grid of numbers. Hero → Feature → Industries → Companies →
 * Explore, each a single idea with room around it.
 */
export default async function HomePage() {
  const [companies, features, researchedIndustries] = await Promise.all([
    companyRepository.list(),
    featureRepository.list(),
    industryRepository.list(),
  ]);
  const summaries = companies.map(toCompanySummary);
  const feature = features[0];

  const researched = new Set(researchedIndustries.map((i) => i.id));
  const industries = INDUSTRY_IDS.map((id) => ({
    id,
    ...INDUSTRY_LABELS[id],
    count: summaries.filter((c) => c.industries.some((i) => i.id === id)).length,
  })).filter((i) => i.count > 0 || researched.has(i.id));

  return (
    <>
      {/* HERO */}
      <section className="mx-auto flex min-h-[calc(100svh-var(--header-height)-3.5rem)] max-w-6xl flex-col justify-center px-5 py-20 md:min-h-[calc(100svh-var(--header-height))] md:px-8">
        <p className="eyebrow">{SITE_NAME}</p>
        <h1 className="wordmark mt-6 text-[clamp(3.25rem,14vw,11rem)]">
          Japanese
          <br />
          Companies
        </h1>
        <p className="mt-10 max-w-2xl font-serif text-[1.375rem] leading-[1.8] font-semibold md:text-[1.75rem]">
          会社名ではなく、
          <br className="sm:hidden" />
          「何をしている会社か」から。
        </p>
        <p className="mt-3 text-sm tracking-[0.04em] text-muted-foreground">{SITE_TAGLINE_EN}</p>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Link
            href="/companies"
            className="inline-flex min-h-13 items-center gap-2 rounded-full bg-foreground px-8 text-base text-background transition-opacity hover:opacity-85"
          >
            企業を探す
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/search" className="link-ink inline-flex min-h-11 items-center text-sm">
            キーワードで検索
          </Link>
        </div>
      </section>

      <ReaderTrail companies={summaries} />

      {/* FEATURE */}
      {feature && (
        <section aria-labelledby="home-feature" className="mt-16 bg-foreground text-background">
          <Link href={`/features/${feature.id}`} className="group mx-auto block max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <p className="eyebrow !text-background/60">Feature</p>
            <h2
              id="home-feature"
              className="mt-6 max-w-4xl font-serif text-[2rem] leading-[1.45] font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8 md:text-[3.25rem]"
            >
              {feature.title}
            </h2>
            {feature.subtitle && <p className="mt-6 max-w-2xl text-background/75 md:text-lg">{feature.subtitle}</p>}
            <span className="mt-10 inline-flex items-center gap-2 text-sm">
              特集を読む
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </Link>
        </section>
      )}

      {/* EXPLORE INDUSTRIES */}
      <section aria-labelledby="home-industries" className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
        <p className="eyebrow" aria-hidden>Explore</p>
        <h2 id="home-industries" className="mt-3 font-serif text-[1.75rem] font-semibold md:text-[2.25rem]">
          業界から探す
        </h2>
        <ul className="mt-10 grid border-t border-foreground sm:grid-cols-2">
          {industries.map((industry) => (
            <li key={industry.id} className="border-b border-border sm:odd:border-r sm:odd:pr-8 sm:even:pl-8">
              <Link href={`/industries/${industry.id}`} className="group flex min-h-20 items-center justify-between gap-4 py-5">
                <span>
                  <span className="block font-serif text-2xl font-semibold group-hover:underline group-hover:underline-offset-4">
                    {industry.name}
                  </span>
                  <span className="eyebrow mt-1 block">{industry.nameEn}</span>
                </span>
                <span className="figures text-sm text-muted-foreground">{industry.count}社</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* COMPANIES */}
      <section aria-labelledby="home-companies" className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
        <p className="eyebrow" aria-hidden>Companies</p>
        <h2 id="home-companies" className="mt-3 font-serif text-[1.75rem] font-semibold md:text-[2.25rem]">
          企業
        </h2>
        <ul className="mt-10 border-t border-foreground">
          {summaries.slice(0, 6).map((company) => (
            <li key={company.id} className="border-b border-border">
              <Link
                href={`/companies/${company.id}`}
                className="group grid gap-2 py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-baseline md:gap-10"
              >
                <span>
                  {company.shortNameEn && (
                    <span className="wordmark block text-[2.25rem] break-words md:text-[3.25rem]" aria-hidden>
                      {company.shortNameEn}
                    </span>
                  )}
                  <span className="mt-1 block font-serif text-lg font-semibold group-hover:underline group-hover:underline-offset-4">
                    {company.name}
                  </span>
                </span>
                <span className="text-[0.9375rem] leading-7 text-muted-foreground">{company.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/companies" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium">
          すべての企業を見る
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      {/* EXPLORE */}
      <section aria-labelledby="home-explore" className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
        <h2 id="home-explore" className="eyebrow">Explore</h2>
        <ul className="mt-6 grid gap-x-10 gap-y-2 sm:grid-cols-2 md:grid-cols-4">
          {[
            { href: "/companies", label: "企業一覧" },
            { href: "/industries", label: "業界一覧" },
            { href: "/features", label: "特集" },
            { href: "/terms", label: "用語集" },
          ].map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="group flex min-h-14 items-center justify-between border-b border-border font-serif text-lg">
                {link.label}
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
