import type { Company, IndustryId, RelatedCompany } from "@/types/company";
import type { Feature } from "@/types/feature";
import type { Headquarters, HeadquartersData } from "@/types/headquarters";
import type { Industry } from "@/types/industry";
import type { Revision, RevisionTargetType } from "@/types/revision";
import type { Term } from "@/types/term";
import type { Website } from "@/types/website";

/**
 * The only way the UI reads content.
 *
 * Every method is async even though today's implementation reads static
 * modules synchronously. That is the migration path: when content moves to a
 * database, a new implementation of these interfaces replaces the static one
 * and no page or component changes. Making them sync now would bake "content
 * is in memory" into every call site.
 */

export interface CompanyRepository {
  /** The public site's view: released companies only (`src/lib/release.ts`). */
  list(): Promise<Company[]>;
  get(id: string): Promise<Company | null>;
  getMany(ids: readonly string[]): Promise<Company[]>;
  listByIndustry(industryId: IndustryId): Promise<Company[]>;
  /**
   * Released companies whose own `relatedCompanies` name this company, with the entry as they wrote it. The claim
   * is theirs — sourced in their `sources` — so a caller showing it on this company's page cites the other company.
   */
  listRelatingTo(companyId: string): Promise<{ company: Company; relation: RelatedCompany }[]>;
  /** Every registered company, released or not — for the admin editor and nothing public. */
  listAll(): Promise<Company[]>;
  getAny(id: string): Promise<Company | null>;
}

export interface IndustryRepository {
  /** Only industries with a researched explanation. */
  list(): Promise<Industry[]>;
  get(id: string): Promise<Industry | null>;
}

export interface TermRepository {
  list(): Promise<Term[]>;
  get(id: string): Promise<Term | null>;
  getMany(ids: readonly string[]): Promise<Term[]>;
}

export interface FeatureRepository {
  /** Newest first. */
  list(): Promise<Feature[]>;
  get(id: string): Promise<Feature | null>;
  listByCompany(companyId: string): Promise<Feature[]>;
  listByIndustry(industryId: IndustryId): Promise<Feature[]>;
}

export interface RevisionRepository {
  /** Newest first. */
  list(): Promise<Revision[]>;
  listForTarget(targetType: RevisionTargetType, targetId: string): Promise<Revision[]>;
  /**
   * The corrections recorded for one target, newest first. A page rendered once per company cannot afford
   * list()'s read of every revision file; the file names carry the id, which names the target and the
   * correction, so this reads only the candidates and verifies them by content.
   */
  listCorrectionsForTarget(targetType: RevisionTargetType, targetId: string): Promise<Revision[]>;
  get(id: string): Promise<Revision | null>;
}

export interface HeadquartersRepository {
  /** Where the prefectures and municipalities come from (the EDINET code list, and when it was downloaded). */
  source(): Promise<HeadquartersData["source"]>;
  /** The head office of a company, or null when it could not be placed. */
  get(companyId: string): Promise<Headquarters | null>;
  /** Every placed company id with its head office, in no particular order. */
  list(): Promise<[string, Headquarters][]>;
}

export interface WebsiteRepository {
  /** Where the address was read: 【株式事務の概要】公告掲載方法. */
  locator(): Promise<string>;
  /** The company's own website, or null when its filing prints none of its own. */
  get(companyId: string): Promise<Website | null>;
}
