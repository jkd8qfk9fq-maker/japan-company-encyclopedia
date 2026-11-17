# ＪＣＵ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＪＣＵ |
| 証券コード | 4975 |
| docID（データを取り出した文書） | `S100YIEL` |
| 原本 docID | `S100YIEL` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIEL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＪＣＵ / 4975 / docID S100YIEL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jcu: 10 件の数値を有報XBRLと照合
有報: 株式会社ＪＣＵ 有価証券報告書－第66期(2025/04/01－2026/03/31) (docID S100YIEL)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":24256069000,"latestFiling":24256000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":27137641000,"latestFiling":27137000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":24859731000,"latestFiling":24859000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":28356968000,"latestFiling":28356000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":6370521000,"latestFiling":6370000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":6013843000,"latestFiling":6013000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":5530464000,"latestFiling":5530000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":7497987000,"latestFiling":7497000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":9231954000,"latestFiling":9231000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":9369524000,"latestFiling":9369000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":8216192000,"latestFiling":8216000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":10920410000,"latestFiling":10920000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":40892491000,"latestFiling":40892000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":44901354000,"latestFiling":44901000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":49641695000,"latestFiling":49641000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":54841235000,"latestFiling":54841000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":33166373000,"latestFiling":33166000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":37861725000,"latestFiling":37861000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":42250410000,"latestFiling":42250000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":47812997000,"latestFiling":47812000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
jcu: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社JCU」が EDINET の提出者名「株式会社ＪＣＵ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の印字どおりの百万円表記を使った。2026年3月期の売上高29,672百万円（前期比4.6％増）と親会社株主に帰属する当期純利益9,074百万円（同21.0％増）はMD&Aの印字どおり。セグメント別の外部顧客への売上高（薬品事業26,926百万円、装置事業2,746百万円）はセグメント注記の印字どおりで、合計は連結売上高と一致する。
- businessModel: 前期有報との修正再表示チェックで挙がった差異はすべて、表示単位を千円単位から百万円単位へ変更したことによる100万円未満の表示上の差異であり、理由が経営指標等の注記に印字されているためfinancialNotesに記録した。実質的な数値の訂正はない。
- businessModel: suppliersはこのツリーのスキーマに無いキーであるため省略した。仕入先に関する独立した開示は有報にもない。
- businessModel: 装置事業の受注高1,794百万円と受注残高397百万円は本文の数値として使わず、ここに記録するにとどめた。
- businessModel: 中期経営計画の株主還元方針（総還元性向50％を目安、安定的な増配、機動的な自己株式取得の検討）と配当の金額は、投資・配当に関する事項のため本文には書かず、ここに記録するにとどめた。
- businessModel: 研究開発費1,241百万円（全額が薬品事業に配分）は金額を本文に書かない事項のため、ここに記録するにとどめた。
- businessModel: 重要な契約等には、韓国のJESAGI HANKOOK CO., LTD.との業務・資本提携契約（2006年9月1日、相手方株式の取得及びプリント基板洗浄装置の販売権の取得）が印字されている。相手方は非上場で関連企業候補にないため関連企業には結ばず、ここに記録するにとどめた。
- businessModel: 重要な後発事象は、連結財務諸表・財務諸表のいずれについても該当事項なしと印字されている。
- businessModel: イビデン株式の数の増加理由として印字された株式分割は、保有先であるイビデンの株式分割であり、当社自身の株式分割ではないため、needsReviewには入れなかった。
- businessStructure: 連結子会社は【事業の内容】の記載どおり13社（すべて議決権の所有割合100.0％）。連結財務諸表の注記に列挙される連結子会社にはJCU（香港）股份有限公司が含まれるが、【関係会社の状況】の表と【事業の内容】の主要な会社欄には個別の記載がないため、会社名は本文に書かなかった。
- businessStructure: 持分法適用関連会社はYUKEN SURFACE TECHNOLOGY, S.A. DE C.V.（メキシコ、議決権の所有割合26.0％）の1社で、当社からめっき加工用装置を購入している旨と、当社役員が役員を兼任している旨が【関係会社の状況】に印字されている。
- businessStructure: 地域ごとの情報（関連情報）の2026年3月期の売上高は、日本6,464百万円、中国11,913百万円、台湾4,679百万円、韓国2,382百万円、その他アジア2,967百万円、その他1,264百万円で、中国が最大である。
- history: 設立時（1968年）の資本金100百万円は、資本金額を書かない規則のため説明文に入れなかった。
- history: 沿革のうち、営業所の開設・昇格（1968年大阪、1981年福岡など）、本社の移転（1971年、1999年、2011年）、海外子会社の個別の設立（2003年中国・上海、2006年タイ、2007年韓国、2008年インド、2009年中国・深圳、2011年インドネシア、2012年メキシコ、2014年アメリカ、2017年中国・湖北、2022年マレーシア）、インドとメキシコの子会社の完全子会社化（2014年、2020年）、そらぷちファームの設立（2018年）と全株式譲渡（2024年）は、行数が多くなるため落とした。
- history: 2007年の行は、沿革表で同じ時期に並ぶベトナム子会社と台湾子会社の設立、市場第一部指定を1行にまとめた。
- industry: 主たる業界は、表面処理薬品（めっき薬品）の開発・製造・販売が売上高の大部分を占めることに基づき、閉じたタクソノミーのchemicalsとした。事業の内容に半導体用めっき薬品が製品区分として開示され、半導体分野が中期経営計画の重点領域・次世代領域とされているため、semiconductorsを2つ目に付けた。閉じた分類で言えない不足はない。
- relatedCompanies: 特定投資株式の保有目的は、各銘柄とも取引のある事業分野を明示した「○○事業における取引先であり、取引関係の強化・円滑化を図るためです」という記載で、取引先である事実が銘柄ごとに印字されているため、分野の印字がある4社を取引先として結んだ。取引の向き（仕入か販売か）は印字されていないため、customerやsupplierではなくbusiness-partnerとした。説明文には貸借対照表計上額は書かず、株式数だけを書いた。
- relatedCompanies: alpha（3434）／alpha-4760: 特定投資株式の株式会社アルファ（14,500株）は、同名の上場会社が証券コード3434と4760の2社あり、有報に証券コードや住所の印字がなく相手を特定できないため、どちらにも結ばなかった。
- relatedCompanies: ebara-jitsugyo: 大株主の状況に3.24％を保有する事業会社として載るが、この会社について取引・提携の記載が有報になく、資本関係だけのため結ばなかった。
- relatedCompanies: sakae-electronics: 大株主の栄電子工業株式会社は、候補の株式会社栄電子とは名称が異なる別の会社で、関連企業候補にはないため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）は信託銀行の信託口で、コードリストにもないため結ばなかった。株式会社日本カストディ銀行（信託口、4.47％）も同様である。
- relatedCompanies: land: 株式会社ランドとの関係の記載は有報になく、一般語句の一致のみのため結ばなかった。
- relatedCompanies: base-4481: 『ベース』はセグメント利益の説明文中の一般語句（営業利益ベース）の一致のみで、ベース株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: zero: 『ゼロ』はCO2排出量ゼロの目標の文中の一致で、株式会社ゼロとの関係の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: vision: 『ビジョン』は長期ビジョン『JCU VISION 2035』の文中の一致のみで、株式会社ビジョンとの関係の記載はないため結ばなかった。
- relatedCompanies: port: 『ポート』は人材の文中の一般語句の一致のみで、ポート株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: seki: 『セキ』は情報セキュリティー等の文中の一致のみで、セキ株式会社との関係の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: career: 『キャリア』はキャリアパスの文中の一般語句の一致のみで、株式会社キャリアとの関係の記載はないため結ばなかった。
- relatedCompanies: core: 『コア』は『表面処理技術をコア事業とし』の文中の一致のみで、株式会社コアとの関係の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: freee: 『フリー』はカーボン・フリーの文中の一致のみで、フリー株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: path: 『パス』はキャリアパスの文中の一致のみで、パス株式会社との関係の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: rix: 『リックス』はスキルマトリックス等の文中の一致のみで、リックス株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: the-lead: 『リード』は『世界をリードする』の文中の一致のみで、株式会社リードとの関係の記載はないため結ばなかった。
- relatedCompanies: ユケン工業株式会社は、持分法適用関連会社YUKEN SURFACE TECHNOLOGY, S.A. DE C.V.の共同出資者であることが沿革と関係会社の状況に印字されているが、関連企業候補にないため結ばなかった。同合弁会社も非上場で候補にない。
- relatedCompanies: 大株主の株式会社S・D・PA（3.24％）、神谷理研株式会社（2.59％）、TPR株式会社（2.57％）は非上場で関連企業候補になく、取引の記載もないため結ばなかった。
- terms: 助言: 用語「めっき」は、金属などの材料の表面に金属の薄い膜を形成する表面処理技術で、当社の薬品事業・装置事業の対象であることが事業の内容に印字されています。
- terms: 助言: 用語「ビアフィリング硫酸銅めっき」は、プリント配線板のビア（層間を接続する穴）を硫酸銅めっきで埋めるプロセスで、電子分野の主力製品として研究開発活動に印字されています。
- terms: 助言: 用語「プラズマ処理装置」は、プラズマ技術を利用したプリント配線板の洗浄装置で、装置事業の製品区分として事業の内容に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
