import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** The fonts a production build serves from the repository instead of downloading them from Google (JCE-040). */
const dir = join(process.cwd(), "src", "assets", "fonts", "google");
const responses = JSON.parse(readFileSync(join(dir, "responses.json"), "utf8")) as Record<string, string>;
const layout = readFileSync(join(process.cwd(), "src", "app", "layout.tsx"), "utf8");

describe("vendored Google Fonts", () => {
  it("has a stylesheet for each family the layout loads", () => {
    for (const family of ["Bodoni_Moda", "Noto_Sans_JP", "Noto_Serif_JP"]) {
      expect(layout).toContain(family);
      expect(Object.keys(responses).some((url) => url.includes(`family=${family.replaceAll("_", "+")}:`))).toBe(true);
    }
  });

  it("points every font file at a file in the repository, never at Google", () => {
    for (const css of Object.values(responses)) {
      expect(css).not.toMatch(/fonts\.gstatic\.com/);
      const files = [...css.matchAll(/url\(__FONT_DIR__\/(.+?)\)/g)].map((m) => m[1]!);
      expect(files.length).toBeGreaterThan(0);
      for (const file of files) expect(existsSync(join(dir, "files", file)), file).toBe(true);
    }
  });

  it("is what the static build uses", () => {
    expect(readFileSync(join(process.cwd(), "scripts", "build-static.mjs"), "utf8")).toContain("NEXT_FONT_GOOGLE_MOCKED_RESPONSES");
  });
});
