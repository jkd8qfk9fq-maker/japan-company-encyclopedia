# 第一興商 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社第一興商 |
| 証券コード | 7458 |
| docID（データを取り出した文書） | `S100YK39` |
| 原本 docID | `S100YK39` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK39.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社第一興商 / 7458 / docID S100YK39（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daiichikosho: 10 件の数値を有報XBRLと照合
有報: 株式会社第一興商 有価証券報告書－第51期(2025/04/01－2026/03/31) (docID S100YK39)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daiichikosho: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで重複年度は全行一致しました。
- businessModel: 財務諸表の組替えは、営業外費用の「その他」に含めていた支払和解金を独立掲記するための表示方法の変更のみで、売上高・当期純利益の5年間の数値に影響がないため、financialNotes は書きませんでした。
- businessModel: 中期経営計画の定量目標の数値は、本文の規則により strategy には書きませんでした。
- businessStructure: 事業は、セグメント注記の外部顧客への売上高の大きい順に並べました。「その他」は報告セグメントに含まれない区分のため、最後に置きました。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: セグメント別の売上高を百万円単位で合計すると162,948百万円となり、印字の合計162,950百万円と2百万円ずれますが、千円単位の丸めによるもので、印字の値をそのまま引用しました。
- history: 沿革の表は途中で見出しが繰り返されていますが、年月と事象の並びは連続しているため、行順のとおりに読み取りました。
- industry: 主たる業界は、業務用カラオケ事業とカラオケ・飲食店舗事業が売上高の中心であることと、カラオケを核とする事業内容から entertainment としました。
- relatedCompanies: キリンホールディングス・共同印刷：当事業年度に保有する株式のすべてを売却済みのため結ばない。
- relatedCompanies: 横浜フィナンシャルグループ・三菱ＵＦＪフィナンシャル・グループ・みずほフィナンシャルグループ・三井住友フィナンシャルグループ・三井住友トラストグループ・東京きらぼしフィナンシャルグループ：安定的な資金調達が目的の政策保有で、取引・提携の印字がないため結ばない。
- relatedCompanies: アサヒビール：2026年3月31日現在の大株主（3.52％）だが非上場の事業会社のため結ばない。親会社のアサヒグループホールディングスは酒類の仕入の取引があるため supplier で結んだ。
- relatedCompanies: 保志忠郊・保志治紀：個人の大株主のため結ばない。ホシ・クリエート：非上場のため結ばない。
- relatedCompanies: 連結子会社38社（国内販売子会社、日本クラウン、徳間ジャパンコミュニケーションズ、クレストほか）：すべて非上場のため結ばない。
- relatedCompanies: ケル・キング・キャリア・エン・ランド・レイ・フジ・ヒット・ステップ・ベース・ビジョン・フリー・イノベーション・イシン・ナック・セキ・テイン・ゼロ・アミューズ・応用技術・コア・コロナ・カバー・スローガン・日新・ニットー・ズーム・田谷：断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- terms: 新たに提案する用語はありません。通信カラオケ「DAM」やカラオケルーム「ビッグエコー」などの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
