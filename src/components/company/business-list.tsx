import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { firstSentence } from "@/lib/rich-text";
import type { Business } from "@/types/company";
import type { Source } from "@/types/source";
import { SegmentMark, segmentTone, structureBranches } from "./business-structure";

const MAX_ITEMS = 4;

function Items({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="text-xs leading-6">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">
        {items.slice(0, MAX_ITEMS).join(" ・ ")}
        {items.length > MAX_ITEMS && <span className="figures text-muted-foreground"> ほか{items.length - MAX_ITEMS}件</span>}
      </dd>
    </div>
  );
}

function SubBusinesses({ items }: { items: Business[] }) {
  return (
    <ul className="mt-4 space-y-4 border-l border-border pl-4">
      {items.map((child) => (
        <li key={child.id}>
          <p className="font-serif font-semibold">{child.name}</p>
          <p className="mt-1 text-sm leading-7">
            <RichText text={child.description} />
          </p>
          {child.children && child.children.length > 0 && <SubBusinesses items={child.children} />}
        </li>
      ))}
    </ul>
  );
}

/**
 * "何でできている会社か" below the diagram: one card per business, in the diagram's order and colour, after the
 * approved mockup. The card shows the first sentence of the entry's own description and the products it lists;
 * the full description, the sub-businesses and the sources open under "詳しく読む", so nothing is cut — it is only
 * folded. Cards follow the same level the diagram draws (structureBranches), so marks match.
 */
export function BusinessList({ businesses, sources }: { businesses: Business[]; sources: Source[] }) {
  const { via, branches } = structureBranches(businesses);

  return (
    <div>
      {via && (
        <p className="mb-5 text-sm leading-7 text-muted-foreground">
          報告セグメントは「{via.name}」の1つです。下はその中の事業です。
        </p>
      )}
      {/* Four across at most: five or six businesses make two even rows of three rather than four and a straggler. */}
      <ol className={`grid gap-4 sm:grid-cols-2 ${branches.length === 4 ? "lg:grid-cols-4" : branches.length >= 3 ? "lg:grid-cols-3" : ""}`}>
        {branches.map((business, index) => {
          const short = firstSentence(business.description);
          const hasMore = short !== business.description || (business.children?.length ?? 0) > 0;
          return (
            <li key={business.id} className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
              <span aria-hidden className="block h-1.5" style={{ background: segmentTone(index) ?? "var(--border)" }} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-serif text-xl leading-snug font-semibold">{business.name}</h3>
                  <SegmentMark index={index} />
                </div>
                <p className="mt-3 text-sm leading-7">
                  <RichText text={short} />
                </p>
                <dl className="mt-3 space-y-1">
                  <Items label="製品・サービス" items={business.products} />
                  <Items label="顧客" items={business.customers} />
                </dl>
                <div className="mt-auto pt-3">
                  {hasMore && (
                    <details className="group">
                      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
                        <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
                        詳しく読む
                      </summary>
                      <p className="mt-2 text-sm leading-7">
                        <RichText text={business.description} />
                      </p>
                      {business.children && business.children.length > 0 && <SubBusinesses items={business.children} />}
                    </details>
                  )}
                  <SourceList sources={sources} sourceIds={business.sourceIds} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {via && <SourceList sources={sources} sourceIds={via.sourceIds} className="mt-3" />}
    </div>
  );
}
