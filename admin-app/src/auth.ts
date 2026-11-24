import type { AdminEnv } from "./env";

/**
 * Sign-in by e-mailed link (JCE-109): no password to leak or guess. A link carries a signed {email, expiry} for 15
 * minutes; opening it sets a signed session cookie for 12 hours. The signing key is derived from the GitHub token and
 * the allowed addresses, so rotating the token or changing the list signs everyone out — no extra secret to keep.
 */

export const LINK_TTL_MS = 15 * 60 * 1000;
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
export const SESSION_COOKIE = "kigyo_admin";

const enc = new TextEncoder();
const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (text: string) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function key(env: AdminEnv): Promise<CryptoKey> {
  const material = `${env.GITHUB_TOKEN ?? ""}|${(env.ADMIN_EMAILS ?? "").trim().toLowerCase()}|kigyo-admin-session-v1`;
  return crypto.subtle.importKey("raw", await crypto.subtle.digest("SHA-256", enc.encode(material)), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function sign(env: AdminEnv, purpose: "link" | "session", email: string, expires: number): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify({ p: purpose, e: email, x: expires })));
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", await key(env), enc.encode(body)));
  return `${body}.${b64url(mac)}`;
}

/** The address a token was signed for, if the signature holds, the purpose matches and it has not expired. */
export async function verify(env: AdminEnv, purpose: "link" | "session", token: string | null | undefined, now = Date.now()): Promise<string | null> {
  if (!token || !env.GITHUB_TOKEN) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  let ok = false;
  try {
    ok = await crypto.subtle.verify("HMAC", await key(env), fromB64url(mac), enc.encode(body));
  } catch {
    return null;
  }
  if (!ok) return null;
  try {
    const value = JSON.parse(new TextDecoder().decode(fromB64url(body))) as { p?: string; e?: string; x?: number };
    if (value.p !== purpose || typeof value.e !== "string" || typeof value.x !== "number" || value.x < now) return null;
    return value.e;
  } catch {
    return null;
  }
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

export const sessionCookie = (value: string, maxAgeSeconds: number) =>
  `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
