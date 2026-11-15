# イシン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | イシン株式会社 |
| 証券コード | 143A |
| docID（データを取り出した文書） | `S100YHBL` |
| 原本 docID | `S100YHBL` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHBL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | イシン株式会社 / 143A / docID S100YHBL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ishin: 10 件の数値を有報XBRLと照合
有報: イシン株式会社 有価証券報告書－第21期(2025/04/01－2026/03/31) (docID S100YHBL)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":83772000,"latestFiling":83450000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":126279000,"latestFiling":126318000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":177571000,"latestFiling":177147000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":111047000,"latestFiling":94931000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":188302000,"latestFiling":190220000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":232773000,"latestFiling":211585000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":1613127000,"latestFiling":1596923000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":1999650000,"latestFiling":1996995000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":2201256000,"latestFiling":2177446000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":1174261000,"latestFiling":1158056000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":1486639000,"latestFiling":1483984000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":1682040000,"latestFiling":1658230000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第20期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第19期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
ishin: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円単位の印字を百万円未満切り捨てで表記しました（切り上げなし）。セグメント別売上高の切り捨て後の合計は1,427百万円となり、印字された売上高合計1,428百万円とは１百万円の差があります（切り捨てによる差異）。親会社株主に帰属する当期純利益は4,656千円の印字を切り捨てて4百万円と表記しました。
- businessModel: HR事業の売上高は、セグメント注記の外部顧客への売上高125,752千円（販売実績の表も同額）を用いました。MD&Aのセグメント別記述にある129,252千円はセグメント間の内部売上高3,500千円を含む金額のため、本文では用いていません。
- businessModel: 過年度決算の訂正について：第19期（2024年３月期）及び第20期（2025年３月期）の有価証券報告書の訂正報告書、内部統制報告書の訂正報告書並びに第20期半期報告書の訂正報告書が2025年11月14日に提出されたことが、本書の提出書類一覧に印字されています。主要な経営指標等の数値は訂正後の金額であり、前期の有報の印字と比べると、親会社株主に帰属する当期純利益は2023年３月期が83,772千円から83,450千円へ、2024年３月期が126,279千円から126,318千円へ、2025年３月期が177,571千円から177,147千円へ変更されており、経常利益、総資産、純資産にも差異があります。売上高と従業員数に差異はありません。2026年３月期のMD&Aには、特別損失23,048千円の主な内容が過年度決算訂正に係る費用である旨が印字されています。本登録は現行の数値を登録し、2025年3月期にfinancialNoteを付けました。
- businessModel: セグメント変更について：HR事業は2024年10月に開始され、2025年４月から新たな報告セグメントとして追加されました。あわせて、従来メディアPR事業に含めていたHIKOMA CLOUDはHR事業へ移管されており、前連結会計年度のセグメント情報は変更後の区分で印字されています。区分の変更のみで売上高合計の訂正ではないため、needsReviewにはせず沿革と本警告に記録しました。
- businessModel: 中期経営計画の数値目標（2030年３月期に売上高45.1億円、営業利益9.0億円、営業利益率20％）と、経営指標としている売上成長率・営業利益率は、本文・戦略には記載せず本警告にのみ記録しました。
- businessModel: Ishin Global Fund Ⅰ L.P.（ケイマン諸島）及びIshin Global Fund Ⅰ Limited（同）は連結子会社で、東南アジア・インドを中心とするベンチャーキャピタルファンドへの投資・運営を行いますが、報告セグメントには含まれていないため、businessStructureの事業には含めず、会社フローの記述と本警告に記録しました。ファンド事業はHR事業セグメントの記述でもセグメントに含まれない旨が印字されています。
- businessModel: 株式会社OK Junctionは関係会社の状況では主要な事業の内容が「その他事業」と印字されていますが、MD&Aのグローバルイノベーション事業の記述では同社の業績取り込みが同事業の増収要因として挙げられているため、businessStructureではグローバルイノベーション事業の記述の中で触れました。
- businessStructure: グループの構成（2026年３月31日現在）：連結子会社５社（Ishin USA, Inc.、Ishin Global Fund Ⅰ Limited、Ishin Global Fund Ⅰ L.P.、株式会社レプセル、株式会社OK Junction）と持分法適用関連会社１社（GMOベンチャー通信スタートアップ支援株式会社、議決権20.0％）です。Ishin Global Fund Ⅰ L.P.は出資比率2.0％ですが支配力基準により連結子会社とされています。ファンド２社は報告セグメントに含まれていません。
- businessStructure: 株式会社レプセルは2025年４月に全株式を取得して子会社化され、HR事業でRPOサービスを行っています。株式会社OK Junctionは2025年10月に全株式を取得して子会社化されました。
- businessStructure: セグメント別の従業員数（2026年３月31日現在）は公民共創事業27名、グローバルイノベーション事業８名、メディアPR事業11名、HR事業11名、全社（共通）33名、合計90名です。
- history: 沿革に印字された資本金の金額（設立時や増資時の資本金）は、本文に記載しない方針のため各行に含めていません。
- history: 2025年４月からHR事業が新たな報告セグメントとなり、HIKOMA CLOUDがメディアPR事業からHR事業へ移管されました（沿革ではなく事業の内容・セグメント情報の印字に基づく記録）。
- industry: 最大セグメントの公民共創事業（552百万円）とメディアPR事業（369百万円）は、いずれも『自治体通信』『ベンチャー通信』等のメディアとプラットフォームを中核とするため、主たる業界をメディアとしました。グローバルイノベーション事業（381百万円）は情報ポータルSaaSを含みますが研修・ソリューション・メディアを含む複合事業であり、HR事業（125百万円）は開始直後の小規模セグメントであるため、業界は追加していません。
- relatedCompanies: GMOベンチャー通信スタートアップ支援株式会社は当社の持分法適用関連会社（議決権の所有割合20.0％、ベンチャー企業支援）ですが、未上場でrelated-candidatesに含まれないためリンクせず、関係の事実はここに記録しました。共同出資相手のGMO VenturePartners株式会社も未上場です。
- relatedCompanies: 米Crunchbase, Inc.はBLITZ Portalのデータ提供に関するライセンス契約の相手方ですが、未上場でrelated-candidatesに含まれないためリンクせず、事実のみ記録しました。スタンフォード大学の講師陣はイノベーション人材研修プログラムの提供に関与していますが、会社ではなく候補にも含まれないためリンクしていません。
- relatedCompanies: 株式会社Enjinは2026年３月31日現在の大株主（所有株式数60,000株、割合3.10％）ですが、取引・提携の記載がなくrelated-candidatesにも含まれないためリンクしませんでした。株式会社Bright Stone（760,000株、39.32％）及び明石智義（432,200株、22.36％）も大株主ですが、前者は未上場で候補に含まれず、後者は個人のためリンクしていません。
- relatedCompanies: リンクしなかった候補と理由：innovation（「イノベーション」の一般語の一致のみ）、seki（「セキュリティ」の語の一致のみ）、en（「エンゲージメント」等の語の一致のみで、エン・ジャパン株式会社への言及なし）、port（「ポータル」「レポート」の語の一致のみ）、base-4481（「データベース」の語の一致のみ）、the-lead（「リード情報」「リード獲得」等の営業用語の一致のみ）、vision（経営方針中の一般語の一致のみ）、career（「キャリア」等の語の一致のみ）、rhythm（「アルゴリズム」の語の一致のみ）、kohsoku（「高速通信」等の語の一致のみ）、land（「ブランド」の語の一致のみ）、frontier（当社自身の雑誌『フロンティア（現ベンチャー通信）』の誌名であり、他社への言及ではない）、taya（個人の氏名の一致とみられ、会社としての言及は確認できない）、nissin（EDINETコードリストで検証できず、本文上の会社としての言及も確認できない）。
- terms: 助言のみ。用語の追加提案はありません。

