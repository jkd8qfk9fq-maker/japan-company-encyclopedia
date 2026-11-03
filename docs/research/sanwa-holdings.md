# 三和ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三和ホールディングス株式会社 |
| 証券コード | 5929 |
| docID（データを取り出した文書） | `S100YFHH` |
| 原本 docID | `S100YFHH` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFHH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三和ホールディングス株式会社 / 5929 / docID S100YFHH（id は英語表記「Sanwa Holdings Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 1 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanwa-holdings: 10 件の数値を有報XBRLと照合
有報: 三和ホールディングス株式会社 有価証券報告書－第91期(2025/04/01－2026/03/31) (docID S100YFHH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sanwa-holdings: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes に書くべき変則決算などは無く、空にした。
- businessStructure: 報告セグメントは地域別の4区分（日本・北米・欧州・アジア）で、外部顧客への売上高の大きい順に並べた。製品区分別（ビル商業施設建材・住宅建材・メンテ・サービス）の売上は関連情報にあるが、報告セグメントではないため事業には使わず、businessModel の説明に使う。
- history: 沿革の表は正常に対応づけられた。主な出来事に絞り、小規模な買収は省いた。
- industry: 建築用金属製品（シャッター・ドア等の建材）の製造・販売が主のため、最も近い construction を選んだ。建材メーカー向けの区分は無いが、建設に最も近いので taxonomyGaps に記録した。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業から選べる相手が無い。子会社・関連会社は【関係会社の状況】のとおりすべて非上場のため結ばない。
- terms: 用語の助言: 「セクショナルドア」（板を何枚かつなぎ上に巻き取らず持ち上げて開くドア）、「ドックレベラー」（荷物の積み降ろし場でトラックと床の段差をなくす装置）、「ファサード」（建物の外観・外装）は、読者に説明があるとよい用語。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 三和ホールディングスの主業界 → 提案: 建材・住宅設備。シャッター・ドアなどの建築用金属製品のメーカーで、建設会社そのものではない。
