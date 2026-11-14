/**
 * The site lives at kigyo-hyakka.com (JCE-039). This Worker only sends the old free address
 * (nihonkigyohyakka.<account>.workers.dev) and www. to it, so links already shared keep working; every page and file
 * is still the static export, served by the assets binding. /_next/* skips this Worker (wrangler.jsonc), so page
 * assets cost no invocation.
 */
const CANONICAL_HOST = "kigyo-hyakka.com";
/** Switched on 2026-11-10, after kigyo-hyakka.com answered: a failed domain attach must never send everyone to a dead address. */
const REDIRECT_OLD_HOST = true;

type Env = { ASSETS: { fetch(request: Request): Promise<Response> } };

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

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const target = REDIRECT_OLD_HOST ? redirectTarget(request.url) : null;
    return target ? Response.redirect(target, 301) : env.ASSETS.fetch(assetRequest(request));
  },
};

export default worker;
