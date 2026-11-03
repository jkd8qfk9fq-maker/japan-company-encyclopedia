# 戸田建設 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 戸田建設株式会社 |
| 証券コード | 1860 |
| docID（データを取り出した文書） | `S100YG3E` |
| 原本 docID | `S100YG3E` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG3E.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 戸田建設株式会社 / 1860 / docID S100YG3E（id は英語表記「TODA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toda: 10 件の数値を有報XBRLと照合
有報: 戸田建設株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YG3E)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toda: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: profit 段は方針により当期純利益（親会社株主に帰属する当期純利益）を用いた。営業利益・経常利益は書いていない。
- businessModel: 増減率は有報が印字する値ではなく計算になるため書かず、前期の印字額を併記した。
- businessModel: 「不動産の購入者・賃借人」は国内投資開発事業の売買・賃貸から導いた一般的な顧客区分で、有報に顧客の個別記載はない。
- businessStructure: 並び順は2026年3月期の外部顧客への売上高の大きい順（建築360,837→土木121,562→海外グループ67,699→国内グループ61,033→国内投資開発31,276→環境・エネルギー3,327）。その他（PFI事業）は報告セグメントに含まれず金額の記載もないため最後。
- businessStructure: shortNameEn は、英訳名 TODA CORPORATION 以外に短縮表記が見当たらないため省略した。
- businessStructure: セグメント利益（営業利益ベース）は方針により本文に書いていない。
- history: 沿革は有報の【沿革】の記載のみを使った。表の崩れはなく、年月と事象は一対一で読めた。
- history: 1962年の戸田建物㈱（現・戸田ビルパートナーズ㈱）設立、1975年・1989年の貸借銘柄指定は、会社の事業を理解する上での重要度が低いため省いた。
- industry: 建築事業・土木事業・国内外のグループ会社の工事で売上の大半を占めるため construction のみ。不動産・発電は売上が小さく業界を足していない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業として同一性を確認できる相手がいないため、関連企業は結ばなかった。
- relatedCompanies: 有報の【関係会社の状況】に載る子会社・関連会社（佐藤工業㈱、昭和建設㈱、戸田道路㈱など）は、掲載済み企業の候補として機械抽出されていないため結んでいない。
- terms: 用語の助言: BIM（Building Information Modeling）、PFI事業、浮体式洋上風力発電、特定建設業、特定子会社は読者に説明が要る語。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
