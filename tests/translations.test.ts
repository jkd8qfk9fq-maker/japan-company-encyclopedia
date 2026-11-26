import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { industries } from "@/data/industries";
import { terms } from "@/data/terms";
import { parseContent, translationFileSchema } from "@/lib/content/schemas";
import { translatableStrings } from "@/lib/translatable";
import { checkTranslation, englishFigures, hashText, japaneseFigures } from "@/lib/translation-check";

// JCE-124: reference translations are shown only when they pass these checks; the files must hold nothing else.

describe("checkTranslation", () => {
  it("folds 兆・億・百万 into one figure and matches converted English amounts", () => {
    expect(japaneseFigures("売上高は2,517億71百万円")).toEqual([251_771_000_000]);
    expect(englishFigures("¥251.771 billion").digits).toEqual([251_771_000_000]);
    expect(checkTranslation("2026年3月期の売上収益は450,760百万円でした。", "Revenue for the fiscal year ended March 2026 was ¥450,760 million.")).toEqual([]);
    expect(checkTranslation("2026年3月期の売上収益は450,760百万円でした。", "Revenue for the fiscal year ended March 2026 was ¥450.76 billion.")).toEqual([]);
  });

  it("rejects a changed, dropped or added figure", () => {
    expect(checkTranslation("売上高は100億円です。", "Revenue is ¥1 billion.")).not.toEqual([]);
    expect(checkTranslation("2025年に設立されました。", "It was founded.")).not.toEqual([]);
    expect(checkTranslation("業界の大手です。", "It is the No. 1 company in the industry.")).not.toEqual([]);
  });

  it("lets a month, ordinal or small number word stand for a digit the Japanese has; never adds a month", () => {
    expect(checkTranslation("第3四半期に2社を買収しました。", "It acquired two companies in the third quarter.")).toEqual([]);
    expect(checkTranslation("買収しました。", "It made its first acquisition.")).toEqual([]);
    expect(checkTranslation("買収しました。", "It made an acquisition in March.")).not.toEqual([]);
    expect(checkTranslation("3月に買収しました。", "It made an acquisition.")).not.toEqual([]);
  });

  it("requires the same links, Latin-script names and no Japanese left", () => {
    expect(checkTranslation("[[company:toyota|トヨタ自動車]]の子会社です。", "A subsidiary of [[company:toyota|Toyota Motor]].")).toEqual([]);
    expect(checkTranslation("[[company:toyota|トヨタ自動車]]の子会社です。", "A subsidiary of Toyota Motor.")).not.toEqual([]);
    expect(checkTranslation("[[company:toyota|トヨタ自動車]]の子会社です。", "A subsidiary of [[company:honda|Toyota Motor]].")).not.toEqual([]);
    expect(checkTranslation("「Zoff」を展開します。", "It runs stores.")).not.toEqual([]);
    expect(checkTranslation("メガネを販売します。", "It sells メガネ.")).not.toEqual([]);
  });

  it("rejects a translation much shorter than its source", () => {
    expect(checkTranslation("健康や医療の分野で使われる製品を製造・販売する事業です。", "Health products.")).not.toEqual([]);
  });
});

const ROOT = join(process.cwd(), "src", "data", "translations", "en");
const SUBJECTS = {
  companies: { kind: "company", get: new Map<string, unknown>(companies.map((c) => [c.id, c])) },
  industries: { kind: "industry", get: new Map<string, unknown>(industries.map((i) => [i.id, i])) },
  terms: { kind: "term", get: new Map<string, unknown>(terms.map((t) => [t.id, t])) },
} as const;

describe("translation files", () => {
  for (const [folder, { kind, get }] of Object.entries(SUBJECTS)) {
    const dir = join(ROOT, folder);
    const names = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")) : [];

    it(`${folder}: each file is valid, named for its subject, and the subject exists`, () => {
      for (const name of names) {
        const file = parseContent(translationFileSchema, JSON.parse(readFileSync(join(dir, name), "utf8")), name);
        expect(file.subject.kind, name).toBe(kind);
        expect(`${file.subject.id}.json`, name).toBe(name);
        expect(get.has(file.subject.id), `${name}: no such ${kind}`).toBe(true);
      }
    });

    it(`${folder}: every translation that matches a current text passes the checks`, () => {
      const failures: string[] = [];
      for (const name of names) {
        const file = translationFileSchema.parse(JSON.parse(readFileSync(join(dir, name), "utf8")));
        const subject = get.get(file.subject.id);
        if (!subject) continue;
        for (const ja of translatableStrings(subject)) {
          const en = file.entries[hashText(ja)];
          if (!en) continue;
          const problems = checkTranslation(ja, en);
          if (problems.length > 0) failures.push(`${name}: ${problems.join(" / ")} — ${ja.slice(0, 40)}`);
        }
      }
      expect(failures).toEqual([]);
    });
  }
});
