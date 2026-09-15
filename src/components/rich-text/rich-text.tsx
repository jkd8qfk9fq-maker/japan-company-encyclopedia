import Link from "next/link";
import { Fragment } from "react";
import { termRepository } from "@/lib/repositories";
import { parseRichText } from "@/lib/rich-text";
import { TermReference } from "./term-reference";

const HREF = {
  company: (id: string) => `/companies/${id}`,
  industry: (id: string) => `/industries/${id}`,
  feature: (id: string) => `/features/${id}`,
} as const;

/**
 * Renders rich text (see src/lib/rich-text.ts). A reference whose target does
 * not exist renders as its plain label — the data integrity suite is what
 * prevents that, so the renderer only has to not break.
 */
export async function RichText({ text }: { text: string }) {
  const segments = parseRichText(text);
  const termIds = segments.flatMap((s) => (s.type === "reference" && s.kind === "term" ? [s.id] : []));
  const terms = new Map((await termRepository.getMany(termIds)).map((t) => [t.id, t]));

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === "text") return <Fragment key={i}>{segment.text}</Fragment>;
        if (segment.kind === "term") {
          const term = terms.get(segment.id);
          if (!term) return <Fragment key={i}>{segment.label}</Fragment>;
          return (
            <TermReference
              key={i}
              id={term.id}
              label={segment.label}
              term={term.term}
              reading={term.reading}
              description={term.description}
            />
          );
        }
        return (
          <Link key={i} href={HREF[segment.kind](segment.id)} className="link-ink">
            {segment.label}
          </Link>
        );
      })}
    </>
  );
}
