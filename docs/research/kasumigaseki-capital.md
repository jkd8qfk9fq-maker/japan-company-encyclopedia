# 霞ヶ関キャピタル — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 霞ヶ関キャピタル株式会社 |
| 証券コード | 3498 |
| docID（データを取り出した文書） | `S100XIGX` |
| 原本 docID | `S100X6TA` |
| 提出日（原本） | 2025-11-26 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | S100XIGX／有効文書 S100XIGX（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XIGX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 霞ヶ関キャピタル株式会社 / 3498 / docID S100X6TA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kasumigaseki-capital: 10 件の数値を有報XBRLと照合
有報: 霞ヶ関キャピタル株式会社 訂正有価証券報告書－第14期(2024/09/01－2025/08/31) (docID S100XIGX)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-08-31","previousFiling":14295921000,"latestFiling":14295000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-08-31","previousFiling":20780698000,"latestFiling":20780000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-08-31","previousFiling":37282535000,"latestFiling":37282000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-08-31","previousFiling":65685513000,"latestFiling":65685000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-08-31","previousFiling":793532000,"latestFiling":793000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-08-31","previousFiling":1018434000,"latestFiling":1018000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-08-31","previousFiling":2050691000,"latestFiling":2050000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-08-31","previousFiling":5020003000,"latestFiling":5020000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-08-31","previousFiling":1037185000,"latestFiling":1037000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-08-31","previousFiling":1732563000,"latestFiling":1732000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-08-31","previousFiling":4119308000,"latestFiling":4119000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-08-31","previousFiling":7860025000,"latestFiling":7860000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-08-31","previousFiling":15040124000,"latestFiling":15040000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-08-31","previousFiling":30437272000,"latestFiling":30437000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-08-31","previousFiling":43780204000,"latestFiling":43780000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-08-31","previousFiling":77549096000,"latestFiling":77549000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-08-31","previousFiling":4906124000,"latestFiling":4906000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-08-31","previousFiling":9360042000,"latestFiling":9360000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-08-31","previousFiling":11681158000,"latestFiling":11681000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-08-31","previousFiling":27739576000,"latestFiling":27739000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第14期(2024/09/01－2025/08/31)、docID S100XIGX）を有効文書としてこのパックを作った。原本は docID S100X6TA。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kasumigaseki-capital: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表示単位は第14期（2025年8月期）より千円単位から百万円単位に変更され、第13期以前についても百万円単位に組み替えて表示されている。表示単位のみの変更のため、financialNotesには入れず本warningsに記録した。
- businessModel: 前期有報との修正再表示チェックで売上高や当期純利益等に差異が表示されたが、いずれも前期有報における円単位の実額と当期有報の百万円単位表示との端数差であり、実質的な数値の修正ではない。登録は当期有報の数値に基づく。
- businessModel: 収益の分解情報について、当連結会計年度より「顧客との契約から生じる収益」の内訳「その他」に金融商品に係る取引を含めない表示方法に変更され、前連結会計年度の注記が組み替えられている。表示方法の変更のみのため、financialNotesには入れず本warningsに記録した。
- businessModel: MD&Aには営業利益や経常利益の金額も印字されているが、本文の数値は売上高と当期純利益に限る規則のため記載していない。
- businessStructure: 有効文書は訂正有価証券報告書（docID S100XIGX、2026年1月30日提出）である。原本（docID S100X6TA）との照合では財務数値・本文に差異はなく、相違は役員の状況のテキストブロックのみで本登録が引用する節ではないため、分類はrecord-onlyとし、検証結果は本warningsに記録した。
- businessStructure: 初回の自律実行で、期末（2025年8月31日）から14か月以上が経過し新しい有価証券報告書がないことを理由とする保留が発生した。ackに先立ちEDINETで提出者（EDINETコードE34289）の文書を確認したところ、第15期の有価証券報告書は提出期限（2026年11月30日）前であり未提出は通常の時期にあたること、商号変更や公開買付に関する文書がないこと、半期報告書（2026年4月13日提出）、臨時報告書（2026年6月15日提出）、発行登録追補書類（2026年10月1日提出）等が継続して提出されていることを確認した。登録に影響する事項はないと判断してackをおこなった。
- businessStructure: 当社は不動産コンサルティング事業の単一セグメントであり、セグメント情報の記載が省略されているため、事業は1本とした。売上高の内訳は収益認識関係の「顧客との契約から生じる収益を分解した情報」に基づく。4つの事業分野については分野別の金額の開示がないため、子事業には金額を記載していない。
- businessStructure: 連結子会社は42社で、関係会社の状況に名称が記載されているのはfav hospitality group株式会社、霞ヶ関アセットマネジメント株式会社、ロジフラッグ・デベロプメント株式会社、KME INVESTMENT & MANAGEMENT L.L.Cの4社のみであり、残る38社は記載が省略されている（うち特定子会社はSK特定目的会社）。持分法を適用した関連会社は0社である。子会社の資本金の額は本文には記載していない。
- businessStructure: fav hospitality group株式会社は2025年7月1日付でミッドインホテル株式会社を吸収合併しており、期末現在の構成に反映済みのためneedsReviewには入れず本warningsに記録した。また、当連結会計年度に反田海運株式会社の株式を取得し、連結の範囲に含めている。
- businessStructure: fav hospitality group株式会社については、売上高（連結会社相互間の内部売上高を除く。）の連結売上高に占める割合が10％を超えている旨が関係会社の状況に注記されている。同社の個別の金額は、本文の数値を売上高と当期純利益に限る規則のため記載していない。
- businessStructure: 物流事業のマレーシアにおける始動と海外事業のドバイにおける自社主導開発の始動はいずれも2025年9月で期末後であるが、事業の内容に現況として記載されているため、開始時期を明記したうえで子事業の説明に含めた。期末現在の事業構成（ホテル・物流・ヘルスケア・海外の4分野）自体に変更はない。
- history: 沿革は有価証券報告書の沿革表の全行を転記した。2025年7月1日付のfav hospitality group株式会社によるミッドインホテル株式会社の吸収合併は沿革表に記載がないため、businessStructureのwarningsに記録した。
- industry: 当社は不動産コンサルティング事業の単一セグメントであり、東証業種も不動産業のため、主分類はreal-estateのみとした。第二種金融商品取引業及び投資助言・代理業の登録を受け、ファンド組成やアセットマネジメントをおこなっているが、金融事業として切り分けた金額の開示がないため、financeの副次分類は付けていない。
- relatedCompanies: 霞ヶ関ホテルリート投資法人: 当社がスポンサーを務め、連結子会社の霞ヶ関リートアドバイザーズ株式会社が資産運用を受託する投資法人だが、株式会社ではなく百科事典の会社エントリが存在しないため結ばない。役割はbusinessStructure及びbusinessModelのindustryPositionに記録した。
- relatedCompanies: 合同会社銀座８ホテルプロジェクト: 2025年8月期の主要な顧客（売上高10,157百万円）だが、ホテル開発の特別目的会社で上場会社ではなく、エントリが存在しないため結ばない。役割はbusinessModelのindustryPositionに記録した。
- relatedCompanies: 大株主の状況には個人株主と信託銀行（信託口）・証券会社の保管口座のみが掲載され、事業会社の掲載はない。また、株式の保有状況において特定投資株式は「該当銘柄はありません」とされており、政策保有による関連付けの根拠もない。
- relatedCompanies: 日新（9066）: 社名は新株予約権の記載中の文字列への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- relatedCompanies: ランド（8918）: 社名はホテルブランド等の記述中の文字列への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- relatedCompanies: 山大（7426）: 社名は役員の氏名中の漢字への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- relatedCompanies: ポート（7047）: 社名は「サポート」等の一般語への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- relatedCompanies: フリー（4478）: 社名は「リスクフリー」等の一般語への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- relatedCompanies: レック（7874）: 社名は「フレックス」等の一般語への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- relatedCompanies: セキ（7857）: 社名は「セキュリティ」等の一般語への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- relatedCompanies: トラスト（3347）: 社名は大株主の状況における信託口の表記への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- relatedCompanies: ゼロ（9028）: 社名は「価値はゼロである」等の記述への部分一致による機械抽出であり、当社との取引・提携・資本関係の記載がないため結ばない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessStructure: 2025年9月1日付で、普通株式1株につき2株の割合で株式分割を実施した（2025年7月3日取締役会決議、基準日2025年8月31日）。発行済株式総数は9,905,629株から19,811,258株となった。主要な経営指標等の株式数に関する指標は、第10期（2021年8月期）の期首に当該分割が行われたと仮定して算定されている。登録は2025年8月31日現在の構成に基づく。
- businessStructure: 重要な後発事象として、2025年10月24日の取締役会決議による新株式発行が記載されている。公募による新株式発行4,000,000株については2025年11月12日に払込を受けており、第三者割当による新株式発行691,500株の払込期日は2025年12月10日である。いずれも2025年8月期の数値には反映されておらず、登録は2025年8月31日現在の構成に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
