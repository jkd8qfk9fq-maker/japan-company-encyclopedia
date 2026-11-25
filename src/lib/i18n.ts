/**
 * The site's languages (JCE-123). The pages are built once, in Japanese, and the interface — the header, menus,
 * bottom bar, footer, settings and the home page's headings — carries each language beside it; the reader's choice
 * (kept in this browser's settings) shows one and hides the rest with CSS, before first paint. So switching needs no
 * second build, no second set of URLs and no request, and every static page stays one file.
 *
 * Only interface text is translated. A company's own content — its business, history, figures and their labels —
 * stays in the Japanese of the filing it was taken from: a translation would be a new claim no filing states
 * (invariant 1), so a reader of another language is told so instead (LANGUAGE_NOTE).
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
    `[data-l]:not([data-l="${DEFAULT_LOCALE}"]){display:none}`,
    ...others.map((l) => `html[data-lang="${l}"] [data-l="${DEFAULT_LOCALE}"]{display:none}html[data-lang="${l}"] [data-l="${l}"]{display:revert}`),
    // A block that exists only for another language (LANGUAGE_NOTE) stays hidden for Japanese readers.
  ].join("");
}

/** Shown under the header to a reader who chose a language other than Japanese. */
export const LANGUAGE_NOTE: Message = {
  ja: "",
  en: "Menus and labels are in English. Company profiles, figures and their sources stay in the Japanese of the filings they come from — they are not machine-translated.",
};
