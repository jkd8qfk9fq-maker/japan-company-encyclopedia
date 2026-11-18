# ＢｌｕｅＭｅｍｅ — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＢｌｕｅＭｅｍｅ |
| 証券コード | 4069 |
| docID（データを取り出した文書） | `S100ZAX7` |
| 原本 docID | `S100Z5HJ` |
| 提出日（原本） | 2026-09-30 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100ZAX7, S100Z5A2, S100Z59Y, S100Z59P, S100Z59B, S100Z58U／有効文書 S100ZAX7（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100ZAX7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＢｌｕｅＭｅｍｅ / 4069 / docID S100Z5HJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 7 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bluememe: 10 件の数値を有報XBRLと照合
有報: 株式会社ＢｌｕｅＭｅｍｅ 訂正有価証券報告書－第20期(2025/04/01－2026/03/31) (docID S100ZAX7)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":1942140000,"latestFiling":1936066000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":2289468000,"latestFiling":2300833000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":2506780000,"latestFiling":2480631000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":2349515000,"latestFiling":2365055000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":259025000,"latestFiling":257221000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":259682000,"latestFiling":268477000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":174872000,"latestFiling":170735000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":-17143000,"latestFiling":-10494000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":355172000,"latestFiling":354249000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":354594000,"latestFiling":365478000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":254850000,"latestFiling":249140000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":20633000,"latestFiling":29095000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":3350523000,"latestFiling":3350627000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":3531550000,"latestFiling":3538284000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":3733992000,"latestFiling":3730403000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":3899702000,"latestFiling":3900692000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":2397924000,"latestFiling":2369544000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":2659867000,"latestFiling":2640282000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":2609361000,"latestFiling":2585639000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":2537609000,"latestFiling":2520536000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第20期(2025/04/01－2026/03/31)、docID S100ZAX7）を有効文書としてこのパックを作った。原本は docID S100Z5HJ。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 訂正有価証券報告書－第19期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第18期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第17期(2022/04/01－2023/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第16期(2021/04/01－2022/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第15期(2020/04/01－2021/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
bluememe: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社BlueMeme」が EDINET の提出者名「株式会社ＢｌｕｅＭｅｍｅ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 当期の訂正有価証券報告書（S100ZAX7）はrecord-only分類であり、原本（S100Z5HJ）と主要財務・本文は同一で、違うのは表紙の項目だけであるため、出典は訂正報告書の値（タイトル・URL・提出日2026年10月30日）で引用し、訂正そのものはneedsReviewに入れなかった。
- businessModel: 第16期から第19期の数値が前期有報と異なるのは誤謬の訂正によるものであることは、指標表の注記2で会社自身が説明している。本文の説明として、2020年３月期に端を発する不正な財務報告が判明し過年度から遡及して訂正した旨がMD&Aに、特別調査委員会による調査対象（2020年３月30日締結のソフトウェアライセンス契約に関する売上の計上時期及び会計処理、並びにこれに伴う仕入取引の会計処理）が【重要な後発事象】に記載されている。訂正後の数値を登録し、financialNotesに注記2を2026年3月期の注記として記録した。過年度決算訂正関連費用は翌期に特別損失として計上される予定とされているが、金額は書かなかった。
- businessModel: 第15期から第19期の有報に対する訂正有価証券報告書が2026年９月30日に提出されており、上記の誤謬の訂正に対応するものと判断した。
- businessModel: 2025年12月に端を発する長期大型プロジェクトの品質管理の問題に対応した受注損失引当金が計上されている旨がMD&Aに記載されているが、金額・理由は本文に書かなかった。受注高・受注残高の金額も書かなかった。
- businessModel: 経営方針の目標指標（2027年３月期の売上高・営業利益の数値目標）は投資・利益指標の目標であるため、本文とperspectivesには書かず、戦略は定性的に記述した。
- businessModel: 指標表の注記3（第19期の潜在株式調整後指標を記載していない理由）と注記4（第19期の自己資本利益率・株価収益率を記載していない理由）は表示事項のためwarningsのみとした。
- businessModel: wikipedia.jsonは found: false のため使用しなかった。
- businessStructure: 当社グループはDX事業の単一セグメントであり、セグメント情報の記載は省略されている。事業の内訳は収益認識注記の分解情報（プロフェッショナルサービス2,717,224千円＝受託開発2,677,044千円＋トレーニング40,180千円、ソフトウェアライセンス販売581,615千円、その他36千円）によった。その他36千円は100万円未満のため金額を本文に書かず、区分も作らなかった。区分合計と売上高3,298,875千円は千円単位で一致する。
- businessStructure: グループは当社と連結子会社4社（株式会社OPENMODELS＝プラットフォーム事業、株式会社BlueMeme Partners＝投資事業、マイクロコート株式会社＝福岡拠点のDX事業、株式会社アルターデザインコンサルティング＝AI活用コンサルティング）の計5社で構成されるが、事業区分は単一セグメントの開示に従い子会社単位では分けなかった。
- businessStructure: 設備は提出会社の東京本社と福岡オフィスのみが印字され、単一セグメントのため事業への対応付けは行われていない。本社を事業全体の拠点として扱い、帳簿価額は書かなかった。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。同社グループはOutSystemsジャパン株式会社との販売代理店契約（2019年３月締結）をはじめ、海外ソフトウェアベンダーの製品を販売する立場であり、仕入先の事実は本fragmentのwarningsに記録した。
- businessStructure: 期間後の持株会社体制への移行（吸収分割の効力発生日2027年１月１日予定）と、それに先立つ監査等委員会設置会社への移行（2026年６月26日実施）は【重要な後発事象】の記載による。登録は2026年３月31日現在のグループ構成で行い、持株会社化はneedsReviewに入れた。監査等委員会設置会社への移行はガバナンス形態の変更であり、グループ構成の変更ではないためwarningsのみとした。
- history: 沿革表は年月と事象が同じ行に印字されており、行順の対応づけは不要だった。
- history: 本社移転（2010年・2012年・2019年）、代表取締役の就任（2010年）、オフィス開設（福岡2014年・横浜2017年・沖縄2019年・熊本2023年）、熊本県及び熊本市との立地協定（2023年）、販売代理店契約（MarkLogic社2018年・Workato社2020年・Cognite社2021年・mabl社及びCreatio社2022年・GenRocket社2022年）、提携・共同研究（Omnext社2018年、ケンブリッジ・テクノロジー・パートナーズ2020年、京都大学2022年、九州大学2023年）、AGILE-SDKの提供開始（2018年）、技術トレーニングの提供開始（2014年）、AGILE-DXプラットフォームの販売開始（2022年）、OpenModelsによるCreatio国内独占代理店契約（2023年）、デジタルレイバーのサービス提供開始（2024年）は、個別の出来事として沿革に含めず省略した。
- history: 資本金の金額は沿革に書かない規則のため、設立時等の資本金は記載していない。
- industry: 主たる業界は it とした。同社はローコード開発プラットフォームを活用した業務システムの受託開発とソフトウェア販売を行う会社であり、直接当てはまる。
- industry: human-resources は付けなかった。連結子会社のマイクロコートはエンジニア派遣も行うが、単一セグメントであり独立した金額の開示がなく、人材サービスを独立事業として開示していない。
- industry: finance は付けなかった。連結子会社のBlueMeme Partnersと投資事業有限責任組合は投資事業を行うが、単一セグメント（DX事業）の中にあり、独立した金額の開示がない。
- industry: DEIの別記事業は cte である。
- relatedCompanies: base-4481: 「データベース」等の一般語の部分一致のみで、取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: en: 「エンジニア」等の部分一致で曖昧であり、関係の記載がないため結ばなかった。
- relatedCompanies: system-integrator: 「システムインテグレーター」は一般名詞としての記載のみで、同社との関係の記載はないため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」等の部分一致で曖昧であり、関係の記載がないため結ばなかった。
- relatedCompanies: ray: 「デジタルレイバー」等の部分一致で曖昧であり、関係の記載がないため結ばなかった。
- relatedCompanies: zero: 「ゼロから」等の一般表現の部分一致で曖昧であり、関係の記載がないため結ばなかった。
- relatedCompanies: lec: 「フレックス」等の部分一致のみで、関係の記載がないため結ばなかった。
- relatedCompanies: core: 「コア・コンピテンシー」等の部分一致で曖昧であり、関係の記載がないため結ばなかった。
- relatedCompanies: mitsui-and-co: 印字は「その他の関係会社の親会社」としての記載のみで、同社自身との取引・提携は述べられていないため結ばなかった。なお、その他の関係会社である三井情報株式会社とは資本業務提携契約と営業上の取引があるが、同社は related-candidates.json に含まれないため結べなかった。
- relatedCompanies: port: 「サポート」等の部分一致のみで、関係の記載がないため結ばなかった。
- relatedCompanies: trust: 現在のコードリストにない相手であり、関係の記載もないため結ばなかった。
- relatedCompanies: arata: 「新たな」等の一般語の部分一致のみで、関係の記載がないため結ばなかった。
- relatedCompanies: idea-consultants: 一般語の部分一致のみで、関係の記載がないため結ばなかった。
- relatedCompanies: kohsoku: 「高速」等の部分一致で曖昧であり、関係の記載がないため結ばなかった。
- relatedCompanies: land: 「ブランド」等の部分一致のみで、関係の記載がないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: TDI株式会社（旧商号：情報技術開発株式会社）は【関係会社の状況】で「その他の関係会社」とされ、議決権の23.61％を保有され、2025年４月24日に資本業務提携契約を締結し営業上の取引があるが、related-candidates.json に含まれない。OutSystemsジャパン株式会社とは販売代理店契約があるが候補に含まれない。自社の連結子会社４社と投資事業有限責任組合は結ばない。
- terms: 用語の助言：「ローコード」（手作業のプログラミングを自動化する技術を活用した開発手法）、「AGILE-DX」（同社独自のローコード型アジャイル開発方法論）、「デジタルレイバー」（AI等を活用した労働力の代替・補完の仕組み）、「レガシーシステムのオープン化」（旧来技術の基幹システムを標準的な技術基盤へ移行・刷新すること）、「スクラッチ開発」（既存の土台を使わずゼロから手作業で作り上げる開発）は、この会社の説明に繰り返し現れる中心用語である。

## 要確認（status に反映）

- businessModel: 2021年４月23日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第16期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessModel: 2026年５月28日の取締役会で会社分割の方法による純粋持株会社体制への移行を決議し、準備会社として完全子会社の株式会社ローコードを設立しています。吸収分割の効力発生日は2027年１月１日（予定）とされており、登録は2026年３月31日現在のグループ構成で行っています。期間後の持株会社体制への移行の反映には人の確認が必要です。
- businessStructure: 2021年４月23日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第16期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2026年５月28日の取締役会で会社分割の方法による純粋持株会社体制への移行を決議し、準備会社として完全子会社の株式会社ローコードを設立しています。吸収分割の効力発生日は2027年１月１日（予定）とされており、登録は2026年３月31日現在のグループ構成で行っています。期間後の持株会社体制への移行の反映には人の確認が必要です。
- history: 2021年４月23日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第16期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- history: 2026年５月28日の取締役会で会社分割の方法による純粋持株会社体制への移行を決議し、準備会社として完全子会社の株式会社ローコードを設立しています。吸収分割の効力発生日は2027年１月１日（予定）とされており、登録は2026年３月31日現在のグループ構成で行っています。期間後の持株会社体制への移行の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
