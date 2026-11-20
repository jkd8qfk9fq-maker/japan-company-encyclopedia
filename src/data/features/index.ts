import { companies } from "@/data/companies";
import { buildFeatures } from "@/lib/feature-articles";
import { isReleased } from "@/lib/release";
import type { Feature } from "@/types/feature";

/**
 * The features are built, not stored (JCE-074): every figure in an article is computed from the released
 * companies' printed figures at build time, so an article can never disagree with the data it reads.
 * `buildFeatures` returns them in display order; the repository sorts by publishedAt.
 */
export const features: Feature[] = buildFeatures(companies.filter(isReleased));
