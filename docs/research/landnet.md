# ランドネット — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ランドネット |
| 証券コード | 2991 |
| docID（データを取り出した文書） | `S100ZAV4` |
| 原本 docID | `S100Z9OL` |
| 提出日（原本） | 2026-10-23 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | S100ZAV4／有効文書 S100ZAV4（2026-11-16 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100ZAV4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ランドネット / 2991 / docID S100Z9OL（S100WWX1 から新しい有報に更新。旧成果物は pipeline/analysis/superseded/landnet-S100WWX1/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z9OL） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 5 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
landnet: 10 件の数値を有報XBRLと照合
有報: 株式会社ランドネット 訂正有価証券報告書－第27期(2025/08/01－2026/07/31) (docID S100ZAV4)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-07-31","previousFiling":51870742000,"latestFiling":51870000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-07-31","previousFiling":63647613000,"latestFiling":63647000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-07-31","previousFiling":77790938000,"latestFiling":77790000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-07-31","previousFiling":95992728000,"latestFiling":95992000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-07-31","previousFiling":955680000,"latestFiling":955000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-07-31","previousFiling":988060000,"latestFiling":988000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-07-31","previousFiling":1840334000,"latestFiling":1840000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-07-31","previousFiling":2384052000,"latestFiling":2384000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-07-31","previousFiling":1388560000,"latestFiling":1388000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-07-31","previousFiling":1362107000,"latestFiling":1362000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-07-31","previousFiling":2518901000,"latestFiling":2518000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-07-31","previousFiling":3311397000,"latestFiling":3311000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-07-31","previousFiling":15400618000,"latestFiling":15400000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-07-31","previousFiling":19959480000,"latestFiling":19959000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-07-31","previousFiling":27156024000,"latestFiling":27156000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-07-31","previousFiling":35386392000,"latestFiling":35386000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-07-31","previousFiling":6224311000,"latestFiling":6224000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-07-31","previousFiling":7132380000,"latestFiling":7132000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-07-31","previousFiling":8877647000,"latestFiling":8877000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-07-31","previousFiling":11085182000,"latestFiling":11085000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第27期(2025/08/01－2026/07/31)、docID S100ZAV4）を有効文書としてこのパックを作った。原本は docID S100Z9OL。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
landnet: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 「中期経営計画」には数値目標の記載があるが、本文の財務数値は売上高と当期純利益のみとする規則に従い、計画の数値は本文に記載せず施策の要約のみとした。
- businessModel: 連結経営指標等の表示単位変更（第27期より百万円単位、第26期以前も組替）と、それに伴う前期有報の円単位の値との丸め差異は、表示方法の変更のみで指標の内容に影響しないため、businessStructure側の警告に記録し、financialNotesは空とした。
- businessModel: セグメント利益や営業利益などの数値は規則により本文に記載していない。MD&Aの販売先属性別の構成比率（不動産業者43％、個人46％、法人11％）と取引件数は、財務金額ではないため顧客・業界の説明に用いた。
- businessModel: 当社は経営上の目標の達成状況を判断する客観的な指標として、金融コストが加味された利益指標である経常利益を位置づけている（経営方針に印字）。本文の財務数値は売上高と当期純利益のみとする規則のため、この指標名は本文に書かずここに記録した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（不動産売買事業108,513百万円、不動産賃貸管理事業1,440百万円）とした。セグメント利益は規則により記載していない。
- businessStructure: 有効文書は訂正有価証券報告書S100ZAV4（原本S100Z9OL、2026-10-30提出）である。証拠パックの照合では財務数値・本文とも原本と差異がなく、相違は表紙の項目のみであったためrecord-onlyとしてwarningsに記録した。フラグメントの出典は訂正有報の標題・URL・提出日に合わせている。
- businessStructure: 連結経営指標等は第27期より百万円単位で記載することに変更され（経営指標等の注３）、第26期以前も百万円単位に組み替えられている。表示単位の変更のみで5年指標の内容に影響しないためwarningsに記録し、financialNotesは空とした。前期有報の円単位の値との差異はこの組替えに伴う百万円単位への丸めであり、登録は当期有報の値を用いている。
- businessStructure: 買取販売・買取リフォーム販売と仲介は金額が独立開示されていないため、子事業の説明には金額を書かず、MD&Aに印字された取引件数を用いた。
- businessStructure: 当社グループは当社と連結子会社３社（株式会社ランドインシュア、日昇房屋有限公司、日商朗透房屋股份有限公司）の計４社で構成される。本店は東京都豊島区南池袋で、渋谷・横浜・大阪・福岡に支店がある。
- history: 沿革は有報の沿革表の全30行を転記した。1999年９月の設立行にある資本金額は、規則により本文に記載していない。
- history: 2013年７月の台湾現地法人設立行は、有報の表記（朗透地産有限公司）と現連結子会社名（日昇房屋有限公司）の関係を、2015年10月の商号変更行と合わせて読み取れるよう説明に補った。
- industry: 主たる業界は real-estate とした。中古不動産の買取販売、不動産賃貸管理、家賃保証はいずれも不動産事業であり、報告セグメント２事業はともに不動産に関連する。
- industry: 不動産投資クラウドファンディング「LSEEDクラファン」は不動産特定共同事業法に基づく不動産事業の一環であり、独立した金融事業として金額が開示されていないため、finance の副次分類は付けていない。
- industry: 地域別の売上高は本邦が90％を超えるため有報で開示が省略されている。台湾・香港子会社は海外投資家への日本の不動産の紹介が役割であり、海外事業として独立したセグメント開示はない。
- relatedCompanies: land（株式会社ランド）はリンクしていない。理由: 「ランド」の一致は、当社の連結子会社「株式会社ランドインシュア」や当社名「ランドネット」への部分一致であり、株式会社ランドとの取引・提携・資本関係の印字がないため。
- relatedCompanies: base-4481 はリンクしていない。理由: 「ベース」の一致は、当社グループが活用する「データベース」への部分一致であり、ベース株式会社との関係の印字がないため。
- relatedCompanies: port はリンクしていない。理由: 「ポート」の一致は「サポート体制」等の語への部分一致であり、ポート株式会社との関係の印字がないため。
- relatedCompanies: ray はリンクしていない。理由: 「レイ」の一致は不動産流通機構「レインズ」への一致であり、株式会社レイとの関係の印字がないため。
- relatedCompanies: seki はリンクしていない。理由: 社名の一致は曖昧で、本文の出現は研修等の一般的な文脈であり、セキ株式会社との取引・提携の印字がないため。
- relatedCompanies: nissin はリンクしていない。理由: コードリストになく検証できない相手であり、本文の出現も新株予約権等の一般的な文脈で、株式会社日新との関係の印字がないため。
- relatedCompanies: en はリンクしていない。理由: 「エン」の一致は「システムエンジニア」への部分一致であり、エン株式会社との関係の印字がないため。
- relatedCompanies: lec はリンクしていない。理由: 「レック」の一致は「フレックスタイム制」への部分一致であり、レック株式会社との関係の印字がないため。
- relatedCompanies: no-1 はリンクしていない。理由: 「No.1」の一致は経営方針の「不動産流通業を革新するNo.1企業になる」という標語への一致であり、株式会社No．1との関係の印字がないため。
- relatedCompanies: anshin-guarantor-service はリンクしていない。理由: 「あんしん保証」の一致は当社グループ自身のサービス名「あんしん保証サービス」への一致であり、あんしん保証株式会社との取引・提携の印字がないため。当社の家賃保証は連結子会社の株式会社ランドインシュアが行っている。
- relatedCompanies: cover はリンクしていない。理由: 「カバー」の一致は「カバーされにくい」という動詞の用法であり、カバー株式会社との関係の印字がないため。
- relatedCompanies: s-t はリンクしていない。理由: 「エステー」の一致は自社システムRCPの英字表記「Real estate Cloud Platform」への部分一致であり、エステー株式会社との関係の印字がないため。
- relatedCompanies: 大株主の株式会社ブレインネット（37.68％）は代表取締役社長榮章博の資産管理会社で非上場であり、百科事典のエントリがないためリンクしていない。その他の大株主は個人、信託口、従業員持株会であり、上場事業会社はいない。特定投資株式の開示はなく、重要な契約等は金融機関との金銭消費貸借契約（借入先は都市銀行とだけ印字され社名なし）であり資金調達の関係のみである。
- relatedCompanies: 関係会社の状況に記載があるのは連結子会社３社（株式会社ランドインシュア、日昇房屋有限公司、日商朗透房屋股份有限公司）のみで、いずれも当社グループの会社であるため関連企業リンクの対象ではない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として３件を提案した。いずれも有報本文に現れる当社の事業に関わる語である。

## 要確認（status に反映）

- businessStructure: 普通株式について、2022年６月１日付、2022年12月１日付、2024年11月１日付及び2025年11月１日付で、それぞれ１株につき２株の割合の株式分割を実施した。株式数に関する経営指標は、第23期（2022年７月期）の期首に当該株式分割が行われたと仮定して算定されている。登録は2026年７月31日現在の構成と数値に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
