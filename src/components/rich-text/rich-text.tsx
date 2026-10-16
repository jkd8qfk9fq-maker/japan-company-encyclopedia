import Link from "next/link";
import { Fragment } from "react";
import { listIndustryPages } from "@/lib/industries";
import { companyRepository, termRepository } from "@/lib/repositories";
import { parseRichText, withoutUnavailableLinks } from "@/lib/rich-text";
import { TermReference } from "./term-reference";

const HREF = {
  company: (id: string) => `/companies/${id}`,
  industry: (id: string) => `/industries/${id}`,
  feature: (id: string) => `/features/${id}`,
} as const;

/**
 * Renders rich text (see src/lib/rich-text.ts). A reference whose target does
 * not exist renders as its plain label. The integrity suite only proves a company
 * is registered, not that it is released, so a link to a company without a public
 * page (or an industry without one) is also left as plain text: no reader is sent to a 404.
 */
export async function RichText({ text }: { text: string }) {
  const parsed = parseRichText(text);
  const refs = (kind: string) => parsed.flatMap((s) => (s.type === "reference" && s.kind === kind ? [s.id] : []));
  const [releasedCompanies, industryPages] = await Promise.all([
    refs("company").length > 0 ? companyRepository.getMany(refs("company")) : [],
    refs("industry").length > 0 ? listIndustryPages() : [],
  ]);
  const segments = withoutUnavailableLinks(parsed, {
    company: new Set(releasedCompanies.map((c) => c.id)),
    industry: new Set(industryPages.map((i) => i.id)),
  });
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
