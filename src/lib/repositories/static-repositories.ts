import { companies } from "@/data/companies";
import headquartersJson from "@/data/headquarters.json";
import websitesJson from "@/data/websites.json";
import { features } from "@/data/features";
import { industries } from "@/data/industries";
import { terms } from "@/data/terms";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { headquartersSchema, parseContent, translationFileSchema, websitesSchema } from "@/lib/content/schemas";
import { checkTranslation, hashText } from "@/lib/translation-check";
import { translatableStrings } from "@/lib/translatable";
import { toPlainText } from "@/lib/rich-text";
import { isReleased } from "@/lib/release";
import type { Company, RelatedCompany } from "@/types/company";
import { FileRevisionRepository } from "./file-revision-repository";
import type {
  CompanyRepository,
  FeatureRepository,
  HeadquartersRepository,
  WebsiteRepository,
  IndustryRepository,
  RevisionRepository,
  TermRepository,
  TranslationRepository,
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
const releasedCompanies = sortedCompanies.filter(isReleased);
const companyMap = byId(companies);
const releasedMap = byId(releasedCompanies);
const industryMap = byId(industries);
const termMap = byId(terms);
const featureMap = byId(features);
// One array for the life of the process: the term linker (src/lib/term-linking.ts) builds its matcher once per array.
const sortedTerms = [...terms].sort((a, b) => collator.compare(a.reading ?? a.term, b.reading ?? b.term));
const sortedFeatures = [...features].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

// Built on first use, not at import: most callers never ask, and the admin imports this module too.
let relatingIndex: Map<string, { company: Company; relation: RelatedCompany }[]> | null = null;
function relatingTo(companyId: string) {
  if (!relatingIndex) {
    relatingIndex = new Map();
    for (const company of releasedCompanies) {
      for (const relation of company.relatedCompanies) {
        const list = relatingIndex.get(relation.companyId) ?? [];
        list.push({ company, relation });
        relatingIndex.set(relation.companyId, list);
      }
    }
  }
  return relatingIndex.get(companyId) ?? [];
}

function pick<T>(map: Map<string, T>, ids: readonly string[]): T[] {
  return ids.map((id) => map.get(id)).filter((item): item is T => item !== undefined);
}

export const companyRepository: CompanyRepository = {
  async list() {
    return releasedCompanies;
  },
  async get(id) {
    return releasedMap.get(id) ?? null;
  },
  async getMany(ids) {
    return pick(releasedMap, ids);
  },
  async listByIndustry(industryId) {
    return releasedCompanies.filter((c: Company) =>
      c.industries.some((ref) => ref.industryId === industryId),
    );
  },
  async listRelatingTo(companyId) {
    return relatingTo(companyId);
  },
  async listAll() {
    return sortedCompanies;
  },
  async getAny(id) {
    return companyMap.get(id) ?? null;
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
    return sortedTerms;
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

export const revisionRepository: RevisionRepository = new FileRevisionRepository(join(process.cwd(), "src", "data", "revisions"));

const headquarters = parseContent(headquartersSchema, headquartersJson, "src/data/headquarters.json");
const headquartersEntries = Object.entries(headquarters.companies);

export const headquartersRepository: HeadquartersRepository = {
  async source() {
    return headquarters.source;
  },
  async get(companyId) {
    return headquarters.companies[companyId] ?? null;
  },
  async list() {
    return headquartersEntries;
  },
};

const websites = parseContent(websitesSchema, websitesJson, "src/data/websites.json");

export const websiteRepository: WebsiteRepository = {
  async locator() {
    return websites.locator;
  },
  async get(companyId) {
    return websites.companies[companyId] ?? null;
  },
};

type TranslationKind = "company" | "industry" | "term";
const TRANSLATION_ROOT = join(process.cwd(), "src", "data", "translations");

/**
 * Built once, on first use. An entry is kept only if its key is the hash of a text its entry has now and it passes
 * checkTranslation against that text: a translation is never shown beside Japanese it was not made from (JCE-124).
 * Read from the file system rather than imported, so thousands of files do not pass through the bundler.
 */
let translationIndex: { text: Map<string, string>; coverage: Map<string, { translated: number; total: number }> } | null = null;
function translations() {
  if (translationIndex) return translationIndex;
  const text = new Map<string, string>();
  const coverage = new Map<string, { translated: number; total: number }>();
  const subjects: Record<TranslationKind, (id: string) => unknown> = {
    company: (id) => companyMap.get(id),
    industry: (id) => industryMap.get(id),
    term: (id) => termMap.get(id),
  };
  for (const kind of Object.keys(subjects) as TranslationKind[]) {
    const folder = { company: "companies", industry: "industries", term: "terms" }[kind];
    const dir = join(TRANSLATION_ROOT, "en", folder);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const file = parseContent(translationFileSchema, JSON.parse(readFileSync(join(dir, name), "utf8")), `translations/en/${folder}/${name}`);
      const subject = subjects[kind](file.subject.id);
      if (!subject) continue;
      const sources = translatableStrings(subject);
      let translated = 0;
      for (const ja of sources) {
        const en = file.entries[hashText(ja)];
        if (!en || checkTranslation(ja, en).length > 0) continue;
        text.set(ja, en);
        // Cards and metadata show rich text flattened; the flattened Japanese finds the flattened translation.
        const plain = toPlainText(ja);
        if (plain !== ja) text.set(plain, toPlainText(en));
        translated++;
      }
      coverage.set(`${kind}:${file.subject.id}`, { translated, total: sources.length });
    }
  }
  translationIndex = { text, coverage };
  return translationIndex;
}

export const translationRepository: TranslationRepository = {
  async find(_locale, ja) {
    return translations().text.get(ja) ?? null;
  },
  lookup(_locale, ja) {
    return translations().text.get(ja) ?? null;
  },
  async coverage(kind, id) {
    return translations().coverage.get(`${kind}:${id}`) ?? { translated: 0, total: 0 };
  },
};
