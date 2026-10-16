/**
 * Wikipedia（日本語版）公式 API の読み取りクライアント。
 *
 * 用途は「企業名から Wikipedia の記事を探して読む」補助に限る。ここで得た内容は
 * 出典（`Source`）にできない（CLAUDE.md 不変条件 3、`src/lib/content/integrity.ts`）ため、
 * 戻り値の型は意図的に `Source` と別物にしてある。事実は一次資料で裏取りすること。
 *
 * `scripts/research/wikipedia.mjs` が Node の型ストリップで直接読み込むので、
 * このファイルは import を持たず、erasable な構文（enum・parameter property なし）だけを使う。
 */

const API_URL = "https://ja.wikipedia.org/w/api.php";
const ARTICLE_BASE_URL = "https://ja.wikipedia.org/wiki/";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;
// 混雑時はサーバー側から断ってもらう（Wikimedia API の礼儀）。
const MAX_LAG_SECONDS = 5;

/** Wikimedia の User-Agent 方針は連絡先を求める。個人情報をコードに埋めず、環境変数で任意に足す。 */
export function userAgent(env: Record<string, string | undefined> = process.env): string {
  const contact = env.WIKIPEDIA_CONTACT?.trim();
  const base = "japan-company-encyclopedia-research/0.1 (reading aid; no content is registered from it)";
  return contact ? `${base}; ${contact}` : base;
}

export type WikipediaErrorKind = "input" | "network" | "timeout" | "http" | "api" | "format";

export class WikipediaError extends Error {
  kind: WikipediaErrorKind;
  constructor(kind: WikipediaErrorKind, message: string) {
    super(message);
    this.name = "WikipediaError";
    this.kind = kind;
  }
}

/** 検索 1 件。どの記事をいつ取得したかを追えるよう title / pageId / url / retrievedAt を必ず持つ。 */
export type WikipediaSearchHit = {
  title: string;
  pageId: number;
  url: string;
  /** HTML タグと実体参照を除いた抜粋。 */
  snippet: string;
  /** 記事の最終更新日時（ISO 8601, UTC）。 */
  lastModified: string;
  /** この結果を API から取得した日時（ISO 8601, UTC）。 */
  retrievedAt: string;
};

export type WikipediaArticle = {
  title: string;
  pageId: number;
  url: string;
  /** プレーンテキストの本文（intro のみの場合あり）。 */
  extract: string;
  /** 取得した版の ID。 */
  revisionId: number;
  lastModified: string;
  retrievedAt: string;
};

export type RequestOptions = {
  timeoutMs?: number;
  /** テスト用。省略時はグローバル fetch。 */
  fetchImpl?: typeof fetch;
};

export type SearchOptions = RequestOptions & { limit?: number };

export type ArticleQuery = ({ title: string; pageId?: undefined } | { pageId: number; title?: undefined }) & {
  /** true なら導入部のみ。 */
  intro?: boolean;
};

/** 記事 URL は常にここで組み立てる。API や外部入力の URL は使わない。 */
export function articleUrl(title: string): string {
  return ARTICLE_BASE_URL + encodeURIComponent(title.replace(/ /g, "_"));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function requestJson(params: Record<string, string>, options: RequestOptions): Promise<Record<string, unknown>> {
  const url = new URL(API_URL);
  const query = { ...params, format: "json", utf8: "1", maxlag: String(MAX_LAG_SECONDS) };
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);

  const doFetch = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let response: Response;
  try {
    response = await doFetch(url, {
      headers: { "User-Agent": userAgent(), Accept: "application/json", "Api-User-Agent": userAgent() },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new WikipediaError("timeout", `Wikipedia API が ${timeoutMs}ms 以内に応答しなかった`);
    }
    const reason = error instanceof Error ? error.message : String(error);
    throw new WikipediaError("network", `Wikipedia API に接続できなかった: ${reason}`);
  }

  if (!response.ok) throw new WikipediaError("http", `Wikipedia API が HTTP ${response.status} を返した`);

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new WikipediaError("format", "Wikipedia API の応答が JSON ではない");
  }
  if (!isRecord(body)) throw new WikipediaError("format", "Wikipedia API の応答が想定外の形式");

  // maxlag 超過などは HTTP 200 で `error` を返す。
  if (isRecord(body.error)) {
    const code = typeof body.error.code === "string" ? body.error.code : "unknown";
    const info = typeof body.error.info === "string" ? body.error.info : "";
    throw new WikipediaError("api", `Wikipedia API エラー (${code}): ${info}`);
  }
  return body;
}

