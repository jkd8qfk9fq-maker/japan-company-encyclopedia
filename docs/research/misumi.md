# Misumi — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｍｉｓｕｍｉ |
| 証券コード | 7441 |
| docID（データを取り出した文書） | `S100YHK6` |
| 原本 docID | `S100YHK6` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHK6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｍｉｓｕｍｉ / 7441 / docID S100YHK6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
misumi: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｍｉｓｕｍｉ 有価証券報告書－第70期(2025/04/01－2026/03/31) (docID S100YHK6)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":61266804000,"latestFiling":61266000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":63792051000,"latestFiling":63792000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":60656681000,"latestFiling":60656000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":62367551000,"latestFiling":62367000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":485187000,"latestFiling":485000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":673127000,"latestFiling":673000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":710150000,"latestFiling":710000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":1037438000,"latestFiling":1037000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":1383018000,"latestFiling":1383000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":1293227000,"latestFiling":1293000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":1259455000,"latestFiling":1259000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":1342551000,"latestFiling":1342000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":36049146000,"latestFiling":36049000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":40294659000,"latestFiling":40294000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":41619804000,"latestFiling":41619000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":41626690000,"latestFiling":41626000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":17429581000,"latestFiling":17429000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":18006931000,"latestFiling":18006000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":19417432000,"latestFiling":19417000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":19992923000,"latestFiling":19992000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第69期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
misumi: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Misumi」が EDINET の提出者名「株式会社Ｍｉｓｕｍｉ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックの差異は、売上高・純利益・総資産・純資産等の全項目とも百万円未満の端数差異（前期有報の円単位の値と当期有報の百万円単位の印字との差）であり、第69期の訂正有価証券報告書によっても5年間の主要な経営指標（百万円単位）は変わらないことを確認した。表示上の端数差異であるためfinancialNotesには書かず本warningsに記録した。登録は当期有報の印字どおりの値である。
- businessModel: 目標とする経営指標の正式名称は「自己資本比率」及び「自己資本利益率」である。本文では数値を転記せず、定性的に要約した。
- businessModel: MD&Aでは売上高が「600億36百万円」のように億単位で表記されているが、本文の金額は主要な経営指標等及び注記事項（セグメント情報等）の百万円表記に統一した。
- businessModel: businessModel.suppliersは省いた。調達先の類型を述べる記載が有報にないためである（仕入先は重要な契約等の特約販売契約先として本文に記載した）。
- businessStructure: セグメントは外部顧客への売上高の大きい順に並べた。3セグメントの外部顧客への売上高の合計60,036百万円は連結売上高と一致する。
- businessStructure: エネルギーの4部門とフード＆ビバレッジの2部門は【事業の内容】の区分によるもので、金額は個別に開示されていないため金額なしで記した。
- businessStructure: 当社グループは当社、連結子会社8社、関連会社1社及びその他の関係会社1社で構成される。関係会社のうち個別に名称が開示されている連結子会社は南九州トーヨータイヤ株式会社のみで、他は社数が示されるにとどまる。
- history: 沿革は有報の印字から主要な節目を選んだ。給油所・店舗の開設や海上基地の設置等の細目は一部を除き省いた。株式の譲受株数や設立時等の資本金の金額は転記していない。
- industry: 主たる業界は、2026年3月期の外部顧客への売上高の約4分の3（44,930百万円）を占める石油・ＬＰガスのエネルギー事業を本体とするためenergyとした。ライフスタイル（書籍・自動車・住宅等）とフード＆ビバレッジ（外食）は地域密着の複合事業の一部であり、副業界は付けなかった。
- relatedCompanies: ＥＮＥＯＳ株式会社及びＥＮＥＯＳグローブ株式会社：石油関連商品・ガス関連商品の特約販売契約の相手方だが、いずれもＥＮＥＯＳホールディングス株式会社の子会社であり別法人であるため、それ自体としては結ばなかった。契約の事実はbusinessModelに記載した。
- relatedCompanies: ＴＯＹＯ　ＴＩＲＥ株式会社：当社の発行済株式の3.22％を保有する大株主であり、当社もライフスタイル事業の取引拡大のため同社株式を保有する相互保有の関係にあるが、候補一覧に含まれていないため結ばなかった。連結子会社の南九州トーヨータイヤ株式会社は当社グループの会社であり対象外である。
- relatedCompanies: 三角開発株式会社：その他の関係会社で、当社の発行済株式の26.28％を保有する筆頭株主でありゴルフ場の運営を行うが、未上場で候補一覧にも百科事典の対象企業ファイルにもないため結ばなかった。
- relatedCompanies: 株式会社九州フィナンシャルグループ、株式会社宮崎銀行、株式会社三井住友フィナンシャルグループ、株式会社ふくおかフィナンシャルグループ、株式会社西日本フィナンシャルホールディングス、三井住友トラストグループ株式会社、株式会社みずほフィナンシャルグループ（いずれも候補）：特定投資株式の保有目的が「金融取引の円滑化及び関係強化のためであります」という全銘柄共通の定型文であり、それだけでは結ばなかった（koa先例）。株式会社南日本銀行も同じ定型文で、候補一覧にも含まれていない。
- relatedCompanies: イオン九州株式会社、株式会社アクシーズ（いずれも候補）：特定投資株式の保有目的が「ライフスタイル事業の取引拡大及び関係強化のためであります」「事業の取引拡大及び関係強化のためであります」という事業名のみを差し替えた定型文であり、具体的な取引や提携の内容がなく、それだけでは結ばなかった（koa・ハリマ共和物産の先例）。ＮＴＴ株式会社も同じ定型文で、候補一覧にも含まれていない。
- relatedCompanies: 株式会社ピエトロ（候補）：1999年にフランチャイズ契約を締結しピエトロ・バルコーネの1号店を開設したことが沿革に記載されるのみで、当事業年度の重要な契約等には同社との契約の記載がなく、現在の関係を示す印字がないため結ばなかった。
- relatedCompanies: 日本ケンタッキー・フライド・チキン株式会社：フランチャイズ契約の相手方でフード＆ビバレッジ事業の中核だが、未上場で候補一覧にも百科事典の対象企業ファイルにもないため結ばなかった。契約の事実はbusinessStructure及びbusinessModelに記載した。
- relatedCompanies: コーアツ工業株式会社（候補）：特定投資株式は当事業年度に全て売却済みであり、結ばなかった。
- relatedCompanies: 候補一覧のうちキャリア、エン、ベース、ランド、ポート、コロナ、パス、ヨータイは、一般語や社内用語、子会社名の一部との一致のみで当社の取引・提携・資本関係を示す記載がなく、対象外とした。
- relatedCompanies: 当社の連結子会社8社及び関連会社1社（株式会社ダイリン広告、広告の代理）は自社グループの会社であり、関連企業リンクの対象外とした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 助言: 用語「特約販売契約」は、ＥＮＥＯＳ株式会社（石油関連商品）及びＥＮＥＯＳグローブ株式会社（ガス関連商品）との契約で、九州等の販売区域における同社製品の販売と登録商標等の使用を認める契約。当社との契約は石油が1964年、ガスが1959年に第1回を締結し、1年ごとの自動更新である。
- terms: 助言: 用語「オプシアミスミ」は当社が鹿児島市に運営する複合商業施設で、ライフスタイル事業の拠点。
- terms: 助言: 用語「ＬＰガス海上受入基地」はＬＰガスの海上受入のための基地で、当社は鹿児島、種子島、八代、宮崎に設置している。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
