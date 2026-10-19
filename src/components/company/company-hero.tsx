import Link from "next/link";
import { Flag } from "lucide-react";
import { RichText } from "@/components/rich-text/rich-text";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { SITE_NAME, siteUrl } from "@/lib/site";
import type { Company } from "@/types/company";
import { BusinessStructure } from "./business-structure";
import { FavoriteButton } from "./favorite-button";
import { ShareActions } from "./share-actions";

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

  // A long wordmark ("MITSUBISHI CORPORATION") wraps to two lines at the size a
  // short one ("SONY GROUP") can take, and would push the structure down.
  const wordmarkSize =
    (company.shortNameEn?.length ?? 0) > 12
      ? "text-[clamp(2.25rem,8vw,4.25rem)]"
      : "text-[clamp(2.75rem,11vw,5.5rem)]";

  return (
    <section id="overview" aria-labelledby="company-name" className="scroll-mt-28">
      {/*
        Independent review F-07: the wordmark used to dominate the first viewport
        and the structure started ~690px down at 1280px wide. The hero now follows
        the spec's own order — name, official name, one sentence, structure — with
        identifiers and actions moved below the structure, so the 3-second answer
        (what it is called, what it does, what it is made of) is above the fold.
      */}
      <div className="mx-auto max-w-6xl px-5 pt-8 md:px-8 md:pt-12">
        {company.shortNameEn && (
          <p aria-hidden className={`wordmark break-words ${wordmarkSize}`}>
            {company.shortNameEn}
          </p>
        )}
        <h1 id="company-name" className="mt-3 font-serif text-[1.625rem] font-semibold tracking-[0.04em] md:text-[2.125rem]">
          {company.name}
        </h1>
        <p className="text-sm text-muted-foreground">{company.officialName}</p>

        {company.description ? (
          <p className="mt-5 max-w-3xl text-[1.1875rem] leading-[1.85] md:text-[1.375rem]">
            <RichText text={company.description} />
          </p>
        ) : (
          /*
            A figures-only entry. The reader is told what this page is and what it
            is not, in the position where the 3-second sentence would be — rather
            than meeting a blank space and guessing. The figures below it are
            extracted from the filing's XBRL and checked against it, so they are
            worth arriving for even before anyone has written the explanation.
          */
          <p className="mt-5 max-w-3xl text-[0.9375rem] leading-7 text-muted-foreground">
            この会社の解説はまだ作成していません。下の財務データは有価証券報告書のXBRLから機械的に取り出し、有報の印字と突き合わせたものです。
          </p>
        )}
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-5 pb-14 md:mt-10 md:px-8 md:pb-20">
        {/* A figures-only entry has no segments written, so the diagram — the most
            important component in the product — would draw a lone root node
            standing for nothing. Its heading goes with it. */}
        {company.businesses.length > 0 && (
          <>
            <p className="eyebrow mb-5 text-center" aria-hidden>
              Business Structure
            </p>
            <BusinessStructure company={company} />
          </>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="figures">証券コード {company.code}</span>
            <span>{company.listings.map((l) => `${EXCHANGE_NAME[l.exchange]}${l.market ?? ""}`).join("・")}</span>
            <span className="flex flex-wrap gap-x-3">
              {primaryIndustries.map((ref) => (
                <Link key={ref.industryId} href={`/industries/${ref.industryId}`} className="link-ink inline-flex min-h-11 items-center">
                  {INDUSTRY_LABELS[ref.industryId].name}
                </Link>
              ))}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <FavoriteButton companyId={company.id} companyName={company.name} />
            <ShareActions url={siteUrl(`/companies/${company.id}`)} text={`${company.name}とは？｜${SITE_NAME}`} />
            <Link
              href={`/report?company=${company.id}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Flag className="size-4" aria-hidden />
              誤りを報告
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
