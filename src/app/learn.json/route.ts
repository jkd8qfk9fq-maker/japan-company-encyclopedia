import { buildQuizPool } from "@/lib/engagement-data";
import { buildCourseSteps } from "@/lib/learn-course";
import { companyRepository } from "@/lib/repositories";
import { UI_DICTIONARY_EN } from "@/lib/ui-dictionary-en";

/** The 有報の読み方入門 course (JCE-072): twelve steps arranged from the quiz pool, fixed for a given build of the data. */
export const dynamic = "force-static";

export async function GET() {
  const steps = buildCourseSteps(buildQuizPool(await companyRepository.list()));
  // The themes' names and guides are interface text: their English is the dictionary's, resolved here on the
  // server so the dictionary itself never reaches the browser bundle (JCE-148).
  return Response.json(
    steps.map((s) => ({ ...s, themeEn: UI_DICTIONARY_EN[s.theme], introEn: UI_DICTIONARY_EN[s.intro] })),
  );
}
