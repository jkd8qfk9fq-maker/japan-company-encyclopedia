/**
 * The site's languages (JCE-123). The pages are built once, in Japanese, and the interface — the header, menus,
 * bottom bar, footer, settings and the home page's headings — carries each language beside it; the reader's choice
 * (kept in this browser's settings) shows one and hides the rest with CSS, before first paint. So switching needs no
 * second build, no second set of URLs and no request, and every static page stays one file.
 *
 * Interface text is translated by hand, here and in each component. Entry text (a company's business, an industry's
 * explanation, a glossary entry) is shown in an AI reference translation when one passed the mechanical checks
 * (JCE-128, src/lib/translation-check.ts) — the same figures, links and Latin-script names — and in Japanese
 * otherwise; the reader is told which prevails (LANGUAGE_NOTE).
 *
 * Adding a language: add it to LOCALES and LOCALE_META, then give every Message its text — `Message` requires each
 * locale, so the type check lists what is missing.
 */

export const LOCALES = ["ja", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ja";

/** `badge` is what the header shows (JP, US); `name` is the language in its own words, for the picker. */
export const LOCALE_META: Record<Locale, { badge: string; name: string; htmlLang: string }> = {
  ja: { badge: "JP", name: "日本語", htmlLang: "ja" },
  en: { badge: "US", name: "English", htmlLang: "en" },
};

export type Message = Record<Locale, string>;

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * The CSS that shows the chosen language. Without a choice (or without script) only Japanese shows; with
 * `<html data-lang="xx">` only xx shows. Generated from LOCALES, so a new language needs no hand-written rule.
 */
export function localeCss(): string {
  const others = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
  return [
    // The shown language's span is `display: contents`: it adds no box, so a sentence wrapped whole (text and the
    // links inside it, JCE-128) lays out in a flex row or a grid exactly as the bare text and links did.
    `[data-l="${DEFAULT_LOCALE}"]{display:contents}[data-l]:not([data-l="${DEFAULT_LOCALE}"]){display:none}`,
    ...others.map((l) => `html[data-lang="${l}"] [data-l="${DEFAULT_LOCALE}"]{display:none}html[data-lang="${l}"] [data-l="${l}"]{display:contents}`),
    // A block that exists only for another language (LANGUAGE_NOTE) stays hidden for Japanese readers.
  ].join("");
}

/** Shown under the header to a reader who chose a language other than Japanese. */
export const LANGUAGE_NOTE: Message = {
  ja: "",
  en: "Company text is an AI reference translation of the Japanese, made from the companies' filings; where they differ, the Japanese prevails. Text not yet translated is shown in Japanese. Switch to 日本語 to read the original.",
};
