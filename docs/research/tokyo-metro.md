# 東京地下鉄 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東京地下鉄株式会社 |
| 証券コード | 9023 |
| docID（データを取り出した文書） | `S100YZAA` |
| 原本 docID | `S100YHLQ` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YZAA／有効文書 S100YZAA（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YZAA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東京地下鉄株式会社 / 9023 / docID S100YHLQ（id は英語表記「Tokyo Metro Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-metro: 10 件の数値を有報XBRLと照合
有報: 東京地下鉄株式会社 訂正有価証券報告書－第22期(2025/04/01－2026/03/31) (docID S100YZAA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第22期(2025/04/01－2026/03/31)、docID S100YZAA）を有効文書としてこのパックを作った。原本は docID S100YHLQ。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（ManagementAnalysisOfFinancialPositionOperatingResultsAndCashFlowsTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
すべて一致しました。
tokyo-metro: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業収益の増加額は有報の印字（4,224億1千4百万円）に合わせました。営業利益などは書いていません。perspectives は省きました。
- businessStructure: 並び順は【セグメント情報】の外部顧客への営業収益（当期）: 運輸384,108、ライフ・ビジネスサービス23,603、不動産14,455百万円。【事業の内容】の掲載順（運輸・不動産・ライフ）や「計」の行は使っていません。「その他」は報告セグメントに含まれないため最後に置きました。
- businessStructure: 訂正有報は原本と主要財務が同一で、本文だけが変更（MD&A）です。事業の内容・セグメント注記は有効文書の値を使いました。
- businessStructure: セグメント利益・資産などは本文に書いていません。children の金額は有報に独立した開示がないため書いていません。
- history: 沿革表は営団の沿革と提出会社の沿革に分かれています。路線の開業は営団の沿革の印字どおりに、丸ノ内線以降を1件にまとめました。
- history: 1927年の前身民間会社による浅草～上野間の開業は(3)の説明文にあり、東京地下鉄の直接の前身（営団）の話ではないため独立した項目にしていません。
- industry: 運輸業が外部顧客への営業収益の大半を占めるため運輸。不動産事業は報告セグメントとして金額が開示されているため2つ目に付けました。
- relatedCompanies: related-candidates.json が証拠パックにないため、掲載済み企業の候補がありません。
- relatedCompanies: 連結子会社14社・持分法適用関連会社4社（渋谷熱供給・はとバス・日本コンサルタンツ・リンクティビティ）は有報に社名がありますが、上場企業ではないため結びません。
- relatedCompanies: 財務大臣（26.73％）と東京都（23.31％）は事業会社ではないため major-shareholder にしません。
- terms: 用語候補: 帝都高速度交通営団（営団）、完全民営化、特殊会社、報告セグメント。いずれも本文で説明済みのため、新規の用語エントリーは提案しません。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
