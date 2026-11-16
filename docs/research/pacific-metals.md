# 大平洋金属 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大平洋金属株式会社 |
| 証券コード | 5541 |
| docID（データを取り出した文書） | `S100YDBT` |
| 原本 docID | `S100YDBT` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDBT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大平洋金属株式会社 / 5541 / docID S100YDBT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
pacific-metals: 10 件の数値を有報XBRLと照合
有報: 大平洋金属株式会社 有価証券報告書－第100期(2025/04/01－2026/03/31) (docID S100YDBT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
pacific-metals: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えは、連結損益計算書の表示方法の変更（休止設備関連費用の独立掲記）に伴う表示上の組替えであり、主要な経営指標等の数値に修正再表示はなかったため、financialNotes には入れず、この記録にとどめた。
- businessModel: 主要な経営指標等の注記に、株式分割・会計基準の変更・連結範囲の変更に当たる記載はなかったため、financialNotes は空とした。
- businessModel: 売上高の減少理由として印字されたフェロニッケル販売数量の抑制方針などは flow の revenue には金額のない範囲で反映し、損益項目の金額や増減理由は規則により書いていない。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の大きい順（ニッケル事業8,660百万円、ガス事業711百万円、その他42百万円）とし、「その他」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: ガス事業の顧客は提出会社自身であり、外部顧客への売上高711百万円はセグメント注記の印字どおりとした。
- businessStructure: 関係会社のうち連結子会社２社（太平洋興産株式会社、株式会社大平洋ガスセンター）は事業説明の中でのみ触れ、relatedCompanies には含めていない。
- history: 沿革のうち工場の移設・分離や廃棄物リサイクル事業の開始・撤退など、現在の事業構成に直接つながらない項目は省略した。資本金の金額は沿革に書かない規則のため記載していない。
- industry: 主たる業界はフェロニッケルの製造・販売が売上の大半を占めることから、素材メーカーとして最も近い chemicals を暫定とした（taxonomyGaps に記録）。
- industry: ガス事業は提出会社へのガス供給が中心で規模も小さいため、独立した業界は付けなかった。小売電気事業とカルシウムアルミネート製造販売事業は開始したばかりで金額が独立開示されていないため、業界を足していない。
- relatedCompanies: the-japan-steel-works（日本製鋼所）: 主要な顧客として印字されているのは日本製鋼所M&E株式会社であり、同社は候補にない別人格のため結ばなかった。同社は2026年４月１日付で株式会社日本製鋼所に吸収合併された旨が注記されているが、決算日現在の顧客はM&E社であるため、日本製鋼所を顧客として結んでいない。
- relatedCompanies: nippon-soda（日本曹達）: 1949年の設立時に鉄鋼部門から分離した由来が沿革に印字されているだけで、現在の取引・資本関係の記載がないため結ばなかった。
- relatedCompanies: rasa（ラサ商事）: 特定投資株式として「当社事業全般における協力関係の維持」という一般的な保有目的のみが印字され、具体的な取引の記載がなく、当事業年度中に保有株式を全て売却済みのため結ばなかった。
- relatedCompanies: kel、en、zero、base-4481、port、cota、freee、ishin、vision、aeon、rhythm、rion、rix、trust: 社名の一部や一般語の一致による機械抽出であり、有報がその相手について取引・提携・資本関係を述べていないため結ばなかった。trust は信託銀行の信託口の文脈である。
- relatedCompanies: 日本製鉄の株式は特定投資株式として当事業年度中に全て売却済みだが、同社との関係は保有ではなく主要な顧客としての販売関係に基づくため、customer として結んだ。
- terms: 助言のみ。用語としては「フェロニッケル」「ニッケル鉱石」「多金属ノジュール」「カルシウムアルミネート」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 主要な顧客である日本製鋼所M&E株式会社は、決算日後の2026年４月１日付で株式会社日本製鋼所に吸収合併された旨が有報の主要な顧客ごとの情報の注記に印字されている。登録は2026年３月31日現在の構造による。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] pacific-metalsの主たる業界（ニッケル事業） → 提案: 鉄鋼・合金鉄。最大の事業はニッケル鉱石を製錬してフェロニッケル（合金鉄）を製造・販売することであり、化学製品の製造とは異なるため、鉄鋼・合金鉄の区分が欲しい。
