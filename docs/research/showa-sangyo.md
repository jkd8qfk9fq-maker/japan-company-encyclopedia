# 昭和産業 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 昭和産業株式会社 |
| 証券コード | 2004 |
| docID（データを取り出した文書） | `S100YGEO` |
| 原本 docID | `S100YGEO` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGEO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 昭和産業株式会社 / 2004 / docID S100YGEO（id は英語表記「Showa Sangyo Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
showa-sangyo: 10 件の数値を有報XBRLと照合
有報: 昭和産業株式会社 有価証券報告書－第125期(2025/04/01－2026/03/31) (docID S100YGEO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
showa-sangyo: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の増減理由として、有報は製粉・製油・糖質・飼料のカテゴリ別の販売数量の動きを書いているが、連結の増減に結びつけた説明はないため、連結の理由は書かなかった。
- businessModel: 顧客の欄は【事業の内容】と販売会社の記述に基づく一般的な区分。主要顧客（売上高10％以上）はないと有報が印字している。
- businessModel: financialNotesは変則決算・会計基準の変更がないため空。
- businessStructure: 並び順は2026年3月期の外部顧客への売上高: 食品271,828 > 飼料58,740 > その他4,844（百万円）。「その他」は有報が報告セグメントに含まれないと明記するため最後。
- businessStructure: 食品事業のchildrenは、収益認識の注記が製粉103,600・製油94,727・糖質65,519・その他食品7,980（百万円）を印字しているため金額を書いた。順序は売上順。
- businessStructure: name・listingsは表紙（昭和産業株式会社、東京証券取引所プライム市場）から。shortNameEnは英訳名 Showa Sangyo Co., Ltd. から Co., Ltd. を除いた。
- businessStructure: 食品事業・飼料事業の営業利益は規則により書かなかった。
- history: 2014年の項は、2009年の奥本製粉と1990年代の木田製粉・内外製粉をまとめて書いた（有報の沿革の印字どおり）。
- history: 沿革は表が崩れておらず、年月と事象が対応している。戦時中の工場閉鎖など一部の項は省いた。
- industry: 食品事業が外部顧客への売上高335,413百万円のうち271,828百万円を占めるため food を主たる業界にした。飼料事業は独立した業界値がなく、追加していない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、結んだ相手は無い。
- relatedCompanies: 伊藤忠商事（所有割合7.0％）・三井物産（4.7％）・丸紅（1.8％）は大株主だが、同一性を確認できる候補リストが無いので結ばなかった。ユアサ・フナショク（3.8％）・カーギルジャパン合同会社（2.9％）も同様で、上場企業の確認ができていない。
- relatedCompanies: 連結子会社・持分法適用関連会社は、有報に「有価証券届出書及び有価証券報告書を提出していません」とあり上場企業ではないため結ばなかった。
- terms: 用語の候補（助言のみ）: プレミックス、糖化製品、コーンスターチ、配合飼料、ふすま。有報の語としては「プレミックス」「糖化製品」「配合飼料」が説明に値する。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
