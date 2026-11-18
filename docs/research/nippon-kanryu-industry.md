# 日本乾溜工業 — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本乾溜工業株式会社 |
| 証券コード | 1771 |
| docID（データを取り出した文書） | `S100XB9B` |
| 原本 docID | `S100XB9B` |
| 提出日（原本） | 2025-12-18 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XB9B.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 日本乾溜工業株式会社 / 1771 / docID S100XB9B |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | pending | 0 |  |
| businessModel | pending | 0 |  |
| history | pending | 0 |  |
| industry | pending | 0 |  |
| relatedCompanies | pending | 0 |  |
| terms | pending | 0 |  |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-kanryu-industry: 10 件の数値を有報XBRLと照合
有報: 日本乾溜工業株式会社 有価証券報告書－第88期(2024/10/01－2025/09/30) (docID S100XB9B)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-kanryu-industry: 本文の金額 0 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

なし。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
