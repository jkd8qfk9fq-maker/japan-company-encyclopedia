import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The daily refresh workflow: a read-only `detect` job, and a `propose` job that applies the verified updates on a
 * branch and opens a pull request (JCE-024). These checks pin what keeps it safe, so a later edit cannot quietly give
 * it a way to publish: the detect job stays read-only, the propose job can only push a branch and open a pull request,
 * never touches main, never merges, verifies before it proposes, and refuses changes outside the data it may write.
 * (A static read of the file — there is no YAML parser to depend on.)
 */

const text = readFileSync(join(process.cwd(), ".github/workflows/refresh-financials.yml"), "utf8");
const code = text.split("\n").filter((l) => !l.trim().startsWith("#"));
const body = code.join("\n");
const detect = body.slice(body.indexOf("\n  detect:"), body.indexOf("\n  propose:"));
const propose = body.slice(body.indexOf("\n  propose:"));

describe("refresh-financials workflow", () => {
  it("runs daily at 07:00 JST (22:00 UTC) and can be started by hand", () => {
    expect(body).toMatch(/schedule:\s*\n\s*-\s*cron:\s*"0 22 \* \* \*"/);
    expect(body).toContain("workflow_dispatch:");
  });

  it("is read-only by default; only the propose job raises its permissions, to exactly what a pull request needs", () => {
    const top = body.match(/^permissions:\n((?:[ ]+\S.*\n)+)/m)?.[1];
    expect(top?.trim()).toBe("contents: read");
    expect(detect).not.toMatch(/permissions:/);
    expect(detect).not.toMatch(/:\s*write\b/);
    const own = propose.match(/\n    permissions:\n((?:[ ]{6}\S.*\n)+)/)?.[1].trim().split("\n").map((l) => l.trim());
    expect(own).toEqual(["contents: write", "pull-requests: write"]);
  });

  it("detects without writing: no --apply, no git, no credentials kept, and checks that src/data did not change", () => {
    expect(detect).not.toContain("--apply");
    expect(detect).not.toMatch(/\bgit\s+(commit|push|add|config|switch|checkout)\b/);
    expect(detect).not.toMatch(/gh\s+(pr|issue|api|release)\b/);
    expect(detect).toContain("persist-credentials: false");
    expect(detect).toMatch(/Check that the committed data did not change\n\s+if: always\(\)/);
    expect(detect).toContain("src/data changed during a detection-only run");
  });

  it("covers every tier, and writes a report and a summary without swallowing the exit code", () => {
    expect(detect).toContain("scripts/pipeline/refresh-financials.mjs --all --tier all --report out/refresh-report.json --summary out/summary.md");
    expect(detect).toContain('--rehearse "$REHEARSE_ID"');
    expect(detect).not.toMatch(/refresh-financials\.mjs[^\n]*(\|\|\s*true|;\s*true)/);
    expect(body).not.toContain("continue-on-error");
    expect(body).toContain("GITHUB_STEP_SUMMARY");
    expect(body).toContain("actions/upload-artifact@v4");
  });

  it("proposes only when something was found, on the schedule or when asked", () => {
    expect(propose).toContain("needs: detect");
    expect(propose).toMatch(/if: needs\.detect\.outputs\.candidates != '0' && \(github\.event_name == 'schedule' \|\| inputs\.propose\)/);
  });

  it("verifies the whole repository and refuses any change outside the data before it proposes", () => {
    const apply = propose.indexOf("--apply");
    const verify = propose.indexOf("npx vitest run tests/data-integrity.test.ts");
    const tsc = propose.indexOf("npx tsc --noEmit");
    const fence = propose.indexOf("changes outside the allowed data");
    const pr = propose.indexOf("gh pr create");
    expect(apply).toBeGreaterThan(-1);
    for (const step of [verify, tsc, fence]) {
      expect(step).toBeGreaterThan(apply);
      expect(step).toBeLessThan(pr);
    }
    expect(propose).toContain("src/data/companies/[a-z0-9-]+\\.json|src/data/revisions/[a-z0-9-]+\\.json|pipeline/amendments-index\\.json");
  });

  it("pushes a branch and opens a pull request — never main, never a merge, never an approval", () => {
    expect(propose).toMatch(/git push origin "HEAD:refs\/heads\/\$\{branch\}"/);
    expect(propose).toMatch(/branch="auto\/financials-/);
    expect(body).not.toMatch(/git push[^\n]*\bmain\b/);
    expect(body).not.toMatch(/gh pr (merge|review)/);
    expect(propose).toContain("gh pr create --base main");
  });

  it("audits new 訂正有価証券報告書 daily, report only — reading each company's filing from its entry", () => {
    const audit = "node scripts/pipeline/amendment-audit.mjs --refresh --from-entries --report out/amendment-report.json --summary out/amendment-summary.md";
    expect(detect).toContain(audit);
    expect(propose).toContain(audit);
    expect(body).not.toContain("apply-amendment"); // a correction is applied by a person, never by the workflow
    expect(detect).toContain("cat out/amendment-summary.md >> \"$GITHUB_STEP_SUMMARY\"");
    expect(propose.indexOf("cat out/amendment-summary.md; } >> out/summary.md")).toBeLessThan(propose.indexOf("gh pr create"));
    expect(propose).toContain('steps.audit.outputs.exit }}" != "0"');
  });

  it("records the run in the repository, with the pull request", () => {
    expect(propose).toContain('cp out/refresh-report.json "pipeline/runs/financials-');
    expect(propose).toContain("git add src/data pipeline/amendments-index.json pipeline/runs");
  });

  it("uses one secret, EDINET_API_KEY, and never writes a key into the file", () => {
    const secrets = [...body.matchAll(/secrets\.([A-Za-z0-9_]+)/g)].map((m) => m[1]);
    expect([...new Set(secrets)]).toEqual(["EDINET_API_KEY"]);
    expect(body).not.toMatch(/EDINET_API_KEY:\s*(?!\$\{\{)\S/);
    expect(body).not.toMatch(/Subscription-Key=/);
  });

  it("pins every action to a version, and passes manual inputs through the environment only", () => {
    const uses = code.filter((l) => l.trim().startsWith("- uses:") || l.trim().startsWith("uses:"));
    expect(uses.length).toBeGreaterThan(0);
    for (const l of uses) expect(l, l).toMatch(/@v\d+/);
    const inputLines = code.filter((l) => l.includes("${{ inputs."));
    expect(inputLines.map((l) => l.trim().split(":")[0])).toEqual(["REHEARSE_ID", "LIMIT"]);
  });

  it("keeps everything it downloads outside src/ and pipeline/", () => {
    expect(body).toContain("RESEARCH_CACHE: ${{ github.workspace }}/.cache/edinet");
    expect(body).toContain("RESEARCH_INDEX_CACHE: ${{ github.workspace }}/.cache/edinet/index");
    for (const p of body.match(/path:\s*(\S+)/g) ?? []) expect(["path: .cache/edinet", "path: out/"]).toContain(p);
  });
});
