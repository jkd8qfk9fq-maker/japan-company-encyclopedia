import Link from "next/link";
import { SourceList } from "@/components/sources/source-list";
import type { Company, RelatedCompany, RelationshipKind } from "@/types/company";
import type { Source } from "@/types/source";

export const RELATIONSHIP_LABEL: Record<RelationshipKind, string> = {
  "same-industry": "同じ業界",
  competitor: "競合",
  supplier: "仕入先",
  customer: "顧客",
  technology: "技術のつながり",
  "same-business-model": "似たビジネスモデル",
  "business-partner": "取引関係",
  parent: "親会社",
  subsidiary: "子会社",
  affiliate: "関連会社",
  "other-affiliated-company": "その他の関係会社",
};

export type ResolvedRelation = { company: Company; relation: RelatedCompany };

/**
 * The ecosystem around a company, grouped by kind of relationship — not a
 * "competitors" list. Each entry says in one line WHY the companies are
 * related, because a bare label teaches a beginner nothing.
 *
 * `inbound` are ties written in another company's entry. They are listed apart, in that company's words and with
 * that company's sources, because the claim is its filing's, not this company's.
 */
export function RelatedCompanies({
  relations,
  inbound,
  sources,
}: {
  relations: ResolvedRelation[];
  inbound: ResolvedRelation[];
  sources: Source[];
}) {
  const kinds = [...new Set(relations.map((r) => r.relation.relationship))];

  return (
    <div className="space-y-12">
      {kinds.map((kind) => (
        <div key={kind}>
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{RELATIONSHIP_LABEL[kind]}</h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {relations
              .filter((r) => r.relation.relationship === kind)
              .map(({ company, relation }) => (
                <li key={`${kind}-${company.id}`} className="rounded-md border border-border p-5">
                  <Link href={`/companies/${company.id}`} className="group block">
                    <p className="font-serif text-xl font-semibold group-hover:underline">{company.name}</p>
                    <p className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">{relation.description}</p>
                  </Link>
                  <SourceList sources={sources} sourceIds={relation.sourceIds} className="mt-2" />
                </li>
              ))}
          </ul>
        </div>
      ))}

      {inbound.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">ほかの企業の項目に書かれた関係</h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {inbound.map(({ company, relation }) => (
              <li key={`inbound-${company.id}-${relation.relationship}`} className="rounded-md border border-dashed border-border p-5">
                <Link href={`/companies/${company.id}`} className="group block">
                  <p className="font-serif text-xl font-semibold group-hover:underline">{company.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {company.name}から見て「{RELATIONSHIP_LABEL[relation.relationship]}」
                  </p>
                  <p className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">{relation.description}</p>
                </Link>
                <SourceList sources={company.sources} sourceIds={relation.sourceIds} className="mt-2" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
