# 新コスモス電機 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 新コスモス電機株式会社 |
| 証券コード | 6824 |
| docID（データを取り出した文書） | `S100YJBP` |
| 原本 docID | `S100YJBP` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJBP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 新コスモス電機株式会社 / 6824 / docID S100YJBP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
new-cosmos-electric: 10 件の数値を有報XBRLと照合
有報: 新コスモス電機株式会社 有価証券報告書－第67期(2025/04/01－2026/03/31) (docID S100YJBP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
new-cosmos-electric: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は千円印字を百万円に切り捨てて表記した（切り捨て規則）。商品別の外部顧客への売上高の切り捨て後の合計は50,090百万円で、印字の連結売上高50,091百万円と1百万円異なる。地域別の売上高も同様に、切り捨て後の合計は50,090百万円で印字の合計と1百万円異なる。
- businessModel: 第一生命ホールディングス株式会社の株式分割（2025年4月1日付・1株につき4株の割合）は保有先企業の分割であり、当社の分割ではないため needsReview には入れていない。
- businessModel: 中期経営計画の経営指標として印字された営業利益率などの利益指標は strategy には転記せず、定性的な方針と売上高に関する実績のみを記載した。
- businessModel: 連結子会社の New Cosmos USA,Inc. 及び FIGARO USA,INC. の単体売上高（主要な損益情報等）は連結セグメントの外部売上高とは範囲が異なるため、事業の子区分の説明には転記していない。
- businessModel: businessModel の suppliers キーは、この作業ツリーのスキーマに存在しないため省略した。仕入関係については、ガスセンサ素子及び応用製品の製造・販売を行う連結子会社のフィガロ技研株式会社がグループ内の供給を担う旨を事業の内容に記載しており、外部の特定の仕入先としての印字はない。
- businessStructure: 単一セグメントのため、事業の子区分はセグメント関連情報の製品及びサービスごとの情報（商品別）に基づく。商品別の外部顧客への売上高は千円印字を百万円に切り捨てており、切り捨て後の合計50,090百万円は印字の連結売上高50,091百万円と1百万円異なる。
- history: 沿革の各行は年月で印字されているが、スキーマ上は年のみを記録した。子会社等の資本金額は印字があるが、禁止金額ルールのため沿革には転記していない。
- industry: 主たる業界は electronics とした。ガスセンサ（電子部品）とそれを応用したガス警報器・検知器（電子機器）の製造・販売が事業の中心であり、閉じた集合の既存値で表せるため taxonomy gap は記録していない。
- relatedCompanies: 特定投資株式の保有目的は、工業用ガス検知警報器関連と家庭用ガス警報器関連で銘柄ごとに取引分野が個別に印字されており、各銘柄の販売分野が異なるため、その分野の販売先としてリンクした。
- relatedCompanies: 東京電力ホールディングス株式会社は、主に工業用ガス検知器、検知警報器関連に係る取引の強化のため保有していることが印字されているが、百科事典に同社のエントリーファイルが存在しないためリンクしていない。
- relatedCompanies: 株式会社ノーリツ及びアイホン株式会社は、保有目的が「全般的な取引関係の維持・強化のため」という汎用的な文言のみで、取引分野や役割の個別の印字がないためリンクしていない。
- relatedCompanies: 株式会社トクヤマは、保有目的が「当社グループ会社を通じた関係維持、強化のため」と当社との直接の取引役割の印字がないためリンクしていない。
- relatedCompanies: 株式会社三菱ＵＦＪフィナンシャル・グループ、第一生命ホールディングス株式会社、野村ホールディングス株式会社は、保有目的が安定的な金融取引の維持強化のためであり、金融取引の文脈のみのためリンクしていない。
- relatedCompanies: 連結子会社及び持分法適用関連会社は当社グループの会社であるためリンクしていない。新潟コスモス株式会社は当社グループ外の販売委託先として事業の内容に印字されているが、百科事典にエントリーファイルが存在しないためリンクしていない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

- businessModel: 当社は、岩谷産業株式会社と米国における家庭用ガス警報器の生産管理業務を目的とした新しい合弁会社（Iwatani New Cosmos America Inc.）を2026年6月15日に設立いたしました（重要な後発事象に印字）。本登録は2026年3月31日時点のグループ構成（当社、子会社13社及び関連会社3社）で行います。
- businessStructure: 当社は、岩谷産業株式会社と米国における家庭用ガス警報器の生産管理業務を目的とした新しい合弁会社（Iwatani New Cosmos America Inc.）を2026年6月15日に設立いたしました（重要な後発事象に印字）。本登録は2026年3月31日時点のグループ構成（当社、子会社13社及び関連会社3社）で行います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
