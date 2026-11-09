# サトー — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サトー |
| 証券コード | 6287 |
| docID（データを取り出した文書） | `S100YE10` |
| 原本 docID | `S100YE10` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE10.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サトー / 6287 / docID S100YE10（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sato: 10 件の数値を有報XBRLと照合
有報: 株式会社サトー 有価証券報告書－第76期(2025/04/01－2026/03/31) (docID S100YE10)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sato: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社サトー（旧会社名　サトーホールディングス株式会社）」が EDINET の提出者名「株式会社サトー」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載は、貸借対照表の表示方法の変更（長期前払費用と賞与引当金の独立掲記）と、純粋持株会社体制から事業持株会社体制への移行に伴う損益計算書の表示区分の変更のみで、売上高と当期純利益の範囲に変化がないため financialNotes は書きませんでした。
- businessModel: 修正再表示チェックは重複年度が全行一致しました。
- businessModel: セグメント利益の金額は本文の規則により書きませんでした。
- businessStructure: 2025年4月1日に完全子会社である株式会社サトーを吸収合併し、商号を株式会社サトーに変更しました。事業構成は合併後の体制で記載しています。
- businessStructure: 連結子会社は49社です。
- history: 沿革表は年月と事象が1行ずつ印字されており、行順で対応づけました。
- industry: 主たる業界は、東証の業種分類が機械であることと、電子プリンタやハンドラベラーなどのメカトロ製品の製造・販売が事業の中心であることから機械としました。
- industry: 電子プリンタなどの電子機器を扱うため、2つ目に電機を付けました。
- relatedCompanies: ランドは、「ポーランド」の文字の断片一致のため結びませんでした。
- relatedCompanies: セキは、「セキュリティ」の文字の断片一致のため結びませんでした。
- relatedCompanies: エンは、「エンジニアリング」の文字の断片一致のため結びませんでした。
- relatedCompanies: トーホーは、断片一致のため結びませんでした。
- relatedCompanies: イノベーションは、「イノベーションを生み出す組織文化」の文脈で社名が現れるだけの断片一致のため結びませんでした。
- relatedCompanies: ベースは、「連結ベース」の文字の断片一致のため結びませんでした。
- relatedCompanies: コアは、「コアビジネス」の文字の断片一致のため結びませんでした。
- relatedCompanies: ICは、「ICタグ」の文字の断片一致のため結びませんでした。
- relatedCompanies: ポートは、「サポート」の文字の断片一致のため結びませんでした。
- relatedCompanies: トーインは、「サトーインプレス」の文字の断片一致のため結びませんでした。
- relatedCompanies: キャリアは、「キャリアラダー」の文字の断片一致のため結びませんでした。
- relatedCompanies: ビジョンは、ビジョンの文脈で社名が現れるだけの断片一致のため結びませんでした。
- relatedCompanies: トラストは、大株主の状況に現れる信託銀行の名称の断片一致のため結びませんでした。
- relatedCompanies: 日新は、断片一致のため結びませんでした。
- relatedCompanies: ゼロは、「回収可能価額をゼロとして算定」の文脈の断片一致のため結びませんでした。
- relatedCompanies: 田谷は、断片一致のため結びませんでした。
- relatedCompanies: アルーは、断片一致のため結びませんでした。
- relatedCompanies: 大和は、「大和郡山市」の地名の断片一致のため結びませんでした。
- relatedCompanies: 電算は、「電算費」の文字の断片一致のため結びませんでした。
- relatedCompanies: ディスコは、「ディスコン」の文字の断片一致のため結びませんでした。
- relatedCompanies: フリーは、「フリーキャッシュフロー」の文字の断片一致のため結びませんでした。
- relatedCompanies: 学情は、「地政学」の文字の断片一致のため結びませんでした。
- relatedCompanies: キングは、「サトーマーキング」の文字の断片一致のため結びませんでした。
- relatedCompanies: レックは、断片一致のため結びませんでした。
- relatedCompanies: No.1は、「ロシアNo.1のラベル会社」の文脈の断片一致のため結びませんでした。
- relatedCompanies: リードは、「リーダーシップ」の文字の断片一致のため結びませんでした。
- relatedCompanies: 連結子会社49社はすべて非上場のため結びませんでした。
- relatedCompanies: 持分法適用の関連会社はなく、持分法を適用していない関連会社3社は非上場のため結びませんでした。
- relatedCompanies: 大株主は信託銀行や財団、個人のため、事業会社の大株主として結べる相手はありませんでした。
- terms: 新たに提案する用語はありません。「タギング」や「Perfect and Unique Tagging（PUT）」は本文で説明しています。

## 要確認（status に反映）

- businessModel: 2026年6月15日に株式会社平野屋物産の議決権のある全株式を取得し、完全子会社化しました。取得の対価は現金2,119百万円です。2026年3月31日現在の事業構成には含まれていません。
- businessStructure: 2026年6月15日に株式会社平野屋物産の議決権のある全株式を取得し、完全子会社化しました。取得の対価は現金2,119百万円です。2026年3月31日現在の事業構成には含まれていません。
- history: 2026年6月15日に株式会社平野屋物産の議決権のある全株式を取得し、完全子会社化しました。取得の対価は現金2,119百万円です。2026年3月31日現在の事業構成には含まれていません。
- industry: 2026年6月15日に株式会社平野屋物産の議決権のある全株式を取得し、完全子会社化しました。取得の対価は現金2,119百万円です。2026年3月31日現在の事業構成には含まれていません。
- relatedCompanies: 2026年6月15日に株式会社平野屋物産の議決権のある全株式を取得し、完全子会社化しました。取得の対価は現金2,119百万円です。2026年3月31日現在の事業構成には含まれていません。
- terms: 2026年6月15日に株式会社平野屋物産の議決権のある全株式を取得し、完全子会社化しました。取得の対価は現金2,119百万円です。2026年3月31日現在の事業構成には含まれていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
