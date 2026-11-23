import { describe, expect, it } from "vitest";
import { filingStatus } from "../scripts/pipeline/unattended-proof.mjs";

/**
 * The leak rule of the 30-day unattended proof (JCE-106): a filing counts as accounted only when
 * a lane provably has it, a young unaccounted filing is pending rather than a leak, and nothing
 * is ever accounted by assumption.
 */

const entry = { newestPeriodEnd: "2026-03-31", citedDocIds: new Set(["S100BBBB"]), tier: "published", newestHalfSourceDate: null as string | null };
const ctx = (over: Record<string, unknown> = {}) => ({
  amendmentsIndex: { byParent: { S100AAAA: [{ docID: "S100BBBB" }] } },
  runDocIds: new Set<string>(),
  watcherDocIds: new Set<string>(),
  asOf: "2026-11-24",
  graceDays: 3,
  ...over,
});
const filing = (over: Record<string, unknown> = {}) => ({
  docID: "S100CCCC",
  docTypeCode: "120",
  parentDocID: null,
  periodEnd: "2026-03-31",
  submitDateTime: "2026-06-20 15:00",
  ...over,
});

describe("filingStatus", () => {
  it("accounts an annual report the entry already reaches", () => {
    expect(filingStatus(filing(), entry, ctx())).toBe("accounted");
  });

  it("accounts an annual report a run record or the watcher names", () => {
    const older = { ...entry, newestPeriodEnd: "2025-03-31" };
    expect(filingStatus(filing(), older, ctx({ runDocIds: new Set(["S100CCCC"]) }))).toBe("accounted");
    expect(filingStatus(filing(), older, ctx({ watcherDocIds: new Set(["S100CCCC"]) }))).toBe("accounted");
  });

  it("calls an old unaccounted annual report a leak", () => {
    const older = { ...entry, newestPeriodEnd: "2025-03-31" };
    expect(filingStatus(filing(), older, ctx())).toBe("leak");
  });

  it("keeps a young unaccounted filing pending inside the grace window", () => {
    const older = { ...entry, newestPeriodEnd: "2025-03-31" };
    expect(filingStatus(filing({ submitDateTime: "2026-11-22 15:00" }), older, ctx())).toBe("pending");
  });

  it("accounts a correction held in the amendments index under its parent", () => {
    expect(filingStatus(filing({ docTypeCode: "130", docID: "S100BBBB", parentDocID: "S100AAAA" }), entry, ctx())).toBe("accounted");
    expect(filingStatus(filing({ docTypeCode: "130", docID: "S100ZZZZ", parentDocID: "S100AAAA" }), entry, ctx())).toBe("leak");
  });

  it("accounts an interim report the entry cites, and never guesses one from the index period end", () => {
    // S100BBBB is cited by the entry; the index periodEnd of a 半期報告書 is the fiscal year end
    // for some filers and the half's end for others, so it proves nothing on its own.
    expect(filingStatus(filing({ docTypeCode: "160", docID: "S100BBBB", periodEnd: "2027-03-31" }), entry, ctx())).toBe("accounted");
    expect(filingStatus(filing({ docTypeCode: "170", docID: "S100BBBB", periodEnd: null }), entry, ctx())).toBe("accounted");
    expect(filingStatus(filing({ docTypeCode: "160", periodEnd: "2026-09-30" }), entry, ctx())).toBe("leak");
  });

  it("puts interim filings of non-published companies out of scope, not in the leaks", () => {
    const draft = { ...entry, tier: "needs-attention" };
    expect(filingStatus(filing({ docTypeCode: "160" }), draft, ctx())).toBe("out-of-scope");
    expect(filingStatus(filing({ docTypeCode: "170" }), draft, ctx())).toBe("out-of-scope");
    // The annual lane covers every tier, so an annual report is never out of scope.
    expect(filingStatus(filing({ docTypeCode: "120" }), draft, ctx())).toBe("accounted");
  });

  it("accounts a half superseded by a newer half the entry already cites", () => {
    const holding = { ...entry, citedDocIds: new Set<string>(), newestHalfSourceDate: "2026-11-11" };
    expect(filingStatus(filing({ docTypeCode: "160", submitDateTime: "2025-11-12 15:00" }), holding, ctx())).toBe("accounted");
    // A correction to a held half stays strict: the newer half does not excuse it.
    expect(filingStatus(filing({ docTypeCode: "170", submitDateTime: "2025-11-12 15:00" }), holding, ctx())).toBe("leak");
  });
});
