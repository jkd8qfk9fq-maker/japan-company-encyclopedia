# イズミ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社イズミ |
| 証券コード | 8273 |
| docID（データを取り出した文書） | `S100Y671` |
| 原本 docID | `S100Y671` |
| 提出日（原本） | 2026-05-26 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y671.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社イズミ / 8273 / docID S100Y671（id は英語表記「IZUMI CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
izumi: 10 件の数値を有報XBRLと照合
有報: 株式会社イズミ 有価証券報告書－第65期(2025/03/01－2026/02/28) (docID S100Y671)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-02-28","previousFiling":11919000000,"latestFiling":12304000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-02-28","previousFiling":25708000000,"latestFiling":26009000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-02-28","previousFiling":569611000000,"latestFiling":575963000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-02-28","previousFiling":299218000000,"latestFiling":299603000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
izumi: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の純利益の差異は、有報の企業結合に係る暫定処理の確定の注記で説明できると判断した。
- businessStructure: relatedCompanies 以外の工程は有報の本文のみを根拠にした。
- history: 沿革の表は年月と概要が連結して印字されており、行ごとに年月と事象を対応づけた。
- industry: 売上の大半を占める小売事業で小売に決めた。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる候補が無いため、誰も結ばなかった。
- relatedCompanies: セブン＆アイ・ホールディングス: 業務提携の記載はあるが、候補ファイルが無く上場の同一性を確認できない。
- relatedCompanies: マルヨシセンター: 持分法適用関連会社（議決権19.82％）で有報提出会社だが、候補ファイルが無く掲載済みかを確認できない。
- relatedCompanies: 西友: 事業承継の相手で、history の出来事として扱う。関係の種類には当たらない。
- terms: 用語の追加提案: ゼネラル・マーチャンダイジング・ストア（GMS）。衣料品・住居関連品・食料品を幅広く扱う大型の総合小売店で、小売事業の説明に使っている。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
