import { describe, expect, it } from "vitest";
import { ANALYSIS_FEATURES_OPEN, analysisEntitled } from "@/lib/plan";
import type { StoredPlan } from "@/lib/storage/stores";

/**
 * The analysis layer's paid boundary (JCE-101, SaaS Step 2): the free part (own values and the
 * industry median) is outside the gate; the full analysis renders only when the layer is live
 * AND this browser holds a plan still inside its paid period — the plan the JCE-100 union check
 * (this site's entitlements, the borrowed check as fallback) last confirmed.
 *
 * JCE-140: the plan must also be the ¥1,100 学習β plan itself (kind "analysis"). A ¥390 premium
 * plan inside its paid period is still a paid plan, but it no longer opens this layer.
 */
const NOW = Date.parse("2026-11-23T00:00:00Z");
const plan = (paidUntil: number): StoredPlan => ({ code: "sub_12345678", paidUntil, checkAfter: paidUntil, kind: "analysis" });

describe("analysisEntitled — the analysis layer's boundary (JCE-101)", () => {
  it("the layer is live (Step 2 opened it)", () => {
    expect(ANALYSIS_FEATURES_OPEN).toBe(true);
  });

  it("no stored plan, no full analysis", () => {
    expect(analysisEntitled(null, NOW)).toBe(false);
  });

  it("a β plan inside its paid period opens the full analysis", () => {
    expect(analysisEntitled(plan(NOW + 60_000), NOW)).toBe(true);
  });

  it("a ¥390 premium plan inside its paid period does not open it (JCE-140)", () => {
    expect(analysisEntitled({ ...plan(NOW + 60_000), kind: "premium" }, NOW)).toBe(false);
  });

  it("a lapsed plan does not open it, even before usePlan clears it", () => {
    expect(analysisEntitled(plan(NOW - 1), NOW)).toBe(false);
    expect(analysisEntitled(plan(NOW), NOW)).toBe(false);
  });
});
