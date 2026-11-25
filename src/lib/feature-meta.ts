import { toPlainText } from "@/lib/rich-text";
import type { Feature } from "@/types/feature";

/**
 * What a reader is told about a feature before reading it (JCE-111): how long it takes and what its sections are.
 * Both are derived from the body, so the card, the table of contents and the article can never disagree.
 */

/** Japanese prose is read at roughly 500 characters a minute; tables count by their rows, not their digits. */
const CHARS_PER_MINUTE = 500;

export function readingMinutes(feature: Feature): number {
  let chars = (feature.takeaways ?? []).reduce((n, t) => n + toPlainText(t).length, 0);
  for (const b of feature.body) {
    if (b.type === "paragraph" || b.type === "quote" || b.type === "company-callout") chars += toPlainText(b.text).length;
    else if (b.type === "heading") chars += b.text.length;
    else if (b.type === "data-table") chars += 40 * b.rows.length + b.note.length;
  }
  return Math.max(1, Math.round(chars / CHARS_PER_MINUTE));
}

/** The body's headings as anchors, in order — `section-1`, `section-2`, … by position among the headings. */
export function featureSections(feature: Feature): { id: string; title: string; index: number }[] {
  return feature.body
    .filter((b): b is Extract<Feature["body"][number], { type: "heading" }> => b.type === "heading")
    .map((b, i) => ({ id: `section-${i + 1}`, title: b.text, index: i + 1 }));
}
