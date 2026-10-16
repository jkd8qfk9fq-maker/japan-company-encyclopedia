import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadState, saveState, setStage } from "../scripts/pipeline/company-state.mjs";
import { recoverRegistration } from "../scripts/pipeline/registration-tail.mjs";

/**
 * A registration that dies after it wrote the company's files (ahresty, 2026-10-09) leaves the entry
 * published and `registration` stuck on `running`, and the normal commands cannot finish it. The
 * recovery completes only the bookkeeping, and only when the entry on disk is provably what the
 * fragments produce now. Every refusal below must leave the tree exactly as it was.
 */

const ID = "acme";
const GAP = { kind: "relationship", subject: "A が B の大株主", actual: "大株主 2%", proposed: "shareholder", reason: "分類が無い", stage: "relatedCompanies" };
const entry = (over: Record<string, unknown> = {}) => ({ id: ID, code: "1234", name: "アクミ", status: { state: "published" }, updatedAt: "2026-10-09", ...over });

let root: string;
let originalCwd: string;

const write = (path: string, content: string) => writeFile(join(root, path), content);
const writeJson = (path: string, value: unknown) => write(path, `${JSON.stringify(value, null, 2)}\n`);
const read = (path: string) => readFile(join(root, path), "utf8");
const exists = (path: string) => existsSync(join(root, path));

async function fixture({ staged = true, registration = "running" }: { staged?: boolean; registration?: string } = {}) {
  await writeJson(`src/data/companies/${ID}.json`, entry());
  await write("src/data/companies/index.ts", `import acme from "./${ID}.json";\n`);
  await writeJson(`src/data/revisions/2026-10-09-company-${ID}-described.json`, { id: `2026-10-09-company-${ID}-described`, targetType: "company", targetId: ID, changedAt: "2026-10-09", reason: "r", summary: "s" });
  await write(`docs/research/${ID}.md`, "# log\n");
  if (staged) await writeJson(`pipeline/staging/${ID}.json`, entry());
  const state = loadState(ID);
  saveState(state);
  if (registration === "running") {
    setStage(ID, "registration", "running");
  } else {
    setStage(ID, "registration", registration);
  }
}

const built = (over: Record<string, unknown> = {}) => ({ entry: entry({ updatedAt: "2099-01-01" }), missing: [], taxonomyGaps: [GAP], ...over });
const recover = (options: Record<string, unknown> = {}) => recoverRegistration(ID, { gate: vi.fn(), buildEntry: () => built(), ...options });

/** Everything a registration wrote, plus what the recovery may touch, as a snapshot. */
async function snapshot() {
  const files = [`src/data/companies/${ID}.json`, "src/data/companies/index.ts", `src/data/revisions/2026-10-09-company-${ID}-described.json`, `docs/research/${ID}.md`, `pipeline/state/${ID}.json`, `pipeline/staging/${ID}.json`, "pipeline/taxonomy-gaps.tsv"];
  return Object.fromEntries(await Promise.all(files.map(async (f) => [f, exists(f) ? await read(f) : null])));
}

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "recover-registration-"));
  for (const dir of ["pipeline/state", "pipeline/staging", "src/data/companies", "src/data/revisions", "docs/research"]) await mkdir(join(root, dir), { recursive: true });
  originalCwd = process.cwd();
  process.chdir(root);
});
afterEach(async () => {
  process.chdir(originalCwd);
  await rm(root, { recursive: true, force: true });
});

