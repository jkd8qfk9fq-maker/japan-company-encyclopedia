import { describe, expect, it } from "vitest";
import { APPROVERS, defaultApprover, effectiveApproval, isFormalApproval } from "@/lib/content/approvers";
import { checkCompany } from "@/lib/content/integrity";
import { companySchema, revisionSchema, sourceSchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import { approvalFor, resolveApprover, runByAgent } from "../scripts/pipeline/approvers.mjs";
import { docIdOf, enrichSources, jstDate, stampAccessedAt } from "../scripts/pipeline/source-meta.mjs";

/**
 * The metadata layer (docs/continuous-pipeline-design.md §4.2, JCE-024): where a fact comes from and as of when, who
 * approved an explanation, and the perspectives that keep the company's words apart from analysis. Every new field is
 * optional, so the entries written before it stay valid.
 */
const yuho = { id: "yuho-2026", title: "有価証券報告書", publisher: "アクメ株式会社", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YED6.pdf", accessedAt: "2026-10-19" };

describe("sources", () => {
  it("may name the EDINET document and the point in time it describes", () => {
    expect(sourceSchema.safeParse({ ...yuho, docId: "S100YED6", asOf: "2026-03-31" }).success).toBe(true);
    expect(sourceSchema.safeParse({ ...yuho, docId: "not-a-doc" }).success).toBe(false);
    expect(sourceSchema.safeParse(yuho).success).toBe(true); // older sources stay valid
  });

  it("are enriched from the URL and the filing the entry is built on", () => {
    expect(docIdOf(yuho.url)).toBe("S100YED6");
    const [s, other] = enrichSources([yuho, { id: "ir", url: "https://www.example.co.jp/ir.pdf" }], { docID: "S100YED6", periodEnd: "2026-03-31" });
    expect(s).toMatchObject({ docId: "S100YED6", asOf: "2026-03-31" });
    expect(other).toEqual({ id: "ir", url: "https://www.example.co.jp/ir.pdf" });
  });

  it("do not get an asOf from a filing they are not", () => {
    const [s] = enrichSources([yuho], { docID: "S100ZZZZ", periodEnd: "2027-03-31" });
    expect(s.docId).toBe("S100YED6");
    expect(s.asOf).toBeUndefined();
  });

  it("get the date they were read from the system, in Japan's date — never from an agent, never in the future", () => {
    const other = { ...yuho, id: "yuho-2025", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100AAAA.pdf", accessedAt: "2025-06-30" };
    // A pack built at 03:29 JST on the 19th is the 18th in UTC: the date written is Japan's, and the gate checks Japan's.
    expect(jstDate("2026-10-18T18:29:41.616Z")).toBe("2026-10-19");
    const [s, kept] = stampAccessedAt([{ ...yuho, accessedAt: "2099-01-01" }, other], "S100YED6", "2026-10-18T18:29:41.616Z", "2026-10-19");
    expect(s.accessedAt).toBe("2026-10-19");
    expect(kept.accessedAt).toBe("2025-06-30"); // another document's source keeps when it was read
    expect(stampAccessedAt([yuho], "S100YED6", "2026-10-21T00:00:00Z", "2026-10-20")[0].accessedAt).toBe("2026-10-20");
    expect(stampAccessedAt([yuho], "S100YED6", undefined, "2026-10-20")[0].accessedAt).toBe("2026-10-20");
  });

  it("keep an asOf already set", () => {
    const [s] = enrichSources([{ ...yuho, asOf: "2025-03-31" }], { docID: "S100YED6", periodEnd: "2026-03-31" });
    expect(s.asOf).toBe("2025-03-31");
  });
});

describe("approvals", () => {
  const approval = { approver: { id: "yugenq", name: "YUGENQ", kind: "operator" }, approvedAt: "2026-10-19T03:00:00.000Z", reviewHash: "3942dcced774961c", fields: ["businesses"] };
  const revision = { id: "2026-10-19-company-acme-described", targetType: "company", targetId: "acme", changedAt: "2026-10-19", summary: "解説を追加" };

  it("record who approved, when and what they read", () => {
    expect(revisionSchema.safeParse({ ...revision, approval }).success).toBe(true);
    expect(revisionSchema.safeParse(revision).success).toBe(true); // revisions before approvals stay valid
  });

  it("refuse an approval without an approver or a time", () => {
    expect(revisionSchema.safeParse({ ...revision, approval: { ...approval, approver: undefined } }).success).toBe(false);
    expect(revisionSchema.safeParse({ ...revision, approval: { ...approval, approvedAt: "yesterday" } }).success).toBe(false);
  });

  it("name YUGENQ by default, and only approvers on the list", () => {
    expect(defaultApprover()).toEqual({ id: "yugenq", name: "YUGENQ", kind: "operator" });
    expect(APPROVERS.map((a) => a.id)).toContain("yugenq");
    expect(resolveApprover(undefined)).toEqual(defaultApprover());
    expect(() => resolveApprover("someone-else")).toThrow(/approvers\.json/);
    expect(() => resolveApprover("claude-code")).toThrow(/approvers\.json/); // an agent is never chosen as an approver
  });

  it("record an approval an AI ran as the AI's, on the person's authority — never as the person's", () => {
    expect(runByAgent({ CLAUDECODE: "1" })).toBe(true);
    expect(runByAgent({})).toBe(false);
    const formal = approvalFor({ env: {}, at: "2026-10-19T03:00:00.000Z", reviewHash: "3942dcced774961c" });
    expect(formal.approver.id).toBe("yugenq");
    expect(formal).not.toHaveProperty("onBehalfOf");
    const proxy = approvalFor({ env: { CLAUDECODE: "1" }, at: "2026-10-19T03:00:00.000Z" });
    expect(proxy.approver).toMatchObject({ id: "claude-code", kind: "agent" });
    expect(proxy.onBehalfOf?.id).toBe("yugenq");
    expect(proxy.basis).toContain("正式な承認ではない");
    expect(isFormalApproval(formal as never)).toBe(true);
    expect(isFormalApproval(proxy as never)).toBe(false);
    expect(revisionSchema.safeParse({ ...revision, approval: proxy }).success).toBe(true);
  });

  it("refuse a proxy approval that does not say on whose authority, and a person's that claims one", () => {
    const agent = { id: "claude-code", name: "Claude Code（AI）", kind: "agent" };
    expect(revisionSchema.safeParse({ ...revision, approval: { ...approval, approver: agent } }).success).toBe(false);
    expect(revisionSchema.safeParse({ ...revision, approval: { ...approval, onBehalfOf: approval.approver } }).success).toBe(false);
  });

  it("read a corrected approval from the later revision, leaving the earlier one as it was written", () => {
    const original = { ...revision, approval } as never;
    const proxy = { ...approval, approver: { id: "claude-code", name: "Claude Code（AI）", kind: "agent" }, onBehalfOf: approval.approver, basis: "包括許可" };
    const correction = { ...revision, id: "2026-10-20-company-acme-approval-correction", changedAt: "2026-10-20T00:00:00.000Z", corrects: revision.id, before: { approval }, after: { approval: proxy } } as never;
    expect(effectiveApproval(original, [original, correction])?.approver.kind).toBe("agent");
    expect(effectiveApproval(original, [original])?.approver.kind).toBe("operator");
  });
});

describe("perspectives", () => {
  const base = {
    id: "acme",
    code: "1001",
    name: "アクメ",
    officialName: "アクメ株式会社",
    description: "鉄を売る会社です。",
    listings: [{ exchange: "tse", market: "プライム" }],
    industries: [{ industryId: "trading", primary: true }],
    businesses: [{ id: "steel", name: "鉄鋼", description: "鉄鋼を売ります。", sourceIds: ["yuho-2026"], locator: "【事業の内容】" }],
    financials: [],
    history: [],
    relatedCompanies: [],
    sources: [yuho],
    status: { state: "published" },
    updatedAt: "2026-10-19",
  };
  const context = { companyIds: new Set(["acme"]), termIds: new Set<string>(), featureIds: new Set<string>() };
  const disclosed = { text: "海外の販売網を広げると述べています。", asOf: "2026-06-19", sourceIds: ["yuho-2026"], locator: "【経営方針、経営環境及び対処すべき課題等】" };
  const analysis = { text: "海外の売上の比率が上がっています。", basis: "地域別の売上高（2022〜2026年3月期）", asOf: "2026-03-31", sourceIds: ["yuho-2026"] };

  it("keep the company's words and the analysis apart, each sourced and dated", () => {
    const entry = { ...base, perspectives: { strategy: { disclosed, analysis } } };
    expect(companySchema.safeParse(entry).success).toBe(true);
    expect(checkCompany(entry as Company, context)).toEqual([]);
  });

  it("refuse an analysis without its basis or a point in time", () => {
    expect(companySchema.safeParse({ ...base, perspectives: { strategy: { analysis: { ...analysis, basis: undefined } } } }).success).toBe(false);
    expect(companySchema.safeParse({ ...base, perspectives: { strategy: { disclosed: { ...disclosed, asOf: undefined } } } }).success).toBe(false);
  });

  it("refuse an unknown source and an empty perspective", () => {
    const unknown = { ...base, perspectives: { competitiveAdvantage: { disclosed: { ...disclosed, sourceIds: ["nowhere"] } } } };
    expect(checkCompany(unknown as Company, context).join()).toContain("nowhere");
    const empty = { ...base, perspectives: { industryPosition: {} } };
    expect(checkCompany(empty as Company, context).join()).toContain("業界内の位置づけ");
  });
});
