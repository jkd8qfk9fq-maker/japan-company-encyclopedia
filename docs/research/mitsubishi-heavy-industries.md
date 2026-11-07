# 三菱重工業 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三菱重工業株式会社 |
| 証券コード | 7011 |
| docID（データを取り出した文書） | `S100YHZG` |
| 原本 docID | `S100YHZG` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHZG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 3 | 三菱重工業株式会社 / 7011 / docID S100YHZG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 0 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 5 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 5 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
mitsubishi-heavy-industries: 10 件の数値を有報XBRLと照合
有報: 三菱重工業株式会社 有価証券報告書 (docID S100YHZG)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":5027176000000,"latestFiling":4361127000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":374531000000,"latestFiling":352073000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitsubishi-heavy-industries: 本文の金額 0 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や、納入後のサービスを続けることで、利益を確保しています。…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…年5月には、新たな経営方針として「高利益体質と成長投資の好循環」を掲げました…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の売上収益が前期有報と異なる点は、非継続事業への分類に伴う修正再表示であり、financialNotes に事実として記録した（金額の評価や理由付けはしていない）。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上収益（2026年3月期）の大きい順（エナジー、航空・防衛・宇宙、プラント・インフラ、物流・冷熱・ドライブシステム）。「その他」は報告セグメントに含まれない区分のため最後に置いた。
- history: 沿革表は1950年の分割以降、3社の欄が並ぶ崩れた表形式で印字されている。3社に共通する出来事と、本文冒頭の記述で裏付けられる行だけを使い、各社で時期の異なる上場の詳細（札幌・名古屋・福岡への上場時期）は1行にまとめず本文の共通部分だけを書いた。
- relatedCompanies: mitsubishi-logisnext（三菱ロジスネクスト）: 連結子会社だった会社で、2026年3月期に非継続事業へ分類されたが、候補リストの listing が「上場」でないため結ばなかった（現商号はロジスネクスト）。
- relatedCompanies: nippon-yusen（日本郵船）: 当期は株式を保有しておらず、現在の取引関係の記載がないため結ばなかった。
- relatedCompanies: ana-holdings: 候補に挙がったが、証拠パックの本文で保有目的の記述を確認できなかったため結ばなかった。
- relatedCompanies: ricoh: 出現箇所は財務諸表の計数で、関係を述べる記述がないため結ばなかった。
- relatedCompanies: tohoku-electric-power、the-chugoku-electric-power、shikoku-electric-power、sansha-electric-manufacturing: 保有目的の本文を個別に確認できなかったため、今回は結ばなかった。
- relatedCompanies: land、seki、step、port、career、core、i-ll、zero、freee、innovation、base-4481、kohsoku、ray、torq、will、cover、trust、technologies: 地名、一般名詞、制度用語などとの一致で、当該会社への言及ではないため結ばなかった。
- terms: 助言: 「GTCC」（ガスタービン複合発電、Gas Turbine Combined Cycle）は用語集に未登録です。エナジー事業の中心製品の呼び名として頻出するため、登録候補になります。
- terms: 助言: 「ITS」（Intelligent Transport Systems、高度道路交通システム）も未登録です。プラント・インフラの機械システムの説明に出てきます。
- terms: 非継続事業（discontinued-operations）とIFRS（ifrs）は登録済みのため、新規登録は不要です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 三菱重工業の航空・防衛・宇宙セグメント → 提案: aerospace-defense（航空宇宙・防衛）。航空・防衛・宇宙は外部顧客への売上収益で2番目に大きい報告セグメントだが、閉じた業界区分に航空宇宙・防衛を表す値がない。machinery のままでは事業の内容が読者に伝わらない。
