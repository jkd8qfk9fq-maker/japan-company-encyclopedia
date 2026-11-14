# キムラユニティー — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | キムラユニティー株式会社 |
| 証券コード | 9368 |
| docID（データを取り出した文書） | `S100ZARO` |
| 原本 docID | `S100YCXZ` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100ZARO／有効文書 S100ZARO（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100ZARO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | キムラユニティー株式会社 / 9368 / docID S100YCXZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kimura-unity: 10 件の数値を有報XBRLと照合
有報: キムラユニティー株式会社 訂正有価証券報告書－第55期(2025/04/01－2026/03/31) (docID S100ZARO)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":57082000000,"latestFiling":57192000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":59139000000,"latestFiling":59256000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":61493000000,"latestFiling":61603000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":61129000000,"latestFiling":61234000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":2181000000,"latestFiling":2256000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":2471000000,"latestFiling":2446000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":3168000000,"latestFiling":3195000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":3300000000,"latestFiling":3310000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":3670000000,"latestFiling":3694000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":3965000000,"latestFiling":4004000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":4897000000,"latestFiling":4918000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":5117000000,"latestFiling":5061000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":56024000000,"latestFiling":55663000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":57770000000,"latestFiling":57430000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":64711000000,"latestFiling":64451000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":64549000000,"latestFiling":64212000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":33519000000,"latestFiling":33512000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":35114000000,"latestFiling":35080000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":40454000000,"latestFiling":40457000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":41171000000,"latestFiling":41157000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第55期(2025/04/01－2026/03/31)、docID S100ZARO）を有効文書としてこのパックを作った。原本は docID S100YCXZ。原本との主要財務の差異: S100ZARO（25件） — amendments.records[].comparedToBase を見ること
注意: 訂正有報の分類: financial-change — 数値が原本と異なる（主要財務 25 件／その他の数値 347 件: AccruedExpenses・Assets・BasicEarningsLossPerShareSummaryOfBusinessResults・ComprehensiveIncome・ComprehensiveIncomeAttributableToNonControllingInterests・ComprehensiveIncomeAttributableToOwnersOfTheParent・ComprehensiveIncomeSummaryOfBusinessResults・CostOfSales・CostOfServiceSalesCOSExpOA・CurrentAssets・CurrentLiabilities・DecreaseIncreaseInLeaseInvestmentAssetsOpeCF）。このパックの数値は有効文書のもの。原本の数値を出典にした記述が混ざっていないか確認すること
すべて一致しました。
kimura-unity: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有報の検証: 有効文書は訂正有価証券報告書（docID S100ZARO、2026年10月29日提出）で、原本は docID S100YCXZ（2026年6月17日提出）。分類は financial-change で、主要経営指標は売上高が第51期から第55期の全年度、親会社株主に帰属する当期純利益が第51期から第54期など広く訂正されている。本登録は訂正後の数値を用い、その旨を financialNotes に記録した。訂正の理由は、証拠パックに含まれる有報の節には印字されておらず確認できなかったため、理由は書いていない。前期有報（第54期）との照合でも同じ差異が確認され、訂正後の数値が前期印字と異なるのは訂正によるものである。
- businessModel: 当期純利益の減少要因は金額を本文に書かず定性的に記した。要因の金額（米国子会社KIMURA, INC.の物流部門再編に伴う減損損失231百万円、中国子会社天津木村進和物流有限公司の倉庫撤退に伴う特別退職金392百万円）は経営成績の分析の印字である。
- businessModel: 配当（配当性向の目標を含む）や自己株式の取得は資本政策の事項であり、投資の語に当たる指標名・比率は本文に書いていない。
- businessModel: wikipedia.json の記事「キムラユニティー」は本店所在地等の確認にとどまり、有報を超える補足がないため出典に加えていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした。「その他」（太陽光発電）は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: 物流サービス事業の内訳（包装40,820百万円＋格納器具製品5,043百万円）の合計は、事業計の印字45,864百万円と1百万円の端数差がある（有報の印字どおり）。報告セグメント各事業の外部顧客への売上高の単純合計も、連結売上高64,652百万円と端数差がある（印字どおり）。
- businessStructure: モビリティサービス事業の内訳は、セグメント注記と経営成績の分析（販売実績）で集計の区分が異なる（自動車リースの範囲等）ため、子事業には金額を書かず、事業計の外部顧客への売上高のみを用いた。
- businessStructure: 経営成績の分析のセグメント別売上高はセグメント間の内部売上高を含むため使わず、セグメント注記の外部顧客への売上高を用いた（例：人材サービス事業は経営成績の分析では1,892百万円、外部顧客への売上高は1,118百万円）。
- history: 沿革には年月まで印字されているが、行には年だけを用いた（月は書かない規則による）。
- history: 資本金の金額が印字された行（1973年の株式会社アキラ設立）は、金額を書けないため行ごと省いた。
- history: 個別の事業所・営業所の設置等の小項目は、事業の開始・上場・商号変更・提携・子会社設立等の主要な行に絞って採用した。
- history: 1951年から1990年までの※印の行は、1991年4月1日付合併以前のグループ子会社の沿革として印字されており、同社の沿革として扱った。
- history: 株式分割（2022年7月1日付・2025年4月1日付、いずれも普通株式1株につき2株）は経営指標等の推移の注記に印字されており、沿革には印字されていないため沿革の行には入れていない。
- industry: 主たる業界は、物流サービス事業が外部顧客への売上高45,864百万円と連結売上高の約7割を占めるため transportation とした。
- industry: 情報サービス事業（2,676百万円）と人材サービス事業（1,118百万円）は、金額が独立して開示される報告セグメントのため、それぞれ it と human-resources を付けた。
- industry: その他（太陽光発電による売電、44百万円）は金額が小さく、energy は付けていない。
- industry: モビリティサービス事業については taxonomyGaps に記録した。
- relatedCompanies: kimura（7461）は社名の部分一致であり、大株主の木村株式会社（29.43％）は非上場の別法人で、株式会社キムラとの関係の印字がないため関連付けていない。
- relatedCompanies: shinwa-7607（7607、ambiguous）は、印字が連結子会社「天津木村進和物流有限公司」「広州広汽木村進和倉庫有限公司」の名称の一部であり、株式会社進和との関係の印字がないため関連付けていない。
- relatedCompanies: people（7865）は、連結子会社ビジネスピープル株式会社の名称の部分一致であり、ピープル株式会社との関係の印字がないため関連付けていない。
- relatedCompanies: king（8118）、seki（7857、ambiguous）、base-4481（4481）、career（6198）、core（2359、ambiguous）、port（7047）、freee（4478）、slogan（9253）、land（8918）、en（4849、ambiguous）、vision（9416）、zero（9028、ambiguous）、suzuki-6785（6785、ambiguous）、kamigumi（9364、ambiguous）、nix（4243）の各候補は、一般語・部分一致であり、会社としての関係の印字がないため関連付けていない。
- relatedCompanies: toho-holdings（8129）とkyowa-leather-cloth（3553）は、特定投資株式の保有目的が「取引維持や強化のため」と一般的で、取引の内容や区分の印字がないため関連付けていない。
- relatedCompanies: ms-and-ad-insurance-group-holdings（8725）は、特定投資株式が150株・貸借対照表計上額0百万円にとどまり、みなし保有株式も退職給付信託への拠出であるため関連付けていない。tokio-marine-holdings（8766）のみなし保有株式も退職給付信託への拠出であるため関連付けていない。
- relatedCompanies: mitsubishi-ufj-financial-group（8306）とmizuho-financial-group（8411）のみなし保有株式は退職給付信託への拠出で、保有目的も資金調達の円滑化であるため関連付けていない。
- relatedCompanies: tokai-tokyo-financial-holdings（8616）は主幹事証券としての関係で、保有も500株・貸借対照表計上額0百万円にとどまり、事業上の取引・提携の印字がないため関連付けていない。
- relatedCompanies: hagiwara-electric-holdings（7467）とohmoriya（2917）は、当事業年度に持合い解消のため全ての株式を売却し保有がなくなったため関連付けていない。
- relatedCompanies: 最大株主の木村株式会社（29.43％）と絲丹株式会社（3.51％）は非上場で候補リストにないため関連付けていない。キムラユニティー社員持株会と株式会社日本カストディ銀行（信託口）は関連企業に含めていない。
- relatedCompanies: 当社グループの連結子会社6社及び持分法適用関連会社8社（TK Logistica do Brasil Ltda.、TTK Logistics (THAILAND) Co.,LTD.等）はグループの会社であるため関連企業には含めていない。合弁相手の豊田通商株式会社は関連企業に含めた。
- relatedCompanies: 沿革の「キムラリースサービス株式会社（旧（株）スズケン整備）」は買収した非上場会社であり、上場している株式会社スズケン（9987）とは別法人である。スズケンとの関連付けは株式の保有状況の印字（物流・モビリティサービスの顧客）による。
- terms: 助言: 用語「格納器具」は、同社が製造する物流用の容器・器具製品を指す中核用語で、事業の内容・沿革に印字されている。
- terms: 助言: 用語「KIBACO」は、モビリティサービス事業のサービスブランドとして経営方針に印字されている（「KIBACOを軸としたビジネスの拡大」）。
- terms: 助言: 用語「リースメンテ」は、リース車両のメンテナンスを指す同社の呼称で、セグメント情報に印字されている。

## 要確認（status に反映）

- businessModel: 中国事業の再編: 連結子会社の天津木村進和物流有限公司（議決権の所有割合89.7％）は、収益性を高めるための再構築を図るため2026年度中に解散する予定です。受け皿として2026年2月に常熟木進物流有限公司（同90.0％、連結子会社）を設立し、2026年7月より事業開始を予定しています（2026年4月27日に適時開示）。本登録は2026年3月31日現在の構造（天津木村進和物流有限公司を含む）によります。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] キムラユニティー（kimura-unity）のモビリティサービス事業（車両リース・車両整備・車両販売・保険代理店） → 提案: 自動車サービス（車両リース・整備・販売）。モビリティサービス事業は2026年3月期の外部顧客への売上高14,948百万円と連結売上高の2割強を占める報告セグメントだが、車両のリース・整備・販売に当たる区分が閉じた分類に無い。
