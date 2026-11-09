import { describe, expect, it } from "vitest";
import { mapSegmentsToBusinesses, memberLabels, regionalRevenueFromText, segmentRevenueBlock, segmentRevenueFacts } from "../scripts/pipeline/segment-revenue.mjs";

/**
 * Segment revenue from the XBRL (JCE-038). The rows are shaped as A&Aマテリアル's FY2025 filing tags them (probe of
 * 2026-11-09): two reportable segments, the その他 member, the filing's own totals, and a 調整額 of "－".
 */
const P = "jpcrp030000-asr_E01163-000";
const row = (context: string, value: string, element = "jpcrp_cor:RevenuesFromExternalCustomers", name = "外部顧客への売上高") => ({
  要素ID: element,
  項目名: name,
  コンテキストID: `CurrentYearDuration${context ? `_${context}` : ""}`,
  単位: "円",
  値: value,
});
const filing = [
  row(`${P}ConstructionAndBuildingMaterialsReportableSegmentsMember`, "23067000000"),
  row(`${P}IndustrialGoodsAndEngineeringReportableSegmentsMember`, "22575000000"),
  row("ReportableSegmentsMember", "45643000000"), // as printed: one 百万円 of rounding
  row("OperatingSegmentsNotIncludedInReportableSegmentsAndOtherRevenueGeneratingBusinessActivitiesMember", "56000000"),
  row("TotalOfReportableSegmentsAndOthersMember", "45700000000"),
  row("ReconcilingItemsMember", "－"),
  row("", "45700000000"),
  // A prior year and the 提出会社 must not be read.
  { ...row(`${P}ConstructionAndBuildingMaterialsReportableSegmentsMember`, "1"), コンテキストID: `Prior1YearDuration_${P}ConstructionAndBuildingMaterialsReportableSegmentsMember` },
];

const lab = `<link:linkbase>
<link:loc xlink:type="locator" xlink:href="x.xsd#${P}_ConstructionAndBuildingMaterialsReportableSegmentsMember" xlink:label="A"/>
<link:label xlink:type="resource" xlink:label="label_A" xlink:role="http://www.xbrl.org/2003/role/label" xml:lang="ja">建設・建材事業</link:label>
<link:label xlink:type="resource" xlink:label="label_A" xlink:role="http://www.xbrl.org/2003/role/verboseLabel" xml:lang="ja">建設・建材事業 [メンバー]</link:label>
<link:labelArc xlink:type="arc" xlink:from="A" xlink:to="label_A"/>
<link:loc xlink:type="locator" xlink:href="x.xsd#${P}_IndustrialGoodsAndEngineeringReportableSegmentsMember" xlink:label="B"/>
<link:label xlink:type="resource" xlink:label="label_B" xlink:role="http://www.xbrl.org/2003/role/label" xml:lang="ja">工業製品・エンジニアリング事業</link:label>
<link:labelArc xlink:type="arc" xlink:from="B" xlink:to="label_B"/>
</link:linkbase>`;

const businesses = [
  { id: "construction-materials", name: "建設・建材事業", shortName: "建設・建材" },
  { id: "industrial-products-engineering", name: "工業製品・エンジニアリング" },
  { id: "other", name: "その他" },
];

describe("segmentRevenueFacts", () => {
  it("reads the current year's members and checks them against the filing's own total", () => {
    const facts = segmentRevenueFacts(filing)!;
    expect(facts.label).toBe("外部顧客への売上高");
    expect(facts.items.map((i) => [i.other, i.amount])).toEqual([[false, 23067000000], [false, 22575000000], [true, 56000000]]);
  });

  it("refuses a set that does not add up (a member from another axis mixed in)", () => {
    expect(segmentRevenueFacts([...filing, row(`${P}JapanMember`, "1000")])).toBeNull();
  });

  it("reads the IFRS element and drops its （IFRS） suffix", () => {
    const ifrs = filing.map((r) => ({ ...r, 要素ID: "jpigp_cor:RevenueFromExternalCustomersIFRS", 項目名: "外部顧客への売上収益（IFRS）" }));
    expect(segmentRevenueFacts(ifrs)?.label).toBe("外部顧客への売上収益");
  });

  it("returns nothing for a filing that tags no segments (US GAAP)", () => {
    expect(segmentRevenueFacts([row("", "1000", "jppfs_cor:NetSales", "売上高")])).toBeNull();
  });
});

