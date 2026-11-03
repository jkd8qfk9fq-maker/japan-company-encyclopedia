# 明電舎 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社明電舎 |
| 証券コード | 6508 |
| docID（データを取り出した文書） | `S100YQ5Z` |
| 原本 docID | `S100YIHP` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YQ5Z／有効文書 S100YQ5Z（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YQ5Z.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社明電舎 / 6508 / docID S100YIHP（id は英語表記「MEIDENSHA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 0 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 0 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
meidensha: 10 件の数値を有報XBRLと照合
有報: 株式会社明電舎 訂正有価証券報告書－第162期(2025/04/01－2026/03/31) (docID S100YQ5Z)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第162期(2025/04/01－2026/03/31)、docID S100YQ5Z）を有効文書としてこのパックを作った。原本は docID S100YIHP。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはBusinessResultsOfReportingCompanyTextBlock・TotalReturnOnSharePriceIndex・TotalShareholderReturn（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
meidensha: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- history: 2016年6月以降の行が崩れた表（年月が連続して印字）のため、2016〜2021年の行は日付を裏付けられず使っていない
- industry: 半導体向け部品は産業電子モビリティ事業の一部で金額が独立して開示されていないため、半導体は付けない
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる掲載済み上場企業が無いため、結ぶ相手なし
- relatedCompanies: 日立製作所・富士電機: 2000〜2012年の合弁の沿革のみで現在の取引・資本関係の記載が無く、結ばない
- relatedCompanies: 国内外の子会社・関連会社: 掲載済みの上場企業として確認できず、結ばない
- terms: 助言: 変圧器、スイッチギヤ、真空遮断器、パワーエレクトロニクス、セラミック平膜は用語集の候補

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
