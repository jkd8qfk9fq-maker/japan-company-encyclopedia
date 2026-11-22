import type { QuizQuestion } from "@/lib/engagement-data";
import { LESSON_GUIDES } from "@/lib/lesson-guide";
import type { LessonQuestion, QuestionTable } from "@/lib/lesson-questions";
import { STRUCTURE_QUESTION_BY_ID } from "@/lib/structure-questions";

/**
 * The micro-lesson layer (JCE-082, course rebuilt in JCE-090, learn block added in JCE-091): short
 * lessons — first the stumbling point, the concept and a guided reading of the real thing, then two
 * questions — arranged into units, on top of the twelve-step course (JCE-072). The
 * hybrid design in one structure: the units teach the basics, and the readings are practised on real
 * companies' filings, so what is learned is used again on the numbers the earnings digest (決算定期便)
 * later brings back.
 *
 * Of Duolingo's mechanics only three are taken: the micro-lesson with an instant quiz, a gentle weekly
 * progress count (nothing is lost by missing a week), and a spaced review queue. Leagues, hearts and daily
 * pressure are deliberately not taken (docs/decisions.md, JCE-082).
 *
 * The JCE-090 rebuild follows the stumbling-point design: the course is ordered by where a first reader
 * of a filing actually gets stuck — the five stages of profit, why the last line moves, the consolidated
 * yardstick, the balance sheet as a photograph of one day, the two statements' connection, and finally
 * the map of the filing itself. A question asks for a reading — an item's place, a stage, a section, an
 * order, a procedure, a relation — never for a value the next period replaces. Questions come from three
 * sources: the generated per-company pool (src/lib/lesson-questions.ts, figures printed as filed, with
 * citations), the authored structure questions (src/lib/structure-questions.ts, no company figures, the
 * general basis named instead), and the comparison pool's company-identification questions
 * (src/lib/engagement-data.ts), kept as material for reading a company's business before predicting.
 *
 * The binding is a pure function of the pools, so a lesson means the same questions on every build and
 * for every reader. Lesson prose teaches how a filing is read in general; it states no company fact.
 * Every figure a reader meets arrives inside a generated question, from the entries, with its source.
 */

export type MicroQuestion = {
  id: string;
  /** The reading the question practises — the training history groups by it. */
  kind: string;
  prompt: string;
  clue?: string;
  /** How the question is answered: pick one, or arrange the options into the filing's own order. */
  format?: "choice" | "order";
  /** An excerpt of a company's table, printed figures as filed, when the reading uses the real thing. */
  table?: QuestionTable;
  options: { id: string; label: string }[];
  answer: string;
  explain: string;
  /** The company the question is about — null for an authored structure question, which is about no company. */
  companyId: string | null;
  companyName?: string;
  /** The filing records the figures rest on. Empty for an authored structure question: it states no company fact. */
  sourceIds: string[];
  /** The citation shown with the question: a filing's title, or the general basis of a structure question. */
  sourceTitle: string;
  /** The period the figures belong to, shown beside the question wherever a figure appears. Empty when no figure appears. */
  period: string;
};

export type MicroLesson = {
  id: string;
  title: string;
  /** A reader-facing estimate of the minutes the lesson takes — learn block and questions together (JCE-091). */
  minutes: number;
  /** The moment this lesson unsticks, shown before anything is taught (JCE-091, src/lib/lesson-guide.ts). */
  stumble?: string;
  /** Short paragraphs teaching the concept before the questions. General method only — no company facts. */
  body: string[];
  /** An authored diagram of the statement's form, shown with the concept prose (JCE-091). Structure only. */
  diagram?: QuestionTable;
  /** The guided reading of the real thing, read after the concept and before the questions (JCE-091). */
  guide?: string[];
  /**
   * The excerpt the guided reading walks through: a bound question's table when one carries one, else the
   * lesson's authored excerpt of the form. Printed figures as filed, or items and sections only.
   */
  guideTable?: QuestionTable;
  /** The citation of the excerpt above, when it is a bound question's table. */
  guideCite?: { period: string; sourceTitle: string };
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
  /** Question slots, filled in order. A pool/lesson slot takes questions of a kind; an authored slot names one structure question. */
  slots: ({ from: "pool" | "lesson"; kind: string; count: number } | { from: "authored"; questionId: string })[];
};

