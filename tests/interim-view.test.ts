import { describe, expect, it } from "vitest";
import { interimLabel, interimView } from "../src/lib/interim";
import type { Company } from "../src/types/company";

const half = (end: string, revenue: number | null, profit: number | null, netIncome: number | null) => ({
  fiscalYear: `${Number(end.slice(0, 4)) + 1}年3月期`,
  period: "H1" as const,
  periodStart: `${end.slice(0, 4)}-04-01`,
  periodEnd: end,
  revenue,
  revenueLabel: "売上高",
  profit,
  profitLabel: "経常利益",
  netIncome,
  netIncomeLabel: "親会社株主に帰属する中間純利益",
  currency: "JPY" as const,
  accountingStandard: "jgaap" as const,
  sourceIds: ["hanki-202509"],
});

describe("interimView", () => {
  it("pairs the newest half with the same half a year earlier and the last full year", () => {
    const company = {
      financials: [{ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", revenue: 1000, profit: 100, netIncome: 80 }],
      interimFinancials: [half("2024-09-30", 450, -10, 30), half("2025-09-30", 500, 40, 36)],
    } as unknown as Company;
    const v = interimView(company)!;
    expect(v.current.periodEnd).toBe("2025-09-30");
    expect(v.prior?.periodEnd).toBe("2024-09-30");
    const [revenue, profit, net] = v.lines;
    expect(revenue).toMatchObject({ current: 500, prior: 450, shareOfLastYear: 0.5 });
    expect(revenue!.change).toBeCloseTo(50 / 450);
    // A swing from a loss: the change is measured against the loss's size, and the share against a positive year.
    expect(profit!.change).toBeCloseTo(50 / 10);
    expect(profit!.shareOfLastYear).toBe(0.4);
    expect(net!.change).toBeCloseTo(0.2);
  });

  it("gives nothing without halves, and no change without the previous half", () => {
    expect(interimView({ financials: [], interimFinancials: [] } as unknown as Company)).toBeNull();
    const v = interimView({ financials: [], interimFinancials: [half("2025-09-30", 500, null, 36)] } as unknown as Company)!;
    expect(v.prior).toBeNull();
    expect(v.lines.map((l) => l.key)).toEqual(["revenue", "netIncome"]);
    expect(v.lines[0]!.change).toBeNull();
  });
});

describe("interimLabel", () => {
  it("reads the full-year taxonomy label as a half-year one, without the loss suffix", () => {
    expect(interimLabel("親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）")).toBe("親会社株主に帰属する中間純利益");
    expect(interimLabel("当期利益又は当期損失（△）：親会社の所有者に帰属（IFRS）")).toBe("中間利益（親会社の所有者に帰属）");
    expect(interimLabel("経常利益又は経常損失（△）")).toBe("経常利益");
    expect(interimLabel("税引前利益又は税引前損失（△）（IFRS）")).toBe("税引前利益");
    expect(interimLabel("売上収益（IFRS）")).toBe("売上収益");
    expect(interimLabel("売上高")).toBe("売上高");
  });
});
