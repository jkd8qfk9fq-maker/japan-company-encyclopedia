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
  /** The reading the question practises (the pool's or the lesson generator's kind) — the training history groups by it. */
  kind: string;
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

const UNIT_TWO: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "reading-the-business",
  title: "事業の姿を読む",
  intro: "売上の中身と、会社の広がり、働く人と株主の姿を、有価証券報告書の数字で読む単元です。",
  lessons: [
    {
      id: "what-the-company-sells",
      title: "何を売っている会社か",
      minutes: 3,
      body: [
        "決算の数字に入る前に、その会社が何を売っているのかを言葉で押さえます。会社の説明の最初の一文には、主力の製品やサービスが書かれています。",
        "ここでは、会社名を隠した説明文から会社を当てる問題を解きます。事業の姿が頭に入っていると、数字の動きの理由も考えやすくなります。",
      ],
      slots: [{ from: "pool", kind: "describe", count: 2 }],
    },
    {
      id: "segments-show-the-mix",
      title: "売上の内訳：事業セグメントで重心を見る",
      minutes: 4,
      body: [
        "有価証券報告書には、事業ごとの売上高（事業別情報）が載っています。いちばん大きな事業が何かで、その会社の重心——何で稼いでいる会社なのか——が見えてきます。",
        "事業ごとの割合は、印字された金額から計算した計算値です。金額そのものは報告書の数字で、割合だけが計算で出ます。その区別を意識して読んでください。",
      ],
      slots: [
        { from: "lesson", kind: "segment-top", count: 1 },
        { from: "pool", kind: "segment", count: 1 },
      ],
    },
    {
      id: "overseas-share",
      title: "海外売上比率：舞台の広がり",
      minutes: 3,
      body: [
        "売上のうち海外がどれくらいかは、会社の舞台の広がりを教えてくれます。地域別の売上高が載っている会社では、日本とそれ以外の金額から割合を計算できます。",
        "海外の割合が高い会社は、為替や海外の景気の影響を受けやすくなります。割合は計算値、もとの金額は印字値です。",
      ],
      slots: [
        { from: "lesson", kind: "overseas-ratio", count: 1 },
        { from: "pool", kind: "overseas", count: 1 },
      ],
    },
    {
      id: "people-and-revenue",
      title: "従業員と、1人あたりの売上",
      minutes: 4,
      body: [
        "売上高を従業員数で割ると、1人あたりの売上が見えます。同じ売上でも、働く人の数が違えば会社の姿は違います。この値は、2つの印字値から計算した計算値です。",
        "注意したいのは、従業員数には2種類あることです。主要な経営指標に載るのは連結の従業員数で、「従業員の状況」に載るのは提出会社だけの人数です。持株会社では提出会社の人数が極端に少なくなります。ここで使うのは連結のほうです。",
      ],
      slots: [
        { from: "lesson", kind: "employees", count: 1 },
        { from: "lesson", kind: "growth-employees", count: 1 },
      ],
    },
    {
      id: "owners-and-shares",
      title: "株主と所有を、数字で見る",
      minutes: 4,
      body: [
        "有価証券報告書の「株式の状況」には、大株主の名前と持ち分、所有者別の構成が載っています。誰がどれだけ持っているかは、会社の意思決定の姿を映します。",
        "この百科事典の企業ページでは、主要な経営指標に載る発行済株式総数と1株当たり配当額を、印字値のまま載せています。配当額は1株あたりの金額そのもので、株価に対する割合（利回り）ではありません。ここでは発行済株式総数から出題します。",
      ],
      slots: [{ from: "lesson", kind: "shares", count: 2 }],
    },
  ],
};

