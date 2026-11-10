/**
 * The site lives at kigyo-hyakka.com (JCE-039). This Worker only sends the old free address
 * (nihonkigyohyakka.<account>.workers.dev) and www. to it, so links already shared keep working; every page and file
 * is still the static export, served by the assets binding. /_next/* skips this Worker (wrangler.jsonc), so page
 * assets cost no invocation.
 */
export const CANONICAL_HOST = "kigyo-hyakka.com";
/** Switched on 2026-11-10, after kigyo-hyakka.com answered: a failed domain attach must never send everyone to a dead address. */
export const REDIRECT_OLD_HOST = true;

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

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const target = REDIRECT_OLD_HOST ? redirectTarget(request.url) : null;
    return target ? Response.redirect(target, 301) : env.ASSETS.fetch(request);
  },
};

export default worker;
