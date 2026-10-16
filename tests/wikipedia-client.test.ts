import { describe, expect, it } from "vitest";
import {
  articleUrl,
  fetchWikipediaArticle,
  searchWikipedia,
  stripSnippet,
  userAgent,
  WikipediaError,
} from "@/lib/wikipedia/client";

// 実 API には接続しない。fetch を差し替えて、整形・検証・失敗の扱いだけを見る。
const json = (body: unknown, init?: ResponseInit) => new Response(JSON.stringify(body), init);

const searchBody = (search: unknown[]) => ({ batchcomplete: "", query: { searchinfo: { totalhits: search.length }, search } });

const toyotaHit = {
  ns: 0,
  title: "トヨタ自動車",
  pageid: 1234,
  snippet: '<span class="searchmatch">トヨタ</span>は愛知県の &quot;自動車&quot; メーカー &amp; 製造業',
  timestamp: "2026-10-01T00:00:00Z",
};

describe("searchWikipedia", () => {
  it("returns title, page id, generated url, cleaned snippet and timestamps", async () => {
    let requested: URL | undefined;
    let headers: HeadersInit | undefined;
    const fetchImpl = (async (input: URL, init?: RequestInit) => {
      requested = input;
      headers = init?.headers;
      return json(searchBody([toyotaHit]));
    }) as unknown as typeof fetch;

    const hits = await searchWikipedia("トヨタ自動車", { fetchImpl });

    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      title: "トヨタ自動車",
      pageId: 1234,
      url: "https://ja.wikipedia.org/wiki/%E3%83%88%E3%83%A8%E3%82%BF%E8%87%AA%E5%8B%95%E8%BB%8A",
      snippet: 'トヨタは愛知県の "自動車" メーカー & 製造業',
      lastModified: "2026-10-01T00:00:00Z",
    });
    expect(Number.isNaN(Date.parse(hits[0].retrievedAt))).toBe(false);

    const sent = requested!;
    expect(sent.origin + sent.pathname).toBe("https://ja.wikipedia.org/w/api.php");
    const params = sent.searchParams;
    expect(params.get("action")).toBe("query");
    expect(params.get("list")).toBe("search");
    expect(params.get("srsearch")).toBe("トヨタ自動車");
    expect(params.get("format")).toBe("json");
    expect(params.get("utf8")).toBe("1");
    expect((headers as Record<string, string>)["User-Agent"]).toBe(userAgent());
  });

  it("treats zero hits as a normal, empty result", async () => {
    const fetchImpl = (async () => json(searchBody([]))) as unknown as typeof fetch;
    await expect(searchWikipedia("存在しない企業名xyz", { fetchImpl })).resolves.toEqual([]);
  });

  it("clamps the limit and rejects an empty query before any request", async () => {
    let calls = 0;
    let requested: URL | undefined;
    const fetchImpl = (async (input: URL) => {
      calls++;
      requested = input;
      return json(searchBody([]));
    }) as unknown as typeof fetch;

    await expect(searchWikipedia("   ", { fetchImpl })).rejects.toMatchObject({ kind: "input" });
    expect(calls).toBe(0);

    await searchWikipedia("x", { fetchImpl, limit: 9999 });
    expect(requested?.searchParams.get("srlimit")).toBe("20");
  });

  it("reports a network failure as a typed error", async () => {
    const fetchImpl = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    await expect(searchWikipedia("トヨタ", { fetchImpl })).rejects.toMatchObject({ name: "WikipediaError", kind: "network" });
  });

  it("times out when the server never answers", async () => {
    const fetchImpl = ((_url: URL, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal!.reason));
      })) as unknown as typeof fetch;
    await expect(searchWikipedia("トヨタ", { fetchImpl, timeoutMs: 20 })).rejects.toMatchObject({ kind: "timeout" });
  });

  it("reports an HTTP error status", async () => {
    const fetchImpl = (async () => new Response("down", { status: 500 })) as unknown as typeof fetch;
    await expect(searchWikipedia("トヨタ", { fetchImpl })).rejects.toMatchObject({ kind: "http" });
  });

  it("reports an API-level error returned with HTTP 200 (e.g. maxlag)", async () => {
    const fetchImpl = (async () => json({ error: { code: "maxlag", info: "waiting" } })) as unknown as typeof fetch;
    await expect(searchWikipedia("トヨタ", { fetchImpl })).rejects.toMatchObject({ kind: "api" });
  });

  it.each([
    ["not json", () => new Response("<html>", { status: 200 })],
    ["json of the wrong shape", () => json({ query: {} })],
    ["an item without a page id", () => json(searchBody([{ title: "x", snippet: "", timestamp: "2026-01-01T00:00:00Z" }]))],
    ["an item with a bad timestamp", () => json(searchBody([{ ...toyotaHit, timestamp: "yesterday" }]))],
  ])("rejects a response that is %s", async (_label, respond) => {
    const fetchImpl = (async () => respond()) as unknown as typeof fetch;
    await expect(searchWikipedia("トヨタ", { fetchImpl })).rejects.toBeInstanceOf(WikipediaError);
    await expect(searchWikipedia("トヨタ", { fetchImpl })).rejects.toMatchObject({ kind: "format" });
  });
});

