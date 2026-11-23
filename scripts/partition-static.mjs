/**
 * Split the static export (./out, from `npm run build:static`) into per-Worker slices so no single Worker
 * version exceeds the Workers Free limit of 20,000 static asset files (JCE-079).
 *
 * Why: the export reached 37,018 files on 2026-11-21 (about 36,300 of them company detail + report pages),
 * so `wrangler deploy` failed with code 10304 and the site stopped updating. The company pages move to
 * shard Workers (nihonkigyohyakka-c1, -c2, ...) that run the same worker/index.ts and are routed the
 * /companies/<prefix>* paths of their slice; everything else stays on the main Worker.
 *
 *   node scripts/partition-static.mjs
 *
 * Reads ./out and src/data (for the released-company set, mirroring src/lib/release.ts), then writes:
 *   out-main/                      the main Worker's slice (everything not sharded)
 *   out-shard-<k>/                 shard k's slice (its companies under companies/, plus a copy of 404.html)
 *   wrangler.generated.main.jsonc  wrangler.jsonc with the assets directory pointed at out-main/
 *   wrangler.generated.shard-<k>.jsonc
 *   .deploy-manifest.json          [{ name, config, files }], shards then main (the workflow deploys main first)
 *
 * The assignment is recomputed from the actual files on every run: companies are grouped into prefix
 * "atoms" (first character; a first character whose files exceed the atom cap is split by its first two
 * characters), atoms are packed greedily into as many shards as the totals require, and the generated
 * configs carry exactly the routes of the atoms they serve — so the routing can never disagree with the
 * slices, and growth rebalances itself. Any slice over the hard limit fails the run instead of shipping
 * a deploy that Cloudflare would reject.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const OUT = join(root, "out");
const COMPANIES_DIR = join(root, "src", "data", "companies");
const NOTED_FILE = join(root, "src", "data", "released-with-notes.json");
const HOST = "kigyo-hyakka.com";

// Sizing knobs (env overridable for tests). The Free plan rejects a Worker version over 20,000 files;
// the hard limit keeps a safety margin, the target leaves room for a shard to grow between rebalances.
const TARGET_FILES = Number(process.env.JCE_SHARD_TARGET_FILES || 17000);
const HARD_LIMIT = Number(process.env.JCE_HARD_LIMIT_FILES || 19500);
const ATOM_MAX_FILES = Number(process.env.JCE_ATOM_MAX_FILES || 6000);

function fail(message) {
  console.error(`partition-static: ${message}`);
  process.exit(1);
}

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    n += entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1;
  }
  return n;
}

// --- The released set, mirroring src/lib/release.ts: published, plus needs-attention listed by JCE-057. ---
if (!existsSync(OUT)) fail("./out がありません。先に `npm run build:static` を実行してください。");
const noted = new Set(JSON.parse(readFileSync(NOTED_FILE, "utf8")).companies ?? []);
const allIds = new Set();
const releasedIds = new Set();
for (const file of readdirSync(COMPANIES_DIR)) {
  if (!file.endsWith(".json")) continue;
  const entry = JSON.parse(readFileSync(join(COMPANIES_DIR, file), "utf8"));
  const id = entry.id || file.replace(/\.json$/, "");
  allIds.add(id);
  const state = entry.status?.state;
  if (state === "published" || (state === "needs-attention" && noted.has(id))) releasedIds.add(id);
}

// --- Assign every entry of out/companies/ to its owning company. ---
const companiesOut = join(OUT, "companies");
if (!existsSync(companiesOut)) fail("./out/companies がありません。静的書き出しが想定と違います。");
/** @type {Map<string, { entries: string[], files: number }>} */
const perCompany = new Map();
for (const name of readdirSync(companiesOut).sort()) {
  // An entry belongs to company <id> when it is named <id> (a directory) or <id>.<something> (payload files).
  const owner = name.includes(".") ? name.split(".")[0] : name;
  if (!allIds.has(owner)) continue; // list page files (index.html, payloads) stay with the main Worker.
  if (!releasedIds.has(owner)) {
    fail(`未公開の企業 ${owner} のファイルが ./out/companies にあります。公開範囲の前提が崩れているため止めます。`);
  }
  const path = join(companiesOut, name);
  const files = statSync(path).isDirectory() ? countFiles(path) : 1;
  const slot = perCompany.get(owner) ?? { entries: [], files: 0 };
  slot.entries.push(name);
  slot.files += files;
  perCompany.set(owner, slot);
}
if (perCompany.size === 0) fail("./out/companies に企業ページが見つかりません。");

// --- Atoms: first character, split by the first two when one character alone is too heavy. ---
/** @type {Map<string, { companies: string[], files: number }>} */
const atoms = new Map();
const addToAtom = (atom, id, files) => {
  const slot = atoms.get(atom) ?? { companies: [], files: 0 };
  slot.companies.push(id);
  slot.files += files;
  atoms.set(atom, slot);
};
const byFirstChar = new Map();
for (const [id, slot] of perCompany) {
  const first = id[0];
  const group = byFirstChar.get(first) ?? { companies: [], files: 0 };
  group.companies.push(id);
  group.files += slot.files;
  byFirstChar.set(first, group);
}
for (const [first, group] of byFirstChar) {
  if (group.files <= ATOM_MAX_FILES) {
    for (const id of group.companies) addToAtom(first, id, perCompany.get(id).files);
  } else {
    for (const id of group.companies) addToAtom(id.slice(0, 2), id, perCompany.get(id).files);
  }
}

