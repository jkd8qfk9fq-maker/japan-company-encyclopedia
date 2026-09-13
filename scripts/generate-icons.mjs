/**
 * Generates the PWA icons from one SVG.
 *
 * The mark is the product's core idea drawn as geometry: one node branching
 * into three — a business structure. No lettering, so it needs no font and
 * reads at 48px on a home screen.
 *
 * `sharp` arrives with Next.js; this script adds no dependency. Run it only
 * when the mark changes: `node scripts/generate-icons.mjs`. The PNGs are
 * committed so the build never depends on this script.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const INK = "#161616";
const PAPER = "#FAF8F4";

/** `safe` shrinks the mark into the maskable safe zone (inner 80% circle). */
function markSvg({ size, safe }) {
  const scale = safe ? 0.62 : 0.8;
  const s = size * scale;
  const ox = (size - s) / 2;
  const oy = (size - s) / 2;
  const u = s / 100; // design on a 100-unit grid
  const node = (cx, cy, r) => `<circle cx="${ox + cx * u}" cy="${oy + cy * u}" r="${r * u}" fill="${PAPER}"/>`;
  const line = (x1, y1, x2, y2) =>
    `<path d="M${ox + x1 * u} ${oy + y1 * u} L${ox + x2 * u} ${oy + y2 * u}" stroke="${PAPER}" stroke-width="${3.2 * u}" stroke-linecap="round" fill="none"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${safe ? 0 : size * 0.22}" fill="${INK}"/>
  ${line(50, 30, 50, 52)}
  ${line(18, 52, 82, 52)}
  ${line(18, 52, 18, 72)}
  ${line(50, 52, 50, 72)}
  ${line(82, 52, 82, 72)}
  ${node(50, 24, 11)}
  ${node(18, 78, 8)}
  ${node(50, 78, 8)}
  ${node(82, 78, 8)}
</svg>`;
}

const out = new URL("../public/icons/", import.meta.url);
await mkdir(out, { recursive: true });

const targets = [
  { name: "icon-192.png", size: 192, safe: false },
  { name: "icon-512.png", size: 512, safe: false },
  { name: "icon-maskable-512.png", size: 512, safe: true },
  { name: "apple-touch-icon.png", size: 180, safe: true },
];

for (const { name, size, safe } of targets) {
  const png = await sharp(Buffer.from(markSvg({ size, safe }))).png().toBuffer();
  await writeFile(new URL(name, out), png);
  console.log(`wrote public/icons/${name}`);
}

await writeFile(new URL("icon.svg", out), markSvg({ size: 512, safe: false }));
console.log("wrote public/icons/icon.svg");
