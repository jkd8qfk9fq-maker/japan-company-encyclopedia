# シスメックス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | シスメックス株式会社 |
| 証券コード | 6869 |
| docID（データを取り出した文書） | `S100YFAW` |
| 原本 docID | `S100YFAW` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFAW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | シスメックス株式会社 / 6869 / docID S100YFAW（id は英語表記「SYSMEX CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
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
sysmex: 10 件の数値を有報XBRLと照合
有報: シスメックス株式会社 有価証券報告書－第59期(2025/04/01－2026/03/31) (docID S100YFAW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第55期(2021/04/01－2022/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
sysmex: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 目標のうち営業利益の金額は本文の規則により書かなかった。
- businessModel: 2026年3月期の減益の要因（減損損失など）は利益項目のため本文に書かなかった。売上高は日本・中国で減少、米州・EMEA・APで増加。
- businessStructure: 事業は報告セグメント（統括会社別）の外部顧客への売上高の大きい順。中国統括(89,296)は本社統括(87,562)より大きい。
- businessStructure: 地域別の統括であり製品別の区分は開示が機器・試薬・保守サービスの合計のみのため、children は作らなかった。
- history: 沿革は主要な節目のみ抜粋。1994年の額面変更のための形式上の合併などは省いた。
- industry: 医療分野の検体検査機器・試薬の会社。近い値は医薬品（診断薬を含む医療分野）のため暫定。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み上場企業との同一性を確認できないため、結ばなかった。
- relatedCompanies: 連結子会社・関連会社（メディカロイド等）は有報に載るが、いずれも掲載済み上場企業ではない。
- relatedCompanies: 日本電子（生化学検査事業の承継）・JCRファーマ（アライドセル共同設立）・TOPPANホールディングス（理研ジェネシス）は沿革上の1回限りの出来事で、候補ファイルも無いため結ばなかった。
- terms: 用語の追加候補: 検体検査、試薬、ヘマトロジー（血液学検査）、血液凝固検査、尿検査。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] シスメックスの主たる業界 → 提案: 医療機器・診断（medical-devices）。検体検査機器と診断試薬が中心で、医薬品とも電機とも言い切れず、閉じた分類に合う値が無い。
