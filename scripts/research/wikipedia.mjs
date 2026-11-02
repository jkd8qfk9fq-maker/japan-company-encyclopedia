/**
 * The company's ja.wikipedia article, fetched once beside the evidence pack — `evidence/<id>/wikipedia.json`.
 *
 * JCE-030 allows Wikipedia as a supplement; agents used to search for it themselves, a web search and several fetches
 * per company. Here it is one search and at most three page reads, and the identity check is mechanical: an article is
 * the company's only if its wikitext prints the securities code (the 上場情報 / 証券コード of the infobox). Not found is
 * written too (`{ found: false }`), so the search is not repeated. The file is JSON, never .txt: the figure checker reads
 * every .txt in the pack, and no figure may come from Wikipedia.
 */
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const API = "https://ja.wikipedia.org/w/api.php";
const HEADERS = { "User-Agent": "japan-company-encyclopedia/1.0 (research pipeline)" };

/** @param {Record<string, string>} params */
async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
  return res.json();
}

/** The code as an infobox prints it: in 上場情報 / 証券コード, or as a bare 4-character code next to an exchange. */
export const printsCode = (/** @type {string} */ wikitext, /** @type {string} */ code) =>
  new RegExp(`(上場情報|証券コード|東証|名証|福証|札証)[^\\n]{0,40}\\b${code}\\b`).test(wikitext.normalize("NFKC"));

/**
 * @param {{ id: string, name: string, code: string, dir: string }} company dir = the evidence pack
 * @returns {Promise<{ found: boolean, title?: string }>}
 */
export async function fetchWikipedia({ name, code, dir }) {
  const path = join(dir, "wikipedia.json");
  if (existsSync(path)) return { found: true };
  const search = await api({ action: "query", list: "search", srsearch: name, srlimit: "3", srnamespace: "0" });
  for (const hit of search.query?.search ?? []) {
    const page = await api({ action: "query", prop: "revisions|extracts", rvprop: "content", rvslots: "main", exintro: "1", explaintext: "1", titles: hit.title, redirects: "1" });
    const p = page.query?.pages?.[0];
    const wikitext = p?.revisions?.[0]?.slots?.main?.content ?? "";
    if (!printsCode(wikitext, code)) continue;
    const body = { found: true, title: p.title, url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(p.title.replaceAll(" ", "_"))}`, matchedBy: `記事に証券コード ${code} の印字`, extract: String(p.extract ?? "").slice(0, 3000) };
    writeFileSync(path, `${JSON.stringify(body, null, 2)}\n`);
    return { found: true, title: p.title };
  }
  writeFileSync(path, `${JSON.stringify({ found: false, searched: name }, null, 2)}\n`);
  return { found: false };
}
