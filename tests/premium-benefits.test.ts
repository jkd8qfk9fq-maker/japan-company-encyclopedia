import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { COMPARE_LIMITS } from "@/lib/compare";
import { PLAN_TRIAL_DAYS } from "@/lib/plan";
import { SAVED_CONDITIONS_LIMITS } from "@/lib/screening";

/** What the YUGENQ premium plan adds here (P2-1, JCE-064): settings, each larger with the plan than without. */
describe("premium benefits", () => {
  it("raise each limit with the plan", () => {
    expect(COMPARE_LIMITS.premium).toBeGreaterThan(COMPARE_LIMITS.free);
    expect(SAVED_CONDITIONS_LIMITS).toEqual({ free: 3, premium: 20 });
  });

  it("state the trial the plan's checkout gives, and that cancelling within it costs nothing", () => {
    expect(PLAN_TRIAL_DAYS).toBe(7);
    const gate = readFileSync("src/components/company/premium-gate.tsx", "utf8");
    expect(gate).toContain("日間無料で試す");
    expect(gate).toContain("その間に解約すれば料金はかかりません");
  });

  it("draw no ad, label or frame for a reader with the plan, and load no ad script for them", () => {
    const unit = readFileSync("src/components/ads/ad-unit.tsx", "utf8");
    expect(unit).toContain("if (adsSuppressed(plan)) return null;");
    expect(unit).toMatch(/if \(pushed\.current \|\| adsSuppressed\(planStore\.get\(\)\)\) return;/);
    expect(readFileSync("src/components/ads/ad-slot.tsx", "utf8")).not.toContain("<aside");
  });
});
