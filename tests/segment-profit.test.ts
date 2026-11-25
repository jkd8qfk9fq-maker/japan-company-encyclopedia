import { describe, expect, it } from "vitest";
import { researchDevelopmentFact } from "../scripts/pipeline/research-development.mjs";
import { memberLabels, segmentCapexBlock, segmentProfitBlock, segmentProfitFacts } from "../scripts/pipeline/segment-revenue.mjs";

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

describe("Q3 facts (JCE-110)", () => {
  const capexRow = (context: string, value: string) => ({
    要素ID: "jpcrp_cor:IncreaseInPropertyPlantAndEquipmentAndIntangibleAssets",
    項目名: "有形固定資産及び無形固定資産の増加額",
    コンテキストID: `CurrentYearDuration_${context}`,
    単位: "円",
    値: value,
  });
  // ADEKA FY2025 as the 2026-11-25 probe printed it (化学品 15,612百万円 of 21,674百万円); the other members made up.
  const capex = [
    capexRow(M.chem, "15612000000"), capexRow(M.food, "3000000000"), capexRow(M.life, "2862000000"),
    capexRow(OTHER, "200000000"), capexRow("ReportableSegmentsMember", "21474000000"), capexRow("TotalOfReportableSegmentsAndOthersMember", "21674000000"),
  ];

  it("reads capex by segment and covers every business of the revenue table", () => {
    expect(segmentCapexBlock(capex, labels, businesses, revenue)).toEqual({
      label: "有形固定資産及び無形固定資産の増加額",
      items: [
        { businessId: "chemicals", amount: 15612000000 },
        { businessId: "food", amount: 3000000000 },
        { businessId: "life-science", amount: 2862000000 },
        { businessId: "other", amount: 200000000 },
      ],
    });
  });

  it("refuses a capex column that does not close, and an all-dash one", () => {
    const off = capex.map((r) => (r.コンテキストID.endsWith(M.food) ? { ...r, 値: "9000000000" } : r));
    expect("problem" in segmentCapexBlock(off, labels, businesses, revenue)).toBe(true);
    const dashes = capex.map((r) => ({ ...r, 値: "－" }));
    expect("problem" in segmentCapexBlock(dashes, labels, businesses, revenue)).toBe(true);
  });

  const rd = (element: string, value: string, context = "CurrentYearDuration") => ({ 要素ID: element, 項目名: "研究開発費", コンテキストID: context, 単位: "円", 値: value });

  it("reads the group's R&D from the first printed total, never a segment's or the 提出会社's", () => {
    const rows = [
      rd("jpcrp_cor:ResearchAndDevelopmentExpensesResearchAndDevelopmentActivities", "157300000000", "CurrentYearDuration_jpcrp030000-asr_E02152-000AutomobilesReportableSegmentMember"),
      rd("jppfs_cor:ResearchAndDevelopmentExpensesSGA", "158794000000", "CurrentYearDuration_NonConsolidatedMember"),
      rd("jpigp_cor:ResearchAndDevelopmentExpenditureRecognizedAsExpenseDuringPeriodIFRS", "169424000000"),
    ];
    expect(researchDevelopmentFact(rows, 4_700_000_000_000)).toEqual({ label: "当期に費用認識した研究開発費", amount: 169424000000, locator: "【注記事項】" });
  });

  it("refuses R&D that is missing, two-valued or not below revenue", () => {
    expect(researchDevelopmentFact([], 1e12)).toEqual({ problem: "研究開発費の印字がない" });
    const el = "jpcrp_cor:ResearchAndDevelopmentExpensesResearchAndDevelopmentActivities";
    expect("problem" in researchDevelopmentFact([rd(el, "100"), rd(el, "200")], 1e12)).toBe(true);
    expect("problem" in researchDevelopmentFact([rd(el, "2000000000000")], 1e12)).toBe(true);
  });
});
