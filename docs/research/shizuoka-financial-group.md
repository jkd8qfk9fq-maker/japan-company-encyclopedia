# しずおかフィナンシャルグループ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社しずおかフィナンシャルグループ |
| 証券コード | 5831 |
| docID（データを取り出した文書） | `S100Y9RT` |
| 原本 docID | `S100Y9RT` |
| 提出日（原本） | 2026-06-12 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y9RT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社しずおかフィナンシャルグループ / 5831 / docID S100Y9RT（id は英語表記「Shizuoka Financial Group, Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shizuoka-financial-group: 8 件の数値を有報XBRLと照合
有報: 株式会社しずおかフィナンシャルグループ 有価証券報告書－第4期(2025/04/01－2026/03/31) (docID S100Y9RT)
前期有報との比較: 18 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
すべて一致しました。
shizuoka-financial-group: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives は書き切れる根拠を読んでいないため省略。
- businessModel: customers の「個人」「企業」は銀行業務の一般的な相手で、有報の事業の内容節に直接の記載はない可能性がある。
- businessStructure: 事業の並びは外部顧客に対する経常収益の大きい順。「その他」は報告セグメントに含まれないため最後。
- businessStructure: 銀行業の products のうちカード・信用保証は関係会社の状況の事業内容から。
- history: 1943〜2022年の銀行の沿革は有報が「静岡銀行の沿革」として載せたもの。
- industry: 売上の大半は報告セグメント「銀行業」。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられないため、掲載済み企業とは結ばない。
- relatedCompanies: マネックスグループ株式会社: 持分法適用関連会社（議決権20.3％、資本業務提携契約）。候補ファイルに無く掲載済みか未確認のため結ばず。
- relatedCompanies: コモンズ投信株式会社: 持分法適用関連会社（22.4％）。上場の確認がなく結ばず。
- relatedCompanies: 株式会社クレディセゾン: 静銀セゾンカードの沿革での言及のみ。現在の関係の記載なく結ばず。
- terms: 用語の候補: 金融持株会社、経常収益、単独株式移転、持分法適用関連会社、ファイナンス・リース。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
