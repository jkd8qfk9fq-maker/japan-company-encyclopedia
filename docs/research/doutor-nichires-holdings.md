# ドトール・日レスホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ドトール・日レスホールディングス |
| 証券コード | 3087 |
| docID（データを取り出した文書） | `S100Y6D7` |
| 原本 docID | `S100Y6D7` |
| 提出日（原本） | 2026-05-26 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6D7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ドトール・日レスホールディングス / 3087 / docID S100Y6D7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
doutor-nichires-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ドトール・日レスホールディングス 有価証券報告書－第19期(2025/03/01－2026/02/28) (docID S100Y6D7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
doutor-nichires-holdings: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年2月期にグループ全体で67店舗を新規出店しました（直営店38店舗、加盟店24店舗、海外5店舗）。
- businessModel: 重要な後発事象は該当事項がなく、提出後の文書もありません。
- businessStructure: ドトールコーヒーグループの小売・卸売・その他の売上高の合計は96,343百万円で、印字の外部顧客への売上高96,344百万円と1百万円ずれますが、有報の丸めによるものです。
- businessStructure: 日本レストランシステムグループの小売・卸売・その他の売上高の合計は56,259百万円で、印字の外部顧客への売上高56,260百万円と1百万円ずれますが、有報の丸めによるものです。
- businessStructure: 主要な顧客ごとの情報は、連結売上高の10%以上を占める販売先がないため記載が省略されています。
- businessStructure: 2026年2月期にグループ全体で67店舗を新規出店しました（直営店38店舗、加盟店24店舗、海外5店舗）。
- history: 沿革は有報の【沿革】の印字どおりに15件を選びました。2007年4月から6月の株式移転の決議と計画書の作成は、同年10月の設立に集約しました。
- industry: 主たる業界は、報告セグメントがコーヒーチェーンとレストランチェーンの飲食事業であることから food としました。
- industry: 東証の業種分類は小売業ですが、事業の実態は飲食店経営のため food を選びました。
- relatedCompanies: ランシステム：日本レストランシステムの断片一致のため結びません。
- relatedCompanies: ランド：断片一致のため結びません。
- relatedCompanies: エン：断片一致のため結びません（ambiguous）。
- relatedCompanies: ベース：「連結ベース」の断片一致のため結びません。
- relatedCompanies: 平和：「平和で公正な環境」の断片一致のため結びません（ambiguous）。
- relatedCompanies: レント：「エクセレント」の断片一致のため結びません。
- relatedCompanies: リックス：「スキルマトリックス」の断片一致のため結びません。
- relatedCompanies: コロナ：新型コロナウイルス感染症への言及のみで、取引・提携の印字がないため結びません。
- relatedCompanies: リコー：「リコール」の断片一致のため結びません。
- relatedCompanies: 田谷：断片一致のため結びません（ambiguous）。
- relatedCompanies: キャリア：「キャリア形成」の断片一致のため結びません。
- relatedCompanies: コモ：「コモディティ」の断片一致のため結びません。
- relatedCompanies: イオンモール：イオンモール武蔵村山への出店の記載のみで、イオンモール株式会社との取引・提携の印字がないため結びません。
- relatedCompanies: ポート：断片一致のため結びません。
- relatedCompanies: セキ：断片一致のため結びません（ambiguous）。
- relatedCompanies: リード：「リードし」の断片一致のため結びません。
- relatedCompanies: トラスト：日本マスタートラスト信託銀行の断片一致のため結びません。
- relatedCompanies: ウィル：「ウィルス」の断片一致のため結びません。
- relatedCompanies: 大株主のうち事業会社は日本たばこ産業のみで、それ以外は個人・信託銀行・資産管理会社・外国法人のため結びません。
- relatedCompanies: 連結子会社23社と関連会社2社はすべて非上場または海外法人のため結びません。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
