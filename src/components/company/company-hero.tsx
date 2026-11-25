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
import type { SectionLink } from "@/components/navigation/section-tabs";
import { FavoriteButton } from "./favorite-button";
import { KeyFacts } from "./key-facts";
import { CompanyMark } from "./company-mark";
import { CompanySnapshot } from "./company-snapshot";
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
 *
 * JCE-077: the first view must carry the facts, not just the name. The wordmark is a label, not a poster — it is
 * set small so that on a phone the description, the business chips and the key facts all land in the first
 * screen, and the sections below start within it. The key facts stay size-only (invariant 4): density comes
 * from composition, never from adding growth rates or rankings here.
 *
 * JCE-087: tighter still, on the operator's screenshot review. The wordmark drops to label size, the vertical
 * rhythm compresses, and the official name is not repeated as its own line when it is only the company name
 * with a corporate-form affix (株式会社極洋 under 極洋 told the reader nothing twice). At the bottom, a
 * one-line table of contents names what this page holds — only the sections this entry actually has, plus
 * the analysis report — so "what is on this page" is answerable before scrolling.
 *
 * JCE-094: the hero is the fixed first view of the three-layer page — name, one-line description, the size
 * figures with their provenance badge (KeyFacts), and three buttons into the page (つながり / 数字の推移 /
 * この会社で学ぶ). Everything below the hero is depth the reader opens, in that order.
 */

/**
 * The official name minus its corporate-form affixes, for the duplication check below. Width and spacing
 * variants of the same name (ＡＣＳＬ vs ACSL, filed names with a space between words) count as the same:
 * the comparison normalises them, the displayed text is never touched.
 */
