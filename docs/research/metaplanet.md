# メタプラネット — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社メタプラネット |
| 証券コード | 3350 |
| docID（データを取り出した文書） | `S100YB0L` |
| 原本 docID | `S100XTWY` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100YB0L／有効文書 S100YB0L（2026-11-17 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YB0L.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 株式会社メタプラネット / 3350 / docID S100XTWY |
| edinet | completed | 1 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
metaplanet: 10 件の数値を有報XBRLと照合
有報: 株式会社メタプラネット 訂正有価証券報告書－第27期(2025/01/01－2025/12/31) (docID S100YB0L)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-12-31","previousFiling":518451000,"latestFiling":518000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-12-31","previousFiling":366121000,"latestFiling":366000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":261633000,"latestFiling":261000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":1062283000,"latestFiling":1062000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-12-31","previousFiling":-737240000,"latestFiling":-737000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-12-31","previousFiling":977845000,"latestFiling":977000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-12-31","previousFiling":-683923000,"latestFiling":-683000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":4439843000,"latestFiling":4439000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":-1230727000,"latestFiling":-1230000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":-836658000,"latestFiling":-836000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":-414710000,"latestFiling":-414000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":5993193000,"latestFiling":5993000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":13091183000,"latestFiling":13091000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":5357296000,"latestFiling":5357000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":1666137000,"latestFiling":1666000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":30325812000,"latestFiling":30325000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":-373414000,"latestFiling":-373000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":617518000,"latestFiling":617000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":1152087000,"latestFiling":1152000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":16965842000,"latestFiling":16965000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第27期(2025/01/01－2025/12/31)、docID S100YB0L）を有効文書としてこのパックを作った。原本は docID S100XTWY。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはCorporateGovernanceCompanyWithNominatingAndOtherCommitteesTextBlock・OverviewOfCorporateGovernanceTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
metaplanet: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.revenueSources[1]: 売上高と当期純利益以外の利益に触れていないか確認する（…ビットコインデリバティブ実現損益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YB0L、2026年6月12日提出）で、分類は record-only。主要な財務数値と本文は原本（docID S100XTWY）と同一で、差異はコーポレート・ガバナンスのテキストブロックのみのため、訂正については needsReview に入れず、出典は訂正有報側に統一した。
- businessModel: 前期有報との経営指標の差異は、表示単位を千円単位から百万円単位へ変更したことによるもので、修正再表示や組替えではない（経営指標等の注記に印字）。2025年12月期の financialNotes にその旨を記録した。
- businessModel: 2025年12月期のセグメント変更: Web3関連事業からの撤退に伴い「その他」の区分を廃止し、セグメント名称をビットコイントレジャリー事業からビットコイン関連事業に変更した。また売上高の科目名をビットコインデリバティブ実現損益・ビットコインデリバティブに係る受取オプション料・その他ビットコイン関連売上・ホテル売上に変更し、前期分を組み替えている（セグメント情報等の注記に印字）。データの誤りではないため needsReview には入れていない。
- businessModel: ビットコインの保有数量（2025年末時点）やビットコイン評価損の金額、BTCイールド等の同社が掲げる経営指標は、投資指標的な数値のため本文には書かず、2025年12月期の純損失の理由は金額を示さずに述べた。
- businessModel: Ｂ種種類株式（MERCURY）の発行総額、ビットコインを担保としたクレジット・ファシリティの上限額、期後の2026年1月の取締役会で決議した第三者割当による新株式及び第25回新株予約権の発行（同年2月に払込完了）は、いずれも資本政策・資金調達の事項のため、本文と needsReview には入れず、この warnings に記録するにとどめた。
- businessModel: セグメントの内訳の単純合計（477百万円＋7,976百万円＋14百万円＝8,467百万円）と印字されたビットコイン関連事業の売上高8,468百万円、セグメント合計（8,468百万円＋436百万円＝8,904百万円）と印字された合計8,905百万円、地域別の単純合計（3,667百万円＋5,237百万円＝8,904百万円）と印字された合計8,905百万円には、それぞれ1百万円の差がある。百万円単位の表示に伴う丸めであり、印字された合計をそのまま引用した。
- businessModel: Wikipedia の冒頭を確認したが、有報に書かれていない補足として使える新しい事実（旧社名・通称等）はなく、出典には追加していない。旧社名の変遷は沿革にすべて印字されている。
- businessStructure: 当社グループは当社と連結子会社6社で構成される。2025年12月期にビットコイン関連事業の連結子会社5社を新たに設立して連結の範囲に含め、株式会社メタマーケットは清算結了、チューン那覇匿名組合は重要性の低下により連結の範囲から除外した（事業の内容・関係会社の状況に印字）。
- businessStructure: Ｂ種種類株式の株主は株主総会における議決権を有していない（経営指標等の注記に印字）。Ｂ種種類株式は2025年12月29日に発行された種類株式で、本文では資本政策として扱い金額は書いていない。
- businessStructure: 前事業年度に存在したEVO FUND向け第3回普通社債の保証債務とホテルロイヤルオーク五反田の土地・建物への抵当権は、当事業年度末時点では該当事項なしと印字されており解消している。
- history: 沿革の表は年月と事象が正しく対応して印字されており、崩れた行はなかった。資金調達の決議が多数印字されているが、事業の転換点となる出来事を中心に13件を選んだ。
- history: 2024年4月の「ビットコイン・スタンダード」体制の採用は沿革ではなく経営成績等の分析に印字されているため、沿革の項目には含めず businessModel で扱った。
- industry: 主たる業界は finance（金融）を暫定とした。売上の約95％を占めるビットコイン関連事業は、ビットコインの保有・運用とデリバティブ取引による収益の事業であり、閉じた分類に直接合う値が無いため最も近い finance を暫定分類とし、taxonomyGaps に記録した。
- industry: ホテル事業（売上高436百万円）は金額が独立して開示されているが、閉じた分類に宿泊に当たる値が無いため業界を付けず、taxonomyGaps に記録した。
- relatedCompanies: planet（株式会社プラネット）: 社名の一致は「メタプラネット」の部分一致による誤検出であり、有報が同社について取引・提携・資本関係を述べていないため、結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「米ドルベース」等の語の部分一致による誤検出であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: nissin（株式会社日新）: 日付の表記の部分一致による誤検出（候補データでも上場を確認できない）であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: seki（セキ株式会社）: 「セキュリティ」の部分一致による誤検出であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: rion（リオン株式会社）: 「ミリオン」の部分一致による誤検出であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: daiwa（株式会社大和）: 沿革の「神奈川県大和市」の部分一致による誤検出であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: hope（株式会社ホープ）: 住所の「サウスホープ・ストリート」の部分一致による誤検出であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: king（株式会社キング）: 「ハッキング」の部分一致による誤検出であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「グランド・ケイマン」の部分一致による誤検出であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: the-lead（株式会社リード）: 「リードし」の部分一致による誤検出であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: 「インタートラスト・コーポレート・サービシズ」の部分一致による誤検出（候補データでも上場を確認できない）であり、有報が同社について述べていないため、結ばなかった。
- relatedCompanies: EVO FUND: 第3回普通社債の割当先であり、新株予約権の買取契約の相手方として有報に繰り返し現れるが、ケイマン諸島のファンドで証券コードのない非上場の投資ファンドのため、関連企業に結ばなかった。
- relatedCompanies: 大株主の状況に載る STATE STREET BANK AND TRUST COMPANY、CLEARSTREAM BANKING S.A. 等は、常任代理人を伴う保管・名義の口座であり、純投資の信託・保管口座のため、関連企業に結ばなかった。
- relatedCompanies: ストラテジー社（米国）: 経営成績等の分析で「ビットコイン・スタンダード」採用の先行事例として言及されるのみで、取引や提携の事実が印字されていないため、結ばなかった。
- terms: 用語の助言: 「ビットコイントレジャリー」はビットコインを企業の準備資産として保有する財務戦略、「ビットコイン・スタンダード」はビットコインを基準とする財務体制、「BTCイールド」は株式の希薄化を考慮した後の保有ビットコイン数量の伸び率を測る同社の経営指標、「デジタル・クレジット」はビットコインを基盤とした資本運営・資本配分機能を指す同社の造語、「MSワラント」は行使価額修正条項付新株予約権の通称を指します。

