import { buildDiscoverFeed } from "@/lib/discover";
import { companyRepository } from "@/lib/repositories";

/**
 * The discovery feed's cards as a static file, built once at build time like search-index.json. Only /discover and
 * its collection fetch it, so no other page carries it.
 */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(buildDiscoverFeed(await companyRepository.list()));
}
