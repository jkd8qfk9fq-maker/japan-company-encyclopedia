# 江崎グリコ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 江崎グリコ株式会社 |
| 証券コード | 2206 |
| docID（データを取り出した文書） | `S100XRXN` |
| 原本 docID | `S100XRXN` |
| 提出日（原本） | 2026-03-19 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRXN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 江崎グリコ株式会社 / 2206 / docID S100XRXN（id は英語表記「Ezaki Glico Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ezaki-glico: 10 件の数値を有報XBRLと照合
有報: 江崎グリコ株式会社 有価証券報告書－第121期(2025/01/01－2025/12/31) (docID S100XRXN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ezaki-glico: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は決算期変更の事実のみ。
- businessStructure: 事業の並びは2025年12月期の外部顧客への売上高の大きい順。
- businessStructure: listings の market は表紙の印字（東京証券取引所プライム市場）から。
- history: 沿革は主要な出来事のみを選んだ。
- industry: 全報告セグメントが食料品の製造販売（食品原料を含む）のため food のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる候補が無いため、誰も結ばなかった。
- relatedCompanies: キリンビバレッジ：MD&Aに受託販売として名前があるが、候補に無く取引の向きも未確認のため結ばず。
- relatedCompanies: 大日本印刷・TOPPANホールディングス・日清製粉グループ本社・ADEKA・亀田製菓・レンゴー：政策保有株式の表で仕入先と記載されるのみで、候補に無く同一性を確認できないため結ばず。
- relatedCompanies: イオン：販売先と記載されるのみで、候補に無く同一性を確認できないため結ばず。
- terms: 助言：用語集の候補は「チルド商品」「オフィスグリコ」「特定子会社」。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
