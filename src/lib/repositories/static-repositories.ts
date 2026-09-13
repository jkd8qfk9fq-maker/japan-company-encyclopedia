import { companies } from "@/data/companies";
import { features } from "@/data/features";
import { industries } from "@/data/industries";
import { terms } from "@/data/terms";
import type { Company } from "@/types/company";
import type {
  CompanyRepository,
  FeatureRepository,
  IndustryRepository,
  TermRepository,
} from "./repositories";

/**
 * Static-module implementation of the repositories. Lookups go through maps
 * built once, so a page render is O(1) per entity at 100 companies and at
 * 4,000.
 */

function byId<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

const collator = new Intl.Collator("ja-JP");

// Companies are listed by securities code: stable, familiar to anyone who has
// seen a 四季報, and independent of how a name is read.
const sortedCompanies = [...companies].sort((a, b) => a.code.localeCompare(b.code));
const companyMap = byId(companies);
const industryMap = byId(industries);
const termMap = byId(terms);
const featureMap = byId(features);
const sortedFeatures = [...features].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

function pick<T>(map: Map<string, T>, ids: readonly string[]): T[] {
  return ids.map((id) => map.get(id)).filter((item): item is T => item !== undefined);
}

export const companyRepository: CompanyRepository = {
  async list() {
    return sortedCompanies;
  },
  async get(id) {
    return companyMap.get(id) ?? null;
  },
  async getMany(ids) {
    return pick(companyMap, ids);
  },
  async listByIndustry(industryId) {
    return sortedCompanies.filter((c: Company) =>
      c.industries.some((ref) => ref.industryId === industryId),
    );
  },
};

export const industryRepository: IndustryRepository = {
  async list() {
    return [...industries].sort((a, b) => collator.compare(a.name, b.name));
  },
  async get(id) {
    return industryMap.get(id) ?? null;
  },
};

export const termRepository: TermRepository = {
  async list() {
    return [...terms].sort((a, b) => collator.compare(a.reading ?? a.term, b.reading ?? b.term));
  },
  async get(id) {
    return termMap.get(id) ?? null;
  },
  async getMany(ids) {
    return pick(termMap, ids);
  },
};

export const featureRepository: FeatureRepository = {
  async list() {
    return sortedFeatures;
  },
  async get(id) {
    return featureMap.get(id) ?? null;
  },
  async listByCompany(companyId) {
    return sortedFeatures.filter((f) => f.relatedCompanies.includes(companyId));
  },
  async listByIndustry(industryId) {
    return sortedFeatures.filter((f) => f.relatedIndustries.includes(industryId));
  },
};
