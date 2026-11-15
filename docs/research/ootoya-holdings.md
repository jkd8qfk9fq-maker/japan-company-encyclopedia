# 大戸屋ホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社大戸屋ホールディングス |
| 証券コード | 2705 |
| docID（データを取り出した文書） | `S100YF7Y` |
| 原本 docID | `S100YF7Y` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF7Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社大戸屋ホールディングス / 2705 / docID S100YF7Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ootoya-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社大戸屋ホールディングス 有価証券報告書－第43期(2025/04/01－2026/03/31) (docID S100YF7Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ootoya-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はMD&Aに印字された億単位の表記（売上高370億16百万円、国内直営229億16百万円、国内フランチャイズ101億28百万円、海外直営30億９百万円、海外フランチャイズ３億44百万円、その他６億17百万円、親会社株主に帰属する当期純利益12億33百万円）をそのまま用いた。セグメント利益は記載していない。
- businessModel: 中期経営計画の目標値として印字された2027年3月期の数値目標は将来に関する事項であり、本文には記載していない。
- businessModel: 2026年3月期に第1回優先株式の取得及び自己株式の消却等が行われたことは資本政策に関する事項であり、financialNotesではなくwarningsに留めた。重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。
- businessModel: 店舗数の合計461店舗は【事業の内容】の地域別分布表の合計（直営165店舗、フランチャイズ296店舗）に基づく。MD&Aの稼働店舗数とは集計の時点・対象が異なる場合があるため、混用していない。
- businessModel: Wikipediaの補足（コロワイドグループに属すること）は有報の親会社記載と重なるため、独立した出典としては用いていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした（国内直営229億16百万円、国内フランチャイズ101億28百万円、海外直営30億９百万円、海外フランチャイズ３億44百万円）。「その他」は報告セグメントに含まれない区分のため最後に置いた。金額はMD&Aに印字された億単位の表記を用い、セグメント利益は記載していない。
- businessStructure: 当社グループは当社と連結子会社7社で構成される。THREE FOREST (THAILAND) CO., LTD.は議決権の所有割合が49.0％であるが、実質的に支配しているため子会社とされている旨が【関係会社の状況】の注記に印字されている。登録は2026年3月31日現在の体制に基づく。
- businessStructure: 関係会社の状況に印字される親会社と連結子会社の資本金額は、金額に関する記載制限のため転記していない。
- history: 沿革の設立時の資本金額は、金額に関する記載制限のため転記していない。
- history: 沿革のうち、本部移転の細目、子会社の設立・商号変更・株式売却の細目などは主要な転機に絞って選定した。2011年8月のBETAGRO OOTOYA (THAILAND) CO., LTD.の株式売却とエリア・フランチャイズ契約の締結、2013年12月の上海子会社の完全子会社化、2014年3月の中国全土におけるエリア・フランチャイズ契約などは、選定から外しここに記録する。
- history: 2020年11月のコロワイドによる子会社化における46.7％は、沿革に印字された当時の所有割合である。2026年3月31日現在の被所有割合は【関係会社の状況】では46.7％、【大株主の状況】では46.68％と印字されている。
- industry: 当社グループは定食、弁当及び惣菜の販売を主たる事業とする外食グループであり、売上の大半を占める国内直営・国内フランチャイズの両事業とも飲食事業であるため、主たる業界はfoodとした。独立した金額が開示されていない事業に基づく2つ目の業界は付けていない。
- relatedCompanies: 株式会社コロワイド（証券コード7616）: 【関係会社の状況】に親会社として印字され、2026年3月31日現在の議決権の被所有割合は46.7％で、従業員の出向の関係がある。しかし同社は百科事典の掲載済みエントリーに存在せず（related-candidates.jsonにも含まれない）、registryに無い相手は結べないため結ばなかった。親会社の事実はbusinessStructure・history・businessModelのwarningsに記録した。
- relatedCompanies: 株式会社コロワイドMD: 【関連当事者情報】に同一の親会社を持つ会社として印字され、連結子会社が同社から食材仕入を行っている。しかし同社は非上場で掲載済みエントリーに存在しないため結ばなかった。
- relatedCompanies: 株式会社日本アクセス: 【大株主の状況】に所有割合0.69％で印字されるのみで、取引・提携の具体的な印字がないため結ばなかった。
- relatedCompanies: ブルドックソース株式会社: 【大株主の状況】に所有割合0.51％で印字されるのみで、取引・提携の具体的な印字がないため結ばなかった。related-candidates.jsonに含まれるが、社名の一致と大株主表の記載だけでは結ばない。
- relatedCompanies: 日本ハム株式会社: 【大株主の状況】に所有割合0.37％で印字されるのみで、取引・提携の具体的な印字がないため結ばなかった。related-candidates.jsonに含まれるが、同様の理由で結ばない。
- relatedCompanies: その他の候補（ランド、エン、ベース、ゼロ、キャリア、ポート、レイ、ビジョン、イオンモール、ガーデン、リックス）は一般語・部分一致・店舗名や制度名の一部として現れるのみで、相手企業についての取引・提携・資本関係の印字がないため結ばなかった。イオンモールはコードリストにない相手でもある。
- relatedCompanies: 連結子会社7社（株式会社大戸屋、香港大戸屋有限公司、OOTOYA ASIA PACIFIC PTE. LTD.、AMERICA OOTOYA INC.、OOTOYA NJ L.L.C.、M OOTOYA (THAILAND) CO., LTD.、THREE FOREST (THAILAND) CO., LTD.）は当社グループの会社であるため結ばなかった。
- relatedCompanies: 海外のエリア・フランチャイズ先（CENTRAL RESTAURANTS GROUP CO., LTD.、全家便利商店股份有限公司、CRG International Food Co., Ltd.など）は日本の掲載済みエントリーに存在しないため結ばなかった。エリア・フランチャイズ契約の事実はhistoryに記録したものがある。
- terms: 助言: 用語「イートイン」は、お客様に来店いただき店舗内で商品を食べていただく販売形態を指す言葉として【事業の内容】の注記に説明がある。
- terms: 助言: 用語「テイクアウト」は、お客様に商品を持ち帰っていただいて食べていただく販売形態を指す言葉として【事業の内容】の注記に説明がある。
- terms: 助言: 用語「中食」は、外食と家庭での食事の中間にあたる、弁当や惣菜を持ち帰って食べる形態を指す一般的な言葉で、中期経営計画の施策に「中食事業の強化」と印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
