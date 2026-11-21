import type { QuizQuestion } from "@/lib/engagement-data";
import type { LessonQuestion } from "@/lib/lesson-questions";

/**
 * The micro-lesson layer (JCE-082): short lessons — a few paragraphs of reading, then two or three questions —
 * arranged into units, on top of the twelve-step course (JCE-072). The hybrid design in one structure: the
 * units teach the basics, and the questions are asked against real companies' printed figures, so what is
 * learned is practised on the same numbers the earnings digest (決算定期便) later brings back.
 *
 * Of Duolingo's mechanics only three are taken: the micro-lesson with an instant quiz, a gentle weekly
 * progress count (nothing is lost by missing a week), and a spaced review queue. Leagues, hearts and daily
 * pressure are deliberately not taken (docs/decisions.md, JCE-082).
 *
 * The binding is a pure function of the two question pools — the comparison pool (JCE-052) and the
 * per-company lesson pool (JCE-082) — so a lesson means the same questions on every build and for every
 * reader. Lesson prose teaches how a filing is read in general; it states no company fact. Every figure a
 * reader meets arrives inside a question, generated from the entries, with its source.
 */

export type MicroQuestion = {
  id: string;
  prompt: string;
  clue?: string;
  options: { id: string; label: string }[];
  answer: string;
  explain: string;
  /** The company the question is about: for a pool question, the company that is its answer. */
  companyId: string;
  companyName?: string;
  /** Kept when the question was generated per company (JCE-082), so the citation travels with it. */
  sourceIds?: string[];
  sourceTitle?: string;
  /** The period the figures belong to, shown beside the question wherever a figure appears. */
  period?: string;
};

export type MicroLesson = {
  id: string;
  title: string;
  /** A reader-facing estimate of the minutes the lesson takes. */
  minutes: number;
  /** Short paragraphs of reading before the questions. General method only — no company facts. */
  body: string[];
  questions: MicroQuestion[];
};

export type MicroUnit = {
  id: string;
  title: string;
  intro: string;
  lessons: MicroLesson[];
  /** Units whose structure is fixed but whose lessons are not written yet: titles only, shown as 準備中. */
  plannedLessons: string[];
};

type LessonSpec = {
  id: string;
  title: string;
  minutes: number;
  body: string[];
  /** Question slots, filled from the pools in order: a kind, and how many of it the lesson takes. */
  slots: { from: "pool" | "lesson"; kind: string; count: number }[];
};

const UNIT_ONE: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "revenue-and-profit",
  title: "売上と利益の違いを実在企業で読む",
  intro: "最初の単元です。売上高と純利益——決算のいちばん基本の2つの数字を、実在の会社の有報の数字で読みます。",
  lessons: [
    {
      id: "size-is-revenue",
      title: "会社の大きさは、売上高で見る",
      minutes: 3,
      body: [
        "売上高は、会社が1年間に売り上げた金額そのものです。有価証券報告書には、会社自身の数字として載っています。",
        "会社の大きさを比べるとき、まず見るのは売上高です。ただし売上高は「もうかった金額」ではありません。仕入れや人件費を差し引く前の、いちばん大きな数字だということを押さえてください。",
      ],
      slots: [
        { from: "lesson", kind: "figure", count: 1 },
        { from: "pool", kind: "revenue", count: 1 },
      ],
    },
    {
      id: "predict-the-direction",
      title: "先に予想する：売上は前期より増えたか",
      minutes: 3,
      body: [
        "決算を読むときは、数字を見る前に予想を立てるのがこつです。「この会社の売上は前期より増えたか、減ったか」——まず自分で決めてから、実際の数字で確かめます。",
        "予想と答え合わせの繰り返しが、数字の動きを見る目を育てます。ここでは実在の会社の2期分の売上高から出題します。増えたか減ったかは、2つの印字値から計算した計算値です。",
      ],
      slots: [{ from: "lesson", kind: "growth-revenue", count: 2 }],
    },
    {
      id: "net-income-is-what-remains",
      title: "純利益は、最後に残った利益",
      minutes: 4,
      body: [
        "売上高から、仕入れ・人件費・税金などすべてを差し引いて、最後に残るのが純利益です。費用のほうが大きかった年は、マイナスの数字（赤字）で載ります。",
        "売上高が増えても、純利益が減ることはあります。この2つの数字を並べて見ることが、決算を読む第一歩です。",
      ],
      slots: [
        { from: "lesson", kind: "growth-profit", count: 1 },
        { from: "lesson", kind: "figure", count: 1 },
      ],
    },
    {
      id: "five-years-show-the-flow",
      title: "5期並べると、流れが見える",
      minutes: 4,
      body: [
        "有価証券報告書には、5期分の数字が並んでいます。1年分だけでは分からない「伸びているのか、縮んでいるのか」が、並べて見ると見えてきます。",
        "この百科事典の企業ページでも、5期の売上高と純利益を、報告書のとおりに載せています。四半期の数字と並べれば、いまの動きも重ねて読めます。",
      ],
      slots: [
        { from: "pool", kind: "revenue", count: 1 },
        { from: "pool", kind: "quarterly", count: 1 },
      ],
    },
    {
      id: "breakdown-and-overseas",
      title: "売上の内訳と、海外の広がり",
      minutes: 4,
      body: [
        "売上高の中身は、事業ごとに分かれています。どの事業がいちばん大きいかで、会社の重心——何で稼いでいる会社なのか——が見えてきます。",
        "売上のうち海外がどれくらいかも、会社の舞台の広がりを教えてくれます。どちらの割合も、有報に載った金額から計算した計算値です。",
      ],
      slots: [
        { from: "pool", kind: "segment", count: 1 },
        { from: "pool", kind: "overseas", count: 1 },
      ],
    },
  ],
};

