# アイビーシー — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アイビーシー株式会社 |
| 証券コード | 3920 |
| docID（データを取り出した文書） | `S100XBM8` |
| 原本 docID | `S100XBM8` |
| 提出日（原本） | 2025-12-19 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBM8.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%A4%E3%83%93%E3%83%BC%E3%82%B7%E3%83%BC

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アイビーシー株式会社 / 3920 / docID S100XBM8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 4 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
internetworking-and-broadband-consulting: 10 件の数値を有報XBRLと照合
有報: アイビーシー株式会社 有価証券報告書－第23期(2024/10/01－2025/09/30) (docID S100XBM8)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-09-30","previousFiling":2013300000,"latestFiling":1886111000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-09-30","previousFiling":1501125000,"latestFiling":1387388000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-09-30","previousFiling":1900885000,"latestFiling":1750808000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-09-30","previousFiling":2184658000,"latestFiling":2091026000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-09-30","previousFiling":273928000,"latestFiling":279969000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-09-30","previousFiling":-22606000,"latestFiling":-45347000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-09-30","previousFiling":234145000,"latestFiling":195605000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-09-30","previousFiling":411412000,"latestFiling":395458000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-09-30","previousFiling":3260054000,"latestFiling":3194636000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-09-30","previousFiling":3255762000,"latestFiling":3186739000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":3264088000,"latestFiling":3143574000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":3329495000,"latestFiling":3240080000},{"key":"NetAssetsSummaryOfBusinessResults|2021-09-30","previousFiling":1751150000,"latestFiling":1738146000},{"key":"NetAssetsSummaryOfBusinessResults|2022-09-30","previousFiling":1830815000,"latestFiling":1796107000},{"key":"NetAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":1827194000,"latestFiling":1762084000},{"key":"NetAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":1991786000,"latestFiling":1905273000},{"key":"NumberOfEmployees|2021-09-30","previousFiling":89,"latestFiling":72},{"key":"NumberOfEmployees|2022-09-30","previousFiling":87,"latestFiling":74},{"key":"NumberOfEmployees|2023-09-30","previousFiling":86,"latestFiling":77},{"key":"NumberOfEmployees|2024-09-30","previousFiling":81,"latestFiling":80}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
internetworking-and-broadband-consulting: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示照合で全系列に差異が出た点について: 前期（第22期）の有報の主要な経営指標等は連結の数値だったのに対し、当期の5年表は提出会社単体の数値のみで表示されているためであり、訂正による再表示ではない。主要な経営指標等の注記5に『第22期までは連結財務諸表を作成しております』と印字され、沿革にも2024年8月の株式会社サンデーアーツの事業譲渡と2024年10月のシンガポール子会社の清算が印字されている。連結から単体への表示の変更として financialNote（2025年9月期）に記録した。
- businessModel: financialNote にしていない注記: 注１・注２（潜在株式調整後１株当たり当期純利益の表示）、注３（配当政策により第19期は無配・第20期から復配）、注４（注記対象の関連会社がない年度の持分法投資利益の非表示）、注６（従業員数の数え方）、注８（期末配当は2025年12月19日開催予定の定時株主総会の決議による）は、いずれも表示・手続の事項であり会計基準の変更ではないため warnings にとどめた。
- businessModel: 2026年9月期の業績予想の数値は予想値であるため、本文にも perspectives にも書いていない。
- businessModel: MD&Aの段階利益の金額・増減率、キャッシュ・フローの金額、設備投資や研究開発の金額は本文に書いていない。公開買付けの買付価格（1株当たり1,490円）と買付予定数の下限は取引条件であり、本文には書かず needsReview の確認材料としてここに記録する。
- businessModel: 重要な後発事象は『該当事項はありません』と印字されている。提出後の公開買付けは needsReview に記録した。
- businessModel: Wikipedia の記事『アイビーシー』の冒頭（ネットワークインテグレーターである旨）は、事業の位置づけの補足として businessModel の出典に併記した。数値は使っていない。
- businessStructure: 報告セグメントは『ソフトウェア・サービス関連事業』の単一セグメントであり、セグメント情報の記載は省略されている。子区分は【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）に印字された3区分を用い、金額の大きい順に並べた。区分名は注記の印字『その他物販等』を用いた（【事業の内容】では『その他物販』と印字）。
- businessStructure: 3区分の千円額の合計は2,404,510千円となり、印字された合計2,404,511千円と1千円異なる（印字どおりに記載し、差異はここに記録した）。百万円への切り捨てでは区分合計が2,403百万円となる。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。販売チャネルとして、パートナー企業を通じた間接販売、展示会・セミナーを通じた直接販売、パートナー企業と連携するハイタッチ販売が【事業の内容】に印字されている。仕入先の相手先別内訳（買掛金）は本文に書いていない。
- businessStructure: 当社は連結財務諸表を作成しておらず、事業は当社単体が担う。持分法適用関連会社のNSD-DXテクノロジー株式会社（議決権の所有割合16.2％、2025年9月30日現在）のほか、非連結子会社1社と持分法非適用関連会社1社があるが、重要性が乏しいとして社名の記載は省略されている。
- businessStructure: 設備は本社他（東京都中央区他）のみで、単一セグメントのため事業別の記載はない。帳簿価額は書いていない。売上高はすべて国内であり、本邦以外の外部顧客への売上高はないと印字されている。
- history: 沿革の表は年月と事象が対応して印字されており、そのまま行順で対応づけた。設立時の資本金の金額は書いていない。
- history: シンガポール子会社の清算（2024年10月）は2012年の子会社化の行の括弧内に印字されており、2024年の出来事として独立の項目にも起こした。
- history: 2005年11月の本社移転、2011年7月の『System Answer G2 Datacenter Ware』以外の細目、2013年10月の本社移転、2014年6月の『System Answer RS Global Baseline』の提供開始は、主要な転機に絞るため一部を本文に取り込んで項目としては省いた。
- industry: 主たる業界は it とした。単一セグメントのソフトウェア・サービス関連事業が性能監視ソフトウェアの開発・販売とITサービスであり、直接当てはまる（暫定ではない）。
- industry: ネットワーク機器そのものの製造・販売や通信事業は行っていないため、electronics や telecommunications は付けていない。
- relatedCompanies: fujitsu（富士通株式会社）は結ばなかった。主要な顧客として印字されているのは富士通ネットワークソリューションズ株式会社（2025年9月期の売上高240,783千円、割合10.0％）であり、富士通株式会社とは別の法人であるため、代用して結ばない。
- relatedCompanies: nsd（株式会社NSD）は結ばなかった。関連会社として印字されているのはNSD-DXテクノロジー株式会社（持分法適用関連会社、議決権の所有割合16.2％）であり、株式会社NSDとは別の法人であるため、代用して結ばない。なお、関連会社そのものは関連企業の対象にもしない。
- relatedCompanies: hikari-tsushin（株式会社光通信）は結ばなかった。大株主に印字されているのは光通信ＫＫ投資事業有限責任組合（2025年9月30日現在、所有株式数の割合5.36％）という投資事業有限責任組合であり、株式会社光通信とは別の主体であるため結ばない。
- relatedCompanies: mizuho-leasing（みずほリース株式会社）は結ばなかった。売掛金の相手先別内訳に載るだけで、取引の向きを述べた記載がないため結ばない。
- relatedCompanies: toyo-construction（東洋建設株式会社）は結ばなかった。売掛金の相手先別内訳に載るだけで、取引の向きを述べた記載がなく、候補の listing も『（コードリストにない）』であるため結ばない。
- relatedCompanies: techmatrix（テクマトリックス株式会社）は結ばなかった。買掛金の相手先別内訳に載るだけで、取引の向きを述べた記載がないため結ばない。
- relatedCompanies: sunday（株式会社サンデー）は結ばなかった。有報に印字されるのは株式会社サンデーアーツであり別の法人で、しかも2024年8月に事業を譲渡済みの元子会社であるため結ばない。
- relatedCompanies: en（エン株式会社）は結ばなかった。『エン』は一般語としての出現のみで、同社を指す記載はない。
- relatedCompanies: seki（セキ株式会社）は結ばなかった。『セキ』はセキュリティ等の語の一部としての出現のみで、同社を指す記載はない。
- relatedCompanies: port（ポート株式会社）は結ばなかった。『ポート』はサポート等の語の一部としての出現のみで、同社を指す記載はない。
- relatedCompanies: software-service（株式会社ソフトウェア・サービス）は結ばなかった。『ソフトウェア・サービス関連事業』という自社の事業名の一部としての出現のみで、同社を指す記載はない。
- relatedCompanies: base-4481（ベース株式会社）は結ばなかった。『ベース』は給与のベースアップ等の一般語としての出現のみで、同社を指す記載はない。
- relatedCompanies: core（株式会社コア）は結ばなかった。『コア』は一般語としての出現のみで、同社を指す記載はない。
- relatedCompanies: vision（株式会社ビジョン）は結ばなかった。『ビジョン』は経営のビジョンを述べる一般語としての出現のみで、同社を指す記載はない。
- relatedCompanies: zero（株式会社ゼロ）は結ばなかった。『ゼロ』はミッション『IT障害をゼロにする』等の一般語としての出現のみで、同社を指す記載はない。
- relatedCompanies: fuji-8278（株式会社フジ）は結ばなかった。『フジ』を単独で指す記載はなく、主要な顧客の社名の一部としての出現のみである。
- relatedCompanies: garden（株式会社ガーデン）は結ばなかった。同社を指す記載はない。
- relatedCompanies: quick（株式会社クイック）は結ばなかった。『クイック分析サービス』という自社サービスの名称としての出現のみで、同社を指す記載はない。
- relatedCompanies: ray（株式会社レイ）は結ばなかった。『レイ』は一般語としての出現のみで、同社を指す記載はない。
- relatedCompanies: technologies（株式会社テクノロジーズ）は結ばなかった。売掛金の相手先であるエフサステクノロジーズ株式会社の社名の一部としての出現のみで、同社とは別の法人である。
- relatedCompanies: the-lead（株式会社リード）は結ばなかった。同社を指す記載はない。
- relatedCompanies: 大株主のうち事業会社はプラスフジ株式会社（割合9.00％）のみだが、候補に含まれていないため結んでいない。特定投資株式の該当事項はなく、政策保有による結びつきもない。
- terms: 助言のみ。用語候補: 性能監視、MSP（マネジメント・サービス・プロバイダー）、キャパシティ計画、マルチベンダー、統合ログ管理、電子証明

## 要確認（status に反映）

- businessModel: 提出後の2026年11月12日に、OPI・ITホールディングス株式会社による当社普通株式に対する公開買付けが開始されました（期間は2026年12月24日まで）。公開買付届出書（S100ZGI2）と意見表明報告書（S100ZGL2）がいずれも2026年11月12日に提出され、当社は公開買付けに賛同し、株主に応募を推奨しています。成立すれば完全子会社化の手続と上場廃止が見込まれますが、結果は未確定です。登録は2025年9月30日現在の構造で行っており、公開買付けの帰結には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
