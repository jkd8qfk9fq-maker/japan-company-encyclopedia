import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import type { Business } from "@/types/company";
import type { Source } from "@/types/source";

function Facts({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <dt className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{label}</dt>
      <dd className="mt-1.5">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem] leading-7">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

function SubBusinesses({ items, sources }: { items: Business[]; sources: Source[] }) {
  return (
    <ul className="mt-8 space-y-6 border-l border-border pl-5">
      {items.map((child) => (
        <li key={child.id}>
          <h4 className="font-serif text-lg font-semibold">{child.name}</h4>
          <p className="mt-1 text-[0.9375rem] leading-7">
            <RichText text={child.description} />
          </p>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <Facts label="主な製品・サービス" items={child.products} />
            <Facts label="主な顧客" items={child.customers} />
          </dl>
          {child.children && child.children.length > 0 && (
            <SubBusinesses items={child.children} sources={sources} />
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * "事業" — the 30-second layer: each business, what it does, what it sells and
 * to whom. Numbered in the order of the structure diagram, so the two read as
 * one object at two levels of detail.
 */
export function BusinessList({ businesses, sources }: { businesses: Business[]; sources: Source[] }) {
  return (
    <ol className="divide-y divide-border border-y border-border">
      {businesses.map((business, index) => (
        <li key={business.id} className="grid gap-4 py-10 md:grid-cols-[6rem_1fr] md:gap-8">
          <p className="wordmark figures text-4xl text-muted-foreground md:text-5xl" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </p>
          <div className="max-w-3xl">
            <h3 className="font-serif text-2xl font-semibold">{business.name}</h3>
            <p className="prose-ja mt-3">
              <RichText text={business.description} />
            </p>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <Facts label="主な製品・サービス" items={business.products} />
              <Facts label="主な顧客" items={business.customers} />
            </dl>
            {business.children && business.children.length > 0 && (
              <SubBusinesses items={business.children} sources={sources} />
            )}
            <SourceList sources={sources} sourceIds={business.sourceIds} className="mt-5" />
          </div>
        </li>
      ))}
    </ol>
  );
}