describe("fetchWikipediaArticle", () => {
  const page = {
    pageid: 1234,
    ns: 0,
    title: "トヨタ自動車",
    extract: "トヨタ自動車株式会社は…",
    revisions: [{ revid: 99, timestamp: "2026-10-01T00:00:00Z" }],
  };

  it("returns the article with a generated url and revision info", async () => {
    let requested: URL | undefined;
    const fetchImpl = (async (input: URL) => {
      requested = input;
      return json({ batchcomplete: true, query: { pages: [page] } });
    }) as unknown as typeof fetch;

    const article = await fetchWikipediaArticle({ title: "トヨタ", intro: true }, { fetchImpl });

    expect(article).toMatchObject({
      title: "トヨタ自動車",
      pageId: 1234,
      url: articleUrl("トヨタ自動車"),
      extract: "トヨタ自動車株式会社は…",
      revisionId: 99,
      lastModified: "2026-10-01T00:00:00Z",
    });
    expect(requested?.searchParams.get("titles")).toBe("トヨタ");
    expect(requested?.searchParams.get("redirects")).toBe("1");
    expect(requested?.searchParams.get("exintro")).toBe("1");
  });

  it("looks up by page id", async () => {
    let requested: URL | undefined;
    const fetchImpl = (async (input: URL) => {
      requested = input;
      return json({ query: { pages: [page] } });
    }) as unknown as typeof fetch;
    await fetchWikipediaArticle({ pageId: 1234 }, { fetchImpl });
    expect(requested?.searchParams.get("pageids")).toBe("1234");
    expect(requested?.searchParams.has("titles")).toBe(false);
  });

  it("returns null, not an error, for an article that does not exist", async () => {
    const fetchImpl = (async () =>
      json({ query: { pages: [{ title: "存在しない記事名xyz", missing: true }] } })) as unknown as typeof fetch;
    await expect(fetchWikipediaArticle({ title: "存在しない記事名xyz" }, { fetchImpl })).resolves.toBeNull();
  });

  it("rejects a bad page id or empty title without a request", async () => {
    const fetchImpl = (async () => {
      throw new Error("should not be called");
    }) as unknown as typeof fetch;
    await expect(fetchWikipediaArticle({ pageId: -1 }, { fetchImpl })).rejects.toMatchObject({ kind: "input" });
    await expect(fetchWikipediaArticle({ title: " " }, { fetchImpl })).rejects.toMatchObject({ kind: "input" });
  });

  it("rejects an article without revision info", async () => {
    const fetchImpl = (async () =>
      json({ query: { pages: [{ pageid: 1, title: "x" }] } })) as unknown as typeof fetch;
    await expect(fetchWikipediaArticle({ title: "x" }, { fetchImpl })).rejects.toMatchObject({ kind: "format" });
  });
});

describe("helpers", () => {
  it("builds the article url from the title only, with spaces as underscores", () => {
    expect(articleUrl("A B")).toBe("https://ja.wikipedia.org/wiki/A_B");
    expect(articleUrl("a/b?c#d")).toBe("https://ja.wikipedia.org/wiki/a%2Fb%3Fc%23d");
  });

  it("does not decode &amp;lt; twice", () => {
    expect(stripSnippet("a &amp;lt; b")).toBe("a &lt; b");
  });

  it("adds the optional contact to the user agent only when configured", () => {
    expect(userAgent({})).not.toContain("@");
    expect(userAgent({ WIKIPEDIA_CONTACT: "ops@example.com" })).toContain("ops@example.com");
  });
});
