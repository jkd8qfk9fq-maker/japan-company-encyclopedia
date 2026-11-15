# ワコム — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ワコム |
| 証券コード | 6727 |
| docID（データを取り出した文書） | `S100YHU2` |
| 原本 docID | `S100YHU2` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHU2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ワコム / 6727 / docID S100YHU2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wacom: 10 件の数値を有報XBRLと照合
有報: 株式会社ワコム 有価証券報告書－第43期(2025/04/01－2026/03/31) (docID S100YHU2)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":108789859000,"latestFiling":108789000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":112729503000,"latestFiling":112729000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":118794737000,"latestFiling":118794000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":115680799000,"latestFiling":115680000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":10954987000,"latestFiling":10954000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":1792138000,"latestFiling":1792000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":4561615000,"latestFiling":4561000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":5224744000,"latestFiling":5224000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":14351004000,"latestFiling":14351000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":2867878000,"latestFiling":2867000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":9852727000,"latestFiling":9852000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":10394303000,"latestFiling":10394000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":73332474000,"latestFiling":73332000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":75278772000,"latestFiling":75278000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":79619657000,"latestFiling":79619000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":70771224000,"latestFiling":70771000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":43503052000,"latestFiling":43503000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":40489664000,"latestFiling":40489000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":35968223000,"latestFiling":35968000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":30859475000,"latestFiling":30859000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
wacom: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: セグメント別外部売上高の合計は109,994百万円で、連結売上高109,995百万円と1百万円の差があります。地域別売上高の合計も109,994百万円で同じく1百万円の差があります。いずれも有報の印字どおりで、丸めによるものとして記録します。
- businessModel: 中期経営計画『Wacom Chapter ４』の2029年3月期の数値目標は将来の目標のため、本文には記載していません。
- businessModel: 第43期より金額の表示単位を千円単位から百万円単位に変更し、第42期以前も比較のため百万円単位に変更しています（表示のみの変更）。修正再表示チェックの差異は千円単位から百万円単位への丸めによるもので、5年間の主要な経営指標等に影響はありません。
- businessModel: 重要な後発事象として、2026年5月12日開催の取締役会で自己株式の取得（上限3,000,000株・15億円、取得期間2026年5月13日～2026年6月30日）を決議したことが印字されています。資本政策のためwarningsのみに記録し、needsReviewには入れていません。
- businessModel: サムスングループは主要な顧客（売上高45,652百万円）ですが、韓国の企業で関連企業候補にないため関連企業には結んでいません。役割はindustryPositionに記録しています。
- businessModel: サムスン エレクトロニクス シンガポール ピーティーイー リミテッドは2026年3月31日現在で6.24％を保有する大株主ですが、海外法人で関連企業候補にないため関連企業には結んでいません。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順です。テクノロジーソリューション事業77,257百万円、ブランド製品事業32,737百万円の合計は109,994百万円で、連結売上高109,995百万円と1百万円の差があります。有報の印字どおりで、丸めによるものとして記録します。
- businessStructure: 製品区分（AES、EMR、クリエイティブソリューション、ビジネスソリューション）の売上高は独立して開示されていないため、childrenには金額を書いていません。
- businessStructure: 連結従業員数は930人（2026年3月31日現在）です。
- history: 沿革の表は年月と事象が対で印字されており、行順の対応づけは不要でした。
- history: 設立時の資本金の金額は有報に印字がありますが、本文には記載していません。
- industry: 主たる業界は電気機器としました。デジタルペン技術は半導体そのものではなく、電子部品・モジュールとして開示されているため、半導体は付けていません。
- relatedCompanies: 日東工業株式会社は、2017年12月にエンジニアリングソリューション事業を譲渡した1回限りの取引相手のため、関連企業には結んでいません。
- relatedCompanies: Holoeyes株式会社とSYNCORE TECHNOLOGY社は、2025年4月・5月に出資した投資先ですが、いずれも非上場で関連企業候補にないため関連企業には結んでいません。
- relatedCompanies: 株式会社リクロスエクスパンションは2026年3月に株式を取得した連結子会社ですが、非上場で関連企業候補にないため関連企業には結んでいません。
- relatedCompanies: 住友不動産株式会社は、本店の最寄りの連絡場所の住所に社名があるだけで、取引・提携・資本関係の印字がないため関連企業には結んでいません。
- relatedCompanies: サムスングループは主要な顧客ですが、韓国の企業で関連企業候補にないため関連企業には結んでいません。役割はbusinessModelのindustryPositionに記録しています。
- relatedCompanies: ランド、エン、コア、レイ、ポート、ベース、レック、トラスト、セキ、ビジョン、キャリア、IC、コロナ、イノベーション、イシン、アイズ、フリー、いであ、キング、リコー、リックス、テイン、リード、ゼロは、一般語・部分一致の誤抽出のため、関連企業には結んでいません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
