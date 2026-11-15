import { buildConnections } from "@/lib/engagement-data";
import { companyRepository } from "@/lib/repositories";

/** The connection graph for /explore (JCE-052), built once at build time like search-index.json. */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(buildConnections(await companyRepository.list()));
}
