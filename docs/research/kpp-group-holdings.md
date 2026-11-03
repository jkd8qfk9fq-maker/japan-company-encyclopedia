# KPPグループホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＫＰＰグループホールディングス株式会社 |
| 証券コード | 9274 |
| docID（データを取り出した文書） | `S100YHDZ` |
| 原本 docID | `S100YHDZ` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHDZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＫＰＰグループホールディングス株式会社 / 9274 / docID S100YHDZ（id は英語表記「KPP GROUP HOLDINGS CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kpp-group-holdings: 10 件の数値を有報XBRLと照合
有報: ＫＰＰグループホールディングス株式会社 有価証券報告書－第152期(2025/04/01－2026/03/31) (docID S100YHDZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kpp-group-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「KPPグループホールディングス株式会社」が EDINET の提出者名「ＫＰＰグループホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益は本文に書かない規則のため省いた。純利益は売上高とあわせて印字どおりの億円表記を使った。
- businessModel: financialNotes は変則決算・会計基準変更が無いため空にした。
- businessStructure: 事業は【セグメント情報】の外部顧客への売上高の大きい順（欧州／米州・北東アジア・アジアパシフィック・不動産賃貸）に並べた。
- businessStructure: 売上高は連結の売上高と合わせるため【経営成績の状況】の億円表記（印字）を使った。セグメント利益は書いていない。
- history: 沿革は表が崩れず年月と事象が対応しているので、そのまま使った。主な出来事だけを選び、細かな支店開設・駐在員事務所・子会社設立は省いた。
- industry: 仕入れた紙類を販売する卸売が売上のほぼ全てのため trading（商社）。紙・パルプの区分は無いので、近い値を暫定で選び taxonomyGaps に記録した。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる掲載済みの候補が無いため、結んだ相手は無い。
- relatedCompanies: 王子ホールディングス：有報は主要仕入先と述べ取引関係も十分だが、候補リストに無く掲載済みかを確認できないため結ばない。
- relatedCompanies: 日本製紙：主要仕入先・販売先と述べるが、候補リストに無く掲載済みかを確認できないため結ばない。
- relatedCompanies: 大王製紙・レンゴー・ニップン・ナカバヤシ：保有株式の保有目的に仕入先・販売先とあるが、候補リストに無く掲載済みかを確認できないため結ばない。
- terms: 用語の追加提案：持株会社、グラフィックペーパー（印刷・出版用の紙）、板紙、パルプ・古紙、特定子会社。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] KPPグループホールディングスの主たる業界（紙・パルプ卸売） → 提案: 紙・パルプ（卸売を含む）。紙・板紙・パルプ・古紙の卸売が売上のほぼ全てだが、閉じた分類に該当する値が無いため商社で暫定にした。
