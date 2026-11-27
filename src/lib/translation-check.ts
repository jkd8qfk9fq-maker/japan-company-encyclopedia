/**
 * The checks a reference translation must pass before it is stored or shown (JCE-128). Pure, and free of "@/"
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

const EN_UNITS: Record<string, number> = { trillion: 1e12, billion: 1e9, million: 1e6, thousand: 1e3 };
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
const CARDINALS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

const key = (n: number) => Number(n.toPrecision(10));
const num = (s: string) => Number(s.replace(/,/g, ""));
/** Labels of links are names, not figures: "[[company:x|3M]]" must not count a 3. */
const withoutMarkup = (text: string) => text.replace(REFERENCE, (_m, _k, _id, label: string) => ` ${label.replace(/\d/g, "")} `);

const PLACE_UNITS: Record<string, number> = { 千: 1e3, 百: 1e2, 十: 1e1 };
const BIG_UNITS: Record<string, number> = { 兆: 1e12, 億: 1e8, 万: 1e4 };

/**
 * The figures in Japanese prose, read the way Japanese reads them (JCE-136): a figure is a run of sections, each a
 * coefficient times 兆・億・万， and a coefficient is itself built from 千・百・十 places — 「2,517億71百万円」 is
 * 2517億 + 71百万 = 251,771,000,000, 「9,982億3千4百万円」 is 9982億 + 3400万 = 998,234,000,000, 「5億3千万円」 is
 * 530,000,000. The earlier fold compared each unit with the one before it, so a coefficient written with places
 * after a section （千・百 in non-monotonic order, or a trailing 万） was misread and a correct translation of such
 * a sentence could never pass. A run counts only when it holds a digit: a bare 百万円 (a unit note, 「いずれも百万円」)
 * or 数十万人 (a magnitude, not a printed figure) is left as the earlier reading left it, and a lone 千・百・十・万
 * inside a word （十分・万一） is not a figure either.
 */
export function japaneseFigures(text: string): number[] {
  const t = withoutMarkup(text.normalize("NFKC"));
  type Tok = { value?: number; place?: number; big?: number; start: number; end: number };
  const tokens: Tok[] = [];
  for (const m of t.matchAll(/(\d[\d,]*(?:\.\d+)?)|([千百十])|([兆億万])/g)) {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    if (m[1]) tokens.push({ value: num(m[1]), start, end });
    else if (m[2]) tokens.push({ place: PLACE_UNITS[m[2]], start, end });
    else tokens.push({ big: BIG_UNITS[m[3]], start, end });
  }
  const out: number[] = [];
  let i = 0;
  while (i < tokens.length) {
    let j = i;
    while (j + 1 < tokens.length && tokens[j + 1].start === tokens[j].end) j++;
    const run = tokens.slice(i, j + 1);
    i = j + 1;
    if (!run.some((tk) => tk.value !== undefined)) continue;
    let total = 0;
    let coeff = 0;
    let pending: number | null = null;
    let sectionHas = false;
    const takeCoeff = () => {
      const taken = { c: coeff + (pending ?? 0), had: sectionHas };
      coeff = 0;
      pending = null;
      sectionHas = false;
      return taken;
    };
    for (const tk of run) {
      if (tk.value !== undefined) {
        if (pending !== null) coeff += pending;
        pending = tk.value;
        sectionHas = true;
      } else if (tk.place !== undefined) {
        if (pending !== null) {
          coeff += pending * tk.place;
          pending = null;
        } else coeff += tk.place;
        sectionHas = true;
      } else if (tk.big !== undefined) {
        const { c, had } = takeCoeff();
        total += (had ? c : 1) * tk.big;
      }
    }
    total += takeCoeff().c;
    out.push(key(total));
  }
  return out;
}

const SMALL: Record<string, number> = { 千: 1e3, 百: 1e2, 十: 10 };
const BIG: Record<string, number> = { 兆: 1e12, 億: 1e8, 万: 1e4 };

/**
 * The amounts in Japanese prose read the way a Japanese reader reads them: 千・百・十 make a group and 万・億・兆
 * multiply it, so 「9,982億3千4百万円」 is 998,234,000,000. japaneseFigures read these differently until JCE-136
 * aligned it with this reading; figuresAmbiguous below stays as the safety net comparing the two readings.
 */
export function japaneseAmounts(text: string): number[] {
  const t = withoutMarkup(text.normalize("NFKC"));
  const out: number[] = [];
  let cur: { value: number; group: number; end: number; lastBig: number } | null = null;
  const flush = () => {
    if (cur) out.push(cur.value + cur.group);
    cur = null;
  };
  for (const m of t.matchAll(/(\d[\d,]*(?:\.\d+)?)([千百十])?(兆|億|万)?/g)) {
    const start = m.index ?? 0;
    const big = m[3] ? BIG[m[3]] : 0;
    if (!cur || start !== cur.end || (big && big >= cur.lastBig)) {
      flush();
      cur = { value: 0, group: 0, end: 0, lastBig: Infinity };
    }
    cur.group += num(m[1]) * (m[2] ? SMALL[m[2]] : 1);
    if (big) {
      cur.value += cur.group * big;
      cur.group = 0;
      cur.lastBig = big;
    }
    cur.end = start + m[0].length;
  }
  flush();
  return out.map(key);
}

/**
 * True when checkTranslation's folding of the figures differs from the amounts a reader sees. Such a text is not
 * translated (JCE-132): a translation that matched the checker would state a wrong amount.
 */
export function figuresAmbiguous(ja: string): boolean {
  const a = [...japaneseFigures(ja)].sort((x, y) => x - y).join();
  const b = [...japaneseAmounts(ja)].sort((x, y) => x - y).join();
  return a !== b;
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
