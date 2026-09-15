import type { Industry } from "@/types/industry";

/**
 * 半導体 — the semiconductor industry as a chain.
 *
 * Every stage, description and placement is traced to a quoted passage in
 * `docs/research/industry-semiconductors-and-terms.md`.
 *
 * Things a future editor could easily "fix" wrongly:
 *
 * - The stages are 経済産業省's, not a textbook's. The 取組方針 (p.13–14,
 *   「サプライチェーンの構造」) splits making a semiconductor into 設計・前工程・後工程,
 *   says the manufacturing needs 製造装置・部素材・原料 (p.8–9, together 「原料等」),
 *   and ends with the chips 「様々な電子機器に組み込まれた形で世の中に行き渡る」.
 *   Those are the six categories below. Four are STAGES in METI's order
 *   (設計 → 前工程 → 後工程 → 電子機器への組み込み). 製造装置 and 部素材・原料 are
 *   INPUTS (`role: "input"`): METI describes them as what the manufacturing
 *   needs, not as steps after design. The spec's example chain puts them in the
 *   sequence; drawing arrows through them would teach an order that does not
 *   exist, so they are drawn beside the chain instead (decisions JCE-014).
 * - SEAJ draws the line differently: its process page lists 設計, mask making
 *   and wafer making UNDER 前工程. METI's split is used because it is the
 *   government's and because it keeps 設計 visible as its own stage; the
 *   difference is recorded in the log, not hidden.
 * - Sony Group appears in three stages on purpose. Sony's own semiconductor
 *   site shows it designing image sensors, running the wafer process
 *   (ウェーハ工程（前工程）) and, through a Thai subsidiary, the 後工程. That page
 *   also says the logic-circuit wafer stacked into its sensors is made by an
 *   outside contractor (製造委託), so Sony is not placed as doing everything.
 * - No company is placed in 部素材・原料 or 電子機器への組み込み. None of the
 *   published companies that list `semiconductors` has a source placing it
 *   there, and a company that does not list the industry cannot be placed
 *   (the integrity test rejects it).
 */
