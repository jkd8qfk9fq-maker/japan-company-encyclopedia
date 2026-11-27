import { buildCompareLightIndex } from "@/lib/compare-index";
import { companyRepository, industryRepository } from "@/lib/repositories";

/**
 * The light 見比べ index (JCE-149): id, name, industry and revenue for every released company — what the
 * tool needs to offer search and peer suggestions before any full row is downloaded.
 */
export const dynamic = "force-static";

export async function GET() {
  const [companies, industries] = await Promise.all([companyRepository.list(), industryRepository.list()]);
  const names = new Map<string, string>(industries.map((i) => [i.id, i.name]));
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
  return Response.json(buildCompareLightIndex(companies, (id) => names.get(id) ?? null, today));
}
