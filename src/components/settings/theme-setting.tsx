"use client";

import { useLayoutEffect } from "react";
import { T } from "@/components/i18n/t";
import { useLocalStore } from "@/hooks/use-local-store";
import type { Message } from "@/lib/i18n";
import { settingsStore, type ThemePreference } from "@/lib/storage/stores";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemePreference; label: Message }[] = [
  { value: "system", label: { ja: "端末の設定に合わせる", en: "Match device" } },
  { value: "light", label: { ja: "ライト", en: "Light" } },
  { value: "dark", label: { ja: "ダーク", en: "Dark" } },
];

function applyTheme(theme: ThemePreference) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/**
 * Re-applies the stored theme after hydration, on every page (mounted once in the root layout).
 *
 * The pre-paint script in layout.tsx sets the `dark` class on <html> while the HTML is parsed, but that
 * class is not React's: a remount or an attribute pass over <html> during hydration can drop it, and the
 * page then paints in the light `:root` palette even for a reader who stored ダーク — the front page, the
 * largest static page, is where this was seen. useLayoutEffect runs before the browser paints the hydrated
 * page, so re-applying the same stored value here closes that gap without a second mechanism: the store is
 * the same `user-settings` the script reads, and applyTheme is the same function the setting below uses.
 * Subscribing through useLocalStore also re-applies when the setting changes in another tab.
 */
export function ThemeSync() {
  const settings = useLocalStore(settingsStore);
  useLayoutEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);
  return null;
}

/** Writes the same `user-settings` key the pre-paint script in layout.tsx reads. */
export function ThemeSetting() {
  const settings = useLocalStore(settingsStore);

  return (
    <fieldset>
      <legend className="font-medium"><T m={{ ja: "表示モード", en: "Theme" }} /></legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const checked = settings.theme === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink",
                checked ? "border-foreground" : "border-border hover:border-foreground/50",
              )}
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={checked}
                onChange={() => {
                  settingsStore.set({ ...settings, theme: option.value });
                  applyTheme(option.value);
                }}
                className="size-4 accent-foreground"
              />
              <T m={option.label} />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
