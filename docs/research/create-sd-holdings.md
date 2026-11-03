# クリエイトＳＤホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社クリエイトＳＤホールディングス |
| 証券コード | 3148 |
| docID（データを取り出した文書） | `S100YXNS` |
| 原本 docID | `S100YXNS` |
| 提出日（原本） | 2026-08-20 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YXNS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社クリエイトＳＤホールディングス / 3148 / docID S100YXNS（id は英語表記「CREATE SD HOLDINGS CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 1 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
create-sd-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社クリエイトＳＤホールディングス 有価証券報告書－第29期(2025/06/01－2026/05/31) (docID S100YXNS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
create-sd-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社クリエイトSDホールディングス」が EDINET の提出者名「株式会社クリエイトＳＤホールディングス」と違います
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…減損損失の計上がありましたが、増収が利益を支えました。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 「神奈川県を中心に」は地区別売上の構成比（神奈川県60.3％）に基づきます。
- businessModel: 利益の段は、規則により営業利益・経常利益を書かず、当期純利益だけを書きました。
- businessStructure: 有報は「ドラッグストア事業の割合が高く開示情報としての重要性が乏しい」としてセグメント情報の記載を省略しています。報告セグメントは無く、事業は【事業の内容】の3区分（ドラッグストア／スーパーマーケット／有料老人ホーム・デイサービス）によります。
- businessStructure: 並び順はMD&Aの商品部門別売上実績（ドラッグストア事業488,657／スーパーマーケット事業5,909／介護事業2,351百万円）の大きい順です。セグメント注記の外部顧客への売上高ではなく、部門別売上実績に基づきます。
- businessStructure: ドラッグストア事業の売上は商品部門別の内訳（医薬品・化粧品・食料品など）が印字されていますが、事業の区分ではなく商品の種類なので children にはせず、説明文でだけ触れ、金額は書いていません。
- businessStructure: 「スーパーマーケット事業が前年同期の約2.3倍」はMD&Aの前年同期比228.5％の言い換えです。
- businessStructure: 株式会社八百半ホールディングス（不動産事業を営む子会社経営の会社）は【関係会社の状況】に載っていますが、独立した事業としては書かず、スーパーマーケット事業の取得の説明にとどめました。
- history: 株式分割・発行可能株式総数の変更・株式交換契約の決議手続き・特例有限会社への移行などの手続き的な行は、事業の姿を読み取る助けにならないため省き、必要なものだけ説明文に入れました。
- industry: 医薬品・化粧品等の小売販売を主たる業務とし、売上の大半がドラッグストア事業のため小売としました。調剤・介護は金額が独立した報告セグメントでないため、医薬品などは足していません。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業の候補がありません。【関係会社の状況】の子会社8社（クリエイトエス・ディー、ウェルライフ、サロンデイ、百合ヶ丘産業、八百半ホールディングス、八百半フードセンター、エスタ、クリエイトビギン）はいずれも上場でなく、掲載済み企業でもないため結びませんでした。
- terms: 用語の助言：EDLP（エブリデイ・ロープライス。毎日低価格で売る施策）、調剤薬局（併設・専門の違い）、プライベートブランド商品が、初めて読む人に説明が要る語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
