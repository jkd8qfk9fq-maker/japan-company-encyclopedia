# 藤倉コンポジット — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 藤倉コンポジット株式会社 |
| 証券コード | 5121 |
| docID（データを取り出した文書） | `S100YJDM` |
| 原本 docID | `S100YJDM` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJDM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 藤倉コンポジット株式会社 / 5121 / docID S100YJDM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 26 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fujikura-composites: 10 件の数値を有報XBRLと照合
有報: 藤倉コンポジット株式会社 有価証券報告書－第147期(2025/04/01－2026/03/31) (docID S100YJDM)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":37190751000,"latestFiling":36444521000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":40687388000,"latestFiling":40691418000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":37785116000,"latestFiling":37669782000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":41325231000,"latestFiling":40611211000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":4062930000,"latestFiling":3929314000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":3947972000,"latestFiling":3934243000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":3252339000,"latestFiling":3232322000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":3888092000,"latestFiling":3735814000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":4778815000,"latestFiling":4644299000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":5144521000,"latestFiling":5125514000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":3898360000,"latestFiling":3873527000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":5050558000,"latestFiling":4855098000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fujikura-composites: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はMD&Aに印字された億単位の表記（402億3千8百万円、231億7千8百万円、128億2千2百万円、38億9千3百万円、39億8千7百万円など）をそのまま使った。セグメント注記の千円印字を継ぎ足した書き換えはしていない。
- businessModel: 前期有報との5年表の差異（売上高・純利益などの2022年3月期から2025年3月期）は、在外子会社の換算方法の変更の遡及適用という印字された理由によるため、financialNotesに各年度の注記として記録した。登録する数値は今期有報の数値である。
- businessModel: 経営方針に印字された売上高に関する比率や資本に関する比率などの目標数値は、比率・投資指標に当たるため perspectives の disclosed には転記せず、方針の内容のみを要約した。
- businessModel: 2025年7月のスタートアップ企業との資本業務提携は相手の社名が印字されていないため、relatedCompaniesには結ばず、strategyのdisclosedとここに記録した。研究開発の記載ではセンサービジネスの事業化に向けたIoTスタートアップとの資本業務提携とされている。
- businessModel: 2026年4月1日付の先進技術戦略室内の新事業開拓部の設置は【研究開発活動】に印字された期後の組織の予定・設置の記載で、重要な後発事象には掲げられていないため needsReviewには入れずここに記録した。
- businessModel: 重要な後発事象の加須工場閉鎖は needsReview に入れた（本文の needsReview を参照）。
- businessModel: 変則決算・決算期変更はなく irregularPeriods は空、fiscalYearChange は null のため、機械生成の変則決算の確認事項は発生していない。
- businessStructure: 報告セグメントは4つ（産業用資材、スポーツ用品、引布加工品、その他）で、子区分はセグメント情報の外部顧客への売上高の大きい順（産業用資材23,178,035千円、スポーツ用品12,822,094千円、引布加工品3,893,092千円、その他345,586千円）に並べた。金額はMD&Aに印字された億単位の表記（231億7千8百万円など）をそのまま使った。
- businessStructure: MD&Aのセグメント別金額のうちその他は外部顧客への売上高と同額の3億4千5百万円であり、内部売上高を含む合計額は使っていない。
- businessStructure: 連結子会社7社の個別記載（株式会社キャラバン、藤栄運輸株式会社、Fujikura Composite America,Inc.、杭州藤倉橡膠有限公司、FUJIKURA COMPOSITES HAIPHONG,INC.、IER Fujikura,Inc.、安吉藤倉橡膠有限公司）は【関係会社の状況】による。グループ会社は relatedCompanies に含めていない。FUJIKURA GRAPHICS,INC.は清算により連結の範囲から除外された旨が注記されている。
- history: 【沿革】は年月と事象が対応する通常形式であり、年だけを採用し月は落とした。
- history: 創立時や子会社化の資本金額は history に書かない規則により転記していない。
- history: 工場・営業所の開設や閉鎖のうち主要な転機でない行（五反田工場の開設・閉鎖、大阪営業所、名古屋営業所、勝田営業所の開設など）は省略した。2026年3月の勝田営業所閉鎖は期中の営業所閉鎖で、期末現在の体制に反映されているため history の主要行には入れずここに記録した。
- history: 2022年の有限会社テクノロジーサービスの子会社化は、事業内容や金額の印字が沿革行のみで限られるため主要行には入れなかった。
- industry: 主たる業界は chemicals（化学）を暫定とした。最大の報告セグメントである産業用資材はゴム部品やゴム引布を基材とする製品であり、用途である自動車や住宅設備は業界ではないため automotive は付けなかった。
- industry: スポーツ用品は報告セグメントとして独立に開示されているが、用品メーカーを表す業界値がないため2つ目の業界は付けず、taxonomyGapsに記録した内容に含めた。
- relatedCompanies: 結んだ2社は【大株主の状況】（2026年3月31日現在）に事業会社として載り、持株比率が印字された相手に限った。信託銀行などの純投資の株主は結んでいない。
- relatedCompanies: fujikura（株式会社フジクラ）: 大株主として結んだ。当社が保有する特定投資株式としての同社株式の保有目的は「関係の維持・強化」という定型の記載のみのため、その記載だけでは結んでいない。
- relatedCompanies: fujikura-kasei（藤倉化成株式会社）: 大株主として結んだ。当社が保有する特定投資株式としての同社株式の保有目的も定型の記載のみのため、その記載だけでは結んでいない。
- relatedCompanies: aisan-industry（愛三工業株式会社）: 特定投資株式の保有目的が「産業用資材における営業取引関係の維持・強化」という定型の記載のみで、主要な顧客ごとの情報にも載らず、取引の具体的な記載がないため結ばなかった。
- relatedCompanies: ntt（NTT株式会社）: related-candidatesには含まれていないが、特定投資株式に同名の記載がある。候補にないため結ばずここに記録した。保有目的は「産業用資材における営業取引関係の維持・強化」という定型の記載のみである。
- relatedCompanies: nikki（株式会社ニッキ）: 特定投資株式の保有目的が「産業用資材における営業取引関係の維持・強化」という定型の記載のみで、保有株式数も3,530株と少なく、具体的な取引の記載がないため結ばなかった。
- relatedCompanies: denyo（デンヨー株式会社）: 特定投資株式の保有目的が定型の記載のみで、保有株式数も1,000株と少なく、具体的な取引の記載がないため結ばなかった。
- relatedCompanies: asahi-rubber（株式会社朝日ラバー）: 特定投資株式の保有目的が「引布加工品における営業取引関係の維持・強化」という定型の記載のみで、保有株式数も2,000株と少なく、具体的な取引の記載がないため結ばなかった。
- relatedCompanies: okamoto-industries（オカモト株式会社）: 特定投資株式の保有目的が「関係の維持・強化」という定型の記載のみで、保有株式数も800株と少なく、具体的な取引の記載がないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）、mitsubishi-ufj-financial-group、resona-holdings、mebuki-financial-group、sumitomo-mitsui-trust-group、the-musashino-bank（武蔵野銀行）: 特定投資株式の保有目的が財務等に係る金融取引関係の維持・強化のみで、資金調達・金融取引の文脈のため結ばなかった。三井住友トラストグループについては子会社である三井住友信託銀行が当社株式を保有する旨の注記があるが、金融機関の純投資・金融取引のため結んでいない。
- relatedCompanies: ms-and-ad-insurance-group-holdings: 特定投資株式の保有目的が財務等に係る金融取引関係の維持・強化のみで、保険・金融取引の文脈のため結ばなかった。
- relatedCompanies: en（エン株式会社）: 「エンジニアリングセンター」など一般語への部分一致（ambiguous）で、関係の記載がないため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア開発支援」という一般語への一致で、関係の記載がないため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション創出」という一般語への一致で、関係の記載がないため結ばなかった。
- relatedCompanies: land（株式会社ランド）: ブランド名などへの部分一致で、関係の記載がないため結ばなかった。
- relatedCompanies: rix（リックス株式会社）: 「スキルマトリックス」などへの部分一致で、関係の記載がないため結ばなかった。
- relatedCompanies: aeon（イオン株式会社）: 「リチウムイオン」への部分一致で、関係の記載がないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「ベースとした数値」という一般語への一致で、関係の記載がないため結ばなかった。
- relatedCompanies: core（株式会社コア）: 一般語への部分一致（ambiguous）で、関係の記載がないため結ばなかった。
- relatedCompanies: ishin（イシン株式会社）: 一般語への部分一致で、関係の記載がないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「事業ポートフォリオ」という一般語への一致で、関係の記載がないため結ばなかった。
- relatedCompanies: freee（フリー株式会社）: 「フリー・キャッシュ・フロー」という一般語への一致で、関係の記載がないため結ばなかった。
- relatedCompanies: future（フューチャー株式会社）: 「GXフューチャー・コンソーシアム」という団体名への部分一致で、相手との取引・提携の記載がないため結ばなかった。
- relatedCompanies: no-1（株式会社No.1）: 「使用率No.1」という表現への一致で、関係の記載がないため結ばなかった。
- relatedCompanies: taya（株式会社田谷）: 「世田谷区」という地名への部分一致（ambiguous）で、関係の記載がないため結ばなかった。
- relatedCompanies: 藤倉航装株式会社は【大株主の状況】に2.61％の保有が印字されているが、related-candidates.jsonに含まれず本百科事典の掲載済み企業として確認できないため結ばずここに記録した。
- terms: 助言: 用語「ゴム引布」は、布にゴムを引いた防水布などの材料で、当社の創立以来の事業の基材です（【沿革】と【事業の内容】に印字）。
- terms: 助言: 用語「引布加工品」は、ゴム引布を使った各種加工品や救命用品などを含む報告セグメントの名称です（【セグメント情報等】に印字）。
- terms: 助言: 用語「空圧制御機器」は、産業用資材に含まれる製品で、空気の圧力を制御する機器を指します（【セグメント情報等】に印字）。
- terms: 助言: 用語「カーボンシャフト」は、炭素繊維を使用したゴルフクラブ用シャフトで、『SPEEDER』や『VENTUS』などのブランドで展開しています（【沿革】とMD&Aに印字）。

## 要確認（status に反映）

- businessModel: 重要な後発事象：2026年5月22日開催の取締役会において、加須工場を閉鎖し他の生産拠点へ集約することを決議しました。閉鎖予定日は2029年3月31日です。2026年3月31日現在の国内生産拠点は岩槻、原町、加須、小高の4拠点であり、閉鎖後は体制が変わるため確認が必要です。当連結会計年度の業績に与える影響は軽微とされています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 藤倉コンポジットの業界区分 → 提案: ゴム製品（rubber-products）。事業はゴムを基材とする産業用資材、ゴム引布の加工品、ゴルフ用カーボンシャフトなどの製造販売で、上場区分の業種もゴム製品であるため、現在の閉じた分類にはゴム製品を表す値がない。最も近い chemicals を暫定とした。
