export const SITE_NAME = "日本企業百科事典";
export const SITE_NAME_EN = "Japanese Companies";
export const SITE_TAGLINE_EN = "Understand the companies behind Japan.";
/** The line under the name in the header. */
export const SITE_TAGLINE = "日本企業を、構造から理解する。";
/** The second pillar's name (JCE-108): the training app that runs on this site's /learn, /quiz and /digest. */
export const TRAINING_APP_NAME = "分析訓練";
export const TRAINING_APP_DESCRIPTION =
  "決算を読む前に予想し、出た数字で答え合わせする。有価証券報告書の読み方を、1日数分のレッスンと今日の1問で身につける学習アプリ。";

export const SITE_DESCRIPTION =
  "日本の上場企業を、会社名ではなく「何をしている会社なのか」から理解するための企業百科事典。";

/**
 * Absolute origin for canonical URLs and Open Graph. A canonical URL pointing
 * at localhost in production silently de-indexes every page, so the fallback
 * chain ends at localhost only for local development, and the value in use is
 * exported so a test can assert it.
 */
function resolveSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  // Fail closed (review P3-2): a production build without an origin would
  // publish a sitemap, robots.txt and canonical URLs pointing at localhost.
  // For a local production check: SITE_URL=http://localhost:3000 npm run build
  if (process.env.NODE_ENV === "production") {
    throw new Error("SITE_URL is not set. Set it to the site's public origin before a production build.");
  }
  return "http://localhost:3000";
}

export const SITE_URL = new URL(resolveSiteUrl());

/**
 * The path the site is served under when it is not at the root of its origin — only the GitHub Pages preview
 * (https://<user>.github.io/<repo>/, built by .github/workflows/pages.yml). Empty everywhere else, so a normal build
 * is exactly what it was.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Cloudflare Web Analytics: page views counted without cookies or any identifier stored in the browser, so no consent
 * banner is needed (/privacy says what it collects). The token is public by design — every page sends it — and is set
 * at build time, so the counter is off until the operator adds one (JCE-036).
 */
export const ANALYTICS_TOKEN = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN ?? "";

/** An absolute URL on this site for a path that starts with "/". */
export const siteUrl = (path: string) => new URL(`${BASE_PATH}${path}`, SITE_URL).toString();

/** The share image every page falls back to (JCE-054). A page that sets its own openGraph must include it: Next
 *  replaces the parent's openGraph whole, so leaving it out drops the picture. */
export const OG_IMAGES = [{ url: `${BASE_PATH}/og/default.png`, width: 1200, height: 630, alt: SITE_NAME }];

/**
 * What makes /learn, /quiz and /digest install as the training app rather than the encyclopedia (JCE-108): their
 * own manifest, home-screen icon and title. Spread into each page's own metadata: a layout's `manifest` loses to
 * the root app/manifest.ts, a page's does not (checked in the rendered head).
 */
export const TRAINING_APP_METADATA = {
  manifest: `${BASE_PATH}/learn/manifest.webmanifest`,
  icons: { apple: `${BASE_PATH}/icons/training-apple-touch-icon.png` },
  appleWebApp: { capable: true, title: TRAINING_APP_NAME, statusBarStyle: "default" as const },
};
