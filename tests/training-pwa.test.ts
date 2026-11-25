import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/learn/manifest.webmanifest/route";
import { STORAGE_KEYS } from "@/lib/storage/storage";
import { TRAINING_APP_METADATA } from "@/lib/site";

/**
 * 分析訓練 as its own installable app (JCE-108, scoped by JCE-125): its manifest, the iOS meta its pages
 * carry, the training shell in the service worker, and the record keys the installed app must keep reading.
 */

type ManifestIcon = { src: string; sizes: string; purpose?: string };
type Manifest = {
  name: string;
  short_name: string;
  start_url: string;
  scope: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
};

async function trainingManifest(): Promise<Manifest> {
  return (await GET().json()) as Manifest;
}

/** The width and height a PNG declares in its IHDR — the manifest's `sizes` must not promise what is not there. */
function pngSize(path: string): { width: number; height: number } {
  const bytes = readFileSync(path);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("the training app's manifest", () => {
  it("installs as 分析訓練 and opens into the course", async () => {
    const manifest = await trainingManifest();
    expect(manifest.name).toBe("分析訓練（日本企業百科事典）");
    expect(manifest.short_name).toBe("分析訓練");
    expect(manifest.start_url).toBe("/learn");
    expect(manifest.display).toBe("standalone");
  });

  it("scopes the app to the training itself, not the whole encyclopedia (JCE-125)", async () => {
    const manifest = await trainingManifest();
    expect(manifest.scope).toBe("/learn");
  });

  it("matches the splash to the dark UI", async () => {
    const manifest = await trainingManifest();
    expect(manifest.background_color).toBe("#0f1626");
    expect(manifest.theme_color).toBe("#0f1626");
  });

  it("points at training icons that exist at the declared sizes", async () => {
    const manifest = await trainingManifest();
    const bySizes = new Map(manifest.icons.map((icon) => [icon.sizes, icon]));
    for (const sizes of ["192x192", "512x512"]) {
      const icon = bySizes.get(sizes);
      expect(icon, sizes).toBeDefined();
      const path = `public${icon!.src}`;
      expect(existsSync(path), icon!.src).toBe(true);
      const [width, height] = sizes.split("x").map(Number);
      expect(pngSize(path)).toEqual({ width, height });
    }
    const maskable = manifest.icons.find((icon) => icon.purpose === "maskable");
    expect(maskable).toBeDefined();
    expect(existsSync(`public${maskable!.src}`)).toBe(true);
  });
});

describe("the training pages' app metadata", () => {
  it("links the training manifest and carries the Apple capable name as well as the standard one", () => {
    expect(TRAINING_APP_METADATA.manifest).toBe("/learn/manifest.webmanifest");
    expect(TRAINING_APP_METADATA.icons.apple).toBe("/icons/training-apple-touch-icon.png");
    expect(TRAINING_APP_METADATA.other["apple-mobile-web-app-capable"]).toBe("yes");
    expect(existsSync("public/icons/training-apple-touch-icon.png")).toBe(true);
  });

  it("is spread into every page of the training app", () => {
    for (const page of [
      "src/app/learn/page.tsx",
      "src/app/learn/lesson/[lesson-id]/page.tsx",
      "src/app/learn/review/page.tsx",
      "src/app/quiz/page.tsx",
      "src/app/digest/page.tsx",
    ]) {
      expect(readFileSync(page, "utf8"), page).toContain("...TRAINING_APP_METADATA");
    }
  });
});

describe("the service worker's training shell", () => {
  const sw = readFileSync("public/sw.js", "utf8");

  it("pre-caches the training app's start page, manifest and icon", () => {
    const shell = sw.slice(sw.indexOf("const SHELL_URLS"), sw.indexOf("];", sw.indexOf("const SHELL_URLS")));
    expect(shell).toContain('"/learn/"');
    expect(shell).toContain('"/learn/manifest.webmanifest"');
    expect(shell).toContain('"/icons/training-192.png"');
  });

  it("revalidates the training manifest like the site's", () => {
    expect(sw).toContain('url.pathname === "/learn/manifest.webmanifest"');
  });
});

describe("the training record the installed app inherits", () => {
  it("stays in this origin's local storage under the same keys", () => {
    // The installed app is the same origin, so the browser storage the course already writes is the storage
    // the app reads — no key may move, or an existing reader's record would be orphaned.
    expect(STORAGE_KEYS.learnAnswers).toBe("learn-answers");
    expect(STORAGE_KEYS.microProgress).toBe("micro-lesson-progress");
    expect(STORAGE_KEYS.predictions).toBe("company-predictions");
    expect(STORAGE_KEYS.quizAnswers).toBe("quiz-answers");
  });
});
