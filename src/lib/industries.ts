import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository, industryRepository } from "@/lib/repositories";
import { INDUSTRY_IDS, type IndustryId } from "@/types/company";

export type IndustryListing = {
  id: IndustryId;
  name: string;
  nameEn: string;
  companyCount: number;
  researched: boolean;
};

/**
 * The industries that have a page: those with at least one published company
 * or a researched explanation. An industry with neither would be an empty
 * page, so it has no route at all (and returns 404).
 */
export async function listIndustryPages(): Promise<IndustryListing[]> {
  const [companies, researched] = await Promise.all([companyRepository.list(), industryRepository.list()]);
  const researchedIds = new Set(researched.map((i) => i.id));
  return INDUSTRY_IDS.map((id) => ({
    id,
    ...INDUSTRY_LABELS[id],
    companyCount: companies.filter((c) => c.industries.some((r) => r.industryId === id)).length,
    researched: researchedIds.has(id),
  })).filter((i) => i.companyCount > 0 || i.researched);
}
