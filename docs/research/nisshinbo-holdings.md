# 日清紡ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日清紡ホールディングス株式会社 |
| 証券コード | 3105 |
| docID（データを取り出した文書） | `S100XT05` |
| 原本 docID | `S100XT05` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT05.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日清紡ホールディングス株式会社 / 3105 / docID S100XT05（id は英語表記「Nisshinbo Holdings Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nisshinbo-holdings: 10 件の数値を有報XBRLと照合
有報: 日清紡ホールディングス株式会社 有価証券報告書－第183期(2025/01/01－2025/12/31) (docID S100XT05)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":679956000000,"latestFiling":680112000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":297449000000,"latestFiling":297785000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nisshinbo-holdings: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 地域別売上高は日本315,631百万円が最大。アジアの合計は印字されておらず、足し算した値は書けないため、customer 段では『日本向けが最も大きい』とだけ書いた。
- businessModel: 本文に遡及適用の記載があるが、前期有報と重複年度は全て一致（修正再表示なし）のため financialNotes は書かなかった。
- businessModel: customer 段の顧客像は事業の内容・セグメント注記の製品説明から読める範囲に留めた。具体的な顧客名は有報に無い。
- businessModel: perspectives は書けるだけの根拠を絞り、省いた。
- businessStructure: 並び順はセグメント注記の2025年12月期『外部顧客への売上高』の大きい順：無線・通信251,837 > マイクロデバイス62,400 > ブレーキ57,795 > 精密機器55,442 > 繊維33,345 > 不動産17,939 > 化学品9,736。報告セグメントに含まれない『その他』(13,841)は最後に置いた。
- businessStructure: shortNameEn は表紙の英訳名 Nisshinbo Holdings Inc. から『Holdings Inc.』を除いたもの。
- businessStructure: listings の market は表紙が『東京証券取引所プライム市場』と印字しているため記載した。
- businessStructure: children は使っていない（精密機器の成形品・精密部品・システム機などは売上高が独立して開示されていないため）。
- history: 沿革は海外子会社・工場新設の多くを省き、グループの形を変えた出来事だけを選んだ。
- history: significance のうち『もともとは繊維の会社』『現在のグループ体制の始まり』などは、設立時の社名（日清紡績）と持株会社化後の事業会社の構成から読める範囲の説明に留めた。
- industry: 主たる業界は最大の報告セグメント『無線・通信』（無線通信機器・社会インフラ向け電子システム）で electronics とした。通信事業者ではないため telecommunications にはしていない。
- industry: 半導体は報告セグメント『マイクロデバイス』（アナログ半導体・電源IC）、自動車は報告セグメント『ブレーキ』を根拠に追加した。
- industry: 繊維・化学品・不動産は該当する業界値がないが、いずれも小さい報告セグメントのため taxonomyGaps にはしなかった。
- relatedCompanies: related-candidates.json が証拠パックに存在せず、掲載済みの上場企業との同一性を確認できる候補がないため、結んだ相手はない。
- relatedCompanies: SAERON AUTOMOTIVE CORPORATION（議決権65.00％の連結子会社、韓国取引所上場）は子会社だが、掲載済み企業の候補として機械抽出されておらず、同一性を確認できないため結ばなかった。
- relatedCompanies: オモビオ㈱など持分法適用関連会社（議決権35.00％）は非上場で、掲載済み企業でもないため結ばなかった。
- terms: 用語集への追加候補（助言）：事業持株会社、アナログ半導体、電源IC、ブレーキ摩擦材、スパンデックス、持分法適用関連会社。いずれも本文では説明を添えて書いており、リンクは使っていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
