# 和弘食品 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 和弘食品株式会社 |
| 証券コード | 2813 |
| docID（データを取り出した文書） | `S100YGOO` |
| 原本 docID | `S100YGOO` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGOO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 和弘食品株式会社 / 2813 / docID S100YGOO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wakou-shokuhin: 10 件の数値を有報XBRLと照合
有報: 和弘食品株式会社 有価証券報告書－第63期(2025/04/01－2026/03/31) (docID S100YGOO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
wakou-shokuhin: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記方針：千円の印字は百万円に切り捨てて記載した（切り上げはしていない）。地域別セグメントの外部顧客への売上高は日本12,864百万円・米国4,478百万円で、切り捨て後の合計17,342百万円は、印字された連結売上高17,343百万円と1百万円異なるため、印字どおり併記した。
- businessModel: MD&Aの日本セグメントの売上高13,212百万円はセグメント間の内部売上高を含む数値のため使わず、セグメント情報の外部顧客への売上高を用いた。
- businessModel: suppliers はこのツリーのスキーマに無いため省略した。なお原材料の一部は、その他の関係会社である日清オイリオグループ株式会社より購入している（関係会社の状況に印字）。
- businessModel: 生産実績（日本8,935百万円・米国2,684百万円、製造原価による算定）は売上高ではないため、本文の数値には使っていない。
- businessModel: 中期経営計画「ザ・グレートリセット」及び2026年３月策定の中期３ヶ年経営計画について、有報に数値目標の印字はない。
- businessStructure: 連結子会社はWAKOU USA INC.（アメリカ合衆国カリフォルニア州、議決権の所有割合100％、特定子会社）１社である。
- businessStructure: 非連結子会社は和弘エキス株式会社（2025年２月に株式を取得し子会社化）、WAKOU RAMEN(Thailand)Co.,Ltd.（2025年３月にタイ王国に設立）、WAKOU RAMEN UK LTD.（2026年１月に英国に設立）の３社で、いずれも未上場のため関連企業には含めず、ここに記録する。
- businessStructure: その他の関係会社である日清オイリオグループ株式会社（当社に対する議決権の被所有割合19.24％）は、関連企業（relatedCompanies）に記載した。
- history: 沿革の設立行に印字された資本金の金額は、規則により本文に記載していない。
- history: 2017年10月１日付で普通株式10株につき１株の割合の株式併合を実施しているが、これは重要な契約等の注記にのみ現れる事項で、主要な経営指標等の注記には記載がないため、needsReviewには含めず、ここに記録する。
- industry: 食品製造事業（業務用調味料の製造販売）が単一事業であり、東京証券取引所の業種も食料品のため、主たる業界は food とした。閉じた分類に業務用調味料の区分はないが、food が直接該当するため taxonomyGaps は記録しない。
- relatedCompanies: JFC International Inc.は米国セグメントの主要な顧客（2026年３月期の売上高2,256百万円）であるが、外国会社で関連候補（related-candidates.json）に含まれていないため、関連企業には含めず、ここに記録する。
- relatedCompanies: WAKOU USA INC.は連結子会社（議決権100％）で当社グループの会社であるため関連企業には含めない。和弘エキス株式会社、WAKOU RAMEN(Thailand)Co.,Ltd.、WAKOU RAMEN UK LTD.は非連結子会社で未上場のため含めない。
- relatedCompanies: 候補の seki は情報セキュリティの文脈、base-4481 は時価ベースの自己資本比率の文脈、land はコンビニエンスストアのプライベートブランドの文脈、en はコンビニエンスストア向け商品開発体制の文脈、the-lead は「戦略実行をリードする」の文脈、career と path はキャリアパスの文脈、daiwa は北海道岩見沢市大和の地名、vision は経営理念の（ビジョン）の文脈であり、いずれも当該企業との関係を示す印字がないため含めない。
- terms: 用語の助言のみの工程。業務用調味料は、レストランなどの外食事業者や食品加工の事業者が業務で使用する調味料の総称である。
- terms: 天然エキスは、畜肉や水産物などの天然素材からうま味の成分を抽出した調味料で、同社はその抽出技術を独自開発している。
- terms: 中食は、惣菜や弁当のように家庭外で調理された食品を、家庭などに持ち帰って食べる食事の形態を指す。
- terms: 別添用スープは、麺などに添えて提供するためのスープで、同社は1965年から製造・販売している。
- terms: FSSC22000は、食品安全マネジメントシステムに関する国際的な認証規格で、同社の製造工場が取得している。

## 要確認（status に反映）

- businessModel: 当社は2023年10月１日付で普通株式１株につき３株の割合の株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（分割は第59期（2022年３月期）の期首に行われたものとして指標が算定されています）。
- history: 当社は2023年10月１日付で普通株式１株につき３株の割合の株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（分割は第59期（2022年３月期）の期首に行われたものとして指標が算定されています）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
