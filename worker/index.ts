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
    const target = REDIRECT_OLD_HOST ? redirectTarget(request.url) : null;
    if (target) return Response.redirect(target, 301);
    if (new URL(request.url).pathname.startsWith("/api/push/")) return handlePush(request, env, pushStore(env));
    if (new URL(request.url).pathname.startsWith("/api/sync/")) return handleSync(request, env, syncStore(env));
    return withShareImageType(new URL(request.url).pathname, await env.ASSETS.fetch(assetRequest(request)));
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
