# オカムラ — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オカムラ |
| 証券コード | 7994 |
| docID（データを取り出した文書） | `S100YFDV` |
| 原本 docID | `S100YFDV` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFDV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オカムラ / 7994 / docID S100YFDV（id は英語表記「OKAMURA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
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
okamura: 10 件の数値を有報XBRLと照合
有報: 株式会社オカムラ 有価証券報告書－第91期(2025/04/01－2026/03/31) (docID S100YFDV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
okamura: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: brief.md に財務諸表の組替えの記載がある旨の注意があったが、前期有報との重複年度は全て一致のため、売上高・純利益はそのまま使った。
- businessStructure: 事業の並びは【セグメント情報】の2026年3月期の外部顧客への売上高の順（オフィス環境191,852・商環境116,171・物流システム14,702百万円）。「その他」は報告セグメント外なので最後。
- businessStructure: 「その他」に不動産事業が含まれる点は減損損失の注記（「その他」の金額は不動産事業に係る）による。
- history: 沿革は事実の多い行から主要な出来事を選んだ。旧社名「岡村製作所」は沿革の1946年（有限会社岡村製作所）の記載による。
- industry: 家具・什器の製造が売上の大半だが、閉じた分類に家具・住宅設備の区分が無いため、最も近い machinery（機械）を暫定にした。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる掲載済み企業の候補が無いため、結ばなかった。
- relatedCompanies: 沿革の三菱商事・日本製鉄・日本たばこ産業は過去の共同出資の記載のみで、現在の関係を示す記載がなく、候補にも無いため結ばなかった。
- terms: 用語の助言: 「流体変速機」（パワートレーン事業）、「持分法適用関連会社」が解説候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] オカムラ（オフィス家具・店舗什器の製造） → 提案: furniture 家具・什器。売上の大半がオフィス家具・店舗用什器で、機械では実態を表せない。
