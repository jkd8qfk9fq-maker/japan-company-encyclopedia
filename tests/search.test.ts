import { describe, expect, it } from "vitest";
import { normalizeForSearch } from "@/lib/search/normalize";
import { searchEntries, type SearchEntry } from "@/lib/search/search";

describe("normalizeForSearch", () => {
  it("folds half-width katakana, full-width Latin and case", () => {
    expect(normalizeForSearch("ｿﾆｰ")).toBe(normalizeForSearch("ソニー"));
    expect(normalizeForSearch("ＳＯＮＹ")).toBe("sony");
  });

  it("maps hiragana to katakana so a reading finds a katakana name", () => {
    expect(normalizeForSearch("とよた")).toBe("トヨタ");
  });

  it("drops spaces including the ideographic space", () => {
    expect(normalizeForSearch("三菱　商事")).toBe("三菱商事");
  });

  it("folds full-width digits in securities codes", () => {
    expect(normalizeForSearch("７２０３")).toBe("7203");
  });
});

// Synthetic entries: this tests ranking, not content.
const entry = (id: string, keys: string[], haystack: string): SearchEntry => ({
  kind: "company",
  id,
  title: id,
  subtitle: "",
  href: `/companies/${id}`,
  keys: keys.map(normalizeForSearch),
  haystack: normalizeForSearch(haystack),
});

describe("searchEntries", () => {
  const entries = [
    entry("a", ["アルファ電機"], "アルファ電機 電池"),
    entry("b", ["電池工業"], "電池工業"),
    entry("c", ["電池"], "電池"),
  ];

  it("ranks exact key, then key prefix, then text match", () => {
    expect(searchEntries(entries, "電池").map((e) => e.id)).toEqual(["c", "b", "a"]);
  });

  it("returns nothing for an empty query", () => {
    expect(searchEntries(entries, "  ")).toEqual([]);
  });
});
