import { describe, expect, it } from "vitest";
import { companies } from "../src/data/companies";
import { formatAnalysisValue } from "../src/lib/analysis-format";
import { companyAnalysis, type AnalysisGroup, type AnalysisRow } from "../src/lib/company-analysis";
import { isReleased } from "../src/lib/release";
import { isSignedRowKey, MAX_SENTENCES, meaningSummary, sentenceText, type MeaningSentence } from "../src/lib/meaning-layer";

/**
 * The meaning layer (JCE-110). The rules under test are the operator's design memo of 2026-11-25:
 * every number in a sentence is the table's number (same row, same formatting), no judgment word,
 * no figure in the template text, nothing built from a suppressed module, at most seven sentences.
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
    expect(p.text).toBe(isSignedRowKey(r!.key) && r!.value > 0 && !table.startsWith("+") ? `+${table}` : table);
    if (r!.key.endsWith("-prev")) {
      // A prior-year figure (JCE-122) carries its own year — one of the years its group itself spans.
      expect(group!.rows.map((x) => x.fiscalYear)).toContain(r!.fiscalYear);
      expect(r!.fiscalYear).not.toBe(s.fiscalYear);
    } else {
      expect(r!.fiscalYear).toBe(s.fiscalYear);
    }
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

  it("measures capex against the year's cash flow and against depreciation in both years (JCE-122)", () => {
    const c2 = (extra: AnalysisRow[]): AnalysisGroup => ({
      id: "c2",
      title: "資金ギャップ",
      rows: [
        row("c2-operating-cash-flow", "営業キャッシュフロー", 120_000_000_000, { kind: "printed" }),
        row("c2-capex", "設備投資", 95_000_000_000),
        row("c2-depreciation", "減価償却費", 60_000_000_000, { kind: "printed" }),
        ...extra,
      ],
    });
    const ratios = (latest: number, prev: number): AnalysisRow[] => [
      row("c2-capex-depreciation-ratio", "減価償却費に対する設備投資の割合", latest, { unit: "percent" }),
      row("c2-capex-depreciation-ratio-prev", "前期の減価償却費に対する設備投資の割合", prev, { unit: "percent", fiscalYear: "2025年3月期" }),
    ];
    const full = [
      c2([
        row("c2-depreciation-growth", "減価償却費の前期比", 0.25, { unit: "percent-change" }),
        row("c2-capex-operating-ratio", "設備投資の営業キャッシュフローに対する割合", 95 / 120, { unit: "percent" }),
        ...ratios(95 / 60, 1.25),
      ]),
    ];
    const out = meaningSummary(full);
    expect(sentenceText(out[0]!)).toBe(
      "この期の設備投資は 950億円、減価償却費は 600億円（前期比 +25.0%）、営業キャッシュフローは 1,200億円。" +
        "設備投資は営業キャッシュフローの 79.2%にあたる。" +
        "減価償却費に対する設備投資の割合は、前期 125.0%、最新期 158.3%。" +
        "設備投資は前期・最新期とも減価償却費を上回っている。",
    );
    out.forEach((s) => checkSentence(s, full));
    // The pair of directions, stated for each of the other three combinations.
    expect(sentenceText(meaningSummary([c2(ratios(0.8, 0.6))])[0]!)).toContain("設備投資は前期・最新期とも減価償却費を下回っている。");
    expect(sentenceText(meaningSummary([c2(ratios(1.4, 0.6))])[0]!)).toContain("設備投資は前期は減価償却費を下回り、最新期は上回っている。");
    expect(sentenceText(meaningSummary([c2(ratios(0.6, 1.4))])[0]!)).toContain("設備投資は前期は減価償却費を上回り、最新期は下回っている。");
    // An exactly-equal year states neither direction: the ratio clauses are not built.
    const equal = meaningSummary([c2(ratios(1, 1.4))]);
    expect(sentenceText(equal[0]!)).not.toContain("減価償却費に対する設備投資の割合は");
    equal.forEach((s) => checkSentence(s, [c2(ratios(1, 1.4))]));
    // Without the prior year's ratio there is no two-year statement, and no operating ratio either.
    expect(sentenceText(meaningSummary([c2(ratios(1.4, 0.6).slice(0, 1))])[0]!)).toBe("この期の設備投資は 950億円、減価償却費は 600億円、営業キャッシュフローは 1,200億円。");
  });

  it("names the segment with the highest margin, answering each question before any twice (3 / 2 / 2)", () => {
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
    expect(out.map((s) => s.id)).toEqual(["q1-net-income", "q1-profit-split", "q1-capex-cash", "q2-margin", "q2-largest-share"]);
    expect(sentenceText(out[3]!)).toBe("営業利益率が最も高いのは暮らしの素材事業で 12.3%。売上構成比は 25.0%。");
    // JCE-127: the second Q2 sentence names the largest share — a different business than the margin's top here.
    expect(sentenceText(out[4]!)).toBe("売上構成比が最も大きいのは機械事業で 75.0%。");
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
    // JCE-127: with the Q3 cap at two, capex and R&D stand together; the second capex business yields to R&D.
    expect(both.map((s) => sentenceText(s))).toEqual([
      "事業別に見ると、有形固定資産及び無形固定資産の増加額の 72.0% は化学品。",
      "研究開発費は 193億円 で、売上高の 4.5%。",
    ]);
    both.forEach((s) => checkSentence(s, [a5, a6]));
    // Capex alone: the second business follows in the same shape.
    const capexOnly = meaningSummary([a6]);
    expect(capexOnly.map((s) => sentenceText(s))).toEqual([
      "事業別に見ると、有形固定資産及び無形固定資産の増加額の 72.0% は化学品。",
      "次いで、有形固定資産及び無形固定資産の増加額の 20.0% は食品。",
    ]);
    capexOnly.forEach((s) => checkSentence(s, [a6]));
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
    // JCE-124: the yen change row follows each contribution row. The sentence states the amount only
    // when 「のうち」 is arithmetically true — the top contributor's change moves with the total and is
    // no larger than it — and otherwise keeps the points-only form.
    const seg = (total: number, a: number, b: number, ax?: number, bx?: number): AnalysisGroup => ({
      id: "a3",
      title: "セグメント別の売上寄与",
      rows: [
        row("a3-x", "機械事業の寄与", a, { unit: "points" }),
        ...(ax === undefined ? [] : [row("a3-x-change", "機械事業の増減", ax)]),
        row("a3-y", "素材事業の寄与", b, { unit: "points" }),
        ...(bx === undefined ? [] : [row("a3-y-change", "素材事業の増減", bx)]),
        row("a3-revenue-change", "売上高の増減", total),
      ],
    });
    expect(sentenceText(meaningSummary([seg(30_000_000_000, 0.08, 0.01, 24_000_000_000, 3_000_000_000)])[0]!)).toBe(
      "売上高の増減 +300億円 のうち、増加への寄与が最も大きいのは機械事業で +8.00pt（増減 +240億円）。",
    );
    expect(sentenceText(meaningSummary([seg(-30_000_000_000, 0.01, -0.08, 3_000_000_000, -24_000_000_000)])[0]!)).toBe(
      "売上高の増減 −300億円 のうち、減少への寄与が最も大きいのは素材事業で −8.00pt（増減 −240億円）。",
    );
    // Without the change rows the points-only form stands, as before.
    expect(sentenceText(meaningSummary([seg(30_000_000_000, 0.08, 0.01)])[0]!)).toBe(
      "売上高の増減 +300億円 のうち、増加への寄与が最も大きいのは機械事業で +8.00pt。",
    );
    // A change larger than the total, or in the opposite direction, is not stated as 「のうち」.
    expect(sentenceText(meaningSummary([seg(30_000_000_000, 0.08, 0.01, 40_000_000_000, 3_000_000_000)])[0]!)).toBe(
      "売上高の増減 +300億円 のうち、増加への寄与が最も大きいのは機械事業で +8.00pt。",
    );
    expect(sentenceText(meaningSummary([seg(30_000_000_000, 0.08, 0.01, -5_000_000_000, 3_000_000_000)])[0]!)).toBe(
      "売上高の増減 +300億円 のうち、増加への寄与が最も大きいのは機械事業で +8.00pt。",
    );
    expect(meaningSummary([seg(30_000_000_000, -0.01, -0.02)])).toEqual([]);
  });

  it("names the second segment contributor under the same guards (JCE-127)", () => {
    const seg = (total: number, a: number, b: number, ax?: number, bx?: number): AnalysisGroup => ({
      id: "a3",
      title: "セグメント別の売上寄与",
      rows: [
        row("a3-x", "機械事業の寄与", a, { unit: "points" }),
        ...(ax === undefined ? [] : [row("a3-x-change", "機械事業の増減", ax)]),
        row("a3-y", "素材事業の寄与", b, { unit: "points" }),
        ...(bx === undefined ? [] : [row("a3-y-change", "素材事業の増減", bx)]),
        row("a3-revenue-change", "売上高の増減", total),
      ],
    });
    const up = meaningSummary([seg(30_000_000_000, 0.08, 0.01, 24_000_000_000, 3_000_000_000)]);
    expect(up.map((s) => s.id)).toEqual(["q2-segment", "q2-segment-second"]);
    expect(sentenceText(up[1]!)).toBe("次いで増加への寄与が大きいのは素材事業で +1.00pt（増減 +30億円）。");
    up.forEach((s) => checkSentence(s, [seg(30_000_000_000, 0.08, 0.01, 24_000_000_000, 3_000_000_000)]));
    // Falling total: the ranking reads from the negative end; the second name follows the largest faller.
    const down = meaningSummary([seg(-30_000_000_000, -0.02, -0.08, -6_000_000_000, -24_000_000_000)]);
    expect(down.map((s) => s.id)).toEqual(["q2-segment", "q2-segment-second"]);
    expect(sentenceText(down[1]!)).toBe("次いで減少への寄与が大きいのは機械事業で −2.00pt（増減 −60億円）。");
    // A second part moving against the total is not named.
    const against = meaningSummary([seg(-30_000_000_000, 0.01, -0.08, 3_000_000_000, -24_000_000_000)]);
    expect(against.map((s) => s.id)).toEqual(["q2-segment"]);
    // Without the change rows the second sentence keeps the points-only form.
    const pointsOnly = meaningSummary([seg(30_000_000_000, 0.08, 0.01)]);
    expect(sentenceText(pointsOnly[1]!)).toBe("次いで増加への寄与が大きいのは素材事業で +1.00pt。");
    // A second amount larger than the total is not stated as part of it.
    const tooLarge = meaningSummary([seg(30_000_000_000, 0.08, 0.01, 24_000_000_000, 40_000_000_000)]);
    expect(sentenceText(tooLarge[1]!)).toBe("次いで増加への寄与が大きいのは素材事業で +1.00pt。");
  });

  it("states the working-capital movement with its sign (JCE-127)", () => {
    const c2 = (wc: number): AnalysisGroup => ({
      id: "c2",
      title: "資金ギャップ",
      rows: [
        row("c2-operating-cash-flow", "営業キャッシュフロー", 120_000_000_000, { kind: "printed" }),
        row("c2-capex", "設備投資", 95_000_000_000),
        row("c2-working-capital-change", "運転資本の増減", wc),
      ],
    });
    const up = meaningSummary([c2(120_000_000_000)]);
    expect(up.map((s) => s.id)).toEqual(["q1-capex-cash", "q1-working-capital"]);
    expect(sentenceText(up[1]!)).toBe("運転資本の増減は +1,200億円。");
    up.forEach((s) => checkSentence(s, [c2(120_000_000_000)]));
    expect(sentenceText(meaningSummary([c2(-5_000_000_000)])[1]!)).toBe("運転資本の増減は −50億円。");
  });

  it("holds every released company to the rules", { timeout: 300_000 }, () => {
    const released = companies.filter(isReleased);
    let withSummary = 0;
    let q2Segment = 0;
    let q2SegmentYen = 0;
    for (const c of released) {
      const groups = companyAnalysis(c, released).perspectives.flatMap((p) => p.groups);
      const out = meaningSummary(groups);
      expect(out.length).toBeLessThanOrEqual(MAX_SENTENCES);
      expect(new Set(out.map((s) => s.id)).size).toBe(out.length);
      out.forEach((s) => {
        checkSentence(s, groups);
        // JCE-124: the yen form of q2-segment (the top contributor's amount beside its points).
        if (s.id === "q2-segment") {
          q2Segment++;
          if (sentenceText(s).includes("（増減 ")) q2SegmentYen++;
        }
      });
      if (out.length > 0) withSummary++;
    }
    // Almost every non-financial company has two comparable years; a collapse here means a template broke.
    expect(withSummary).toBeGreaterThan(2500);
    // JCE-124: most q2-segment sentences state the amount (measured 128 of 184 at implementation);
    // a collapse means the guard or the change rows broke.
    expect(q2Segment).toBeGreaterThan(150);
    expect(q2SegmentYen).toBeGreaterThan(100);
  });
});
