import { describe, expect, it } from "vitest";
import { buildUpdates } from "../src/lib/engagement-data";
import type { Company } from "../src/types/company";
import type { Revision } from "../src/types/revision";

/**
 * JCE-071: a filing event carries what the filing says — the period and the entry's own printed revenue and net
 * income for it. Nothing computed, nothing on a correction, nothing where the figures are not held.
 */

const TODAY = "2026-11-19";

const source = (id: string, publishedAt: string) => ({ id, title: id, publisher: "EDINET", url: "https://example.com/", publishedAt, accessedAt: "2026-11-19" });

const fin = (over: Record<string, unknown> = {}) => ({
  fiscalYear: "2026年3月期",
  periodEnd: "2026-03-31",
  revenue: 367_000_000_000,
  revenueLabel: "売上高",
  profit: null,
  profitLabel: null,
  netIncome: 12_300_000_000,
  netIncomeLabel: "親会社株主に帰属する当期純利益",
  totalAssets: null,
  totalAssetsLabel: null,
  netAssets: null,
  netAssetsLabel: null,
  employees: null,
  currency: "JPY",
  accountingStandard: "jgaap",
  sourceIds: ["yuho-2026"],
  ...over,
});

const company = (over: Record<string, unknown> = {}): Company =>
  ({
    id: "example",
    name: "サンプル工業",
    sources: [source("yuho-2026", "2026-10-20"), source("hanki-2027", "2026-11-10"), source("tanshin-2027", "2026-08-04")],
    financials: [fin()],
    ...over,
  }) as unknown as Company;

describe("buildUpdates summaries", () => {
  it("puts the period and its printed revenue and net income on a yuho event", () => {
    const { events } = buildUpdates([company()], [], TODAY);
    expect(events).toEqual([["example", "yuho", "2026-10-20", "2026年3月期の有価証券報告書", "2026年3月期：売上高 3,670億円、親会社株主に帰属する当期純利益 123億円"]]);
  });

  it("takes the newest period a filing reports, not the older years it also prints", () => {
    const older = fin({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", revenue: 300_000_000_000, netIncome: 10_000_000_000 });
    const { events } = buildUpdates([company({ financials: [older, fin()] })], [], TODAY);
    expect(events).toHaveLength(1);
    expect(events[0]![4]).toContain("2026年3月期：");
    expect(events[0]![4]).toContain("3,670億円");
  });

  it("labels a half as its 中間期, with the record's own labels", () => {
    const half = {
      fiscalYear: "2027年3月期",
      period: "H1",
      periodStart: "2026-04-01",
      periodEnd: "2026-09-30",
      revenue: 200_000_000_000,
      revenueLabel: "売上収益",
      profit: null,
      profitLabel: null,
      netIncome: -5_000_000_000,
      netIncomeLabel: "親会社の所有者に帰属する中間利益",
      currency: "JPY",
      accountingStandard: "ifrs",
      sourceIds: ["hanki-2027"],
    };
    const { events } = buildUpdates([company({ financials: [], interimFinancials: [half] })], [], TODAY);
    expect(events).toEqual([["example", "hanki", "2026-11-10", "2027年3月期の半期報告書", "2027年3月期 中間期：売上収益 2,000億円、親会社の所有者に帰属する中間利益 −50億円"]]);
  });

  it("labels a quarter's lines 売上 and 純利益, as the quarterly section does, and marks them cumulative", () => {
    const q = {
      fiscalYearEnd: "2027-03-31",
      fiscalYear: "2027年3月期",
      quarter: 1,
      revenue: 100_000_000_000,
      operatingIncome: null,
      netIncome: 5_000_000_000,
      accountingStandard: "jgaap",
      consolidated: true,
      disclosedAt: "2026-08-04",
      sourceIds: ["tanshin-2027"],
    };
    const { events } = buildUpdates([company({ financials: [], quarterlyEarnings: [q] })], [], TODAY);
    expect(events).toEqual([["example", "tanshin", "2026-08-04", "2027年3月期 第1四半期の決算短信", "2027年3月期 第1四半期（累計）：売上 1,000億円、純利益 50億円"]]);
  });

  it("carries no figures on a correction, and none where the period holds neither figure", () => {
    const revision = { id: "2026-11-15-company-example-corrected", targetType: "company", targetId: "example", changedAt: "2026-11-15", summary: "訂正" } as unknown as Revision;
    const blank = fin({ revenue: null, netIncome: null, sourceIds: ["yuho-2026"] });
    const { events } = buildUpdates([company({ financials: [blank] })], [revision], TODAY);
    expect(events).toContainEqual(["example", "yuho", "2026-10-20", "2026年3月期の有価証券報告書"]);
    expect(events).toContainEqual(["example", "correction", "2026-11-15", "掲載内容の訂正"]);
    for (const e of events) expect(e).toHaveLength(4);
  });

  it("keeps the figure that is held when the other is not, and never computes a change", () => {
    const onlyIncome = fin({ revenue: null });
    const { events } = buildUpdates([company({ financials: [onlyIncome] })], [], TODAY);
    expect(events[0]![4]).toBe("2026年3月期：親会社株主に帰属する当期純利益 123億円");
    expect(events[0]![4]).not.toMatch(/%|前年|増減/);
  });
});
