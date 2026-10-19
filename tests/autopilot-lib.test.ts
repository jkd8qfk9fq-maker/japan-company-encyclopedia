import { describe, expect, it } from "vitest";
import { agentPrompt, approvalProblems, buildReviewSheet, enqueue, findingsForGroup, hashOf, newRecord, operatorList, parseAdvance, precheck, repairPrompt, resolveCandidates, tally, violationLines } from "../scripts/pipeline/autopilot-lib.mjs";

describe("choosing candidates", () => {
  const byId = new Map([
    ["a-co", { id: "a-co", code: "1001", tier: "figures-only" }],
    ["b-co", { id: "b-co", code: "285A", tier: "figures-only" }],
    ["c-co", { id: "c-co", code: "3003", tier: "published" }],
  ]);
  const byCode = new Map([...byId.values()].map((e) => [e.code, e]));

  it("takes an id or a securities code, once, and says why it did not take the rest", () => {
    const r = resolveCandidates(["a-co", "1001", "285a", "c-co", "ghost"], { byId, byCode });
    expect(r.add).toEqual(["a-co", "b-co"]);
    expect(r.skipped.map((s) => s.token)).toEqual(["c-co", "ghost"]);
    expect(r.skipped[0].reason).toContain("published");
  });

  it("queues a company once however many times it is added", () => {
    const queue = { items: [] as { id: string; addedAt: string }[] };
    expect(enqueue(queue, ["a-co", "b-co"])).toEqual(["a-co", "b-co"]);
    expect(enqueue(queue, ["a-co", "c-co"])).toEqual(["c-co"]);
    expect(queue.items.map((i) => i.id)).toEqual(["a-co", "b-co", "c-co"]);
  });
});

describe("pre-checks: nothing is spent on a company that cannot be taken", () => {
  const ok = { entry: { id: "a", code: "1001", tier: "figures-only" }, sameCode: [], ledger: { listing: "上場" } };
  it("passes a figures-only, listed, unique, unreserved company", () => expect(precheck(ok)).toEqual([]));
  it("holds each way it can go wrong", () => {
    expect(precheck({ ...ok, entry: null }).map((h) => h.kind)).toEqual(["no-entry"]);
    expect(precheck({ ...ok, entry: { ...ok.entry, tier: "published" } }).map((h) => h.kind)).toContain("not-figures-only");
    expect(precheck({ ...ok, sameCode: ["a-2"] }).map((h) => h.kind)).toContain("duplicate-code");
    expect(precheck({ ...ok, ledger: null }).map((h) => h.kind)).toContain("not-in-ledger");
    expect(precheck({ ...ok, ledger: { listing: "非上場" } }).map((h) => h.kind)).toContain("not-listed");
    expect(precheck({ ...ok, registrationNote: "非上場" }).map((h) => h.kind)).toContain("parked");
    expect(precheck({ ...ok, reservedBy: "worker:1234" }).map((h) => h.kind)).toContain("reserved");
  });
});

describe("reading advance.mjs", () => {
  it.each([
    ["need: group1\nstages: businessStructure, history\ndocID: S1", { kind: "need", group: "group1" }],
    ["need: group2\nstages: x", { kind: "need", group: "group2" }],
    ["hanwa: staging\n  qualityControl: OK\nready: finalize\n", { kind: "ready" }],
    ["…\nregistered\n", { kind: "registered" }],
    ["done\n", { kind: "done" }],
  ])("%j", (text, expected) => expect(parseAdvance(text)).toMatchObject(expected));

  it("reads a failure with its stage and a parked company with its reason", () => {
    expect(parseAdvance("FAIL: finalize: 不備: 出典が1つもありません")).toMatchObject({ kind: "fail", stage: "finalize" });
    expect(parseAdvance("needs-review: 有報提出後の変更の可能性: 商号変更")).toMatchObject({ kind: "needs-review" });
  });

  it("does not guess when it cannot read the output", () => {
    expect(parseAdvance("")).toMatchObject({ kind: "unknown" });
    expect(parseAdvance("何か別のもの")).toMatchObject({ kind: "unknown" });
  });
});

describe("prompts stay short and point at the rules instead of repeating them", () => {
  const p = agentPrompt({ id: "acme", name: "アクメ", code: "1001", group: "group2", cache: "/cache" });
  it("names the brief, the evidence, the outputs and the checks", () => {
    expect(p).toContain("docs/agent-brief.md");
    expect(p).toContain("/cache/evidence/acme/");
    expect(p).toContain("related-candidates.json");
    for (const f of ["businessModel", "industry", "relatedCompanies", "terms"]) expect(p).toContain(`acme-${f}.json`);
    expect(p).toContain("check-policy.mjs acme --fragments");
    expect(p.length).toBeLessThan(1200);
  });
  it("group 1 does not mention the related-company list", () => expect(agentPrompt({ id: "acme", name: "アクメ", code: "1001", group: "group1", cache: "/c" })).not.toContain("related-candidates"));
  it("a repair sends only the violated lines and asks for nothing else", () => {
    const r = repairPrompt({ id: "acme", group: "group1", violations: ["history[2].description: 有報を主語にしない"], cache: "/c" });
    expect(r).toContain("history[2].description");
    expect(r).toContain("それ以外は変えない");
    expect(r.length).toBeLessThan(900);
  });
  it("a group is only judged on the fields it owns", () => {
    const f = [{ severity: "error", rule: "x", path: "history[0].description", message: "m" }, { severity: "error", rule: "y", path: "businessModel.description", message: "m" }] as never;
    expect(findingsForGroup(f, "group1").map((x: { rule: string }) => x.rule)).toEqual(["x"]);
    expect(findingsForGroup(f, "group2").map((x: { rule: string }) => x.rule)).toEqual(["y"]);
    expect(violationLines(f)[0]).toContain("history[0].description");
  });
});

