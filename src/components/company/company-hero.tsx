import Link from "next/link";
import { Columns3, ExternalLink, Flag } from "lucide-react";
import { Fragment } from "react";
import { RichText } from "@/components/rich-text/rich-text";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { prefectureByName } from "@/lib/prefectures";
import { SITE_NAME, siteUrl } from "@/lib/site";
import type { Company } from "@/types/company";
import type { Headquarters } from "@/types/headquarters";
import type { Website } from "@/types/website";
import { segmentTone, structureBranches } from "./business-structure";
import { FavoriteButton } from "./favorite-button";
import { KeyFacts } from "./key-facts";
import { ShareActions } from "./share-actions";
import { PushCompanyToggle } from "@/components/engagement/push-controls";

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
export function CompanyHero({
  company,
  headquarters,
  website,
}: {
  company: Company;
  headquarters?: Headquarters | null;
  website?: Website | null;
}) {
  const yuho = website ? company.sources.find((s) => s.id === website.sourceId) : undefined;
  const prefecture = headquarters ? prefectureByName(headquarters.prefecture) : null;
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
          {/* Where the head office is (EDINET code list), and a way to the other companies of that prefecture. */}
          {headquarters && prefecture && (
            <>
              {" ・ 本社 "}
              <Link href={`/prefectures/${prefecture.id}`} className="underline-offset-4 hover:text-foreground hover:underline">
                {prefecture.name}
              </Link>
              {headquarters.municipality}
            </>
          )}
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
          {/* JCE-055: the company's own site, at the address its 有報 prints for its electronic notices. */}
          {website && (
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${yuho?.title ?? "有価証券報告書"}【株式事務の概要】公告掲載方法に記載のアドレス`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              公式サイト
              <span className="figures text-xs text-white/75">{new URL(website.url).hostname}</span>
              <ExternalLink className="size-3.5" aria-hidden />
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          )}
          <FavoriteButton companyId={company.id} companyName={company.name} />
          <PushCompanyToggle companyId={company.id} companyName={company.name} />
          <Link
            href={`/compare?ids=${company.id}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm transition-colors hover:border-foreground"
          >
            <Columns3 className="size-4" aria-hidden />
            見比べる
          </Link>
          <ShareActions url={siteUrl(`/companies/${company.id}`)} text={`${company.name}とは？｜${SITE_NAME}`} />
          <Link
            href={`/contact?company=${company.id}`}
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
