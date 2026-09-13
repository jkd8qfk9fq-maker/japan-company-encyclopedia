import type { Metadata } from "next";
import Link from "next/link";
import { SourceList } from "@/components/sources/source-list";
import { termRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "用語集",
  description: "企業や業界を理解するために必要な言葉だけを集めた用語集。",
  alternates: { canonical: "/terms" },
};

/**
 * The glossary. Terms mostly appear inline, where the reader meets them; this
 * page exists so every term also has a stable, linkable home (/terms#id).
 */
export default async function TermsPage() {
  const terms = await termRepository.list();
  const byId = new Map(terms.map((t) => [t.id, t]));

  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>Terms</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[3rem]">用語集</h1>
      <p className="prose-ja mt-4 text-muted-foreground">
        企業と業界を理解するために必要な言葉だけを集めています。本文中の点線の言葉を押すと、その場で意味を確認できます。
      </p>

      {terms.length === 0 ? (
        <p className="mt-12 border-t border-foreground pt-8 text-muted-foreground">用語はまだ掲載していません。</p>
      ) : (
        <dl className="mt-12 border-t border-foreground">
          {terms.map((term) => (
            <div key={term.id} id={term.id} className="scroll-mt-24 border-b border-border py-8">
              <dt>
                <span className="font-serif text-2xl font-semibold">{term.term}</span>
                {term.reading && <span className="ml-3 text-sm text-muted-foreground">{term.reading}</span>}
              </dt>
              <dd className="mt-3">
                <p className="prose-ja">{term.description}</p>
                {term.relatedTermIds && term.relatedTermIds.length > 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    関連：
                    {term.relatedTermIds.map((id, i) => (
                      <span key={id}>
                        {i > 0 && "、"}
                        <Link href={`#${id}`} className="link-ink">{byId.get(id)?.term ?? id}</Link>
                      </span>
                    ))}
                  </p>
                )}
                <SourceList sources={term.sources} className="mt-2" />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
