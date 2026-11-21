import type { MetadataRoute } from "next";
import { indicators } from "@/data/indicators";
import { listIndustryPages } from "@/lib/industries";
import { PREFECTURES } from "@/lib/prefectures";
import { RANKING_IDS } from "@/lib/rankings";
import { companyRepository, featureRepository, industryRepository } from "@/lib/repositories";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The served (canonical) form of every page carries a trailing slash: the static host redirects the
  // slash-less form with a 307. Listing the slash-less form here would send crawlers through a redirect
  // for every one of the ~3,000 URLs, and disagree with each page's canonical.
  const [companies, industryPages, industries, features] = await Promise.all([
    companyRepository.list(),
    listIndustryPages(),
    industryRepository.list(),
    featureRepository.list(),
  ]);
  const industryUpdated = new Map(industries.map((i) => [i.id, i.updatedAt]));
  const url = siteUrl;

  return [
    { url: url("/") },
    { url: url("/companies/") },
    { url: url("/discover/") },
    { url: url("/quiz/") },
    { url: url("/learn/") },
    { url: url("/analysis/") },
    ...indicators.map((i) => ({ url: url(`/indicators/${i.id}/`), lastModified: i.updatedAt })),
    { url: url("/explore/") },
    { url: url("/network/") },
    { url: url("/help/") },
    { url: url("/contact/") },
    { url: url("/terms-of-use/") },
    { url: url("/industries/") },
    { url: url("/screening/") },
    { url: url("/compare/") },
    { url: url("/rankings/") },
    ...RANKING_IDS.map((id) => ({ url: url(`/rankings/${id}/`) })),
    { url: url("/prefectures/") },
    { url: url("/features/") },
    { url: url("/terms/") },
    { url: url("/about/") },
    { url: url("/privacy/") },
    ...companies.map((c) => ({ url: url(`/companies/${c.id}/`), lastModified: c.updatedAt })),
    ...industryPages.map((i) => ({ url: url(`/industries/${i.id}/`), lastModified: industryUpdated.get(i.id) })),
    ...PREFECTURES.map((p) => ({ url: url(`/prefectures/${p.id}/`) })),
    ...features.map((f) => ({ url: url(`/features/${f.id}/`), lastModified: f.publishedAt })),
  ];
}