const UNIT_ONE: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "five-profits",
  title: "利益は5つある：P/Lの骨格",
  intro: "損益計算書の骨格を読む単元です。「利益」は1つではなく、売上から最後の利益まで、費用を引くたびに名前が変わります。その並びと段の差が読めれば、決算の見出しに振り回されなくなります。",
  lessons: [
    {
      id: "pl-map",
      title: "売上から純利益までの地図",
      minutes: 3,
      body: [
        "損益計算書は、売上から費用を順に引いていく「段階計算」の表です。売上総利益、営業利益、経常利益、税引前当期純利益、当期純利益——段階ごとに名前の違う利益が並び、それぞれが別のものを測っています。",
        "読み方のコツは、最下段だけを見ないことです。どの段で増えたのか、どの段で減ったのか。まず地図——行の並び順——を体に入れてから、実在の会社の表で確かめます。",
      ],
      slots: [
        { from: "authored", questionId: "order-pl-stages" },
        { from: "lesson", kind: "find-row", count: 1 },
      ],
    },
    {
      id: "gross-vs-operating",
      title: "粗利と営業利益の境目：販管費",
      minutes: 3,
      body: [
        "売上から売上原価を引いた残りが売上総利益（粗利）です。そこから販売費及び一般管理費——人件費、広告費、研究開発費など——を引くと営業利益になります。粗利と営業利益の境目は、この販管費です。",
        "粗利率が高い会社が「儲かっている会社」とは限りません。研究開発や広告に大きく使う会社は、粗利が高くても営業利益が薄くなります。2つの段を分けて見るのが読み方です。",
      ],
      slots: [
        { from: "authored", questionId: "diff-gross-operating" },
        { from: "lesson", kind: "relation-stages", count: 1 },
      ],
    },
    {
      id: "operating-vs-ordinary",
      title: "営業利益と経常利益の差：営業外損益",
      minutes: 4,
      body: [
        "経常利益は、営業利益に営業外損益を足し引きしたものです。営業外に入るのは、支払利息、受取配当金、為替差損益など、本業の外の損益です。「経常」という言葉を日常語の「通常の」と読むと、この段は見えなくなります。",
        "借入の重い会社は、本業が健全でも支払利息で経常利益が薄くなります。逆に、配当収入で経常利益が膨らむ会社もあります。営業利益と経常利益の差は、会社の資金の借り方を映す段です。",
      ],
      slots: [
        { from: "authored", questionId: "diff-operating-ordinary" },
        { from: "lesson", kind: "label-reading", count: 1 },
      ],
    },
    {
      id: "find-the-stages",
      title: "実物の表で、段階を探す",
      minutes: 3,
      body: [
        "地図が頭に入ったら、実在の会社の表で確かめます。有価証券報告書の巻頭にある「主要な経営指標等の推移」は本体の要約で、売上、中間の利益、純利益が並んでいます。",
        "ここで問うのは金額ではなく、行の位置です。金額は期が変われば変わりますが、どの行がどの段階かという読み方は、どの会社の表でもそのまま使えます。",
      ],
      slots: [
        { from: "lesson", kind: "find-row", count: 1 },
        { from: "authored", questionId: "classify-interest" },
      ],
    },
    {
      id: "where-gaps-open",
      title: "差がつく場所を読む：段階と内訳",
      minutes: 4,
      body: [
        "2期分の段階利益を並べると、「どこで差がついたか」が読めます。売上が伸びたのに中間の利益が伸びない年は、原価や販管費の段に理由があります。逆に、最終利益だけが大きく動いた年は、その下の段に理由があります。",
        "売上の内訳（事業別情報）も、差の場所を教えてくれます。いちばん大きな事業が何かで、会社の重心が見えます。段階と内訳——この2つの「場所」を読むのが、この単元の仕上げです。",
      ],
      slots: [
        { from: "lesson", kind: "relation-stages", count: 1 },
        { from: "lesson", kind: "segment-top", count: 1 },
      ],
    },
  ],
};

