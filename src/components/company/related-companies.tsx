import Link from "next/link";
import { SourceList } from "@/components/sources/source-list";
import { firstSentence } from "@/lib/rich-text";
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

function Row({ company, label, description, sources, sourceIds, from }: {
  company: Company;
  label: string;
  description: string;
  sources: Source[];
  sourceIds: string[];
  /** Set for a tie written in another company's entry: the label is in that company's words. */
  from?: string;
}) {
  const short = firstSentence(description);
  return (
    <li className="border-b border-border py-3.5">
      <p className="text-[0.9375rem] leading-7">
        <Link href={`/companies/${company.id}`} className="font-serif font-semibold hover:underline">
          {company.name}
        </Link>
        <span className="ml-2 inline-flex rounded-full border border-border px-2 text-[0.6875rem] leading-5 text-muted-foreground">
          {from ? `${from}から見て「${label}」` : label}
        </span>
      </p>
      <p className="mt-1 text-sm leading-7 text-muted-foreground">{short}</p>
      {short !== description && (
        <details className="group">
          <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 text-xs text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
            続きを読む
          </summary>
          <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        </details>
      )}
      <SourceList sources={sources} sourceIds={sourceIds} />
    </li>
  );
}

/**
 * Every tie, one line each, beside the network diagram (after the approved mockup): the company, the kind of tie,
 * and the first sentence of why — the rest opens in place. Ties written in another company's entry come last, in
 * that company's words and with that company's sources, because the claim is its filing's, not this company's.
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
  return (
    <ul className="border-t border-border">
      {relations.map(({ company, relation }) => (
        <Row
          key={`${relation.relationship}-${company.id}`}
          company={company}
          label={RELATIONSHIP_LABEL[relation.relationship]}
          description={relation.description}
          sources={sources}
          sourceIds={relation.sourceIds}
        />
      ))}
      {inbound.map(({ company, relation }) => (
        <Row
          key={`inbound-${relation.relationship}-${company.id}`}
          company={company}
          label={RELATIONSHIP_LABEL[relation.relationship]}
          description={relation.description}
          sources={company.sources}
          sourceIds={relation.sourceIds}
          from={company.name}
        />
      ))}
    </ul>
  );
}
