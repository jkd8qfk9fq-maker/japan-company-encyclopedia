# ミライト・ワン — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ミライト・ワン |
| 証券コード | 1417 |
| docID（データを取り出した文書） | `S100YG40` |
| 原本 docID | `S100YG40` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG40.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ミライト・ワン / 1417 / docID S100YG40（id は英語表記「MIRAIT ONE Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mirait-one: 10 件の数値を有報XBRLと照合
有報: 株式会社ミライト・ワン 有価証券報告書－第16期(2025/04/01－2026/03/31) (docID S100YG40)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
mirait-one: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は書くべき変則決算・会計基準変更がないため空。
- businessModel: NTT事業・マルチキャリア事業は有報の事業の内容に名前だけが出るため、金額は書かない。
- businessStructure: 報告セグメントは8つ。外部顧客への売上高の大きい順（ソルコムより四国通建が大きい）に並べた。
- businessStructure: ＴＴＫ・四国通建・ソルコムの所在地域は関係会社の状況の所在地から読める範囲の記述にとどめ、地域の断定は有報の住所（仙台市・愛媛県今治市・広島市）に基づく。
- businessStructure: 主要顧客はNTT東日本・NTT西日本・NTTドコモ（関連情報）。ミライト・ワン区分の顧客欄はこの3社が関連セグメントに含まれる印字による。
- history: 沿革表は整った表で、要点の8件を選んだ。社債発行や海外子会社の個別取得などは省いた。
- industry: 主たる業界は通信インフラ工事（telecommunications）。西武建設（建設）とICTソリューション事業を報告セグメント単位の開示に基づき追加。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業の候補を確認できなかったため結ばなかった。
- relatedCompanies: NTT東日本・NTT西日本は主要顧客（売上高の10%超）だが、候補ファイルで掲載済みの上場企業として同一性を確認できないため結ばなかった。NTTドコモは有報の関連情報に社名のみ。
- terms: 用語の助言: 「事業持株会社」「共同持株会社」「株式移転」「株式交換」「データセンター」「NEXT GIGA」「空間情報」を用語集にあれば参照するとよい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ミライト・ワンの通信インフラ工事 → 提案: 通信工事・設備（通信インフラ建設）。通信事業者ではなく通信設備の工事会社だが、近い値が telecommunications しかないため暫定。
