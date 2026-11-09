# ＳＡＮＫＹＯ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社三共 |
| 証券コード | 6417 |
| docID（データを取り出した文書） | `S100YI30` |
| 原本 docID | `S100YI30` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI30.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社三共 / 6417 / docID S100YI30（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sankyo: 10 件の数値を有報XBRLと照合
有報: 株式会社三共 有価証券報告書－第61期(2025/04/01－2026/03/31) (docID S100YI30)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sankyo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社　SANKYO（登記社名　株式会社　三共）」が EDINET の提出者名「株式会社三共」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年改正会計基準の遡及適用は第60期の期首からで、第59期の指標は遡及適用後の数値です。修正再表示チェックは重複年度の全行で一致したため、financialNotesには記載していません。証拠パックの組替えに関する注意についても、売上高と当期純利益の範囲に変更はなく、修正再表示チェックが全行一致のため注記していません。
- businessStructure: 事業の並びは、セグメント注記の外部顧客への売上高の大きい順にしました。その他は報告セグメントに含まれない区分のため最後にしました。
- history: 沿革は有報の印字どおりに15件を選びました。設立時資本金は規則により記載していません。
- industry: パチンコ機・パチスロ機の製造販売が主たる事業で、閉じた分類ではエンターテインメントが最も近いため、entertainmentを主たる業界としました。補給機器関連事業とその他事業は売上高に占める割合が小さいため、業界は付けていません。
- relatedCompanies: マースグループホールディングス：保有目的が「関係構築、維持、強化のため」の定型句のみで、具体的な取引の印字がないため結びませんでした。
- relatedCompanies: 中央製作所：有報の中央製作所は当社の前身で、上場の株式会社中央製作所（6846）とは別会社のため結びませんでした。
- relatedCompanies: ランド、エン、レイ、ポート、セキ、アミューズ、ヒット、リオン、トラスト、ビジョン、ベース、コロナ、ギミック：語の断片一致のみのため結びませんでした。
- relatedCompanies: 大株主は信託銀行、個人、非上場法人のため、事業会社の大株主として結べる相手はありませんでした。
- relatedCompanies: 連結子会社6社と関連会社1社はすべて非上場のため結びませんでした。
- terms: 新たに提案する用語はありません。「パチンコ機」「パチスロ機」などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
