import { describe, expect, it } from "vitest";
import { PREMIUM_FEATURES_OPEN, adsSuppressed } from "@/lib/plan";
import type { PlanKind, StoredPlan } from "@/lib/storage/stores";

/**
 * Ad suppression (JCE-064's rule, named in JCE-153): a reader who really pays sees no ads anywhere on
 * the site. The rule reads the stored plan only — either plan kind counts (the union rule of JCE-140),
 * the plan must still be inside its paid period, and PREMIUM_FEATURES_OPEN (JCE-075: the feature gates
 * stand open to everyone) never enters into it, so a reader who has not paid keeps seeing ads while
 * the gates are open.
 */
const NOW = Date.parse("2026-11-28T00:00:00Z");
const plan = (kind: PlanKind, paidUntil: number): StoredPlan => ({ code: "sub_12345678", paidUntil, checkAfter: paidUntil, kind });

describe("adsSuppressed — a paid plan removes ads (JCE-153)", () => {
  it("no stored plan, ads stay", () => {
    expect(adsSuppressed(null, NOW)).toBe(false);
  });

  it("a ¥1,100 analysis plan inside its paid period removes ads", () => {
    expect(adsSuppressed(plan("analysis", NOW + 60_000), NOW)).toBe(true);
  });

  it("a ¥390 premium plan inside its paid period removes ads too (JCE-140 union rule)", () => {
    expect(adsSuppressed(plan("premium", NOW + 60_000), NOW)).toBe(true);
  });

  it("a plan whose paid period has ended removes nothing", () => {
    expect(adsSuppressed(plan("analysis", NOW - 1), NOW)).toBe(false);
    expect(adsSuppressed(plan("premium", NOW), NOW)).toBe(false);
  });

  it("the open-gates flag is not a payment: it never suppresses ads by itself", () => {
    expect(PREMIUM_FEATURES_OPEN).toBe(true);
    expect(adsSuppressed(null, NOW)).toBe(false);
  });
});