const PLANNED_UNITS: { id: string; title: string; intro: string; plannedLessons: string[] }[] = [
  {
    id: "reading-the-business",
    title: "事業の姿を読む",
    intro: "その会社が何を売り、誰に売り、誰から買っているのか。数字の前に、事業の姿を読む単元です。",
    plannedLessons: ["何を売っている会社か", "誰に売り、誰から買うか", "会社の歴史をたどる"],
  },
  {
    id: "quarterly-motion",
    title: "四半期で、いまの動きを読む",
    intro: "決算短信と半期報告書で、今年の動きを前年の同じ時期と比べて読む単元です。決算定期便と行き来しながら使います。",
    plannedLessons: ["四半期は前年の同じ時期と比べる", "決算短信の出る時期と読みどころ", "訂正が出たら何を見るか"],
  },
];

const fromPool = (q: QuizQuestion): MicroQuestion => ({
  id: q.id,
  prompt: q.prompt,
  clue: q.clue,
  options: q.options,
  answer: q.answer,
  explain: q.explain,
  companyId: q.answer,
});

const fromLesson = (q: LessonQuestion): MicroQuestion => ({
  id: q.id,
  prompt: q.prompt,
  options: q.options,
  answer: q.answer,
  explain: q.explain,
  companyId: q.companyId,
  companyName: q.companyName,
  sourceIds: q.sourceIds,
  sourceTitle: q.sourceTitle,
  period: q.period,
});

/**
 * The course: unit one bound to real questions, the later units as structure only. Within a slot, questions
 * are taken in pool order, preferring an industry the lesson has not used yet, and no question is bound to
 * two lessons. A slot the pools cannot fill leaves the lesson shorter — never padded with a written question.
 */
export function buildMicroCourse(pool: QuizQuestion[], lessonPool: LessonQuestion[]): MicroUnit[] {
  const used = new Set<string>();
  const take = (spec: LessonSpec): MicroQuestion[] => {
    const out: MicroQuestion[] = [];
    const industries = new Set<string>();
    for (const slot of spec.slots) {
      const source: (QuizQuestion | LessonQuestion)[] = slot.from === "pool" ? pool.filter((q) => q.kind === slot.kind) : lessonPool.filter((q) => q.kind === slot.kind);
      const industryOf = (q: QuizQuestion | LessonQuestion) => q.industry;
      const picked: (QuizQuestion | LessonQuestion)[] = [];
      for (const q of source) {
        if (picked.length >= slot.count || used.has(q.id)) continue;
        const industry = industryOf(q);
        if (industry && industries.has(industry)) continue;
        if (industry) industries.add(industry);
        picked.push(q);
      }
      for (const q of source) {
        if (picked.length >= slot.count) break;
        if (used.has(q.id) || picked.includes(q)) continue;
        picked.push(q);
      }
      for (const q of picked) {
        used.add(q.id);
        out.push(slot.from === "pool" ? fromPool(q as QuizQuestion) : fromLesson(q as LessonQuestion));
      }
    }
    return out;
  };

  const unitOne: MicroUnit = {
    id: UNIT_ONE.id,
    title: UNIT_ONE.title,
    intro: UNIT_ONE.intro,
    lessons: UNIT_ONE.lessons.map((spec) => ({ id: spec.id, title: spec.title, minutes: spec.minutes, body: spec.body, questions: take(spec) })),
    plannedLessons: [],
  };
  return [unitOne, ...PLANNED_UNITS.map((u) => ({ ...u, lessons: [] }))];
}