export const semiconductors: Industry = {
  id: "semiconductors",
  name: "半導体",
  nameEn: "Semiconductors",
  description:
    "[[term:semiconductor|半導体]]は、電気を通したり通さなかったりする性質をもつ物質や、それを使ってつくった電子部品のことで、情報の記憶や計算を担い、スマートフォンから自動車まで、あらゆる電子機器に組み込まれています。半導体ができるまでには、回路の設計、[[term:wafer|ウェーハ]]の上に回路をつくる[[term:front-end-process|前工程]]、チップに切り分けて包む[[term:back-end-process|後工程]]があり、多くの[[term:semiconductor-manufacturing-equipment|製造装置]]や材料が欠かせません。世界の市場をめぐる競争のなかで分業が進み、今では設計だけを行う会社、製造だけを請け負う会社、装置や材料をつくる会社など、得意分野の違う企業が国境を越えてつながっています。",
  sourceIds: ["tel-about-semiconductor", "seaj-about-semiconductor", "meti-supply-policy", "nedo-tsc-trend"],
  structure: "chain",

  categories: [
    {
      id: "design",
      name: "設計",
      role: "stage",
      description:
        "求められる性能を実現する回路と、その配置（レイアウト）を、専用の設計ツールを使って設計し、動作を確かめます。回路の模様をウェーハに写すためのフォトマスクも、あわせて設計します。工場を持たず、設計に専念して製造を外部に任せる会社（ファブレス）もあります。",
      // Sony: 有報 p.139 「イメージセンサー等を開発、設計、制作、製造」; its semiconductor
      // site names ソニーセミコンダクタソリューションズ as the group's 設計 company.
      companyIds: ["sony-group"],
      sourceIds: ["meti-supply-policy", "nedo-tsc-trend", "sony-yuho-2026", "sony-semicon-group", "sony-semicon-flow"],
    },
    {
      id: "front-end-process",
      name: "前工程（回路づくり）",
      role: "stage",
      description:
        "ウェーハの上に電子回路をつくる工程です。回路の模様を写し取る露光・現像や、膜を削るエッチングなどの処理を数十回から数百回くり返し、配線をつくったあと、ウェーハのまま電気が正しく通るかを検査します。設計は行わず製造だけを請け負う会社（ファウンドリ）が担うこともあります。",
      // Sony: its semiconductor site's 生産フロー 「ウェーハ工程（前工程）」, carried out by
      // ソニーセミコンダクタマニュファクチャリング, a subsidiary the 有報 (p.8) lists under I&SS.
      companyIds: ["sony-group"],
      sourceIds: ["meti-supply-policy", "seaj-process", "nedo-tsc-trend", "sony-semicon-flow", "sony-semicon-group", "sony-yuho-2026"],
    },
    {
      id: "back-end-process",
      name: "後工程（組み立て・検査）",
      role: "stage",
      description:
        "ウェーハを切ってチップに分け、チップをリードフレームに取り付けて金属の線でつなぎ、樹脂などで封じて包みます。最後に外観や電気的な特性を検査して、不良品を取り除きます。組み立てと検査を専門に請け負う会社もあります。",
      // Sony: Sony Device Technology (Thailand) 「イメージセンサーの生産（後工程）」
      // (sony-semicon.com), a subsidiary the 有報 (p.8) lists under I&SS.
      companyIds: ["sony-group"],
      sourceIds: ["meti-supply-policy", "seaj-process", "nedo-tsc-trend", "sony-semicon-about", "sony-semicon-flow", "sony-yuho-2026"],
    },
    {
      id: "electronic-devices",
      name: "電子機器への組み込み",
      role: "stage",
      description:
        "できあがった半導体は、さまざまな電子機器に組み込まれて世の中に届きます。スマートフォンやパソコン、家電、自動車から人工衛星まで、あらゆるものの中で、情報を記憶したり計算したりする役割を担っています。",
      companyIds: [],
      sourceIds: ["meti-supply-policy", "tel-about-semiconductor", "seaj-about-semiconductor"],
    },
    {
      id: "manufacturing-equipment",
      name: "製造装置",
      role: "input",
      description:
        "前工程と後工程で使う装置です。膜をつくる成膜装置、回路の模様を写す露光装置、膜を削るエッチング装置、ウェーハをチップに切り分けるダイシング装置、樹脂で包むモールディング装置、検査装置など、さまざまな種類があります。つくる半導体に合わせて仕様を細かく調整することが多く、まったく同じ製品はほとんどありません。",
      // Tokyo Electron: 有報 p.5 「半導体製造装置の開発・製造・販売・保守サービス」, and
      // NEDO lists 東京エレクトロン under 半導体製造装置メーカー.
      companyIds: ["tokyo-electron"],
      sourceIds: ["meti-supply-policy", "seaj-about-semiconductor", "seaj-process", "sony-semicon-flow", "tel-yuho-2026", "nedo-tsc-trend"],
    },
    {
      id: "materials",
      name: "部素材・原料",
      role: "input",
      description:
        "回路をつくる土台になるシリコンウェーハや、パッケージに使う基板・リードフレーム・樹脂などの部素材と、ヘリウムや希ガスなどの原料です。工程の数がとても多いため使う材料も多く、その品質が半導体の性能に直結します。",
      companyIds: [],
      sourceIds: ["meti-supply-policy"],
    },
  ],

  sources: [
    {
      id: "meti-supply-policy",
      title: "半導体に係る安定供給確保を図るための取組方針（令和7年5月16日改定）",
      publisher: "経済産業省",
      url: "https://www.meti.go.jp/policy/economy/economic_security/semicon/torikumihousin_semiconr3.pdf",
      publishedAt: "2025-05-16",
      accessedAt: "2026-09-14",
    },
    {
      id: "nedo-tsc-trend",
      title: "TSCトレンド「グローバルな半導体競争 ～エコシステム確保をかけて～」",
      publisher: "国立研究開発法人 新エネルギー・産業技術総合開発機構（NEDO）技術戦略研究センター",
      url: "https://www.nedo.go.jp/content/100931733.pdf",
      accessedAt: "2026-09-14",
    },
    {
      id: "seaj-about-semiconductor",
      title: "半導体とは",
      publisher: "一般社団法人 日本半導体製造装置協会（SEAJ）",
      url: "https://www.seaj.or.jp/semi/about_semi.html",
      accessedAt: "2026-09-14",
    },
    {
      id: "seaj-process",
      title: "半導体製造工程とは",
      publisher: "一般社団法人 日本半導体製造装置協会（SEAJ）",
      url: "https://www.seaj.or.jp/semi/proc/",
      accessedAt: "2026-09-14",
    },
    {
      id: "tel-about-semiconductor",
      title: "半導体を知る",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/aboutsemiconductor/index.html",
      accessedAt: "2026-09-14",
    },
    {
      id: "tel-yuho-2026",
      title: "有価証券報告書（2026年3月期・第63期）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/ir/library/fs/arfnn500000000ni-att/yuho63q4.pdf",
      publishedAt: "2026-06-22",
      accessedAt: "2026-09-14",
    },
    {
      id: "sony-yuho-2026",
      title: "有価証券報告書（2025年度：2025年4月1日〜2026年3月31日）",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/IR/library/r7_q4.pdf",
      publishedAt: "2026-06-18",
      accessedAt: "2026-09-14",
    },
    {
      id: "sony-semicon-group",
      title: "グループ（ソニーセミコンダクタソリューションズグループ）",
      publisher: "ソニーセミコンダクタソリューションズ株式会社",
      url: "https://www.sony-semicon.com/ja/company/group/index.html",
      accessedAt: "2026-09-14",
    },
    {
      id: "sony-semicon-about",
      title: "会社概要（ソニーセミコンダクタソリューションズグループ）",
      publisher: "ソニーセミコンダクタソリューションズ株式会社",
      url: "https://www.sony-semicon.com/ja/company/about/index.html",
      accessedAt: "2026-09-14",
    },
    {
      id: "sony-semicon-flow",
      title: "開発・設計・生産の取り組み（フロー）",
      publisher: "ソニーセミコンダクタソリューションズ株式会社",
      url: "https://www.sony-semicon.com/ja/company/operation-flow/index.html",
      accessedAt: "2026-09-14",
    },
  ],

  // Every stage and placement is sourced; the judgement calls (stage order,
  // METI vs SEAJ split, Sony's outsourced logic wafer) are recorded in the log
  // and none leaves an unverified claim on the page.
  status: { state: "published" },

  revisions: [
    {
      date: "2026-09-14",
      kind: "ai-generated",
      summary:
        "経済産業省「半導体に係る安定供給確保を図るための取組方針」、NEDO技術戦略研究センター「TSCトレンド」、日本半導体製造装置協会の解説ページ、東京エレクトロン「半導体を知る」と有価証券報告書、ソニーグループの有価証券報告書とソニーセミコンダクタソリューションズグループの公式ページに基づきAIが作成",
    },
  ],

  updatedAt: "2026-09-14",
};
