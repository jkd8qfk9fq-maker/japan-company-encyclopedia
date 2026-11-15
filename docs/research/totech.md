# 東テク — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東テク株式会社 |
| 証券コード | 9960 |
| docID（データを取り出した文書） | `S100YGTS` |
| 原本 docID | `S100YGTS` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGTS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東テク株式会社 / 9960 / docID S100YGTS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
totech: 10 件の数値を有報XBRLと照合
有報: 東テク株式会社 有価証券報告書－第71期(2025/04/01－2026/03/31) (docID S100YGTS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
totech: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の数値目標（売上高2,200億円・経常利益220億円）は、本文の規則により strategy には書きませんでした。
- businessModel: 第68期の企業結合の暫定的な会計処理の確定による第67期の修正再表示について、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotes は書きませんでした。
- businessModel: 本文に財務諸表の組替えの記載がありますが、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotes は書きませんでした。
- businessModel: 2024年4月1日付の株式分割（普通株式1株を3株に分割）は、1株当たりの数値のみに関わるため financialNotes には書きませんでした。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: その他（太陽光発電事業）は報告セグメントに含まれないため最後に置きました。
- history: 沿革は15件に絞りました。営業所の開設・支店への昇格、本社移転、TASセンターの開設、テクニカルセンターの開設、海外現地法人の設立などは省きました。
- industry: 主たる業界は、売上高の最も大きい商品販売事業が設備機器の販売であることと、東証の業種分類が卸売業であることから trading としました。
- industry: 工事事業が報告セグメントのため construction を2つ目に付けました。
- relatedCompanies: 日本レイ株式会社：大株主の状況で筆頭株主（12.83％）だが、related-candidates.json のレイ（4317）は株式会社レイで、社名が一致しない。断片一致のみのため結ばない。
- relatedCompanies: 株式会社大氣社：商品販売事業と工事事業における主要販売先だが、related-candidates.json にないため結ばない。
- relatedCompanies: 上新電機株式会社・西日本鉄道株式会社・日機装株式会社・株式会社ヤマト：当事業年度に全株式を売却済みのため結ばない。
- relatedCompanies: 株式会社みずほフィナンシャルグループ：主要取引金融機関であり、金融取引が理由のため結ばない。
- relatedCompanies: 株式会社みずほ銀行：大株主（4.88％）だが、金融機関で金融取引が理由のため結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社・株式会社日本カストディ銀行：信託銀行のため結ばない。
- relatedCompanies: BBH FOR FIDELITY LOW-PRICED STOCK FUND：海外の投資ファンドのため結ばない。
- relatedCompanies: 草野洵哉氏：個人の大株主のため結ばない。
- relatedCompanies: 東テクグループ従業員持株会：会社ではないため結ばない。
- relatedCompanies: ヤンマーエネルギーシステム株式会社：ガスヒートポンプの特約店契約があるが、非上場で related-candidates.json にないため結ばない。
- relatedCompanies: 連結子会社12社（日本ビルコン株式会社、アイ・ビー・テクノス株式会社、東テク北海道株式会社、三王機工株式会社、北日本計装株式会社、鳥取ビルコン株式会社、アーチバック株式会社、Quantum Automation Pte.Ltd.ほか）：すべて非上場または海外法人のため結ばない。
- relatedCompanies: 非連結子会社3社（株式会社岩崎設備、PT.Prima Totech Indonesia、Totech Vietnam Solutions Co.,Ltd.）：すべて非上場または海外法人のため結ばない。
- relatedCompanies: エン、コア、ポート、ベース、キング、レック、フリー、リックス、ビジョン：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- terms: 新たに提案する用語はありません。ガスヒートポンプや計装工事などの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
