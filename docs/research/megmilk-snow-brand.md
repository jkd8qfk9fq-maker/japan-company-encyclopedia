# 雪印メグミルク — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 雪印メグミルク株式会社 |
| 証券コード | 2270 |
| docID（データを取り出した文書） | `S100YC5I` |
| 原本 docID | `S100YC5I` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC5I.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 雪印メグミルク株式会社 / 2270 / docID S100YC5I（id は英語表記「Megmilk Snow Brand Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
megmilk-snow-brand: 10 件の数値を有報XBRLと照合
有報: 雪印メグミルク株式会社 有価証券報告書－第17期(2025/04/01－2026/03/31) (docID S100YC5I)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第16期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
megmilk-snow-brand: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空。訂正有報（第16期）が提出されているが、当期の5年間の数値は前期有報と一致し修正再表示は無い。
- businessModel: 顧客の「家庭の消費者」は有報の主要顧客の記載ではなく製品の性格からの記述のため、必要なら見直し。
- businessStructure: listings: 表紙は東京証券取引所(プライム市場)と札幌証券取引所。札幌は市場区分の印字が無いため market を付けていない。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高順（乳製品、飲料・デザート類、飼料・種苗）。報告セグメントに含まれない「その他」は最後。
- businessStructure: セグメント利益は営業利益ベースのため本文に書かない。
- history: 沿革表の商品発売（1963年以降の個別商品）は事業の理解に直接つながる行だけを残し、他は省いた。
- industry: 乳製品と飲料・デザート類で売上の大半を占めるため food のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み上場企業との同一性を確認できないため、関連企業は結ばない。
- relatedCompanies: 全国農業協同組合連合会・農林中央金庫・ホクレン農業協同組合連合会・全国酪農業協同組合連合会: 大株主だが非上場の組織で候補に無い。
- relatedCompanies: 株式会社日本アクセス: 大株主かつ主要顧客だが、候補に無く掲載済みか確認できない。
- relatedCompanies: 大塚ホールディングス㈱・㈱セブン＆アイ・ホールディングス: 保有株式の協業・取引の記載はあるが、候補に無く同一性を確認できない。
- relatedCompanies: 子会社・持分法適用関連会社（雪印種苗㈱ほか）: 有報の関係会社だが、いずれも候補に無い。
- terms: 用語の助言: 「無脂乳固形分（SNF）」「ファブレス化」「機能性表示食品」「持分法適用関連会社」は読者に説明が要る語。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
