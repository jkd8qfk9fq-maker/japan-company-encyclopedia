# 日本Ｍ＆Ａセンターホールディングス — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社日本Ｍ＆Ａセンターホールディングス |
| 証券コード | 2127 |
| docID（データを取り出した文書） | `S100YGWF` |
| 原本 docID | `S100YGWF` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGWF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社日本Ｍ＆Ａセンターホールディングス / 2127 / docID S100YGWF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 6 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nihon-m-and-a-center-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社日本Ｍ＆Ａセンターホールディングス 有価証券報告書－第35期(2025/04/01－2026/03/31) (docID S100YGWF)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":40401573000,"latestFiling":40401000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":41315716000,"latestFiling":41315000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":44136889000,"latestFiling":44136000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":44077707000,"latestFiling":44077000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":11437560000,"latestFiling":11437000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":9842935000,"latestFiling":9842000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":10727734000,"latestFiling":10727000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":10955880000,"latestFiling":10955000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":16864064000,"latestFiling":16864000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":15472889000,"latestFiling":15472000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":16518756000,"latestFiling":16518000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":16918667000,"latestFiling":16918000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":58919184000,"latestFiling":58919000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":65765062000,"latestFiling":65765000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":58640609000,"latestFiling":58640000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":61786402000,"latestFiling":61786000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":51026002000,"latestFiling":51026000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":54720538000,"latestFiling":54720000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":43973612000,"latestFiling":43973000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":47589584000,"latestFiling":47589000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nihon-m-and-a-center-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社日本M＆Aセンターホールディングス」が EDINET の提出者名「株式会社日本Ｍ＆Ａセンターホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 散文中の金額は有報の千円単位の印字を百万円単位に切り捨てて記載しています（切捨てであり四捨五入はしていません）。
- businessModel: 前期有報との修正再表示チェックの差異はすべて、前期有報の千円単位の値と当期の５年表の百万円単位の値との桁違い（切捨て）によるもので、経営指標等の注記にも組替え・遡及適用の記載はありません。組替え警告はこの理由で warnings のみとし、financialNotes は付けていません。
- businessModel: MD&Aの売上内訳（Ｍ＆Ａ仲介事業48,488百万円、その他の事業1,768百万円）の合計は50,256百万円で、連結売上高の印字50,257百万円と1百万円の差があります。印字どおり記載しています。
- businessModel: 株式会社日本Ｍ＆Ａセンター（連結子会社）の主要な損益情報等の売上高48,755百万円は単体ベースで範囲が異なるため、事業構造の子会社の説明には使っていません。
- businessModel: 「Next Genesis ビジョン300」の目標は連結経常利益300億円（2033年3月期）という利益指標の目標であるため、strategy の本文には数値目標を転記せず、正式名称と定性的な位置づけのみを記載しました。
- businessModel: 株式会社ブリングアウトとは2025年２月に資本業務提携を行い、同社のＡＩ商談解析サービス「Bring Out」を活用していますが、同社には百科事典のエントリがないため relatedCompanies には結んでいません。
- businessStructure: 事業区分は事業の内容に印字される売上分類（Ｍ＆Ａ仲介事業、その他の事業）どおりとし、金額はMD&Aの売上内訳の印字を使いました。報告セグメントはＭ＆Ａコンサルティング事業の単一セグメントで、セグメント情報の記載は省略されています。
- businessStructure: 売上分類の合計（50,256百万円）は連結売上高の印字（50,257百万円）と1百万円異なります。印字どおり記載しています。
- history: 沿革の各行の資本金の額は、禁止される財務金額に当たるため記載していません。
- history: 2026年４月の株式会社Ｊ－Ｃａｐｉｔａｌの設立は決算日後の出来事のため沿革には入れず、needsReview に記録しました。
- industry: 当社グループの事業はＭ＆Ａコンサルティング事業の単一セグメントで、Ｍ＆Ａ仲介が中核です。閉じた業界集合にＭ＆Ａ仲介・経営コンサルティングに相当する区分がないため、最も近い finance を暫定の主たる業界とし、taxonomyGaps に記録しました。
- relatedCompanies: 株式会社バトンズ（batonz）: 持分法適用関連会社（議決権の所有割合32.47％）で当社グループの会社であるため結んでいません。株式会社ネクストナビ、株式会社日本投資ファンド、株式会社サーチファンド・ジャパンも当社グループの持分法適用関連会社であるため結んでいません。
- relatedCompanies: 株式会社日本政策投資銀行: 株式会社日本投資ファンド及び株式会社サーチファンド・ジャパンの合弁相手ですが、非上場の政府系金融機関で百科事典のエントリがないため結んでいません。
- relatedCompanies: 株式会社沖縄銀行: 株式会社おきぎんサクセスパートナーズの共同出資者ですが、銀行そのものには百科事典のエントリがなく（沖縄フィナンシャルグループは別の法人です）、結んでいません。合弁の事実はMD&Aに印字されています。
- relatedCompanies: 株式会社肥後銀行: 九州Ｍ＆Ａアドバイザーズ株式会社の共同出資者ですが、銀行そのもの（非上場）であり結んでいません。台湾の玉山ベンチャーキャピタルも外国の会社で結んでいません。
- relatedCompanies: 株式会社ブリングアウト: 2025年２月に資本業務提携を行い、同社のＡＩ商談解析サービス「Bring Out」を活用していますが、百科事典のエントリがないため結んでいません。
- relatedCompanies: キャリアインキュベーション株式会社、株式会社伊藤アンドパートナーズ: 株式会社サーチファンド・ジャパンの合弁相手ですが、いずれも非上場で結んでいません。候補の career（株式会社キャリア、6198）は別の会社です。
- relatedCompanies: 信金中央金庫及び信金キャピタル株式会社: 全国の信用金庫との業務提携の相手方ですが、非上場の協同組織・その子会社であり、個別の上場会社との提携ではないため結んでいません。
- relatedCompanies: core（コア）、path（パス）、vision（ビジョン）、port（ポート）、seki（セキ）、en（エン）、step（ステップ）、base-4481（ベース）、land（ランド）、trust（トラスト）、cover（カバー）、innovation（イノベーション）、nissin（日新）、no-1（Ｎｏ．１）、ray（レイ）、the-lead（リード）: コアバリュー、パーパス、ビジョン、サポート、情報セキュリティ、ステップ等の一般語・文言の部分一致で、当社がその相手について取引・提携・資本関係を述べた箇所はないため結んでいません。
- relatedCompanies: 特定投資株式の貸借対照表計上額は説明に書いていません（株式数と取引の役割のみ）。
- terms: 助言: 用語「案件化」は、譲渡企業の内容を正確に把握し、企業情報資料の収集、インタビューシートの完成、企業評価、譲受企業への提案書（企業概要書）の作成を行うステップを指します（事業の内容に印字）。
- terms: 助言: 用語「レーマン方式」は、成功報酬の料率表で、企業規模が大きくなるにつれて料率が逓減する方式を指します。成功報酬は時価総資産に料率を乗じて算出します（事業の内容に印字）。
- terms: 助言: 用語「ノンネーム企業情報資料」は、秘密保持の観点から企業名を伏せて譲受企業に最初に打診する、Ａ４で１枚程度の資料を指します（事業の内容に印字）。
- terms: 助言: 用語「サーチファンド」は、個人（サーチャー）が投資家から資金を集めて１社の中小企業を買収し、自ら経営者として事業を承継・成長させる仕組みを指し、当社グループでは関連会社等を通じて支援しています（事業の内容に印字）。
- terms: 助言: 用語「ＰＭＩ」は、Ｍ＆Ａを成約した後に速やかかつ円滑に事業統合するためのコンサルティングを指します（事業の内容に印字）。
- terms: 助言: 用語「着手金」は、提携仲介契約の締結時に受領する金銭で、譲渡企業側は会社規模に応じて通常100万円～300万円程、譲受企業側は通常100万円～500万円程です（事業の内容に印字）。

