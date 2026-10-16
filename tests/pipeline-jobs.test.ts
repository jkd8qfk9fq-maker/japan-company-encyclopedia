import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, stat, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { claim, fragmentFiles, ownerAlive, reapDeadReservations, release, reservations, reserve, setStage, withLock } from "../scripts/pipeline/company-state.mjs";
import { checkConsistency, intakeCandidates, jobStage } from "../scripts/pipeline/jobs.mjs";
import { packProblem } from "../scripts/pipeline/pack.mjs";
import { EXTRACTOR_VERSION } from "../scripts/research/evidence-pack.mjs";

/**
 * The mass-registration plumbing: where a company is (a view derived from files that already
 * exist), which companies intake may take, what the consistency check refuses, and — the part
 * that matters most under parallel workers — that a company can be reserved by exactly one.
 * Everything runs in a throwaway directory; the real pipeline/ is never read or written.
 */

let root: string;
let originalCwd: string;
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "pipeline-jobs-"));
  await mkdir(join(root, "pipeline/state"), { recursive: true });
  await mkdir(join(root, "src/data/companies"), { recursive: true });
  originalCwd = process.cwd();
  process.chdir(root);
});
afterEach(async () => {
  process.chdir(originalCwd);
  await rm(root, { recursive: true, force: true });
});

const ready = (id: string) => {
  for (const s of ["identity", "edinet"]) {
    setStage(id, s, "running");
    setStage(id, s, "completed", "test");
  }
};
const stateOf = (stages: Record<string, string>, extra: Record<string, unknown> = {}) => ({
  companyId: "x",
  identity: { code: "1000" },
  stages: Object.fromEntries(
    ["identity", "edinet", "businessStructure", "businessModel", "history", "industry", "relatedCompanies", "terms", "sourceValidation", "qualityControl", "registration"].map((s) => [s, { status: stages[s] ?? "pending", attempts: 0, ...(extra[s] as object) }]),
  ),
});
const job = (facts: Parameters<typeof jobStage>[0]) => jobStage(facts);
const AGENTS = ["businessStructure", "history", "businessModel", "industry", "relatedCompanies", "terms"];
const allAgents = Object.fromEntries(AGENTS.map((s) => [s, "completed"]));

