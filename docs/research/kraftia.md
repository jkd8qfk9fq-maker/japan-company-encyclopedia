# クラフティア — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社クラフティア |
| 証券コード | 1959 |
| docID（データを取り出した文書） | `S100YI0L` |
| 原本 docID | `S100YI0L` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI0L.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社クラフティア / 1959 / docID S100YI0L（id は英語表記「KRAFTIA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kraftia: 10 件の数値を有報XBRLと照合
有報: 株式会社クラフティア 有価証券報告書－第98期(2025/04/01－2026/03/31) (docID S100YI0L)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kraftia: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社クラフティア (旧会社名　株式会社九電工)」が EDINET の提出者名「株式会社クラフティア」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives は省いた。
- businessStructure: 関連企業の候補ファイルが証拠パックに無く、九州電力の掲載ページも確認できないため、リンク記法は使わなかった。
- history: 1945年の統合、各子会社の設立など細かい行は省いた。
- industry: 売上の大半は設備工事業（報告セグメント）のため建設を主とした。
- relatedCompanies: 九州電力: その他の関係会社（直接22.6％）だが、related-candidates.json が証拠パックに無く、上場の掲載済み企業として同一性を確認できないため結ばなかった。
- relatedCompanies: 九州電力送配電・九電送配サービス: 上場企業ではないため結ばなかった。
- relatedCompanies: 子会社・持分法適用関連会社: 候補ファイルに無く同一性を確認できないため結ばなかった（セントラル総合開発は上場だが候補で確認できず）。
- terms: 用語の追加提案: 配電線工事、空調管工事、設備工事業。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
