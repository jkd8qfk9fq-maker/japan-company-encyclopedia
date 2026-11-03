# 高砂熱学工業 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 高砂熱学工業株式会社 |
| 証券コード | 1969 |
| docID（データを取り出した文書） | `S100YDOU` |
| 原本 docID | `S100YDOU` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDOU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 高砂熱学工業株式会社 / 1969 / docID S100YDOU（id は英語表記「Takasago Thermal Engineering Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takasago-thermal-engineering: 10 件の数値を有報XBRLと照合
有報: 高砂熱学工業株式会社 有価証券報告書－第146期(2025/04/01－2026/03/31) (docID S100YDOU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
takasago-thermal-engineering: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・受注高・総資産などの金額は、本文の規則により書かなかった。
- businessModel: 顧客の構成は提出会社の受注工事高（官公庁・民間）と、主な受注先として建設会社が挙がっていることによる。
- businessStructure: 事業の並びは、セグメント注記の外部顧客への売上高（415,383 > 8,414 > 125）の順。「その他」は報告セグメントに含まれない区分なので最後。
- businessStructure: shortNameEn は表紙の英訳名から Co., Ltd. を除いたもの。
- history: 沿革は年表形式で崩れておらず、年月と事象が対応している。支店開設・許可更新・清算済みの会社・提携の解消などは重要度が低いため省いた。
- industry: 売上の大半は設備工事事業（外部顧客への売上高415,383百万円／423,923百万円）で、建設業。半導体工場向けの工事は受注先の事例にとどまり、半導体向けの事業として開示されていないため半導体は付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業で同一性を確認できる相手がいないため、結んだ相手はなし。
- relatedCompanies: TMES㈱・日本ピーマック㈱・ヒューコス㈱などの連結子会社と日本設備工業㈱（持分法適用関連会社）は、候補ファイルに無く上場かどうか確認できないため結ばない。
- relatedCompanies: 鹿島建設・大林組・竹中工務店・大成建設などは主な受注先として工事名に社名が出るだけで、候補ファイルに無く、取引の向きと同一性を確認できないため結ばない。
- terms: 用語集への追加候補（助言のみ）：クリーンルーム（半導体や医薬品の工場で、空気中の微粒子を管理した部屋）、一般設備と産業設備の違い（ビル向けと工場向け）、特命と競争（受注方法）、持分法適用関連会社。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
