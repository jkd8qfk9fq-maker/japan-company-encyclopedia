# ケーユーホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ケーユーホールディングス |
| 証券コード | 9856 |
| docID（データを取り出した文書） | `S100YIY6` |
| 原本 docID | `S100YIY6` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIY6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ケーユーホールディングス / 9856 / docID S100YIY6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ku-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ケーユーホールディングス 有価証券報告書－第54期(2025/04/01－2026/03/31) (docID S100YIY6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ku-holdings: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは重複年度が全行一致のため、financialNotes は書きませんでした。
- businessStructure: 事業はセグメント注記の外部顧客への売上高の大きい順に並べました。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: 株式会社シュテルン西多摩は2026年4月に株式会社シュテルン世田谷に吸収合併されました。2026年3月31日現在の関係会社の状況には同社が連結子会社として載っています。
- history: 1988年6月の行には「商号を株式会社ケーユーに変更」も同じ行に印字されていますが、事象が2つ並んだ行のため採用しませんでした。
- history: 2026年4月の吸収合併は決算期末後の出来事ですが、有報の沿革の表に印字されているため採用しました。
- industry: 主たる業界は、自動車の販売及び修理を主たる事業とすることから automotive としました。東京証券取引所の業種分類は小売業ですが、事業内容から自動車販売が最も合います。
- industry: 輸入車ディーラー事業も自動車の販売のため、2つ目の業界は付けませんでした。
- relatedCompanies: 東名、田谷、日新、パス、大和、キャリア、ベース、コア、トラスト、コロナ、フリー、ポート、リコー、ゼロは、子会社の商号や一般語の断片一致のみで、会社との関係の記載がないため結びませんでした。
- relatedCompanies: ランドは「ブランド」の断片一致のみで、会社との関係の記載がないため結びませんでした。
- relatedCompanies: 横浜フィナンシャルグループは政策保有株式として保有していますが、取引関係の相手方は同社の子会社である横浜銀行で、上場会社である持株会社そのものとの取引の記載ではないため結びませんでした。
- relatedCompanies: 大株主は有限会社ヤマサン、株式会社ラグナ、信託銀行、個人などで、事業会社としての大株主は見当たらないため結びませんでした。
- relatedCompanies: 連結子会社6社は、すべて非上場のため結びませんでした。
- terms: 新たに提案する用語はありません。トータルディーラーなどの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
