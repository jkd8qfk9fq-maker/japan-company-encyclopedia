# ＳＢＳホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＳＢＳホールディングス株式会社 |
| 証券コード | 2384 |
| docID（データを取り出した文書） | `S100XSXL` |
| 原本 docID | `S100XSXL` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSXL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＳＢＳホールディングス株式会社 / 2384 / docID S100XSXL（id は英語表記「SBS Holdings, Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sbs-holdings: 10 件の数値を有報XBRLと照合
有報: ＳＢＳホールディングス株式会社 有価証券報告書－第40期(2025/01/01－2025/12/31) (docID S100XSXL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sbs-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「SBSホールディングス株式会社」が EDINET の提出者名「ＳＢＳホールディングス株式会社」と違います
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…M&Aで売上高が大きく広がった一方で利益率が伸び悩んだため、不採算拠点の収支…）

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益と、物流セグメントの営業利益率は本文に書かない規則のため省いた。
- businessModel: 前期有報との間に修正再表示はなく、財務諸表の組替え・遡及適用の記載はテキスト内に見つからなかったため、financialNotes は書かない。
- businessStructure: 事業は【セグメント情報】の外部顧客への売上高の大きい順（物流・不動産・その他）。
- businessStructure: 物流事業の子区分には金額の独立した開示がないため、金額を書いていない。
- history: 沿革は多数の子会社の取得・合併があるため、グループの形を決めた主な出来事に絞った。
- industry: 物流事業が外部顧客への売上高の大半を占めるため運輸を主たる業界とした。不動産事業は報告セグメントとして売上高が開示されているため2つ目に付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み上場企業との同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: ㈱ゼロ（持分法適用関連会社・20.5%）: 有報を提出する会社と印字されているが、候補ファイルに無く上場・同一性を確認できない。
- relatedCompanies: ㈱ＫＭＫホールディングス・㈱鎌田企画（その他の関係会社・各49.5%）: 投資業の非上場の会社で、掲載済み上場企業ではない。
- relatedCompanies: ＳＢＳ東芝ロジスティクス・ＳＢＳリコーロジスティクス等の子会社: 非上場の連結子会社で対象外。
- terms: 用語集への追加候補（助言）: 3PL（サード・パーティ・ロジスティクス）、4PL、三温度帯物流（冷凍・冷蔵・常温）、物流施設の流動化、ラストワンマイル。既存の用語に無ければ検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
