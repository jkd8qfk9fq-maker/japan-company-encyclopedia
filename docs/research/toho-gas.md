# 東邦瓦斯 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東邦瓦斯株式会社 |
| 証券コード | 9533 |
| docID（データを取り出した文書） | `S100YGFW` |
| 原本 docID | `S100YGFW` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGFW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東邦瓦斯株式会社 / 9533 / docID S100YGFW（id は英語表記「TOHO GAS CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toho-gas: 10 件の数値を有報XBRLと照合
有報: 東邦瓦斯株式会社 有価証券報告書－第155期(2025/04/01－2026/03/31) (docID S100YGFW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toho-gas: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高・当期純利益は印字の円表記（百万円単位の表から億・千万円表記に直さず、MD&Aの印字「6,510億8千5百万円」「314億4千9百万円」「59億9千4百万円」）を使いました。
- businessModel: brief の注意にある財務諸表の組替えは、前期有報との重複年度が全て一致しているため financialNotes には書いていません。
- businessModel: 営業利益・経常利益・セグメント利益は規則により書いていません。
- businessStructure: 決算期は表紙の DEI（2025-04-01〜2026-03-31、第155期）から「2026年3月期」としました。
- businessStructure: 事業の並びはセグメント注記の当連結会計年度「外部顧客への売上高」で決めました：ガス421,798、電気98,562、ＬＰＧ・その他エネルギー95,336、その他35,389（百万円）。その他は報告セグメントに含まれない区分なので最後に置きました。MD&Aの順（ガス・ＬＰＧ・電気）や「計」の行は使っていません。
- businessStructure: children は作っていません。有報はセグメントの下の事業区分ごとの売上高を印字していません（【関連情報】の製品区分はガス・ＬＰＧ・電気・その他で、セグメントと同じ粒度ではないため）。
- businessStructure: セグメント利益（営業利益ベース）は規則により本文に書いていません。
- businessStructure: listings は表紙が市場区分まで印字しているため tse=プライム、nse=プレミアとしました。
- history: 沿革表は読める形で印字されていたため、年月と事象を行ごとに対応づけました。
- history: 2022年の導管事業承継は、2021年4月の設立と2022年4月の承継を1行にまとめました。
- history: 工場の操業開始・廃止、お客さま数の節目など、他の行は省きました。
- industry: 売上の大半（外部顧客への売上高の約65％）を占める報告セグメント「ガス」と、ＬＰＧ・電気もエネルギー供給のため、energy を主たる業界にしました。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業で有報の本文に名前がある相手を確認できないため、関連企業は結んでいません。
- relatedCompanies: 関係会社の状況に載る子会社・持分法適用関連会社（東邦ガスネットワーク㈱、水島瓦斯㈱、東邦液化ガス㈱、金沢エナジー㈱など）は、いずれも上場企業ではないため結んでいません。
- terms: 用語集への追加候補（助言のみ）：ＬＮＧ（液化天然ガス）、託送供給（ガスの導管を使って他社のガスも届ける仕組み）、原料費調整制度、ＬＰＧ（液化石油ガス）、ｅ－ｍｅｔｈａｎｅ（カーボンニュートラルの取組み）。既存の用語との重複は確認していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
