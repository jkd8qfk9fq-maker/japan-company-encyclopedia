"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import type { CompanySummary } from "@/lib/company-summary";
import { normalizeForSearch } from "@/lib/search/normalize";
import { cn } from "@/lib/utils";
import type { IndustryId } from "@/types/company";
import { CompanyCard } from "./company-card";

/**
 * /companies: filter by name/code and by industry.
 *
 * Filtering happens in the browser over summaries rendered into the page.
 * At 100–300 companies that is instant and works offline; at "all listed
 * companies" (~4,000) the summaries are still under a few hundred kB, and the
 * repository interface lets this move server-side without changing the UI.
 */
export function CompanyDirectory({
  companies,
  industries,
}: {
  companies: CompanySummary[];
  industries: { id: IndustryId; name: string; count: number }[];
}) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState<IndustryId | null>(null);
  const deferredQuery = useDeferredValue(query);

  const indexed = useMemo(
    () =>
      companies.map((c) => ({
        company: c,
        haystack: normalizeForSearch([c.name, c.nameEn ?? "", c.shortNameEn ?? "", c.code, ...c.businesses].join(" ")),
      })),
    [companies],
  );

  const results = useMemo(() => {
    const q = normalizeForSearch(deferredQuery);
    return indexed
      .filter(({ company, haystack }) => {
        if (industry && !company.industries.some((i) => i.id === industry)) return false;
        return q.length === 0 || haystack.includes(q);
      })
      .map(({ company }) => company);
  }, [indexed, deferredQuery, industry]);

  return (
    <div>
      <div className="flex flex-col gap-6">
        <label className="relative block max-w-xl">
          <span className="sr-only">企業名・証券コードで絞り込む</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="企業名・証券コードで絞り込む"
            className="h-12 w-full rounded-full border border-input bg-background pr-11 pl-11 text-base outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-1.5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
              <span className="sr-only">入力を消す</span>
            </button>
          )}
        </label>

        <div role="group" aria-label="業界で絞り込む" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
          {[{ id: null, name: "すべて", count: companies.length }, ...industries].map((item) => {
            const selected = industry === item.id;
            return (
              <button
                key={item.id ?? "all"}
                type="button"
                aria-pressed={selected}
                onClick={() => setIndustry(item.id)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors",
                  selected ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
                )}
              >
                {item.name}
                <span className={cn("figures text-xs", selected ? "opacity-70" : "text-muted-foreground")}>{item.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="figures mt-10 text-sm text-muted-foreground" aria-live="polite">
        {results.length}社
      </p>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((company) => (
            <li key={company.id}>
              <CompanyCard company={company} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border-t border-foreground py-16">
          <p className="font-serif text-xl font-semibold">該当する企業が見つかりませんでした。</p>
          <p className="mt-3 text-muted-foreground">企業名または証券コードを確認してください。</p>
        </div>
      )}
    </div>
  );
}
