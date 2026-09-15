import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Fragment } from "react";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import type { Company } from "@/types/company";
import type { Industry } from "@/types/industry";

function Stage({
  category,
  index,
  industry,
  byId,
}: {
  category: Industry["categories"][number];
  index: number;
  industry: Industry;
  byId: Map<string, Company>;
}) {
  const isChain = industry.structure === "chain" && index >= 0;
  const placed = category.companyIds.map((id) => byId.get(id)).filter((c): c is Company => !!c);
  return (
    <div className="grid gap-4 rounded-md border border-border bg-background p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8 md:p-7">
      <div>
        {isChain && (
          <p className="wordmark figures text-2xl text-muted-foreground" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </p>
        )}
        <h3 className="mt-1 font-serif text-xl font-semibold">{category.name}</h3>
        <p className="mt-2 text-[0.9375rem] leading-7">
          <RichText text={category.description} />
        </p>
        <SourceList sources={industry.sources} sourceIds={category.sourceIds} className="mt-2" />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">掲載している企業</p>
        {placed.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {placed.map((company) => (
              <li key={company.id}>
                <Link
                  href={`/companies/${company.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-foreground px-4 text-sm hover:bg-foreground hover:text-background"
                >
                  {company.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">まだ掲載していません。</p>
        )}
      </div>
    </div>
  );
}

/**
 * The industry explained before it is listed.
 *
 * A `chain` industry (semiconductors: 設計 → 製造装置 → 材料 → …) is drawn as
 * a vertical sequence with arrows, because the order IS the explanation. A
 * `segments` industry is drawn as a grid without arrows, because implying a
 * sequence where there is none would teach something false.
 *
 * Each stage lists the published companies placed in it, which is what turns
 * the diagram into a way to explore.
 */
export function IndustryStructure({ industry, companies }: { industry: Industry; companies: Company[] }) {
  const byId = new Map(companies.map((c) => [c.id, c]));
  const isChain = industry.structure === "chain";
  const stages = industry.categories.filter((c) => c.role !== "input");
  const inputs = industry.categories.filter((c) => c.role === "input");

  return isChain ? (
    <div>
      <ol aria-label={`${industry.name}ができるまでの流れ`}>
        {stages.map((category, i) => (
          <Fragment key={category.id}>
            {i > 0 && (
              <li aria-hidden className="flex h-10 items-center justify-center text-muted-foreground">
                <ArrowDown className="size-5" />
              </li>
            )}
            <li>
              <Stage category={category} index={i} industry={industry} byId={byId} />
            </li>
          </Fragment>
        ))}
      </ol>
      {inputs.length > 0 && (
        <section aria-labelledby={`${industry.id}-inputs`} className="mt-14">
          <h3 id={`${industry.id}-inputs`} className="font-serif text-xl font-semibold">
            工程を支える産業
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
            流れの中の一つの段階ではなく、上の工程で使われる装置や材料をつくる産業です。
          </p>
          {/* One column, like the stages: two-up cards left ~10 characters per line. */}
          <ul className="mt-6 space-y-4">
            {inputs.map((category) => (
              <li key={category.id}>
                <Stage category={category} index={-1} industry={industry} byId={byId} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  ) : (
    <ul className="grid gap-4 lg:grid-cols-2">
      {industry.categories.map((category, i) => (
        <li key={category.id}>
          <Stage category={category} index={i} industry={industry} byId={byId} />
        </li>
      ))}
    </ul>
  );
}
