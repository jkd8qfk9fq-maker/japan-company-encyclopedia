import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { companySchema } from "@/lib/content/schemas";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { INDUSTRY_IDS, RELATIONSHIP_KINDS } from "@/types/company";
import { mergeEntry } from "../scripts/pipeline/merge-fragments.mjs";
import { dedupeGaps, normalizeGap, parseLegacyTaxonomyNote, recordTaxonomyGaps } from "../scripts/pipeline/taxonomy-gaps.mjs";
import { jobStage } from "../scripts/pipeline/jobs.mjs";

/**
 * Taxonomy vocabulary, and the line between "a person must look" (needsReview → needs-attention) and
 * "the data is right but the vocabulary cannot say it" (taxonomyGaps → no status change).
 */

describe("relationship kinds", () => {
  it("keeps the business relations and adds the filing's four capital relations", () => {
    for (const kind of ["same-industry", "competitor", "supplier", "customer", "technology", "same-business-model", "business-partner"]) {
      expect(RELATIONSHIP_KINDS).toContain(kind);
    }
    for (const kind of ["parent", "subsidiary", "affiliate", "other-affiliated-company"]) expect(RELATIONSHIP_KINDS).toContain(kind);
    expect(RELATIONSHIP_KINDS).toHaveLength(11);
  });

  it("does NOT add a major shareholder or a merger partner — the first awaits a decision, the second is an event", () => {
    for (const kind of ["major-shareholder", "shareholder", "merger-partner", "capital-partner"]) expect(RELATIONSHIP_KINDS).not.toContain(kind);
  });

  const company = async () => JSON.parse(await readFile(join(process.cwd(), "src/data/companies/toho-9602.json"), "utf8"));
  const withRelationship = (c: { relatedCompanies: object[] }, relationship: string) => ({ ...c, relatedCompanies: [{ ...c.relatedCompanies[0], relationship }] });

  it("accepts every kind in a company entry, and rejects one that is not a kind", async () => {
    const c = await company();
    for (const kind of RELATIONSHIP_KINDS) expect(companySchema.safeParse(withRelationship(c, kind)).success, kind).toBe(true);
    for (const kind of ["major-shareholder", "merger-partner", "parent-company", ""]) {
      expect(companySchema.safeParse(withRelationship(c, kind)).success, kind || "(empty)").toBe(false);
    }
  });
});

describe("industry ids", () => {
  const ORIGINAL = ["automotive", "semiconductors", "electronics", "it", "finance", "trading", "food", "retail", "real-estate", "construction", "chemicals", "pharmaceuticals", "transportation", "energy", "telecommunications", "media", "entertainment"];

  it("keeps all seventeen original ids, in order, and adds machinery, human-resources and funeral-memorial only", () => {
    expect(INDUSTRY_IDS.slice(0, 17)).toEqual(ORIGINAL);
    expect(INDUSTRY_IDS.slice(17)).toEqual(["machinery", "human-resources", "funeral-memorial"]);
  });

  it("does not add the candidates that were judged too weak", () => {
    for (const id of ["environmental-waste", "hospitality", "beauty", "printing", "musical-instruments", "restaurant"]) expect(INDUSTRY_IDS).not.toContain(id);
  });

  it("has a label for every id (the new ones included)", () => {
    for (const id of INDUSTRY_IDS) expect(INDUSTRY_LABELS[id].name, id).toBeTruthy();
    // Every label also has an ひらがな reading: search orders industries in 50音順 by it.
    for (const id of INDUSTRY_IDS) expect(INDUSTRY_LABELS[id].reading, id).toMatch(/^[ぁ-ゖー・]+$/);
    expect(INDUSTRY_LABELS.machinery).toEqual({ name: "機械", nameEn: "Machinery", reading: "きかい" });
    expect(INDUSTRY_LABELS["human-resources"]).toEqual({ name: "人材サービス", nameEn: "Human Resources", reading: "じんざいさーびす" });
    expect(INDUSTRY_LABELS["funeral-memorial"]).toEqual({
      name: "葬祭・供養関連",
      nameEn: "Funeral & Memorial Services",
      reading: "そうさい・くようかんれん",
    });
  });

  it("is accepted as an entry's industry, and an unknown id is still refused", async () => {
    const c = JSON.parse(await readFile(join(process.cwd(), "src/data/companies/toho-9602.json"), "utf8"));
    const ok = (industryId: string) => companySchema.safeParse({ ...c, industries: [{ industryId, primary: true }] }).success;
    for (const id of ["machinery", "human-resources", "retail"]) expect(ok(id), id).toBe(true);
    expect(ok("hospitality")).toBe(false);
  });
});