const UNIT_TWO: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "why-net-moves",
  title: "最終利益が動く理由：特別損益・税金・赤字の段階",
  intro: "最終利益は、本業以外の理由でも大きく動きます。一度きりの損益、税金、そして赤字の「段」。最終利益の増減を見たときに、その理由を切り分ける読み方を身につける単元です。",
  lessons: [
    {
      id: "special-items-gap",
      title: "経常利益と最終利益の差：特別損益",
      minutes: 4,
      body: [
        "経常利益の下には、特別利益・特別損失が置かれます。固定資産の売却益、減損損失、災害損失など、その年だけの「一度きり」の損益です。",
        "最終利益が過去最高でも、その理由が本社ビルの売却益なら、来期は再現しません。最終利益の増減を見たら、まず経常利益と比べて、差がこの段で生まれていないかを確かめるのが読み方です。",
      ],
      slots: [
        { from: "authored", questionId: "diff-ordinary-net" },
        { from: "lesson", kind: "relation-stages", count: 1 },
      ],
    },
    {
      id: "where-tax-sits",
      title: "税金は、どこで引かれるか",
      minutes: 3,
      body: [
        "税金は、利益が出た後に引かれます。特別損益まで含めた税引前当期純利益から、法人税等（法人税・住民税・事業税と、法人税等調整額）を引いた残りが当期純利益です。",
        "だから税引前と当期純利益の差は「何かの費用が増えた」のではありません。前期との比較で最終利益が動いたときは、税金の段の動きと業績の動きを混同しないことが大切です。",
      ],
      slots: [
        { from: "authored", questionId: "order-tax-steps" },
        { from: "lesson", kind: "relation-stages", count: 1 },
      ],
    },
    {
      id: "shades-of-red",
      title: "赤字の段階を読む",
      minutes: 4,
      body: [
        "「赤字」には段階があります。本業そのものが赤字の営業赤字、利息などで赤字になる経常赤字、一度きりの損失や税金で赤字になる最終赤字。深刻さはまったく違います。",
        "利益がマイナスになると、行の名前自体が「営業損失」「経常損失」に変わります。別の項目が現れたのではなく、同じ段の赤字です。ニュースで「赤字」と見たら、まずどの段の赤字かを確かめてください。",
      ],
      slots: [
        { from: "authored", questionId: "concept-red-stage" },
        { from: "lesson", kind: "find-row", count: 1 },
      ],
    },
    {
      id: "record-profit-anatomy",
      title: "「過去最高益」の内訳を読む",
      minutes: 4,
      body: [
        "「過去最高益」の見出しは、最終利益の話であることがほとんどです。その内訳——本業の経常利益が伸びたのか、一度きりの売却益が乗ったのか——で、意味は正反対になります。",
        "減損損失も同じです。大きな特別損失で最終赤字になっても、本業は黒字という年は珍しくありません。見出しの数字を、段階の読みで分解するのがこの単元の仕上げです。",
      ],
      slots: [
        { from: "authored", questionId: "classify-impairment" },
        { from: "lesson", kind: "relation-stages", count: 1 },
      ],
    },
  ],
};

const UNIT_THREE: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "consolidated-yardstick",
  title: "連結という物差し",
  intro: "同じ会社に、連結と単体、基準の違う表が並ぶ理由を読む単元です。最下段の長い名前、IFRSに経常利益がない理由、銀行の表の形——「物差し」の違いを見分けられるようにします。",
  lessons: [
    {
      id: "consolidated-vs-parent",
      title: "連結と単体、2つの数字",
      minutes: 3,
      body: [
        "有価証券報告書には、連結財務諸表と単体（個別）の財務諸表の両方が載っています。連結は子会社を含めたグループ全体、単体は提出会社だけの数字です。",
        "持株会社では、単体の売上は子会社からの配当や手数料が中心で、連結の売上とは桁が違います。従業員数にも連結と提出会社の2種類があります。どの数字を見ているのか——それを常に意識するのが、この単元の土台です。",
      ],
      slots: [
        { from: "authored", questionId: "concept-consolidated" },
        { from: "lesson", kind: "growth-employees", count: 1 },
      ],
    },
    {
      id: "the-long-name",
      title: "最下段の長い名前",
      minutes: 4,
      body: [
        "連結損益計算書の最下段は、「当期純利益」ではなく「親会社株主に帰属する当期純利益」です。その上には「非支配株主に帰属する当期純利益」の行があります。",
        "連結は子会社の損益を100%取り込みますが、子会社の株主には親会社以外もいます。グループ全体の利益から、非支配株主の取り分を引いた残りが、親会社の株主の取り分です。名前の長さは、この二段構えの表れです。",
      ],
      slots: [
        { from: "authored", questionId: "concept-parent-share" },
        { from: "lesson", kind: "label-reading", count: 1 },
      ],
    },
    {
      id: "forms-change-with-standard",
      title: "基準が違うと、形が違う",
      minutes: 4,
      body: [
        "IFRSや米国基準の損益計算書には、経常利益がありません。段階ごとの表示が要件ではなく、特別損益の区分も認められていないためです。最上段の名前も、売上収益・営業収益・収益など会社ごとに異なります。",
        "日本基準の「型」を覚えただけだと、IFRSの表は壊れて見えます。行の名前——経常利益があるか、税引前の利益か——が、その会社の物差しを教えてくれます。",
      ],
      slots: [
        { from: "lesson", kind: "label-reading", count: 1 },
        { from: "authored", questionId: "concept-no-ordinary-ifrs" },
      ],
    },
    {
      id: "forms-change-with-industry",
      title: "業種で姿が違う",
      minutes: 3,
      body: [
        "銀行・保険・証券などの損益計算書は、いちばん上が「経常収益」で、売上原価や売上総利益の段がありません。金融業は、経常収益・経常費用・経常利益を直接並べる様式なのです。",
        "製造業や小売業の表を「標準形」として覚えると、金融業の決算で粗利や営業利益を探して迷います。業種ごとに様式が違うことを知っているだけで、初見の表にも迷わなくなります。",
      ],
      slots: [
        { from: "authored", questionId: "concept-bank-form" },
        { from: "lesson", kind: "find-row", count: 1 },
      ],
    },
  ],
};

