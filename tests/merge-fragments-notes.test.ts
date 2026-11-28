import { describe, expect, it } from "vitest";
import { assertNoStringifiedNotes, reviewNoteText } from "../scripts/pipeline/merge-fragments.mjs";

/**
 * The e365cf99b regression: a fragment's needsReview item written as an object
 * ({ topic, detail, sourceIds, locator }) used to be stringified by `${stage}: ${w}`
 * into "businessModel: [object Object]" and published in the entry's status notes
 * (32 companies; the readable text survived only in the fragment files). The merge
 * now normalizes the object form to text, refuses items with no readable text, and
 * fails loudly if a stringified note ever reaches the status.
 */
describe("reviewNoteText: a fragment note as one line of text", () => {
  it("passes a plain string through unchanged", () => {
    expect(reviewNoteText("財務: 変則決算のため確認を要する")).toEqual({ text: "財務: 変則決算のため確認を要する", problem: null });
  });

  it("renders the object form as topic：detail (the acsl shape)", () => {
    const out = reviewNoteText({
      topic: "変則決算（決算期変更による9か月決算）",
      detail: "第10期（2021年12月期）は決算期変更により9か月間です。登録にあたって人の確認を要します。",
    });
    expect(out.problem).toBeNull();
    expect(out.text).toBe("変則決算（決算期変更による9か月決算）：第10期（2021年12月期）は決算期変更により9か月間です。登録にあたって人の確認を要します。");
    expect(out.text).not.toContain("[object Object]");
  });

  it("keeps the source ids and locator an object carries", () => {
    const out = reviewNoteText({ topic: "分類の暫定判断", detail: "有報の事業区分を確認すること", sourceIds: ["filing-2026"], locator: "第1部 企業の概況" });
    expect(out.text).toBe("分類の暫定判断：有報の事業区分を確認すること（出典: filing-2026）（箇所: 第1部 企業の概況）");
  });

  it("renders an object with only a detail, or only a topic", () => {
    expect(reviewNoteText({ detail: "詳細だけの注記" }).text).toBe("詳細だけの注記");
    expect(reviewNoteText({ topic: "件名だけの注記" }).text).toBe("件名だけの注記");
  });

  it("refuses an item with no readable text instead of stringifying it", () => {
    for (const bad of [{}, { topic: 3 }, { sourceIds: ["x"] }, null, 42, undefined]) {
      const out = reviewNoteText(bad);
      expect(out.text).toBeNull();
      expect(out.problem).not.toBeNull();
    }
  });
});

describe("assertNoStringifiedNotes: the status gate", () => {
  it("accepts ordinary notes", () => {
    expect(() => assertNoStringifiedNotes(["businessModel: 変則決算のため確認を要する"])).not.toThrow();
  });

  it("fails the merge on a stringified note, naming it", () => {
    expect(() => assertNoStringifiedNotes(["businessModel: [object Object]"])).toThrow(/\[object Object\]/);
  });
});
