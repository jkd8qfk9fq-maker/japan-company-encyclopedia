# 日本空港ビルデング — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本空港ビルデング株式会社 |
| 証券コード | 9706 |
| docID（データを取り出した文書） | `S100YGGN` |
| 原本 docID | `S100YGGN` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGGN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本空港ビルデング株式会社 / 9706 / docID S100YGGN（id は英語表記「Japan Airport Terminal Co.,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
japan-airport-terminal: 10 件の数値を有報XBRLと照合
有報: 日本空港ビルデング株式会社 有価証券報告書－第82期(2025/04/01－2026/03/31) (docID S100YGGN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第80期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
japan-airport-terminal: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives は有報の戦略の節を読んでいないため省いた。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順（物品販売業・施設管理運営業・飲食業）。
- history: 沿革表の2007年4月〜2011年1月（日付7・事象7）と2011年11月〜2025年3月（日付13・事象13）は年月と事象が分かれて印字されていた。個数が同じため行順で対応づけた。使ったのは2018年・2025年の項目で、2018年4月の連結子会社化と2025年3月の北側サテライト接続はこの対応による。
- history: 1953年の行は日付が2つ（7月・1月）で事象が1つのため、月は書かず年だけを使った。
- industry: 主たる業界は外部顧客への売上高が最大の物品販売業（小売）。空港ターミナルの運営は運輸に近いため2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業の中から同一性を確かめられないため、関連企業は結ばなかった。
- relatedCompanies: エージーピー（持分法適用関連会社）・東京空港交通（持分法適用関連会社）など【関係会社の状況】の相手は、掲載済み企業として確認できないため結ばなかった。
- terms: 用語の助言: 「グランドハンドリング」（航空機の地上支援業務）、「サテライト」（本館から離れた搭乗用の施設）が初出の読者に分かりにくい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 日本空港ビルデングの施設管理運営業（空港ターミナル運営） → 提案: 空港・インフラ運営。空港ターミナルの賃貸・運営に合う区分が閉じた分類に無い。
