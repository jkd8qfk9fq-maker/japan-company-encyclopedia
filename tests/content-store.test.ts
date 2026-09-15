import { cp, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ContentStore, tokyoDate } from "@/lib/content/content-store";
import { parseContent, revisionSchema } from "@/lib/content/schemas";

/**
 * The local editor's write path, against a copy of the real content in a temp
 * directory. The rules under test are the ones that make a correction
 * traceable and never silent.
 */

let root: string;
let store: ContentStore;
const NOW = new Date("2026-09-15T03:04:05.000Z");

async function loadToyota() {
  const loaded = await store.read("company", "toyota");
  if (!loaded) throw new Error("fixture missing");
  return { draft: structuredClone(loaded.data) as Record<string, unknown> & { description: string; sources: { id: string }[] }, version: loaded.version };
}

async function revisionFiles() {
  return (await readdir(join(root, "src/data/revisions"))).filter((f) => f.endsWith(".json"));
}

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "content-store-"));
  for (const dir of ["companies", "terms", "industries", "revisions"]) {
    await cp(join(process.cwd(), "src/data", dir), join(root, "src/data", dir), { recursive: true });
  }
  store = new ContentStore(root);
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("ContentStore.save", () => {
  it("writes the change, bumps updatedAt and records a revision with before/after", async () => {
    const { draft, version } = await loadToyota();
    const before = draft.description;
    draft.description = "テスト用に変更した説明文です。";
    const revisionsBefore = await revisionFiles();

    const result = await store.save({
      kind: "company", id: "toyota", draft, baseVersion: version,
      summary: "説明文を修正", reason: "報告を受けて有報 p.5 で確認", confirmSourceRemoval: false, now: NOW,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.changedFields).toEqual(["description"]);

    const saved = JSON.parse(await readFile(join(root, "src/data/companies/toyota.json"), "utf8"));
    expect(saved.description).toBe("テスト用に変更した説明文です。");
    expect(saved.updatedAt).toBe(tokyoDate(NOW));

    const added = (await revisionFiles()).filter((f) => !revisionsBefore.includes(f));
    expect(added).toEqual([`${result.revisionId}.json`]);
    const revision = parseContent(revisionSchema, JSON.parse(await readFile(join(root, "src/data/revisions", added[0]), "utf8")), added[0]);
    expect(revision).toMatchObject({
      targetType: "company", targetId: "toyota", changedAt: NOW.toISOString(),
      summary: "説明文を修正", reason: "報告を受けて有報 p.5 で確認",
      before: { description: before }, after: { description: "テスト用に変更した説明文です。" },
    });
    expect(result.revisionId).toMatch(/^2026-09-15-company-toyota-[0-9a-f]{6}$/);
  });

  it("keeps the file's key order, so the git diff shows only the change", async () => {
    const { draft, version } = await loadToyota();
    const original = await readFile(join(root, "src/data/companies/toyota.json"), "utf8");
    // Rebuild the object in a different key order, as a form might.
    const shuffled = Object.fromEntries(Object.entries({ ...draft, description: "キー順のテストです。" }).reverse());
    const result = await store.save({ kind: "company", id: "toyota", draft: shuffled, baseVersion: version, summary: "s", reason: "r", confirmSourceRemoval: false, now: NOW });
    expect(result.ok).toBe(true);
    const saved = await readFile(join(root, "src/data/companies/toyota.json"), "utf8");
    const changedLines = saved.split("\n").filter((line, i) => line !== original.split("\n")[i]);
    expect(changedLines.length).toBeLessThanOrEqual(2); // description and updatedAt
  });

  it("refuses to overwrite a file that changed after the editor loaded it", async () => {
    const { draft, version } = await loadToyota();
    const path = join(root, "src/data/companies/toyota.json");
    await writeFile(path, (await readFile(path, "utf8")).replace("トヨタ自動車株式会社", "トヨタ自動車株式会社 "));
    draft.description = "競合する編集です。";
    const result = await store.save({ kind: "company", id: "toyota", draft, baseVersion: version, summary: "s", reason: "r", confirmSourceRemoval: false });
    expect(result).toMatchObject({ ok: false, conflict: true });
  });

  it("refuses a save with no summary or no reason, and writes nothing", async () => {
    const { draft, version } = await loadToyota();
    draft.description = "理由のない変更です。";
    const count = (await revisionFiles()).length;
    const result = await store.save({ kind: "company", id: "toyota", draft, baseVersion: version, summary: " ", reason: "", confirmSourceRemoval: false });
    expect(result.ok).toBe(false);
    expect((await revisionFiles()).length).toBe(count);
  });

  it("refuses to remove a source unless the removal is confirmed", async () => {
    // Plant a source no section cites, so the removal rule — not a citation rule — is what refuses.
    const path = join(root, "src/data/companies/toyota.json");
    const data = JSON.parse(await readFile(path, "utf8"));
    data.sources.push({ id: "planted-uncited", title: "テスト用の出典", publisher: "テスト", url: "https://example.com/", accessedAt: "2026-09-15" });
    await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);

    const { draft, version } = await loadToyota();
    draft.sources = draft.sources.filter((s) => s.id !== "planted-uncited");

    const refused = await store.save({ kind: "company", id: "toyota", draft, baseVersion: version, summary: "出典を整理", reason: "重複のため", confirmSourceRemoval: false });
    expect(refused).toMatchObject({ ok: false });
    if (!refused.ok) expect(refused.errors).toEqual([expect.stringContaining("「テスト用の出典」を削除します")]);

    const confirmed = await store.save({ kind: "company", id: "toyota", draft, baseVersion: version, summary: "出典を整理", reason: "重複のため", confirmSourceRemoval: true, now: NOW });
    expect(confirmed.ok).toBe(true);
  });

  it("refuses to remove a source a section still cites, even when confirmed", async () => {
    const { draft, version } = await loadToyota();
    draft.sources = draft.sources.slice(1); // the first source is cited by at least one section
    const result = await store.save({ kind: "company", id: "toyota", draft, baseVersion: version, summary: "s", reason: "r", confirmSourceRemoval: true });
    expect(result).toMatchObject({ ok: false });
    if (!result.ok) expect(result.errors.join()).toMatch(/出典一覧にありません/);
  });

  it("refuses a change that breaks an integrity rule", async () => {
    const { draft, version } = await loadToyota();
    draft.description = "あ".repeat(120) + "。";
    const result = await store.save({ kind: "company", id: "toyota", draft, baseVersion: version, summary: "s", reason: "r", confirmSourceRemoval: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join()).toMatch(/90文字/);
  });

  it("refuses an unknown key (a typo in a field name)", async () => {
    const { draft, version } = await loadToyota();
    const result = await store.save({ kind: "company", id: "toyota", draft: { ...draft, descripton: "typo" }, baseVersion: version, summary: "s", reason: "r", confirmSourceRemoval: false });
    expect(result.ok).toBe(false);
  });

  it("refuses to change the id", async () => {
    const { draft, version } = await loadToyota();
    const result = await store.save({ kind: "company", id: "toyota", draft: { ...draft, id: "toyota-2" }, baseVersion: version, summary: "s", reason: "r", confirmSourceRemoval: false });
    expect(result).toMatchObject({ ok: false });
  });

  it("refuses a save that changes nothing", async () => {
    const { draft, version } = await loadToyota();
    const result = await store.save({ kind: "company", id: "toyota", draft, baseVersion: version, summary: "s", reason: "r", confirmSourceRemoval: false });
    expect(result).toMatchObject({ ok: false, errors: ["変更がありません。"] });
  });

  it("saves a term the same way", async () => {
    const loaded = (await store.read("term", "wafer"))!;
    const draft = { ...(loaded.data as Record<string, unknown>), reading: "うぇーは" };
    const result = await store.save({ kind: "term", id: "wafer", draft, baseVersion: loaded.version, summary: "読みを追加", reason: "TEL用語集", confirmSourceRemoval: false, now: NOW });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.revisionId).toMatch(/^2026-09-15-term-wafer-/);
  });

  it("does not read ids that could escape the data directory", async () => {
    expect(await store.read("company", "../../package")).toBeNull();
  });
});
