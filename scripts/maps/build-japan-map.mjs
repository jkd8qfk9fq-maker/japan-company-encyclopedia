/**
 * The prefecture outlines the home page and /prefectures draw, as SVG paths.
 *
 *   node scripts/maps/build-japan-map.mjs --file <ne_10m_admin_1_states_provinces.geojson>
 *
 * Source: Natural Earth, "Admin 1 – States, Provinces" at 1:10m (public domain, no credit required —
 * https://www.naturalearthdata.com/about/terms-of-use/). The 40 MB file is not kept in the repository; download it
 * from https://github.com/nvkelso/natural-earth-vector (geojson/) and pass it here.
 *
 * The drawing is a schematic, not a survey: a plain equirectangular projection corrected for latitude 36°,
 * outlines simplified to about 1 km, islands too small to see at this size dropped, the Okinawa Islands moved into an inset
 * in the Pacific (as Japanese maps usually set Okinawa apart), and Tokyo's Ogasawara and the southern islands left out.
 * Writes src/assets/japan/prefectures.json: the viewBox, the inset frame, and per prefecture its JIS code, its path
 * and the point where a marker sits (the centre of its largest piece).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SCALE = 40; // SVG units per degree of latitude
const COS = Math.cos((36 * Math.PI) / 180);
const WEST = 128.4;
const NORTH = 45.7;
const TOLERANCE = 0.012; // degrees, for Douglas–Peucker
const MIN_AREA = 0.004; // square degrees: smaller islands are dropped (the largest piece is always kept)
// Okinawa: the Okinawa Islands only (Okinawa Island, Kume, Kerama, Iheya — where the prefecture's head offices are),
// moved from around 26.4°N 127.9°E into the empty Pacific south of the Kii peninsula and drawn 1.6 times larger so
// they can be seen and tapped. Miyako, Yaeyama and the Daito islands are too far apart for an inset this size. Natural
// Earth also files the Amami islands and Yoron (Kagoshima) under Okinawa; the box below keeps them out of it.
const OKINAWA = { from: [127.9, 26.4], to: [138.2, 31.6], scale: 1.6, box: { west: 126.5, east: 128.36, north: 27.2 } };

const project = ([lon, lat]) => [(lon - WEST) * COS * SCALE, (NORTH - lat) * SCALE];

function area(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) sum += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  return Math.abs(sum / 2);
}

function centroid(ring) {
  let x = 0;
  let y = 0;
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    x += (ring[j][0] + ring[i][0]) * f;
    y += (ring[j][1] + ring[i][1]) * f;
    a += f;
  }
  return [x / (3 * a), y / (3 * a)];
}

/** A closed ring: its first and last points are the same, so it is simplified as two open halves. */
function simplify(ring, tolerance) {
  const open = ring.slice(0, -1);
  const half = Math.floor(open.length / 2);
  if (half < 2) return ring;
  return [...simplifyLine(open.slice(0, half + 1), tolerance).slice(0, -1), ...simplifyLine([...open.slice(half), open[0]], tolerance)];
}

function simplifyLine(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [start, end] = stack.pop();
    const [ax, ay] = points[start];
    const [bx, by] = points[end];
    const length = Math.hypot(bx - ax, by - ay) || 1e-12;
    let worst = -1;
    let at = -1;
    for (let i = start + 1; i < end; i++) {
      const d = Math.abs((bx - ax) * (ay - points[i][1]) - (ax - points[i][0]) * (by - ay)) / length;
      if (d > worst) {
        worst = d;
        at = i;
      }
    }
    if (worst > tolerance) {
      keep[at] = 1;
      stack.push([start, at], [at, end]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const round = (n) => Math.round(n * 10) / 10;
const path = (rings) =>
  rings.map((ring) => `M${ring.map((p) => project(p).map(round).join(" ")).join("L")}Z`).join("");

function main() {
  const i = process.argv.indexOf("--file");
  if (i < 0) {
    console.error("使い方: --file <ne_10m_admin_1_states_provinces.geojson>");
    process.exit(1);
  }
  const geo = JSON.parse(readFileSync(process.argv[i + 1], "utf8"));
  const features = geo.features.filter((f) => f.properties.adm0_a3 === "JPN");
  if (features.length !== 47) throw new Error(`都道府県が ${features.length} 件（47 件のはず）`);

  const prefectures = features
    .map((f) => {
      const code = f.properties.iso_3166_2.replace("JP-", "");
      const okinawa = code === "47";
      const polygons = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      let rings = polygons
        .map((polygon) => polygon[0])
        // Tokyo reaches 1,000 km south (Izu, Ogasawara): keep the mainland and the islands near it.
        .filter((ring) => code !== "13" || ring.some(([, lat]) => lat > 34.5));
      rings.sort((a, b) => area(b) - area(a));
      rings = rings.filter((ring, k) => k === 0 || area(ring) >= MIN_AREA);
      if (okinawa) {
        rings = rings
          .filter((ring) => ring.every(([lon, lat]) => lon > OKINAWA.box.west && lon < OKINAWA.box.east && lat < OKINAWA.box.north))
          .map((ring) =>
            ring.map(([lon, lat]) => [
              OKINAWA.to[0] + (lon - OKINAWA.from[0]) * OKINAWA.scale,
              OKINAWA.to[1] + (lat - OKINAWA.from[1]) * OKINAWA.scale,
            ]),
          );
      }
      rings = rings.map((ring) => simplify(ring, TOLERANCE)).filter((ring) => ring.length >= 4);
      if (!rings.length) throw new Error(`JP-${code}: 形が残らない`);
      const [cx, cy] = project(centroid(rings[0]));
      return { code, d: path(rings), x: round(cx), y: round(cy) };
    })
    .sort((a, b) => a.code.localeCompare(b.code));

  const xs = [];
  const ys = [];
  for (const p of prefectures) {
    for (const m of p.d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)) {
      xs.push(Number(m[1]));
      ys.push(Number(m[2]));
    }
  }
  const pad = 6;
  const viewBox = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + 2 * pad, Math.max(...ys) - Math.min(...ys) + 2 * pad].map(round);
  const okinawa = prefectures.find((p) => p.code === "47");
  const ox = [...okinawa.d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const inset = {
    x: round(Math.min(...ox.map((p) => p[0])) - 8),
    y: round(Math.min(...ox.map((p) => p[1])) - 8),
    width: round(Math.max(...ox.map((p) => p[0])) - Math.min(...ox.map((p) => p[0])) + 16),
    height: round(Math.max(...ox.map((p) => p[1])) - Math.min(...ox.map((p) => p[1])) + 16),
  };

  const out = join(process.cwd(), "src/assets/japan/prefectures.json");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify({ viewBox: viewBox.join(" "), inset, prefectures })}\n`);
  console.log(`${out} を書いた（${Math.round(readFileSync(out).length / 1024)} KB）`);
}

main();