const UNIT_THREE: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "quarterly-motion",
  title: "四半期で、いまの動きを読む",
  intro: "決算短信と半期報告書で、今年の動きを前年の同じ時期と比べて読む単元です。決算定期便と行き来しながら使います。",
  lessons: [
    {
      id: "quarter-vs-full-year",
      title: "四半期と通期は、別の物差し",
      minutes: 3,
      body: [
        "四半期の数字は、その年度の初めからその四半期までの累計です。第1四半期は3か月分、中間期は6か月分、第3四半期は9か月分——通期の12か月分とは、そもそも物差しの長さが違います。",
        "四半期の出どころも通期とは違います。第1・第3四半期は決算短信、中間期は半期報告書、通期は有価証券報告書です。比べるときは、まず「何か月分が、どの資料に載った数字か」を確かめるのが読み方です。",
      ],
      slots: [
        { from: "pool", kind: "quarterly", count: 1 },
        { from: "lesson", kind: "quarterly-direction", count: 1 },
      ],
    },
    {
      id: "same-period-last-year",
      title: "比べるのは、前年の同じ時期",
      minutes: 3,
      body: [
        "四半期を読むときの基準は、直前の四半期ではなく、前年の同じ時期です。多くの事業には季節の波があり、時期が違えば数字の大きさも違うからです。",
        "ここでも先に予想してから確かめます。今期の累計売上が、前年の同じ時期より増えたか減ったか——まず自分で決めてから、実際の数字で答え合わせをしてください。",
      ],
      slots: [{ from: "lesson", kind: "quarterly-direction", count: 2 }],
    },
    {
      id: "progress-yardstick",
      title: "進捗の目安と、会社予想との違い",
      minutes: 4,
      body: [
        "「進捗率」という言葉は、本来は会社予想と比べるものです。決算短信には、会社自身が出した通期の見通し（会社予想）が載っていて、四半期の実績がその何割まで来たかで進み具合を読みます。",
        "ただし会社予想は、会社の見通しであって実績ではありません。この百科事典では、会社予想は実績の数字とは区別して扱う決まりで、現時点では載せていません。代わりにここでは、前年の通期売上と比べる目安で読みます。前年の実績が物差しなので、進捗そのものではなく目安だという点に注意してください。",
      ],
      slots: [
        { from: "lesson", kind: "quarterly-progress", count: 1 },
        { from: "pool", kind: "quarterly", count: 1 },
      ],
    },
    {
      id: "when-corrections-come",
      title: "訂正が出たら、何を見直すか",
      minutes: 4,
      body: [
        "決算の数字には、後から訂正が出ることがあります。記載の誤りの修正、集計の見直し、会計処理の変更など、理由はさまざまです。訂正は隠されるものではなく、訂正のための開示として出されます。",
        "訂正が出たら、見るべきは「どの数字が、どう変わったか」です。この百科事典では、各社のページとレポートに修正の履歴と数字の来歴（出典・対象期間）を出しています。読み直すときは、訂正後の最新の印字値で確かめ直すのが手順です。ここでは最新の数字から出題します。",
      ],
      slots: [
        { from: "lesson", kind: "figure", count: 1 },
        { from: "lesson", kind: "quarterly-direction", count: 1 },
      ],
    },
    {
      id: "now-make-your-prediction",
      title: "仕上げ：読む側から、予測する側へ",
      minutes: 3,
      body: [
        "この単元の仕上げは、自分の予測を残すことです。各社のページには「次の決算の予測と照合」があり、次の有価証券報告書で売上と純利益が増えるかを、数字が出る前に記録できます。",
        "開示が出ると、記録した予測と実際の印字値が照合されます。予想→開示→照合の繰り返しが、四半期の読みを年次の読みにつなげ、訓練の記録に積み上がっていきます。最後に、年次の方向を予想する問題で締めます。",
      ],
      slots: [
        { from: "lesson", kind: "growth-revenue", count: 1 },
        { from: "lesson", kind: "growth-profit", count: 1 },
      ],
    },
  ],
};

const fromPool = (q: QuizQuestion): MicroQuestion => ({
  id: q.id,
  kind: q.kind,
  prompt: q.prompt,
  clue: q.clue,
  options: q.options,
  answer: q.answer,
  explain: q.explain,
  companyId: q.answer,
});

const fromLesson = (q: LessonQuestion): MicroQuestion => ({
  id: q.id,
  kind: q.kind,
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
 * The course: all three units bound to real questions (units two and three completed in JCE-084; the
 * `plannedLessons` form remains for any future unit whose structure is fixed before its lessons are written).
 * Within a slot, questions are taken in pool order, preferring an industry the lesson has not used yet, and
 * no question is bound to two lessons. A slot the pools cannot fill leaves the lesson shorter — never padded
 * with a written question.
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

  const bind = (unit: { id: string; title: string; intro: string; lessons: LessonSpec[] }): MicroUnit => ({
    id: unit.id,
    title: unit.title,
    intro: unit.intro,
    lessons: unit.lessons.map((spec) => ({ id: spec.id, title: spec.title, minutes: spec.minutes, body: spec.body, questions: take(spec) })),
    plannedLessons: [],
  });
  return [bind(UNIT_ONE), bind(UNIT_TWO), bind(UNIT_THREE)];
}
