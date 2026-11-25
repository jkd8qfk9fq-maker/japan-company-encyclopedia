import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The number of companies a page states is computed from the data at build time, never typed in: a written-in count
 * drifts the day a company is released (an evaluation of 2026-11-17 found a page saying 2,030 while 2,051 were public).
 */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("company counts", () => {
  it("are never written into a page or component as a number", () => {
    const offenders: string[] = [];
    for (const file of [...files(join(process.cwd(), "src/app")), ...files(join(process.cwd(), "src/components"))]) {
      const text = readFileSync(file, "utf8");
      // A literal of 100 or more followed by 社 (「2,051社」「約2000社」); counts rendered from data are expressions. A
      // legend band (「100社以上」) is a threshold, not a count.
      for (const m of text.matchAll(/(?<![\w{$])(約\s*)?(\d{1,2},?\d{3}|\d{3})\s*社(?!以上)/g)) offenders.push(`${file}: ${m[0]}`);
    }
    expect(offenders).toEqual([]);
  });

  it("on the home page comes from the public company list", () => {
    const home = readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8");
    expect(home).toMatch(/companyRepository\.list\(\)/);
    // The label may carry its other languages (JCE-123); the figure under it is still the public list's length.
    expect(home).toMatch(/掲載企業[^\n]{0,60}<\/dt>[\s\S]{0,200}\{companies\.length\.toLocaleString\("ja-JP"\)\}/);
  });
});
