# GMO TECHホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＧＭＯ　ＴＥＣＨホールディングス株式会社 |
| 証券コード | 415A |
| docID（データを取り出した文書） | `S100XS80` |
| 原本 docID | `S100XS80` |
| 提出日（原本） | 2026-03-19 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XS80.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＧＭＯ　ＴＥＣＨホールディングス株式会社 / 415A / docID S100XS80（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gmo-tech-holdings: 2 件の数値を有報XBRLと照合
有報: ＧＭＯ　ＴＥＣＨホールディングス株式会社 有価証券報告書－第1期(2025/01/01－2025/12/31) (docID S100XS80)
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
gmo-tech-holdings: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「GMO TECHホールディングス株式会社」が EDINET の提出者名「ＧＭＯ　ＴＥＣＨホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営統合に伴い負ののれん発生益が計上されている旨が有報に印字されているが、財務数値は売上高と当期純利益のみを書く規則のため、その金額や内訳は本文・各フラグメントに記載しなかった。
- businessModel: セグメント利益・損失の金額は規則により記載しなかった。セグメント間の内部売上高又は振替高は不動産テック事業の0百万円のみで、売上高の調整額はない。
- businessModel: 経営指標等の注記のうち、１株当たり当期純利益の算定方法（注記３）と潜在株式が存在しない旨（注記４）は表示事項のため、financialNotesには入れなかった。注記１（設立のため前期以前の記載なし）と注記２（企業結合の基礎）はfinancialNotesに集約した。
- businessModel: 中期経営計画の数値目標（2028年度の売上高・利益の目標や市場変更の目標）は投資・利益の指標のため、本文と戦略には記載しなかった。
- businessModel: 配当政策に関する記述（配当の基準や負ののれん発生益の按分）は投資の語に当たるため記載しなかった。
- businessStructure: 期間後の2026年２月にGMO TECH株式会社を通じて株式会社トライハッチ（現GMOトライハッチ株式会社）の全株式を取得し完全子会社（孫会社）化しているが、登録は2025年12月31日現在の連結子会社6社の構成で行った（needsReviewにも記載）。
- businessStructure: 提出会社の本社（東京都渋谷区）は【主要な設備の状況】でセグメント欄が「全社（共通）」と印字されているため、どの事業にも結びつけなかった。GMO TECH株式会社の本社（東京都渋谷区）は集客支援事業の設備として印字されている。設備の帳簿価額は記載していない。
- businessStructure: GMO ReTech株式会社については債務超過である旨の注記が【関係会社の状況】にあるが、金額は記載していない。
- businessStructure: このツリーの旧スキーマに従い、suppliersキーは省略した。仕入先の個別名は【事業の内容】に印字されていない。
- history: 沿革の印字のうち、本社移転（2008年恵比寿、2009年桜丘町への移転、デザインワン・ジャパンの各移転）、個別サービスの開始（2008年「SEO AIRLINES」、2011年MEO・「SmaADアドネットワーク」、2017年「GMO SmaAFFi」、2019年「Feed Dash! byGMO」・「GMO jobbi」・「DeepCrawl」国内独占販売、2020年から2024年の賃貸DX各アプリ、2024年「GMOアプリ外課金」、2025年「LLMO Dash! byGMO」・「Google地図対策」）、拠点開設（2016年宮崎オフィス、2018年福岡支社、2021年金沢支社）、デザインワン・ジャパンの2016年市場第一部への市場変更、「エキテン求人」「エキテンプロ」の開始（2016年）、「ZENO」の提供開始（2020年）、子会社化（2019年Nitro Tech Asia、2021年イー・ネットワークス）、韓国法人の設立（2025年）は、個別の出来事として沿革に含めず省略した。2025年の中期経営計画の策定はbusinessModelの戦略に記載した。2007年の第三者割当増資は資本金の金額を含むため記載していない。
- history: 年月は有報の印字のうち年だけを採用し、月は書かなかった。
- history: wikipedia.jsonでは記事「GMO TECH」が見つかったが、旧社名や設立の経緯など有報に無い補足は沿革にすべて印字されていたため、補足には使わなかった。
- industry: 主たる業界は、売上の大半を占める集客支援事業（外部顧客への売上高6,467百万円）がインターネット集客支援サービスであるためitとした。不動産テック事業は報告セグメントとして独立開示され外部顧客への売上高もあるため、2つ目にreal-estateを付けた。
- industry: インターネットメディアサービス（エキテン byGMO）は集客支援事業の一部で金額が独立して開示されていないため、mediaは付けなかった。
- relatedCompanies: gmo-tech: 当社の完全子会社（連結子会社）であり関連企業リンクの対象ではないため結ばなかった。2025年9月に上場を廃止しており現在のコードリストにもない。
- relatedCompanies: designone-japan: 当社の完全子会社（現GMOデザインワン株式会社）であり対象ではないため結ばなかった。2025年9月に上場を廃止している。
- relatedCompanies: dentsu-group: MD&Aで日本の広告費の統計の出典として引用されているだけで、当社との取引・提携の記載がないため結ばなかった。
- relatedCompanies: vector: 期間後の株式会社トライハッチの株式取得で譲渡相手先として注記に現れる一回限りの取引相手であり、継続的な関係の記載がないため結ばなかった。
- relatedCompanies: gmo-globalsign-holdings: 役員の兼務先としてのみ現れ、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: gmo-media: 役員の兼務先としてのみ現れ、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: gmo-payment-gateway: 役員の兼務先としてのみ現れ、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: gmo-product-platform: 役員の兼務先としてのみ現れ、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: gmo-financial-holdings: 役員の兼務先としてのみ現れ、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: en: 「エンジン」の一般語との一致（ambiguous）のため結ばなかった。suzuki-6785: 代表取締役社長CEOの個人名「鈴木明人」との一致であり株式会社鈴木とは無関係のため結ばなかった。no-1: 経営方針の「圧倒的No.1」という一般表現との一致のため結ばなかった。seki: 「セキュリティ」の部分一致（ambiguous）のため結ばなかった。port: 「サポート」の部分一致のため結ばなかった。base-4481: 「連結ベース」の一般表現との一致のため結ばなかった。career: 人材育成の記述中の「キャリア」の一般語との一致のため結ばなかった。ray: 「ディスプレイ広告」の部分一致（ambiguous）のため結ばなかった。corona: 「コロナ禍」の一般語との一致のため結ばなかった。king: 「クラッキング」の部分一致のため結ばなかった。land: 「ブランド」の部分一致のため結ばなかった。rhythm: 「アルゴリズム」の部分一致のため結ばなかった。slogan: 経営方針中の「スローガン」の一般語との一致のため結ばなかった。vision: 経営方針中の「ビジョン」の一般語との一致のため結ばなかった。
- relatedCompanies: 株式会社トライハッチ（現GMOトライハッチ株式会社）は期間後に完全子会社（孫会社）化した当社グループ会社であり、関連候補に無い。株式会社ティーエーケーは【大株主の状況】に載るが関連候補に無く取引の記載もないため結ばなかった。外部顧客への売上高の10%以上を占める主要な顧客はない（【関連情報】）。特定投資株式は「該当事項はありません」。連結子会社6社はリンク対象ではない。
- terms: 助言: 「MEO」は有報の注記どおりMap Engine Optimizationの略で、Googleマップでの上位表示を実現する施策を指します。「SEM」はSearch Engine Marketingの略です。本文ではいずれも有報の説明に沿って記述しました。「エキテン byGMO」「GMO SmaAD」「GMO賃貸DX」「MEO Dash! byGMO」は当社グループのサービス名です。

## 要確認（status に反映）

- businessModel: 期間後の2026年２月27日に、連結子会社のGMO TECH株式会社を通じて株式会社トライハッチ（現GMOトライハッチ株式会社）の全株式を取得し、完全子会社（孫会社）化しています。登録は2025年12月31日現在のグループ構成で行っており、期間後の子会社追加の反映には人の確認が必要です。
- businessStructure: 期間後の2026年２月27日に、連結子会社のGMO TECH株式会社を通じて株式会社トライハッチ（現GMOトライハッチ株式会社）の全株式を取得し、完全子会社（孫会社）化しています。登録は2025年12月31日現在のグループ構成で行っており、期間後の子会社追加の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
