import { describe, expect, it } from "vitest";
import { chartRecords, featuredCompanies, recentlyUpdated, shortDate } from "../src/lib/home";
import type { Company, FinancialRecord } from "../src/types/company";

/**
 * Which companies the front page offers. Both lists show only pages that have been written and are not
 * under review, and neither is a ranking — the order only decides which few to show.
 */

const year = (y: number, revenue: number | null, netIncome: number | null): FinancialRecord =>
  ({ fiscalYear: `${y}年3月期`, periodEnd: `${y}-03-31`, revenue, netIncome }) as FinancialRecord;

const company = (id: string, over: Partial<Company> = {}, years: FinancialRecord[] = []): Company =>
  ({
    id,
    code: "1000",
    name: id,
    description: "説明",
    status: { state: "published" },
    financials: years,
    updatedAt: "2026-10-01",
    industries: [],
    ...over,
  }) as unknown as Company;

const fiveYears = (revenue: number) => [2022, 2023, 2024, 2025, 2026].map((y) => year(y, revenue, revenue / 10));

describe("featuredCompanies", () => {
  it("offers only published companies with a description and enough complete years", () => {
    const list = featuredCompanies([
      company("ok", {}, fiveYears(100)),
      company("review", { status: { state: "needs-attention", notes: ["x"] } }, fiveYears(900)),
      company("figures", { status: { state: "figures-only" }, description: null }, fiveYears(800)),
      company("short", {}, fiveYears(700).slice(0, 3)),
      company("gaps", {}, [year(2022, 5, null), year(2023, 5, null), year(2024, 5, null), year(2025, 5, null), year(2026, 5, 1)]),
    ]);
    expect(list.map((c) => c.id)).toEqual(["ok"]);
  });

  it("orders by latest revenue, ties by id, and stops at the limit", () => {
    const list = featuredCompanies([company("b", {}, fiveYears(50)), company("a", {}, fiveYears(50)), company("big", {}, fiveYears(500)), company("small", {}, fiveYears(5))], 3);
    expect(list.map((c) => c.id)).toEqual(["big", "a", "b"]);
  });
});

describe("chartRecords", () => {
  it("is the five latest years with both figures, oldest first", () => {
    const c = company("x", {}, [2019, 2020, 2021, 2022, 2023, 2024, 2025].map((y) => year(y, 10, 1)).concat(year(2026, 10, null)));
    expect(chartRecords(c).map((r) => r.periodEnd.slice(0, 4))).toEqual(["2021", "2022", "2023", "2024", "2025"]);
  });
});

describe("recentlyUpdated", () => {
  it("is the most recent described pages, skipping figures-only, ties by id", () => {
    const list = recentlyUpdated(
      [
        company("old", { updatedAt: "2026-09-01" }),
        company("b", { updatedAt: "2026-10-11" }),
        company("a", { updatedAt: "2026-10-11" }),
        company("thin", { status: { state: "figures-only" }, updatedAt: "2026-10-12" }),
        company("flag", { status: { state: "needs-attention", notes: ["x"] }, updatedAt: "2026-10-10" }),
      ],
      3,
    );
    expect(list.map((c) => c.id)).toEqual(["a", "b", "flag"]);
  });
});

describe("shortDate", () => {
  it("reads the text, so the time zone cannot move the day", () => {
    expect(shortDate("2026-10-11")).toBe("10/11");
    expect(shortDate("2026-01-05")).toBe("1/5");
    expect(shortDate("not a date")).toBe("not a date");
  });
});
