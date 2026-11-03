# 石油資源開発 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 石油資源開発株式会社 |
| 証券コード | 1662 |
| docID（データを取り出した文書） | `S100YERU` |
| 原本 docID | `S100YERU` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YERU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 石油資源開発株式会社 / 1662 / docID S100YERU（id は英語表記「Japan Petroleum Exploration Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
japan-petroleum-exploration: 10 件の数値を有報XBRLと照合
有報: 石油資源開発株式会社 有価証券報告書－第56期(2025/04/01－2026/03/31) (docID S100YERU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第55期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第54期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
japan-petroleum-exploration: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…す。2035年度に1,000億円への利益成長を目指すとしています。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高は有報MD&Aの印字（百万円・減収率）、当期純利益は印字の「534億円」をそのまま用いた。
- businessStructure: 並びは2026年3月期の外部顧客への売上高順（日本→北米→中東→欧州）。「その他」は報告セグメントに含まれない区分で金額の印字がないため最後。
- businessStructure: セグメント別の金額は有報が百万円で印字しているため本文には書かず、製品別売上は全社合計のため各セグメントに割り当てなかった。
- businessStructure: shortNameEn は事業の内容・関連文書の「JAPEX」表記から採った。
- history: 沿革表は多数の項目があるため、会社の成り立ち・上場・主要な拠点と海外進出を中心に10件を選んだ。
- industry: 売上の大半を占める日本セグメントと各海外セグメントはいずれも原油・天然ガスの開発・販売とガス・電力の供給のため energy のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: INPEX（旧 北スマトラ海洋石油資源開発）は沿革に1966年の設立が載るだけで、現在の取引・資本関係の記述がないため結ばない。
- terms: 用語候補（助言のみ）: E&P（探鉱・開発・生産）、LNG、CCUS、タイトオイル、託送供給、LNGサテライト供給、マッドロギング。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
