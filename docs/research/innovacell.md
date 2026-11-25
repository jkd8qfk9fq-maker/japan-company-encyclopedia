# イノバセル — research log

Registered: 2026-11-25（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | イノバセル株式会社 |
| 証券コード | 504A |
| docID（データを取り出した文書） | `S100XUN8` |
| 原本 docID | `S100XUN8` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-23 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUN8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | イノバセル株式会社 / 504A / docID S100XUN8（id は英語表記「Innovacell Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 0 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
innovacell: 3 件の数値を有報XBRLと照合
有報: イノバセル株式会社 有価証券報告書－第5期(2025/01/01－2025/12/31) (docID S100XUN8)
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
innovacell: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高が全年度ないため、revenue の段は金額ではなく計上がない事実を書いた
- businessModel: perspectives は、会社の説明と事実の切り分けが難しい段階のため省いた
- businessStructure: 単一セグメントのため、製品区分はパイプラインの記載から children にした
- businessStructure: 関連情報に製品・サービスごとの情報の開示がないため、事業別の金額は書いていない
- history: 前身企業（現Innovacell GmbH）の沿革と当社の沿革が分かれて印字されているため、グループの節目として統合し、重複する項目は省いた
- relatedCompanies: Innovacell GmbH（連結子会社、議決権の所有割合100.0％、2025年12月31日現在）は未上場のため結ばなかった
- relatedCompanies: アルフレッサ株式会社（2024年11月に資本関係と業務提携基本契約の締結が沿革に記載）は、候補一覧（related-candidates.json）がパックに無く同一性を確認できないため結ばなかった
- terms: 用語の助言のみの工程のため data は空。細胞治療製品・再生医療等製品などの用語はの用語解説で読めるため、リンク記法は使っていない

## 要確認（status に反映）

- businessModel: 事業収益が主要な経営指標等の推移で全年度「－」のため、財務の売上は全年度nullとしています。売上が全年度空欄である取扱いには人の確認が必要です
- businessModel: 純資産額が第３期から第５期まで全年度マイナスで、債務超過の状態にあることが有報に記載されています。表示の取扱いには人の確認が必要です

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