describe("mapSegmentsToBusinesses", () => {
  const labels = memberLabels([lab]);

  it("takes the standard Japanese label, not the verbose one", () => {
    expect(labels.get(`${P}_ConstructionAndBuildingMaterialsReportableSegmentsMember`)).toBe("建設・建材事業");
  });

  it("matches by the filing's name, with or without 事業, and その他 to その他", () => {
    expect(mapSegmentsToBusinesses(segmentRevenueFacts(filing)!, labels, businesses)).toEqual({
      items: [
        { businessId: "construction-materials", amount: 23067000000 },
        { businessId: "industrial-products-engineering", amount: 22575000000 },
        { businessId: "other", amount: 56000000 },
      ],
    });
  });

  it("gives up when a segment with an amount has no business of that name", () => {
    const renamed = [{ ...businesses[0], name: "建材", shortName: undefined }, businesses[1], businesses[2]];
    expect(mapSegmentsToBusinesses(segmentRevenueFacts(filing)!, labels, renamed)).toHaveProperty("problem");
  });
});

describe("segmentRevenueFacts — AGC's IFRS spelling", () => {
  const A = "jpcrp030000-asr_E01122-000";
  const r = (member: string, value: string) => ({ 要素ID: "jpigp_cor:SalesToExternalCustomersIFRS", 項目名: "外部顧客への売上高（IFRS）", コンテキストID: `CurrentYearDuration_${member}`, 単位: "円", 値: value });
  it("reads members without 'ReportableSegment' and checks the total that includes その他", () => {
    const rows = [
      r(`${A}GlassReportableSegmentMember`, "438811000000"),
      r(`${A}AutomotiveReportableSegmentMember`, "520324000000"),
      r(`${A}ElectronicsMember`, "353227000000"),
      r(`${A}ChemicalsMember`, "579487000000"),
      r(`${A}LifescienceReportableSegmentMember`, "129420000000"),
      r(`${A}CeramicsOthersMember`, "37560000000"),
      r("TotalOfReportableSegmentsAndOthersMember", "2058832000000"),
      r("ReconcilingItemsMember", "－"),
    ];
    const facts = segmentRevenueFacts(rows)!;
    expect(facts.label).toBe("外部顧客への売上高");
    expect(facts.items).toHaveLength(6);
  });
});

