# 日本鋳造 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本鋳造株式会社 |
| 証券コード | 5609 |
| docID（データを取り出した文書） | `S100YGG5` |
| 原本 docID | `S100YGG5` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGG5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本鋳造株式会社 / 5609 / docID S100YGG5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-chuzo: 10 件の数値を有報XBRLと照合
有報: 日本鋳造株式会社 有価証券報告書－第104期(2025/04/01－2026/03/31) (docID S100YGG5)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":12106000000,"latestFiling":11856000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":14811000000,"latestFiling":14207000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":15992000000,"latestFiling":15461000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":14311000000,"latestFiling":13478000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":814000000,"latestFiling":830000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":701000000,"latestFiling":602000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":1277000000,"latestFiling":1241000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":387000000,"latestFiling":317000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":21088000000,"latestFiling":21081000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":22663000000,"latestFiling":22415000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":23529000000,"latestFiling":23451000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":22325000000,"latestFiling":22016000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":11252000000,"latestFiling":11153000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":11367000000,"latestFiling":11201000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":11881000000,"latestFiling":11688000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":11885000000,"latestFiling":11650000000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":272,"latestFiling":269},{"key":"NumberOfEmployees|2023-03-31","previousFiling":277,"latestFiling":272},{"key":"NumberOfEmployees|2024-03-31","previousFiling":293,"latestFiling":290},{"key":"NumberOfEmployees|2025-03-31","previousFiling":294,"latestFiling":290}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
nippon-chuzo: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで前期有報との差異が示されたが、前期有報（第103期）は連結財務諸表を作成しており、照合は連結ベースの数値との差異である。当期有報の主要な経営指標等は単体の数値で、指標の注記にも第100期から第103期までは連結財務諸表を作成していた旨が印字されている。差異は連結範囲の変更（2025年7月1日の株式会社ダット吸収合併により当期から非連結）によるもので、数値の訂正ではないと判断し、financialNotes にその旨を記録した。
- businessModel: 経営方針に印字された経営指標の目標（ROS・ROEの目標水準やPBRに関する取組）は、投資・経営指標の目標であるため本文と戦略の要約には書かなかった。
- businessModel: 経営者による分析の営業利益・経常利益の金額と増減理由、池上地区の設備撤去に伴う特別の損失の内訳、株式会社ダットからの受取配当金や抱合せ株式消滅差益の金額は、本文の財務数値は売上高と当期純利益だけとする規則により書かなかった。
- businessModel: 清本鉄工株式会社および株式会社川金ホールディングスとの協業は、対処すべき課題に検討の推進と印字される段階のもので、関連企業候補にもないため結ばず、戦略の開示要約にのみ記した。
- businessStructure: 当社は「鋳造関連事業」の単一セグメントで、セグメント情報の記載は省略されている。子区分はセグメント注記の【関連情報】製品及びサービスごとの情報（外部顧客への売上高）を用いた。経営者による分析の販売実績では、同じ金額が素形材6,763百万円・エンジニアリング5,286百万円・その他241百万円と区分されている。
- businessStructure: 主要な設備の本社川崎工場（従業員231人）と福山製造所（同44人）はいずれも鋳造関連製造設備で、単一セグメントのため子区分への対応付けはしていない。帳簿価額は書いていない。
- businessStructure: 原材料の仕入先であるJFEスチールについては、このツリーの旧スキーマに従い suppliers キーを省略し、事業の内容の記載を relatedCompanies と businessModel に反映した。
- businessStructure: Wikipediaの記事は、有報の記載を超える補足（旧社名・製品名など）が沿革等で既に確認できる範囲にとどまるため、使用しなかった。
- history: 沿革の2008年3月・2009年7月の行は、年月セル2件と事象文2件が続けて印字された崩れた表で、行順に対応づけると2008年3月がエヌ・ディ・パウダー株式会社の清算結了、2009年7月が新東北メタル株式会社の株式の一部譲渡となる。2009年の譲渡のみ採用した。
- history: 沿革の2025年7月の「株式会社ダットの清算結了」の行は、事業の内容等に印字された吸収合併の記載と一致しないため採用しなかった（businessModel の needsReview に記録）。
- history: 落とした行: 子会社の株式取得・設立・清算（東北メタル、ダット興業、エヌシーシー、富岡工場、白石興産、キャストデザイン研究所など）、事業目的の追加、設備の新設・移設の細目（特殊鋳鋼工場、製鋼工場、建機部品工場、試験機・電気炉など）、支承管理センターの新設、落橋防止装置分野への参入。資本金の金額が印字された行は金額を除いて採用した。
- industry: 主たる業界は chemicals（暫定）とした。鋳造関連事業は金属素材・金属製品の製造であり、閉じた分類に鋳造・鉄鋼の区分がないため、素材製造として最も近い chemicals を暫定とし、taxonomyGaps に提案を記録した。自動車部品を主とする事業ではないため automotive は付けなかった。
- relatedCompanies: jfe-holdings: 関係会社の状況に当社自身の行が印字され、その他の関係会社として結んだ。取引の相手であるJFEスチール株式会社自体は候補一覧にない。
- relatedCompanies: hitachi-construction-machinery: 大株主の状況と関連当事者情報に主要株主として製品販売の取引が印字されており、major-shareholder として結んだ。
- relatedCompanies: jfe-steel（候補外）: その他の関係会社であり重要な販売先・原材料の仕入先だが、候補一覧にないため結べなかった。
- relatedCompanies: JFEエンジニアリング株式会社・JFE商事エレクトロニクス株式会社（候補外）: その他の関係会社の子会社として製品販売の取引が関連当事者情報に印字されるが、候補一覧にないため結ばなかった。
- relatedCompanies: amano: 受取手形・売掛金の相手先別内訳に名称と金額のみが載り、取引内容の説明がないため結ばなかった。
- relatedCompanies: mitsubishi-heavy-industries: 売掛金の相手先別内訳に名称と金額のみが載り、取引内容の説明がないため結ばなかった。
- relatedCompanies: oriental-shiraishi: 売掛金の相手先別内訳に名称と金額のみが載り、取引内容の説明がないため結ばなかった。
- relatedCompanies: narasaki-sangyo: 受取手形の相手先別内訳に名称と金額のみが載り、取引内容の説明がないため結ばなかった。
- relatedCompanies: nitta: 特定投資株式として保有するが、保有目的は「取引関係等の円滑化のため」という定型的な記載で、株式は株式会社ダットの吸収合併により承継したものであり、具体的な取引の説明がないため結ばなかった。
- relatedCompanies: nachi-fujikoshi: 特定投資株式として保有するが、保有目的は「取引関係等の円滑化のため」という定型的な記載で、具体的な取引の説明がないため結ばなかった。
- relatedCompanies: freee: 「フリー」はフリー・キャッシュ・フローの語の一部であり、フリー株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: kohsoku: 「高速」は高速道路や試験機の名称の語であり、株式会社高速との関係の記載がないため結ばなかった。
- relatedCompanies: shinto: 「新東」は新東北メタル株式会社を指す記載であり、新東株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: the-lead: 「リード」は製造リードタイムの語であり、株式会社リードとの関係の記載がないため結ばなかった。
- relatedCompanies: zero: 「ゼロ」はCO2排出ゼロの語であり、株式会社ゼロとの関係の記載がないため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」はサステナビリティの取組に関する一般的な語であり、株式会社イノベーションとの関係の記載がないため結ばなかった。
- relatedCompanies: seki: 「セキ」はセキュリティの語の一部であり、セキ株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: base-4481: 「ベース」はNCベースの語であり、ベース株式会社との関係の記載がないため結ばなかった。
- terms: 用語の助言: 「素形材」は鋳鋼品・鋳鉄品などの素材系製品を指す当社の区分、「エンジニアリング」は支承などの鋼構造品を指す当社の区分、「支承」は橋梁などの構造物の荷重を支える部材、「マイティバー」は連続鋳造方式による鋳鉄素材の商品名、「グリーンキャスティングス®」はCO2排出ゼロの鋳鋼品の商品名を指します。

## 要確認（status に反映）

- businessModel: [object Object]

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] nippon-chuzoの主たる業界（鋳造関連事業） → 提案: 鋳造（鋳鋼・鋳鉄）。売上高の全てを占める鋳造関連事業は、鋳鋼品・鋳鉄品と橋梁用支承などの鋼構造品の製造・販売ですが、閉じた分類に鋳造や鉄鋼を表す区分がなく、金属素材の製造として最も近い chemicals を暫定としました。
