import Link from "next/link";
import type { CompanySummary } from "@/lib/company-summary";

/**
 * A company in a list: wordmark, name, what it is made of. No figures — a
 * list of revenue numbers is the first step towards a screener.
 */
export function CompanyCard({ company }: { company: CompanySummary }) {
  return (
    <Link
      href={`/companies/${company.id}`}
      className="group flex h-full flex-col border-t border-foreground pt-5 pb-8 transition-colors"
    >
      <p className="figures text-xs text-muted-foreground">{company.code}</p>
      {company.shortNameEn && (
        <p className="wordmark mt-3 text-[2rem] leading-none break-words md:text-[2.5rem]" aria-hidden>
          {company.shortNameEn}
        </p>
      )}
      <p className="mt-2 font-serif text-xl font-semibold group-hover:underline group-hover:underline-offset-4">
        {company.name}
      </p>
      {/* The one-line description (JCE-074): the directory itself reads as content, not only as a list of names.
          Null on a figures-only summary, which the release line keeps out of this page anyway. */}
      {company.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{company.description}</p>}
      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground" aria-label="主な事業">
        {company.businesses.slice(0, 4).map((business) => (
          <li key={business}>{business}</li>
        ))}
      </ul>
    </Link>
  );
}