const UNIT_FOUR: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "balance-sheet-photo",
  title: "B/Sは一時点の写真：左右と流動／固定",
  intro: "貸借対照表の骨格を読む単元です。期末日という一時点の残高であること、左が使い道で右が調達であること、流動と固定の分かれ目、そして借金の探し方までを扱います。",
  lessons: [
    {
      id: "flow-and-stock",
      title: "フローとストック",
      minutes: 3,
      body: [
        "損益計算書は1年間の流れ（フロー）、貸借対照表は期末日という一時点の残高（ストック）です。2つの表は同じ「決算書」として並びますが、種類が違います。",
        "貸借対照表の現金は「1年間で増えた現金」ではなく、期末日にあった現金です。期末の一瞬の姿であること——期中に膨らんだり縮んだりした結果の1枚の写真であることを押さえてください。",
      ],
      slots: [
        { from: "authored", questionId: "concept-stock-flow" },
        { from: "lesson", kind: "find-row", count: 1 },
      ],
    },
    {
      id: "left-and-right",
      title: "左は使い道、右は調達",
      minutes: 3,
      body: [
        "貸借対照表の左側（資産の部）は資金の使い道、右側（負債の部・純資産の部）は資金の調達元です。調達した資金が、どのような形で存在しているかを示す表なので、左右の合計は必ず一致します。",
        "この構造が見えると、貸借対照表は「財産の一覧」ではなくなります。借金で資産を膨らませた会社と、自己資金で持つ会社は、同じ大きさでも中身が違うことが読めます。",
      ],
      slots: [
        { from: "authored", questionId: "order-bs-sections" },
        { from: "authored", questionId: "concept-balance" },
      ],
    },
    {
      id: "current-or-fixed",
      title: "流動と固定を分ける、2つの物差し",
      minutes: 4,
      body: [
        "流動と固定の分かれ目は「1年以内」だけではありません。仕入れて、売って、代金を回収するという営業の循環の中にあるもの（売掛金・棚卸資産・買掛金など）は、1年を超えても流動に区分されます。正常営業循環基準と1年基準の、二重の物差しです。",
        "この分かれ目を知らないと、流動資産の大きさだけで「資金繰りは安心」と誤読します。逆に、1年以内に返す借入が流動負債側にどれだけあるかも、同じ物差しで読む項目です。",
      ],
      slots: [
        { from: "authored", questionId: "classify-receivable" },
        { from: "authored", questionId: "classify-borrowing-due" },
      ],
    },
    {
      id: "assets-not-cash",
      title: "資産なのに、現金ではないもの",
      minutes: 4,
      body: [
        "売掛金は、まだ受け取っていない代金です。棚卸資産は、まだ売れていない在庫です。それでも「資産」に並ぶのは、将来現金になる見込みのある価値だからです。",
        "だから、利益が出ても現金が増えないことがあります。売上は計上されても回収は後——その分は売掛金の形で残ります。在庫の膨張も「事業拡大」とは限らず、売れ残りの積み上がりかもしれません。",
      ],
      slots: [
        { from: "authored", questionId: "concept-ar-inventory" },
        { from: "authored", questionId: "concept-black-ink" },
      ],
    },
    {
      id: "find-all-borrowings",
      title: "借金を、全部探す",
      minutes: 3,
      body: [
        "「借金はいくらか」は、貸借対照表の1行では読めません。短期借入金と1年内返済予定の長期借入金は流動負債に、社債と長期借入金は固定負債に、返済期限で分かれて並ぶからです。",
        "固定負債の長期借入金だけを見ると、借入の総額を少なく読みます。借金の重さを読む手順は、流動と固定に分かれた借入の行を全部拾って合計することです。",
      ],
      slots: [
        { from: "authored", questionId: "procedure-borrowings" },
        { from: "authored", questionId: "classify-debt-split" },
      ],
    },
  ],
};