describe("regionalRevenueFromText", () => {
  // As EDINET's CSV gives アイシン's FY2025 note (probe of 2026-11-09).
  const aisin = "(4）地域に関する情報①　外部顧客に対する売上収益   （単位：百万円） 　前連結会計年度（自　2024年４月１日　　至　2025年３月31日）　当連結会計年度（自　2025年４月１日　　至　2026年３月31日）日本2,175,2162,316,889米国839,538941,282中国639,548588,382その他1,241,8021,271,209合計4,896,1045,117,764（注）　売上収益は顧客の所在地を基礎としています。 ②　非流動資産   （単位：百万円） 前連結会計年度（2025年３月31日）当連結会計年度（2026年３月31日）日本923,870890,313合計1,581,6911,599,420";
  // AGC's note as EDINET gives it: 「地域別」 heads the non-current assets too, after the revenue table.
  const agc = "（4）地域別セグメント　各年度の売上高の地域別内訳は以下のとおりであります。（単位：百万円） 前連結会計年度（自　2024年1月1日至　2024年12月31日）当連結会計年度（自　2025年1月1日至　2025年12月31日）日本649,856652,144アジア668,218646,856アメリカ256,889244,006ヨーロッパ492,639515,825合計2,067,6032,058,832（注）　売上高は、各拠点の所在地によっております。 　各年度の非流動資産の地域別内訳は以下のとおりであります。（単位：百万円） 前連結会計年度末（2024年12月31日）当連結会計年度末（2025年12月31日）日本464,705533,869アジア781,918775,248アメリカ83,38476,808ヨーロッパ336,716388,243合計1,666,7241,774,169";

  it("reads the current year's column and marks 日本", () => {
    expect(regionalRevenueFromText(aisin, 5_117_764_000_000)).toEqual({
      items: [
        { region: "日本", domestic: true, amount: 2_316_889_000_000 },
        { region: "米国", domestic: false, amount: 941_282_000_000 },
        { region: "中国", domestic: false, amount: 588_382_000_000 },
        { region: "その他", domestic: false, amount: 1_271_209_000_000 },
      ],
    });
    expect(regionalRevenueFromText(agc, 2_058_832_000_000)?.items.map((i) => i.region)).toEqual(["日本", "アジア", "アメリカ", "ヨーロッパ"]);
  });

  it("refuses a table whose 合計 is not the consolidated revenue", () => {
    expect(regionalRevenueFromText(aisin, 4_896_104_000_000)).toBeNull();
  });

  it("refuses a two-level table read flat (a region name printed twice)", () => {
    const twoLevel = "地域ごとの情報(単位:百万円)日本600アジア中国100その他50米州米国200その他50合計1,000";
    expect(regionalRevenueFromText(twoLevel, 1_000_000_000)).toBeNull();
  });

  it("returns nothing when the note omits the table", () => {
    expect(regionalRevenueFromText("本邦の外部顧客への売上高が連結損益計算書の売上高の90％を超えるため、地域ごとの情報の記載を省略しております。", 1_000_000_000)).toBeNull();
  });
});

describe("segmentRevenueFacts — その他 inside the reportable segments (愛知製鋼)", () => {
  const A = "jpcrp030000-asr_E01234-000";
  const r = (member: string, value: string) => ({ 要素ID: "jpigp_cor:RevenueFromExternalCustomersIFRS", 項目名: "外部顧客への売上収益（IFRS）", コンテキストID: `CurrentYearDuration_${member}`, 単位: "円", 値: value });
  it("counts OtherReportableSegmentsMember in the reportable total and names it その他", () => {
    const rows = [
      r(`${A}HaganeCompanyReportableSegmentMember`, "105567000000"),
      r(`${A}StainlessCompanyReportableSegmentMember`, "38897000000"),
      r(`${A}KitaeruCompanyReportableSegmentMember`, "134823000000"),
      r(`${A}SmartCompanyReportableSegmentMember`, "22107000000"),
      r("OtherReportableSegmentsMember", "2945000000"),
      r("ReportableSegmentsMember", "304341000000"),
    ];
    const facts = segmentRevenueFacts(rows)!;
    expect(facts.items).toHaveLength(5);
    const mapped = mapSegmentsToBusinesses(facts, new Map(), [{ id: "other", name: "その他" }]);
    expect(mapped).toHaveProperty("problem"); // the four companies have no label here: nothing is guessed
  });
});

describe("segmentRevenueBlock", () => {
  const facts = {
    label: "外部顧客への売上高",
    items: [
      { member: "a", other: false, amount: 8_155_625_000_000, name: "国内保険事業" },
      { member: "b", other: false, amount: 3_523_786_000_000, name: "海外保険事業" },
    ],
  };
  const businesses = [{ id: "domestic", name: "国内保険事業" }, { id: "overseas", name: "海外保険事業" }];
  const year = (revenue: number) => ({ fiscalYear: "2026年3月期", periodEnd: "2026-03-31", revenue });

  it("refuses segments that add up to more than the revenue line (第一生命: 経常収益 against 保険料等収入)", () => {
    expect(segmentRevenueBlock(facts, businesses, year(6_944_066_000_000), "yuho-2026")).toBeNull();
  });

  it("keeps segments that fit within the revenue line", () => {
    expect(segmentRevenueBlock(facts, businesses, year(11_700_000_000_000), "yuho-2026")?.items).toHaveLength(2);
  });
});
