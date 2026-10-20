import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { agentPrompt, approvalProblems, buildReviewSheet, precheck } from "../scripts/pipeline/autopilot-lib.mjs";
import { changeRatio, explanationDocId, periodLabels, periodOfDoc, planUpdate, signature, staleReferences } from "../scripts/pipeline/diff-filings.mjs";
import { updatePlan } from "../scripts/pipeline/start-update.mjs";
import { CONTENT_STAGES, fieldOf, fragmentFromEntry, inScope, retainPublished, sourceIdsIn, updateScope } from "../scripts/pipeline/update-scope.mjs";

/**
 * Updating a registered explanation from a newer 有報 (docs/continuous-pipeline-design.md §4.5): only what the filing
 * changed is rewritten, the rest stays exactly as published, and nothing reaches src/data without the review sheet
 * and an approval.
 */

const url = (doc: string) => `https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/${doc}.pdf`;
const published = {
  id: "acme",
  code: "1001",
  name: "アクメ",
  officialName: "株式会社アクメ",
  description: "鉄を売る商社です。",
  listings: [{ exchange: "tse", market: "プライム" }],
  industries: [{ industryId: "trading" }],
  businesses: [{ name: "鉄鋼", description: "鋼材を仕入れて売る。", sourceIds: ["yuho-2025"] }],
  businessModel: { description: "鋼材の商社です。", sourceIds: ["yuho-2025"] },
  history: [{ date: "1950", title: "設立", sourceIds: ["yuho-2025"] }],
  relatedCompanies: [],
  financials: [
    { fiscalYear: "2025年3月期", periodEnd: "2025-03-31", revenue: 100, sourceIds: ["yuho-2025"], note: "旧注記" },
    { fiscalYear: "2026年3月期", periodEnd: "2026-03-31", revenue: 120, sourceIds: ["yuho-2026"] },
  ],
  sources: [
    { id: "yuho-2025", url: url("S100AAAA"), publishedAt: "2025-06-20", docId: "S100AAAA" },
    { id: "yuho-2026", url: url("S100BBBB"), publishedAt: "2026-06-20", docId: "S100BBBB" },
  ],
  status: { state: "needs-attention", notes: ["公開中の注記"] },
  updatedAt: "2026-07-01",
};

describe("which stages a newer filing changes", () => {
  it("ignores numbers and dates: a filing that only changes figures is the same text", () => {
    expect(signature("売上高は1,234百万円（2026年3月期）")).toBe(signature("売上高は9,876百万円（2027年3月期）"));
    expect(changeRatio("当社は鋼材を販売する", "当社は鋼材を販売する")).toBe(0);
    expect(changeRatio("", "新しい節")).toBe(1);
  });

  it("rewrites a stage only when its sections changed past the stage's threshold", () => {
    const same = { DescriptionOfBusinessTextBlock: "鋼材を仕入れて販売する。", CompanyHistoryTextBlock: "設立。上場。" };
    expect(planUpdate(same, same).rewrite).toEqual([]);
    const plan = planUpdate(same, { ...same, BusinessPolicyBusinessEnvironmentIssuesToAddressEtcTextBlock: "海外に工場を新設する。" });
    expect(plan.rewrite).toEqual(["businessModel"]);
  });

  it("also rewrites a stage whose text only quotes the old period's figures — in history only where it states the present", () => {
    const entry = {
      ...published,
      businesses: [{ name: "鉄鋼", description: "2025年3月期の売上収益は100百万円。", sourceIds: ["yuho-2025"] }],
      history: [
        { year: 2025, title: "2025年3月31日に上場", sourceIds: ["yuho-2025"] },
        { year: 2020, title: "設立", significance: "現在も主要な顧客です（2025年3月期の売上収益は100百万円）。", sourceIds: ["yuho-2025"] },
      ],
    };
    expect(periodLabels("2025-03-31")).toEqual(["2025年3月期", "2025年3月31日", "2025年3月末"]);
    const stale = staleReferences(entry, "2025-03-31");
    expect(stale).toEqual({ businessStructure: 1, businessModel: 0, history: 1, relatedCompanies: 0 });
    const same = { DescriptionOfBusinessTextBlock: "鋼材を仕入れて販売する。", CompanyHistoryTextBlock: "設立。上場。" };
    const plan = planUpdate(same, same, undefined, stale);
    expect(plan.rewrite).toEqual(["businessStructure", "history"]);
    expect(plan.stages.find((s) => s.stage === "businessStructure")).toMatchObject({ reason: "figures", stale: 1 });
    expect(periodOfDoc(published, "S100AAAA")).toBe("2025-03-31");
  });

  it("compares from the oldest filing the explanation still cites", () => {
    expect(explanationDocId({ ...published, businessModel: { description: "x", sourceIds: ["yuho-2026"] } })).toBe("S100AAAA");
    expect(explanationDocId({ ...published, businesses: [], history: [], businessModel: { description: "x", sourceIds: ["yuho-2026"] } })).toBe("S100BBBB");
  });
});

