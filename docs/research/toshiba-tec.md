# 東芝テック — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東芝テック株式会社 |
| 証券コード | 6588 |
| docID（データを取り出した文書） | `S100YHCF` |
| 原本 docID | `S100YHCF` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHCF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東芝テック株式会社 / 6588 / docID S100YHCF（id は英語表記「TOSHIBA TEC CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 6 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toshiba-tec: 10 件の数値を有報XBRLと照合
有報: 東芝テック株式会社 有価証券報告書－第101期(2025/04/01－2026/03/31) (docID S100YHCF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第100期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第99期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第100期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第99期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toshiba-tec: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 顧客・収益源は有報の事業説明の範囲で記載し、具体的な顧客名は書かない（売上10％以上の相手先なし）。
- businessModel: perspectives は省略（会社の説明は中期経営計画の記載が中心で、要約の根拠を絞れなかったため）。
- businessStructure: 事業の並びは【セグメント情報】の外部顧客への売上高の大きい順（リテール347,570＞ワークプレイス221,694百万円）。
- businessStructure: セグメント利益・資産は本文に書かない。報告セグメントの区分は当期に変更（国内複合機をリテールへ移管）。
- businessStructure: listings の market は表紙に『東京証券取引所 プライム市場』とあるため記載。
- history: 沿革は通常の表で、崩れはない。
- history: 省いたもの：国内外の子会社設立・事業開始（テックシンガポール、テックインドネシア、各国の画像情報システム社など）、本店移転。編集上の取捨選択。
- history: 2024年の従業員数の減少は有報に理由の明記を確認していないため、因果は書かず数字の並記にとどめた。
- industry: POSシステム・複合機などの機器の開発・製造・販売が事業の大半のため electronics を主とした。ソフトウェアやリテールDXの記載があるため it を副とした（報告セグメント単位の開示ではないが、事業内容にソリューション提供が含まれる）。
- relatedCompanies: related-candidates.json が存在せず、掲載済みの上場企業として同一性を確認できる相手がいないため、結ばない。
- relatedCompanies: ㈱東芝（親会社）：有報に親会社と印字されるが、候補ファイルになく上場会社として確認できないため結ばない。
- relatedCompanies: TBJH㈱・TBJホールディングス㈱（親会社の親会社）：候補になく、上場でもないため結ばない。
- terms: 用語の助言：POSシステム、複合機、オートIDシステムは用語集に追加する候補。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