const UNIT_FIVE: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "two-statements-linked",
  title: "2つの表はつながっている：純資産と利益の行き先",
  intro: "損益計算書の利益が、貸借対照表の純資産に積み上がる接続を読む単元です。純資産の中身、利益の行き先、割合の作り方、見えない資産と帳簿価額までを扱います。",
  lessons: [
    {
      id: "inside-net-assets",
      title: "純資産の中身",
      minutes: 4,
      body: [
        "純資産の部に入っているのは、株主資本だけではありません。有価証券の評価差額や為替の換算差額などの「評価・換算差額等」、新株予約権、そして非支配株主持分も含まれます。",
        "だから「純資産」と「自己資本」は同じではありません。会社が公表する自己資本比率の分子は、純資産から非支配株主持分などを除いた自己資本です。自分で出した割合と会社の公表値が合わないときは、この違いを疑ってください。",
      ],
      slots: [
        { from: "authored", questionId: "concept-net-assets-vs-equity" },
        { from: "authored", questionId: "classify-nci" },
      ],
    },
    {
      id: "profit-piles-up",
      title: "利益は、純資産に積み上がる",
      minutes: 4,
      body: [
        "損益計算書の当期純利益は、貸借対照表の純資産の部の「利益剰余金」に積み上がっていきます。2つの表は、この行でつながっています。配当は、この利益剰余金から出ます。",
        "「利益が出ているのに純資産が増えていない」年は、配当や自己株式の取得、評価差額の減少が理由かもしれません。純利益と純資産の増減を並べて読むのが、接続の読み方です。",
      ],
      slots: [
        { from: "authored", questionId: "concept-retained-earnings" },
        { from: "lesson", kind: "relation-net-assets", count: 1 },
      ],
    },
    {
      id: "net-assets-share",
      title: "純資産が、総資産のどれだけか",
      minutes: 3,
      body: [
        "純資産を総資産で割ると、調達した資金のうち返す必要のない部分の割合が出ます（計算値）。総資産は調達の総額と同じ大きさなので、この割合は調達の「質」の読みです。",
        "ここで大切なのは、割合の作り方を問うことであって、水準の良し悪しを判定することではありません。業種によって水準は大きく違い、金融業は構造的に低くなります。もう1つ、1人あたり売上のような計算値も、組み合わせる数字の物差しを揃えることが手順の核心です。",
      ],
      slots: [
        { from: "authored", questionId: "procedure-net-assets-share" },
        { from: "authored", questionId: "procedure-per-employee" },
      ],
    },
    {
      id: "invisible-assets",
      title: "見えない資産：のれんと無形固定資産",
      minutes: 4,
      body: [
        "会社を買収したとき、買った金額のうち受け入れた資産・負債を上回る部分は「のれん」として資産に載ります。買った会社の稼ぐ力への対価です。ソフトウェアなどの無形固定資産と並んで、「目に見えない資産」の代表です。",
        "日本基準でのれんは、少しずつ償却されて費用になり、消えていきます。買収した事業が想定ほど稼げなくなると、減損で一度に大きく消えます。大型買収の数年後の巨額の特別損失は、この形で現れます。",
      ],
      slots: [
        { from: "authored", questionId: "classify-goodwill" },
        { from: "authored", questionId: "concept-goodwill" },
      ],
    },
    {
      id: "book-value",
      title: "資産の金額は、買った値段ではない",
      minutes: 3,
      body: [
        "建物や機械は、買った金額から減価償却の累計を引いた「帳簿価額」で貸借対照表に載ります。表に並ぶのは純額で、買った金額そのものは注記や附属明細表の側にあります。",
        "帳簿価額の小さい古い工場は「価値が低い」のではなく、長く使ってきた姿です。減価償却費は毎期、売上原価や販管費の中の費用として損益計算書にも現れます。資産が減っていく動きと費用は、同じことの両面です。",
      ],
      slots: [
        { from: "authored", questionId: "concept-depreciation" },
        { from: "authored", questionId: "concept-depreciation-pl" },
      ],
    },
  ],
};

