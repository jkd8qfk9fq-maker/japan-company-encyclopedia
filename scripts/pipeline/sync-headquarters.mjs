/**
 * Where each registered company has its head office (本店所在地), from the EDINET code list.
 *
 *   node scripts/pipeline/sync-headquarters.mjs --file <Edinetcode.zip | EdinetcodeDlInfo.csv> --downloaded <YYYY-MM-DD> [--write]
 *
 * The code list's 所在地 column is the address the filer registered with EDINET. It almost never names the
 * prefecture (「港区芝浦…」「大阪市中央区…」「前橋市古市町…」), so the prefecture is looked up from the municipality
 * that opens the address, in 総務省's table of local governments (pipeline/municipalities.tsv):
 *  - a name that exists in one prefecture only (前橋市, 大阪市, the 23 wards of Tokyo — a designated city's wards
 *    are always written after the city) gives that prefecture;
 *  - a name that exists in several (府中市 is in Tokyo and Hiroshima, 伊達市 in Hokkaido and Fukushima) gives one
 *    only when the address also names the prefecture; otherwise the company is left out, never guessed;
 *  - an address abroad, or one that opens with neither (「赤坂3-16-11…」), is left out too.
 * Only the prefecture and the municipality are kept, not the street address: that is all the map and the
 * prefecture pages show.
 *
 * Terms: EDINET content is used under 公共データ利用規約 (PDL 1.0) — the source is named and the result is marked
 * as edited by this encyclopedia (the map's caption and /about). Downloading the list stays the operator's step, as in
 * sync-listing.mjs: this script only reads the file it is given.
 *
 * What it writes (with --write): src/data/headquarters.json only. Without --write it reports what it would write and
 * which companies it could not place, and why.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsvLine, readCodeListFile } from "./sync-listing.mjs";

// The 47 by name: a pattern like 「..県」 would read 「長野市県町」 as a prefecture.
const PREFECTURE = new RegExp(`^(${"北海道|青森県|岩手県|宮城県|秋田県|山形県|福島県|茨城県|栃木県|群馬県|埼玉県|千葉県|東京都|神奈川県|新潟県|富山県|石川県|福井県|山梨県|長野県|岐阜県|静岡県|愛知県|三重県|滋賀県|京都府|大阪府|兵庫県|奈良県|和歌山県|鳥取県|島根県|岡山県|広島県|山口県|徳島県|香川県|愛媛県|高知県|福岡県|佐賀県|長崎県|熊本県|大分県|宮崎県|鹿児島県|沖縄県"})`);

/** 総務省's table: municipality name → the prefectures that have one by that name. */
export function readMunicipalities(/** @type {string} */ path) {
  /** @type {Map<string, Set<string>>} */
  const byName = new Map();
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const [, prefecture, name] = line.split("\t");
    if (!byName.has(name)) byName.set(name, new Set());
    byName.get(name).add(prefecture);
  }
  return byName;
}

/**
 * The prefecture and municipality an address opens with, or the reason there is none.
 * @param {string} address
 * @param {Map<string, Set<string>>} municipalities
 * @returns {{ prefecture: string, municipality: string } | { reason: string }}
 */
export function placeAddress(address, municipalities) {
  let rest = address.normalize("NFKC").replace(/^[\s、,]+/, "");
  const named = rest.match(PREFECTURE)?.[1];
  if (named) rest = rest.slice(named.length);
  const opening = (/** @type {string} */ text) => {
    for (let length = Math.min(text.length, 10); length >= 2; length--) {
      const head = text.slice(0, length);
      if (/[市区町村]$/.test(head) && municipalities.has(head)) return head;
    }
    return "";
  };
  // 「北葛城郡王寺町」: the table lists towns and villages without their district. Tried only when the address does
  // not already open with a municipality, so 「大和郡山市」 is not cut at its 郡.
  const found = opening(rest) || opening(rest.replace(/^[^\s市区町村]{1,5}郡/, ""));
  if (!found) return { reason: named ? `${named}の後に市区町村名が読めない` : "市区町村名で始まっていない（海外の所在地を含む）" };
  const candidates = municipalities.get(found);
  if (named) {
    return candidates.has(named) ? { prefecture: named, municipality: found } : { reason: `${found}は${named}に無い` };
  }
  if (candidates.size !== 1) return { reason: `${found}は複数の都道府県にある（${[...candidates].join("・")}）` };
  return { prefecture: [...candidates][0], municipality: found };
}

