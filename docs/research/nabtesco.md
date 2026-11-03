# ナブテスコ — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ナブテスコ株式会社 |
| 証券コード | 6268 |
| docID（データを取り出した文書） | `S100Z4C8` |
| 原本 docID | `S100XTOY` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100Z4C8／有効文書 S100Z4C8（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z4C8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | ナブテスコ株式会社 / 6268 / docID S100XTOY |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nabtesco: 10 件の数値を有報XBRLと照合
有報: ナブテスコ株式会社 訂正有価証券報告書－第23期(2025/01/01－2025/12/31) (docID S100Z4C8)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":299802000000,"latestFiling":299641000000},{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":308691000000,"latestFiling":309123000000},{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":333631000000,"latestFiling":333367000000},{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":323384000000,"latestFiling":280458000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":64818000000,"latestFiling":64771000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":9464000000,"latestFiling":10415000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":14554000000,"latestFiling":14226000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":10119000000,"latestFiling":10188000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":101966000000,"latestFiling":101806000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":15763000000,"latestFiling":16553000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":25629000000,"latestFiling":25316000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":15747000000,"latestFiling":14225000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":481718000000,"latestFiling":483653000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":459293000000,"latestFiling":462440000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":422065000000,"latestFiling":428630000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":445544000000,"latestFiling":449845000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":239910000000,"latestFiling":241372000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":248696000000,"latestFiling":251250000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":260470000000,"latestFiling":262721000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":270093000000,"latestFiling":272559000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第23期(2025/01/01－2025/12/31)、docID S100Z4C8）を有効文書としてこのパックを作った。原本は docID S100XTOY。原本との主要財務の差異: S100Z4C8（23件） — amendments.records[].comparedToBase を見ること
注意: 訂正有報の分類: financial-change — 数値が原本と異なる（主要財務 23 件／その他の数値 317 件: Assets・AssetsIFRS・BasicEarningsLossPerShareIFRS・BasicEarningsLossPerShareIFRSSummaryOfBusinessResults・BasicEarningsLossPerShareSummaryOfBusinessResults・ComprehensiveIncomeAttributableToOwnersOfParentIFRS・ComprehensiveIncomeAttributableToOwnersOfParentIFRSSummaryOfBusinessResults・ComprehensiveIncomeIFRS・ComprehensiveIncomeIFRSSummaryOfBusinessResults・ContinuingOperationsBasicEarningsLossPerShareIFRS・ContinuingOperationsDilutedEarningsLossPerShareIFRS・CostOfSales）。このパックの数値は有効文書のもの。原本の数値を出典にした記述が混ざっていないか確認すること
注意: 本文に 非継続事業・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nabtesco: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 顧客は有報が具体名・業種を印字していないため、製品の用途から言える範囲の一般的な表現にした（総販売実績の10％以上の販売先は無い）。
- businessModel: 営業利益・税引前利益・セグメント利益と各種金額は本文方針により書かない。
- businessModel: perspectives.strategy.disclosed の asOf は表紙の提出日（2026-03-25）。訂正報告書の提出日は2026-09-30。
- businessStructure: 事業の並びは【事業セグメント】の外部売上高の大きい順（アクセシビリティ110,668、トランスポート100,473、コンポーネント79,325）。『その他』は報告セグメントに含まれないため最後。
- businessStructure: 有報の事業内容欄は繊維機械も『その他』に挙げるが、セグメント注記は包装機械・立体モデル作成装置のみ。注記に合わせ、製品には繊維機械を入れていない。
- businessStructure: 油圧機器事業は2025年12月期に非継続事業へ分類され、売上高は継続事業のみ（前期も組替済み）。
- history: 統合前2社の沿革表は列が混ざるため、内容から会社が明確な1925年（ナブコ）と1944年（帝人航空工業）の行だけ使い、1953年以降の自動ドア・油圧機器などの行は落とした。
- history: 上場時の『市場第一部』は2003年9月の事実として2003年の項に含めた。
- industry: 報告セグメント3つ（アクセシビリティ・トランスポート・コンポーネント）はいずれも機械・装置の製造で、機械を主とした。自動車・半導体は独立した報告セグメントとして開示されていないため足していない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、結んだ相手は無い。
- relatedCompanies: Comer Industries S.p.A.: 油圧機器事業を承継したコムテスコの株式70％の譲渡先（2026年1月1日付）だが、上場企業としての候補に無く、過去の一回限りの取引のため結ばない。
- relatedCompanies: TMTマシナリー（持分法適用関連会社、議決権33.0％）: 候補に無く、上場の確認ができないため結ばない。
- relatedCompanies: 米国パーカーハネフィン社: 技術導入契約の相手だが、候補に無く掲載済みの確認ができないため結ばない。
- terms: 用語の候補（助言のみ）: 精密減速機、モーションコントロール、MRO（保守・修理・オーバーホール）、プラットホームドア、非継続事業、吸収分割。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: 訂正有価証券報告書（2026-09-30提出）で2021〜2025年の売上高・当期利益などが原本から変わっている（2024年12月期の売上高は油圧機器の非継続事業組替で説明がつくが、2021〜2023年の小幅な差は訂正理由をこのパックで確認できていない）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
