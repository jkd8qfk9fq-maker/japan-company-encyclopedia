import { describe, expect, it } from "vitest";
import { formatDateJa, formatMillionYen, formatYen, formatYenAxis } from "@/lib/utils/format";

describe("formatYen — Japanese 万/億/兆 grouping", () => {
  it("formats 兆 with the 億 remainder", () => {
    expect(formatYen(48_036_704_000_000)).toBe("48兆367億円");
  });

  it("omits a zero 億 remainder", () => {
    expect(formatYen(3_000_000_000_000)).toBe("3兆円");
  });

  it("carries a rounded-up 億 remainder into the next 兆", () => {
    // 1兆9,999.6億 must not print as "1兆10,000億円".
    expect(formatYen(1_999_960_000_000)).toBe("2兆円");
  });

  it("carries 9,999.6億 up to 1兆", () => {
    expect(formatYen(999_960_000_000)).toBe("1兆円");
  });

  it("groups 億 by thousands", () => {
    expect(formatYen(367_012_000_000)).toBe("3,670億円");
  });

  it("formats 万", () => {
    expect(formatYen(52_000_000)).toBe("5,200万円");
  });

  it("uses a real minus sign for losses, never a hyphen", () => {
    expect(formatYen(-125_000_000_000)).toBe("−1,250億円");
    expect(formatYen(-125_000_000_000)).not.toContain("-");
  });
});

describe("formatYenAxis", () => {
  it("keeps one decimal for fractional 兆", () => {
    expect(formatYenAxis(2_500_000_000_000)).toBe("2.5兆円");
  });
  it("prints integers without a decimal", () => {
    expect(formatYenAxis(10_000_000_000_000)).toBe("10兆円");
  });
  it("prints zero as a bare 0", () => {
    expect(formatYenAxis(0)).toBe("0");
  });
});

describe("formatMillionYen", () => {
  it("converts whole yen back to the 百万円 unit filings print", () => {
    expect(formatMillionYen(48_036_704_000_000)).toBe("48,036,704");
  });
});

describe("formatDateJa", () => {
  it("formats without going through Date, so no time zone can shift the day", () => {
    expect(formatDateJa("2026-03-31")).toBe("2026年3月31日");
    expect(formatDateJa("2026-01-01")).toBe("2026年1月1日");
  });
});
