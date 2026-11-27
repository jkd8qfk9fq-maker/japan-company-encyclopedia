import { describe, expect, it } from "vitest";
import { leadBarValue } from "@/lib/feature-meta";

/**
 * The lead-bar rule for feature tables (JCE-147), kept in its own file on purpose: it imports nothing
 * from the company data, so it runs anywhere — the data-driven half of the rule (every published
 * table's lead value is one of its rows) lives in tests/features.test.ts.
 */
describe("leadBarValue (JCE-147)", () => {
  it("picks the largest absolute bar as the lead value", () => {
    expect(leadBarValue([{ bar: 12.5 }, { bar: 92.1 }, { bar: 31.9 }])).toBe(92.1);
    expect(leadBarValue([{ bar: -40 }, { bar: 15 }])).toBe(40);
  });

  it("draws no bars — and so has no lead — when a row lacks a bar or all bars are zero", () => {
    expect(leadBarValue([{ bar: 10 }, {}])).toBeNull();
    expect(leadBarValue([{ bar: 0 }, { bar: 0 }])).toBeNull();
    expect(leadBarValue([])).toBeNull();
  });
});
