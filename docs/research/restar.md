# レスター — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社レスター |
| 証券コード | 3156 |
| docID（データを取り出した文書） | `S100YJ4V` |
| 原本 docID | `S100YJ4V` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ4V.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社レスター / 3156 / docID S100YJ4V（id は英語表記「Restar Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
restar: 10 件の数値を有報XBRLと照合
有報: 株式会社レスター 有価証券報告書－第17期(2025/04/01－2026/03/31) (docID S100YJ4V)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"NumberOfEmployees|2025-03-31","previousFiling":4483,"latestFiling":4655}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
restar: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 利益は当期純利益のみ記載。中期経営計画の目標値や営業利益などは省いた。
- businessModel: 従業員数4,637人は有報の連結従業員数（brief.md）。
- businessStructure: 並び順はセグメント注記の外部顧客への売上高（2026年3月期）の大きい順: デバイスBU 555,863 > システムBU 48,860 > IT&SIer BU 26,181（百万円）。children も同様（デバイス533,805 > EMS22,057、システムソリューション31,493 > エコソリューション17,367）。
- businessStructure: shortNameEn の Restar は表紙の英訳名 Restar Corporation から Corporation を除いたもの。
- businessStructure: セグメント利益は本文に書かない方針のため省いた。2025年7月にレスターエンベデッドソリューションズの事業を当社が譲り受け、デバイスBUとシステムBUに振り分ける組替えがあった（前期は組替後の値）。
- history: 沿革は通常の年月・事項の表で、対応のずれはない。小規模な子会社化・吸収合併・本社移転などは省いた。
- industry: 売上の大半はデバイスBU（半導体・電子部品の販売）で、商社型のため trading を主とした。半導体・電子部品の販売を事業として開示しているので semiconductors を2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: ＰＣＩホールディングス（子会社、有報提出会社）: 掲載済みかどうかを確認できる候補ファイルが無い。
- relatedCompanies: 株式会社ケイエムエフ（その他の関係会社、議決権被所有割合23.4％）: 財産管理会社で、上場を確認できない。
- relatedCompanies: 株式会社コクホーシステム（持分法適用関連会社）: 上場を確認できない。
- relatedCompanies: PALTEK、レスターサプライチェーンソリューション、CU TECH CORPORATION、バイテックベジタブルファクトリー（子会社）: 上場を確認できない。
- terms: 用語の追加提案: EMS（電子機器の受託製造）、ラインカード（商社が取り扱うメーカーの商品の組み合わせ）、SIer。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
