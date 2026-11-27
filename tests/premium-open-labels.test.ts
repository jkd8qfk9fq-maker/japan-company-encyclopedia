import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PREMIUM_FEATURES_OPEN as FROM_PLAN } from "@/lib/plan";
import { PREMIUM_FEATURES_OPEN } from "@/lib/premium-open";

/**
 * JCE-075 stands every premium gate open, so a label that still calls an open feature "（プレミアム）" would
 * contradict what the reader sees (and what /plan案内 and the help page say). The headings beside the gates
 * switch on the same flag the gates read: open drops the premium label and says the block is free; closing
 * the flag brings the label and the gate back together. These tests pin that coupling.
 */
describe("premium labels while the features are open (JCE-075)", () => {
  it("keeps one flag: src/lib/plan re-exports the module Server Components read", () => {
    expect(FROM_PLAN).toBe(PREMIUM_FEATURES_OPEN);
  });

  it("switches the company-page headings on the flag, with a free-open note", () => {
    for (const [file, ja, en] of [
      ["src/components/company/industry-comparison.tsx", "業界比較", "Industry comparison"],
      ["src/components/company/financial-deep-dive.tsx", "財務の深掘り", "Financial deep dive"],
    ] as const) {
      const source = readFileSync(file, "utf8");
      expect(source).toContain("PREMIUM_FEATURES_OPEN");
      // Closed form keeps the premium label; open form drops it and adds the free-open note.
      expect(source).toContain(`${ja}（プレミアム）`);
      expect(source).toContain(`${en} (Premium)`);
      expect(source).toContain("現在、無料で公開しています。");
    }
  });

  it("drops the plan-benefit wording from the report footer while open", () => {
    const source = readFileSync("src/components/company/company-report.tsx", "utf8");
    expect(source).toContain("PREMIUM_FEATURES_OPEN");
    expect(source).toContain("プレミアムプランの特典として、このレポートは印刷して第三者への提示にも使えます。");
    expect(source).toContain("このレポートは印刷して第三者への提示にも使えます。");
  });

  it("leaves the gate itself as a pure view switch: open renders the children, nothing else", () => {
    const gate = readFileSync("src/components/company/premium-gate.tsx", "utf8");
    expect(gate).toContain("if (plan || PREMIUM_FEATURES_OPEN) return <>{children}</>;");
  });
});
