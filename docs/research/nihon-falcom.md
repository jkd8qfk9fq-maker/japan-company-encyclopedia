# 日本ファルコム — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本ファルコム株式会社 |
| 証券コード | 3723 |
| docID（データを取り出した文書） | `S100XBL7` |
| 原本 docID | `S100XBL7` |
| 提出日（原本） | 2025-12-19 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBL7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本ファルコム株式会社 / 3723 / docID S100XBL7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nihon-falcom: 10 件の数値を有報XBRLと照合
有報: 日本ファルコム株式会社 有価証券報告書－第24期(2024/10/01－2025/09/30) (docID S100XBL7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
nihon-falcom: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 単一セグメントのため、部門別の金額は【関連情報】の製品及びサービスごとの情報と販売実績の印字（ライセンス部門1,881,851千円・製品部門731,131千円）に基づき、千円を百万円に切り捨てて記載した。合計は印字の合計2,612,982千円と一致する。
- businessModel: 地域ごとの売上高（日本1,552百万円・アジア69百万円・北米・欧州991百万円）は地域区分であり事業の金額ではないため、本文の事業数値としては書かず、この記録にとどめた。
- businessModel: 主要な顧客の金額・割合は flow の customer 段には書かず、相手先の名称のみを記載した。
- businessModel: MD&A の段階利益の金額や増減率、今後の見通しに印字された2026年９月期の業績見通しの数値は、本文には書かなかった（本文の数値は売上高と当期純利益のみ）。
- businessModel: 2026年９月期に発売を予定するタイトル等の将来計画は、予定である旨の文脈でのみ戦略の記述に含め、完了した事実としては書いていない。
- businessStructure: 単一セグメント（ゲーム開発・販売）のため、【関連情報】の製品及びサービスごとの情報に印字された二部門（ライセンス部門・製品部門）を children とし、外部顧客への売上高の大きい順に並べた。部門別の金額は千円印字を百万円に切り捨てて記載した。
- businessStructure: 拠点は本社（東京都立川市）のみであり、設備のセグメント欄の印字はないため、事業所は単一セグメントの事業の説明に含めた。帳簿価額は書いていない。
- businessStructure: 関係会社はなく（【関係会社の状況】は「該当事項はありません」）、子会社・関連会社は存在しない。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。仕入先の個別名称は【事業の内容】に印字されていない。
- history: 【沿革】に印字された事項は３件のみで、全件を採用した。設立時の資本金額は沿革に書かない規則のため記載していない。
- history: Wikipedia の記事「日本ファルコム」が証券コードで確認できたが、冒頭の記述は本社所在地や主なシリーズなど有報に印字された事実の言い換えにとどまるため、補足には使わなかった。
- industry: 主たる業界は entertainment とした。唯一のセグメントであるゲーム開発・販売が売上高のすべてを占め、ゲームソフトの企画・開発・販売が事業の実体であるため直接当てはまる。
- industry: 音楽CDの企画・制作・販売は製品部門の一部であり独立した開示がないため、２つ目の業界は付けなかった。
- industry: DEIの別記事業はcteである。
- relatedCompanies: en: 曖昧な候補。「エンタテインメント」の部分一致のみで、エン株式会社についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: tein: 「エンタテインメント」の部分一致のみで、株式会社テインについての記述がないため結ばなかった。
- relatedCompanies: land: 「ブランド」の部分一致のみで、株式会社ランドについての記述がないため結ばなかった。
- relatedCompanies: ray: 曖昧な候補。「ロールプレイングゲーム」の部分一致のみで、株式会社レイについての記述がないため結ばなかった。
- relatedCompanies: base-4481: 「時価ベースの自己資本比率」の一般語の一致のみで、ベース株式会社についての記述がないため結ばなかった。
- relatedCompanies: nintendo: 任天堂の名称は Nintendo Switch 及び Nintendo Switch 2 というプラットフォーム名の文脈でのみ印字されており、任天堂株式会社との取引・提携の印字はないため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス」の文脈のみで、株式会社コロナについての記述がないため結ばなかった。
- relatedCompanies: cover: 「開発の遅れを社内全体でカバーできる体制」という一般語の文脈のみで、カバー株式会社についての記述がないため結ばなかった。
- relatedCompanies: king: 「ハッキング」の部分一致のみで、株式会社キングについての記述がないため結ばなかった。
- relatedCompanies: kotobukiya: 曖昧な候補。主な資産及び負債の内訳表に相手先として載るのみで、取引・提携の内容の印字がないため結ばなかった。
- relatedCompanies: 候補外のため結ばなかった相手: 株式会社コナミデジタルエンタテインメント（2025年９月期の売上高の22.0％を占める主要な顧客）、NIS America, Inc.（同13.4％）、株式会社クラウディッドレパードエンタテインメント（同12.7％）、GungHo Online Entertainment America, Inc.（同11.2％）、株式会社ソニー・インタラクティブエンタテインメント（同9.4％）はいずれも主要な顧客として印字されているが、候補リストにないため結んでいない。【関係会社の状況】は「該当事項はありません」で、親会社・子会社・関連会社はない。
- terms: 助言のみ。用語としては「ロールプレイングゲーム」「ランニング・ロイヤリティー」「マルチプラットフォーム」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
