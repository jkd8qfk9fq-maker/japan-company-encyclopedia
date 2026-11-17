import { describe, expect, it } from "vitest";
import { decideAutoMerge, gateSummary } from "../scripts/pipeline/auto-merge-gate.mjs";

/** JCE-058 (proposed): when a refresh-financials pull request may merge itself. */

const entry = (state: object = { state: "published" }) => ({ id: "x", status: state, financials: [] });
const change = (path: string, status = "M", before: unknown = entry(), after: unknown = entry()) => ({ path, status, before, after });
const report = (...updated: string[]) => ({ outcomes: updated.map((id) => ({ id, result: "updated" })), fatal: null });
const clean = {
  changes: [
    change("src/data/companies/toyota.json"),
    change("src/data/revisions/2026-11-17-company-toyota-financials.json", "A", null, {}),
    change("pipeline/amendments-index.json"),
    change("pipeline/runs/financials-2026-11-17-1.json", "A", null, {}),
  ],
  refresh: { ...report("toyota"), outcomes: [{ id: "toyota", result: "updated" }, { id: "held-co", result: "held" }, { id: "failed-co", result: "failed" }] },
  interim: report(),
  quarterly: report(),
  amendment: { error: null, rows: [] },
};

describe("auto-merge gate", () => {
  it("lets a pull request merge itself when every change was vouched for — held and failed companies are not in it", () => {
    const d = decideAutoMerge(clean);
    expect(d).toEqual({ eligible: true, reasons: [], companies: ["toyota"] });
    expect(gateSummary(d)).toContain("条件をすべて満たす");
  });

  it("accepts updates from the half-year and Q1/Q3 steps as well as the annual one", () => {
    const d = decideAutoMerge({ ...clean, changes: [change("src/data/companies/sony.json"), change("src/data/companies/kao.json")], refresh: report(), interim: report("sony"), quarterly: report("kao") });
    expect(d.eligible).toBe(true);
  });

  it("refuses a change no report claims to have made", () => {
    const d = decideAutoMerge({ ...clean, changes: [...clean.changes, change("src/data/companies/sony.json")] });
    expect(d.eligible).toBe(false);
    expect(d.reasons.join()).toContain("sony");
  });

  it("refuses when an update changes a company's status or notes — that is for a person", () => {
    const toAttention = change("src/data/companies/toyota.json", "M", entry(), entry({ state: "needs-attention", notes: ["空欄がある"] }));
    expect(decideAutoMerge({ ...clean, changes: [toAttention] }).eligible).toBe(false);
    const newNote = change("src/data/companies/toyota.json", "M", entry({ state: "needs-attention", notes: ["a"] }), entry({ state: "needs-attention", notes: ["a", "b"] }));
    expect(decideAutoMerge({ ...clean, changes: [newNote] }).eligible).toBe(false);
  });

  it("refuses when a new 訂正有価証券報告書 arrived, or the audit could not finish", () => {
    expect(decideAutoMerge({ ...clean, amendment: { error: null, rows: [{ companyId: "toyota" }] } }).eligible).toBe(false);
    expect(decideAutoMerge({ ...clean, amendment: { error: "network", rows: [] } }).eligible).toBe(false);
    expect(decideAutoMerge({ ...clean, amendment: null }).eligible).toBe(false);
  });

  it("refuses deletions, edited revisions, new companies and anything outside the data it may write", () => {
    for (const bad of [
      change("src/data/companies/toyota.json", "D", entry(), null),
      change("src/data/revisions/2026-01-01-company-toyota-initial.json", "M"),
      change("src/data/companies/brand-new.json", "A", null, entry()),
      change("src/lib/site.ts"),
      change(".github/workflows/refresh-financials.yml"),
    ]) {
      expect(decideAutoMerge({ ...clean, changes: [...clean.changes, bad] }).eligible, bad.path).toBe(false);
    }
  });

  it("refuses when the annual run stopped on a fatal error, its report is missing, or there is nothing to merge", () => {
    expect(decideAutoMerge({ ...clean, refresh: { ...clean.refresh, fatal: "index" } }).eligible).toBe(false);
    expect(decideAutoMerge({ ...clean, refresh: null }).eligible).toBe(false);
    const empty = decideAutoMerge({ ...clean, changes: [] });
    expect(empty.eligible).toBe(false);
    expect(gateSummary(empty)).toContain("人がマージする");
  });
});
