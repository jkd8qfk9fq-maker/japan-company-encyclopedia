import { describe, expect, it } from "vitest";
import { PauseRun, processCompany } from "../scripts/pipeline/autopilot-engine.mjs";

/**
 * The autopilot's state machine, with every effect replaced by a fake: no network, no model, no repository.
 * What these pin down is what the operator relies on — a step is never paid for twice, a failure stops one
 * company and not the queue, a limit pauses without spending an attempt, a model that touches the wrong files is
 * stopped, and nothing is ever registered here.
 */

type Deps = Parameters<typeof processCompany>[1];
type Rec = { id: string; status: string; attempts: Record<string, number>; holds: { kind: string; reason: string }[]; errors: { kind: string }[]; pause?: { kind: string; hint: string | null } | null; awaiting?: { group: string } | null; review?: { hash: string; readiness: string } | null; cost: { calls: number; usd: number } };
type ModelResult = { ok: boolean; kind: string; costUsd: number | null; durationMs: number; text: string; hint?: string | null };
type Over = {
  script?: string[];
  modelResults?: ModelResult[];
  mode?: string;
  checkGroup?: Deps["checkGroup"];
  fingerprint?: () => string;
  sheet?: { path: string; hash: string; readiness: string; errors: number; reviews: number };
};
const make = (over: Over = {}) => {
  const store = new Map<string, Rec>();
  const events: { id: string; type: string }[] = [];
  const calls = { advance: 0, model: [] as string[], sheet: 0, orders: [] as string[] };
  /** advance.mjs says what is needed next; the script is consumed in order. */
  const script: string[] = over.script ?? ["need: group1", "need: group2", "ready: finalize"];
  const modelResults: ModelResult[] = over.modelResults ?? [];
  const deps: Deps = {
    load: (id: string) => (store.has(id) ? JSON.parse(JSON.stringify(store.get(id))) : null),
    save: (r: Rec) => void store.set(r.id, JSON.parse(JSON.stringify(r))),
    event: (id: string, type: string, data: object = {}) => void events.push({ id, type, ...data }),
    facts: () => ({ entry: { id: "acme", code: "1001", tier: "figures-only" }, sameCode: [], ledger: { listing: "上場" }, registrationNote: null, reservedBy: null }),
    advance: async () => {
      calls.advance += 1;
      return script.shift() ?? "ready: finalize";
    },
    executor: {
      mode: over.mode ?? "claude-cli",
      run: async ({ label }: { label: string }) => {
        calls.model.push(label);
        return modelResults.shift() ?? { ok: true, kind: "ok", costUsd: 0.5, durationMs: 10, text: "" };
      },
    },
    checkGroup: over.checkGroup ?? (() => ({ missing: false, figuresOk: true, figuresOutput: "", findings: [] })),
    fingerprint: over.fingerprint ?? (() => "same"),
    sheet: async () => {
      calls.sheet += 1;
      return over.sheet ?? { path: "review/acme.md", hash: "h1", readiness: "ready", errors: 0, reviews: 0 };
    },
    order: (id: string, group: string) => {
      calls.orders.push(`${id}-${group}`);
      return `orders/${id}-${group}.md`;
    },
    identity: () => ({ name: "アクメ", code: "1001" }),
    release: () => {},
    cache: "/cache",
    sleep: async () => {},
  };
  return { deps, store, events, calls };
};
const err = (rule: string, path = "history[0].description") => ({ severity: "error", rule, path, message: `${rule} です` });

describe("a company that goes through", () => {
  it("asks the model for group 1 and group 2, once each, then writes the review sheet and stops", async () => {
    const { deps, calls } = make();
    const rec = await processCompany("acme", deps);
    expect(calls.model).toEqual(["group1", "group2"]);
    expect(calls.sheet).toBe(1);
    expect(rec.status).toBe("ready");
    expect(rec.review).toMatchObject({ hash: "h1", readiness: "ready" });
    expect(rec.cost).toMatchObject({ calls: 2, usd: 1 });
  });

  it("carries a review flag through to the record", async () => {
    const { deps } = make({ sheet: { path: "p", hash: "h2", readiness: "ready-with-flags", errors: 0, reviews: 2 } });
    expect((await processCompany("acme", deps)).status).toBe("ready-with-flags");
  });

  it("does not run again once settled — running the queue twice is harmless", async () => {
    const { deps, calls } = make();
    await processCompany("acme", deps);
    const modelCalls = calls.model.length;
    const again = await processCompany("acme", deps);
    expect(again.status).toBe("ready");
    expect(calls.model.length).toBe(modelCalls);
    expect(calls.advance).toBe(3);
  });

  it("never registers: nothing in the dependencies can", async () => {
    const { deps } = make();
    expect(Object.keys(deps).some((k) => /register|approve/i.test(k))).toBe(false);
  });
});

