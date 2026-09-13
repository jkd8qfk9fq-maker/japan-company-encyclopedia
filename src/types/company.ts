import type { Source, Sourced } from "./source";
import type { ContentStatus, Revision } from "./revision";

/**
 * Industry ids are a closed set so that a typo cannot silently create a new,
 * empty industry page. Extending the taxonomy is a deliberate edit here.
 *
 * `entertainment` is the one addition to the spec's initial list: games,
 * music and film have no home in it, and filing Nintendo under `media` would
 * be a misclassification rather than a simplification.
 */
export const INDUSTRY_IDS = [
  "automotive",
  "semiconductors",
  "electronics",
  "it",
  "finance",
  "trading",
  "food",
  "retail",
  "real-estate",
  "construction",
  "chemicals",
  "pharmaceuticals",
  "transportation",
  "energy",
  "telecommunications",
  "media",
  "entertainment",
] as const;

export type IndustryId = (typeof INDUSTRY_IDS)[number];

export type IndustryReference = {
  industryId: IndustryId;
  /** The industry the company is primarily understood through. Exactly one per company. */
  primary?: boolean;
};

/**
 * One node of the company-specific business structure.
 *
 * The recursive `children` is the point: Toyota's structure and Mitsubishi
 * Corporation's structure are different shapes, and the type must not force
 * them into the same one.
 */
export type Business = Sourced & {
  /** kebab-case, unique within the company. */
  id: string;
  name: string;
  /** Short label for diagram nodes, where `name` would wrap badly. */
  shortName?: string;
  description: string;
  products?: string[];
  customers?: string[];
  children?: Business[];
};

export type BusinessModelStepKind =
  | "company"
  | "offering"
  | "customer"
  | "revenue"
  | "profit";

export type BusinessModelStep = {
  kind: BusinessModelStepKind;
  title: string;
  description: string;
};

export type BusinessModel = Sourced & {
  description: string;
  products: string[];
  customers: string[];
  revenueSources: string[];
  flow: BusinessModelStep[];
};

export type AccountingStandard = "ifrs" | "jgaap" | "usgaap";

/**
 * One consolidated fiscal year.
 *
 * Deviations from the spec's `revenue?: number`, each deliberate:
 *
 * - `number | null`, not optional. A missing key and "we could not verify this"
 *   must not look the same; null is an explicit, reviewed absence.
 * - `revenueLabel` / `netIncomeLabel`. Toyota reports 営業収益, IFRS filers
 *   report 売上収益 or 収益, J-GAAP filers 売上高. Relabelling all of them as
 *   "売上高" would put words in a filing's mouth.
 * - `accountingStandard`. A five-year series can cross a change of standard;
 *   the chart has to be able to say so rather than draw a smooth line across it.
 * - Amounts are whole yen. Filings state 百万円; conversion happens once, at
 *   data-entry time, and is recorded in the research log.
 */
export type FinancialRecord = Sourced & {
  /** Display label as the company uses it, e.g. "2026年3月期". */
  fiscalYear: string;
  /** YYYY-MM-DD, the last day of the fiscal year. Used for ordering. */
  periodEnd: string;
  revenue: number | null;
  revenueLabel: string;
  netIncome: number | null;
  netIncomeLabel: string;
  currency: "JPY";
  accountingStandard: AccountingStandard;
};

export type HistoryEvent = Sourced & {
  year: number;
  title: string;
  description: string;
  /** Why this turning point explains what the company is today. The "意味" column. */
  significance: string;
};

export const RELATIONSHIP_KINDS = [
  "same-industry",
  "competitor",
  "supplier",
  "customer",
  "technology",
  "same-business-model",
] as const;

export type RelationshipKind = (typeof RELATIONSHIP_KINDS)[number];

export type RelatedCompany = Sourced & {
  companyId: string;
  relationship: RelationshipKind;
  /** One line explaining the relationship. A bare label says nothing to a beginner. */
  description: string;
};

/**
 * A company can be listed on more than one exchange (Toyota: Tokyo and Nagoya),
 * and each exchange names its own market segments, so `market` is the
 * exchange's own label rather than a Tokyo-shaped enum.
 */
export type Listing = {
  exchange: "tse" | "nse" | "fse" | "sse";
  /** As the exchange names it, e.g. "プライム", "プレミア". */
  market: string;
};

export type Company = {
  /** Stable kebab-case slug. Also the route segment and the data file name. */
  id: string;
  /** 証券コード. A string: codes are identifiers, and newer codes contain letters. */
  code: string;
  /** Display name, e.g. "トヨタ自動車". */
  name: string;
  /** 商号 as registered, e.g. "トヨタ自動車株式会社". */
  officialName: string;
  nameEn?: string;
  /** The large Latin wordmark in the hero, e.g. "TOYOTA". */
  shortNameEn?: string;
  /** One sentence. The 3-second answer to "what does this company do?". */
  description: string;
  listings: Listing[];

  industries: IndustryReference[];
  businesses: Business[];
  businessModel?: BusinessModel;

  financials: FinancialRecord[];
  history: HistoryEvent[];

  relatedCompanies: RelatedCompany[];

  sources: Source[];

  status: ContentStatus;
  revisions: Revision[];

  /** YYYY-MM-DD */
  updatedAt: string;
};
