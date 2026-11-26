/**
 * The checks a reference translation must pass before it is stored or shown (JCE-124). Pure, and free of "@/"
 * imports, because the translation script (scripts/pipeline/translate.mjs) runs it under plain Node.
 *
 * A translation is shown in place of the filing's Japanese only when it says no more and no less that can be checked
 * mechanically: the same figures (a 億 converted to billions is the same figure), the same links to other pages, and
 * every name written in Latin letters kept as written. What a machine cannot check — whether a sentence means the
 * same — is why the page labels it a reference translation and keeps the Japanese one tap away.
 */
import { createHash } from "node:crypto";

/** The key a translation is stored under: the exact Japanese it translates. Changing one character orphans it. */
export function hashText(text: string): string {
  return createHash("sha256").update(text.normalize("NFC")).digest("hex").slice(0, 16);
}

const JAPANESE = /[぀-ヿ㐀-鿿ｦ-ﾟ]/;
const REFERENCE = /\[\[(term|company|industry|feature):([a-z0-9]+(?:-[a-z0-9]+)*)\|([^\]|]+)\]\]/g;

export function hasJapanese(text: string): boolean {
  return JAPANESE.test(text);
}

const JA_UNITS: Record<string, number> = { 兆: 1e12, 億: 1e8, 百万: 1e6, 万: 1e4, 千: 1e3 };
const EN_UNITS: Record<string, number> = { trillion: 1e12, billion: 1e9, million: 1e6, thousand: 1e3 };
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
const CARDINALS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

const key = (n: number) => Number(n.toPrecision(10));
const num = (s: string) => Number(s.replace(/,/g, ""));
/** Labels of links are names, not figures: "[[company:x|3M]]" must not count a 3. */
const withoutMarkup = (text: string) => text.replace(REFERENCE, (_m, _k, _id, label: string) => ` ${label.replace(/\d/g, "")} `);

/** The figures in Japanese prose, with 兆・億・百万・万 folded in: 「2,517億71百万円」 is one figure, 251,771,000,000. */
export function japaneseFigures(text: string): number[] {
  const t = withoutMarkup(text.normalize("NFKC"));
  const out: number[] = [];
  const re = /(\d[\d,]*(?:\.\d+)?)(兆|億|百万|万|千)?/g;
  let pending: { value: number; unit: number; end: number } | null = null;
  for (const m of t.matchAll(re)) {
    const unit = m[2] ? JA_UNITS[m[2]] : 1;
    const value = num(m[1]) * unit;
    const start = m.index ?? 0;
    // A smaller unit straight after a larger one continues the same figure (2,517億 + 71百万).
    if (pending && start === pending.end && unit < pending.unit && m[2]) {
      pending = { value: pending.value + value, unit, end: start + m[0].length };
      continue;
    }
    if (pending) out.push(pending.value);
    pending = { value, unit: m[2] ? unit : 0, end: start + m[0].length };
  }
  if (pending) out.push(pending.value);
  return out.map(key);
}

/** The figures in English prose ("¥251.77 billion" is one figure), and the words that may stand for a small number. */
export function englishFigures(text: string): { digits: number[]; words: number[]; months: number[] } {
  const t = withoutMarkup(text.normalize("NFKC"));
  const digits: number[] = [];
  for (const m of t.matchAll(/(\d[\d,]*(?:\.\d+)?)(?:\s*(trillion|billion|million|thousand)\b)?/gi)) {
    digits.push(key(num(m[1]) * (m[2] ? EN_UNITS[m[2].toLowerCase()] : 1)));
  }
  const words: number[] = [];
  const months: number[] = [];
  for (const m of t.matchAll(/\b([A-Za-z]+)\b/g)) {
    const w = m[1];
    // A month only when capitalised: "may" is a verb.
    const month = /^[A-Z]/.test(w) ? MONTHS.indexOf(w.toLowerCase()) : -1;
    if (month >= 0) months.push(month + 1);
    const ordinal = ORDINALS.indexOf(w.toLowerCase());
    if (ordinal >= 0) words.push(ordinal + 1);
    const cardinal = CARDINALS.indexOf(w.toLowerCase());
    if (cardinal >= 0) words.push(cardinal + 1);
  }
  return { digits, words, months };
}

const references = (text: string) => [...text.matchAll(REFERENCE)].map((m) => `${m[1]}:${m[2]}`).sort();
const latinWords = (text: string) =>
  [...withoutMarkup(text.normalize("NFKC")).matchAll(/[A-Za-z][A-Za-z0-9&'.+-]*[A-Za-z0-9+]|[A-Za-z]/g)].map((m) => m[0]);

/**
 * What is wrong with `en` as a translation of `ja`; an empty list means it may be stored and shown.
 *
 * - figures: every figure of the Japanese appears in the English, and the English has no figure of its own. A month
 *   name, an ordinal or a small cardinal word may stand for a number the Japanese writes in digits
 *   (「3月」→ March, 「第3四半期」→ third quarter, 「2社」→ two companies), never for one it does not have.
 * - links: the same [[kind:id|…]] references, as many times each (the labels are translated).
 * - names in Latin letters (「Zoff」「iPhone」) appear unchanged.
 * - no Japanese left, and not so short that something was dropped.
 */
export function checkTranslation(ja: string, en: string): string[] {
  const problems: string[] = [];
  if (!en.trim()) return ["訳が空"];
  if (hasJapanese(en)) problems.push("訳に日本語の文字が残っている");

  const expected = japaneseFigures(ja);
  const { digits, words, months } = englishFigures(en);
  const remaining = [...digits];
  const spareMonths = [...months];
  const spare = [...words];
  const missing: number[] = [];
  for (const value of expected) {
    const i = remaining.indexOf(value);
    if (i >= 0) remaining.splice(i, 1);
    else {
      const mo = spareMonths.indexOf(value);
      const w = spare.indexOf(value);
      if (mo >= 0) spareMonths.splice(mo, 1);
      else if (w >= 0) spare.splice(w, 1);
      else missing.push(value);
    }
  }
  if (missing.length > 0) problems.push(`原文の数字が訳にない: ${missing.join(", ")}`);
  if (remaining.length > 0) problems.push(`原文にない数字が訳にある: ${remaining.join(", ")}`);
  // A month name is a date, so one the Japanese does not give is an added fact. Ordinal and number words are not
  // held to this: "one of", "first" and "second" are ordinary English with no number behind them.
  if (spareMonths.length > 0) problems.push(`原文にない月が訳にある: ${spareMonths.join(", ")}`);

  const a = references(ja).join(" ");
  const b = references(en).join(" ");
  if (a !== b) problems.push(`リンクが原文と違う（原文: ${a || "なし"} ／ 訳: ${b || "なし"}）`);

  const enText = en.normalize("NFKC");
  const lost = [...new Set(latinWords(ja))].filter((w) => !enText.includes(w));
  if (lost.length > 0) problems.push(`原文の英字表記が訳にない: ${lost.join(", ")}`);

  // English runs longer than Japanese; a translation much shorter than its source has left something out.
  const jaLength = [...ja.replace(REFERENCE, "$3")].length;
  if (jaLength >= 12 && en.replace(REFERENCE, "$3").length < jaLength * 0.8) problems.push("訳が原文に比べて短すぎる");
  return problems;
}
