import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { reportsStore } from "@/lib/storage/stores";
import { STORAGE_KEYS } from "@/lib/storage/storage";

/**
 * Stored values are untrusted: another tab, an old app version or a person
 * with devtools can write anything. These tests plant hostile values and
 * check what survives parsing.
 */

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
}

const baseReport = {
  id: "r1",
  category: "history",
  message: "x",
  createdAt: "2026-09-14T00:00:00.000Z",
  status: "open",
};

function plant(reports: unknown) {
  window.localStorage.setItem(STORAGE_KEYS.reports, JSON.stringify(reports));
}

describe("reportsStore parsing", () => {
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = {
      localStorage: new MemoryStorage(),
      addEventListener() {},
      removeEventListener() {},
    };
  });
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("keeps a same-origin kebab path", () => {
    plant([{ ...baseReport, pagePath: "/companies/toyota" }]);
    expect(reportsStore.get()[0].pagePath).toBe("/companies/toyota");
  });

  it.each(["//example.com", "/\\example.com", "https://example.com", "javascript:alert(1)", "/Companies/Toyota"])(
    "drops an off-site or malformed path: %s",
    (pagePath) => {
      plant([{ ...baseReport, pagePath }]);
      expect(reportsStore.get()[0].pagePath).toBeUndefined();
    },
  );

  it("drops a report with an unknown category instead of rendering it", () => {
    plant([{ ...baseReport, category: "<img onerror>" }]);
    expect(reportsStore.get()).toEqual([]);
  });

  it("falls back to empty for non-JSON", () => {
    window.localStorage.setItem(STORAGE_KEYS.reports, "not json");
    expect(reportsStore.get()).toEqual([]);
  });
});