describe("pre-checks stop a company before any model is called", () => {
  it.each([
    ["not listed", { ledger: { listing: "非上場" } }],
    ["duplicate code", { sameCode: ["acme-2"] }],
    ["parked", { registrationNote: "非上場" }],
  ])("%s", async (_name, facts) => {
    const { deps, calls } = make();
    const base = deps.facts("acme");
    deps.facts = () => ({ ...base, ...facts });
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(calls.model).toEqual([]);
    expect(calls.advance).toBe(0);
  });

  it("does not take a company someone else reserved, but does take one it reserved itself", async () => {
    const { deps } = make();
    const base = deps.facts("acme");
    deps.facts = () => ({ ...base, reservedBy: "worker:99" });
    expect((await processCompany("acme", deps)).holds.map((h: { kind: string }) => h.kind)).toContain("reserved");
  });
});

describe("repair: only the violated lines, a bounded number of times", () => {
  it("repairs once and carries on", async () => {
    let n = 0;
    const { deps, calls } = make({ checkGroup: () => (n++ === 0 ? { missing: false, figuresOk: true, figuresOutput: "", findings: [err("filing-as-subject")] } : { missing: false, figuresOk: true, figuresOutput: "", findings: [] }) });
    const rec = await processCompany("acme", deps);
    expect(calls.model).toEqual(["group1", "group1-repair", "group2"]);
    expect(rec.status).toBe("ready");
    expect(rec.attempts.repair1).toBe(1);
  });

  it("holds the company when two repairs do not fix it, with the reason, and does not go on to group 2", async () => {
    const { deps, calls } = make({ checkGroup: () => ({ missing: false, figuresOk: true, figuresOutput: "", findings: [err("forbidden-financial-term")] }) });
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(rec.holds[0].kind).toBe("gate-failed");
    expect(rec.holds[0].reason).toContain("history[0].description");
    expect(calls.model).toEqual(["group1", "group1-repair", "group1-repair"]);
  });

  it("a figure the filing does not print is a failure like any other", async () => {
    const { deps } = make({ checkGroup: () => ({ missing: false, figuresOk: false, figuresOutput: "有報に無い金額: 123億円", findings: [] }) });
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(rec.holds[0].reason).toContain("123億円");
  });

  it("only errors count: review and info findings never trigger a repair", async () => {
    const { deps, calls } = make({ checkGroup: () => ({ missing: false, figuresOk: true, figuresOutput: "", findings: [{ severity: "review", rule: "x", path: "history[0]", message: "m" }] }) });
    await processCompany("acme", deps);
    expect(calls.model).toEqual(["group1", "group2"]);
  });
});

describe("fragments that are already there", () => {
  it("are checked and repaired before the gate, without asking for them again", async () => {
    let bad = true;
    const { deps, calls } = make({
      script: ["ready: finalize"],
      checkGroup: () => ({ missing: false, figuresOk: true, figuresOutput: "", findings: bad ? [err("not-listed", "relatedCompanies[0]")] : [] }),
    });
    deps.fragmentsExist = (_id, group) => group === "group2";
    const run = deps.executor.run;
    deps.executor.run = async (job: { label: string; prompt: string }) => {
      bad = false; // the repair fixes it
      return run(job);
    };
    const rec = await processCompany("acme", deps);
    expect(calls.model).toEqual(["group2-repair"]);
    expect(rec.status).toBe("ready");
  });

  it("are left alone when they are already clean", async () => {
    const { deps, calls } = make({ script: ["ready: finalize"] });
    deps.fragmentsExist = () => true;
    expect((await processCompany("acme", deps)).status).toBe("ready");
    expect(calls.model).toEqual([]);
  });

  it("hold the company when the repair cannot fix them", async () => {
    const { deps } = make({ script: ["ready: finalize"], checkGroup: () => ({ missing: false, figuresOk: true, figuresOutput: "", findings: [err("not-listed", "history[0]")] }) });
    deps.fragmentsExist = (_id, group) => group === "group1";
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(rec.holds[0].kind).toBe("gate-failed");
  });
});

