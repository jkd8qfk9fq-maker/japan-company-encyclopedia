import type { PrefectureName } from "@/lib/prefectures";

/**
 * Where registered companies have their head office, derived from the EDINET code list's 所在地 by
 * scripts/pipeline/sync-headquarters.mjs: the prefecture and the municipality only, never the street address.
 * A company the script could not place without guessing is absent.
 */
export interface Headquarters {
  prefecture: PrefectureName;
  municipality: string;
}

export interface HeadquartersData {
  source: { title: string; publisher: string; url: string; downloadedAt: string };
  companies: Record<string, Headquarters>;
}
