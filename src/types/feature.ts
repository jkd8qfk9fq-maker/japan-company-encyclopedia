import type { IndustryId } from "./company";
import type { ContentStatus, Revision } from "./revision";
import type { Source } from "./source";

/**
 * Feature body blocks. Paragraph text is rich text (see src/lib/rich-text.ts),
 * so a feature links into companies, industries and terms from inside its
 * sentences — the feature is an entry point into the encyclopedia, not a
 * separate magazine.
 */
export type FeatureBlock =
  | { type: "paragraph"; text: string; sourceIds?: string[] }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution: string; sourceIds: string[] }
  | { type: "company-callout"; companyId: string; text: string };

export type Feature = {
  /** kebab-case slug, also the route segment. */
  id: string;
  title: string;
  subtitle?: string;
  /** Path under /public. Optional: a feature without a true image uses typography instead. */
  heroImage?: string;
  heroImageAlt?: string;
  body: FeatureBlock[];
  relatedCompanies: string[];
  relatedIndustries: IndustryId[];
  relatedTerms: string[];
  sources: Source[];
  status: ContentStatus;
  revisions: Revision[];
  /** YYYY-MM-DD */
  publishedAt: string;
};
