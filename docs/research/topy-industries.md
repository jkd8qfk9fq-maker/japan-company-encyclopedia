# トピー工業 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | トピー工業株式会社 |
| 証券コード | 7231 |
| docID（データを取り出した文書） | `S100YJBN` |
| 原本 docID | `S100YJBN` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJBN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | トピー工業株式会社 / 7231 / docID S100YJBN（id は英語表記「TOPY INDUSTRIES, LIMITED」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
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
topy-industries: 10 件の数値を有報XBRLと照合
有報: トピー工業株式会社 有価証券報告書－第132期(2025/04/01－2026/03/31) (docID S100YJBN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
topy-industries: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&A のセグメント利益・ROE・政策保有株式の数値は方針により書かなかった。
- businessStructure: 事業の並びは【セグメント情報】の外部顧客への売上高の大きい順。「その他」は報告セグメントに含まれない区分のため最後。
- history: 沿革は有報の年月順の記載から主要な出来事を選んだ。
- industry: 売上の大半（201,635百万円／297,750百万円）を占める自動車・産業機械部品セグメントで automotive を主とした。建設機械向け部品は同セグメント内で金額の独立開示が無いため machinery は足さない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、結んだ相手は無い。
- relatedCompanies: 日本製鉄: その他の関係会社（被所有23.0％、2026年3月31日現在、原材料購入・製品販売・業務提携）。関係性は十分だが候補ファイルが無く同一性を確認できず未結合。
- relatedCompanies: 北越メタル: 持分法適用関連会社（所有35.1％）、製品を購入。関係性は十分だが同上の理由で未結合。
- relatedCompanies: 上記以外の子会社・関連会社は非上場または掲載済み企業と確認できないため結ばない。
- terms: 用語の助言: 電気炉、異形棒鋼、H形鋼、持分法適用関連会社、スチールホイールは、解説があると読者に親切。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] トピー工業の鉄鋼セグメント（外部顧客への売上高89,226百万円） → 提案: steel 鉄鋼・金属。電気炉による製鋼・条鋼の圧延事業を言える業界区分が現在の値に無い。
