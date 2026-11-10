# 中央魚類 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 中央魚類株式会社 |
| 証券コード | 8030 |
| docID（データを取り出した文書） | `S100YTB5` |
| 原本 docID | `S100YL2H` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YTB5／有効文書 S100YTB5（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YTB5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 中央魚類株式会社 / 8030 / docID S100YL2H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
chuo-gyorui: 10 件の数値を有報XBRLと照合
有報: 中央魚類株式会社 訂正有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YTB5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第79期(2025/04/01－2026/03/31)、docID S100YTB5）を有効文書としてこのパックを作った。原本は docID S100YL2H。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock・NotesRealEstateForLeaseEtcConsolidatedFinancialStatementsTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
chuo-gyorui: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 変則決算・決算期の変更・会計基準の変更はありません。financialNotes は空です。
- businessStructure: 事業は報告セグメントの外部顧客への売上高の大きい順に並べました（水産物卸売事業149,281百万円、冷蔵倉庫事業8,043百万円、荷役事業687百万円、不動産賃貸事業586百万円）。
- businessStructure: 連結子会社7社及び持分法適用関連会社1社は非上場のため、relatedCompanies には結んでいません。
- history: 沿革は有報の【沿革】の記載から選びました。資本金などの金額は沿革の本文には記載していません。
- industry: 水産物卸売事業が売上の大半を占める卸売業であり、主たる業界は商社（trading）としました。
- relatedCompanies: 極洋：候補一覧では ambiguous とされていましたが、【大株主の状況】と【株式の保有状況】の両方に正式名称「株式会社極洋」が印字され、証券コード1301と一致するため、同一性を確認して結びました。
- relatedCompanies: 連結子会社7社（柏魚市場、ホウスイ、水産流通、せんにち、中央フーズ、マルナカロジスティクス、豊海）及び持分法適用関連会社1社（船橋魚市）は非上場のため、relatedCompanies には結んでいません。
- relatedCompanies: 足利本店（7.64%の大株主）、築地蟹商、伊藤裕康は非上場または個人のため結んでいません。三菱ＵＦＪ銀行、みずほ銀行は金融機関の純投資のため結んでいません。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ、みずほフィナンシャルグループ、三井住友トラストグループ：当社が株式を保有していますが、保有目的が「財務面での関係強化」であり、取引・提携の根拠がないため結んでいません。
- relatedCompanies: ポート：本文中の「リテールサポート」の一部に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: キャリア：人材に関する記載の一般語「キャリア」に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: ベース：「連結ベース」の一般語に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: パス：候補一覧で ambiguous とされており、「ウィル柏の葉キャンパス」の地名の一部に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: ウィル：「ウィル柏の葉キャンパス」の地名の一部に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: セキ：候補一覧で ambiguous とされており、一般語に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: スペース：「保管スペース」の一般語に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: コロナ：「コロナ禍」の一般語に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: エン：候補一覧で ambiguous とされており、「エンゲージメント」の一部に社名が一致しただけで、会社としての言及ではないため結んでいません。
- relatedCompanies: リックス：「スキルマトリックス」の一部に社名が一致しただけで、会社としての言及ではないため結んでいません。
- terms: 用語の助言はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 中央魚類の主たる業界 → 提案: wholesale（卸売業）。水産物卸売業が売上の大半を占める卸売業であり、閉じた分類に卸売業がないため商社を暫定とした
