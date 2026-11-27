/**
 * Authored structure questions (JCE-090): the reading itself, asked without any company's figures —
 * the order of the stages, what sits between two stages, which section an item belongs to, the
 * procedure for finding something out, and the concepts the tables rest on. These are the questions
 * that cannot go stale: their answers are item names, sections, orders and reasons, so the next fiscal
 * year changes nothing in them. That is the point of the rebuild — the old course asked for values the
 * next period replaces (docs/decisions.md, JCE-090).
 *
 * An authored question states no company fact, so it carries no company citation: its `sourceTitle`
 * names the general basis it rests on (the display rules of the statements themselves), and the
 * binding in src/lib/micro-lessons.ts gives it no company and no period. Company figures only ever
 * arrive through the generated questions in src/lib/lesson-questions.ts, with their citations.
 *
 * JCE-145: the three "order" questions below are kept as data but are no longer bound into any
 * lesson. The course's goal is reading and analysing a filing, not memorising the arrangement of
 * its rows; the readings those lessons practise now come from the generated analysis questions.
 * The entries stay in the pool — the pool is the record of the authored readings, and the binding
 * in src/lib/micro-lessons.ts simply no longer selects them.
 */

export type AuthoredQuestion = {
  id: string;
  /** The reading practised: order / stage-diff / classify / procedure / concept. */
  kind: "order" | "stage-diff" | "classify" | "procedure" | "concept";
  prompt: string;
  /** For "order", the items in their (scrambled) display order; the answer is the ids in reading order, joined by ",". */
  options: { id: string; label: string }[];
  answer: string;
  explain: string;
  /** The general basis the reading rests on — never a company's filing. */
  sourceTitle: string;
};

const PL = "損益計算書の段階表示（財務諸表等規則・会社計算規則）";
const BS = "貸借対照表の区分表示（財務諸表等規則）";
const FILING = "有価証券報告書の構成と開示の決まり";

