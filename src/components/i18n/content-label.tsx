import { L } from "@/components/i18n/label";
import { T } from "@/components/i18n/t";
import { translationRepository } from "@/lib/repositories";

/**
 * A label that is entry content rather than interface text — a feature's title, a heading, a table's note
 * (JCE-148). Its stored reference translation wins when one exists and passed the checks (JCE-128); otherwise
 * the interface dictionary and the figure form answer, exactly as <L> does, so a name the dictionary knows
 * (an industry, a metric) keeps its English even where no translation was stored for it.
 */
export async function CL({ s }: { s: string }) {
  if (typeof s !== "string") return <>{s}</>;
  const en = await translationRepository.find("en", s);
  return en ? <T m={{ ja: s, en }} /> : <L s={s} />;
}