function main() {
  const args = process.argv.slice(2);
  const value = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const file = value("--file");
  const downloaded = value("--downloaded");
  if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(downloaded ?? "")) {
    console.error("使い方: --file <Edinetcode.zip> --downloaded <YYYY-MM-DD> [--write]");
    process.exit(1);
  }
  const root = process.cwd();
  const municipalities = readMunicipalities(join(root, "pipeline/municipalities.tsv"));

  const lines = readCodeListFile(file).split(/\r?\n/);
  const header = parseCsvLine(lines[1]);
  const col = (name) => {
    const i = header.indexOf(name);
    if (i < 0) throw new Error(`コードリストに「${name}」の列が無い`);
    return i;
  };
  const [edinetCol, addressCol, codeCol, listedCol] = [col("ＥＤＩＮＥＴコード"), col("所在地"), col("証券コード"), col("上場区分")];
  /** @type {Map<string, string>} EDINET code → address */
  const addressByEdinet = new Map();
  /** @type {Map<string, string>} securities code (4 characters) → address, listed filers only */
  const addressByCode = new Map();
  for (const line of lines.slice(2)) {
    if (!line) continue;
    const row = parseCsvLine(line);
    addressByEdinet.set(row[edinetCol], row[addressCol]);
    if (row[listedCol] === "上場" && row[codeCol]) addressByCode.set(row[codeCol].slice(0, 4), row[addressCol]);
  }
  // The entry's own EDINET code first (pipeline/listing.tsv ties it to the entry, and a filer keeps it after it
  // delists); the securities code of a listed filer when the ledger has no row for the entry.
  /** @type {Map<string, string>} entry id → EDINET code */
  const edinetById = new Map();
  for (const line of readFileSync(join(root, "pipeline/listing.tsv"), "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const cells = line.split("\t");
    if (cells[7]) edinetById.set(cells[7], cells[1]);
  }

  const index = readFileSync(join(root, "src/data/companies/index.ts"), "utf8");
  const ids = [...index.matchAll(/from "\.\/([a-z0-9-]+)\.json"/g)].map((m) => m[1]);
  /** @type {Record<string, { prefecture: string, municipality: string }>} */
  const companies = {};
  const missing = [];
  for (const id of ids) {
    const { code } = JSON.parse(readFileSync(join(root, "src/data/companies", `${id}.json`), "utf8"));
    const address = addressByEdinet.get(edinetById.get(id) ?? "") ?? addressByCode.get(code);
    if (!address) {
      missing.push(`${id}\t${code}\tコードリストに無い`);
      continue;
    }
    const placed = placeAddress(address, municipalities);
    if ("reason" in placed) missing.push(`${id}\t${code}\t${placed.reason}`);
    else companies[id] = placed;
  }

  console.log(`登録企業 ${ids.length} 社のうち、本社の都道府県が決まった ${Object.keys(companies).length} 社、決まらない ${missing.length} 社`);
  for (const line of missing) console.log(`  ${line}`);
  if (!args.includes("--write")) return;
  const out = {
    source: {
      title: "EDINETコードリスト",
      publisher: "金融庁",
      url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/codelist/Edinetcode.zip",
      downloadedAt: downloaded,
    },
    companies: Object.fromEntries(Object.entries(companies).sort(([a], [b]) => a.localeCompare(b))),
  };
  writeFileSync(join(root, "src/data/headquarters.json"), `${JSON.stringify(out, null, 2)}\n`);
  console.log("src/data/headquarters.json を書いた。コミットは人が行うこと");
}

if (import.meta.url === `file://${process.argv[1]}`) main();
