# フィード・ワン — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | フィード・ワン株式会社 |
| 証券コード | 2060 |
| docID（データを取り出した文書） | `S100YC1Q` |
| 原本 docID | `S100YC1Q` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC1Q.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | フィード・ワン株式会社 / 2060 / docID S100YC1Q（id は英語表記「FEED ONE CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
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
feed-one: 10 件の数値を有報XBRLと照合
有報: フィード・ワン株式会社 有価証券報告書－第12期(2025/04/01－2026/03/31) (docID S100YC1Q)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
feed-one: 本文の金額 1 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの注意があったが、前期有報と重複年度は全て一致のため financialNotes は空。perspectives は省略。
- businessStructure: 事業の並びは2026年3月期の外部顧客に対する売上高順（畜産飼料223,744・食品42,053・水産飼料24,863百万円）。「その他」は報告セグメントに含まれないため最後。本文には金額を書かず増減率だけを使った。
- history: 2014年3月〜6月の株式移転の準備手続き、2015年5月・6月の合併契約と株主総会承認は、2014年10月・2015年10月の出来事に含めて省いた。
- industry: 飼料の閉じた区分が無いため、畜産物・食品に最も近い food を暫定で選んだ。
- relatedCompanies: related-candidates.json が証拠パックに無かったため、掲載済みの mitsui-and-co（三井物産）だけを関係区分の印字から結んだ。「（被所有）25.7」は当社から見た三井物産の所有割合。
- relatedCompanies: その他の子会社・関連会社は掲載済み企業の候補ファイルが無く、同一性を確認できないため結んでいない。
- terms: 用語の助言: 「配合飼料」（複数の原料を栄養設計に従って混ぜた飼料）、「CMS（キャッシュ・マネジメント・システム）」、「持分法適用関連会社」は用語集に立てる候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] フィード・ワンの主たる事業（配合飼料の製造・販売） → 提案: 農業・飼料（agriculture-feed）。売上の大半は畜産飼料・水産飼料で、食品メーカーではなく飼料メーカーのため。
