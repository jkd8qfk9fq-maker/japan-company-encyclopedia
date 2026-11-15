# レック — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | レック株式会社 |
| 証券コード | 7874 |
| docID（データを取り出した文書） | `S100YIJB` |
| 原本 docID | `S100YIJB` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIJB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | レック株式会社 / 7874 / docID S100YIJB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
lec: 10 件の数値を有報XBRLと照合
有報: レック株式会社 有価証券報告書－第44期(2025/04/01－2026/03/31) (docID S100YIJB)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":1729000000,"latestFiling":1667000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":3004000000,"latestFiling":3074000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":89421000000,"latestFiling":88928000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":36047000000,"latestFiling":35984000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
lec: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年3月期の主要な経営指標等は、前期有報の印字（当期純利益1,729百万円等）から変わっているが、有報の注記と経営成績等の分析に理由（2024年6月のドリンク剤事業譲受に係る暫定的な会計処理の確定）が印字されているため、financialNotesに記録し、登録は当期有報の数値に基づいた。
- businessModel: 連結の重要な後発事象は、2026年6月8日の取締役会で決議した自己株式の取得のみである。資本政策に関する事項のため、この警告に記録するに留めた。
- businessModel: 経営方針に印字された経営指標の目標水準（ＲＯＥ・ＲＯＩＣ）は投資の語を含む将来目標のため、本文の戦略には転記していない。また、売上総利益や営業利益の金額は本文の規則により書いていない。
- businessModel: 重要な契約等は「該当事項はありません」と印字されている。
- businessModel: 品目別の販売実績の合計（68,294百万円）は連結売上高と一致する。
- businessStructure: グループは当社と連結子会社21社及び持分法適用関連会社１社で構成される（2026年3月31日現在）。
- businessStructure: 報告セグメントは日用雑貨衣料品事業の単一セグメントであり、セグメント情報の記載は省略されているため、事業の内訳は経営成績等の分析に印字された品目別の販売実績（家庭用日用雑貨品・清掃・衛生用消耗品・その他）に基づく。
- businessStructure: 品目別の販売実績の合計（68,294百万円）は連結売上高と一致する。
- history: 沿革に印字された設立時の資本金等の金額は、本文の規則により書いていない。
- history: 1991年の株式会社サンリオからのキャラクター版権の購入開始は、沿革に印字があるが、現在の関係を示す印字ではないため沿革の行としては取り上げず、関連企業の警告に記録した。
- industry: 日用雑貨品や清掃・衛生用消耗品、殺虫剤等の日用品メーカーであり、同じ日用品メーカーであるライオン・アース製薬・花王の登録で主たる業界に使われている chemicals を主たる業界とした。日用品・生活雑貨に固有の閉じた分類はないが、chemicals は同業の先例に沿う当てはめであり、taxonomyGapsは記録していない。
- relatedCompanies: 株式会社大創産業: 2026年3月期の販売額22,423百万円で連結売上高の32.8％を占める最大の顧客だが、非上場で関連企業の候補に含まれず、百科事典に登録ファイルがないため結ばなかった。顧客としての事実はビジネスモデルと業界ポジションに記録した。
- relatedCompanies: sanrio: 特定投資株式として412,416株を保有するが、保有目的は販売先8銘柄以上に共通する定型文（販路の維持・強化等）のみであり、1991年の版権購入開始の印字も現在の関係を示すものではないため結ばなかった。
- relatedCompanies: dcm-holdings: 特定投資株式として532,600株を保有するが、保有目的は販売先に共通する定型文のみのため結ばなかった。なお、旧保有先のエンチョー株式会社の株式は2025年8月31日の株式交換で同社株式に交換され、エンチョーの株式自体は保有していない。
- relatedCompanies: makiya、k-s-holdings、can-do、seven-and-i-holdings、watts、alleanza-holdings、united-super-markets-holdings、kohnan-shoji: いずれも特定投資株式として保有するが、保有目的は販売先に共通する定型文のみのため結ばなかった。イオンも同じ定型文のため結ばなかった（関連企業の候補に含まれない）。
- relatedCompanies: ochi-holdings、t-and-d-holdings、shin-etsu-chemical、tokai-holdings、nagawa、tomoe、olympic-group: 保有目的が「関係維持・強化、情報収集」の定型文のみで、個別の取引関係の印字がないため結ばなかった。
- relatedCompanies: kobayashi-pharmaceutical、earth、lion: 保有目的が「業界動向等の情報収集のため」のみのため結ばなかった。ライオンは2018年のバルサン事業譲受の相手方側のブランド元の会社だが、有報の印字は情報収集目的の保有と、譲受先がライオンパッケージング株式会社であることのみのため結ばなかった。
- relatedCompanies: shizuoka-financial-group: 特定投資株式として332,000株を保有するが、取引銀行との資金調達等の関係のため結ばなかった。なお、株式会社静岡銀行は銀行本体として当社の株式2.38％を保有する大株主だが、持株会社とは別の法人であり、資金取引の関係のため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development: 用地選定・情報収集を目的とする保有で、個別の取引関係の印字がないため結ばなかった。
- relatedCompanies: alphapolis: 戦略出資・資本収益機会を目的とする保有で、事業上の取引関係の印字がないため結ばなかった。
- relatedCompanies: ゴルフ会員権に類する保有は、事業上の取引関係ではないため結ばなかった。
- relatedCompanies: career、innovation、land、freee、king、rent、ricoh、zero、the-lead、nissin: いずれも一般語・文言の部分一致（「キャリア構築」「イノベーション創出」「ブランド」「フリーレント」「ピッキング」「リコール」「プラマイゼロ」「リードタイム」等）で、当該企業についての記載ではないため結ばなかった。zeroは当社の連結子会社プラマイゼロ株式会社の一部でもある。
- relatedCompanies: trust: 日本マスタートラスト信託銀行・株式会社日本カストディ銀行の信託口名義の部分一致で、取引の相手先ではないため結ばなかった。
- relatedCompanies: 当社の連結子会社21社と持分法適用関連会社１社は、当社グループの会社であり関連企業には含めていない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
