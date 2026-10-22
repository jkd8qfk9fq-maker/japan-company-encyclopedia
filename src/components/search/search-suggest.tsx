"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import { searchEntries, type SearchEntry, type SearchKind } from "@/lib/search/search";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<SearchKind, string> = { company: "企業", industry: "業界", term: "用語", feature: "特集" };
const MAX = 8;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// One fetch per page load, shared by every field on the page.
let index: Promise<SearchEntry[]> | null = null;
function loadIndex() {
  index ??= fetch(`${BASE_PATH}/search-index.json`)
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      index = null;
      return [];
    });
  return index;
}

/**
 * A search field that suggests as you type (operator request, 2026-10-22): up to eight matches under the field, in
 * the same order as the full results — an exact name or code first, then 50音順. Arrow keys move, Enter opens the
 * highlighted one, Escape closes; without a highlight Enter submits to /search as before.
 *
 * It is still a plain GET form: before the script runs, without JavaScript, or if the index cannot be fetched, it
 * submits to /search exactly as the old field did.
 */
export function SearchSuggest({
  id,
  variant,
  placeholder = "企業名・証券コード・業界・用語で検索",
}: {
  id: string;
  variant: "header" | "hero";
  placeholder?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const suggestions = useMemo(() => (entries ? searchEntries(entries, query).slice(0, MAX) : []), [entries, query]);
  const shown = open && suggestions.length > 0;

  const prepare = () => {
    if (!entries) loadIndex().then(setEntries);
  };
  const go = (entry: SearchEntry) => {
    setOpen(false);
    router.push(entry.href);
  };

  return (
    <form
      action={`${BASE_PATH}/search`}
      role="search"
      className={cn("relative", variant === "hero" && "flex")}
      onSubmit={(e) => {
        if (shown && active >= 0) {
          e.preventDefault();
          go(suggestions[active]);
        }
      }}
    >
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className={cn("relative", variant === "hero" && "min-w-0 flex-1")}>
        <Search
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground",
            variant === "hero" ? "left-4 size-[1.15rem]" : "left-3 size-4",
          )}
        />
        <input
          id={id}
          name="q"
          type="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={shown}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={shown && active >= 0 ? `${listId}-${active}` : undefined}
          value={query}
          placeholder={placeholder}
          onFocus={() => {
            prepare();
            setOpen(true);
          }}
          onBlur={() => {
            // Let a click on a suggestion land before the list closes.
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
            prepare();
          }}
          onKeyDown={(e) => {
            if (!shown) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => (i + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={cn(
            "w-full border border-input bg-card pr-3 outline-offset-2 placeholder:text-muted-foreground",
            variant === "hero" ? "h-14 pl-11 text-base" : "h-11 w-56 pl-9 text-sm lg:w-72",
          )}
        />
        {shown && (
          <ul
            id={listId}
            role="listbox"
            aria-label="候補"
            className={cn(
              "absolute top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-popover text-left shadow-lg",
              variant === "hero" ? "inset-x-0" : "right-0 w-[min(26rem,calc(100vw-2rem))]",
            )}
          >
            {suggestions.map((entry, i) => (
              <li
                key={`${entry.kind}-${entry.id}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  clearTimeout(blurTimer.current);
                  go(entry);
                }}
                onMouseEnter={() => setActive(i)}
                className={cn("flex min-h-11 cursor-pointer items-baseline gap-3 px-3 py-2", i === active && "bg-muted")}
              >
                <span className="w-8 shrink-0 text-[0.6875rem] text-muted-foreground">{KIND_LABEL[entry.kind]}</span>
                <span className="min-w-0">
                  <span className="block truncate font-serif text-[0.9375rem] font-semibold">{entry.title}</span>
                  {entry.subtitle && <span className="block truncate text-xs text-muted-foreground">{entry.subtitle}</span>}
                </span>
              </li>
            ))}
            <li role="presentation" className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              Enterですべての結果を見る
            </li>
          </ul>
        )}
      </div>
      {variant === "hero" && (
        <button type="submit" className="h-14 shrink-0 bg-ink px-7 text-base font-medium text-background hover:opacity-90">
          検索
        </button>
      )}
    </form>
  );
}
