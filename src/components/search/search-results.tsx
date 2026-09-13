"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { searchEntries, type SearchEntry, type SearchKind } from "@/lib/search/search";
import { SearchInput } from "./search-input";

const KIND_LABEL: Record<SearchKind, string> = {
  company: "企業",
  industry: "業界",
  term: "用語",
  feature: "特集",
};

const KIND_ORDER: SearchKind[] = ["company", "industry", "term", "feature"];

/**
 * Instant search. The query is mirrored into ?q= (replace, not push) so a
 * result list can be shared or returned to with the back button, without
 * every keystroke becoming a history entry.
 */
export function SearchResults({ entries }: { entries: SearchEntry[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const deferred = useDeferredValue(query);

  useEffect(() => {
    const url = deferred ? `/search?q=${encodeURIComponent(deferred)}` : "/search";
    router.replace(url, { scroll: false });
  }, [deferred, router]);

  const results = useMemo(() => searchEntries(entries, deferred), [entries, deferred]);
  const groups = KIND_ORDER.map((kind) => ({ kind, items: results.filter((r) => r.kind === kind) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} autoFocus />

      <div aria-live="polite" className="mt-12">
        {deferred.trim() === "" ? (
          <p className="text-muted-foreground">
            例：<button type="button" className="link-ink" onClick={() => setQuery("トヨタ")}>トヨタ</button>
            、<button type="button" className="link-ink" onClick={() => setQuery("7974")}>7974</button>
            、<button type="button" className="link-ink" onClick={() => setQuery("自動車")}>自動車</button>
          </p>
        ) : groups.length === 0 ? (
          <div className="border-t border-foreground py-12">
            <p className="font-serif text-xl font-semibold">「{deferred}」に一致する項目は見つかりませんでした。</p>
            <p className="mt-3 text-muted-foreground">企業名または証券コードを確認してください。</p>
          </div>
        ) : (
          <div className="space-y-12">
            <p className="figures text-sm text-muted-foreground">{results.length}件</p>
            {groups.map((group) => (
              <section key={group.kind} aria-labelledby={`results-${group.kind}`}>
                <h2 id={`results-${group.kind}`} className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">
                  {KIND_LABEL[group.kind]}
                </h2>
                <ul className="mt-3 border-t border-foreground">
                  {group.items.map((entry) => (
                    <li key={`${entry.kind}-${entry.id}`} className="border-b border-border">
                      <Link href={entry.href} className="group block py-5">
                        <p className="font-serif text-xl font-semibold group-hover:underline group-hover:underline-offset-4">
                          {entry.title}
                        </p>
                        {entry.subtitle && (
                          <p className="mt-1 line-clamp-2 text-[0.9375rem] leading-7 text-muted-foreground">{entry.subtitle}</p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
