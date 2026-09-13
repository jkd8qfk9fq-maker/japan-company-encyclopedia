import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { toPlainText } from "@/lib/rich-text";
import type { Company, IndustryId } from "@/types/company";

/**
 * The slice of a company that lists, cards and search need. Built on the
 * server so a Client Component never receives — and never ships to the
 * browser — a full entry with its history, financials and sources.
 */
export type CompanySummary = {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  shortNameEn?: string;
  description: string;
  businesses: string[];
  industries: { id: IndustryId; name: string; primary: boolean }[];
};

export function toCompanySummary(company: Company): CompanySummary {
  return {
    id: company.id,
    code: company.code,
    name: company.name,
    nameEn: company.nameEn,
    shortNameEn: company.shortNameEn,
    description: toPlainText(company.description),
    businesses: company.businesses.map((b) => b.shortName ?? b.name),
    industries: company.industries.map((ref) => ({
      id: ref.industryId,
      name: INDUSTRY_LABELS[ref.industryId].name,
      primary: ref.primary ?? false,
    })),
  };
}
