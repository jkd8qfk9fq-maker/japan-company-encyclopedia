import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { auditIndexCache, documentsOn, indexDir, indexProblem } from "../scripts/research/edinet.mjs";
import { checkConsistency } from "../scripts/pipeline/jobs.mjs";

/**
 * The EDINET day-index cache is the universe's only source and what newerFiling reads, so a day it
 * holds wrongly looks exactly like a day it holds rightly. Found 2026-10-08: 2026-10-02 sat in the
 * cache as 144 filings produced at 11:57 that morning (the day really had 244), and Windows had
 * cleared ~340 older days from %TEMP% without a trace.
 */

const day = (date: string, processDateTime: string, results: unknown[] = [{ docID: "A" }], extra: object = {}) => ({
  metadata: { status: "200", parameter: { date, type: "2" }, resultset: { count: results.length }, processDateTime, message: "OK", ...extra },
  results,
});

describe("when a day's index may be trusted", () => {
  it("accepts an answer produced after the day ended", () => {
    expect(indexProblem(day("2026-10-01", "2026-10-02 00:03"), "2026-10-01")).toBeNull();
  });

  it("refuses one produced on the day itself — filings made later that day are not in it", () => {
    expect(indexProblem(day("2026-10-02", "2026-10-02 11:57"), "2026-10-02")).toMatchObject({ kind: "not-final" });
    expect(indexProblem(day("2026-10-01", "2026-10-01 23:58"), "2026-10-01")).toMatchObject({ kind: "not-final" });
  });

  it("refuses a non-200 status, a missing list, another day's index and a count that does not match", () => {
    expect(indexProblem({ metadata: { status: "404" }, results: [] }, "2026-10-01")).toMatchObject({ kind: "invalid" });
    expect(indexProblem({ metadata: { status: "200" } }, "2026-10-01")).toMatchObject({ kind: "invalid" });
    expect(indexProblem(day("2026-10-03", "2026-10-04 00:03"), "2026-10-01")).toMatchObject({ kind: "invalid" });
    const short = day("2026-10-01", "2026-10-02 00:03", [{ docID: "A" }]);
    short.metadata.resultset.count = 5;
    expect(indexProblem(short, "2026-10-01")).toMatchObject({ kind: "invalid" });
  });

  it("does not insist on fields EDINET might not send", () => {
    expect(indexProblem({ metadata: { status: "200" }, results: [] }, "2026-10-01")).toBeNull();
  });
});

describe("the cache itself", () => {
  let cache: string;
  const saved = { cache: process.env.RESEARCH_CACHE, key: process.env.EDINET_API_KEY };
  beforeEach(async () => {
    cache = await mkdtemp(join(tmpdir(), "edinet-cache-test-"));
    await mkdir(join(cache, "index"), { recursive: true });
    process.env.RESEARCH_CACHE = cache;
    process.env.EDINET_API_KEY = "test-key";
  });
  afterEach(async () => {
    vi.unstubAllGlobals();
    process.env.RESEARCH_CACHE = saved.cache;
    if (saved.cache === undefined) delete process.env.RESEARCH_CACHE;
    process.env.EDINET_API_KEY = saved.key;
    if (saved.key === undefined) delete process.env.EDINET_API_KEY;
    await rm(cache, { recursive: true, force: true });
  });
  const file = (date: string) => join(cache, "index", `${date}.json`);
  const serve = (body: unknown) => {
    const fetchMock = vi.fn(async () => new Response(typeof body === "string" ? body : JSON.stringify(body), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  };

  it("audits missing, unreadable and too-early days, and nothing else", async () => {
    await writeFile(file("2025-01-06"), JSON.stringify(day("2025-01-06", "2025-01-07 00:03")));
    await writeFile(file("2025-01-07"), "{ truncated");
    await writeFile(file("2025-01-08"), JSON.stringify(day("2025-01-08", "2025-01-08 09:00")));
    expect(auditIndexCache("2025-01-06", "2025-01-09", cache)).toEqual({ missing: ["2025-01-09"], corrupt: ["2025-01-07"], notFinal: ["2025-01-08"] });
  });

  it("does not expect today or the future to be final", () => {
    expect(auditIndexCache("2099-01-01", "2099-01-03", cache)).toEqual({ missing: [], corrupt: [], notFinal: [] });
  });

  it("writes a final answer, atomically, and does not ask again", async () => {
    const fetchMock = serve(day("2025-01-06", "2025-01-07 00:03"));
    await documentsOn("2025-01-06");
    await documentsOn("2025-01-06");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(readFileSync(file("2025-01-06"), "utf8")).results).toHaveLength(1);
    expect((await readdir(join(cache, "index"))).filter((f) => f.includes(".tmp"))).toEqual([]);
  });

  it("returns a not-final answer but never stores it", async () => {
    serve(day("2025-01-06", "2025-01-06 11:57"));
    expect((await documentsOn("2025-01-06")).results).toHaveLength(1);
    expect(existsSync(file("2025-01-06"))).toBe(false);
  });

  it("fetches a cached not-final day again and replaces it with the final one", async () => {
    await writeFile(file("2025-01-06"), JSON.stringify(day("2025-01-06", "2025-01-06 11:57", [{ docID: "A" }])));
    serve(day("2025-01-06", "2025-01-07 00:03", [{ docID: "A" }, { docID: "B" }]));
    expect((await documentsOn("2025-01-06")).results).toHaveLength(2);
    expect(JSON.parse(readFileSync(file("2025-01-06"), "utf8")).results).toHaveLength(2);
  });

  it("keeps the existing file when the new answer is bad, and when the fetch fails", async () => {
    const early = JSON.stringify(day("2025-01-06", "2025-01-06 11:57", [{ docID: "A" }]));
    await writeFile(file("2025-01-06"), early);
    serve({ metadata: { status: "500", message: "busy" } });
    expect((await documentsOn("2025-01-06")).results).toHaveLength(1);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("no", { status: 403 })));
    expect((await documentsOn("2025-01-06")).results).toHaveLength(1);
    expect(readFileSync(file("2025-01-06"), "utf8")).toBe(early);
  });

  it("refuses to use an unreadable file when it cannot be replaced, and leaves it alone", async () => {
    await writeFile(file("2025-01-06"), "{ truncated");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("no", { status: 403 })));
    await expect(documentsOn("2025-01-06")).rejects.toThrow();
    expect(readFileSync(file("2025-01-06"), "utf8")).toBe("{ truncated");
  });

  it("never lets a bad answer replace a good file", async () => {
    const good = JSON.stringify(day("2025-01-06", "2025-01-07 00:03"));
    await writeFile(file("2025-01-06"), good);
    serve({ metadata: { status: "200" } });
    expect((await documentsOn("2025-01-06")).results).toHaveLength(1); // the good cache is final: not even asked
    expect(readFileSync(file("2025-01-06"), "utf8")).toBe(good);
  });
});

