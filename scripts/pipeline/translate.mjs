/**
 * Reference translations of entry text into English (JCE-128; token savings JCE-129).
 *
 *   node scripts/pipeline/translate.mjs --kind company --fields description,businesses [--status published] [--limit 100] [--concurrency 4] [--only <id,id>] [--model haiku] [--retry-model sonnet] [--dry-run]
 *   node scripts/pipeline/translate.mjs --kind industry
 *   node scripts/pipeline/translate.mjs --kind term
 *   node scripts/pipeline/translate.mjs --kind feature
 *
 * For each entry, the Japanese texts with no stored translation are sent in batches to `claude -p` (the operator's
 * own Claude Code login, as in ai-executor.mjs; no key is handled here). What comes back is kept only if it passes
 * checkTranslation (src/lib/translation-check.ts): the same figures, the same links, every Latin-script name kept.
 * A text that fails is retried once, on --retry-model, with the problems named, then left untranslated — the page
 * shows the Japanese.
 *
 * Nothing is paid for twice (JCE-129):
 * - A text is sent as its sentences and comes back sentence by sentence, so the card's first sentence — a text of
 *   its own, looked up on its own — is the first English sentence, not a second call.
 * - A text already translated anywhere (another company's identical segment label) is reused, unless its English
 *   names the company it was written for.
 * - The rules go in the system prompt, which the API caches across calls; the cheap model goes first and only what
 *   it fails is sent to the stronger one. The checks are the same for both.
 *
 * Files: src/data/translations/en/{companies,industries,terms,features}/<id>.json, keyed by hashText(japanese). Keys no longer
 * matching a text of the entry are dropped on each run. Nothing here edits an entry.
 *
 * A feature is built, not stored (JCE-074), so `--kind feature` resolves its subjects by importing the built
 * articles (JCE-148): the module hooks in src-alias-hooks.mjs give this process the app's `@/` alias and bare
 * JSON imports. A feature's texts are its reader-facing fields only (FEATURE_TRANSLATION_FIELDS) — the same set
 * the repository shows — and because the key is the text's hash, a figure that changes with the data takes its
 * old translation out of use on its own (JCE-128).
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { register } from "node:module";
import { join } from "node:path";
import { sentences } from "../../src/lib/rich-text.ts";
import { checkTranslation, figuresAmbiguous, hashText } from "../../src/lib/translation-check.ts";
import { FEATURE_TRANSLATION_FIELDS, translatableStrings } from "../../src/lib/translatable.ts";
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
const firstModel = flag("model", "haiku");
const retryModel = flag("retry-model", "sonnet");
const dryRun = args.includes("--dry-run");
const BATCH_CHARS = 6000;
const BATCH_ITEMS = 80;
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });

const FOLDERS = { company: "companies", industry: "industries", term: "terms", feature: "features" };
const DATA = { company: "src/data/companies", industry: "src/data/industries", term: "src/data/terms" }[kind];
if (kind !== "feature" && !DATA) throw new Error(`unknown --kind ${kind}`);
const TRANSLATIONS = "src/data/translations/en";
const outDir = join(TRANSLATIONS, FOLDERS[kind]);
/** The texts of one subject of this kind: a feature's are its reader-facing fields, every other kind's are all of it (or the --fields subset). */
const stringsOf = (entry, fieldsArg) =>
  kind === "feature" ? translatableStrings(entry, FEATURE_TRANSLATION_FIELDS) : translatableStrings(entry, fieldsArg ?? undefined);
/** The same, keyed by the kind of the subject a stored file belongs to (the translation memory reads every kind's files). */
const memoryStringsOf = (subjectKind, entry) =>
  subjectKind === "feature" ? translatableStrings(entry, FEATURE_TRANSLATION_FIELDS) : translatableStrings(entry);

