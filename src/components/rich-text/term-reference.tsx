"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * An inline term: the dictionary appears where the reader needs it, without
 * leaving the sentence. Client only for the popover's open state; the
 * definition itself is rendered on the server and passed in.
 */
export function TermReference({
  label,
  term,
  reading,
  description,
}: {
  label: string;
  term: string;
  reading?: string;
  description: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-help rounded-sm underline decoration-ink/60 decoration-dotted decoration-[1.5px] underline-offset-[0.3em] hover:decoration-solid"
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-w-[calc(100vw-2rem)] p-5" side="top" align="start">
        <p className="eyebrow">Term</p>
        <p className="mt-2 font-serif text-lg font-semibold leading-snug">{term}</p>
        {reading && <p className="text-xs text-muted-foreground">{reading}</p>}
        <p className="mt-3 text-sm leading-7">{description}</p>
        <Link href="/terms" className="link-ink mt-3 inline-flex min-h-8 items-center text-xs">
          用語一覧
        </Link>
      </PopoverContent>
    </Popover>
  );
}