const ENTITIES: Record<string, string> = { "&quot;": '"', "&#039;": "'", "&#39;": "'", "&lt;": "<", "&gt;": ">", "&nbsp;": " " };

/** 検索抜粋の `<span class="searchmatch">` などを落とす。実体参照は最後に戻す（二重解釈を避けるため &amp; は最後）。 */
export function stripSnippet(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:quot|#0?39|lt|gt|nbsp);/g, (entity) => ENTITIES[entity] ?? entity)
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

export async function searchWikipedia(query: string, options: SearchOptions = {}): Promise<WikipediaSearchHit[]> {
  const term = query.trim();
  if (!term) throw new WikipediaError("input", "検索語が空");
  const limit = Math.min(Math.max(Math.trunc(options.limit ?? DEFAULT_LIMIT), 1), MAX_LIMIT);

  const body = await requestJson(
    { action: "query", list: "search", srsearch: term, srlimit: String(limit), srprop: "snippet|timestamp" },
    options,
  );
  const retrievedAt = new Date().toISOString();

  const queryNode = body.query;
  if (!isRecord(queryNode) || !Array.isArray(queryNode.search)) {
    throw new WikipediaError("format", "検索結果の形式が想定外 (query.search がない)");
  }

  return queryNode.search.map((item: unknown): WikipediaSearchHit => {
    if (
      !isRecord(item) ||
      typeof item.title !== "string" ||
      typeof item.pageid !== "number" ||
      typeof item.snippet !== "string" ||
      !isIsoTimestamp(item.timestamp)
    ) {
      throw new WikipediaError("format", "検索結果の項目が想定外の形式");
    }
    return {
      title: item.title,
      pageId: item.pageid,
      url: articleUrl(item.title),
      snippet: stripSnippet(item.snippet),
      lastModified: item.timestamp,
      retrievedAt,
    };
  });
}

/** 記事が存在しない場合は null（エラーにしない）。リダイレクトは辿る。 */
export async function fetchWikipediaArticle(
  target: ArticleQuery,
  options: RequestOptions = {},
): Promise<WikipediaArticle | null> {
  const params: Record<string, string> = {
    action: "query",
    prop: "extracts|revisions",
    rvprop: "ids|timestamp",
    explaintext: "1",
    redirects: "1",
    formatversion: "2",
  };
  if (target.intro) params.exintro = "1";
  if (target.pageId !== undefined) {
    if (!Number.isInteger(target.pageId) || target.pageId <= 0) throw new WikipediaError("input", "pageId が正の整数ではない");
    params.pageids = String(target.pageId);
  } else {
    const title = target.title.trim();
    if (!title) throw new WikipediaError("input", "タイトルが空");
    params.titles = title;
  }

  const body = await requestJson(params, options);
  const retrievedAt = new Date().toISOString();

  const queryNode = body.query;
  if (!isRecord(queryNode) || !Array.isArray(queryNode.pages) || queryNode.pages.length === 0) {
    throw new WikipediaError("format", "記事取得の形式が想定外 (query.pages がない)");
  }
  const page: unknown = queryNode.pages[0];
  if (!isRecord(page) || typeof page.title !== "string") {
    throw new WikipediaError("format", "記事取得の項目が想定外の形式");
  }
  if (page.missing === true || page.invalid === true) return null;

  const revision: unknown = Array.isArray(page.revisions) ? page.revisions[0] : undefined;
  if (
    typeof page.pageid !== "number" ||
    !isRecord(revision) ||
    typeof revision.revid !== "number" ||
    !isIsoTimestamp(revision.timestamp)
  ) {
    throw new WikipediaError("format", "記事の版情報が想定外の形式");
  }

  return {
    title: page.title,
    pageId: page.pageid,
    url: articleUrl(page.title),
    extract: typeof page.extract === "string" ? page.extract : "",
    revisionId: revision.revid,
    lastModified: revision.timestamp,
    retrievedAt,
  };
}
