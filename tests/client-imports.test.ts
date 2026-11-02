import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) ? [path] : [];
  });
}

/**
 * src/lib/site.ts throws at import in a production bundle without SITE_URL, which is the case in every browser: a
 * Client Component that imports it renders nothing but the error page. That shipped once (the head-office map,
 * 2026-11-02) and passed every other check, because the build only evaluates it on the server.
 */
describe("Client Components", () => {
  it("never import @/lib/site", () => {
    const offenders = files(join(process.cwd(), "src"))
      .filter((path) => /^\s*["']use client["']/.test(readFileSync(path, "utf8")))
      .filter((path) => /from\s+["']@\/lib\/site["']/.test(readFileSync(path, "utf8")));
    expect(offenders).toEqual([]);
  });
});
