import { describe, expect, it } from "vitest";
import { autoApplyPlan, submittedFromEntry } from "../scripts/pipeline/apply-amendments-auto.mjs";

/**
 * The fixed rule behind JCE-106's amendment auto-application: only the classes a deterministic
 * check can decide are applied, and an entry that disagrees with the ORIGINAL filing is always
 * held — it is stale, not amended, and must not be repaired under a correction's name.
 */

const row = (over: Record<string, unknown> = {}) => ({
  action: "record-only",
  status: "pending",
  tier: "published",
  registeredMismatch: 0,
  registeredMismatchOriginal: 0,
  ...over,
});

describe("autoApplyPlan", () => {
  it("closes a record-only correction without a write", () => {
    expect(autoApplyPlan(row()).mode).toBe("record-only");
  });

  it("applies a figures change when the entry agrees with the original filing", () => {
    expect(autoApplyPlan(row({ action: "update-financials", registeredMismatch: 3 })).mode).toBe("apply");
  });

  it("flags text as well when both figures and text changed", () => {
    expect(autoApplyPlan(row({ action: "update-financials+needs-attention", registeredMismatch: 2 })).mode).toBe("apply-flag-text");
  });

  it("notices an entry that already matches the filing of record", () => {
    expect(autoApplyPlan(row({ action: "update-financials", registeredMismatch: 0 })).mode).toBe("already-current");
  });

  it("holds an entry that disagrees with the original filing", () => {
    expect(autoApplyPlan(row({ action: "update-financials", registeredMismatch: 3, registeredMismatchOriginal: 1 })).mode).toBe("hold");
  });

  it("flags a text-only correction on a published entry", () => {
    expect(autoApplyPlan(row({ action: "needs-attention" })).mode).toBe("apply-flag-text");
  });

  it("holds incomplete corrections, errors and unregistered companies", () => {
    expect(autoApplyPlan(row({ status: "incomplete" })).mode).toBe("hold");
    expect(autoApplyPlan(row({ status: "error" })).mode).toBe("hold");
    expect(autoApplyPlan(row({ tier: "no-entry", action: "use-effective-at-registration" })).mode).toBe("hold");
  });
});

describe("submittedFromEntry", () => {
  it("reads the cited source's publishedAt for the newest period", () => {
    const entry = {
      financials: [
        { periodEnd: "2025-03-31", sourceIds: ["yuho-2025"] },
        { periodEnd: "2026-03-31", sourceIds: ["yuho-2026"] },
      ],
      sources: [
        { id: "yuho-2025", publishedAt: "2025-06-20" },
        { id: "yuho-2026", publishedAt: "2026-06-16" },
      ],
    };
    expect(submittedFromEntry(entry)).toBe("2026-06-16");
  });

  it("returns null when the source carries no date", () => {
    expect(submittedFromEntry({ financials: [{ periodEnd: "2026-03-31", sourceIds: ["x"] }], sources: [{ id: "x" }] })).toBeNull();
    expect(submittedFromEntry({ financials: [], sources: [] })).toBeNull();
  });
});
