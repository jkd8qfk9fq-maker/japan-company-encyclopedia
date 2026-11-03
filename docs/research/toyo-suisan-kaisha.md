# 東洋水産 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東洋水産株式会社 |
| 証券コード | 2875 |
| docID（データを取り出した文書） | `S100YDW0` |
| 原本 docID | `S100YDW0` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDW0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東洋水産株式会社 / 2875 / docID S100YDW0（id は英語表記「TOYO SUISAN KAISHA, LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toyo-suisan-kaisha: 10 件の数値を有報XBRLと照合
有報: 東洋水産株式会社 有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YDW0)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":507600000000,"latestFiling":512277000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":62867000000,"latestFiling":63847000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":83919000000,"latestFiling":85166000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toyo-suisan-kaisha: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 前期有報と2025年3月期の売上高・当期純利益が異なる（507,600→512,277、62,867→63,847、百万円）。理由は2026年3月期からの在外子会社等の換算方法の変更を前期へ遡及適用したため（セグメント注記「前連結会計年度については遡及適用後の数値を記載」）。financialNotes に記録。
- businessModel: 戦略・強み・業界内の位置づけは、この工程では読み込んでいないため perspectives を省いた。
- businessStructure: 並び順は2026年3月期の外部顧客への売上高の順（海外即席麺248,153／国内即席麺104,423／低温食品61,543／水産食品32,738／冷蔵26,318／加工食品23,378、単位百万円）。その他は報告セグメントに含まれないため最後。金額は本文に書いていない。
- businessStructure: 事業の内容の(1)〜(7)の番号順（水産食品が先頭）ではなく、売上順を採った。
- history: 2013年以降の沿革は年月セル10個（2013年4月〜2025年11月）と事象文10個が分かれて印字された崩れた表。数が同じなので行順で対応づけた（2013.4シマヤ／2016.8関西工場／2017.9ブラジル／2018.8総合研究所／2019.1神戸物流センター／2020.5石狩新港物流センター／2022.4プライム／同月ユタカフーズ市場移行／2024.7つくばフーズ／2025.11連結子会社間の合併）。そのうち年のみで使ったのは2013・2017・2022。
- history: 2010年1月・2012年3月の2セルと事象（関東工場新設／札幌工場の北海道工場移転）も同様に行順の対応だが、使っていない。
- industry: 売上の大半は即席麺・低温食品・加工食品・水産食品の報告セグメントで、食品が主たる業界。
- relatedCompanies: related-candidates.json が証拠パックに無かった。ユタカフーズは掲載済み企業（yutaka-foods）で、有報が連結子会社・提出会社と印字するため結んだ。
- relatedCompanies: 仙波糖化工業（持分法適用関連会社、上場）: 掲載済み企業ファイルが見つからず、同一性を確認できないため結ばない。
- relatedCompanies: 三井物産（主要な顧客として印字）: 掲載済み企業ファイルが見つからないため結ばない。
- relatedCompanies: フクシマフーズ・酒悦・シマヤなど他の子会社: 上場企業ではないため結ばない（シマヤは非上場の連結子会社）。
- terms: 用語の提案: 即席麺、低温食品（チルド・冷凍）、無菌包装米飯、冷蔵事業（コールドチェーン）。既存の用語 id は確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
