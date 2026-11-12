# ビーウィズ — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ビーウィズ株式会社 |
| 証券コード | 9216 |
| docID（データを取り出した文書） | `S100YYAI` |
| 原本 docID | `S100YYAI` |
| 提出日（原本） | 2026-08-25 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYAI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ビーウィズ株式会社 / 9216 / docID S100YYAI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bewith: 10 件の数値を有報XBRLと照合
有報: ビーウィズ株式会社 有価証券報告書－第27期(2025/06/01－2026/05/31) (docID S100YYAI)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-05-31","previousFiling":32405568000,"latestFiling":32405000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-05-31","previousFiling":35158816000,"latestFiling":35158000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-05-31","previousFiling":38253042000,"latestFiling":38253000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-05-31","previousFiling":36424310000,"latestFiling":36424000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-05-31","previousFiling":1776891000,"latestFiling":1776000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-05-31","previousFiling":1678180000,"latestFiling":1678000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-05-31","previousFiling":1833227000,"latestFiling":1833000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-05-31","previousFiling":452719000,"latestFiling":452000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-05-31","previousFiling":2591487000,"latestFiling":2591000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-05-31","previousFiling":2269326000,"latestFiling":2269000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-05-31","previousFiling":2527424000,"latestFiling":2527000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-05-31","previousFiling":1004124000,"latestFiling":1004000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-05-31","previousFiling":10490692000,"latestFiling":10490000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-05-31","previousFiling":12207044000,"latestFiling":12207000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-05-31","previousFiling":14096851000,"latestFiling":14096000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-05-31","previousFiling":14494609000,"latestFiling":14494000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-05-31","previousFiling":6605774000,"latestFiling":6605000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-05-31","previousFiling":7841894000,"latestFiling":7841000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-05-31","previousFiling":9192904000,"latestFiling":9192000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-05-31","previousFiling":8952625000,"latestFiling":8952000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
bewith: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は連結経営指標等・MD&A・セグメント情報の百万円単位の印字どおりに転記しました。Omnia LINK外販のライセンス数やARR等の指標は、売上高ではないため本文の金額としては使わず、このwarningsにも金額としては記録しませんでした。
- businessModel: 表示方法の変更は表示の組替えのみです。前連結会計年度に無形固定資産で区分掲記していたソフトウエア仮勘定を、当連結会計年度は金額が僅少となったため「その他」に含めて表示し、前連結会計年度の連結財務諸表の組替えを行った旨が注記されています。表示区分の変更のみで経営指標の金額に影響しないため、financialNotesではなくこのwarningsに記録しました。
- businessModel: 前期有報との修正再表示チェックの差異はいずれも1百万円未満で、当期有報の主要な経営指標等が百万円単位で印字されていることによる差異と考えられます。登録は当期有報の印字値を用いました。具体的な組替えの理由が経営指標について印字されているわけではないため、financialNotesには書いていません。
- businessModel: 2021年10月の株式分割に伴い、第23期の期首に分割が行われたと仮定して株式数に関する指標を算定した旨が経営指標の注記に印字されていますが、株式数に関する指標自体は本文に書いていないためfinancialNotesには書いていません。
- businessModel: フルアウトソーシングとインソーシングの売上構成やコンタクトセンター領域の売上構成等の比率は、比率を書かない規則のため本文には書いていません。
- businessModel: 重要な後発事象は連結・個別とも該当事項なしと印字されています。
- businessStructure: 事業名はセグメント情報の印字どおり「コンタクトセンター・BPO事業」としました。単一セグメントのため、製品及びサービスごとの情報は単一の製品・サービスの区分の外部顧客への売上高が連結売上高の90％を超えるため記載が省略されており、childrenは単一セグメント1件としました。
- businessStructure: 連結子会社は株式会社アイブリット、株式会社ドゥアイネット、Radiant Communication Sdn. Bhd.及び同社の子会社2社です。各社の資本金の金額は書いていません。
- businessStructure: 主要な顧客の金額はセグメント情報の関連情報（主要な顧客ごとの情報）の百万円単位の印字どおりです。株式会社パソナは親会社である株式会社パソナグループとは別法人です。
- history: 沿革の各行は年月まで印字されていますが、historyの形に月は書けないため年に畳み、月はdescriptionに残しました。子会社化の際の株式取得割合と資本金の金額は書いていません。
- history: センター開設等の沿革の多数の行は、設立・上場・子会社化等の主要な出来事に絞って省きました。
- history: 2026年5月のRadiant Communication Sdn. Bhd.の子会社化は当連結会計年度内に完了し、【関係会社の状況】の連結子会社として当連結会計年度末の構成に反映されているため、needsReviewではなく沿革に記録しました。
- industry: 主たる業界は、売上高の大半を占める単一セグメントであるコンタクトセンター・BPO事業の内容から判断しました。閉じた分類にコンタクトセンター・BPOの区分が無いため人材サービスを暫定とし、taxonomyGapsに区分を提案しました。
- industry: Omnia LINK等のシステム販売は単一セグメントの中で金額が独立して開示されていないため、IT・ソフトウェアの業界は追加しませんでした。
- relatedCompanies: 株式会社パソナグループ（pasona-group）: 【関係会社の状況】の親会社で、上記のとおり結びました。
- relatedCompanies: 株式会社パソナ: セグメント情報の主要な顧客ごとの情報に2026年5月期の売上高1,706百万円が印字される顧客企業ですが、株式会社パソナグループとは別法人で、related-candidates.jsonに無く百科事典の企業ファイルも確認できないため結んでいません。顧客としての事実はbusinessStructureとperspectivesに記録しました。
- relatedCompanies: 東京電力エナジーパートナー株式会社: 主要な顧客ごとの情報に2026年5月期の売上高5,131百万円が印字される最大の顧客ですが、related-candidates.jsonに無く百科事典の企業ファイルも確認できないため結んでいません。
- relatedCompanies: 三菱商事（mitsubishi-corporation）: 沿革では2000年の設立時の合弁相手で2006年に親会社となり2015年にパソナグループが全株式を取得するまでの株主でしたが、現在の【関係会社の状況】に記載が無く、現在の取引・資本関係が印字されていないため結んでいません。設立の経緯はhistoryに記録しました。
- relatedCompanies: ソフトバンクグループ（softbank-group）: 沿革では2000年の設立時の合弁相手として印字されるだけであり、現在の取引・資本関係が印字されていないため結んでいません。
- relatedCompanies: 株式会社Works Human Intelligence: 事業の内容の注記に、統合人事システム「COMPANY」の導入支援を行う協業（2022年11月リリース）が印字されていますが、related-candidates.jsonに無く百科事典の企業ファイルも確認できないため結んでいません。
- relatedCompanies: career（キャリア）、port（ポート）、vision（ビジョン）、core（コア）、space（スペース）、innovation（イノベーション）、systemsoft（システムソフト）: 一般語・経営ビジョンの文言・業務用語の部分一致で、当社がその相手について取引・提携・資本関係を述べた箇所はないため結んでいません。
- relatedCompanies: seki（セキ）、en（エン）、zero（ゼロ）、ray（レイ）、nissin（日新）、the-lead（リード）、arata（あらた）、corona（コロナ）: ambiguous又は一般語・用語の部分一致で、当社がその相手について取引・提携・資本関係を述べた箇所はないため結んでいません。
- relatedCompanies: i-net（アイネット）: 連結子会社である株式会社ドゥアイネットの名称の部分一致で、コードリストにもないため結んでいません。当社グループの子会社は関連企業として結びません。
- relatedCompanies: trust（トラスト）: 日本マスタートラスト信託銀行株式会社（信託口）の名称の部分一致で、純投資の信託口でありコードリストにもないため結んでいません。
- relatedCompanies: 連結子会社である株式会社アイブリット、株式会社ドゥアイネット、Radiant Communication Sdn. Bhd.等は当社グループの会社であるため結んでいません。
- terms: 助言: 用語「Omnia LINK（オムニアリンク）」は当社グループの自社開発クラウドPBXで、コンタクトセンターシステムです（事業の内容に印字）。
- terms: 助言: 用語「PBX（構内交換機）」は、電話の受発信や内線通話等の制御を行う装置で、クラウド化したものがクラウドPBXです（事業の内容の注記に印字）。
- terms: 助言: 用語「コンタクトセンター」は、電話に限らずメール・チャット・WEBなど複数のチャネルで顧客対応するセンターを指します（事業の内容の注記に印字）。
- terms: 助言: 用語「BPO」は、業務プロセスの一部について企画・設計から実施までを一括して専門業者に外部委託することを指します（事業の内容の注記に印字）。
- terms: 助言: 用語「KeyAI」はRadiant Communication Sdn. Bhd.が開発したAIエージェントソリューションです（事業の内容に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ビーウィズの主たる業界 → 提案: contact-center-outsourcing。主たる事業はコンタクトセンター業務とBPOを受託するアウトソーシングで、閉じた分類にコンタクトセンター・BPOの区分が無いため、労働集約型のアウトソーシングに最も近い人材サービスを暫定としました。ベルシステム24ホールディングスの前例と同じ提案です。
