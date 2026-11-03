# 奥村組 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社奥村組 |
| 証券コード | 1833 |
| docID（データを取り出した文書） | `S100Y95Z` |
| 原本 docID | `S100Y95Z` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y95Z.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社奥村組 / 1833 / docID S100Y95Z（id は英語表記「OKUMURA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
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
okumura: 10 件の数値を有報XBRLと照合
有報: 株式会社奥村組 有価証券報告書－第89期(2025/04/01－2026/03/31) (docID S100Y95Z)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
okumura: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益は本文に書いていない。
- businessModel: financialNotes は石狩バイオエナジー(同)の商業運転再開（事実）のみ。brief の財務諸表の組替えの注意は、前期有報と重複年度が全て一致していたため basis を付けなかった。
- businessStructure: name は表紙の「株式会社奥村組」から「株式会社」を除いた。shortNameEn は省略（英訳名の短縮は推測になるため）。
- businessStructure: 並びはセグメント注記の外部顧客への売上高の大きい順（建築180,142・土木115,248・投資開発7,206）。「その他」は報告セグメントに含まれない区分なので最後。
- businessStructure: セグメント利益は書いていない（本文の財務数値は売上高と当期純利益のみ）。
- history: 沿革の支店開設・定款変更・登録更新などの細かい項目は、事業の理解に影響が小さいため省いた。
- history: significance は有報の事実から読める範囲に留めた。
- industry: 土木・建築の2事業で売上の大半（2026年3月期は約96％）を占めるため construction のみ。不動産・発電は金額が小さく、業界を足さなかった。
- relatedCompanies: related-candidates.json は証拠パックに無く、掲載済みの上場企業の候補がないため結ばなかった。
- relatedCompanies: 奥村機械製作㈱・太平不動産㈱・石狩バイオエナジー(同)・平田バイオエナジー(同)は連結子会社だが、掲載済みの上場企業ではないため結ばない。
- relatedCompanies: ㈱オーゼットユー（関連会社）も同様に候補になく、結ばない。
- terms: 用語の追加提案: 繰越工事（受注済みで次期に完成・売上となる工事）、ノンリコース借入（返済を特定の事業の収益に限る借入）、ＰＦＩ事業（民間の資金・ノウハウで公共施設を整備・運営する手法）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
