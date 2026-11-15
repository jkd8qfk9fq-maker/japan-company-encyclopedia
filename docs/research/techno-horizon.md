# 株式会社テクノホライゾン — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | テクノホライゾン株式会社 |
| 証券コード | 6629 |
| docID（データを取り出した文書） | `S100YLV9` |
| 原本 docID | `S100YLV9` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLV9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | テクノホライゾン株式会社 / 6629 / docID S100YLV9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
techno-horizon: 10 件の数値を有報XBRLと照合
有報: テクノホライゾン株式会社 有価証券報告書－第16期(2025/04/01－2026/03/31) (docID S100YLV9)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":350410000,"latestFiling":369585000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
techno-horizon: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円印字を百万円に切り捨てて記載した（切り上げはしていない）。
- businessModel: 経常利益の2025年3月期の値は、前期有報の印字（350,410千円）と当期有報の印字（369,585千円）で異なる。経常利益は本文に転記しない指標であり、転記対象の売上高・当期純利益を含む全系列は前期有報と一致し、指標注記にも修正再表示の記載がないため、financialNotesには入れず本warningsに記録する。
- businessModel: 地域ごとの情報の表示方法の変更（マレーシアの区分表示、中国・北米・欧州の統合）は表示方法の変更のみであり、5年指標に影響しないためfinancialNotesには入れていない。
- businessModel: 会社が重視する経営指標（売上高営業利益率、自己資本当期純利益率）は利益・投資に関する指標のため、strategyの本文には転記していない。
- businessModel: 株式会社ブルービジョンは期中に全事業を当社へ譲渡したが、2026年3月31日現在も連結子会社であり清算手続き中のため、needsReviewに含めた。
- businessStructure: セグメントの並びはセグメント注記の外部顧客への売上高の大きい順（映像＆ＩＴ事業37,768,873千円、ロボティクス事業13,611,758千円）。金額は千円印字を百万円に切り捨てて記載した。
- businessStructure: childrenは【事業の内容】及びセグメント概要に印字された製品・サービスの区分であり、区分ごとの外部売上高は開示されていないため金額は書いていない。
- businessStructure: 連結子会社は2026年3月31日現在23社。特定子会社のESCO Pte. Ltd.及びPACIFIC TECH PTE.LTD.の単体売上高は連結会社相互間の内部売上高を含む数値のため、事業の金額には使っていない。
- history: 沿革表は2023年3月以降、年月セルと事象文が分離して崩れているため、年月と事象の対応を他の節で裏付けられる2022年までの行だけを使い、それ以降の行は使っていない。
- history: 資本金の金額は沿革に書いていない（禁止される財務金額のため）。
- industry: 主たる業界は electronics とした。最大セグメントの映像＆ＩＴ事業（売上高37,768百万円）は書画カメラ・電子黒板等の光学・映像機器が中核である。ロボティクス事業（売上高13,611百万円）はロボットコントローラ・工作機械用ＣＮＣ装置・検査装置等のＦＡ機械であり、報告セグメントとして開示されているため machinery を2つ目に付けた。半導体製造向けＸ線検査装置はロボティクス事業の一部であり独立開示がないため semiconductors は付けていない。
- relatedCompanies: nidec（ニデック株式会社）は結ばない。業務提携の開始が印字されている相手は同社の子会社ニデックアドバンステクノロジー株式会社であり、ニデック株式会社そのものとは別法人である（事実：半導体製造向けハイエンドＸ線検査装置について同子会社との業務提携を開始した旨がMD&Aに印字）。
- relatedCompanies: nagoya-electric-works（名古屋電機工業株式会社）は結ばない。2022年10月に実装プリント基板の検査装置事業を譲り受けた過去1回の取引であり、継続的な取引・提携関係の印字はない（沿革に記録）。
- relatedCompanies: v-cube（株式会社ブイキューブ）は結ばない。関連候補でもコードリストにないとされ、2018年の電子黒板サービス事業の譲受と2025年のプロフェッショナルワーク事業の譲受はいずれも過去の事業譲受である。
- relatedCompanies: the-ogaki-kyoritsu-bank（株式会社大垣共立銀行）及びthe-bank-of-nagoya（株式会社名古屋銀行）は結ばない。特定投資株式の保有目的はいずれも「主要取引金融機関であり、良好な取引関係の維持・強化のため」という資金調達先としての保有であり、大株主の状況でも大垣共立銀行は常任代理人経由の記載である。なお、名古屋銀行の株式数の増加理由として印字された株式分割は同行自身のものである。
- relatedCompanies: dai-ichi-life-holdings（第一生命ホールディングス株式会社）は結ばない。特定投資株式の保有目的は団体保険等の取引関係の維持・強化（保険取引）である。なお、同社は2026年4月1日付で株式会社第一ライフグループに商号変更した旨が印字されている。
- relatedCompanies: en、vision、career、port、seki、core、cota、innovation、optoelectronics、land、trustはいずれも一般語・部分一致の誤検出であり（vision＝ブルービジョン等自社子会社名の一部、optoelectronics＝技術用語、port＝サポート等）、取引・提携・資本関係の印字はないため結んでいない。
- relatedCompanies: 主要な顧客ごとの情報では売上高の10％以上を占める顧客はなく、関係会社の状況に親会社・持分法適用関連会社・その他の関係会社の記載はない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

- businessModel: 2026年5月25日開催の取締役会において、2027年4月1日（予定）を効力発生日として、完全子会社のアポロ精工株式会社を当社が吸収合併することを決議し、同日付で合併契約を締結した（重要な後発事象に印字）。本登録は2026年3月31日時点のグループ構成で行う。
- businessModel: 連結子会社のELMO Industry (Thailand) Co.,Ltd.及び株式会社ブルービジョンは、2026年3月31日現在、清算手続き中である（関係会社の状況に印字）。本登録は2026年3月31日時点のグループ構成で行う。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
