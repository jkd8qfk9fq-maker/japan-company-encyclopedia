# ジェイ・イー・ティ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジェイ・イー・ティ |
| 証券コード | 6228 |
| docID（データを取り出した文書） | `S100YJGG` |
| 原本 docID | `S100Y7JM` |
| 提出日（原本） | 2026-05-29 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100YJGG, S100Y7J3, S100Y7I1／有効文書 S100YJGG（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJGG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジェイ・イー・ティ / 6228 / docID S100Y7JM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 6 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
j-e-t: 10 件の数値を有報XBRLと照合
有報: 株式会社ジェイ・イー・ティ 訂正有価証券報告書－第17期(2025/01/01－2025/12/31) (docID S100YJGG)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-12-31","previousFiling":23114000000,"latestFiling":23420000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":24984000000,"latestFiling":23129000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":17880000000,"latestFiling":19316000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-12-31","previousFiling":1197000000,"latestFiling":1217000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-12-31","previousFiling":1651000000,"latestFiling":1128000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":318000000,"latestFiling":540000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":1896000000,"latestFiling":2018000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":2444000000,"latestFiling":1593000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":662000000,"latestFiling":960000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":28290000000,"latestFiling":28551000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":28774000000,"latestFiling":29817000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":25491000000,"latestFiling":26026000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":8340000000,"latestFiling":8274000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":12411000000,"latestFiling":11823000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":12469000000,"latestFiling":12103000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第17期(2025/01/01－2025/12/31)、docID S100YJGG）を有効文書としてこのパックを作った。原本は docID S100Y7JM。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはBusinessPolicyBusinessEnvironmentIssuesToAddressEtcTextBlock・CorporateGovernanceCompanyWithCorporateAuditorsTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock・GovernanceTextBlock・OverviewOfCorporateGovernanceTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 訂正有価証券報告書－第16期(2024/01/01－2024/12/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第15期(2023/01/01－2023/12/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第16期(2024/01/01－2024/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
j-e-t: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年12月期 の note は既にあります — 先のものを保持しました
- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純損益だけにした。経常損益・営業損益の金額、棚卸評価損や繰延税金資産の取り崩しに伴う法人税等調整額の金額は書かない。
- businessModel: financialNotes は主要な経営指標等の注３（収益認識基準の第14期期首適用）を2022年12月期の最初の注記として採用した。同じく2022年12月期に重なる過年度訂正の注記「売上高及び親会社株主に帰属する当期純利益は、過年度決算の訂正により、前期の有価証券報告書に記載された数値から修正された後の数値です。」は、同じ年の注記は最初の１件だけが残る仕様のため、ここに全文を記録する。2023年12月期・2024年12月期の訂正の注記は financialNotes に残した。
- businessModel: 主要な経営指標等の注１（潜在株式がないため希薄化後指標を記載していない）、注２（従業員数は就業人員数）、注５（第17期は当期純損失のため株価収益率を記載していない）は表示事項のため warnings に留める。
- businessModel: 中期経営計画「Innovation 2027」の財務目標（売上高227億円、原価率、営業利益等の数値目標）は投資指標の目標値のため、本文にも戦略にも書いていない。戦略は数値目標を除いた方針の記述に基づく。
- businessModel: 過年度決算の訂正は2026年５月29日に第15期・第16期等の訂正報告書が提出されて完了しており、採用した訂正有価証券報告書（S100YJGG）の数値は訂正後の印字である。調査・訂正に要する費用が翌期に計上される旨の重要な後発事象の開示は、金額を含む事後のコスト開示のため本文には書かない。
- businessModel: 販売実績（MD&A）の半導体事業14,631百万円とその他30百万円の合計は、印字された合計14,662百万円と１百万円異なる。有報の印字どおりとし、警告に留める。
- businessModel: 親会社ZEUS Co., Ltd.（議決権66.3％、KOSDAQ上場）は、当社製品の販売・販売支援・海外アフターサービス・部品の調達代行を担うが、外国の会社で related-candidates.json にないため関連企業として結ばない。部品の一部はZEUS Co., Ltd.経由で韓国のメーカーから仕入れており、suppliers はこのツリーの旧スキーマのため省略し、この事実をここに記録する。
- businessModel: 主要な顧客であるSamsung Electronics Co., Ltd.（2025年12月期の売上高4,664百万円）とGuangzhou CanSemi IC Manufacturing (Phase III) Co., Ltd.（同1,979百万円）は外国の会社で候補にないため結ばない。ZEUS Co., Ltd.への売上高1,160百万円にはZEUS Co., Ltd.経由でのSamsungグループへの売上高739百万円を含む旨が印字されている。
- businessStructure: 報告セグメントは半導体事業のみであり、セグメント情報の記載は省略されている。事業の区分は【事業の内容】の区分（半導体事業・その他の事業）に従い、金額は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の販売実績（半導体事業14,631百万円、その他30百万円）によった。両者の合計は印字された合計14,662百万円と１百万円異なる（有報の印字どおり）。バッチ式・枚葉式・フィールドサービスには独立した金額の開示がないため、金額は書いていない。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。部品の一部は親会社ZEUS Co., Ltd.経由で韓国のメーカーから仕入れており、装置の一部については台湾・上海の連結子会社とZEUS Co., Ltd.に販売支援や装置立上業務を委託している。
- businessStructure: 連結子会社はJ.E.T. Semi-Con. International Taiwan, Inc.（新竹縣竹北市、部品販売・アフターメンテナンス、100％）、Oribright Shanghai Co., Ltd.（上海市、部品販売・アフターメンテナンス、100％）、J.E.T. Korea Co., Ltd.（華城市、装置の製造・販売、100％）、JET AMERICA INC.（ダラス、装置の販売、100％、特定子会社）、株式会社ジェイ・イー・ティ・アグリ（里庄町、農産物の生産・販売、100％）。持分法適用会社は新必思半導体科技（南通）有限公司（南通市、装置の製造・販売、24.0％）。自社の子会社・関連会社は関連企業として結ばない。
- businessStructure: 設備は本社工場（岡山県浅口郡里庄町、半導体事業）、笠岡ファーム（岡山県笠岡市、その他の事業）、J.E.T. Korea Co., Ltd.の工場（大韓民国京畿道華城市、半導体事業）がある。帳簿価額は書かない。J.E.T. Korea Co., Ltd.は2026年１月１日付で事業の全てを当社の韓国支社に譲渡しており、登録は2025年12月31日現在の構造で行った（needsReviewに記録）。
- history: 資本金の増資（2009年５月・６月、2013年９月、2018年２月、2023年９月）は資本額を含むため落とした。
- history: 事務所の開設・移転（2009年５月の東京事務所開設、2009年６月の九州事務所開設、2010年６月の大阪事務所開設、2013年12月の東京事務所移転）は落とした。
- history: 2009年12月のK.S.E.S. Co., Ltd.の清算、2010年１月と2019年９月の中国現地法人の商号変更、2012年12月の中国現地法人へのZEUS Co., Ltd.の増資引受、2019年３月の中国現地法人の完全子会社化は、現在の事業構造を変えるものではないため落とした。
- history: 2014年８月のリチウムイオン電池に関連する検査・製造装置事業への進出は、現在の【事業の内容】に記載がないため落とした。
- industry: 主たる業界は semiconductors とした。半導体製造の前工程で使用される半導体洗浄装置の製造・販売が事業の中心であり、閉じた分類の semiconductors に直接当てはまるため、暫定分類は使わなかった。taxonomyGaps は無い。
- industry: その他の事業（アグリ事業）は報告セグメントに含まれない区分で、独立した開示は販売実績30百万円のみのため、業界は足さなかった。
- relatedCompanies: ZEUS Co., Ltd.: 親会社（議決権の所有割合66.3％、KOSDAQ上場）で、当社製品の販売・販売支援・海外アフターサービス・部品の調達代行の関係が【関係会社の状況】に印字されているが、外国の会社で related-candidates.json にないため結ばない。
- relatedCompanies: Samsung Electronics Co., Ltd.: 【関連情報】の主要な顧客（2025年12月期の売上高4,664百万円）だが外国の会社で候補にないため結ばない。KOREA SECURITIES DEPOSITORY -SAMSUNG は【大株主の状況】に載る名義上の保有者（ZEUS Co., Ltd.の保有分）であり結ばない。
- relatedCompanies: Guangzhou CanSemi IC Manufacturing (Phase III) Co., Ltd.: 【関連情報】の主要な顧客（2025年12月期の売上高1,979百万円）だが外国の会社で候補にないため結ばない。
- relatedCompanies: en: 「エンジニア」等の汎用語の部分一致で曖昧であり、エン株式会社との関係の印字はないため結ばない。
- relatedCompanies: freee: 「CO2フリー電力」の「フリー」の一致であり、フリー株式会社との関係の印字はないため結ばない。
- relatedCompanies: heiwa: 「平和」という汎用語の一致で曖昧であり、株式会社平和との関係の印字はないため結ばない。
- relatedCompanies: space: 「スペース」という汎用語の一致であり、株式会社スペースとの関係の印字はないため結ばない。
- relatedCompanies: the-san-in-godo-bank: 当座貸越契約及びコミットメントライン契約の取引銀行として印字されるが、銀行・資金調達先であり結ばない。
- relatedCompanies: tomato-bank: 当座貸越契約及びコミットメントライン契約の取引銀行として印字されるが、銀行・資金調達先であり結ばない。
- relatedCompanies: aeon: 「リチウムイオン」の部分一致であり、イオン株式会社との関係の印字はないため結ばない。
- relatedCompanies: base-4481: 「ベース」という汎用語の一致であり、株式会社ベースとの関係の印字はないため結ばない。
- relatedCompanies: core: 「コア」という汎用語の一致で曖昧であり、株式会社コアとの関係の印字はないため結ばない。
- relatedCompanies: ishin: 汎用語の部分一致であり、株式会社イシンとの関係の印字はないため結ばない。
- relatedCompanies: kohsoku: 「高速」という汎用語の一致で曖昧であり、株式会社高速との関係の印字はないため結ばない。
- relatedCompanies: the-lead: 「リード」という汎用語の一致であり、関係の印字はないため結ばない。
- relatedCompanies: 特定投資株式は該当事項なしと印字されており、政策保有株式による候補はない。自社の連結子会社５社と持分法適用会社１社は関連企業として結ばない。
- terms: 助言のみ。用語の追加提案：バッチ式洗浄装置（多数のウエハを同時に各処理槽で処理する洗浄装置）、枚葉式洗浄装置（ウエハを１枚ずつ処理槽内で処理する洗浄装置）、F-Type（装置の前面に搬入機器、後面に搬出機器を配置し、ウエハの流れを１方向にする当社独自のタイプ）、前工程（ウエハに回路を形成するまでの半導体製造工程）。本文中の事業説明に基づく。

## 要確認（status に反映）

- businessModel: 2023年１月１日付で普通株式１株につき２株の割合で株式分割を行い、2024年４月１日付で普通株式１株につき３株の割合で株式分割を行ったことが、主要な経営指標等の推移の注記に記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessModel: 重要な後発事象として、連結子会社J.E.T. Korea Co., Ltd.の事業の全てを2026年１月１日付で当社の韓国支社に譲渡したこと、及び2026年１月20日の取締役会において同社に対する債権放棄と清算手続きの開始を決議したことが記載されています。登録は2025年12月31日現在のグループ構造（J.E.T. Korea Co., Ltd.を連結子会社とする構造）で行っており、期間後のグループ構造の変更の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