function stripCorporateForm(name: string): string {
  return name
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/[\s　]/g, "")
    .replace(/^(株式会社|有限会社|合同会社)/, "")
    .replace(/(株式会社|有限会社|合同会社)$/, "");
}
export function CompanyHero({
  company,
  headquarters,
  website,
  toc,
  hasConnections,
  related = [],
}: {
  company: Company;
  headquarters?: Headquarters | null;
  website?: Website | null;
  /** The sections this entry actually has, for the "このページの内容" line (JCE-087). */
  toc?: SectionLink[];
  /** Whether the page has a つながり section, inbound ties included (JCE-094). Defaults to this entry's own ties. */
  hasConnections?: boolean;
  /** Released companies this entry names as ties, for the first-view card (2026-11-23). */
  related?: { id: string; name: string }[];
}) {
  const yuho = website ? company.sources.find((s) => s.id === website.sourceId) : undefined;
  const prefecture = headquarters ? prefectureByName(headquarters.prefecture) : null;
  const industries = [...company.industries].sort((a, b) => Number(b.primary ?? false) - Number(a.primary ?? false));
  const { branches } = structureBranches(company.businesses);

  // A label, not a poster (JCE-077, tightened in JCE-087): even a long wordmark stays at label size.
  const wordmarkSize =
    (company.shortNameEn?.length ?? 0) > 12
      ? "text-[clamp(1.125rem,3.5vw,1.375rem)]"
      : "text-[clamp(1.25rem,4vw,1.5rem)]";
  // The official name earns its own line only when it says more than the name plus 株式会社 (JCE-087).
  const showOfficialName = stripCorporateForm(company.officialName) !== stripCorporateForm(company.name);

  return (
    <section id="overview" aria-labelledby="company-name" className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-4 md:px-8 md:pt-8 md:pb-6">
        {/* 2026-11-23 redesign: the code and market as one pill, the name and its mark side by side, and the
            industry and head office as a quiet line under the name — the mockup's order, every item a fact. */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="inline-flex max-w-full items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-[0.6875rem] text-muted-foreground">
              <span className="figures truncate">
                証券コード {company.code}
                {company.listings.length > 0 && <> ・ {company.listings.map((l) => `${EXCHANGE_NAME[l.exchange]}${l.market ?? ""}`).join("・")}</>}
              </span>
            </p>
            <h1 id="company-name" className="mt-2 font-serif text-[2rem] leading-tight font-semibold tracking-[0.04em] break-words md:text-[2.5rem]">
              {company.name}
            </h1>
            {company.shortNameEn && (
              <p aria-hidden className={`wordmark mt-0.5 break-words ${wordmarkSize}`}>
                {company.shortNameEn}
              </p>
            )}
          </div>
          <CompanyMark name={company.name} className="mt-1 size-16 text-[1.75rem] md:size-20 md:text-[2.25rem]" />
        </div>
        {showOfficialName && <p className="mt-0.5 text-xs text-muted-foreground">{company.officialName}</p>}
        <p className="mt-1.5 text-[0.6875rem] leading-5 text-muted-foreground">
          {industries.map((ref, i) => (
            <Fragment key={ref.industryId}>
              {i > 0 && " ／ "}
              <Link href={`/industries/${ref.industryId}`} className="underline-offset-4 hover:text-foreground hover:underline">
                {INDUSTRY_LABELS[ref.industryId].name}
              </Link>
            </Fragment>
          ))}
          {headquarters && prefecture && (
            <>
              {industries.length > 0 && " ・ "}
              {"本社 "}
              <Link href={`/prefectures/${prefecture.id}`} className="underline-offset-4 hover:text-foreground hover:underline">
                {prefecture.name}
              </Link>
              {headquarters.municipality}
            </>
          )}
        </p>

        {company.description ? (
          <p className="mt-2 max-w-[42rem] text-[0.9375rem] leading-[1.7] md:mt-2.5 md:text-[1.125rem] md:leading-[1.75]">
            <RichText text={company.description} />
          </p>
        ) : (
          /*
            A figures-only entry. The reader is told what this page is and what it is not, where the 3-second
            sentence would be — rather than meeting a blank space and guessing.
          */
          <p className="mt-3 max-w-3xl text-[0.9375rem] leading-7 text-muted-foreground">
            この会社の解説はまだ作成していません。下の財務データは有価証券報告書のXBRLから機械的に取り出し、有報の印字と突き合わせたものです。
          </p>
        )}

        {branches.length > 1 && (
          <ul aria-label="主な事業" className="-mx-4 mt-2.5 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-3 md:flex-wrap md:px-0 [&>*]:shrink-0">
            {branches.map((business, index) => (
              <li key={business.id}>
                <a
                  href="#business"
                  className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-card px-3 text-[0.8125rem] whitespace-nowrap transition-colors hover:border-foreground md:min-h-9"
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

        <div className="mt-3">
          <KeyFacts records={company.financials} sources={company.sources} />
        </div>
        <CompanySnapshot company={company} related={related} />

        {/* JCE-094: the first view ends with the three ways into the page — the ties, the figures over time,
            and the training this company carries — as buttons, so the reader picks a depth here instead of
            meeting the sections in scroll order. On a phone each opens its tab (SectionTabs follows the hash). */}
        <nav aria-label="この会社の読み方" className="mt-3 grid grid-cols-3 gap-2">
          {(hasConnections ?? company.relatedCompanies.length > 0) && (
            <a
              href="#connections"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-foreground px-2 text-[0.8125rem] font-semibold text-background transition-opacity hover:opacity-85"
            >
              つながりを見る
            </a>
          )}
          <a
            href="#financials"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-2 text-[0.8125rem] transition-colors hover:border-foreground"
          >
            数字の推移
          </a>
          {company.financials.length > 0 && (
            <a
              href="#training"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-2 text-[0.8125rem] transition-colors hover:border-foreground"
            >
              この会社で学ぶ
            </a>
          )}
        </nav>

        {/* 2026-11-23: the page actions as one swiped row, so they cost one line of the first screen. */}
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&>*]:shrink-0">
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

        {/* JCE-087: what this page holds, in one line at the top — only the sections this entry has,
            plus the analysis report. The SectionTabs below remain the way to move while reading. */}
        {toc && toc.length > 0 && (
          <nav aria-label="このページの内容" className="mt-4 hidden border-t border-border pt-3 md:block">
            <p className="text-xs leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">このページの内容</span>
              <span aria-hidden className="mx-2">―</span>
              {toc.map((s, i) => (
                <Fragment key={s.id}>
                  {i > 0 && <span aria-hidden className="mx-1">・</span>}
                  <a href={`#${s.id}`} className="underline-offset-4 hover:text-foreground hover:underline">
                    {s.label}
                  </a>
                </Fragment>
              ))}
              <span aria-hidden className="mx-1">・</span>
              <Link href={`/companies/${company.id}/report`} className="underline-offset-4 hover:text-foreground hover:underline">
                分析・レポート
              </Link>
            </p>
          </nav>
        )}
      </div>
    </section>
  );
}