describe("the plan", () => {
  const diff = { kind: "rewrite", oldDoc: "S100AAAA", newDoc: "S100BBBB", newPeriodEnd: "2026-03-31", newSubmitted: "2026-06-20", rewrite: ["businessModel"] };
  it("keeps every stage the diff did not mark, and the older filings they cite", () => {
    const plan = updatePlan(diff, published);
    expect(plan.kind).toBe("planned");
    expect(plan.retainedStages).toEqual(CONTENT_STAGES.filter((s) => s !== "businessModel"));
    expect(plan.retainedDocIDs).toEqual(["S100AAAA"]);
  });
  it("waits for the figures: the new filing's year must already be in the table", () => {
    expect(updatePlan({ ...diff, newPeriodEnd: "2027-03-31" }, published).kind).toBe("not-refreshed");
  });
  it("does nothing when nothing changed enough", () => expect(updatePlan({ kind: "keep" }, published).kind).toBe("keep"));
});

describe("the scope", () => {
  const scope = updateScope({ retainedStages: ["businessStructure", "history", "industry", "relatedCompanies"] })!;
  it("is the rewritten stages' fields; nothing is scoped outside an update", () => {
    expect([...scope.fields].sort()).toEqual(["businessModel", "description", "perspectives"]);
    expect(scope.notes).toBe(true);
    expect(updateScope({})).toBeNull();
    expect(fieldOf("businesses[0].description")).toBe("businesses");
    expect(inScope("businessModel.flow[2].title", scope)).toBe(true);
    expect(inScope("businesses[0].description", scope)).toBe(false);
    expect(inScope("businesses[0].description", null)).toBe(true);
  });

  it("writes a kept stage back from what is published, with only the sources it cites", () => {
    const f = fragmentFromEntry(published, "businessStructure", ["S100AAAA"]);
    expect(f.retained).toEqual(["S100AAAA"]);
    expect(f.data).toEqual({ businesses: published.businesses, name: "アクメ", listings: published.listings });
    expect(f.sources.map((s: { id: string }) => s.id)).toEqual(["yuho-2025"]);
    expect([...sourceIdsIn(published.financials)]).toEqual(["yuho-2025", "yuho-2026"]);
  });

  it("registers the rewritten fields and keeps everything else byte for byte — never a figure", () => {
    const assembled = {
      ...published,
      name: "別の名前",
      businesses: [{ name: "書き換えてはならない", sourceIds: ["yuho-2026"] }],
      businessModel: { description: "鋼材と樹脂の商社です。", sourceIds: ["yuho-2026"] },
      financials: [{ fiscalYear: "2026年3月期", periodEnd: "2026-03-31", revenue: 999, sourceIds: ["yuho-2026"], note: "新注記" }],
      sources: [{ id: "yuho-2026", url: url("S100BBBB") }],
      status: { state: "published" },
      updatedAt: "2026-10-19",
    };
    const out = retainPublished(assembled, published, scope);
    expect(out.businessModel).toEqual(assembled.businessModel);
    expect(out.name).toBe("アクメ");
    expect(out.businesses).toEqual(published.businesses);
    expect(out.financials.map((r: { revenue: number }) => r.revenue)).toEqual([100, 120]);
    expect(out.financials.map((r: { note?: string }) => r.note)).toEqual([undefined, "新注記"]);
    expect(out.status).toEqual({ state: "needs-attention", notes: ["公開中の注記"] });
    expect(out.updatedAt).toBe("2026-10-19");
    expect(out.sources.map((s: { id: string }) => s.id).sort()).toEqual(["yuho-2025", "yuho-2026"]);
  });

  it("refuses one source id that names two documents", () => {
    const assembled = { ...published, sources: [{ id: "yuho-2025", url: url("S100CCCC") }] };
    expect(() => retainPublished(assembled, published, scope)).toThrow(/2つの文書/);
  });
});

