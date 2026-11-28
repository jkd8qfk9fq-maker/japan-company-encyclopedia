import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { THEME_SCRIPT } from "@/lib/storage/theme-script";

/**
 * The pre-paint theme script (src/lib/storage/theme-script.ts) is the first thing that applies the reader's
 * stored theme, and ThemeSync (root layout) re-applies the same value after hydration. These tests run the
 * script itself against a stubbed DOM/storage, so a change to the stored shape or the script's reading of it
 * fails here rather than as a light first paint for a reader who stored ダーク.
 */
function runScript(stored: string | null, osDark: boolean) {
  const classes = new Set<string>();
  const root = {
    classList: { toggle: (name: string, on: boolean) => (on ? classes.add(name) : classes.delete(name)) },
    style: {} as Record<string, string>,
    attrs: {} as Record<string, string>,
    lang: "ja",
    setAttribute(name: string, value: string) {
      this.attrs[name] = value;
    },
  };
  const localStorage = { getItem: (key: string) => (key === "user-settings" ? stored : null) };
  const matchMedia = () => ({ matches: osDark });
  const document = { documentElement: root };
  new Function("localStorage", "matchMedia", "document", THEME_SCRIPT)(localStorage, matchMedia, document);
  return { dark: classes.has("dark"), colorScheme: root.style.colorScheme };
}

describe("the pre-paint theme script", () => {
  it("applies a stored ダーク on the first paint, whatever the OS setting", () => {
    const stored = JSON.stringify({ theme: "dark", language: "ja" });
    expect(runScript(stored, false)).toEqual({ dark: true, colorScheme: "dark" });
    expect(runScript(stored, true)).toEqual({ dark: true, colorScheme: "dark" });
  });

  it("applies a stored ライト, and resolves 端末の設定 from the OS", () => {
    expect(runScript(JSON.stringify({ theme: "light", language: "ja" }), true).dark).toBe(false);
    expect(runScript(JSON.stringify({ theme: "system", language: "ja" }), true).dark).toBe(true);
    expect(runScript(JSON.stringify({ theme: "system", language: "ja" }), false).dark).toBe(false);
  });

  it("falls back to the house theme (dark) with nothing stored or an unreadable value", () => {
    expect(runScript(null, false).dark).toBe(true);
    expect(runScript("not-json", false).dark).toBe(true);
    expect(runScript(JSON.stringify({ theme: "neon" }), false).dark).toBe(true);
  });

  it("is re-applied after hydration by a component the root layout mounts on every page", () => {
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    expect(layout).toContain("<ThemeSync />");
    const setting = readFileSync("src/components/settings/theme-setting.tsx", "utf8");
    expect(setting).toContain("export function ThemeSync()");
    // The re-apply reads the same store the script reads, through the same apply function as the setting.
    expect(setting).toContain("useLocalStore(settingsStore)");
    expect(setting).toContain("applyTheme(settings.theme)");
  });
});
