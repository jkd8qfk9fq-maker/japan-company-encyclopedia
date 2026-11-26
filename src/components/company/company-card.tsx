import Link from "next/link";
import type { CompanySummary } from "@/lib/company-summary";
import { CompanyMark } from "./company-mark";
import { T } from "@/components/i18n/t";
import { L } from "@/components/i18n/label";

/**
 * A company in a list: mark, name, code and industry, what it does, what it is made of. No figures — a list of
 * revenue numbers is the first step towards a screener.
 *
 * 2026-11-23 redesign (JCE-099): a dense card, about a third of the old height — the wordmark line and the large
 * serif name gave each company a poster's space, so a phone showed two companies per screen.
 */
export function CompanyCard({ company }: { company: CompanySummary }) {
  const primary = company.industries.find((i) => i.primary) ?? company.industries[0];
  return (
    <Link
      href={`/companies/${company.id}`}
      className="group flex h-full gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/40"
    >
      <CompanyMark name={company.name} className="size-11 text-lg" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold group-hover:underline group-hover:underline-offset-4"><L s={company.name} /></span>
          <span className="figures text-[0.6875rem] text-muted-foreground">
            {company.code}
            {primary ? `・${primary.name}` : ""}
          </span>
        </span>
        {/* The one-line description (JCE-074): the directory itself reads as content, not only as a list of names.
            Null on a figures-only summary, which the release line keeps out of this page anyway. */}
        {company.description && <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">{company.descriptionEn ? <T m={{ ja: company.description, en: company.descriptionEn }} /> : company.description}</span>}
        {company.businesses.length > 0 && (
          <span className="mt-1 block truncate text-[0.6875rem] text-muted-foreground/80">
            <span className="sr-only"><T m={{ ja: "主な事業：", en: "Main businesses:" }} /></span>
            {company.businesses.slice(0, 4).join("・")}
          </span>
        )}
      </span>
    </Link>
  );
}
