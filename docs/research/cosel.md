# コーセル — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | コーセル株式会社 |
| 証券コード | 6905 |
| docID（データを取り出した文書） | `S100YUI9` |
| 原本 docID | `S100YUI9` |
| 提出日（原本） | 2026-08-10 |
| 決算期 | 2026-05-20 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YUI9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | コーセル株式会社 / 6905 / docID S100YUI9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cosel: 10 件の数値を有報XBRLと照合
有報: コーセル株式会社 有価証券報告書－第57期(2025/05/21－2026/05/20) (docID S100YUI9)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-05-20","previousFiling":28077053000,"latestFiling":28077000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-05-20","previousFiling":35266958000,"latestFiling":35266000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-05-20","previousFiling":41437250000,"latestFiling":41437000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-05-20","previousFiling":27052756000,"latestFiling":27052000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-05-20","previousFiling":1895493000,"latestFiling":1895000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-05-20","previousFiling":3162673000,"latestFiling":3162000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-05-20","previousFiling":5169523000,"latestFiling":5169000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-05-20","previousFiling":-113661000,"latestFiling":-113000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-05-20","previousFiling":2982490000,"latestFiling":2982000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-05-20","previousFiling":5273974000,"latestFiling":5273000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-05-20","previousFiling":7850014000,"latestFiling":7850000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-05-20","previousFiling":740912000,"latestFiling":740000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-05-20","previousFiling":45722449000,"latestFiling":45722000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-05-20","previousFiling":48667755000,"latestFiling":48667000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-05-20","previousFiling":54397081000,"latestFiling":54397000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-05-20","previousFiling":59998116000,"latestFiling":59998000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-05-20","previousFiling":40939762000,"latestFiling":40939000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-05-20","previousFiling":42313382000,"latestFiling":42313000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-05-20","previousFiling":47257410000,"latestFiling":47257000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-05-20","previousFiling":55836089000,"latestFiling":55836000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
cosel: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は有報の百万円印字のとおりとした。主要な経営指標等の表示単位は第57期から千円から百万円に変更され、過年度分も百万円表示に組み替えられている。前期有報との指標の差異はいずれもこの単位変更に伴う端数であり、実質的な修正ではない。
- businessModel: 受注高27,841百万円（前年同期比59.8％増）と受注残高は、受注高の金額を本文に書かない規則のため落とした。
- businessModel: MD&Aに印字されたセグメント利益・損失の金額、営業損失、経常利益、関係会社整理損の金額は、本文の財務数値は売上高と当期純利益（純損失）だけとする規則により書いていない。第11次中期経営計画の数値目標（2028年度の連結売上高400億円、営業利益率8.5％以上、ＲＯＥ5.2％以上、ＤＯＥ4.5％以上を下限とする累進配当方針）も投資指標・利益率を含むため本文には書いていない。
- businessModel: financialNotesは経営指標等の注記（法人税等に関する会計基準の第56期期首適用と第55期指標への遡及適用）のみ。株式分割・株式併合の注記はなく、重要な後発事象も「該当事項はありません」と印字されている。
- businessStructure: セグメントの外部顧客への売上高の合計（14,000＋6,408＋2,740＋1,896＋0）は連結売上高25,046百万円と一致する。製品区分の外部顧客への売上高の合計（12,705＋5,801＋5,254＋1,285）も25,046百万円と一致する。
- businessStructure: 中国生産事業は外部顧客への売上高が印字されておらず（「－」表示）、セグメント間の内部売上高のみのため、内部売上高の金額は書いていない。
- businessStructure: Powerbox International ABは決算日現在は連結子会社であり、期末時点の体制で記載した。株式譲渡契約（2026年５月20日締結、実行は2026年８月予定）の扱いはbusinessModelのneedsReviewに記録した。
- businessStructure: 非連結子会社１社とその他の関係会社１社は、重要性が乏しいため有報の関係会社の状況に名称が記載されていない。
- history: 沿革のうち、営業所・工場の細かな設置や一部子会社の設立・清算（トランサーブ株式会社の設立と清算、大洋電子工業株式会社の吸収合併、上海科素商貿有限公司の完全子会社化など）は割愛し、事業の転機となる出来事を選んだ。
- history: 沿革行には資本金の金額を書かない規則のため、設立時や増資時の資本金は記載していない。
- industry: 当社は直流安定化電源（スイッチング電源）の設計開発・生産・販売を主たる事業とする専門メーカーであり、主たる業界はelectronics（電子部品・電子機器）で直接合うため、暫定値やtaxonomy gapはない。
- industry: 半導体製造装置は製品の用途先（顧客市場）であり、当社自身が半導体やその製造装置を手がける事業ではないため、semiconductorsは付けていない。
- relatedCompanies: lite-on（LITE-ON TECHNOLOGY CORPORATION）：2024年４月30日に資本業務提携契約を締結し、共同調達・共同開発・販売連携を推進している。2024年７月に第三者割当増資や自己株式の処分等により当社の筆頭株主となり、2026年５月20日現在の所有割合は19.99％で、取締役候補者１名の指名権と独立社外取締役候補者１名の推薦権を持つ。共同開発ブランド「COSELSYNC.」製品の展開やLITE-ON製品の販売も行われており業務提携等の関係は明確だが、同社は関連候補（related-candidates）に含まれずEDINETコードリストで確認できないため、結ばず事実をここに記録する。
- relatedCompanies: ryoyo-ryosan-holdings（リョーサン菱洋ホールディングス、142,560株）：特定投資株式の保有目的は全銘柄共通の定型句「取引先と強固かつ長期的な信頼関係を構築することで、事業基盤の強化・企業価値向上を図るため」のみ。個別化された主要顧客の開示（2026年５月期の売上高4,239百万円、割合16.9％）は、2026年４月１日に株式会社リョーサンから商号変更したリョーサン菱洋株式会社に対するもので、上場持株会社である同社とは別の法人であるため結ばない。
- relatedCompanies: hioki-e-e（日置電機、68,600株）：保有目的は全銘柄共通の定型句のみのため結ばない。
- relatedCompanies: hokuhoku-financial-group（ほくほくフィナンシャルグループ、112,800株）：保有目的は金融機関向けの共通句「取引先金融機関との円滑かつ緊密な信頼関係を維持し、事業基盤の安定化を図るため」のみのため結ばない。
- relatedCompanies: hokuriku-electric-industry（北陸電気工業、112,600株）：保有目的は全銘柄共通の定型句のみのため結ばない。
- relatedCompanies: daiwa-securities-group（大和証券グループ本社、45,703株）：保有目的は金融機関向けの共通句のみのため結ばない。
- relatedCompanies: nachi-fujikoshi（不二越、9,158株）：保有目的は全銘柄共通の定型句のみのため結ばない。株式数の増加は持株会の積立によるもの。
- relatedCompanies: asahi-printing（朝日印刷、55,440株）：保有目的は「地元株式上場企業を応援し、地域経済の発展に貢献するため」であり、個別の取引関係の記載がないため結ばない。
- relatedCompanies: the-bank-of-toyama（富山銀行、9,300株）：保有目的は金融機関向けの共通句のみのため結ばない。
- relatedCompanies: noritsu-koki（ノーリツ鋼機、3,000株）：保有目的は全銘柄共通の定型句のみのため結ばない。株式数の増加は同社の株式分割によるもので、当社の分割ではない。
- relatedCompanies: aeria（アエリア、400株）：保有目的は全銘柄共通の定型句のみのため結ばない。
- relatedCompanies: kyoei-sangyo（協栄産業）：当事業年度中に保有全株式を売却しており、EDINETコードリストにもないため結ばない。
- relatedCompanies: trust：日本マスタートラスト信託銀行（信託口）は信託口であり、事業上の取引関係ではないため結ばない。
- terms: 用語の助言のみの工程。「直流安定化電源」は交流を直流に変換して安定した電圧を供給する電源装置で、当社の主力製品。「ユニット電源」は筐体に収めた標準電源、「オンボード電源」は機器の基板に搭載する電源、「ノイズフィルタ」は電気的ノイズを除去する部品を指す。「ＰＲＢＸ製品」は連結子会社Powerbox International ABの製品区分。「COSELSYNC.」はLITE-ON TECHNOLOGY CORPORATIONとの共同開発ブランド。

## 要確認（status に反映）

- businessModel: 当社は、決算日である2026年５月20日開催の取締役会で、連結子会社Powerbox International ABの全株式を、HYPAX GmbHが間接的に出資する特別目的会社Voltaris GmbHへ譲渡することを決議し、同日付で株式譲渡契約を締結しました。株式譲渡の実行は2026年８月（予定）とされており、決算日現在では同社は連結子会社（ヨーロッパ生産販売事業）であるため、期末時点の体制で登録しています。譲渡実行後はヨーロッパ生産販売事業の構成が変わるため、実行の確定時に確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
