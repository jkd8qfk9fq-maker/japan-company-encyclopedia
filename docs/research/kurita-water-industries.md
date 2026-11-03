# 栗田工業 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 栗田工業株式会社 |
| 証券コード | 6370 |
| docID（データを取り出した文書） | `S100YBAT` |
| 原本 docID | `S100YBAT` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBAT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 栗田工業株式会社 / 6370 / docID S100YBAT（id は英語表記「Kurita Water Industries Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kurita-water-industries: 10 件の数値を有報XBRLと照合
有報: 栗田工業株式会社 有価証券報告書－第90期(2025/04/01－2026/03/31) (docID S100YBAT)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":408888000000,"latestFiling":388814000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":31821000000,"latestFiling":50709000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kurita-water-industries: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報の2025年3月期売上高408,888百万円との差は、非継続事業への組替による。
- businessModel: 決算期は表紙の事業年度どおり2026年3月期。
- businessStructure: ペンタゴン・テクノロジーズ・グループ,Inc.の事業は非継続事業で、セグメント情報は継続事業に基づく。電子市場の金額は同事業を除いた値。
- businessStructure: 電子市場の製品区分の合計（171,797百万円）とセグメント売上は一致する。一般水処理市場の「その他」の中身（エンジニアリング洗浄等）は事業の内容の表から推定できる範囲の例示で、金額の内訳は書かない。
- businessStructure: 報告セグメントは2つだけで、売上順に一般水処理市場、電子市場の順。
- history: 2026年5月のペンタゴン・テクノロジーズ・グループ株式譲渡契約は提出後の予定事項のため年表に入れない。
- history: 2026年4月のアルカデ・エンジニアリングGmbHの社名変更は、年表から省いた。
- industry: 売上の大半を占める一般水処理市場で薬品の売上が最大のため、最も近い化学を暫定の主たる業界とした。半導体向けの開示は確認できず、付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業との同一性を確認できないため、関連企業は結ばない。
- relatedCompanies: 伊藤忠商事㈱との業務提携は2013年に解消済みで、過去の提携のため結ばない。
- relatedCompanies: 子会社・関連会社は掲載済みの上場企業ではない。
- terms: 用語の助言: 継続契約型サービス、非継続事業、RO膜（逆浸透膜）、ブルーボンド、精密洗浄は初学者に説明が要る語。

## 要確認（status に反映）

- businessStructure: 2026年5月13日にペンタゴン・テクノロジーズ・グループ,Inc.の全株式を譲渡する契約を締結（提出後の予定事項）。完了は有報時点で未確認。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 栗田工業の主たる業界 → 提案: 水処理・環境。水処理薬品・装置・メンテナンスを一体で扱う会社で、化学や機械のどちらにも収まらないため。
