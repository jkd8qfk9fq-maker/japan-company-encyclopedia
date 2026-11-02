import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { PREFECTURES, prefectureByName, type Prefecture } from "@/lib/prefectures";
import { companyRepository, headquartersRepository } from "@/lib/repositories";
import type { Company } from "@/types/company";

export interface PlacedCompany {
  id: string;
  name: string;
  code: string;
  municipality: string;
  /** The company's main industry's name, for a line under its name. */
  industry: string | null;
}

/**
 * The published companies by the prefecture of their head office: what the map shades and the prefecture pages
 * list. Companies the headquarters data could not place are counted apart (`unplaced`), so a total is never
 * presented as all companies when it is not.
 */
export async function companiesByPrefecture() {
  const [companies, placed] = await Promise.all([companyRepository.list(), headquartersRepository.list()]);
  const released = new Map(companies.map((c) => [c.id, c]));
  const byPrefecture = new Map<Prefecture["id"], PlacedCompany[]>(PREFECTURES.map((p) => [p.id, []]));
  for (const [id, hq] of placed) {
    const company = released.get(id);
    const prefecture = prefectureByName(hq.prefecture);
    if (!company || !prefecture) continue;
    byPrefecture.get(prefecture.id)!.push(toPlaced(company, hq.municipality));
  }
  const counts = Object.fromEntries([...byPrefecture].map(([id, list]) => [id, list.length]));
  const placedCount = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return { byPrefecture, counts, placedCount, unplaced: companies.length - placedCount, total: companies.length };
}

function toPlaced(company: Company, municipality: string): PlacedCompany {
  const primary = company.industries.find((i) => i.primary) ?? company.industries[0];
  return {
    id: company.id,
    name: company.name,
    code: company.code,
    municipality,
    industry: primary ? INDUSTRY_LABELS[primary.industryId].name : null,
  };
}
