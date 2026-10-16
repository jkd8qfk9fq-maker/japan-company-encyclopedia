import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  loadState,
  nextAgentGroup,
  readyForStage,
  release,
  reserve,
  setStage,
} from "../scripts/pipeline/company-state.mjs";
import { classifyPackFailure, companyTier, decideEntryAction } from "../scripts/pipeline/advance.mjs";

/**
 * The registration queue's state machine — success/failure/retry/needs-review/
 * already-done — run against a throwaway pipeline/ directory, never the real
 * one. company-state.mjs resolves every path off `process.cwd()` (it's a CLI
 * tool, not a library with an injectable root, the way ContentStore is), so
 * each test chdirs into a fresh temp directory rather than touching the
 * project's actual pipeline/state/ — the same "tests never touch production"
 * principle CLAUDE.md states for the database applies here to the pipeline's
 * own bookkeeping.
 */

let root: string;
let originalCwd: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "pipeline-state-"));
  await mkdir(join(root, "pipeline/state"), { recursive: true });
  await mkdir(join(root, "src/data/companies"), { recursive: true });
  originalCwd = process.cwd();
  process.chdir(root);
});

afterEach(async () => {
  process.chdir(originalCwd);
  await rm(root, { recursive: true, force: true });
});

/** Advance a company straight to "identity+edinet done, everything else
 * pending" — the starting point every real figures-only company is at. */
function seedReadyForGroup1(id: string) {
  setStage(id, "identity", "running");
  setStage(id, "identity", "completed", "test");
  setStage(id, "edinet", "running");
  setStage(id, "edinet", "completed", "test");
}

/** Fail a stage three times, the same running→failed pairing the real
 * scripts use, so the existing needs-review promotion actually fires. */
function failThreeTimes(id: string, stage: string) {
  for (let i = 0; i < 3; i++) {
    setStage(id, stage, "running");
    setStage(id, stage, "failed", `test failure ${i + 1}`);
  }
}

describe("nextAgentGroup", () => {
  it("returns null before identity/edinet are done", () => {
    expect(nextAgentGroup("acme")).toBeNull();
  });

  it("offers group 1 once identity+edinet are done", () => {
    seedReadyForGroup1("acme");
    expect(nextAgentGroup("acme")).toEqual(["businessStructure", "history"]);
  });

  it("offers only the still-pending stage within a partially-done group", () => {
    seedReadyForGroup1("acme");
    setStage("acme", "businessStructure", "running");
    setStage("acme", "businessStructure", "completed", "test");
    expect(nextAgentGroup("acme")).toEqual(["history"]);
  });

  it("offers group 2 once group 1 is fully completed", () => {
    seedReadyForGroup1("acme");
    for (const s of ["businessStructure", "history"]) {
      setStage("acme", s, "running");
      setStage("acme", s, "completed", "test");
    }
    expect(nextAgentGroup("acme")).toEqual(["businessModel", "industry", "relatedCompanies", "terms"]);
  });

  it("returns null once every stage is completed", () => {
    seedReadyForGroup1("acme");
    for (const s of ["businessStructure", "history", "businessModel", "industry", "relatedCompanies", "terms"]) {
      setStage("acme", s, "running");
      setStage("acme", s, "completed", "test");
    }
    expect(nextAgentGroup("acme")).toBeNull();
  });

  it("still offers a sibling stage when only one stage in the group is needs-review", () => {
    seedReadyForGroup1("acme");
    failThreeTimes("acme", "businessStructure");
    expect(loadState("acme").stages.businessStructure.status).toBe("needs-review");
    expect(nextAgentGroup("acme")).toEqual(["history"]);
  });

  it("does NOT advance to group 2 when every stage in group 1 is needs-review (regression: 2026-10-01)", () => {
    seedReadyForGroup1("acme");
    failThreeTimes("acme", "businessStructure");
    failThreeTimes("acme", "history");
    expect(loadState("acme").stages.businessStructure.status).toBe("needs-review");
    expect(loadState("acme").stages.history.status).toBe("needs-review");
    // Before the fix, an empty `todo` for group 1 (both stages excluded as
    // needs-review) fell through to group 2 as if group 1 had finished.
    expect(nextAgentGroup("acme")).toBeNull();
  });

  it("does NOT advance to group 2 when group 1 is completed+needs-review mixed (not fully done)", () => {
    seedReadyForGroup1("acme");
    setStage("acme", "businessStructure", "running");
    setStage("acme", "businessStructure", "completed", "test");
    failThreeTimes("acme", "history");
    expect(nextAgentGroup("acme")).toBeNull();
  });
});

