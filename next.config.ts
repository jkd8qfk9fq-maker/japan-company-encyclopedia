import type { NextConfig } from "next";

/**
 * The GitHub Pages preview (.github/workflows/pages.yml): the public pages exported as plain files and served under
 * /<repo>/. Only that workflow sets PAGES_EXPORT; it first deletes everything that needs a server (the admin, the
 * report form), which a static export cannot contain. Every other build is the normal server build below.
 */
const pagesExport = process.env.PAGES_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const serverConfig: NextConfig = {
  // Revisions are read from disk (the local editor adds files), so request-time
  // admin pages need the directory included in the deployment output.
  outputFileTracingIncludes: {
    "/admin/**": ["./src/data/revisions/**"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // The service worker must never be served from an HTTP cache, or a
        // broken worker could outlive its fix.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

const pagesConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  // The workflow removes the admin and the report form; the components that referred to them are removed too, and
  // the type check that matters runs on the full tree (npm run typecheck), not on this reduced copy.
  typescript: { ignoreBuildErrors: true },
  // Fewer build workers: the page data of ~4,000 entries is held by each, and a small runner runs out of memory.
  experimental: { cpus: 2, workerThreads: false },
};

const nextConfig = pagesExport ? pagesConfig : serverConfig;
export default nextConfig;