const UNIT_SIX: { id: string; title: string; intro: string; lessons: LessonSpec[] } = {
  id: "reading-the-real-thing",
  title: "実物で読む：有報の地図と、予測へ",
  intro: "仕上げの単元です。有価証券報告書のどこに何があるかという地図、単位と符号の約束、比べられない年の見分け方を押さえ、最後に手がかりを読んでから予測する形へ進みます。",
  lessons: [
    {
      id: "map-of-the-filing",
      title: "有報の地図：要約と本体",
      minutes: 3,
      body: [
        "巻頭の「主要な経営指標等の推移」は、有報全体の要約です。ここにあるのは売上、中間の利益1行、純利益、総資産、純資産など限られた項目で、営業利益や特別損益の内訳、B/Sの内訳は第一部の財務諸表の本体と注記にあります。",
        "四半期の出どころも地図のうちです。第1・第3四半期は決算短信、中間期は半期報告書、通期は有価証券報告書。四半期の「進捗率」という言葉も、本来は決算短信の会社予想と比べる物差しで、前年の実績と比べる目安とは別物です。",
      ],
      slots: [
        { from: "authored", questionId: "procedure-where-stages" },
        { from: "authored", questionId: "procedure-progress-yardstick" },
      ],
    },
    {
      id: "units-and-triangles",
      title: "単位と△を読む",
      minutes: 3,
      body: [
        "有価証券報告書の金額は百万円単位が基本で、マイナスは「△」で表します。括弧書きは内数を示すこともあります。表記法そのものが、最初の壁です。",
        "桁を1つ読み違えれば、会社の規模を10倍に誤読します。対策は「値を当てる訓練」ではなく、単位と符号を最初に確かめる手順です。地域別の表のような実物の抜粋でも、まず単位と、どの金額が何の合計なのかを確認します。",
      ],
      slots: [
        { from: "authored", questionId: "procedure-unit-check" },
        { from: "lesson", kind: "region-find", count: 1 },
      ],
    },
    {
      id: "years-that-dont-compare",
      title: "比べられない年がある",
      minutes: 4,
      body: [
        "決算の数字は、いつも前期とそのまま比べられるわけではありません。会計基準の変更、連結範囲の変更、事業の分離があると、増減が事業の動きではなく物差しや範囲の変化で生じます。",
        "四半期の比べ方も同じ単元の話です。比べる相手は直前の四半期ではなく、前年の同じ時期——季節の波を避けるためです。比べる前に「比べられる年か、比べる相手は合っているか」を確かめるのが手順です。",
      ],
      slots: [
        { from: "authored", questionId: "concept-comparability" },
        { from: "authored", questionId: "procedure-quarter-compare" },
        { from: "lesson", kind: "quarterly-direction", count: 1 },
      ],
    },
    {
      id: "predict-with-clues",
      title: "仕上げ：手がかりを読んで、予測する",
      minutes: 6,
      body: [
        "仕上げは、予測の作法です。手がかりのない二択はコイン投げで、読み方を何も教えません。まず、その会社が何を売っている会社か（事業の姿）を言葉で押さえ、次に前期までの構造——最大の事業の重さや、数字の動き——を読んでから、方向を決めます。",
        "ここでの予測はレッスンの中の練習です。実際の次の決算への予測は、各社のページの「次の決算の予測と照合」に記録でき、開示が出ると印字値と照合されます。予測→開示→照合の繰り返しが、読み方を本物にしていきます。",
      ],
      slots: [
        { from: "pool", kind: "describe", count: 2 },
        { from: "lesson", kind: "growth-revenue", count: 1 },
        { from: "lesson", kind: "growth-profit", count: 1 },
      ],
    },
  ],
};

