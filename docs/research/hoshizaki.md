# ホシザキ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ホシザキ株式会社 |
| 証券コード | 6465 |
| docID（データを取り出した文書） | `S100XSOT` |
| 原本 docID | `S100XSOT` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSOT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ホシザキ株式会社 / 6465 / docID S100XSOT（id は英語表記「HOSHIZAKI CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 1 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hoshizaki: 10 件の数値を有報XBRLと照合
有報: ホシザキ株式会社 有価証券報告書－第80期(2025/01/01－2025/12/31) (docID S100XSOT)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":37170000000,"latestFiling":36936000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":57823000000,"latestFiling":57394000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":543944000000,"latestFiling":547638000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":382677000000,"latestFiling":382815000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第78期(2023/01/01－2023/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hoshizaki: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…最終的な利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: ブリーフに2024年の純利益の前期有報との差異（37,170→36,936百万円）の指摘あり。本文では2025年12月期のみを書き、2024年の値は使っていない。
- businessModel: 営業利益・調整後営業利益・セグメント利益は方針により書かない。
- businessStructure: 報告セグメントは日本・米州・欧州・アジアの4つ。外部顧客への売上高の大きい順（日本226,739→米州121,183→アジア80,319→欧州57,648百万円）に並べた。
- businessStructure: 製品区分（製氷機・冷蔵庫など）は全セグメント共通の区分で、セグメント別の内訳を子の事業にはしなかった。
- businessStructure: Wikipedia・関連候補ファイルは証拠パックに無く使っていない。
- history: 沿革表は年月と事象が整った形で読めたため、抜粋のみ。小さな工場開設・子会社設立は省いた。
- industry: フードサービス機器（製氷機・冷蔵庫・食器洗浄機）の製造販売のため、最も近い machinery を選んだ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業の候補が無いため、結ぶ相手はなし。子会社・関連会社（Fogel Company Inc. など）は未上場で対象外。
- terms: 用語の追加提案: フードサービス機器、ディスペンサ、超インフレ会計（トルコ）。既存の用語集との重複は未確認。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
