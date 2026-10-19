import type { MetadataRoute } from "next";
import { listIndustryPages } from "@/lib/industries";
import { companyRepository, featureRepository, industryRepository } from "@/lib/repositories";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    { url: url("/companies") },
    { url: url("/industries") },
    { url: url("/features") },
    { url: url("/terms") },
    { url: url("/about") },
    ...companies.map((c) => ({ url: url(`/companies/${c.id}`), lastModified: c.updatedAt })),
    ...industryPages.map((i) => ({ url: url(`/industries/${i.id}`), lastModified: industryUpdated.get(i.id) })),
    ...features.map((f) => ({ url: url(`/features/${f.id}`), lastModified: f.publishedAt })),
  ];
}
