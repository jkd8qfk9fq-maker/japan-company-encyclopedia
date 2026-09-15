import { parseContent, industrySchema } from "@/lib/content/schemas";
import type { Industry } from "@/types/industry";
import semiconductors from "./semiconductors.json";

/** Industries with a researched explanation. Others appear with their companies only. */
export const industries: Industry[] = Object.entries({ semiconductors }).map(([file, data]) =>
  parseContent(industrySchema, data, `src/data/industries/${file}.json`),
);
