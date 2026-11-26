import Link from "next/link";
import { Fragment } from "react";
import { listIndustryPages } from "@/lib/industries";
import { companyRepository, termRepository } from "@/lib/repositories";
import { parseRichText, withoutUnavailableLinks } from "@/lib/rich-text";
import { linkTerms } from "@/lib/term-linking";
import { translationRepository } from "@/lib/repositories";
import { TermReference } from "./term-reference";
import { L } from "@/components/i18n/label";

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
  // JCE-128: an English reference translation, when one passed the checks, is rendered beside the Japanese and the
  // reader's language picks one (the same CSS as the interface). Links inside it point at the same pages.
  const en = await translationRepository.find("en", text);
  if (!en) return <Segments text={text} />;
  return (
    <>
      <span data-l="ja">
        <Segments text={text} />
      </span>
      <span data-l="en">
        <Segments text={en} />
      </span>
    </>
  );
}

async function Segments({ text }: { text: string }) {
  const parsed = parseRichText(text);
  const refs = (kind: string) => parsed.flatMap((s) => (s.type === "reference" && s.kind === kind ? [s.id] : []));
  const [releasedCompanies, industryPages] = await Promise.all([
    refs("company").length > 0 ? companyRepository.getMany(refs("company")) : [],
    refs("industry").length > 0 ? listIndustryPages() : [],
  ]);
  // Glossary words are linked where they occur, as well as where the text marks them (src/lib/term-linking.ts).
  const glossary = await termRepository.list();
  const segments = linkTerms(
    withoutUnavailableLinks(parsed, {
      company: new Set(releasedCompanies.map((c) => c.id)),
      industry: new Set(industryPages.map((i) => i.id)),
    }),
    glossary,
  );
  const terms = new Map(glossary.map((t) => [t.id, t]));

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === "text") return <Fragment key={i}><L s={segment.text} /></Fragment>;
        if (segment.kind === "term") {
          const term = terms.get(segment.id);
          if (!term) return <Fragment key={i}><L s={segment.label} /></Fragment>;
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
            <L s={segment.label} />
          </Link>
        );
      })}
    </>
  );
}
