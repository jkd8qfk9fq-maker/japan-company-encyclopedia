# coly — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ｃｏｌｙ |
| 証券コード | 4175 |
| docID（データを取り出した文書） | `S100Y0KM` |
| 原本 docID | `S100Y0KM` |
| 提出日（原本） | 2026-04-24 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y0KM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ｃｏｌｙ / 4175 / docID S100Y0KM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
coly: 10 件の数値を有報XBRLと照合
有報: 株式会社ｃｏｌｙ 有価証券報告書－第12期(2025/02/01－2026/01/31) (docID S100Y0KM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
coly: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社coly」が EDINET の提出者名「株式会社ｃｏｌｙ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記1（当社は連結財務諸表を作成していないため連結経営指標等は記載していない）、注記3（持分法を適用した場合の投資損益は記載していない）、注記4（潜在株式調整後1株当たり当期純利益は潜在株式が存在しないため記載していない）、注記5（損失計上期の株価収益率は記載していない）、注記6（従業員数は就業人員、臨時雇用者数は年間の平均人員を外数で記載）は表示事項のため、financialNotesには入れなかった。financialNotesには収益認識基準の適用に関する注記2のみを入れた。
- businessModel: 前期有報（第11期、S100VOFV）との修正再表示チェックは、証拠パックの照合で売上高・当期純利益（純損失）・総資産・純資産の全系列に差異がゼロだった。訂正有報はなく、DEIの訂正フラグもすべてfalseである。
- businessModel: 貸借対照表の表示方法の変更（未収入金を「その他」から区分掲記）は表示の変更のみで経営指標に影響しないため、warningsのみとした。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されているため、needsReviewには何も入れなかった。
- businessModel: 【重要な契約等】には、ウォルト・ディズニー・ジャパン株式会社との間で締結した、ディズニーIPを用いる新規オリジナルオンラインゲームの開発・配信ライセンス契約（サービス開始は2027年1月期上半期の計画）が印字されている。将来提供予定のタイトルに関する契約であり、事業構造の変更ではないためneedsReviewには入れず、warningsに記録する。
- businessModel: 経営方針の客観的指標は売上高と利益指標であるため、数値目標は本文に書かなかった。
- businessStructure: 製品及びサービスごとの情報（財務諸表注記【関連情報】）の外部顧客への売上高は、モバイルオンラインゲーム4,093,145千円・メディア2,926,955千円で、合計は印字の売上高7,020,100千円と一致する。百万円への切り捨てでは内訳の合計7,019百万円となり、売上高7,020百万円と1百万円異なるため、印字の合計を正として記載した。
- businessStructure: 【事業の内容】のタイトル別売上高（千円）を合計すると4,093,142千円となり、印字された合計4,093,145千円と3千円異なる。各タイトルは印字どおりに記載し、差異は有報の印字そのままである。
- businessStructure: メディアの内訳（グッズ販売・IP利用許諾・飲食事業・イベント事業・その他メディアミックス）は金額が独立して開示されていないため、各子事業に金額を書いていない。
- businessStructure: 本社（東京都港区三田）は【主要な設備の状況】に単一セグメントの設備として印字されているため、特定の子事業には結びつけなかった。設備の帳簿価額は記載していない。常設店舗「coly more!」「coly cafe!」は【事業の内容】の記述に基づきメディアの子事業に記載した。
- businessStructure: このツリーの旧スキーマに従い、suppliersキーは省略した。プラットフォーム運営事業者（Apple Inc.・Google LLC）への配信契約と、決済代行会社GMOイプシロン株式会社による代金回収は【重要な契約等】とMD&Aに印字されている事実としてwarningsに記録する。
- businessStructure: 親会社の株式会社South airは未上場で関連企業候補に含まれていないため、relatedCompaniesには結ばず会社ノードの説明に記載した。非連結子会社2社は【関係会社の状況】に社名が印字されていないため、社名を書いていない。
- history: 設立時の資本金（100千円）と2015年11月の増資は、資本金額を沿革に書かない規則のため省略した。
- history: 本社の移転のうち2015年11月（赤坂二丁目）と2017年2月（赤坂四丁目）は省略し、2025年6月の三田への移転のみを記載した。
- history: 個別タイトルのサービス開始のうち、『オンエア！』（2018年）、『&0』（2022年）、『永久少年Side Project-トワイライトなスピカ-』（2023年）、『Cypher Archives:眠らない図書館』（2023年）は、現在の主要タイトルに含まれていないため省略した。『オンエア！for Nintendo Switch』（2024年）の発売も省略した。
- history: 「SugarDia 原宿」オープン（2022年）、「coly more! 心斎橋PARCO店」オープン（2023年）、coly 10th Anniversary Fes開催（2024年）は省略し、心斎橋PARCO店の存在はbusinessStructureのグッズ販売に記載した。
- industry: 主たる業界は、単一セグメントのコンテンツ事業の中核がモバイルオンラインゲームの開発・運営であり、自社も女性向けエンターテインメント市場を対象と位置づけているためentertainmentとした。
- industry: mediaは付けなかった。有報の「メディア」は自社IPのグッズ販売・飲食・イベントなどを指す当社独自の事業区分であり、メディア事業として独立した業界分類には当たらないためである。
- relatedCompanies: en: 「エンターテインメント」の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: tein: 「エンターテインメント」の部分一致のため結ばなかった。
- relatedCompanies: ray: 「プレイ」等の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」等の部分一致のため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス感染症」という一般語の一致のため結ばなかった。
- relatedCompanies: hit: 「ヒット創出」「ヒット商品」という一般表現の一致のため結ばなかった。
- relatedCompanies: land: 「ブランド」の部分一致のため結ばなかった。
- relatedCompanies: amuse: 「アミューズメント事業会社」という業態の一般名詞としてのみ現れ、特定の会社との関係の記載がないため結ばなかった。
- relatedCompanies: base-4481: 「〜をベースに」という一般表現との一致のため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development: 有価証券関係の注記等に名称が現れるのみで、取引・提携・資本関係の個別の記載がないため結ばなかった。当社は純投資目的以外の投資株式を保有していない。
- relatedCompanies: the-lead: 「市場をリードする」という一般表現との一致のため結ばなかった。
- relatedCompanies: 株式会社South airは【関係会社の状況】に親会社として印字され、2026年1月31日現在の議決権の所有割合は50.52％だが、未上場で関連企業候補にも含まれていないため結ばなかった（businessStructureの会社説明に記載した）。
- relatedCompanies: Apple Inc.とGoogle LLCは【重要な契約等】にプラットフォームの配信契約の相手方として印字されているが、関連企業候補に含まれていないため結ばなかった。ウォルト・ディズニー・ジャパン株式会社はディズニーIPを用いる新規ゲームの開発・配信ライセンス契約の相手方だが、未上場で候補にも含まれていないため結ばなかった。
- relatedCompanies: 【大株主の状況】に載る事業会社は証券会社のみであり、結べる相手はいない。外部顧客への売上高の10％以上を占める相手先はない（【関連情報】に相手先別の記載なし）。非連結子会社2社は当社の子会社であり関連企業リンクの対象ではない。
- terms: 助言: 「IP」は有報の注記のとおり、Intellectual Property（知的財産）のことで、ブランド、知的財産権、キャラクターなどを指します。「EX」は当社が「面白い」を体験の仕方から変革し、エンターテインメントの未来を創造することを目指す造語で、Entertainment Transformationの略です。「アイテム課金制」は、ダウンロードと基本プレイは無料で、ゲーム内のアイテムの購入に課金する仕組みを指します。「コラボカフェ」は、自社IPと飲食店が連携し、期間限定のメニューや特典を提供する店舗企画を指します。いずれも有報の表記に沿って記述しました。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
