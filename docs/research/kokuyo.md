# コクヨ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | コクヨ株式会社 |
| 証券コード | 7984 |
| docID（データを取り出した文書） | `S100XUE1` |
| 原本 docID | `S100XUE1` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUE1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | コクヨ株式会社 / 7984 / docID S100XUE1（id は英語表記「KOKUYO CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 1 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kokuyo: 10 件の数値を有報XBRLと照合
有報: コクヨ株式会社 有価証券報告書－第79期(2025/01/01－2025/12/31) (docID S100XUE1)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":338227000000,"latestFiling":338837000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kokuyo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の2024年12月期の差（前期有報との差）は表示方法の変更による組替えで、有報の注記に理由がある。金額は書かず事実のみ financialNotes に記録した。
- businessStructure: 売順はセグメント注記の外部顧客への売上高（2025年12月期）で並べた。
- businessStructure: 報告セグメントに含まれない「その他」（アンテナショップ等）は外部顧客への売上高が242百万円と小さく、事業としては載せなかった。
- businessStructure: MD&Aの前期比（ファニチャー6.0％増など）と販売実績表の前期比（106.3）が一致しないため、増減率は書かず金額のみ記載した。
- history: 沿革の末尾（2011年10月・11月、2013年7月〜2022年7月）は年月と事象が分離した崩れた表だったため、事象と年月の対応が裏付けられるもの（2022年のHNI Hong Kong取得、プライム移行は2022年4月）だけ使った。2011年のコクヨカムリン取得は年のみ使用。
- history: 2022年の香港子会社化は月が崩れた表で特定できないため年のみ記載した。
- industry: 主力のファニチャー事業（オフィス家具の製造・販売）とステーショナリー事業を言える値が無い。卸・通販・小売の流通事業が合計で大きいため、最も近い retail を暫定にした。
- relatedCompanies: related-candidates.json が無く、掲載済みの上場企業で同一性を確認できる相手がいないため、関連企業は結ばなかった。子会社・関連会社は有報に載るが、いずれも掲載済みの上場企業として確認できない。
- terms: 用語の助言: 「持分法適用関連会社」「持株会社制」「報告セグメント」が解説候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] コクヨの主たる業界 → 提案: オフィス家具・文具・生活用品（または 家具・事務用品）。オフィス家具と文具を製造・販売する会社で、現在の21区分に合う値が無い。
