/**
 * Query normalisation for Japanese search.
 *
 * A reader types "ｿﾆｰ", "ソニー", "sony", "ＳＯＮＹ" or "6758" and expects the
 * same result. NFKC folds full-width Latin/digits and half-width katakana into
 * their standard forms; lower-casing folds Latin case; hiragana is mapped to
 * katakana so "とよた" finds "トヨタ". Whitespace (including the ideographic
 * space) is removed, because Japanese names are not space-delimited.
 */
export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60))
    .replace(/[\s　・･\-‐]/g, "");
}
