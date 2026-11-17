import { GA_MEASUREMENT_ID } from "./config";
import {
  CONSENT_COOKIE,
  cleanAddress,
  cleanRequest,
  cookieString,
  isGoogleMeasurement,
  readConsent,
  secretsIn,
  type Consent,
  type TrackedEvent,
} from "./guard";

/**
 * Google Analytics in the browser (JCE-056). Nothing here runs until the reader has agreed; the cookieless page counts
 * (Cloudflare, JCE-036) are separate and unchanged. Browser only — called from effects and click handlers.
 */

const YEAR_SECONDS = 31536000;
type Gtag = (...args: unknown[]) => void;
type GaWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };

export const gaConfigured = (): boolean => /^G-[A-Z0-9]{4,16}$/.test(GA_MEASUREMENT_ID);

// ---- the choice ----
const listeners = new Set<() => void>();
export function subscribeConsent(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}
export const consentSnapshot = (): Consent | "none" => readConsent(document.cookie) ?? "none";

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = cookieString(name, value, { hostname: location.hostname, secure: location.protocol === "https:", maxAge });
}

/** Google's own cookies (_ga, _ga_XXXX), removed on the parent domain and on this host. */
export function clearGaCookies(): void {
  for (const part of document.cookie.split(";")) {
    const name = part.trim().split("=")[0] ?? "";
    if (/^_ga(_|$)/.test(name)) {
      writeCookie(name, "", 0);
      document.cookie = `${name}=; Path=/; Max-Age=0`;
    }
  }
}

export function saveConsent(value: Consent): void {
  writeCookie(CONSENT_COOKIE, value, YEAR_SECONDS);
  if (value === "denied") clearGaCookies();
  for (const l of listeners) l();
  if (value === "granted") startAnalytics();
}

/** 「閲覧統計の設定」: forget the choice and Google's cookies, and reload so no loaded tag is left running. */
export function resetConsent(): void {
  writeCookie(CONSENT_COOKIE, "", 0);
  clearGaCookies();
  location.reload();
}

// ---- what may be sent ----
const secrets: string[] = [];
function remember() {
  for (const s of secretsIn(location.href)) if (!secrets.includes(s)) secrets.push(s);
}

/** Every way Google's tag sends a request passes through cleanRequest first. */
function guardRequests() {
  const w = window as Window & { __kigyoGaGuard?: boolean };
  if (w.__kigyoGaGuard) return;
  w.__kigyoGaGuard = true;

  const beacon = navigator.sendBeacon?.bind(navigator);
  if (beacon) {
    navigator.sendBeacon = (target: string | URL, data?: BodyInit | null) => {
      if (!isGoogleMeasurement(String(target), location.href)) return beacon(target, data);
      remember();
      const safe = cleanRequest(String(target), data, secrets);
      return safe ? beacon(safe.url, safe.body as BodyInit | null) : true;
    };
  }

  const nativeFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const target = typeof input === "string" || input instanceof URL ? String(input) : input.url;
    if (!isGoogleMeasurement(target, location.href)) return nativeFetch.call(this, input, init);
    remember();
    // A Request object's body cannot be read here synchronously: not sent.
    if (!(typeof input === "string" || input instanceof URL)) return Promise.resolve(new Response(null, { status: 204 }));
    const safe = cleanRequest(target, init?.body, secrets);
    if (!safe) return Promise.resolve(new Response(null, { status: 204 }));
    return nativeFetch.call(this, safe.url, init ? { ...init, ...(init.body !== undefined ? { body: safe.body as BodyInit } : {}) } : undefined);
  };

  const xhr = XMLHttpRequest.prototype;
  const open = xhr.open;
  const send = xhr.send;
  xhr.open = function (this: XMLHttpRequest & { __ga?: string }, ...args: Parameters<typeof open>) {
    this.__ga = isGoogleMeasurement(String(args[1]), location.href) ? String(args[1]) : undefined;
    return open.apply(this, args);
  } as typeof open;
  xhr.send = function (this: XMLHttpRequest & { __ga?: string }, body?: Document | XMLHttpRequestBodyInit | null) {
    if (!this.__ga) return send.call(this, body);
    remember();
    const safe = cleanRequest(this.__ga, body, secrets);
    // The address cannot change once opened, so a request that needed rewriting is not sent.
    if (!safe || safe.url !== this.__ga) return this.abort();
    return send.call(this, safe.body as XMLHttpRequestBodyInit);
  };

  const src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (src?.set && src.get) {
    const set = src.set;
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      configurable: true,
      enumerable: src.enumerable,
      get: src.get,
      set(this: HTMLImageElement, value: string) {
        if (isGoogleMeasurement(String(value), location.href)) {
          remember();
          const safe = cleanRequest(String(value), null, secrets);
          if (!safe) return;
          value = safe.url;
        }
        set.call(this, value);
      },
    });
  }
}

// ---- page views and events ----
let started = false;
let lastPath: string | null = null;
let lastAddress: string | null = null;
const queued: TrackedEvent[] = [];

// gtag.js reads only `arguments` objects from the data layer — an array of the same values is silently ignored, so
// this cannot be a rest-parameter function.
const gtag: Gtag = function () {
  const w = window as GaWindow;
  // eslint-disable-next-line prefer-rest-params
  (w.dataLayer ??= []).push(arguments);
};

function pageView() {
  remember();
  const address = cleanAddress(location.href);
  if (!started || !address) return;
  const path = address.split("?")[0];
  if (path === lastPath) return; // the same page rewriting its own address is not a new view
  const fields = { page_location: address, page_referrer: lastAddress ?? cleanAddress(document.referrer) ?? "", page_title: document.title };
  gtag("set", fields); // so Google's automatic events on this page use the path too
  gtag("event", "page_view", fields);
  lastPath = path;
  lastAddress = address;
}

function watchNavigation() {
  for (const method of ["pushState", "replaceState"] as const) {
    const original = history[method];
    history[method] = function (this: History, ...args: Parameters<History["pushState"]>) {
      const out = original.apply(this, args);
      pageView();
      return out;
    };
  }
  window.addEventListener("popstate", pageView);
  window.addEventListener("hashchange", remember);
}

/** Loads Google's tag for a reader who agreed. Idempotent. */
export function startAnalytics(): void {
  if (started || !gaConfigured() || consentSnapshot() !== "granted") return;
  remember();
  guardRequests();
  watchNavigation();
  const w = window as GaWindow;
  w.gtag ??= gtag;
  gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false, // pageView() sends them, path only
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_domain: location.hostname.endsWith("kigyo-hyakka.com") ? "kigyo-hyakka.com" : "auto",
    cookie_flags: location.protocol === "https:" ? "SameSite=Lax;Secure" : "SameSite=Lax",
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
  started = true;
  pageView();
  for (const name of queued.splice(0)) trackEvent(name);
}

/** A named event for a reader who agreed (a name only); otherwise nothing is sent. */
export function trackEvent(name: TrackedEvent): void {
  if (typeof window === "undefined") return;
  if (started) gtag("event", name, { page_location: cleanAddress(location.href) ?? "" });
  else if (queued.length < 20) queued.push(name);
}
