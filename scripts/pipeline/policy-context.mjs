/**
 * The files the policy checks (prose-policy.mjs) read: who is already registered, who the EDINET code list calls
 * listed, and the filing's own text. Kept apart from the pure rules so those stay testable with plain objects.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir } from "../research/edinet.mjs";
import { checkProsePolicy, checkRelatedCompanies, findRelatedCandidates } from "./prose-policy.mjs";

/** Registered companies by id (src/data/companies), reduced to what a link needs. */
export function loadRegistry(root = process.cwd()) {
  const dir = join(root, "src/data/companies");
  const out = new Map();
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const e = JSON.parse(readFileSync(join(dir, f), "utf8"));
    out.set(e.id, { id: e.id, code: e.code, name: e.name, officialName: e.officialName, tier: e.status?.state ?? "published" });
  }
  return out;
}

/** pipeline/listing.tsv (sync-listing.mjs): securities code → { listing, name, industry }. */
export function loadLedger(root = process.cwd()) {
  const path = join(root, "pipeline/listing.tsv");
  const out = new Map();
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const [code, edinetCode, name, industry, listing] = line.split("\t");
    if (code) out.set(code, { edinetCode, name, industry, listing });
  }
  return out;
}

/** The filing's text from the evidence pack: sections.json and the *.txt files. Null when there is no pack. */
export function loadEvidenceText(companyId, cache = cacheDir()) {
  const dir = join(cache, "evidence", companyId);
  if (!existsSync(dir)) return null;
  return readdirSync(dir)
    .filter((f) => f.endsWith(".txt") || f === "sections.json")
    .map((f) => readFileSync(join(dir, f), "utf8"))
    .join("\n");
}

/**
 * All findings for one assembled entry.
 * @param {any} entry
 * @param {{ root?: string, cache?: string }} [options]
 */
export function policyFindings(entry, { root = process.cwd(), cache = cacheDir() } = {}) {
  const registry = loadRegistry(root);
  const ledger = loadLedger(root);
  const evidenceText = loadEvidenceText(entry.id, cache);
  return [...checkProsePolicy(entry), ...checkRelatedCompanies(entry, { registry, ledger, evidenceText })];
}

/**
 * Write evidence/<id>/related-candidates.json: the registered companies whose name is in the filing, with their
 * code, tier and listing status — what the agent would otherwise search thousands of entries for.
 * @returns {{ path: string, count: number } | null}
 */
export function writeRelatedCandidates(companyId, { root = process.cwd(), cache = cacheDir() } = {}) {
  const text = loadEvidenceText(companyId, cache);
  if (text == null) return null;
  const candidates = findRelatedCandidates(text, [...loadRegistry(root).values()], { selfId: companyId, ledger: loadLedger(root) });
  const path = join(cache, "evidence", companyId, "related-candidates.json");
  const body = {
    note: "有報の本文に社名がある掲載済み企業（機械が抽出）。社名の一致だけで関連企業にしない：有報がその相手について述べる取引・提携・資本関係が根拠。listing が「上場」でない相手、ambiguous の相手は特に慎重に。",
    generatedFrom: companyId,
    candidates: candidates.sort((a, b) => b.occurrences - a.occurrences),
  };
  writeFileSync(path, `${JSON.stringify(body, null, 2)}\n`);
  return { path, count: candidates.length };
}
