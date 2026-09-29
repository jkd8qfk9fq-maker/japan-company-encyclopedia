import Link from "next/link";
import { SourceList } from "@/components/sources/source-list";
import { companyRepository } from "@/lib/repositories";
import type { RelatedCompany, RelationshipKind } from "@/types/company";
import type { Source } from "@/types/source";

export const RELATIONSHIP_LABEL: Record<RelationshipKind, string> = {
  "same-industry": "同じ業界",
  competitor: "競合",
  supplier: "仕入先",
  customer: "顧客",
  technology: "技術のつながり",
  "same-business-model": "似たビジネスモデル",
  "business-partner": "取引関係",
};

/**
 * The ecosystem around a company, grouped by kind of relationship — not a
 * "competitors" list. Each entry says in one line WHY the companies are
 * related, because a bare label teaches a beginner nothing.
 */
export async function RelatedCompanies({
  relations,
  sources,
}: {
  relations: RelatedCompany[];
  sources: Source[];
}) {
  const companies = new Map(
    (await companyRepository.getMany(relations.map((r) => r.companyId))).map((c) => [c.id, c]),
  );
  const visible = relations.filter((r) => companies.has(r.companyId));
  const kinds = [...new Set(visible.map((r) => r.relationship))];

  return (
    <div className="space-y-12">
      {kinds.map((kind) => (
        <div key={kind}>
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{RELATIONSHIP_LABEL[kind]}</h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {visible
              .filter((r) => r.relationship === kind)
              .map((relation) => {
                const company = companies.get(relation.companyId)!;
                return (
                  <li key={`${kind}-${relation.companyId}`} className="rounded-md border border-border p-5">
                    <Link href={`/companies/${company.id}`} className="group block">
                      <p className="font-serif text-xl font-semibold group-hover:underline">{company.name}</p>
                      <p className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">{relation.description}</p>
                    </Link>
                    <SourceList sources={sources} sourceIds={relation.sourceIds} className="mt-2" />
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}
