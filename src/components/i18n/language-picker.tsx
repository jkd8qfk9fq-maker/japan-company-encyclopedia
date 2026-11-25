"use client";

// A Client Component: choosing a language writes this browser's settings and flips <html data-lang> at once.

import { Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { DEFAULT_LOCALE, LOCALE_META, LOCALES, type Locale } from "@/lib/i18n";
import { settingsStore } from "@/lib/storage/stores";
import { cn } from "@/lib/utils";
import { T } from "./t";

/** Show `locale` now — the same attributes the pre-paint script sets on the next load (JCE-123). */
function applyLanguage(locale: Locale) {
  const root = document.documentElement;
  if (locale === DEFAULT_LOCALE) root.removeAttribute("data-lang");
  else root.setAttribute("data-lang", locale);
  root.lang = LOCALE_META[locale].htmlLang;
}

function useLanguage(): [Locale, (locale: Locale) => void] {
  const settings = useLocalStore(settingsStore);
  return [
    settings.language,
    (locale) => {
      settingsStore.set({ ...settingsStore.get(), language: locale });
      applyLanguage(locale);
    },
  ];
}

/**
 * The header's language badge (JP, US…) beside the bell: tap it, pick a language. The badge itself is drawn in
 * every language and shown by CSS, so it is right before any script runs. Closes like the site menu: on a choice,
 * on navigation, on a tap outside, on Escape.
 */
export function LanguageMenu() {
  const [current, choose] = useLanguage();
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = (event: Event) => {
      const menu = ref.current;
      if (!menu?.open) return;
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !menu.contains(event.target as Node)) menu.open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <details ref={ref} className="relative">
      <summary className="flex size-11 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden">
        <span className="figures rounded border border-border px-1.5 py-0.5 text-[0.6875rem] leading-4 font-semibold tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
          <T m={Object.fromEntries(LOCALES.map((l) => [l, LOCALE_META[l].badge])) as Record<Locale, string>} />
        </span>
        <span className="sr-only">
          <T m={{ ja: "表示言語を選ぶ", en: "Choose language" }} />
        </span>
      </summary>
      <ul
        aria-label="Language"
        className="absolute top-12 right-0 z-50 w-48 overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-2xl"
      >
        {LOCALES.map((l) => (
          <li key={l}>
            <button
              type="button"
              lang={LOCALE_META[l].htmlLang}
              aria-pressed={current === l}
              onClick={() => {
                choose(l);
                if (ref.current) ref.current.open = false;
              }}
              className="flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm transition-colors hover:bg-muted"
            >
              <span className="figures w-7 text-[0.6875rem] font-semibold tracking-wider text-muted-foreground">{LOCALE_META[l].badge}</span>
              <span className="flex-1">{LOCALE_META[l].name}</span>
              {current === l && <Check className="size-4 text-seal" aria-hidden />}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** The same choice in 設定, as a radio group beside 表示モード. */
export function LanguageSetting() {
  const [current, choose] = useLanguage();
  return (
    <fieldset>
      <legend className="font-medium">
        <T m={{ ja: "表示言語", en: "Language" }} />
      </legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {LOCALES.map((l) => (
          <label
            key={l}
            lang={LOCALE_META[l].htmlLang}
            className={cn(
              "flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink",
              current === l ? "border-foreground" : "border-border hover:border-foreground/50",
            )}
          >
            <input type="radio" name="language" value={l} checked={current === l} onChange={() => choose(l)} className="size-4 accent-foreground" />
            <span className="figures text-[0.6875rem] font-semibold tracking-wider text-muted-foreground">{LOCALE_META[l].badge}</span>
            {LOCALE_META[l].name}
          </label>
        ))}
      </div>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">
        <T
          m={{
            ja: "メニューや見出しなどの表示が切り替わります。企業の解説・数字・出典は、もとの有価証券報告書の日本語のまま表示します。",
            en: "Switches menus, headings and labels. Company profiles, figures and sources stay in the Japanese of the original filings.",
          }}
        />
      </p>
    </fieldset>
  );
}
