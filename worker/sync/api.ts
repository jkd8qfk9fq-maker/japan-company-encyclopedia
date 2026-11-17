import { parseSyncData } from "../../src/lib/sync-data";
import type { RateLimit } from "../push/api";
import type { SyncStore } from "./store";

/**
 * Moving this browser's lists to another device by an e-mailed link (JCE-065). No account, no password: the sending
 * browser posts its lists with an address, the server keeps them for 30 minutes under a random one-time token and
 * mails a link carrying the token in its fragment (never sent to a server by the browser that opens it). Opening the
 * link takes the lists once. The address is used for that one mail and is not stored here.
 */
export type SyncEnv = {
  SYNC_LIMIT?: RateLimit;
  /** Resend (resend.com) API key, a Worker secret. Without it the feature reports itself off. */
  RESEND_API_KEY?: string;
  SYNC_MAIL_FROM?: string;
  /** Development only (.dev.vars): with no RESEND_API_KEY, log the link instead of mailing it, to test both devices. */
  SYNC_MAIL_LOG?: string;
};

export const SYNC_TTL_MS = 30 * 60 * 1000;
const MAX_BODY_BYTES = 64 * 1024;
const EMAIL = /^[^\s@"<>,;]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;
const KEY = /^[A-Za-z0-9_-]{43}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const randomKey = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
export async function sha256(text: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
  return [...digest].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const mailOn = (env: SyncEnv) => Boolean(env.RESEND_API_KEY) || env.SYNC_MAIL_LOG === "1";

export async function handleSync(request: Request, env: SyncEnv, store: SyncStore | null, now = Date.now(), mail = sendMail): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "GET" && url.pathname === "/api/sync/status") return json({ available: Boolean(store && mailOn(env)) });
  if (request.method !== "POST") return json({ error: "method" }, 405);
  if (!store || !mailOn(env)) return json({ error: "not-configured" }, 503);
  if (request.headers.get("origin") !== url.origin) return json({ error: "origin" }, 403);
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return json({ error: "content-type" }, 415);
  if (Number(request.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return json({ error: "too-large" }, 413);
  // Every action is limited per address: mailing is the costly one, and guessing tokens must stay hopeless.
  if (env.SYNC_LIMIT) {
    const { success } = await env.SYNC_LIMIT.limit({ key: request.headers.get("cf-connecting-ip") ?? "unknown" });
    if (!success) return json({ error: "rate" }, 429);
  }
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return json({ error: "body" }, 400);
  }

  if (url.pathname === "/api/sync/start") {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const data = parseSyncData(body.data);
    if (!EMAIL.test(email) || !data) return json({ error: "input" }, 400);
    // A new link from this browser replaces its earlier one, so only the latest mail works.
    if (typeof body.replace === "string" && KEY.test(body.replace)) await store.cancel(await sha256(body.replace));
    const token = randomKey();
    const cancelKey = randomKey();
    const expiresAt = now + SYNC_TTL_MS;
    await store.put(await sha256(token), await sha256(cancelKey), JSON.stringify(data), expiresAt);
    const link = `${url.origin}/sync/#t=${token}`;
    const sent = await mail(env, email, link, expiresAt);
    if (!sent) {
      await store.cancel(await sha256(cancelKey));
      return json({ error: "mail" }, 502);
    }
    return json({ ok: true, cancelKey, expiresAt });
  }

  if (url.pathname === "/api/sync/claim") {
    if (typeof body.token !== "string" || !KEY.test(body.token)) return json({ error: "input" }, 400);
    const row = await store.take(await sha256(body.token));
    // Used, withdrawn, replaced or expired all read the same: the reader asks for a new link.
    if (!row || row.expiresAt < now) return json({ error: "gone" }, 410);
    return json({ ok: true, data: JSON.parse(row.data) });
  }

  if (url.pathname === "/api/sync/cancel") {
    if (typeof body.cancelKey !== "string" || !KEY.test(body.cancelKey)) return json({ error: "input" }, 400);
    await store.cancel(await sha256(body.cancelKey));
    return json({ ok: true });
  }

  return json({ error: "not-found" }, 404);
}

async function sendMail(env: SyncEnv, to: string, link: string, expiresAt: number): Promise<boolean> {
  const until = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit" }).format(new Date(expiresAt));
  const text = [
    "日本企業百科事典で、別の端末へ引き継ぐ手続きがありました。",
    "引き継ぎ先の端末で、次のリンクを開いてください（" + until + "まで・1回だけ有効）。",
    "",
    link,
    "",
    "引き継ぐのは、フォロー中の企業・最近見た企業・フォロー中の業界・保存した検索条件です。",
    "心当たりがない場合は、このメールを削除してください。リンクは時間が過ぎると使えなくなります。",
  ].join("\n");
  if (!env.RESEND_API_KEY) {
    if (env.SYNC_MAIL_LOG === "1") console.log(`[sync mail, development] ${link}`);
    return env.SYNC_MAIL_LOG === "1";
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.SYNC_MAIL_FROM ?? "日本企業百科事典 <sync@kigyo-hyakka.com>", to: [to], subject: "別の端末へ引き継ぐリンク", text }),
  });
  if (!response.ok) console.error("sync: mail refused", response.status);
  return response.ok;
}
