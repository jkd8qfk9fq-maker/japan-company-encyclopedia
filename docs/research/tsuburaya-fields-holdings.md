# 円谷フィールズホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 円谷フィールズホールディングス株式会社 |
| 証券コード | 2767 |
| docID（データを取り出した文書） | `S100YBQC` |
| 原本 docID | `S100YBQC` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBQC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 円谷フィールズホールディングス株式会社 / 2767 / docID S100YBQC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tsuburaya-fields-holdings: 10 件の数値を有報XBRLと照合
有報: 円谷フィールズホールディングス株式会社 有価証券報告書－第38期(2025/04/01－2026/03/31) (docID S100YBQC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tsuburaya-fields-holdings: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで前期有報との重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotesは書きません。第37期の暫定的な会計処理の確定と税効果会計基準の遡及適用により第36期の数値は遡及修正後の値ですが、数値の不一致はありません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。「その他」は報告セグメントに含まれない区分のため最後に置いています。
- industry: 主たる業界は、売上高の大半を占めるアミューズメント機器事業（遊技機の企画・開発・製造・販売）と「ウルトラマン」などのIPを軸とする事業からエンターテインメントとしました。コンテンツ＆デジタル事業が映像作品の企画・製作・配給を行う報告セグメントのため、メディアを2つ目に付けました。
- relatedCompanies: カプコンは、2009年11月にカプコングループの株式会社エンターライズと取引基本契約を締結した印字がありますが、継続している旨の印字がなく、保有株式も2023年3月期に純投資目的へ変更されているため結びません。
- relatedCompanies: ダイコク電機、バンダイナムコホールディングス、ユニバーサルエンターテインメント、セガサミーホールディングス、平和、藤商事、ゲンダイエージェンシーは、2023年3月期に保有目的を純投資目的へ変更し、市場環境を注視しながら適宜売却を検討する旨の印字があるため結びません。
- relatedCompanies: アミューズ、ランド、フロンティア、ベース、アルファ、ポート、レント、キャリア、高速、セキ、日新、リオン、アルー、ヒット、田谷、トラスト、フューチャー、ガーデン、キング、リックス、テクノロジーズは、社名の断片一致のみで取引・提携・資本関係の印字がないため結びません。
- relatedCompanies: 大株主は個人、信託銀行、資産管理会社、海外ファンドのため、事業会社の大株主として結べる相手はありません。
- relatedCompanies: 連結子会社33社と関連会社9社はすべて非上場または海外法人のため結びません。
- terms: 新たに提案する用語はありません。IP、ウルトラマン、遊技機などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
