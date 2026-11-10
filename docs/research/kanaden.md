# カナデン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カナデン |
| 証券コード | 8081 |
| docID（データを取り出した文書） | `S100YFEF` |
| 原本 docID | `S100YFEF` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFEF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カナデン / 8081 / docID S100YFEF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 42 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kanaden: 10 件の数値を有報XBRLと照合
有報: 株式会社カナデン 有価証券報告書－第176期(2025/04/01－2026/03/31) (docID S100YFEF)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":89081000000,"latestFiling":89090000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kanaden: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: エビデンスパックの「財務諸表の組替え」警告への対応：経営指標等の注記に、髙島電機の企業結合に係る暫定的な会計処理の確定が第175期の数値に反映されている旨が印字されており、これを financialNotes に記録した。修正再表示チェックでは売上高・純利益・純資産・従業員数は前期有報と全行一致し、差異があったのは総資産のみだった。
- businessModel: 前期までの中期経営計画『Electronics Solutions・Company 2025』は当期が最終年度であり、perspectives の strategy には新たに策定された『True Solution 2028』を記載した。
- businessStructure: 事業の並び順と金額は、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順とした。分野別のchildrenの金額は独立して開示されていないため、金額は記載していない。
- businessStructure: 拠点は全国の支社・支店が全事業を担う形で開示されており、特定の事業に結びつく拠点の記載はしていない。
- history: 沿革の表は年月と事象が一続きに印字されており、そのまま行順で対応づけた。
- history: 支店の開設・昇格や、カナデンサプライの吸収合併（2017年）など、事業の転機ではない行は省いた。2026年4月の九州支店の九州支社への昇格は、決算日後の組織変更として沿革に印字されているが、支店の昇格にとどまるため省いた。
- industry: 主たる業界は、4つの報告セグメントのいずれもが電機・電子商品の販売を中心とする専門商社の事業であることから、商社（trading）とした。半導体や電子デバイスの販売は情通・デバイス事業の一部で、半導体の製造は行っていないため semiconductors は付けなかった。閉じた分類に当てはまる区分があるため taxonomyGap は記録しなかった。
- relatedCompanies: en（エン株式会社、ambiguous）: 「エン」の一致は連結子会社カナデンエンジニアリング等の名称の部分一致で、同社との関係の記載がないため結ばなかった。
- relatedCompanies: seki（セキ株式会社、ambiguous）: 「セキュリティ」などの一般語の部分一致のため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア」は社員のキャリア形成を述べる文中の一般語のため結ばなかった。
- relatedCompanies: core（株式会社コア、ambiguous）: 文中の一般語の部分一致で、曖昧なため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション」は文中の一般語のため結ばなかった。
- relatedCompanies: create（クリエイト株式会社）: 一致は連結子会社テクノクリエイトの名称によるもので、同社との関係の記載がないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「製品ポートフォリオ」の部分一致のため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」は自社のグループ理念を述べる文中の語のため結ばなかった。
- relatedCompanies: advantage-risk-management（株式会社アドバンテッジリスクマネジメント）: エンプロイーエンゲージメントスコアのサーベイ実施者として名前が出るだけで、関連企業とする取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「経常利益ベース」などの一般語の部分一致のため結ばなかった。
- relatedCompanies: ce-holdings（株式会社CEホールディングス）: 一致は連結子会社となった株式会社JCEホールディングス（旧GCJG19株式会社）の名称によるもので、同社とは別会社のため結ばなかった。
- relatedCompanies: nakano-refrigerators（中野冷機株式会社）: コードリストにない会社で、保有株式の縮減を進めた旨の記載のみのため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ、ambiguous）: 「ゼロエミッション」などの一般語の部分一致のため結ばなかった。
- relatedCompanies: matsuya（株式会社松屋、ambiguous）: 一致は関西支社の所在地「松屋町」によるもので、同社との関係の記載がないため結ばなかった。
- relatedCompanies: sansei（サンセイ株式会社）: 一致は大株主の株式会社サンセイテクノスの名称によるもので、同社とは別会社のため結ばなかった。
- relatedCompanies: systemsoft（株式会社システムソフト）: 一致は連結子会社の事業内容にある「システムソフト設計」の語によるもので、同社との関係の記載がないため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: 一致は日本マスタートラスト信託銀行株式会社（信託口）の名称の一部で、信託口の純投資のため結ばなかった。
- relatedCompanies: yaskawa-electric（安川電機）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: central-japan-railway（東海旅客鉄道）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: east-japan-railway（東日本旅客鉄道）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: west-japan-railway（西日本旅客鉄道）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: kyushu-railway（九州旅客鉄道）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: keikyu（京浜急行電鉄）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: keisei-electric-railway（京成電鉄）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: kintetsu-group-holdings（近鉄グループホールディングス）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: ebara（荏原製作所）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: isetan-mitsukoshi-holdings（三越伊勢丹ホールディングス）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: kaneka（カネカ）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: mitsubishi-materials（三菱マテリアル）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: ricoh（リコー）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: toyobo（東洋紡）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: takasago-thermal-engineering（高砂熱学工業）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development（住友不動産）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: tsukishima-holdings（月島ホールディングス）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: asahi-kogyosha（朝日工業社）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: kitazawa-sangyo（北沢産業）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: morio-denki（森尾電機）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: new-cosmos-electric（新コスモス電機）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: rix（リックス）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: sanoyas-holdings（サノヤスホールディングス）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: 三菱電機ビルソリューションズ・三菱電機住環境システムズ（候補外）: 当社と取引基本契約を結び、電機製品等の仕入及び販売を行っているが、いずれも三菱電機の非上場子会社で候補に含まれないため結ばず、関係は三菱電機の説明に集約した。
- relatedCompanies: 連結子会社13社: いずれも非上場のため関連企業には含めていない（事業構造に記載）。
- terms: 助言: 用語「FA（ファクトリーオートメーション）」（工場の生産工程を自動化する仕組み）、「計装システム」（工場の設備を計測し制御するシステム）、「販売代理店・特約店」（メーカーの商品を仕入れて販売する契約形態）、「無停電電源装置」（停電時にも電力を供給し続ける装置）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

- businessStructure: 2026年4月1日付で報告セグメントが再編され、従来の「FAシステム」「ビル設備」「インフラ」「情通・デバイス」の4セグメントは「FAシステム」「ビル設備」「半導体・デバイス」「社会インフラ」の4セグメントに変更されました。次連結会計年度より新セグメントに基づき開示を行う予定とされており、本登録の事業構成は再編前のセグメントに基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
