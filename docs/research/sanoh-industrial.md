# 三櫻工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三櫻工業株式会社 |
| 証券コード | 6584 |
| docID（データを取り出した文書） | `S100YL53` |
| 原本 docID | `S100YL53` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL53.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三櫻工業株式会社 / 6584 / docID S100YL53（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanoh-industrial: 10 件の数値を有報XBRLと照合
有報: 三櫻工業株式会社 有価証券報告書－第118期(2025/04/01－2026/03/31) (docID S100YL53)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sanoh-industrial: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示はありません。前期有報と重複年度は全て一致しています。
- businessModel: 2026年3月期の営業利益は4,073百万円で、前年同期より16.2%減少しました。北南米における米国関税措置の影響や異常費用の発生等により収益性が悪化しました。
- businessStructure: 当社グループは、三櫻工業株式会社及び子会社31社、関連会社2社により構成されています。
- businessStructure: 自動車部品の外部顧客への売上高が連結損益計算書の売上高の90%を超えるため、製品及びサービスごとの情報の記載を省略しています。
- businessStructure: 2025年7月にWinkelmann Powertrain México S. de R.L. de C.V.の全持分を取得し、連結の範囲に含めました。これに伴い、負ののれん発生益として2,554百万円を計上しています。
- businessStructure: Geiger Automotive USA Inc.は債務超過会社で、債務超過の額は2025年12月末日時点で6,732百万円です。
- history: 沿革は有報の印字のみを根拠としました。
- industry: 主たる業界は自動車としました。自動車部品の外部顧客への売上高が連結売上高の90%を超え、報告セグメントは地域別のため、業界は主たる業界のみとしました。
- relatedCompanies: 三菱UFJフィナンシャル・グループは、特定投資株式の保有目的欄に傘下の三菱UFJ銀行と財務面で取引があるとの印字がありますが、三菱UFJフィナンシャル・グループ自体との取引の印字がないため結びませんでした。
- relatedCompanies: めぶきフィナンシャルグループは、特定投資株式の保有目的欄に傘下の常陽銀行と財務面で取引があるとの印字がありますが、めぶきフィナンシャルグループ自体との取引の印字がないため結びませんでした。
- relatedCompanies: 三菱鉛筆株式会社と株式会社タチエスは、特定投資株式の保有目的欄に情報交換等があるとの印字のみで、取引・提携の印字がないため結びませんでした。
- relatedCompanies: 株式会社FUNDINNOは、次世代技術に関する情報交換等の印字がありますが、非上場のため結びませんでした。
- relatedCompanies: 三菱UFJ銀行と常陽銀行は大株主の状況に載る事業会社ですが、非上場のため結びませんでした。
- relatedCompanies: 有限会社竹田コーポレーションは大株主の状況に載る事業会社で4.12%を保有していますが、非上場のため結びませんでした。
- relatedCompanies: 日本マスタートラスト信託銀行、野村信託銀行、日本カストディ銀行は信託銀行のため結びませんでした。
- relatedCompanies: 株式会社NTTデータと日比谷総合設備株式会社は、データセンターの次世代冷却技術を検証する施設の共同検証に当社が参画したとの印字がありますが、両社との直接の取引・提携の印字がないため結びませんでした。
- relatedCompanies: 連結子会社31社及び関連会社2社はすべて非上場または海外法人のため結びませんでした。
- relatedCompanies: エン、ベース、レイ、ポート、アスカ、クイック、コア、No.1、リコー、セキ、ステップ、キャリア、イノベーション、レント、リズム、ストリーム、川辺、田谷、リード、トラストは、社名の断片一致のみで会社としての言及がないため結びませんでした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の印字のみを根拠としました。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