describe("taxonomy gaps as data", () => {
  it("reads a gap an agent wrote as an object, and says what is wrong with one it cannot read", () => {
    const g = normalizeGap({ kind: "relationship", subject: "ライトオン→W&D", actual: "親会社", proposed: "parent", reason: "種類が無かった" }, "relatedCompanies");
    expect(g).toEqual({ gap: { kind: "relationship", subject: "ライトオン→W&D", actual: "親会社", proposed: "parent", reason: "種類が無かった", stage: "relatedCompanies" }, problem: null });
    expect(normalizeGap({ kind: "merger", subject: "x", reason: "y" }).gap).toBeNull();
    expect(normalizeGap({ kind: "industry", subject: "", reason: "y" }).problem).toMatch(/必須/);
    expect(normalizeGap("text").gap).toBeNull();
  });

  it("reads the old convention — a needsReview string beginning TAXONOMY — as a gap", () => {
    const rel = parseLegacyTaxonomyNote("TAXONOMY: relationship: 中部電力→㈱JERA / 実際の関係=持分法適用関連会社（直接50.0%） / 理由: 資本関係の値が無い", "relatedCompanies");
    expect(rel).toMatchObject({ kind: "relationship", subject: "中部電力→㈱JERA", actual: "持分法適用関連会社（直接50.0%）", stage: "relatedCompanies" });
    expect(rel?.reason).toContain("資本関係の値が無い");
    const ind = parseLegacyTaxonomyNote("TAXONOMY: industry: トライト（tryt、9164） / 暫定=it / 提案=人材サービス / 理由: 区分が無い");
    expect(ind).toMatchObject({ kind: "industry", subject: "トライト（tryt、9164）", actual: "it", proposed: "人材サービス" });
    expect(parseLegacyTaxonomyNote("財務: 変則決算。2021-12 の期は 9 か月")).toBeNull();
    expect(parseLegacyTaxonomyNote("【継続企業の前提】重要な疑義")).toBeNull();
  });

  it("counts the same gap once", () => {
    const a = { kind: "relationship" as const, subject: "A→B", actual: "子会社", proposed: "subsidiary", reason: "r" };
    expect(dedupeGaps([a, { ...a, stage: "history" }, { ...a, subject: "A→C" }])).toHaveLength(2);
  });

  describe("recorded in pipeline/taxonomy-gaps.tsv", () => {
    let root: string;
    beforeEach(async () => {
      root = await mkdtemp(join(tmpdir(), "gaps-"));
    });
    afterEach(async () => {
      await rm(root, { recursive: true, force: true });
    });
    const gap = (subject: string) => ({ kind: "relationship" as const, subject, actual: "親会社", proposed: "parent", reason: "r" });
    const rows = async () => (await readFile(join(root, "pipeline/taxonomy-gaps.tsv"), "utf8")).split("\n").filter((l) => l && !l.startsWith("#"));

    it("replaces a company's rows each time, leaving every other company's alone", async () => {
      recordTaxonomyGaps("a", [gap("a→1"), gap("a→2")], root);
      recordTaxonomyGaps("b", [gap("b→1")], root);
      recordTaxonomyGaps("a", [gap("a→1")], root); // registering again, or promoting, must not duplicate
      const lines = await rows();
      expect(lines.map((l) => l.split("\t").slice(0, 3).join("|"))).toEqual(["b|relationship|b→1", "a|relationship|a→1"]);
      recordTaxonomyGaps("a", [], root);
      expect((await rows()).map((l) => l.split("\t")[0])).toEqual(["b"]);
    });

    it("writes nothing for a company with no gaps when there is no file yet", async () => {
      recordTaxonomyGaps("a", [], root);
      await expect(readFile(join(root, "pipeline/taxonomy-gaps.tsv"))).rejects.toThrow();
    });
  });
});