describe("where a company is", () => {
  it("is queued when it is in the universe and intake has not run", () => {
    expect(job({ state: null, tier: null })).toMatchObject({ stage: "queued", retryable: false });
  });

  it("retries an intake failure that an extractor fix could cure, and gives up on a foreign issuer", () => {
    expect(job({ state: null, tier: null, intakeFailure: "no revenue element matched" })).toMatchObject({ stage: "queued", retryable: true });
    expect(job({ state: null, tier: null, intakeFailure: "EDINET がこの書類のXBRL（CSV）を提供していない（外国会社の可能性）" }).stage).toBe("failed");
  });

  it("is 'intake' once the pack and draft exist but nothing is registered", () => {
    expect(job({ state: stateOf({ identity: "completed", edinet: "completed" }), tier: null }).stage).toBe("intake");
  });

  it("is figures-only → research → registration-ready as agent stages complete", () => {
    const base = { identity: "completed", edinet: "completed", registration: "completed" };
    expect(job({ state: stateOf(base), tier: "figures-only" }).stage).toBe("figures-only");
    expect(job({ state: stateOf({ ...base, businessStructure: "completed", history: "completed" }), tier: "figures-only" }).stage).toBe("research");
    expect(job({ state: stateOf({ ...base, ...allAgents }), tier: "figures-only" }).stage).toBe("registration-ready");
  });

  it("is published, or needs-attention, from the entry's own status", () => {
    expect(job({ state: null, tier: "published" }).stage).toBe("published");
    const j = job({ state: null, tier: "needs-attention", entryNotes: ["industry は暫定"] });
    expect(j.stage).toBe("needs-attention");
    expect(j.reasons).toEqual(["industry は暫定"]);
  });

  it("is needs-attention when a stage was parked for a person, with the reason attached", () => {
    const j = job({ state: stateOf({ identity: "completed", edinet: "completed", registration: "completed", industry: "needs-review" }, { industry: { note: "分類が無い" } }), tier: "figures-only" });
    expect(j.stage).toBe("needs-attention");
    expect(j.reasons[0]).toContain("分類が無い");
  });

  it("treats a company that was never listed as permanently failed, not as something to look at", () => {
    const j = job({ state: stateOf({ identity: "completed", edinet: "completed", registration: "needs-review" }, { registration: { note: "上場していないため数値のみの層にも載せられない" } }), tier: null });
    expect(j.stage).toBe("failed");
  });

  it("marks a stage that failed fewer than three times as retryable, in place", () => {
    const state = stateOf({ identity: "completed", edinet: "completed", registration: "completed", sourceValidation: "failed" }, { sourceValidation: { attempts: 1, note: "照合" } });
    expect(job({ state, tier: "figures-only" })).toMatchObject({ stage: "figures-only", retryable: true });
  });

  it("sends a correction that changes what is registered to needs-attention, whatever the tier", () => {
    for (const tier of ["published", "figures-only"]) {
      const j = job({ state: stateOf({ identity: "completed", edinet: "completed", registration: "completed" }), tier, amendmentAction: "update-financials" });
      expect(j.stage).toBe("needs-attention");
      expect(j.reasons[0]).toContain("訂正有価証券報告書");
    }
    expect(job({ state: null, tier: "published", amendmentAction: "record-only" }).stage).toBe("published");
  });

  it("carries the reservation as a flag on the stage, not as a stage", () => {
    expect(job({ state: stateOf({ identity: "completed", edinet: "completed", registration: "completed" }), tier: "figures-only", reserved: true })).toMatchObject({ stage: "figures-only", reserved: true });
  });
});

describe("which universe rows intake may take", () => {
  const rows = [
    { code: "1000", id: "" },
    { code: "2000", id: "" },
    { code: "3000", id: "already" },
    { code: "4000", id: "" },
  ];

  it("takes rows with no id", () => {
    expect(intakeCandidates(rows, []).map((r) => r.code)).toEqual(["1000", "2000", "4000"]);
  });

  it("never takes a company twice: a state that already carries the securities code blocks it, even if the universe row has no id yet", () => {
    // The run was killed after the pack and state were written but before the id reached the universe file.
    expect(intakeCandidates(rows, [{ identity: { code: "1000" } }]).map((r) => r.code)).toEqual(["2000", "4000"]);
  });

  it("leaves out companies already recorded as failures", () => {
    expect(intakeCandidates(rows, [], new Set(["2000"])).map((r) => r.code)).toEqual(["1000", "4000"]);
  });
});

