# キユーピー — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | キユーピー株式会社 |
| 証券コード | 2809 |
| docID（データを取り出した文書） | `S100XMJE` |
| 原本 docID | `S100XMJE` |
| 提出日（原本） | 2026-02-24 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XMJE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | キユーピー株式会社 / 2809 / docID S100XMJE（id は英語表記「Kewpie Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kewpie: 10 件の数値を有報XBRLと照合
有報: キユーピー株式会社 有価証券報告書－第113期(2024/12/01－2025/11/30) (docID S100XMJE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kewpie: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives は有報の戦略の節を読んでいないため省いた。
- businessStructure: 事業は報告セグメントの外部顧客への売上高の大きい順。表紙の市場区分は東京証券取引所（プライム市場）。
- businessStructure: 関連会社に株式会社キユーソー流通システムなどの物流会社があるが、報告セグメントではないため事業には含めない。
- history: 沿革は主要な出来事に絞った。
- industry: 食品の製造販売が主たる業務。ファインケミカルは医薬品・化粧品原料だが報告セグメントの売上が小さく、業界は足さない。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる候補が無いため結ばない。
- relatedCompanies: 株式会社キユーソー流通システム（持分法適用関連会社）: 上場の有価証券報告書提出会社だが候補ファイルに無く、掲載済みか確認できないため結ばない。
- relatedCompanies: 株式会社中島董商店（その他の関係会社）: 上場かどうか有報から確認できないため結ばない。
- relatedCompanies: アヲハタ株式会社（子会社）: 2025年11月1日の株式交換で上場廃止のため結ばない。
- terms: 用語の追加提案: 液卵（殻を割って中身を液状にした業務用の卵）、ファインケミカル（医薬品・化粧品などの原料になる高付加価値の化学品）、株式交換（親会社の株式と子会社の株式を交換して完全子会社にする手続き）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
