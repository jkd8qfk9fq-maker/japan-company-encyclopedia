import { describe, expect, it } from "vitest";
import { parseContent, stockIndexSchema } from "../src/lib/content/schemas";
import { mapIndex } from "../src/lib/stock-index";
import { stockIndexes } from "../src/data/stock-indexes";
import type { Company } from "../src/types/company";
import type { StockIndex } from "../src/types/stock-index";

/**
 * Stock index lists are the provider's work: shown only with a record of the provider's terms, matched to pages by
 * 証券コード alone, and never carrying anything but who is in the index.
 */

const index = (over: Partial<StockIndex> = {}): StockIndex => ({
  id: "sample-index",
  name: "サンプル指数",
  publisher: "提供者",
  asOf: "2026-09-30",
  usageTerms: "提供者の利用規約（2026-10-01確認）",
  description: "サンプルです。",
  constituents: [
    { code: "1000", name: "エー" },
    { code: "2000", name: "ビー" },
    { code: "9999", name: "未掲載株式会社" },
  ],
  sourceIds: ["list"],
  sources: [{ id: "list", title: "構成銘柄一覧", publisher: "提供者", url: "https://example.com", accessedAt: "2026-10-01" }],
  ...over,
});

const company = (id: string, code: string, industry: string, ties: [string, string][] = []): Company =>
  ({
    id,
    code,
    name: id,
    industries: [{ industryId: industry, primary: true }],
    relatedCompanies: ties.map(([companyId, relationship]) => ({ companyId, relationship, description: "", sourceIds: ["s"] })),
  }) as unknown as Company;

describe("stockIndexSchema", () => {
  it("refuses a list without a record of the provider's terms", () => {
    const withoutTerms: Partial<StockIndex> = index();
    delete withoutTerms.usageTerms;
    expect(() => parseContent(stockIndexSchema, withoutTerms, "test")).toThrow(/usageTerms/);
  });

  it("refuses a constituent without a 4-character securities code", () => {
    expect(() => parseContent(stockIndexSchema, index({ constituents: [{ code: "トヨタ", name: "x" }] }), "test")).toThrow();
  });
});

describe("mapIndex", () => {
  it("matches by code, groups by primary industry, lists the unmatched last under the provider's name", () => {
    const map = mapIndex(index(), [company("a", "1000", "automotive"), company("b", "2000", "automotive"), company("c", "3000", "it")]);
    expect(map.covered).toBe(2);
    expect(map.groups.map((g) => [g.industryId, g.members.map((m) => m.company?.id ?? m.name)])).toEqual([
      ["automotive", ["a", "b"]],
      [null, ["未掲載株式会社"]],
    ]);
  });

  it("draws only ties between two constituents", () => {
    const map = mapIndex(index(), [
      company("a", "1000", "automotive", [["b", "supplier"], ["c", "customer"]]),
      company("b", "2000", "automotive"),
      company("c", "3000", "it"),
    ]);
    expect(map.ties.map((t) => `${t.from.id}>${t.to.id}:${t.kind}`)).toEqual(["a>b:supplier"]);
  });
});

describe("registered stock indexes", () => {
  it("every source id resolves and no code appears twice", () => {
    for (const registered of stockIndexes) {
      const ids = new Set(registered.sources.map((s) => s.id));
      expect(registered.sourceIds.every((id) => ids.has(id))).toBe(true);
      const codes = registered.constituents.map((c) => c.code);
      expect(new Set(codes).size).toBe(codes.length);
    }
  });
});
