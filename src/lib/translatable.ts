/**
 * Which texts of an entry a reference translation may stand for (JCE-128). Pure and free of "@/" imports: the
 * translation script and the repository both use it, so what is translated and what may be shown are the same set.
 */
import { firstSentence } from "./rich-text.ts";
import { hasJapanese } from "./translation-check.ts";

/** Keys whose values are identifiers, references or page locations, never prose a reader reads. */
const SKIP = new Set(["id", "sourceIds", "locator", "url", "companyId", "industryId", "businessIds", "termId", "status", "sources", "updatedAt", "createdAt"]);

/**
 * The fields of a built feature a reference translation may stand for (JCE-138, implemented in JCE-148): the title
 * and the block body, with the card's own text (subtitle, topic, key figures, takeaways, image alt) beside them.
 * A feature is built, not stored, and the rest of its shape — related ids, sources, status, the publication date —
 * is not prose. The repository, the pipeline and the tests all collect a feature's texts through this one list, so
 * what is translated and what may be shown stay the same set.
 */
export const FEATURE_TRANSLATION_FIELDS: readonly string[] = ["title", "subtitle", "topic", "heroImageAlt", "takeaways", "keyFigures", "body"];

/**
 * Every Japanese string under `value`, with the first sentence of each as well when it is shorter — cards show
 * firstSentence(text), and that shorter text is looked up on its own.
 */
export function translatableStrings(value: unknown, fields?: readonly string[]): string[] {
  const out = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      if (!hasJapanese(v)) return;
      out.add(v);
      const first = firstSentence(v);
      if (first !== v) out.add(first);
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      for (const [k, child] of Object.entries(v)) if (!SKIP.has(k)) walk(child);
    }
  };
  if (fields && value && typeof value === "object") {
    for (const field of fields) walk((value as Record<string, unknown>)[field]);
  } else walk(value);
  return [...out];
}
