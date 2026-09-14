export const SITE_NAME = "日本企業百科事典";
export const SITE_NAME_EN = "Japanese Companies";
export const SITE_TAGLINE_EN = "Understand the companies behind Japan.";
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
