import { buildPredictionData } from "@/lib/predictions";
import { companyRepository } from "@/lib/repositories";

/**
 * The figures predictions are checked against (JCE-083): each released company's annual records and the
 * titles of the sources they rest on — the smallest slice of an entry the training layer needs, fixed for a
 * given build of the data, like /lessons.json. The reader's predictions themselves never leave their browser.
 */
export const dynamic = "force-static";

export async function GET() {
  const companies = await companyRepository.list();
  return Response.json(buildPredictionData(companies));
}
