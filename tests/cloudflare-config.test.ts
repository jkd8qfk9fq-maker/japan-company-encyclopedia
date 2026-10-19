import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The Cloudflare deployment is a static site made by `npm run build:static`: its name is the first part of the free URL,
 * and the build must never delete anything from the working tree (the admin is real code, maybe not committed yet).
 */
const read = (path: string) => readFileSync(path, "utf8");
const wrangler = JSON.parse(read("wrangler.jsonc").replace(/^\s*\/\/.*$/gm, ""));
const script = read("scripts/build-static.mjs");

describe("wrangler.jsonc", () => {
  it("names the Worker nihonkigyohyakka, so the free URL starts with it", () => expect(wrangler.name).toBe("nihonkigyohyakka"));
  it("serves ./out as static assets with a 404 page", () => {
    expect(wrangler.assets).toEqual({ directory: "./out", not_found_handling: "404-page" });
  });
  it("holds no secret and no binding", () => {
    expect(JSON.stringify(wrangler)).not.toMatch(/key|token|secret|password/i);
    expect(Object.keys(wrangler).sort()).toEqual(["assets", "compatibility_date", "name"]);
  });
});

describe("npm run build:static", () => {
  it("is the script the Cloudflare build runs", () => expect(JSON.parse(read("package.json")).scripts["build:static"]).toBe("node scripts/build-static.mjs"));

  it("builds a COPY of the project: it removes only its own temp folder and ./out", () => {
    const removals = [...script.matchAll(/rmSync\((join\(root, "[^"]+"\)|[a-z]+)/g)].map((m) => m[1].trim());
    expect(removals.sort()).toEqual(['join(root, "out")', "work"].sort());
    expect(script).toContain("mkdtempSync");
    // …and the left-out server pages are filtered while copying, never deleted from the tree.
    expect(script).toContain("filter:");
    for (const left of ["src/app/admin", "src/app/report"]) expect(script).toContain(left);
  });

  it("unlinks the shared node_modules before removing the copy, and never recurses into it", () => {
    expect(script.indexOf("unlinkSync(link)")).toBeGreaterThan(-1);
    expect(script.indexOf("unlinkSync(link)")).toBeLessThan(script.indexOf("rmSync(work"));
  });

  it("copies no secret or working file: only what the build needs", () => {
    const top = /const TOP = \[([\s\S]*?)\];/.exec(script)?.[1] ?? "";
    for (const forbidden of [".env", "pipeline", "docs", ".git", "scripts", "tests"]) expect(top).not.toContain(`"${forbidden}`);
  });

  it("needs the server pages gone from the export, and says why in one place", () => {
    expect(read("next.config.ts")).toContain('process.env.PAGES_EXPORT === "1"');
  });
});
