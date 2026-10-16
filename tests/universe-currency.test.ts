import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkConsistency, universeWindowEnd } from "../scripts/pipeline/jobs.mjs";
import { newerFiling } from "../scripts/pipeline/pack.mjs";
import { extraSections } from "../scripts/research/evidence-pack.mjs";

/**
 * Three ways a company ends up built on the wrong year's filing, or on less of it than the filing
 * has — found in the 20-company pilot:
 *  - the universe stopped on a day that was not finished, so a 有報 filed that afternoon (Zenken's
 *    第50期) was never seen and the company was built on 第49期;
 *  - nothing said the universe was old;
 *  - sections.json dropped every TextBlock of 200 characters or less, including 「親会社等はありません」.
 */

describe("a newer filing than the one a company is built on", () => {
  let cache: string;
  beforeEach(async () => {
    cache = await mkdtemp(join(tmpdir(), "edinet-index-"));
    await mkdir(join(cache, "index"), { recursive: true });
  });
  afterEach(async () => {
    await rm(cache, { recursive: true, force: true });
  });

  const row = (docID: string, secCode: string, docTypeCode: string, submitDateTime: string) => ({ docID, secCode, docTypeCode, submitDateTime, periodEnd: "2026-06-30", filerName: "テスト株式会社" });
  const day = (date: string, ...rows: unknown[]) => writeFile(join(cache, "index", `${date}.json`), JSON.stringify({ results: rows }));
  const identity = { code: "7371", submitted: "2025-09-24", originalDocID: "OLD", docID: "OLD" };

  it("is found when a later 有報 for the same code is in the index", async () => {
    await day("2026-09-28", row("NEW", "73710", "120", "2026-09-28 13:00"));
    expect(newerFiling(identity, cache)).toMatchObject({ docID: "NEW", submitted: "2026-09-28", periodEnd: "2026-06-30" });
  });

  it("takes the latest of several", async () => {
    await day("2026-09-28", row("MID", "73710", "120", "2026-09-28 13:00"));
    await day("2026-09-30", row("LAST", "73710", "120", "2026-09-30 09:00"));
    expect(newerFiling(identity, cache)?.docID).toBe("LAST");
  });

  it("is not triggered by a 訂正 (130), by another company, or by the filing it already has", async () => {
    await day("2026-09-28", row("AMEND", "73710", "130", "2026-09-28 13:00"), row("OTHER", "73720", "120", "2026-09-28 13:00"), row("OLD", "73710", "120", "2026-09-28 14:00"));
    expect(newerFiling(identity, cache)).toBeNull();
  });

  it("ignores filings that are not later than the one the company is built on", async () => {
    await day("2025-09-24", row("SAMEDAY", "73710", "120", "2025-09-24 10:00"));
    await day("2025-01-10", row("EARLIER", "73710", "120", "2025-01-10 10:00"));
    expect(newerFiling(identity, cache)).toBeNull();
  });

  it("is null when there is no index at all", () => {
    expect(newerFiling(identity, join(cache, "nowhere"))).toBeNull();
  });
});

describe("how old the universe is", () => {
  let root: string;
  let originalCwd: string;
  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "universe-"));
    await mkdir(join(root, "pipeline"), { recursive: true });
    originalCwd = process.cwd();
    process.chdir(root);
  });
  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(root, { recursive: true, force: true });
  });

  it("reads the last scanned day from the header", async () => {
    await writeFile(join(root, "pipeline/universe.tsv"), "# 上場企業の母集団 — 作成（2026-09-28）\n# 窓: 2024-09-01 〜 2026-09-28（758 日走査）\n# code\tfilerName\n");
    expect(universeWindowEnd()).toBe("2026-09-28");
  });

  it("is null without a universe or without a window line", async () => {
    expect(universeWindowEnd()).toBeNull();
    await writeFile(join(root, "pipeline/universe.tsv"), "# code\tfilerName\n");
    expect(universeWindowEnd()).toBeNull();
  });

  const check = (universeWindowEnd: string | null, now: string) => checkConsistency({ states: [], entries: [], universe: [], reservations: [], universeWindowEnd, now: Date.parse(`${now}T12:00:00Z`) });

  it("is reported once it is more than three days behind", () => {
    const problems = check("2026-09-28", "2026-10-04");
    expect(problems.map((p) => p.rule)).toEqual(["universe-window-stale"]);
    expect(problems[0].level).toBe("warn");
  });

  it("is not reported while it is current", () => {
    expect(check("2026-10-03", "2026-10-04")).toEqual([]);
    expect(check("2026-10-01", "2026-10-04")).toEqual([]);
  });
});

describe("TextBlocks that get their own entry in sections.json", () => {
  const block = (element: string, name: string, value: string) => ({ 要素ID: element, 項目名: name, 値: value });

  it("keeps a short block that says something by being short", () => {
    const out = extraSections([block("jpcrp_cor:InformationAboutParentCompanyOfReportingCompanyTextBlock", "提出会社の親会社等の情報", "<p>親会社等はありません。</p>")], []);
    expect(out).toEqual([{ name: "提出会社の親会社等の情報", element: "jpcrp_cor:InformationAboutParentCompanyOfReportingCompanyTextBlock", text: "親会社等はありません。" }]);
  });

  it("drops a block with nothing in it once the markup is gone", () => {
    const out = extraSections([block("a:ATextBlock", "空", "<p> </p>"), block("a:BTextBlock", "ダッシュ", "<td>－</td>"), block("a:CTextBlock", "値なし", "")], []);
    expect(out).toEqual([]);
  });

  it("leaves out elements that already have a file of their own, and non-TextBlock rows", () => {
    const out = extraSections([block("a:ATextBlock", "A", "本文A"), block("a:BTextBlock", "B", "本文B"), block("a:SomeAmount", "金額", "123")], ["a:ATextBlock"]);
    expect(out.map((b) => b.element)).toEqual(["a:BTextBlock"]);
  });
});
