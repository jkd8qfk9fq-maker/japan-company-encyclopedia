# ファンドクリエーショングループ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ファンドクリエーショングループ |
| 証券コード | 3266 |
| docID（データを取り出した文書） | `S100XMVL` |
| 原本 docID | `S100XMVL` |
| 提出日（原本） | 2026-02-25 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XMVL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ファンドクリエーショングループ / 3266 / docID S100XMVL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fund-creation-group: 10 件の数値を有報XBRLと照合
有報: 株式会社ファンドクリエーショングループ 有価証券報告書－第17期(2024/12/01－2025/11/30) (docID S100XMVL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fund-creation-group: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益だけにした。MD&Aやセグメント注記に印字された段階利益の金額や増減率、受託資産残高の金額は書いていない（戦略では残高の積み上げを経営指標とする方針だけを定性的に要約した）。
- businessModel: 売上高の増減率はMD&Aの印字（前期比3.1％増）を使った。
- businessModel: 指標等の注記5の遡及適用（2022年改正会計基準を第17期首から適用し第16期の指標等を遡及適用）は、キーとなる年度が5年表の2024年11月期のためfinancialNoteに記録した。前期有報との再表示チェックは全系列で差異ゼロだった。
- businessModel: 指標等の注記3・4（潜在株式調整後1株当たり当期純利益の不記載）はfinancialNoteの対象ではないためwarningsに留めた。
- businessModel: 株式分割・株式併合の記載は指標等の注記に見当たらなかった。
- businessModel: 重要な後発事象は証拠パックの抽出範囲では確認できなかったため、needsReviewには入れていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（インベストメントバンク事業4,922百万円、アセットマネジメント事業919百万円）とした。合計（5,841百万円）は印字の連結売上高5,842百万円と1百万円差があるが、印字の数値をそのまま使った。セグメント利益は書いていない。
- businessStructure: MD&Aのセグメント売上高も外部ベースで同額のため、セグメント注記の数値と一致することを確認した。
- businessStructure: 設備は、株式会社ファンドクリエーションの設備が両セグメント連記のため特定の事業に結びつけず、湯布院塚原プロパティー（同）の設備だけがインベストメントバンク事業として印字されている。帳簿価額は書いていない。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため付けていない。仕入先の固有名は有報に印字されていない。
- businessStructure: 連結子会社は9社で、主要なものは株式会社ファンドクリエーション、ファンドクリエーション・アール・エム株式会社、株式会社ＦＣインベストメント・アドバイザーズなどである。自社グループの会社のため本文の事業説明の範囲に留め、関連企業の判断はrelatedCompaniesに記録した。
- businessStructure: Wikipediaのパックは企業一覧の記事で同社固有の記事ではなかったため、補足には使わなかった。
- history: 沿革は年だけを採り、月と資本金の額は書いていない。
- history: 省いたもの：2009年の持株会社化に伴う子会社株式の取得（グループ内再編のため）、本社移転（2004年・2011年）、上海創喜投資諮詢有限公司の設立（2004年）、FCパートナーズ株式会社の設立（2005年）、ファンドクリエーション・アール・エム株式会社の金融商品取引業登録（2008年）。
- history: 沿革表は当社の沿革と完全子会社である株式会社ファンドクリエーションの沿革が分かれて印字されており、両方から主要な出来事を採った。
- industry: 主たる業界は、報告セグメントがいずれもファンドの組成・管理・運用と投資・金融商品仲介という金融事業であることから finance とした。投資対象が不動産・太陽光発電設備・車両などでも、事業の実体はファンド運用と投資であるため real-estate や energy は付けていない。
- industry: DEIの別記事業は「CTE」と印字されている。
- relatedCompanies: en（エン株式会社）：「リンキンオリエント・インベストメント」という子会社名の部分一致で、候補もambiguousである。
- relatedCompanies: base-4481（ベース株式会社）：「連結ベース」という一般語の部分一致である。
- relatedCompanies: corona（株式会社コロナ）：「新型コロナウイルス感染症」という一般語の部分一致である。
- relatedCompanies: trust（株式会社トラスト）：ファンド名「フェイム－アイザワトラスト」の部分一致で、コードリストにない相手である。
- relatedCompanies: charle（株式会社シャルレ）：「ソーシャルレンディング」という一般語の部分一致である。
- relatedCompanies: mtg（株式会社MTG）：設備の注記に土地の貸与先として印字されるMTG（同）は合同会社であり、株式会社MTGとは別の法人であるため結ばなかった。
- relatedCompanies: nissin（株式会社日新）：新株予約権の条文中の部分一致で、候補もambiguousである。
- relatedCompanies: port（ポート株式会社）：「事業ポートフォリオ」という一般語の部分一致である。
- relatedCompanies: 候補一覧にない相手：楽天証券株式会社とＪＰモルガン証券株式会社は大株主に載るが証券会社であり結ばなかった。有限会社T's Holdingsは大株主だが上場会社ではない。株式会社山の音とバルタスロール・プロパティー（同）は前期の主要な顧客で当期は該当がなく、候補一覧にもないため結ばなかった。
- relatedCompanies: 自社の連結子会社9社は関連企業として結んでいない。
- terms: 用語の助言のみ：「アセットマネジメント事業」と「インベストメントバンク事業」は同社の報告セグメントの名称。「レジット」は毎月分配型の外国投資信託の名称、「FC FUNDING」は不動産クラウドファンディングの名称、「リースバック」は運送事業者から車両を取得し引き続き貸し出す手法として有報で説明されている。各成果物でこれらの語を一貫して使った。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
