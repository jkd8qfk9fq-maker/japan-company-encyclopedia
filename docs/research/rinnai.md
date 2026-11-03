# リンナイ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リンナイ株式会社 |
| 証券コード | 5947 |
| docID（データを取り出した文書） | `S100YJCU` |
| 原本 docID | `S100YJCU` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJCU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リンナイ株式会社 / 5947 / docID S100YJCU（id は英語表記「RINNAI CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
rinnai: 10 件の数値を有報XBRLと照合
有報: リンナイ株式会社 有価証券報告書－第76期(2025/04/01－2026/03/31) (docID S100YJCU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
rinnai: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の注意にある財務諸表の組替えは前期と範囲が同じ（修正再表示なし）のため basis は付けない。
- businessStructure: 並びは2026年3月期のセグメント注記の外部顧客への売上高順（日本→アメリカ→中国→オーストラリア→韓国→インドネシア）。その他は報告セグメントに含まれないため最後。
- businessStructure: 「その他」の金額は注記の百万円表記をそのまま引用（億円表記の印字が無いため）。
- businessStructure: 中国・韓国・インドネシア・オーストラリアの製品名は、MD&Aの記述と製品区分表（給湯・厨房・空調）から。
- history: 沿革表は年月と事象が正常に対応していたため、そのまま採用。1971年のオーストラリア法人設立は商号変更と同じ年の出来事として記載。
- industry: 家庭用・業務用の給湯器、コンロ、空調機器を作る会社のため、最も近い electronics を暫定の主たる業界にした。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業で同一性を確認できる相手がいないため、結ばない。
- relatedCompanies: 関係会社の状況に載る子会社・関連会社（柳澤製作所、ガスターなど）は、いずれも掲載済み上場企業ではないため結ばない。
- terms: 用語の候補: エコジョーズ（高効率給湯器）、ヒートポンプ式給湯器、コンデンシング給湯器、ハイブリッド給湯器、ウルトラファインバブル。既存の用語に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] リンナイの主たる業界 → 提案: 住宅設備・家庭用熱機器（給湯器・厨房機器・空調機器）。ガス給湯器やコンロなどの熱機器メーカーに合う区分が無い。
