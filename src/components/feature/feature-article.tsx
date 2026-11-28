import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ListOrdered } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { featureSections, leadBarValue, readingMinutes } from "@/lib/feature-meta";
import { companyRepository, termRepository } from "@/lib/repositories";
import { formatDateJa } from "@/lib/utils/format";
import type { Feature, FeatureBlock } from "@/types/feature";
import { FEATURE_IMAGES } from "@/assets/features";
import { accentFor, FeatureCard } from "./feature-card";
import { ReadingProgress } from "./reading-progress";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

/**
 * A feature, laid out answer-first (JCE-111). Data-led sites that hold readers put the finding before the
 * argument: the headline figures and 「この特集のポイント」 come first, the sections are listed and linkable
 * (a sticky table of contents on wide screens, a sticky row of chips on phones — JCE-150), and a table of
 * numbers is shown as bars with the printed value beside each — the bar only draws the value, it carries no
 * figure of its own, and the largest bars are drawn in the data blue so the ranking reads by colour too.
 * Long tables show their first rows and fold the rest, so the page does not become a scroll through a list.
 * Everything here is still the same data: the blocks, figures and takeaways come from feature-articles.ts.
 */

const VISIBLE_ROWS = 8;

type TableRow = Extract<FeatureBlock, { type: "data-table" }>["rows"][number];

function BarRow({ row, max, hasBars, lead, rest }: { row: TableRow; max: number; hasBars: boolean; lead: boolean; rest: string[] }) {
  // Name and value on one line, the bar full width beneath: on a phone a bar squeezed between the two was a few
  // pixels wide and could not be compared. The lead rows — the table's largest bars — are drawn in the data
  // blue and the rest in grey (JCE-150), so the ranking reads by colour as well as by length.
  return (
    <li className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 text-[0.9375rem] leading-snug font-medium">
          {row.href ? <Link href={row.href} className="link-ink"><L s={row.label} /></Link> : row.label}
        </span>
        <span className="figures shrink-0 text-right text-[1rem] font-semibold whitespace-nowrap">{row.values[0]}</span>
      </div>
      {hasBars && (
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className={`h-full rounded-full ${lead ? "bg-ink" : "bg-foreground/30"}`} style={{ width: `${(Math.abs(row.bar!) / max) * 100}%` }} />
        </div>
      )}
      {row.values.length > 1 && (
        <p className="figures mt-1 text-right text-xs text-muted-foreground">
          {row.values.slice(1).map((v, j) => `${rest[j] ?? ""} ${v}`.trim()).join("　")}
        </p>
      )}
    </li>
  );
}

function BarTable({ block }: { block: Extract<FeatureBlock, { type: "data-table" }> }) {
  const lead = leadBarValue(block.rows);
  const hasBars = lead !== null;
  const max = lead ?? 0;
  const [primary, ...rest] = block.columns;

  const head = block.rows.slice(0, VISIBLE_ROWS);
  const tail = block.rows.slice(VISIBLE_ROWS);
  return (
    <figure className="my-10 rounded-xl border border-border bg-card p-5 md:p-6">
      {block.title && <figcaption className="font-serif text-lg leading-snug font-semibold"><L s={block.title} /></figcaption>}
      <p className="mt-1 text-xs text-muted-foreground">{hasBars ? `棒の長さは「${primary}」` : primary}</p>
      <ol className="mt-3 divide-y divide-border/70">
        {head.map((row) => <BarRow key={row.label} row={row} max={max} hasBars={hasBars} lead={hasBars && Math.abs(row.bar!) === lead} rest={rest} />)}
      </ol>
      {tail.length > 0 && (
        <details className="group">
          <summary className="mt-2 flex min-h-11 cursor-pointer list-none items-center justify-center rounded-md border border-border text-sm font-medium hover:bg-muted [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden"><span data-l="ja">残り{tail.length}件を表示</span><span data-l="en">Show remaining {tail.length}</span></span>
            <span className="hidden group-open:inline"><T m={{ ja: "閉じる", en: "Close" }} /></span>
          </summary>
          <ol className="divide-y divide-border/70">
            {tail.map((row) => <BarRow key={row.label} row={row} max={max} hasBars={hasBars} lead={hasBars && Math.abs(row.bar!) === lead} rest={rest} />)}
          </ol>
        </details>
      )}
      <p className="mt-4 border-t border-border pt-3 text-xs leading-6 text-muted-foreground"><L s={block.note} /></p>
    </figure>
  );
}

