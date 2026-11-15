# シリコンスタジオ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | シリコンスタジオ株式会社 |
| 証券コード | 3907 |
| docID（データを取り出した文書） | `S100XNL3` |
| 原本 docID | `S100XNL3` |
| 提出日（原本） | 2026-02-26 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XNL3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | シリコンスタジオ株式会社 / 3907 / docID S100XNL3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
silicon-studio: 10 件の数値を有報XBRLと照合
有報: シリコンスタジオ株式会社 有価証券報告書－第27期(2024/12/01－2025/11/30) (docID S100XNL3)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-11-30","previousFiling":3986000000,"latestFiling":3280000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-11-30","previousFiling":4510000000,"latestFiling":3757000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-11-30","previousFiling":4554000000,"latestFiling":3850000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-11-30","previousFiling":4414000000,"latestFiling":3741000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-11-30","previousFiling":-71000000,"latestFiling":92000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-11-30","previousFiling":394000000,"latestFiling":365000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-11-30","previousFiling":246000000,"latestFiling":250000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-11-30","previousFiling":123000000,"latestFiling":128000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-11-30","previousFiling":2824000000,"latestFiling":2211000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-11-30","previousFiling":3440000000,"latestFiling":2711000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-11-30","previousFiling":3159000000,"latestFiling":2498000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-11-30","previousFiling":2945000000,"latestFiling":2377000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-11-30","previousFiling":1360000000,"latestFiling":1374000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-11-30","previousFiling":1702000000,"latestFiling":1628000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-11-30","previousFiling":1758000000,"latestFiling":1683000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-11-30","previousFiling":1738000000,"latestFiling":1648000000},{"key":"NumberOfEmployees|2021-11-30","previousFiling":255,"latestFiling":173},{"key":"NumberOfEmployees|2022-11-30","previousFiling":261,"latestFiling":179},{"key":"NumberOfEmployees|2023-11-30","previousFiling":275,"latestFiling":192},{"key":"NumberOfEmployees|2024-11-30","previousFiling":262,"latestFiling":202}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
silicon-studio: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との指標の差異は、前期有報の連結経営指標等と今期有報の提出会社（単体）の経営指標等との比較によるものです。今期有報の５年表は単体の印字どおりに登録しました。2024年12月１日のイグニス・イメージワークス株式会社の吸収合併により当期から非連結となった経緯は financialNotes（2025年11月期）に記録しました。収益認識基準の適用（主要な経営指標等の推移の注記６）は financialNotes（2022年11月期）に記録しました。
- businessModel: 主要な経営指標等の推移の注記１～５、７は、潜在株式がない年度の希薄化後指標の非開示、配当を実施しなかった年度の表示、従業員数の数え方、株式給付信託（J-ESOP）の株式の取扱い、株価の市場表示、株主総利回りの比較指数の変更に関する表示事項のため、financialNotes には入れていません。
- businessModel: 経営方針に印字された売上高営業利益率を重要な経営指標とする方針と2026年11月期の業績予想の数値は、利益指標・投資指標の目標に当たるため、本文と perspectives には書いていません。
- businessModel: セグメント利益の金額、経営成績等の分析に印字された段階利益の金額と増減理由、キャッシュ・フローの金額、受注高・受注残高の金額は書いていません。
- businessModel: 2025年12月に東京証券取引所のグロース市場からスタンダード市場へ移行しました（【沿革】に印字）。市場の表示変更であり構造の変更ではないため warnings のみの扱いとしました。重要な後発事象は「該当事項はありません」でした。
- businessStructure: 2024年12月１日に完全子会社のイグニス・イメージワークス株式会社を吸収合併したため、当事業年度より連結から非連結となりました。本登録は2025年11月30日現在の構造（単体、持分法適用関連会社１社）に基づいています。吸収合併は期中の出来事で期末構造に反映済みのため、needsReview ではなく businessModel の financialNotes とここに記録しました。
- businessStructure: セグメント注記は百万円単位の印字です。開発推進・支援事業2,661百万円と人材事業1,641百万円の合計は4,302百万円で、印字された売上高合計4,303百万円と1百万円差があります。そのまま印字どおり記載しました。セグメント間の内部売上高はありません。
- businessStructure: 主要な設備は本社（東京都渋谷区）の１行のみで、セグメント欄は「全セグメント」のため、特定の事業には紐付けていません。帳簿価額は書いていません。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先名の印字はありません。
- history: 沿革のうち、資本に関する事項（1999年の第三者割当増資、2007年の減資）は金額を含め項目にしていません。市場区分の移行（2022年のグロース市場への移行、2025年12月のスタンダード市場への移行）は表示変更のため項目にせず、ここに記録します。
- history: 省いた小項目: Alchemyのライセンス提供開始（2001年）、オンラインエンターテインメントのサーバーに関するコンサルテーション開始（2010年）、Mobage向けタイトルの提供（2010年、2012年）、スマートフォン向けタイトルの提供（2013年）、リアルタイムレンダリングエンジン「Mizuchi」の販売開始（2015年）。
- history: 2024年12月１日のイグニス・イメージワークス株式会社の吸収合併は【沿革】ではなく経営成績等の分析に印字されているため、沿革の項目にはせず、businessModel の financialNotes と businessStructure の warnings に記録しました。
- history: Wikipedia（記事「シリコンスタジオ」、証券コード3907で一致）の extract は本社の所在地と事業概要のみで、有報の記載を補う新しい事実はなかったため、出典には使っていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、最大セグメントの開発推進・支援事業（ミドルウェアの開発・販売、受託開発、オンラインソリューション）がソフトウェア・ITサービスであるため it としました。人材事業（外部顧客への売上高1,641百万円）は独立した報告セグメントとして開示されているため human-resources を第二の業界として付けました。
- industry: 顧客はエンターテインメント業界ですが、同社はコンテンツそのものではなく技術と人材を提供する会社であり、2018年にコンテンツ事業から撤退しているため entertainment は付けていません。DEIの別記事業はcteです。閉じた分類に直接当たるため、暫定分類やtaxonomyGapsはありません。
- relatedCompanies: nintendo: 経営成績等の分析における主な相手先別の販売実績（当事業年度・前事業年度とも最大の相手先）が根拠です。金額は description には書いていません。
- relatedCompanies: argo-graphics / square-enix-holdings / creek-and-river: いずれも【大株主の状況】に事業会社の大株主として印字されていることが根拠です（保有割合のみで、取引の印字はありません）。
- relatedCompanies: dena: 【沿革】で「Mobage」プラットフォームへのタイトル提供（2010年、2012年）が印字されるのみで、過去の関係のため結んでいません。gmo-internet: 【沿革】で2013年の協業によるタイトル提供が印字されるのみで、過去の関係のため結んでいません。
- relatedCompanies: witz: 売掛金の相手先別内訳に社名があるのみで、取引関係の記述がないため結んでいません。kawasaki-and-co: 印字はカワサキモータース株式会社であり候補とは別の法人で、売掛金の相手先別内訳のみのため結んでいません。
- relatedCompanies: en / tein / seki / career / kohsoku / base-4481 / path / core / lec / ray / corona / king / port / rhythm / ricoh / the-lead / oro: 部分文字列・一般語の一致のみです（エンターテインメント、情報セキュリティ、キャリアアドバイザー、高速なレスポンス、ベースに、コア技術、サポート、コロナ禍、営業利益ベース、リコール、リードタイム、「OROCHI」等）。
- relatedCompanies: 候補にないため結んでいないもの: 株式会社イリンクスは当社の持分法適用関連会社（議決権40.0％）であり、自社の関係会社は結びません。株式会社gumiは特定投資株式として100株を保有していますが、保有目的は「取引関係等の円滑化のため」という画一的な文言で、具体的な取引の印字がないため結んでいません。イグニス・イメージワークス株式会社は2024年12月１日に当社が吸収合併した完全子会社です。
- terms: 助言のみ: 用語候補として ミドルウェア、レンダリング、グローバルイルミネーション、ポストエフェクト、ゲームエンジン、デジタルツイン、プリレンダリングムービー などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