describe("pipeline consistency check", () => {
  const entry = (id: string, code: string, tier = "figures-only") => ({ id, code, tier });
  const state = (id: string, code: string, registration = "completed") => ({ ...stateOf({ registration }), companyId: id, identity: { code } });
  const check = (over: Partial<Parameters<typeof checkConsistency>[0]>) => checkConsistency({ states: [], entries: [], universe: [], reservations: [], ...over });
  const rules = (p: ReturnType<typeof check>) => p.map((x) => `${x.level}:${x.rule}`);

  it("passes a consistent pipeline", () => {
    expect(check({ states: [state("a", "1000")], entries: [entry("a", "1000")], universe: [{ code: "1000", id: "a" }] })).toEqual([]);
  });

  it("refuses the same securities code twice, among states and among entries", () => {
    expect(rules(check({ states: [state("a", "1000"), state("b", "1000")], entries: [entry("a", "1000"), entry("b", "1000")] }))).toEqual(["error:duplicate-code", "error:duplicate-code"]);
  });

  it("refuses a registered company with no entry, and a code that differs between state and entry", () => {
    expect(rules(check({ states: [state("a", "1000")] }))).toContain("error:registered-without-entry");
    expect(rules(check({ states: [state("a", "1000")], entries: [entry("a", "9999")] }))).toContain("error:code-mismatch");
  });

  it("refuses a universe id that belongs to a state with a different code", () => {
    expect(rules(check({ states: [state("a", "1000")], entries: [entry("a", "1000")], universe: [{ code: "2000", id: "a" }] }))).toContain("error:universe-id-mismatch");
  });

  it("refuses a reservation held twice, or left on a company that is already published", () => {
    const r = [{ id: "a", owner: "w", at: new Date().toISOString() }];
    expect(rules(check({ states: [state("a", "1000")], entries: [entry("a", "1000", "published")], reservations: r }))).toContain("error:reservation-leak");
    expect(rules(check({ states: [state("a", "1000")], entries: [entry("a", "1000")], reservations: [...r, ...r] }))).toContain("error:duplicate-reservation");
  });

  it("warns about a reservation with no age, a stale one, and a stage left running", () => {
    const now = Date.parse("2026-10-02T12:00:00Z");
    const stale = state("a", "1000");
    stale.stages.businessStructure = { status: "running", attempts: 1, at: "2026-10-02T08:00:00Z" } as never;
    const p = check({
      states: [stale],
      entries: [entry("a", "1000")],
      reservations: [{ id: "a", owner: null, at: null }, { id: "b", owner: "w", at: "2026-09-30T00:00:00Z" }],
      now,
    });
    expect(rules(p)).toEqual(expect.arrayContaining(["warn:stale-running", "warn:reservation-no-age", "warn:reservation-stale"]));
    expect(p.every((x) => x.level === "warn")).toBe(true);
  });
});

describe("a stale or foreign evidence pack", () => {
  const identity = { docID: "O" };
  it("is missing, the wrong filing, stale, or fine", () => {
    expect(packProblem(null, identity)).toBe("missing");
    expect(packProblem({ filing: { docID: "X", originalDocID: "X" }, extractorVersion: EXTRACTOR_VERSION }, identity)).toBe("wrong-filing");
    expect(packProblem({ filing: { docID: "O" } }, identity)).toBe("stale-extractor"); // written before the field existed
    expect(packProblem({ filing: { docID: "O" }, extractorVersion: EXTRACTOR_VERSION - 1 }, identity)).toBe("stale-extractor");
    expect(packProblem({ filing: { docID: "C", originalDocID: "O" }, extractorVersion: EXTRACTOR_VERSION }, identity)).toBeNull();
  });
});

