# 日本電波工業 — research log

Registered: 2026-11-25（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本電波工業株式会社 |
| 証券コード | 6779 |
| docID（データを取り出した文書） | `S100YFNH` |
| 原本 docID | `S100YFNH` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-24 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFNH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本電波工業株式会社 / 6779 / docID S100YFNH（id は英語表記「NIHON DEMPA KOGYO CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 0 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
nihon-dempa-kogyo: 10 件の数値を有報XBRLと照合
有報: 日本電波工業株式会社 有価証券報告書－第85期(2025/04/01－2026/03/31) (docID S100YFNH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 純利益の系列は親会社帰属行ではなく、非支配株主分を含む「当期利益」（合計）である（5年表に帰属行が印刷されていないため。運営者決定 2026-11-25、JCE-039）。ラベルは有報の表記どおりとし、合計を親会社帰属であるかのように書いてはならない。financials の全ての年度の note に「経営指標の要約は非支配株主持分を含む当期利益であり、親会社帰属分とは異なる」旨を必ず書くこと（書かないと verify-financials が落とす）
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nihon-dempa-kogyo: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…X、最先端設備への先行投資が、当期の利益を一時的に押し下げる要因になりました…）

## エージェントの判断記録（fragment warnings）

- businessModel: 調達先は、有報が自社の調達について一般名詞で触れていないため businessModel.suppliers は書かなかった（人工水晶は自社製造で、外部調達の記述がない）
- businessModel: 当期利益は非支配株主分を含む合計であり、親会社帰属分ではない。financialNotes で全年度にその旨を明記した（JCE-039）
- businessStructure: 単一セグメントのため、セグメント情報の品目別売上高（水晶振動子・水晶発振器・その他）を children にした
- businessStructure: 純利益の系列は非支配株主分を含む当期利益（合計）であり、ラベルは有報の表記どおり「当期利益」としている（JCE-039）。本文では当期利益としてのみ言及する
- history: 沿革は年月まで印字されているが、スキーマに合わせて年のみで記録した
- relatedCompanies: 候補一覧（related-candidates.json）がパックに無く、掲載済み企業との同一性を確認できないため、上場企業は結ばなかった
- relatedCompanies: 関係会社の状況に載る連結子会社12社と持分法適用関連会社2社（NDK SAW devicesほか）は全て未上場のグループ会社のため結ばなかった
- relatedCompanies: 日本電気株式会社は2002年に合弁会社エヌ・アール・エス・テクノロジーを設立したが、同社は2005年に合併・解散しており現在の関係ではないため結ばなかった
- terms: 用語の助言のみの工程のため data は空。本文中の製品名は有報の表記どおりで、用語リンクは使っていない

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
