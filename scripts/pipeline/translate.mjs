/**
 * Reference translations of entry text into English (JCE-128).
 *
 *   node scripts/pipeline/translate.mjs --kind company --fields description,businesses [--status published] [--limit 100] [--concurrency 4] [--only <id,id>] [--dry-run]
 *   node scripts/pipeline/translate.mjs --kind industry
 *   node scripts/pipeline/translate.mjs --kind term
 *
 * For each entry, the Japanese texts with no stored translation are sent in batches to `claude -p` (the operator's
 * own Claude Code login, as in ai-executor.mjs; no key is handled here). What comes back is kept only if it passes
 * checkTranslation (src/lib/translation-check.ts): the same figures, the same links, every Latin-script name kept.
 * A text that fails is retried once with the problems named, then left untranslated — the page shows the Japanese.
 *
 * Files: src/data/translations/en/{companies,industries,terms}/<id>.json, keyed by hashText(japanese). Keys no longer matching a text of
 * the entry are dropped on each run. Nothing here edits an entry.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkTranslation, hashText } from "../../src/lib/translation-check.ts";
import { translatableStrings } from "../../src/lib/translatable.ts";
import { classifyExecutorFailure, cleanEnv } from "./ai-executor.mjs";

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const kind = flag("kind", "company");
const fields = flag("fields")?.split(",") ?? null;
const statusFilter = flag("status");
const limit = Number(flag("limit", "100000"));
const concurrency = Number(flag("concurrency", "4"));
const only = flag("only")?.split(",") ?? null;
const model = flag("model", "sonnet");
const dryRun = args.includes("--dry-run");
const BATCH_CHARS = 5000;
const BATCH_ITEMS = 60;
const MODEL_LABEL = `claude-${model}`;
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });

const DATA = { company: "src/data/companies", industry: "src/data/industries", term: "src/data/terms" }[kind];
if (!DATA) throw new Error(`unknown --kind ${kind}`);
const outDir = join("src/data/translations/en", { company: "companies", industry: "industries", term: "terms" }[kind]);

const RULES = `You translate Japanese text from a Japanese encyclopedia of listed companies into English for readers who do not read Japanese. The text was written from each company's annual securities report (有価証券報告書). The English is shown as a labelled reference translation beside the original.

Rules — a translation that breaks one is discarded:
1. Translate faithfully. Add nothing (no explanation, background, judgment or praise) and leave nothing out.
2. Keep every figure. Write numbers in digits, never words. Amounts: convert units exactly (450,760百万円 → ¥450,760 million; 2,517億71百万円 → ¥251,771 million; 1,234億円 → ¥123.4 billion; 3兆円 → ¥3 trillion). Fiscal periods: 2026年3月期 → the fiscal year ended March 2026. Do not add a number the Japanese does not have (no "No. 1" unless it says 1位, no years it does not give).
3. Keep link markup exactly: [[company:toyota|トヨタ自動車]] → [[company:toyota|Toyota Motor]]. Only the label after | is translated; the kind and id never change, and no link is added or removed.
4. Keep every word written in Latin letters exactly as written (Zoff, iPhone, DX, BPO).
5. Proper names: use the English name given in the glossary when there is one; otherwise use the official romanized or English form if you are sure of it, else Hepburn romanization. Never leave Japanese characters.
6. Plain, neutral encyclopedia English. Short labels (a business segment name such as ライフケア事業) become short labels ("Life Care Business").

Answer with JSON only, no prose and no code fence: {"items":[{"k":"<key>","en":"<translation>"}]} with one item per input item, same keys.`;

function loadEntries() {
  const files = readdirSync(DATA).filter((f) => f.endsWith(".json"));
  const entries = [];
  for (const f of files) {
    const entry = JSON.parse(readFileSync(join(DATA, f), "utf8"));
    if (!entry.id) continue;
    if (only && !only.includes(entry.id)) continue;
    if (statusFilter && entry.status?.state !== statusFilter) continue;
    entries.push(entry);
  }
  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

function loadFile(id) {
  const path = join(outDir, `${id}.json`);
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  return { subject: { kind, id }, locale: "en", method: "ai-reference-translation", model: MODEL_LABEL, updatedAt: today, entries: {} };
}

function saveFile(entry, file) {
  // Only keys that still match a text of the entry: an edited Japanese text takes its old translation with it.
  const live = new Set(translatableStrings(entry).map(hashText));
  const entries = Object.fromEntries(Object.entries(file.entries).filter(([k]) => live.has(k)).sort(([a], [b]) => a.localeCompare(b)));
  if (Object.keys(entries).length === 0) return;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${entry.id}.json`), `${JSON.stringify({ ...file, model: MODEL_LABEL, updatedAt: today, entries }, null, 2)}\n`);
}

// English names the filings give (EDINET's 英語名), for the entry itself and every company its text links to.
const englishNames = new Map(
  readdirSync("src/data/companies")
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join("src/data/companies", f), "utf8")))
    .filter((c) => c.nameEn)
    .map((c) => [c.id, { name: c.name, nameEn: c.nameEn }]),
);
function glossary(entry) {
  const ids = new Set(kind === "company" ? [entry.id] : []);
  for (const m of JSON.stringify(entry).matchAll(/\[\[company:([a-z0-9-]+)\|/g)) ids.add(m[1]);
  return [...ids].flatMap((id) => {
    const n = englishNames.get(id);
    return n ? [`${n.name} = ${n.nameEn}`] : [];
  });
}

function callClaude(prompt) {
  return new Promise((resolve) => {
    const child = spawn(
      "claude",
      ["-p", prompt, "--model", model, "--output-format", "json", "--no-session-persistence", "--strict-mcp-config", "--disable-slash-commands", "--tools", "", "--max-budget-usd", "1"],
      { stdio: ["ignore", "pipe", "pipe"], env: cleanEnv(process.env) },
    );
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => resolve({ ok: false, kind: "auth", text: String(e) }));
    child.on("close", (code) => {
      let parsed = null;
      try {
        parsed = JSON.parse(out);
      } catch {
        /* classified below */
      }
      const text = String(parsed?.result ?? out) + (err ? `\n${err}` : "");
      if (parsed && parsed.is_error !== true && code === 0) resolve({ ok: true, text: String(parsed.result ?? ""), cost: parsed.total_cost_usd ?? 0 });
      else resolve({ ok: false, kind: classifyExecutorFailure(text), text: text.slice(0, 500) });
    });
  });
}

