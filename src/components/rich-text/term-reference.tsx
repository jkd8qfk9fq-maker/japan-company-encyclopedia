"use client";

import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * An inline term: the dictionary appears where the reader needs it, without
 * leaving the sentence. Client only for the popover's open state; the
 * definition itself is rendered on the server and passed in.
 *
 * The word is a span with the button role, not a <button>: reader views and text extractors (Mozilla Readability,
 * behind Firefox and Safari reader mode and many crawlers) delete every <button>, which took the word out of the
 * sentence (D10, 2026-11-17). The keys a button answers to are handled here.
 */
export function TermReference({
  id,
  label,
  term,
  reading,
  description,
}: {
  id: string;
  label: string;
  term: string;
  reading?: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
          }}
          className="cursor-help rounded-sm underline decoration-ink/60 decoration-dotted decoration-[1.5px] underline-offset-[0.3em] outline-offset-2 hover:decoration-solid"
        >
          {label}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-w-[calc(100vw-2rem)] p-5" side="top" align="start">
        <p className="eyebrow">Term</p>
        <p className="mt-2 font-serif text-lg font-semibold leading-snug">{term}</p>
        {reading && <p className="text-xs text-muted-foreground">{reading}</p>}
        <p className="mt-3 text-sm leading-7">{description}</p>
        <Link href={`/terms#${id}`} className="link-ink mt-3 inline-flex min-h-11 items-center text-xs">
          用語集で見る
        </Link>
      </PopoverContent>
    </Popover>
  );
}
