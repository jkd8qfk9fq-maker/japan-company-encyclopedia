import { INDUSTRY_IMAGES } from "@/assets/industries";
import { RELATIONSHIP_LABEL } from "@/components/company/related-companies";
import { companyMetrics } from "@/lib/company-metrics";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { firstSentence, toPlainText } from "@/lib/rich-text";
import type { Company, IndustryId, RelationshipKind } from "@/types/company";

/**
 * One card of the discovery feed (/discover, JCE-046). Everything on it is the entry's own sourced data, shortened,
 * never rephrased: the description, the businesses, and at most one "hook" — the strength the filing itself states,
 * an overseas share computed from the filing's regional revenue (labelled 計算値 with its formula), or the oldest
 * event of the 沿革. A company with nothing to show beyond its name is not a card: an empty card teaches nothing.
 */
export type DiscoverCard = {
  id: string;
  name: string;
  industry: { id: IndustryId; name: string };
  image: string;
  description: string;
  businesses: string[];
  hook:
    | { kind: "advantage"; text: string }
    | { kind: "overseas"; percent: number; formula: string; fiscalYear: string }
    | { kind: "history"; year: number; title: string }
    | null;
  revenue: { amount: number; fiscalYear: string } | null;
  related: { id: string; name: string; label: string }[];
};

// Trade and competition first: they lead to a company the reader has probably not heard of in the same story.
// Capital relations last — a subsidiary is a fact, but a weaker reason to keep going.
const RELATION_ORDER: RelationshipKind[] = [
  "competitor",
  "supplier",
  "customer",
  "technology",
  "same-business-model",
  "business-partner",
  "same-industry",
  "parent",
  "subsidiary",
  "affiliate",
  "other-affiliated-company",
  "major-shareholder",
];

const HOOK_LIMIT = 110;
const clip = (text: string, limit: number) => (text.length > limit ? `${text.slice(0, limit - 1)}…` : text);

export function toDiscoverCard(company: Company, released: ReadonlyMap<string, Company>): DiscoverCard | null {
  if (!company.description) return null;
  const primary = company.industries.find((i) => i.primary) ?? company.industries[0];
  if (!primary) return null;

  const metrics = companyMetrics(company);
  const overseas = metrics?.overseasSalesRatio;
  const advantage = company.perspectives?.competitiveAdvantage?.disclosed;
  const oldest = [...company.history].sort((a, b) => a.year - b.year)[0];

  // The most surprising thing the entry can back: a company that sells mostly abroad, then the filing's own words
  // about its strength, then how far back it goes.
  let hook: DiscoverCard["hook"] = null;
  if (overseas && overseas.percent >= 50) hook = { kind: "overseas", percent: overseas.percent, formula: overseas.formula, fiscalYear: overseas.fiscalYear };
  else if (advantage) hook = { kind: "advantage", text: clip(toPlainText(firstSentence(advantage.text)), HOOK_LIMIT) };
  else if (overseas && overseas.percent >= 20) hook = { kind: "overseas", percent: overseas.percent, formula: overseas.formula, fiscalYear: overseas.fiscalYear };
  else if (oldest) hook = { kind: "history", year: oldest.year, title: oldest.title };

  const latest = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
  const seen = new Set<string>();
  const related = [...company.relatedCompanies]
    .sort((a, b) => RELATION_ORDER.indexOf(a.relationship) - RELATION_ORDER.indexOf(b.relationship))
    .filter((r) => released.has(r.companyId) && r.companyId !== company.id && !seen.has(r.companyId) && seen.add(r.companyId))
    .slice(0, 4)
    .map((r) => ({ id: r.companyId, name: released.get(r.companyId)!.name, label: RELATIONSHIP_LABEL[r.relationship] }));

  return {
    id: company.id,
    name: company.name,
    industry: { id: primary.industryId, name: INDUSTRY_LABELS[primary.industryId].name },
    image: INDUSTRY_IMAGES[primary.industryId].src,
    description: clip(toPlainText(firstSentence(company.description)), 140),
    businesses: metrics?.topBusinesses ?? company.businesses.slice(0, 3).map((b) => b.shortName ?? b.name),
    hook,
    revenue: latest?.revenue != null ? { amount: latest.revenue, fiscalYear: latest.fiscalYear } : null,
    related,
  };
}

export function buildDiscoverFeed(companies: readonly Company[]): DiscoverCard[] {
  const released = new Map(companies.map((c) => [c.id, c]));
  return companies.map((c) => toDiscoverCard(c, released)).filter((c): c is DiscoverCard => c !== null);
}
