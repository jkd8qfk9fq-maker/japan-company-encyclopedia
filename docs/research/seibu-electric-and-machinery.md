# 西部電機 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 西部電機株式会社 |
| 証券コード | 6144 |
| docID（データを取り出した文書） | `S100YLBS` |
| 原本 docID | `S100YLBS` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLBS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 西部電機株式会社 / 6144 / docID S100YLBS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
seibu-electric-and-machinery: 10 件の数値を有報XBRLと照合
有報: 西部電機株式会社 有価証券報告書－第93期(2025/04/01－2026/03/31) (docID S100YLBS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
seibu-electric-and-machinery: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: セグメントの売上高は、セグメント注記の外部顧客への売上高を用いました。経営者による分析のセグメント売上高には内部売上高を含む精密機械事業の数値があるため使いませんでした。
- businessModel: 金額はセグメント注記と主要な経営指標の百万円単位の印字どおりで、千円額の換算や四捨五入はしていません。
- businessModel: 中期経営計画の定量目標には本文の財務数値の範囲外の項目が含まれるため、本文には書きませんでした。
- businessModel: 前期有報との照合では修正再表示はなく、変則決算や決算期の変更もないため、financialNotesは空としました。重要な後発事象は該当事項なしと印字されています。
- businessModel: 原材料の一部を連結子会社の西電興産株式会社から仕入れる関係は、グループ内の取引のためbusinessModelのsuppliersには書かず、事業の内容の説明にとどめました。このworktreeのスキーマにsuppliersキーはありません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順としました（精密機械事業18,300百万円、搬送機械事業13,195百万円、産業機械事業6,993百万円）。その他の事業は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: 各事業の子区分は報告セグメントの概要と【事業の内容】に印字された製品の区分から構成し、金額が独立して開示されていないため金額は書いていません。
- businessStructure: 金額はセグメント注記の百万円単位の印字どおりで、千円額の換算や四捨五入はしていません。
- history: 【沿革】の設立・上場などに印字された資本金の金額は、本文の財務数値の範囲外のため書いていません。
- history: 工場や事務所の新設などの細目は、事業の転機となるものを中心に選び、精密機械第1工場（多目的工場への改称を含む）などの細目は省きました。
- history: 2018年のタイでのバルブコントロールのストック販売開始と株式会社豊田自動織機へのクレーンOEM供給開始は、沿革の1行にとどまるため省きました。
- industry: 売上の大半を占める報告セグメントはいずれも機械の製造販売であり、主たる業界は機械としました。金額が独立して開示されていない事業に第二の業界は付けませんでした。
- relatedCompanies: toyota-industries-6201: 搬送機械事業で業務・資本提携をし、重要な契約等に搬送機械の設計及び製造の受託契約が印字され、大株主にも載る相手ですが、候補のlistingが「（コードリストにない）」でEDINETコードリストで確認できないため結びませんでした。提携と契約の事実は沿革と本文に残しています。
- relatedCompanies: kanematsu: 共同出資と主要な顧客の相手は株式会社兼松ケージーケイであり、候補の兼松株式会社とは別の法人のため結びませんでした。主要な顧客としての金額は関連企業の説明には書いていません。
- relatedCompanies: fukuoka-financial-group、mitsubishi-ufj-financial-group、mizuho-financial-group、nishi-nippon-financial-holdings、yamaguchi-financial-group: 特定投資株式の保有目的が「取引先金融機関であり、資金調達及び事業情報収集のため」という記載で、金融取引が理由のため結びませんでした。なお各金融グループが当社株式を保有していない旨とグループ銀行が保有する旨の注記があります。
- relatedCompanies: yaskawa-electricは主要株主として結びました。当社が保有する同社株式の特定投資株式としての記載だけではなく、大株主の状況と事業の内容における設備納入の記載を根拠としています。
- relatedCompanies: kao、showa-manufacturing、maezawa-industries、seiko-electric、okano-valve-mfg、tsubakimoto-kogyo: 特定投資株式の保有目的が「良好な取引関係を維持発展させるため」という全銘柄共通の定型的な記載のみで、個別の取引の向きが印字されていないため結びませんでした。
- relatedCompanies: career、base-4481、en、rent、slogan、zero、king、kohsoku、space、the-lead、seki: 一般的な語や部分一致のみで、当社との取引・提携・資本関係の記載がないため結びませんでした。
- relatedCompanies: 連結子会社の西電興産株式会社、株式会社西部ハイテック、西部ペイント株式会社と持分法適用関連会社のSeibu America Corporationは当社グループの会社のため、関連企業リンクにはしませんでした。
- terms: 助言: 用語『ワイヤ放電加工機』は、ワイヤ電極と工作物の間に放電を起こして金属を精密に切断する工作機械のことです。当社の精密機械事業の主要製品として【事業の内容】に印字されています。
- terms: 助言: 用語『バルブアクチュエータ』は、バルブを開閉するための駆動装置のことです。当社の産業機械事業の主要製品として【事業の内容】に印字されています。
- terms: 助言: 用語『立体自動倉庫』は、荷物を立体的に保管し、クレーンなどで自動で出し入れする倉庫のことです。当社は1966年にモノレールスタッカクレーンによる立体自動倉庫を開発しました。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
