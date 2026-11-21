import { buildQuizPool } from "@/lib/engagement-data";
import { buildLessonQuestions } from "@/lib/lesson-questions";
import { buildMicroCourse } from "@/lib/micro-lessons";
import { companyRepository } from "@/lib/repositories";

/**
 * The micro-lesson course (JCE-082): units of short lessons bound to questions generated from the released
 * entries — fixed for a given build of the data, like the twelve-step course beside it.
 */
export const dynamic = "force-static";

export async function GET() {
  const companies = await companyRepository.list();
  return Response.json(buildMicroCourse(buildQuizPool(companies), buildLessonQuestions(companies)));
}
