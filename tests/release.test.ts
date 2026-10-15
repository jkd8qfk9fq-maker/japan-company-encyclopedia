import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { isReleased } from "@/lib/release";
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
