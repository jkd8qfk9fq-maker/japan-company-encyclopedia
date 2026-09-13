"use client";

import { useLocalStore } from "@/hooks/use-local-store";
import { settingsStore, type ThemePreference } from "@/lib/storage/stores";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "端末の設定に合わせる" },
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
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
      <legend className="font-medium">表示モード</legend>
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
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
