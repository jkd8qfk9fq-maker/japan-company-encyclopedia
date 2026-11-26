import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { T } from "@/components/i18n/t";
import { MENU_ITEMS, desktopNavigation, mobileNavigation, trainingNavigation } from "@/components/navigation/navigation-items";
import { DEFAULT_LOCALE, LOCALE_META, LOCALES, isLocale, localeCss } from "@/lib/i18n";
import { THEME_SCRIPT } from "@/lib/storage/theme-script";
import { settingsStore } from "@/lib/storage/stores";

/** JCE-123: the interface languages — every label in every language, shown by CSS, chosen before first paint. */
describe("interface languages", () => {
  it("names every locale with a badge and a native name", () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
    for (const l of LOCALES) {
      expect(LOCALE_META[l].badge).toMatch(/^[A-Z]{2}$/);
      expect(LOCALE_META[l].name.length).toBeGreaterThan(0);
    }
    expect(LOCALE_META.ja.badge).toBe("JP");
    expect(LOCALE_META.en.badge).toBe("US");
  });

  it("gives every navigation label text in every language", () => {
    const labels = [...desktopNavigation, ...mobileNavigation, ...trainingNavigation].map((i) => i.label);
    for (const item of MENU_ITEMS) labels.push(item.label, item.note);
    for (const m of labels) for (const l of LOCALES) expect(m[l].trim(), JSON.stringify(m)).not.toBe("");
  });

  it("renders each language in its own marked span", () => {
    const html = renderToStaticMarkup(createElement(T, { m: { ja: "ホーム", en: "Home" } }));
    expect(html).toBe('<span data-l="ja">ホーム</span><span data-l="en">Home</span>');
    // An empty translation is left out rather than drawn as an empty span.
    expect(renderToStaticMarkup(createElement(T, { m: { ja: "社", en: "" } }))).toBe('<span data-l="ja">社</span>');
  });

  it("hides every language but Japanese by default, and switches on <html data-lang>", () => {
    const css = localeCss();
    expect(css).toContain('[data-l]:not([data-l="ja"]){display:none}');
    for (const l of LOCALES.filter((x) => x !== DEFAULT_LOCALE)) {
      expect(css).toContain(`html[data-lang="${l}"] [data-l="ja"]{display:none}`);
      expect(css).toContain(`html[data-lang="${l}"] [data-l="${l}"]{display:contents}`);
    }
  });

  it("sets the language before first paint, accepting only known locales", () => {
    expect(THEME_SCRIPT).toContain('["en"].indexOf(l)>=0');
    expect(THEME_SCRIPT).toContain('r.setAttribute("data-lang",l)');
    // The script must still parse as JavaScript.
    expect(() => new Function(THEME_SCRIPT)).not.toThrow();
  });

  it("keeps the language in settings and drops an unknown one", () => {
    expect(settingsStore.fromRaw(JSON.stringify({ theme: "light", language: "en" }))).toEqual({ theme: "light", language: "en" });
    expect(settingsStore.fromRaw(JSON.stringify({ theme: "light", language: "xx" })).language).toBe("ja");
    expect(settingsStore.fromRaw(JSON.stringify({ theme: "dark" })).language).toBe("ja");
    expect(isLocale("en")).toBe(true);
    expect(isLocale("<script>")).toBe(false);
  });
});
