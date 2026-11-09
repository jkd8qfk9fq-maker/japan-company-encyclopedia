# 十六フィナンシャルグループ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社十六フィナンシャルグループ |
| 証券コード | 7380 |
| docID（データを取り出した文書） | `S100YA7J` |
| 原本 docID | `S100YA7J` |
| 提出日（原本） | 2026-06-11 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YA7J.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社十六フィナンシャルグループ / 7380 / docID S100YA7J（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
juroku-financial-group: 10 件の数値を有報XBRLと照合
有報: 株式会社十六フィナンシャルグループ 有価証券報告書－第5期(2025/04/01－2026/03/31) (docID S100YA7J)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
juroku-financial-group: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高に代えて連結経常収益を用いています。
- businessModel: 2026年4月1日付で普通株式1株につき5株の割合で株式分割を実施しました。提出後の資本政策のため、needsReviewには入れていません。
- businessModel: 2023年度に係る主要な経営指標等は、法人税等の会計基準の遡及適用後の数値です。financialNotesに記載しました。
- businessStructure: 事業はセグメント注記の外部顧客への売上高の大きい順に並べました。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: 「その他」の区分は報告セグメントに含まれていない事業セグメントのため、最後に置きました。
- history: 沿革は有報の【沿革】の表から選びました。当社の設立前の出来事は、株式会社十六銀行の沿革として印字されているものを採用しました。
- history: 2021年10月1日の行は、設立と上場の出来事をまとめて一つの沿革としました。
- industry: 主たる業界は、銀行業務を中心とする金融持株会社であることから finance としました。東京証券取引所の業種分類は銀行業です。
- industry: リース業も金融サービスのため、2つ目の業界は付けませんでした。
- relatedCompanies: あいちフィナンシャルグループ、セイノーホールディングス、イビデンなど政策保有株式の銘柄は、保有目的が定型句のみで取引関係の記載がないため結びませんでした。
- relatedCompanies: フジパングループ本社（2.70％）とセイノーホールディングス（1.44％）は2026年3月31日現在の大株主ですが、取引・提携の記載がないため結びませんでした。
- relatedCompanies: STATION Ai株式会社は業務提携先への人材派遣の記載がありますが、関連候補にないため結びませんでした。
- relatedCompanies: 十六銀行など連結子会社12社はすべて非上場のため結びませんでした。
- relatedCompanies: ビジョン、エン、ポート、キャリア、コア、ベースなどは、断片一致のみで当社との取引・提携の記載がないため結びませんでした。
- terms: 新たに提案する用語はありません。「16Vision-10」や「じゅうろくアプリ」などの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
