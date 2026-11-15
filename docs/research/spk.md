# ＳＰＫ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＳＰＫ株式会社 |
| 証券コード | 7466 |
| docID（データを取り出した文書） | `S100YCR6` |
| 原本 docID | `S100YCR6` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCR6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＳＰＫ株式会社 / 7466 / docID S100YCR6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
spk: 10 件の数値を有報XBRLと照合
有報: ＳＰＫ株式会社 有価証券報告書－第155期(2025/04/01－2026/03/31) (docID S100YCR6)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":47686656000,"latestFiling":47686000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":54695637000,"latestFiling":54695000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":63302401000,"latestFiling":63302000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":68720867000,"latestFiling":68720000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":1625253000,"latestFiling":1625000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":2059888000,"latestFiling":2059000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":2392028000,"latestFiling":2392000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":2497319000,"latestFiling":2497000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":2287380000,"latestFiling":2287000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":2910842000,"latestFiling":2910000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":3357085000,"latestFiling":3357000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":3568767000,"latestFiling":3568000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":30014782000,"latestFiling":30014000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":34351790000,"latestFiling":34351000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":38641825000,"latestFiling":38641000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":44172970000,"latestFiling":44172000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":20223894000,"latestFiling":20223000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":22175575000,"latestFiling":22175000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":24591672000,"latestFiling":24591000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":27062497000,"latestFiling":27062000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
spk: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「SPK株式会社」が EDINET の提出者名「ＳＰＫ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックの差異は、売上高・当期純利益・利益・総資産・純資産の全系列で生じているが、いずれも当連結会計年度より金額の表示単位を千円単位から百万円単位に変更したことに伴う表示単位の差異（前期有報の円単位の実数と当期有報の百万円表示との端数差）であり、百万円単位では全行一致する。第155期より表示単位を変更し第154期以前も百万円単位に変更した旨が主要な経営指標等の注記に印字されている。表示方法の変更であり指標の実質的な修正ではないため、financialNotes・needsReview には含めず warnings に留めた。登録は当期有報の印字どおりの数値による。
- businessModel: 報告セグメントの外部顧客への売上高の単純合計は75,245百万円で、連結売上高75,246百万円と1百万円異なる。地域別の売上高の単純合計は75,244百万円で、印字の合計75,246百万円と2百万円異なる。いずれも有報の印字どおりとし、ここに記録した。
- businessModel: 当連結会計年度より、連結子会社の株式会社デルオートの管掌部門移管に伴い報告セグメントの区分が変更され、前連結会計年度のセグメント情報は変更後の区分で組み替えられている。区分の変更であり5年表の指標への影響はないため warnings に留めた。
- businessModel: 中期経営計画の重要指標（売上高営業利益率、ROE）の水準や配当の数値は、将来に関する事項・比率の記載のため perspectives には方針の要旨のみを記載し、比率や目標数値は記載していない。
- businessModel: セグメント利益は本文に記載していない。売上高の前期比9.5％増、親会社株主に帰属する当期純利益の同7.8％増は経営成績等の分析の印字どおりである。
- businessStructure: 報告セグメントの外部顧客への売上高は国内営業本部32,076百万円、海外営業本部27,979百万円、工機営業本部7,988百万円、CUSPA営業本部7,202百万円で、4セグメントの単純合計は75,245百万円となり、連結売上高75,246百万円と1百万円異なる（有報の印字どおりとし、ここに記録した）。子区分は外部顧客への売上高の大きい順に並べた。
- businessStructure: 当連結会計年度より、連結子会社の株式会社デルオートの管掌部門が国内営業本部から工機営業本部へ移管され、報告セグメントの区分が変更されている。前連結会計年度のセグメント情報は変更後の区分に基づき作成したものが開示されている。セグメント区分の変更であり5年表の指標への影響はないため、financialNotes には含めず warnings に留めた。
- businessStructure: セグメント利益は本文に記載していない。経営成績等の分析のセグメント別売上高は外部顧客への売上高と同額が印字されている。
- history: 沿革には多数の営業所開設行があるが、事業構造に影響する主要な行（設立、商号変更、海外法人の設立、株式公開・上場、主要な子会社化、市場移行）に絞って収録し、各地の営業所開設や小規模な法人設立・清算の行は省略した。
- history: 設立時及び子会社の資本金額は沿革・関係会社の状況に印字があるものも含め、履歴には記載していない。
- industry: 4つの報告セグメントはいずれも自動車部品・産業車輌部品の販売（国内販売・輸出入）を担う営業本部であり、同社自身も「モビリティビジネスのグローバル商社」を目指すとしているため、主たる業界は trading とした。CUSPA営業本部には子会社の株式会社ブリッツによるカスタムパーツの企画・製造が含まれるが、グループの中心は部品の仕入・販売であり、製造のみの独立した金額開示もないため、第二の業界は付けなかった。
- relatedCompanies: 株式会社ブロードリーフ: 特定投資株式の保有目的に、同社の自動車補修部品の検索システムが当社の販売に必要不可欠である旨と、良好かつ緊密な関係を築くための保有である旨が印字されているため supplier として結んだ。
- relatedCompanies: 株式会社ＴＢＫ: 特定投資株式に、同社の大型車輛のブレーキ等が新たな補修部品市場への開拓・進出に重要である旨の印字があるが、関連企業候補に含まれていないため結ばなかった。
- relatedCompanies: 伊藤忠商事株式会社: 沿革に1917年の設立時の関係会社としての印字があるのみで、現在の取引・提携の印字がないため結ばず、沿革にのみ記載した。
- relatedCompanies: 株式会社光通信: 大株主として印字されているのは光通信KK投資事業有限責任組合であり、光通信株式会社とは別の法人格であること、取引・提携の印字もないため結ばなかった。
- relatedCompanies: 子会社20社及び持分法適用関連会社1社（株式会社丸安商会、谷川油化興業株式会社、SPK Singapore Pte. Ltd.、株式会社ブリッツ、Baleros Internacionales S.A. de C.V.等）は自社グループ会社のため結ばなかった。
- relatedCompanies: そのほかの候補（エン、ゼロ、ランド、キャリア、コア、田谷、インソース、セキ、ベース、ポート、トラスト、レイ）は、一般語・部分一致のみで相手企業としての取引・提携の印字がないため結ばなかった。インソースはエンゲージメント診断の提供元としての言及のみ、トラストは信託銀行の信託口への一致でコードリストにもない。
- relatedCompanies: 関連会社の説明には貸借対照表計上額などの財務金額を記載していない（保有株式数と関係の内容のみ）。
- terms: 助言: 用語「CUSPA」は、カスタマイズドパーツをメインに販売する同社の営業本部の略称（CUSTOMIZED PARTS DIV.）。カーメーカータイアップ事業、オリジナルブランド事業、二輪事業、e-Sports事業等を行う。
- terms: 助言: 用語「VISION2030」は、2030年までにモビリティビジネスのグローバル商社を目指す同社の長期ビジョン。2021-2023年度を1st Cycle、2024-2026年度を2nd Cycleとする中期経営計画で推進している。
- terms: 助言: 用語「組付部品」は、建機・農機・フォークリフト等の産業車輌メーカーが製品の組立に用いる部品。同社の工機営業本部がメーカーへ販売している。

## 要確認（status に反映）

- businessModel: 株式分割: 2026年4月1日付で普通株式1株につき2株の割合による株式分割を実施（2026年2月9日取締役会決議）。株式数に関する指標は第151期（2022年3月期）の期首に当該分割が行われたと仮定して算定されている旨が印字されている。登録は有報の印字どおり。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
