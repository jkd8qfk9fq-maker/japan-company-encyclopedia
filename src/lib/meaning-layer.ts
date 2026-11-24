import { formatAnalysisValue } from "@/lib/analysis-format";
import type { AnalysisGroup, AnalysisRow } from "@/lib/company-analysis";

/**
 * The meaning layer (意味の層, JCE-110): 「この会社の今」 — a few fixed-template sentences that put the
 * decomposition results (JCE-096) in reading order for a beginner's three questions:
 *   q1 儲かっているのか・危なくないのか / q2 何が稼いでいるのか / q3 何に力を入れているのか.
 *
 * Every number in a sentence is a row of a decomposition group, written by the same formatter as the
 * table it comes from, so the sentence and the table cannot disagree. The templates hold no figure of
 * their own, no judgment word (良い・危険・好調…) and no causal claim beyond the decomposition's own
 * arithmetic (「〜のうち」「〜による分」): which way a change points is left to the reader. A sentence
 * whose rows are not all there is not built — nothing is said about a missing figure, and no generic
 * sentence stands in for one. The selection is a fixed order, never a choice of the "interesting" fact.
 */

export type MeaningQuestion = "q1" | "q2" | "q3";

export const MEANING_QUESTIONS: Record<MeaningQuestion, string> = {
  q1: "儲かっているか・お金の動きはどうか",
  q2: "何が稼いでいるか",
  q3: "何に力を入れているか",
};

/** A figure inside a sentence: the row it reads and that row's value as the table writes it. */
export type MeaningFigure = { rowKey: string; text: string };
/** A name taken from the data (a profit line's printed label, a business name) — not template wording. */
export type MeaningLabel = { label: string };

export type MeaningSentence = {
  id: string;
  question: MeaningQuestion;
  /** Template text and figures, in order; the sentence is their concatenation. */
  parts: (string | MeaningFigure | MeaningLabel)[];
  /** The decomposition group every figure comes from — the table under the summary that backs it. */
  groupId: string;
  groupTitle: string;
  fiscalYear: string;
  /** 計算値 when any figure is computed; 印字値 only when every figure is printed. */
  kind: "computed" | "printed";
  sourceIds: string[];
  /** The group's likely-scope-change flag, shown with the sentence so a swing is not read as ordinary growth. */
  caution?: string;
};

/** At most this many sentences per question; the block holds at most five in all. */
const PER_QUESTION: Record<MeaningQuestion, number> = { q1: 4, q2: 2, q3: 0 };
export const MAX_SENTENCES = 5;

type Item = string | MeaningLabel | AnalysisRow;
type Lookup = (key: string) => AnalysisRow | undefined;
type Template = {
  id: string;
  question: MeaningQuestion;
  groupId: string;
  build: (row: Lookup, group: AnalysisGroup) => Item[] | null;
};

const stripSuffix = (title: string, suffix: string) => (title.endsWith(suffix) ? title.slice(0, -suffix.length) : null);