describe("reservation is exclusive", () => {
  it("is taken by the first caller only, and is idempotent for a caller that ignores the answer", () => {
    expect(reserve("a", "w1")).toBe(true);
    expect(reserve("a", "w2")).toBe(false);
    expect(reservations()).toEqual([{ id: "a", owner: "w1", at: expect.any(String) }]);
    release("a");
    expect(reservations()).toEqual([]);
    expect(reserve("a", "w2")).toBe(true);
  });

  it("still reads a line written before owners and times existed", async () => {
    await writeFile(join(root, "pipeline/reserved.tsv"), "# header\nold-company\n");
    expect(reservations()).toEqual([{ id: "old-company", owner: null, at: null }]);
    expect(reserve("old-company")).toBe(false);
  });

  it("claim() takes ready companies and reserves them in one step, never the same one twice", () => {
    for (const id of ["a", "b", "c", "d"]) ready(id);
    const first = claim("group1", 2, "w1");
    const second = claim("group1", 5, "w2");
    expect(first).toHaveLength(2);
    expect(second).toHaveLength(2);
    expect(new Set([...first, ...second]).size).toBe(4);
    expect(claim("group1", 5, "w3")).toEqual([]);
  });

  it("takes over a lock left by a process that died", async () => {
    await mkdir(join(root, "pipeline/.lock"));
    const old = new Date(Date.now() - 120_000);
    await utimes(join(root, "pipeline/.lock"), old, old);
    expect(withLock(() => "ok")).toBe("ok");
    await expect(stat(join(root, "pipeline/.lock"))).rejects.toThrow();
  });

  it("gives four processes claiming at once twenty different companies — none twice", async () => {
    for (let i = 0; i < 20; i++) ready(`company-${String(i).padStart(2, "0")}`);
    const queue = resolve(originalCwd, "scripts/pipeline/queue.mjs");
    const claimIn = (owner: string) =>
      new Promise<string[]>((done, fail) => {
        const child = spawn(process.execPath, [queue, "claim", "group1", "--limit", "5", "--owner", owner], { cwd: root });
        let out = "";
        child.stdout.on("data", (d) => (out += d));
        child.on("error", fail);
        child.on("close", () => done(out.split(/\r?\n/).filter(Boolean)));
      });
    const results = await Promise.all(["w1", "w2", "w3", "w4"].map(claimIn));
    const all = results.flat();
    expect(results.map((r) => r.length)).toEqual([5, 5, 5, 5]);
    expect(new Set(all).size).toBe(20);
    expect(reservations()).toHaveLength(20);
    expect((await readFile(join(root, "pipeline/reserved.tsv"), "utf8")).split("\n").filter((l) => l && !l.startsWith("#"))).toHaveLength(20);
  }, 60_000);
});

describe("a company's fragment files", () => {
  it("do not include another company whose id merely starts with this one (yamaha / yamaha-motor)", async () => {
    await mkdir(join(root, "pipeline/results"), { recursive: true });
    for (const f of ["yamaha-businessStructure.json", "yamaha-history.json", "yamaha-motor-businessStructure.json", "yamaha-motor-history.json", "yamaha-notes.json", "yamaha-terms.txt"]) {
      await writeFile(join(root, "pipeline/results", f), "{}");
    }
    const dir = join(root, "pipeline/results");
    expect(fragmentFiles("yamaha", dir).sort()).toEqual(["yamaha-businessStructure.json", "yamaha-history.json"]);
    expect(fragmentFiles("yamaha-motor", dir).sort()).toEqual(["yamaha-motor-businessStructure.json", "yamaha-motor-history.json"]);
    expect(fragmentFiles("nobody", dir)).toEqual([]);
  });
});

describe("a run killed mid-batch", () => {
  const DEAD = "register-figures:2147483646"; // a pid no process has

  it("can tell whether the process that holds a reservation is still running", () => {
    expect(ownerAlive(`register-figures:${process.pid}`)).toBe(true);
    expect(ownerAlive(DEAD)).toBe(false);
    expect(ownerAlive("worker")).toBeNull(); // no pid recorded: cannot be judged
    expect(ownerAlive(null)).toBeNull();
  });

  it("has its reservations released — and only those: a live owner's and an unjudgeable one's stay", async () => {
    const now = new Date().toISOString();
    await writeFile(join(root, "pipeline/reserved.tsv"), `# h\ndead-a\t${DEAD}\t${now}\ndead-b\t${DEAD}\t${now}\nlive\tregister-figures:${process.pid}\t${now}\nhand\tme\t${now}\nold-format\n`);
    expect(reapDeadReservations().sort()).toEqual(["dead-a", "dead-b"]);
    expect(reservations().map((r) => r.id)).toEqual(["live", "hand", "old-format"]);
    expect(reapDeadReservations()).toEqual([]);
  });

  it("is an error in the consistency check, so a mass run does not start from it", () => {
    const problems = checkConsistency({ states: [], entries: [], universe: [], reservations: [{ id: "a", owner: DEAD, at: new Date().toISOString() }], ownerAlive });
    expect(problems.map((p) => `${p.level}:${p.rule}`)).toContain("error:reservation-dead-owner");
  });
});
