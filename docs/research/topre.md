# 東プレ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東プレ株式会社 |
| 証券コード | 5975 |
| docID（データを取り出した文書） | `S100YHLP` |
| 原本 docID | `S100YHLP` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHLP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東プレ株式会社 / 5975 / docID S100YHLP（id は英語表記「Topre Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
topre: 10 件の数値を有報XBRLと照合
有報: 東プレ株式会社 有価証券報告書－第131期(2025/04/01－2026/03/31) (docID S100YHLP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
topre: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…最終的な利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と純利益は brief.md の百万円値を、有報の印字に合わせて「億円・百万円」表記にした。
- businessStructure: 「その他」は報告セグメントに含まれない区分のため、売上高が報告セグメントより小さいが最後に置いた。主要顧客3社の売上高の金額は本文に書かない（方針）。
- history: 2019年5月・2020年4月・2020年7月の行は崩れた表のため、三池工業の資本提携・連結子会社化は2020年として扱った（他の節で月の裏付けが取れないため、年のみ）。年の割り当てに裏付けが弱いので needsReview に入れた。
- industry: 売上の大半はプレス関連製品事業（自動車用プレス部品）。定温物流関連事業は独立した業界に当たる値がなく、近い値もないため追加しなかった。
- relatedCompanies: related-candidates.json が証拠パックに無く、候補の機械照合はできなかった。J-MAX は有報が「有価証券報告書の提出会社」と印字し、src/data/companies/j-max.json に掲載済みであることから結んだ。
- relatedCompanies: 日産自動車・トヨタ自動車・本田技研工業: 主要顧客として売上先の印字はあるが、候補ファイルが無く掲載済み・上場の同一性を確認できないため結ばない。
- relatedCompanies: 子会社（トプレック、東邦興産ほか）: 非上場または掲載済み企業として確認できないため結ばない。
- terms: 用語の候補: プレス加工（金属板を型で押して形をつくる加工）、金型、定温物流（冷凍・冷蔵・定温で保つ物流）、連結子会社。用語集に無ければ追加を検討。

## 要確認（status に反映）

- history: 沿革の2019年5月・2020年4月・2020年7月の行が崩れた表で、三池工業の連結子会社化を2020年としたが、年月の対応を人が確認してください。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
