/**
 * A document a fact can be traced back to.
 *
 * `id` is not in the original spec's Source type. It exists so that a section
 * (a business, a history event, a financial year) can point at the specific
 * documents that support it via `sourceIds`, instead of every fact on a page
 * sharing one undifferentiated bibliography. "Sources must be visible" is only
 * useful if a reader can tell WHICH source supports WHICH claim.
 */
export type Source = {
  /** kebab-case, unique within the entity that owns the source list. */
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** YYYY-MM-DD. The document's own date, when it states one. */
  publishedAt?: string;
  /** YYYY-MM-DD. When the document was actually read to verify the fact. */
  accessedAt: string;
};

/**
 * Anything that makes a factual claim carries the ids of the sources that
 * support it. An empty array is allowed by the type but rejected by the data
 * integrity test for every section that states a fact.
 */
export type Sourced = {
  sourceIds: string[];
};
