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

  it("names the segment with the highest margin, answering each question before any twice (3 / 1 / 1)", () => {
    const a4: AnalysisGroup = {
      id: "a4",
      title: "セグメント別の利益率",
      rows: [
        row("a4-margin-x", "暮らしの素材事業の営業利益率", 0.123, { unit: "percent", formula: "セグメントの営業利益 ÷ セグメントの売上高（セグメント間を含む）" }),
        row("a4-share-x", "暮らしの素材事業の売上構成比", 0.25, { unit: "percent" }),
        row("a4-margin-y", "機械事業の営業利益率", 0.05, { unit: "percent", formula: "セグメントの営業利益 ÷ セグメントの売上高（セグメント間を含む）" }),
        row("a4-share-y", "機械事業の売上構成比", 0.75, { unit: "percent" }),
      ],
    };
    const b1: AnalysisGroup = {
      id: "b1",
      title: "純資産の増減の内訳",
      rows: [row("b1-net-assets-change", "純資産の増減", 1_000_000_000), row("b1-net-income", "うち当期純利益", 2_000_000_000, { kind: "printed" }), row("b1-other-change", "その他増減", -1_000_000_000)],
    };
    const seg: AnalysisGroup = {
      id: "a3",
      title: "セグメント別の売上寄与",
      rows: [row("a3-x", "暮らしの素材事業の寄与", 0.05, { unit: "points" }), row("a3-y", "機械事業の寄与", 0.01, { unit: "points" }), row("a3-revenue-change", "売上高の増減", 3_000_000_000)],
    };
    const groups = [a1(-12_000_000_000), b1, a4, seg, { id: "c2", title: "資金ギャップ", rows: [row("c2-operating-cash-flow", "営業キャッシュフロー", 1, { kind: "printed" }), row("c2-capex", "設備投資", 1)] }];
    const out = meaningSummary(groups);
    expect(out.map((s) => s.id)).toEqual(["q1-net-income", "q1-profit-split", "q1-capex-cash", "q2-margin"]);
    expect(sentenceText(out[3]!)).toBe("営業利益率が最も高いのは暮らしの素材事業で 12.3%。売上構成比は 25.0%。");
    out.forEach((s) => checkSentence(s, groups));
  });

  it("answers 何に力を入れているか with where capex went, else with R&D", () => {
    const a6: AnalysisGroup = {
      id: "a6",
      title: "事業別の設備投資",
      rows: [
        row("a6-capex-share-x", "化学品が占める割合", 0.72, { unit: "percent", formula: "その事業の有形固定資産及び無形固定資産の増加額 ÷ 事業別の有形固定資産及び無形固定資産の増加額の合計" }),
        row("a6-capex-share-y", "食品が占める割合", 0.2, { unit: "percent", formula: "その事業の有形固定資産及び無形固定資産の増加額 ÷ 事業別の有形固定資産及び無形固定資産の増加額の合計" }),
      ],
    };
    const a5: AnalysisGroup = {
      id: "a5",
      title: "研究開発費",
      rows: [row("a5-rnd", "研究開発費", 19_304_000_000, { kind: "printed" }), row("a5-rnd-ratio", "研究開発費の売上高に対する割合", 0.0449, { unit: "percent" })],
    };
    const both = meaningSummary([a5, a6]);
    expect(both.map((s) => sentenceText(s))).toEqual(["事業別に見ると、有形固定資産及び無形固定資産の増加額の 72.0% は化学品。"]);
    both.forEach((s) => checkSentence(s, [a5, a6]));
    const rndOnly = meaningSummary([a5]);
    expect(rndOnly.map((s) => sentenceText(s))).toEqual(["研究開発費は 193億円 で、売上高の 4.5%。"]);
    rndOnly.forEach((s) => checkSentence(s, [a5]));
  });

  it("adds the bridge when net income and the profit line moved in opposite directions", () => {
    const g: AnalysisGroup = {
      id: "a1",
      title: "利益増減の内訳（寄与度分解）",
      rows: [
        row("a1-revenue-effect", "売上効果", 22_000_000),
        row("a1-margin-effect", "利益率効果", 2_200_000_000),
        row("a1-profit-change", "経常利益の増減", 2_200_000_000),
        row("a1-bridge", "税・特別損益・非支配株主帰属分などの変動", -8_700_000_000),
        row("a1-net-income-change", "純利益の増減", -6_500_000_000),
      ],
    };
    const out = meaningSummary([g]);
    expect(sentenceText(out[0]!)).toBe("純利益の増減は前期比 −65億円。このうち税・特別損益などの変動による分は −87億円。");
    out.forEach((s) => checkSentence(s, [g]));
    // Same direction: the plain sentence.
    expect(sentenceText(meaningSummary([a1(-12_000_000_000)])[0]!)).toBe("純利益の増減は前期比 −120億円。");
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
