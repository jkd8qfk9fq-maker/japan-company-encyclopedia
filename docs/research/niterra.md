# 日本特殊陶業 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本特殊陶業株式会社 |
| 証券コード | 5334 |
| docID（データを取り出した文書） | `S100YJTF` |
| 原本 docID | `S100YJTF` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJTF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本特殊陶業株式会社 / 5334 / docID S100YJTF（id は英語表記「Niterra Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
niterra: 10 件の数値を有報XBRLと照合
有報: 日本特殊陶業株式会社 有価証券報告書－第126期(2025/04/01－2026/03/31) (docID S100YJTF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
niterra: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIで2026年3月31日、会計基準はIFRS。本文の財務数値は売上収益と親会社の所有者に帰属する当期利益だけ。
- businessModel: 地域別の売上収益は注記の「当社及び連結子会社の所在地を基礎に分類」した金額で、報告セグメント別とは基準が違うため基準を明記した。
- businessModel: 増減の理由は書いていない（確認した範囲の本文に因果の印字がないため）。perspectives（戦略・強み）は確認していないため省いた。
- businessModel: financialNotes は書く事実なし（変則決算なし）。セグメント区分の変更は businessStructure に記載。
- businessStructure: 決算期は表紙のDEIで2026年3月31日（第126期）、会計基準はIFRS。
- businessStructure: 報告セグメントは2025年4月1日付で「自動車関連」「セラミック」「新規事業」から「自動車関連」「コンポーネント・ソリューション」の2区分に変更。有報は前期分も新区分で組み替えて開示しているため、前期の金額は組替後のものです。
- businessStructure: 並び順はセグメント注記の外部収益（自動車関連587,505／コンポーネント・ソリューション129,935百万円）。「その他」は報告セグメントに含まれない区分と注記にあるため末尾。
- businessStructure: セグメント利益・減損損失・税引前利益は規則により書いていない。
- businessStructure: 市場区分: 表紙は東京証券取引所プライム市場・名古屋証券取引所プレミア市場。
- businessStructure: Wikipedia は使っていない（wikipedia.json なし）。
- history: 沿革は【沿革】の表。主な出来事を選んで載せ、そのほかの海外拠点設立や工場操業開始は省いた。
- history: 2025年6月の東芝マテリアル取得の事実は注記の企業結合の記載とも一致。取得対価などの金額は書いていない。
- industry: 主たる業界は、外部収益の大半（731,207百万円のうち587,505百万円）を占める報告セグメント「自動車関連」で automotive。
- industry: 半導体製造装置用部品・ICパッケージ・半導体部品を報告セグメント「コンポーネント・ソリューション」の事業として開示しているため semiconductors を2つ目に付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業として同一性を確認できる相手がいないため、結んだ相手は0件。
- relatedCompanies: NGK㈱（旧 日本碍子）: 設立の経緯（沿革）と保有株式の表に載るが、related-candidates.json に無く掲載済みか確認できない。保有株式は計上額の記載のみで取引内容の印字もなく、結ばない。
- relatedCompanies: TOTO・本田技研工業・ノリタケ・名港海運・ANAホールディングスなど: 保有株式の表に載るだけで、取引・提携の記載がなく結ばない。
- relatedCompanies: 森村グループ各社: 森村SOFCテクノロジー㈱の合弁相手として言及されるが、社名と関係の印字が個別にはなく、結ばない。
- relatedCompanies: 子会社・関連会社は【関係会社の状況】にあるが、非上場または海外企業で掲載済みエントリーがないため結べない。
- terms: 助言のみ。用語集に追加を勧める語（提案）: 『スパークプラグ』、『グロープラグ』、『窒化ケイ素』、『固体酸化物形燃料電池（SOFC）』、『ICパッケージ』。提案中の用語にはリンクしていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
