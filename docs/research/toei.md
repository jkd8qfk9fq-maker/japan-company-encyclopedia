# 東映 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東映株式会社 |
| 証券コード | 9605 |
| docID（データを取り出した文書） | `S100YI7S` |
| 原本 docID | `S100YI7S` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI7S.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東映株式会社 / 9605 / docID S100YI7S（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toei: 10 件の数値を有報XBRLと照合
有報: 東映株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YI7S)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toei: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載がありますが、修正再表示チェックは重複年度の全行で一致し、売上高と当期純利益の範囲に変更はないため、financialNotesには書いていません。
- businessModel: 2022年改正会計基準は第102期の期首から適用され、第101期の指標は遡及適用後の数値ですが、修正再表示チェックは全行一致したため注記していません。
- businessStructure: 映画事業・ドラマ事業・コンテンツ事業・その他の内訳金額は印字されていないため、金額を書いていません。
- businessStructure: その他事業（物品の販売等）の金額は印字されていないため、金額を書いていません。
- businessStructure: ティ・ジョイは2026年4月1日に東映ジョイ・エンタテインメントへ商号変更しました。提出後の出来事のため、本文ではティ・ジョイの名称を用いています。
- history: 沿革は15件に絞りました。大阪証券取引所や名古屋証券取引所への上場、子会社の株式上場など、事業の流れに直接つながらない行は省きました。
- industry: 映像関連事業が売上高の大半を占めるため、エンターテインメントを主たる業界としました。
- industry: 観光不動産事業と建築内装事業は報告セグメントとして開示されていますが、売上高に占める割合が小さいため業界を付けていません。
- relatedCompanies: 三井住友フィナンシャルグループ・三菱UFJフィナンシャル・グループ・三井住友トラストグループは、資金調達先としての取引のみのため結んでいません。
- relatedCompanies: MS&ADインシュアランスグループホールディングスは、保険に関する取引のみのため結んでいません。
- relatedCompanies: 北野建設・ワシントンホテル・松屋・大和証券グループ本社・野村ホールディングスは、事業情報収集等の関係先としての保有で、取引の向きの印字がないため結んでいません。
- relatedCompanies: りそなホールディングス・ビックカメラ・IMAGICA GROUPは、当事業年度中に全株式を売却済みのため結んでいません。
- relatedCompanies: WOWOWは特定投資株式の表に取引の印字がありますが、related-candidates.jsonにないため結んでいません。
- relatedCompanies: en・career・vision・tein・lec・seki・core・port・ray・rix・base-4481・freee・hit・como・innovation・ishin・platz・sloganは、語の断片一致のみのため結んでいません。
- relatedCompanies: 連結子会社（東映アニメーション以外）と持分法非適用子会社は、すべて非上場のため結んでいません。
- relatedCompanies: 大株主の信託銀行2行とJPMORGAN CHASE BANK、GOLDMAN SACHS INTERNATIONALは、信託口・常任代理人経由のため結んでいません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
