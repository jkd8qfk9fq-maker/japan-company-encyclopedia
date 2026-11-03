# 東亜建設工業 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東亜建設工業株式会社 |
| 証券コード | 1885 |
| docID（データを取り出した文書） | `S100YCGY` |
| 原本 docID | `S100YCGY` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCGY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東亜建設工業株式会社 / 1885 / docID S100YCGY（id は英語表記「TOA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
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
toa: 10 件の数値を有報XBRLと照合
有報: 東亜建設工業株式会社 有価証券報告書－第136期(2025/04/01－2026/03/31) (docID S100YCGY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第135期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toa: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 変則決算・会計基準の変更はないため financialNotes は書かなかった。perspectives は有報の事実から言える範囲が限られるため省いた。
- businessStructure: 事業は【セグメント情報】の外部顧客に対する売上高の順（国内土木156,001／国内建築94,250／海外92,337）。「その他」は報告セグメントに含まれない区分なので最後。
- businessStructure: listings の market は、表紙が「東京証券取引所プライム市場札幌証券取引所」と印字。札幌は市場区分の印字がないため market を付けていない。
- businessStructure: shortNameEn は表紙の英訳名 TOA CORPORATION から CORPORATION を落とした。
- history: 沿革のうち主要な出来事を選んだ。許認可の登録・更新、支店の新設・改組の多くは省いた。2026年4月の組織変更（社長室の設置・沖縄支店の開設など）は採用していない。
- industry: 報告セグメントはすべて工事（国内土木・国内建築・海外）なので建設のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、候補が無い。
- relatedCompanies: 子会社（東亜鉄工、東亜機械工業、信幸建設、東亜エージェンシー、東亜海運産業、東亜リアテック、PFI斎場運営、PFI一宮斎場、PT TOA TUNAS JAYA INDONESIA）はいずれも上場企業として掲載済みの候補になく、結ばなかった。
- relatedCompanies: 大株主は信託銀行の信託口が中心で、事業会社がなく結ばなかった。保有株式の表の銀行・理研計器は資金調達や協業の可能性にとどまるため結ばなかった。
- terms: 用語の追加候補: 海上土木（港湾・護岸・埋立などの海の工事）、特命と競争（受注方法）、PFI（民間の資金や運営力で公共施設を整備・運営する方式）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
