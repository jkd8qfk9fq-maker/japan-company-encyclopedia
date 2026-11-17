# オーエスジー — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | オーエスジー株式会社 |
| 証券コード | 6136 |
| docID（データを取り出した文書） | `S100XM3S` |
| 原本 docID | `S100XM3S` |
| 提出日（原本） | 2026-02-19 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-16 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XM3S.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | オーエスジー株式会社 / 6136 / docID S100XM3S（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
osg: 10 件の数値を有報XBRLと照合
有報: オーエスジー株式会社 有価証券報告書－第113期(2024/12/01－2025/11/30) (docID S100XM3S)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
osg: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年改正会計基準の遡及適用の注記を確認し、第112期は遡及適用後の指標である旨をfinancialNotesに記載しました。前期有報との重複年度の数値に差異はありません。
- businessModel: 収益認識に関する会計基準を第110期の期首から適用している旨もfinancialNotesに記載しました。
- businessStructure: 当社グループは、当社、子会社100社及び関連会社4社で構成されています。
- businessStructure: 各事業の外部顧客への売上高の合計は160,617百万円で、印字の合計160,619百万円と2百万円ずれますが、有報の丸めによるものとして、各事業の金額は印字どおりに記載しています。
- businessStructure: 製品及びサービスごとの外部顧客への売上高は、ねじ切り工具53,688百万円、ドリル他切削工具49,826百万円、ミーリングカッター29,300百万円、転造工具10,996百万円、測定工具2,144百万円、その他14,661百万円です。合計は160,615百万円で印字の合計160,619百万円と4百万円ずれますが、有報の丸めによるものです。
- businessStructure: 重要な後発事象は該当事項ありません。
- history: 2006年に締結したタンガロイとの資本・業務提携契約は2008年に解消し、新たな業務提携契約を締結しました。15件の選定からは外しました。
- industry: 主たる業界は機械としました。報告セグメントは地域別で、製品は精密機械工具です。半導体向けの事業を独立して開示していないため、半導体は付けていません。
- relatedCompanies: 株式会社クラークソンは持分法適用関連会社で31.5%を保有していますが、非上場のため結びませんでした。
- relatedCompanies: 旭ダイヤモンド工業株式会社は当事業年度に株式をすべて売却したため結びませんでした。
- relatedCompanies: 株式会社アストロスケールホールディングスは保有目的が持続可能な社会への貢献のみで、取引の印字がないため結びませんでした。
- relatedCompanies: 大株主の状況に載るのは信託銀行、持株会、財団、外国法人、三井住友銀行のみで、結べる事業会社はありません。三井住友銀行は資金調達目的の政策保有のため結びませんでした。
- relatedCompanies: 連結子会社はすべて非上場または海外法人のため結びませんでした。
- relatedCompanies: エン、ランド、ポート、セキ、ベース、フリー、キャリア、スローガン、トラスト、コタ、アイル、ビジョン、ゼロ、イノベーション、イシン、高速、レック、日新、ニックス、ノダ、ローム、ステップ、セック、山大、イムラは、社名の断片一致のみで会社としての言及がないため結びませんでした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
