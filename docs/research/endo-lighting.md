# 遠藤照明 — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社遠藤照明 |
| 証券コード | 6932 |
| docID（データを取り出した文書） | `S100YH7Z` |
| 原本 docID | `S100YH7Z` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH7Z.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社遠藤照明 / 6932 / docID S100YH7Z（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
endo-lighting: 10 件の数値を有報XBRLと照合
有報: 株式会社遠藤照明 有価証券報告書－第55期(2025/04/01－2026/03/31) (docID S100YH7Z)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
endo-lighting: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円印字をそのまま記載した（千円額からの換算・四捨五入はしていない）。
- businessModel: MD&Aのセグメント別売上高はセグメント間取引を含むため使わず、セグメント注記の外部顧客への売上高を使用した。
- businessModel: 地域別売上高の内訳（日本35,766百万円、アジア3,092百万円、英国14,676百万円、欧州1,918百万円、その他20百万円）の合計は55,472百万円で、印字の合計55,473百万円と1百万円異なる。有報の印字どおりとし、本文では内訳の合計値を述べていない。
- businessModel: 株式会社アドバンテッジパートナーズとの事業提携契約（2025年10月31日締結。業績向上策の検討とノウハウの提携等。第2回無担保転換社債型新株予約権付社債の発行を伴う資本提携を含む）は【重要な契約等】に印字されているが、同社は非上場で関連企業候補に含まれないため、関連企業には結んでいない。
- businessModel: 株式会社アーバンは2026年3月31日現在で発行済株式（自己株式を除く）の33.40％を保有する筆頭株主であるが、非上場で関連企業候補になく、【関係会社の状況】にも記載がないため、関連企業には結んでいない。
- businessModel: 調達先（suppliers）は、有報が自社の調達について一般名詞で述べていないため記載していない。製造は当社及びタイ・中国の製造子会社が担っている。
- businessModel: 中期経営計画の目標のうち売上高目標（2027年度610億円）のみを記載し、利益の目標額は記載していない。
- businessModel: financialNotesの第53期（2024年3月期）への遡及適用は、【主要な経営指標等の推移】の注記3の印字に基づく。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順とした。
- businessStructure: 連結子会社は11社で、いずれも【関係会社の状況】に記載の連結子会社のみであり、親会社・関連会社・その他の関係会社の記載はない。
- history: 沿革の年月はスキーマ上、年だけを記録した（月は記載しない）。
- history: 営業所の新設・移転など拠点の細目と、2011年3月に撤退したシステム収納家具事業、2019年3月に清算したIcon International Inc.の買収など、現在の事業構成に残らない事項は割愛した。
- history: 資本金の金額は沿革に印字されておらず、記載していない。
- industry: 主たる業界は、売上高の大半を占める照明器具関連事業（照明器具の製造販売）に基づき electronics とした。
- industry: 環境関連事業（省エネ機器の販売・レンタル）とインテリア家具事業に合う閉じた分類の値はないが、いずれも照明器具関連事業に付随する規模であり、暫定値は付けていない。
- relatedCompanies: aoki-holdings（ＡＯＫＩホールディングス）: 【株式の保有状況】の特定投資株式に載るが、保有目的は全銘柄共通の定型文（企業間取引の関係強化）のみで、取引の向きや具体的な取引内容の印字がなく、保有株式数も16,983株と僅少なため結ばなかった。
- relatedCompanies: okamura（オカムラ）: 特定投資株式の保有目的が同上の定型文のみで、具体的な取引内容の印字がないため結ばなかった（保有株式数10,000株）。
- relatedCompanies: onward-holdings（オンワードホールディングス）: 特定投資株式の保有目的が同上の定型文のみで、具体的な取引内容の印字がないため結ばなかった（保有株式数210株）。
- relatedCompanies: inaba-denki-sangyo（因幡電機産業）: 特定投資株式の保有目的が同上の定型文のみで、具体的な取引内容の印字がないため結ばなかった（保有株式数200株）。
- relatedCompanies: dai-ichi-life-holdings（第一ライフグループ）: 特定投資株式の保有目的が同上の定型文のみであり、生命保険会社との取引は保険取引にあたるため結ばなかった（2026年4月1日付で第一生命ホールディングスから商号変更）。
- relatedCompanies: 株式会社アドバンテッジパートナーズ: 2025年10月31日付で事業提携契約を締結しているが、非上場で関連企業候補に含まれないため結ばなかった。提携の事実は businessModel の warnings に記録した。
- relatedCompanies: 株式会社アーバン: 2026年3月31日現在33.40％を保有する筆頭株主であるが、非上場で関連企業候補になく、【関係会社の状況】の記載もないため結ばなかった。
- relatedCompanies: en、base-4481、vision、no-1、land、seki、zero、career、core、innovation、i-ll、the-lead、karula: 一般語・部分一致による誤検出であり、有報に当該企業との取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: tryt、nissin、trust: コードリストにない相手であり、本文の一致も一般語等の誤検出のため結ばなかった。
- relatedCompanies: 連結子会社11社はグループ会社であり、relatedCompanies には結ばず businessStructure に記載した。
- terms: 助言: 用語「LEDZ」は、当社のLED照明器具のブランドであり、2009年に商品化し、2010年2月から本格販売を開始した。
- terms: 助言: 用語「エシカルライティング」は、「人と地球にやさしい未来の光」を創造し持続可能な社会を実現するために当社が提唱する考え方である。
- terms: 助言: 用語「Synca」は、自然の光、カラー演出、色味調整を1台で備えた当社の次世代無線調光調色器具シリーズである。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
