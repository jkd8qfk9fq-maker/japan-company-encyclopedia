import type { Company } from "@/types/company";

/**
 * 三菱商事 (8058).
 *
 * Every figure and claim below is traced, page by page, in
 * `docs/research/mitsubishi-corporation.md`. Page numbers there are the
 * printed page numbers of the 有報 (the "― n ―" footer), not PDF page indices.
 *
 * Three things here are easy to "fix" wrongly, so they are called out:
 *
 * - The top level is the SEVEN 営業グループ in force since 2026-04-01, not the
 *   eight reportable segments printed in the 2026年3月期 有報 セグメント情報.
 *   The same 有報 (p.14) says the 8-group structure becomes 7 groups from the
 *   next fiscal year, and the 2027年3月期 1Q 決算短信 already reports 7
 *   segments. Showing 地球環境エネルギー and 電力ソリューション as separate
 *   groups would describe a structure that no longer exists.
 * - The top line is 収益, not 売上高 or 売上収益. It is printed that way in the
 *   IFRS consolidated table and is kept verbatim.
 * - A large part of 収益 is recorded gross, because the company is principal
 *   on many trades (有報 注記3(15)). Do not read the revenue figure as "size of
 *   the business" without the business-model text that explains it.
 */
export const mitsubishiCorporation: Company = {
  id: "mitsubishi-corporation",
  code: "8058",
  name: "三菱商事",
  officialName: "三菱商事株式会社",
  nameEn: "Mitsubishi Corporation",
  // Not "MITSUBISHI": that word alone is shared by many unrelated listed
  // companies, and as the hero wordmark it would make the 3-second reading
  // less accurate. Decided before publication; see the research log.
  shortNameEn: "MITSUBISHI CORPORATION",
  description:
    "エネルギーや金属資源、素材、食品、自動車などの分野で、世界を舞台に商品の取引と事業への投資・経営を行う総合商社。",
  // 有報 p.46: 東京証券取引所 プライム市場 only. 名古屋 was delisted in 2020
  // (有報 p.3 沿革).
  listings: [{ exchange: "tse", market: "プライム" }],

  // Only `trading`. Every 営業グループ maps to some industry (energy, food,
  // automotive, chemicals, real-estate…); picking a few as secondary would be
  // arbitrary. See the research log.
  industries: [{ industryId: "trading", primary: true }],

  // Ordered by 2026年3月期 segment 収益 (有報 注記24, 百万円):
  // エネルギー＆パワーソリューション 4,586,279 (= 地球環境エネルギー 3,267,295
  // + 電力ソリューション 1,318,984; the company's own 7-group restatement of
  // 2026年3月期 1Q shows the merger is exactly additive) > 金属資源 4,083,329
  // > マテリアルソリューション 3,631,197 > S.L.C. 2,514,143 > 食品産業
  // 2,324,535 > 社会インフラ 930,638 > モビリティ 837,375.
  //
  // `children` are the organisational units each group page lists under
  // 「組織」 on the official site, all of them, in the page's order. They are
  // how the company itself divides each group; no hierarchy is invented.
  // 「その他」 is left out: it is the corporate staff function, not a business.
  businesses: [
    {
      id: "energy-power-solution",
      name: "エネルギー＆パワーソリューション",
      shortName: "エネルギー",
      description:
        "天然ガス・LNG、石油製品やLPG、発電と電力・ガスの取引や小売、バイオ燃料や水素などの次世代エネルギーまで、エネルギーに関わる事業を世界で手がけています。2026年4月に地球環境エネルギーと電力ソリューションの2グループを統合してできました。",
      products: [
        "天然ガス",
        "液化天然ガス（LNG）",
        "石油製品",
        "LPG",
        "電力",
        "バイオ燃料",
        "クリーン水素・アンモニア",
        "カーボンクレジット",
      ],
      sourceIds: [
        "official-group-energy-power-solution",
        "yuho-2026",
        "presentation-2026",
        "tanshin-2027-q1",
        "tanshin-2026-q1",
      ],
      children: [
        {
          id: "mc-energies",
          name: "MC Energies Corporation",
          shortName: "MC Energies",
          description:
            "米国のエネルギー事業をまとめる会社として新たに設立されました。上流のガスを起点としたエネルギーのバリューチェーンづくりと、再生可能エネルギーや低・脱炭素の事業を進めています。",
          products: [
            "天然ガス",
            "液化天然ガス（LNG）",
            "発電",
            "電力・ガスのトレーディング",
            "分散太陽光",
          ],
          sourceIds: ["official-group-energy-power-solution"],
        },
        {
          id: "europe-next-generation-energy",
          name: "欧州・次世代エネルギー本部",
          shortName: "欧州・次世代エネルギー",
          description:
            "オランダの総合エネルギー事業会社N.V. Enecoを通じて、欧州で再生可能エネルギーなどの発電、電力トレーディング、電力・ガスの小売を行っています。持続可能な航空燃料（SAF）などのバイオ燃料、クリーン水素・アンモニア、カーボンクレジットの開発・推進も担います。",
          products: [
            "発電",
            "電力・ガスのトレーディング",
            "電力・ガスの小売",
            "地域熱供給",
            "バイオ燃料（SAF、低炭素エタノール、バイオメタンなど）",
            "カーボンクレジット",
            "クリーン水素・アンモニア",
          ],
          sourceIds: ["official-group-energy-power-solution"],
        },
        {
          id: "asia-pacific",
          name: "アジア・パシフィック本部",
          shortName: "アジア・パシフィック",
          description:
            "アジア・パシフィック地域のLNG生産国で、天然ガス・LNG事業の強化や新規開発、LNGの受け渡し業務を行っています。太陽光や陸上風力などの発電事業にも取り組んでいます。",
          products: ["天然ガス", "液化天然ガス（LNG）", "発電"],
          sourceIds: ["official-group-energy-power-solution"],
        },
        {
          id: "energy-development-marketing",
          name: "エネルギー開発・販売本部",
          shortName: "エネルギー開発・販売",
          description:
            "LNGのマーケティングと、カナダの天然ガス・LNG事業を進めています。LNGのトレーディング、LNG船の保有・傭船・運行管理、AIに関わる電力事業にも取り組んでいます。",
          products: [
            "天然ガス",
            "液化天然ガス（LNG）",
            "LNGのトレーディング",
            "LNG船",
            "AIバリューチェーンにおける電力",
          ],
          sourceIds: ["official-group-energy-power-solution"],
        },
        {
          id: "petroleum",
          name: "石油本部",
          shortName: "石油",
          description:
            "日本・アジア・米国などで、原油やガソリン、灯油、軽油、LPG、ナフサ、重油などの石油製品の事業と、バイオマス燃料の事業を進めています。",
          products: [
            "原油",
            "ガソリン",
            "灯油",
            "軽油",
            "LPG",
            "ナフサ",
            "重油",
            "バイオマス燃料",
          ],
          sourceIds: ["official-group-energy-power-solution"],
        },
        {
          id: "domestic-power",
          name: "国内電力室",
          shortName: "国内電力",
          description:
            "三菱商事エナジーソリューションズを通じて、日本で陸上風力や太陽光などの再生可能エネルギーの発電所を開発・運営しています。電力トレーディングや電力小売の会社を通じて、再生可能エネルギーの導入を後押しするサービスや電力小売のメニューを提供しています。",
          products: ["発電", "電力トレーディング", "電力小売"],
          customers: ["一般家庭を含む電気の需要家"],
          sourceIds: ["official-group-energy-power-solution"],
        },
      ],
    },
    {
      id: "mineral-resources",
      name: "金属資源",
      description:
        "鉄の原料となる原料炭や銅を中心に、鉄鉱石、アルミ、リチウム、ニッケルなどの金属資源に投資して、資源開発や鉱山の経営に取り組んでいます。世界のネットワークを通じて、金属資源や原材料を需要家に届ける取引も行っています。",
      products: ["原料炭", "鉄鉱石", "銅", "アルミ", "リチウム", "ニッケル"],
      sourceIds: ["yuho-2026", "official-group-mineral-resources"],
      children: [
        {
          id: "steel-raw-materials",
          name: "鉄鋼原料本部",
          shortName: "鉄鋼原料",
          description:
            "豪州、北米、南米などで、鉄の原料となる原料炭と鉄鉱石の権益を持ち、資源開発や鉱山事業の経営に取り組んでいます。",
          products: ["原料炭", "鉄鉱石"],
          sourceIds: ["official-group-mineral-resources"],
        },
        {
          id: "critical-minerals",
          name: "クリティカルミネラル本部",
          shortName: "クリティカルミネラル",
          description:
            "電化やEVの普及で需要が増えると見込まれる重要な鉱物を安定して供給するため、南米、北米、豪州などで、銅やアルミ、リチウム・ニッケルなどの電池資源への投資と資源開発を行っています。肥料資源にも取り組んでいます。",
          products: [
            "銅",
            "アルミ",
            "ボーキサイト",
            "リチウム",
            "ニッケル",
            "肥料資源（ポリヘライト）",
          ],
          sourceIds: ["official-group-mineral-resources"],
        },
        {
          id: "metals-trading",
          name: "金属資源トレーディング本部",
          shortName: "金属資源トレーディング",
          description:
            "石炭、鉄鉱石、銅、アルミ、ニッケル、リチウム、貴金属などの取引を世界で行い、社会や産業に必要な金属資源・原材料を需要家に届けています。ロンドンのTriland Metalsでは、金属の価格変動リスクに備えるヘッジサービスも提供しています。",
          products: [
            "石炭",
            "鉄鉱石",
            "銅精鉱・銅地金",
            "アルミ地金",
            "ニッケル",
            "リチウム",
            "貴金属",
            "レアメタル",
            "レアアース",
          ],
          customers: [
            "金属資源・原材料の需要家",
            "金属資源業界の企業（ヘッジサービス）",
          ],
          sourceIds: ["official-group-mineral-resources"],
        },
      ],
    },
    {
      id: "materials-solution",
      name: "マテリアルソリューション",
      shortName: "素材",
      description:
        "鉄鋼製品、石油化学品や基礎化学品、機能素材、セメントや硅砂などの資源素材といった、さまざまな産業に欠かせない素材を扱い、取引（トレーディング）、事業投資、事業開発を行っています。",
      products: [
        "鉄鋼製品",
        "石油化学製品（オレフィン、アロマ、合成樹脂）",
        "基礎化学品（塩化ビニール、メタノール、アンモニアなど）",
        "機能素材",
        "セメント・生コンクリート",
        "硅砂",
        "炭素材",
      ],
      sourceIds: ["yuho-2026", "official-group-materials-solution"],
      children: [
        {
          id: "resource-materials",
          name: "資源素材本部",
          shortName: "資源素材",
          description:
            "建設・インフラ向けなどの素材をつくる産業に欠かせない資源的な素材を取引し、製造・販売も行っています。豪州の硅砂鉱山会社Cape Flattery Silica Minesの運営、セメント・生コンクリートや炭素材の製造・販売、塩やエタノールの取引などです。",
          products: [
            "炭素材",
            "セメント",
            "生コンクリート",
            "硅砂",
            "塩",
            "エタノール",
          ],
          sourceIds: ["official-group-materials-solution"],
        },
        {
          id: "steel-products",
          name: "鉄鋼製品本部",
          shortName: "鉄鋼製品",
          description:
            "三菱商事が60%出資する鉄鋼総合商社メタルワンを通じた、鉄鋼製品の流通・加工・販売を中心に事業を行っています。",
          products: ["鉄鋼製品"],
          sourceIds: ["official-group-materials-solution", "yuho-2026"],
        },
        {
          id: "functional-materials",
          name: "機能素材本部",
          shortName: "機能素材",
          description:
            "東洋紡エムシーなどを通じて機能素材の分野で事業を行い、半導体関連の事業や、パートナーと組んだ樹脂関連製品の製造・販売にも取り組んでいます。",
          products: ["機能素材", "樹脂関連製品", "半導体関連素材"],
          sourceIds: ["official-group-materials-solution"],
        },
        {
          id: "commodity-chemicals",
          name: "汎用素材本部",
          shortName: "汎用素材",
          description:
            "石油化学（オレフィン、アロマ、合成樹脂）と基礎化学（塩化ビニール、メタノール、アンモニアなど）の分野で、世界規模の取引と投資を行っています。",
          products: [
            "オレフィン",
            "アロマ",
            "合成樹脂",
            "塩化ビニール",
            "メタノール",
            "アンモニア",
          ],
          sourceIds: ["official-group-materials-solution"],
        },
      ],
    },
    {
      id: "smart-life-creation",
      name: "S.L.C.",
      description:
        "コンビニエンスストアやスーパーマーケットなどの小売、食品の卸売、ヘルスケア、金融・物流などの事業を組み合わせ、生活者のより良いくらし（Smart-Life）をつくることに取り組んでいます。",
      products: [
        "小売（コンビニエンスストア、スーパーマーケットなど）",
        "共通ポイント・決済関連サービス",
        "食品の卸売",
        "包装・容器製品",
        "医療機器・医療材料",
        "リース",
        "物流",
      ],
      customers: ["生活者"],
      sourceIds: ["yuho-2026", "official-group-smart-life-creation"],
      children: [
        {
          id: "retail-food-distribution",
          name: "リテイル・食品流通本部",
          shortName: "リテイル・食品流通",
          description:
            "コンビニエンスストアやスーパーマーケットなどの小売、食品流通、包装の事業を展開し、共通ポイントプログラムや顧客データを使ったデジタルマーケティングにも取り組んでいます。主な事業会社にローソン、ライフコーポレーション、共通ポイント「Ponta」を運営するロイヤリティ マーケティングがあります。",
          products: [
            "小売",
            "ポイント・決済関連",
            "データマーケティング",
            "食品代理店",
            "包装・容器製品",
          ],
          customers: ["生活者"],
          sourceIds: ["official-group-smart-life-creation"],
        },
        {
          id: "healthcare",
          name: "ヘルスケア本部",
          shortName: "ヘルスケア",
          description:
            "医療・介護・予防・医薬品・農薬の分野で、顧客の課題の解決に役立つ商品やサービスを提供しています。",
          products: [
            "マネージドケア",
            "医療機器・医療材料の販売",
            "介護",
            "医農薬の開発・製造・販売",
            "医療機関向けソリューション",
          ],
          sourceIds: ["official-group-smart-life-creation"],
        },
        {
          id: "smart-service-spa",
          name: "スマートサービス・S.P.A.本部",
          shortName: "スマートサービス・S.P.A.",
          description:
            "日本のコンテンツの海外展開、医療ツーリズム、住環境ソリューションに取り組んでいます。企画・生産から自社ブランド店での販売までを一貫して行う製造小売（S.P.A.）のブランドと組んだ小売事業も国内外で行っています。",
          products: [
            "S.P.A.事業",
            "IP・エンタテインメント事業",
            "医療ツーリズム事業",
            "住環境ソリューション事業",
          ],
          sourceIds: ["official-group-smart-life-creation"],
        },
        {
          id: "finance-logistics",
          name: "金融・物流本部",
          shortName: "金融・物流",
          description:
            "企業の課題解決と価値向上を支える企業投資、三菱HCキャピタルや三菱オートリースなどと連携したリース、三菱商事ロジスティクスなどを通じた物流の事業を行っています。",
          products: ["プライベートエクイティ", "リース", "総合物流"],
          sourceIds: ["official-group-smart-life-creation"],
        },
        {
          id: "mitsubishi-shokuhin",
          name: "三菱食品事業室",
          shortName: "三菱食品",
          description:
            "三菱食品などと連携し、加工食品、低温食品、菓子、酒類の卸売を行っています。",
          products: ["加工食品", "低温食品", "菓子", "酒類"],
          sourceIds: ["official-group-smart-life-creation"],
        },
        {
          id: "digital",
          name: "デジタル事業室",
          shortName: "デジタル",
          description:
            "エムシーディースリーなどと連携し、AI・デジタル技術を使って、グループの事業の価値向上や新しい事業づくりに取り組んでいます。",
          products: ["AI・デジタル活用によるソリューション・サービス"],
          sourceIds: ["official-group-smart-life-creation"],
        },
      ],
    },
    {
      id: "food-industry",
      name: "食品産業",
      shortName: "食品",
      description:
        "穀物や飼料原料、コーヒー・ココアなどの食品原料、サーモンなどの水産物、食肉、乳製品、米といった「食」に関わる分野で、原料の生産・調達から製品の製造まで、販売取引、事業投資、事業開発を行っています。",
      products: [
        "穀物",
        "飼料原料",
        "小麦粉",
        "砂糖",
        "コーヒー・ココア",
        "食品素材",
        "水産物（サーモンなど）",
        "食肉",
        "乳製品",
        "米",
      ],
      sourceIds: ["yuho-2026", "official-group-food-industry"],
      children: [
        {
          id: "overseas-markets",
          name: "海外市場部",
          shortName: "海外市場",
          description:
            "海外の市場で、パン、調味料、飲料などの食品を製造・販売する事業を行っています。",
          products: ["パン", "調味料", "飲料"],
          customers: ["消費者"],
          sourceIds: ["official-group-food-industry"],
        },
        {
          id: "food-wellness",
          name: "フード＆ウエルネス事業本部",
          shortName: "フード＆ウエルネス",
          description:
            "コーヒー、ココア、ナッツ類、胡麻、油脂などの食品原料を安定して供給し、発酵などの技術を生かした食品・健康・化粧品の素材を世界で製造・販売しています。",
          products: [
            "食品素材・配合品",
            "健康素材・製品",
            "化粧品素材",
            "コーヒー",
            "ココア",
            "胡麻",
            "ナッツ類",
            "油脂",
          ],
          sourceIds: ["official-group-food-industry"],
        },
        {
          id: "foods",
          name: "食料本部",
          shortName: "食料",
          description:
            "北米・南米・豪州などの生産国で穀物・油糧種子・飼料原料・粗糖などの原料を取引し、種子・肥料・農薬などの農業資材も販売しています。これらを原料に配合飼料、澱粉・糖化品、小麦粉、砂糖などをつくる一次加工も行い、ペットフードは製造販売まで手がけています。",
          products: [
            "トウモロコシ",
            "小麦",
            "大麦",
            "大豆",
            "菜種",
            "飼料原料",
            "小麦粉",
            "砂糖",
            "澱粉・糖化品",
          ],
          customers: ["食品メーカー"],
          sourceIds: ["official-group-food-industry"],
        },
        {
          id: "seafood",
          name: "水産本部",
          shortName: "水産",
          description:
            "サーモンや鮪・鰹、えびなどの水産物と、ツナ缶などの水産加工品を、生産・調達から製造・加工・販売まで一貫して扱っています。主な事業会社のCermaqは、ノルウェー、チリ、カナダでサーモンを養殖・加工・販売しています。",
          products: [
            "サーモン",
            "鮪・鰹",
            "えび",
            "ツナ缶",
            "ペットフード",
          ],
          sourceIds: ["official-group-food-industry"],
        },
        {
          id: "agri-livestock",
          name: "農畜産本部",
          shortName: "農畜産",
          description:
            "鶏肉・豚肉・牛肉などの食肉や食肉加工品、チーズなどの乳製品、米、青果物といった生鮮食材・加工食品の事業を世界で展開しています。",
          products: [
            "鶏肉・豚肉・牛肉",
            "食肉加工品",
            "チーズ・乳製品",
            "米穀・炊飯・冷凍米飯",
            "青果物",
          ],
          sourceIds: ["official-group-food-industry"],
        },
      ],
    },
    {
      id: "social-infrastructure",
      name: "社会インフラ",
      description:
        "国内外の都市開発や不動産の開発・運用、データセンター、船舶、宇宙・航空機、建設機械のレンタルなどの産業機械、エネルギーインフラなど、社会や産業の土台になる事業に取り組んでいます。",
      products: [
        "データセンター",
        "不動産の開発・運用",
        "都市開発",
        "船舶",
        "産業機械",
        "建設機械のレンタル",
      ],
      sourceIds: ["yuho-2026", "official-group-social-infrastructure"],
      children: [
        {
          id: "ai-digital",
          name: "AI・デジタル推進ユニット",
          shortName: "AI・デジタル",
          description:
            "国内外でデータセンターの開発・運営を行い、AI・デジタル分野での新しい事業づくりにも取り組んでいます。",
          products: ["データセンター"],
          sourceIds: ["official-group-social-infrastructure"],
        },
        {
          id: "infrastructure-shipping-aerospace",
          name: "インフラ・船舶・宇宙航空機本部",
          shortName: "インフラ・船舶・宇宙航空機",
          description:
            "エンジニアリング・産業インフラへの事業投資、船舶やFPSO（海に浮かべて原油・ガスを生産・貯蔵・積み出す設備）の保有・運航・運営、防衛省向けの航空機・電子機器・艦船システムの取引などを行っています。プラントの設計・調達・建設を手がける千代田化工建設もこの本部の事業です。",
          products: ["船舶", "FPSO", "防衛・宇宙関連"],
          sourceIds: ["official-group-social-infrastructure"],
        },
        {
          id: "industrial-machinery",
          name: "産業機械本部",
          shortName: "産業機械",
          description:
            "建設機械のレンタルを含む建設ソリューション、電力・化学・鉄道システムなどのインフラの設計・調達・建設（EPC）、工場向けの生産設備や大型農業機械の販売、空港などの交通・水インフラの運営を、国内外で行っています。",
          products: [
            "建設機械のレンタル",
            "工作機械などの生産設備",
            "大型農業機械",
            "空港などの運営",
          ],
          customers: ["工場", "農家"],
          sourceIds: ["official-group-social-infrastructure"],
        },
        {
          id: "urban-development",
          name: "都市開発本部",
          shortName: "都市開発",
          description:
            "国内、北米、アジアを中心に、さまざまな不動産の開発・運用と、大規模で長期にわたる都市開発・運営に取り組んでいます。",
          sourceIds: ["official-group-social-infrastructure"],
        },
      ],
    },
    {
      id: "mobility",
      name: "モビリティ",
      description:
        "アセアンを中心に、乗用車・商用車の現地での生産・販売、自動車ローンなどの販売金融、アフターサービスまで自動車のバリューチェーン事業を行い、移動サービスやEV・バッテリー関連の事業も進めています。",
      products: [
        "三菱自動車の車両",
        "三菱ふそうトラック・バスの車両",
        "いすゞ自動車の車両",
        "販売金融",
        "アフターサービス",
      ],
      sourceIds: ["yuho-2026", "official-group-mobility"],
      children: [
        {
          id: "automotive",
          name: "自動車事業本部",
          shortName: "自動車",
          description:
            "三菱自動車や三菱ふそうトラック・バスの車両などを扱い、アジア・アセアン、欧州、南米など世界各地で、川上から川下までの幅広いバリューチェーン事業を行っています。",
          products: ["三菱自動車の車両", "三菱ふそうトラック・バスの車両"],
          sourceIds: ["official-group-mobility"],
        },
        {
          id: "isuzu",
          name: "いすゞ事業本部",
          shortName: "いすゞ",
          description:
            "最大の市場であるタイをはじめ世界各国で、いすゞ自動車の車両の販売、販売金融、サービス、輸出を行っています。タイからは世界100カ国以上へピックアップトラックを輸出しています。",
          products: [
            "いすゞ自動車の車両（ピックアップトラック、SUV、商用車など）",
            "販売金融",
          ],
          sourceIds: ["official-group-mobility"],
        },
        {
          id: "mobility-solutions",
          name: "モビリティ・ソリューション本部",
          shortName: "モビリティ・ソリューション",
          description:
            "自動運転や電動化などの変化を事業の機会ととらえ、モビリティの「所有」と「利用」の両面から総合的なサービスを提供しています。AIオンデマンド交通の配車システムや、EVのバッテリーリースなどに取り組む事業会社があります。",
          sourceIds: ["official-group-mobility"],
        },
        {
          id: "tire-business",
          name: "タイヤ事業開発部",
          shortName: "タイヤ",
          description:
            "日系タイヤメーカーとの長年のパートナーシップのもと、タイヤの製造から小売りまで事業を展開しています。",
          products: ["タイヤ"],
          sourceIds: ["official-group-mobility"],
        },
        {
          id: "india-africa",
          name: "インド・アフリカ事業部",
          shortName: "インド・アフリカ",
          description:
            "インドではTVSグループと組んで、複数ブランドの車を扱う販売店事業、アフターサービス事業、中古車オークション事業などを行っています。アフリカでは事業開発を進めています。",
          sourceIds: ["official-group-mobility"],
        },
      ],
    },
  ],

  businessModel: {
    description:
      "エネルギーや金属資源、素材、食品などを売り手から買い手へつなぐ取引（トレーディング）に加え、資源開発や食品、小売などの事業に出資し、自ら経営に関わって利益を上げています。会社自身は、取引手数料が主な収入源だった「仲介役」から、2000年代からの事業投資、2018年からの事業経営へと事業モデルを変えてきたと説明しています。",
    products: [
      "エネルギー（天然ガス・LNG、石油製品、電力など）",
      "金属資源（原料炭、銅、鉄鉱石など）",
      "素材（鉄鋼製品、化学品など）",
      "食料・食品（穀物、水産物、食肉など）",
      "自動車の販売と販売金融",
      "小売・ヘルスケア・金融・物流などのサービス",
      "都市開発・不動産・データセンター・産業機械",
    ],
    customers: [
      "金属資源や原材料、燃料を使う国内外の需要家",
      "食品メーカー",
      "一般家庭を含む電気の需要家",
      "コンビニエンスストアなどを利用する生活者",
    ],
    revenueSources: [
      "金属、機械、化学品、一般消費財などの製品・商品の販売",
      "取引を手配する代理人として受け取る手数料や差額",
      "物流、情報通信、技術支援などのサービスの提供",
      "電力・都市ガスの供給",
      "工事請負契約にもとづくプラント建設",
      "リース収益や、金融商品の会計基準で扱う商品の売買契約など",
    ],
    flow: [
      {
        kind: "company",
        title: "三菱商事",
        description:
          "7つの営業グループが、国内外の子会社や出資先の会社とともに事業を行っています。2026年3月期の有価証券報告書では、連結子会社は833社、持分法適用会社は349社です。",
      },
      {
        kind: "offering",
        title: "商品の取引と事業の経営",
        description:
          "エネルギー、金属資源、素材、食品などを売り手から買い手へ届ける取引を行い、出資した事業の運営にも深く関わります。",
      },
      {
        kind: "customer",
        title: "世界の企業と生活者",
        description:
          "取引の相手は、原材料や燃料を使う国内外の企業（需要家）から、コンビニエンスストアや電力小売を利用する生活者まで、事業によってさまざまです。",
      },
      {
        kind: "revenue",
        title: "収益",
        description:
          "製品・商品の販売、サービスの提供、電力・ガスの供給、プラント建設などから生まれます。取引を手配する代理人の場合は、手数料や差額だけを収益にします。2026年3月期のグループ別の収益は、エネルギー＆パワーソリューション（統合前の2グループの合計）、金属資源、マテリアルソリューションの順に大きくなっています。",
      },
      {
        kind: "profit",
        title: "当期純利益",
        description:
          "取引や事業から生まれる売上総利益から経費を差し引き、出資先の関連会社や共同支配企業の損益（持分法による投資損益）、保有する株式などからの受取配当金などを加え、税金などを差し引いたものが当期純利益になります。",
      },
    ],
    sourceIds: [
      "official-history-explore",
      "yuho-2026",
      "official-group-energy-power-solution",
      "official-group-mineral-resources",
      "official-group-food-industry",
      "official-group-smart-life-creation",
      "tanshin-2027-q1",
      "tanshin-2026-q1",
    ],
  },

  // Source: 有報 2025年度（2026年3月期）p.1「主要な経営指標等の推移 (1) 連結経営指標等」.
  // The company labels years 「2021年度」…「2025年度」 with 決算年月 2022年3月…2026年3月;
  // `fiscalYear` uses the protocol's 「…年3月期」 form for the same periods.
  // Values printed in 百万円, converted × 1,000,000. Identical for 2021–2024年度 in
  // the previous 有報 (2024年度) p.1: no restatement.
  financials: [
    {
      fiscalYear: "2022年3月期",
      periodEnd: "2022-03-31",
      revenue: 17_264_828_000_000,
      revenueLabel: "収益",
      netIncome: 937_529_000_000,
      netIncomeLabel: "当期純利益（当社の所有者に帰属）",
      currency: "JPY",
      accountingStandard: "ifrs",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2023年3月期",
      periodEnd: "2023-03-31",
      revenue: 21_571_973_000_000,
      revenueLabel: "収益",
      netIncome: 1_180_694_000_000,
      netIncomeLabel: "当期純利益（当社の所有者に帰属）",
      currency: "JPY",
      accountingStandard: "ifrs",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2024年3月期",
      periodEnd: "2024-03-31",
      revenue: 19_567_601_000_000,
      revenueLabel: "収益",
      netIncome: 964_034_000_000,
      netIncomeLabel: "当期純利益（当社の所有者に帰属）",
      currency: "JPY",
      accountingStandard: "ifrs",
      sourceIds: ["yuho-2026", "yuho-2025"],
    },
    {
      fiscalYear: "2025年3月期",
      periodEnd: "2025-03-31",
      revenue: 18_617_601_000_000,
      revenueLabel: "収益",
      netIncome: 950_709_000_000,
      netIncomeLabel: "当期純利益（当社の所有者に帰属）",
      currency: "JPY",
      accountingStandard: "ifrs",
      sourceIds: ["yuho-2026", "yuho-2025", "tanshin-2026"],
    },
    {
      fiscalYear: "2026年3月期",
      periodEnd: "2026-03-31",
      revenue: 18_915_995_000_000,
      revenueLabel: "収益",
      netIncome: 800_460_000_000,
      netIncomeLabel: "当期純利益（当社の所有者に帰属）",
      currency: "JPY",
      accountingStandard: "ifrs",
      sourceIds: ["yuho-2026", "tanshin-2026"],
    },
  ],

  history: [
    {
      year: 1954,
      title: "大合同で総合商社として新発足",
      description:
        "旧三菱商事は1947年に連合国最高司令官の指令で解散しました。1950年にその第二会社として光和実業が設立され、1952年に商号を三菱商事に変更。1954年7月1日、不二商事・東京貿易・東西交易の3社を吸収合併し、総合商社として新たに発足しました。同じ年に東京証券取引所に上場しています。",
      significance:
        "有価証券報告書はこの日を「創立」としており、現在の三菱商事はこの合併で発足した会社です。",
      sourceIds: ["yuho-2026", "official-history-roots-01"],
    },
    {
      year: 1968,
      title: "ブルネイLNGへの投資を決定",
      description:
        "LNG（液化天然ガス）を製造するブルネイLNGへの投資を決めました。1969年にシェルとともに45％ずつ、ブルネイ政府が10％を出資する合弁契約を結び、1972年にはブルネイからのLNG船が大阪に入港しました。当時の資本金をはるかに上回る規模の投資でした。",
      significance:
        "会社自身が、今日のLNGビジネスの「原点とも言える」と位置づけるプロジェクトです。BRUNEI LNGは今もエネルギー分野の主要な持分法適用会社の一つです。",
      sourceIds: ["yuho-2026", "official-history-roots-07"],
    },
    {
      year: 1974,
      title: "タイでいすゞ車の販売会社を設立",
      description:
        "タイに、いすゞ車の輸入総販売代理店であるTri Petch Isuzu Salesを設立しました。",
      significance:
        "タイは今もモビリティグループのいすゞ事業にとって最大の市場で、Tri Petch Isuzu Salesはピックアップトラックや商用車などを販売する子会社です。",
      sourceIds: [
        "yuho-2026",
        "official-history-explore",
        "official-group-mobility",
      ],
    },
    {
      year: 2000,
      title: "ローソンと資本・業務提携",
      description:
        "コンビニエンスストア「ローソン」を運営するローソンと資本・業務提携を結びました。2017年に株式を買い増して子会社にし、2024年にはKDDI・ローソンとの資本業務提携契約を結んでいます。",
      significance:
        "ローソンは今、S.L.C.グループのリテイル・食品流通本部の主な事業会社です。2024年8月からは三菱商事とKDDIが50％ずつ出資する共同支配企業で、日本と海外で約22,500店（2026年2月末）のコンビニエンスストアを展開しています。",
      sourceIds: [
        "official-history-explore",
        "official-group-smart-life-creation",
        "yuho-2026",
      ],
    },
    {
      year: 2001,
      title: "豪州の原料炭事業でBMAを設立",
      description:
        "1968年に豪州で金属資源事業会社Mitsubishi Developmentを設立していました。2001年、豪州の原料炭事業の権益を追加で取得し、資源会社BHP Billitonと折半でBHP Billiton Mitsubishi Alliance（BMA）を設立しました。",
      significance:
        "鉄の原料となる原料炭は、今も金属資源グループの主力事業の一つです。Mitsubishi Developmentは豪州で原料炭事業などの投資・運営を行う中核会社です。",
      sourceIds: [
        "yuho-2026",
        "official-history-explore",
        "official-group-mineral-resources",
      ],
    },
    {
      year: 2003,
      title: "鉄鋼製品のメタルワンを設立",
      description:
        "日商岩井（現在の双日）と共同で会社分割（共同新設分割）を行い、鉄鋼製品の事業会社メタルワンを設立しました。",
      significance:
        "メタルワンは今、三菱商事が60％出資する子会社で、マテリアルソリューショングループの鉄鋼製品本部の事業の中心です。",
      sourceIds: [
        "yuho-2026",
        "official-history-explore",
        "official-group-materials-solution",
      ],
    },
    {
      year: 2020,
      title: "オランダのEnecoを子会社化",
      description:
        "中部電力と共同で設立した会社を通じて、欧州で総合エネルギー事業を展開するオランダの会社（現在のN.V. Eneco）の全株式を取得し、子会社にしました。",
      significance:
        "Enecoを通じて、欧州で再生可能エネルギーなどの発電、電力トレーディング、電力・ガスの小売を行っています。",
      sourceIds: [
        "yuho-2026",
        "official-history-explore",
        "official-group-energy-power-solution",
      ],
    },
    {
      year: 2026,
      title: "エネルギーの2グループを統合し7グループ体制へ",
      description:
        "2026年4月1日、地球環境エネルギーグループと電力ソリューショングループを統合し、エネルギー＆パワーソリューショングループを設立しました。エネルギー事業に関わる商材・機能を一つにまとめて地域ごとに柔軟なバリューチェーンをつくり、エネルギートランジション期の多様なニーズに応えることが目的だと説明しています。",
      significance:
        "8つだった営業グループが7つになり、現在の事業の分け方になりました。",
      sourceIds: ["yuho-2026", "presentation-2026", "tanshin-2027-q1"],
    },
  ],

  relatedCompanies: [],

  sources: [
    {
      id: "yuho-2026",
      title: "有価証券報告書（2025年度：2025年4月1日〜2026年3月31日）",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/ir/library/fstatement/pdf/2025_04/y2025_04.pdf",
      publishedAt: "2026-06-12",
      accessedAt: "2026-09-13",
    },
    {
      id: "yuho-2025",
      title: "有価証券報告書（2024年度：2024年4月1日〜2025年3月31日）",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/ir/library/fstatement/pdf/2024_04/y2024_04.pdf",
      publishedAt: "2025-06-18",
      accessedAt: "2026-09-14",
    },
    {
      id: "tanshin-2026",
      title: "2026年3月期 決算短信〔IFRS〕（連結）",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/ir/library/earnings/pdf/202605j.pdf",
      publishedAt: "2026-05-01",
      accessedAt: "2026-09-13",
    },
    {
      id: "tanshin-2027-q1",
      title: "2027年3月期 第1四半期決算短信〔IFRS〕（連結）",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/ir/library/earnings/pdf/202608j.pdf",
      publishedAt: "2026-08-06",
      accessedAt: "2026-09-13",
    },
    {
      id: "tanshin-2026-q1",
      title: "2026年3月期 第1四半期決算短信〔IFRS〕（連結）",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/ir/library/earnings/pdf/202508j.pdf",
      publishedAt: "2025-08-07",
      accessedAt: "2026-09-13",
    },
    {
      id: "presentation-2026",
      title: "2025年度決算及び2026年度見通し 決算説明会資料",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/ir/library/meetings/pdf/260501/20260501j.pdf",
      publishedAt: "2026-05-01",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-group-energy-power-solution",
      title: "エネルギー&パワーソリューショングループ｜事業紹介",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/business-group/energy-power-solution/",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-group-mineral-resources",
      title: "金属資源グループ｜事業紹介",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/business-group/mineral-resources/",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-group-materials-solution",
      title: "マテリアルソリューショングループ｜事業紹介",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/business-group/materials-solution/",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-group-smart-life-creation",
      title: "S.L.C.グループ｜事業紹介",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/business-group/smart-life-creation/",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-group-food-industry",
      title: "食品産業グループ｜事業紹介",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/business-group/food-industry/",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-group-social-infrastructure",
      title: "社会インフラグループ｜事業紹介",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/business-group/ud-infrastructure/",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-group-mobility",
      title: "モビリティグループ｜事業紹介",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/business-group/mobility/",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-history-explore",
      title: "MCの「歴史」を知る｜Explore MC",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/explore/history/",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-history-roots-01",
      title: "あゆみ 1954年～【第1話】高垣社長の第一声“万事正々堂々と”～新生・三菱商事の発足",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/history/roots/1954-vol01.html",
      accessedAt: "2026-09-13",
    },
    {
      id: "official-history-roots-07",
      title: "あゆみ 1954年～【第7話】新規分野への積極的な進出～ブルネイLNGプロジェクトなど、海外への投資を本格化",
      publisher: "三菱商事株式会社",
      url: "https://www.mitsubishicorp.com/jp/ja/about/history/roots/1954-vol07.html",
      accessedAt: "2026-09-13",
    },
  ],

  // Every judgement call (7 groups instead of the 有報's 8 segments, the
  // computed エネルギー＆パワーソリューション revenue used only for ordering,
  // shortNameEn) is recorded in the research log. None is an unverified fact,
  // so the entry is published.
  status: { state: "published" },

  revisions: [
    {
      date: "2026-09-14",
      kind: "ai-generated",
      summary:
        "有価証券報告書（2025年度・2024年度）、2026年3月期決算短信、2026年3月期・2027年3月期の第1四半期決算短信、2025年度決算説明会資料、公式サイト「事業紹介」「MCの歴史を知る」「あゆみ」に基づきAIが作成",
    },
  ],

  updatedAt: "2026-09-14",
};