export const STRUCTURE_QUESTIONS: AuthoredQuestion[] = [
  // --- 並べ替え: the order of the stages and the sections. -------------------------------------------
  {
    id: "order-pl-stages",
    kind: "order",
    prompt: "損益計算書の主な行を、実際の表の順序に並べてください。",
    options: [
      { id: "ordinary", label: "経常利益" },
      { id: "sales", label: "売上高" },
      { id: "parent", label: "親会社株主に帰属する当期純利益" },
      { id: "gross", label: "売上総利益" },
      { id: "pretax", label: "税引前当期純利益" },
      { id: "operating", label: "営業利益" },
    ],
    answer: "sales,gross,operating,ordinary,pretax,parent",
    explain: "順序は、売上高 → 売上総利益（売上原価を引く）→ 営業利益（販管費を引く）→ 経常利益（営業外損益を足し引き）→ 税引前当期純利益（特別損益を足し引き）→ 親会社株主に帰属する当期純利益（法人税等と非支配株主の分を引く）です。この並び自体が、利益の5段階の地図です。",
    sourceTitle: PL,
  },
  {
    id: "order-bs-sections",
    kind: "order",
    prompt: "貸借対照表の区分を、実際の表の順序に並べてください。",
    options: [
      { id: "net-assets", label: "純資産の部" },
      { id: "current-liabilities", label: "流動負債" },
      { id: "current-assets", label: "流動資産" },
      { id: "fixed-liabilities", label: "固定負債" },
      { id: "fixed-assets", label: "固定資産" },
    ],
    answer: "current-assets,fixed-assets,current-liabilities,fixed-liabilities,net-assets",
    explain: "順序は、資産の部（流動資産 → 固定資産）、負債の部（流動負債 → 固定負債）、純資産の部です。左側が資金の使い道、右側が調達元で、資産の合計と負債・純資産の合計は必ず一致します。",
    sourceTitle: BS,
  },
  {
    id: "order-tax-steps",
    kind: "order",
    prompt: "損益計算書の下段を、実際の表の順序に並べてください。",
    options: [
      { id: "tax", label: "法人税等" },
      { id: "net", label: "当期純利益" },
      { id: "pretax", label: "税引前当期純利益" },
    ],
    answer: "pretax,tax,net",
    explain: "順序は、税引前当期純利益 → 法人税等 → 当期純利益です。税金は、特別損益まで含めた利益が出た後に差し引かれます。だから税引前と当期純利益の差は「費用が増えた」のではなく、税金の分です。",
    sourceTitle: PL,
  },

  // --- 差の内訳: what sits between two stages. -------------------------------------------------------
  {
    id: "diff-revenue-gross",
    kind: "stage-diff",
    prompt: "売上高と売上総利益（粗利）の差になっているのは、どれでしょう？",
    options: [
      { id: "cost", label: "売上原価" },
      { id: "sga", label: "販売費及び一般管理費（販管費）" },
      { id: "non-operating", label: "営業外損益" },
      { id: "special", label: "特別損益" },
    ],
    answer: "cost",
    explain: "売上高から売上原価（商品の仕入れや製造にかかった費用）を引いた残りが売上総利益です。粗利の大きさは、売値と原価の関係——その会社の商売の土台——を映します。販管費は、粗利と営業利益の間の段で引かれます。",
    sourceTitle: PL,
  },
  {
    id: "diff-gross-operating",
    kind: "stage-diff",
    prompt: "売上総利益（粗利）と営業利益の差になっているのは、どれでしょう？",
    options: [
      { id: "sga", label: "販売費及び一般管理費（販管費）" },
      { id: "non-operating", label: "営業外損益" },
      { id: "special", label: "特別損益" },
      { id: "tax", label: "法人税等" },
    ],
    answer: "sga",
    explain: "売上総利益から販管費（人件費・広告費・研究開発費など、売ることと会社を回すことの費用）を引いた残りが営業利益です。粗利が高くても、販管費が重い会社は営業利益が薄くなります。",
    sourceTitle: PL,
  },
  {
    id: "diff-operating-ordinary",
    kind: "stage-diff",
    prompt: "営業利益と経常利益の差に入っているのは、どれでしょう？",
    options: [
      { id: "non-operating", label: "営業外損益（支払利息・受取配当金・為替差損益など）" },
      { id: "cost", label: "売上原価" },
      { id: "special", label: "特別利益・特別損失" },
      { id: "tax", label: "法人税等" },
    ],
    answer: "non-operating",
    explain: "営業利益に営業外収益を足し、営業外費用を引いたものが経常利益です。本業の外の損益——借入の利息や、持っている株式の配当など——がこの段に入ります。借入の重い会社は、本業が健全でも経常利益が薄くなります。",
    sourceTitle: PL,
  },
  {
    id: "diff-ordinary-net",
    kind: "stage-diff",
    prompt: "経常利益から当期純利益までの間に、足し引きされるのはどれでしょう？",
    options: [
      { id: "special-and-tax", label: "特別損益と法人税等" },
      { id: "sga", label: "販管費" },
      { id: "non-operating", label: "営業外損益" },
      { id: "cost", label: "売上原価" },
    ],
    answer: "special-and-tax",
    explain: "経常利益の下には、特別利益・特別損失（固定資産の売却益や減損損失など、一度きりの損益）が来て、税引前当期純利益になり、そこから法人税等を引いて当期純利益になります。最終利益が大きく動いた年は、この段を疑うのが読み方です。",
    sourceTitle: PL,
  },
  {
    id: "diff-pretax-net",
    kind: "stage-diff",
    prompt: "税引前当期純利益と当期純利益の差になっているのは、どれでしょう？",
    options: [
      { id: "tax", label: "法人税等（法人税・住民税・事業税と法人税等調整額）" },
      { id: "special", label: "特別損益" },
      { id: "non-operating", label: "営業外損益" },
      { id: "sga", label: "販売費及び一般管理費（販管費）" },
    ],
    answer: "tax",
    explain: "税引前当期純利益から法人税等を引いた残りが当期純利益です。特別損益は税引前の段階までに入っています。前期と比べて最終利益が動いたとき、その一部は業績ではなく税金の段の動きであることがあります。",
    sourceTitle: PL,
  },

  // --- 区分判定: which section an item belongs to. ---------------------------------------------------
  {
    id: "classify-interest",
    kind: "classify",
    prompt: "支払利息は、損益計算書のどこに入るでしょう？",
    options: [
      { id: "non-operating", label: "営業外費用" },
      { id: "sga", label: "販売費及び一般管理費" },
      { id: "special", label: "特別損失" },
      { id: "cost", label: "売上原価" },
    ],
    answer: "non-operating",
    explain: "支払利息は営業外費用です。借入は本業の活動そのものではないため、その費用も本業の利益（営業利益）の外に置かれます。だから営業利益と経常利益の差を見ると、借入の重さが読めます。",
    sourceTitle: PL,
  },
  {
    id: "classify-impairment",
    kind: "classify",
    prompt: "工場の減損損失は、損益計算書のどこに入るでしょう？",
    options: [
      { id: "special", label: "特別損失" },
      { id: "non-operating", label: "営業外費用" },
      { id: "sga", label: "販売費及び一般管理費" },
      { id: "cost", label: "売上原価" },
    ],
    answer: "special",
    explain: "減損損失は特別損失です。臨時的・異常な損益は経常利益の下の特別損益に分けて置かれるため、減損で最終利益が赤字になっても、本業の経常利益は黒字ということがあります。赤字の段を確かめるのが読み方です。",
    sourceTitle: PL,
  },
  {
    id: "classify-payables-section",
    kind: "classify",
    prompt: "買掛金は、貸借対照表のどこに入るでしょう？",
    options: [
      { id: "current-liabilities", label: "流動負債" },
      { id: "fixed-liabilities", label: "固定負債" },
      { id: "current-assets", label: "流動資産" },
      { id: "net-assets", label: "純資産の部" },
    ],
    answer: "current-liabilities",
    explain: "買掛金は流動負債です。仕入れた商品や材料の代金のうち、まだ払っていない分で、仕入れて売って代金を回収するという営業の循環の中にある負債は流動に区分されます（正常営業循環基準）。借入金とは別の、仕入先への未払いです。",
    sourceTitle: BS,
  },
  {
    id: "classify-receivable",
    kind: "classify",
    prompt: "売掛金は、貸借対照表のどこに入るでしょう？",
    options: [
      { id: "current-assets", label: "流動資産" },
      { id: "fixed-assets", label: "固定資産" },
      { id: "current-liabilities", label: "流動負債" },
      { id: "net-assets", label: "純資産の部" },
    ],
    answer: "current-assets",
    explain: "売掛金は流動資産です。流動と固定の分かれ目は「1年」だけではなく、仕入れて売って代金を回収するという営業の循環の中にあるものは、1年を超えても流動に区分されます（正常営業循環基準）。",
    sourceTitle: BS,
  },
  {
    id: "classify-borrowing-due",
    kind: "classify",
    prompt: "「1年内返済予定の長期借入金」は、貸借対照表のどこに入るでしょう？",
    options: [
      { id: "current-liabilities", label: "流動負債" },
      { id: "fixed-liabilities", label: "固定負債" },
      { id: "current-assets", label: "流動資産" },
      { id: "net-assets", label: "純資産の部" },
    ],
    answer: "current-liabilities",
    explain: "もとは長期借入金でも、返済が1年以内に迫った分は流動負債に移ります。だから借金の重さを読むときは、固定負債の長期借入金だけでは足りず、流動負債側のこの行も一緒に見る必要があります。",
    sourceTitle: BS,
  },
  {
    id: "classify-debt-split",
    kind: "classify",
    prompt: "同じ「借金」でも、貸借対照表では複数の行に分かれて並びます。その分かれ方を決めるのは、どれでしょう？",
    options: [
      { id: "maturity", label: "返済までの期間（1年以内かどうか）" },
      { id: "amount", label: "金額の大きさ" },
      { id: "lender", label: "借りた相手" },
      { id: "purpose", label: "お金の使い道" },
    ],
    answer: "maturity",
    explain: "借入は返済期限で分かれます。短期借入金と1年内返済予定の長期借入金は流動負債に、社債と長期借入金は固定負債に並ぶため、「借金はいくらか」は1行では読めず、行を全部拾う必要があります。",
    sourceTitle: BS,
  },
  {
    id: "classify-goodwill",
    kind: "classify",
    prompt: "買収で生じた「のれん」は、貸借対照表のどこに入るでしょう？",
    options: [
      { id: "intangible", label: "無形固定資産" },
      { id: "current-assets", label: "流動資産" },
      { id: "tangible", label: "有形固定資産" },
      { id: "liabilities", label: "負債の部" },
    ],
    answer: "intangible",
    explain: "のれんは無形固定資産です。買収価格のうち、受け入れた資産・負債の金額を上回る部分——買った会社の稼ぐ力への対価——が資産として載ります。目に見えない資産の代表です。",
    sourceTitle: BS,
  },
  {
    id: "classify-nci",
    kind: "classify",
    prompt: "非支配株主持分は、貸借対照表のどこに入るでしょう？",
    options: [
      { id: "net-assets", label: "純資産の部（ただし「自己資本」には含めない）" },
      { id: "liabilities", label: "負債の部" },
      { id: "assets", label: "資産の部" },
      { id: "none", label: "表には出てこない" },
    ],
    answer: "net-assets",
    explain: "非支配株主持分は純資産の部に入ります。ただしそれは子会社の親会社以外の株主の持分で、親会社の株主のものではないため、「自己資本」を計算するときは純資産から除きます。純資産と自己資本が同じでない理由のひとつです。",
    sourceTitle: BS,
  },

  // --- 手順: how a reader finds something out. --------------------------------------------------------
  {
    id: "procedure-per-employee",
    kind: "procedure",
    prompt: "従業員1人あたりの売上を知りたいとき、2つの印字値をどう組み合わせるでしょう？",
    options: [
      { id: "div-consolidated", label: "売上高 ÷ 従業員数（連結）" },
      { id: "mul", label: "売上高 × 従業員数（連結）" },
      { id: "sub", label: "売上高 − 従業員数（連結）" },
      { id: "div-parent", label: "売上高 ÷ 従業員数（提出会社だけ）" },
    ],
    answer: "div-consolidated",
    explain: "売上高を従業員数（連結）で割ります（計算値）。大切なのは物差しを揃えることで、連結の売上を提出会社だけの人数で割ると、持株会社では実態とかけ離れた数字になります。従業員数に2種類あること自体が、読み方の注意点です。",
    sourceTitle: FILING,
  },
  {
    id: "procedure-borrowings",
    kind: "procedure",
    prompt: "会社の借金の重さを知りたいとき、貸借対照表で見るべき場所はどれでしょう？",
    options: [
      { id: "all", label: "流動・固定に分かれて並ぶ借入の行を、すべて合計する" },
      { id: "fixed-only", label: "固定負債の長期借入金だけを見る" },
      { id: "current-only", label: "流動負債の短期借入金だけを見る" },
      { id: "cash", label: "現金の行を見る" },
    ],
    answer: "all",
    explain: "借入は返済期限で流動と固定に分かれて並ぶため、1行だけでは総額が分かりません。短期借入金、1年内返済予定の長期借入金、社債、長期借入金を全部拾って合計するのが手順です。",
    sourceTitle: BS,
  },
  {
    id: "procedure-progress-yardstick",
    kind: "procedure",
    prompt: "四半期の「進捗率」を本来の意味で測るとき、比べる相手はどれでしょう？",
    options: [
      { id: "forecast", label: "決算短信に載る会社予想（通期の見通し）" },
      { id: "prior-year", label: "前年の通期の実績" },
      { id: "prior-quarter", label: "直前の四半期の実績" },
      { id: "internal", label: "会社の内部予算" },
    ],
    answer: "forecast",
    explain: "進捗率は、会社自身が出した通期の見通し（会社予想）に対して、四半期の実績がどこまで来たかを測る物差しです。会社予想は見通しであって実績ではないため、実績の数字とは区別して読みます。前年の通期実績と比べるのは「目安」であり、進捗そのものではありません。",
    sourceTitle: FILING,
  },
  {
    id: "procedure-quarter-compare",
    kind: "procedure",
    prompt: "四半期の数字を比べるとき、比べる相手として正しいのはどれでしょう？",
    options: [
      { id: "same-prior", label: "前年の同じ時期" },
      { id: "prior-quarter", label: "直前の四半期" },
      { id: "full-year", label: "通期の実績" },
      { id: "forecast", label: "会社予想" },
    ],
    answer: "same-prior",
    explain: "比べるのは前年の同じ時期です。多くの事業には季節の波があり、時期が違えば数字の大きさも違うため、直前の四半期と比べても季節の差しか読めません。四半期の数字は年度初めからの累計であることも、併せて押さえます。",
    sourceTitle: FILING,
  },
  {
    id: "procedure-unit-check",
    kind: "procedure",
    prompt: "有価証券報告書の表の金額を読むとき、最初に確かめるのはどれでしょう？",
    options: [
      { id: "unit", label: "単位（百万円など）と、△がマイナスの印であること" },
      { id: "color", label: "表の色づかい" },
      { id: "name-reading", label: "会社名の読み方" },
      { id: "filed-date", label: "報告書の提出日" },
    ],
    answer: "unit",
    explain: "有報の金額は百万円単位が基本で、マイナスは「△」で表します。単位を1つ読み違えると、会社の規模を10倍に誤読します。値を比べる前に、単位と符号の約束を確かめるのが手順の最初です。",
    sourceTitle: FILING,
  },
  {
    id: "procedure-where-stages",
    kind: "procedure",
    prompt: "営業利益や特別損益の内訳まで読みたいとき、開くべき場所はどれでしょう？",
    options: [
      { id: "body", label: "第一部の連結損益計算書（本体）" },
      { id: "summary", label: "巻頭の「主要な経営指標等の推移」の5期表" },
      { id: "tanshin", label: "決算短信" },
      { id: "news", label: "ニュース記事" },
    ],
    answer: "body",
    explain: "巻頭の5期表は要約で、中間の利益は1行しか抜き出されていません。5段階の利益や特別損益の内訳は、第一部の連結損益計算書の本体と、その注記にあります。要約で足りなければ本体を開く、という地図が読み方の土台です。",
    sourceTitle: FILING,
  },
  {
    id: "procedure-net-assets-share",
    kind: "procedure",
    prompt: "総資産のうち、返す必要のない調達（純資産）がどれだけの割合かを知るには、どう計算するでしょう？",
    options: [
      { id: "na-div-ta", label: "純資産 ÷ 総資産" },
      { id: "ta-div-na", label: "総資産 ÷ 純資産" },
      { id: "ni-div-ta", label: "純利益 ÷ 総資産" },
      { id: "na-div-ni", label: "純資産 ÷ 純利益" },
    ],
    answer: "na-div-ta",
    explain: "純資産を総資産で割ります（計算値）。総資産は「調達した資金の総額」と同じ大きさなので、この割合は調達のうち返す必要のない部分の割合です。割合の作り方を読む訓練であり、水準の良し悪しを判定するものではありません（業種によって水準は大きく違います）。",
    sourceTitle: BS,
  },

  // --- 概念: the concepts the tables rest on. ----------------------------------------------------------
  {
    id: "concept-stock-flow",
    kind: "concept",
    prompt: "貸借対照表と損益計算書の違いとして、正しいのはどれでしょう？",
    options: [
      { id: "stock-flow", label: "貸借対照表は期末日という一時点の残高、損益計算書は1年間の流れ" },
      { id: "both-flow", label: "どちらも1年間の流れ" },
      { id: "both-stock", label: "どちらも一時点の残高" },
      { id: "none", label: "違いはない" },
    ],
    answer: "stock-flow",
    explain: "損益計算書は1年間の流れ（フロー）、貸借対照表は期末日という一時点の残高（ストック）です。だから貸借対照表の現金は「1年間で増えた現金」ではなく、期末日にあった現金です。",
    sourceTitle: BS,
  },
  {
    id: "concept-balance",
    kind: "concept",
    prompt: "貸借対照表の左右の合計が必ず一致するのは、なぜでしょう？",
    options: [
      { id: "same-money", label: "左は資金の使い道、右は同じ資金の調達元で、同じお金を両側から見ているから" },
      { id: "rule", label: "たまたま、合わせる決まりになっているから" },
      { id: "audit", label: "監査のときに調整して合わせるから" },
      { id: "big-only", label: "資産の多い会社だけ一致する" },
    ],
    answer: "same-money",
    explain: "貸借対照表は、調達した資金（右側：負債と純資産）が、どのような形で存在しているか（左側：資産）を示す表です。同じ資金の両面なので、合計は必ず一致します。この構造が見えると、借金で資産を膨らませた会社と、自己資金で持つ会社の違いが読めます。",
    sourceTitle: BS,
  },
  {
    id: "concept-consolidated",
    kind: "concept",
    prompt: "連結と単体（個別）の数字の違いとして、正しいのはどれでしょう？",
    options: [
      { id: "group", label: "連結は子会社を含めたグループ全体、単体は提出会社だけ" },
      { id: "same", label: "名前が違うだけで、同じ数字" },
      { id: "smaller", label: "連結のほうが常に小さい" },
      { id: "newer", label: "単体のほうが新しい数字" },
    ],
    answer: "group",
    explain: "有価証券報告書には連結財務諸表と単体の財務諸表の両方が載り、指標の推移にも2つの表が並びます。持株会社では、単体の売上（子会社からの配当や手数料が中心）と連結の売上が桁違いになるため、どちらの数字を見ているかを常に意識するのが読み方です。従業員数にも連結と提出会社の2種類があります。",
    sourceTitle: FILING,
  },
  {
    id: "concept-parent-share",
    kind: "concept",
    prompt: "連結損益計算書の最下段が「親会社株主に帰属する当期純利益」という長い名前になるのは、なぜでしょう？",
    options: [
      { id: "nci", label: "連結は子会社の利益を100%取り込むが、子会社には親会社以外の株主もいるため、その分を分けて親会社の取り分を示すから" },
      { id: "tax", label: "税金の計算のため" },
      { id: "long-rule", label: "名前を長くする決まりだから" },
      { id: "standalone", label: "単体の利益と区別するためだけ" },
    ],
    answer: "nci",
    explain: "連結の当期純利益はグループ全体の利益です。子会社の株主には親会社以外（非支配株主）もいるため、その取り分を引いた残り——親会社の株主の取り分——が最下段に来ます。最下段の上に「非支配株主に帰属する当期純利益」の行があるのは、その二段構えのためです。",
    sourceTitle: PL,
  },
  {
    id: "concept-no-ordinary-ifrs",
    kind: "concept",
    prompt: "IFRSの会社の損益計算書に「経常利益」がないのは、なぜでしょう？",
    options: [
      { id: "no-stage", label: "IFRSでは段階ごとの利益の表示が決まっておらず、特別損益の区分も認められていないから" },
      { id: "hidden", label: "会社が開示を避けているから" },
      { id: "loss", label: "赤字の会社だから" },
      { id: "bank", label: "金融業だけの話だから" },
    ],
    answer: "no-stage",
    explain: "経常利益と特別損益は、日本基準の段階表示の概念です。IFRSでは段階表示は要件ではなく、日本基準で特別損益になる項目も営業の区分に入ります。日本基準の「型」を持ち込むと、IFRSの表が壊れて見える——それが、この読み違いの正体です。",
    sourceTitle: "IFRSの表示（段階表示・特別損益の区分なし）",
  },
  {
    id: "concept-bank-form",
    kind: "concept",
    prompt: "銀行の損益計算書で、いちばん上の行が「経常収益」になるのは、なぜでしょう？",
    options: [
      { id: "industry", label: "業種ごとに様式が決まっていて、金融業は売上原価・売上総利益の段を持たないから" },
      { id: "naming", label: "銀行は利益の呼び方が違うだけだから" },
      { id: "size", label: "規模の大きい会社の様式だから" },
      { id: "ifrs", label: "IFRSを採用しているから" },
    ],
    answer: "industry",
    explain: "金融業の損益計算書は、経常収益・経常費用・経常利益を直接並べる様式で、製造業や小売業のような売上原価・売上総利益の段がありません。製造業の型を「標準」として覚えると、銀行の決算で粗利を探して迷います。",
    sourceTitle: PL,
  },
  {
    id: "concept-net-assets-vs-equity",
    kind: "concept",
    prompt: "「純資産」と「自己資本」が同じではないのは、なぜでしょう？",
    options: [
      { id: "includes", label: "純資産には、評価・換算差額や非支配株主持分など、株主資本以外のものも含まれるから" },
      { id: "bigger", label: "純資産のほうが常に大きいから" },
      { id: "label", label: "会社ごとに名前が違うだけだから" },
      { id: "period", label: "測る時期が違うから" },
    ],
    answer: "includes",
    explain: "純資産の部には、株主資本のほかに、評価・換算差額等（有価証券の評価差額や為替の換算差額）、新株予約権、非支配株主持分が入ります。会社が公表する自己資本比率の分子は、純資産そのものではなく、ここから非支配株主持分などを除いた「自己資本」です。",
    sourceTitle: BS,
  },
  {
    id: "concept-retained-earnings",
    kind: "concept",
    prompt: "当期純利益が「残っていく」場所は、貸借対照表のどこでしょう？",
    options: [
      { id: "retained", label: "純資産の部の「利益剰余金」" },
      { id: "cash", label: "資産の部の「現金及び預金」" },
      { id: "current-liabilities", label: "流動負債" },
      { id: "fixed-assets", label: "固定資産" },
    ],
    answer: "retained",
    explain: "損益計算書の当期純利益は、貸借対照表の純資産の部の利益剰余金に積み上がります。これが2つの表の接続です。配当はこの利益剰余金から出るため、「利益が出ているのに純資産が増えない」年は、配当や自己株式の取得、評価差額の動きを追うのが読み方です。",
    sourceTitle: BS,
  },
  {
    id: "concept-ar-inventory",
    kind: "concept",
    prompt: "まだ代金を受け取っていない売掛金や、まだ売れていない在庫が「資産」に並ぶのは、なぜでしょう？",
    options: [
      { id: "future", label: "将来、現金になる見込みのある経済的な価値だから" },
      { id: "all-in", label: "決まりで、会社の持ち物は全部資産に入れるから" },
      { id: "same-as-cash", label: "現金と同じものだから" },
      { id: "past", label: "過去に払ったお金の記録だから" },
    ],
    answer: "future",
    explain: "会計の資産は「将来の経済的便益」です。売掛金は回収されれば現金になり、在庫は売れれば現金になります。ただし在庫の膨張は、売れ残りの積み上がりでもありうるため、「増えた＝良い」とは読まないのが読み方です。",
    sourceTitle: BS,
  },
  {
    id: "concept-black-ink",
    kind: "concept",
    prompt: "利益が出ているのに、現金が増えないことがあるのは、なぜでしょう？",
    options: [
      { id: "timing", label: "売上を計上しても代金の回収は後になるなど、利益と現金の動きはずれるから" },
      { id: "error", label: "計算が間違っているから" },
      { id: "tax-only", label: "税金を払ったときだけ起きる" },
      { id: "never", label: "利益が出れば、現金は必ず同じだけ増える" },
    ],
    answer: "timing",
    explain: "売上は、商品を渡した時点で計上されますが、代金の回収は掛け取引では後になります。その間、増えた利益は売掛金という資産の形で貸借対照表に残ります。利益と現金のずれを読むことが、いわゆる黒字倒産を見抜く入口です。",
    sourceTitle: FILING,
  },
  {
    id: "concept-goodwill",
    kind: "concept",
    prompt: "「のれん」が貸借対照表から消えていくのは、どんなときでしょう？",
    options: [
      { id: "amort-impair", label: "償却で少しずつ減るほか、買収した事業が想定ほど稼げないと、減損で大きく減る" },
      { id: "never", label: "一度載ったら消えることはない" },
      { id: "sale-only", label: "会社を売ったときだけ" },
      { id: "tax-only", label: "税金を払ったときだけ" },
    ],
    answer: "amort-impair",
    explain: "日本基準でのれんは、効果の及ぶ期間にわたって償却され、費用として少しずつ消えていきます。買収した事業の収益力が想定を下回ると、減損損失として一度に大きく消えることもあります。大型買収の数年後に大きな特別損失が出たら、のれんの減損を疑うのが読み方です。",
    sourceTitle: BS,
  },
  {
    id: "concept-depreciation",
    kind: "concept",
    prompt: "建物や機械が貸借対照表に載る金額は、何でしょう？",
    options: [
      { id: "book", label: "買った金額から、使い終わった分（減価償却）を引いた帳簿価額" },
      { id: "purchase", label: "買ったときの金額そのもの" },
      { id: "market", label: "いま売れる金額" },
      { id: "zero", label: "使い始めたら0" },
    ],
    answer: "book",
    explain: "有形固定資産は、取得した金額から減価償却の累計を引いた帳簿価額（純額）で載ります。だから帳簿価額の小さい古い工場は「価値が低い」のではなく、「長く使ってきた」姿です。買った金額と累計額は、注記や附属明細表で確かめます。",
    sourceTitle: BS,
  },
  {
    id: "concept-depreciation-pl",
    kind: "concept",
    prompt: "減価償却費は、損益計算書のどこに現れるでしょう？",
    options: [
      { id: "cost-sga", label: "費用として、売上原価や販管費の中に現れる" },
      { id: "special-only", label: "特別損失にだけ現れる" },
      { id: "non-op-only", label: "営業外費用にだけ現れる" },
      { id: "none", label: "損益計算書には現れない" },
    ],
    answer: "cost-sga",
    explain: "減価償却費は毎期の費用で、工場の設備の分は売上原価に、本社機能の分は販管費に入ります。貸借対照表の資産が少しずつ減っていく動きと、損益計算書の費用は、同じ減価償却の両面です。",
    sourceTitle: PL,
  },
  {
    id: "concept-comparability",
    kind: "concept",
    prompt: "前期とそのまま比べられない年があるのは、どんなときでしょう？",
    options: [
      { id: "change", label: "会計基準や、連結の範囲が変わったとき" },
      { id: "always", label: "毎年、比べられない" },
      { id: "never", label: "決算の数字は、常にそのまま比べられる" },
      { id: "season", label: "季節が違うとき" },
    ],
    answer: "change",
    explain: "会計基準の変更、連結範囲の変更、事業の分離などがあると、数字の増減が事業の成長・衰退ではなく、物差しや範囲の変化で生じます。比べる前に、注記の「会計方針の変更」「連結の範囲に関する事項」を確かめるのが手順です。この百科事典でも、集計範囲が変わる会社は系列を切って表示しています。",
    sourceTitle: FILING,
  },
  {
    id: "concept-red-stage",
    kind: "concept",
    prompt: "「営業損失」「経常損失」という名前の行を見たとき、正しい読みはどれでしょう？",
    options: [
      { id: "loss-name", label: "利益がマイナスになると、項目の名前自体が「損失」に変わる" },
      { id: "different", label: "利益とは別の、新しい項目が出てきた" },
      { id: "misprint", label: "印刷の誤り" },
      { id: "tax-item", label: "税金の項目" },
    ],
    answer: "loss-name",
    explain: "マイナスになった段階では、名前が営業利益→営業損失のように変わります。別の項目ではなく、同じ段階の赤字です。そして赤字は、どの段で赤字かで意味が正反対になります——本業の営業赤字と、減損で最終だけ赤字は、深刻さがまったく違います。",
    sourceTitle: PL,
  },
];

export const STRUCTURE_QUESTION_BY_ID = new Map(STRUCTURE_QUESTIONS.map((q) => [q.id, q]));
