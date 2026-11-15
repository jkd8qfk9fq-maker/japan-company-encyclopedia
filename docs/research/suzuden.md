# スズデン — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | スズデン株式会社 |
| 証券コード | 7480 |
| docID（データを取り出した文書） | `S100YG54` |
| 原本 docID | `S100YG54` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG54.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | スズデン株式会社 / 7480 / docID S100YG54（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
suzuden: 10 件の数値を有報XBRLと照合
有報: スズデン株式会社 有価証券報告書－第74期(2025/04/01－2026/03/31) (docID S100YG54)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
suzuden: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高とセグメント別の金額は、セグメント注記の外部顧客への売上高と、経営者による分析の百万円印字が一致することを確認して用いました。セグメント間の内部売上高は印字されていません。
- businessModel: ベル株式会社の株式取得に伴う負ののれん発生益48,521千円は、本文に書ける財務数値の範囲（売上高と当期純利益）外のため、本文には書きませんでした。
- businessModel: 目標とする経営指標として自己資本利益率（ROE）8.0％以上を継続することや、配当方針の基準は、投資の語を含むため本文とperspectivesには書かず、この記録にとどめました。
- businessModel: 前期有報との修正再表示チェックでは全行が一致し、変則決算・決算期変更・重要な後発事象はいずれも印字されていないため、financialNotesは空としました。
- businessModel: 当社に人材派遣と業務請負を行う連結子会社のスズデンビジネスサポート株式会社は、外部への売上を担う事業ではないため、productsやrevenueSourcesには入れませんでした。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順としました（電機・電子部品販売事業45,454百万円、製造事業448百万円）。
- businessStructure: 電機・電子部品販売事業の子区分は、顧客との契約から生じる収益を分解した情報に印字された商品分野（FA機器、電設資材、電子・デバイス機器、情報・通信機器）で構成し、並び順はその売上高の大きい順としました。金額は経営者による分析の商品分野別の売上高の百万円印字と一致します。
- businessStructure: 連結子会社のスズデンビジネスサポート株式会社は、当社への人材派遣と受発注・物流・売掛・買掛管理等の業務請負を行う会社であり、報告セグメントではないため、事業としては立てませんでした。
- businessStructure: 主要な設備のセグメント欄は両事業が連記された行が多いため、拠点と事業の対応は【事業の内容】の大和工場の記載に基づく製造事業の記載にとどめました。
- history: 【沿革】は年月と事象が対で印字されており、行順に対応づけました。年月は行に書かず、年だけを year に入れました。
- history: 抽出テキストで年月と事象の対応が崩れている2009年・2010年頃の東京物流センター（千葉県松戸市）開設と大和工場（宮城県黒川郡大和町）開設の行は、どちらの年月がどちらの事象に対応するか裏付けられないため収録しませんでした。
- history: 営業所の開設、海外子会社の設立・清算、ISO認証の取得などの細目は、事業の転機ではないため省きました。
- history: ベル株式会社の取得と吸収合併は、いずれも当期中に完了し、2026年3月31日現在のグループ構成に反映されているため、沿革に収録し、needsReviewには入れませんでした。
- history: 子会社等の資本金の金額は沿革の本文には書いていません。
- industry: 主たる業界は商社としました。電機・電子部品販売事業が外部顧客への売上高の大部分を占める、メーカーから仕入れて国内企業へ販売する事業であるためです。
- industry: semiconductorsは2つ目に付けました。製造事業が報告セグメントとして開示され、半導体製造装置向けアルミフレームの組立等を事業として行っているためです。
- industry: 電機・電子部品の販売そのものは商社の事業であり、金額が独立して開示されていない商品分野ごとに業界は付けませんでした。
- relatedCompanies: omronとnitto-kogyoは、特定投資株式の保有目的の定型句ではなく、【重要な契約等】に相手先・主要取扱品目・契約期間が個別に印字された代理店・販売店契約を根拠に仕入先として結びました。omronは経営者による分析でも主要仕入先と印字されています。
- relatedCompanies: tokyo-electronは、主要な顧客ごとの情報に印字された東京エレクトロン宮城株式会社（東京エレクトロンのグループ会社）を主要な顧客とする個別の開示と、特定投資株式の保有目的における関連会社が販売先である旨の記載を根拠に顧客として結びました。販売金額は関連企業の説明には書きませんでした。
- relatedCompanies: minebea-mitsumi、sumitomo-electric-industries、citizen-watch、aida-engineering、nippon-sanso-holdings、suzuki-6785、nagano-keiki、riken-keiki、nittoku、koa: 特定投資株式の保有目的が「販売先（かつ仕入先）であり、安定的かつ継続的な取引関係を維持するため」という全銘柄共通の定型的な記載が中心で、個別の契約や取引の開示がないため結びませんでした。nippon-sanso-holdingsは関連会社が販売先という記載がありますが、相手の関連会社の名称や取引内容の個別開示がないため結びませんでした。
- relatedCompanies: nic-autotec: 当事業年度に保有株式の全てを売却しており、2026年3月31日時点で保有がないため結びませんでした。
- relatedCompanies: nissei-plastic-industrial: コードリストにない相手であり、保有目的の定型的な記載のみのため結びませんでした。
- relatedCompanies: aichi-electric: 2016年に連結子会社化しましたが2022年7月に当社へ吸収合併されており、現在の関係会社ではないため結びませんでした。
- relatedCompanies: パナソニック株式会社エレクトリックワークス社との代理店契約は【重要な契約等】に印字されていますが、契約相手は上場しているパナソニック ホールディングス株式会社とは別の法人であり、候補にもないため結びませんでした。シーケーディ株式会社は特定投資株式に印字されていますが候補に含まれておらず、保有目的の定型的な記載のみのため結びませんでした。
- relatedCompanies: sansei: 大株主の状況に印字された株式会社サンセイテクノスに部分一致したもので、候補のサンセイ株式会社とは別の法人のため結びませんでした。
- relatedCompanies: 株式会社トレンドと株式会社タァーツは大株主に印字された事業会社ですが、候補に含まれていないため結びませんでした。
- relatedCompanies: daiwa、base-4481、port、career、denka、land、corona、cover、seki、system-integrator、taya、the-lead、trust: 地名・一般的な語・部分一致のみで、当社との取引・提携・資本関係の記載がないため結びませんでした。
- terms: 助言: 用語『FA機器』は、工場の自動化に使う機器の総称です。当社はFA機器分野としてRFIDやグラフィック操作パネル、センサー、制御盤などを取り扱っています。
- terms: 助言: 用語『代理店・販売店契約』は、メーカーの製品を仕入れて販売する契約のことです。当社はオムロン株式会社や日東工業株式会社などとこうした契約を結んでいます。
- terms: 助言: 用語『Ubon（ユーボン）』は、当社のオリジナルブランドです。配線アクセサリーや盤内パーツを中心に、松本ユーボン工場で生産体制を強化しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
