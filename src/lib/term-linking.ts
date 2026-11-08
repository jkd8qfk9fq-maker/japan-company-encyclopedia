import type { RichTextSegment } from "@/lib/rich-text";
import type { Term } from "@/types/term";

/**
 * Glossary words found in plain text, so every company and industry page explains the terms it uses without each
 * entry having to mark them up (operator request, 2026-11-08). Explicit [[term:…]] markup still works and wins:
 * a term already referenced in a text is not linked again there.
 *
 * Rules, chosen so the page does not turn into a field of underlines:
 *  - each term is linked at most once per text (its first occurrence);
 *  - the longest name wins where names overlap (「精密切削加工」 is found as 切削加工, not as 切削 + 加工);
 *  - Latin names (OEM, SaaS…) match only as whole words, so 「EMS」 is not found inside 「SYSTEMS」, and katakana names
 *    only as a whole katakana run, so 「リース」 is not found inside 「リリース」;
 *  - a few terms that appear in almost every entry are left to explicit markup only (NOT_AUTOMATIC).
 */

/** In nearly every entry; linking each first occurrence would underline every paragraph. */
const NOT_AUTOMATIC = new Set(["annual-securities-report", "segment", "consolidated-subsidiary", "subsidiary"]);

type Matcher = { pattern: RegExp; byName: Map<string, Term> };

let cache: { terms: readonly Term[]; matcher: Matcher | null } | null = null;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function matcherFor(terms: readonly Term[]): Matcher | null {
  if (cache?.terms === terms) return cache.matcher;
  const byName = new Map<string, Term>();
  for (const term of terms) {
    if (NOT_AUTOMATIC.has(term.id)) continue;
    for (const name of [term.term, ...(term.aliases ?? [])]) {
      // Two characters is the floor: one kana or kanji would match inside unrelated words.
      if (name.length >= 2 && !byName.has(name)) byName.set(name, term);
    }
  }
  const names = [...byName.keys()].sort((a, b) => b.length - a.length);
  const matcher = names.length
    ? {
        pattern: new RegExp(
          names
            .map((n) =>
              /^[\x20-\x7e]+$/.test(n)
                ? `(?<![A-Za-z0-9])${escape(n)}(?![A-Za-z0-9])`
                : /^[\u30a0-\u30ff・]+$/.test(n)
                  ? `(?<![\u30a1-\u30fa\u30fc])${escape(n)}(?![\u30a1-\u30fa\u30fc])`
                  : escape(n),
            )
            .join("|"),
          "g",
        ),
        byName,
      }
    : null;
  cache = { terms, matcher };
  return matcher;
}

/** Splits the text segments where glossary terms occur; references and the rest are left as they are. */
export function linkTerms(segments: RichTextSegment[], terms: readonly Term[]): RichTextSegment[] {
  const matcher = matcherFor(terms);
  if (!matcher) return segments;
  const used = new Set(segments.flatMap((s) => (s.type === "reference" && s.kind === "term" ? [s.id] : [])));
  const out: RichTextSegment[] = [];
  for (const segment of segments) {
    if (segment.type !== "text") {
      out.push(segment);
      continue;
    }
    let last = 0;
    for (const match of segment.text.matchAll(matcher.pattern)) {
      const term = matcher.byName.get(match[0])!;
      if (used.has(term.id)) continue;
      used.add(term.id);
      const index = match.index ?? 0;
      if (index > last) out.push({ type: "text", text: segment.text.slice(last, index) });
      out.push({ type: "reference", kind: "term", id: term.id, label: match[0] });
      last = index + match[0].length;
    }
    if (last < segment.text.length) out.push({ type: "text", text: segment.text.slice(last) });
  }
  return out;
}
