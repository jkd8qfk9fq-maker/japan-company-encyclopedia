import { describe, expect, it } from "vitest";
import { companyMetrics } from "../src/lib/company-metrics";
import { buildValueChain, COMPANY_NODE } from "../src/lib/value-chain";
import type { Company, FinancialRecord } from "../src/types/company";

/**
 * The value chain and the comparison figures (JCE-038). What matters is what they refuse to draw: a size the
 * filing does not print, a buyer the entry does not name for a business, a ratio from figures of different years.
 */

const record = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
  ({
    fiscalYear: "2026年3月期",
    periodEnd: "2026-03-31",
    revenue: 1_000_000_000_000,
    revenueLabel: "売上高",
    netIncome: 50_000_000_000,
    netIncomeLabel: "親会社株主に帰属する当期純利益",
    sourceIds: ["yuho-2026"],
    ...over,
  }) as FinancialRecord;

const company = (over: Partial<Company> = {}): Company =>
  ({
    id: "example",
    name: "例",
    businesses: [
      { id: "cars", name: "自動車", description: "車をつくる。", customers: ["販売店", "法人"], sourceIds: ["yuho-2026"] },
      { id: "finance", name: "金融", description: "ローンを提供する。", customers: ["販売店"], sourceIds: ["yuho-2026"] },
      { id: "other", name: "その他", description: "その他。", sourceIds: ["yuho-2026"] },
    ],
    businessModel: {
      description: "説明。",
      products: [],
      customers: ["全社の顧客"],
      revenueSources: [],
      flow: [],
      sourceIds: ["yuho-2026"],
      suppliers: [
        { name: "部品メーカー", description: "部品を仕入れる。", businessIds: ["cars"] },
        { name: "原材料の仕入先", description: "原材料を仕入れる。" },
      ],
    },
    financials: [record()],
    sources: [],
    ...over,
  }) as unknown as Company;

describe("buildValueChain", () => {
  it("draws customers per business, shared customers once, and no company-wide list beside them", () => {
    const chain = buildValueChain(company())!;
    expect(chain.customers.map((c) => c.name)).toEqual(["販売店", "法人"]);
    expect(chain.customers[0].segmentIds).toEqual(["segment-cars", "segment-finance"]);
    expect(chain.segments.find((s) => s.businessId === "other")!.customerIds).toEqual([]);
  });

  it("uses the business model's customers only when no business names any", () => {
    const c = company();
    c.businesses = c.businesses.map((b) => ({ ...b, customers: undefined }));
    const chain = buildValueChain(c)!;
    expect(chain.customers.map((x) => x.name)).toEqual(["全社の顧客"]);
  });

  it("points a supplier with no named business at the company, not at every business", () => {
    const chain = buildValueChain(company())!;
    const goods = chain.links.filter((l) => l.flow === "goods" && l.source.startsWith("supplier"));
    expect(goods.map((l) => [l.source, l.target])).toEqual([
      ["supplier-1", "segment-cars"],
      ["supplier-2", COMPANY_NODE],
    ]);
  });

  it("runs every goods link back as money, and sizes nothing without printed amounts", () => {
    const chain = buildValueChain(company())!;
    const goods = chain.links.filter((l) => l.flow === "goods");
    const money = chain.links.filter((l) => l.flow === "money");
    expect(money.map((l) => [l.target, l.source])).toEqual(goods.map((l) => [l.source, l.target]));
    expect(chain.segments.every((s) => s.amount === null && s.share === null)).toBe(true);
    expect(chain.revenue).toBeNull();
  });

  it("computes each business's share from the printed amounts", () => {
    const chain = buildValueChain(
      company({
        segmentRevenue: {
          fiscalYear: "2026年3月期",
          periodEnd: "2026-03-31",
          label: "外部顧客への売上高",
          items: [
            { businessId: "cars", amount: 750_000_000_000 },
            { businessId: "finance", amount: 200_000_000_000 },
            { businessId: "other", amount: 50_000_000_000 },
          ],
          sourceIds: ["yuho-2026"],
        },
      }),
    )!;
    expect(chain.segments.map((s) => s.share)).toEqual([75, 20, 5]);
    expect(chain.revenue?.label).toBe("外部顧客への売上高");
  });

  it("draws nothing for an entry with no businesses", () => {
    expect(buildValueChain(company({ businesses: [] }))).toBeNull();
  });
});

describe("companyMetrics", () => {
  it("computes the net margin from the latest year, with the printed labels as its formula", () => {
    const m = companyMetrics(company({ financials: [record({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", netIncome: 1 }), record()] }))!;
    expect(m.netProfitMargin).toMatchObject({ percent: 5, formula: "親会社株主に帰属する当期純利益 ÷ 売上高", fiscalYear: "2026年3月期" });
  });

  it("leaves the margin out when a figure is not printed or revenue is zero", () => {
    expect(companyMetrics(company({ financials: [record({ netIncome: null })] }))!.netProfitMargin).toBeNull();
    expect(companyMetrics(company({ financials: [record({ revenue: 0 })] }))!.netProfitMargin).toBeNull();
  });

  it("computes the overseas share from regional revenue with exactly one domestic row", () => {
    const regional = (items: { region: string; domestic: boolean; amount: number }[]) =>
      company({ regionalRevenue: { fiscalYear: "2026年3月期", periodEnd: "2026-03-31", label: "売上高", items, sourceIds: ["yuho-2026"] } });
    const m = companyMetrics(
      regional([
        { region: "日本", domestic: true, amount: 400_000_000 },
        { region: "北米", domestic: false, amount: 500_000_000 },
        { region: "その他", domestic: false, amount: 100_000_000 },
      ]),
    )!;
    expect(m.overseasSalesRatio?.percent).toBe(60);
    expect(companyMetrics(regional([{ region: "北米", domestic: false, amount: 1_000 }]))!.overseasSalesRatio).toBeNull();
  });

  it("ranks businesses by printed segment revenue, else keeps the entry's order", () => {
    expect(companyMetrics(company())!.topBusinesses).toEqual(["自動車", "金融", "その他"]);
    const ranked = companyMetrics(
      company({
        segmentRevenue: {
          fiscalYear: "2026年3月期",
          periodEnd: "2026-03-31",
          label: "外部顧客への売上高",
          items: [
            { businessId: "cars", amount: 1_000 },
            { businessId: "other", amount: 9_000 },
          ],
          sourceIds: ["yuho-2026"],
        },
      }),
    )!;
    expect(ranked.topBusinesses).toEqual(["その他", "自動車", "金融"]);
  });
});
