# リックソフト — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リックソフト株式会社 |
| 証券コード | 4429 |
| docID（データを取り出した文書） | `S100Y6L5` |
| 原本 docID | `S100Y6L5` |
| 提出日（原本） | 2026-05-27 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6L5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リックソフト株式会社 / 4429 / docID S100Y6L5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ricksoft: 10 件の数値を有報XBRLと照合
有報: リックソフト株式会社 有価証券報告書－第24期(2025/03/01－2026/02/28) (docID S100Y6L5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ricksoft: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 組替えの注意について：成長ビジョン（Reignite2030）に向けた事業区分の変更に伴い、前連結会計年度の製品及びサービスごとの情報は変更後の区分に組み替えて記載されていますが、これは内訳の表示の変更であり、登録している経営指標そのものへの影響はありません（前期有報との照合でも全系列で差異なし）。また、法人税等の会計基準の一部改正は遡及適用されていますが、前連結会計年度の連結財務諸表への影響はない旨が印字されており、financialNotesに記録しました。要確認にはしていません。
- businessModel: 親会社株主に帰属する当期純利益の減少理由は書いていません（印字された分析は営業外費用の増加など、本文に書けない区分に触れるため）。
- businessModel: 経営成績の分析に印字された売上総利益や段階利益の金額・増減理由、キャッシュ・フローの金額、受注高・受注残高の金額は書いていません。
- businessModel: 経営方針の客観的な指標（顧客数、認定技術獲得数、EBITDA）については、数値や目標値を本文・perspectivesに書いていません。
- businessModel: 【重要な後発事象】は連結・個別とも「該当事項はありません」であり、期間後の出来事として記録すべき事項はありません。
- businessStructure: 当社グループはツールソリューション事業の単一セグメントであり、サービス別の内訳はセグメント注記【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）によります。サービス別の金額を百万円に切り捨てた合計は10,891百万円で、印字の合計10,892百万円とは切り捨ての差があります（千円単位では10,892,579千円と一致）。
- businessStructure: 本社（東京都千代田区）と西日本支社（愛知県名古屋市）は単一セグメントの設備のため、特定のサービスには結びつけていません。帳簿価額や賃料は書いていません。
- businessStructure: 連結子会社Ricksoft, Inc.（米国、議決権100％）は自社の子会社であり、関連企業には含めていません。
- businessStructure: この工程のスキーマには suppliers キーがないため、仕入先は構造化していません。Atlassian社のソフトウェアライセンスを仕入れて再販していること、自社プロダクトの販売にあたりAtlassian Marketplaceの使用料としてAtlassian社へ手数料を支払っていることは、事業の説明に記しています。
- businessStructure: 合弁会社「株式会社アルターデザインコンサルティング」（2025年６月設立）は【関係会社の状況】に記載がなく、関連企業候補にも含まれていないため、関連企業には含めていません。
- history: ISO27001認証の取得（2013年）、ISO27017認証の取得（2017年）は事業の転機ではないため沿革には含めていません。
- history: Alfresco Software, Inc.（2014年）、Tableau Software, Inc.（2017年）、Mattermost, Inc.（2018年）、WhiteSource Ltd（2019年）、Workato, Inc.（2019年）、Slack Technologies, Inc.（2019年）、Tricentis GmbH（2020年）とのパートナー契約、Scaled Agile, Inc.のGold Partner認定（2021年）、Atlassian Marketplaceへの参入（2022年）、アジアパシフィック急成長企業へのランクイン（2026年）は、沿革には含めていません。
- history: 「Issue Editor for Jira（Excel-like Issue Editor）」の販売開始（2015年）、「Alfresco connector for Jira」等の販売開始（2016年、2021年）、各製品のクラウド版の販売開始（2017年、2019年）は、個別製品の発売として沿革には含めていません（主力の自社プロダクトは事業構成に記載）。
- history: 沿革の年月は年だけを登録し、資本金の金額は書いていません。
- industry: 主たる事業はAtlassian製品をはじめとするソフトウェアの販売・導入支援と自社ソフトウェアの開発・販売であるため、it を主たる業界としました。顧客の業界は顧客側の属性であり、当社グループの事業として開示されたものではないため付けていません。
- relatedCompanies: hikari-tsushin：大株主として印字されているのは「光通信ＫＫ投資事業有限責任組合」であり、株式会社光通信とは別の法人格のため、結んでいません（代替もしていません）。
- relatedCompanies: port：「サポート」等の一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: vision：「成長ビジョン」という一般的な語としての一致のみで、結んでいません。
- relatedCompanies: innovation：ミッションの文言「イノベーションをおこして」としての一致のみで、結んでいません。
- relatedCompanies: en：曖昧な一致（「エンジン」等の語の一部）のみで、結んでいません。
- relatedCompanies: seki：曖昧な一致（「セキュリティ」等の語の一部）のみで、結んでいません。
- relatedCompanies: career：「キャリア形成」という一般的な語としての一致のみで、結んでいません。
- relatedCompanies: ray：曖昧な一致（「プレイヤー」等の語の一部）のみで、結んでいません。
- relatedCompanies: land：「ブランド」「ランド・アンド・エクスパンド」という一般的な語としての一致のみで、結んでいません。
- relatedCompanies: lec：「フレックスタイム制」等の一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: imura-and-co：「タイムラグ」等の一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: king：「ランキング」という一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: system-integrator：「SIer（システムインテグレーター）」という一般名称としての一致のみで、結んでいません。
- relatedCompanies: 最大株主のＨＳ株式会社（発行済株式（自己株式を除く。）の総数に対する割合44.44％、2026年２月28日現在）は関連企業候補に含まれていないため、結んでいません。株式会社ＳＢＩ証券、楽天証券株式会社、野村信託銀行株式会社（投信口）は証券会社・信託口であり、純投資のため結んでいません。
- relatedCompanies: BiPlus Vietnam Software Solutions Joint Stock Company（2025年12月に資本業務提携合意）および合弁会社の株式会社アルターデザインコンサルティングは、関連企業候補に含まれていないため結んでいません。
- relatedCompanies: 連結子会社Ricksoft, Inc.（米国、議決権100％）は自社の子会社であり、関連企業には含めていません。特定投資株式は「該当事項なし」とされており、政策保有株式による関連付けはありません。
- terms: 助言のみ。【事業の内容】の注記にSI（システムインテグレーション）、アドオン、WBS、ガントチャート、UI/UXの定義が印字されていますが、既存の用語集で足りるため、用語の追加提案はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
