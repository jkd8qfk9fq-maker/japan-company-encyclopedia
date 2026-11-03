# 日本テレビホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本テレビホールディングス株式会社 |
| 証券コード | 9404 |
| docID（データを取り出した文書） | `S100Y9BG` |
| 原本 docID | `S100Y9BG` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y9BG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本テレビホールディングス株式会社 / 9404 / docID S100Y9BG（id は英語表記「Nippon Television Holdings, Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-television-holdings: 10 件の数値を有報XBRLと照合
有報: 日本テレビホールディングス株式会社 有価証券報告書－第93期(2025/04/01－2026/03/31) (docID S100Y9BG)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-television-holdings: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、複数の媒体での展開を通じて回収して利益を上げる考え方です。2026年3月期…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 長期目標のうち連結営業利益の目標金額は、規則により書いていない。
- businessModel: 競争優位・業界内の位置づけは、会社自身の説明の要約に足る記載を絞り込めなかったため省いた。
- businessStructure: 報告セグメントはコンテンツ・メディア・ウェルネス・不動産関連の3つ。外部顧客への売上高の順に並べ、報告セグメント外の「その他」は金額が無いため最後。
- businessStructure: コンテンツ・メディア事業の子区分は事業の内容の会社別記述から作成。金額は独立して開示されていないので書いていない。
- businessStructure: 2026年4月24日付のKANAMEL㈱の連結子会社化は提出後の事象のため事業の説明に含めていない。
- history: 沿革表は読めたため行順の対応づけは不要。主な出来事のみ抜粋。
- history: 2026年4月24日付のKANAMEL㈱の追加取得（連結子会社化）は決算期後の事象で、沿革の注記にあるため採らず。
- industry: コンテンツ・メディア事業が外部顧客への売上高の大部分を占めるため、メディアのみ。ウェルネス・不動産関連は金額が小さく、業界を足していない。
- relatedCompanies: related-candidates.json が証拠パックに無く、候補の照合ができなかった。㈱オールアバウトは関係会社の状況に「有価証券報告書を提出しております」と印字があり、掲載済み企業（all-about）が存在するため結んだ。
- relatedCompanies: ㈱ビーグリー（持分法適用関連会社・27.1％、有価証券報告書提出の注記あり）: 候補ファイルと掲載済みidを確認できず結ばなかった。
- relatedCompanies: KANAMEL㈱: 上場かどうか・掲載の有無を確認できず結ばなかった（提出後に連結子会社化）。
- relatedCompanies: 読売中京ＦＳホールディングス㈱・札幌テレビ放送㈱・中京テレビ放送㈱・読売テレビ放送㈱・㈱福岡放送・日活㈱・㈱ジェイエスエス: 上場でない、または上場の根拠が無いため結ばなかった。
- relatedCompanies: ㈱読売新聞グループ本社（その他の関係会社・被所有28.4％）: 非上場のため結ばなかった。
- terms: 助言: 「認定放送持株会社」「基幹放送」「テレビ広告枠」「持分法適用関連会社」は読者に説明が要る語。用語集に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
