import { describe, expect, it } from "vitest";
import websitesJson from "@/data/websites.json";
import { companies } from "@/data/companies";
import { strategyTargets, growthBusinessIds, quotedNames, sentences } from "@/lib/strategy";
import type { Company } from "@/types/company";

describe("targets read from a strategy (JCE-055)", () => {
  it("takes the figures and the year the company writes for them", () => {
    const text =
      "2025年4月にスタートした中期経営計画「GOOD FOODS Recipe2」で、事業を進め、2030年には海外所在地売上高比率50％、売上高1兆円を稼げる企業を目指すとしています。";
    expect(strategyTargets(text).map((t) => [t.year, t.metric, t.value])).toEqual([
      ["2030年", "海外所在地売上高比率", "50%"],
      ["2030年", "売上高", "1兆円"],
    ]);
    expect(quotedNames(text)).toEqual(["GOOD FOODS Recipe2"]);
  });

  it("does not read a result, a part of the company, or a ratio it does not show as a target", () => {
    expect(strategyTargets("「中期経営計画2026」では売上高1兆円を達成した一方、課題を残しました。")).toEqual([]);
    expect(strategyTargets("2030年度にAIおよび生成AI関連の売上高100億円を目指しています。")).toEqual([]);
    expect(strategyTargets("2030年にROE10%以上を目標とします。")).toEqual([]);
    expect(strategyTargets("売上高営業利益率10%を目指します。")).toEqual([]);
  });

  it("keeps every sentence whole", () => {
    expect(sentences("一つ目。二つ目。三つ目")).toEqual(["一つ目。", "二つ目。", "三つ目"]);
  });

  it("marks a business only when a growth sentence names it", () => {
    const company = {
      businesses: [
        { id: "food", name: "食品事業" },
        { id: "fine", name: "ファイン事業" },
        { id: "others", name: "その他" },
      ],
      perspectives: {
        strategy: { disclosed: { text: "総合食品企業を目指します。ファイン事業の拡大を進めます。", asOf: "2026-06-23", sourceIds: [] } },
      },
    } as unknown as Company;
    expect([...growthBusinessIds(company)]).toEqual(["fine"]);
  });
});

describe("official websites (src/data/websites.json)", () => {
  const byId = new Map(companies.map((c) => [c.id, c]));
  // JSON modules are `unknown` (JCE-076); the companies table is read in this shape.
  const websites = websitesJson as { companies: Record<string, { url: string; sourceId: string }> };
  const entries = Object.entries(websites.companies);

  it("cites each address to the company's own 有価証券報告書", () => {
    for (const [id, w] of entries) {
      const company = byId.get(id);
      expect(company, id).toBeDefined();
      expect(w.sourceId, id).toMatch(/^yuho/);
      expect(company!.sources.some((s) => s.id === w.sourceId), `${id}: ${w.sourceId}`).toBe(true);
    }
  });

  it("links one company to one site", () => {
    const hosts = entries.map(([, w]) => new URL(w.url).hostname);
    expect(new Set(hosts).size).toBe(hosts.length);
  });
});