describe("the review sheet", () => {
  const entry = {
    id: "acme",
    code: "1001",
    name: "アクメ",
    description: "鉄を売る商社です。",
    businessModel: { description: "鉄を仕入れて売る商社です。" },
    sources: [
      { id: "yuho-2026", title: "有価証券報告書", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100AAAA.pdf" },
      { id: "official", title: "IR", url: "https://www.example.co.jp/ir.pdf" },
    ],
    relatedCompanies: [{ companyId: "steel-a", relationship: "supplier", description: "形鋼を仕入れています。" }],
    status: { state: "published" },
  };
  const registry = new Map([["steel-a", { id: "steel-a", code: "5444", name: "大和工業", tier: "figures-only" }]]);
  const ledger = new Map([["5444", { listing: "上場" }]]);
  const base = { entry, findings: [] as never[], notes: { warnings: [], needsReview: [], taxonomyGaps: [] as { kind: string; subject: string; proposed: string; reason: string }[] }, gate: { sourceValidation: "completed: OK", qualityControl: "completed: OK" }, registry, ledger, record: { attempts: { agent1: 1 }, cost: { usd: 1.234, calls: 3 } }, hash: "abc123" };

  it("puts the three things the operator confirms up front: the sentence, the sources, the terms", () => {
    const { markdown, readiness } = buildReviewSheet(base);
    expect(readiness).toBe("ready");
    expect(markdown).toContain("鉄を仕入れて売る商社です。");
    expect(markdown).toContain("**EDINET 以外（一次資料か要確認）**");
    expect(markdown).toContain("検出なし");
    expect(markdown).toContain("--hash abc123");
    expect(markdown).toContain("大和工業（steel-a）");
  });

  it("becomes ready-with-flags when a person has something to decide", () => {
    expect(buildReviewSheet({ ...base, notes: { ...base.notes, needsReview: ["取得が完了したか不明"] } }).readiness).toBe("ready-with-flags");
    const review = [{ severity: "review", rule: "not-in-ledger", path: "relatedCompanies[0]", message: "上場を確認できない" }];
    const sheet = buildReviewSheet({ ...base, findings: review as never });
    expect(sheet.readiness).toBe("ready-with-flags");
    expect(sheet.markdown).toContain("上場を確認できない");
  });

  it("shows banned terms it found", () => {
    const f = [{ severity: "error", rule: "investment-term", path: "history[0].description", message: "投資指標にあたる語「ROE」は書かない" }];
    expect(buildReviewSheet({ ...base, findings: f as never }).markdown).toContain("ROE");
  });
});

describe("approval", () => {
  const record = { status: "ready", review: { hash: "h1" } };
  const ok = { record, confirmed: true, typedHash: "h1", stagedHash: "h1", policyErrors: 0, entryTier: "figures-only" };
  it("goes ahead only when everything the person read is what will be registered", () => expect(approvalProblems(ok)).toEqual([]));
  it("refuses without --confirm, without the hash, or with a wrong one", () => {
    expect(approvalProblems({ ...ok, confirmed: false })).toHaveLength(1);
    expect(approvalProblems({ ...ok, typedHash: null })).toHaveLength(1);
    expect(approvalProblems({ ...ok, typedHash: "zzz" })).toHaveLength(1);
  });
  it("refuses when the content changed after the sheet was written", () => {
    expect(approvalProblems({ ...ok, stagedHash: "h2", typedHash: "h2" }).join()).toContain("確認シートを作った後に内容が変わった");
  });
  it("refuses a company that is held, already registered, or already described — no double registration", () => {
    expect(approvalProblems({ ...ok, record: { ...record, status: "held" } }).join()).toContain("承認できません");
    expect(approvalProblems({ ...ok, record: { ...record, status: "registered" } })).toEqual(["すでに登録済みです（二重登録の防止）"]);
    expect(approvalProblems({ ...ok, entryTier: "published" }).join()).toContain("二重登録の防止");
    expect(approvalProblems({ ...ok, record: null })).toEqual(["autopilot の記録がありません"]);
  });
  it("refuses while the writing rules are broken", () => expect(approvalProblems({ ...ok, policyErrors: 2 }).join()).toContain("2 件"));
});

describe("the operator's list", () => {
  const rec = (id: string, status: string, over: object = {}) => ({ ...newRecord(id), status, ...over });
  it("orders what needs a person and leaves out what does not", () => {
    const list = operatorList([
      rec("held-co", "held", { holds: [{ kind: "gate-failed", reason: "数値が合わない" }] }) as never,
      rec("flag-co", "ready-with-flags", { review: { readiness: "ready-with-flags", reviews: 2 } }) as never,
      rec("clean-co", "ready") as never,
      rec("done-co", "registered") as never,
      rec("paused-co", "paused", { pause: { kind: "rate-limit", hint: "resets 5:10am" } }) as never,
    ]);
    expect(list.map((r) => r.id)).toEqual(["clean-co", "flag-co", "held-co", "paused-co"]);
    expect(list.find((r) => r.id === "held-co")?.why).toBe("数値が合わない");
    expect(list.find((r) => r.id === "paused-co")?.next).toContain("resets 5:10am");
  });
  it("counts statuses", () => expect(tally([{ status: "ready" }, { status: "ready" }, { status: "held" }])).toEqual({ ready: 2, held: 1 }));
  it("hashes deterministically", () => expect(hashOf("a")).toBe(hashOf("a")));
});