const RULES = `You translate Japanese text from a Japanese encyclopedia of listed companies into English for readers who do not read Japanese. The text was written from each company's annual securities report (有価証券報告書). The English is shown as a labelled reference translation beside the original.

Rules — a translation that breaks one is discarded:
1. Translate faithfully. Add nothing (no explanation, background, judgment or praise) and leave nothing out. Where the Japanese leaves the subject unsaid or writes 同社/当社, write "the company" or "it" — never a name the sentence does not contain.
2. Keep every figure. Write numbers in digits, never words. Amounts: convert units exactly (450,760百万円 → ¥450,760 million; 2,517億71百万円 → ¥251,771 million; 1,234億円 → ¥123.4 billion; 3兆円 → ¥3 trillion). Fiscal periods: 2026年3月期 → the fiscal year ended March 2026. Do not add a number the Japanese does not have (no "No. 1" unless it says 1位, no years it does not give).
3. Keep link markup exactly: [[company:toyota|トヨタ自動車]] → [[company:toyota|Toyota Motor]]. Only the label after | is translated; the kind and id never change, and no link is added or removed.
4. Keep every word written in Latin letters exactly as written (Zoff, iPhone, DX, BPO).
5. Proper names: use the English name given in the glossary when there is one; otherwise use the official romanized or English form if you are sure of it, else Hepburn romanization. Never leave Japanese characters.
6. Plain, neutral encyclopedia English. Short labels (a business segment name such as ライフケア事業) become short labels ("Life Care Business").

Each input item's "ja" is a list of the sentences of one text. Answer with JSON only, no prose and no code fence: {"items":[{"k":"<key>","en":["<sentence 1>","<sentence 2>"]}]} — one item per input item, same keys, one English sentence per Japanese sentence, in order.`;

function loadEntries(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")))
    .filter((e) => e.id);
}

const companies = new Map(loadEntries("src/data/companies").map((e) => [e.id, e]));
// A feature's subjects are the built articles: importing them needs the app's module resolution (JCE-148).
let subjects;
if (kind === "feature") {
  register("./src-alias-hooks.mjs", import.meta.url);
  subjects = (await import("../../src/data/features/index.ts")).features;
} else {
  subjects = kind === "company" ? [...companies.values()] : loadEntries(DATA);
}
const entries = subjects
  .filter((e) => (!only || only.includes(e.id)) && (!statusFilter || e.status?.state === statusFilter))
  .sort((a, b) => a.id.localeCompare(b.id))
  .slice(0, limit);
const byId = new Map(entries.map((e) => [e.id, e]));

function loadFile(id) {
  const path = join(outDir, `${id}.json`);
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  return { subject: { kind, id }, locale: "en", method: "ai-reference-translation", model: `claude-${firstModel}`, updatedAt: today, entries: {} };
}

