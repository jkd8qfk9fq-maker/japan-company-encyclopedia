# 薬王堂ホールディングス — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社薬王堂ホールディングス |
| 証券コード | 7679 |
| docID（データを取り出した文書） | `S100Y4K3` |
| 原本 docID | `S100Y4K3` |
| 提出日（原本） | 2026-05-21 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-16 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y4K3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社薬王堂ホールディングス / 7679 / docID S100Y4K3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
yakuodo-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社薬王堂ホールディングス 有価証券報告書－第7期(2025/03/01－2026/02/28) (docID S100Y4K3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
yakuodo-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益以外の財務数値は本文に書きませんでした。
- businessModel: 2027年の食品と非食品センターの統合は中期経営計画の予定として本文に記載されており、完了した出来事としては書きませんでした。
- businessStructure: 事業は単一セグメントのドラッグストア事業で、セグメント情報の記載を省略しています。部門別の販売実績を製品区分として children にしました。
- businessStructure: 部門別販売実績の各部門の合計は163,556百万円で、印字の合計163,558百万円と2百万円ずれますが、有報の丸めによるものとして印字の金額をそのまま記載しました。
- businessStructure: 部門別販売実績の合計163,558百万円は連結売上高163,808百万円と異なりますが、どちらも有報の印字どおりに記載しました。
- businessStructure: 財務諸表の組替えの記載について、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため financialNotes は書きませんでした。
- history: 沿革は当社の表と完全子会社となった株式会社薬王堂の表の2つがあり、両方から選びました。
- industry: 主たる業界は、ドラッグストア事業が売上高の大半を占めることから小売としました。
- industry: 単一セグメントのため、2つ目の業界は付けませんでした。
- relatedCompanies: エンは、データサイエンスやAI活用の文脈で「エン」の文字が現れるだけの断片一致のため結びませんでした。
- relatedCompanies: ポートは、社内研修の文脈で「ポート」の文字が現れるだけの断片一致のため結びませんでした。
- relatedCompanies: レイは、レイアウト標準化の文脈で「レイ」の文字が現れるだけの断片一致のため結びませんでした。
- relatedCompanies: イオンは、2000年5月に宮城県進出第1号店「金成店」をイオンタウンショッピングセンター内に出店した旨の記載のみで、取引・提携の記載がないため結びませんでした。
- relatedCompanies: ベースは、インサイダー取引規制の文脈で「連結ベース」の文字が現れるだけの断片一致のため結びませんでした。
- relatedCompanies: スペースは、出店地域の生活環境の文脈で「スペース」の文字が現れるだけの断片一致のため結びませんでした。
- relatedCompanies: 岩手銀行と東北銀行は、株式の保有状況に載る取引金融機関で、保有目的が関係の維持・強化のためであり、資金調達以外の取引・提携の記載がないため結びませんでした。
- relatedCompanies: トラストは、日本マスタートラスト信託銀行が信託口の大株主で、コードリストになく事業会社ではないため結びませんでした。
- relatedCompanies: 株式会社ＴＫコーポレーションは2026年2月28日現在38.99％の大株主ですが、非上場のため結びませんでした。
- relatedCompanies: 連結子会社2社（株式会社薬王堂、Ｍｅｄｉｃａ株式会社）はすべて非上場のため結びませんでした。
- terms: 新たに提案する用語はありません。「ＷＡ!ＣＡ（ワイカ）」や「中期経営計画」は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
