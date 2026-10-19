/**
 * Does /admin/queue really work behind the login? A smoke test against the PRODUCTION BUILD, run by hand.
 *
 *   SITE_URL=http://localhost:3000 npm run build        (once, or after the pages change)
 *   node scripts/verify-admin-queue.mjs [--port 3100]
 *
 * It starts `next start` on a spare port with a throwaway admin secret that exists only in this process (nothing is
 * written, your .env.local is not read or changed), mints a session cookie the way src/lib/admin/crypto.ts does, and
 * checks: the login guard (no cookie, a cookie signed with another secret, a tampered cookie), the list and detail
 * pages for every company in the queue, the 404s (unknown company, a path-shaped id), that the page has no approve
 * button, and that nothing of the queue reaches the public site. Exit 0 = all passed.
 *
 * It reads pipeline/autopilot (the real queue) and writes nothing.
 */
import { spawn } from "node:child_process";
import { createHmac, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const flag = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const port = flag("port", "3100");
const base = `http://localhost:${port}`;

if (!existsSync(join(root, ".next/BUILD_ID"))) {
  console.error("本番ビルドがありません。先に SITE_URL=http://localhost:3000 npm run build を実行してください");
  process.exit(1);
}
const queuePath = join(root, "pipeline/autopilot/queue.json");
const ids = existsSync(queuePath) ? JSON.parse(readFileSync(queuePath, "utf8")).items.map((i) => i.id) : [];
if (ids.length === 0) console.log("注意: キューが空です。一覧の確認は空のまま通ります（autopilot enqueue / run のあとにもう一度）");

const secret = randomBytes(32).toString("hex"); // 64 characters (the minimum is 32)
const derive = (s) => createHmac("sha256", s).update("japan-company-encyclopedia:admin-session").digest();
const mint = (s) => {
  const payload = `v1.${Math.floor(Date.now() / 1000) + 3600}`;
  return `${payload}.${createHmac("sha256", derive(s)).update(payload).digest("base64url")}`;
};
const good = mint(secret);

const env = { ...process.env, ADMIN_PASSWORD_HASH: "unused-in-this-check", ADMIN_SESSION_SECRET: secret, SITE_URL: base };
delete env.EDINET_API_KEY;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", port], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] });
let log = "";
server.stdout.on("data", (d) => (log += d));
server.stderr.on("data", (d) => (log += d));

const get = async (path, cookie) => {
  const res = await fetch(`${base}${path}`, { redirect: "manual", headers: cookie ? { cookie: `admin-session=${cookie}` } : {} });
  return { status: res.status, location: res.headers.get("location"), text: await res.text() };
};
const results = [];
const check = (name, ok, detail = "") => results.push({ 確認: name, 結果: ok ? "OK" : "NG", 詳細: detail });
const redirectsToLogin = (r) => r.status >= 300 && r.status < 400 && /\/admin\/login/.test(r.location ?? "");

try {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try {
      up = (await fetch(`${base}/`)).ok;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  if (!up) throw new Error(`サーバーが起動しません（ポート ${port} が使用中の可能性）\n${log.slice(-600)}`);

  check("未ログイン: 一覧はログインへ", redirectsToLogin(await get("/admin/queue")));
  check("未ログイン: 詳細もログインへ", redirectsToLogin(await get(`/admin/queue/${ids[0] ?? "x"}`)));
  check("別の秘密で署名した Cookie は拒否", redirectsToLogin(await get("/admin/queue", mint(randomBytes(32).toString("hex")))));
  check("改ざんした Cookie は拒否", redirectsToLogin(await get("/admin/queue", `${good.slice(0, -2)}xx`)));

  const list = await get("/admin/queue", good);
  check("ログイン済み: 一覧が 200", list.status === 200, String(list.status));
  check("キューの全社が一覧にある", ids.every((id) => list.text.includes(id)), `${ids.filter((id) => list.text.includes(id)).length}/${ids.length}`);
  check("noindex", /noindex/.test(list.text));
  check("承認のボタンがない（承認は手元のコマンド）", !/<form[^>]*action="[^"]*approve/i.test(list.text) && !/承認する/.test(list.text));
  for (const id of ids) {
    const d = await get(`/admin/queue/${id}`, good);
    const sheet = /内容のハッシュ/.test(d.text);
    check(`詳細 ${id}`, d.status === 200 && sheet, `${d.status}${sheet ? "" : "・確認シートなし"}`);
  }
  check("存在しない企業は 404", (await get("/admin/queue/no-such-company", good)).status === 404);
  check("パス操作の ID は 404", (await get("/admin/queue/..%2F..%2Fpackage", good)).status === 404);

  for (const path of ["/", "/companies", "/industries", "/sitemap.xml", "/robots.txt"]) {
    const p = await get(path);
    check(`公開 ${path} にキューのデータがない`, !/autopilot|pipeline\/staging|登録キュー|ready-with-flags/.test(p.text), String(p.status));
  }
} catch (error) {
  check("実行", false, String(error.message ?? error).slice(0, 300));
} finally {
  server.kill();
}
console.table(results);
const ng = results.filter((r) => r.結果 === "NG").length;
console.log(ng === 0 ? "すべて OK" : `NG ${ng} 件`);
process.exit(ng === 0 ? 0 : 1);
