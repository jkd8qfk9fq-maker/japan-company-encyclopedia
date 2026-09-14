import type { Company } from "@/types/company";

/**
 * 東京エレクトロン (8035).
 *
 * Every figure and claim below is traced, page by page, in
 * `docs/research/tokyo-electron.md`. Page numbers there are the printed page
 * numbers of the PDF (the "- n -" footer), not PDF page indices.
 *
 * Three things here are easy to "fix" wrongly, so they are called out:
 *
 * - There is exactly ONE top-level business. The 有報 states TEL is
 *   「半導体製造装置」の単一セグメント (2026 p.5, p.126; also 2025 有報 and the
 *   2027年3月期 1Q 決算短信). No FPD or other segment is invented from older
 *   knowledge of the company.
 * - The net-income row is 親会社株主に帰属する当期純利益, NOT 包括利益. In
 *   `pdftotext -layout` output of p.2 the 包括利益 figures (486,183 …
 *   624,335) sit next to the net-income label. Values were read in `-raw` and
 *   `-table` modes, which agree, and were checked against the 2025 有報, the
 *   決算短信 and the consolidated income statement (p.81).
 * - The children of 新規装置 are listed in the order the company itself lists
 *   them (有報 p.26, 決算説明会資料 p.26), not by size: the only per-product
 *   figures are chart percentages that could not be tied to their series from
 *   the extracted text.
 */
