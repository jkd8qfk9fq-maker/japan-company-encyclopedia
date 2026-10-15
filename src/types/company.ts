import type { Source, Sourced } from "./source";
import type { ContentStatus } from "./revision";

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
  // Added 2026-10-15 by the operator's decision, for a-tie (永代供養墓の募集代行・寺院コンサルティング);
  // the 有報 itself names its market 墓地・葬儀・仏壇のライフエンディング市場, which no earlier id described.
  "funeral-memorial",
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
  /**
   * The profit line the filing prints between revenue and net income in its own
   * 主要な経営指標等の推移 — 経常利益 under J-GAAP, 税引前利益 under IFRS and
   * US GAAP. Deliberately NOT 営業利益: almost no filer puts operating profit in
   * that five-year table, so a 営業利益 column could be filled for two years at
   * most, and not at all for banks, 総合商社 or US GAAP filers. `profitLabel`
   * carries the filer's own wording, which is what tells a reader which line
   * this is. Both are null when the filing prints no such row.
   */
  profit: number | null;
  profitLabel: string | null;
  netIncome: number | null;
  netIncomeLabel: string;
  /** 総資産, as the filing's five-year table prints it. */
  totalAssets: number | null;
  totalAssetsLabel: string | null;
  /**
   * 純資産. The filing's total (純資産額 / 資本合計, including non-controlling
   * interests) where it tags one; some IFRS and US GAAP filers tag only
   * 親会社の所有者に帰属する持分 / 株主資本, and then the label says so — the same
   * parent-versus-total distinction that matters for net income.
   */
  netAssets: number | null;
  netAssetsLabel: string | null;
  /** 従業員数 at the fiscal year end, as the filing's five-year table prints it. */
  employees: number | null;
  currency: "JPY";
  accountingStandard: AccountingStandard;
  /**
   * What the revenue figure covers, when that differs across the series.
   * Sony's latest 有報 shows revenue WITH the financial business for two years
   * and WITHOUT it (discontinued after the spin-off) for three. Same standard,
   * same label — and still not comparable. The chart breaks where this value
   * changes, exactly as it does for an accounting-standard change.
   * Omit on every record when the scope is consistent.
   */
  revenueBasis?: string;
  /**
   * What the net-income figure covers, when revenueBasis is set. Sony's net
   * income INCLUDES the discontinued financial business in every year while
   * its revenue excludes it from 2024年3月期 — so for those years the two
   * columns cannot be read as a margin, and the page must say so. Set on all
   * years whenever revenueBasis is set.
   */
  netIncomeBasis?: string;
  /**
   * A one-sentence explanation a reader needs to read this year correctly
   * (e.g. a loss caused by an accounting reclassification rather than by the
   * business). Shown under the chart. It is a claim, so it is covered by this
   * record's `sourceIds`.
   */
  note?: string;
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
  /**
   * A transaction the filing documents without saying who sells to whom.
   *
   * 政策保有株式 tables routinely print a purpose like 「主に制御事業における取引等の
   * 効果」 and stop there. Forcing that into supplier or customer invents the
   * direction; calling it same-industry is plainly false when the counterparty is
   * a railway operator or a chemical maker. Five researchers in one batch each
   * decided this separately, which is how a distinction like this drifts.
   */
  "business-partner",
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
  /**
   * As the exchange names it, e.g. "プライム", "プレミア". Omitted when the filing
   * names the exchange but not the segment: 日立製作所 files 上場金融商品取引所名 as
   * 「東京、名古屋」 and nothing more. The page then shows the exchange alone, which
   * is what the source supports. Copying the segment from another company entry
   * would be fabrication.
   */
  market?: string;
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
  /**
   * One sentence. The 3-second answer to "what does this company do?".
   *
   * null only on a `figures-only` entry, where no one has written it yet. Not an
   * empty string: a missing explanation and an empty one must not look the same,
   * and null makes the compiler point at every place that shows it.
   */
  description: string | null;
  listings: Listing[];

  industries: IndustryReference[];
  businesses: Business[];
  businessModel?: BusinessModel;

  financials: FinancialRecord[];
  history: HistoryEvent[];

  relatedCompanies: RelatedCompany[];

  sources: Source[];

  status: ContentStatus;
  // Revisions live in src/data/revisions/, not here (see Revision).

  /** YYYY-MM-DD */
  updatedAt: string;
};