export async function FeatureArticle({ feature, others = [] }: { feature: Feature; others?: Feature[] }) {
  const [companies, terms] = await Promise.all([
    companyRepository.getMany(feature.relatedCompanies),
    termRepository.getMany(feature.relatedTerms),
  ]);
  const callouts = new Map(
    (await companyRepository.getMany(
      feature.body.flatMap((b) => (b.type === "company-callout" ? [b.companyId] : [])),
    )).map((c) => [c.id, c]),
  );
  const sections = featureSections(feature);
  const minutes = readingMinutes(feature);
  const ownIndex = Math.max(0, [feature, ...others].findIndex((f) => f.id === feature.id));
  const photo = FEATURE_IMAGES[feature.id];
  // Each heading block's number, by its position in the body (the same order featureSections uses).
  const headingNumber = new Map(feature.body.flatMap((b, i) => (b.type === "heading" ? [i] : [])).map((bodyIndex, n) => [bodyIndex, n + 1]));

  const toc = (
    <ol className="space-y-1 text-sm">
      {feature.takeaways && feature.takeaways.length > 0 && (
        <li><a href="#points" className="block rounded-md px-2 py-1.5 hover:bg-muted"><T m={{ ja: "この特集のポイント", en: "Key points of this feature" }} /></a></li>
      )}
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="flex gap-2 rounded-md px-2 py-1.5 leading-snug hover:bg-muted">
            <span className="figures text-muted-foreground">{String(s.index).padStart(2, "0")}</span>
            <span><L s={s.title} /></span>
          </a>
        </li>
      ))}
      <li><a href="#feature-sources" className="block rounded-md px-2 py-1.5 hover:bg-muted"><T m={{ ja: "出典", en: "Sources" }} /></a></li>
    </ol>
  );

  return (
    <article>
      <ReadingProgress targetId="feature-body" />
      <header className={`relative isolate overflow-hidden text-white ${photo ? "bg-navy" : accentFor(ownIndex)}`}>
        {photo && (
          <>
            <Image src={photo} alt="" fill priority placeholder="blur" sizes="100vw" className="-z-10 object-cover opacity-60" />
            {/* Navy over the photograph, heaviest where the title is, so the words read on any picture. */}
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
          </>
        )}
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-20 md:px-8 md:pt-14 md:pb-28">
          <nav aria-label="パンくず" className="text-xs text-white/70">
            <Link href="/features" className="hover:underline"><T m={{ ja: "特集", en: "Features" }} /></Link>
            {feature.topic && <> ／ <span>{feature.topic}</span></>}
          </nav>
          <h1 className="mt-4 max-w-4xl font-serif text-[1.875rem] leading-[1.35] font-semibold md:text-[3rem]"><L s={feature.title} /></h1>
          {feature.subtitle && <p className="mt-5 max-w-3xl text-[1.0625rem] leading-[1.9] text-white/85 md:text-lg"><L s={feature.subtitle} /></p>}
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
            <span className="inline-flex items-center gap-1"><span data-l="ja"><Clock className="size-3.5" aria-hidden />約{minutes}分で読めます</span><span data-l="en"><Clock className="size-3.5" aria-hidden />About {minutes} min read</span></span>
            <span className="figures"><F s={formatDateJa(feature.publishedAt)} /></span>
            <span><T m={{ ja: "出典：有価証券報告書（EDINET）", en: "Sources: annual securities reports (EDINET)" }} /></span>
          </p>
        </div>
      </header>

      {feature.keyFigures && feature.keyFigures.length > 0 && (
        <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-5 md:-mt-16 md:px-8">
          <ul className="grid gap-3 sm:grid-cols-3">
            {feature.keyFigures.map((k) => (
              <li key={k.label} className="rounded-xl border border-border bg-card p-5 shadow-sm md:p-6">
                <p className="figures text-[2rem] leading-none font-semibold md:text-[2.5rem]"><F s={k.value} /></p>
                <p className="mt-2 text-sm leading-snug text-muted-foreground"><L s={k.label} /></p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feature.heroImage && (
        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-6xl">
          <Image src={feature.heroImage} alt={feature.heroImageAlt ?? ""} fill className="object-cover" sizes="(min-width: 1152px) 1152px, 100vw" priority />
        </div>
      )}

      <div id="feature-body" className="mx-auto grid max-w-6xl gap-10 px-5 pt-10 pb-16 md:px-8 lg:grid-cols-[15rem_minmax(0,42rem)] lg:justify-between lg:pt-14">
        <aside className="hidden lg:block" aria-label="目次">
          <div className="sticky top-24">
            <p className="flex items-center gap-1.5 px-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground">
              <span data-l="ja"><ListOrdered className="size-3.5" aria-hidden /> 目次
            </span><span data-l="en"><ListOrdered className="size-3.5" aria-hidden /> contents</span></p>
            <div className="mt-2">{toc}</div>
          </div>
        </aside>

        <div className="min-w-0">
          {feature.takeaways && feature.takeaways.length > 0 && (
            <section id="points" aria-labelledby="points-title" className="scroll-mt-24 rounded-xl border-l-4 border-seal bg-paper p-5 md:p-7">
              <h2 id="points-title" className="text-sm font-semibold tracking-[0.12em] text-seal"><T m={{ ja: "この特集のポイント", en: "Key points of this feature" }} /></h2>
              <ol className="mt-3 space-y-3">
                {feature.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-3 text-[1rem] leading-[1.85]">
                    <span className="figures mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-seal text-xs font-semibold text-white">{i + 1}</span>
                    <span><RichText text={t} /></span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {sections.length > 0 && (
            // On phones the table of contents is a sticky row of chips (JCE-150): it stays under the header
            // while reading, so where you are and what is left are always one tap away. Anchor links only —
            // the wide-screen sticky list beside the article remains the full contents.
            <nav aria-label="目次" className="sticky top-[calc(var(--header-height)+0.5rem)] z-20 mt-6 overflow-x-auto rounded-full border border-border bg-background/95 px-2 py-2 shadow-sm backdrop-blur [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
              <ul className="flex gap-1.5">
                {feature.takeaways && feature.takeaways.length > 0 && (
                  <li className="shrink-0">
                    <a href="#points" className="flex min-h-9 items-center rounded-full px-3 text-[0.8125rem] font-medium whitespace-nowrap hover:bg-muted"><T m={{ ja: "ポイント", en: "Key points" }} /></a>
                  </li>
                )}
                {sections.map((s) => (
                  <li key={s.id} className="shrink-0">
                    <a href={`#${s.id}`} className="flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium whitespace-nowrap hover:bg-muted">
                      <span className="figures text-muted-foreground">{String(s.index).padStart(2, "0")}</span>
                      <L s={s.title} />
                    </a>
                  </li>
                ))}
                <li className="shrink-0">
                  <a href="#feature-sources" className="flex min-h-9 items-center rounded-full px-3 text-[0.8125rem] font-medium whitespace-nowrap hover:bg-muted"><T m={{ ja: "出典", en: "Sources" }} /></a>
                </li>
              </ul>
            </nav>
          )}

          <div className="mt-10">
            {feature.body.map((block, i) => {
              switch (block.type) {
                case "heading": {
                  const headingIndex = headingNumber.get(i)!;
                  return (
                    <h2 key={i} id={`section-${headingIndex}`} className="mt-14 mb-5 scroll-mt-24 border-t border-foreground pt-5 font-serif text-[1.5rem] leading-snug font-semibold first:mt-0 md:text-[1.875rem]">
                      <span className="figures mb-1 block text-sm font-normal text-muted-foreground">{String(headingIndex).padStart(2, "0")}</span>
                      <L s={block.text} />
                    </h2>
                  );
                }
                case "paragraph":
                  return (
                    <div key={i} className="mb-7">
                      <p className="text-[1.0625rem] leading-[2] tracking-[0.02em] md:text-[1.125rem]">
                        <RichText text={block.text} />
                      </p>
                      {block.sourceIds && <SourceList sources={feature.sources} sourceIds={block.sourceIds} className="mt-1" />}
                    </div>
                  );
                case "quote":
                  return (
                    <figure key={i} className="my-12 border-l-4 border-navy pl-6">
                      <blockquote className="font-serif text-[1.375rem] leading-[1.8] font-semibold md:text-[1.625rem]">
                        <RichText text={block.text} />
                      </blockquote>
                      <figcaption className="mt-4 text-sm text-muted-foreground">{block.attribution}</figcaption>
                      <SourceList sources={feature.sources} sourceIds={block.sourceIds} className="mt-1" />
                    </figure>
                  );
                case "data-table":
                  return <BarTable key={i} block={block} />;
                case "company-callout": {
                  const company = callouts.get(block.companyId);
                  if (!company) return null;
                  return (
                    <Link key={i} href={`/companies/${company.id}`} className="group my-10 block rounded-xl border border-border bg-paper p-6 transition-shadow hover:shadow-md md:p-8">
                      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground"><T m={{ ja: "この特集の企業", en: "Companies in this feature" }} /></p>
                      {company.shortNameEn && <p className="wordmark mt-2 text-3xl" aria-hidden>{company.shortNameEn}</p>}
                      <p className="mt-1 font-serif text-xl font-semibold group-hover:underline"><L s={company.name} /></p>
                      <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground"><L s={block.text} /></p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                        <span data-l="ja">企業ページを見る <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span><span data-l="en">View company page <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
                      </span>
                    </Link>
                  );
                }
              }
            })}
          </div>

          <AdSlot placement="feature-inline" />

          <div id="feature-sources" className="scroll-mt-24">
            <SourceList sources={feature.sources} className="mt-12 border-t border-border pt-4" />
          </div>

          {(companies.length > 0 || feature.relatedIndustries.length > 0 || terms.length > 0) && (
            <aside aria-labelledby="feature-explore" className="mt-12 rounded-xl bg-paper p-5 md:p-7">
              <h2 id="feature-explore" className="font-serif text-lg font-semibold"><T m={{ ja: "この特集から調べる", en: "Explore from this feature" }} /></h2>
              {companies.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground"><T m={{ ja: "企業", en: "Companies" }} /></p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {companies.map((c) => (
                      <li key={c.id}><Link href={`/companies/${c.id}`} className="inline-flex min-h-9 items-center rounded-full border border-border bg-card px-3 text-sm hover:border-foreground"><L s={c.name} /></Link></li>
                    ))}
                  </ul>
                </div>
              )}
              {feature.relatedIndustries.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground"><T m={{ ja: "業界", en: "Industry" }} /></p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {feature.relatedIndustries.map((id) => (
                      <li key={id}><Link href={`/industries/${id}`} className="inline-flex min-h-9 items-center rounded-full border border-border bg-card px-3 text-sm hover:border-foreground"><T m={{ ja: INDUSTRY_LABELS[id].name, en: INDUSTRY_LABELS[id].nameEn }} /></Link></li>
                    ))}
                  </ul>
                </div>
              )}
              {terms.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground"><T m={{ ja: "用語", en: "Terms" }} /></p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {terms.map((t) => (
                      <li key={t.id}><Link href={`/terms#${t.id}`} className="inline-flex min-h-9 items-center rounded-full border border-border bg-card px-3 text-sm hover:border-foreground">{t.term}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="next-features" className="border-t border-border bg-paper py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 id="next-features" className="font-serif text-xl font-semibold md:text-2xl"><T m={{ ja: "次に読む特集", en: "Next features to read" }} /></h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((f) => (
                <li key={f.id}><FeatureCard feature={f} index={[feature, ...others].findIndex((x) => x.id === f.id)} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