describe("merging fragments: only needsReview sets the status", () => {
  let root: string;
  let originalCwd: string;
  let originalCache: string | undefined;
  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "merge-"));
    originalCwd = process.cwd();
    originalCache = process.env.RESEARCH_CACHE;
    await mkdir(join(root, "pipeline/results"), { recursive: true });
    await mkdir(join(root, "pipeline/state"), { recursive: true });
    await mkdir(join(root, "cache/evidence/acme"), { recursive: true });
    process.env.RESEARCH_CACHE = join(root, "cache");
    process.chdir(root);
    await writeFile(join(root, "cache/evidence/acme/draft-entry.json"), JSON.stringify({ code: "1000", officialName: "株式会社アクミー", nameEn: "Acme", financials: [] }));
  });
  afterEach(async () => {
    process.chdir(originalCwd);
    if (originalCache === undefined) delete process.env.RESEARCH_CACHE;
    else process.env.RESEARCH_CACHE = originalCache;
    await rm(root, { recursive: true, force: true });
  });

  const STAGES = ["businessStructure", "businessModel", "history", "industry", "relatedCompanies", "terms"];
  const fragment = (stage: string, extra: object = {}) => writeFile(join(root, `pipeline/results/acme-${stage}.json`), JSON.stringify({ companyId: "acme", agent: `${stage}-agent`, status: "completed", data: {}, sources: [], warnings: [], needsReview: [], ...extra }));
  const writeAll = async (overrides: Record<string, object> = {}) => {
    for (const stage of STAGES) await fragment(stage, overrides[stage]);
  };
  const GAP = { kind: "relationship", subject: "アクミー→親会社", actual: "親会社（60%）", proposed: "parent", reason: "種類が無い" };

  it("leaves the entry published when the only thing reported is a taxonomy gap", async () => {
    await writeAll({ relatedCompanies: { taxonomyGaps: [GAP] }, industry: { needsReview: ["TAXONOMY: industry: アクミー / 暫定=it / 提案=人材サービス / 理由: 区分が無い"] } });
    const m = mergeEntry("acme");
    expect(m.entry.status).toEqual({ state: "published" });
    expect(m.needsReview).toEqual([]);
    expect(m.taxonomyGaps.map((g: { kind: string }) => g.kind).sort()).toEqual(["industry", "relationship"]);
  });

  it("still sets needs-attention from needsReview, exactly as before", async () => {
    await writeAll({ history: { needsReview: ["2021年12月期は合併後1か月分"] } });
    const m = mergeEntry("acme");
    expect(m.entry.status).toEqual({ state: "needs-attention", notes: ["history: 2021年12月期は合併後1か月分"] });
  });

  it("when both are present, only needsReview reaches the status", async () => {
    await writeAll({
      relatedCompanies: { taxonomyGaps: [GAP], needsReview: ["TAXONOMY: relationship: アクミー→子会社 / 実際の関係=子会社 / 理由: 種類が無い"] },
      history: { needsReview: ["上場廃止が予定されている"] },
    });
    const m = mergeEntry("acme");
    expect(m.entry.status).toEqual({ state: "needs-attention", notes: ["history: 上場廃止が予定されている"] });
    expect(m.taxonomyGaps).toHaveLength(2);
  });

  it("an unreadable gap is a warning, not a status", async () => {
    await writeAll({ industry: { taxonomyGaps: [{ kind: "colour", subject: "x", reason: "y" }] } });
    const m = mergeEntry("acme");
    expect(m.entry.status).toEqual({ state: "published" });
    expect(m.warnings.join("\n")).toContain("taxonomyGaps の1件を読めませんでした");
  });

  it("merges the same gap reported by two stages into one", async () => {
    await writeAll({ businessStructure: { taxonomyGaps: [GAP] }, relatedCompanies: { taxonomyGaps: [GAP] } });
    expect(mergeEntry("acme").taxonomyGaps).toHaveLength(1);
  });

  it("a relation to a company nobody registered changes no status and creates no company", async () => {
    await writeAll({ relatedCompanies: { data: { relatedCompanies: [{ companyId: "not-registered-anywhere", relationship: "subsidiary", description: "d", sourceIds: ["yuho-2026"] }] } } });
    const before = await readFile(join(root, "pipeline/state/acme.json")).catch(() => null);
    const m = mergeEntry("acme");
    expect(m.entry.status).toEqual({ state: "published" });
    expect(m.entry.relatedCompanies).toHaveLength(1);
    await expect(readFile(join(root, "src/data/companies/not-registered-anywhere.json"))).rejects.toThrow();
    expect(await readFile(join(root, "pipeline/state/acme.json")).catch(() => null)).toEqual(before); // merging writes no state
  });
});

describe("the job view does not know about gaps", () => {
  it("a published company is published, and a figures-only one stays figures-only, whatever gaps were recorded", () => {
    const state = { companyId: "x", stages: Object.fromEntries(["identity", "edinet", "businessStructure", "businessModel", "history", "industry", "relatedCompanies", "terms", "sourceValidation", "qualityControl", "registration"].map((s) => [s, { status: "completed", attempts: 0 }])) };
    expect(jobStage({ state, tier: "published" }).stage).toBe("published");
    expect(jobStage({ state, tier: "published" }).reasons).toEqual([]);
  });
});
