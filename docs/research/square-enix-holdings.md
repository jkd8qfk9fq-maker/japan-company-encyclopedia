# スクウェア・エニックス・ホールディングス — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社スクウェア・エニックス・ホールディングス |
| 証券コード | 9684 |
| docID（データを取り出した文書） | `S100YHJ4` |
| 原本 docID | `S100YHJ4` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHJ4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社スクウェア・エニックス・ホールディングス / 9684 / docID S100YHJ4（id は英語表記「SQUARE ENIX HOLDINGS CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
square-enix-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社スクウェア・エニックス・ホールディングス 有価証券報告書－第46期(2025/04/01－2026/03/31) (docID S100YHJ4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
square-enix-holdings: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 「財務諸表の組替え」の記載があるが前期有報と重複年度は一致しているため、financialNotesは空。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順。
- industry: 最大の報告セグメントはデジタルエンタテインメント事業（ゲーム）。出版はメディアに近いが売上の小さい事業のため付けない。
- relatedCompanies: related-candidates.json が無く、結べる上場企業の候補なし。
- relatedCompanies: 3D Investment Partners Pte. Ltd.（大量保有報告書で18.53%）は投資会社で、上場事業会社ではないため結ばない。
- relatedCompanies: 子会社（スクウェア・エニックス、タイトー等）は非上場のため結ばない。
- terms: 助言: 「持株会社」「ライツ・プロパティ」「アミューズメント施設」は初学者向けの用語候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