describe("readyForStage", () => {
  it("excludes a reserved company from group1", () => {
    seedReadyForGroup1("acme");
    reserve("acme");
    expect(readyForStage("group1")).not.toContain("acme");
  });

  it("excludes a company whose group 1 is entirely needs-review from BOTH group1 and group2", () => {
    seedReadyForGroup1("acme");
    failThreeTimes("acme", "businessStructure");
    failThreeTimes("acme", "history");
    expect(readyForStage("group1")).not.toContain("acme");
    expect(readyForStage("group2")).not.toContain("acme");
  });

  it("excludes a permanently-parked company (registration: needs-review) from every stage", async () => {
    seedReadyForGroup1("acme");
    failThreeTimes("acme", "registration");
    expect(loadState("acme").stages.registration.status).toBe("needs-review");
    expect(readyForStage("group1")).not.toContain("acme");
    expect(readyForStage("finalize")).not.toContain("acme");
  });

  it("includes a figures-only company for finalize once both agent groups are done", async () => {
    seedReadyForGroup1("acme");
    for (const s of ["businessStructure", "history", "businessModel", "industry", "relatedCompanies", "terms"]) {
      setStage("acme", s, "running");
      setStage("acme", s, "completed", "test");
    }
    await writeFile(join(root, "src/data/companies/acme.json"), JSON.stringify({ status: { state: "figures-only" } }));
    expect(readyForStage("finalize")).toContain("acme");
  });

  it("excludes an already-published company from finalize, even though its registration stage is also 'completed'", async () => {
    seedReadyForGroup1("acme");
    for (const s of ["businessStructure", "history", "businessModel", "industry", "relatedCompanies", "terms"]) {
      setStage("acme", s, "running");
      setStage("acme", s, "completed", "test");
    }
    setStage("acme", "registration", "running");
    setStage("acme", "registration", "completed", "test");
    await writeFile(join(root, "src/data/companies/acme.json"), JSON.stringify({ status: { state: "published" } }));
    // Both this company and a still-figures-only one show registration:
    // completed — status.state is the only thing that tells them apart.
    expect(readyForStage("finalize")).not.toContain("acme");
  });

  it("includes a first-time company with no entry file yet once both groups are done", () => {
    seedReadyForGroup1("acme");
    for (const s of ["businessStructure", "history", "businessModel", "industry", "relatedCompanies", "terms"]) {
      setStage("acme", s, "running");
      setStage("acme", s, "completed", "test");
    }
    expect(readyForStage("finalize")).toContain("acme");
  });

  it("excludes a company whose qualityControl is needs-review, even though registration never touched that stage (regression: a-tie, 2026-10-01)", async () => {
    // finalize.mjs can fail qualityControl forever (e.g. no fitting
    // INDUSTRY_IDS category) without ever touching `registration`, which
    // stays "completed" from the original figures-only write. Only
    // qualityControl/sourceValidation needs-review says this entry is stuck.
    seedReadyForGroup1("acme");
    for (const s of ["businessStructure", "history", "businessModel", "industry", "relatedCompanies", "terms"]) {
      setStage("acme", s, "running");
      setStage("acme", s, "completed", "test");
    }
    // Mirrors the real shape: registration is already "completed" from the
    // original figures-only write, and stays that way — finalize.mjs's
    // qualityControl failure never touches it.
    setStage("acme", "registration", "running");
    setStage("acme", "registration", "completed", "数値のみで登録（解説は未作成）");
    for (let i = 0; i < 3; i++) {
      setStage("acme", "qualityControl", "running");
      setStage("acme", "qualityControl", "failed", `test failure ${i + 1}`);
    }
    expect(loadState("acme").stages.qualityControl.status).toBe("needs-review");
    expect(loadState("acme").stages.registration.status).toBe("completed"); // unchanged — the figures-only write
    await writeFile(join(root, "src/data/companies/acme.json"), JSON.stringify({ status: { state: "figures-only" } }));
    expect(readyForStage("finalize")).not.toContain("acme");
  });
});

describe("reserve / release", () => {
  it("round-trips and is idempotent", () => {
    reserve("acme");
    reserve("acme"); // idempotent, not a duplicate line
    seedReadyForGroup1("acme");
    expect(readyForStage("group1")).not.toContain("acme");
    release("acme");
    release("acme"); // idempotent, no-op on an already-released id
    expect(readyForStage("group1")).toContain("acme");
  });
});

describe("setStage retry → needs-review (existing mechanism, confirmed unchanged)", () => {
  it("stays failed before three running→failed cycles", () => {
    setStage("acme", "businessStructure", "running");
    setStage("acme", "businessStructure", "failed", "1");
    setStage("acme", "businessStructure", "running");
    setStage("acme", "businessStructure", "failed", "2");
    expect(loadState("acme").stages.businessStructure.status).toBe("failed");
  });

  it("promotes to needs-review on the third running→failed cycle", () => {
    failThreeTimes("acme", "businessStructure");
    expect(loadState("acme").stages.businessStructure.status).toBe("needs-review");
  });
});

describe("advance.mjs decision functions (pure, no I/O)", () => {
  it("companyTier reads status.state from the entry file", async () => {
    await writeFile(join(root, "src/data/companies/acme.json"), JSON.stringify({ status: { state: "needs-attention" } }));
    expect(companyTier(root, "acme")).toBe("needs-attention");
  });

  it("companyTier returns null when no entry file exists", () => {
    expect(companyTier(root, "acme")).toBeNull();
  });

  it("companyTier treats a missing status field as published", async () => {
    await writeFile(join(root, "src/data/companies/acme.json"), JSON.stringify({ name: "Acme" }));
    expect(companyTier(root, "acme")).toBe("published");
  });

  it("decideEntryAction says done for a published or needs-attention tier", () => {
    expect(decideEntryAction("published", "pending")).toBe("done");
    expect(decideEntryAction("needs-attention", "pending")).toBe("done");
  });

  it("decideEntryAction says needs-review when parked, even with no entry file", () => {
    expect(decideEntryAction(null, "needs-review")).toBe("needs-review");
  });

  it("decideEntryAction defers (null) for an untouched figures-only company", () => {
    expect(decideEntryAction("figures-only", "completed")).toBeNull();
  });

  it("decideEntryAction defers (null) for a first-time company with no entry yet", () => {
    expect(decideEntryAction(null, "pending")).toBeNull();
  });

  it("classifyPackFailure treats a completed edinet stage as a cache-only failure (must not touch the stage)", () => {
    expect(classifyPackFailure("completed")).toBe("cache");
  });

  it("classifyPackFailure treats a never-completed edinet stage as a real stage failure", () => {
    expect(classifyPackFailure("pending")).toBe("stage");
    expect(classifyPackFailure("failed")).toBe("stage");
    expect(classifyPackFailure("running")).toBe("stage");
  });
});
