# エニグモ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エニグモ |
| 証券コード | 3665 |
| docID（データを取り出した文書） | `S100Y0WP` |
| 原本 docID | `S100Y0WP` |
| 提出日（原本） | 2026-04-27 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y0WP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エニグモ / 3665 / docID S100Y0WP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
enigmo: 4 件の数値を有報XBRLと照合
有報: 株式会社エニグモ 有価証券報告書－第22期(2025/02/01－2026/01/31) (docID S100Y0WP)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
すべて一致しました。
enigmo: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは、売上高・純利益・利益・総資産・純資産・従業員数の6系列すべてで差異がなかった（重複する年度の照合で一致）。訂正有報はなく、当期有報が有効文書である。
- businessModel: financialNotesには2件入れた。主要な経営指標等の注記1（第21期より連結財務諸表を作成）に基づく2025年1月期の注記と、注記3（法人税等に関する会計基準を第22期の期首から適用し遡及適用）に基づく2026年1月期の注記である。注記2（希薄化効果を有する潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していないこと）は決算の基礎の変更ではないため入れていない。
- businessModel: 報告セグメントは前連結会計年度より、従来の「ソーシャルコマース事業」の単一セグメントから「Fashion Platform事業」「Travel Platform事業」の2区分に変更されている。前期の数値も新しい区分で印字されており、経営指標の基礎の変更ではないため、financialNotesには入れず、この記録にとどめる。
- businessModel: 株式会社ゲツラクの連結子会社化（みなし取得日2025年10月31日）は当期中の出来事であり、期末の構造と数値に反映済みのためneedsReviewには入れていない。Formal Trans LLCの連結子会社化は前期（2025年2月）の出来事である。
- businessModel: 決算日後の2026年2月18日に、保有する投資有価証券の売却を取締役会で決議し、一部を売却したことが重要な後発事象として印字されている。資本政策・財務上の事項であり、事業構造の変更ではないため、needsReviewには入れず、この記録にとどめる。金額は書いていない。
- businessModel: 本文には売上高と親会社株主に帰属する当期純利益だけを書き、段階利益の金額・増減率や理由、総資産・純資産の金額、キャッシュ・フローの金額、設備の帳簿価額は書いていない。「BUYMA」の商品総取扱高は売上高ではないため金額を書いていない。
- businessModel: perspectivesのindustryPositionは、市場における順位やシェアの印字がないため省いた。経営方針に印字された数値目標（利益率など）は書いていない。
- businessModel: Wikipediaは記事が見つからなかった（wikipedia.json: found false）ため、補足には使っていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（Fashion Platform事業5,373,502千円、Travel Platform事業906,651千円）とし、報告セグメントに含まれない「その他」（15,710千円）は最後に置いた。
- businessStructure: 売上高を百万円へ切り捨てると、Fashion Platform事業5,373百万円、Travel Platform事業906百万円、その他15百万円の合計は6,294百万円となり、印字の売上高6,295百万円と1百万円の差がある。切り捨てによる差として記録する。なお千円単位では各区分の印字の合計（6,295,863千円）が連結の印字（6,295,864千円）と1千円異なるが、これは有報の印字そのままである。
- businessStructure: MD&Aのセグメント別売上高（Fashion Platform事業5,375,052千円）はセグメント間の内部売上高を含む数値のため使わず、セグメント注記の外部顧客への売上高を使った。
- businessStructure: 拠点と事業の対応は設備表のセグメント欄どおりとした（提出会社本社＝Fashion Platform事業、株式会社BUYMA TRAVEL＝Travel Platform事業、株式会社ゲツラク＝その他、在外子会社4社＝Travel Platform事業）。帳簿価額は書いていない。
- businessStructure: 株式会社ゲツラクは2025年9月に株式を追加取得して連結子会社化された（みなし取得日2025年10月31日、同社の11月1日以降の業績を集計）。当期中の出来事で期末の構造に反映済みのため、needsReviewには入れていない。
- businessStructure: 連結子会社のうち株式会社BUYMA TRAVEL、MMS Guam Corporation、MMS Activity Corporation、Formal Trans LLC、株式会社ゲツラクが債務超過会社である旨が【関係会社の状況】の注記に印字されている。金額は書かず、事実だけを記録する。
- businessStructure: suppliersキーはこのツリーの旧スキーマに無いため省略した。個別の仕入先の社名は【事業の内容】に印字されていない。
- history: 沿革の表は年月と事象が対応して印字されており、行順で対応づけた。年だけを使い、月は書いていない。資本金の金額は沿革に印字がなく、書いていない。
- history: 省いた項目: 本社移転（2006年・2007年・2010年・2017年・2025年）、プロモーションシステム「プレスブログ」の開始（2005年）、消費者参加型CM制作ネットワーク「filmo」の開始（2007年）、プライバシーマークの付与認定（2009年）、「BUYMA」へのサービスリニューアル（2010年）、米国Image Network社との資本・業務提携（2012年）、韓国株式会社エニグモコリアへの出資（2013年）、株式会社stulioへの出資（2013年）、「BUYMA Books」の開始（2014年）、ロケットベンチャー株式会社の完全子会社化（2015年）とその全株式譲渡・連結除外（2018年）、株式会社エニグモコリアの連結子会社化（2016年）、「BUYMA KOREA」の「GLOBAL BUYMA」への統合（2017年）、株式会社MEGURU（現株式会社BUYMA TRAVEL）への出資（2021年）、株式会社ゲツラクへの出資（2023年）、Non Brokers株式会社（現HOUSE REVO株式会社）への出資（2024年）。
- history: 2024年の株式会社BUYMA TRAVELの連結子会社化（5月）と会社分割による事業承継（8月）は、同じ年の一連の出来事として1項目にまとめた。
- industry: 主たる業界は it とした。売上の大半を占めるFashion Platform事業は、インターネット上のマーケットプレイスというプラットフォームの運営そのものが事業の実体であり、会社は商品を仕入れて販売する小売ではないため、閉じた分類では it が最も近い。同様のCtoCマーケットプレイスを含むインターネットサービスを it とした先例（minne等を含むインターネットサービス事業者）に揃えた。直接当てはまると判断し、taxonomyGapsは記録していない。
- industry: Travel Platform事業もプラットフォームの運営が中心であり、現地アクティビティサービスは同じセグメントの中で金額が独立して開示されていないため、副分類は付けなかった。
- relatedCompanies: sony-group（ソニーグループ）: 【関係会社の状況】の「その他の関係会社」の区分どおりに結んだ。大株主の状況でも25.2％の筆頭株主である。
- relatedCompanies: ai-robotics（Aiロボティクス）: 特定投資株式の保有目的が同社個別の記述（AIを活用したD2Cブランド事業を展開しており、新規事業分野における提携や情報交換を目的として保有）であり、全銘柄共通の定型句ではないため、提携を目的とする保有としてbusiness-partnerで結んだ。計上額は書いていない。
- relatedCompanies: ray（レイ）: ambiguousな候補で、「スペシャルティマーケットプレイス」などの一般語の部分一致のみであり、株式会社レイとの関係の記載はないため結ばなかった。
- relatedCompanies: port（ポート）: 「サポート」という一般語の部分一致のみで、ポート株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: corona（コロナ）: 「コロナ前水準」など新型コロナウイルス感染症に関する一般語の一致のみで、株式会社コロナとの関係の記載はないため結ばなかった。
- relatedCompanies: seki（セキ）: ambiguousな候補で、「セキュリティ」という一般語の部分一致のみであり、セキ株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: land（ランド）: 「ブランド」という一般語の部分一致のみで、株式会社ランドとの関係の記載はないため結ばなかった。
- relatedCompanies: nissin（日新）: コードリストにない候補で、新株予約権の行使期間の表記などの部分一致のみであり、株式会社日新との関係の記載はないため結ばなかった。
- relatedCompanies: cota（コタ）: ambiguousな候補で、信託の名称「コタエル信託」の部分一致のみであり、コタ株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: career（キャリア）: 「キャリア開発」という一般語の一致のみで、株式会社キャリアとの関係の記載はないため結ばなかった。
- relatedCompanies: en（エン）: ambiguousな候補で、「エンジン」などの部分一致のみであり、エン株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: quest（クエスト）: 「リクエスト機能」というサービス機能名の部分一致のみで、株式会社クエストとの関係の記載はないため結ばなかった。
- relatedCompanies: zero（ゼロ）: ambiguousな候補で、「カーボンネットゼロ」という一般語の一致のみであり、株式会社ゼロとの関係の記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「営業利益ベース」という一般語の一致のみで、株式会社ベースとの関係の記載はないため結ばなかった。
- relatedCompanies: cover（カバー）: 「カバーすることができる」という一般語の一致のみで、カバー株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: space（スペース）: イベントスペース「BUYMA studio」の部分一致のみで、株式会社スペースとの関係の記載はないため結ばなかった。
- relatedCompanies: trust（トラスト）: コードリストにない候補で、大株主の日本マスタートラスト信託銀行（信託口）という信託口の名称の部分一致のみであり、純投資の信託口であるため結ばなかった。
- relatedCompanies: vision（ビジョン）: 「ビジョンである」という一般語の一致のみで、株式会社ビジョンとの関係の記載はないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 連結子会社6社（株式会社BUYMA TRAVEL、MMS Guam Corporation、MMS Activity Corporation、Sea Eagle Diving Adventures, Corporation、Formal Trans LLC、株式会社ゲツラク）は自社の子会社であり結ばない。大株主のうち個人株主とSMBC日興証券株式会社は事業会社としての関係の印字がないため結ばなかった。
- terms: 助言: 用語「BUYMA」は、当社が運営するファッションアイテムのCtoC型マーケットプレイスのサービス名で、【事業の内容】に説明が印字されています。
- terms: 助言: 用語「パーソナルショッパー」は、「BUYMA」に出品し、注文を受けて現地で買い付けを行う出品者を指し、主に海外在住の日本人が登録していることが【事業の内容】に印字されています。
- terms: 助言: 用語「“Specialty” Marketplace（スペシャルティマーケットプレイス）」は、嗜好性の高いモノ・サービスを扱うために、ある分野に特化した専門性の高いマーケットプレイスを指す当社の概念で、【事業の内容】に定義が印字されています。
- terms: 助言: 用語「BUYMA TRAVEL」は、海外在住の日本人ガイドがプライベートツアーを提供するCtoC型の旅行プラットフォームのサービス名で、【事業の内容】に説明が印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
