# フレクト — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社フレクト |
| 証券コード | 4414 |
| docID（データを取り出した文書） | `S100YG80` |
| 原本 docID | `S100YG80` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG80.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社フレクト / 4414 / docID S100YG80（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
flect: 10 件の数値を有報XBRLと照合
有報: 株式会社フレクト 有価証券報告書－第21期(2025/04/01－2026/03/31) (docID S100YG80)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
flect: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記のうち、注４（2021年９月28日付と2024年４月１日付の株式分割）を financialNotes と needsReview に採った。注１（連結財務諸表を作成していないため連結指標を記載していない）、注２（配当を実施していない）、注３（従業員数は就業人員）、注５（2021年12月10日のマザーズ上場）、注６（株主総利回りの比較指標の変更）、注７（最高・最低株価の市場区分）、注８（役員報酬BIP信託及び株式付与ESOP信託に残存する自社株式の取扱い）、注９（第17期から第19期まで関係会社が存在しなかった）は表示上の事項のため warnings に留めた。
- businessModel: 証拠パックの「財務諸表の組替え」の注意については、表示方法の変更の注記が該当する（前事業年度に独立掲記していた「投資その他の資産」の「敷金」と「流動負債」の「未払消費税等」を当事業年度より「その他」に含めて表示し、前事業年度の財務諸表を組み替えたもの）。表示上の組替えのみで登録する指標への影響はなく、前期有報との修正再表示チェックも全系列で差異がなかったため、financialNote には記録しなかった。
- businessModel: 経営上の目標の達成状況を判断するための客観的な指標（売上総利益率、四半期契約顧客数、顧客当たりの四半期平均売上高ARPA）については、利益率にあたる売上総利益率やARPAの目標値は本文・戦略に書いていない。四半期契約顧客数70社は当事業年度の実績値としてのみ記載した。
- businessModel: 当期純利益の減少理由は、印字が特別損失（関係会社株式評価損）や法人税等の内訳に触れるため本文には書いていない。売上総利益・営業利益・経常利益の金額や増減理由、キャッシュ・フローの金額も書いていない。
- businessModel: 当事業年度の自己株式の取得は資本政策の手続きのため warnings に留めた（金額は書いていない）。
- businessModel: 【重要な後発事象】は該当事項なしのため、期間後の出来事として登録・確認に回すものはない。
- businessStructure: 単一セグメントのため、製品・サービス別の金額開示はなく（販売実績も事業合計のみ）、子事業には金額を書いていない。
- businessStructure: 主要な設備は本社（東京都港区）のみで単一セグメントのため、特定の子事業に結びつけていない。帳簿価額・賃借料は書いていない。
- businessStructure: 車両管理IoTサービス「Cariot」は2024年10月に株式会社ソラコムとの合弁会社である株式会社キャリオットへ分社化され、当事業年度末現在は持分法適用関連会社の事業であるため、自社の事業には含めていない。
- businessStructure: suppliers は本ツリーの旧スキーマに合わせ省略した。買掛金の相手先として印字される外注先（ケアリッツ・テクノロジーズ株式会社、株式会社アヴァンザ、レバテック株式会社など）は未上場で関連企業の候補にもないため、関連企業には結んでいない。
- history: 省略したもの: 本店移転（2012年渋谷区恵比寿、2015年中央区京橋、2020年千代田区内幸町、2022年港区芝浦、2025年港区東新橋）、第三者割当増資（2015年・2018年のsalesforce.com, inc.（現Salesforce, Inc.）を引受先とするもの、2018年のDraper Nexusのファンドを引受先とするもの。資本に関する事象のため）、受賞歴（Salesforce Partner Award特別賞（2015年）、Innovation Partner of the Year（2018年・2020年）、Salesforce Partner Innovation Awards 2019、Japan Partner of the Year（2024年・2025年）、SORACOM SPS Partner Award 2017年間最優秀パートナー、MuleSoft Japan Partner Enablement Award（2022年・2023年）、SPSアワード2023ビジネス・パートナー・オブ・ザ・イヤー、Service Delivery Partner of the Year Auth0（2025年））、Tableau Software, LLCとのパートナー契約（2021年）、Amazon Chime SDK and Chime Voice Connector Partners認定（2021年）、ISMS認証取得（2024年）、ISO9001認証取得（2025年）。
- history: 設立時の資本金額は規則により書いていない。沿革表は年月と事象が一体の印字のため、年だけを取り出して記録した。
- industry: 主たる業界は it とした。単一セグメントのクラウドソリューション事業は、複数のクラウドプラットフォームを組み合わせたプラットフォーム構築とアプリケーション開発を行う情報サービスである。
- industry: telecommunications は付けなかった。IoTサービスはアプリケーションの開発提供であり、通信そのものの提供ではないため。
- industry: DEIの別記事業は CTE である。
- relatedCompanies: en（エン株式会社）: 「顧客エンゲージメント」など一般語の部分一致のみで、相手についての印字がないため結ばなかった（ambiguous）。
- relatedCompanies: seki（セキ株式会社）: 「情報セキュリティ」などの部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: nissin（株式会社日新）: コードリストになく、新株予約権の文脈の部分一致のみのため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「コーポレートビジョン」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: step（株式会社ステップ）: 「攻めのDXのステップ」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「支出額ベース」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリアアップ」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: core（株式会社コア）: 「エンゲージメントスコア」の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: create（クリエイト株式会社）: 印字されているのは外注先の株式会社ソフトクリエイトであり、クリエイト株式会社とは別法人のため結ばなかった。
- relatedCompanies: daiwa（株式会社大和）: 新株予約権の割当先である大和証券の文脈のみで、株式会社大和についての印字ではないため結ばなかった。
- relatedCompanies: garden（株式会社ガーデン）: 建物名「日本生命丸の内ガーデンタワー」の部分一致のみのため結ばなかった。
- relatedCompanies: ntt（NTT株式会社）: 印字されているのは調査の出典である株式会社NTTデータ経営研究所であり、NTT株式会社とは別法人のため結ばなかった（代替もしない）。
- relatedCompanies: port（ポート株式会社）: 「サポート」の部分一致のみのため結ばなかった。
- relatedCompanies: rhythm（リズム株式会社）: OR（オペレーションズ・リサーチ）の説明文脈の部分一致のみのため結ばなかった。
- relatedCompanies: sekisui-house（積水ハウス株式会社）: 印字されているのは売掛金の相手先内訳にある積水ハウス不動産ホールディングス株式会社であり、積水ハウス株式会社とは別法人のため結ばなかった（親会社への代替はしない）。
- relatedCompanies: space（株式会社スペース）: 「SORACOMパートナースペース」の部分一致のみのため結ばなかった。
- relatedCompanies: technologies（株式会社テクノロジーズ）: 印字されているのは買掛金の相手先であるケアリッツ・テクノロジーズ株式会社であり、別法人のため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: コードリストになく、日本マスタートラスト信託銀行（信託口）の文脈のみのため結ばなかった。
- relatedCompanies: 候補一覧にない相手は結んでいない。株式会社キャリオットは自社の持分法適用関連会社のため結ばなかった。Salesforce, Inc.は【大株主の状況】に載る事業会社（2026年3月31日現在5.09％）で、沿革にも第三者割当増資の引受先として印字されるが、候補一覧にないため結ばなかった（パートナー契約の相手は未上場の株式会社セールスフォース・ジャパン）。ANAシステムズ株式会社は主な相手先（販売実績の割合13.0％）だが未上場で候補一覧にないため、businessStructure の customers に名称のみ記載した。合同会社クロ（同53.34％）は未上場の合同会社のため結ばなかった。【株式の保有状況】は該当事項なしで、政策保有株式はない。
- terms: 用語の助言：「マルチクラウド・インテグレーター」は、SalesforceやAmazon Web Servicesなど複数のクラウドプラットフォームを組み合わせて企業のDXを支援する同社の事業形態の呼称です。「攻めのDX」は、新しい顧客体験の創出を目指すDXを指す同社の言い方です。「Cariot（キャリオット）」は車両管理IoTサービスの名称で、現在は合弁会社の株式会社キャリオットが提供しています。これらはいずれもこの会社の文脈でのみ用いるのが適切です。

## 要確認（status に反映）

- businessModel: 2021年９月28日付及び2024年４月１日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第17期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2021年９月28日付及び2024年４月１日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第17期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
