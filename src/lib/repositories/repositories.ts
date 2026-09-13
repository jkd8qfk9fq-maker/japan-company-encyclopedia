import type { Company, IndustryId } from "@/types/company";
import type { Feature } from "@/types/feature";
import type { Industry } from "@/types/industry";
import type { Term } from "@/types/term";

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
  list(): Promise<Company[]>;
  get(id: string): Promise<Company | null>;
  getMany(ids: readonly string[]): Promise<Company[]>;
  listByIndustry(industryId: IndustryId): Promise<Company[]>;
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
