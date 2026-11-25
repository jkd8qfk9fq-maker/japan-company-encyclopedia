"use client";

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
