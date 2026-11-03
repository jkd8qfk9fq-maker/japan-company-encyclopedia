# ケイアイスター不動産 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ケイアイスター不動産株式会社 |
| 証券コード | 3465 |
| docID（データを取り出した文書） | `S100YIZP` |
| 原本 docID | `S100YIZP` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIZP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ケイアイスター不動産株式会社 / 3465 / docID S100YIZP（id は英語表記「KI-STAR REAL ESTATE CO.,LTD」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ki-star-real-estate: 10 件の数値を有報XBRLと照合
有報: ケイアイスター不動産株式会社 有価証券報告書－第36期(2025/04/01－2026/03/31) (docID S100YIZP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ki-star-real-estate: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…展開と用地仕入を進め、生産性を高めて利益率の改善を図り、さらなる成長を目指す…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務の組替え・遡及適用の記載があるが、前期有報との重複年度は一致していた。
- businessStructure: セグメントは外部顧客への売上高の大きい順。「その他」は報告セグメントに含まれない区分のため最後。
- businessStructure: related-candidates.json が証拠パックに無く、関連企業は結ばなかった。
- history: 沿革は有報の年表から主な出来事を抜粋した。
- industry: 売上の大半は分譲住宅事業。建設業の値も考えたが、販売が中心のため不動産のみとした。
- relatedCompanies: ホームポジション株式会社（持分法適用関連会社、有報提出会社）: related-candidates.json が証拠パックに無く、掲載済み上場企業としての同一性を確認できないため結ばなかった。
- relatedCompanies: 株式会社よかタウン等の連結子会社は非上場のため結ばなかった。
- terms: 用語の助言: 規格型住宅、分譲住宅、注文住宅、フランチャイズが用語集の候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
