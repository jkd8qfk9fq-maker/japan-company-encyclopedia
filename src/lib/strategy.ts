import type { Company } from "@/types/company";

/**
 * What the 戦略と強み section draws from the entry (JCE-055). Everything here is read mechanically out of the company's
 * own words or printed figures — nothing is summarised, rephrased or estimated: a sentence is shown whole or not at
 * all, a target is the filing's phrase cut at its edges, and a share is computed from printed segment revenue.
 */

/** The text split into its sentences, each kept whole with its 。 so nothing is reworded. */
export function sentences(text: string): string[] {
  return (text.match(/[^。]+。?/g) ?? []).map((s) => s.trim()).filter(Boolean);
}

/** Plan and brand names the company puts in 「」 (「GOOD FOODS 2030」), in order, at most four. */
export function quotedNames(text: string): string[] {
  const names = [...text.matchAll(/「([^」]{2,24})」/g)].map((m) => m[1]);
  return [...new Set(names)].slice(0, 4);
}

export type StrategyTarget = {
  /** The figure's name as printed: 売上高, 海外所在地売上高比率. */
  metric: string;
  /** As printed, normalised to half-width: 1兆円, 50%. */
  value: string;
  /** 以上, 超 — printed right after the value. */
  qualifier: string | null;
  /** The year the target is for, written just before the figure: 2030年, 2028年度. */
  year: string | null;
  /** The words around the figure, as printed, so a reader sees whose and which target it is. */
  context: string;
};

// Only the figures the encyclopedia already shows (invariant 4): revenue, the profit lines, net income and the overseas
// share. A company's ROE or dividend target is not shown, however big the company prints it.
const METRIC =
  "海外(?:所在地)?売上(?:高|収益)?比率|連結売上(?:高|収益)|売上(?:高|収益)|営業収益|コア営業利益|事業利益|営業利益|経常利益|親会社株主に帰属する当期純利益|当期純利益|純利益";
const TARGET = new RegExp(
  `(${METRIC})(?:は|を|で|:)?(?:約)?(\\d[\\d,]*(?:\\.\\d+)?(?:兆(?:\\d[\\d,]*億)?円|億円|百万円|%))(以上|超)?`,
  "g",
);
// A figure is a target only in a sentence that says so; the same pattern in 「売上高は1,000億円となりました」 is a result.
const TARGET_CUE = /目指|目標|計画|掲げ|達成|見込/;
// …and not one that reports it was reached (「売上高1兆円を達成した一方」).
const RESULT_CUE = /達成した|達成しました|となりました|となった|を超えました/;
// A figure belongs to the company as a whole only when nothing narrows it: 「AI関連の売上高」「全世界売上高」 are a part.
const OPENS_FIGURE = /(^|[、。「『(\s]|[にでをはと]|年|期|度)$/;
const YEAR = /(20\d{2})年(?:(\d{1,2})月期|度)?/g;

/** Numerical targets the company states in its strategy (「2030年に売上高1兆円」), at most three. */
export function strategyTargets(text: string): StrategyTarget[] {
  const found: StrategyTarget[] = [];
  for (const raw of sentences(text)) {
    const sentence = raw.normalize("NFKC");
    if (!TARGET_CUE.test(sentence) || RESULT_CUE.test(sentence)) continue;
    const years = [...sentence.matchAll(YEAR)];
    for (const m of sentence.matchAll(TARGET)) {
      const start = m.index ?? 0;
      if (!OPENS_FIGURE.test(sentence.slice(Math.max(0, start - 1), start))) continue;
      // The year written closest before the figure, and near it, is the one it belongs to (「2025年4月に始めた計画で、
      // 2030年には…」). A year further back is a plan's period (「（2025年3月期~2027年3月期）」), not the target's.
      const before = years.filter((y) => (y.index ?? 0) < start && start - (y.index ?? 0) <= 30).at(-1);
      const from = Math.max(0, start - 30);
      const context = `${from > 0 ? "…" : ""}${sentence.slice(from, start + m[0].length)}…`;
      const target = { metric: m[1], value: m[2], qualifier: m[3] ?? null, year: before ? before[0] : null, context };
      if (!found.some((t) => t.metric === target.metric && t.value === target.value)) found.push(target);
    }
  }
  return found.slice(0, 3);
}

// The words that make a sentence about growth; a business named in one is a business the company says it will grow.
const GROWTH_CUE = /成長|拡大|伸長|強化|育成|注力|柱/;

/**
 * The businesses the company names in a growth sentence of its own strategy — the "成長領域" drawn in the accent
 * colour. A business is named when its full name appears, or its stem (「ファイン事業」→「ファイン」) followed by
 * 事業・分野・部門・領域・ビジネス, so 「総合食品企業」 does not count as naming 食品事業.
 */
export function growthBusinessIds(company: Company): Set<string> {
  const text = company.perspectives?.strategy?.disclosed?.text;
  const ids = new Set<string>();
  if (!text) return ids;
  const growthSentences = sentences(text).filter((s) => GROWTH_CUE.test(s));
  const all = company.businesses.flatMap((b) => [b, ...(b.children ?? [])]);
  for (const b of all) {
    for (const name of new Set([b.name, b.shortName].filter((n): n is string => !!n))) {
      if (/^その他/.test(name)) continue;
      const stem = name.replace(/(事業|部門|セグメント)$/, "");
      const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const named = new RegExp(`${escaped}(事業|分野|部門|領域|ビジネス)`);
      if (growthSentences.some((s) => s.includes(name) || (stem.length >= 2 && named.test(s)))) ids.add(b.id);
    }
  }
  return ids;
}

export type SegmentShare = { businessId: string; name: string; amount: number; percent: number; growth: boolean };

/**
 * Each business's share of the printed segment revenue — one of the three ratios the encyclopedia computes (JCE-038)
 * — largest first, with the growth businesses marked.
 */
export function segmentShares(company: Company): { label: string; fiscalYear: string; items: SegmentShare[] } | null {
  const seg = company.segmentRevenue;
  if (!seg) return null;
  const names = new Map(
    company.businesses.flatMap((b) => [b, ...(b.children ?? [])]).map((b) => [b.id, b.shortName ?? b.name]),
  );
  const items = seg.items.filter((i) => i.amount > 0 && names.has(i.businessId));
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  if (items.length < 2 || total <= 0) return null;
  const growth = growthBusinessIds(company);
  return {
    label: seg.label,
    fiscalYear: seg.fiscalYear,
    items: items
      .map((i) => ({
        businessId: i.businessId,
        name: names.get(i.businessId)!,
        amount: i.amount,
        percent: Math.round((i.amount / total) * 1000) / 10,
        growth: growth.has(i.businessId),
      }))
      .sort((a, b) => b.amount - a.amount),
  };
}
