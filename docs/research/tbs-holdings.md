# TBSホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＴＢＳホールディングス |
| 証券コード | 9401 |
| docID（データを取り出した文書） | `S100YI1U` |
| 原本 docID | `S100YI1U` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI1U.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＴＢＳホールディングス / 9401 / docID S100YI1U（id は英語表記「TBS HOLDINGS, INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tbs-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ＴＢＳホールディングス 有価証券報告書－第99期(2025/04/01－2026/03/31) (docID S100YI1U)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tbs-holdings: 本文の金額 1 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社TBSホールディングス」が EDINET の提出者名「株式会社ＴＢＳホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 営業利益・経常利益・セグメント利益は本文に書かない方針のため省いた。
- businessModel: 財務諸表の組替えの注意が出ているが、前期有報との重複年度に差異はなく、basis の追記はしていない。
- businessStructure: 事業の並びは外部顧客への売上高（2026年3月期）の大きい順: メディア・コンテンツ事業、ライフスタイル事業、不動産・その他事業。
- businessStructure: メディア・コンテンツ事業の children は【事業の内容】の2つの区分表示。区分ごとの売上高は印字がないため金額を書かない。
- history: 2015年4月以降の沿革表は年月セルが先に並び事象文と分かれて崩れている。年月8個と事象8文が同数のため行順で対応づけた（2015年4月=BS-TBS完全子会社化、2016年4月=TBSラジオ商号変更、2018年4月=Paravi開始、2018年12月=BS-TBS 4K放送、2020年10月=商号変更、2022年4月=プライム移行、2023年6月=やる気スイッチ取得、2025年10月=THE SEVEN US設立）。
- history: 2016年4月のTBSラジオ商号変更は重要度が低いため省いた。
- industry: メディア・コンテンツ事業が外部顧客への売上高の大半（2026年3月期 312,237百万円 / 424,850百万円）を占めるため media を主たる業界にした。ライフスタイル・不動産は売上が小さく、業界を足さない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業として同一性を確認できる候補が無いため、関連企業は結ばない。
- relatedCompanies: WOWOW（持分法適用関連会社、議決権16.0％）とU-NEXT（同20.0％）は有報に関係会社として載るが、候補ファイルが無く、掲載済み・上場の同一性を確認できないため結ばない。
- relatedCompanies: 電通・博報堂は主要顧客だが、候補ファイルに無く同一性を確認できないため結ばない。
- terms: 助言: 「認定放送持株会社」（放送法に基づく持株会社の制度）と「コンテンツIP」（映像などの知的財産）は読者に説明があると分かりやすい。既存の holding-company, equity-method, affiliate, consolidated-subsidiary は登録済み。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
