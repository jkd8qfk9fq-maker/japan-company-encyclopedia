import type { QuizQuestion } from "@/lib/engagement-data";

/**
 * 有報の読み方入門 (JCE-072): the quiz pool arranged into one twelve-step course, grouped by the order a filing is
 * read — what the company does, its five years of figures, the breakdown of its sales, its overseas sales, and how
 * the current year is moving. The arrangement is a pure function of the pool: the same pool always yields the same
 * course, so a step means the same question on every build and for every reader.
 */

export type LearnTheme = {
  kind: QuizQuestion["kind"];
  /** The theme's name, in the order the course walks through a filing. */
  label: string;
  /** What this theme teaches the reader to look at, in one line. */
  intro: string;
  /** How many steps this theme takes when the pool has enough of its questions. */
  target: number;
  /** The company-page section the theme's questions come from: a step ends inside that section of a real entry. */
  section: string;
};

export const LEARN_THEMES: LearnTheme[] = [
  { kind: "describe", label: "事業の姿", intro: "まず、その会社が何をしている会社かをつかむところから。", target: 3, section: "business" },
  { kind: "revenue", label: "5期の数字", intro: "次に、売上と利益の数字で、会社の大きさを見ます。", target: 3, section: "financials" },
  { kind: "segment", label: "事業別の売上", intro: "売上の中身を事業ごとに分けると、会社の重心が見えてきます。", target: 2, section: "financials" },
  { kind: "overseas", label: "海外の売上", intro: "売上のうち海外がどれくらいかで、会社の舞台の広がりがわかります。", target: 2, section: "financials" },
  { kind: "quarterly", label: "四半期の動き", intro: "最後に、今年の四半期を前年の同じ時期と並べて、いまの動きを読みます。", target: 2, section: "financials" },
];

export const COURSE_SIZE = 12;

export type LearnStep = {
  /** 1-based position in the course. */
  n: number;
  theme: string;
  /** The theme's one-line guide, shown where the theme begins. */
  intro: string;
  kind: QuizQuestion["kind"];
  /** Company-page section the question came from (an anchor on /companies/<answer>). */
  section: string;
  question: QuizQuestion;
};

/**
 * Twelve steps from the pool alone. Within a theme, questions are taken in pool order, preferring an industry the
 * theme has not used yet so the course walks across industries instead of circling one; if a theme runs short, the
 * shortfall is handed round the other themes in order until the course is full or the pool is exhausted.
 */
export function buildCourseSteps(pool: QuizQuestion[]): LearnStep[] {
  const used = new Set<string>();
  const picked: { theme: LearnTheme; question: QuizQuestion }[] = [];

  const take = (theme: LearnTheme, count: number) => {
    const candidates = pool.filter((q) => q.kind === theme.kind && !used.has(q.id));
    const industries = new Set(picked.filter((p) => p.theme.kind === theme.kind).map((p) => p.question.industry));
    const chosen: QuizQuestion[] = [];
    for (const q of candidates) {
      if (chosen.length >= count) break;
      if (industries.has(q.industry)) continue;
      industries.add(q.industry);
      chosen.push(q);
    }
    for (const q of candidates) {
      if (chosen.length >= count) break;
      if (!chosen.includes(q)) chosen.push(q);
    }
    for (const q of chosen) {
      used.add(q.id);
      picked.push({ theme, question: q });
    }
  };

  for (const theme of LEARN_THEMES) take(theme, theme.target);
  // A short theme leaves the course short: hand the missing steps round the themes, in course order, until the
  // course is full or a whole round adds nothing (the pool has no more to give).
  while (picked.length < COURSE_SIZE) {
    const before = picked.length;
    for (const theme of LEARN_THEMES) {
      if (picked.length >= COURSE_SIZE) break;
      take(theme, 1);
    }
    if (picked.length === before) break;
  }
  return finish(picked);
}

const finish = (picked: { theme: LearnTheme; question: QuizQuestion }[]): LearnStep[] =>
  picked.map((p, i) => ({ n: i + 1, theme: p.theme.label, intro: p.theme.intro, kind: p.theme.kind, section: p.theme.section, question: p.question }));
