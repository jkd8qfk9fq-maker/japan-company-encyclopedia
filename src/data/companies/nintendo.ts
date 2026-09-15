import type { Company } from "@/types/company";

/**
 * 任天堂 (7974). Research log: docs/research/nintendo.md
 *
 * Nintendo reports a SINGLE business segment (有報 第86期 p.77:「事業セグメントは単一です」),
 * so there are no reportable segments to put at the top level of `businesses`.
 * The two top-level nodes are instead the 製品及びサービスごとの情報 categories the
 * company itself discloses (有報 p.78) — ゲーム専用機 and IP関連収入等 — using the
 * company's own names and its own footnoted definitions (有報 p.75). They are
 * categories of sales, not segments, and must not be presented as セグメント.
 *
 * No `children`: the filing defines what each category contains, but does not
 * describe sub-businesses with their own figures, so a hierarchy would be invented.
 */
export const nintendo: Company = {
  id: "nintendo",
  code: "7974",
  name: "任天堂",
  officialName: "任天堂株式会社",
  nameEn: "Nintendo Co., Ltd.",
  shortNameEn: "NINTENDO",
  description:
    "ゲーム機「Nintendo Switch 2」とゲームソフトをつくって世界で売り、マリオの映画やアプリも手がける会社。",
  listings: [{ exchange: "tse", market: "プライム" }],

  industries: [{ industryId: "entertainment", primary: true }],

  // Ordered by 2026年3月期 外部顧客への売上高 (有報 p.78):
  // ゲーム専用機 2,239,541百万円 > IP関連収入等 73,510百万円.
  businesses: [
    {
      id: "dedicated-video-game-platforms",
      name: "ゲーム専用機",
      description:
        "携帯ゲームやホームコンソールゲームのハードウェア（ゲーム機）とソフトウェアの事業。グループで開発し、任天堂が製造して、主にグループの販売会社が国内外で販売する。",
      products: [
        "Nintendo Switch 2",
        "Nintendo Switch",
        "ゲームソフト（パッケージ版・ダウンロード版）",
        "追加コンテンツ",
        "Nintendo Switch Online",
        "アクセサリ",
        "amiibo",
      ],
      sourceIds: ["yuho-2026"],
    },
    {
      id: "ip-related-income",
      name: "IP関連収入等",
      shortName: "IP関連",
      description:
        "任天堂のIP（知的財産）に関連する売上などをまとめた区分。映像コンテンツ収入、スマートデバイス向けアプリの課金収入、ロイヤリティ収入、オフィシャルストアでのグッズ販売などが含まれる。",
      // No specific film is named here: the filing says no money or IP licence
      // passed between Nintendo and the studio for the Mario films (有報 p.35),
      // and never states how any one film's revenue is booked.
      products: [
        "映像コンテンツ",
        "スマートデバイス向けアプリ（『ファイアーエムブレム ヒーローズ』『ピクミン ブルーム』『マリオカート ツアー』など）",
        "オフィシャルストアで販売するグッズ",
      ],
      sourceIds: ["yuho-2026"],
    },
  ],

  businessModel: {
    description:
      "グループで開発し任天堂が製造したゲーム機とゲームソフトを、主にグループの販売会社を通じて世界中のお客様に売って収入を得ている。あわせて、映像コンテンツやスマートデバイス向けアプリ、キャラクターグッズなど、ゲーム専用機の外の分野にも取り組んでいる。",
    // トランプ is named as a main product in 事業の内容 (有報 p.5). Which sales
    // category it falls under is not stated in the 第86期 filing, so it appears
    // here and not under either business above.
    products: [
      "Nintendo Switch 2",
      "Nintendo Switch",
      "ゲームソフト",
      "Nintendo Switch Online",
      "amiibo",
      "スマートデバイス向けアプリ",
      "映像コンテンツ",
      "キャラクターグッズ",
      "トランプ",
    ],
    customers: [
      "世界中のお客様（あらゆる年代のお客様やご家族）",
      "ソフトメーカー",
      "任天堂のIPを使用する顧客",
    ],
    revenueSources: [
      "ハードウェア（ゲーム機本体・アクセサリ・amiibo）の販売",
      "ゲームソフト（パッケージ版・ダウンロード版・追加コンテンツ）の販売",
      "Nintendo Switch Online などの有料会員サービス",
      "ソフトメーカーのダウンロードソフトの販売で受け取る販売手数料",
      "映像コンテンツ収入",
      "スマートデバイス向けアプリの課金収入",
      "IPの使用に応じたロイヤリティ収入",
      "オフィシャルストアでのグッズ販売",
    ],
    flow: [
      {
        kind: "company",
        title: "任天堂",
        description:
          "任天堂とグループ会社がゲーム機とゲームソフトを開発し、任天堂が製造する。",
      },
      {
        kind: "offering",
        title: "ゲーム機・ソフト・サービス",
        description:
          "Nintendo Switch 2 などのゲーム機、ゲームソフト、Nintendo Switch Online などのサービス。映像コンテンツやスマートデバイス向けアプリ、キャラクターグッズも手がける。",
      },
      {
        kind: "customer",
        title: "世界中のお客様",
        description:
          "主にグループの販売会社を通じて国内外で販売する。2026年3月期は売上高の76.9％が海外。",
      },
      {
        kind: "revenue",
        title: "販売収入とIP関連収入",
        description:
          "2026年3月期の売上高2兆3,130億円のうち、ゲーム機やソフトの「ゲーム専用機」が2兆2,395億円、映像・アプリ・ロイヤリティなどの「IP関連収入等」が735億円。",
      },
      {
        kind: "profit",
        title: "利益",
        description:
          "ゲーム機とソフトでは利益率が大きく異なるため、その売れ方で利益が変わる。ヒット商品の有無やその規模でも業績が大きく変わる。",
      },
    ],
    sourceIds: ["yuho-2026"],
  },

  // 有報 第86期 p.2「主要な経営指標等の推移 (1) 連結経営指標等」, 百万円 × 1,000,000.
  // FY2022–FY2025 also appear unchanged in 第85期 p.2, hence yuho-2025 on those years.
  financials: [
    {
      fiscalYear: "2022年3月期",
      periodEnd: "2022-03-31",
      revenue: 1_695_344_000_000,
      revenueLabel: "売上高",
      netIncome: 477_691_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2023年3月期",
      periodEnd: "2023-03-31",
      revenue: 1_601_677_000_000,
      revenueLabel: "売上高",
      netIncome: 432_768_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2024年3月期",
      periodEnd: "2024-03-31",
      revenue: 1_671_865_000_000,
      revenueLabel: "売上高",
      netIncome: 490_602_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2025年3月期",
      periodEnd: "2025-03-31",
      revenue: 1_164_922_000_000,
      revenueLabel: "売上高",
      netIncome: 278_806_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "yuho-2025", "tanshin-2026"],
    },
    {
      fiscalYear: "2026年3月期",
      periodEnd: "2026-03-31",
      revenue: 2_313_051_000_000,
      revenueLabel: "売上高",
      netIncome: 424_056_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "tanshin-2026"],
    },
  ],

  history: [
    {
      year: 1889,
      title: "花札の製造を始める",
      description:
        "山内房治郎が京都市下京区で花札の製造を始めた。任天堂はこの年（明治22年9月）を創業としている。",
      significance:
        "任天堂は花札の製造から始まった。1947年に設立した現在の会社も「かるた・トランプ類の製造・販売会社」として発足し、トランプは今も主な製品のひとつに挙げられている。",
      sourceIds: ["official-history", "official-outline", "yuho-2026"],
    },
    {
      year: 1980,
      title: "アメリカに現地法人を設立",
      description:
        "アメリカ・ニューヨーク州に現地法人Nintendo of America Inc.を設立した。1982年にワシントン州で新たに設立した同名の法人がこれを吸収合併し、現在の[[term:consolidated-subsidiary|連結子会社]]となっている。",
      significance:
        "Nintendo of America Inc.は今もグループの主な販売会社のひとつ。2026年3月期は米大陸の売上高が9,352億円で、日本・欧州などを上回る最大の地域だった。",
      sourceIds: ["yuho-2026", "official-history"],
    },
    {
      year: 1983,
      title: "ファミリーコンピュータを発売",
      description:
        "家庭用テレビゲーム機「ファミリーコンピュータ」を発売した。同じ年に東京証券取引所市場第一部に上場し、京都府宇治市に宇治工場を設けた。",
      significance:
        "公式の沿革では、この後もスーパーファミコン（1990年）、Wii（2006年）、Nintendo Switch（2017年）などの家庭用テレビゲーム機が続く。ゲーム機とソフトからなる「ゲーム専用機」は、2026年3月期の売上高の9割以上を占める。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 2016,
      title: "スマートデバイス向けアプリを配信",
      description: "スマートデバイス向けアプリ『Miitomo』を配信した。",
      significance:
        "モバイルアプリは、任天堂が「ゲーム専用機ビジネスの枠外の分野」として挙げるもののひとつ。今も『ファイアーエムブレム ヒーローズ』などのゲームアプリを運営しており、スマートデバイス向けの課金収入は「IP関連収入等」に含まれる。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 2017,
      title: "Nintendo Switchを発売",
      description: "持ち運べる家庭用テレビゲーム機「Nintendo Switch」を発売した。",
      significance:
        "2026年3月に発売から10年目を迎え、2026年3月期もNintendo Switchのソフトは1億3,691万本売れた。後継機のNintendo Switch 2でもNintendo Switchのソフトを遊べる。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 2023,
      title: "マリオの映画が公開",
      description:
        "任天堂が制作に携わる初のアニメ映画『ザ・スーパーマリオブラザーズ・ムービー』が公開された。",
      significance:
        "任天堂は有価証券報告書で映像ビジネスを「一層重要な位置づけ」と述べ、2026年4月公開の『ザ・スーパーマリオギャラクシー・ムービー』の制作にも携わっている。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 2025,
      title: "Nintendo Switch 2を発売",
      description:
        "Nintendo Switchの後継機種となる家庭用テレビゲーム機「Nintendo Switch 2」を6月に発売した。",
      significance:
        "任天堂はNintendo Switchの普及基盤を引き継ぐ後継機種と位置づけている。発売した2026年3月期に1,986万台を販売した。",
      sourceIds: ["official-history", "yuho-2026"],
    },
  ],

  relatedCompanies: [],

  sources: [
    {
      id: "yuho-2026",
      title: "第86期 有価証券報告書（2025年4月1日〜2026年3月31日）",
      publisher: "任天堂株式会社",
      url: "https://www.nintendo.co.jp/ir/pdf/2026/security_q2603.pdf",
      publishedAt: "2026-06-25",
      accessedAt: "2026-09-14",
    },
    {
      id: "tanshin-2026",
      title: "2026年3月期 決算短信〔日本基準〕(連結)",
      publisher: "任天堂株式会社",
      url: "https://www.nintendo.co.jp/ir/pdf/2026/260508.pdf",
      publishedAt: "2026-05-08",
      accessedAt: "2026-09-14",
    },
    {
      id: "yuho-2025",
      title: "第85期 有価証券報告書（2024年4月1日〜2025年3月31日）",
      publisher: "任天堂株式会社",
      url: "https://www.nintendo.co.jp/ir/pdf/2025/security_q2503.pdf",
      publishedAt: "2025-06-26",
      accessedAt: "2026-09-14",
    },
    {
      id: "official-history",
      title: "会社情報：会社の沿革",
      publisher: "任天堂株式会社",
      url: "https://www.nintendo.co.jp/corporate/history/index.html",
      accessedAt: "2026-09-14",
    },
    {
      id: "official-outline",
      title: "会社情報：会社概要",
      publisher: "任天堂株式会社",
      url: "https://www.nintendo.co.jp/corporate/outline/index.html",
      accessedAt: "2026-09-14",
    },
  ],

  status: { state: "published" },
  revisions: [
    {
      date: "2026-09-14",
      kind: "ai-generated",
      summary:
        "第86期有価証券報告書、2026年3月期決算短信、第85期有価証券報告書、任天堂公式サイト（会社の沿革・会社概要）に基づきAIが作成",
    },
  ],

  updatedAt: "2026-09-14",
};
