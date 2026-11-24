import type { AdminEnv } from "./env";

/**
 * Cloudflare Access in front of the app (JCE-109, 2026-11-24): Access asks for the address and mails a one-time code
 * itself, then passes every request with a signed JWT (Cf-Access-Jwt-Assertion). The app verifies that token against
 * the team's published keys and this application's audience, and still checks the address against ADMIN_EMAILS — so a
 * request that reached the Worker without passing Access (or with another app's token) is not let in.
 */

type Jwk = JsonWebKey & { kid?: string };
let keyCache: { at: number; keys: Jwk[] } | null = null;

const fromB64url = (text: string) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function keys(team: string, fetcher: typeof fetch): Promise<Jwk[]> {
  if (keyCache && Date.now() - keyCache.at < 60 * 60 * 1000) return keyCache.keys;
  const response = await fetcher(`https://${team}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error(`access certs ${response.status}`);
  const body = (await response.json()) as { keys: Jwk[] };
  keyCache = { at: Date.now(), keys: body.keys };
  return body.keys;
}

/** The verified address in an Access token, or null. */
export async function accessEmail(env: AdminEnv, token: string | null, now = Date.now(), fetcher: typeof fetch = fetch): Promise<string | null> {
  return (await accessIdentity(env, token, now, fetcher))?.email ?? null;
}

/** The verified address and the moment the Access session ends (shown on the dashboard), or null. */
export async function accessIdentity(env: AdminEnv, token: string | null, now = Date.now(), fetcher: typeof fetch = fetch): Promise<{ email: string; expires: number } | null> {
  if (!token || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) return null;
  try {
    const header = JSON.parse(new TextDecoder().decode(fromB64url(h))) as { alg?: string; kid?: string };
    if (header.alg !== "RS256") return null;
    const jwk = (await keys(env.ACCESS_TEAM_DOMAIN, fetcher)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, fromB64url(s), new TextEncoder().encode(`${h}.${p}`));
    if (!ok) return null;
    const claims = JSON.parse(new TextDecoder().decode(fromB64url(p))) as { aud?: string | string[]; exp?: number; iss?: string; email?: string };
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!aud.includes(env.ACCESS_AUD)) return null;
    if (claims.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;
    if (typeof claims.exp !== "number" || claims.exp * 1000 < now) return null;
    return typeof claims.email === "string" ? { email: claims.email.toLowerCase(), expires: claims.exp * 1000 } : null;
  } catch {
    return null;
  }
}
