import { describe, expect, it } from "vitest";
import { cluesOf, headingOf, locate, sourcedItems } from "../scripts/pipeline/find-locators.mjs";

/**
 * The read-only locator finder: it proposes the printed heading an item rests on only when the item's own clues point
 * at one section, and otherwise says so. Nothing is written (the backfill is a later, approved step).
 */
const blocks = {
  CompanyHistoryTextBlock: "1961年3月日産陸送株式会社を設立。2001年4月商号を株式会社ゼロに変更。2025年6月",
  CriticalContractsTextBlock: "2001年4月日産自動車株式会社と車両運送委託契約を締結。2025年6月",
  NotesSegmentInformationConsolidatedFinancialStatementsIFRSTextBlock: "国内自動車関連事業69,519セグメント利益9,0472025年6月",
  OverviewOfAffiliatedEntitiesTextBlock: "(親会社)TanChongInternationalLimited2025年6月",
  BusinessRisksTextBlock: "2025年6月",
  MajorShareholdersTextBlock: "2025年6月",
  AuditsTextBlock: "監査の状況",
};

describe("headings", () => {
  it("are the ones the 有報 prints, and unmapped sections are not searched", () => {
    expect(headingOf("CompanyHistoryTextBlock")).toBe("【沿革】");
    expect(headingOf("NotesSegmentInformationConsolidatedFinancialStatementsIFRSTextBlock")).toBe("【経理の状況】（セグメント情報等）");
    expect(headingOf("AuditsTextBlock")).toBeNull();
  });
});

describe("clues", () => {
  it("convert amounts to the 百万円 the filing prints, and keep years, dates and quoted terms", () => {
    const c = cluesOf({ name: "国内", description: "2025年6月期の売上収益は695億19百万円、「業界初」の施設" }, "businesses");
    expect(c).toEqual(expect.arrayContaining(["69,519", "2025年6月", "業界初"]));
    expect(cluesOf({ year: 1961, title: "設立" }, "history")).toContain("1961年");
  });
});

describe("locating", () => {
  it("proposes the one section that holds strictly the most clues", () => {
    expect(locate(["69,519", "9,047"], blocks, "businesses")).toMatchObject({ result: "proposed", locator: "【経理の状況】（セグメント情報等）", how: "unique" });
  });

  it("ignores a clue printed almost everywhere (the fiscal year)", () => {
    expect(locate(["2025年6月"], blocks, "businesses").result).toBe("not-found");
  });

  it("does not move an item away from its own section on a count — a person decides", () => {
    const r = locate(["2001年4月", "日産自動車"], blocks, "history");
    expect(r.result).toBe("ambiguous");
    expect(r.candidates).toEqual(["【経営上の重要な契約等】", "【沿革】"]);
  });

  it("settles a tie only by the item kind's own section", () => {
    expect(locate(["2001年4月"], blocks, "history")).toMatchObject({ result: "proposed", locator: "【沿革】", how: "home-tiebreak" });
    expect(locate(["2001年4月"], blocks, "businesses").result).toBe("ambiguous");
  });

  it("walks every sourced item, children and perspectives included", () => {
    const entry = {
      businesses: [{ name: "a", sourceIds: ["y"], children: [{ name: "b", sourceIds: ["y"] }] }],
      history: [{ year: 2001, title: "x", sourceIds: ["y"] }],
      perspectives: { strategy: { disclosed: { text: "t", asOf: "2026-06-30", sourceIds: ["y"] } } },
      financials: [{ periodEnd: "2026-03-31", sourceIds: ["y"] }],
    };
    expect(sourcedItems(entry).map((i: { path: string }) => i.path)).toEqual(["businesses[0]", "businesses[0].children[0]", "history[0]", "perspectives.strategy.disclosed", "financials[0]"]);
  });
});
