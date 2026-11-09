# 淺沼組 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社淺沼組 |
| 証券コード | 1852 |
| docID（データを取り出した文書） | `S100YD5O` |
| 原本 docID | `S100YD5O` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD5O.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社淺沼組 / 1852 / docID S100YD5O（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asanuma: 10 件の数値を有報XBRLと照合
有報: 株式会社淺沼組 有価証券報告書－第91期(2025/04/01－2026/03/31) (docID S100YD5O)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第90期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
asanuma: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは重複年度の全行一致で、売上高・当期純利益の範囲に変化がないため、第88期の企業結合に係る暫定的な会計処理の確定についてfinancialNotesは書きませんでした。
- businessModel: 第90期の訂正有価証券報告書（S100WAD2、2025年7月1日提出）はEDINETから原文を確認しました。訂正内容は役員一覧の監査役の略歴の記載のみで、財務数値への影響はありません。修正再表示チェックも全行一致のため、needsReviewには入れていません。
- businessModel: 株式分割（2022年8月1日1株→2株、2024年8月1日1株→5株）は資本政策のためwarningsのみとしました。
- businessStructure: セグメントの並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: 「その他」の区分は報告セグメントに含まれない事業セグメントで、メンテナンス事業及び不動産事業等を含みます。
- history: 1937年の設立時の資本金の金額は、本文の規則により書きませんでした。
- history: 2026年6月16日にT3 INTERNATIONAL PTE. LTD.の株式取得を完了し子会社化しました。提出日までに完了した期後の出来事のため沿革に記録し、needsReviewには入れていません。
- industry: 主たる業界は、売上高の大半を占める建築事業と土木事業が建設工事の請負であることから建設としました。東証の業種分類も建設業です。
- industry: 「その他」の区分には不動産事業がありますが、メンテナンス事業と合算でしか開示されていないため、不動産は付けませんでした。
- relatedCompanies: 東京建物・西日本旅客鉄道・DMG森精機・京阪ホールディングス・イオン・京王電鉄・阪急阪神ホールディングス・コスモスイニシア・名古屋鉄道は、特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句（「主に国内の建築事業／土木事業における収益の維持・向上のため」）のため結ばず。
- relatedCompanies: 南都銀行は特定投資株式の表に載るのみで保有目的が定型句のため、また資金調達の金融機関のため結ばず。大株主（1.53％、2026年3月31日現在）でもあります。
- relatedCompanies: 日本電信電話は特定投資株式の表に載るのみで保有目的が定型句のため結ばず。関連候補の一覧にはありません。
- relatedCompanies: フジテックは当事業年度に全株式を売却済みのため結ばず。
- relatedCompanies: 長谷工コーポレーションは、当事業年度に完成した1件の工事（神戸市中央区港島南町三丁目計画新築工事）のみで、継続的な取引の印字がないため結ばず。
- relatedCompanies: センコーグループホールディングスは、前事業年度に完成した1件の工事のみのため結ばず。
- relatedCompanies: 平和は大株主（3.96％、2026年3月31日現在）ですが、住所が神戸市で平和（6412）の本社所在地と一致せず、証券コードの印字もないため同一性を確定できず結ばず。
- relatedCompanies: 連結子会社9社・関連会社2社は、すべて非上場または海外法人のため結ばず。
- relatedCompanies: エン・コア・フレンドリー・トラスト・ベース・ビジョン・高速・ランド・キャリア・大和・イノベーション・キング・レイ・リオン・スペースは断片一致のみのため結ばず。
- terms: 新たに提案する用語はありません。建築事業、土木事業などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
