# グランディハウス — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | グランディハウス株式会社 |
| 証券コード | 8999 |
| docID（データを取り出した文書） | `S100Z9Y1` |
| 原本 docID | `S100YIKY` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100Z9Y1／有効文書 S100Z9Y1（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z9Y1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | グランディハウス株式会社 / 8999 / docID S100YIKY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
grandy-house: 10 件の数値を有報XBRLと照合
有報: グランディハウス株式会社 訂正有価証券報告書－第35期(2025/04/01－2026/03/31) (docID S100Z9Y1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第35期(2025/04/01－2026/03/31)、docID S100Z9Y1）を有効文書としてこのパックを作った。原本は docID S100YIKY。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetricsMetricsAndTargetsTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock・MetricsAndTargetsTextBlock・PerformanceDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetrics（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
grandy-house: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はMD&Aに印字された億・百万円表記のまま引用した（売上高529億80百万円、純利益9億16百万円、セグメント外部売上高497億35百万円・27億83百万円・4億61百万円はいずれも千円額の切り捨て表記で、セグメント注記の外部顧客への売上高と一致する）。セグメントの利益額は本文に書かなかった。
- businessModel: 訂正有価証券報告書（docID S100Z9Y1、2026年10月26日提出）を有効文書とした。パックの検証では原本（docID S100YIKY）と主要財務・本文は同一で、差異はサステナビリティ等の指標に関する節のみ（分類は record-only）のため、訂正に関する financialNote や needsReview は記録しなかった。出典は訂正有報の表題・URL・提出日で登録した。
- businessModel: エビデンスパックの注意（本文に財務諸表の組替えの記載がある）について、修正再表示チェックでは前期有報と重複する全行が一致し、パック内の本文ファイルで連結経営指標等に影響する組替えは特定できなかったため、financialNotes には記録しなかった。
- businessModel: 中期経営計画の最終年度目標の見直し（2026年5月）は当期終了後の出来事だが、有報の【経営方針、経営環境及び対処すべき課題等】に計画として記載されており、重要な後発事象は「該当事項はありません」とされているため、needsReview には入れず strategy の disclosed に計画として書いた。目標のうち本文に書ける売上高目標のみを引用し、その他の目標数値は書かなかった。
- businessModel: 変則決算や決算期変更はなく（irregularPeriods は空）、financialNotes は空とした。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（不動産販売497億35百万円、建築材料販売27億83百万円、不動産賃貸4億61百万円、2026年3月期）とした。金額はMD&Aに印字された億・百万円表記のまま引用した（セグメント注記の千円額を切り捨てた表記と一致する）。
- businessStructure: 不動産販売事業の内訳（新築住宅販売・中古住宅販売・住宅リフォーム）は【事業の内容】とセグメント概要の記載による区分で、区分ごとの外部顧客への売上高は独立して開示されていないため、子区分には金額を書かなかった。
- businessStructure: 当社グループは当社と子会社8社で構成される（【事業の内容】）。【関係会社の状況】に載る連結子会社は茨城・群馬・千葉の各グランディハウス、ゼネラルリブテック、中古住宅情報館、グランディリフォーム、神奈川グランディハウス、ウェルカムハウスの8社である。
- history: 【沿革】の表は2009年12月の次に「2010年3月」「2011年12月」の年月が続き、事象文が「大型分譲地『虹の杜ニュータウン』全136区画の販売開始」「東京証券取引所市場第一部に指定替え」の2件あるため、年月と事象の数が一致することから行順に対応づけ、2010年を虹の杜ニュータウン、2011年を市場第一部指定替えとした。
- history: 沿革のうち、支店・支社の開設の一部、子会社設立の一部、第1次・第2次・第3次中期経営計画の策定、諮問委員会の設置、大型分譲地の一部などは、要点を絞るため省いた。資本金の金額は沿革に含めていない。
- industry: 主たる業界は、売上高の大部分を占める不動産販売事業（戸建住宅の分譲が中心）から不動産（real-estate）とした。建築材料販売と不動産賃貸も不動産関連であり、閉じた分類に当てはまる区分があるため taxonomyGap は記録しなかった。
- relatedCompanies: 候補「ポート」（ポート株式会社）は「60年保証・60年サポートシステム」の「ポート」の部分一致であり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 候補「エン」（エン株式会社）は ambiguous で、「エンゲージメント」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「キング」（株式会社キング）は「パーキング事業」の「キング」の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「セキ」（セキ株式会社）は ambiguous な一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「キャリア」（株式会社キャリア）は「キャリア形成」等の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ベース」（ベース株式会社）は「経常利益ベース」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ランド」（株式会社ランド）は自社ブランド名「グランディハウス」等の部分一致であり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ゼロ」（株式会社ゼロ）は ambiguous で、「ネット・ゼロ・エネルギー・ハウス（ZEH住宅）」の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「コロナ」（株式会社コロナ）は「新型コロナウイルス」の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ヒット」（株式会社ヒット）は「ヒット商品」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「めぶきフィナンシャルグループ」（株式会社めぶきフィナンシャルグループ）は特定投資株式として500,000株を保有する相手だが、保有目的は同社傘下の当社主要取引銀行との安定的な取引関係の維持・強化であり、銀行との取引関係を理由とする保有のため、関連企業には結ばなかった。
- relatedCompanies: 候補「日本グランデ」（日本グランデ株式会社）は【沿革】の自社の旧商号（新日本グランディ株式会社等）に含まれる語の一致であり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 候補「オリコン」（オリコン株式会社）はコードリストにない相手であり、本文の記載も顧客満足度調査の実施者としての言及にとどまるため結ばなかった。
- relatedCompanies: 候補「トラスト」（株式会社トラスト）はコードリストにない相手であり、本文の一致も大株主表の日本マスタートラスト信託銀行株式会社（信託口）の部分一致で、信託口の名義であるため結ばなかった。
- relatedCompanies: 連結子会社8社はいずれも未上場のため、関連企業には含めなかった。大株主の新日本物産株式会社（2026年3月31日現在13.66％）と株式会社足利銀行（同2.23％）は未上場で候補にも含まれないため結ばなかった。
- terms: 助言: 用語「プレカット材」（工場で寸法どおりに加工された木材等の建築部材）と「ZEH住宅」（ネット・ゼロ・エネルギー・ハウス。断熱性能の向上と再生可能エネルギーの活用で年間のエネルギー収支をゼロに近づける住宅）、「制震ダンパー」（地震の揺れを吸収する装置）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
