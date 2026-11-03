# クオールホールディングス — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | クオールホールディングス株式会社 |
| 証券コード | 3034 |
| docID（データを取り出した文書） | `S100YJYW` |
| 原本 docID | `S100YJYW` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJYW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | クオールホールディングス株式会社 / 3034 / docID S100YJYW（id は英語表記「Qol Holdings Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
qol-holdings: 10 件の数値を有報XBRLと照合
有報: クオールホールディングス株式会社 有価証券報告書－第34期(2025/04/01－2026/03/31) (docID S100YJYW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
qol-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…3.5％増えました。売上高と各段階の利益は過去最高と説明されています。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務の組替えの注記は範囲が変わる内容ではなく、前期有報と重複年度は一致しているので financialNotes は空にした。
- businessModel: 営業利益・経常利益は本文に書かない規則のため省いた。
- businessStructure: 事業の並びは【セグメント情報】の外部顧客への売上高の大きい順（薬局177,461・製薬99,010・ＢＰＯ14,300百万円）。
- history: 本社移転・上場廃止などの細かな出来事は省いた。
- industry: 売上の61.0％を占める薬局事業（保険薬局）に最も近い値が無く、薬局と製薬（34.1％）の両方を含む pharmaceuticals を暫定にした。
- relatedCompanies: 三菱商事: 過去（2007〜2011年）の「その他の関係会社」で、現在の関係の記載が無いため結ばない。
- relatedCompanies: related-candidates.json が証拠パックに無かったため、掲載済み企業（src/data/companies）の有無で同一性を確認した。上場の別・正式名称の一致は有報本文の印字に基づく。
- relatedCompanies: 第一三共エスファ・ローソン・バイエル・アストラゼネカ: 掲載済み企業に当たらない、または子会社・取引先として未掲載のため結ばない。
- terms: 用語集への追加候補（助言のみ）: 調剤報酬、保険薬局、後発医薬品（ジェネリック）、ＣＳＯ（医薬品販売業務受託）、ＣＲＯ（開発業務受託）、ＭＲ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] クオールホールディングスの薬局事業（調剤薬局） → 提案: 調剤薬局・ヘルスケア。売上の過半を占める保険薬局の運営を言える区分が無い。
