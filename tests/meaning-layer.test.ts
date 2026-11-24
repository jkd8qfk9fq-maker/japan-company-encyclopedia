import { describe, expect, it } from "vitest";
import { companies } from "../src/data/companies";
import { formatAnalysisValue } from "../src/lib/analysis-format";
import { companyAnalysis, type AnalysisGroup, type AnalysisRow } from "../src/lib/company-analysis";
import { isReleased } from "../src/lib/release";
import { MAX_SENTENCES, meaningSummary, SIGNED_ROWS, sentenceText, type MeaningSentence } from "../src/lib/meaning-layer";

/**
 * The meaning layer (JCE-110). The rules under test are the operator's design memo of 2026-11-25:
 * every number in a sentence is the table's number (same row, same formatting), no judgment word,
 * no figure in the template text, nothing built from a suppressed module, at most five sentences.
 */

/** Words that would turn a structural sentence into a verdict, a prediction or advice. */
const JUDGMENT_WORDS = [
  "良い", "よい", "悪い", "健全", "危険", "危ない", "安全", "安心", "心配", "懸念", "注意", "有望", "好調", "不調", "順調",
  "改善", "悪化", "優良", "割安", "割高", "強い", "弱い", "買い", "売り", "おすすめ", "期待", "見込", "予想", "成功", "失敗",
  "ため", "により", "によって", "おかげ", "せいで",
];

const row = (key: string, title: string, value: number, over: Partial<AnalysisRow> = {}): AnalysisRow => ({
  key, title, formula: "f", kind: "computed", unit: "yen", value, fiscalYear: "2026年3月期", sourceIds: ["s"], industry: null, ...over,
});

const a1 = (netIncomeChange: number): AnalysisGroup => ({
  id: "a1",
  title: "利益増減の内訳（寄与度分解）",
  rows: [
    row("a1-revenue-effect", "売上効果", 8_500_000_000),
    row("a1-margin-effect", "利益率効果", -20_500_000_000),
    row("a1-profit-change", "経常利益の増減", -12_000_000_000),
    row("a1-bridge", "税など", 0),
    row("a1-net-income-change", "純利益の増減", netIncomeChange),
  ],
});

function checkSentence(s: MeaningSentence, groups: AnalysisGroup[]) {
  const group = groups.find((g) => g.id === s.groupId);
  expect(group, s.id).toBeDefined();
  for (const p of s.parts) {
    if (typeof p === "string") {
      // Template text carries no figure of its own; 「5期」 is the one fixed span it names.
      expect(p.replaceAll("5期", ""), `${s.id}: ${p}`).not.toMatch(/[0-9０-９]/);
      // Judgment words are checked on the template's own wording: a business may be called 小売り事業.
      for (const w of JUDGMENT_WORDS) expect(p, `${s.id} uses ${w}`).not.toContain(w);
      continue;
    }
    if ("label" in p) continue;
    const r = group!.rows.find((x) => x.key === p.rowKey);
    expect(r, `${s.id}: ${p.rowKey}`).toBeDefined();
    // The table's own string; a change row adds only the plus sign the table's 「増減」 column implies.
    const table = formatAnalysisValue(r!, r!.value);
    expect(p.text).toBe(SIGNED_ROWS.has(r!.key) && r!.value > 0 && !table.startsWith("+") ? `+${table}` : table);
    expect(r!.fiscalYear).toBe(s.fiscalYear);
  }
}

describe("meaning layer", () => {
  it("writes the decomposition in the table's own numbers", () => {
    const groups = [a1(-12_000_000_000)];
    const out = meaningSummary(groups);
    expect(out.map((s) => s.id)).toEqual(["q1-net-income", "q1-profit-split"]);
    expect(sentenceText(out[1]!)).toBe("経常利益の増減 −120億円 のうち、売上の増減による分は +85億円、利益率の変化による分は −205億円。");
    out.forEach((s) => checkSentence(s, groups));
  });

  it("puts capex beside depreciation and operating cash flow where they are registered", () => {
    const c2 = (extra: AnalysisRow[]): AnalysisGroup => ({
      id: "c2",
      title: "資金ギャップ",
      rows: [
        row("c2-operating-cash-flow", "営業キャッシュフロー", 120_000_000_000, { kind: "printed" }),
        row("c2-capex", "設備投資", 95_000_000_000),
        ...extra,
      ],
    });
    expect(sentenceText(meaningSummary([c2([])])[0]!)).toBe("この期の設備投資は 950億円、営業キャッシュフローは 1,200億円。");
    const full = [
      c2([
        row("c2-capex-growth", "設備投資の前期比", 0.4, { unit: "percent-change" }),
        row("c2-depreciation", "減価償却費", 60_000_000_000, { kind: "printed" }),
      ]),
    ];
    const out = meaningSummary(full);
    expect(sentenceText(out[0]!)).toBe("この期の設備投資は 950億円（前期比 +40.0%）、減価償却費は 600億円、営業キャッシュフローは 1,200億円。");
    out.forEach((s) => checkSentence(s, full));
  });

  it("builds nothing from a group that was suppressed", () => {
    expect(meaningSummary([])).toEqual([]);
    const partial: AnalysisGroup = { id: "a1", title: "x", rows: [row("a1-revenue-effect", "売上効果", 1)] };
    expect(meaningSummary([partial])).toEqual([]);
  });

  it("names the largest segment only when it moves with the total", () => {
    const seg = (total: number, a: number, b: number): AnalysisGroup => ({
      id: "a3",
      title: "セグメント別の売上寄与",
      rows: [
        row("a3-x", "機械事業の寄与", a, { unit: "points" }),
        row("a3-y", "素材事業の寄与", b, { unit: "points" }),
        row("a3-revenue-change", "売上高の増減", total),
      ],
    });
    expect(sentenceText(meaningSummary([seg(30_000_000_000, 0.08, 0.01)])[0]!)).toContain("増加への寄与が最も大きいのは機械事業");
    expect(sentenceText(meaningSummary([seg(-30_000_000_000, 0.01, -0.08)])[0]!)).toContain("減少への寄与が最も大きいのは素材事業");
    expect(meaningSummary([seg(30_000_000_000, -0.01, -0.02)])).toEqual([]);
  });

  it("holds every released company to the rules", { timeout: 300_000 }, () => {
    const released = companies.filter(isReleased);
    let withSummary = 0;
    for (const c of released) {
      const groups = companyAnalysis(c, released).perspectives.flatMap((p) => p.groups);
      const out = meaningSummary(groups);
      expect(out.length).toBeLessThanOrEqual(MAX_SENTENCES);
      expect(new Set(out.map((s) => s.id)).size).toBe(out.length);
      out.forEach((s) => checkSentence(s, groups));
      if (out.length > 0) withSummary++;
    }
    // Almost every non-financial company has two comparable years; a collapse here means a template broke.
    expect(withSummary).toBeGreaterThan(2500);
  });
});
