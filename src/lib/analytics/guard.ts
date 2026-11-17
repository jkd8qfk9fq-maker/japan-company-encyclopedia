/**
 * What may reach Google Analytics from this site (JCE-056). Pure functions, unit-tested; the browser side is
 * src/components/analytics/analytics-consent.tsx.
 *
 * Only the path of a page (and the utm_* tags that say where a visit came from) leaves the browser. Everything else a
 * URL can carry — a search term, a fragment, a token in a link — is cut before a request is sent, and a request that
 * still contains a value this page has seen in a search box or fragment is not sent at all. The check sits on the
 * request itself, so it holds whatever Google's own automatic measurement is set to collect.
 */

/** Query keys kept: the campaign tags only. */
const CAMPAIGN_KEY = /^utm_(source|medium|campaign|term|content|id)$/;
/** Query keys whose values are never sent, even inside another field: search terms, link tokens, Checkout sessions. */
const SEARCH_KEY = /^(q|query|s|search|keyword|kw)$/;
const TOKEN_KEY = /^(token|session_id)$/;
/** Hosts Google's tag sends measurements to. The tag itself (/gtag/js) is a download, not a measurement. */
const GOOGLE_HOST = /(^|\.)(google-analytics\.com|analytics\.google\.com|googletagmanager\.com|doubleclick\.net|google\.com)$/;

/** Origin + path + campaign tags; null for anything that is not an http(s) address. */
export function cleanAddress(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const kept = [...url.searchParams].filter(([key]) => CAMPAIGN_KEY.test(key));
  const query = kept.map(([key, v]) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
  return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
}

/**
 * Values on this address that must never reach Google: a search term (two characters or more), a token or Checkout
 * session (eight or more), and a fragment of eight or more — short in-page anchors such as #main are not secret.
 */
export function secretsIn(href: string): string[] {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return [];
  }
  const found: string[] = [];
  const fragment = url.hash.slice(1);
  if (fragment.length >= 8) found.push(fragment);
  for (const [key, raw] of url.searchParams) {
    const value = raw.trim();
    if (SEARCH_KEY.test(key) && value.length >= 2) found.push(value);
    else if (TOKEN_KEY.test(key) && value.length >= 8) found.push(value);
  }
  return found;
}

export function isGoogleMeasurement(target: string, base?: string): boolean {
  let url: URL;
  try {
    url = new URL(target, base);
  } catch {
    return false;
  }
  if (!GOOGLE_HOST.test(url.hostname)) return false;
  return !(url.hostname.endsWith("googletagmanager.com") && url.pathname === "/gtag/js");
}

/** Rewrites every value of a query string that is an http(s) address. */
function cleanQuery(query: string): string {
  return query
    .split("&")
    .map((pair) => {
      const at = pair.indexOf("=");
      if (at < 0) return pair;
      let value: string;
      try {
        value = decodeURIComponent(pair.slice(at + 1).replace(/\+/g, " "));
      } catch {
        return pair;
      }
      if (!/^https?:\/\//i.test(value)) return pair;
      return `${pair.slice(0, at)}=${encodeURIComponent(cleanAddress(value) ?? "")}`;
    })
    .join("&");
}

function mentions(text: string, secrets: readonly string[]): boolean {
  let decoded = text;
  try {
    decoded = decodeURIComponent(text.replace(/\+/g, " "));
  } catch {
    // compare the raw text only
  }
  return secrets.some((s) => text.includes(s) || decoded.includes(s) || text.includes(encodeURIComponent(s)));
}

/**
 * One request to Google, made safe to send — or null when it must not go: it still mentions a secret, or its body is
 * not text (a Blob cannot be checked synchronously, so it is not sent).
 */
export function cleanRequest(target: string, body: unknown, secrets: readonly string[]): { url: string; body: unknown } | null {
  const q = target.indexOf("?");
  const url = q < 0 ? target : `${target.slice(0, q + 1)}${cleanQuery(target.slice(q + 1))}`;
  let cleanBody: unknown = body;
  if (body !== undefined && body !== null && body !== "") {
    if (typeof body !== "string") return null;
    cleanBody = body.split("\n").map(cleanQuery).join("\n");
  }
  if (mentions(url, secrets) || (typeof cleanBody === "string" && mentions(cleanBody, secrets))) return null;
  return { url, body: cleanBody };
}

/** The consent choice, shared by every kigyo-hyakka.com site through one cookie on the parent domain. */
export const CONSENT_COOKIE = "yugenq_consent_ga";
export type Consent = "granted" | "denied";

export function readConsent(cookies: string): Consent | null {
  for (const part of cookies.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === CONSENT_COOKIE) {
      const value = rest.join("=");
      return value === "granted" || value === "denied" ? value : null;
    }
  }
  return null;
}

/** The parent domain when the page is on kigyo-hyakka.com, so the choice is shared; this host only, otherwise. */
export function cookieDomain(hostname: string): string | null {
  const host = hostname.toLowerCase();
  return host === "kigyo-hyakka.com" || host.endsWith(".kigyo-hyakka.com") ? ".kigyo-hyakka.com" : null;
}

export function cookieString(name: string, value: string, opts: { hostname: string; secure: boolean; maxAge: number }): string {
  const domain = cookieDomain(opts.hostname);
  return `${name}=${value}; Path=/; Max-Age=${opts.maxAge}; SameSite=Lax${domain ? `; Domain=${domain}` : ""}${opts.secure ? "; Secure" : ""}`;
}

/** Event names the site sends: a name only, never a value. */
export type TrackedEvent = "begin_checkout";
