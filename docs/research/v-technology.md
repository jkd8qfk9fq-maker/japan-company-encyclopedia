# ブイ・テクノロジー — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ブイ・テクノロジー |
| 証券コード | 7717 |
| docID（データを取り出した文書） | `S100YITH` |
| 原本 docID | `S100YITH` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YITH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ブイ・テクノロジー / 7717 / docID S100YITH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
v-technology: 10 件の数値を有報XBRLと照合
有報: 株式会社ブイ・テクノロジー 有価証券報告書－第29期(2025/04/01－2026/03/31) (docID S100YITH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
v-technology: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額はすべて有報の百万円印字のとおりに記載した（千円単位からの換算は行っていない）。セグメント間の内部売上高は用いず、セグメント注記の外部顧客への売上高を用いた。セグメント利益は記載していない。
- businessModel: 地域別売上高の内訳（日本12,226百万円、韓国1,171百万円、中国35,575百万円、台湾1,992百万円、その他2,025百万円）の合計は52,989百万円で、印字された合計52,992百万円と3百万円異なるが、有報の印字どおりに記載した。
- businessModel: 目標とする経営指標には比率指標が含まれているため、数値目標は戦略本文に記載していない。
- businessModel: 仕入先について有報に一般名詞での記載がないため、suppliersは空とした。
- businessModel: 戦略の根拠は【経営方針、経営環境及び対処すべき課題等】の経営理念、経営方針及び経営戦略と半導体分野での取組みである（スキーマ上、disclosedにはbasisを置けないためここに記録する）。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（FPD装置事業31,964百万円、半導体・フォトマスク装置事業19,593百万円、その他事業1,435百万円）。「その他」は報告セグメントに含まれない事業セグメントであり、最後尾に置いた。
- businessStructure: グループ構成は【事業の内容】の印字どおり当社、子会社22社及び関連会社4社とした。【関係会社の状況】では連結子会社7社の名称が個別に印字され、残りは「その他15社」とされている。
- businessStructure: その他事業は顧客が一般名詞で特定できないため、customersを記載していない。
- history: 【沿革】の各行から構造的な出来事を選定した。北米子会社の設立・売却、台湾・中国拠点の商号変更、Lumiotec株式会社・株式会社アイテック等の株式取得といった細目は省略した。
- history: 設立時及び上場時の資本金の金額は、禁止される財務金額に当たるため記載していない。
- industry: 両報告セグメントとも製造装置の開発・製造・販売が実体であり、成長ドライバとして掲げる半導体分野を主産業、装置製造の観点から機械を副産業とした。FPD装置事業は表示装置向け装置であり、独立した産業区分は設けていない。
- relatedCompanies: omron（オムロン株式会社、6645）：【沿革】に印字される事業譲受の相手方はオムロンレーザーフロント株式会社及びその連結子会社であり、オムロン株式会社そのものは取引の相手方として印字されていないため、関連企業としなかった。譲受の事実は沿革に記載した。
- relatedCompanies: 最大の顧客であるZhejiang Laibao Display Technology Co., Ltd.（2026年3月期の売上高5,721百万円）は外国の会社で候補に含まれないため、関連企業としなかった。前期の主要顧客であった株式会社エイチ・ティー・エル、Xiamen Tianma Optoelectronics Co., Ltd.、Guangzhou China Star Optoelectronics Semiconductor Display Technology Co., Ltd.も候補に含まれないため、関連企業としなかった。
- relatedCompanies: 大株主の筆頭は個人（代表取締役）であり、日本マスタートラスト信託銀行（信託口）等の信託口は関連企業としない。
- relatedCompanies: innovation（3970）は研究開発拠点「YRPイノベーションセンター」の名称一致、create（3024）は連結子会社ジャパンクリエイト株式会社の名称の一部一致（候補のクリエイト株式会社とは別の会社）、trust（3347）は日本マスタートラスト信託銀行（信託口）の部分一致であり、いずれも相手方そのものではない。
- relatedCompanies: ray（4317）、port（7047）、base-4481、the-lead（6982）、career（6198）、en（4849）、gakujo（2301）、kohsoku（7504）、space（9622）、vision（9416）は、いずれも「ディスプレイ」「ポートフォリオ」「営業利益ベース」「リードタイム」「キャリア形成」「エンジニア」「地政学情勢」「高速・大容量通信」「スペース（生産場所）」「グループのビジョン」といった一般語・部分一致であり、取引・提携・資本関係の印字がないため、関連企業としなかった。
- relatedCompanies: 連結子会社22社と持分法適用関連会社4社（株式会社日本生産技術研究所、Xianyang CHVT New Display Technology Co., Ltd.、ネクスファイ・テクノロジー株式会社、株式会社EORIC）は自社グループの会社であるため、関連企業としない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
