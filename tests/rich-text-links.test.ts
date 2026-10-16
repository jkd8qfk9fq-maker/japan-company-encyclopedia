import { describe, expect, it } from "vitest";
import { parseRichText, toPlainText, withoutUnavailableLinks } from "@/lib/rich-text";

/**
 * The integrity suite proves a referenced company is REGISTERED. A registered company that is not released has no
 * page, so the renderer must not link to it: a reader would land on a 404.
 */

const available = { company: new Set(["toyota"]), industry: new Set(["automotive"]) };
const run = (text: string) => withoutUnavailableLinks(parseRichText(text), available);

describe("withoutUnavailableLinks", () => {
  it("keeps a link to a released company and to an industry that has a page", () => {
    const segments = run("[[company:toyota|トヨタ]]は[[industry:automotive|自動車産業]]にいる。");
    expect(segments.filter((s) => s.type === "reference").map((s) => s.type === "reference" && s.id)).toEqual(["toyota", "automotive"]);
  });

  it("turns a link to an unreleased company back into its plain label, and joins the text around it", () => {
    const segments = run("提携先は[[company:not-released|未公開の会社]]です。");
    expect(segments).toEqual([{ type: "text", text: "提携先は未公開の会社です。" }]);
  });

  it("turns a link to an industry without a page into plain text", () => {
    expect(run("[[industry:funeral-memorial|葬祭・供養]]の会社")).toEqual([{ type: "text", text: "葬祭・供養の会社" }]);
  });

  it("never touches terms or features, and never changes what the reader reads", () => {
    const source = "[[term:segment|セグメント]]と[[company:toyota|トヨタ]]と[[company:gone|消えた会社]]と[[feature:x|特集]]";
    const segments = run(source);
    expect(segments.filter((s) => s.type === "reference").map((s) => s.type === "reference" && s.kind)).toEqual(["term", "company", "feature"]);
    expect(segments.map((s) => (s.type === "text" ? s.text : s.label)).join("")).toBe(toPlainText(source));
  });

  it("does not modify the segments it is given", () => {
    const parsed = parseRichText("[[company:gone|a]]b");
    const before = JSON.stringify(parsed);
    withoutUnavailableLinks(parsed, available);
    expect(JSON.stringify(parsed)).toBe(before);
  });
});
