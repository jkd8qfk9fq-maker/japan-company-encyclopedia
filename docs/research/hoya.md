# ＨＯＹＡ — research log

Registered: 2026-11-25（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＨＯＹＡ株式会社 |
| 証券コード | 7741 |
| docID（データを取り出した文書） | `S100YD7J` |
| 原本 docID | `S100Y90T` |
| 提出日（原本） | 2026-06-05 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YD7J／有効文書 S100YD7J（2026-11-24 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD7J.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＨＯＹＡ株式会社 / 7741 / docID S100Y90T（id は英語表記「HOYA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hoya: 10 件の数値を有報XBRLと照合
有報: ＨＯＹＡ株式会社 訂正有価証券報告書－第88期(2025/04/01－2026/03/31) (docID S100YD7J)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 純利益の系列は親会社帰属行ではなく、非支配株主分を含む「当期利益」（合計）である（5年表に帰属行が印刷されていないため。運営者決定 2026-11-25、JCE-039）。ラベルは有報の表記どおりとし、合計を親会社帰属であるかのように書いてはならない。financials の全ての年度の note に「経営指標の要約は非支配株主持分を含む当期利益であり、親会社帰属分とは異なる」旨を必ず書くこと（書かないと verify-financials が落とす）
注意: 訂正有価証券報告書（訂正有価証券報告書－第88期(2025/04/01－2026/03/31)、docID S100YD7J）を有効文書としてこのパックを作った。原本は docID S100Y90T。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはRemunerationForDirectorsAndOtherOfficersTextBlock・PSURemunerationByCategoryOfDirectorsAndOtherOfficers・RSURemunerationByCategoryOfDirectorsAndOtherOfficers（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hoya: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「HOYA株式会社」が EDINET の提出者名「ＨＯＹＡ株式会社」と違います
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…一過性の収益として計上したことなどが増益の要因です。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 調達先は、有報が自社の調達について一般名詞で触れていないため businessModel.suppliers は書かなかった
- businessModel: 当期利益は非支配株主分を含む合計であり、親会社帰属分（2026年3月期は253,085百万円）とは異なる。financialNotes で全年度にその旨を明記した（JCE-039）
- businessModel: 本文中の非継続事業への言及はIFRS第5号に関する会計方針の定型記述のみで、実際の非継続事業はないため、集計範囲の注記は不要と判断した
- businessModel: 有効文書は訂正有価証券報告書（docID S100YD7J）で、分類は record-only（数値・本文とも原本と同一）のため needsReview にはしていない
- businessStructure: 事業の並びは報告セグメントの外部顧客への売上収益の大きい順（ライフケア・情報・通信・その他）
- businessStructure: その他事業（音声合成ソフトウェア、ReadSpeaker）は2025年10月に売却済みであることを有報の表記どおりに記した
- businessStructure: 純利益の系列は非支配株主分を含む当期利益（合計）であり、ラベルは有報の表記どおり「当期利益」としている（JCE-039）
- history: 沿革は年月まで印字されているが、スキーマに合わせて年のみで記録した
- industry: 主たる業界は情報・通信向け部材と光学製品の電機とし、内視鏡・眼内レンズなどの医療機器を含むライフケアを第2の業界（医薬品）とした
- relatedCompanies: 候補一覧（related-candidates.json）がパックに無く、掲載済み企業との同一性を確認できないため、上場企業は結ばなかった
- relatedCompanies: 関係会社の状況に載る連結子会社131社と関連会社12社はグループ会社であり、掲載済みの上場企業に該当する相手は確認できなかった
- terms: 用語の助言のみの工程のため data は空。本文中の製品名は有報の表記どおりで、用語リンクは使っていない

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
