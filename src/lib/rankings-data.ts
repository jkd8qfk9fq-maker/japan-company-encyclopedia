import { buildIndustryFigures, type IndustryFiguresData } from "@/lib/industry-figures";
import { companyRepository } from "@/lib/repositories";

/** SERVER ONLY (build time): the industry figures the rankings order, over the released companies (JCE-062). */
let cached: Promise<IndustryFiguresData> | null = null;
export function rankingFigures(): Promise<IndustryFiguresData> {
  cached ??= companyRepository.list().then(buildIndustryFigures);
  return cached;
}
