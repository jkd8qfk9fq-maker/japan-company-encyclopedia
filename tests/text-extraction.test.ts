import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * D10 (2026-11-17): what a reader without JavaScript gets — reader view, text extraction, link previews — must hold
 * the page's words. Two causes were found and removed; these keep them out.
 */
describe("text a reader view can extract", () => {
  it("company pages have no loading.tsx: in the static export it wrapped the page so <main> held only a skeleton and the content sat in a hidden block", () => {
    expect(existsSync("src/app/companies/[company-id]/loading.tsx")).toBe(false);
  });

  it("a glossary term is not a <button>: reader views delete buttons, and the word with them", () => {
    const source = readFileSync("src/components/rich-text/term-reference.tsx", "utf8");
    expect(source).not.toMatch(/^\s*<button\b/m);
    expect(source).toContain('role="button"');
    expect(source).toContain("tabIndex={0}");
    expect(source).toMatch(/e\.key === "Enter" \|\| e\.key === " "/);
  });
});
