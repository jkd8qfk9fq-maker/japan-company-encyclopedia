# エンバイオ・ホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エンバイオ・ホールディングス |
| 証券コード | 6092 |
| docID（データを取り出した文書） | `S100YKUO` |
| 原本 docID | `S100YKUO` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKUO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エンバイオ・ホールディングス / 6092 / docID S100YKUO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
enbio-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社エンバイオ・ホールディングス 有価証券報告書－第27期(2025/04/01－2026/03/31) (docID S100YKUO)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":8987865000,"latestFiling":8987000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":8120309000,"latestFiling":8120000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":9575536000,"latestFiling":9575000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":10668079000,"latestFiling":10668000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":654055000,"latestFiling":654000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":812059000,"latestFiling":812000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":708764000,"latestFiling":708000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":452689000,"latestFiling":452000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":1197971000,"latestFiling":1197000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":1343329000,"latestFiling":1343000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":1067641000,"latestFiling":1067000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":702116000,"latestFiling":702000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":16370283000,"latestFiling":16370000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":17349955000,"latestFiling":17349000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":19310518000,"latestFiling":19310000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":21195108000,"latestFiling":21195000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":5973994000,"latestFiling":5973000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":6857241000,"latestFiling":6857000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":8591611000,"latestFiling":8591000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":9230526000,"latestFiling":9230000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
enbio-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aの利益の金額や増減理由は本文に書かなかった。本文の財務数値は売上高と親会社株主に帰属する当期純利益だけである。トルコのバイオマスガス化発電事業からの撤退に伴う損失が利益減少の要因として印字されているが、禁止語を含むため本文には書かなかった。
- businessModel: 経営指標等の推移の注記は、潜在株式が存在しないため希薄化後１株当たり当期純利益金額を記載していない旨の表示事項のみであり、financialNotes に入れる事項はない。
- businessModel: 前項の比較では、前連結会計年度の有報タグ（千円精度）と当連結会計年度の有報タグ（百万円精度）の丸めの差異のみで、訂正や組替えの印字はない。表示の丸めの差異は financialNotes に入れなかった。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。
- businessModel: 中期経営計画2030の数値目標は本文に書かなかった。
- businessModel: Wikipediaの冒頭は本社所在地と土壌汚染対策事業の内容であり、有報で確認できる内容のため、補足として使わなかった。
- businessStructure: このツリーの旧スキーマに従い suppliers は付けなかった。土壌汚染対策事業では、連結子会社のエンバイオ・エンジニアリングがKEJR,INC.（米国）のGeoprobe Systems関連商品とREGENESIS Bioremediation Products,Inc.（米国）の浄化用薬剤について、日本における独占販売権等を受けている旨が【重要な契約等】に印字されている。
- businessStructure: 設備の状況では、提出会社の本社行のセグメント区分は「－」であり特定の事業に結ばなかった。連結子会社の設備行は印字されたセグメント区分に従って各事業に結んだ。設備の帳簿価額は書かなかった。
- businessStructure: 株式会社エンバイオ・エシカル・プロダクツは【関係会社の状況】に自然エネルギー事業の連結子会社（議決権100％）として印字されているが、【事業の内容】のセグメント別会社表には記載されていない。
- businessStructure: セグメント利益は書かなかった。セグメント売上高はセグメント情報の外部顧客に対する売上高であり、３事業の合計は連結売上高と一致する。
- history: 沿革表は日付セル31件と出来事テキスト31件で件数が一致したため、行順の対応で読み取った。
- history: 沿革のうち次の行は登録しなかった：2005年の本店移転、2006年の株式会社ランドコンシェルジュ設立、2010年の株式会社ビーエフマネジメント設立（現エンバイオ・リアルエステート）、2016年のアルタイル・ソーラー設立とYAMAテック・ソーラー年金の連結子会社化、2016年から2017年の太陽光パーク２の連結子会社化、2017年の株式会社土地再生不動産投資設立（現土地再生投資）と恩拜欧（南京）環保科技有限公司設立、2017年の太陽光パーク２・YAMAテック・ソーラー年金の完全子会社化、2018年のヴェガ・ソーラーとアルタイル・ソーラーの完全子会社化、2019年のEnbio Middle East FZE LLCとEnbio Lel Taqa FZC LLCの設立、2022年のMaF合同会社の子会社化、2023年のエンバイオＣ・エナジーの完全子会社化、2024年のDEFNE ENERGYの子会社化とエンバイオＣ・ウェストの設立。
- history: 資本金の金額は沿革に書かなかった。
- industry: 主たる業界は construction（暫定）とした。最大の報告セグメントである土壌汚染対策事業（売上高の54.7％）は土壌汚染の調査と浄化工事の設計・施工を行う事業だが、閉じた分類に土壌汚染対策を表す区分がないため、工事の設計・施工として最も近い construction を暫定とした。
- industry: ブラウンフィールド活用事業（土壌汚染地の買取再販・賃貸、売上高3,248百万円）と自然エネルギー事業（太陽光発電による売電、売上高2,468百万円）は独立した報告セグメントとして開示されているため、それぞれ real-estate と energy を副次に付けた。
- relatedCompanies: tohoku-electric-power: 【重要な契約等】に電力受給契約の相手先として印字され、売電の向きが印字されているため customer として結んだ。
- relatedCompanies: hokuriku-electric-power: 【重要な契約等】に連結子会社の発電所の電力受給契約の相手先として印字されているため customer として結んだ。
- relatedCompanies: the-chugoku-electric-power: 【重要な契約等】に連結子会社の発電所の電力受給契約の相手先として印字されているため customer として結んだ。
- relatedCompanies: cre: 【関係会社の状況】にその他の関係会社として印字され、議決権の被所有割合は34.3％（【大株主の状況】では発行済株式に対する割合34.25％）、【重要な契約等】に資本業務提携契約も印字されている当社の主要株主であるが、現行のEDINETコードリストで株式会社シーアールイー（E31441）は非上場で証券コードがないため結ばない。
- relatedCompanies: koken-boring-machine: 資本業務提携の相手であったが、当連結会計年度に当社が保有する鉱研工業株式会社の全株式をヒューリック株式会社の公開買付けに応募して売却し、提携契約は終了した。保有株式はゼロであり、候補の上場区分もコードリストにないため結ばない。
- relatedCompanies: hulic: 鉱研工業株式会社への公開買付けの実施者として印字されるのみで、当社との取引や提携の印字はないため結ばない。
- relatedCompanies: eneos-holdings: 個別財務諸表の特定投資株式として印字されるが、保有目的は「取引関係の維持・強化のため」という定型句であり、具体的な取引の印字はないため結ばない。
- relatedCompanies: chubu-electric-power: 電力受給契約の相手先は子会社の中部電力ミライズ株式会社であり、中部電力株式会社ではないため結ばない。
- relatedCompanies: the-kansai-electric-power: 電力受給契約の相手先は子会社の関西電力送配電株式会社であり、関西電力株式会社ではないため結ばない。
- relatedCompanies: grid: 電力受給契約の相手先は東京電力パワーグリッド株式会社であり、株式会社グリッドではないため結ばない。
- relatedCompanies: 九州電力株式会社、北海道電力株式会社: 電力受給契約の相手先として印字されているが、related-candidates.json にないため結ばない。
- relatedCompanies: 東京電力パワーグリッド株式会社、東京電力エナジーパートナー株式会社、東北電力ネットワーク株式会社、中部電力ミライズ株式会社、関西電力送配電株式会社、北海道電力ネットワーク株式会社: 電力受給契約の相手先として印字されているが、いずれも電力会社の子会社であり related-candidates.json にないため結ばない。
- relatedCompanies: KEJR,INC.、REGENESIS Bioremediation Products,Inc.: 連結子会社が独占販売権を受ける契約の相手先として印字されているが、海外企業で related-candidates.json にないため結ばない。
- relatedCompanies: en: 「エンバイオ・エンジニアリング」等の部分一致であり、株式会社エンへの言及ではない（ambiguous）。結ばない。
- relatedCompanies: career: 人材に関する記述の「キャリア」の一般語の部分一致のみ。結ばない。
- relatedCompanies: s-t: 「エンバイオ・リアルエステート」の部分一致のみ。結ばない。
- relatedCompanies: path: 経営方針の「パーパス」の部分一致のみ（ambiguous）。結ばない。
- relatedCompanies: base-4481: 「連結ベース」の一般語の部分一致のみ。結ばない。
- relatedCompanies: vision: 経営方針の「ビジョン」の一般語の部分一致のみ。結ばない。
- relatedCompanies: yamachuu: 役員の氏名の部分一致のみ（ambiguous）。結ばない。
- relatedCompanies: freee: 「フリー・キャッシュ・フロー」の一般語の部分一致のみ。結ばない。
- relatedCompanies: zero: 安全目標の「休業災害ゼロ」の一般語の部分一致のみ（ambiguous）。結ばない。
- relatedCompanies: innovation: 経営方針の「イノベーション」の一般語の部分一致のみ。結ばない。
- relatedCompanies: port: 「ポートフォリオ」の部分一致のみ。結ばない。
- relatedCompanies: land: 旧子会社名「ランドコンシェルジュ」の部分一致のみで、株式会社ランドへの言及はない。結ばない。
- relatedCompanies: seki: 「情報セキュリティ」の部分一致のみ（ambiguous）。結ばない。
- relatedCompanies: daiwa: 大和証券株式会社は大株主だが証券会社の純投資であり（ambiguous）、結ばない。
- relatedCompanies: 株式会社ジーエヌピー: 代表取締役社長とその親族が株式を保有する資産管理会社で大株主の注記に印字されているが、related-candidates.json にないため結ばない。
- relatedCompanies: 連結子会社16社と持分法適用関連会社は自社グループの会社のため結ばない。
- terms: 助言のみ。用語の追加提案：ブラウンフィールド（土壌汚染の存在、又はその懸念により、本来の不動産価値よりも著しく低い価格でしか取引されない土地。有報の用語解説に基づく）、原位置浄化（土壌を掘削せずに原位置のままで浄化する方法）、ダイレクトセンシング（センサーを備えたプローブを地中に貫入させて汚染物質を直接検知する方法）、プルームストップ工法（特殊な活性炭を地中に注入して汚染物質を吸着し、地下水汚染の拡散を防ぐ工法）、コストキャップ保証（対策費用の上限を保証する仕組み）、オフサイトPPA（需要地から離れた場所の発電設備から送配電網を介して電力を供給する契約形態）。本文中の事業説明に基づく。

## 要確認（status に反映）

- businessModel: [object Object]

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] エンバイオ・ホールディングスの主たる業界（土壌汚染対策事業） → 提案: 土壌汚染対策（土壌調査・浄化工事）。売上高の54.7％を占める土壌汚染対策事業は、土壌汚染の調査と浄化工事の設計・施工を行う事業ですが、閉じた分類に土壌汚染対策を表す区分がなく、工事の設計・施工として最も近い construction を暫定としました。
