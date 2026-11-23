"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { searchEntries, type SearchEntry, type SearchKind } from "@/lib/search/search";
import { cn } from "@/lib/utils";
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
  // Which kind the list shows (2026-11-23): all, or one kind — a reader looking for a company should not scroll past
  // terms and features to find it, and the counts say what each tab holds.
  const [tab, setTab] = useState<SearchKind | "all">("all");

  useEffect(() => {
    const url = deferred ? `/search?q=${encodeURIComponent(deferred)}` : "/search";
    router.replace(url, { scroll: false });
  }, [deferred, router]);

  const results = useMemo(() => searchEntries(entries, deferred), [entries, deferred]);
  const groups = KIND_ORDER.map((kind) => ({ kind, items: results.filter((r) => r.kind === kind) })).filter(
    (g) => g.items.length > 0,
  );
  // A tab the new query has no results for falls back to all, rather than showing an empty list.
  const shownTab = tab !== "all" && groups.some((g) => g.kind === tab) ? tab : "all";

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} autoFocus />

      <div aria-live="polite" className="mt-4">
        {deferred.trim() === "" ? (
          <p className="text-muted-foreground">
            例：<button type="button" className="link-ink" onClick={() => setQuery("トヨタ")}>トヨタ</button>
            、<button type="button" className="link-ink" onClick={() => setQuery("7974")}>7974</button>
            、<button type="button" className="link-ink" onClick={() => setQuery("自動車")}>自動車</button>
          </p>
        ) : groups.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-4 py-6">
            <p className="text-base font-semibold">「{deferred}」に一致する項目は見つかりませんでした。</p>
            <p className="mt-3 text-muted-foreground">企業名または証券コードを確認してください。</p>
          </div>
        ) : (
          <div>
            <div role="tablist" aria-label="種類" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0">
              {[{ kind: "all" as const, count: results.length }, ...groups.map((g) => ({ kind: g.kind, count: g.items.length }))].map(({ kind, count }) => (
                <button
                  key={kind}
                  type="button"
                  role="tab"
                  aria-selected={shownTab === kind}
                  onClick={() => setTab(kind)}
                  className={cn(
                    "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs transition-colors",
                    shownTab === kind ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground",
                  )}
                >
                  {kind === "all" ? "すべて" : KIND_LABEL[kind]}
                  <span className="figures opacity-70">{count}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-6">
              {groups
                .filter((group) => shownTab === "all" || group.kind === shownTab)
                .map((group) => (
                  <section key={group.kind} aria-labelledby={`results-${group.kind}`}>
                    <h2 id={`results-${group.kind}`} className="seal-mark text-[0.8125rem] font-semibold">
                      {KIND_LABEL[group.kind]}
                      <span className="figures ml-2 text-xs font-normal text-muted-foreground">{group.items.length}件</span>
                    </h2>
                    <ul className="mt-2 grid gap-2">
                      {group.items.map((entry) => (
                        <li key={`${entry.kind}-${entry.id}`}>
                          <Link href={entry.href} className="group block rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:border-foreground/40">
                            <p className="flex flex-wrap items-baseline gap-x-2">
                              <span className="font-semibold group-hover:underline group-hover:underline-offset-4">{entry.title}</span>
                              {entry.meta && <span className="figures text-[0.6875rem] text-muted-foreground">{entry.meta}</span>}
                            </p>
                            {entry.subtitle && <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{entry.subtitle}</p>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
