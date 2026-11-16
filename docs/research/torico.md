# TORICO — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＴＯＲＩＣＯ |
| 証券コード | 7138 |
| docID（データを取り出した文書） | `S100YNOG` |
| 原本 docID | `S100YNOG` |
| 提出日（原本） | 2026-06-30 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YMYB, S100YMY5（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YNOG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＴＯＲＩＣＯ / 7138 / docID S100YNOG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
torico: 10 件の数値を有報XBRLと照合
有報: 株式会社ＴＯＲＩＣＯ 有価証券報告書－第21期(2025/04/01－2026/03/31) (docID S100YNOG)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第20期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第19期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
torico: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社TORICO」が EDINET の提出者名「株式会社ＴＯＲＩＣＯ」と違います
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…現を目指し、売上規模の追求から確実な利益体質の構築へ舵を切り、既存事業の収益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 第20期・第19期の訂正有価証券報告書（S100YMYB、S100YMY5）が提出されているが、当期有報の主要指標と前期有報の照合では全系列差異ゼロであり、数値への影響はないため警告のみとした。
- businessModel: セグメントは当連結会計年度から「マンガ事業」「暗号資産事業」の2区分に変更された（従来はマンガ関連事業の単一セグメント）。期中の事業開始に伴う区分追加であり、前期は単一セグメントのためセグメント別の前期比較は行われていない。
- businessModel: 主要な経営指標等の注記のうち、希薄化効果等の表示に関する注記（注記2〜4）と従業員の定義に関する注記（注記5）は表示事項のため警告のみとした。
- businessModel: 暗号資産事業の売上高は1,623千円であり、千円単位を切り捨てて1百万円と表記している（切り上げはしていない）。
- businessModel: 供給者は個別名が印字されていないため、本文では出版社とのネットワークに触れるのみとした。
- businessStructure: セグメントは当連結会計年度から「マンガ事業」「暗号資産事業」の2区分に変更された（従来はマンガ関連事業の単一セグメント）。期中の事業開始に伴う区分追加であり、前期は単一セグメントのためセグメント別の前期比較は行われていない。
- businessStructure: 供給者（仕入先）は個別名が印字されていないため suppliers は書かず、コミック等の仕入は出版社とのネットワークを通じる旨を事業の説明に留めた（旧スキーマのため suppliers キー自体も省略）。
- history: 本社移転の各行（2006年杉並区・中野区、2007年八王子市、2007年台東区など）や倉庫の開設・移転の各行（2009年市川市、2010年文京区、2014年千代田区、2020年舎人DC、2021年川口DC、2023年千代田区・足立区）は落とした。
- history: 個別の店舗開店の各行（2019年池袋・大阪谷六、2020年リブリオShop、2021年渋谷、2022年名古屋、2025年天王寺）と、海外向け配信「MANGA.CLUB」（2017年）、情報サービス「マンガのとりこ」（2018年）、台湾支社設立（2022年）、トレーディングカード専門EC「トレオタ」（2024年）は落とした。
- history: 資本金の金額は沿革に書かなかった（設立時・子会社設立時の資本金）。
- industry: 暗号資産事業は売上高1百万円とごく小さく、独立した業界は付けなかった。
- relatedCompanies: アマゾンジャパン合同会社はセグメント情報の主要な顧客ごとの情報に2026年3月期の相手先として印字されているが、候補一覧にないため関連会社として登録しなかった。
- relatedCompanies: 株式会社Mint Town（2025年12月に資本業務提携を締結し、ガバナンスに関する合意書も締結）及びグロースパートナーズ株式会社（2025年4月に資本業務提携を締結）は候補一覧にないため関連会社として登録しなかった。
- relatedCompanies: 候補の space、hit、king、base-4481、career、vision、cover、land、tein は一般語・部分一致と判断し、リンクしなかった。
- relatedCompanies: 候補の daiwa、seki、core、en は曖昧な照合であり、リンクしなかった。
- relatedCompanies: 候補の nissin は現在のEDINETコードリストに証券コード付きで載っていないため、リンクしなかった。
- relatedCompanies: 連結子会社5社（株式会社ROLL、株式会社漫画全巻ドットコム、株式会社スキマ、TORICO SINGAPORE PTE. LTD.、株式会社TORICO Ethereum）は当社の子会社であり、リンクしない。
- relatedCompanies: 大株主のShooting Star１号投資事業有限責任組合は投資事業組合であり、候補一覧にもないためリンクしなかった。
- terms: 用語の同定のみを助言し、定義は書いていない。事業の理解に資する固有の用語として、漫画全巻ドットコム（コミック全巻セットに特化したネット書店）、マンガ展（マンガ作品の体験／展示イベント）、スキマ（デジタルコミック配信サービス）、DAT戦略（暗号資産の取得・運用による企業価値向上の戦略）が印字されている。

## 要確認（status に反映）

- businessModel: [object Object]
- businessModel: [object Object]

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ＴＯＲＩＣＯの主たる業界（マンガ事業） → 提案: マンガ・コミック小売（EC・イベント）。売上高のほぼ全額を占めるマンガ事業は、コミック全巻セットに特化したネット書店とマンガのイベント・物販ですが、閉じた分類にマンガ・コミックの小売を表す値がありません。関連グッズの物販やイベントを含む事業に最も近い entertainment を暫定としました。
