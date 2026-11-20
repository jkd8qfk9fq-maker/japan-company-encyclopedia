import { buildQuizPool } from "@/lib/engagement-data";
import { buildCourseSteps } from "@/lib/learn-course";
import { companyRepository } from "@/lib/repositories";

/** The 有報の読み方入門 course (JCE-072): twelve steps arranged from the quiz pool, fixed for a given build of the data. */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(buildCourseSteps(buildQuizPool(await companyRepository.list())));
}
