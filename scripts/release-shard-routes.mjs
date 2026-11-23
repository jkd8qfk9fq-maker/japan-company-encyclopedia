/**
 * Free the routes a generated Worker config is about to claim (JCE-079).
 *
 *   node scripts/release-shard-routes.mjs wrangler.generated.shard-1.jsonc
 *
 * Why: partition-static.mjs repacks the company prefixes whenever the released set grows, so a prefix can move
 * from one shard Worker to another. `wrangler deploy` refuses a route that belongs to another Worker — and by then
 * it has already uploaded the new slice, so the old routes point at a Worker without those pages (2026-11-23:
 * /companies/3*, d*, v*, w* answered 404 after 126 companies were released). Before each deploy, every route the
 * config lists that is attached to a different Worker is detached, so the deploy can take it over.
 *
 * Needs CLOUDFLARE_API_TOKEN (Workers Routes: Edit). The zone is the site's own.
 */
import { readFileSync } from "node:fs";

const ZONE_ID = "5538b2faa1dda2ff503e0980b31ded37"; // kigyo-hyakka.com
const API = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes`;
const token = process.env.CLOUDFLARE_API_TOKEN;
const configPath = process.argv[2];
if (!token || !configPath) {
  console.error("release-shard-routes: CLOUDFLARE_API_TOKEN と設定ファイルのパスが必要です。");
  process.exit(1);
}

// The generated configs are JSON with whole-line // comments.
const config = JSON.parse(
  readFileSync(configPath, "utf8")
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n"),
);
const wanted = new Set((config.routes ?? []).map((r) => (typeof r === "string" ? r : r.pattern)));
if (wanted.size === 0) process.exit(0);

const call = async (url, init) => {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
  const body = await res.json();
  if (!body.success) throw new Error(`${init?.method ?? "GET"} ${url}: ${JSON.stringify(body.errors)}`);
  return body.result;
};

const routes = await call(API);
for (const route of routes) {
  if (wanted.has(route.pattern) && route.script && route.script !== config.name) {
    console.log(`release-shard-routes: ${route.pattern} を ${route.script} から外します（${config.name} が引き継ぎます）`);
    await call(`${API}/${route.id}`, { method: "DELETE" });
  }
}
