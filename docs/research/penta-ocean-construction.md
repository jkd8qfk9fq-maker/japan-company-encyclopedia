# 五洋建設 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 五洋建設株式会社 |
| 証券コード | 1893 |
| docID（データを取り出した文書） | `S100YF3Y` |
| 原本 docID | `S100YF3Y` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF3Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 五洋建設株式会社 / 1893 / docID S100YF3Y（id は英語表記「PENTA-OCEAN CONSTRUCTION CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
penta-ocean-construction: 10 件の数値を有報XBRLと照合
有報: 五洋建設株式会社 有価証券報告書－第76期(2025/04/01－2026/03/31) (docID S100YF3Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
penta-ocean-construction: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 利益の増加理由は営業利益などに触れずに済むよう書かなかった。perspectives は省略。
- businessModel: 財務諸表の組替えの記載があるが、前期有報との重複年度に差異はなく、basis は付けなかった。
- businessStructure: 並びは外部顧客への売上高の順（国内土木→国内建築→海外建設）、報告セグメントに含まれない「その他」は最後。金額は本文に書いていない。
- history: 許認可の更新、本社移転、他社の吸収合併などは省いた。
- industry: 報告セグメントはすべて建設工事の請負。他の業界は付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、候補が無いため結ばなかった。
- relatedCompanies: 関係会社の状況に載る子会社・関連会社はすべて非上場の相手で、結べない。
- relatedCompanies: 保有株式の表の住友不動産などは取引関係の維持・強化のための保有だが、取引の向きや内容の個別の記載を確認していないため結ばなかった。
- terms: 用語の追加提案: 浚渫（しゅんせつ。水底の土砂を掘り取る工事）、作業船、洋上風力建設。既存の用語集との重複は未確認。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
