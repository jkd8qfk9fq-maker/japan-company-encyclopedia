# 伊藤園 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社伊藤園 |
| 証券コード | 2593 |
| docID（データを取り出した文書） | `S100YRK7` |
| 原本 docID | `S100YRK7` |
| 提出日（原本） | 2026-07-21 |
| 決算期 | 2026-04-30 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YRK7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社伊藤園 / 2593 / docID S100YRK7（id は英語表記「ITO EN,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 1 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ito-en: 10 件の数値を有報XBRLと照合
有報: 株式会社伊藤園 有価証券報告書－第61期(2025/05/01－2026/04/30) (docID S100YRK7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ito-en: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 純利益の減少理由は減損損失の計上（注記）に限って書き、金額は書いていない。
- businessStructure: セグメント順は2026年4月期の外部顧客への売上高の大きい順。「その他」は報告セグメントのため売上順。リーフ・ドリンク関連事業の子区分には売上高の独立開示が無く、金額を書いていない。Wikipedia・related-candidates.json は証拠パックに無し。
- history: 沿革表のうち主要な出来事のみ採用。
- industry: 売上の大半を占めるリーフ・ドリンク関連事業（茶葉・飲料）から food。飲料の区分が無いため食品で代用。
- relatedCompanies: related-candidates.json が証拠パックに無く、結べる掲載済み企業の候補が無い。関係会社の状況の子会社（タリーズコーヒージャパン、ネオス等）は非上場・未掲載のため結ばない。伊藤園・伊藤忠ミネラルウォーターズ㈱は子会社（65.0％）だが相手側が未掲載。
- terms: 用語の追加提案: ルートセールス（小売店などへの直接販売）、リーフ（茶葉）、RTD（そのまま飲める飲料）、フランチャイズ、減損損失。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
