# ジーエヌアイグループ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジーエヌアイグループ |
| 証券コード | 2160 |
| docID（データを取り出した文書） | `S100XV4B` |
| 原本 docID | `S100XV4B` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XV4B.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジーエヌアイグループ / 2160 / docID S100XV4B（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 6 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gni-group: 10 件の数値を有報XBRLと照合
有報: 株式会社ジーエヌアイグループ 有価証券報告書－第25期(2025/01/01－2025/12/31) (docID S100XV4B)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":12690246000,"latestFiling":12690000000},{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":17418966000,"latestFiling":17418000000},{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":26010571000,"latestFiling":26010000000},{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":23611705000,"latestFiling":23611000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":1066185000,"latestFiling":1066000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":388825000,"latestFiling":388000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":8094202000,"latestFiling":8094000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":1098233000,"latestFiling":1098000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":1107010000,"latestFiling":1107000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":767887000,"latestFiling":767000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":12612748000,"latestFiling":12612000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":238185000,"latestFiling":238000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":30296980000,"latestFiling":30296000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":33906981000,"latestFiling":33906000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":64269302000,"latestFiling":64269000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":71942909000,"latestFiling":71942000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2021-12-31","previousFiling":18860309000,"latestFiling":18860000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2022-12-31","previousFiling":20969692000,"latestFiling":20969000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":33794414000,"latestFiling":33794000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":36446115000,"latestFiling":36446000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
gni-group: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務数値は国際会計基準（IFRS）の表示で、売上収益は26,840百万円、親会社の所有者に帰属する当期損失は4,244百万円（前期は当期利益1,098百万円）。セグメント別の外部顧客への売上収益（医薬品事業19,158百万円、医療機器事業7,681百万円）の合計は26,840百万円で、連結売上収益と一致する。
- businessModel: セグメントの収益はセグメント情報の外部顧客への売上収益を用い、MD＆Aのセグメント別売上収益（内部売上高を含む表示）やGyre Pharmaceuticals Co., Ltd.単体の主要な損益情報（売上収益17,314百万円）は本文に用いなかった。セグメントの損益も本文には書かなかった。
- businessModel: 5か年指標の前期以前の有報との対照では、前期有報が千円単位で印字した数値（例：2021年12月期の売上収益12,690,246千円）と当期有報の百万円単位の印字（12,690百万円）の単位丸めによる差異のみで、実質的な組替えや修正ではないためneedsReviewにはしなかった。
- businessModel: F351（ヒドロニドン）は中国で第3相臨床試験を完了し、2026年3月に国家薬品監督管理局医薬品審査センターへ新薬承認申請を提出した。これは提出後の事実だが組織再編ではなく、MD＆Aと研究開発活動に印字された事実であるため本文の扱いには影響させず、ここに記録した。
- businessModel: 経営方針に印字された目標とする経営指標（医薬品事業の売上収益の年率20～40％の伸び率の達成・継続、研究開発費を売上収益の20％以下に収めること）は将来の計画目標であるため、本文やperspectivesには数値として書かなかった。
- businessModel: 連結子会社の一部（Cullgen Inc.、Gyre Pharmaceuticals Co., Ltd.、上海ジェノミクス有限公司など）は債務超過の状態にあることが関係会社の状況に印字されているが、金額は本文に書かず、判断材料としてここに記録した。
- businessModel: 仕入先に関する開示はなく、このツリーのスキーマにもsuppliersキーが無いため、businessModelにはsuppliersを付けなかった。
- businessStructure: 事業は報告セグメント（医薬品事業・医療機器事業）の外部顧客への売上収益の大きい順に並べた。製品別の内訳（アイスーリュイ15,792百万円、生体材料7,568百万円、その他3,478百万円）はセグメント情報の製品及びサービスに関する情報の印字による。
- businessStructure: 主要な子会社のうちCullgen Inc.など一部は債務超過の状態にあることが関係会社の状況に印字されている。金額は本文に書かなかった。
- businessStructure: 2026年3月2日にGyre Therapeutics, Inc.がCullgen Inc.を完全子会社化する買収契約を締結した（提出後の重要な後発事象）。登録は2025年12月31日現在の体制で行い、この件はbusinessModelフラグメントのneedsReviewに記録した。
- history: 沿革から削った行：久留米研究ラボの開設・閉鎖、GNI創薬解析センターの開設・閉鎖、GNI USA Inc.の設立・清算・再設立、本店移転（3回）、IriSys,LLCの持分取得・譲渡、Gyre Pharmaceuticalsの一部出資持分の売却とGEP (HK) Holding Limitedとの戦略的提携の基本合意、上海ジェノミクス有限公司と北京洲際新薬開発有限公司の有人公司への変更、Gyre Pharmaceuticalsの中国創業版市場への上場申請・再申請と深セン証券取引所への上場準備、アイスーリュイの中国国民基本医療保険等目録への収載、F351の画期的治療薬指定の付与、ニンテダニブ（Etorel）の製造販売権の取得、香港証券取引所へのH株上場申請、Cullgen Inc.の豪州子会社の設立、ガバナンス・パートナーズ株式会社との業務提携と同社組成ファンドの連結子会社化、マイクレン・ヘルスケア株式会社の合弁設立合意、OsDerma Medicals Inc.との合弁設立の基本合意、Shanghai JIUCE Medicals Co., Ltd.の持分法適用関連会社化、Cullgen Inc.のPulmatrix, Inc.とのリバースマージャー決議（提出後の買収契約で実質的に見直された計画）、アバトロンボパグの中国での販売承認。
- history: 2024年11月にCullgen Inc.がPulmatrix, Inc.とのリバースマージャー（合併）契約を締結したことは沿革と後発事象の注記に印字されているが、2026年3月2日のGyre Therapeutics, Inc.によるCullgen Inc.の完全子会社化の買収契約により見直される計画であり、完了した事象ではないため沿革には書かなかった。
- industry: 主たる業界は pharmaceuticals（医薬品）とした。医薬品事業の外部顧客への売上収益19,158百万円が連結売上収益26,840百万円の約71％を占め、主力製品は医薬品のアイスーリュイである。
- industry: 医療機器事業（生体材料）は外部顧客への売上収益7,681百万円（全体の約29％）で独立して開示される報告セグメントだが、閉じた分類に医療機器を表す値がないため、副次の業界は付けず、taxonomyGapsに記録した。
- relatedCompanies: astellas-pharma（アステラス製薬株式会社）: 【重要な契約等】と【沿革】に、連結子会社Cullgen Inc.との共同研究及び独占的オプション契約（2023年6月締結）が具体的に印字されるため business-partner で結んだ。契約金やマイルストーンの金額は説明文に書かなかった。
- relatedCompanies: eisai（エーザイ株式会社）: 【沿革】に2020年3月の独占的実施権ライセンス契約の締結が印字されるため business-partner で結んだ。
- relatedCompanies: japan-asia-investment（日本アジア投資株式会社）: 【沿革】に2024年8月の業務提携契約の締結が印字されるため business-partner で結んだ。
- relatedCompanies: step（株式会社ステップ）: 候補は研究開発戦略の「3つのステップ」という一般語への部分一致で、株式会社ステップへの言及ではないため結ばなかった。
- relatedCompanies: nissin: 候補は「日新」の部分一致だが、文脈は新株予約権等であり株式会社日新への言及ではなく、コードリストにも無いため結ばなかった。
- relatedCompanies: port: 候補は「レポート（サステナビリティレポート等）」の部分一致で企業名ではないため結ばなかった。
- relatedCompanies: land: 候補は「ブランド」の部分一致で企業名ではないため結ばなかった。
- relatedCompanies: seki: 候補は「セキュリティ」等の部分一致で特定の企業を指さず、曖昧なため結ばなかった。
- relatedCompanies: cover: 候補は委員の「カバー（covered）」という一般語への部分一致で企業名ではないため結ばなかった。
- relatedCompanies: oro: 候補は「オーソバイオロジクス」等の部分一致で特定の企業を指さず、曖昧なため結ばなかった。
- relatedCompanies: the-lead: 候補は「リードプログラム」という一般語への部分一致で企業名ではないため結ばなかった。
- relatedCompanies: base-4481（株式会社ベース）: 候補は「インターネットベース」という一般語への部分一致で、株式会社ベースへの言及ではないため結ばなかった。
- relatedCompanies: en: 候補は部分一致で特定の企業を指さず、曖昧なため結ばなかった。
- relatedCompanies: ray: 候補は部分一致で特定の企業を指さず、曖昧なため結ばなかった。
- relatedCompanies: trust: 候補は日本マスタートラスト信託銀行株式会社（信託口）という信託口への部分一致で、株式会社トラストではないため結ばなかった。また信託口は関連企業として結ばない。
- relatedCompanies: 大株主の状況にはファンド、証券会社、個人、信託銀行の信託口・カストディ口座のみが載り、事業会社は無いため major-shareholder のリンクは作らなかった。株式の保有状況では特定投資株式は該当事項なしと印字されている。
- relatedCompanies: セグメント情報の主要な顧客として印字されるSinopharm、華潤医薬集団有限公司、New Horizon Medical Inc.、China Resources Pharmaceutical Commercial Group Company Limitedはrelated-candidates.jsonに無く（未上場・外国会社）、結ばなかった。事実はセグメント情報に記載のとおりである。
- relatedCompanies: イーピーエス株式会社は沿革に合弁相手として印字されるがrelated-candidates.jsonに無いため結ばなかった。ガバナンス・パートナーズ株式会社も業務提携が沿革に印字されるが候補に無いため結ばなかった。
- terms: 助言: 用語「アイスーリュイ」は、当社グループが中国で販売する特発性肺線維症治療薬のブランド名（中国名は艾思瑞、英語名はETUARY）で、一般名はピルフェニドンです。
- terms: 助言: 用語「F351」は、一般名をヒドロニドンという肝線維症の治療薬候補で、中国で第3相臨床試験を完了しました。
- terms: 助言: 用語「uSMITE」は、連結子会社のCullgen Inc.が持つ標的タンパク質分解技術プラットフォームの名称で、病気の原因となるタンパク質を選択的に分解する低分子化合物を設計する技術です。
- terms: 助言: 用語「アンメット・メディカル・ニーズ」は、まだ有効な治療法が見つかっていない疾患に対する医療ニーズのことです。
- terms: 助言: 用語「生体材料（バイオマテリアル）」は、人体の組織の代替や再生に使う材料のことで、当社グループでは皮膚由来製品や骨由来製品を医療機器として販売しています。
- terms: 助言: 用語「オーソバイオロジクス」は、骨や関節などの整形外科領域で使う生体材料製品の分野のことです。

## 要確認（status に反映）

- businessModel: 提出後の2026年3月2日に、連結子会社のGyre Therapeutics, Inc.が連結子会社のCullgen Inc.を完全子会社化する買収契約を締結しました（2026年12月期第2四半期に完了予定、連結財務諸表への影響額は算定中）。重要な後発事象として印字された提出後の組織再編であり、登録は2025年12月31日現在の体制（Cullgen Inc.は持分48.36％の連結子会社）で行っています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ジーエヌアイグループの医療機器事業（生体材料） → 提案: 医療機器（生体材料・医療機器）。医療機器事業は外部顧客への売上収益7,681百万円（連結売上収益の約29％）の報告セグメントで、米国子会社が皮膚由来製品や骨由来製品などの生体材料を開発・製造販売する事業だが、閉じた分類に医療機器を表す値がないため。