const UNITS = [UNIT_ONE, UNIT_TWO, UNIT_THREE, UNIT_FOUR, UNIT_FIVE, UNIT_SIX];

/**
 * Every lesson id in the course, derived from the unit specs above — the single source the static
 * export's generateStaticParams reads, so the pre-rendered lesson pages can never drift from the course
 * the specs define (a hand-kept list in the page is what left /learn/lesson/[lesson-id] out of the export
 * and failed the JCE-088 deploy until this was added).
 */
export const MICRO_LESSON_IDS: string[] = UNITS.flatMap((unit) => unit.lessons.map((lesson) => lesson.id));

const fromPool = (q: QuizQuestion): MicroQuestion => ({
  id: q.id,
  kind: q.kind,
  prompt: q.prompt,
  clue: q.clue,
  options: q.options,
  answer: q.answer,
  explain: q.explain,
  companyId: q.answer,
  // A pool question carries its citation like a lesson question does (JCE-085): dropping it here is what left
  // eleven questions in /lessons.json without a source or a period.
  sourceIds: q.sourceIds,
  sourceTitle: q.sourceTitle,
  period: q.period,
});

const fromLesson = (q: LessonQuestion): MicroQuestion => ({
  id: q.id,
  kind: q.kind,
  prompt: q.prompt,
  clue: q.clue,
  table: q.table,
  options: q.options,
  answer: q.answer,
  explain: q.explain,
  companyId: q.companyId,
  companyName: q.companyName,
  sourceIds: q.sourceIds,
  sourceTitle: q.sourceTitle,
  period: q.period,
});

const fromAuthored = (questionId: string): MicroQuestion | undefined => {
  const q = STRUCTURE_QUESTION_BY_ID.get(questionId);
  if (!q) return undefined;
  return {
    id: q.id,
    kind: q.kind,
    prompt: q.prompt,
    format: q.kind === "order" ? "order" : "choice",
    options: q.options,
    answer: q.answer,
    explain: q.explain,
    // An authored question states no company fact: no company, no records, no period. Its citation is the
    // general basis named in sourceTitle (JCE-090).
    companyId: null,
    sourceIds: [],
    sourceTitle: q.sourceTitle,
    period: "",
  };
};

/**
 * The course: six units bound to questions (the JCE-090 rebuild; the `plannedLessons` form remains for
 * any future unit whose structure is fixed before its lessons are written). Within a generated slot,
 * questions are taken in pool order, preferring an industry the lesson has not used yet, and no question
 * is bound to two lessons. A slot the pools cannot fill leaves the lesson shorter — never padded with a
 * written question.
 */
export function buildMicroCourse(pool: QuizQuestion[], lessonPool: LessonQuestion[]): MicroUnit[] {
  const used = new Set<string>();
  const take = (spec: LessonSpec): MicroQuestion[] => {
    const out: MicroQuestion[] = [];
    const industries = new Set<string>();
    for (const slot of spec.slots) {
      if (slot.from === "authored") {
        const q = fromAuthored(slot.questionId);
        if (q && !used.has(q.id)) {
          used.add(q.id);
          out.push(q);
        }
        continue;
      }
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
    lessons: unit.lessons.map((spec) => {
      const questions = take(spec);
      // The learn block (JCE-091, src/lib/lesson-guide.ts): the stumbling point, the concept diagram and
      // the guided reading are authored per lesson; the excerpt the reading walks through is the first
      // bound question's table when one carries one — the same excerpt the question then asks about —
      // and falls back to the lesson's authored excerpt of the form when none does.
      const guide = LESSON_GUIDES[spec.id];
      const tableQuestion = guide?.liftGuideTable === false ? undefined : questions.find((q) => q.table);
      return {
        id: spec.id,
        title: spec.title,
        minutes: guide?.minutes ?? spec.minutes,
        stumble: guide?.stumble,
        body: spec.body,
        diagram: guide?.diagram,
        guide: guide?.guide ?? [],
        guideTable: tableQuestion?.table ?? guide?.guideTable,
        guideCite: tableQuestion ? { period: tableQuestion.period, sourceTitle: tableQuestion.sourceTitle } : undefined,
        questions,
      };
    }),
    plannedLessons: [],
  });
  return UNITS.map(bind);
}
