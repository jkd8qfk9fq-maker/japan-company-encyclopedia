# 蝶理 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 蝶理株式会社 |
| 証券コード | 8014 |
| docID（データを取り出した文書） | `S100YBIN` |
| 原本 docID | `S100YBIN` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBIN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 蝶理株式会社 / 8014 / docID S100YBIN（id は英語表記「CHORI CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
chori: 10 件の数値を有報XBRLと照合
有報: 蝶理株式会社 有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YBIN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
chori: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は会計方針の変更（棚卸資産の評価方法）のみ。金額は書いていない。
- businessModel: analysis は書かなかった（有報の事実だけから読める範囲に限るため）。
- businessStructure: 事業の並びは外部顧客への売上高の大きい順（化学品152,667・繊維145,775・機械773百万円）。「その他」は報告セグメントに含まれない区分のため最後。
- businessStructure: セグメント利益は本文に書かない方針のため省いた。
- businessStructure: shortNameEn は英訳名 CHORI CO.,LTD. から Co.,Ltd. を除いた CHORI とした（社名表記の短縮）。
- history: 沿革表の中から主要な出来事を選んだ。1926年の人絹糸、1952年・1958年の合成繊維の取扱い、1974年のタイ法人、2013年・2017年・2018年の買収などは省いた。
- industry: 売上の大半を占める化学品事業・繊維事業はいずれも商品を仕入れて販売する商社の事業のため、trading のみとした。
- relatedCompanies: related-candidates.json は証拠パックに無かった。親会社の東レは【関係会社の状況】に印字があり、掲載済み企業 toray（東京証券取引所プライム市場上場と親会社情報に記載）として結んだ。
- relatedCompanies: 子会社・関連会社（STX・アサダユウ・ミヤコ化学・小桜商会・蝶理GLEX・蝶理マシナリー・MEGACHEM・青島紅蝶新材料ほか）は上場企業ではなく掲載候補が無いため結んでいない。
- terms: 用語の追加提案: 専門商社（特定分野に強い商社）、パフォーマンスケミカル（機能性を持つ化学品）、現地法人。既存の用語集との重複は未確認。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
