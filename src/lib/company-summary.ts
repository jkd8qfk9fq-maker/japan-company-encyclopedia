import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { toPlainText } from "@/lib/rich-text";
import { translationRepository } from "@/lib/repositories";
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
  /** null on a figures-only entry, where nobody has written it yet. */
  description: string | null;
  /** Its English reference translation, when one passed the checks (JCE-128). */
  descriptionEn?: string;
  businesses: string[];
  industries: { id: IndustryId; name: string; primary: boolean }[];
};

export function toCompanySummary(company: Company): CompanySummary {
  const descriptionEn = company.description ? translationRepository.lookup("en", company.description) : null;
  return {
    id: company.id,
    code: company.code,
    name: company.name,
    nameEn: company.nameEn,
    shortNameEn: company.shortNameEn,
    description: company.description ? toPlainText(company.description) : null,
    descriptionEn: descriptionEn ? toPlainText(descriptionEn) : undefined,
    businesses: company.businesses.map((b) => b.shortName ?? b.name),
    industries: company.industries.map((ref) => ({
      id: ref.industryId,
      name: INDUSTRY_LABELS[ref.industryId].name,
      primary: ref.primary ?? false,
    })),
  };
}
