# 中山製鋼所 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社中山製鋼所 |
| 証券コード | 5408 |
| docID（データを取り出した文書） | `S100YIVA` |
| 原本 docID | `S100YIVA` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIVA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社中山製鋼所 / 5408 / docID S100YIVA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
nakayama-steel-works: 10 件の数値を有報XBRLと照合
有報: 株式会社中山製鋼所 有価証券報告書－第132期(2025/04/01－2026/03/31) (docID S100YIVA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nakayama-steel-works: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年9月26日に発生した第5変電所の事故により電気炉が操業停止となり、約16億円のコストが発生したこと、12月24日に稼働を再開したことはMD&Aの印字どおりです。期間内に復旧済みの事象のため、needsReview には入れず、ここに記録します。
- businessModel: 日本製鉄との合弁契約は2025年11月26日に締結済みで、NN製鋼合同会社は2026年4月1日に設立されました（いずれも有報本文に記載）。株式会社ヨドコウとの業務提携は基本合意の段階で、本合意の締結に向けて協議中である旨を本文どおりに記載しました。
- businessModel: 長期計画の経営目標（経常利益・EBITDA・ROEの数値目標）は、本文の財務数値が売上高と当期純利益のみという方針のため、perspectives には記載していません。
- businessStructure: name は表紙の「株式会社中山製鋼所」から「株式会社」を除いた「中山製鋼所」としました。listings の市場区分は表紙の印字（東京証券取引所プライム市場）どおりです。
- businessStructure: 事業の並びは、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順（鉄鋼→エンジニアリング→不動産）としました。各事業の金額はセグメント注記の外部顧客への売上高の印字どおりで、セグメント利益は書いていません。
- businessStructure: children は【事業の内容】の記載に沿って分けました。金額が独立して開示されていないため、children には金額を書いていません。
- history: 沿革は有報【沿革】の記載に基づき、1919年の個人経営での創業から記載しました。
- history: 2026年4月のNN製鋼合同会社設立は、【沿革】の記載と【経営方針、経営環境及び対処すべき課題等】の記載（2026年4月1日付で日本製鉄との合弁契約に基づき設立）が一致しています。
- industry: 主たる業界は、報告セグメントの中心である鉄鋼事業（鉄鋼一次製品・二次加工製品の製造・販売）の内容から判断しました。閉じた分類に鉄鋼を表す区分が無いため、素材の製造・加工に最も近い chemicals を暫定とし、taxonomyGaps に鉄鋼・金属の区分を提案しました。
- relatedCompanies: エン（en）は「エンジニアリング」の部分一致、ビジョン（vision）は「長期ビジョン」の部分一致、キャリア（career）は「キャリアアップ」の部分一致、ポート（port）は「製品ポートフォリオ」の部分一致、ベース（base-4481）は「ベースアップ」の部分一致、ステップ（step）は「ステップアップ」の部分一致、船場（semba）は住所「南船場」の部分一致で、いずれも当該会社の社名としての記載ではありません。
- relatedCompanies: イシン（ishin）とセキ（seki）は本文中の一般語の部分一致で、具体的な取引・提携・資本関係の記載がありません。
- relatedCompanies: トラスト（trust）は日本マスタートラスト信託銀行（信託口）の信託口で、名義保有のため結びませんでした。
- relatedCompanies: 大和（daiwa）は、2013年の第三者割当増資の引受先である大和PIパートナーズ株式会社（非上場の投資会社）が該当し、候補の株式会社大和とは別法人のため結びませんでした。
- relatedCompanies: 南海化学（nankai-chemical-industry）は沿革上の過去の関係のみです（1939年に合併、1951年に分離、2013年に株式譲渡により連結対象から除外）。現在の関係の記載がないため結びませんでした。
- relatedCompanies: 大株主の日鉄物産（1.50%）と尼崎製罐（2.35%）は候補一覧になく（尼崎製罐は非上場）、特定投資株式にも記載がないため、関連企業には含めていません。
- relatedCompanies: 連結子会社5社（中山通商、三星商事、三星海運、三泉シヤー、中山興産）と持分法適用関連会社の日鉄ボルテンは、いずれも非上場のため関連企業の対象外です。
- terms: 用語候補として、電気炉（鉄スクラップなどを電気の熱で溶かして鋼を造る炉）、高炉（鉄鉱石とコークスから銑鉄を造る炉）、転炉（高炉で造った銑鉄を鋼に変える炉）、鉄スクラップ（原料として再利用される鉄のくず）、粗鋼（加工前の鋼の塊の量を示す生産量）、微細粒鋼（結晶粒を細かくして強度を高めた鋼材。当社の商品名はNFG）、RPF（廃棄物を原料とする固形燃料）があります。いずれも既存の用語集には無いため、本文ではリンク記法を使っていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 中山製鋼所の主たる業界 → 提案: steel-and-metals（鉄鋼・金属）。売上高の中心は電気炉で生産する鉄鋼製品とその加工品であり、鉄鋼メーカーとしての事業ですが、閉じた分類に鉄鋼・金属に合う値がないため、素材の製造・加工に最も近い chemicals を暫定の主たる業界としました。
