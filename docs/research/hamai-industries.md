# ハマイ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ハマイ |
| 証券コード | 6497 |
| docID（データを取り出した文書） | `S100Z20X` |
| 原本 docID | `S100XUXN` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100Z20X／有効文書 S100Z20X（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z20X.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ハマイ / 6497 / docID S100XUXN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hamai-industries: 10 件の数値を有報XBRLと照合
有報: 株式会社ハマイ 訂正有価証券報告書－第94期(2025/01/01－2025/12/31) (docID S100Z20X)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-12-31","previousFiling":433468000,"latestFiling":353078000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-12-31","previousFiling":949226000,"latestFiling":885921000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-12-31","previousFiling":909253000,"latestFiling":836828000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":396769000,"latestFiling":513819000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":583064000,"latestFiling":497461000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":1241492000,"latestFiling":1179891000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":1141455000,"latestFiling":1120982000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":1205993000,"latestFiling":1326707000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":18315139000,"latestFiling":17821528000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":19788749000,"latestFiling":19242320000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":21098197000,"latestFiling":20451857000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":21646381000,"latestFiling":21110361000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":13680035000,"latestFiling":13205491000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":14289305000,"latestFiling":13756965000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":15635827000,"latestFiling":15032855000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":16057323000,"latestFiling":15576245000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第94期(2025/01/01－2025/12/31)、docID S100Z20X）を有効文書としてこのパックを作った。原本は docID S100XUXN。原本との主要財務の差異: S100Z20X（20件） — amendments.records[].comparedToBase を見ること
注意: 訂正有報の分類: financial-change — 数値が原本と異なる（主要財務 20 件／その他の数値 388 件: AccountsPayableOther・AccumulatedDepreciationPPEByGroup・Assets・BasicEarningsLossPerShareSummaryOfBusinessResults・BeginningFinishedGoodsCOS・CapitalSurplus・ComprehensiveIncome・ComprehensiveIncomeAttributableToOwnersOfTheParent・ComprehensiveIncomeSummaryOfBusinessResults・CostOfMerchandiseAndFinishedGoodsSoldCOS・CostOfProductsManufactured・CostOfSales）。このパックの数値は有効文書のもの。原本の数値を出典にした記述が混ざっていないか確認すること
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hamai-industries: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書（S100Z20X、2026年９月14日提出）を有効文書として登録しています。原本（S100XUXN）との比較で主要な経営指標等の数値が20件、その他の数値が388件変わる financial-change の訂正であり、2021年12月期から2024年12月期の親会社株主に帰属する当期純利益・総資産額・純資産額も訂正されています。数値はすべて訂正後のもので、出典は訂正報告書に付けています。訂正の事実は2025年12月期の financialNotes に記録しました。
- businessModel: 主要な経営指標等の注記１（潜在株式調整後１株当たり当期純利益は潜在株式がないため記載していないこと）は表示事項のため、financialNotes には入れず警告のみとしました。注記２の収益認識基準の適用は2022年12月期の financialNotes に記録しました。
- businessModel: 「法人税、住民税及び事業税等に関する会計基準」等の当期首からの適用（子会社株式等の売却損益の繰延べに関する見直しは遡及適用）については、連結財務諸表への影響はないと印字されているため、financialNotes には入れず警告のみとしました。
- businessModel: 経営方針に印字された売上高営業利益率10％以上という目標や、総資産利益率（ＲＯＡ）・投下資本利益率（ＲＯＩＣ）の指標は、投資指標の目標にあたるため本文・perspectives には書いていません。MD&Aの利益額の増減や受注に関する金額も書いていません。
- businessModel: 2024年６月に公正取引委員会から独占禁止法に基づく排除措置命令および課徴金納付命令を受領したことと、取締役に対する損害賠償請求訴訟が提起されていることは【その他】に印字されていますが、期末時点の構成を変える事項ではないため警告のみとし、戦略の disclosed には再発防止の取組だけを書きました。前期の純利益との増減理由（独占禁止法関連の損失の反動）も本文には書いていません。
- businessModel: 主要な顧客である新日本ブラス株式会社は関連企業候補にありません（候補の株式会社ブラスとは別の法人です）。flow の customer 段に売上高の割合だけを書きました。
- businessModel: Wikipedia は見つからなかったため使っていません。
- businessStructure: このツリーの旧スキーマのため、suppliers キーは省略しました。有報に個別の仕入先名の印字はありません。
- businessStructure: 主要な設備の状況に印字された帳簿価額は書いていません。府中工場・大多喜工場はバルブ事業の生産設備、東京都品川区・府中市他・八王子市の賃貸不動産は不動産賃貸事業の賃貸設備として印字されています。本社はバルブ事業と不動産賃貸事業が連記されているため、どちらの事業にも結びつけていません。
- businessStructure: バルブ事業の children はセグメント注記の収益分解情報（外部顧客への売上高）の印字どおりに並べています。children の千円額の合計は12,137,864千円で、印字されたバルブ事業の外部顧客への売上高12,137,866千円と2千円異なりますが、印字の合計をそのまま使っています。
- businessStructure: 四国地区の代理店だった関連会社の四国ハマイ株式会社は、2023年１月31日付で当社が全事業を譲り受けたことが【事業の内容】に印字されています。期中の出来事ではないため history には入れず、ここに記録します。
- history: 沿革から落とした行: 1939年（合名会社への改組）、1943年（本社移転）、1962年（販売部門の分離独立）、1965年（株式の額面変更のための吸収合併）、1972年（店頭売買銘柄への登録）、1976年（本社工場の移設・閉鎖）、1984年（ミスヂ商事株式会社の吸収合併）、1986年（アコン株式会社の設立）、1988年（サーモバルブ株式会社の買収）、1991年（九州ハマイ株式会社の吸収合併）、1996年（SEAGATE CYLINDER CO,INCの設立）、2001年（株式会社ビジネス・リンクスの子会社化）、2005年（ＬＰバルブの生産累計２億個の達成）、2008年（株式会社ビジネス・リンクスの株式売却）、2009年（サーモバルブ株式会社の閉鎖）、2010年・2013年（取引所の統合等に伴う市場の呼称変更）、2015年（本社移転）、2017年（創業90周年）。子会社の設立・売却・閉鎖、市場呼称の変更、生産実績の節目などであり、会社の形を変えた主な出来事に絞りました。
- history: 1965年の吸収合併は株式の額面変更のためであり、資本金額は沿革に書いていません（沿革に資本金額を書かない規則）。
- industry: 主たる業界は「machinery」を直接付けました。売上高の95％以上を占めるバルブ事業は、ＬＰＧ容器用・高圧ガス容器用・配管用バルブという機械機器の製造販売であり、閉じた分類に直接当てはまります。
- industry: 不動産賃貸事業は報告セグメントとして外部顧客への売上高577百万円が独立して開示されているため、「real-estate」を２つ目に付けました。
- relatedCompanies: エア・ウォーター、株式会社星医療酸器、株式会社ＣＫサンエツ、デンヨー株式会社、日本ドライケミカル株式会社: 特定投資株式に載りますが、保有目的が全銘柄で同一の定型文（「円滑な取引関係等の維持、発展および業界動向等の情報収集のため保有しております。」）であり、個別の取引関係が印字されていないため結びませんでした。
- relatedCompanies: 岩谷産業株式会社: 特定投資株式の保有目的は上記と同一の定型文であり、さらに2025年12月期に保有目的を純投資目的に変更しているため結びませんでした。
- relatedCompanies: 株式会社ブラス: 有報の主要な顧客は新日本ブラス株式会社であり、候補の株式会社ブラスとは別の法人です。別人格を代用しないため結びませんでした。
- relatedCompanies: 株式会社光通信: 【大株主の状況】に印字されているのは光通信ＫＫ投資事業有限責任組合であり、候補の株式会社光通信とは別の人格のため結びませんでした。
- relatedCompanies: JFEホールディングス株式会社、株式会社高圧ガス工業、日本酸素ホールディングス株式会社、第一生命ホールディングス株式会社、株式会社三井住友フィナンシャルグループ、株式会社みずほフィナンシャルグループ、株式会社サーラコーポレーション: 保有目的を純投資目的に変更した銘柄の一覧（過年度分を含む）に載るだけであり、現在の取引・資本関係は印字されていないため結びませんでした。銀行・金融グループについては資金調達先でもあります。
- relatedCompanies: ベース株式会社、株式会社ビジョン、株式会社リコー: 一般語・部分一致（連結ベース、「ビジョン2030」、リスク文中の一般名詞）であり、相手についての取引・提携の印字がないため結びませんでした。
- relatedCompanies: 株式会社ハマイコリア（連結子会社）、北陸ハマイ株式会社・四国ハマイ株式会社（関連会社）は候補にない自社グループの会社であり、結んでいません。新日本ブラス株式会社（主要な顧客）も候補にありません。
- terms: 用語の助言のみです。対象となりうる用語は「バルブ」「ＬＰＧ容器用バルブ」「黄銅削り粉」「水素ガス容器用弁」などですが、本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
