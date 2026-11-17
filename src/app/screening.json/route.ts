import { buildScreeningIndex } from "@/lib/screening-index";
import { companyRepository, headquartersRepository, industryRepository } from "@/lib/repositories";

/**
 * The screening index (JCE-060): one row per released company, built with the site — so the browser filters about
 * 3,000 rows locally and asks the server nothing about what the reader is looking for.
 */
export const dynamic = "force-static";

export async function GET() {
  const [companies, industries] = await Promise.all([companyRepository.list(), industryRepository.list()]);
  const prefectures = new Map(await Promise.all(companies.map(async (c) => [c.id, (await headquartersRepository.get(c.id))?.prefecture ?? null] as const)));
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
  return Response.json(
    buildScreeningIndex(companies, (id) => prefectures.get(id) ?? null, industries.map((i) => ({ id: i.id, name: i.name })), today),
  );
}
