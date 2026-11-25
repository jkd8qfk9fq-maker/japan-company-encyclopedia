import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadEntranceView, summarizeEntrance, updateEntranceEntry, type EntranceEntry } from "@/lib/admin/entrance-form";

/** The entrance page reads a local state file holding contact emails; it must say "not here" where the file
 *  is absent (production), keep the funnel counts honest, and never lose an entry on a status save. */
const dirs: string[] = [];
const temp = () => {
  const d = mkdtempSync(join(tmpdir(), "entrance-form-"));
  dirs.push(d);
  return d;
};
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

const entry = (responseId: string, over: Partial<EntranceEntry> = {}): EntranceEntry => ({
  responseId,
  submittedAt: "2026-11-25T01:00:00.000Z",
  email: "reader@example.jp",
  company: "9603",
  betaInterest: false,
  status: "new",
  memo: "",
  statusUpdatedAt: null,
  ...over,
});

const writeState = (root: string, entries: EntranceEntry[]) => {
  mkdirSync(join(root, ".data"), { recursive: true });
  writeFileSync(join(root, ".data", "entrance-form.json"), JSON.stringify({ formId: "f", syncedAt: "2026-11-25T02:00:00.000Z", entries }));
};

describe("the entrance-form view", () => {
  it("reports unavailable, not empty, when there is no state file (a production server)", () => {
    expect(loadEntranceView(temp())).toMatchObject({ available: false, entries: [], summary: { total: 0, pending: 0, betaInterest: 0 } });
  });

  it("reports unavailable when the state file is damaged", () => {
    const root = temp();
    mkdirSync(join(root, ".data"), { recursive: true });
    writeFileSync(join(root, ".data", "entrance-form.json"), "{ not json");
    expect(loadEntranceView(root).available).toBe(false);
  });

  it("orders newest first and counts the funnel", () => {
    const root = temp();
    writeState(root, [
      entry("a", { submittedAt: "2026-11-24T01:00:00.000Z", betaInterest: true }),
      entry("b", { submittedAt: "2026-11-25T01:00:00.000Z", status: "delivered" }),
      entry("c", { submittedAt: "2026-11-23T01:00:00.000Z", betaInterest: true, status: "beta-sent" }),
    ]);
    const view = loadEntranceView(root);
    expect(view.available).toBe(true);
    expect(view.entries.map((e) => e.responseId)).toEqual(["b", "a", "c"]);
    expect(view.summary).toEqual({ total: 3, pending: 1, betaInterest: 2 });
    expect(summarizeEntrance([])).toEqual({ total: 0, pending: 0, betaInterest: 0 });
  });

  it("drops a malformed entry instead of breaking the page", () => {
    const root = temp();
    writeState(root, [entry("a"), { responseId: "broken" } as EntranceEntry]);
    expect(loadEntranceView(root).entries.map((e) => e.responseId)).toEqual(["a"]);
  });
});

describe("updating an entrance entry", () => {
  it("saves the status and memo, stamps the time, and keeps the answers untouched", () => {
    const root = temp();
    writeState(root, [entry("a")]);
    expect(updateEntranceEntry(root, "a", { status: "delivered", memo: "案内メール送信" }, "2026-11-25T03:00:00.000Z")).toBe(true);
    const saved = JSON.parse(readFileSync(join(root, ".data", "entrance-form.json"), "utf8"));
    expect(saved.entries[0]).toMatchObject({ status: "delivered", memo: "案内メール送信", statusUpdatedAt: "2026-11-25T03:00:00.000Z", email: "reader@example.jp", company: "9603" });
  });

  it("refuses an unknown id and a missing state file", () => {
    const root = temp();
    writeState(root, [entry("a")]);
    expect(updateEntranceEntry(root, "nope", { status: "delivered" })).toBe(false);
    expect(updateEntranceEntry(temp(), "a", { status: "delivered" })).toBe(false);
  });
});
