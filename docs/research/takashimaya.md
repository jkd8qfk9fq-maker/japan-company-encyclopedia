# 髙島屋 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社髙島屋 |
| 証券コード | 8233 |
| docID（データを取り出した文書） | `S100Y4X5` |
| 原本 docID | `S100Y4X5` |
| 提出日（原本） | 2026-05-20 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y4X5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社髙島屋 / 8233 / docID S100Y4X5（id は英語表記「Takashimaya Company, Limited」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takashimaya: 10 件の数値を有報XBRLと照合
有報: 株式会社髙島屋 有価証券報告書－第160期(2025/03/01－2026/02/28) (docID S100Y4X5)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（営業収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
takashimaya: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 純損失の理由は証拠パックで確認できなかったため書いていない。
- businessModel: 戦略・強み・業界内の位置は確認した根拠が薄いため perspectives を省いた。
- businessStructure: 事業の並びは2026年2月期の外部顧客への営業収益の大きい順。「その他」は報告セグメントに含まれないため最後。
- history: 沿革表の2009年2月〜2020年3月の行は年月セルが連続して崩れているため、事象との対応が確実でない行は落とした（上海・ベトナム・タイの設立年、2020年3月の米子髙島屋株式譲渡・金融会社の合併）。ただし開店年は括弧書きの印字から1989年の項目に載せた。
- industry: 国内百貨店業が外部顧客への営業収益の約6割を占めるため小売のみ。商業開発業は金額の大きさから不動産を足さなかった。
- relatedCompanies: related-candidates.json が証拠パックに無く、有報の本文に社名がある掲載済み企業を確認できなかったため、関連企業は結んでいない。
- relatedCompanies: ジェイアール東海髙島屋・伊予鉄髙島屋（持分法適用関連会社）、岡山髙島屋ほかの子会社は、掲載済み・上場の同一性を確認できず結ばない。
- terms: 用語の助言: 「商業開発」「持分法適用関連会社」「営業収益」（売上高とその他の営業収入の合算）は読者に説明が要る語。

## 要確認（status に反映）

- history: 2026年8月に洛西店が閉店予定（有報提出後の予定事項）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