function parseItems(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) return [];
  try {
    const items = JSON.parse(text.slice(start, end + 1)).items;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

/** @param {{k:string, ja:string, problems?:string[]}[]} items */
async function translateBatch(items, names) {
  const input = items.map((i) => ({ k: i.k, ja: i.ja, ...(i.problems ? { previous_attempt_rejected_because: i.problems } : {}) }));
  const prompt = `${RULES}\n\nGlossary:\n${names.length ? names.join("\n") : "(none)"}\n\nInput:\n${JSON.stringify({ items: input })}`;
  const r = await callClaude(prompt);
  if (!r.ok) return { ok: false, kind: r.kind, text: r.text, results: new Map() };
  return { ok: true, cost: r.cost, results: new Map(parseItems(r.text).map((i) => [String(i.k), String(i.en ?? "")])) };
}

function batches(items) {
  const out = [];
  let cur = [];
  let size = 0;
  for (const item of items) {
    if (cur.length > 0 && (size + item.ja.length > BATCH_CHARS || cur.length >= BATCH_ITEMS)) {
      out.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(item);
    size += item.ja.length;
  }
  if (cur.length) out.push(cur);
  return out;
}

const entries = loadEntries().slice(0, limit);
const byId = new Map(entries.map((e) => [e.id, e]));
const files = new Map();
const stats = { entries: 0, texts: 0, stored: 0, rejected: 0, cost: 0 };
let stop = null;

// Texts are batched across entries: a one-line description per company would otherwise be one call per company.
/** @type {{id:string, k:string, ja:string, problems?:string[]}[]} */
let todo = [];
for (const entry of entries) {
  const file = loadFile(entry.id);
  files.set(entry.id, file);
  const pending = translatableStrings(entry, fields ?? undefined)
    .map((ja) => ({ id: entry.id, k: hashText(ja), ja }))
    .filter((i) => !file.entries[i.k] || checkTranslation(i.ja, file.entries[i.k]).length > 0);
  if (pending.length === 0) continue;
  stats.entries++;
  stats.texts += pending.length;
  todo.push(...pending);
}

async function runBatch(batch, retry) {
  const ids = [...new Set(batch.map((i) => i.id))];
  const names = [...new Set(ids.flatMap((id) => glossary(byId.get(id))))];
  const r = await translateBatch(batch.map((i) => ({ k: `${i.id}/${i.k}`, ja: i.ja, problems: i.problems })), names);
  if (!r.ok) {
    if (r.kind === "rate-limit" || r.kind === "auth" || r.kind === "budget") stop = `${r.kind}: ${r.text}`;
    retry.push(...batch);
    return;
  }
  stats.cost += r.cost ?? 0;
  for (const item of batch) {
    const en = (r.results.get(`${item.id}/${item.k}`) ?? "").trim();
    const problems = checkTranslation(item.ja, en);
    if (problems.length === 0) {
      files.get(item.id).entries[item.k] = en;
      stats.stored++;
    } else retry.push({ ...item, problems });
  }
  // Saved as it goes, so a stopped run keeps what it paid for.
  for (const id of ids) saveFile(byId.get(id), files.get(id));
}

if (!dryRun) {
  for (let attempt = 0; attempt < 2 && todo.length > 0 && !stop; attempt++) {
    const queue = batches(todo);
    const retry = [];
    let done = 0;
    const total = queue.length;
    await Promise.all(
      Array.from({ length: concurrency }, async () => {
        while (queue.length > 0 && !stop) {
          await runBatch(queue.shift(), retry);
          done++;
          if (done % 20 === 0) console.log(`pass ${attempt + 1}: ${done}/${total} batches — stored ${stats.stored}, $${stats.cost.toFixed(2)}`);
        }
      }),
    );
    if (stop) retry.push(...queue.flat());
    todo = retry;
  }
  stats.rejected = todo.length;
  for (const item of todo.filter((i) => i.problems).slice(0, 10)) console.log(`  ✗ ${item.id}: ${item.problems.join(" / ")} — ${item.ja.slice(0, 40)}`);
}
console.log(
  `${dryRun ? "[dry run] " : ""}${kind}: ${stats.entries} entries with ${stats.texts} texts to translate` +
    (dryRun ? "" : ` — stored ${stats.stored}, left in Japanese ${stats.rejected}, $${stats.cost.toFixed(2)}`),
);
if (stop) {
  console.error(`stopped: ${stop}`);
  process.exit(2);
}
