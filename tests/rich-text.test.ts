import { describe, expect, it } from "vitest";
import { findMalformedMarkup, parseRichText, toPlainText } from "@/lib/rich-text";

describe("parseRichText", () => {
  it("returns plain text untouched", () => {
    expect(parseRichText("自動車を作る会社。")).toEqual([{ type: "text", text: "自動車を作る会社。" }]);
  });

  it("splits references out of surrounding text", () => {
    expect(
      parseRichText("東京エレクトロンは[[term:semiconductor-manufacturing-equipment|半導体製造装置]]を作る。"),
    ).toEqual([
      { type: "text", text: "東京エレクトロンは" },
      {
        type: "reference",
        kind: "term",
        id: "semiconductor-manufacturing-equipment",
        label: "半導体製造装置",
      },
      { type: "text", text: "を作る。" },
    ]);
  });

  it("handles adjacent references of different kinds", () => {
    const segments = parseRichText("[[company:toyota|トヨタ]][[industry:automotive|自動車]]");
    expect(segments.map((s) => s.type === "reference" && s.kind)).toEqual(["company", "industry"]);
  });

  it("does not accept a non-kebab-case id as a reference", () => {
    const text = "[[company:Toyota|トヨタ]]";
    expect(parseRichText(text)).toEqual([{ type: "text", text }]);
    expect(findMalformedMarkup(text)).toHaveLength(1);
  });

  it("does not accept an unknown kind", () => {
    expect(findMalformedMarkup("[[stock:toyota|株価]]")).toHaveLength(1);
  });
});

describe("toPlainText", () => {
  it("keeps labels and drops markup", () => {
    expect(toPlainText("[[company:toyota|トヨタ自動車]]は自動車を作る。")).toBe("トヨタ自動車は自動車を作る。");
  });
});
