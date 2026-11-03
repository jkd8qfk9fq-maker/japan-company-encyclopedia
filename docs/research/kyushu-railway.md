# JR九州 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 九州旅客鉄道株式会社 |
| 証券コード | 9142 |
| docID（データを取り出した文書） | `S100Y6HR` |
| 原本 docID | `S100Y6HR` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6HR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 九州旅客鉄道株式会社 / 9142 / docID S100Y6HR（id は英語表記「Kyushu Railway Company」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kyushu-railway: 10 件の数値を有報XBRLと照合
有報: 九州旅客鉄道株式会社 有価証券報告書－第39期(2025/04/01－2026/03/31) (docID S100Y6HR)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kyushu-railway: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…グループでの利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives は省略（有報の記述を要約する工程を今回は行わず、書けないものは省く方針）。
- businessStructure: 事業の並びは【セグメント情報】の外部顧客への売上高（2026年3月期）の大きい順。
- businessStructure: 「ビジネスサービス」の警備・清掃整備・広告・システム関連は【セグメント情報】の概要の記載による。
- history: 沿革表の一部の年月（1998年4月・1999年4月/10月・2000年1月など）は表が崩れているため採用していない。
- industry: 主たる業界は最大の報告セグメント（運輸サービス）で決定。不動産・ホテルは報告セグメントとして開示があるため2つ目に付けた。
- relatedCompanies: related-candidates.json が無く、掲載済みの上場企業の候補は無い。
- relatedCompanies: 【関係会社の状況】の子会社・持分法適用関連会社（JR九州バス、JR博多シティ、キャタピラー九州、JR九州セコムなど）は上場企業として掲載されていないため結ばない。
- terms: 用語の助言: 「上下分離方式」「完全民営化」「総営業キロ」「ヤードスティック方式」は読者に説明が要る語。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
