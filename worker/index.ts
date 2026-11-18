/**
 * The site lives at kigyo-hyakka.com (JCE-039). This Worker sends the old free address
 * (nihonkigyohyakka.<account>.workers.dev) and www. to it, so links already shared keep working, and answers
 * /api/push/* and a half-hourly schedule for notifications of followed companies (JCE-059), /api/sync/* for moving a
 * reader's lists to another device (JCE-065); every page and file is
 * still the static export, served by the assets binding. /_next/* skips this Worker (wrangler.jsonc), so page
 * assets cost no invocation.
 */
const CANONICAL_HOST = "kigyo-hyakka.com";
/** Switched on 2026-11-10, after kigyo-hyakka.com answered: a failed domain attach must never send everyone to a dead address. */
const REDIRECT_OLD_HOST = true;

import { handlePush, runNotifications, type PushEnv, type Updates } from "./push/api";
import { d1Store } from "./push/store";
import { handleSync, type SyncEnv } from "./sync/api";
import { d1SyncStore } from "./sync/store";

type Env = PushEnv & SyncEnv & { ASSETS: { fetch(request: Request): Promise<Response> } };

// Notifications for followed companies (JCE-059): D1 when bound (wrangler.jsonc), otherwise the feature reports itself off.
const pushStore = (env: Env) => (env.PUSH_DB ? d1Store(env.PUSH_DB as Parameters<typeof d1Store>[0]) : null);
// Moving lists between devices (JCE-065) keeps its short-lived rows in the same database.
const syncStore = (env: Env) => (env.PUSH_DB ? d1SyncStore(env.PUSH_DB as Parameters<typeof d1SyncStore>[0]) : null);

/** Where a request should go instead, or null to serve it. Only known old hosts move: local previews are left alone. */
export function redirectTarget(requestUrl: string): string | null {
  const url = new URL(requestUrl);
  if (!url.hostname.endsWith(".workers.dev") && url.hostname !== `www.${CANONICAL_HOST}`) return null;
  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return url.toString();
}

/**
 * Plain HTTP must never serve the site (security audit 2026-11-18): the apex answered 200 over http:// because the
 * Cloudflare "Always Use HTTPS" setting does not cover it, and an HSTS header sent over plain HTTP is ignored by
 * browsers, so a first visit could be intercepted or rewritten. The Worker upgrades every http:// request itself,
 * so the guarantee lives in code, not in a dashboard setting. Local previews stay on HTTP.
 */
export function httpsUpgradeTarget(requestUrl: string): string | null {
  const url = new URL(requestUrl);
  if (url.protocol !== "http:") return null;
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]") return null;
  url.protocol = "https:";
  url.port = "";
  return url.toString();
}

const HSTS = "max-age=31536000; includeSubDomains";
const CSP = "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";
/**
 * The full script policy is not enforced yet: the pages carry Next.js inline scripts and AdSense / Analytics load
 * from several hosts, so an enforced script-src would break them. Report-Only collects what a real policy would
 * have blocked, in the browser console, without breaking anything — the step before enforcing it.
 */
const CSP_REPORT_ONLY =
  "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://pagead2.googlesyndication.com https://static.cloudflareinsights.com; frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

/**
 * Every response this Worker serves carries the security headers itself. The static export's `_headers` file
 * (scripts/build-static.mjs) states the same values, but a header that only exists there depends on the assets
 * layer honouring it — the /sw.js rules were in fact lost that way (audit 2026-11-18: the live service worker was
 * cacheable and carried the generic CSP, not its own). Setting them here covers pages, the 404 page and the
 * /api/push + /api/sync JSON answers alike.
 */
export function withSecurityHeaders(pathname: string, response: Response): Response {
  const out = new Response(response.body, response);
  if (pathname === "/sw.js") {
    // The service worker must never be served from an HTTP cache, or a broken worker could outlive its fix.
    out.headers.set("Content-Type", "application/javascript; charset=utf-8");
    out.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    out.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'");
    return out;
  }
  out.headers.set("Strict-Transport-Security", HSTS);
  out.headers.set("X-Content-Type-Options", "nosniff");
  out.headers.set("X-Frame-Options", "DENY");
  out.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  out.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  out.headers.set("Content-Security-Policy", CSP);
  out.headers.set("Content-Security-Policy-Report-Only", CSP_REPORT_ONLY);
  return out;
}

/** A 301 that itself carries HSTS, so even a redirect answer starts the browser's HTTPS-only memory. */
function redirectResponse(target: string): Response {
  return new Response(null, { status: 301, headers: { Location: target, "Strict-Transport-Security": HSTS } });
}

/**
 * The request to hand the assets binding, with any `$` in the path written as `%24`.
 *
 * Next.js names the prefetch files of dynamic routes after the segment (`__next.companies.$d$company-id.__PAGE__.txt`).
 * Asked for the `$` spelling, the assets server answers with a redirect to `%24`; browsers that put `$` back on the
 * wire then loop until they give up (ERR_TOO_MANY_REDIRECTS), so every prefetch of a company or industry page failed
 * and navigation fell back to full page loads. Asking for the encoded name directly returns the file.
 */
export function assetRequest(request: Request): Request {
  const url = new URL(request.url);
  if (!url.pathname.includes("$")) return request;
  url.pathname = url.pathname.replaceAll("$", "%24");
  return new Request(url.toString(), request);
}

/**
 * The share images of JCE-062 are exported as `…/opengraph-image`, with no extension, so the assets server cannot tell
 * they are PNG; a crawler that trusts the header would not show them. Only a successful answer is relabelled.
 */
export function withShareImageType(pathname: string, response: Response): Response {
  if (!pathname.endsWith("/opengraph-image") || !response.ok) return response;
  const out = new Response(response.body, response);
  out.headers.set("content-type", "image/png");
  return out;
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const upgrade = httpsUpgradeTarget(request.url);
    if (upgrade) return redirectResponse(upgrade);
    const target = REDIRECT_OLD_HOST ? redirectTarget(request.url) : null;
    if (target) return redirectResponse(target);
    if (pathname.startsWith("/api/push/")) return withSecurityHeaders(pathname, await handlePush(request, env, pushStore(env)));
    if (pathname.startsWith("/api/sync/")) return withSecurityHeaders(pathname, await handleSync(request, env, syncStore(env)));
    return withSecurityHeaders(pathname, withShareImageType(pathname, await env.ASSETS.fetch(assetRequest(request))));
  },
  // Every 30 minutes (wrangler.jsonc › triggers): announce what /updates.json — the live site — newly lists.
  async scheduled(_controller: unknown, env: Env): Promise<void> {
    await syncStore(env)?.prune(Date.now());
    await runNotifications(env, pushStore(env), async () => {
      const response = await env.ASSETS.fetch(new Request(`https://${CANONICAL_HOST}/updates.json`));
      return (await response.json()) as Updates;
    });
  },
};

export default worker;
