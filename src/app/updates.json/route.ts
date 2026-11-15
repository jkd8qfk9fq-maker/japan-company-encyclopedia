import { buildUpdates } from "@/lib/engagement-data";
import { companyRepository, revisionRepository } from "@/lib/repositories";

/**
 * Recent filings of every released company (JCE-052). The reader's browser compares them with the companies it
 * follows; which companies those are never leaves the browser.
 */
export const dynamic = "force-static";

export async function GET() {
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
  return Response.json(buildUpdates(await companyRepository.list(), await revisionRepository.list(), today));
}
