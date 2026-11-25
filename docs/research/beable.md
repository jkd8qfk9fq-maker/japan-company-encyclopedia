# ビーエイブル — research log

Registered: 2026-11-19（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ビーエイブル |
| 証券コード | 604A |
| docID（データを取り出した文書） | `S100ZAWS` |
| 原本 docID | `S100ZAWS` |
| 提出日（原本） | 2026-10-30 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100ZAWS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ビーエイブル / 604A / docID S100ZAWS（id は英語表記「beABLE CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
beable: 10 件の数値を有報XBRLと照合
有報: 株式会社ビーエイブル 有価証券報告書－第36期(2025/08/01－2026/07/31) (docID S100ZAWS)
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
beable: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有報に事業の調達先にあたる記載がないため、businessModel.suppliers は省きました。
- businessModel: 東京電力ホールディングス株式会社は主要な顧客ごとの情報に印字された最大の顧客ですが、このツリーの関連候補に含まれず、ツリー内に掲載済みエントリーがないため、関連企業には結びませんでした。
- businessModel: 株式会社日立プラントコンストラクションは主要な顧客ごとの情報に印字された顧客ですが、非上場のため関連企業には結びませんでした。
- businessModel: 株式会社ルネサンスは介護事業のフランチャイズ契約先として印字されていますが、このツリーの関連候補に含まれないため、関連企業には結びませんでした。
- businessModel: 2026年8月に第三者割当増資を実施しています（沿革に印字）。決算日後の資本政策のため、本文と needsReview には書かず、この警告に記録します。
- businessStructure: 報告セグメントの並び順は、セグメント注記の外部顧客への売上高（2026年7月期）の大きい順にしました。
- businessStructure: セグメント間の内部売上高はなく、3セグメントの外部顧客への売上高の合計9,908百万円は売上高と一致します。
- history: 沿革の表に印字された資本金の金額は、沿革への資本金の金額を書かない規則のため各項目に含めていません。
- history: 2026年8月の第三者割当増資は決算日後の資本政策のため、沿革の項目には含めず businessModel の warnings に記録しました。
- industry: 主たる業界は、最大の報告セグメントである工事事業とコードリストの業種（建設業）から construction としました。
- industry: 再生可能エネルギー事業を報告セグメントとして独立開示しているため energy を付けました。
- relatedCompanies: 東京電力ホールディングス株式会社: 最大の顧客ですが、このツリーの関連候補に含まれず、ツリー内に掲載済みエントリーがないため結びませんでした。
- relatedCompanies: 関西電力、クラフティア: 持分法適用関連会社であるエイブルエナジー合同会社への共同出資者（関西電力50％、クラフティア5％）であり、当社との直接の取引・提携の印字がないため結びませんでした。クラフティアは大株主の状況にも保有が印字されていますが、保有のみです。
- relatedCompanies: 株式会社IHI: 2025年9月に同社より出資を受けていますが、保有比率や提携の印字がないため結びませんでした（沿革には記載しました）。
- relatedCompanies: 京セラ: 1993年に京セラ特約店として子会社を設立した歴史的経緯のみで、現在の直接の関係の印字がないため結びませんでした。
- relatedCompanies: 大東銀行、松井証券: 大株主の状況に保有が印字されているのみで、取引・提携の印字がないため結びませんでした。
- relatedCompanies: エイブルエナジー合同会社、福島バイオマスロジスティックス合同会社、合同会社佐野バイオマス発電: 当社の持分法適用関連会社であり、関連企業の対象外のため結びませんでした。
- relatedCompanies: en、seki、base-4481、zero、land、port、brass、care-service、career、hiday-hidaka、rent、space、vision、electric-power-development: 一般語や部分文字列への一致のみで、正式名称の印字や関係の記載がないため結びませんでした。
- relatedCompanies: nissin: コードリストになく上場が確認できないため結びませんでした。
- terms: 助言: 用語「廃炉」は、運転を終えた原子力発電所を解体・撤去する作業を指す語で、工事事業の説明に使われています。用語ページの候補になります。
- terms: 助言: 用語「オペレーション＆メンテナンス」は、発電設備の運転業務と保守業務をあわせて受託する形態を指す語で、再生可能エネルギー事業の説明に使われています。用語ページの候補になります。
- terms: 助言: 用語「特定卸供給」は、発電事業者が小売電気事業者を介さず特定の需要家へ電力を供給する制度を指す語で、電力小売の説明に使われています。用語ページの候補になります。

## 要確認（status に反映）

- businessModel: 2026年3月4日付で普通株式1株につき5株の割合で株式分割を行いました。主要な経営指標等の一部の指標は、この株式分割が第34期の期首に行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
