import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
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

/**
 * The same failure through an indirect import (2026-11-17): a Client Component imported a module that imported the
 * Google Analytics ID from @/lib/site, and every page stopped rendering. The direct check above did not see it, so the
 * whole import graph of every Client Component is followed here.
 */
function resolveImport(from: string, spec: string): string | null {
  const root = process.cwd();
  const base = spec.startsWith("@/") ? join(root, "src", spec.slice(2)) : spec.startsWith(".") ? resolve(dirname(from), spec) : null;
  if (!base) return null; // a package
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function importsOf(file: string): string[] {
  const source = readFileSync(file, "utf8");
  // Type-only imports are erased and never run in the browser.
  const specs = [
    ...source.matchAll(/^\s*(?:import|export)\s+(?!type\b)[^;]*?from\s+["']([^"']+)["']/gm),
    ...source.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g),
  ].map((m) => m[1]!);
  return specs.map((s) => resolveImport(file, s)).filter((f): f is string => f !== null);
}

describe("Client Components, through every import", () => {
  it("never reach @/lib/site", () => {
    const root = process.cwd();
    const site = join(root, "src", "lib", "site.ts");
    const clients = files(join(root, "src")).filter((path) => /^\s*["']use client["']/.test(readFileSync(path, "utf8")));
    expect(clients.length).toBeGreaterThan(10);
    const offending: string[] = [];
    for (const client of clients) {
      const from = new Map<string, string | null>([[client, null]]);
      const queue = [client];
      while (queue.length) {
        const file = queue.shift()!;
        for (const next of importsOf(file)) {
          if (from.has(next)) continue;
          from.set(next, file);
          if (next === site) {
            const chain = [next];
            for (let at: string | null | undefined = file; at; at = from.get(at)) chain.unshift(at);
            offending.push(chain.map((f) => relative(root, f)).join(" → "));
          } else queue.push(next);
        }
      }
    }
    expect(offending, offending.join("\n")).toEqual([]);
  });
});
