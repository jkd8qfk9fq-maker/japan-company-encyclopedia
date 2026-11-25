import type { IndustryId } from "./company";
import type { ContentStatus } from "./revision";
import type { Source } from "./source";

/**
 * Feature body blocks. Paragraph text is rich text (see src/lib/rich-text.ts),
 * so a feature links into companies, industries and terms from inside its
 * sentences — the feature is an entry point into the encyclopedia, not a
 * separate magazine.
 */
/** One row of a feature's data table: a label (a company or industry name, linked when `href` is set) and the computed values beside it. */
export type FeatureTableRow = {
  label: string;
  href?: string;
  values: string[];
  /** The row's main figure as a number (JCE-111), drawn as a bar beside the printed value; the bar never carries a figure of its own. */
  bar?: number;
};

export type FeatureBlock =
  | { type: "paragraph"; text: string; sourceIds?: string[] }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution: string; sourceIds: string[] }
  | { type: "company-callout"; companyId: string; text: string }
  /**
   * A table computed at build time from the released companies' printed figures (JCE-074). The rows are
   * built by `src/lib/feature-articles.ts`, never written by hand; `note` states the formula, the scope
   * and that the values are 計算値, in the same words the rankings use.
   */
  | { type: "data-table"; title?: string; columns: string[]; rows: FeatureTableRow[]; note: string };

export type Feature = {
  /** kebab-case slug, also the route segment. */
  id: string;
  title: string;
  subtitle?: string;
  /** Path under /public. Optional: a feature without a true image uses typography instead. */
  heroImage?: string;
  heroImageAlt?: string;
  body: FeatureBlock[];
  /** A one- or two-word theme shown on the card and above the title (JCE-111), e.g. 「海外売上」. */
  topic?: string;
  /** Two or three headline figures for the top of the article and its card — computed like the tables, never typed. */
  keyFigures?: { value: string; label: string }[];
  /** 「この特集のポイント」: the findings in two or three sentences, each built from the same computed values as the body. */
  takeaways?: string[];
  relatedCompanies: string[];
  relatedIndustries: IndustryId[];
  relatedTerms: string[];
  sources: Source[];
  status: ContentStatus;
  /** YYYY-MM-DD */
  publishedAt: string;
};
