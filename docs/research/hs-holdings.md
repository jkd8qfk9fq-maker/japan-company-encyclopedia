# ＨＳホールディングス — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＨＳホールディングス株式会社 |
| 証券コード | 8699 |
| docID（データを取り出した文書） | `S100YJQ6` |
| 原本 docID | `S100YJQ6` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJQ6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＨＳホールディングス株式会社 / 8699 / docID S100YJQ6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hs-holdings: 10 件の数値を有報XBRLと照合
有報: ＨＳホールディングス株式会社 有価証券報告書－第69期(2025/04/01－2026/03/31) (docID S100YJQ6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hs-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「HSホールディングス株式会社」が EDINET の提出者名「ＨＳホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全系列で差異ゼロであり、指標の注記に会計方針の変更や表示方法の変更の記載もないため、financialNotesは空とした。
- businessModel: 総資産額と従業員数が第67期（2024年３月期）に大きく減少しているのは、ハーン銀行が2023年５月のモンゴル証券取引所上場に伴い連結子会社から持分法適用関連会社へ異動したことによるもので、有報の沿革に記載された事実として沿革・事業構造に反映した。指標そのものは印字どおりであり、financialNotesには記載していない。
- businessModel: 経営上の目標として掲げるROEの数値目標は、投資関連用語を含むためstrategy本文には転記せず、定性的な方針のみを記載した。
- businessModel: MD&A本文のリユース事業の売上高552億51百万円は内部取引を含むセグメント計の数値であるため、本文の金額にはセグメント情報の外部顧客に対する営業収益55,249百万円を用いた。
- businessStructure: 報告セグメントの外部顧客に対する営業収益で事業を並べ替えた（リユース55,249百万円／銀行関連2,615百万円／その他14百万円）。その他事業の営業収益はセグメント間の内部営業収益7,474百万円を含む合計7,488百万円が印字されているが、本文には外部顧客に対する営業収益14百万円を用いた。
- businessStructure: 銀行関連事業の業績の中核は持分法適用関連会社２行の持分法による投資損益であり、セグメントの外部営業収益には含まれない。本文の事業説明にその旨を明記した。
- businessStructure: リユース事業の子部門別販売実績（BRING 11,470百万円／BRAND REVALUE 30,177百万円／PRICING DATA 10,062百万円／手数料収入3,742百万円）はMD&Aの販売実績表の印字だが、内部売上△203百万円を含む区分のため、childrenには金額を記載しなかった。
- history: 沿革の資本金の変動額（2005年11月30日の資本金額）は、資本金額を沿革に記載しないルールに従い転記しなかった。
- history: 各行に month キーは付けていない（年単位の記載）。
- industry: 主たる事業は銀行業務を中心に信用保証・リース・クレジットカード等の金融サービスを行うグループの持株会社であり、閉じた分類に finance が実在するため主分類とした。分類ギャップには当たらない。
- industry: リユース事業は報告セグメントとして外部顧客に対する営業収益の大部分を占めるため、小売を含む事業として retail を副分類とした。
- relatedCompanies: h-i-s（9603）：沿革に、1999年に株式会社エイチ・アイ・エスの代表取締役社長であった澤田秀雄氏が当社株式の70％超の大株主となった記載があるのみで、2026年３月31日現在の大株主の状況に同社および同氏は含まれず、現在の取引・提携関係の記載もないため不リンクとした。
- relatedCompanies: ascot（3264）：2009年に持分法適用関連会社、2010年に連結子会社となったが、2016年に株式の一部売却により連結から除外され、2020年に全株式を売却済みであり現在の関係はないため不リンクとした（候補の上場区分も「（コードリストにない）」）。
- relatedCompanies: japan-securities-finance（8511）・matsui-securities（8628）：大株主の状況に株主として記載があるのみ（日本証券金融4.31％、松井証券6.37％）で、取引・提携関係の記載がないため不リンクとした。
- relatedCompanies: ウプシロン投資事業有限責任組合は、その他の関係会社であり発行済株式の42.15％を所有する大株主だが、投資事業有限責任組合であり掲載候補に含まれないため不リンクとした。事実は大株主の状況および関係会社の状況に記載がある。
- relatedCompanies: ハーン銀行、キルギスコメルツ銀行、ソリッド銀行、株式会社STAYGOLD等のグループ会社は、自社の連結子会社・持分法適用関連会社であるため関連企業リンクの対象外とした。
- relatedCompanies: king、base-4481、en、port、seki、land、lec、future、ray、career、corona、hit は、本文中の一般語・部分一致（例：キングは「バンキング」の部分一致）であり、相手企業についての取引・提携・資本関係の記載がないため不リンクとした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessStructure: [object Object]

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
