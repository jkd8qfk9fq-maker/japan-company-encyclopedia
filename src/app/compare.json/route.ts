import { buildCompareIndex } from "@/lib/compare-index";
import { companyRepository, industryRepository } from "@/lib/repositories";

/**
 * The 見比べ index (JCE-061): one row per released company, built with the site. The page picks its two or three
 * companies from it in the browser, so which companies a reader compares is never sent anywhere.
 */
export const dynamic = "force-static";

export async function GET() {
  const [companies, industries] = await Promise.all([companyRepository.list(), industryRepository.list()]);
  const names = new Map<string, string>(industries.map((i) => [i.id, i.name]));
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
  return Response.json(buildCompareIndex(companies, (id) => names.get(id) ?? null, today));
}
