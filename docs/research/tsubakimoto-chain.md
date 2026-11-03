# 椿本チエイン — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社椿本チエイン |
| 証券コード | 6371 |
| docID（データを取り出した文書） | `S100YKVK` |
| 原本 docID | `S100YKVK` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKVK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社椿本チエイン / 6371 / docID S100YKVK（id は英語表記「TSUBAKIMOTO CHAIN CO.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tsubakimoto-chain: 10 件の数値を有報XBRLと照合
有報: 株式会社椿本チエイン 有価証券報告書－第116期(2025/04/01－2026/03/31) (docID S100YKVK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tsubakimoto-chain: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の数値目標（ROE・配当性向・営業利益率）は本文方針により書かなかった。
- businessModel: financialNotes は形式が確認できず、変則決算ではないため書かなかった（大同工業の連結開始は history に記載）。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順（チェーン、モビリティ、マテハン、モーションコントロール）。「その他」は報告セグメントに含まれないため最後。
- businessStructure: セグメントごとの金額は本文に書かない方針で省いた。
- history: 沿革は表の行を事象ごとに選んで要約した。1949年の上場は有報の文言どおり。
- industry: 主業界はチェーン・モーションコントロール・マテハンなど機械要素・搬送機器の報告セグメントが大半のため機械。モビリティが報告セグメントとして開示されているため自動車を2つ目に付けた。
- relatedCompanies: 椿本興業株式会社: 主要な顧客（2026年3月期30,091百万円）で大株主（3.34%、2026年3月31日現在）でもあるが、related-candidates.json が証拠パックに無く、上場の同一性を確認できないため結ばなかった。
- relatedCompanies: 大同工業株式会社: 2026年1月1日に完全子会社化され上場廃止（2025年12月29日）のため、上場企業としては結ばない。
- relatedCompanies: 太陽生命保険・日本生命保険・信託銀行・銀行: 金融機関の純投資・資金取引で、事業上の関係の記載がないため結ばなかった。
- relatedCompanies: 椿本チエイン持株共栄会: 従業員持株会で上場企業ではない。
- terms: 用語の助言: 「タイミングチェーン」「マテハン（マテリアルハンドリング）」「減速機」「株式交換」は初学者に説明があるとよい。既存の用語集に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
