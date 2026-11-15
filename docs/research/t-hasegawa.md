# 長谷川香料 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 長谷川香料株式会社 |
| 証券コード | 4958 |
| docID（データを取り出した文書） | `S100XAHE` |
| 原本 docID | `S100XAHE` |
| 提出日（原本） | 2025-12-16 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XAHE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 長谷川香料株式会社 / 4958 / docID S100XAHE（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
t-hasegawa: 10 件の数値を有報XBRLと照合
有報: 長谷川香料株式会社 有価証券報告書－第64期(2024/10/01－2025/09/30) (docID S100XAHE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
t-hasegawa: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益は経営指標等およびMD&Aの印字（百万円）どおりに記載した。セグメント別の金額はセグメント注記の外部顧客への売上高を用い、内部売上高を含むMD&Aのセグメント別数値は使っていない。
- businessModel: 2024年9月に買収したABELEI, INC.に係る企業結合の暫定的な会計処理が当連結会計年度に確定し、前連結会計年度のセグメント情報等は取得原価の当初配分額の見直しが反映された後の金額で表示されている。ただし5年間の主要な経営指標等は前期有報と全行一致したため、financialNotesには記載しなかった。
- businessModel: 連結会社間における子会社株式等の売却に伴う税務上の繰延べの取扱いの見直しに関する会計方針の変更は、当連結会計年度の期首から遡及適用されたが、有報に前連結会計年度の連結財務諸表に与える影響はない旨が明記され、経営指標も前期有報と一致したため、financialNotesには記載しなかった。
- businessModel: 譲渡制限付株式報酬制度の導入（2025年11月7日の取締役会決議、2025年12月18日開催予定の定時株主総会への付議を決議）は役員報酬制度の見直しであり、資本政策に関する事項としてneedsReviewには入れなかった。
- businessModel: 【関係会社の状況】に載る米国子会社・上海子会社の個別の業績数値は単体のものであるため、本文の金額には用いなかった。
- businessModel: 中期3ヵ年経営計画の目標のうち利益率に関するものは将来の目標値であり、本文には書かず、定性的な要約と売上高伸長率の目標のみを記載した。
- businessModel: wikipedia.jsonは取得できたが、市場シェアなど有報に無い情報を含むため、出典には加えなかった。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2025年9月期：日本39,783百万円、アジア17,826百万円、米国15,885百万円）の大きい順とした。3セグメントの合計は連結売上高73,495百万円と一致する。MD&Aのセグメント別売上高は内部売上高を含む数値のため並び順には使わなかった。
- businessStructure: 上海長谷川香精貿易有限公司は【事業の内容】の事業系統図に載るが、【関係会社の状況】の連結子会社一覧には載っていないため、説明では連結子会社と断定しなかった。
- businessStructure: ベトナムのHoàng Anh Flavors and Food Ingredients Joint Stock Companyは2025年11月10日の株式取得で連結子会社となった期後の会社であり、2025年9月30日現在の構成には含めていない（businessModel の needsReview に記録）。
- history: 設立時・合併時の資本金の金額は【沿革】に印字されているが、資本金の金額は本文に書かない方針のため記載しなかった（1948年の法人化、1961年の設立、1991年の長谷藤株式会社との合併）。
- history: 次の行は軽微な拠点・組織の変更として省略した：1984年板倉工場の新設、1989年米国子会社のセリトス市への移転、1991年長谷藤株式会社の合併、1993年川崎研究所の技術研究所への改称、1997年上海駐在員事務所の開設、2001年長谷川ファインフーズ工場の本稼働、2003年留学生奨学財団の設立、2004年タイ販売子会社の活動開始、2009年蘇州工場の本稼働、2011年長谷川ビジネスサービス株式会社の設立、2014年インドネシア販売子会社の設立、2017年台北販売拠点の設立。
- history: 2025年のHoàng Anh社の株式取得は決算日後の重要な後発事象であり、businessModel の needsReview にも記録した。登録の構成は2025年9月30日現在に基づく。
- industry: 香料（フレーバー・フレグランス）の製造・販売が事業の中心で、東京証券取引所の業種区分は化学であるため、主たる業界を「chemicals」とした。掲載済みの同業である高砂香料工業（takasago-international）も chemicals とされている。フルーツ加工品・天然色素などの食品素材も香料事業の一部であるため、第二の業界は付けなかった。
- relatedCompanies: 株式会社マンダムは特定投資株式として344,458株を保有し、保有目的は製品等販売の取引関係の維持・強化と印字されているが、related-candidates.jsonで「コードリストにない」とされており、EDINETのコードリストで確認できないため関連企業として結ばなかった。
- relatedCompanies: PT Mandom Indonesia Tbk（720,000株）とInternational Flavors & Fragrances Inc.（2,000株）は特定投資株式に載る海外上場会社で、候補（related-candidates.json）に無いため結ばなかった。
- relatedCompanies: 株式会社カーメイトは当事業年度中に保有株式の全数を売却したため結ばなかった。
- relatedCompanies: リコー（候補）の一致は「リコール」という語への部分一致であり、取引・提携の記載が無いため結ばなかった。innovation、en、career、base-4481、seki、nac、suzuki-6785、trust の各候補は一般語・部分一致または信託口の表記であり、取引・提携の根拠が無いため結ばなかった。nissin（候補）は日新株式会社であり、日清食品ホールディングス・日清オイリオグループとは別法人のため結ばなかった。
- relatedCompanies: 当社グループの子会社12社及び関連会社1社は自社グループの会社のため関連企業には含めていない。

## 要確認（status に反映）

- businessModel: 重要な後発事象：ベトナムでフレーバーや食品素材の製造・販売を行うHoàng Anh Flavors and Food Ingredients Joint Stock Companyの全株式を2025年11月10日に取得し、連結子会社とした。みなし取得日は2025年12月31日（予定）とされている。登録は2025年9月30日現在の構成に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
