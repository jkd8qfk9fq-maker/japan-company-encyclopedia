# 日本情報クリエイト — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本情報クリエイト株式会社 |
| 証券コード | 4054 |
| docID（データを取り出した文書） | `S100Z492` |
| 原本 docID | `S100Z492` |
| 提出日（原本） | 2026-09-28 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z492.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本情報クリエイト株式会社 / 4054 / docID S100Z492（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
japan-proptech: 10 件の数値を有報XBRLと照合
有報: 日本情報クリエイト株式会社 有価証券報告書－第32期(2025/07/01－2026/06/30) (docID S100Z492)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-06-30","previousFiling":3770377000,"latestFiling":3256262000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-06-30","previousFiling":4436894000,"latestFiling":3780948000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-06-30","previousFiling":5075325000,"latestFiling":4892537000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-06-30","previousFiling":538181000,"latestFiling":635848000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-06-30","previousFiling":376010000,"latestFiling":280827000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-06-30","previousFiling":740273000,"latestFiling":521097000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-06-30","previousFiling":1003173000,"latestFiling":937854000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-06-30","previousFiling":5364030000,"latestFiling":4714536000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-06-30","previousFiling":5109880000,"latestFiling":4590474000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-06-30","previousFiling":5569912000,"latestFiling":5126646000},{"key":"NetAssetsSummaryOfBusinessResults|2022-06-30","previousFiling":3140323000,"latestFiling":3237989000},{"key":"NetAssetsSummaryOfBusinessResults|2023-06-30","previousFiling":3121753000,"latestFiling":3197975000},{"key":"NetAssetsSummaryOfBusinessResults|2024-06-30","previousFiling":3466455000,"latestFiling":3439801000},{"key":"NumberOfEmployees|2022-06-30","previousFiling":306,"latestFiling":294},{"key":"NumberOfEmployees|2023-06-30","previousFiling":307,"latestFiling":293},{"key":"NumberOfEmployees|2024-06-30","previousFiling":313,"latestFiling":291}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
japan-proptech: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックで売上高・従業員数などに差異が出ていますが、これは再表示や訂正ではありません。第31期まで連結財務諸表を作成しており（経営指標等の推移の注記８）、前期有報の主要な経営指標は連結の数値でした。当事業年度は個別財務諸表のみを作成しているため（セグメント情報等の冒頭の記載）、当期の表は提出会社単体の数値です。MD&Aでも前事業年度の単体財務諸表に基づく実績との比較が行われ、売上高11.9％増・当期の表の前期売上高4,892,537千円と整合しています。そのため当期の指標数値への影響はなく、financialNotes には連結終了の注記のみを記録し、残りはここに記録します。
- businessModel: 経営指標等の推移の注記のうち、注記１（関連会社を有していないため持分法を適用した場合の投資利益を記載していないこと）、注記２（１株当たり指標の算定基礎）、注記３（期末配当が株主総会の決議事項であること）、注記４（中間配当が上場５周年記念配当であること）、注記５（株主総利回りの比較指標の変更）、注記６（最高・最低株価の市場区分）、注記７（平均臨時雇用人員の記載省略）は表示上の事項のため、financialNotes には書いていません。株式分割は経営指標の注記には印字されていません（2020年12月の株式分割は沿革の記載で、指標注記の対象ではありません）。
- businessModel: セグメント情報等の関連情報（製品及びサービスごとの情報）の千円印字は、仲介ソリューション1,999,895千円・管理ソリューション3,356,859千円・その他115,877千円で、合計の印字5,472,633千円に対し内訳の合計は5,472,631千円と2千円の差があります（提出会社の印字どおり）。百万円への切り捨て後の内訳合計は5,470百万円で、売上高5,472百万円とは2百万円の差があります。いずれも印字どおりとし、ここに記録します。
- businessModel: 重要な後発事象は「該当事項はありません」。重要な契約等も「該当事項はありません」です。提出後の構造的な事象は確認できないため、needsReview はありません。
- businessModel: 経営方針・MD&Aが重視する客観的な指標（売上高と中間段階の利益の前年増加額）とその金額、MD&Aの段階利益の金額や理由、キャッシュ・フローの金額、売上原価・販管費の内訳金額、配当などの資本政策の金額は書いていません。
- businessModel: 株式会社Ｙｏｕｆｉｔは2024年12月に株式取得により完全子会社化されたことが沿革に印字されていますが、当事業年度末の関係会社の状況は「該当事項はありません」で、当事業年度は個別財務諸表のみを作成しています。同社の退出の経緯は抽出本文に印字がないため、推測は書いていません。
- businessStructure: セグメントは不動産業務支援事業の単一セグメントであり、金額はセグメント情報等の関連情報（製品及びサービスごとの情報）の外部顧客への売上高を使っています。MD&Aのサービス分類別売上高も同じ金額です。
- businessStructure: 設備は宮崎本社（従業員168人）と東京本社ほか26拠点（同180人）で、いずれも単一セグメントに属し、サービス分類との対応は印字されていません。帳簿価額は書いていません。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略しています。販売経路は直販と販売店経由（当社の製品を利用する不動産会社を紹介し、当社と販売店契約を締結する者）があり、一部に保守サービスも代理で提供する代理店形態があることが【事業の内容】に印字されています。個別の販売店名は印字されていません。買掛金の相手先別内訳に印字された社名は内訳の記載のみで、取引関係の説明はないため関連企業にも結んでいません。
- history: 沿革から省略し、ここに列挙します: 本社移転（1997年・2000年・2011年）、営業所・支店の設置（1998年東京、2000年大阪、2001年福岡、2003年仙台・広島、2004年札幌、2006年名古屋、2011年四国、2016年北陸、2017年埼玉、2023年宇都宮、2021年の18拠点増設）、個別製品の発売（1995年「見積革命」、1998年「売買革命」、2006年「Ｗｅｂ Ｍａｎａｇｅｒ Ｐｒｏ」、2012年「賃貸革命クラウド版」・「売買革命クラウド版」、2013年「Ｗｅｂ Ｍａｎａｇｅｒ Ｌｉｔｅ」、2015年の各現行版、2016年「売買革命10」、2017年「賃貸革命10」、2020年「非対面仲介サービス」、2021年「電子契約サービス」、2025年「賃貸革命11」）、2006年12月のＩＳＯ２７００１取得、2020年12月の株式分割及び定款変更、2021年４月の経済産業省「ＤＸ認定事業者」認定、2022年１月の東京本社設置による二本社制、同年４月の東証グロース市場への移行、2023年３月の東京本社移転、同年４月の指標「ＣＲＩＸ」提供開始、同年５月の生成ＡＩ研究開発チーム発足、同年９月の２代表制への移行、2024年11月の株主優待制度の新設発表、同年12月の株式会社Ｂｃａｎとの資本業務提携。資本金額は沿革にも書いていません。
- history: 沿革の表は年月と概要が同じ行に印字されており、行の対応付けの問題はありません。Wikipedia は found: false のため使っていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、不動産業務支援事業の単一セグメントで不動産会社向けのクラウドサービスを提供する事業がITサービスに直接当たるため it としました。
- industry: 顧客は不動産業界ですが、同社自身は不動産の仲介・管理の事業者ではなくソフトウェアとサービスを提供する会社であるため、real-estate は付けていません。DEIの別記事業は cte です。閉じた分類に直接当たるため、暫定分類や taxonomyGaps はありません。
- relatedCompanies: career: 「キャリア形成」等の一般語の一致のみです。
- relatedCompanies: vision: 「中期ビジョン」等の一般語の一致のみです。
- relatedCompanies: port: 「レポート」等の部分文字列の一致のみです。
- relatedCompanies: en: 「エンパワーメント」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: create: 自社名「日本情報クリエイト」に含まれる部分文字列の一致のみです。
- relatedCompanies: seki: 「セキュリティ」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: alpha / alpha-4760: 旭川営業所が入るビル名「アルファ旭川ビル」の一致のみです。
- relatedCompanies: ichigo: 船橋営業所が入るビル名「いちご船橋ビル」の一致のみです。
- relatedCompanies: members: 名古屋支店が入るビル名「栄メンバーズオフィスビル」の一致のみです。
- relatedCompanies: base-4481: 「データベース」等の部分文字列の一致のみです。
- relatedCompanies: cover: 「カバーする」という一般表現の一致のみです。
- relatedCompanies: dai-ichi-life-holdings: 特定投資株式として400株を保有し、保有目的は「取引保険会社との関係の維持・強化」と印字されていますが、もう１銘柄の株式会社宮崎太陽銀行の「取引銀行との関係の維持・強化」と同型の定型文であり、個別の取引の役割を示す記載ではないため、結んでいません。
- relatedCompanies: hikari-tsushin: 大株主にあるのは「光通信ＫＫ投資事業有限責任組合」（投資事業有限責任組合、1.03％）で、株式会社光通信とは別の法人であり、純投資の保有でもあるため、結んでいません。
- relatedCompanies: osaka-gas: 売掛金の相手先別内訳に印字されたのは「大阪ガス都市開発株式会社」で、大阪瓦斯株式会社とは別の法人であり、内訳の記載のみでもあるため、結んでいません。
- relatedCompanies: orix: 保険積立金の相手先として印字されたのは「オリックス生命保険株式会社」で、オリックス株式会社とは別の法人であるため、結んでいません。
- relatedCompanies: ricoh: 買掛金の相手先別内訳に印字されたのは「リコージャパン株式会社」で、株式会社リコーとは別の法人であり、内訳の記載のみでもあるため、結んでいません。
- relatedCompanies: serverworks: 買掛金の相手先別内訳の記載のみで、取引関係の説明が印字されていないため、結んでいません。
- relatedCompanies: ray: 住所表記等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: taya: 「世田谷区」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: nissin: 株式発行の事務的な記載の部分文字列の一致のみで、コードリストにもなく、ambiguous でもあり、結んでいません。
- relatedCompanies: trust: 「日本マスタートラスト信託銀行株式会社（信託口）」の部分文字列の一致のみで、コードリストにもないため、結んでいません。
- relatedCompanies: 候補にないため記録します: 最大株主の株式会社ＮＪＣ（41.41％）は大株主の状況に印字されていますが候補にありません。株式会社Ｂｃａｎとは2024年12月に資本業務提携を行ったことが沿革に印字されていますが候補にありません。売掛金の最大の相手先である株式会社アプラスは候補にありません。特定投資株式のもう１銘柄である株式会社宮崎太陽銀行（500株、保有目的は「取引銀行との関係の維持・強化」）は候補にありません。自社の旧子会社（株式会社リアルネットプロ＝2024年７月に吸収合併、株式会社Ｙｏｕｆｉｔ＝2024年12月に完全子会社化）は結んでいません。
- terms: 助言のみ: 用語候補として 不動産ＤＸ、ＳａａＳ、クラウドサービス、ストック型収益、ＭＲＲ（月次経常収益）、ＡＲＰＵ、イニシャル／ランニング、ＩＴ重説、電子契約、賃貸管理、業者間物件流通、ＣＲＩＸ（賃料・空室率の指標）、カスタマーサクセス、解約率 などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
