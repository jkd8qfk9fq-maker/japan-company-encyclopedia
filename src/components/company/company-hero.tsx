import Link from "next/link";
import { Flag } from "lucide-react";
import { Fragment } from "react";
import { RichText } from "@/components/rich-text/rich-text";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { SITE_NAME, siteUrl } from "@/lib/site";
import type { Company } from "@/types/company";
import { segmentTone, structureBranches } from "./business-structure";
import { FavoriteButton } from "./favorite-button";
import { KeyFacts } from "./key-facts";
import { ShareActions } from "./share-actions";

const EXCHANGE_NAME: Record<Company["listings"][number]["exchange"], string> = {
  tse: "東証",
  nse: "名証",
  fse: "福証",
  sse: "札証",
};

/**
 * The first view, after the approved mockup: who it is (code, market, industries), what it is called, what it does
 * in one sentence, what it is made of (one chip per business, in the colour the rest of the page uses for it), and
 * how big it is (the key facts). Nothing here is decoration and nothing is invented: every chip and figure is the
 * entry's own data, and a part with no data is left out.
 */
export function CompanyHero({ company }: { company: Company }) {
  const industries = [...company.industries].sort((a, b) => Number(b.primary ?? false) - Number(a.primary ?? false));
  const { branches } = structureBranches(company.businesses);

  // A long wordmark ("MITSUBISHI CORPORATION") wraps to two lines at the size a short one ("KIRIN") can take.
  const wordmarkSize =
    (company.shortNameEn?.length ?? 0) > 12
      ? "text-[clamp(2.5rem,8vw,4.5rem)]"
      : "text-[clamp(3.25rem,11vw,5.5rem)]";

  return (
    <section id="overview" aria-labelledby="company-name" className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-8 md:px-8 md:pt-14">
        <p className="text-xs tracking-[0.18em] text-muted-foreground">
          <span className="figures">証券コード {company.code}</span>
          {company.listings.length > 0 && (
            <> ・ {company.listings.map((l) => `${EXCHANGE_NAME[l.exchange]}${l.market ?? ""}`).join("・")}</>
          )}
          {industries.length > 0 && " ・ "}
          {industries.map((ref, i) => (
            <Fragment key={ref.industryId}>
              {i > 0 && " ／ "}
              <Link href={`/industries/${ref.industryId}`} className="underline-offset-4 hover:text-foreground hover:underline">
                {INDUSTRY_LABELS[ref.industryId].name}
              </Link>
            </Fragment>
          ))}
        </p>

        {company.shortNameEn && (
          <p aria-hidden className={`wordmark mt-4 break-words ${wordmarkSize}`}>
            {company.shortNameEn}
          </p>
        )}
        <h1 id="company-name" className="mt-3 font-serif text-[1.75rem] font-semibold tracking-[0.04em] md:text-[2.125rem]">
          {company.name}
        </h1>
        <p className="text-sm text-muted-foreground">{company.officialName}</p>

        {company.description ? (
          <p className="mt-5 max-w-[38rem] text-[1.1875rem] leading-[1.85] md:text-[1.375rem]">
            <RichText text={company.description} />
          </p>
        ) : (
          /*
            A figures-only entry. The reader is told what this page is and what it is not, where the 3-second
            sentence would be — rather than meeting a blank space and guessing.
          */
          <p className="mt-5 max-w-3xl text-[0.9375rem] leading-7 text-muted-foreground">
            この会社の解説はまだ作成していません。下の財務データは有価証券報告書のXBRLから機械的に取り出し、有報の印字と突き合わせたものです。
          </p>
        )}

        {branches.length > 1 && (
          <ul aria-label="主な事業" className="mt-6 flex flex-wrap gap-2">
            {branches.map((business, index) => (
              <li key={business.id}>
                <a
                  href="#business"
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border px-3.5 text-[0.8125rem] transition-colors hover:border-foreground"
                >
                  <span
                    aria-hidden
                    className="size-2.5 rounded-[2px] border border-foreground/15"
                    style={{ background: segmentTone(index) }}
                  />
                  {business.shortName ?? business.name}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <KeyFacts records={company.financials} sources={company.sources} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
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
    </section>
  );
}
