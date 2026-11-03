# シチズン時計 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | シチズン時計株式会社 |
| 証券コード | 7762 |
| docID（データを取り出した文書） | `S100YGYK` |
| 原本 docID | `S100YGYK` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGYK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | シチズン時計株式会社 / 7762 / docID S100YGYK（id は英語表記「Citizen Watch Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
citizen-watch: 10 件の数値を有報XBRLと照合
有報: シチズン時計株式会社 有価証券報告書－第141期(2025/04/01－2026/03/31) (docID S100YGYK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
citizen-watch: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 営業利益・経常利益などは本文に書かない規則のため、当期純利益と売上高だけを使った。
- businessModel: financialNotes は変更後のセグメント区分についての事実だけを書いた。
- businessStructure: 報告セグメントは当期から時計・工作機械・デバイスの3つに変更されたため、前期は組替後の値が基準。外部顧客への売上高は印字の百万円（197,061 / 86,292 / 63,455）を、MD&A の億円表記で書いた。
- businessStructure: セグメント売上高の大きい順に並べた。
- history: 沿革の主要な出来事だけを選んだ。子会社どうしの合併・社名変更の細かい行は省いた。
- history: 「significance」のうち、有報の事実から直接読める範囲にとどめた。
- industry: 主たる事業の腕時計（時計事業が売上の過半）に最も近い値として electronics を暫定で選んだ。時計・精密機器の区分は無い。
- industry: 工作機械事業は報告セグメントとして開示があるため machinery を付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業から選べないため、関連企業は結ばなかった。
- relatedCompanies: 連結子会社（シチズンマシナリー、シチズンファインデバイス、シチズン電子など）は非上場または掲載外の会社で、候補に無いため結ばない。
- relatedCompanies: 持分法適用関連会社 Marubeni Citizen-Cincom Inc.（米国、45.0％）は上場企業ではないため結ばない。
- terms: 用語集への追加候補（助言）: ムーブメント（時計の駆動部分）、CNC自動旋盤、水晶デバイス、セラミックス（サブマウント）、機械式時計とクオーツ式時計の違い。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] シチズン時計の時計事業（売上の過半） → 提案: precision-instruments（時計・精密機器）。腕時計は電機・機械のどちらにも収まらず、時計・精密機器の区分が無いため。