// --- Pack atoms into shards, heaviest first onto the lightest shard. ---
const totalCompanyFiles = [...perCompany.values()].reduce((sum, s) => sum + s.files, 0);
const shardCount = Math.max(2, Math.ceil(totalCompanyFiles / TARGET_FILES));
const shards = Array.from({ length: shardCount }, () => ({ atoms: [], files: 0 }));
for (const [atom, slot] of [...atoms.entries()].sort((a, b) => b[1].files - a[1].files)) {
  const lightest = shards.reduce((a, b) => (a.files <= b.files ? a : b));
  lightest.atoms.push(atom);
  lightest.files += slot.files;
}
const shardOfCompany = new Map();
shards.forEach((shard, k) => {
  for (const atom of shard.atoms) for (const id of atoms.get(atom).companies) shardOfCompany.set(id, k);
});

// --- Build the slices: out-main starts as a full copy, company entries move out to their shard. ---
for (let k = 0; k < shardCount; k++) rmSync(join(root, `out-shard-${k + 1}`), { recursive: true, force: true });
rmSync(join(root, "out-main"), { recursive: true, force: true });
rmSync(join(root, ".deploy-manifest.json"), { force: true });
for (let k = 0; k <= shardCount; k++) {
  rmSync(join(root, k === 0 ? "wrangler.generated.main.jsonc" : `wrangler.generated.shard-${k}.jsonc`), { force: true });
}
cpSync(OUT, join(root, "out-main"), { recursive: true });
shards.forEach((shard, k) => {
  const sliceCompanies = join(root, `out-shard-${k + 1}`, "companies");
  mkdirSync(sliceCompanies, { recursive: true });
  for (const atom of shard.atoms) {
    for (const id of atoms.get(atom).companies) {
      for (const name of perCompany.get(id).entries) {
        renameSync(join(root, "out-main", "companies", name), join(sliceCompanies, name));
      }
    }
  }
  // not_found_handling: "404-page" needs a 404.html inside the slice itself.
  const notFound = join(OUT, "404.html");
  if (existsSync(notFound)) cpSync(notFound, join(root, `out-shard-${k + 1}`, "404.html"));
});

// --- Generated wrangler configs: the main one is the real config with only the assets directory moved. ---
const mainConfigText = readFileSync(join(root, "wrangler.jsonc"), "utf8");
if (!mainConfigText.includes('"directory": "./out"')) fail('wrangler.jsonc に assets の "directory": "./out" が見つかりません。');
writeFileSync(
  join(root, "wrangler.generated.main.jsonc"),
  mainConfigText.replace('"directory": "./out"', '"directory": "./out-main"'),
);
const compatDate = mainConfigText.match(/"compatibility_date":\s*"([^"]+)"/)?.[1] ?? "2026-10-01";
shards.forEach((shard, k) => {
  const routes = shard.atoms
    .slice()
    .sort()
    .map((atom) => `    { "pattern": "${HOST}/companies/${atom}*", "zone_name": "${HOST}" }`)
    .join(",\n");
  writeFileSync(
    join(root, `wrangler.generated.shard-${k + 1}.jsonc`),
    `{
  // GENERATED by scripts/partition-static.mjs (JCE-079) — do not edit, do not commit.
  // Company-page shard ${k + 1}: the same Worker script as the main site, serving only this slice's
  // companies. No custom domain and no cron triggers (notifications stay single, on the main Worker);
  // no D1 binding either — /api/* never routes here, and the script treats a missing PUSH_DB as off.
  "name": "nihonkigyohyakka-c${k + 1}",
  "compatibility_date": "${compatDate}",
  "main": "worker/index.ts",
  "routes": [
${routes}
  ],
  "assets": {
    "directory": "./out-shard-${k + 1}",
    "binding": "ASSETS",
    "not_found_handling": "404-page",
    "run_worker_first": ["/*", "!/_next/*"]
  }
}
`,
  );
});

// --- Verify the slices and write the deploy manifest (shards, then main; the workflow deploys main first). ---
const manifest = [];
let accounted = 0;
shards.forEach((shard, k) => {
  const files = countFiles(join(root, `out-shard-${k + 1}`));
  accounted += files;
  manifest.push({ name: `nihonkigyohyakka-c${k + 1}`, config: `wrangler.generated.shard-${k + 1}.jsonc`, files });
});
const mainFiles = countFiles(join(root, "out-main"));
accounted += mainFiles;
manifest.push({ name: "nihonkigyohyakka", config: "wrangler.generated.main.jsonc", files: mainFiles });
const totalFiles = countFiles(OUT);
const shardCopies = shardCount; // one extra 404.html copy per shard slice
if (accounted !== totalFiles + shardCopies) {
  fail(`ファイル数の照合に失敗しました (slices ${accounted} != ./out ${totalFiles} + 404 copies ${shardCopies})。`);
}
for (const entry of manifest) {
  if (entry.files > HARD_LIMIT) {
    fail(`${entry.name} のファイル数が ${entry.files} で上限 ${HARD_LIMIT} を超えています。JCE_SHARD_TARGET_FILES を下げて分割数を増やしてください。`);
  }
}
writeFileSync(join(root, ".deploy-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`partition-static: ./out ${totalFiles} files →`);
for (const entry of manifest) console.log(`  ${entry.name}: ${entry.files} files (${entry.config})`);