/** Fixed order: within a question, the first templates that can be built are the ones shown. */
const TEMPLATES: Template[] = [
  {
    id: "q1-net-income",
    question: "q1",
    groupId: "a1",
    build: (row) => {
      const ni = row("a1-net-income-change");
      return ni ? ["純利益の増減は前期比 ", ni, "。"] : null;
    },
  },
  {
    id: "q1-profit-split",
    question: "q1",
    groupId: "a1",
    build: (row) => {
      const change = row("a1-profit-change");
      const rev = row("a1-revenue-effect");
      const margin = row("a1-margin-effect");
      const line = change ? stripSuffix(change.title, "の増減") : null;
      if (!change || !rev || !margin || !line) return null;
      return [{ label: line }, "の増減 ", change, " のうち、売上の増減による分は ", rev, "、利益率の変化による分は ", margin, "。"];
    },
  },
  {
    id: "q1-capex-cash",
    question: "q1",
    groupId: "c2",
    build: (row) => {
      const capex = row("c2-capex");
      const op = row("c2-operating-cash-flow");
      if (!capex || !op) return null;
      // JCE-110 第2段階: the year's capex beside depreciation and operating cash flow — the three printed facts that
      // keep a profit fall in an investment year from being read as trouble. Each extra figure only where registered.
      const growth = row("c2-capex-growth");
      const dep = row("c2-depreciation");
      return [
        "この期の設備投資は ",
        capex,
        ...(growth ? ["（前期比 ", growth, "）"] : []),
        ...(dep ? ["、", { label: dep.title }, "は ", dep] : []),
        "、営業キャッシュフローは ",
        op,
        "。",
      ];
    },
  },
  {
    id: "q1-net-assets",
    question: "q1",
    groupId: "b1",
    build: (row) => {
      const dE = row("b1-net-assets-change");
      const ni = row("b1-net-income");
      const other = row("b1-other-change");
      const label = ni ? ni.title.replace(/^うち/, "") : null;
      if (!dE || !ni || !other || !label) return null;
      return ["純資産の増減 ", dE, " のうち、", { label }, "は ", ni, "、配当などその他の増減は ", other, "。"];
    },
  },
  {
    id: "q1-margin-range",
    question: "q1",
    groupId: "f2",
    build: (row) => {
      const range = row("f2-margin-range");
      const label = range ? stripSuffix(range.title, "の最大と最小の差") : null;
      return range && label ? [{ label }, "の直近5期の最大と最小の差は ", range, "。"] : null;
    },
  },
  {
    id: "q1-funding",
    question: "q1",
    groupId: "c1",
    build: (row) => {
      const growth = row("c1-asset-growth");
      const eq = row("c1-equity-contribution");
      const li = row("c1-liability-contribution");
      if (!growth || !eq || !li) return null;
      return ["総資産の前期比 ", growth, " のうち、純資産による分は ", eq, "、負債による分は ", li, "。"];
    },
  },
  {
    id: "q2-margin",
    question: "q2",
    groupId: "a4",
    build: (_row, group) => {
      // A4's rows are sorted by margin, highest first, as margin / share pairs.
      const top = group.rows.find((r) => r.key.startsWith("a4-margin-"));
      const share = top ? group.rows.find((r) => r.key === top.key.replace("a4-margin-", "a4-share-")) : undefined;
      // The measure comes from the formula (「セグメントの営業利益 ÷ …」), the name from the title minus 「の{measure}率」:
      // a business name may itself contain 「の」.
      const measure = top ? /^セグメントの(.+?) ÷/.exec(top.formula)?.[1] : undefined;
      const name = top && measure ? stripSuffix(top.title, `の${measure}率`) : null;
      if (!top || !share || !measure || !name) return null;
      return [{ label: measure }, "率が最も高いのは", { label: name }, "で ", top, "。売上構成比は ", share, "。"];
    },
  },
  {
    id: "q2-segment",
    question: "q2",
    groupId: "a3",
    build: (row, group) => {
      const total = row("a3-revenue-change");
      if (!total || total.value === 0) return null;
      // A3's rows are sorted by contribution, largest first: the largest part in the direction of the total change.
      const parts = group.rows.filter((r) => r.key !== "a3-revenue-change" && r.key !== "a3-adjustment");
      const top = total.value > 0 ? parts[0] : parts.at(-1);
      const name = top ? stripSuffix(top.title, "の寄与") : null;
      if (!top || !name || Math.sign(top.value) !== Math.sign(total.value)) return null;
      return ["売上高の増減 ", total, ` のうち、${total.value > 0 ? "増加" : "減少"}への寄与が最も大きいのは`, { label: name }, "で ", top, "。"];
    },
  },
];

/**
 * Rows that state a change carry an explicit plus sign in a sentence: in a table the column says
 * 「増減」, but 「前期比 465億円」 alone does not say which way. The figure is otherwise the table's string.
 */
export const SIGNED_ROWS = new Set(["a1-net-income-change", "a1-profit-change", "a1-revenue-effect", "a1-margin-effect", "b1-net-assets-change", "b1-other-change", "a3-revenue-change"]);

export function figureText(row: AnalysisRow): string {
  const text = formatAnalysisValue(row, row.value);
  return SIGNED_ROWS.has(row.key) && row.value > 0 && !text.startsWith("+") ? `+${text}` : text;
}

const isRow = (i: Item): i is AnalysisRow => typeof i !== "string" && "key" in i;

function toSentence(t: Template, group: AnalysisGroup, items: Item[]): MeaningSentence {
  const rows = items.filter(isRow);
  return {
    id: t.id,
    question: t.question,
    parts: items.map((i) => (isRow(i) ? { rowKey: i.key, text: figureText(i) } : i)),
    groupId: group.id,
    groupTitle: group.title,
    fiscalYear: rows[0]!.fiscalYear,
    kind: rows.every((r) => r.kind === "printed") ? "printed" : "computed",
    sourceIds: [...new Set(rows.flatMap((r) => r.sourceIds))],
    ...(group.caution ? { caution: group.caution } : {}),
  };
}

/** 「この会社の今」 from the company's computable decomposition groups (any order, duplicates allowed). */
export function meaningSummary(groups: AnalysisGroup[]): MeaningSentence[] {
  const byId = new Map(groups.map((g) => [g.id, g]));
  const built: Record<MeaningQuestion, MeaningSentence[]> = { q1: [], q2: [], q3: [] };
  for (const t of TEMPLATES) {
    if (built[t.question].length >= PER_QUESTION[t.question]) continue;
    const group = byId.get(t.groupId);
    if (!group) continue;
    const items = t.build((key) => group.rows.find((r) => r.key === key), group);
    if (!items || !items.some(isRow)) continue;
    built[t.question].push(toSentence(t, group, items));
  }
  // Within the five, the later questions keep their sentences and Q1 gives up its last ones: a reader with Q1 answered
  // in three sentences is better served than one who never sees what earns the money.
  const later = [...built.q2, ...built.q3];
  return [...built.q1.slice(0, Math.max(0, MAX_SENTENCES - later.length)), ...later].slice(0, MAX_SENTENCES);
}

export const sentenceText = (s: MeaningSentence): string =>
  s.parts.map((p) => (typeof p === "string" ? p : "label" in p ? p.label : p.text)).join("");