describe("recoverRegistration: the interrupted registration is finished", () => {
  it("completes the bookkeeping and nothing else", async () => {
    await fixture();
    const before = await snapshot();
    const gate = vi.fn();
    const result = recover({ gate });

    expect(result).toMatchObject({ ok: true, changed: true });
    expect(gate).toHaveBeenCalledTimes(1);

    const state = loadState(ID);
    expect(state.stages.registration).toMatchObject({ status: "completed", note: "登録済み（状態 published）" });
    expect(state.registeredAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(exists(`pipeline/staging/${ID}.json`)).toBe(false);
    expect((await read("pipeline/taxonomy-gaps.tsv")).split("\n").filter((l) => l.startsWith(`${ID}\t`))).toHaveLength(1);

    // The entry, the revision, the log and the index are exactly as they were.
    const after = await snapshot();
    for (const f of [`src/data/companies/${ID}.json`, "src/data/companies/index.ts", `src/data/revisions/2026-10-09-company-${ID}-described.json`, `docs/research/${ID}.md`]) {
      expect(after[f]).toBe(before[f]);
    }
  });

  it("tolerates the entry's updatedAt differing from today's rebuild, and a needs-attention entry", async () => {
    await fixture();
    await writeJson(`src/data/companies/${ID}.json`, entry({ status: { state: "needs-attention", notes: ["x"] } }));
    await writeJson(`pipeline/staging/${ID}.json`, entry({ status: { state: "needs-attention", notes: ["x"] } }));
    const result = recover({ buildEntry: () => built({ entry: entry({ status: { state: "needs-attention", notes: ["x"] }, updatedAt: "2030-01-01" }) }) });
    expect(result.ok).toBe(true);
    expect(loadState(ID).stages.registration.note).toBe("登録済み（状態 needs-attention）");
  });

  it("works when the staging file is already gone", async () => {
    await fixture({ staged: false });
    expect(recover()).toMatchObject({ ok: true, changed: true });
  });
});

describe("recoverRegistration: it can be run again", () => {
  it("does nothing the second time — no new gap row, registeredAt unchanged", async () => {
    await fixture();
    recover();
    const first = await snapshot();
    const gate = vi.fn();
    const again = recover({ gate });
    expect(again).toMatchObject({ ok: true, changed: false });
    expect(gate).not.toHaveBeenCalled();
    expect(await snapshot()).toEqual(first);
  });

  it("replaces the company's own gap rows instead of adding to them, and leaves other companies' alone", async () => {
    await fixture();
    const header = "# 分類の不足（status には反映しない）\n# companyId\tkind\tsubject\tactual\tproposed\treason\n";
    await write("pipeline/taxonomy-gaps.tsv", `${header}${ID}\trelationship\told\told\told\told\nother\tindustry\ts\ta\tp\tr\n`);
    recover();
    const rows = (await read("pipeline/taxonomy-gaps.tsv")).split("\n").filter((l) => l && !l.startsWith("#"));
    expect(rows.filter((l) => l.startsWith(`${ID}\t`))).toHaveLength(1);
    expect(rows.find((l) => l.startsWith(`${ID}\t`))).toContain("A が B の大株主");
    expect(rows.filter((l) => l.startsWith("other\t"))).toHaveLength(1);
  });
});

describe("recoverRegistration: anything unverifiable changes nothing", () => {
  const refusesAndChangesNothing = async (result: { ok: boolean; changed: boolean; reason: string }, before: Record<string, string | null>, reason: RegExp) => {
    expect(result.ok).toBe(false);
    expect(result.changed).toBe(false);
    expect(result.reason).toMatch(reason);
    expect(await snapshot()).toEqual(before);
  };

  it("the entry differs from what the fragments produce", async () => {
    await fixture();
    const before = await snapshot();
    await refusesAndChangesNothing(recover({ buildEntry: () => built({ entry: entry({ name: "別名" }) }) }), before, /一致しません/);
    expect(loadState(ID).stages.registration.status).toBe("running");
  });

  it("the fragments cannot be turned into an entry, or a stage is missing", async () => {
    await fixture();
    const before = await snapshot();
    await refusesAndChangesNothing(recover({ buildEntry: () => { throw new Error("draft-entry.json がありません"); } }), before, /作り直せません/);
    await refusesAndChangesNothing(recover({ buildEntry: () => built({ missing: ["history"] }) }), before, /未完了/);
  });

  it("there is no entry, or it is only figures-only, or it belongs to another id", async () => {
    await fixture();
    await writeJson(`src/data/companies/${ID}.json`, entry({ status: { state: "figures-only" } }));
    await refusesAndChangesNothing(recover(), await snapshot(), /解説付き/);
    await writeJson(`src/data/companies/${ID}.json`, entry({ id: "other" }));
    await refusesAndChangesNothing(recover(), await snapshot(), /id が other/);
    await rm(join(root, `src/data/companies/${ID}.json`));
    await refusesAndChangesNothing(recover(), await snapshot(), /エントリーがありません/);
  });

  it("the registration stage is not running", async () => {
    for (const status of ["pending", "failed", "needs-review"]) {
      await fixture({ registration: status });
      const before = await snapshot();
      await refusesAndChangesNothing(recover(), before, /running の会社だけ/);
    }
  });

  it("there is no state file", async () => {
    await fixture();
    await rm(join(root, `pipeline/state/${ID}.json`));
    await refusesAndChangesNothing(recover(), await snapshot(), /state/);
    expect(exists(`pipeline/state/${ID}.json`)).toBe(false);
  });

  it("the revision is missing or duplicated, the log is missing, or the index does not list the company", async () => {
    await fixture();
    const before = await snapshot();
    await writeJson(`src/data/revisions/2026-10-09-company-${ID}-second.json`, { id: "2026-10-09-company-acme-second", targetType: "company", targetId: ID, changedAt: "2026-10-09" });
    await refusesAndChangesNothing(recover(), await snapshot(), /改訂記録が 2 件/);
    await rm(join(root, `src/data/revisions/2026-10-09-company-${ID}-second.json`));
    await rm(join(root, `src/data/revisions/2026-10-09-company-${ID}-described.json`));
    await refusesAndChangesNothing(recover(), await snapshot(), /改訂記録が 0 件/);
    await writeJson(`src/data/revisions/2026-10-09-company-${ID}-described.json`, { id: "x", targetType: "company", targetId: ID, changedAt: "2026-10-09" });
    await rm(join(root, `docs/research/${ID}.md`));
    await refusesAndChangesNothing(recover(), await snapshot(), /リサーチログ/);
    await write(`docs/research/${ID}.md`, "# log\n");
    await write("src/data/companies/index.ts", "// empty\n");
    await refusesAndChangesNothing(recover(), await snapshot(), /index\.ts/);
    expect(before).toBeDefined();
  });

  it("the staging file is not this entry — it is kept", async () => {
    await fixture();
    await writeJson(`pipeline/staging/${ID}.json`, entry({ name: "古い版" }));
    const before = await snapshot();
    await refusesAndChangesNothing(recover(), before, /ステージング/);
    expect(exists(`pipeline/staging/${ID}.json`)).toBe(true);
    await write(`pipeline/staging/${ID}.json`, "{ broken");
    await refusesAndChangesNothing(recover(), await snapshot(), /読めません/);
  });

  it("the integrity suite or the type check fails", async () => {
    await fixture();
    const before = await snapshot();
    const gate = vi.fn(() => { throw new Error("tests/data-integrity.test.ts failed"); });
    await refusesAndChangesNothing(recover({ gate }), before, /整合性テストまたは型チェック/);
    expect(gate).toHaveBeenCalledTimes(1);
  });

  it("--dry-run reports what it would do and changes nothing, without running the gate", async () => {
    await fixture();
    const before = await snapshot();
    const gate = vi.fn();
    const result = recover({ dryRun: true, gate });
    expect(result).toMatchObject({ ok: true, changed: false });
    expect(result.actions.length).toBeGreaterThan(2);
    expect(gate).not.toHaveBeenCalled();
    expect(await snapshot()).toEqual(before);
  });
});
