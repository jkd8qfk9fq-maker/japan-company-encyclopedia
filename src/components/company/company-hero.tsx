import Link from "next/link";
import { Flag } from "lucide-react";
import { RichText } from "@/components/rich-text/rich-text";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company } from "@/types/company";
import { BusinessStructure } from "./business-structure";
import { FavoriteButton } from "./favorite-button";

const EXCHANGE_NAME: Record<Company["listings"][number]["exchange"], string> = {
  tse: "東証",
  nse: "名証",
  fse: "福証",
  sse: "札証",
};

/**
 * The 3-second layer. Top to bottom it answers, in order:
 *   what is it called → what does it do (one sentence) → what is it made of.
 * Everything else on the page is below this, and nothing competes with it.
 */
export function CompanyHero({ company }: { company: Company }) {
  const primaryIndustries = [...company.industries].sort((a, b) => Number(b.primary ?? false) - Number(a.primary ?? false));

  return (
    <section id="overview" aria-labelledby="company-name" className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-5 pt-12 md:px-8 md:pt-20">
        {company.shortNameEn && (
          <p
            aria-hidden
            className="wordmark text-[clamp(3rem,13vw,8.5rem)] break-words"
          >
            {company.shortNameEn}
          </p>
        )}
        <h1 id="company-name" className="mt-4 font-serif text-[1.75rem] font-semibold tracking-[0.04em] md:text-[2.5rem]">
          {company.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{company.officialName}</p>

        <p className="mt-8 max-w-3xl text-[1.25rem] leading-[1.9] md:text-[1.5rem]">
          <RichText text={company.description} />
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="figures">証券コード {company.code}</span>
          <span>
            {company.listings.map((l) => `${EXCHANGE_NAME[l.exchange]}${l.market}`).join("・")}
          </span>
          <span className="flex flex-wrap gap-x-3">
            {primaryIndustries.map((ref) => (
              <Link key={ref.industryId} href={`/industries/${ref.industryId}`} className="link-ink">
                {INDUSTRY_LABELS[ref.industryId].name}
              </Link>
            ))}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <FavoriteButton companyId={company.id} companyName={company.name} />
          <Link
            href={`/report?company=${company.id}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Flag className="size-4" aria-hidden />
            誤りを報告
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-5 pb-16 md:mt-20 md:px-8 md:pb-24">
        <p className="eyebrow mb-8 text-center" aria-hidden>
          Business Structure
        </p>
        <BusinessStructure company={company} />
      </div>
    </section>
  );
}