describe("queue check on the day indexes", () => {
  const base = { states: [], entries: [], universe: [], reservations: [] };
  it("reports each kind of gap with its days", () => {
    const problems = checkConsistency({ ...base, indexAudit: { from: "2025-01-01", to: "2025-02-01", missing: ["2025-01-05"], corrupt: [], notFinal: ["2025-01-20", "2025-01-21"] } });
    expect(problems.filter((p) => p.rule === "index-cache-gap").map((p) => p.message)).toEqual([
      expect.stringContaining("欠落 1 日（2025-01-05）"),
      expect.stringContaining("確定前に取得 2 日"),
    ]);
    expect(problems.every((p) => p.level === "warn")).toBe(true);
  });
  it("is silent when the cache is complete or not audited", () => {
    expect(checkConsistency({ ...base, indexAudit: { from: "a", to: "b", missing: [], corrupt: [], notFinal: [] } })).toEqual([]);
    expect(checkConsistency(base)).toEqual([]);
  });
});

describe("a promoted entry whose company has filed a later 有報", () => {
  const universe = [{ code: "6156", id: "a-one", docID: "NEW", submitted: "2026-09-28" }];
  const state = (docID: string, submitted: string) => ({ companyId: "a-one", identity: { code: "6156", docID, submitted }, stages: { registration: { status: "completed" } } });
  const rule = (tier: string, s: ReturnType<typeof state>, u = universe) =>
    checkConsistency({ states: [s], entries: [{ id: "a-one", code: "6156", tier }], universe: u, reservations: [] }).filter((p) => p.rule === "entry-built-on-old-filing");

  it("is reported for published and needs-attention entries, never changed", () => {
    expect(rule("published", state("OLD", "2025-09-29"))).toHaveLength(1);
    expect(rule("needs-attention", state("OLD", "2025-09-29"))).toHaveLength(1);
  });
  it("is silent for figures-only (the normal pipeline refreshes those), for the same filing, and for an older universe row", () => {
    expect(rule("figures-only", state("OLD", "2025-09-29"))).toHaveLength(0);
    expect(rule("published", state("NEW", "2026-09-28"))).toHaveLength(0);
    expect(rule("published", state("OLD", "2026-10-01"))).toHaveLength(0);
  });
});

describe("where the day indexes live", () => {
  const saved = { cache: process.env.RESEARCH_CACHE, index: process.env.RESEARCH_INDEX_CACHE };
  afterEach(() => {
    for (const [key, value] of [["RESEARCH_CACHE", saved.cache], ["RESEARCH_INDEX_CACHE", saved.index]] as const) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  it("stays inside an explicit cache root, so a test or a one-off run is self-contained", async () => {
    const root = await mkdtemp(join(tmpdir(), "index-dir-"));
    delete process.env.RESEARCH_INDEX_CACHE;
    process.env.RESEARCH_CACHE = root;
    expect(indexDir()).toBe(join(root, "index"));
    await rm(root, { recursive: true, force: true });
  });
  it("can be pointed anywhere with RESEARCH_INDEX_CACHE", async () => {
    const dir = await mkdtemp(join(tmpdir(), "index-override-"));
    process.env.RESEARCH_INDEX_CACHE = dir;
    expect(indexDir()).toBe(dir);
    await rm(dir, { recursive: true, force: true });
  });
  it("by default is outside %TEMP% on Windows, where Storage Sense clears old files", () => {
    delete process.env.RESEARCH_CACHE;
    delete process.env.RESEARCH_INDEX_CACHE;
    if (process.platform !== "win32" || !process.env.LOCALAPPDATA) return;
    const dir = indexDir();
    expect(dir.startsWith(process.env.LOCALAPPDATA)).toBe(true);
    expect(dir.toLowerCase().startsWith((process.env.TEMP ?? "\0").toLowerCase())).toBe(false);
  });
});
