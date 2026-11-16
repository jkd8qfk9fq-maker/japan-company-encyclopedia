# テクノアルファ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | テクノアルファ株式会社 |
| 証券コード | 3089 |
| docID（データを取り出した文書） | `S100XN4S` |
| 原本 docID | `S100XN4S` |
| 提出日（原本） | 2026-02-25 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XN4S.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | テクノアルファ株式会社 / 3089 / docID S100XN4S（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
techno-alpha: 10 件の数値を有報XBRLと照合
有報: テクノアルファ株式会社 有価証券報告書－第36期(2024/12/01－2025/11/30) (docID S100XN4S)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
techno-alpha: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aに印字された営業利益・経常利益の金額や増減率は書いていません。本文の金額は売上高と親会社株主に帰属する当期純利益だけです。
- businessModel: 受注高・受注残高、仕入実績の金額は書いていません。セグメント利益も書いていません。
- businessModel: 事業別の売上高はセグメント注記の外部顧客への売上高（千円）を切り捨てた百万円表示で、その合計4,520百万円は連結売上高4,522百万円と2百万円異なりますが、印字の数値をそのまま使っています。MD&Aのセグメント別の売上高も同じ外部売上高と一致しています。
- businessModel: 連結子会社ペリテックの主要な損益情報等（同社の個別数値）は子会社の数値のため書いていません。
- businessModel: 主要な経営指標等の注記は、潜在株式が存在しないことの説明、従業員数の定義、収益認識基準の第33期からの適用のみで、収益認識基準の適用は financialNotes に入れました。決算期の変更や変則決算、株式分割の注記はありません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順（エレクトロニクス2,604,448千円、マリン・環境機器1,056,867千円、ＳＩ694,835千円、サイエンス166,281千円）です。千円額を切り捨てた百万円表示の合計は4,520百万円で、連結売上高4,522百万円と2百万円異なりますが、印字の数値をそのまま使っています。
- businessStructure: セグメント利益は書いていません。連結子会社ペリテックの主要な損益情報等（同社の個別の売上高など）も、子会社の数値のため事業の説明には書いていません。
- businessStructure: この工程のスキーマには suppliers のキーがないため、仕入先の事実はここに記録します。当社は海外メーカーとの販売代理店契約に基づく輸入販売が中心で、沿革にはアメリカOrthodyne Electronics Corp.（現Kulicke & Soffa Pte, Ltd.）とのウェッジワイヤボンダーの国内独占販売代理店契約などが印字されています。
- businessStructure: 主要な設備の状況で、本社はエレクトロニクス事業・マリン・環境機器事業・サイエンス事業の3区分が連記された行のため、特定の事業には結びつけていません。神奈川エンジニアリングセンターはエレクトロニクス事業、株式会社ペリテックの事業所はＳＩ事業の設備として印字されています。
- businessStructure: Wikipediaの記事（証券コード3089で一致）がありますが、創業の経緯は有報の沿革で確認でき、抜粋の残りは有報に無い顧客名など確認できない内容のため、補足には使っていません。
- history: 沿革は年月まで印字されていますが、年だけを記録しています。資本金の金額は書いていません。
- history: 省いた項目: 1995年の本社移転、1997年のDeweyl Tool Company, Inc.との販売代理店契約、2000年のAdvanced Integrated Technologies, Inc.との販売代理店契約、2002年の名古屋テクニカル・サービスセンター設置とNew Logic Research, Inc.との販売代理店契約、2003年のISO9001取得と静岡大学との共同商品化、2005年のTAMI Industries SA・Diener Electric GmbHとの販売代理店契約、2010年の大阪証券取引所ＪＡＳＤＡＱ（グロース）上場、2011年のＪＡＳＤＡＱ（スタンダード）への市場区分変更、2012年の株式会社ペリテックによるＥＭＩテスタ事業の譲受、2013年の東京証券取引所（ＪＡＳＤＡＱ（スタンダード））上場。いずれも代理店契約の追加や市場区分の変遷などの細目です。
- history: 2011年の株式会社コムテックの吸収合併と2019年の株式会社ケーワイエーテクノロジーズの吸収合併は、それぞれの子会社化の項目に併記しました。
- industry: 主たる業界は、売上高の過半を占めるエレクトロニクス事業が半導体製造装置（後工程の組立装置や検査機器）の販売・自社開発を中心とするため、半導体としました。
- industry: ＳＩ事業は試験・計測システムのシステムインテグレーションであり、独立して開示された報告セグメントのため it を付けました。マリン・環境機器事業は船舶用クレーンやボートダビットなどの機器の販売であり、machinery を付けました。サイエンス事業（理化学機器）は売上規模が小さいため、独立の業界は付けていません。
- industry: DEIの別記事業は CTE です。
- relatedCompanies: 候補「techno-alpha/en」「techno-alpha/ray」「techno-alpha/port」「techno-alpha/vision」「techno-alpha/base-4481」「techno-alpha/land」「techno-alpha/seki」は、いずれも一般語や概念（エンジニアリング、ディスプレイ、サポート、中期ビジョン、営業利益ベース、プラズマ、セキュリティ）への部分一致で、当社との関係の記述がないため結んでいません。
- relatedCompanies: 候補「techno-alpha/alpha」「techno-alpha/alpha-4760」は当社自身の社名「テクノアルファ」への一致、「techno-alpha/daiwa」は所在地の神奈川県大和市への一致、「techno-alpha/ic」はICチップの用語への一致、「techno-alpha/system-integrator」はＳＩ事業の一般名称への一致、「techno-alpha/zero」は残存価額をゼロとする会計方針の文言への一致、「techno-alpha/technologies」は当社の連結子会社だった株式会社ケーワイエーテクノロジーズの名称への一致であり、いずれも相手企業との関係ではないため結んでいません。
- relatedCompanies: 候補にないため結んでいない相手: Kulicke & Soffa Pte, Ltd.をはじめとする海外メーカー各社（販売代理店契約の相手方ですが、候補にありません）、株式会社ニシエフ（救命ボートのメーカーとして印字）。連結子会社の株式会社ペリテックは当社自身の子会社のため結んでいません。
- terms: 助言: 用語「ウェッジワイヤボンダー」は、半導体組立工程でICチップと端子間を細いアルミ線で超音波を用いて接合する装置です。有報の用語解説に定義があります。
- terms: 助言: 用語「パワー半導体」は、電力を制御する半導体デバイスで、電源装置、モータードライブ、自動車、大型家電、産業用機器等に用いられます。有報の用語解説に定義があります。
- terms: 助言: 用語「ダビット」は、救命ボート等を昇降させる装置です。有報の用語解説に定義があります。
- terms: 助言: 用語「振動膜式フィルター」は、フィルター膜の目詰まりを防ぐ目的で膜自体を振動させ、フィルター膜の寿命を維持させる装置です。有報の用語解説に定義があります。
- terms: 助言: 用語「フリップチップ・ダイボンダー」は、半導体組立工程でICチップを基板上に高い精度で搭載する装置です。有報の用語解説に定義があります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