describe("failures", () => {
  it("a rate limit pauses the whole queue and does not spend the company's attempt", async () => {
    const { deps, store } = make({ modelResults: [{ ok: false, kind: "rate-limit", costUsd: 0, durationMs: 1, text: "You've hit your session limit", hint: "resets 5:10am" }] });
    await expect(processCompany("acme", deps)).rejects.toBeInstanceOf(PauseRun);
    const rec = store.get("acme") as Rec;
    expect(rec.status).toBe("paused");
    expect(rec.pause).toMatchObject({ kind: "rate-limit", hint: "resets 5:10am" });
    expect(rec.attempts.agent1).toBe(0);
  });

  it("resumes after a pause from where it was, without redoing what finished", async () => {
    const { deps, calls, store } = make({ script: ["need: group1", "need: group2", "ready: finalize"], modelResults: [{ ok: true, kind: "ok", costUsd: 0.5, durationMs: 1, text: "" }, { ok: false, kind: "rate-limit", costUsd: 0, durationMs: 1, text: "limit" }] });
    await expect(processCompany("acme", deps)).rejects.toBeInstanceOf(PauseRun);
    expect((store.get("acme") as Rec).attempts.agent1).toBe(1);
    // the pipeline's own state remembers group 1 is done: advance now asks for group 2 straight away
    const second = make();
    second.deps.load = deps.load;
    second.deps.save = deps.save;
    second.deps.advance = async () => (second.calls.advance++ === 0 ? "need: group2" : "ready: finalize");
    const rec = await processCompany("acme", second.deps);
    expect(rec.status).toBe("ready");
    expect(second.calls.model).toEqual(["group2"]);
    expect(calls.model).toEqual(["group1", "group2"]);
  });

  it("a missing login stops the queue too (nothing is wrong with the company)", async () => {
    const { deps } = make({ modelResults: [{ ok: false, kind: "auth", costUsd: 0, durationMs: 1, text: "Not logged in" }] });
    await expect(processCompany("acme", deps)).rejects.toBeInstanceOf(PauseRun);
  });

  it("a failing model call is tried again, then the company is held — the queue is not stopped", async () => {
    const bad = { ok: false, kind: "network", costUsd: 0, durationMs: 1, text: "ECONNRESET" };
    const { deps, calls } = make({ script: ["need: group1", "need: group1", "need: group1"], modelResults: [bad, bad, bad] });
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(rec.holds[0].kind).toBe("ai-failed");
    expect(calls.model).toEqual(["group1", "group1"]);
    expect(rec.errors.length).toBe(2);
  });

  it("no fragments written counts as a failed attempt, not a success", async () => {
    const { deps } = make({ script: ["need: group1", "need: group1", "need: group1"], checkGroup: () => ({ missing: true, figuresOk: false, figuresOutput: "", findings: [] }) });
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(rec.errors.map((e: { kind: string }) => e.kind)).toContain("invalid-output");
  });

  it("stops a model that changed files it must not touch, and says so", async () => {
    let n = 0;
    const { deps } = make({ fingerprint: () => (n++ === 0 ? "before" : "after") });
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(rec.holds[0].kind).toBe("forbidden-write");
  });

  it("retries a transient pipeline failure, then holds a persistent one", async () => {
    const { deps, calls } = make({ script: ["FAIL: edinet: EDINET に接続できない ECONNRESET", "FAIL: edinet: EDINET に接続できない ECONNRESET", "FAIL: edinet: EDINET に接続できない ECONNRESET"] });
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(calls.advance).toBe(3);
    expect(rec.holds[0].kind).toBe("stage-failed");
  });

  it("a gate failure is held at once with the gate's reason (no blind retry)", async () => {
    const { deps, calls } = make({ script: ["need: group1", "need: group2", "FAIL: finalize: 不備: 出典 yuho-2026 の docID が違う"] });
    const rec = await processCompany("acme", deps);
    expect(rec.status).toBe("held");
    expect(rec.holds[0]).toMatchObject({ kind: "gate-failed" });
    expect(rec.holds[0].reason).toContain("docID");
    expect(calls.advance).toBe(3);
  });

  it("holds a company the pipeline parked (post-filing events) with the reason", async () => {
    const { deps } = make({ script: ["needs-review: 有報提出後の変更の可能性 — 公開買付報告書"] });
    const rec = await processCompany("acme", deps);
    expect(rec.holds[0]).toMatchObject({ kind: "parked" });
    expect(rec.holds[0].reason).toContain("公開買付");
  });

  it("does not loop forever on output it cannot read", async () => {
    const { deps } = make({ script: ["???"] });
    const rec = await processCompany("acme", deps);
    expect(rec.holds[0].kind).toBe("unknown-output");
  });

  it("refuses a review sheet with errors", async () => {
    const { deps } = make({ sheet: { path: "p", hash: "h", readiness: "ready", errors: 2, reviews: 0 } });
    expect((await processCompany("acme", deps)).holds[0].kind).toBe("gate-failed");
  });
});

describe("work orders: no model is called", () => {
  it("writes the order, waits, and carries on when the work appears", async () => {
    const first = make({ mode: "work-orders" });
    const rec = await processCompany("acme", first.deps);
    expect(rec.status).toBe("awaiting-ai");
    expect(rec.awaiting).toMatchObject({ group: "group1" });
    expect(first.calls.model).toEqual([]);
    expect(first.calls.orders).toEqual(["acme-group1"]);

    // a person has written the fragments; the pipeline's state now says what is next
    const second = make({ mode: "work-orders", script: ["need: group2"] });
    second.deps.load = first.deps.load;
    second.deps.save = first.deps.save;
    const rec2 = await processCompany("acme", second.deps);
    expect(rec2.status).toBe("awaiting-ai");
    expect(rec2.awaiting).toMatchObject({ group: "group2" });

    const third = make({ mode: "work-orders", script: ["ready: finalize"] });
    third.deps.load = first.deps.load;
    third.deps.save = first.deps.save;
    expect((await processCompany("acme", third.deps)).status).toBe("ready");
  });
});
