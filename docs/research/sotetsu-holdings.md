# 相鉄ホールディングス — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 相鉄ホールディングス株式会社 |
| 証券コード | 9003 |
| docID（データを取り出した文書） | `S100YFL1` |
| 原本 docID | `S100YFL1` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFL1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 相鉄ホールディングス株式会社 / 9003 / docID S100YFL1（id は英語表記「Sotetsu Holdings,Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sotetsu-holdings: 10 件の数値を有報XBRLと照合
有報: 相鉄ホールディングス株式会社 有価証券報告書－第158期(2025/04/01－2026/03/31) (docID S100YFL1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sotetsu-holdings: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業収益・当期純利益は brief.md の印字値（百万円）。営業収益は有報の売上高にあたる表示ラベル。
- businessStructure: 並びは【セグメント情報】注記の当期の外部顧客への営業収益の順（流通97,196、ホテル75,060、不動産68,798、運輸44,375、単位百万円）。「その他」は報告セグメントに含まれないため最後。
- businessStructure: 運輸業の children は【事業の内容】の鉄道業・バス業。金額が独立して開示されていないため金額は書いていません。
- businessStructure: セグメント利益・資産・設備投資は本文方針により書いていません。
- history: 沿革の2014年9月以降は年月セルが先にまとめて印字された崩れた表。年月は8つ（2014年9月、2017年12月、2019年11月、2022年4月、2023年3月、2024年7月、2024年10月、2026年2月）、事象は9つで、2022年4月に2事象（キャピタルプロパティーズ合併・プライム市場移行）が並ぶ（〃相当）と読むと行順で対応するため、その順で対応づけました。
- history: 採用しなかった行: 相鉄興産譲渡（2017年）、キャピタルプロパティーズ合併・プライム移行（2022年）、相鉄不動産投資顧問設立（2024年7月）、相鉄クリーンエナジー取得（2024年10月）、相鉄イン・サンルート合併（2026年2月）。紙幅の都合で主要な出来事に絞りました。
- industry: 単独で過半を占める報告セグメントはない（流通・ホテル・不動産・運輸の順）。有報が「鉄道業を中心に」事業を展開すると述べ、会社の中核が鉄道（相模鉄道）であることから主を運輸にしました。判断の記録です。
- industry: ホテル業（外部顧客への営業収益で第2位）に合う業界値がなく、業界は付けていません。taxonomyGaps に記録しました。
- relatedCompanies: related-candidates.json が証拠パックに無く、上場している相手を同定できないため、関連企業は結びません。
- relatedCompanies: 有報の【関係会社の状況】にある相模鉄道㈱・相鉄バス㈱・相鉄ローゼン㈱・相鉄不動産㈱など連結子会社は、いずれも掲載済みの上場企業ではなく、結べません。
- terms: 用語の助言: 「純粋持株会社」「相互直通運転」は初めて読む人に説明が要る語です。既存の用語集に無ければ追加を検討してください。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 相鉄ホールディングスのホテル業セグメント → 提案: hospitality（ホテル・宿泊）。ホテル業は外部顧客への営業収益で第2位の報告セグメントだが、閉じた分類にホテル・宿泊がない。
