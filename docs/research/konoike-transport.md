# 鴻池運輸 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 鴻池運輸株式会社 |
| 証券コード | 9025 |
| docID（データを取り出した文書） | `S100YGFS` |
| 原本 docID | `S100YGFS` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGFS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 鴻池運輸株式会社 / 9025 / docID S100YGFS（id は英語表記「Konoike Transport Co.,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
konoike-transport: 10 件の数値を有報XBRLと照合
有報: 鴻池運輸株式会社 有価証券報告書－第86期(2025/04/01－2026/03/31) (docID S100YGFS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
konoike-transport: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益などのセグメント利益は本文に書かない方針のため省いた。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高順（複合ソリューション231,985、国際物流67,028、国内物流56,513百万円）。その他は報告セグメント外のため最後。
- businessStructure: 2026年3月期から一部営業所の所属セグメントを変更し、前期分も組替後の数値で開示されている。
- history: 沿革の10件は主要な出来事を選んだもの。1880年の創業は鴻池組創業者による運輸業の開始で、法人設立は1945年。
- industry: 祖業は運輸業で、全報告セグメントが物流・運送・工程請負。最も近い運輸を選んだ。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業として同一性を確認できる相手がいないため結ばなかった。
- relatedCompanies: 日本製鉄は主要顧客だが、候補ファイルでの同一性確認ができないため結ばなかった。
- relatedCompanies: 連結子会社・持分法適用関連会社はいずれも有報上の非上場会社（または候補に無い）で結ばなかった。
- terms: 用語候補（助言）: 定温物流（有報の注記で定義あり）、フォワーディング、工程請負（アウトソーシング）。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
