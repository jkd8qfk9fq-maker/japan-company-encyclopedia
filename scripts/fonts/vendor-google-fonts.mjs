/**
 * Copies the Google Fonts that src/app/layout.tsx uses into src/assets/fonts/google, so a production build never asks
 * Google (JCE-040). Cloudflare's builds failed now and then inside next/font: Google's CSS sometimes listed a font file
 * whose URL has no extension, which next/font cannot handle. The files and the unicode-range CSS are the same ones
 * next/font downloads; scripts/build-static.mjs points next/font at them (NEXT_FONT_GOOGLE_MOCKED_RESPONSES).
 *
 *   node scripts/fonts/vendor-google-fonts.mjs        (again whenever a font in layout.tsx changes)
 *
 * The URLs are the ones next/font requests for the three families; a build that requests another fails with
 * "Missing mocked response for URL", naming it — add it here.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const URLS = [
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400..900&display=swap",
  "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap",
  "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;600;700&display=swap",
];
// The user agent next/font sends (fetch-resource.js), so Google answers with the same CSS and woff2 files.
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36";
const OUT = join(process.cwd(), "src", "assets", "fonts", "google");
const FILES = join(OUT, "files");

async function get(url) {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
    if (response.ok) return response;
    if (attempt === 3) throw new Error(`${url} → ${response.status}`);
  }
}

rmSync(FILES, { recursive: true, force: true });
mkdirSync(FILES, { recursive: true });
const responses = {};
let count = 0;
for (const url of URLS) {
  let css = await (await get(url)).text();
  const fileUrls = [...new Set([...css.matchAll(/src: url\((.+?)\)/g)].map((m) => m[1]))];
  for (const fileUrl of fileUrls) {
    // fonts.gstatic.com/s/<family>/<version>/<file>.woff2 → <family>-<version>-<file>.woff2
    const match = /^https:\/\/fonts\.gstatic\.com\/s\/(.+\.(?:woff2|woff|ttf|otf))$/.exec(fileUrl);
    if (!match) throw new Error(`Google listed a font file this script cannot name: ${fileUrl} — run it again later`);
    const name = match[1].replaceAll("/", "-");
    writeFileSync(join(FILES, name), Buffer.from(await (await get(fileUrl)).arrayBuffer()));
    css = css.replaceAll(`url(${fileUrl})`, `url(__FONT_DIR__/${name})`);
    count++;
  }
  responses[url] = css;
}
writeFileSync(join(OUT, "responses.json"), JSON.stringify(responses, null, 2) + "\n");
console.log(`${count} font files and ${URLS.length} stylesheets written to ${OUT}`);
