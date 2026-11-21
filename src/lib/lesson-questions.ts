import { formatYen } from "@/lib/utils/format";
import type { Company } from "@/types/company";

/**
 * Lesson questions (JCE-082): generated per company from the entry's own printed figures, for the micro-lesson
 * layer. Where the quiz pool (JCE-052) asks the reader to compare two companies, these ask about one company:
 * what its latest printed revenue is (four choices), and — the predict-then-check form at the heart of the
 * hybrid design — whether that figure grew against the year before, asked before the figures are shown so the
 * reader commits to a reading first and then checks it against the filing.
 *
 * Every question keeps the records' `sourceIds` and the source's own title, so the answer can always be traced
 * back to the document. A direction derived from two printed figures is a computed value: the explanation
 * carries the label 計算値 and the formula, as everywhere else on the site. Distractor figures in the
 * four-choice question are arithmetic neighbours of the printed figure (the previous year's figure, a tenfold
 * or a tenth), never figures of another company presented as this one's.
 */

export type LessonQuestionKind = "figure" | "growth-revenue" | "growth-profit";

export type LessonQuestion = {
  id: string;
  kind: LessonQuestionKind;
  companyId: string;
  companyName: string;
  industry: string | null;
  prompt: string;
  options: { id: string; label: string }[];
  answer: string;
  /** The printed figures the answer rests on, and the formula when a direction is computed from them. */
  explain: string;
  /** The period the figures belong to — a fiscal year, or the pair of years a direction compares. Always shown. */
  period: string;
  /** The filing records the figures rest on. */
  sourceIds: string[];
  /** The newest source's own title, shown under the explanation as the citation. */
  sourceTitle: string;
};

/** A stable pseudo-random order, the same hash the quiz pool uses, so the selection is fixed for a given build. */
const hash = (s: string) => {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};

const primaryIndustry = (c: Company): string | null => (c.industries.find((i) => i.primary) ?? c.industries[0])?.industryId ?? null;

const byPeriodEnd = (c: Company) => [...c.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));

const pct = (change: number) => `${change > 0 ? "+" : ""}${(Math.round(change * 1000) / 10).toLocaleString("ja-JP")}%`;

/** How many questions of each kind the lesson layer takes at most; the lessons bind only a few of them. */
const CAP = 72;

export function buildLessonQuestions(companies: Company[]): LessonQuestion[] {
  const figures: LessonQuestion[] = [];
  const growthRevenue: LessonQuestion[] = [];
  const growthProfit: LessonQuestion[] = [];

  const ordered = [...companies].sort((a, b) => hash(`lesson-${a.id}`) - hash(`lesson-${b.id}`));
  for (const c of ordered) {
    const records = byPeriodEnd(c);
    const latestRec = records.at(-1);
    if (!latestRec) continue;
    const source = c.sources.find((s) => latestRec.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === latestRec.sourceIds[0]);
    if (!source) continue;
    const base = { companyId: c.id, companyName: c.name, industry: primaryIndustry(c), sourceIds: latestRec.sourceIds, sourceTitle: source.title };

    // 最新期の売上高はどれか — the printed figure against its arithmetic neighbours.
    if (latestRec.revenue !== null && latestRec.revenue > 0) {
      const prev = records.at(-2);
      const candidates: { id: string; value: number }[] = [{ id: "actual", value: latestRec.revenue }];
      if (prev && prev.revenue !== null && prev.revenue > 0) {
        const ratio = prev.revenue / latestRec.revenue;
        if (ratio < 0.8 || ratio > 1.25) candidates.push({ id: "prev", value: prev.revenue });
      }
      candidates.push({ id: "tenfold", value: latestRec.revenue * 10 });
      if (latestRec.revenue >= 1e8) candidates.push({ id: "tenth", value: Math.round(latestRec.revenue / 10) });
      const labels = candidates.map((o) => formatYen(o.value));
      if (new Set(labels).size === candidates.length && candidates.length >= 3) {
        const options = [...candidates]
          .sort((a, b) => hash(`${c.id}-${a.id}`) - hash(`${c.id}-${b.id}`))
          .map((o) => ({ id: o.id, label: formatYen(o.value) }));
        figures.push({
          ...base,
          id: `figure-${c.id}`,
          kind: "figure",
          prompt: `${c.name}の最新期（${latestRec.fiscalYear}）の${latestRec.revenueLabel}はどれでしょう？`,
          options,
          answer: "actual",
          explain: `${c.name}の${latestRec.fiscalYear}の${latestRec.revenueLabel}は ${formatYen(latestRec.revenue)} です。有価証券報告書に載っている会社自身の数値です。`,
          period: latestRec.fiscalYear,
        });
      }
    }

    // 先読み型: the direction of the latest figure against the year before, from the two printed figures.
    const pair = records.slice(-2);
    if (pair.length === 2) {
      const [prev, cur] = pair as [(typeof pair)[0], (typeof pair)[0]];
      const direction = (
        kind: "growth-revenue" | "growth-profit",
        label: string,
        get: (r: (typeof pair)[0]) => number | null,
        threshold: number,
      ) => {
        const a = get(prev);
        const b = get(cur);
        if (a === null || b === null || a <= 0 || b <= 0) return;
        const change = b / a - 1;
        if (Math.abs(change) < threshold) return; // a near-flat year would make the direction a coin toss
        const up = change > 0;
        (kind === "growth-revenue" ? growthRevenue : growthProfit).push({
          ...base,
          id: `${kind}-${c.id}`,
          kind,
          prompt: `予想してから確かめましょう。${c.name}の${label}は、最新期（${cur.fiscalYear}）に前期より増えたでしょうか、減ったでしょうか？`,
          options: [
            { id: "up", label: "増えた" },
            { id: "down", label: "減った" },
          ],
          answer: up ? "up" : "down",
          explain: `${c.name}の${label}は、前期（${prev.fiscalYear}）${formatYen(a)} → 最新期（${cur.fiscalYear}）${formatYen(b)} で、${up ? "増えました" : "減りました"}。計算値：最新期 ÷ 前期 − 1 = ${pct(change)}。もとの2つの数値は有価証券報告書の印字値です。`,
          sourceIds: [...new Set([...prev.sourceIds, ...cur.sourceIds])],
          period: `${prev.fiscalYear} → ${cur.fiscalYear}`,
        });
      };
      direction("growth-revenue", latestRec.revenueLabel, (r) => r.revenue, 0.03);
      direction("growth-profit", "純利益", (r) => r.netIncome, 0.05);
    }
  }

  return [...figures.slice(0, CAP), ...growthRevenue.slice(0, CAP), ...growthProfit.slice(0, CAP)];
}
