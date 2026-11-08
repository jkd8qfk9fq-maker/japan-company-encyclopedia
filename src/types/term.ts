import type { Source } from "./source";

/**
 * A concept a reader needs in order to understand a company or an industry —
 * and nothing wider. This is not a finance dictionary.
 */
export type Term = {
  /** kebab-case, e.g. "semiconductor-manufacturing-equipment". */
  id: string;
  term: string;
  /** ひらがな reading, for terms a beginner may not be able to read. */
  reading?: string;
  /** Two or three sentences at most. Shown inline, so it must be short. */
  description: string;
  /**
   * Other spellings a page may use for the same thing (「切削」 for 切削加工, 「ジェネリック医薬品」 for 後発医薬品).
   * Used only to find the term in text (src/lib/term-linking.ts); the glossary shows `term`.
   */
  aliases?: string[];
  relatedTermIds?: string[];
  sources: Source[];
  /** YYYY-MM-DD */
  updatedAt: string;
};
