# セガサミーホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | セガサミーホールディングス株式会社 |
| 証券コード | 6460 |
| docID（データを取り出した文書） | `S100YYNN` |
| 原本 docID | `S100YD3K` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YYNN／有効文書 S100YYNN（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYNN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | セガサミーホールディングス株式会社 / 6460 / docID S100YD3K（id は英語表記「SEGA SAMMY HOLDINGS INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sega-sammy-holdings: 10 件の数値を有報XBRLと照合
有報: セガサミーホールディングス株式会社 訂正有価証券報告書－第22期(2025/04/01－2026/03/31) (docID S100YYNN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第22期(2025/04/01－2026/03/31)、docID S100YYNN）を有効文書としてこのパックを作った。原本は docID S100YD3K。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（OverviewOfAffiliatedEntitiesTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sega-sammy-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益・調整後EBITDA・減損損失の金額・総資産などは方針により書いていない。
- businessModel: 戦略と強み（perspectives）は省いた。
- businessModel: Wikipedia・related-candidates は証拠パックに無く使っていない。
- businessStructure: 有効文書は訂正有報（原本 S100YD3K）。訂正は【関係会社の状況】の本文のみで、数値は原本と同一。
- businessStructure: 事業の並びは外部顧客への売上高の順（エンタテインメントコンテンツ 326,639 → 遊技機 132,063 → ゲーミング 25,312）。調整額3,526百万円は事業セグメントに帰属しない売上高で、事業としては載せていない。
- businessStructure: セグメント利益・減損損失などの金額は本文方針により書いていない。
- history: 沿革表は年月と事象が対応した通常の表。2012年5〜6月の川越工場・ロジスティクスセンター新設、2015年の新設分割、2017年1月と2020年12月・2021年3月の連結除外、2018年の本社移転、2024年の吸収分割・商号変更、フェニックスリゾートの取得（2012年）と売却（2024年）は、読者への重要度を考えて省いた。
- industry: 外部顧客への売上高の大半はエンタテインメントコンテンツ事業（326,639百万円）と遊技機事業（132,063百万円）。最大のゲーム事業を軸に entertainment を主とした。遊技機・ゲーミングを個別に表す業界値は無いが、報告セグメント単位の追加は見送った。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる掲載済み企業の候補が無いため、関連企業は結ばなかった。
- relatedCompanies: 【関係会社の状況】の相手（㈱セガ・サミー㈱・Rovio・PARADISE SEGASAMMY など）は、いずれも非上場の子会社・関連会社で、掲載済み企業ではない。
- relatedCompanies: 【大株主の状況】は sections.txt を確認しておらず、major-shareholder も結んでいない。
- terms: 用語の追加提案（助言）: F2P（基本プレイ無料のゲーム）、スマスロ（メダルを使わない新しいパチスロ）、ゲーミング機器（カジノ向けスロットマシンなど）、統合型リゾート（IR）、持分法適用関連会社。既存の用語集に無ければ追加を検討。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] セガサミーホールディングスの遊技機事業・ゲーミング事業 → 提案: 遊技機・カジノ関連（gaming-amusement）。パチスロ・パチンコ機とカジノ向けゲーミング機器は、ゲームや映像のエンタテインメントとは市場が異なるが、閉じた分類に該当する値が無い。
