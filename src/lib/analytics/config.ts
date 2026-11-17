/**
 * Google Analytics 4 measurement ID (JCE-056). Public by design: every page that loads the tag names it.
 *
 * Kept in its own module with no imports because the browser loads it. src/lib/site.ts must never reach client code:
 * it throws in a production bundle, where the server-only SITE_URL does not exist — importing the ID from there took
 * every page down on 2026-11-17 (tests/client-imports.test.ts now guards the whole client graph).
 */
export const GA_MEASUREMENT_ID: string = "G-LK6W6HRM10";
