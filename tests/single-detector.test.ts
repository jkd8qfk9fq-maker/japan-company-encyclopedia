import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * EDINET is watched from ONE place: the GitHub Actions workflow (JCE-018). A second scheduler — a Vercel cron, a
 * second workflow, a cron route — would call EDINET twice a day with a second copy of the key, and would
 * disagree with the first about what is new. This pins the decision of 2026-10-18.
 */
const root = process.cwd();
const workflows = existsSync(join(root, ".github/workflows")) ? readdirSync(join(root, ".github/workflows")).filter((f) => /\.ya?ml$/.test(f)) : [];
const read = (f: string) => readFileSync(join(root, ".github/workflows", f), "utf8");

describe("one detector", () => {
  it("has exactly one scheduled workflow, and it is the EDINET detection", () => {
    const scheduled = workflows.filter((f) => /^\s*schedule:/m.test(read(f)));
    expect(scheduled).toEqual(["refresh-financials.yml"]);
  });

  it("is the only place the EDINET key is used by a workflow", () => {
    const users = workflows.filter((f) => read(f).includes("EDINET_API_KEY"));
    expect(users).toEqual(["refresh-financials.yml"]);
  });

  it("has no Vercel cron: the site does not call EDINET", () => {
    expect(existsSync(join(root, "vercel.json"))).toBe(false);
    const route = join(root, "src/app/api/cron");
    expect(existsSync(route)).toBe(false);
  });

  it("keeps the registration pipeline out of the schedule: it is run by a person, on a machine that holds the work", () => {
    for (const f of workflows) {
      expect(read(f)).not.toMatch(/autopilot\.mjs|advance\.mjs|finalize\.mjs|--register/);
    }
  });

  it("does not let the public site read EDINET or the pipeline's working files — only the operator's /admin does, read-only", () => {
    const walk = (d: string): string[] => readdirSync(join(root, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
    const code = walk("src").filter((f) => /\.(ts|tsx)$/.test(f));
    const uses = (f: string, pattern: RegExp) => pattern.test(readFileSync(join(root, f), "utf8"));
    expect(code.filter((f) => uses(f, /EDINET_API_KEY/))).toEqual([]);
    const adminOnly = (f: string) => /^src[\\/](app[\\/]admin|lib[\\/]admin)[\\/]/.test(f);
    const readers = code.filter((f) => uses(f, /pipeline\/autopilot|pipeline\/staging/));
    expect(readers.length).toBeGreaterThan(0);
    expect(readers.filter((f) => !adminOnly(f))).toEqual([]);
    // …and what the admin reads, it never writes.
    for (const f of readers) expect(readFileSync(join(root, f), "utf8")).not.toMatch(/writeFileSync|appendFileSync|rmSync|renameSync|execFile|spawn/);
  });
});