## 要確認（status に反映）

- businessModel: 連結経営指標等に印字された純資産額は、第23期（2021年12月期）末時点で△373百万円と債務超過の状態でしたが、第24期（2022年12月期）末時点で617百万円となり、債務超過は解消しています。本登録は、債務超過が解消した後の期間を含む直近5期の指標に基づいています。
- businessModel: 2025年4月1日付で普通株式1株につき10株の割合で株式分割を行いました。経営指標等の各数値は、当該分割が第23期（2021年12月期）の期首に行われたと仮定して算定して印字されており、本登録はこの算定後の数値に基づいています。
- businessStructure: 連結子会社のうち、Metaplanet Income Corp.は2025年12月末時点で6,993百万円、Metaplanet Capital Limitedは8,237百万円の債務超過の状態にあります（関係会社の状況の注記に印字）。連結全体の純資産額は458,592百万円とプラスであり、継続企業の前提に関する注記はありません。
- businessStructure: 2025年4月1日付で普通株式1株につき10株の割合で株式分割を行いました。経営指標等の各数値は、当該分割が第23期（2021年12月期）の期首に行われたと仮定して算定して印字されており、本登録はこの算定後の数値に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] メタプラネット（metaplanet）のビットコイン関連事業 → 提案: 暗号資産。ビットコインの保有・運用とデリバティブ取引による収益が売上の約95％を占めるが、閉じた分類に暗号資産に当たる値が無く、最も近い金融を暫定分類としたため。
- [industry] メタプラネット（metaplanet）のホテル事業 → 提案: 宿泊。ホテルロイヤルオーク五反田の運営に合う値が閉じた分類に無いため、業界を付けず分類の不足として記録する。ホテル事業の外部顧客への売上高は436百万円です。
