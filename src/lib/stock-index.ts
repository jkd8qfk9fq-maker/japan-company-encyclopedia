import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company, IndustryId, RelationshipKind } from "@/types/company";
import type { StockIndex } from "@/types/stock-index";

export type IndexMember = { code: string; name: string; company: Company | null };

export type IndexMap = {
  /** Constituents grouped by the primary industry of their page; those without a page are grouped last. */
  groups: { industryId: IndustryId | null; name: string; members: IndexMember[] }[];
  /** Ties between two constituents, as one of their entries states them. */
  ties: { from: Company; to: Company; kind: RelationshipKind }[];
  covered: number;
};

/**
 * An index's constituents laid over the encyclopedia: which have a page, where each sits by industry, and which are
 * tied to each other. Matching is by 証券コード only — a name can be written many ways, a code cannot. A constituent
 * without a page is listed under the provider's own name and nothing more is said about it.
 */
export function mapIndex(index: StockIndex, companies: Company[]): IndexMap {
  const byCode = new Map(companies.map((c) => [c.code, c]));
  const members: IndexMember[] = index.constituents.map((c) => ({ ...c, company: byCode.get(c.code) ?? null }));

  const groups = new Map<IndustryId | null, IndexMember[]>();
  for (const member of members) {
    const ref = member.company?.industries.find((i) => i.primary) ?? member.company?.industries[0];
    const key = ref?.industryId ?? null;
    groups.set(key, [...(groups.get(key) ?? []), member]);
  }

  const inIndex = new Map(members.flatMap((m) => (m.company ? [[m.company.id, m.company] as const] : [])));
  const ties = [...inIndex.values()].flatMap((company) =>
    company.relatedCompanies
      .filter((r) => inIndex.has(r.companyId) && r.companyId !== company.id)
      .map((r) => ({ from: company, to: inIndex.get(r.companyId)!, kind: r.relationship })),
  );

  return {
    groups: [...groups.entries()]
      .map(([industryId, list]) => ({
        industryId,
        name: industryId ? INDUSTRY_LABELS[industryId].name : "この百科事典に未掲載",
        members: list,
      }))
      .sort((a, b) => (a.industryId === null ? 1 : b.industryId === null ? -1 : b.members.length - a.members.length)),
    ties,
    covered: inIndex.size,
  };
}
