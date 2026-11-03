# ふくおかフィナンシャルグループ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ふくおかフィナンシャルグループ |
| 証券コード | 8354 |
| docID（データを取り出した文書） | `S100YFNB` |
| 原本 docID | `S100YFNB` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFNB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ふくおかフィナンシャルグループ / 8354 / docID S100YFNB（id は英語表記「Fukuoka Financial Group, Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fukuoka-financial-group: 10 件の数値を有報XBRLと照合
有報: 株式会社ふくおかフィナンシャルグループ 有価証券報告書－第19期(2025/04/01－2026/03/31) (docID S100YFNB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
fukuoka-financial-group: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから取った（第19期、2026年3月期）。前期有報との重複年度は修正再表示なし。
- businessModel: 金額は【主要な経営指標等の推移】の印字（百万円）をそのまま引用した。経常利益・総資産・純資産などは本文に書いていない。
- businessModel: 従業員数8,050人は【主要な経営指標等の推移】の印字（臨時従業員は別に印字されており除いた）。
- businessModel: 顧客数・預金残高・貸出金の内訳などは省いた（本文の財務数値規則のため、または確認していないため）。
- businessModel: 目標経営指標・資本運営に関する指標は投資指標にあたる語を含み得るため書いていない。
- businessStructure: 決算期は表紙のDEIから取った（第19期、2025年4月1日〜2026年3月31日）。
- businessStructure: 報告セグメントは銀行業務のみ。銀行業務以外は「その他事業」として一括され、金額は印字されていないため最後に置いた。サービスごとの情報は90％超を理由に省略されており、children は作らなかった。
- businessStructure: listings: 表紙に「東京証券取引所プライム市場」「福岡証券取引所」とある。福岡証券取引所の市場区分は印字がないため market を付けなかった。
- businessStructure: shortNameEn の FFG は有報の本文（FFG証券など）で使われる略称から取った。有報が当社の略称として定義した文言は確認していない。
- businessStructure: Wikipedia は使っていない（wikipedia.json なし）。
- businessStructure: 各銀行の経常収益等の金額は本文に書いていない。
- history: 沿革の表は年月が事象の直前に印字される通常の形で、崩れはなかった。
- history: 2007年は設立・上場・親和銀行の経営統合（5〜10月）を1項にまとめた。2007年7月の株式譲渡契約（総額760億円）は金額を書かず省いた。
- history: 2010年の項は2009年の出来事（システム参加、吸収分割）を含めて、システム統合の完了にまとめた。
- history: 2020年の項に2019年8月のみんなの銀行設立準備会社の設立を含めた（2020年12月の商号変更の前提として）。
- history: 有報に書かれていない創業時の歴史は補っていない。リンク記法は使っていない（他社ページの掲載有無を確認していないため）。
- industry: 報告セグメントは銀行業務のみ。金額の独立した開示がない事業には業界を足していない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みで上場の関係会社の候補が確認できないため、誰とも結ばなかった。
- relatedCompanies: 子会社（福岡銀行・熊本銀行・十八親和銀行・福岡中央銀行・みんなの銀行など）と持分法適用関連会社（FFGリース）は、いずれも上場会社としての同一性を確認できる候補が無く、結んでいない。
- terms: 用語の追加提案: 経常収益（銀行業が売上高に代えて使う収益。利息や手数料などの合計）、銀行持株会社、株式交換、共同利用型基幹システム。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
