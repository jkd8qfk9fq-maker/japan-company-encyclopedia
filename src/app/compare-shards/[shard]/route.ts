import { buildCompareShard } from "@/lib/compare-index";
import { COMPARE_SHARDS } from "@/lib/compare";
import { companyRepository, industryRepository } from "@/lib/repositories";

/**
 * One shard of the full 見比べ rows (JCE-149): the tool downloads only the shards holding the companies
 * being compared, so the page no longer waits on every company's row before it can show two or three.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: COMPARE_SHARDS }, (_, shard) => ({ shard: String(shard) }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ shard: string }> }) {
  const shard = Number((await params).shard);
  const [companies, industries] = await Promise.all([companyRepository.list(), industryRepository.list()]);
  const names = new Map<string, string>(industries.map((i) => [i.id, i.name]));
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
  return Response.json(buildCompareShard(companies, (id) => names.get(id) ?? null, today, shard));
}
