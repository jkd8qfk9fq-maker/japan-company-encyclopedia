# ヨロズ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ヨロズ |
| 証券コード | 7294 |
| docID（データを取り出した文書） | `S100YGY8` |
| 原本 docID | `S100YGY8` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGY8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ヨロズ / 7294 / docID S100YGY8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 5 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yorozu: 10 件の数値を有報XBRLと照合
有報: 株式会社ヨロズ 有価証券報告書－第81期(2025/04/01－2026/03/31) (docID S100YGY8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
yorozu: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年4月1日付で国内子会社5社を吸収合併したことは、提出日までに完了した後発事象のため沿革に記録し、needsReviewには入れていません。
- businessModel: 本文に財務諸表の組替えの記載がありますが、修正再表示チェックで前期有報との重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotesには書きません。組替え注記の本文は証拠パックの対象外の節にあるため、内容の確認はできていません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。
- businessStructure: 自動車部品と金型・設備の売上高は、有報に独立して開示されていないため金額を書いていません。
- businessStructure: 関連情報では製品及びサービスごとの情報の記載が省略されています（輸送用機器部品の外部顧客への売上高が連結売上高の90％を超えるため）。
- history: 2012年はインドネシア、メキシコ、ブラジルの3か国に子会社を設立したため、1件にまとめました。
- history: 2000年9月の欄は複数の事象が1行に印字されているため採用しませんでした。
- industry: 主たる業界は、自動車用サスペンション部品などの製造販売が主たる事業であることから自動車としました。東証の業種分類は輸送用機器です。
- relatedCompanies: マツダ：1981年10月に取引を開始した印字はあるが、現行の取引を示す印字がないため結ばない。
- relatedCompanies: SUBARU：1984年10月に取引を開始した印字はあるが、現行の取引を示す印字がないため結ばない。
- relatedCompanies: いすゞ自動車：1986年12月に取引を開始した印字はあるが、現行の取引を示す印字がないため結ばない。
- relatedCompanies: 日本製鉄：特定投資株式の保有目的が「長年にわたる良好な信頼関係」の定型句のみで、具体的な取引の印字がないため結ばない。
- relatedCompanies: パイオラックス、ユニバンス：特定投資株式の保有目的が協力関係の定型句のみで、具体的な取引の印字がないため結ばない。
- relatedCompanies: ユニプレス、NOK：当事業年度の株式数が0株のため結ばない。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ、みずほフィナンシャルグループ、横浜フィナンシャルグループ：主要な取引金融機関との資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: ＪＦＥスチール：2026年3月31日現在、当社の株式843千株（4.09％）を所有する大株主だが、related-candidates.jsonにないため結ばない。
- relatedCompanies: 志藤ホールディングス：2026年3月31日現在、当社の株式883千株（4.29％）を所有する大株主だが、非上場のため結ばない。
- relatedCompanies: 連結子会社19社：すべて非上場のため結ばない。
- relatedCompanies: ランド、キャリア、コア、ゼロ、ベース、ポート、ビジョン、フリー、リコー、セキ、ゼット、アスカ、日新、トラスト：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- terms: 新たに提案する用語はありません。サスペンション部品、ボディーメタル部品などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
