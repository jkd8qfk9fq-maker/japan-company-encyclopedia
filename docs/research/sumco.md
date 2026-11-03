# SUMCO — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＳＵＭＣＯ |
| 証券コード | 3436 |
| docID（データを取り出した文書） | `S100XRR5` |
| 原本 docID | `S100XRR5` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRR5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＳＵＭＣＯ / 3436 / docID S100XRR5（id は英語表記「SUMCO CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sumco: 10 件の数値を有報XBRLと照合
有報: 株式会社ＳＵＭＣＯ 有価証券報告書－第27期(2025/01/01－2025/12/31) (docID S100XRR5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sumco: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社SUMCO」が EDINET の提出者名「株式会社ＳＵＭＣＯ」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…最終損益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 最終年度は当期純損失。売上高は前年同期比3.3％増（409,670百万円）。
- businessStructure: 単一セグメントのため事業は1つ。製品区分ごとの売上高は開示がなく、children は作らなかった。
- businessStructure: wikipedia.json は無いので使っていない。
- history: 統合前の住友金属工業・三菱マテリアルシリコン・SUMCO TECHXIVの旧沿革は、当社自身の出来事ではないため一部のみ本文に含めた。
- history: ほかに2007年の台湾子会社上場、2011年・2013年の工場閉鎖などがあるが省いた。
- industry: 単一セグメントで半導体用シリコンウェーハが売上の大半のため semiconductors のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる上場の相手がいないため、結ばなかった。
- relatedCompanies: 住友商事株式会社: 最大の販売先だが candidates に無く、掲載済み上場企業との同一性を確認できない。
- relatedCompanies: 日本製鉄・三菱マテリアル: 設立時の出資者（沿革）で現在の資本関係・取引は印字なし、candidates にも無い。
- relatedCompanies: 日本アエロジル株式会社: 持分法適用関連会社だが上場企業ではない。
- terms: 用語の助言: シリコンウェーハ、ポリッシュトウェーハ、エピタキシャルウェーハ、インゴット、300mmウェーハ、石英ルツボ、多結晶シリコン。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
