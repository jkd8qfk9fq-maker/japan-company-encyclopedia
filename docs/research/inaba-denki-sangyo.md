# 因幡電機産業 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 因幡電機産業株式会社 |
| 証券コード | 9934 |
| docID（データを取り出した文書） | `S100YFJE` |
| 原本 docID | `S100YFJE` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFJE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 因幡電機産業株式会社 / 9934 / docID S100YFJE（id は英語表記「INABA DENKI SANGYO CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
inaba-denki-sangyo: 10 件の数値を有報XBRLと照合
有報: 因幡電機産業株式会社 有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YFJE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
inaba-denki-sangyo: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に「遡及適用」の記載があるが、前期有報との重複年度は全て一致しており、売上高・純利益に影響する記述は読み取れなかったため financialNotes は空にした。
- businessModel: 売上高の主な増加理由（大型物件向け納入、銅価格の高騰など）は本文に入れず、増減率のみ記載した。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順（電設資材 2,932億89百万円 > 自社製品 803億68百万円 > 産業機器 433億65百万円）。有報の事業の内容の表の順（電設資材・産業機器・自社製品）とは異なる。
- businessStructure: セグメント別の金額は本文に書かなかった。
- history: 沿革表の「2020年２月」「2022年３月」の年月セルが続けて印字され、事象文（新東京物流センターの新設・Inaba Denko America Inc.の設立）と分かれていた。年月2つと事象2つで数が同じなので、行順で2020年2月＝新東京物流センター、2022年3月＝米国子会社と対応づけた。
- industry: 売上の大半（2026年3月期の外部顧客への売上高の約8割）を電設資材事業と産業機器事業の卸販売が占めるため、主たる業界は商社とした。電設資材の卸売りに合う個別の値は無いが、最も近い trading を選んだ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、誰も結ばなかった。
- relatedCompanies: フジクラ・古河電気工業・アイホン・ダイヘン（仕入先）、新明和工業・日本電気硝子・瑞光（得意先）、タイガースポリマー（製造委託先）は政策保有株式の欄で取引関係が印字されているが、候補ファイルが無く同一性を確認できないため結ばなかった。
- relatedCompanies: パトライト・SIAM ORIENT ELECTRIC・アイティエフ・PT.PATLITE INDONESIA は連結子会社だが、上場の掲載済み企業として候補に無いため結ばなかった。
- terms: 用語の助言: 「被覆銅管」（断熱材で覆った空調用の銅管）、「受配電機器」、「ＦＡ（ファクトリーオートメーション）」は、初めて読む人に説明があると分かりやすい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 因幡電機産業の電設資材・産業機器の卸売り → 提案: 電設資材・機械器具の専門卸（専門商社）。総合商社と専門卸が同じ「商社」にまとまっているため。
