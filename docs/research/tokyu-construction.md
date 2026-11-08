# 東急建設 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東急建設株式会社 |
| 証券コード | 1720 |
| docID（データを取り出した文書） | `S100YFDZ` |
| 原本 docID | `S100YFDZ` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFDZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東急建設株式会社 / 1720 / docID S100YFDZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 51 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyu-construction: 10 件の数値を有報XBRLと照合
有報: 東急建設株式会社 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YFDZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tokyu-construction: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…深化と戦略事業の成長などに取り組んで利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみとし、営業利益・経常利益・セグメント利益・受注高・完成工事高などの金額は書かなかった。売上高の増減率はMD&Aの印字（16.4％増）どおりとした。
- businessModel: financialNotesには、2022年改正会計基準（法人税、住民税及び事業税等に関する会計基準）等を2025年3月期の期首から適用し、2024年3月期の主要な経営指標等を遡及適用した事実だけを書いた（経営指標等の注記4が根拠）。前期有報との修正再表示チェックは全項目一致している。
- businessModel: 純利益の増加理由（投資有価証券売却益の特別利益計上など）は、規則により本文に書かなかった。
- businessModel: 長期経営計画のKPI（連結営業利益・ROEなど）の数値目標は書かなかった。
- businessModel: Wikipedia（東急建設）の冒頭は有報と重なる内容（東急グループの総合建設会社であること、持分法適用関連会社であることの位置づけ）のみで、数値も使えないため補足に使わなかった。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上高の大きい順（建設事業（建築）259,236百万円→建設事業（土木）74,350百万円→不動産事業等7,593百万円）とした。3つとも報告セグメントである。セグメント利益の金額は書いていない。
- businessStructure: 上場市場は表紙の印字（東京証券取引所プライム市場）どおりとした。
- businessStructure: 【事業の内容】では建設事業を建築と土木に分類する旨が書かれており、報告セグメントの3区分をそのまま事業とした。
- history: 沿革は【沿革】の記載どおり、2003年の設立からとした。年月と事象は行ごとにそろって印字されており、そのまま対応づけた。
- history: 設立時の資本金などの金額は書かなかった。
- history: （旧）東急建設の設立以前の歴史は、この有報の【沿革】には記載がないため扱わなかった。
- industry: 主たる業界は、売上高の大半を占める建設事業（建築・土木）からconstructionとした。
- industry: 不動産事業等は不動産の販売・賃貸を行う報告セグメントとして金額が独立して開示されている（2026年3月期の外部顧客への売上高7,593百万円）ため、real-estateを2つ目に付けた。
- relatedCompanies: 東急株式会社は【関係会社の状況】で「その他の関係会社」に区分され（議決権の被所有割合は直接14.5％・間接0.6％、2026年3月31日現在）、【大株主の状況】でも筆頭株主（14.45％）だが、related-candidates.jsonに含まれていないため結ばなかった。同社とその子会社の東急電鉄株式会社から工事の一部を継続的に受注している関係は、businessModelの本文で述べている。
- relatedCompanies: 東急電鉄株式会社は東急株式会社の子会社で工事の発注者だが、候補にないため結ばなかった。
- relatedCompanies: 持分法適用関連会社の東急グリーンシステム株式会社（議決権の所有割合22.5％）、あすか創建株式会社（21.4％）、CH.KARNCHANG-TOKYU CONSTRUCTION CO., LTD.（45.0％）と、連結子会社11社は、いずれも候補にないため結ばなかった。
- relatedCompanies: 特定投資株式の保有目的は、全銘柄を通じて「建設事業における取引関係にあり、長期的な取引関係の開拓・維持を通じて、当社の企業価値の向上に資すると判断し、保有しております」という定型句だったため、この表に載ることだけを理由には結ばなかった。
- relatedCompanies: きんでんは【大株主の状況】に載る事業会社であり、4区分（親会社・子会社・持分法適用関連会社・その他の関係会社）には当たらないため、major-shareholderとして結んだ。有報に同社との取引や提携の個別の記載はない。
- relatedCompanies: en: 「従業員エンゲージメント」などの断片一致で、エン株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: zero: 長期経営計画の文言「廃棄物ゼロ」「To zero, from zero.」の一致で、株式会社ゼロについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: port: 「TNFDレポート」の「レポート」の断片一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: innovation: 連結対象の投資組合「東急建設-ＧＢイノベーション投資事業有限責任組合」の名称の一致で、株式会社イノベーションについての記載はないため結ばなかった。
- relatedCompanies: vision: 企業ビジョン「VISION2030」の文言の一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: core: 「コア事業」の一般語の一致で、株式会社コアについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: ricoh: 「リコール」「ノンリコース債務」の断片一致で、株式会社リコーについての記載はないため結ばなかった。
- relatedCompanies: career: 「キャリア形成」の一般語の一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: land: 「ブランド」の断片一致で、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: link-and-motivation: 従業員エンゲージメントの測定ツール「モチベーションクラウド」の提供会社として名前が現れるだけで、取引・提携の記載がないため結ばなかった。
- relatedCompanies: kohsoku: 中日本高速道路株式会社（未上場の別会社）の名称の断片一致で、株式会社高速についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: path: 「ITパスポート」の断片一致で、パス株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: seki: 「情報セキュリティ」の断片一致で、セキ株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: the-lead: 「戦略事業をリードできる人材」の一般語の一致で、株式会社リードについての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「データベース化」の断片一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: canon: 特定投資株式の表に載るが、保有目的は建設事業における取引関係の定型句のみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: central-japan-railway: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: cover: 木造技術の用語「HC（ハイブリッドカバーの略）」の一致で、カバー株式会社についての記載はないため結ばなかった。
- relatedCompanies: dai-ichi-life-holdings: 生命保険会社であり、有報に現れるのは商号変更の脚注のみで、保険取引が理由の関係は結ばないため結ばなかった。
- relatedCompanies: japan-airport-terminal: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: keikyu: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: keio: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: keisei-electric-railway: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: kyoritsu-maintenance: 完成工事（ラビスタ熱海新築工事）の発注者として現れるが、1工事限りで継続的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: kyushu-railway: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: mitsui-fudosan: 完成工事や次期繰越工事の発注者として現れるが、工事例の記載のみで継続的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）の名称の部分一致で、株式会社トラストについての記載はなく、listing がコードリストにないため結ばなかった。
- relatedCompanies: yakult-honsha: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: airport-facilities: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: east-japan-railway: 次期繰越工事（渋谷駅街区西棟・中央棟の新築工事）の共同発注者として現れるが、工事例の記載のみで継続的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: fuji-8278: 有報に現れるのはフジタ（別会社）であり、株式会社フジについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: hokkaidenko: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: kyosan-electric-manufacturing: 特定投資株式の表で当事業年度は株式を保有しておらず（前事業年度は313,000株）、保有目的も定型句のみのため結ばなかった。
- relatedCompanies: lec: 「フレックス勤務制度」の断片一致で、レック株式会社についての記載はないため結ばなかった。
- relatedCompanies: mitsubishi-estate: 完成工事の関係者として現れるのは三菱地所レジデンス株式会社と三菱倉庫株式会社であり、三菱地所株式会社自身との取引の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-logistics: 完成工事（三菱地所レジデンス・三菱倉庫の千代田区三番町計画）の関係者として現れるが、工事例の記載のみのため結ばなかった。
- relatedCompanies: moi: 「モイスチャーセンサ」の断片一致で、モイ株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: odakyu-electric-railway: 特定投資株式の表に載るが、保有目的は定型句のみのため結ばなかった。
- relatedCompanies: rent: 切羽遠隔監視システムの試験導入で当社や他社と連携する会社として現れるが、実証段階の取り組みであり、継続的な提携関係の記載がないため結ばなかった。
- relatedCompanies: sekisui-house: 次期繰越工事（グランドメゾン千鳥ヶ淵計画）の発注者として現れるが、工事例の記載のみのため結ばなかった。
- relatedCompanies: shinto: 「新東名高速道路」の断片一致で、新東株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: sotetsu-holdings: 特定投資株式の表に載るが、保有目的は「当該会社の関係会社等と建設事業における取引関係にあり」という定型句のみのため結ばなかった。
- relatedCompanies: taisei: みずほ信託銀行の退職給付信託「大成建設口」という信託口座の名称として現れるのみで、大成建設株式会社自身が大株主である記載はないため結ばなかった。
- relatedCompanies: thinca: パートナー企業の名称「テックシンカー」の断片一致で、株式会社シンカについての記載はないため結ばなかった。
- relatedCompanies: tokyo-metro: 次期繰越工事（渋谷駅街区西棟・中央棟の新築工事）の共同発注者として現れるが、工事例の記載のみで継続的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: toumei: 「新東名高速道路」の断片一致で、株式会社東名についての記載はなく、ambiguous のため結ばなかった。
- terms: 助言: 「モクタスＷＯＯＤ」は用語集に未登録と思われます。中大規模木造・木質建築ブランド「モクタス」の木造技術で、国土交通大臣の認定を取得した当社オリジナルの1時間耐火木造柱として【研究開発活動】に現れるため、登録候補になります。
- terms: 助言: 「ＰＦＩ」は用語集に未登録と思われます。子会社の大阪消防ＰＦＩ株式会社が行う「大阪府立消防学校再整備等事業」など、公共施設の整備・運営を民間が担う事業方式として有報に現れるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
