"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useDeferredValue, useState } from "react";
import type { PlacedCompany } from "@/lib/regions";

/** Width-, case- and kana-insensitive: 「ﾄﾖﾀ」「とよた」「トヨタ」 and 「7203」「７２０３」 all match. */
const fold = (text: string) =>
  text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/\s+/g, "");

/**
 * A prefecture's companies, grouped by the municipality of their head office, with a box that narrows them as the
 * reader types (operator request, 2026-11-02: Tokyo's list is too long to scroll). A Client Component for the box
 * only; the groups arrive whole from the server, so the page reads the same before any script runs.
 */
export function PrefectureCompanies({ groups, prefectureName }: { groups: [string, PlacedCompany[]][]; prefectureName: string }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const words = fold(deferred) ? deferred.split(/[\s　]+/).map(fold).filter(Boolean) : [];
  const shown = words.length
    ? groups
        .map(([name, list]) => {
          const hits = list.filter((c) => {
            const haystack = fold(`${c.name} ${c.code} ${name} ${c.industry ?? ""}`);
            return words.every((w) => haystack.includes(w));
          });
          return [name, hits] as [string, PlacedCompany[]];
        })
        .filter(([, list]) => list.length > 0)
    : groups;
  const total = shown.reduce((sum, [, list]) => sum + list.length, 0);

  return (
    <div>
      <div role="search" className="sticky top-[calc(var(--header-height)+0.5rem)] z-10 -mx-1 bg-background/95 px-1 py-2 backdrop-blur">
        <label htmlFor="prefecture-search" className="sr-only">
          {prefectureName}の企業を検索
        </label>
        <div className="flex h-12 items-center gap-2 rounded-md border border-foreground/40 bg-background px-3 focus-within:border-foreground">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            id="prefecture-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${prefectureName}の企業を検索（企業名・証券コード・市区町村・業界）`}
            className="h-full min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="検索語を消す" className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground">
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        {words.length > 0 && (
          <p aria-live="polite" className="mt-1.5 text-xs text-muted-foreground">
            「{deferred.trim()}」に当てはまる企業 <span className="figures">{total}</span>社
          </p>
        )}
      </div>

      {shown.length > 0 ? (
        <div className="mt-6 space-y-10">
          {shown.map(([name, list]) => (
            <section key={name} aria-labelledby={`m-${name}`}>
              <h2 id={`m-${name}`} className="flex items-baseline gap-3 border-b border-foreground pb-1.5">
                <span className="font-serif text-lg font-semibold">{name}</span>
                <span className="figures text-xs text-muted-foreground">{list.length}社</span>
              </h2>
              <ul className="mt-1 grid gap-x-8 sm:grid-cols-2">
                {list.map((company) => (
                  <li key={company.id} className="border-b border-border">
                    <Link href={`/companies/${company.id}`} className="group flex min-h-12 items-baseline gap-3 py-2.5">
                      <span className="figures w-10 shrink-0 text-xs text-muted-foreground">{company.code}</span>
                      <span className="min-w-0">
                        <span className="block font-serif text-[0.9375rem] font-semibold group-hover:underline group-hover:underline-offset-4">
                          {company.name}
                        </span>
                        {company.industry && <span className="block text-xs text-muted-foreground">{company.industry}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">当てはまる企業はありません。言葉を短くするか、証券コードで探してみてください。</p>
      )}
    </div>
  );
}
