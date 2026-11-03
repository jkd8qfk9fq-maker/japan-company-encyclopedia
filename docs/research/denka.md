# デンカ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | デンカ株式会社 |
| 証券コード | 4061 |
| docID（データを取り出した文書） | `S100YCU0` |
| 原本 docID | `S100YCU0` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCU0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | デンカ株式会社 / 4061 / docID S100YCU0（id は英語表記「Denka Company Limited」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
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
denka: 10 件の数値を有報XBRLと照合
有報: デンカ株式会社 有価証券報告書－第167期(2025/04/01－2026/03/31) (docID S100YCU0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
denka: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙DEIの2026年3月期（12か月）。前期の純利益は123億円の損失（MD&A印字、5年表では-12,300百万円）。
- businessModel: 地域別売上割合は【関連情報】の印字（日本55.8％、海外44.2％）。中国の売上高は【関連情報】の百万円表記（53,263百万円）のまま書いた。
- businessStructure: 並び順は【セグメント情報】の2026年3月期「外部顧客への売上高」（百万円）：ポリマー124,161＞電子・先端104,430＞エラストマー97,583＞ライフ40,520。その他17,552は報告セグメントに含まれないため最後。MD&Aの順（電子・先端が先頭）には従っていない。
- businessStructure: 金額は MD&A に印字された「億円・百万円」表記のまま書いた。セグメント利益は書いていない。
- businessStructure: 決算期は表紙DEIの2026年3月期（12か月）。前期有報との重複年度に修正再表示なし。brief.md の財務諸表の組替え記載は、セグメント売上高の比較に影響しない範囲と判断した。
- businessStructure: customers は書いていない：売上高の10％を超える特定の外部顧客がないと印字。
- history: 沿革の表は年月と事象が連結して印字されている。事象ごとに年月が付いているため行順の対応づけは不要。60行ほどのうち主要な出来事を選んだ。
- history: 2026年3月の東洋スチレンの子会社化は【関係会社の状況】の注記（2026年3月31日付）による。
- industry: 主業界は、売上の大半を占める3報告セグメント（ポリマー、電子・先端、エラストマー・インフラ）の化学。半導体は、電子・先端プロダクツで溶融シリカ・球状アルミナ・半導体工程用材料を事業として開示しているため2つ目。医薬品は、ライフイノベーション（ワクチン・診断薬・がん治療ウイルス製剤）が報告セグメントのため付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業の中に有報が社名を印字する相手を機械で確認できなかったため、関連企業は結ばなかった。
- relatedCompanies: 三井物産（デンカパフォーマンスエラストマーLLCの共同出資者）・住友化学・東ソー・三井化学・ダイセル・日鉄ケミカル＆マテリアル（沿革に社名のみ）は、過去の事業統合・提携で現在の取引関係の印字がなく、候補の裏付けもないため結ばない。
- relatedCompanies: SCG CHEMICALS（タイ合弁の相手）は上場企業としての同一性を確認できず結ばない。
- terms: 用語の候補（助言のみ）: クロロプレンゴム、アセチレンブラック、溶融シリカ・球状アルミナ、特殊混和材、POCT（臨床現場即時検査）、カーバイド。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
