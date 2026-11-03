# 西武ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社西武ホールディングス |
| 証券コード | 9024 |
| docID（データを取り出した文書） | `S100YS3Z` |
| 原本 docID | `S100YEFI` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YS3Z／有効文書 S100YS3Z（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YS3Z.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社西武ホールディングス / 9024 / docID S100YEFI（id は英語表記「SEIBU HOLDINGS INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
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
seibu-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社西武ホールディングス 訂正有価証券報告書－第21期(2025/04/01－2026/03/31) (docID S100YS3Z)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第21期(2025/04/01－2026/03/31)、docID S100YS3Z）を有効文書としてこのパックを作った。原本は docID S100YEFI。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（MajorFacilitiesTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
すべて一致しました。
seibu-holdings: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の大きな売上高・純利益の理由は本文を確認していないため、financialNotes には事実の指摘だけを書きました。
- businessModel: financialNotes は文字列の配列として書きました。
- businessStructure: 並び順は【セグメント情報】注記の当期の外部顧客への売上高（ホテル・レジャー246,660、都市交通・沿線150,461、不動産66,622、単位は百万円）。「その他」は報告セグメントではないため最後（49,541）。
- businessStructure: 【事業の内容】の掲載順は不動産・ホテル・都市交通ですが、並び順の根拠にしていません。
- businessStructure: 不動産事業の前期売上高468,672百万円は印字値で、増減の理由は有報の該当部分を確認していないため書いていません。
- businessStructure: ホテル・レジャー事業、不動産事業の会社数・子会社数は区分の重複（西武鉄道・西武不動産）があるため書いていません。
- history: 沿革の表から、設立前の沿革は会社の成り立ちに関わる行だけを選びました（相互直通運転や高架化工事などの鉄道の個別事項は省きました）。
- history: 2024年の東京ガーデンテラス紀尾井町の流動化は基本協定書の締結までで、完了とは書いていません。
- industry: 売上の最大はホテル・レジャー事業（246,660百万円）で、合う業界の値がないため、鉄道・バスの都市交通・沿線事業を持つ運輸を暫定の主たる業界にしました。不動産は報告セグメントなので追加しました。
- relatedCompanies: related-candidates.json が証拠パックにないため、結ぶ候補がありません。
- relatedCompanies: 西武鉄道（子会社）は沿革に2004年12月の上場廃止が印字されており、上場企業の候補にもないため結びませんでした。
- relatedCompanies: 伊豆箱根鉄道（有報提出会社）は上場の印字・候補がなく、結びませんでした。
- terms: 用語の助言: 「純粋持株会社」「MC（マネジメント・コントラクト）・FC（フランチャイズ）」「不動産回転型ビジネス」は読者に説明があると分かりやすい語です。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 西武ホールディングスのホテル・レジャー事業（報告セグメントで売上最大） → 提案: ホテル・観光・レジャー。売上最大のホテル・レジャー事業に当たる業界が、閉じた分類にありません。
