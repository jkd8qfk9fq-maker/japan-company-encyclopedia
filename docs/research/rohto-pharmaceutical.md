# ロート製薬 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ロート製薬株式会社 |
| 証券コード | 4527 |
| docID（データを取り出した文書） | `S100YE5N` |
| 原本 docID | `S100YE5N` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE5N.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ロート製薬株式会社 / 4527 / docID S100YE5N（id は英語表記「ROHTO PHARMACEUTICAL CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
rohto-pharmaceutical: 10 件の数値を有報XBRLと照合
有報: ロート製薬株式会社 有価証券報告書－第90期(2025/04/01－2026/03/31) (docID S100YE5N)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":31006000000,"latestFiling":30841000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":40430000000,"latestFiling":39725000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":421875000000,"latestFiling":437039000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":271440000000,"latestFiling":280737000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第89期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
rohto-pharmaceutical: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…最終的な利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の純利益差（31,006→30,841百万円）の理由は、企業結合の暫定的な会計処理の確定による見直し（MD&A・セグメント注記）。
- businessModel: 経常利益・営業利益・総資産・純資産の変化は本文に書かない。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順（日本・アジア・ヨーロッパ・アメリカ）。『その他』は報告セグメントに含まれないため最後。
- businessStructure: 製品区分（アイケア・スキンケア等）は地域別の金額が無いため、事業には分けず製品として記載。
- history: 2004年12月と2006年5月の行は表が崩れて年月が連続していたが、2004年12月の事象文が特定できないため、2006年5月の事象（ロートリサーチビレッジ京都開設）だけを他節と整合する形で採用。2004年12月の行は落とした。
- history: 2006年のOXY営業権取得は日付対応が不確かなため省いた。
- industry: 目薬・外皮用薬・胃腸薬・医療用眼科薬が中心のため医薬品を主とした。スキンケア化粧品も大きいが、化粧品の業界値が無く、金額が独立した報告セグメントでもないため足さない。
- relatedCompanies: related-candidates.json が証拠パックに無く、有報の子会社・関連会社（メンソレータム社、ロートニッテン㈱、天藤製薬㈱、クオリテックファーマ㈱、㈱アンズコーポレーション、㈱バイオミメティクスシンパシーズなど）は、掲載済みの上場企業として同一性を確認できないため結ばない。
- relatedCompanies: ㈱大木は最大の販売先として印字されるが、掲載済み上場企業の候補として確認できないため結ばない。
- terms: 用語の追加提案：CDMO（医薬品の受託開発・製造）。有報の事業の内容に『メディカル関連（CDMO事業…）』と出る。

## 要確認（status に反映）

- businessModel: financialNotes の年度「2026」が5年表にありません
- businessModel: financialNotes の年度「2025」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
