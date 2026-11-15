# フジ日本 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | フジ日本株式会社 |
| 証券コード | 2114 |
| docID（データを取り出した文書） | `S100YK3Q` |
| 原本 docID | `S100YGKQ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YK3Q／有効文書 S100YK3Q（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK3Q.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | フジ日本株式会社 / 2114 / docID S100YGKQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fuji-nihon: 10 件の数値を有報XBRLと照合
有報: フジ日本株式会社 訂正有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YK3Q)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":20096053000,"latestFiling":20096000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":22677852000,"latestFiling":22677000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":25889553000,"latestFiling":25889000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":28209627000,"latestFiling":28209000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":1614123000,"latestFiling":1614000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":1672947000,"latestFiling":1672000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":2370133000,"latestFiling":2370000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":2845999000,"latestFiling":2845000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":1917983000,"latestFiling":1917000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":2124050000,"latestFiling":2124000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":3202783000,"latestFiling":3202000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":3651099000,"latestFiling":3651000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":24745069000,"latestFiling":24745000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":28256487000,"latestFiling":28256000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":32419118000,"latestFiling":32419000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":33761992000,"latestFiling":33761000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":19712952000,"latestFiling":19712000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":21514208000,"latestFiling":21514000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":23851394000,"latestFiling":23851000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":23874385000,"latestFiling":23874000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第103期(2025/04/01－2026/03/31)、docID S100YK3Q）を有効文書としてこのパックを作った。原本は docID S100YGKQ。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
fuji-nihon: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（S100YK3Q、2026年６月25日提出）であり、原本（S100YGKQ）との差異は機械照合で０件（record-only分類）。財務数値・本文は原本と同一のため、訂正に関するneedsReviewは立てず、出典は訂正有報の値とした。
- businessModel: 前期有報との修正再表示チェックで挙がった差異はすべて百万円未満の端数（前期有報の円単位の実額と当期の百万円印字との差）であり、５年表の百万円印字の数値に差異はない。そのため数値の訂正としては扱わず、ここに記録した。
- businessModel: 2022年改正会計基準の適用と第101期への遡及適用は経営指標等の注記に理由が印字されているため、financialNotesに2024年３月期の注記として記録した。
- businessModel: セグメント区分の組替え（FUJI NIHON (Thailand)の機能性素材への移管、「パン類等」の機能性食品への組替え、Thai Wah Fuji Nihonの投資有価証券の糖類への組替え）は表示方法の変更であり、指標に影響しないためwarningsのみとした。
- businessModel: 重要な後発事象として、島田事業所（静岡県島田市）の新設に向けた固定資産取得・新規事業所開設計画が印字されている。取締役会決議は2026年２月（期中）であり、用地取得と工事契約の締結は2026年４月（期末後）。セグメントや子会社の構成を変える事象ではなく、開設は予定段階のため、needsReviewにはせずここに記録した。取得価額の金額は書いていない。
- businessModel: 中計の目標とする経営指標（経常利益への重点、ROE、DOE、D/Eレシオ）は投資・利益率系の指標のため、本文・strategyには書かずここに記録した。
- businessModel: 原料糖の仕入れ（南栄糖業からの国産原料糖の購入）と精製糖の製造委託（太平洋製糖・DM三井製糖）は関係会社・契約の事実として各成果物に記載した。suppliersキーはこのツリーのスキーマに無いためbusinessModelには書いていない。
- businessModel: Wikipediaの記事は確認できたが、冒頭文は「日本の製糖会社」という有報の記載の言い換えにとどまるため、補足には使わなかった。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高の大きい順（機能性素材14,121百万円、糖類13,444百万円、不動産633百万円）とし、報告セグメントに含まれない「その他」（切花活力剤243百万円）を最後に置いた。
- businessStructure: 2025年４月１日付の組織変更に伴い、FUJI NIHON (Thailand) Co.,Ltd.の事業等が「その他」から機能性素材事業へ移管され、収益の分解情報の「パン類等」が機能性食品へ組み替えられた。表示の組替えのみであり、セグメント数値への影響はないためwarningsに記録した。
- businessStructure: 当連結会計年度の期首よりセグメント名称が「精糖事業」から「糖類事業」に変更された（名称変更のみ）。
- businessStructure: 表紙は上場取引所を「東京証券取引所」とのみ印字し市場区分を印字していないため、listingsにmarketを書かなかった（スタンダード市場への移行は沿革に記載）。
- businessStructure: セグメント別売上高はセグメント注記の百万円印字をそのまま用いた。各区分の単純合計と連結売上高（28,443百万円）との差は有報自体の丸めによるもので、印字どおり引用した。
- history: 沿革から落とした行：1951年協立食品株式会社（現フジ日本商事）の設立、1953年本社移転、1955年マ・マーマカロニ株式会社の設立、1964年販売代理店の移行、1974年本社ビル竣工、1987年ティバルディ関係会社の設立、1988年決算期変更（11月30日から３月31日へ）、2001年横浜工場の生産中止、2004年清水工場の生産停止、2005年Tibaldi株式売却・2006年日本ティバルディ清算、2016年DAY PLUS (THAILAND)の子会社化及びFuji Nihon Thai Inulinの完全子会社化、2020年本社移転、2022年DAY PLUS (THAILAND)の持分法適用関連会社化、2023年上海唯霓食品有限公司の設立、2024年FUJI NIHON (Thailand)の完全子会社化、2025年同社への増資。いずれも拠点・組織の細目や既に事業の中核でない事項のため省略した。
- history: 2026年１月の株式分割は沿革の末尾に印字されているが、経営指標等の注記にも印字される自己株式分割であり、needsReviewに記録したため沿革の行にはしなかった。
- history: 設立時・合併時の資本金の金額は沿革に書かなかった（資本金の金額は本文に書かない規則による）。
- industry: 主たる業界は、売上高の約97％を占める糖類事業と機能性素材事業（いずれも食品）に基づきfood（食品）とした。
- industry: 不動産事業は報告セグメントとして売上高633百万円（連結の2.2％）が開示されているが、小規模なため業界を付さなかった（小規模セグメントには業界を足さない先例による）。
- industry: 合う値があるためtaxonomy gapはない。
- relatedCompanies: sojitz：候補ではambiguousとされていたが、【関係会社の状況】に「その他の関係会社」として双日株式会社が議決権の被所有割合33.4％とともに明記されており、同一性は明確なため区分どおりother-affiliated-companyで結んだ。大株主の状況の31.78％は自己株式控除後の発行済株式に対する割合で、関係会社の状況の33.4％は議決権割合（間接保有の内数を含む）。
- relatedCompanies: ensuiko-sugar-refining：特定投資株式の保有目的本文は定型句だが、「精製糖の共同生産に関する業務提携をしております」と個別の提携事実が併記されており、沿革の2001年の業務提携・共同生産開始とも一致するため、定型句だけの相手とは区別してbusiness-partnerで結んだ。
- relatedCompanies: mitsui-dm-sugar：リンクの根拠は【重要な契約等】の製造委託契約（相手方はDM三井製糖株式会社）。なお株式を保有しているのはDM三井製糖ホールディングス株式会社であり、契約相手とは別の法人であるため、保有の事実は根拠にしていない。
- relatedCompanies: kohnan-shoji：賃貸借契約の相手はコーナン商事株式会社と株式会社東横イン。東横インは未上場で候補にないため結ばず、事実はbusinessStructureに記載した。
- relatedCompanies: yakult-honsha：【大株主の状況】に事業会社の大株主として載るためmajor-shareholderで結んだ（先例：osaka-gas、toho-gas）。取引関係の記載はない。
- relatedCompanies: 結ばなかった候補（取引・提携・資本関係の個別の根拠がないもの）：fuji-8278（自社グループ名の一部への一致）、en・vision・path・career・seki・zero・base-4481・slogan・the-lead・t-kawabe-and-co（一般語・地名・製品名への一致のみ）、trust（日本マスタートラスト信託銀行の信託口への言及であり株式会社トラストではない）。
- relatedCompanies: 結ばなかった候補（保有株式の表のみ・定型句のみ）：b-r-31-ice-cream、bourbon、ebara-foods-industry、ito-en、morinaga-milk-industry、toyo-suisan-kaisha、yamazaki-baking（いずれも保有目的が全銘柄共通の「営業取引強化、取引先との良好な関係を構築するため保有しております。」のみ）、nippon-fine-chemical（同上。あわせて純投資目的への区分変更が検討された銘柄）、fukuyama-transporting、hikari-business-form、kyowanissei、maruichi、sakata-seed、the-keihin、wood-one、toyota-tsusho（いずれも「安定株主確保」等の定型的な保有目的のみ）。
- relatedCompanies: 結ばなかった候補（金融機関）：shizuoka-financial-group、the-shimizu-bank（銀行取引強化を目的とする保有であり、資金調達・銀行取引が理由のため結ばない）。
- relatedCompanies: kanematsu：1964年に販売代理店を移したという沿革の記載のみで、現在の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 候補にない相手の事実：双日食料株式会社（双日株式会社の子会社）は最大の販売先（販売高10,786百万円、総販売実績の37.9％）だが未上場のため結べず、事実はbusinessModel・businessStructureに記載した。和田製糖株式会社（大株主9.57％）、鈴与株式会社（同7.41％）はいずれも未上場で候補にない。
- terms: 用語の助言のみの工程。「イヌリン」はチコリ等を原料とする水溶性食物繊維の機能性食品素材で、当社グループの主力製品。「プラントベーストミート」は株式会社Tastableが製造販売する植物由来の代替肉。「キープ・フラワー」は当社の切花活力剤の製品名。

## 要確認（status に反映）

- businessModel: 2026年１月１日付で普通株式１株につき２株の割合で株式分割を実施しています。主要な経営指標等の各期の数値は、当該株式分割が第99期の期首に行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