## 要確認（status に反映）

- businessModel: 当社は、2026年２月13日開催の取締役会決議に基づき、2026年４月１日を効力発生日として、当社のファンド事業に関する権利義務を、新設分割により新たに設立した株式会社J-Capitalに承継いたしました（重要な後発事象に印字）。本登録は2026年３月31日時点のグループ構成（当社、連結子会社17社及び持分法適用関連会社18社）で行います。
- businessStructure: 当社は、2026年２月13日開催の取締役会決議に基づき、2026年４月１日を効力発生日として、当社のファンド事業に関する権利義務を、新設分割により新たに設立した株式会社J-Capitalに承継いたしました（重要な後発事象に印字）。本登録は2026年３月31日時点のグループ構成（当社、連結子会社17社及び持分法適用関連会社18社）で行います。
- history: 当社は、2026年２月13日開催の取締役会決議に基づき、2026年４月１日を効力発生日として、当社のファンド事業に関する権利義務を、新設分割により新たに設立した株式会社J-Capitalに承継いたしました（重要な後発事象に印字）。本登録は2026年３月31日時点のグループ構成（当社、連結子会社17社及び持分法適用関連会社18社）で行います。
- relatedCompanies: 当社は、2026年２月13日開催の取締役会決議に基づき、2026年４月１日を効力発生日として、当社のファンド事業に関する権利義務を、新設分割により新たに設立した株式会社J-Capitalに承継いたしました（重要な後発事象に印字）。本登録は2026年３月31日時点のグループ構成（当社、連結子会社17社及び持分法適用関連会社18社）で行います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 株式会社日本Ｍ＆Ａセンターホールディングスの主たる事業（Ｍ＆Ａ仲介・Ｍ＆Ａコンサルティング） → 提案: コンサルティング（Ｍ＆Ａ仲介・経営コンサルティング）。閉じた業界集合にＭ＆Ａ仲介・経営コンサルティングに相当する区分がなく、最も近い finance を暫定の主たる業界としたため。
