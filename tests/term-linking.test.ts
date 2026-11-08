import { describe, expect, it } from "vitest";
import { terms } from "@/data/terms";
import { parseRichText } from "@/lib/rich-text";
import { linkTerms } from "@/lib/term-linking";

const linked = (text: string) =>
  linkTerms(parseRichText(text), terms).flatMap((s) => (s.type === "reference" ? [`${s.id}:${s.label}`] : []));

describe("glossary words found in plain text", () => {
  it("finds a term inside a longer word, by its longest name", () => {
    expect(linked("精密切削加工部品、精密研削加工部品")).toEqual(["cutting:切削加工", "grinding:研削加工"]);
    expect(linked("ジェネリック医薬品の製造")).toEqual(["generic-drug:ジェネリック医薬品"]);
  });

  it("links each term once per text", () => {
    expect(linked("切削加工と切削工具")).toEqual(["cutting:切削加工"]);
  });

  it("does not find a katakana or Latin name inside a longer word", () => {
    expect(linked("プレスリリースを出した")).toEqual([]);
    expect(linked("MICROSOFT と CRO")).toEqual(["cro:CRO"]);
  });

  it("leaves a term the text already marks up, and the very common accounting words, alone", () => {
    expect(linked("[[term:cutting|切削]]と切削加工")).toEqual(["cutting:切削"]);
    expect(linked("有価証券報告書のセグメント")).toEqual([]);
  });
});
