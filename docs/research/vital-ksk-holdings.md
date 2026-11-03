# バイタルケーエスケー・ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社バイタルケーエスケー・ホールディングス |
| 証券コード | 3151 |
| docID（データを取り出した文書） | `S100YDSN` |
| 原本 docID | `S100YDSN` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDSN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社バイタルケーエスケー・ホールディングス / 3151 / docID S100YDSN（id は英語表記「VITAL KSK HOLDINGS,INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 5 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
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
vital-ksk-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社バイタルケーエスケー・ホールディングス 有価証券報告書－第17期(2025/04/01－2026/03/31) (docID S100YDSN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第16期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第16期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第16期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
vital-ksk-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益は本文に書かない方針のため省いた。
- businessModel: 前期有報との数値は一致し、修正再表示は無い。前期の訂正報告書は内容未確認だが、数値の一致を確認済みのため警告扱いにとどめた。
- businessStructure: 事業の並びは外部顧客への売上高の大きい順。製薬事業は金額が印字されていないため最後に置いた。
- businessStructure: セグメント利益・損失は本文に書かない方針のため省いた。
- history: 沿革のうち、2010年・2017年のシェアードサービス会社の設立・合併、2014年1月のファイネスの合併、2018年のリードスペシャリティーズ設立は、事業の理解への寄与が小さいため省いた。
- industry: 医薬品卸売事業が売上の大半を占めるため、最も近い「医薬品」を主たる業界にした。卸売と薬局が中心で、製薬事業は売上が無い。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業の候補が無いため結ばなかった。
- relatedCompanies: ㈱バイタルネット・㈱ケーエスケー（子会社）、㈱ファイネス（持分法適用関連会社）は上場企業として確認できる候補が無いため結ばなかった。
- terms: 用語の助言: 「新薬創出加算品」「薬価改定」「競争入札」「未承認薬導入支援」は読者に説明が要る語。用語集に無ければ追加を検討してほしい。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] バイタルケーエスケー・ホールディングスの医薬品卸売事業 → 提案: 医薬品卸売（流通）。売上の大半は医薬品の製造ではなく卸売で、「医薬品」では製薬会社と区別できないため。
