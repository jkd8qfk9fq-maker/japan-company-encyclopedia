# PHCホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＰＨＣホールディングス株式会社 |
| 証券コード | 6523 |
| docID（データを取り出した文書） | `S100YHPK` |
| 原本 docID | `S100YHPK` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHPK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＰＨＣホールディングス株式会社 / 6523 / docID S100YHPK（id は英語表記「PHC Holdings Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
phc-holdings: 10 件の数値を有報XBRLと照合
有報: ＰＨＣホールディングス株式会社 有価証券報告書－第13期(2025/04/01－2026/03/31) (docID S100YHPK)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
phc-holdings: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「PHCホールディングス株式会社」が EDINET の提出者名「ＰＨＣホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 営業利益・税引前利益・セグメント利益は本文の規則により書いていません。
- businessModel: 戦略・強みの perspectives は省略しました。
- businessStructure: 並びは2026年3月期の「外部顧客への売上収益」の大きい順(ヘルスケアソリューション128,389、診断・ライフサイエンス128,323、糖尿病マネジメント101,581、百万円)。子事業ごとの売上収益は印字がないため書いていません。
- businessStructure: 「その他」(報告セグメントに含まれない区分、6,108百万円)は事業内容の記述がなく、事業としては立てていません。
- businessStructure: 事業系統図は図で、読めないため子会社と事業の対応は本文の記述のみを使いました。
- history: 沿革は創業の源流(パナソニックヘルスケア)と当社設立以降から主要な出来事を選びました。
- industry: 医療機器・臨床検査・医療ITの会社で、合う値がなく医薬品を暫定にしました。
- relatedCompanies: related-candidates.json が証拠パックになく、掲載済み企業の候補を確認できないため、関連企業は結びませんでした。
- relatedCompanies: KKR PHC Investment L.P.(被所有37.96％の非上場ファンド)は上場企業ではないため結びません。
- relatedCompanies: Senseonics Holdings, Inc.(持分法適用会社、NASDAQ上場)は日本の上場企業ではなく、掲載対象外です。
- relatedCompanies: パナソニックホールディングス、三菱ケミカルグループ、三井物産は沿革に登場しますが、現在の関係を示す根拠が足りず、候補の裏づけもないため結びません。
- terms: 用語の候補: POCT(その場で結果が出る簡易・迅速検査)、CRO(新薬開発の受託機関)、BGM/CGM(血糖測定/持続血糖測定)、IFRS。

## 要確認（status に反映）

- businessModel: CGM販売事業の譲渡のうち米国以外は2026年6月30日の予定で、有報の提出日(2026年6月23日)より後です。完了したかは有報では確認できません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] PHCホールディングスの主たる業界 → 提案: 医療機器・ヘルスケア(medical-devices)。血糖測定器、病理検査機器、臨床検査、医療ITが中心で、医薬品の区分では言い表せないため。