function saveFile(entry, file) {
  // Only keys that still match a text of the entry: an edited Japanese text takes its old translation with it.
  const live = new Set(stringsOf(entry).map(hashText));
  const kept = Object.fromEntries(Object.entries(file.entries).filter(([k]) => live.has(k)).sort(([a], [b]) => a.localeCompare(b)));
  if (Object.keys(kept).length === 0) return;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${entry.id}.json`), `${JSON.stringify({ ...file, updatedAt: today, entries: kept }, null, 2)}\n`);
}

// English names the filings give (EDINET's 英語名), for the entry itself and every company its text links to.
function glossary(entry) {
  const ids = new Set(kind === "company" ? [entry.id] : []);
  for (const m of JSON.stringify(entry).matchAll(/\[\[company:([a-z0-9-]+)\|/g)) ids.add(m[1]);
  return [...ids].flatMap((id) => {
    const c = companies.get(id);
    return c?.nameEn ? [`${c.name} = ${c.nameEn}`] : [];
  });
}

/** The distinctive words of a company's English name ("HOYA", "Toyota") — a reused text must not carry them elsewhere. */
const GENERIC = new Set(["co", "ltd", "inc", "corporation", "corp", "company", "holdings", "group", "the", "and", "of", "japan", "kabushiki", "kaisha"]);
function nameWords(id) {
  const c = companies.get(id);
  if (!c?.nameEn) return [];
  return [...String(c.nameEn).matchAll(/[A-Za-z][A-Za-z0-9&'-]{2,}/g)].map((m) => m[0]).filter((w) => !GENERIC.has(w.toLowerCase()));
}

// Translation memory: every stored translation of every kind, by its Japanese text, with the entry it was made for.
/** @type {Map<string, {en: string, from: string}>} */
const memory = new Map();
const files = new Map();
for (const [k, folder] of Object.entries(FOLDERS)) {
  const dir = join(TRANSLATIONS, folder);
  if (!existsSync(dir)) continue;
  const subjects = k === kind ? byId : null;
  for (const f of readdirSync(dir).filter((n) => n.endsWith(".json"))) {
    const file = JSON.parse(readFileSync(join(dir, f), "utf8"));
    if (subjects?.has(file.subject.id)) files.set(file.subject.id, file);
    const subject = k === "company" ? companies.get(file.subject.id) : subjects?.get(file.subject.id);
    if (!subject) continue;
    for (const ja of memoryStringsOf(k, subject)) {
      const en = file.entries[hashText(ja)];
      if (en && !memory.has(ja)) memory.set(ja, { en, from: k === "company" ? file.subject.id : "" });
    }
  }
}
for (const e of entries) if (!files.has(e.id)) files.set(e.id, loadFile(e.id));

/** A stored translation of `ja` usable for entry `id`, or null. */
function recall(ja, id) {
  const hit = memory.get(ja);
  if (!hit) return null;
  if (hit.from && hit.from !== id && nameWords(hit.from).some((w) => hit.en.includes(w) && !ja.includes(w))) return null;
  return checkTranslation(ja, hit.en).length === 0 ? hit.en : null;
}

const stats = { entries: 0, texts: 0, reused: 0, derived: 0, sentChars: 0, stored: 0, rejected: 0, cost: 0 };
let stop = null;

/** @type {{id:string, k:string, ja:string, problems?:string[]}[]} */
let todo = [];
for (const entry of entries) {
  const file = files.get(entry.id);
  const pending = stringsOf(entry, fields)
    .map((ja) => ({ id: entry.id, k: hashText(ja), ja }))
    .filter((i) => !file.entries[i.k] || checkTranslation(i.ja, file.entries[i.k]).length > 0)
    // A text whose amounts the checker folds differently from a reader is never sent: a translation that passed would
    // state a wrong amount (JCE-132). It stays in Japanese, and costs nothing.
    .filter((i) => !figuresAmbiguous(i.ja));
  if (pending.length === 0) continue;
  stats.entries++;
  stats.texts += pending.length;
  todo.push(...pending);
}

function store(item, en) {
  stats.stored++;
  if (dryRun) return;
  files.get(item.id).entries[item.k] = en;
  memory.set(item.ja, { en, from: kind === "company" ? item.id : "" });
}

/** Resolves what needs no call: a text translated before, or a first sentence of a text translated in this run. */
function resolveFromMemory(items, sentencePairs) {
  const rest = [];
  const touched = new Set();
  for (const item of items) {
    let en = recall(item.ja, item.id);
    if (en) stats.reused++;
    else {
      const pair = sentencePairs.get(`${item.id}\u0000${item.ja}`);
      if (pair && checkTranslation(item.ja, pair).length === 0) {
        en = pair;
        stats.derived++;
      }
    }
    if (en) {
      store(item, en);
      touched.add(item.id);
    } else rest.push(item);
  }
  if (!dryRun) for (const id of touched) saveFile(byId.get(id), files.get(id));
  return rest;
}

function callClaude(prompt, model) {
  return new Promise((resolve) => {
    const child = spawn(
      "claude",
      ["-p", prompt, "--model", model, "--system-prompt", RULES, "--output-format", "json", "--no-session-persistence", "--strict-mcp-config", "--disable-slash-commands", "--tools", "", "--max-budget-usd", "1"],
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

/** The English for one item: sentence-aligned when the model kept one sentence per sentence. */
function readAnswer(item, answer) {
  const ja = sentences(item.ja);
  const en = (Array.isArray(answer) ? answer : [answer]).map((s) => String(s ?? "").trim()).filter(Boolean);
  return { full: en.join(" "), aligned: en.length === ja.length && ja.length > 1 ? en : null, ja };
}

async function runBatch(batch, model, retry, sentencePairs) {
  const ids = [...new Set(batch.map((i) => i.id))];
  const names = [...new Set(ids.flatMap((id) => glossary(byId.get(id))))];
  const input = batch.map((i) => ({ k: `${i.id}/${i.k}`, ja: sentences(i.ja), ...(i.problems ? { previous_attempt_rejected_because: i.problems } : {}) }));
  stats.sentChars += batch.reduce((n, i) => n + i.ja.length, 0);
  const r = await callClaude(`Glossary:\n${names.length ? names.join("\n") : "(none)"}\n\nInput:\n${JSON.stringify({ items: input })}`, model);
  if (!r.ok) {
    if (r.kind === "rate-limit" || r.kind === "auth" || r.kind === "budget") stop = `${r.kind}: ${r.text}`;
    retry.push(...batch);
    return;
  }
  stats.cost += r.cost ?? 0;
  const results = new Map(parseItems(r.text).map((i) => [String(i.k), i.en]));
  for (const item of batch) {
    const { full, aligned, ja } = readAnswer(item, results.get(`${item.id}/${item.k}`));
    const problems = checkTranslation(item.ja, full);
    if (problems.length === 0) {
      store(item, full);
      // The first sentence is a text of its own wherever a card shows it: keep its English for resolveFromMemory.
      if (aligned) sentencePairs.set(`${item.id}\u0000${ja[0]}`, aligned[0]);
    } else retry.push({ ...item, problems });
  }
  // Saved as it goes, so a stopped run keeps what it paid for.
  for (const id of ids) saveFile(byId.get(id), files.get(id));
}

/** First sentences of other pending texts of the same entry wait one round: they usually come free with them. */
function splitDerivable(items) {
  const longer = new Set(items.filter((i) => sentences(i.ja).length > 1).map((i) => `${i.id}\u0000${sentences(i.ja)[0]}`));
  const send = [];
  const wait = [];
  for (const i of items) (longer.has(`${i.id}\u0000${i.ja}`) ? wait : send).push(i);
  return { send, wait };
}

const sentencePairs = new Map();
todo = resolveFromMemory(todo, sentencePairs);
const reusedBefore = stats.reused;
if (dryRun) {
  const { send, wait } = splitDerivable(todo);
  const chars = (xs) => xs.reduce((n, i) => n + i.ja.length, 0);
  console.log(`[dry run] ${kind}: ${stats.entries} entries, ${stats.texts} texts without a translation`);
  console.log(`  reused from stored translations: ${reusedBefore}`);
  console.log(`  first sentences expected to come with their text: ${wait.length} (${chars(wait)} chars)`);
  console.log(`  to send: ${send.length} texts (${chars(send)} chars)`);
} else {
  // Round 0: everything but derivable first sentences, on the first model. Then the first sentences that did not come
  // free, and every rejected text with its problems, on the retry model.
  let { send, wait } = splitDerivable(todo);
  for (let round = 0; round < 2 && !stop; round++) {
    const model = round === 0 ? firstModel : retryModel;
    const queue = batches(send);
    const retry = [];
    let done = 0;
    const total = queue.length;
    await Promise.all(
      Array.from({ length: concurrency }, async () => {
        while (queue.length > 0 && !stop) {
          await runBatch(queue.shift(), model, retry, sentencePairs);
          done++;
          if (done % 20 === 0) console.log(`round ${round + 1} (${model}): ${done}/${total} batches — stored ${stats.stored}, $${stats.cost.toFixed(2)}`);
        }
      }),
    );
    if (stop) retry.push(...queue.flat());
    send = [...resolveFromMemory(wait, sentencePairs), ...retry];
    wait = [];
  }
  todo = send;
  stats.rejected = todo.length;
  for (const item of todo.filter((i) => i.problems).slice(0, 10)) console.log(`  ✗ ${item.id}: ${item.problems.join(" / ")} — ${item.ja.slice(0, 40)}`);
  console.log(
    `${kind}: ${stats.entries} entries, ${stats.texts} texts — stored ${stats.stored} (reused ${stats.reused}, first sentences derived ${stats.derived}), ` +
      `left in Japanese ${stats.rejected}; sent ${stats.sentChars} chars, $${stats.cost.toFixed(2)}`,
  );
}
if (stop) {
  console.error(`stopped: ${stop}`);
  process.exit(2);
}
