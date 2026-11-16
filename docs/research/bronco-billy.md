# ブロンコビリー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ブロンコビリー |
| 証券コード | 3091 |
| docID（データを取り出した文書） | `S100XT8X` |
| 原本 docID | `S100XT8X` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT8X.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ブロンコビリー / 3091 / docID S100XT8X（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bronco-billy: 6 件の数値を有報XBRLと照合
有報: 株式会社ブロンコビリー 有価証券報告書－第44期(2025/01/01－2025/12/31) (docID S100XT8X)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":23377650000,"latestFiling":23377000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":26617496000,"latestFiling":26617000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-12-31","previousFiling":1003179000,"latestFiling":1003000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":1715475000,"latestFiling":1715000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":1708795000,"latestFiling":1708000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":2600132000,"latestFiling":2600000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":22761359000,"latestFiling":22761000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":24520968000,"latestFiling":24520000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":18646629000,"latestFiling":18646000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":20074853000,"latestFiling":20074000000}]
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
bronco-billy: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記: 売上高と当期純利益はMD&Aの百万円印字（売上高30,219百万円・前年同期比13.5％増、親会社株主に帰属する当期純利益1,969百万円・同14.8％増）をそのまま使った。地域別の販売高もMD&Aの百万円印字をそのまま使ったが、その合計（30,216百万円）は印字の売上高（30,219百万円）と3百万円異なる。各地域の印字のまま記載し、差異はここに記録した。
- businessModel: 前期有報との修正再表示チェックで挙がった差異（売上高・純利益・経常利益・総資産・純資産の2023年12月期・2024年12月期分）は、いずれも第44期からの表示単位変更（千円単位から百万円単位へ。経営指標等の注記3）に伴い過年度分を百万円単位で表示し直したことによるもので、値の変更ではない。登録値は当期有報のものを用い、理由は financialNotes に「2025年12月期」の注記として有報の文言で記載した。
- businessModel: 連結財務諸表は第42期（2023年12月期）より作成しているため、主要な経営指標等は2023年12月期以降の3年分のみが記載されている（経営指標等の注記1）。
- businessModel: 目標とする経営指標は売上高経常利益率で、2025年12月期は計画10.4％に対し実績10.0％であった。利益率の指標であるため本文・戦略には使わず、ここに記録した。
- businessModel: suppliers はこの作業ツリーの旧スキーマにキーが無いため businessModel には書いていない。仕入・製造の事実は、連結子会社の株式会社松屋栄食品本舗が当社で使用する食材を製造していること（【関係会社の状況】）、当社店舗向けの製造割合が6割を超えること（MD&A）として businessStructure と本文に記載した。
- businessStructure: 単一セグメント（飲食事業のみ）のため、セグメント情報の記載は省略されている。事業の内訳は【事業の内容】の業態を children とし、店舗数は2025年12月31日現在の印字（ブロンコビリー146店舗、とんかつ業態14店舗、居酒屋業態1店舗、合計161店舗）を用いた。
- businessStructure: 連結子会社は株式会社松屋栄食品本舗（愛知県犬山市、調味料・惣菜等の製造販売、当社で使用する食材の製造）と株式会社レ・ヴァン（愛知県名古屋市、『かつ雅』等の運営）の2社で、いずれも議決権の所有割合100.0％です（【関係会社の状況】）。両社の決算日は11月30日です。子会社の資本金額は記載していない。
- businessStructure: 当社は2025年12月31日現在150店舗を運営し（提出会社）、愛知県春日井市と神奈川県厚木市に工場（ファクトリー）を所有しています（【主要な設備の状況】）。
- history: 沿革の抽出テキストは年月と事項の対応が一部入れ替わっており、順序による対応付けと他のセクションの記載（【事業の内容】の松屋栄食品本舗の子会社化は2022年7月、連結財務諸表注記のレ・ヴァンの連結開始は前連結会計年度、【主要な設備の状況】の本社移転は2025年1月1日）で年を特定できた事項のみを採用した。月の情報は行に含めていない。
- history: 採用しなかった沿革事項（理由: 店舗の個別開店・改装等の定型的な事項、または抽出の入れ替わりで年を特定できなかった事項）: 春日井高蔵寺店の開店、大垣垂井店の開店、四日市生桑店の開店、本社の名東区移転とトレーニングセンター開設、浜松有玉店の開店、炭焼き台・大かまど・サラダバーの導入と改装、ケーキ工場の開設とリニューアル、昭島昭和の森店の開店、大宮三橋店の開店、青葉台店の開店、東千葉店の開店、彦根店の開店、伏見桃山店の開店、竹市靖公の取締役会長就任、BBビルの取得、足立区トレーニングセンターの新設、宝塚店の開店、奈良押熊店の開店、新業態『とんかつ かつひろ』の開店、大野城御笠川店の開店、新業態『信貴や』の開店、前橋店の開店。
- history: 設立時の資本金額（株式会社ブロンコ設立時の資本金200万円など）は沿革に金額を書かない規則により記載していない。形式上の存続会社（旧商号フジエンジニアリング株式会社、1982年3月設立）と実質上の存続会社（1983年12月設立）の関係は1996年の行に記載した。
- industry: 主たる業界は food とした。飲食店の運営そのものを指す区分が閉じた集合に無いため、掲載済みの外食事業者（壱番屋、サガミホールディングス、トリドールホールディングス、ドトール・日レスホールディングス等）の慣例に揃えた。
- relatedCompanies: セントラルフォレストグループ株式会社（central-forest-group）: 特定投資株式33,000株を保有し、保有目的は『安定的な取引関係を維持継続するため』とされているが、有報内に具体的な取引の内容（取扱品目や取引の方向）の記載が無く、関係を特定できないため結ばなかった。当社の株式の保有の有無は『有』とされている。
- relatedCompanies: 株式会社あいちフィナンシャルグループ（aichi-financial-group、6,993株）、株式会社大垣共立銀行（the-ogaki-kyoritsu-bank、3,000株）: 特定投資株式で、保有目的はいずれも『取引金融機関として安定的な関係を維持継続するため』であり、金融取引（融資）関係のため結ばなかった。
- relatedCompanies: 株式会社トリドールホールディングス（1,200株）、株式会社サガミホールディングス（1,000株）、トヨタ自動車株式会社（500株）、大宝運輸株式会社（360株）、株式会社壱番屋（1,000株）、株式会社ドトール・日レスホールディングス（168株）、株式会社あみやき亭（300株）、株式会社アトム（100株）: 特定投資株式で、保有目的は全銘柄同一の『情報収集のため』であり、個別の取引関係の記載が無いため結ばなかった。あみやき亭の株式数の増加は同社の株式分割によるもので、当社の分割ではない。
- relatedCompanies: 株式会社プロトコーポレーション（前事業年度12,000株）: 『情報収集のため』保有していたが、当事業年度に実施された株式公開買付（TOB）に応募して全株式を売却済みのため結ばなかった。
- relatedCompanies: 株式会社松屋（matsuya）: 候補の一致は連結子会社『株式会社松屋栄食品本舗』の名称によるもので、百貨店の株式会社松屋とは無関係であるため結ばなかった。松屋栄食品本舗は当社の連結子会社として businessStructure に記載した。
- relatedCompanies: セキ、ベース、ランド、ビジョン、ゼロ、エン、フジ、地主、ショーケース、ウィル: いずれも一般語・部分文字列の一致（情報セキュリティ管理規程、個別ベース・連結ベース、ブランド、長期ビジョン、回収可能価額をゼロ、フジエンジニアリング（形式上の存続会社の旧商号）、地主・家主、ショーケース入替、ストロングウィル）であり、当該企業への言及ではないため結ばなかった。ストロングウィルは筆頭株主（27.64％）の資産管理会社であり、候補の株式会社ウィルとは別の法人である。トラスト、日新はコードリストに無い相手であるため結ばなかった（日本マスタートラスト信託銀行（信託口）は信託口）。
- relatedCompanies: 【大株主の状況】の株式会社ストロングウィル（27.64％）、株式会社トーカン（2.53％）、竹市克弘、ブロンコビリー従業員持株会はいずれも未上場または個人・持株会で、related-candidates.json にも取引関係の個別記載が無いため結ばなかった。
- relatedCompanies: 連結子会社2社（株式会社松屋栄食品本舗、株式会社レ・ヴァン）はグループ会社であるため relatedCompanies には結んでいない（businessStructure に記載）。
- terms: 助言のみ。本文中でリンク記法は使っていない。読者の理解に要る語として、ファクトリー（自社工場）、サラダバー、ご馳走カンパニー（同社のコンセプト）、コミサリーに関する既存の用語があれば、businessModel の products や businessStructure の事業説明へのリンクを検討されたい。
- terms: 新規の用語提案はしない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 株式会社ブロンコビリーの主事業（飲食店の運営） → 提案: restaurants（外食・飲食店）。主事業は飲食店の運営であり、食品の製造・販売を指す food とは業態が異なるため
