import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { redactLocalPaths } from "../scripts/research/edinet.mjs";

/**
 * An error message that is logged or written to a tracked file must not carry a path into a user profile.
 * pipeline/intake-failures.tsv is tracked and is built from such messages.
 */

describe("redactLocalPaths", () => {
  it("replaces every absolute user-profile path, plain or with doubled backslashes, and keeps the sentence", () => {
    const text = String.raw`EDINET がこの書類のXBRL（CSV）を提供していない（外国会社の可能性）: C:\Users\someone\AppData\Local\Temp\cache\documents\S100ABCD-5.zip`;
    expect(redactLocalPaths(text)).toBe("EDINET がこの書類のXBRL（CSV）を提供していない（外国会社の可能性）: <local-path>");
    expect(redactLocalPaths(String.raw`EPERM: rename 'C:\\Users\\someone\\AppData\\x.json' -> 'D:\Users\other\y.json'`)).toBe("EPERM: rename '<local-path>' -> '<local-path>'");
    expect(redactLocalPaths("cannot read C:/Users/someone/AppData/x with forward slashes")).toBe("cannot read <local-path> with forward slashes");
  });

  it("leaves paths that name no one alone", () => {
    const text = String.raw`Command failed: C:\Program Files\nodejs\node.exe scripts/research/evidence-pack.mjs`;
    expect(redactLocalPaths(text)).toBe(text);
  });
});

describe("pipeline/intake-failures.tsv", () => {
  it("holds no path into any user profile", () => {
    // Generic on purpose: this file is published, so it must not itself name a person, a machine or another project.
    const text = readFileSync(join(process.cwd(), "pipeline/intake-failures.tsv"), "utf8");
    expect(text).not.toMatch(/[A-Za-z]:[\\/]+Users[\\/]+/);
  });
});
