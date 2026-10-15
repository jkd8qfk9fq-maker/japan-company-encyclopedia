import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository, featureRepository, termRepository } from "@/lib/repositories";
import type { IndustryId } from "@/types/company";
import { INDUSTRY_IDS } from "@/types/company";
import type { RevisionTargetType } from "@/types/revision";

export const TARGET_TYPE_LABEL: Record<RevisionTargetType, string> = {
  company: "企業",
  industry: "業界",
  term: "用語",
  feature: "特集",
};

/** Display name and public URL for whatever a revision (or an editor) points at. SERVER ONLY. */
export async function describeTarget(targetType: RevisionTargetType, targetId: string): Promise<{ name: string; href: string | null }> {
  switch (targetType) {
    case "company": {
      const [company, released] = await Promise.all([companyRepository.getAny(targetId), companyRepository.get(targetId)]);
      return { name: company?.name ?? targetId, href: released ? `/companies/${targetId}` : null };
    }
    case "industry": {
      const known = INDUSTRY_IDS.includes(targetId as IndustryId);
      return { name: known ? `${INDUSTRY_LABELS[targetId as IndustryId].name}業界` : targetId, href: known ? `/industries/${targetId}` : null };
    }
    case "term": {
      const term = await termRepository.get(targetId);
      return { name: term?.term ?? targetId, href: term ? `/terms#${targetId}` : null };
    }
    case "feature": {
      const feature = await featureRepository.get(targetId);
      return { name: feature?.title ?? targetId, href: feature ? `/features/${targetId}` : null };
    }
  }
}
