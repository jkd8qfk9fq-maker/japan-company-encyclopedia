# アークランズ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アークランズ株式会社 |
| 証券コード | 9842 |
| docID（データを取り出した文書） | `S100Z7KT` |
| 原本 docID | `S100Y5KN` |
| 提出日（原本） | 2026-05-21 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100Z7KT／有効文書 S100Z7KT（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z7KT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アークランズ株式会社 / 9842 / docID S100Y5KN（id は英語表記「ARCLANDS CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
arclands: 10 件の数値を有報XBRLと照合
有報: アークランズ株式会社 訂正有価証券報告書－第57期(2025/03/01－2026/02/28) (docID S100Z7KT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第57期(2025/03/01－2026/02/28)、docID S100Z7KT）を有効文書としてこのパックを作った。原本は docID S100Y5KN。原本との主要財務の差異: S100Z7KT（5件） — amendments.records[].comparedToBase を見ること
注意: 訂正有報の分類: financial-change — 数値が原本と異なる（主要財務 5 件／その他の数値 85 件: AccountsPayableOther・AccountsPayableTrade・AccountsReceivableTrade・AccruedExpenses・AllowanceForDoubtfulAccountsCA・AmortizationOfGoodwillOpeCF・AmortizationOfGoodwillSGA・Assets・BasicEarningsLossPerShareSummaryOfBusinessResults・ComprehensiveIncome・ComprehensiveIncomeAttributableToOwnersOfTheParent・ComprehensiveIncomeSummaryOfBusinessResults）。このパックの数値は有効文書のもの。原本の数値を出典にした記述が混ざっていないか確認すること
注意: 訂正有価証券報告書－第56期(2024/03/01－2025/02/28) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第55期(2023/03/01－2024/02/29) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
arclands: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・総資産などは本文に書かない規則のため省いた。売上高は、営業収入を含む357,076百万円ではなく、有報が「売上高」と印字する341,051百万円を使った。
- businessModel: 訂正有報による原本との差異（売上高・純利益など）は financialNotes に事実だけを書いた。
- businessStructure: 事業の並びは2026年2月期の外部顧客への営業収益の大きい順（小売→外食→不動産→卸売）。その他は報告セグメントに含まれないため最後。
- businessStructure: セグメントの金額は営業収益（売上高と営業収入の合計）で印字され、連結の売上高とは基準が違うため本文に書かなかった。
- businessStructure: 「その他」の説明は金額を書かない形に直した（余分な金額を避けるため）。
- history: 沿革表は月と事象が対応して読めた。主要な出来事を選んで載せ、1970年の個人経営からの改組や1976〜1994年の本社移転・小規模な設立は省いた。
- history: 2007年・2014年のアークランドサービスの上場市場の出来事は子会社の単独上場のため省いた。
- industry: 売上の大半は小売事業（ホームセンター）の報告セグメントのため、小売を主たる業界にした。外食事業に合う業界の値が無いが、小売に含めて暫定とはせず、副次の業界は付けなかった。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる上場企業の候補が無いため、関連企業は結ばなかった。
- relatedCompanies: 株式会社ジョイフルエーケー（持分法適用関連会社、議決権15.0％）は上場企業として確認できる候補に無く、結ばなかった。
- relatedCompanies: アークランドサービスホールディングス（子会社）は100％子会社で非上場のため結ばなかった。
- terms: 用語の助言: 「ホームセンター」「DIY」「フランチャイズ（FC）」「持株会社」「営業収入」は、読者が迷いやすい語として用語集に置く価値がある。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