describe("the autopilot in update mode", () => {
  const facts = { entry: { id: "acme", code: "1001", tier: "published" }, sameCode: [], ledger: { listing: "上場" } };
  it("takes a described company only for an update, and a figures-only one only for a registration", () => {
    expect(precheck(facts).map((h) => h.kind)).toEqual(["not-figures-only"]);
    expect(precheck({ ...facts, update: true })).toEqual([]);
    expect(precheck({ ...facts, entry: { ...facts.entry, tier: "figures-only" }, update: true }).map((h) => h.kind)).toEqual(["no-explanation"]);
  });

  it("asks the agent for the rewritten stages only", () => {
    const p = agentPrompt({ id: "acme", name: "アクメ", code: "1001", group: "group2", cache: "/c", update: { stages: ["businessModel"], oldDoc: "S100AAAA", newDoc: "S100BBBB" } });
    expect(p).toContain("pipeline/results/acme-businessModel.json。");
    expect(p).not.toContain("acme-industry.json");
    expect(p).toContain("S100BBBB");
  });

  it("shows the person before and after, and approves an update only of a described entry", () => {
    const entry = { ...published, businessModel: { description: "鋼材と樹脂の商社です。", sourceIds: ["yuho-2026"] } };
    const sheet = buildReviewSheet({
      entry,
      findings: [],
      notes: { warnings: [], needsReview: [], taxonomyGaps: [] },
      gate: { sourceValidation: "completed", qualityControl: "completed" },
      registry: new Map(),
      ledger: new Map(),
      record: { attempts: {}, cost: { usd: 0, calls: 1 } },
      hash: "h1",
      previous: published,
      kept: { count: 3, stages: ["businessStructure"] },
    });
    expect(sheet.markdown).toContain("解説の更新の確認シート");
    expect(sheet.markdown).toMatch(/### businessModel\n\n前:\n {2}- 鋼材の商社です。\n\n後:\n {2}- 鋼材と樹脂の商社です。/);
    expect(sheet.markdown).toContain("不備が 3 件ある");
    const ok = { record: { status: "ready", review: { hash: "h1" } }, confirmed: true, typedHash: "h1", stagedHash: "h1", policyErrors: 0, entryTier: "published", update: true };
    expect(approvalProblems(ok)).toEqual([]);
    expect(approvalProblems({ ...ok, entryTier: "figures-only" })).toHaveLength(1);
    expect(approvalProblems({ ...ok, update: false })).toHaveLength(1);
  });
});

describe("finalize --update (static: what it may and may not write)", () => {
  const finalize = readFileSync(join(process.cwd(), "scripts/pipeline/finalize.mjs"), "utf8");
  it("needs an approval, keeps index.ts, and refuses a change outside the scope", () => {
    expect(finalize).toContain('if (updating && !approval) throw new Error');
    expect(finalize).toContain("if (!upgrading && !updating) writeFileSync(indexPath, addToIndex(indexBefore));");
    expect(finalize).toContain("更新の範囲の外が変わっています");
    expect(finalize).toMatch(/merged\.entry = retainPublished\(merged\.entry, JSON\.parse\(readFileSync\(entryPath, "utf8"\)\), scope\)/);
  });
});
