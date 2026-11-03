# リョーサン菱洋ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リョーサン菱洋ホールディングス株式会社 |
| 証券コード | 167A |
| docID（データを取り出した文書） | `S100YHJV` |
| 原本 docID | `S100YHJV` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHJV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リョーサン菱洋ホールディングス株式会社 / 167A / docID S100YHJV（id は英語表記「Ryoyo Ryosan Holdings, Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
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
ryoyo-ryosan-holdings: 4 件の数値を有報XBRLと照合
有報: リョーサン菱洋ホールディングス株式会社 有価証券報告書－第2期(2025/04/01－2026/03/31) (docID S100YHJV)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ryoyo-ryosan-holdings: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 営業利益・経常利益・セグメント利益は本文に書かない方針のため省いた。
- businessStructure: 売上順はセグメント注記の外部顧客への売上高（2026年3月期）で並べた。両セグメントとも製品の内訳金額は印字がないため children は置かない。
- history: 沿革の旧両社の表は2列が1行に潰れており、1983年・1986年の上場関連の行はどちらの会社か判別できないため省いた。1953年は社名からリョーサン側、1961年は菱洋電機から菱洋エレクトロ側と対応づけた。
- industry: 半導体・電子部品の販売が主力（デバイス事業、2026年3月期の売上高の約7割）で、仕入れて販売する商社型のため商社を主とした。IT製品はソリューション事業。
- relatedCompanies: related-candidates.json が証拠パックに無く、有報の関係会社（リョーサン、菱洋エレクトロ、プリケンなど）は上場企業として掲載されていないため、結ばなかった。
- terms: 用語の追加提案: 株式移転、持株会社、キャッシュ・マネジメント・システム（CMS）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
