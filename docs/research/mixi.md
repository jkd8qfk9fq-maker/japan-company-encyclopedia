# MIXI — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＭＩＸＩ |
| 証券コード | 2121 |
| docID（データを取り出した文書） | `S100YE1D` |
| 原本 docID | `S100YE1D` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE1D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＭＩＸＩ / 2121 / docID S100YE1D（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mixi: 10 件の数値を有報XBRLと照合
有報: 株式会社ＭＩＸＩ 有価証券報告書－第27期(2025/04/01－2026/03/31) (docID S100YE1D)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mixi: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社MIXI」が EDINET の提出者名「株式会社ＭＩＸＩ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 第24期の期首より投資事業に関する計上区分の変更を行い、第23期の主要な連結経営指標等は遡及適用後の数値を記載しています。修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotes は書きませんでした。
- businessModel: 目標とする経営指標の売上高及びEBITDAの数値は、本文の規則により strategy には書きませんでした。
- businessModel: 自己株式の消却（2026年5月15日取締役会決議、2026年5月29日消却）は提出後の資本政策のため warnings のみとし、needsReview には入れていません。
- businessStructure: セグメントの並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- history: 設立時と組織変更時の出資金・資本金の金額は、本文の規則により書きませんでした。
- history: 2019年の株式会社スフィダンテと株式会社ネットドリーマーズの子会社化は、沿革15件の枠のため採用せず、ここに記録します。
- industry: 主たる業界は、売上高の最も大きいデジタルエンターテインメント事業（スマートデバイス向けゲームの提供）からエンターテインメントとしました。
- industry: SNSやアプリの運営を行うライフスタイル事業があるため、ITを2つ目に付けました。
- industry: 東証の業種分類はサービス業です。
- relatedCompanies: ビットバンク：持分法適用関連会社（議決権26.3％）だが、非上場のため結ばない。
- relatedCompanies: デコルテ・ホールディングス：当事業年度に株式の一部を売却し、持分法適用の範囲から除外されたため結ばない。
- relatedCompanies: 株式会社TOKYO-BAYアリーナ：関連当事者として資金の貸付の印字があるが、非上場のため結ばない。
- relatedCompanies: 大株主の笠原健治、日本マスタートラスト信託銀行、日本カストディ銀行、木村弘毅ほか：個人・信託銀行・海外保管機関のため、事業会社の大株主として結べる相手がない。
- relatedCompanies: 親会社はありません。
- relatedCompanies: 連結子会社32社：すべて非上場または海外法人のため結ばない。
- relatedCompanies: タイミー：前年同期の株式売却益の記載のみで、現行の取引の印字がないため結ばない。
- relatedCompanies: エン、ストライク、テイン、ステップ、コア、マーキュリー、イノベーション、ランド、ベース、レント、ポート、キャリア、キング、日新、パス、セキ、レイ、コロナ、高速、レック、トラスト、ビジョン：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- terms: 新たに提案する用語はありません。モンスターストライクやTIPSTAR、mixi2などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
