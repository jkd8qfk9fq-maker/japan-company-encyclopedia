"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

export function SearchInput({
  value,
  onChange,
  autoFocus = false,
}: {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on desktop only: on a phone, auto-focus throws a keyboard over the page uninvited.
    if (autoFocus && window.matchMedia("(pointer: fine)").matches) ref.current?.focus();
  }, [autoFocus]);

  return (
    <div role="search" className="relative">
      <label htmlFor="site-search" className="sr-only">
        企業名・証券コード・業界・用語で検索
      </label>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        id="site-search"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="企業名・証券コード・業界・用語"
        className="h-14 w-full rounded-full border border-input bg-background pr-14 pl-14 text-lg outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            ref.current?.focus();
          }}
          className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" aria-hidden />
          <span className="sr-only">入力を消す</span>
        </button>
      )}
    </div>
  );
}