## 要確認（status に反映）

- businessModel: 当社は2023年11月２日付で普通株式１株につき100株の割合で株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（当該株式分割が第17期の期首に行われたものと仮定して指標が算定されています）。
- businessModel: 当社は2026年５月22日開催の取締役会において、完全子会社である株式会社OK Junctionを、2026年10月１日（予定）を効力発生日として吸収合併することを決議しており、連結注記に重要な後発事象として記載されています（2026年６月26日開催予定の定時株主総会における合併契約の承認が条件）。本登録は2026年３月31日現在の体制に基づいています。
- businessStructure: 当社は2023年11月２日付で普通株式１株につき100株の割合で株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（当該株式分割が第17期の期首に行われたものと仮定して指標が算定されています）。
- businessStructure: 当社は2026年５月22日開催の取締役会において、完全子会社である株式会社OK Junctionを、2026年10月１日（予定）を効力発生日として吸収合併することを決議しており、連結注記に重要な後発事象として記載されています（2026年６月26日開催予定の定時株主総会における合併契約の承認が条件）。本登録は2026年３月31日現在の体制に基づいています。
- history: 当社は2023年11月２日付で普通株式１株につき100株の割合で株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（当該株式分割が第17期の期首に行われたものと仮定して指標が算定されています）。
- history: 当社は2026年５月22日開催の取締役会において、完全子会社である株式会社OK Junctionを、2026年10月１日（予定）を効力発生日として吸収合併することを決議しており、連結注記に重要な後発事象として記載されています（2026年６月26日開催予定の定時株主総会における合併契約の承認が条件）。本登録は2026年３月31日現在の体制に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] イシン株式会社の最大セグメントである公民共創事業（自治体向けマーケティング支援・営業支援。2026年３月期の外部顧客への売上高552百万円） → 提案: 官民連携・BtoG支援サービス。閉じた分類に自治体向け事業支援（BtoG）の区分がなく、同事業の中核である自治体向けメディア・プラットフォームに最も近い media（メディア）を暫定値としたため。同事業には営業BPO・テレマーケティング等の支援サービスが含まれ、メディアのみでは表しきれない。
