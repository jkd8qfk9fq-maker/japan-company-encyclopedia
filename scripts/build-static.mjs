/**
 * Build the PUBLIC pages as a static site in ./out — what Cloudflare (Workers static assets or Pages) serves.
 *
 *   npm run build:static          (SITE_URL = the public origin, e.g. https://nihonkigyohyakka.<account>.workers.dev)
 *
 * A static export cannot contain a page that needs a server, so the admin and the report form are left out. They are left
 * out of a COPY of the project: this script never deletes or edits anything in the working tree (the admin is real
 * code, and some of it may not be committed yet). The copy is built with `PAGES_EXPORT=1` (next.config.ts), the result is
 * moved to ./out, and the copy is removed.
 *
 * The normal server build (`npm run build`) is not affected and is the one that has the admin and the report form.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, rmdirSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const norm = (/** @type {string} */ p) => relative(root, p).split(sep).join("/");

// Everything the build needs, and nothing it must not take (no secrets, no working files, no history).
const TOP = ["src", "public", "package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "next-env.d.ts", "postcss.config.mjs", "postcss.config.js", "components.json"];
// What a static export cannot hold: pages and actions that need a server.
const LEFT_OUT = ["src/app/admin", "src/app/report", "src/components/admin", "src/components/settings/report-form.tsx"];

let siteUrl = process.env.SITE_URL || process.env.CF_PAGES_URL;
if (!siteUrl) {
  siteUrl = "https://nihonkigyohyakka.workers.dev";
  console.warn(`注意: SITE_URL が未設定のため ${siteUrl} を仮に使います。正規の URL・サイトマップ・共有リンクの元になるので、公開後の URL を SITE_URL に設定してください`);
}

const work = mkdtempSync(join(tmpdir(), "jce-static-"));
let failed = false;
try {
  for (const name of TOP) {
    const from = join(root, name);
    if (!existsSync(from)) continue;
    cpSync(from, join(work, name), { recursive: true, filter: (src) => !LEFT_OUT.includes(norm(src)) });
  }
  // node_modules is shared, not copied (a junction on Windows, a symlink elsewhere).
  symlinkSync(join(root, "node_modules"), join(work, "node_modules"), "junction");

  const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build", "--webpack"], {
    cwd: work,
    stdio: "inherit",
    env: { ...process.env, PAGES_EXPORT: "1", NEXT_PUBLIC_BASE_PATH: "", SITE_URL: siteUrl, NODE_ENV: "production" },
  });
  if (result.status !== 0 || !existsSync(join(work, "out"))) throw new Error(`next build が失敗しました（終了コード ${result.status}）`);

  // next.config.ts headers() is not applied to a static export; Cloudflare reads these from a _headers file.
  writeFileSync(
    join(work, "out", "_headers"),
    "/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n",
  );

  rmSync(join(root, "out"), { recursive: true, force: true });
  mkdirSync(join(root, "out"), { recursive: true });
  cpSync(join(work, "out"), join(root, "out"), { recursive: true });
  console.log(`\n静的サイトを ./out に書き出しました（SITE_URL = ${siteUrl}）`);
} catch (error) {
  failed = true;
  console.error(String(/** @type {Error} */ (error).message ?? error));
} finally {
  try {
    // Unlink the shared node_modules FIRST and never recurse into it: a symlink is unlinked, a Windows junction is
    // removed with rmdir (which only ever removes the junction itself, not what it points to).
    const link = join(work, "node_modules");
    try {
      unlinkSync(link);
    } catch {
      try {
        rmdirSync(link);
      } catch {
        /* not there */
      }
    }
    if (!existsSync(link)) rmSync(work, { recursive: true, force: true });
  } catch {
    /* a temp folder that cannot be removed is harmless */
  }
}
process.exit(failed ? 1 : 0);
