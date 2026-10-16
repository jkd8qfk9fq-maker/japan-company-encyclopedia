import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { features } from "@/data/features";
import { terms } from "@/data/terms";
import { isReleased, releaseReadiness } from "@/lib/release";
import { companyRepository } from "@/lib/repositories";

/**
 * The release line: only `published` companies are visible to readers; everything else stays
 * in the repository for the admin editor and is released by promotion, not by a code change.
 */

const unreleased = companies.find((c) => c.status.state === "figures-only");
const released = companies.find((c) => c.status.state === "published");

describe("release line", () => {
  it("releases exactly the published companies", () => {
    expect(isReleased({ status: { state: "published" } })).toBe(true);
    expect(isReleased({ status: { state: "figures-only" } })).toBe(false);
    expect(isReleased({ status: { state: "needs-attention", notes: ["x"] } })).toBe(false);
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
    for (const c of companies.filter(isReleased)) expect(releaseReadiness(c, context), c.id).toEqual({ ready: true, problems: [], notes: [] });
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
