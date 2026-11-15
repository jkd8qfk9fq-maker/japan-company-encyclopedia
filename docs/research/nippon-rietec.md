# 日本リーテック — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本リーテック株式会社 |
| 証券コード | 1938 |
| docID（データを取り出した文書） | `S100YI6M` |
| 原本 docID | `S100YI6M` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI6M.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本リーテック株式会社 / 1938 / docID S100YI6M（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 0 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-rietec: 10 件の数値を有報XBRLと照合
有報: 日本リーテック株式会社 有価証券報告書－第17期(2025/04/01－2026/03/31) (docID S100YI6M)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-rietec: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: セグメント売上高はセグメント情報の外部顧客への売上高（千円）を百万円単位に換算して記載した（千円→百万円換算）。換算後の3セグメント合計は74,043百万円となり、端数処理のため連結売上高74,044百万円と1百万円の差異がある。MD&Aのセグメント別数値は内部売上高を含むため使用していない。
- businessModel: 2025年10月に連結子会社のNR信号システム株式会社がNR電車線テクノ株式会社を吸収合併し、NR電気システム株式会社に商号変更した。当期中に完了し期末の体制に反映されているため、沿革とwarningsに記録し、needsReviewには入れなかった。
- history: 沿革は旧千歳電気工業株式会社と旧保安工業株式会社の記載を統合して記載した。設立時の資本金額は記載していない。支店・営業所の設置、本店移転、事業目的の追加等の軽微な記載は省略した。
- industry: 閉じた産業リストでは最も近い『construction』を主産業とした。同業の日本電設工業（登録済み）も同じ分類である。
- relatedCompanies: 株式会社みずほフィナンシャルグループと株式会社三菱UFJフィナンシャル・グループは特定投資株式として保有するが、保有目的は資金の安定調達等であり、取引・提携の関係ではないため関連付けしなかった。
- relatedCompanies: 株式会社大林組は完成工事の注文者として主要完成工事に記載があるのみで、株式保有や提携の公表がないため関連付けしなかった。
- relatedCompanies: 日本電気株式会社は、持分法適用関連会社の名称（東日本電気エンジニアリング株式会社）への部分一致であり、同社自体との関係の公表がないため関連付けしなかった。
- relatedCompanies: 大株主の光通信KK投資事業有限責任組合は株式会社光通信とは別人格のため、株式会社光通信には関連付けしなかった。
- relatedCompanies: 株式会社日本道路は、当社支店名（東日本道路インフラ支店）への部分一致であり、同社との関係の公表がないため関連付けしなかった。
- relatedCompanies: 連結子会社7社（株式会社保安サプライ、株式会社シーディーサービス、株式会社保工北海道、株式会社保工東北、交通安全施設株式会社、NRシェアードサービス株式会社、NR電気システム株式会社）と持分法適用関連会社2社（日本鉄道電気設計株式会社、東日本電気エンジニアリング株式会社）は当社グループ会社であるため関連付けの対象としなかった。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社（信託口）等の信託口名義は実質株主ではないため関連付けしなかった。
- relatedCompanies: 候補リストの一般語・部分一致（高速道路、東京電力パワーグリッド等の他社名への部分一致を含む）は別人格又は一般名詞のため関連付けしなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