export const tokyoElectron: Company = {
  id: "tokyo-electron",
  code: "8035",
  name: "東京エレクトロン",
  officialName: "東京エレクトロン株式会社",
  nameEn: "Tokyo Electron Limited",
  // The English 商号 minus the legal suffix "Limited".
  shortNameEn: "TOKYO ELECTRON",
  description:
    "半導体をつくるための製造装置を開発・製造して世界の半導体メーカーに販売し、納入した装置の保守や改造も手がける会社。",
  listings: [{ exchange: "tse", market: "プライム" }],

  industries: [{ industryId: "semiconductors", primary: true }],

  // One reportable segment (有報 p.5). Its children follow the company's own
  // split of revenue in 収益認識関係 (p.123): 新規装置 1,817,250 > フィールド
  // ソリューション他 626,282 百万円 (2026年3月期). The product lines under
  // 新規装置 are the ones the company names in 研究開発活動 (p.26) and in the
  // 決算説明会資料's product breakdown (p.26); what each one does is written
  // only as far as TEL's product page and glossary explain it.
  businesses: [
    {
      id: "semiconductor-production-equipment",
      name: "半導体製造装置",
      description:
        "半導体をつくる工場で使う製造装置を開発・製造・販売し、納入した装置の保守サービスも行っています。東京エレクトロンの事業は、この「半導体製造装置」の1つのセグメントだけで構成されています。",
      customers: [
        "半導体メーカー",
        "Samsung Electronics Co., Ltd.",
        "Taiwan Semiconductor Manufacturing Company Ltd.",
      ],
      sourceIds: ["yuho-2026", "tanshin-2027-q1"],
      children: [
        {
          id: "new-equipment",
          name: "新規装置",
          description:
            "新しい半導体製造装置を販売し、お客さまの工場に設置して、仕様に合わせて性能を十分に発揮できるよう調整します。決算説明会資料では、半導体製造装置の新規装置の売上を、用途別に「DRAM」「不揮発性メモリ」「非メモリ（ロジック、ファウンドリ、その他）」に分けて示しています。",
          customers: ["半導体メーカー"],
          sourceIds: ["yuho-2026", "presentation-2026"],
          children: [
            {
              id: "coater-developer",
              name: "コータ/デベロッパ",
              shortName: "塗布現像",
              description:
                "ウェーハ（半導体チップのもとになる円い板）に、光に反応する樹脂（フォトレジスト）を均一に塗り、露光機で回路の模様を写したあと、現像液で一部を溶かして取り除き、回路の模様をつくります。このうち「塗る」と「現像する」を担う塗布現像装置です。",
              sourceIds: [
                "official-products",
                "glossary-silicon-wafer",
                "glossary-photoresist",
                "yuho-2026",
                "presentation-2026",
              ],
            },
            {
              id: "etch",
              name: "エッチング装置",
              shortName: "エッチング",
              description:
                "塗布・露光・現像でつくった回路の模様に沿って、ウェーハの上の膜を削る装置です。",
              sourceIds: ["official-products", "yuho-2026", "presentation-2026"],
            },
            {
              id: "deposition",
              name: "成膜装置",
              shortName: "成膜",
              description:
                "ウェーハの表面に、素子や配線の材料になる絶縁膜（電気を通さない膜）や金属膜などの、ごく薄い膜をつくる装置です。",
              sourceIds: [
                "official-products",
                "official-about-semiconductor",
                "yuho-2026",
                "presentation-2026",
              ],
            },
            {
              id: "cleaning",
              name: "洗浄装置",
              shortName: "洗浄",
              description:
                "製造の工程と工程の間で、回路の上の異物などを取り除き、欠陥ができるのを防ぐ装置です。",
              sourceIds: ["official-products", "yuho-2026", "presentation-2026"],
            },
            {
              id: "wafer-prober",
              name: "ウェーハプローバ",
              shortName: "プローバ",
              description:
                "ウェーハの上にできたチップが良品かどうかを確かめるテスト（検査）に使う装置です。",
              sourceIds: ["official-products", "yuho-2026", "presentation-2026"],
            },
          ],
        },
        {
          // The 有報 table labels this row フィールドソリューション他 (p.123) and
          // calls the business フィールドソリューションサービス (p.124); the
          // company's service page and results materials use
          // フィールドソリューション. shortName is the product site's own
          // navigation label for this area, サービス.
          id: "field-solutions",
          name: "フィールドソリューション",
          shortName: "サービス",
          description:
            "すでに納入した装置に向けて、保守用の部品やサービス、装置の改造（新しい機能を加えるアップグレード）を提供し、中古装置も販売しています。",
          products: ["エンジニアリングサービス", "スペアパーツ・リペア", "改造", "中古装置"],
          customers: ["半導体メーカー"],
          sourceIds: ["yuho-2026", "official-service"],
        },
      ],
    },
  ],

  businessModel: {
    description:
      "半導体をつくる製造装置を開発・製造して半導体メーカーに販売し、お客さまの工場での設置と調整まで行います。納入した装置には保守用部品やサービス、改造を提供し、中古装置も販売して収益を得ています。",
    products: [
      "コータ/デベロッパ（塗布現像装置）",
      "エッチング装置",
      "成膜装置",
      "洗浄装置",
      "ウェーハプローバ",
      "保守用部品・サービス",
      "装置の改造",
      "中古装置",
    ],
    customers: [
      "半導体メーカー",
      "Samsung Electronics Co., Ltd.",
      "Taiwan Semiconductor Manufacturing Company Ltd.",
    ],
    revenueSources: [
      "新規装置の販売と、装置の設置に関連する作業",
      "納入済み装置への保守用部品・サービス・装置改造の提供",
      "中古装置の販売",
    ],
    flow: [
      {
        kind: "company",
        title: "東京エレクトロン",
        description:
          "東京エレクトロン テクノロジーソリューションズ、東京エレクトロン九州、東京エレクトロン宮城などの子会社がつくった装置を、東京エレクトロンが仕入れて販売します。保守サービスは東京エレクトロンFEや海外の子会社などが行います。",
      },
      {
        kind: "offering",
        title: "半導体製造装置とサービス",
        description:
          "成膜・塗布現像・エッチング・洗浄・テストなどの工程で使う装置と、納入した装置への保守用部品、サービス、改造を提供します。",
      },
      {
        kind: "customer",
        title: "世界の半導体メーカー",
        description:
          "2026年3月期の海外売上高の比率は90.2%です。売上高のうちSamsung Electronics Co., Ltd.向けが15.1%、Taiwan Semiconductor Manufacturing Company Ltd.向けが12.9%でした（同じ企業グループ向けを含む）。",
      },
      {
        kind: "revenue",
        title: "売上高",
        description:
          "2026年3月期の売上高2兆4,435億円のうち、新規装置が1兆8,172億円、フィールドソリューション他（保守用部品・サービス・改造・中古装置など）が6,262億円でした。",
      },
      {
        kind: "profit",
        title: "利益",
        description:
          "2026年3月期の親会社株主に帰属する当期純利益は5,744億円でした。会社は、利益を次の成長投資につなげ、中長期的な利益の拡大をめざすとしています。",
      },
    ],
    sourceIds: ["yuho-2026", "official-products", "official-service"],
  },

  // Source: 有報 2026年3月期 p.2「主要な経営指標等の推移 (1) 連結経営指標等」.
  // Values printed in 百万円, converted × 1,000,000. All five years J-GAAP
  // (p.78; 決算短信 title 〔日本基準〕). The 2025 有報 prints identical values
  // for 2022–2025, so no year was restated. Revenue scope is consistent
  // (single segment in both filings; 連結範囲の重要な変更 無), so no
  // `revenueBasis`.
  financials: [
    {
      fiscalYear: "2022年3月期",
      periodEnd: "2022-03-31",
      revenue: 2_003_805_000_000,
      revenueLabel: "売上高",
      netIncome: 437_076_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2023年3月期",
      periodEnd: "2023-03-31",
      revenue: 2_209_025_000_000,
      revenueLabel: "売上高",
      netIncome: 471_584_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2024年3月期",
      periodEnd: "2024-03-31",
      revenue: 1_830_527_000_000,
      revenueLabel: "売上高",
      netIncome: 363_963_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2025年3月期",
      periodEnd: "2025-03-31",
      revenue: 2_431_568_000_000,
      revenueLabel: "売上高",
      netIncome: 544_133_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      sourceIds: ["yuho-2026", "yuho-2025", "tanshin-2026"],
    },
    {
      fiscalYear: "2026年3月期",
      periodEnd: "2026-03-31",
      revenue: 2_443_533_000_000,
      revenueLabel: "売上高",
      netIncome: 574_454_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益",
      currency: "JPY",
      accountingStandard: "jgaap",
      // No amount and no causal claim: the 有報 says the 特別利益 came mainly
      // from this sale (p.24); it does not say how much of the rise in net
      // income it explains.
      note: "この年の純利益には、取引先などとの関係のために持っていた他社の株式（政策保有株式）の一部を売って計上した投資有価証券売却益が含まれています。",
      sourceIds: ["yuho-2026", "tanshin-2026"],
    },
  ],

  history: [
    {
      year: 1963,
      title: "東京エレクトロン研究所を設立",
      description:
        "株式会社東京放送の関係会社として、東京都港区に株式会社東京エレクトロン研究所を設立しました。VTRやカーラジオなどの輸出と電子機器の輸入を始め、拡散炉やIC製造機器の納入・販売も始めています。",
      significance:
        "現在の東京エレクトロンの出発点です。会社は自らの歩みを「技術専門商社からスタートし、開発製造機能をもつメーカーへの移行」などと説明しています。",
      sourceIds: ["yuho-2026", "official-history"],
    },
    {
      year: 1968,
      title: "拡散炉の国内生産を始める",
      description:
        "米国サームコ社との合弁会社テル・サームコを設立し、1964年から輸入して販売していた拡散炉の国内生産を始めました。",
      significance:
        "輸入して売っていた装置を、国内の合弁会社で生産するようになりました。テル・サームコは社名変更と合併を重ね、現在装置の製造・開発を担う東京エレクトロン テクノロジーソリューションズにつながっています。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 1986,
      title: "半導体製造装置の輸出を始める",
      description:
        "半導体製造装置の海外への輸出を始めました。同じ年、山梨県韮崎市に総合研究所が完成しています。",
      significance:
        "装置の輸出はこの年に始まりました。2026年3月期には、売上高の90.2%を海外売上高が占めています。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 1994,
      title: "欧州に現地法人を設立",
      description:
        "欧州（英国）に現地法人Tokyo Electron Europe Ltd.を設立しました。会社はこの年を「グローバリゼーション元年」としています。",
      significance:
        "1990年代、成長し始めた世界市場で直接販売・サポートする体制づくりを進め、各国に現地法人を設けました。Tokyo Electron Europe Ltd.は今も装置の販売や保守サービスを担っています。",
      sourceIds: ["yuho-2026", "official-history"],
    },
    {
      year: 1999,
      title: "東証での業種が「電気機器」に",
      description: "東京証券取引所第一部での業種が、「商業」から「電気機器」に変更されました。",
      significance:
        "技術専門商社として始まった会社が、上場する業種の区分でも「商業」から「電気機器」に移りました。会社は自らの歩みを「開発製造機能をもつメーカーへの移行」と説明しています。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 2015,
      title: "経営統合を解消し、「新生TEL」として再出発",
      description:
        "2013年に米国Applied Materials, Inc.と結んだ経営統合契約を、2015年に解消しました。同じ年に「新生TEL」として再出発し、中期経営計画と財務モデルを策定しました。",
      significance:
        "中期経営計画を立て、グローバル水準の収益力をめざして再出発した年です。現在も、2027年3月期を目標年度とする中期経営計画に取り組んでいます。",
      sourceIds: ["official-history", "yuho-2026"],
    },
    {
      year: 2022,
      title: "新ビジョンを発表、プライム市場へ",
      description:
        "新しいビジョン「半導体の技術革新に貢献する夢と活力のある会社」と、コーポレートメッセージ「Technology Enabling Life」を発表しました。同じ年、東京証券取引所の市場区分の見直しにより、プライム市場に移行しています。",
      significance:
        "このビジョンは、2026年3月期の有価証券報告書でも会社のビジョンとして掲げられています。",
      sourceIds: ["official-history", "yuho-2026"],
    },
  ],

  relatedCompanies: [],

  sources: [
    {
      id: "yuho-2026",
      title: "有価証券報告書（2026年3月期・第63期）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/ir/library/fs/arfnn500000000ni-att/yuho63q4.pdf",
      publishedAt: "2026-06-22",
      accessedAt: "2026-09-13",
    },
    {
      id: "tanshin-2026",
      title: "2026年3月期 決算短信〔日本基準〕（連結）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/ir/library/report/jngpc500000000l6-att/fy26q4tanshin-j.pdf",
      publishedAt: "2026-04-30",
      accessedAt: "2026-09-13",
    },
    {
      id: "yuho-2025",
      title: "有価証券報告書（2025年3月期・第62期）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/ir/library/fs/qmu38m00000000ll-att/yuho62q4.pdf",
      publishedAt: "2025-06-16",
      accessedAt: "2026-09-13",
    },
    {
      id: "presentation-2026",
      title: "2026年3月期 決算説明会資料",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/ir/library/report/jngpc500000000l6-att/fy26q4presentations-j.pdf",
      publishedAt: "2026-04-30",
      accessedAt: "2026-09-13",
    },
    {
      id: "tanshin-2027-q1",
      title: "2027年3月期 第1四半期決算短信",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/ir/irta3a00000006g5-att/fy27q1tanshin-j.pdf",
      accessedAt: "2026-09-14",
    },
    {
      id: "official-history",
      title: "東京エレクトロンの歴史",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/about/milestones/index.html",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-products",
      title: "製品・サービス（半導体製造プロセスから探す）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/product/index.html",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-service",
      title: "製品・サービス（サービス）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/product/service/index.html",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-about-semiconductor",
      title: "半導体を知る",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/aboutsemiconductor/index.html",
      accessedAt: "2026-09-13",
    },
    {
      id: "glossary-silicon-wafer",
      title: "半導体用語集「シリコン・ウェーハ」（nanotec museum）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/museum/words/words12.html#word05",
      accessedAt: "2026-09-13",
    },
    {
      id: "glossary-photoresist",
      title: "半導体用語集「フォトレジスト」（nanotec museum）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/museum/words/words15.html#word12",
      accessedAt: "2026-09-13",
    },
  ],

  // Every judgement call is recorded in the research log; none leaves an
  // unverified fact in the entry, so it is published.
  status: { state: "published" },

  revisions: [
    {
      date: "2026-09-14",
      kind: "ai-generated",
      summary:
        "有価証券報告書（2026年3月期・2025年3月期）、2026年3月期決算短信・決算説明会資料、2027年3月期第1四半期決算短信、公式サイト（東京エレクトロンの歴史、製品・サービス、半導体を知る、半導体用語集）に基づきAIが作成",
    },
  ],

  updatedAt: "2026-09-14",
};
