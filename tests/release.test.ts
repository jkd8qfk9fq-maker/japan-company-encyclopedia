import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { features } from "@/data/features";
import { terms } from "@/data/terms";
import releasedWithNotes from "@/data/released-with-notes.json";
import { isReleased, publicNotes, releaseReadiness } from "@/lib/release";
import { companyRepository } from "@/lib/repositories";

/**
 * The release line: `published` companies, and the needs-attention entries on the reviewed list of JCE-057 (their
 * notes shown), are visible to readers; everything else stays in the repository for the admin editor and is released
 * by promotion or by the list, not by a code change.
 */

const unreleased = companies.find((c) => c.status.state === "figures-only");
const released = companies.find((c) => c.status.state === "published");

describe("release line", () => {
  it("releases the published companies and the listed needs-attention entries, nothing else", () => {
    const listed = releasedWithNotes.companies[0]!;
    expect(isReleased({ id: "any-company", status: { state: "published" } })).toBe(true);
    expect(isReleased({ id: listed, status: { state: "figures-only" } })).toBe(false);
    expect(isReleased({ id: "not-on-the-list", status: { state: "needs-attention", notes: ["x"] } })).toBe(false);
    expect(isReleased({ id: listed, status: { state: "needs-attention", notes: ["x"] } })).toBe(true);
  });

  it("lists only released companies publicly, and every registered one to the admin", async () => {
    const publicList = await companyRepository.list();
    expect(publicList.length).toBeGreaterThan(0);
    expect(publicList.every(isReleased)).toBe(true);
    expect(publicList).toHaveLength(companies.filter(isReleased).length);
    expect(await companyRepository.listAll()).toHaveLength(companies.length);
  });

  it("answers an unreleased company with null, to the public lookups only", async () => {
    expect(unreleased, "fixture: a figures-only company").toBeDefined();
    const id = unreleased!.id;
    expect(await companyRepository.get(id)).toBeNull();
    expect(await companyRepository.getMany([id])).toEqual([]);
    expect((await companyRepository.getAny(id))?.id).toBe(id);
  });

  it("serves a released company and keeps unreleased ones out of an industry page", async () => {
    expect(released, "fixture: a published company").toBeDefined();
    expect((await companyRepository.get(released!.id))?.id).toBe(released!.id);
    for (const ref of released!.industries) {
      expect((await companyRepository.listByIndustry(ref.industryId)).every(isReleased)).toBe(true);
    }
  });
});

describe("release readiness", () => {
  const context = {
    companyIds: new Set(companies.map((c) => c.id)),
    termIds: new Set(terms.map((x) => x.id)),
    featureIds: new Set(features.map((f) => f.id)),
  };

  it("finds every published entry ready — the published tier is held to exactly these rules", () => {
    for (const c of companies.filter((x) => x.status.state === "published")) expect(releaseReadiness(c, context), c.id).toEqual({ ready: true, problems: [], notes: [] });
  });

  it("holds every entry released with notes to the same rules, with only facts in its notes (JCE-057)", () => {
    const byId = new Map(companies.map((c) => [c.id, c]));
    expect(new Set(releasedWithNotes.companies).size).toBe(releasedWithNotes.companies.length);
    for (const id of releasedWithNotes.companies) {
      const c = byId.get(id);
      expect(c, `${id} is registered`).toBeDefined();
      expect(c!.status.state, id).toBe("needs-attention");
      expect(releaseReadiness(c!, context).problems, id).toEqual([]);
      expect(c!.financials.some((f) => f.revenue === null || f.netIncome === null), `${id}: no blank figures`).toBe(false);
      const notes = publicNotes(c!);
      expect(notes.length, id).toBeGreaterThan(0);
      for (const n of notes) {
        // Nothing missing or doubtful, and no editors' working language, on a public page.
        expect(n, id).not.toMatch(/取得できな|補う必要|確認が必要|確認する必要|人の確認|要確認|確認できな|undefined|見当たりません|不一致|一致しな|未確認|判断できな/);
        // Nor a filing that contradicts itself, or a question the filing leaves open (いずれ = "each", not a gap).
        expect(n, id).not.toMatch(/食い違|整合し|分からな|わからな|特定でき|矛盾|齟齬|(?<!い)ずれ/);
        expect(n, id).not.toMatch(/financialNotes|TAXONOMY|証拠パック|エントリー|リサーチログ|sourceId|書くこと|を確認すること|確認してほしい|してください|すること(。|$|\s)|^[A-Za-z]+:/);
      }
    }
  });

  it("shows a released entry's notes without the editors' section names, each fact once", () => {
    const fake = { id: releasedWithNotes.companies[0]!, status: { state: "needs-attention" as const, notes: ["businessModel: 同じ事実。", "businessStructure: 同じ事実。", "history: 別の事実。"] } };
    expect(publicNotes(fake)).toEqual(["同じ事実。", "別の事実。"]);
    expect(publicNotes({ id: "not-on-the-list", status: { state: "needs-attention", notes: ["x"] } })).toEqual([]);
    expect(publicNotes({ id: fake.id, status: { state: "published" } })).toEqual([]);
  });

  it("says what a figures-only entry still lacks, instead of calling it ready", () => {
    const draft = companies.find((c) => c.status.state === "figures-only")!;
    const result = releaseReadiness(draft, context);
    expect(result.ready).toBe(false);
    expect(result.problems.join(" ")).toContain("一文の説明がありません");
  });

  it("does not call a needs-attention entry ready while its review notes are open", () => {
    const flagged = companies.find((c) => c.status.state === "needs-attention" && c.status.notes.length > 0)!;
    const result = releaseReadiness(flagged, context);
    expect(result.notes).toEqual(flagged.status.state === "needs-attention" ? flagged.status.notes : []);
    expect(result.ready).toBe(false);
  });

  it("does not change the entry it looks at", () => {
    const draft = companies.find((c) => c.status.state === "figures-only")!;
    const before = JSON.stringify(draft);
    releaseReadiness(draft, context);
    expect(JSON.stringify(draft)).toBe(before);
    expect(draft.status.state).toBe("figures-only");
  });
});
