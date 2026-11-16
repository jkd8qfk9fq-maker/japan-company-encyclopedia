# ＢｅｅＸ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＢｅｅＸ |
| 証券コード | 4270 |
| docID（データを取り出した文書） | `S100Y5VS` |
| 原本 docID | `S100Y5VS` |
| 提出日（原本） | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5VS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＢｅｅＸ / 4270 / docID S100Y5VS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
beex: 2 件の数値を有報XBRLと照合
有報: 株式会社ＢｅｅＸ 有価証券報告書－第10期(2025/03/01－2026/02/28) (docID S100Y5VS)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
beex: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社BeeX」が EDINET の提出者名「株式会社ＢｅｅＸ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記のうち、連結財務諸表の作成開始（注1）を financialNotes に採った。注2（自己資本利益率は連結初年度のため期末自己資本に基づき計算）と注3（従業員数は就業人員であり平均臨時雇用者数は従業員数の100分の10未満のため記載省略）は表示上の事項のため warnings に留めた。株式分割・株式併合の記載は指標注記にも本文にもない。
- businessModel: 証拠パックの警告（本文に遡及適用の記載がある）については、抽出された節と指標注記に会計方針の変更や表示方法の変更に当たる記載はなく、連結経営指標等は当期が連結初年度で前期以前の連結数値がないため、修正再表示に関する注記は書かなかった。前期有報との突合は連結系列では比較できる行がない（前期は単体のみ）。
- businessModel: 【経営方針、経営環境及び対処すべき課題等】とMD&Aの経営上の目標の指標（売上高、経常利益、自己資本比率）は投資・利益指標のため、数値目標としては本文にも perspectives にも書かなかった。MD&Aの段階利益の金額や理由、キャッシュ・フローの金額、受注高・受注残高の金額も書いていない。
- businessModel: ＡＧＣ株式会社は主要な顧客（2026年2月期の販売実績の割合12.7％）だが、related-candidates.json に候補がないため relatedCompanies には結ばず、フローと事業の説明に割合のみを記録した。
- businessStructure: 単一セグメントのため事業はクラウドソリューション事業の1つとし、セグメント注記【関連情報】の製品及びサービスごとの情報で外部顧客への売上高が開示されている3サービス（クラウドライセンスリセール、クラウドインテグレーション、MSP）を、外部売上高の大きい順に children とした。
- businessStructure: この工程の旧スキーマに合わせ suppliers は書かなかった。クラウドライセンスリセールの仕入先は【事業の内容】にAWS社、Microsoft社及びGoogle社と印字されている。
- businessStructure: 設備は、本社（東京都中央区）が単一セグメント全体の拠点であり、連結子会社スカイ３６５の本社（北海道札幌市北区）も同じ事業に属するため、特定の children には結びつけなかった。帳簿価額は書いていない。
- businessStructure: 連結子会社は株式会社スカイ３６５（議決権87.2％、2025年4月に株式を取得し子会社化）の1社。親会社は株式会社テラスカイ（被所有62.9％）であり、relatedCompanies に記録した。
- history: 沿革のうち次は省略した: 2016年9月のAmazon Partner Networkスタンダードコンサルティングパートナー認定、2017年1月のSAP PartnerEdge Serviceパートナー認定、2017年9月のSAP Co-Innovation Lab Tokyoメンバー参画、2017年10月のMicrosoft Partner Network Silver認定とAPNアドバンスドコンサルティングパートナー認定、2017年11月のAPN SAPコンピテンシー認定、2018年2月のAPNアワード受賞、2018年4月のMicrosoft Partner Network Gold認定、2018年5月の本社の日本橋2丁目への移転、2019年3月のGoogle Cloudサービスパートナー認定、2019年6月のAWS Well-Architectedパートナー認定、2020年2月のAWS MSPプログラム認定、2020年5月の本社の東銀座への移転、2020年6月のAmazon EC2 for Microsoft Windows Service Delivery認定、2020年10月のGoogle Cloud Partner Advantage SAP on Google Cloudエキスパティーズ認定とAPN Certification Distinction認定、2022年2月のAWS移行コンピテンシー認定、2022年10月のMicrosoftソリューションパートナー認定、2023年8月のAWS公共部門パートナープログラム取得、2023年10月のAWS内製化支援推進パートナー参加、2023年12月のMicrosoftソリューションパートナー追加認定、2024年11月と2025年4月のSAP PartnerEdgeコンピテンシーのスペシャライゼーション取得（認定・表彰と本社移転は事業の転機となるものだけを採った）。
- history: 資本金の金額は規則により沿革に書いていない。
- industry: 主たる業界は it とした。単一セグメントのクラウドソリューション事業は、基幹システムのクラウド移行コンサルティング・構築、運用・監視、ライセンス販売を行う情報サービス事業である。
- industry: human-resources は付けなかった。人材の確保・育成は課題として開示されているが、人材サービスとして事業開示されていないため。
- industry: DEIの別記事業は cte である。
- relatedCompanies: terrasky: 【関係会社の状況】に親会社として印字され、議決権の被所有割合62.9％、関係内容（当社サービスの提供、役員の兼任等）が明記されているため parent として結んだ。
- relatedCompanies: serverworks: 【大株主の状況】に載る事業会社（所有割合3.20％、2026年2月28日現在）であり、親会社・子会社等の区分には当たらないため major-shareholder として結んだ。
- relatedCompanies: tis: 2018年2月の資本業務提携が沿革にあるが、当期の大株主の状況に同社はなく、現在の資本関係・取引関係の印字がないため結ばなかった（提携の事実自体は沿革に記録した）。
- relatedCompanies: ntt: 資本業務提携の相手は株式会社NTTデータであり、NTT株式会社とは別法人のため結ばなかった。
- relatedCompanies: en: 「エンジニア」等の一般語の部分一致（ambiguous）のみで、エン株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: port: 「サポート」等の部分一致のみで、ポート株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: career: 「キャリア形成」等の一般語の一致のみで、株式会社キャリアとの関係の記載がないため結ばなかった。
- relatedCompanies: base-4481: 「データベース」等の部分一致のみで、ベース株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: freee: 「フリーアドレス」「フリードリンク」等の一般語の一致のみで、フリー株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」等の一般語の一致のみで、株式会社イノベーションとの関係の記載がないため結ばなかった。
- relatedCompanies: space: 「リフレッシュスペース」等の一般語の一致のみで、株式会社スペースとの関係の記載がないため結ばなかった。
- relatedCompanies: tear: AWSパートナーの「ティア（階層）」の記載のみで、株式会社ティアとの関係の記載がないため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」等の部分一致のみで、レック株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: cube: 「テレキューブ」等の部分一致のみで、株式会社キューブとの関係の記載がないため結ばなかった。
- relatedCompanies: nissin: 新株予約権の条文中の部分一致のみで、同社はコードリストになく、関係の記載もないため結ばなかった。
- relatedCompanies: ray: 「レイアウト」等の部分一致（ambiguous）のみで、株式会社レイとの関係の記載がないため結ばなかった。
- relatedCompanies: system-integrator: 「システムインテグレーター」という一般語の記載のみで、株式会社システムインテグレータとの関係の記載がないため結ばなかった。
- relatedCompanies: the-lead: 「リード」等の一般語の一致のみで、株式会社リードとの関係の記載がないため結ばなかった。
- relatedCompanies: vision: 経営理念の「ビジョン」という一般語の一致のみで、株式会社ビジョンとの関係の記載がないため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス」の記載のみで、株式会社コロナとの関係の記載がないため結ばなかった。
- relatedCompanies: cover: 「カバーできない工数」という一般語の一致のみで、カバー株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: daiwa: 新株予約権の割当先として大和証券の印字があるのみで、株式会社大和とは別法人であり、取引・提携の記載もないため結ばなかった。
- relatedCompanies: insight: Microsoft Partner Networkの説明中の「インサイト」という一般語の一致のみで、株式会社インサイトとの関係の記載がないため結ばなかった。
- relatedCompanies: king: 「クラッキング」等の部分一致のみで、株式会社キングとの関係の記載がないため結ばなかった。
- relatedCompanies: kitalive: 役員の兼職先としての印字のみで、株式会社キットアライブとの取引・提携の記載がないため結ばなかった。
- relatedCompanies: kohsoku: 「高速化」という一般語の一致（ambiguous）のみで、株式会社高速との関係の記載がないため結ばなかった。
- relatedCompanies: rent: 「フリーレント」等の部分一致のみで、株式会社レントとの関係の記載がないため結ばなかった。
- relatedCompanies: secure: 「セキュアな」という一般語の一致のみで、株式会社セキュアとの関係の記載がないため結ばなかった。
- relatedCompanies: 候補にない相手: ＡＧＣ株式会社は主要な顧客（販売実績の割合12.7％）だが候補にないため結ばなかった。株式会社NTTデータ（2018年8月に資本業務提携）は候補になく、同社は上場区分が非上場のため結ばなかった。連結子会社スカイ３６５は自社の子会社のため結ばない。【株式の保有状況】の特定投資株式は該当事項なし。
- terms: 用語の助言：「クラウドインテグレーション」（基幹システムの基盤環境をオンプレミスからクラウドへ移行するためのコンサルティング・設計・構築・移行を行うサービス）、「MSP（マネージドサービスプロバイダ）」（顧客企業のクラウド環境の監視・運用保守を代行するサービス）、「クラウドライセンスリセール」（クラウドベンダーからライセンスを仕入れて顧客企業に販売し月額課金の請求代行を行うサービス）、「フロー売上／ストック売上」（同社の収益区分。フローはコンサルティングや構築などの一過性の売上、ストックは運用代行やライセンス販売などの継続的な売上）、「SAP BASIS」（SAP ERPが稼働する基盤となるミドルウエアコンポーネント）、「BeeX Service Console」（同社のSaaS型の運用管理者向けポータルサービス）、「BeeX Plus」（MSPとクラウドライセンスリセールにセキュリティソリューションを組み合わせた同社のサービスパッケージ）、「マルチクラウド」（複数のクラウドサービスを適材適所に使い分ける利用形態）、「オンプレミス」（顧客企業が情報システムを自社設備で保有・運用する形態）は、この会社の説明に繰り返し現れる中心用語である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
