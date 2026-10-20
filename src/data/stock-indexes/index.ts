import { parseContent, stockIndexSchema } from "@/lib/content/schemas";
import type { StockIndex } from "@/types/stock-index";

/**
 * Stock index constituent lists, one JSON file each (`nikkei-225.json`, `topix-core30.json` …), registered here.
 *
 * Empty on purpose (2026-10-20): the providers' terms for showing their lists on this site are not confirmed —
 * 日本経済新聞社 requires a licence for business use and for providing index information to third parties, and
 * JPX's terms for the TOPIX weight list could not be read from the build environment. Add a file only with the
 * provider's own list and `usageTerms` saying what was confirmed (docs/stock-indexes.md).
 */
export const stockIndexes: StockIndex[] = Object.entries({}).map(([file, data]) =>
  parseContent(stockIndexSchema, data, `src/data/stock-indexes/${file}.json`),
);
