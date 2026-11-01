import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STAGE_IMAGES } from "@/assets/industries";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { firstSentence } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";
import type { Industry } from "@/types/industry";

type Category = Industry["categories"][number];

function StageCard({
  category,
  number,
  industry,
  byId,
  dashed,
}: {
  category: Category;
  number?: string;
  industry: Industry;
  byId: Map<string, Company>;
  dashed?: boolean;
}) {
  const image = STAGE_IMAGES[`${industry.id}/${category.id}`];
  const placed = category.companyIds.map((id) => byId.get(id)).filter((c): c is Company => !!c);
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-md border bg-card",
        dashed ? "border-dashed border-muted-foreground" : "border-border",
      )}
    >
      <div className="relative aspect-[3/2] bg-muted">
        {image && (
          <Image src={image} alt="" fill placeholder="blur" sizes="(min-width: 64rem) 18rem, 100vw" className="object-cover" />
        )}
        {number && (
          <span
            aria-hidden
            className="figures absolute top-3 left-3 flex size-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-background shadow"
          >
            {number}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-serif text-lg leading-snug font-semibold">{category.name}</h4>
        <p className="mt-2 text-[0.8125rem] leading-6">
          <RichText text={firstSentence(category.description)} />
        </p>
        <details className="group mt-1">
          <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 text-xs text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
            詳しく
          </summary>
          <p className="text-[0.8125rem] leading-6">
            <RichText text={category.description} />
          </p>
          <SourceList sources={industry.sources} sourceIds={category.sourceIds} />
        </details>
        <div className="mt-auto pt-3">
          {placed.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {placed.map((company) => (
                <li key={company.id}>
                  <Link
                    href={`/companies/${company.id}`}
                    className="inline-flex min-h-8 items-center rounded-full border border-foreground px-3 text-xs hover:bg-foreground hover:text-background"
                  >
                    {company.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">掲載企業はまだありません</p>
          )}
        </div>
      </div>
    </article>
  );
}

/** One of the bands across the top, cut as a chevron like the reference: where in the chain this column is. */
function Zone({ label, sub, tone }: { label: string; sub: string; tone: "light" | "dark" }) {
  return (
    <div
      className={cn(
        "flex min-h-14 flex-col justify-center px-5 py-2 [clip-path:polygon(0_0,calc(100%-1rem)_0,100%_50%,calc(100%-1rem)_100%,0_100%)]",
        tone === "dark" ? "bg-ink text-background" : "bg-ink/15 text-foreground",
      )}
    >
      <span className="text-sm font-semibold tracking-[0.12em]">{label}</span>
      <span className={cn("text-[0.6875rem]", tone === "dark" ? "opacity-80" : "text-muted-foreground")}>{sub}</span>
    </div>
  );
}

/**
 * A researched industry's structure as illustrated cards, after the operator's reference (2026-11-01): a chevron
 * band naming each part, numbered cards with a photograph, the first sentence of the stage's sourced description
 * (the rest folds open with its sources), and the published companies placed there.
 *
 * The bands follow the data, not a template. `stage` categories are the steps, drawn in order and joined by a line;
 * `input` categories (equipment, materials) are what the steps depend on and sit in their own band beside them, joined
 * by a dashed line — not placed before the first step, which would teach an order the sources do not state.
 */
export function ValueChain({ industry, companies }: { industry: Industry; companies: Company[] }) {
  const byId = new Map(companies.map((c) => [c.id, c]));

  // A `segments` industry is the same cards without numbers or arrows: its parts sit side by side, and drawing them
  // as steps would teach an order the sources do not state.
  if (industry.structure !== "chain") {
    return (
      <section aria-label={`${industry.name}業界の事業の分類`}>
        <Zone label="事業の分類" sub={`${industry.categories.length}つの分野に分けて見る`} tone="dark" />
        <ul className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {industry.categories.map((category) => (
            <li key={category.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <StageCard category={category} industry={industry} byId={byId} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const stages = industry.categories.filter((c) => c.role !== "input");
  const inputs = industry.categories.filter((c) => c.role === "input");
  const stageCols = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" }[Math.min(stages.length, 4)] ?? "lg:grid-cols-4";

  return (
    <div className={cn("grid gap-6", inputs.length > 0 && "lg:grid-cols-[minmax(0,1fr)_minmax(0,3.2fr)]")}>
      {inputs.length > 0 && (
        <section aria-label="工程を支える産業" className="order-2 lg:order-1">
          <Zone label="支える産業" sub="工程で使われる装置・材料" tone="light" />
          <ul className="relative mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-1">
            {inputs.map((category, i) => (
              <li key={category.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <StageCard
                  category={category}
                  number={String.fromCharCode(65 + i)}
                  industry={industry}
                  byId={byId}
                  dashed
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label={`${industry.name}ができるまでの流れ`} className="order-1 lg:order-2">
        <Zone label="つくる工程" sub={stages.map((s) => s.name.replace(/（.*?）/, "")).join(" → ")} tone="dark" />
        {/* A phone swipes along the cards (as the chain reads) instead of scrolling past a column of them. */}
        <ol
          className={cn(
            "relative mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0",
            stageCols,
          )}
        >
          {stages.map((category, i) => (
            <li key={category.id} className="relative w-[78%] shrink-0 snap-start sm:w-auto">
              <StageCard category={category} number={String(i + 1).padStart(2, "0")} industry={industry} byId={byId} />
              {i < stages.length - 1 && (
                // The step to the next card: across on a wide screen, down on a phone.
                <span
                  aria-hidden
                  className="absolute top-[calc(33%)] -right-[1.1rem] z-10 hidden size-7 items-center justify-center rounded-full bg-ink text-background shadow lg:flex"
                >
                  <ArrowRight className="size-4" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
