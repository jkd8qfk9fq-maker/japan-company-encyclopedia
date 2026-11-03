# FOOD & LIFE COMPANIES — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＦＯＯＤ　＆　ＬＩＦＥ　ＣＯＭＰＡＮＩＥＳ |
| 証券コード | 3563 |
| docID（データを取り出した文書） | `S100XBTY` |
| 原本 docID | `S100XBTY` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBTY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＦＯＯＤ　＆　ＬＩＦＥ　ＣＯＭＰＡＮＩＥＳ / 3563 / docID S100XBTY（id は英語表記「FOOD &amp; LIFE COMPANIES LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
food-and-life-companies: 10 件の数値を有報XBRLと照合
有報: 株式会社ＦＯＯＤ　＆　ＬＩＦＥ　ＣＯＭＰＡＮＩＥＳ 有価証券報告書－第11期(2024/10/01－2025/09/30) (docID S100XBTY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第10期(2023/10/01－2024/09/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
food-and-life-companies: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社FOOD & LIFE COMPANIES」が EDINET の提出者名「株式会社ＦＯＯＤ　＆　ＬＩＦＥ　ＣＯＭＰＡＮＩＥＳ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益と当期利益（親会社の所有者に帰属する当期利益）だけを金額で書いた。印字は百万円表記のままで、換算していない。
- businessModel: perspectives は有報の戦略記述を確認していないため省いた。
- businessModel: 単一の製品・サービスのため製品別売上は有報に無い。
- businessStructure: 決算期は表紙のDEI（2025年9月30日終了、第11期）から「2025年9月期」。市場は表紙の「東京証券取引所プライム市場」。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の大きい順（265,903 > 131,420 > 23,425 > 8,153 > 674、百万円）。名前が「その他」でも報告セグメントなので売上順（最後だが売上も最小）。
- businessStructure: 当期から報告セグメントを4区分から5区分に変更（杉玉を独立）。前期は組替後の値で開示されているが、前期の金額は本文に書いていない。
- businessStructure: brief.md の注意（訂正有報・遡及適用）に対し、5年表は前期有報と全て一致（修正再表示なし）。訂正有報の内容は証拠パックに無く、本文では前期の絶対額を使っていない。
- history: 沿革は表が2つに分かれ、年月と事象が通常の形で対応している。主な出来事だけを選び、2017年の神明・元気寿司との資本業務提携（2019年6月解消）などは省いた。
- history: 2008年の記述にある「2008年1月に四国、4月に東北・九州、7月に北海道へ出店」は沿革の印字による。
- industry: 売上の大半を占める国内・海外スシロー事業は飲食店（回転すし）の運営。外食の区分が無いため最も近い food を暫定にした。
- relatedCompanies: related-candidates.json は証拠パックに無い。【関係会社の状況】の子会社は全て非上場で、上場の相手を結べないため空にした。
- relatedCompanies: 2017年の株式会社神明・元気寿司株式会社との資本業務提携は2019年6月に解消済みで、過去の提携のため結ばない。
- terms: 用語の追加提案: 「直営方式」「持株会社」「報告セグメント」は既存の用語にあれば参照してよい（存在は未確認のためリンクは書いていない）。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] FOOD & LIFE COMPANIES の回転すし店の運営 → 提案: 外食・飲食店（restaurants）。飲食店チェーンの運営は食品の製造・販売とは異なり、現在の区分では言い表せない。
