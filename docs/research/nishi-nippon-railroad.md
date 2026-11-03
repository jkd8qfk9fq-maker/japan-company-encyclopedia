# 西日本鉄道 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 西日本鉄道株式会社 |
| 証券コード | 9031 |
| docID（データを取り出した文書） | `S100YAAB` |
| 原本 docID | `S100YAAB` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAAB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 西日本鉄道株式会社 / 9031 / docID S100YAAB（id は英語表記「Nishi-Nippon Railroad Co.,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nishi-nippon-railroad: 10 件の数値を有報XBRLと照合
有報: 西日本鉄道株式会社 有価証券報告書－第186期(2025/04/01－2026/03/31) (docID S100YAAB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nishi-nippon-railroad: 本文の金額 0 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業収益・純利益の金額は有報の印字が百万円表記と億円表記で異なるため本文に書かず、前期比の増減率だけを使った。
- businessModel: 第17次中期経営計画の数値目標（事業利益・ROEなど）は書かなかった。
- businessStructure: 事業の並びは2026年3月期の外部顧客への営業収益の順（物流業・不動産業・運輸業・流通業・レジャー・サービス業）。『その他』は報告セグメントに含まれないため最後。
- businessStructure: セグメントの金額は印字が百万円表記のため本文に書かず、前期比の増減率だけを使った。
- businessStructure: 福岡証券取引所の市場区分は表紙に印字がないため market を付けていない。
- history: 1966年4月と1969年6月の行が連記された崩れた表だった。1966年4月は『不動産事業開始』、1969年6月は『㈱西鉄ストアの設立』と対応づけたが、確実さのため不動産事業開始のみ採用した（事象は2つ、年月は2つで数は一致）。
- history: 1991年11月と1992年10月の行も連記されていたため採用しなかった。
- industry: 最大の報告セグメントは物流業（運輸の業界に含める）。運輸業と物流業を合わせて主たる業界を運輸とした。不動産業も報告セグメントとして独立して開示されているため2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: 子会社・関連会社（筑豊電気鉄道、西鉄バス北九州、九州急行バス、福岡国際空港など）は上場でない、または掲載済みと確認できないため結ばない。
- terms: 用語の助言: 「営業キロ」「乗車効率」「TEU」「ICカード（nimoca）」「連節バス」「不動産の流動化」は初めて読む人に説明があると分かりやすい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
