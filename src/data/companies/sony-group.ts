import type { Company } from "@/types/company";

/**
 * ソニーグループ (6758). Research log: docs/research/sony-group.md
 *
 * The one thing a future editor must not miss: the financial business is GONE.
 * Sony executed a partial spin-off of ソニーフィナンシャルグループ on 2025-10-01
 * (有報 2025年度 p.5–6, 注記33 p.257) and the latest 有報 reports it as 非継続事業,
 * removed from the reportable segments (p.158). So `businesses` has no finance
 * node, and the five-year financial table is NOT one consistent series — see the
 * comment on `financials` and each year's `revenueBasis`.
 *
 * `children` exist because the company itself breaks each segment into named
 * sub-businesses with their own external revenue (事業の内容 p.8, 製品カテゴリー別
 * 売上高内訳 p.162–163). I&SS has a single category, so it has no children.
 */
export const sonyGroup: Company = {
  id: "sony-group",
  code: "6758",
  name: "ソニーグループ",
  officialName: "ソニーグループ株式会社",
  nameEn: "SONY GROUP CORPORATION",
  // Not "SONY": since 2021 ソニー株式会社 (Sony Corporation) is a DIFFERENT company —
  // the electronics subsidiary that inherited the old name (有報 p.5, p.10). A bare
  // "SONY" wordmark would point a beginner at it. "SONY GROUP" is also exactly the
  // English 商号 minus the legal suffix.
  shortNameEn: "SONY GROUP",
  description:
    "プレイステーションのゲーム、音楽、映画を世界に届け、カメラやテレビなどの電子機器とイメージセンサーもつくる会社。",
  // 有報 p.54 lists 東京・ニューヨーク; `Listing` can only express Japanese
  // exchanges, so the NYSE listing is recorded in the log rather than dropped silently.
  listings: [{ exchange: "tse", market: "プライム" }],

  industries: [
    { industryId: "entertainment", primary: true },
    { industryId: "electronics" },
    { industryId: "semiconductors" },
  ],

  // Ordered by 2026年3月期 セグメント売上高 (セグメント間取引消去前, 有報 p.159):
  // G&NS 4,685,651 > ET&S 2,260,532 > I&SS 2,151,533 > 音楽 2,120,110 > 映画 1,499,290
  // > その他 89,072 (百万円). On external-customer revenue alone 音楽 (2,090,534) would
  // sit above I&SS (2,059,020); the segment figure is the one Sony itself reports
  // per 分野 (p.35), so it decides. Children are ordered by their own external
  // revenue (p.162) — figures in the log.
  businesses: [
    {
      id: "game-network-services",
      name: "ゲーム＆ネットワークサービス",
      shortName: "ゲーム",
      description:
        "家庭用ゲーム機「PS5」などのハードウェアと、ネットワークを通じて販売するゲームソフトや追加コンテンツ、PS Plusなどのネットワークサービスを提供する。",
      products: [
        "PS5などの家庭用ゲーム機",
        "ゲームソフトウェア・アドオンコンテンツ",
        "PS Plusなどのネットワークサービス",
        "周辺機器",
      ],
      customers: [
        "プレイステーションのユーザー",
        "ゲーム機やソフトウェアディスクを扱う小売事業者・販売業者",
        "プラットフォームライセンスを受けるゲームの開発・販売事業者",
      ],
      children: [
        {
          id: "digital-software-add-on-content",
          name: "デジタルソフトウェア・アドオンコンテンツ",
          shortName: "デジタルソフト",
          description: "ネットワークを通じて販売するゲームソフトウェアと、追加で購入するアドオンコンテンツ。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "hardware-other",
          name: "ハードウェア・その他",
          description:
            "家庭用ゲーム機、パッケージソフトウェア、周辺機器、外部のプラットフォーム向けに自社で制作したソフトウェアなど。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "game-network-services-network",
          name: "ネットワークサービス",
          description: "PS Plusなど、ゲーム・ビデオ・音楽コンテンツに関連するネットワークサービス。",
          sourceIds: ["yuho-2026"],
        },
      ],
      sourceIds: ["yuho-2026", "tanshin-2027-q1"],
    },
    {
      id: "entertainment-technology-services",
      name: "エンタテインメント・テクノロジー＆サービス",
      // The company's own site navigation labels this segment
      // 「エレクトロニクス製品：エンタテインメント・テクノロジー&サービス」.
      shortName: "エレクトロニクス",
      description:
        "レンズ交換式カメラなどの映像制作機器、テレビ、ヘッドホン、スマートフォンなどのエレクトロニクス製品をつくって販売し、インターネット関連サービスも提供する。",
      products: [
        "レンズ交換式カメラ・交換レンズ",
        "液晶テレビ・有機ELテレビ・プロジェクター",
        "ヘッドホン・ワイヤレススピーカー",
        "スマートフォン",
        "家庭用オーディオ製品",
        "医療用機器",
        "スポーツ審判支援・コンテンツ制作支援サービス",
        "インターネット関連サービス",
      ],
      children: [
        {
          id: "imaging",
          name: "イメージング",
          description: "レンズ交換式カメラや交換レンズを含む映像制作機器と、そのソリューション。",
          sourceIds: ["yuho-2026"],
        },
        {
          // Named 「その他」 by the company, but it states what is in it (p.163).
          id: "entertainment-technology-services-other",
          name: "その他",
          description:
            "スマートフォン、家庭用オーディオ製品、医療用機器、スポーツ審判支援やコンテンツ制作支援のサービスなど。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "display",
          name: "ディスプレイ",
          description: "液晶テレビ、有機ELテレビ、プロジェクターなどのディスプレイ製品。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "sound",
          name: "サウンド",
          description: "ヘッドホンとワイヤレススピーカー。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "entertainment-technology-services-network",
          name: "ネットワークサービス",
          description: "インターネット関連サービス。",
          sourceIds: ["yuho-2026"],
        },
      ],
      sourceIds: ["yuho-2026", "tanshin-2027-q1", "official-history"],
    },
    {
      id: "imaging-sensing-solutions",
      name: "イメージング＆センシング・ソリューション",
      shortName: "イメージセンサー",
      description:
        "スマートフォンなどのモバイル機器向けを中核に、カメラ、産業・社会インフラ、自動車向けの[[term:image-sensor|イメージセンサー]]をつくって販売する。一部はグループ内のゲームやエレクトロニクスの会社にも供給している。",
      products: [
        "モバイル機器向けイメージセンサー",
        "カメラ向け・産業・社会インフラ向けイメージセンサー",
        "車載向けイメージセンサー",
      ],
      sourceIds: ["yuho-2026", "tanshin-2027-q1"],
    },
    {
      id: "music",
      name: "音楽",
      description:
        "アーティストの音楽を制作してストリーミングやパッケージなどで販売し、楽曲の管理・ライセンス（音楽出版）や、アニメーション作品・ゲームアプリの制作・販売も行う。",
      products: [
        "音楽（ストリーミング・パッケージ・ダウンロード）",
        "アーティストのライブ・物販",
        "アニメーション作品",
        "ゲームアプリケーション",
      ],
      customers: ["デジタルストリーミングサービス", "CDなどを扱う販売業者"],
      children: [
        {
          id: "recorded-music",
          name: "音楽制作",
          description:
            "ストリーミング・パッケージ・ダウンロードによる音楽の販売と、アーティストのライブや物販からの収入。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "music-publishing",
          name: "音楽出版",
          description: "楽曲の詞や曲を管理し、その利用をライセンスする。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "visual-media-platform",
          name: "映像メディア・プラットフォーム",
          description: "アニメーション作品やゲームアプリケーションの制作・販売と、音楽・映像関連商品のサービス提供。",
          sourceIds: ["yuho-2026"],
        },
      ],
      sourceIds: ["yuho-2026", "tanshin-2027-q1"],
    },
    {
      id: "pictures",
      name: "映画",
      description:
        "実写とアニメーションの映画、テレビ番組を製作・制作して配給・販売し、テレビネットワークや、アニメ配信のCrunchyrollなどのDTC配信サービスを運営する。",
      products: ["実写映画・アニメーション映画", "テレビ番組", "テレビネットワーク", "DTC配信サービス（Crunchyroll、SonyLIVなど）"],
      customers: ["映画館運営会社", "ケーブル・衛星・インターネットなどの配信事業者", "Crunchyrollの有料会員"],
      children: [
        {
          id: "television-productions",
          name: "テレビ番組制作",
          description: "テレビ番組の制作・買付・販売。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "motion-pictures",
          name: "映画製作",
          description: "実写とアニメーションの映画作品の、全世界での製作・買付・配給・販売。",
          sourceIds: ["yuho-2026"],
        },
        {
          id: "media-networks",
          name: "メディアネットワーク",
          description:
            "テレビネットワークと、DTC（消費者に直接届ける）配信サービスの運営。アニメ配信のCrunchyrollもここに含まれる。",
          sourceIds: ["yuho-2026"],
        },
      ],
      sourceIds: ["yuho-2026", "tanshin-2027-q1"],
    },
    {
      id: "other",
      name: "その他",
      description: "ディスク製造や記録メディアなど、ほかの分野に含まれない事業。",
      sourceIds: ["yuho-2026", "tanshin-2027-q1"],
    },
  ],

  businessModel: {
    description:
      "ゲーム、音楽、映画などのエンタテインメントと、カメラやテレビなどのエレクトロニクス製品、イメージセンサーを世界中で提供し、製品の販売代金、サービスの利用料、作品のライセンス収入などを得ている。",
    products: [
      "PS5などの家庭用ゲーム機",
      "ゲームソフトウェア",
      "PS Plusなどのネットワークサービス",
      "音楽",
      "映画・テレビ番組",
      "アニメーション作品",
      "カメラ・テレビ・ヘッドホンなどのエレクトロニクス製品",
      "イメージセンサー",
    ],
    customers: [
      "プレイステーションのユーザー",
      "製品を扱う卸売事業者・小売事業者・販売業者",
      "ゲームの開発・販売事業者",
      "デジタルストリーミングサービス",
      "映画館運営会社",
      "ケーブル・衛星・インターネットなどの配信事業者",
      "イメージセンサーなどの部品を買う顧客",
    ],
    revenueSources: [
      "ゲーム機・周辺機器・ソフトウェアディスクの販売",
      "オンラインで販売するデジタルゲームコンテンツ",
      "PS Plusなどサブスクリプション方式のサービス",
      "ゲームの開発・販売事業者から受け取るプラットフォームライセンス収入",
      "ストリーミングサービスからの音楽の収入（売上高や使用量にもとづくロイヤルティなど）",
      "CDなどの販売と、アーティストのライブ・物販",
      "楽曲の詞・曲の管理とライセンス",
      "映画の劇場公開による収入",
      "映画・テレビ番組の放映ライセンスとデジタル配信による収入",
      "テレビ広告収入と、テレビネットワーク・DTC配信サービスの料金",
      "カメラ、テレビ、ヘッドホンなどのエレクトロニクス製品とイメージセンサーの販売",
      "インターネット関連サービスの利用料",
    ],
    flow: [
      {
        kind: "company",
        title: "ソニーグループ",
        description:
          "グループ本社のソニーグループ株式会社の下で、ゲーム、音楽、映画、エレクトロニクス、イメージセンサーの各事業をそれぞれの会社が担う。",
      },
      {
        kind: "offering",
        title: "エンタテインメントと製品・部品",
        description:
          "PS5やゲームソフト、PS Plusなどのネットワークサービス、音楽、映画・テレビ番組・アニメ、カメラやテレビ・ヘッドホンなどのエレクトロニクス製品、イメージセンサー。",
      },
      {
        kind: "customer",
        title: "世界中のユーザーと取引先",
        description:
          "ゲームのユーザー、製品を扱う販売店、ストリーミングサービス、映画館や配信事業者など。2026年3月期の売上高を顧客の所在地別に見ると、米国が最も大きい。",
      },
      {
        kind: "revenue",
        title: "販売・利用料・ライセンス",
        description:
          "製品の販売代金、サブスクリプションなどの利用料、音楽や映画・テレビ番組のライセンス収入、テレビ広告収入などが売上になる。",
      },
      {
        kind: "profit",
        title: "分野ごとの営業利益",
        description:
          "売上から、製品やコンテンツをつくる費用や販売・管理の費用などを差し引いて営業利益を計算する。2026年3月期の分野別の営業利益は、ゲーム＆ネットワークサービス、音楽、イメージング＆センシング・ソリューションの順に大きかった。",
      },
    ],
    sourceIds: ["yuho-2026"],
  },

  // 有報 2025年度 p.1「主要な経営指標等の推移 (1) 連結経営指標等」, 百万円 × 1,000,000.
  // Labels verbatim from that table. The revenue row is NOT one basis across the
  // five years (注5, p.1; 2023年度有報 注4, p.1):
  //   2022年3月期  — includes the financial business (as originally reported under IFRS)
  //   2023年3月期  — includes the financial business, 修正再表示 under IFRS第17号
  //   2024–2026年3月期 — continuing operations only; financial business excluded
  // `revenueBasis` is the SCOPE, so the IFRS第17号 restatement of 2023年3月期 (a change of
  // measurement, not of what is covered) stays in the 「金融事業を含む」 bucket; its `note`
  // says so instead. Net income attributable to Sony's shareholders includes discontinued
  // operations in every year; 2026年3月期 is negative because of the spin-off accounting
  // (注記33) — explained by that year's `note`.
  financials: [
    {
      fiscalYear: "2022年3月期",
      periodEnd: "2022-03-31",
      revenue: 9_921_513_000_000,
      revenueLabel: "売上高及び金融ビジネス収入",
      netIncome: 882_178_000_000,
      netIncomeLabel: "当社株主に帰属する当期純利益（損失）",
      currency: "JPY",
      accountingStandard: "ifrs",
      revenueBasis: "金融事業を含む",
      netIncomeBasis: "金融事業を含む",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2023年3月期",
      periodEnd: "2023-03-31",
      revenue: 10_974_373_000_000,
      revenueLabel: "売上高及び金融ビジネス収入",
      netIncome: 1_005_277_000_000,
      netIncomeLabel: "当社株主に帰属する当期純利益（損失）",
      currency: "JPY",
      accountingStandard: "ifrs",
      revenueBasis: "金融事業を含む",
      netIncomeBasis: "金融事業を含む",
      note: "保険契約の会計基準（IFRS第17号）の適用にともない、修正再表示した値。",
      sourceIds: ["yuho-2026", "yuho-2024"],
    },
    {
      fiscalYear: "2024年3月期",
      periodEnd: "2024-03-31",
      revenue: 11_260_037_000_000,
      revenueLabel: "売上高及び金融ビジネス収入",
      netIncome: 970_573_000_000,
      netIncomeLabel: "当社株主に帰属する当期純利益（損失）",
      currency: "JPY",
      accountingStandard: "ifrs",
      revenueBasis: "金融事業を含まない（非継続事業として除外）",
      netIncomeBasis: "金融事業を含む",
      sourceIds: ["yuho-2026"],
    },
    {
      fiscalYear: "2025年3月期",
      periodEnd: "2025-03-31",
      revenue: 12_034_917_000_000,
      revenueLabel: "売上高及び金融ビジネス収入",
      netIncome: 1_141_600_000_000,
      netIncomeLabel: "当社株主に帰属する当期純利益（損失）",
      currency: "JPY",
      accountingStandard: "ifrs",
      revenueBasis: "金融事業を含まない（非継続事業として除外）",
      netIncomeBasis: "金融事業を含む",
      sourceIds: ["yuho-2026", "tanshin-2026"],
    },
    {
      fiscalYear: "2026年3月期",
      periodEnd: "2026-03-31",
      revenue: 12_479_620_000_000,
      revenueLabel: "売上高及び金融ビジネス収入",
      netIncome: -326_865_000_000,
      netIncomeLabel: "当社株主に帰属する当期純利益（損失）",
      currency: "JPY",
      accountingStandard: "ifrs",
      revenueBasis: "金融事業を含まない（非継続事業として除外）",
      netIncomeBasis: "金融事業を含む",
      note: "金融事業のスピンオフにともない、金融事業の累積その他の包括利益を損失に振り替えたことによる赤字で、継続事業の当社株主に帰属する純利益は黒字だった。",
      sourceIds: ["yuho-2026", "tanshin-2026"],
    },
  ],

  history: [
    {
      year: 1946,
      title: "東京通信工業を設立",
      description:
        "井深大と盛田昭夫が、東京・日本橋で東京通信工業株式会社を設立した。電気通信機と測定器の研究・製作を目的とする会社で、1958年に社名をソニーに変えた。",
      significance:
        "公式の沿革は、エレクトロニクスをソニーグループの「祖業」としている。2021年にはその事業がソニー株式会社の名前を受け継ぎ、ソニー株式会社は今、カメラやテレビなどを扱うエンタテインメント・テクノロジー＆サービス分野の主要会社になっている。",
      sourceIds: ["yuho-2026", "official-history"],
    },
    {
      year: 1968,
      title: "CBS・ソニーレコードを設立",
      description:
        "米国CBSとの合弁で、日本にCBS・ソニーレコード株式会社を設立した（ソニーの出資は50％）。1988年にソニーの100％出資となった。",
      significance:
        "1991年にソニー・ミュージックエンタテインメントへ社名を変え、今も音楽分野の主要会社のひとつになっている。",
      sourceIds: ["yuho-2026", "official-history"],
    },
    {
      year: 1980,
      title: "CCDイメージセンサーを商品化",
      description: "CCDイメージセンサーを開発し、商品化した。",
      significance:
        "イメージセンサーは今、イメージング＆センシング・ソリューション分野の主な事業で、スマートフォンなどのモバイル機器向けがその中核になっている。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 1989,
      title: "米国のコロンビア・ピクチャーズを買収",
      description:
        "米国のColumbia Pictures Entertainment, Inc.を買収した。1991年にSony Pictures Entertainment Inc.へ社名を変えた。",
      significance:
        "Sony Pictures Entertainment Inc.は今も映画分野の主要会社。映画分野は映画のほか、テレビ番組の制作や、アニメ配信のCrunchyrollなども手がける。",
      sourceIds: ["yuho-2026", "official-history"],
    },
    {
      year: 1993,
      title: "ソニー・コンピュータエンタテインメントを設立",
      description:
        "ソニー・コンピュータエンタテインメントを設立した。同社は翌1994年、家庭用ゲーム機PlayStationを日本で発売した。",
      significance:
        "同社は2016年にソニー・インタラクティブエンタテインメントへ社名を変え、今もゲーム＆ネットワークサービス分野の主要会社。この分野は2026年3月期、ソニーのセグメントの中で売上高が最も大きかった。",
      sourceIds: ["yuho-2026", "official-history"],
    },
    {
      year: 2021,
      title: "ソニーグループ株式会社に社名変更",
      description:
        "グループ本社機能に特化した会社とするため、ソニー株式会社からソニーグループ株式会社に社名を変えた。あわせて、ソニーエレクトロニクス株式会社など4社が統合し、新しいソニー株式会社として営業を始めた。",
      significance:
        "公式の沿革によると、このときソニーグループ株式会社の下で、ゲーム＆ネットワークサービス、音楽、映画、エレクトロニクス・プロダクツ＆ソリューション、イメージング＆センシング・ソリューション、金融の6つの事業会社に再編された。グループ本社の下で事業ごとの会社がそれぞれの事業を担う、今の体制はここから始まった（金融は2025年に連結から外れた）。",
      sourceIds: ["yuho-2026", "official-history"],
    },
    {
      year: 2025,
      title: "金融事業をパーシャル・スピンオフ",
      description:
        "金融事業を営むソニーフィナンシャルグループの株式を9月に東京証券取引所プライム市場へ上場させ、10月にその株式を株主に分配した。同社はソニーの[[term:consolidated-subsidiary|連結子会社]]から外れた。",
      significance:
        "金融事業は報告セグメントから外れ、今のソニーはゲーム、音楽、映画、エレクトロニクス、イメージセンサーなどの分野で構成される。このとき金融事業で計上していた累積その他の包括利益を損失に振り替えたため、2026年3月期の当社株主に帰属する当期純利益はマイナスになった（継続事業の損益や資本合計、キャッシュ・フローへの影響はない）。",
      sourceIds: ["yuho-2026", "tanshin-2026"],
    },
  ],

  relatedCompanies: [],

  sources: [
    {
      id: "yuho-2026",
      title: "有価証券報告書（2025年度：2025年4月1日〜2026年3月31日）",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/IR/library/r7_q4.pdf",
      publishedAt: "2026-06-18",
      accessedAt: "2026-09-14",
    },
    {
      id: "tanshin-2026",
      title: "2026年3月期 決算短信〔IFRS〕（連結）",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/IR/library/presen/er/pdf/25q4_sony.pdf",
      publishedAt: "2026-05-08",
      accessedAt: "2026-09-14",
    },
    {
      id: "yuho-2025",
      title: "有価証券報告書（2024年度：2024年4月1日〜2025年3月31日）",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/IR/library/r6_q4.pdf",
      publishedAt: "2025-06-20",
      accessedAt: "2026-09-13",
    },
    {
      id: "yuho-2024",
      title: "有価証券報告書（2023年度：2023年4月1日〜2024年3月31日）",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/IR/library/r5_q4.pdf",
      publishedAt: "2024-06-25",
      accessedAt: "2026-09-13",
    },
    {
      // Used only to record the 2023年3月期 figures as originally reported, before
      // the IFRS第17号 restatement (research log). Not cited by any section, on
      // purpose: its 2023年3月期 numbers differ from the stored ones.
      id: "yuho-2023",
      title: "有価証券報告書（2022年度：2022年4月1日〜2023年3月31日）",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/IR/library/r4_q4.pdf",
      publishedAt: "2023-06-20",
      accessedAt: "2026-09-13",
    },
    {
      id: "tanshin-2027-q1",
      title: "2027年3月期 第1四半期決算短信〔IFRS〕（連結）",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/IR/library/presen/er/pdf/26q1_sony.pdf",
      publishedAt: "2026-07-31",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-history",
      title: "会社沿革",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/CorporateInfo/History/company/",
      accessedAt: "2026-09-14",
    },
  ],

  // Was needs-attention only because the scope break and the 2026年3月期 loss could not be
  // expressed; `revenueBasis` and `note` now carry both, and every figure is verified.
  status: { state: "published" },
  revisions: [
    {
      date: "2026-09-14",
      kind: "ai-generated",
      summary:
        "2025年度・2024年度・2023年度・2022年度有価証券報告書、2026年3月期決算短信、2027年3月期第1四半期決算短信、ソニーグループ公式サイト（会社沿革）に基づきAIが作成",
    },
  ],

  updatedAt: "2026-09-14",
};
