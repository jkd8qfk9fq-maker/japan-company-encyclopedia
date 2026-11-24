import { describe, expect, it } from "vitest";
import { memberLabels, segmentProfitBlock, segmentProfitFacts } from "../scripts/pipeline/segment-revenue.mjs";

/**
 * Segment profit from the XBRL (JCE-110 第3段階). The rows are ADEKA's FY2025 filing as the 2026-11-24 probe printed
 * them: three reportable segments and その他 tagged with 売上高 (inter-segment included) and 営業利益, with the filing's
 * own totals. The member's misspelling (Lifesciemce) is the filer's own.
 */
const P = "jpcrp030000-asr_E00878-000";
const M = { chem: `${P}ChemicalsReportableSegmentsMember`, food: `${P}FoodProductsReportableSegmentsMember`, life: `${P}LifesciemceReportableSegmentMember` };
const OTHER = "OperatingSegmentsNotIncludedInReportableSegmentsAndOtherRevenueGeneratingBusinessActivitiesMember";
const row = (element: string, name: string, context: string, value: string) => ({ 要素ID: element, 項目名: name, コンテキストID: `CurrentYearDuration_${context}`, 単位: "円", 値: value });
const sales = (c: string, v: string) => row("jppfs_cor:NetSales", "売上高", c, v);
const op = (c: string, v: string) => row("jppfs_cor:OperatingIncome", "営業利益又は営業損失（△）", c, v);
const filing = [
  sales(M.chem, "214993000000"), sales(M.food, "83106000000"), sales(M.life, "111822000000"),
  sales("ReportableSegmentsMember", "409922000000"), sales(OTHER, "19860000000"), sales("TotalOfReportableSegmentsAndOthersMember", "429782000000"),
  op(M.chem, "26353000000"), op(M.food, "4363000000"), op(M.life, "9823000000"),
  op("ReportableSegmentsMember", "40541000000"), op(OTHER, "1046000000"), op("TotalOfReportableSegmentsAndOthersMember", "41587000000"),
];
const label = (member: string, ja: string, i: number) =>
  `<link:loc xlink:href="x.xsd#${member.replace(P, `${P}_`)}" xlink:label="L${i}"/><link:label xlink:label="R${i}" xml:lang="ja">${ja}</link:label><link:labelArc xlink:from="L${i}" xlink:to="R${i}"/>`;
const labels = memberLabels([`<link:linkbase>${label(M.chem, "化学品事業", 1)}${label(M.food, "食品事業", 2)}${label(M.life, "ライフサイエンス事業", 3)}</link:linkbase>`]);
const businesses = [
  { id: "chemicals", name: "化学品" },
  { id: "food", name: "食品" },
  { id: "life-science", name: "ライフサイエンス" },
  { id: "other", name: "その他" },
];
const revenue = { items: businesses.map((b) => ({ businessId: b.id })) };

describe("segment profit (JCE-110)", () => {
  it("reads each segment's profit and own sales, closing against the filing's totals", () => {
    const block = segmentProfitBlock(segmentProfitFacts(filing), labels, businesses, revenue);
    expect(block).toEqual({
      label: "営業利益",
      items: [
        { businessId: "chemicals", profit: 26353000000, sales: 214993000000 },
        { businessId: "food", profit: 4363000000, sales: 83106000000 },
        { businessId: "life-science", profit: 9823000000, sales: 111822000000 },
        { businessId: "other", profit: 1046000000, sales: 19860000000 },
      ],
    });
  });

  it("stores nothing when a segment's figures do not add up to the total", () => {
    const broken = filing.map((r) => (r.要素ID === "jppfs_cor:OperatingIncome" && r.コンテキストID.endsWith(M.food) ? { ...r, 値: "9999000000" } : r));
    expect(segmentProfitBlock(segmentProfitFacts(broken), labels, businesses, revenue)).toEqual({ problem: "セグメント利益が無いか、合計と一致しない" });
  });

  it("treats a dash as not presented, not as zero (an all-dash column closes against a dash total)", () => {
    const dashes = [
      ...filing.filter((r) => r.要素ID === "jppfs_cor:NetSales"),
      ...filing.filter((r) => r.要素ID === "jppfs_cor:OperatingIncome").map((r) => ({ ...r, 要素ID: "jpigp_cor:ProfitLossBeforeTaxIFRS", 値: "－" })),
    ];
    expect(segmentProfitFacts(dashes)).toEqual({ problem: "セグメント利益が無いか、合計と一致しない" });
  });

  it("stores nothing when two profit measures both close (ambiguous)", () => {
    const both = [...filing, ...filing.filter((r) => r.要素ID === "jppfs_cor:OperatingIncome").map((r) => ({ ...r, 要素ID: "jppfs_cor:OrdinaryIncome" }))];
    expect(segmentProfitFacts(both)).toEqual({ problem: "セグメント利益の要素が複数ある" });
  });

  it("stores nothing unless every business of the revenue table is covered", () => {
    const wider = { items: [...revenue.items, { businessId: "real-estate" }] };
    expect("problem" in segmentProfitBlock(segmentProfitFacts(filing), labels, businesses, wider)).toBe(true);
  });
});
