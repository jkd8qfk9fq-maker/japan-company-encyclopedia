import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository, termRepository } from "@/lib/repositories";
import { formatDateJa } from "@/lib/utils/format";
import type { Feature } from "@/types/feature";

/**
 * The editorial register: larger type, a narrower measure, more air. Still
 * the same system — a feature's sentences link into companies, industries and
 * terms, and every factual paragraph can show its sources.
 */
export async function FeatureArticle({ feature }: { feature: Feature }) {
  const [companies, terms] = await Promise.all([
    companyRepository.getMany(feature.relatedCompanies),
    termRepository.getMany(feature.relatedTerms),
  ]);
  const callouts = new Map(
    (await companyRepository.getMany(
      feature.body.flatMap((b) => (b.type === "company-callout" ? [b.companyId] : [])),
    )).map((c) => [c.id, c]),
  );

  return (
    <article>
      <header className="bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-5 pt-16 pb-16 md:px-8 md:pt-28 md:pb-24">
          <p className="eyebrow !text-background/60">Feature</p>
          <h1 className="mt-6 font-serif text-[2.25rem] leading-[1.4] font-semibold md:text-[3.75rem]">{feature.title}</h1>
          {feature.subtitle && <p className="mt-8 max-w-2xl text-lg leading-[1.9] text-background/80 md:text-xl">{feature.subtitle}</p>}
          <p className="figures mt-10 text-sm text-background/60">{formatDateJa(feature.publishedAt)}</p>
        </div>
      </header>

      {feature.heroImage && (
        <div className="relative mx-auto aspect-[16/9] max-w-6xl">
          <Image src={feature.heroImage} alt={feature.heroImageAlt ?? ""} fill className="object-cover" sizes="(min-width: 1152px) 1152px, 100vw" priority />
        </div>
      )}

      <div className="mx-auto max-w-[42rem] px-5 py-16 md:px-0 md:py-24">
        {feature.body.map((block, i) => {
          switch (block.type) {
            case "heading":
              return (
                <h2 key={i} className="mt-16 mb-6 font-serif text-[1.625rem] font-semibold first:mt-0 md:text-[2rem]">
                  {block.text}
                </h2>
              );
            case "paragraph":
              return (
                <div key={i} className="mb-8">
                  <p className="text-[1.125rem] leading-[2.05] tracking-[0.02em]">
                    <RichText text={block.text} />
                  </p>
                  {block.sourceIds && <SourceList sources={feature.sources} sourceIds={block.sourceIds} className="mt-1" />}
                </div>
              );
            case "quote":
              return (
                <figure key={i} className="my-14 border-l-2 border-foreground pl-6">
                  <blockquote className="font-serif text-[1.375rem] leading-[1.8] font-semibold md:text-[1.625rem]">
                    <RichText text={block.text} />
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">{block.attribution}</figcaption>
                  <SourceList sources={feature.sources} sourceIds={block.sourceIds} className="mt-1" />
                </figure>
              );
            case "company-callout": {
              const company = callouts.get(block.companyId);
              if (!company) return null;
              return (
                <Link
                  key={i}
                  href={`/companies/${company.id}`}
                  className="group my-12 block rounded-md bg-paper p-6 md:p-8"
                >
                  {company.shortNameEn && <p className="wordmark text-3xl" aria-hidden>{company.shortNameEn}</p>}
                  <p className="mt-1 font-serif text-xl font-semibold group-hover:underline">{company.name}</p>
                  <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">{block.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm">
                    企業ページを見る <ArrowRight className="size-4" aria-hidden />
                  </span>
                </Link>
              );
            }
          }
        })}

        <AdSlot placement="feature-inline" />

        <SourceList sources={feature.sources} className="mt-16 border-t border-border pt-4" />
      </div>

      {(companies.length > 0 || feature.relatedIndustries.length > 0 || terms.length > 0) && (
        <aside aria-labelledby="feature-explore" className="bg-paper py-16">
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <h2 id="feature-explore" className="eyebrow">Explore</h2>
            <div className="mt-8 grid gap-10 md:grid-cols-3">
              {companies.length > 0 && (
                <div>
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">この特集の企業</p>
                  <ul className="mt-3 space-y-2">
                    {companies.map((c) => (
                      <li key={c.id}><Link href={`/companies/${c.id}`} className="link-ink">{c.name}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
              {feature.relatedIndustries.length > 0 && (
                <div>
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">業界</p>
                  <ul className="mt-3 space-y-2">
                    {feature.relatedIndustries.map((id) => (
                      <li key={id}><Link href={`/industries/${id}`} className="link-ink">{INDUSTRY_LABELS[id].name}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
              {terms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">用語</p>
                  <ul className="mt-3 space-y-2">
                    {terms.map((t) => (
                      <li key={t.id}><Link href={`/terms#${t.id}`} className="link-ink">{t.term}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </article>
  );
}
