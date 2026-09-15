import { afterEach, describe, expect, it, vi } from "vitest";
import { localEditingStatus } from "@/lib/content/content-store";

/**
 * Production /admin must never be able to write to the repository
 * (Git-Based Correction System spec §11). The guard is environment-based, so
 * it is tested against each environment it must refuse.
 */
describe("localEditingStatus", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows editing in local development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("CONTENT_EDITING", "");
    expect(localEditingStatus()).toEqual({ enabled: true });
  });

  it("refuses in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(localEditingStatus().enabled).toBe(false);
  });

  it("refuses on Vercel even if NODE_ENV were development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL", "1");
    expect(localEditingStatus().enabled).toBe(false);
  });

  it("refuses when switched off locally", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("CONTENT_EDITING", "off");
    expect(localEditingStatus().enabled).toBe(false);
  });

  it("refuses under the test runner's own environment", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(localEditingStatus().enabled).toBe(false);
  });
});
