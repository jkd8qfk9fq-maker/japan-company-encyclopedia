# 京浜急行電鉄 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 京浜急行電鉄株式会社 |
| 証券コード | 9006 |
| docID（データを取り出した文書） | `S100YK5J` |
| 原本 docID | `S100YK5J` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK5J.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 京浜急行電鉄株式会社 / 9006 / docID S100YK5J（id は英語表記「Keikyu Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
keikyu: 10 件の数値を有報XBRLと照合
有報: 京浜急行電鉄株式会社 有価証券報告書－第105期(2025/04/01－2026/03/31) (docID S100YK5J)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
keikyu: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高は有報の「営業収益」。セグメント別は外部顧客への営業収益。利益はセグメント利益・経常利益を書かず、当期純利益のみ。
- businessModel: 財務数値は百万円を印字どおりに引用。
- businessStructure: 並び順は【セグメント情報】注記の当期「外部顧客への営業収益」（百万円）: 交通120,587、流通83,717、不動産45,139、レジャー・サービス30,949。その他（23,797）は報告セグメントに含まれないため最後。
- businessStructure: 鉄道・バス・百貨店の各区分は金額が独立して開示されていないため金額を書いていません。
- businessStructure: listings の market は表紙の「東京証券取引所プライム市場」から。
- history: 沿革の全行から主要な節目だけを選びました。年はすべて【沿革】の印字の年月どおりです。
- industry: 主たる業界は最大の報告セグメントである交通事業（外部顧客への営業収益120,587百万円）で運輸。不動産事業・流通事業も報告セグメントとして金額の開示があるため追加。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる上場の候補が無いため、結んだ相手はありません。
- relatedCompanies: 連結子会社は有報で『有価証券届出書または有価証券報告書を提出している会社はありません』と注記されており、上場の子会社はありません。
- relatedCompanies: 西武ホールディングス・京成電鉄・日本空港ビルデング・ANAホールディングス・東急などは政策保有株式の表に載る相手で、保有目的は連携関係の維持・強化とされていますが、取引・提携の内容が相手について具体的に述べられておらず、候補ファイルでの同一性確認もできないため結びませんでした。
- terms: 助言: 連続立体交差事業、引上線、総合経営計画などが用語集の候補です。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
