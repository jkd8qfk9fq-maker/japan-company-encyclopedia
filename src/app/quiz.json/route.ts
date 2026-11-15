import { buildQuizPool } from "@/lib/engagement-data";
import { companyRepository } from "@/lib/repositories";

/** The daily quiz's pool (JCE-052): every question generated from released entries' printed figures and descriptions. */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(buildQuizPool(await companyRepository.list()));
}
