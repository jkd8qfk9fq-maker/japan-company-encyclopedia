# マルイチ産商 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社マルイチ産商 |
| 証券コード | 8228 |
| docID（データを取り出した文書） | `S100YFT2` |
| 原本 docID | `S100YFT2` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFT2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社マルイチ産商 / 8228 / docID S100YFT2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
maruichi: 10 件の数値を有報XBRLと照合
有報: 株式会社マルイチ産商 有価証券報告書－第76期(2025/04/01－2026/03/31) (docID S100YFT2)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":540000000,"latestFiling":713000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":1727000000,"latestFiling":1739000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":77087000000,"latestFiling":78533000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":23887000000,"latestFiling":24060000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
maruichi: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…仕入れや物流の効率化などを進めて利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示の理由は、経営指標等の注３が示す企業結合に係る暫定的な会計処理の確定（2026年3月期中間期）であり、2025年3月期の数値は確定後の値である。financialNotes にその旨を記録した。前期有報との差異（2025年3月期 純利益540→713百万円等）はこの確定の反映によるもので、誤謬の訂正ではない。
- businessModel: 三菱食品株式会社との包括業務提携契約は【重要な契約等】に記載された当期も継続する契約であり、flow の customer 段に事実として書いた。同社は related-candidates にあるが上場区分が「（コードリストにない）」のため relatedCompanies では結んでいない（relatedCompanies の warnings に記録）。
- businessModel: 中期経営計画の数値目標や経営指標（ROE等）は投資・目標の数値のため書いていない。売上高の増減率（10.4％増）と純利益の増減率（142.1％増）は MD&A の印字どおり。
- businessModel: Wikipedia は使っていない（冒頭の説明は有報の事業内容と重なり、補足として必要な旧社名・ブランド名等の記載がなかったため）。出典は有報のみ。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（水産事業 195,587百万円 → 畜産事業 45,798百万円 → 一般食品事業 28,531百万円 → 丸水長野県水グループ 26,028百万円）。「その他」は有報が「報告セグメントに含まれない事業セグメント」と明記する区分のため最後に置いた（外部顧客への売上高1,140百万円）。
- businessStructure: 丸水長野県水グループは2026年3月31日時点では独立した報告セグメントであったため一つの事業として記載した。2026年4月1日の吸収合併（期末後・提出前に完了）は businessModel の needsReview に記録した。
- businessStructure: 2025年4月1日に丸水長野県水の畜産事業を吸収分割で当社と大信畜産工業へ承継し、その部分の報告セグメントを「畜産事業」に変更済みである（前期のセグメント情報も変更後の区分で記載）。当期中に実施済みの変更のため needsReview には入れていない。
- history: 沿革表は年月セルと事象文が分離した崩れた表である。第2ブロック（2002年10月〜2026年4月）は年月39件・事象39件で数が一致し、行順に対応づけた。対応は他の節で裏付けた（丸水長野県水の吸収合併2026年4月1日は【事業の内容】・【重要な契約等】と一致、三菱商事の株式売却2024年9月は関連当事者情報の注記「2024年9月30日の自己株式立会外買付」と一致、名証メイン市場移行2022年4月は市場再編の時期と一致）。
- history: ダイニチの子会社化は沿革の行順対応では2024年11月となり、MD&Aの経営成績の記載（「2024年11月に子会社化したダイニチグループ」）とも一致する。一方、MD&Aの経営戦略の進捗状況には「2025年11月1日に子会社化」とあり、有報内に食い違いがある。沿革・経営成績の2024年を採用し、食い違いは businessModel の needsReview に記録した。
- history: 1951年の設立時の資本金（250万円）は金額のため沿革には書いていない。支店・営業所の設置や小規模な子会社の設立・解散などの行は落とした（例：東京営業所設置1961年、㈱長野ミート設立1974年、魚信㈱設立1996年、AES㈱への社名変更2006年など）。
- history: 2000年の合弁会社の出資比率（当社14％）は沿革の項目には書かず、概要にとどめた。
- industry: 主たる業界は food とした。水産事業・畜産事業・一般食品事業・丸水長野県水グループのいずれも食料品の卸売（および一部製造）であり、外部顧客への売上高のほぼ全てが食品であるため。
- industry: 「その他」の物流・冷蔵倉庫事業は報告セグメントに含まれない区分で金額も小さい（外部顧客への売上高1,140百万円）ため、transportation は付けなかった。卸売そのものを表す閉じた分類の値はないが、取扱商品である食品で業界を表せるため taxonomyGaps にはしていない。
- relatedCompanies: mitsubishi-corporation（三菱商事）: 筆頭株主（11.64％、2026年3月31日現在）であり、関連当事者情報にも主要株主として商品の仕入取引が記載されている。【関係会社の状況】の4区分（親会社・子会社・持分法適用関連会社・その他の関係会社）には現時点で当たらないため major-shareholder とした。取引の向き（仕入）も印字されているため supplier とする案もあり得るが、有報自身の分類（主要株主）に従った。覆す場合はこの記録を参照。
- relatedCompanies: mitsubishi-shokuhin（三菱食品）: 【重要な契約等】に包括業務提携に関する契約（水産品流通におけるサプライチェーン構築、人材交流、拠点の相互活用）が記載された実質的な提携相手だが、候補の listing が「（コードリストにない）」のため結ばなかった。提携の事実は businessModel の flow に記載した。
- relatedCompanies: albis（アルビス）: 2000年に当社・三菱商事と合弁でアルビス・イースト・ソリューションズを設立したが、同社は2003年に当社の子会社となり2006年にAESへ改称、2017年に解散している。過去の合弁であり、現在の関係を示す記載がないため結ばなかった。
- relatedCompanies: 特定投資株式の各社は、保有目的が全銘柄共通の定型文（「主として○○事業における取引先であり、取引関係の維持強化のため保有」）のみで、相手固有の取引・提携の記載がないため結ばなかった。対象： aeon、ajinomoto、asahimatsu-foods、axial-retailing、blue-zones-holdings、hagoromo-foods、hokuto、house-foods-group、ichimasa-kamaboko、j-oil-mills、kagome、kato-sangyo、kewpie、kitano-construction、morinaga-and-co、moriya、mitsui-dm-sugar、nippn、om2-network、riken-vitamin、the-nisshin-oillio-group、toyo-suisan-kaisha、tsuruha-holdings、yamanaka、tokyu（ambiguous のうえ定型文のみ）。
- relatedCompanies: meiji-holdings（明治ホールディングス）: 特定投資株式に載るが保有は236株・計上額0百万円で、情報収集目的の名目的な保有と判断し結ばなかった。
- relatedCompanies: hachijuni-nagano-bank（八十二長野銀行）: 大株主（4.99％）に載るが銀行であり、資金調達に関わる金融機関のため結ばなかった。hokuhoku-financial-group、mizuho-financial-group も同様に金融機関で、保有目的も定型文のため結ばなかった。
- relatedCompanies: nichirei（ニチレイ）: 大株主として印字されているのは同社の子会社である株式会社ニチレイフレッシュ（2.80％）であり、ニチレイ自体ではないため結ばなかった。
- relatedCompanies: welcia-holdings、yaoko、ascot: listing が「（コードリストにない）」のため結ばなかった（ascot の一致は、沿革に現れる当社の子会社アスコット株式会社の解散記事であり、候補の不動産会社とは別会社）。
- relatedCompanies: 断片・一般語の一致で結ばなかった候補： en（エンゲージメント等）、career（キャリアデザイン研修）、vision（経営ビジョン）、base-4481・base（営業利益ベース／新基幹システム「M-BASE」）、core（コアビジネス）、corona（新型コロナウイルス感染症）、land（信州ブランド）、path（キャリアパス）、port（リテールサポート）、step（ステップ）、lec（フレックスタイム）、maruzen（子会社のマルゼンフーズであり候補のマルゼンとは別会社）、the-lead（人材像の「リードできる人」）。
- relatedCompanies: 候補にない相手の記録： 国分グループ本社株式会社は大株主（5.13％、2026年3月31日現在）の事業会社だが related-candidates にないため結ばなかった。日本農産工業株式会社（三菱商事の子会社）は当社グループの仕入先として関連当事者情報に記載があるが候補にないため結ばなかった。当社の連結子会社・持分法適用関連会社（丸水長野県水、ダイニチ、信田缶詰、大信畜産工業、ヨネクボ、北信食肉センター等）はすべて未上場で候補にない。
- terms: 登録候補（助言のみ）: フルライン食品卸売（生鮮三品をそろえる食品卸売の形態）、養殖魚事業（生産・飼料・集荷を一体で手がける事業）、リテールサポート（小売店支援機能）、クロスドックセンター（在庫を持たず仕分け・中継する物流拠点）。

## 要確認（status に反映）

- businessModel: 期末後のグループ再編：連結子会社であった株式会社丸水長野県水は、2023年5月26日の取締役会決議と2025年12月26日の合併契約に基づき、2026年4月1日に当社へ吸収合併され消滅しました（【重要な後発事象】・【重要な契約等】）。本登録は2026年3月31日現在の構成（丸水長野県水グループは報告セグメントの一つ）に基づいており、合併の事実は沿革と事業説明にも完了した事項として記載しています。
- businessModel: ダイニチの子会社化の時期について有報内に食い違いがあります。【沿革】の行順対応と MD&A の経営成績の記載は2024年11月ですが、MD&A の経営戦略の進捗状況には「2025年11月1日に子会社化」と記載されています。本登録は2024年11月を採用しています（2025年3月期に従業員数と投資キャッシュ・フローが大きく増えていることも2024年説を裏付けます）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
