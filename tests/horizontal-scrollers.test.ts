import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Hidden screen-reader text inside a horizontal scroller widened the page on phones until the scroller became its
 * containing block (2026-11-19: 戦略と強み made iPhone Safari zoom the whole page out). The rule lives in globals.css.
 */
describe("horizontal scrollers", () => {
  it("contain what they hold, so off-screen hidden text cannot widen the page", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const layer = css.slice(css.indexOf("@layer components {"));
    expect(layer).toMatch(/\.overflow-x-auto\s*\{\s*position:\s*relative;\s*\}/);
  });
});
