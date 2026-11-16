# マイクロアド — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社マイクロアド |
| 証券コード | 9553 |
| docID（データを取り出した文書） | `S100XDI6` |
| 原本 docID | `S100XBWH` |
| 提出日（原本） | 2025-12-19 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | S100XDI6／有効文書 S100XDI6（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XDI6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社マイクロアド / 9553 / docID S100XBWH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
microad: 10 件の数値を有報XBRLと照合
有報: 株式会社マイクロアド 訂正有価証券報告書－第19期(2024/10/01－2025/09/30) (docID S100XDI6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第19期(2024/10/01－2025/09/30)、docID S100XDI6）を有効文書としてこのパックを作った。原本は docID S100XBWH。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはIndependentAuditorsReportNonConsolidatedTextBlock・KeyAuditMattersNonConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
microad: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書（S100XDI6）を有効文書として採用した。分類は record-only で、財務の数値も本文も原本（S100XBWH）と同一であり、異なるのは独立監査人の報告書（個別）と監査上の主要な検討事項（個別）のテキストブロックのみ（エントリーが引用しない節）のため、needsReview にはせず、出典は訂正報告書の値で記載した。
- businessModel: 経営指標等の注記のうち、第15期の親会社株主に帰属する当期純損失の発生要因（データセンター移行に伴う一時的な費用）の説明は損失の理由の説明にあたるため financialNotes には書かず、ここに記録する。潜在株式調整後の数値を記載しない理由や自己資本比率等の表示に関する注記も表示事項として扱い、financialNotes には書いていない。
- businessModel: MD&Aが述べる当期純利益の増減要因（繰延税金資産の計上に伴う法人税等調整額、投資有価証券評価損、ソフトウエアの減損）は利益項目の金額と理由にあたるため本文には書かず、ここに記録する。
- businessModel: 経営指標として重視する「UNIVERSE」の稼働アカウント数（発注件数）は経営指標の実績値であり、本文・戦略には数値を書かず、重視している事実のみを戦略に記載した。
- businessModel: デジタルサイネージサービスの売上高は独立して開示されておらず、データプロダクトサービスの内訳としてのみ記載した。金額のない区分に金額は書いていない。
- businessStructure: 報告セグメントはデータプラットフォーム事業の単一セグメントであり、事業の内訳はセグメント関連情報の製品及びサービスごとの情報（外部顧客への売上高）に基づき、金額の大きいコンサルティングサービス、データプロダクトサービスの順に並べた。
- businessStructure: 株式会社MADSは2024年10月31日付の株式の一部譲渡により連結子会社から持分法適用会社となった（当期中の異動であり、期末現在の構造で登録）。デジタルサイネージサービスはMADSが提供する旨を事業の内容が明記するため、データプロダクトサービスの子区分として記載した。
- businessStructure: 連結子会社は15社（株式会社エンハンス、株式会社cory、株式会社UNCOVER TRUTH、MicroAd Taiwan, Ltd.等）。このうちMicroAd Technology Development(Shenyang), Ltd.、MicroAd India Private Limited、Tiki Digital, Co., Ltd.は清算中である旨が関係会社の状況に注記されている。
- businessStructure: サプライヤー: データは225の外部データ保有企業・メディアから収集・集約している旨の総数の記載のみで、個別の仕入先名は開示されていないため、suppliers は旧スキーマに従い省略し、事実のみここに記録する。
- history: 沿革表は2021年7月に事象文のない行があり、2022年2月・3月の2か月に対して事象文が3件（東京本社の渋谷区桜丘町への移転、子会社マイクロアドプラスの吸収合併、Tiki Digital, Co., Ltd.の設立）続く崩れた表になっている。いずれも本社移転・自社子会社の再編という軽微な事象であり、対応づけを確定できないため3件とも落とした。
- history: 落とした項目: 本社移転（2008年・2010年・2016年）、支社・営業所の開設（大阪・福岡・名古屋・広島・仙台・北海道）、海外子会社の設立（香港2008年、台湾・瀋陽2009年、シンガポール2012年、ベトナム2016年）、受賞（2013年）、マイクロアドプラスの設立（2011年）、CCCマーケティングとの資本業務提携（2015年）、SCSKとの資本業務提携（2021年）、業種別プロダクトの個別の提供開始（IGNITION・Pantry・UNIVERSE Ads・シラレル・IASO・Circus・まちあげ・マーブル等）、CVC事業の開始と個別の資本業務提携（Payke・Hagakure・Tabi Life・ecbo・ホリデー・AirX・Ocean等）、マイクロアドベンチャーズの設立（2024年）、IZULCAの合弁設立（2025年）。資本金の金額は沿革に書いていない。
- history: 株式分割（2022年4月1日付1株につき2株、2023年10月1日付1株につき3株）は経営指標等の注記に記載される自社の分割であり、沿革ではなく businessModel の needsReview に記録した。
- industry: 主たる業界は it とした。単一セグメントのデータプラットフォーム事業は、消費行動データの蓄積・分析基盤と広告配信プラットフォームを自社開発し、ソフトウェアとして提供する事業であり、IT・ソフトウェアに直接当てはまるため暫定とはしなかった。
- industry: 副業界として media を付けた。コンサルティングサービス（2025年9月期の外部顧客への売上高8,679百万円）には、インターネットメディアの広告枠を預かり広告収益の最大化を支援するメディア向けコンサルティングサービスと、デジタルサイネージ広告の配信が含まれ、広告メディアの運営支援にあたるためである。
- industry: CVC事業（子会社マイクロアドベンチャーズ）やIPを活用した物販事業は金額が独立して開示されていないため、finance や retail は付けなかった。
- relatedCompanies: 結んだのは上記2社のみ。cyberagent は関係会社の状況の区分（その他の関係会社）どおりとし、説明には金額を書いていない。logly は特定投資株式の唯一の銘柄で、保有目的が資本業務提携と取引関係を個別に述べるものだったため business-partner とした（定型文のみの相手は結ばない原則の例外ではなく、個別記載に基づく判断）。
- relatedCompanies: softbank（ソフトバンク）: 沿革に2016年4月の資本業務提携が記載されるのみで、現在の事業内容や関係会社の状況に同社との取引の記載がなく、過去の提携にとどまるため結ばなかった。沿革の事実としては history に記録した。
- relatedCompanies: scsk（SCSK）: 沿革に2021年3月の資本業務提携が記載されるが、候補の listing が「コードリストにない」ため結ばなかった。
- relatedCompanies: dentsu-group（電通グループ）: MD&A・経営方針で広告費統計の出典として引用されるのみで、取引・提携の記載がないため結ばなかった。
- relatedCompanies: tokyu（東急）: 沿革の「株式会社東急エージェンシー」は東急とは別の法人であり、部分一致のため結ばなかった。
- relatedCompanies: 自社の連結子会社（エンハンス、cory、UNCOVER TRUTH等15社）と持分法適用会社（MADS、IZULCA）は自社の子会社・関連会社であるため結ばない。MADSは関係会社の状況に記載されるが規則により除外した。
- relatedCompanies: en（エン）、land（ランド）、adventure（アドベンチャー）、port（ポート）、seki（セキ）、rhythm（リズム）、quest（クエスト）、vision（ビジョン）、ray（レイ）、zero（ゼロ）、tein（テイン）、nissin（日新）: いずれも一般語・製品名・自社子会社名（マイクロアドベンチャーズ）の部分一致であり、相手についての取引・提携の記載がないため結ばなかった。
- terms: 用語の助言: 「UNIVERSE」とは、当社のデータプラットフォームの総称で、消費行動データを蓄積・分析する「UNIVERSE DATA PLATFORM」と、そのデータを活用して広告配信を行う「UNIVERSE Ads」の2つのプラットフォームで構成されます。「RTB（Real Time Bidding）」とは、広告枠の表示ごとにオークション形式で広告を選び配信する仕組みです。「DSP」とは広告主側の広告配信プラットフォーム、「SSP」とはメディア側の広告枠販売・収益最大化を支援するプラットフォームを指します。「デジタルサイネージ」とは、屋外・店頭・交通機関等で電子的な表示機器を使って情報を発信するメディアの総称で、「MONOLITHS」は持分法適用会社のMADSが提供するその配信管理システムの名称です。「稼働アカウント数（発注件数）」とは、UNIVERSEを利用する企業が月ごとに発注申し込みを行った件数を数える、当社が重視する経営指標です。

## 要確認（status に反映）

- businessModel: 当社は、2022年４月１日付で普通株式１株につき２株の株式分割を、2023年10月１日付で普通株式１株につき３株の株式分割を行っています（経営指標等の注記に記載）。本登録は2025年９月30日現在の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
