# マクアケ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社マクアケ |
| 証券コード | 4479 |
| docID（データを取り出した文書） | `S100X9BR` |
| 原本 docID | `S100X9BR` |
| 提出日（原本） | 2025-12-10 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X9BR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社マクアケ / 4479 / docID S100X9BR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
makuake: 10 件の数値を有報XBRLと照合
有報: 株式会社マクアケ 有価証券報告書－第13期(2024/10/01－2025/09/30) (docID S100X9BR)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
makuake: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との遡及照合は全系列で差異ゼロでした。訂正有価証券報告書はなく、重要な後発事象も「該当事項はありません」と印字されています。
- businessModel: 指標の注記のうち、収益認識に関する会計基準の適用（第10期の期首から）のみを financialNote にしました。配当を実施していないこと、潜在株式があるものの損失のため希薄化後指標を記載していないこと、従業員数の数え方、株価の市場名の変更と株主総利回りの比較指標の変更は表示事項のため warnings のみにしています。
- businessModel: 経営指標として開示されている取扱高・応援購入総額・掲載開始数・アクセスUU・会員数の金額や件数は本文に書いていません。リピート購入割合の水準のみ、事業の特徴として本文と perspectives に記載しています。
- businessModel: MD&Aの段階利益の金額と理由、キャッシュ・フローの金額、総資産・純資産の金額、減損損失の金額は書いていません。
- businessModel: 【関係会社の状況】の注記にある関連会社１社は、当事業年度において全株式を売却したもので、名称の開示がないため関連企業には結んでいません。
- businessStructure: 単一セグメント（応援購入サービス事業）のため、事業は１つだけ登録しました。子区分の金額はセグメント注記ではなく、MD&Aの販売実績の印字（Makuake 3,301,612千円、Makuake Incubation Studio 78,531千円、その他 1,197,854千円。３区分の合計が売上高4,577,997千円と一致）によります。百万円への切り捨てでは内訳の合計が4,576百万円となり、売上高の4,577百万円と１百万円の差が出ますが、切り捨てによるもので印字どおりに書いています。
- businessStructure: 主要な販売先については、総販売実績に対する割合が100分の10以上の相手先がないため記載を省略している旨が印字されており、customers は顧客の種類だけにしています。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。個別に印字された仕入先はありません。
- businessStructure: 設備は本社（東京都目黒区）のみで、単一セグメントの全社設備のため特定の子区分には結びつけていません。帳簿価額・賃借料は書いていません。
- businessStructure: 親会社の株式会社サイバーエージェントとの関係は relatedCompanies に記載しています。
- history: 沿革のうち、拠点の設立（関西支社2015年、北海道2018年、九州2018年、名古屋2020年、韓国2021年、中四国2021年、北陸2022年）、2018年の渋谷への本社移転、Makuakeアナリティクス（2015年）、Makuakeガバメント（2018年）、Makuake STOREのリニューアル（2022年）、Makuake Incubation Studioのメニュー追加（2023年・2024年）、池田泉州ホールディングスのデジタルバンク事業への参画自体（2024年）、マクアケプロシェアリング（2024年）は省きました。
- history: 個別の業務提携の開始（みずほ銀行2016年、Wadiz Corp.2018年、NCネットワーク2019年、ライトアップ2019年、citiesocial 2019年、udnグループ2019年、ソウル産業振興院2020年、BREW株式会社2022年、中小企業流通センター2023年、MicroAd Taiwan, Ltd.2023年）と、日本酒の酒蔵100社突破・金融機関との連携100社突破（2019年）は省きました。Indiegogoとの提携は Makuake Global の項目に併記しています。
- history: 資本金の金額は沿革に書いていません。年月は印字されていますが、年だけを登録しています。
- industry: 応援購入サービス事業の単一セグメント（インターネット上のマッチングプラットフォームの運営）が全社の事業のため it を primary にしました。
- industry: retail は付けていません。当社は商品を自ら販売するのではなく、先行販売の場を提供して手数料を受け取るモデルであり、Makuake STORE・Makuake SHOP も付随サービスで独立した金額開示がないためです。media・entertainment も、コンテンツの権利はプロジェクト実行者が持つため付けていません。
- relatedCompanies: senshu-ikeda-holdings: 【沿革】に、株式会社池田泉州ホールディングスによる法人向けデジタルバンク事業への参画（2024年）と、同事業「01Bank」の開業（2025年）の記載があるのみで、取引・提携の文言による関係の記載がないため結んでいません。
- relatedCompanies: port: 「サポート手数料」などに含まれる部分文字列への一致のみで、ポート株式会社への言及ではありません。
- relatedCompanies: vision: 会社のビジョンを述べる一般語への一致のみで、株式会社ビジョンへの言及ではありません。
- relatedCompanies: insight: 自社サービス「Makuakeインサイト」の名称への一致のみで、株式会社インサイトへの言及ではありません。
- relatedCompanies: en: ambiguous な候補で、「エンジニア」等の一般語への一致のみです。
- relatedCompanies: rent: 「タレント」という一般語への一致のみです。
- relatedCompanies: career: 「キャリア」という一般語への一致のみです。
- relatedCompanies: core: ambiguous な候補で、「コアコンピタンス」という一般語への一致のみです。
- relatedCompanies: land: 「ブランド」という一般語への一致のみです。
- relatedCompanies: nissin: コードリストになく、新株予約権の脚注中の文字列への一致のみで曖昧です。
- relatedCompanies: ray: 「マーケットプレイス」に含まれる文字列への一致のみで曖昧です。
- relatedCompanies: secure: 「3Dセキュア」という決済用語への一致のみです。
- relatedCompanies: zero: 「ゼロにしつつ」という一般語への一致のみで曖昧です。
- relatedCompanies: corona: 「新型コロナウイルス感染症」という一般語への一致のみです。
- relatedCompanies: daiwa: 大和証券株式会社は、大株主であるKSK ANGEL FUND, LLCの常任代理人として記載されているのみで、当社との取引・資本関係の記載はありません。
- relatedCompanies: freee: 「フリーレント」という賃貸用語への一致のみです。
- relatedCompanies: gmo-payment-gateway: 【主な資産及び負債の内容】の未払金の相手先内訳に名称が現れるのみで、取引・提携の内容の記載がないため結んでいません。
- relatedCompanies: medix: 未払金の相手先内訳に名称が現れるのみで、取引・提携の内容の記載がないため結んでいません。
- relatedCompanies: microad: 業務提携の相手は株式会社マイクロアドの台湾法人MicroAd Taiwan, Ltd.であり、候補である株式会社マイクロアド自身との取引・提携の記載がなく、当期の取引の記載もないため結んでいません。
- relatedCompanies: nikon: 「ニコンプライアンス委員会」という当社の委員会の名称に含まれる文字列への一致のみです。
- relatedCompanies: trust: コードリストになく、日本マスタートラスト信託銀行株式会社は信託受託者として【大株主の状況】に記載されているのみで、事業会社としての関係の記載はありません。
- relatedCompanies: writeup: 2019年に補助金取得サポートに関する業務提携を開始した旨が【沿革】にあるのみで、当期の取引関係の記載がないため結んでいません。
- relatedCompanies: 候補にないため結んでいない相手: 株式会社みずほ銀行（2016年のビジネスマッチング提携）、Wadiz Corp.、Indiegogo, Inc.などです。
- relatedCompanies: 【関係会社の状況】の注記にある関連会社１社は当事業年度に全株式を売却済みで、名称の開示もないため結んでいません。
- relatedCompanies: 政策保有株式は非上場株式のみで銘柄名の開示がなく、特定投資株式は「該当事項はありません」と印字されているため、政策保有によるリンクはありません。
- terms: 助言のみ。本文で使った用語の候補: 応援購入（新商品や新サービスへの先行購入）、プロジェクト実行者、プロジェクトサポーター、キュレーター（掲載前からリターンの提供完了まで実行者を支援する当社のコンサルタント）、All-in方式・All or Nothing方式（応援購入金額の実行者への提供方式）、０次流通市場（一般の流通に出回る前の流通市場）、取扱高（応援購入金額の総額と安心システム利用料の合計額）、インキュベーションサービス（新事業を創出するための支援業務）です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
