# 西松建設 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 西松建設株式会社 |
| 証券コード | 1820 |
| docID（データを取り出した文書） | `S100YEDU` |
| 原本 docID | `S100YEDU` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEDU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 西松建設株式会社 / 1820 / docID S100YEDU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 60 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nishimatsu-construction: 10 件の数値を有報XBRLと照合
有報: 西松建設株式会社 有価証券報告書－第89期(2025/04/01－2026/03/31) (docID S100YEDU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第88期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
nishimatsu-construction: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…による効率的組織への変革などを掲げて利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみとし、営業利益・経常利益・セグメント利益・受注高・完成工事高などの金額は書かなかった。売上高の増減率はMD&Aの印字（8.0％増）どおりとした。
- businessModel: financialNotesには、2022年改正会計基準（法人税、住民税及び事業税等に関する会計基準）等を2025年3月期の期首から適用し、2024年3月期の主要な経営指標等を遡及適用した事実だけを書いた（経営指標等の注記1が根拠）。
- businessModel: 前期の窓に第88期の訂正有価証券報告書があるが、当期有報の修正再表示チェックでは前期有報との重複年度が全項目一致しており、数値への影響は確認できなかったため、needsReviewには入れず、この確認結果を記録した。
- businessModel: 西松-Vision 2035と中期経営計画2028は方針の内容だけを書き、売上高・営業利益・ROEなどの数値目標は書かなかった。
- businessModel: 2026年4月の事業本部の統合（環境・都市開発事業本部の設置）は、businessStructure成果物のneedsReviewに記録した。本文では2026年3月期の事業区分で記載している。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上高の大きい順（建築事業216,729百万円→土木事業121,904百万円→国際事業31,630百万円→アセットバリューアッド事業25,016百万円→地域環境ソリューション事業748百万円）とした。5つとも報告セグメントである。セグメント利益の金額は書いていない。
- businessStructure: 上場市場は表紙の印字（東京証券取引所プライム市場）どおりとした。
- businessStructure: 事業の説明は2026年3月31日現在の報告セグメントと事業本部の体制で書いた。決算日後の2026年4月の本部統合はneedsReviewに記録した。
- businessStructure: 【事業の内容】の区分では「建設事業（土木・建築・国際）」と「アセットバリューアッド事業・地域環境ソリューション事業」にまとめられているが、エントリーの事業は報告セグメントの5区分で立てた。
- history: 沿革は有報の【沿革】の印字どおりに年月を確認して書いた。支店の開設・改称の細目は主なものだけを取り上げ、技術研究所・香港支店など事業の広がりを示すものを残した。
- history: 創業年（1874年）と株式会社化（1937年）の関係は有報の記述どおりに書いた。設立時の資本金の額は規則により書いていない。
- history: Wikipediaは見出しの補足（準大手ゼネコンという位置づけ）程度で、有報の沿革と重なる内容が中心のため、出典として使わなかった。
- industry: 主たる業界は、売上高の大半を占める国内建設事業（建築事業・土木事業）からconstructionとした。
- industry: アセットバリューアッド事業は不動産の賃貸・販売を行う報告セグメントとして金額が独立して開示されている（2026年3月期の外部顧客への売上高25,016百万円）ため、real-estateを2つ目に付けた。
- industry: 地域環境ソリューション事業には再生可能エネルギーが含まれるが、外部顧客への売上高が748百万円と小さく、エネルギー事業だけの金額が独立開示されていないため、energyは付けなかった。
- relatedCompanies: 【関係会社の状況】に載る連結子会社（西松地所・泰国西松建設など）や持分法適用関連会社（エヌエナジー・IN INFRA AUSTRALIA PTY LTD）は、いずれも未上場で候補にないため結ばなかった。
- relatedCompanies: 特定投資株式の保有目的は、全銘柄を通じて「工事請負に係る取引を行っており、主に○○工事における中長期的な受注の確保に向けて、同社との良好な関係の維持、強化を図るため」という定型句（工事の種類だけが異なる）だったため、この表に載ることだけを理由には結ばなかった。候補にない九州電力・東京電力ホールディングス・北海道電力なども同じ扱いである。
- relatedCompanies: 戸田建設は【研究開発活動】に技術提携が明記されているためtechnologyとし、奥村組は3社で継続する共同開発の枠組み「土木工事プラットフォーム」（第二弾まで実施され、現場での利用が始まっている）があるためbusiness-partnerとして結んだ。
- relatedCompanies: career: 一般語「キャリア」の一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: en: 「エンゲージメント」などの断片一致で、株式会社エンについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: core: 一般語・断片一致で、株式会社コアについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: port: 自社の賃貸物件名「NCReポートアイランド」の一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: s-t: 連結子会社名「西松リアルエステート・デベロップメント」の断片一致で、エステー株式会社についての記載はないため結ばなかった。
- relatedCompanies: slogan: 「サステナビリティスローガン」の一般語の一致で、スローガン株式会社についての記載はないため結ばなかった。
- relatedCompanies: no-1: 長期ビジョンの文言「魅力あるゼネコンNo.1」の一致で、株式会社No.1についての記載はないため結ばなかった。
- relatedCompanies: rent: 「タレントマネジメント」などの断片一致で、株式会社レントについての記載はないため結ばなかった。
- relatedCompanies: zero: 「ネットゼロ」の一般語の一致で、株式会社ゼロについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: kohsoku: 「高速施工」の一般語の一致で、株式会社高速についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: land: 在外子会社名（タイランド）の断片一致で、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: sato: 在外子会社名「バンコクサトーンホテルマネジメント社」の地名の一致で、株式会社サトーについての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「〜をベースに」の一般語の一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: central-japan-railway: 特定投資株式の表に載り、中央新幹線のトンネル工事の発注者でもあるが、保有目的は工事請負に係る取引の定型句のみで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: hulic: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: ntt: 有報に記載があるのは子会社のNTT東日本との共同実証であり、NTT株式会社自身との取引・提携の記載がないため結ばなかった。
- relatedCompanies: seki: 「情報セキュリティ」などの断片一致で、セキ株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development: 特定投資株式の表に載り、建築工事の発注者でもあるが、保有目的は工事請負に係る取引の定型句のみで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）の名称の部分一致で、株式会社トラストについての記載はなく、listing がコードリストにないため結ばなかった。
- relatedCompanies: vision: 「西松-Vision 2035」などの一般語の一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: east-japan-railway: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: electric-power-development: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: honda: 真岡用地の燃料電池工場改修工事の発注者として現れるが、1工事限りで継続的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: keikyu: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: kyushu-railway: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: misawa-and-co: 有報に現れるのはミサワホーム株式会社（別会社）であり、株式会社ミサワ自身についての記載はないため結ばなかった。
- relatedCompanies: reskill: 一般語「リスキル」の一致で、株式会社リスキルについての記載はないため結ばなかった。
- relatedCompanies: safie: 仙台市の現場における連携ソリューションの実証に名前が現れるが、1現場の実証であり継続的な提携の記載がないため結ばなかった。
- relatedCompanies: shikoku-electric-power: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: suzuki-6785: 役員個人名の一致で、株式会社鈴木についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: teikoku-sen-i: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: the-kansai-electric-power: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: tokyu: 特定投資株式の表に載るが保有目的は定型句のみで、有報に現れる工事関係者は東急不動産などの別会社であり、東急株式会社自身との個別の提携・契約の記載がないため結ばなかった。ambiguous でもある。
- relatedCompanies: west-japan-railway: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: alpha-4760: 自社の賃貸マンション名「アルファコート堺」の一致で、株式会社アルファについての記載はないため結ばなかった。
- relatedCompanies: alpha: 自社の賃貸マンション名「アルファコート堺」の一致で、株式会社アルファについての記載はないため結ばなかった。
- relatedCompanies: cre: 工事の発注者として現れるが1工事限りで、listing がコードリストにないため結ばなかった。
- relatedCompanies: daiwa-house-industry: 札幌の工事で関係者（北海道支店）として現れるが、継続的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: hankyu-hanshin-holdings: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: hokuriku-electric-power: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: keihan-holdings: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: kimura: 札幌の工事の関係者名として現れるが、株式会社キムラとの取引・提携の記載はないため結ばなかった。
- relatedCompanies: kobe-electric-railway: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: kuze: 植栽の名称などの断片一致で、株式会社久世についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: l-is-b: 仙台市の現場における連携ソリューションの実証に名前が現れるが、1現場の実証であり継続的な提携の記載がないため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」の断片一致で、レック株式会社についての記載はないため結ばなかった。
- relatedCompanies: mitsubishi-corporation: 有報に現れるのは三菱商事都市開発株式会社（三菱商事の子会社）であり、三菱商事株式会社自身との取引・提携の記載がないため結ばなかった。
- relatedCompanies: mitsui-fudosan: 有報に現れるのは三井不動産プライベートリート投資法人（投資法人）であり、三井不動産株式会社自身との取引・提携の記載がないため結ばなかった。
- relatedCompanies: nankai: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: odakyu-electric-railway: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: okabe: 藻場再生に向けた四者協定の当事者として現れるが、ambiguous であり、取引関係の個別の記載も薄いため結ばなかった。
- relatedCompanies: path: 断片一致で、パス株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: shimizu: 山岳トンネル向け噴付け自動化システムの共同開発に名前が現れるが、戸田建設のような技術提携の記載はなく、1件の共同開発の成果の記載のみのため結ばなかった。
- relatedCompanies: sotetsu-holdings: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- relatedCompanies: sumitomo-corporation: 横浜港北物流施設の工事の共同発注者として現れるが、1工事限りで継続的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: taya: 「三軒茶屋」の地名の断片一致で、株式会社田谷についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: tohoku-electric-power: 特定投資株式の表に載るが、保有目的は工事請負に係る取引の定型句のみのため結ばなかった。
- terms: 助言: 「現場力」は用語集に未登録です。粘り強さ、堅実・誠実さ、まとめ上げる力からなる当社の強みとして【経営方針、経営環境及び対処すべき課題等】で定義され、有報の中で繰り返し現れるため、登録候補になります。
- terms: 助言: 「ECI」は用語集に未登録です。設計段階から施工者が関与する発注方式として、中期経営計画2028の土木事業の重点施策に、DB（設計施工一括発注方式）と並んで現れる建設業界の発注方式であるため、登録候補になります。

## 要確認（status に反映）

- businessStructure: 決算日後の組織再編：2026年4月、アセットバリューアッド事業本部と地域環境ソリューション事業本部を統合し、新たに環境・都市開発事業本部を設置した（【事業の内容】に記載）。当エントリーの事業区分は2026年3月期の報告セグメント（5区分）のままで記載している。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
