# ディー・エヌ・エー — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ディー・エヌ・エー |
| 証券コード | 2432 |
| docID（データを取り出した文書） | `S100YLDV` |
| 原本 docID | `S100YLDV` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLDV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ディー・エヌ・エー / 2432 / docID S100YLDV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dena: 10 件の数値を有報XBRLと照合
有報: 株式会社ディー・エヌ・エー 有価証券報告書－第28期(2025/04/01－2026/03/31) (docID S100YLDV)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
dena: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 「新規事業・その他」は報告セグメントに含まれない区分のため、事業の並びの最後に置いています。
- businessModel: 株式会社ポケモンは売上収益の10%以上を占める主要な顧客ですが、非上場のため関連企業には結んでいません。
- businessStructure: セグメント別の金額は、セグメント注記の外部顧客への売上収益を用いています。
- history: 沿革は有報の【沿革】の記載から主な出来事を選びました。
- history: GO株式会社の株式一部売却（2026年6月16日）は、有報の沿革の注記に記載された提出前の出来事として含めています。
- industry: 主たる業界は、売上収益の最も大きいゲーム事業からエンターテインメントとしました。
- relatedCompanies: GO（go）: 2026年6月16日付で保有株式の一部を売却し、持分法適用関連会社ではなくなったため結びませんでした（有報の沿革の注記に記載）。
- relatedCompanies: Cygames: 持分法適用関連会社（21.0%）ですが非上場のため結びませんでした。
- relatedCompanies: 株式会社ポケモン: 売上収益の10%以上を占める主要な顧客ですが非上場のため結びませんでした。
- relatedCompanies: 南場智子: 18.47%を保有する筆頭株主ですが個人のため結びませんでした。
- relatedCompanies: 株式会社ATRA: 5.46%を保有する大株主ですが非上場のため結びませんでした。
- relatedCompanies: 連結子会社47社のうち上場しているのは株式会社データホライゾンのみで、他の連結子会社は非上場のため結びませんでした。
- relatedCompanies: Apple Inc.とGoogle Inc.: アプリ配信の契約相手ですが、外国企業で関連企業候補にないため結びませんでした。
- relatedCompanies: セキ（seki）: 「セキ」は一般語・部分一致の誤マッチのため結びませんでした。
- relatedCompanies: ランド（land）: 「ランド」は「グランドケイマン島」の部分一致のため結びませんでした。
- relatedCompanies: エン（en）: 「エン」は「エンターテインメント」の部分一致のため結びませんでした。
- relatedCompanies: ポート（port）: 「ポート」は「カスタマーサポート」などの部分一致のため結びませんでした。
- relatedCompanies: レイ（ray）: 「レイ」は一般語・部分一致の誤マッチのため結びませんでした。
- relatedCompanies: ビジョン（vision）: 「ビジョン」は「ミッション及びビジョン」の一般語のため結びませんでした。
- relatedCompanies: テイン（tein）: 「テイン」は部分一致の誤マッチのため結びませんでした。
- relatedCompanies: ステップ（step）: 「ステップ」は収益認識の「5つのステップ」の一般語のため結びませんでした。
- relatedCompanies: トラスト（trust）: 「トラスト」は日本マスタートラスト信託銀行の部分一致のため結びませんでした。
- relatedCompanies: フリー（freee）: 「フリー」は「フリーランス法」の部分一致のため結びませんでした。
- relatedCompanies: イノベーション（innovation）: 「イノベーション」は「AIイノベーション事業本部」の一般語のため結びませんでした。
- relatedCompanies: ベース（base-4481）: 「ベース」は「週次ベース」の一般語のため結びませんでした。
- relatedCompanies: キャリア（career）: 「キャリア」は「キャリアパス」の一般語のため結びませんでした。
- relatedCompanies: データセクション（datasection）: 保有株式をすべて売却し、売却後の所有株式数が0株のため結びませんでした。
- relatedCompanies: 地主（jinushi）: 「地主」は一般語・部分一致の誤マッチのため結びませんでした。
- relatedCompanies: パス（path）: 「パス」は「キャリアパス」の部分一致のため結びませんでした。
- relatedCompanies: 田谷（taya）: 「田谷」は「世田谷区」の部分一致のため結びませんでした。
- relatedCompanies: 日新（nissin）: 「日新」は一般語・部分一致の誤マッチのため結びませんでした。
- terms: 用語候補として、Mobage（モバゲー）、Pococha（ポコチャ）、IRIAM（イリアム）、Pokémon Trading Card Game Pocket（ポケポケ）、BASEGATE横浜関内、Join（ジョイン）、MYCODE（マイコード）があります。いずれも既存の用語集には無いため、本文ではリンク記法を使っていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
