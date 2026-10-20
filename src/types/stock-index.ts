import type { Source, Sourced } from "./source";

/** One constituent as the index provider's own list prints it. */
export type StockIndexConstituent = {
  /** 証券コード, matched against registered companies by code. */
  code: string;
  /** The name as the provider's list prints it — shown for a constituent this encyclopedia has no page for. */
  name: string;
};

/**
 * A stock index's constituent list (日経平均株価, TOPIX …), used only as a way into the companies: which companies
 * it names, which industries they are in, how they are tied to each other. Never its level, weights or returns
 * (CLAUDE.md invariant 4).
 *
 * The list is the provider's work. It is shown only after the operator has read the provider's terms and recorded
 * what they allow in `usageTerms`; an index without that record cannot be added (the schema requires it).
 */
export type StockIndex = Sourced & {
  /** kebab-case, e.g. "nikkei-225", "topix-core30". Also the tab id on /industries. */
  id: string;
  /** e.g. "日経平均株価（日経225）". */
  name: string;
  /** The index provider, e.g. "日本経済新聞社", "JPX総研". */
  publisher: string;
  /** YYYY-MM-DD: the date the provider's list is as of. */
  asOf: string;
  /** What the provider's terms allow and how that was confirmed (page, date, or the permission received). */
  usageTerms: string;
  /** One sentence on what the index is, from the provider's own description. Covered by `sourceIds`. */
  description: string;
  constituents: StockIndexConstituent[];
  sources: Source[];
};
