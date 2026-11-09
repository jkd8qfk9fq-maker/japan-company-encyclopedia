# ＡＺ－ＣＯＭ丸和ホールディングス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＡＺ－ＣＯＭ丸和ホールディングス株式会社 |
| 証券コード | 9090 |
| docID（データを取り出した文書） | `S100YCWN` |
| 原本 docID | `S100YCWN` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCWN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＡＺ－ＣＯＭ丸和ホールディングス株式会社 / 9090 / docID S100YCWN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 30 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
az-com-maruwa-holdings: 10 件の数値を有報XBRLと照合
有報: ＡＺ－ＣＯＭ丸和ホールディングス株式会社 有価証券報告書－第53期(2025/04/01－2026/03/31) (docID S100YCWN)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":7284000000,"latestFiling":7276000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":11645000000,"latestFiling":11633000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":138440000000,"latestFiling":138550000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":60440000000,"latestFiling":60431000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
az-com-maruwa-holdings: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「AZ－COM丸和ホールディングス株式会社」が EDINET の提出者名「ＡＺ－ＣＯＭ丸和ホールディングス株式会社」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックで差異が出た2025年3月期の各数値（当期純利益、総資産、純資産など）は、企業結合に係る暫定的な会計処理の確定によるものであることが【主要な経営指標等】の注記4、MD&A、のれんの注記で確認できたため、needsReviewには入れず、financialNotesに記録した。第49期についての注記3も同様にfinancialNotesに記録した。
- businessModel: 中期経営計画2028の数値目標（営業利益など）は、文章の規則により書いていない。第53期の計画・実績の対比も書いていない。
- businessModel: 【関係会社の状況】では株式会社WASAMIの当社株式の議決権所有割合（被所有）が14.6％と印字され、【大株主の状況】では所有株式数の割合が14.94％と印字されている。算定の基礎が異なるための差異とみて、そのまま記録する。
- businessStructure: 事業の並び順は、セグメント注記の2026年3月期の外部顧客への売上高の大きい順とした。「その他」は有報が「報告セグメントに含まれない」と明記する区分のため最後に置いた。
- businessStructure: 物流事業の子区分の金額は、MD&Aに印字された物流事業の売上高内訳（EC常温3PL事業74,068百万円、EC常温輸配送事業61,171百万円、ラストワンマイル事業38,916百万円、医薬・医療3PL事業26,614百万円、低温食品3PL事業26,606百万円）を使った。5区分の合計227,375百万円はセグメントの外部顧客への売上高227,377百万円と2百万円異なるが、有報の印字どおりに記載した。
- businessStructure: 【関係会社の状況】に印字されている株式会社丸和運輸機関の単体売上高131,021百万円とファイズオペレーションズ株式会社の単体売上高26,501百万円は、セグメントの金額ではないため事業の金額には使っていない。
- businessStructure: 【主要な設備の状況】の提出会社の行はセグメントの名称が「全社（共通）」のため、特定の事業には結びつけていない。国内子会社の設備はアズコムデータセキュリティの本社（その他）以外はすべて物流事業と印字されている。
- history: 【沿革】は年月と事項が同じ行に印字された表のため、行の順序どおりに年単位で採用した（月は書かない規則）。2008年3月の行は4件の株式取得が1つのセルにまとめて印字されているため、1つの項目にまとめた。
- history: 採用しなかった行: 2006年4月の本社移転、2018年10月の株式会社東北丸和ロジスティクスの本社移転、2022年4月の丸和運輸機関分割準備株式会社の設立（純粋持株会社移行の項目に含めた）、2022年7月の株式会社M・Kロジの完全子会社化、2022年10月の株式会社ドラゴンの完全子会社化。
- history: 資本金の金額は文章の規則により書いていない。
- industry: 主たる業界はtransportationとした: 唯一の報告セグメントである物流事業が外部顧客への売上高の大半を占め、物流センター運営と貨物輸送が中核のため。
- industry: real-estateは付けなかった: 不動産賃貸事業は「その他」の区分の一部で、金額が独立して開示されていないため。
- relatedCompanies: phyz-holdings: 【関係会社の状況】の連結子会社の区分と議決権の所有割合58.4％が根拠。中間持株会社であり、事業は傘下のファイズオペレーションズ株式会社が行う旨を説明に書いた。
- relatedCompanies: kamigumi: 候補はambiguousだが、有報に正式名称「株式会社上組」と資本業務提携の締結（2022年9月）、提携の内容と株式の保有が印字されており、同一性と関係性の両方に根拠があるため結んだ。
- relatedCompanies: go: 候補はambiguousだが、【沿革】に「GO株式会社」の正式名称と、株式会社MOMO Aの共同設立が印字されており、同一性と関係性の両方に根拠があるため結んだ。
- relatedCompanies: matsukiyococokara-and-co: 特定投資株式の保有目的に医薬・医療3PL事業の主要な顧客であることが銘柄ごとに印字されているためcustomerとした。同社が当社株式1.77％を保有する大株主であることは説明に併記した。
- relatedCompanies: timee: 保有目的に人材派遣サービスの利用が印字されており、サービスの提供を受ける向きが明確なためsupplierとした。
- relatedCompanies: the-pack: 保有株式数は18,600株と多くないが、保有目的にEC常温3PL事業の顧客であることが銘柄ごとに印字されており、情報収集目的の僅少な保有（各100株・計上額0百万円）の形ではないため結んだ。
- relatedCompanies: resona-holdings: 特定投資株式として100,000株を保有しているが、保有目的は主要取引金融機関としての金融取引の維持・強化であり、銀行・金融機関は資金調達・金融取引を理由に結ばないため結ばなかった。
- relatedCompanies: port: 一致は「リバースロジスティクス」や「輸配送」の文中の断片で、同社への言及はないため結ばなかった。
- relatedCompanies: seki: ambiguousの候補で、一致は連結子会社「株式会社アズコムデータセキュリティ」の社名の断片であり、同社への言及はないため結ばなかった。
- relatedCompanies: career: 一致は「従業員の自律的なキャリア形成」の文中の語で、同社への言及はないため結ばなかった。
- relatedCompanies: base-4481: 一致は「連結ベースの数値」の断片で、同社への言及はないため結ばなかった。
- relatedCompanies: en: ambiguousの候補で、一致は「エンゲージメント」の断片であり、同社への言及はないため結ばなかった。
- relatedCompanies: quick: 一致は連結子会社「株式会社ジャパンクイックサービス」の社名の一部で、株式会社クイックへの言及はないため結ばなかった。
- relatedCompanies: step: 一致は収益認識の「5ステップアプローチ」の断片で、同社への言及はないため結ばなかった。
- relatedCompanies: core: ambiguousの候補で、一致は「物流センター業務をコアとする3PL業務」の文中の語であり、同社への言及はないため結ばなかった。
- relatedCompanies: trust: listingがコードリストにない。一致は大株主の日本マスタートラスト信託銀行株式会社（信託口）の名称の一部であり、株式会社トラストへの言及はないため結ばなかった。
- relatedCompanies: last-one-mile: 一致は当社の事業の内訳の名称「ラストワンマイル事業」で、株式会社ラストワンマイルへの言及はないため結ばなかった。
- relatedCompanies: no-1: 一致は経営理念の「3PL業界のNo.1企業を目指し」の文言で、同社への言及はないため結ばなかった。
- relatedCompanies: zero: ambiguousの候補で、一致は「事故ゼロを目標」の文言であり、同社への言及はないため結ばなかった。
- relatedCompanies: king: 一致は「ピッキング」の断片で、同社への言及はないため結ばなかった。
- relatedCompanies: ishin: 一致は気候変動シナリオなどの文中の断片で、同社への言及はないため結ばなかった。
- relatedCompanies: rent: 一致は「タレントマネジメント」の断片で、同社への言及はないため結ばなかった。
- relatedCompanies: will: 一致は米国デラウェア州ウィルミントンの地名で、同社への言及はないため結ばなかった。
- relatedCompanies: corona: 一致は「新型コロナウイルス感染症」の文言で、同社への言及はないため結ばなかった。
- relatedCompanies: nissin: listingがコードリストにない。一致は新株予約権の注記中の断片で、株式会社日新への言及はないため結ばなかった。
- relatedCompanies: 株式会社JDSCは、当事業年度に資本業務提携を行い当社が584,000株を保有しているが、候補リストにないため結べなかった。
- relatedCompanies: 株式会社WASAMIは【関係会社の状況】で「その他の関係会社」（2026年3月31日現在、当社株式を保有）とされているが、候補リストにないため結べなかった。株式会社TARO'S（大株主、19.08％）と和佐見勝氏（個人の大株主、18.27％）も候補リストにない。
- relatedCompanies: アマゾンジャパン合同会社は最大の顧客（2026年3月期の売上高77,599百万円）だが、候補リストにないため結べなかった。事業モデルには記載した。
- relatedCompanies: 株式会社MOMO A（持分法適用関連会社、議決権の48.5％）と、後発事象で取得が決議された株式会社樋口物流サービスは、候補リストにないため結べなかった。
- relatedCompanies: 連結子会社21社は、ファイズホールディングス株式会社を除き非上場で候補リストにないため結ばなかった。
- terms: 助言: 「サードパーティ・ロジスティクス（3PL）」は用語集に未登録と思われます。荷主企業の物流業務を包括的に受託する事業形態で、同社グループの中核事業のため、登録候補になります。
- terms: 助言: 「ラストワンマイル」は用語集に未登録と思われます。消費者に届く前の最終区間の配送を指し、同社グループの事業の内訳の名称になっているため、登録候補になります。
- terms: 助言: 「輸配送プラットフォーム」は用語集に未登録と思われます。グループの輸配送のネットワーク機能を指す同社の用語のため、登録候補になります。
- terms: 助言: 「特定投資株式」は用語集に未登録と思われます。純投資目的以外の目的で保有する上場株式を指す開示上の区分で、同社の取引先との関係を示す根拠になるため、登録候補になります。

## 要確認（status に反映）

- businessModel: 2026年5月22日開催の取締役会において、株式会社樋口物流サービスの発行済株式の全部を取得し子会社化することが決議され、同日付で株式譲渡契約が締結されています（重要な後発事象）。本エントリーは2026年3月31日現在のグループ構成に基づいて記載しており、株式譲渡の実行日は有報の記載からは確認できません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
