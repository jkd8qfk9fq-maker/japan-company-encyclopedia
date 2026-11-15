# 京阪神ビルディング — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 京阪神ビルディング株式会社 |
| 証券コード | 8818 |
| docID（データを取り出した文書） | `S100YC9O` |
| 原本 docID | `S100YC9O` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC9O.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 京阪神ビルディング株式会社 / 8818 / docID S100YC9O（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
keihanshin-building: 10 件の数値を有報XBRLと照合
有報: 京阪神ビルディング株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YC9O)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":17815768000,"latestFiling":17815000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":18879148000,"latestFiling":18879000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":19310701000,"latestFiling":19310000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":19584874000,"latestFiling":19584000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":5165205000,"latestFiling":5165000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":4186440000,"latestFiling":4186000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":3793846000,"latestFiling":3793000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":4388480000,"latestFiling":4388000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":4879128000,"latestFiling":4879000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":5040973000,"latestFiling":5040000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":4842213000,"latestFiling":4842000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":4829682000,"latestFiling":4829000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":149994569000,"latestFiling":149994000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":152321306000,"latestFiling":152321000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":166616097000,"latestFiling":166616000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":177104397000,"latestFiling":177104000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":70510473000,"latestFiling":70510000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":70870934000,"latestFiling":70870000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":74874569000,"latestFiling":74874000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":76323011000,"latestFiling":76323000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
keihanshin-building: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益、およびMD&Aのアセットタイプ別売上高（百万円の印字どおり）だけに限った。営業利益・経常利益・投資事業組合運用益等の金額は書かなかった。
- businessModel: 当社グループは土地建物賃貸事業の単一セグメントであり、セグメント情報の記載は省略されている。アセットタイプ別の金額はMD&Aの印字（オフィスビル4,661百万円、データセンタービル11,012百万円、ウインズビル3,351百万円、商業施設・物流倉庫等1,229百万円）を用いた。４区分の合計20,253百万円と連結売上高20,255百万円との２百万円の差は有報の印字のままとし、警告に記録する。
- businessModel: 経営指標等の注記（第103期より金額の表示単位を千円単位から百万円単位に変更し、第99期から第102期も百万円単位で表示）の変更は表示単位だけの変更であり、前期有報との数値差異（全系列で100万円未満）はこの単位変更によるものであるため、financialNotes にはせず、ここに記録する。
- businessModel: 沿革に印字された2026年６月の「浦安千鳥物流センター」購入・賃貸は決算日後の通常の物件取得であり、体制の変更ではないため needsReview にはせず、ここに記録する。
- businessModel: 保有株式のうち美津濃と丸一鋼管の株式数増加は、両社自身の株式分割によるものであり、当社の株式分割ではない（当社自身の分割は後発事象として needsReview に記録した）。
- businessModel: 長期経営計画の数値目標（事業利益・償却前事業利益・ROA・ROE・配当性向等）は投資指標・利益率に関わるため本文や strategy には書かず、ここに記録するにとどめる。
- businessModel: suppliers は本ツリーのスキーマにキーがないため businessModel には書かず、建築・設備面の取引先は relatedCompanies に記録した。自己株式の取得の事実と金額は本文に書かなかった。
- businessStructure: 連結子会社は Keihanshin Building America Co., Ltd.（米国デラウェア州、不動産への投資・保有・売買、議決権100％、特定子会社）と京阪神建築サービス株式会社（ビル管理、議決権100％、2024年３月末をもって事業を停止し休眠中）の２社である。休眠化は既に体制に反映されているため needsReview にはしていない。
- businessStructure: 持分法適用関連会社は３社で、開示されているのは 13100 NOEL ROAD JV LLC（米国デラウェア州、不動産投資、議決権の所有割合47.06％）のみであり、他の２社は重要性が乏しいため有報で記載が省略されている。
- businessStructure: アセットタイプ別の金額はMD&Aの印字を用いた（単一セグメントのためセグメント情報の記載は省略されている）。４区分の合計と連結売上高との２百万円の差は有報の印字のままとした。
- businessStructure: 沿革に印字された2026年６月の浦安千鳥物流センターの購入・賃貸は決算日後の通常の物件取得であり、体制の変更ではないため needsReview にはせず、ここに記録する。
- history: 設立時の資本金の金額は、沿革に印字があるものの、資本金額を本文に書かない規則のため記載していない。
- history: 沿革の個別のビル竣工・購入・リニューアルの各行（安土町ビル、新町第１ビル、新江坂ビル、枚方倉庫、四条河原町ビル、長野商業施設、豊崎ビル、中津ビル、淀屋橋ビル、新町第２ビル、北堀江ビル、御堂筋ビル、御成門ビル、西心斎橋ビル、府中ビル、代々木公園ビル、川越配送センター、藤沢商業施設、虎ノ門ビル、OBPビル、南青山土地、関目高殿住宅等）は、主要な転換点に絞るため落とし、ここに記録する。
- history: 1949年の大阪証券取引所上場、1976年の子会社京阪神建物管理株式会社（現・京阪神建築サービス株式会社）の設立、1988年の子会社コンピュータビルサービス株式会社の設立、2008年の京阪神建築サービスによる京阪神ビルサービスの吸収合併、2013年の大阪証券取引所市場第一部への上場廃止、2022年のプライム市場への移行、2024年３月の京阪神建築サービスの休眠化は、ここに記録するにとどめた。
- history: 沿革末尾の2026年６月の浦安千鳥物流センター購入は決算日後の出来事のため沿革の行には入れず、警告に記録するにとどめた。
- industry: 主たる業界は real-estate（不動産）とした。同社は土地建物賃貸事業の単一セグメントで、オフィスビル・データセンタービル・ウインズビル・商業施設等の営業用建物の賃貸が売上の全てを占めるため、閉じた分類の中で合う real-estate を選んだ。合う値があるため taxonomyGaps は記録していない。
- relatedCompanies: 金融グループ各社は、特定投資株式の保有目的が主要取引銀行との資金調達関係やグループ会社のテナント入居など個別の取引実態を伴って印字されているため、業務提携等の関係として結んだ（tokyo-theatres の三井住友フィナンシャルグループ等の先例に従った）。
- relatedCompanies: kubota（株式会社クボタ）、rengo（レンゴー株式会社）、nichiha（ニチハ株式会社）、torishima-pump-mfg（株式会社酉島製作所）、mizuno（美津濃株式会社）: 特定投資株式の保有目的が定型文のみで、個別の取引実態の印字がないため結ばなかった。なお美津濃の株式数増加は同社自身の株式分割によるものである。
- relatedCompanies: look-holdings（株式会社ルックホールディングス）: テナントとして入居しているのは子会社の株式会社ルックであり、同社自身との取引の印字がないため結ばなかった。
- relatedCompanies: dai-dan（ダイダン株式会社）: 当事業年度に全株を売却し、期末時点の保有株式数はゼロのため結ばなかった。
- relatedCompanies: 大株主の銀泉株式会社（13.50％）は非上場で候補にないため結ばなかった。株式会社三井住友銀行（4.47％）と株式会社三十三銀行（2.70％）は大株主であるが、それぞれ三井住友フィナンシャルグループと三十三フィナンシャルグループの子会社であり、候補にはないため結ばず、各グループの行に事実を記録した。
- relatedCompanies: 日本中央競馬会は最大のテナントの一つ（売上高の16.4％）であるが上場会社ではないため結ばず、本文に事実を記録した。エクイニクス・ジャパン株式会社（同17.9％）も非上場のため結ばなかった。
- relatedCompanies: step（株式会社ステップ）、en（エン株式会社）、base-4481（ベース株式会社）、port（ポート株式会社）、seki（セキ株式会社）、zero（株式会社ゼロ）、lec（レック株式会社）、corona（株式会社コロナ）、innovation（株式会社イノベーション）、land（株式会社ランド）は一般語・部分一致のみのため結ばなかった。nissin（日新）はコードリストにないため結ばなかった。
- relatedCompanies: 株式会社ストラテジックキャピタルは2025年12月の臨時報告書（主要株主の異動）で新たな主要株主となった旨が印字されているが、大株主の状況の上位10先には含まれておらず、候補にもないため結ばなかった。
- terms: 助言: 用語「ウインズビル」は、日本中央競馬会（JRA）が主催するレースの投票券を場外で発売する施設（ウインズ）の入るビルで、同社は京都・大阪・神戸の都心部に５棟を保有し、日本中央競馬会に固定賃料で賃貸しています。
- terms: 助言: 用語「データセンタービル」は、サーバー等の情報通信機器を設置・運用するための専用ビルで、同社は大阪都心部に８棟を保有し、免震構造、大型非常用発電機、先進のセキュリティシステムによる高い信頼性をうたっています。
- terms: 助言: 用語「資産回転型事業」は、保有物件を売却して得た資金を新たな収益物件の取得に再投資する事業の進め方で、同社は長期経営計画でストック事業と並ぶフロー事業として位置付けています。
- terms: 助言: 用語「エクイティ投資」は、不動産そのものではなく不動産開発事業やファンド等への出資の形で行う投資で、同社は米国現地法人を通じた賃貸集合住宅や物流倉庫の開発事業への出資等を行っています。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、2026年５月13日開催の取締役会において、2026年６月30日を基準日として2026年７月１日付で普通株式１株につき２株の割合で株式分割を行うことを決議した旨が注記されています。本登録は2026年３月31日現在の体制に基づいています。
- businessStructure: 重要な後発事象として、2026年５月13日開催の取締役会において、2026年６月30日を基準日として2026年７月１日付で普通株式１株につき２株の割合で株式分割を行うことを決議した旨が注記されています。本登録は2026年３月31日現在の体制に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
