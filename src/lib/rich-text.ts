/**
 * Rich text is plain text with one kind of markup:
 *
 *   [[term:semiconductor-manufacturing-equipment|半導体製造装置]]
 *   [[company:toyota|トヨタ自動車]]
 *   [[industry:automotive|自動車産業]]
 *   [[feature:japanese-automotive-industry|特集]]
 *
 * Why a string format rather than a nested block structure: content is written
 * (by researchers today, by a pipeline later) as prose, and prose should read
 * as prose in the data file. The markup is deliberately too small to express
 * formatting — emphasis and layout belong to components, not to content.
 *
 * Every reference is checked by tests/data-integrity.test.ts, so a link to an
 * id that does not exist fails the suite instead of rendering a dead link.
 */

export const REFERENCE_KINDS = ["term", "company", "industry", "feature"] as const;
export type ReferenceKind = (typeof REFERENCE_KINDS)[number];

export type RichTextSegment =
  | { type: "text"; text: string }
  | { type: "reference"; kind: ReferenceKind; id: string; label: string };

const PATTERN = /\[\[(term|company|industry|feature):([a-z0-9]+(?:-[a-z0-9]+)*)\|([^\]|]+)\]\]/g;

export function parseRichText(source: string): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  let last = 0;
  for (const match of source.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ type: "text", text: source.slice(last, index) });
    segments.push({
      type: "reference",
      kind: match[1] as ReferenceKind,
      id: match[2],
      label: match[3],
    });
    last = index + match[0].length;
  }
  if (last < source.length) segments.push({ type: "text", text: source.slice(last) });
  return segments;
}

/**
 * What a reader gets when some references point at pages that do not exist (yet): a company that is registered
 * but not released, an industry with no page. The integrity suite only proves the target is registered, so the
 * renderer has to decide whether a link would be a 404 — and, if so, keeps the label as plain text.
 */
export function withoutUnavailableLinks(
  segments: RichTextSegment[],
  available: { company: ReadonlySet<string>; industry: ReadonlySet<string> },
): RichTextSegment[] {
  const out: RichTextSegment[] = [];
  for (const segment of segments) {
    const dead =
      segment.type === "reference" &&
      ((segment.kind === "company" && !available.company.has(segment.id)) ||
        (segment.kind === "industry" && !available.industry.has(segment.id)));
    const next: RichTextSegment = dead ? { type: "text", text: segment.label } : { ...segment };
    const previous = out.at(-1);
    if (next.type === "text" && previous?.type === "text") previous.text += next.text;
    else out.push(next);
  }
  return out;
}

/** The text a reader sees, with markup removed. For metadata, search and alt text. */
export function toPlainText(source: string): string {
  return parseRichText(source)
    .map((s) => (s.type === "text" ? s.text : s.label))
    .join("");
}

export function extractReferences(source: string) {
  return parseRichText(source).filter(
    (s): s is Extract<RichTextSegment, { type: "reference" }> => s.type === "reference",
  );
}

/** Anything left looking like markup after parsing is a malformed reference. */
export function findMalformedMarkup(source: string): string[] {
  return parseRichText(source)
    .filter((s) => s.type === "text" && (s.text.includes("[[") || s.text.includes("]]")))
    .map((s) => (s as { text: string }).text);
}

const OPEN = new Set(["[", "「", "（", "(", "『"]);
const CLOSE = new Set(["]", "」", "）", ")", "』"]);

/**
 * The first sentence of a rich-text string, markup intact — what a card shows before "詳しく読む".
 *
 * A 。 inside a reference, a quotation or parentheses does not end the sentence: cutting 「…です。」 at its inner
 * 。 would leave an open quote, and cutting inside [[…]] would break the markup. The words are the entry's own,
 * shortened, never rephrased; the full text is always one click away.
 */
export function firstSentence(source: string): string {
  let depth = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (OPEN.has(ch)) depth++;
    else if (CLOSE.has(ch)) depth = Math.max(0, depth - 1);
    else if (ch === "。" && depth === 0) return source.slice(0, i + 1);
  }
  return source;
}
