# 旭情報サービス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 旭情報サービス株式会社 |
| 証券コード | 9799 |
| docID（データを取り出した文書） | `S100YHT5` |
| 原本 docID | `S100YHT5` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHT5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 旭情報サービス株式会社 / 9799 / docID S100YHT5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asahi-intelligence-service: 10 件の数値を有報XBRLと照合
有報: 旭情報サービス株式会社 有価証券報告書－第64期(2025/04/01－2026/03/31) (docID S100YHT5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
asahi-intelligence-service: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の目標とする経営指標（2028年3月期の売上高19,650百万円、配当性向40％以上など）は投資・利益指標の目標値であるため、本文や strategy には記載せず、ここに存在のみを記録します。
- businessModel: 経営指標等の推移の注記1（連結財務諸表を作成していないこと）は基礎事項として財務数値の basis に反映されているため financialNotes には入れていません。注記2（関連会社がないため持分法の投資利益を記載していないこと）と注記4（潜在株式が存在しないこと）は表示事項、注記3（創立60周年記念配当）と注記7（期末配当が定時株主総会の決議事項であること）は配当に関する事項、注記6（最高・最低株価の市場名称の変遷）は表示事項のため、いずれも warnings のみとしました。注記5の株式分割は needsReview に記載しています。
- businessModel: 事業用土地の再評価（2000年実施）は対象期間外の事項のため financialNotes には入れていません。
- businessModel: MD&Aに記載された利益項目の金額とその理由、生産実績・受注実績の金額は本文に記載していません。
- businessModel: 部門別の販売高を千円から百万円に切り捨てた合計（16,546百万円）と印字の売上高（16,548百万円）の差は切り捨てによるもので、いずれも印字どおりに記載しています。
- businessStructure: 当社は連結財務諸表を作成しておらず、関係会社の状況は該当事項がありません（子会社・関連会社はありません）。
- businessStructure: 部門別の販売高はMD&Aの販売実績（部門別）によるもので、セグメント情報は単一事業のため開示されていません。部門別の数値を千円から百万円に切り捨てた合計（16,546百万円）は印字の売上高合計（16,548百万円）と切り捨ての範囲で異なりますが、いずれも印字どおりに記載しています。
- businessStructure: 主要顧客の株式会社トヨタシステムズは関連企業の候補に含まれていないため relatedCompanies には結んでいません（事業構造とビジネスモデルの顧客の説明に事実として記載）。
- history: 沿革表のうち、1968年のグループ会社の設立・分離（旭事務機タイプセンター、旭事務センター）、1969年の東京支店開設、1972年の南九州支社開設と東京本社の独立、1973年の名古屋本社とアサヒデータプロセスの設立、1974年の旭総本社の設立、1976年の南九州本社の独立、1977年のアサヒコンピュータサービスの設立、1979年以降の本社・支社の移転と名称変更、1986年のCAD業務開始、2003年のプライバシーマーク取得などは、事業の転機ではないため落とし、ここに列挙しました。
- history: 創立時の資本金額は規則により記載していません。年月は年のみを記載し、月のキーは付けていません。
- industry: 主分類は、ネットワークシステムの構築・運用管理、システム開発、システム運用という情報サービス事業単一事業の実態に従い it としました。単一事業のため副次分類は付けていません。
- relatedCompanies: 主要な顧客ごとの情報に開示された株式会社トヨタシステムズ（2026年3月期の販売高3,928百万円で売上高の23.7％、前期も23.4％で2期連続の主要顧客）は関連企業の候補に含まれていないため結んでいません。顧客としての事実は事業構造とビジネスモデルに記載しています。なお、トヨタ自動車株式会社は当社の取引相手方として記載されていないため、親会社での代替リンクもしていません。
- relatedCompanies: 候補の hikari-tsushin（株式会社光通信）は、【大株主の状況】に現れるのが「光通信KK投資事業有限責任組合」（投資事業有限責任組合であり、株式会社光通信とは別の法人）の名称であるため結んでいません。
- relatedCompanies: 候補の mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group は、投資有価証券や社債の保有対象（純投資目的）としての記載のみで、【株式の保有状況】でも純投資目的以外の投資株式は非上場株式のみであり、個別の取引・提携関係の記載がないため結んでいません。候補の nomura-holdings と aeon-financial-service も、保有する社債の発行体としての記載のみのため結んでいません。
- relatedCompanies: 候補の denso（株式会社デンソー）は、売掛金の相手先別内訳に残高が記載されるのみで、主要な顧客としての開示や提携の記載がないため結んでいません。
- relatedCompanies: 候補の career、seki、en、base-4481、port、vision、slogan、path、como、densan は、いずれも一般語や記述の一部の部分一致であり、各社との取引・提携・資本関係の記載がないため結んでいません。候補の trust はコードリストにない相手のため結んでいません。
- relatedCompanies: 当社には子会社・関連会社がなく、大株主は社員持株会、個人株主、日本生命保険相互会社（非上場）、信託口等であり、結ぶべき関連企業はありませんでした。
- terms: この会社の事業に固有の専門用語として登録すべきものは確認できなかったため、用語は登録しませんでした。

## 要確認（status に反映）

- businessModel: 2024年10月１日付で普通株式１株につき２株の割合で株式分割を行っています（経営指標等の推移の注記に記載）。本登録は2026年３月31日現在の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
