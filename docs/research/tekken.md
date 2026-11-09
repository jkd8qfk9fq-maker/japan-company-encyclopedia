# 鉄建建設 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 鉄建建設株式会社 |
| 証券コード | 1815 |
| docID（データを取り出した文書） | `S100YGCF` |
| 原本 docID | `S100YGCF` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGCF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 鉄建建設株式会社 / 1815 / docID S100YGCF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tekken: 10 件の数値を有報XBRLと照合
有報: 鉄建建設株式会社 有価証券報告書－第85期(2025/04/01－2026/03/31) (docID S100YGCF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tekken: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…推進しています。取組方針は、生産性と利益創出力の回復と強化、成長領域における…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載があるとの注意があったが、修正再表示チェックは重複年度の全行で一致し、売上高・当期純利益の範囲に変更はないため、financialNotes には書いていない。
- businessModel: 2022年改正会計基準を第84期の期首から適用し、第83期の指標は遡及適用後のものだが、5年間の数値は有報の印字どおりで、修正再表示チェックも全行一致のため、financialNotes には書いていない。
- businessModel: 重要な後発事象として、2026年5月14日の取締役会で保有する投資有価証券3銘柄の売却を決議したことが有報に記載されているが、政策保有株式の縮減という資本政策のため、本文には書いていない。
- businessStructure: 事業の並びは、セグメント注記の外部顧客への売上高の大きい順にしました。その他は報告セグメントに含まれない区分のため最後にしました。
- history: 沿革の2018年、2020年、2022年の行は年月3つと事象3つの崩れた表のため、行順で対応づけました（2018年が海外事業部の再編、2020年が鉄建プロパティーズの設立、2022年がプライム市場への移行）。
- history: 設立時の資本金は規則により記載していません。
- industry: 土木工事と建築工事が売上高の大半を占める総合建設会社で、東京証券取引所の業種分類でも建設業に属するため、construction を主たる業界としました。不動産事業は報告セグメントですが売上高の約2.8％のため、業界は付けていません。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ、みずほフィナンシャルグループ、三井住友フィナンシャルグループ：取引金融機関として事業資金の借入等を行っていることが保有目的のため、銀行ルールで結びませんでした。
- relatedCompanies: 東鉄工業、日本リーテック：当事業年度に全株式を売却済みのため結びませんでした。
- relatedCompanies: 東北電力：共同開発の相手は東北電力ネットワーク株式会社で、東北電力株式会社そのものとの取引の印字がないため結びませんでした。
- relatedCompanies: ＮＴＴ：有報の印字はＮＴＴ都市開発株式会社（子会社）のみで、ＮＴＴ株式会社そのものとの取引の印字がないため結びませんでした。
- relatedCompanies: ジェイテック：有報の株式会社ジェイテックは連結子会社（議決権65.0％）で、上場の株式会社ジェイテックとは別会社のため結びませんでした。
- relatedCompanies: 東急：特定投資株式の表に「東急㈱」45,000株の印字があるが、related-candidates.json で ambiguous とされており、正式名称の印字がないため結びませんでした。
- relatedCompanies: 連結子会社のテッケン興産、ジェイテック、鉄建プロパティーズはすべて非上場のため結びませんでした。
- relatedCompanies: 大株主の信託銀行2行と常任代理人経由の海外機関は信託口のため、鉄建職員持株会と鉄建取引先持株会は事業会社でないため結びませんでした。
- relatedCompanies: 鹿島建設は大株主（3.36％）でもありますが、共同企業体での取引を優先して business-partner としました。東海旅客鉄道は大株主（0.91％）でもありますが、建設工事の受注を優先して customer としました。
- relatedCompanies: nankai は有報の南海電気鉄道株式会社と同一会社（現・株式会社NANKAI）として結びました。
- relatedCompanies: パス、エン、キャリア、ポート、高速、ステップ、レイ、レック、レント、ベース、コア、セキ、カバー、いちご、トラスト：語の断片一致のみのため結びませんでした。
- terms: 新たに提案する用語はありません。「土木工事」「建築工事」などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
