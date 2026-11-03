# 日鉄ソリューションズ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日鉄ソリューションズ株式会社 |
| 証券コード | 2327 |
| docID（データを取り出した文書） | `S100YAEV` |
| 原本 docID | `S100YAEV` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAEV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日鉄ソリューションズ株式会社 / 2327 / docID S100YAEV（id は英語表記「NS Solutions Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ns-solutions: 10 件の数値を有報XBRLと照合
有報: 日鉄ソリューションズ株式会社 有価証券報告書－第46期(2025/04/01－2026/03/31) (docID S100YAEV)
前期有報との比較: 34 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上収益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ns-solutions: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益と当期利益は、IFRSの行（売上収益／親会社の所有者に帰属する当期利益）の2026年3月期と前期の値を、百万円の印字どおりに使った。旧基準の行は2022年・2023年3月期だけで使っていない。
- businessModel: 証拠パックの「財務諸表の組替え」は、注記22の表示方法の変更（ビジネスソリューションからコンサルティング＆デジタルサービスへの一部分野の組替え）で、区分間の移動であり連結の売上収益・当期利益の合計の定義は変わらないと読んだ。前期有報との重複年度も全て一致。このため financialNotes は書かなかった。
- businessModel: 日本製鉄とそのグループ会社向け売上収益90,263百万円は注記6の主要な顧客に関する情報の印字どおり。
- businessModel: 競争優位・業界での位置づけは、有報に会社自身の説明を確認できていないため perspectives に書いていない。
- businessStructure: name は表紙の「日鉄ソリューションズ株式会社」から「株式会社」を落とした。shortNameEn は表紙の英訳名 NS Solutions Corporation から Corporation を落として NS Solutions とした（本文・沿革に NS Solutions の表記が多数ある）。
- businessStructure: グループの報告セグメントは「情報サービス」単一。注記「22．売上収益」が顧客・マーケットとサービスの性質で分解した「ビジネスソリューション」「コンサルティング＆デジタルサービス」を事業の柱として並べ、売上収益の大きい順（286,506百万円、94,833百万円）にした。
- businessStructure: 「その他」（特例子会社 ㈱Act.）は売上収益の分解（合計381,340百万円は2区分の合計）に現れないため最後に置き、金額は書いていない。
- businessStructure: 子区分（産業・鉄鋼、流通・サービス、金融／ITサービス＆エンジニアリング、コンサルティング＆デジタルソリューション）は金額が独立して開示されていないため、金額は書いていない。
- businessStructure: 注記22は、2026年3月期から一部の分野をビジネスソリューションからコンサルティング＆デジタルサービスへ組み替えたと記す。前期の値（243,464、94,837）は組替後の表示で、前期有報の値との照合は未確認のため、増減の評価はしていない。
- businessStructure: 市場区分は表紙に「東京証券取引所 プライム市場／名古屋証券取引所 メイン市場／福岡証券取引所 本則市場」と印字されているため記載した。
- history: 沿革は事象を絞って11件を採った。細かな子会社の設立・合併・データセンター開設などは省いた。
- history: 2025年の2件は同じ年だが別の出来事。年月は description に書いた。
- history: 有報の沿革表の年月と事象の対応は崩れておらず、そのまま使えた。
- industry: 単一セグメント「情報サービス」で、売上収益の全体が情報システムの企画・構築・運用などのため、IT・ソフトウェアのみとした。
- relatedCompanies: related-candidates.json が証拠パックに無かった。日本製鉄は掲載済み企業（id: nippon-steel、src/data/companies）で、有報が親会社と印字し、同一性・関係性とも明確なため結んだ。listing が上場であることは未照合。
- relatedCompanies: 連結子会社（日鉄ソリューションズ北海道・インフォコムなど）と持分法適用関連会社の気象衛星ひまわり運用事業は、掲載済み企業としての確認ができないため結んでいない。
- relatedCompanies: 日立製作所・伊藤忠商事・日本アイ・ビー・エム・日本オラクルは、沿革の過去の合弁・提携の記述のみで、現在の関係を述べておらず、結んでいない。
- relatedCompanies: 三井住友銀行は沿革の過去1回のシステム完工の記述のみで結んでいない。
- terms: 用語集の助言: システムインテグレーション（SI）、ITアウトソーシング、DX（デジタルトランスフォーメーション）、ローコード、オファリング、IFRS が、この会社の説明に出てくる。既存の用語に無ければ追加候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
