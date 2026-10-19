import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadQueueView, loadRun } from "@/lib/admin/autopilot-queue";

/** The queue page reads the autopilot's local records; it must say "not here" on a server that has none, and survive damaged files. */
const dirs: string[] = [];
const temp = () => {
  const d = mkdtempSync(join(tmpdir(), "autopilot-view-"));
  dirs.push(d);
  return d;
};
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});
const record = (id: string, status: string, over: object = {}) => ({ id, status, step: "review", attempts: { agent1: 1 }, holds: [], errors: [], cost: { usd: 1, calls: 2 }, pause: null, awaiting: null, review: null, approval: null, startedAt: "2026-10-18T00:00:00Z", updatedAt: "2026-10-18T01:00:00Z", ...over });

describe("the queue view", () => {
  it("reports unavailable, not empty, when there are no records (a production server)", () => {
    expect(loadQueueView(temp())).toMatchObject({ available: false, records: [] });
  });

  it("orders what needs the operator and survives a damaged file and a damaged history line", () => {
    const root = temp();
    const runs = join(root, "pipeline/autopilot/runs");
    mkdirSync(runs, { recursive: true });
    writeFileSync(join(runs, "a.json"), JSON.stringify(record("a", "held", { holds: [{ kind: "gate-failed", reason: "x" }] })));
    writeFileSync(join(runs, "b.json"), JSON.stringify(record("b", "ready")));
    writeFileSync(join(runs, "c.json"), JSON.stringify(record("c", "registered")));
    writeFileSync(join(runs, "broken.json"), "{ not json");
    writeFileSync(join(root, "pipeline/autopilot/history.jsonl"), `${JSON.stringify({ at: "2026-10-18T01:00:00Z", id: "a", type: "held" })}\nnot json\n`);
    const view = loadQueueView(root);
    expect(view.available).toBe(true);
    expect(view.records.map((r) => r.id).sort()).toEqual(["a", "b", "c"]);
    expect(view.attention.map((r) => r.id)).toEqual(["b", "a"]);
    expect(view.history.map((e) => e.type)).toEqual(["held"]);
  });

  it("reads one company with its sheet, and refuses an id that is not an id (it becomes a file name)", () => {
    const root = temp();
    mkdirSync(join(root, "pipeline/autopilot/runs"), { recursive: true });
    mkdirSync(join(root, "pipeline/autopilot/review"), { recursive: true });
    writeFileSync(join(root, "pipeline/autopilot/runs/a.json"), JSON.stringify(record("a", "ready")));
    writeFileSync(join(root, "pipeline/autopilot/review/a.md"), "# シート");
    expect(loadRun("a", root)?.sheet).toBe("# シート");
    expect(loadRun("../a", root)).toBeNull();
    expect(loadRun("missing", root)).toBeNull();
  });
});
