import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { companySchema } from "@/lib/content/schemas";
import { FIELD_LAYERS, assertMachineWrite, changedFields, layerOf } from "../scripts/pipeline/ownership.mjs";

/**
 * The three layers of a company entry (docs/continuous-pipeline-design.md §4.1): facts a program may update, the
 * explanation only a person may approve, and the metadata written with both. This keeps the table complete and the
 * automated writers inside it.
 */
const all = Object.values(FIELD_LAYERS).flat() as string[];

describe("every field has exactly one owner", () => {
  it("covers every field of the company schema", () => {
    const unowned = Object.keys(companySchema.shape).filter((k) => layerOf(k) === null);
    expect(unowned).toEqual([]);
  });

  it("names no field twice", () => expect(new Set(all).size).toBe(all.length));

  it("names no field the schema does not have", () => {
    const schemaKeys = new Set(Object.keys(companySchema.shape));
    expect(all.filter((f) => !schemaKeys.has(f))).toEqual([]);
  });
});

describe("automated writers", () => {
  const entry = { id: "acme", code: "1001", name: "アクメ", description: "鉄を売る会社です。", financials: [{ fiscalYear: "2025年3月期" }], sources: [{ id: "yuho-2025" }], status: { state: "published" }, updatedAt: "2026-01-01" };

  it("may change facts and metadata", () => {
    const next = { ...entry, financials: [{ fiscalYear: "2026年3月期" }], sources: [...entry.sources, { id: "yuho-2026" }], updatedAt: "2026-07-01", status: { state: "needs-attention", notes: ["訂正"] } };
    expect(() => assertMachineWrite(entry, next, "test")).not.toThrow();
    expect(changedFields(entry, next)).toEqual(["financials", "sources", "status", "updatedAt"]);
  });

  it("may not change the explanation, and says which field", () => {
    expect(() => assertMachineWrite(entry, { ...entry, description: "別の説明です。" }, "test")).toThrow(/description/);
    expect(() => assertMachineWrite(entry, { ...entry, businesses: [] }, "test")).toThrow(/businesses/);
  });

  it("may not add a field nobody owns", () => {
    expect(() => assertMachineWrite(entry, { ...entry, extra: 1 }, "test")).toThrow(/extra/);
  });

  it("refresh-financials and apply-amendment check before they write", () => {
    for (const [file, name] of [["scripts/pipeline/refresh-financials.mjs", "refresh-financials"], ["scripts/pipeline/apply-amendment.mjs", "apply-amendment"]]) {
      const source = readFileSync(file, "utf8");
      const check = source.indexOf(`assertMachineWrite(entry, next, "${name}")`);
      expect(check).toBeGreaterThan(-1);
      // the check comes before the entry is written
      const write = source.indexOf("writeFileSync(entryPath", check);
      expect(write === -1 || write > check).toBe(true);
    }
  });
});
