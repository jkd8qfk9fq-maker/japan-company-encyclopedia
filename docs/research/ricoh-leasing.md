# リコーリース — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リコーリース株式会社 |
| 証券コード | 8566 |
| docID（データを取り出した文書） | `S100YF3N` |
| 原本 docID | `S100YF3N` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF3N.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リコーリース株式会社 / 8566 / docID S100YF3N（id は英語表記「RICOH LEASING COMPANY,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ricoh-leasing: 10 件の数値を有報XBRLと照合
有報: リコーリース株式会社 有価証券報告書－第50期(2025/04/01－2026/03/31) (docID S100YF3N)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ricoh-leasing: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上増減の理由は md-and-a を読まず書いていない。
- businessStructure: 事業の並びは外部顧客への売上高順（L&F 316,388、インベストメント 11,892、サービス 10,298 百万円）。MD&A や事業の内容の表の順（サービスが先）とは異なる。
- businessStructure: related-candidates.json は証拠パックに無かった。
- history: 本社移転・ISO取得・CDP選定などは事業の流れに関わらないため省いた。
- industry: 売上の大半（316,388百万円／338,579百万円）がリース＆ファイナンス事業のため金融。
- relatedCompanies: related-candidates.json が無く、ricoh・mizuho-leasing は src/data/companies に存在する id と、有報の正式名称（㈱リコー・みずほリース㈱）で対応づけた。
- relatedCompanies: 連結子会社（テクノレント・東京ビジネスレント・エンプラス・Welfareすずらん）は非上場のため結ばない。
- terms: 用語の助言: ファイナンス・リース、オペレーティング・リース、割賦、ファクタリング、販売支援リース、リロケーションは解説の候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
