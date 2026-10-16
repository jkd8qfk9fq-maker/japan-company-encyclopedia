import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The daily refresh workflow is detection only. These checks pin the properties that keep it that way, so a
 * later edit cannot quietly give it a way to write: a read-only token, no --apply, no git, no extra secret,
 * no untrusted input in a shell command. (A static read of the file — there is no YAML parser to depend on.)
 */

const text = readFileSync(join(process.cwd(), ".github/workflows/refresh-financials.yml"), "utf8");
const lines = text.split("\n");
const code = lines.filter((l) => !l.trim().startsWith("#"));

describe("refresh-financials workflow", () => {
  it("runs daily at 07:00 JST (22:00 UTC) and can be started by hand", () => {
    expect(code.join("\n")).toMatch(/schedule:\s*\n\s*-\s*cron:\s*"0 22 \* \* \*"/);
    expect(code.join("\n")).toContain("workflow_dispatch:");
  });

  it("has exactly one permission, contents: read", () => {
    const block = code.join("\n").match(/^permissions:\n((?:[ ]+\S.*\n)+)/m)?.[1];
    expect(block?.trim()).toBe("contents: read");
    expect(code.filter((l) => /^\s+(actions|checks|contents|deployments|id-token|issues|packages|pages|pull-requests|security-events|statuses|discussions|attestations):\s*\S/.test(l) && !l.includes("contents: read"))).toEqual([]);
    expect(code.join("\n")).not.toMatch(/:\s*write\b/);
  });

  it("never writes data: no --apply, no git, no credentials kept for later steps", () => {
    const body = code.join("\n");
    expect(body).not.toContain("--apply");
    expect(body).not.toMatch(/\bgit\s+(commit|push|add|config|remote|checkout|reset|stash|apply|am|merge|rebase|tag)\b/);
    expect(body).not.toMatch(/gh\s+(pr|issue|api|release)\b/);
    expect(body).toContain("persist-credentials: false");
  });

  it("uses one secret, EDINET_API_KEY, and never writes a key into the file", () => {
    const secrets = [...code.join("\n").matchAll(/secrets\.([A-Za-z0-9_]+)/g)].map((m) => m[1]);
    expect(secrets).toEqual(["EDINET_API_KEY"]);
    expect(code.join("\n")).not.toMatch(/EDINET_API_KEY:\s*(?!\$\{\{)\S/);
    expect(code.join("\n")).not.toMatch(/Subscription-Key=/);
  });

  it("pins every action to a version, and passes the manual input through the environment only", () => {
    const uses = code.filter((l) => l.trim().startsWith("- uses:") || l.trim().startsWith("uses:"));
    expect(uses.length).toBeGreaterThan(0);
    for (const l of uses) expect(l, l).toMatch(/@v\d+/);
    const inputUses = code.filter((l) => l.includes("${{ inputs."));
    expect(inputUses).toHaveLength(1);
    expect(inputUses[0].trim()).toMatch(/^REHEARSE_ID:/);
  });

  it("runs the dry-run script, writes a report and a summary, and fails the job when the script fails", () => {
    const body = code.join("\n");
    expect(body).toContain("scripts/pipeline/refresh-financials.mjs --all --report out/refresh-report.json --summary out/summary.md");
    expect(body).toContain('--rehearse "$REHEARSE_ID"');
    // the detection step must not swallow the exit code
    expect(body).not.toMatch(/refresh-financials\.mjs[^\n]*(\|\|\s*true|;\s*true)/);
    expect(body).not.toContain("continue-on-error");
    expect(body).toContain("GITHUB_STEP_SUMMARY");
    expect(body).toContain("actions/upload-artifact@v4");
  });

  it("checks after the run that the committed data did not change, even if the run failed", () => {
    const body = code.join("\n");
    expect(body).toMatch(/Check that the committed data did not change\n\s+if: always\(\)/);
    expect(body).toContain("src/data changed during a detection-only run");
  });

  it("keeps everything it downloads outside src/ and pipeline/, and does not cache secrets", () => {
    const body = code.join("\n");
    expect(body).toContain("RESEARCH_CACHE: ${{ github.workspace }}/.cache/edinet");
    expect(body).toContain("RESEARCH_INDEX_CACHE: ${{ github.workspace }}/.cache/edinet/index");
    expect(body.match(/path:\s*(\S+)/g)).toEqual(["path: .cache/edinet", "path: out/", "path: .cache/edinet"]);
  });
});
