# ハウス食品グループ本社 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ハウス食品グループ本社株式会社 |
| 証券コード | 2810 |
| docID（データを取り出した文書） | `S100YD7A` |
| 原本 docID | `S100YD7A` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD7A.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ハウス食品グループ本社株式会社 / 2810 / docID S100YD7A（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 66 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
house-foods-group: 10 件の数値を有報XBRLと照合
有報: ハウス食品グループ本社株式会社 有価証券報告書－第80期(2025/04/01－2026/03/31) (docID S100YD7A)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
house-foods-group: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…流、販売などの費用を差し引いた残りが利益になります。2026年3月期のは7,…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes: 2022年改正の税効果会計基準は第79期期首から適用され、子会社株式等の売却に係る見直しは第78期の指標に遡及適用されている（第78期への影響なし）。前期有報との修正再表示チェックは全行一致だったが、遡及適用の事実自体は系列の基準に関わるため、mitani・tokyu-construction・keihan-holdings の先例どおり financialNotes に記録した。本文中の金額（売上高・純利益）は影響を受けていない。
- businessModel: 重要な後発事象は自己株式の取得・消却（2026年5月11日取締役会決議）のみで、資本政策のため本文・needsReview ともに入れず、ここに記録する（glory の先例）。
- businessModel: 純利益の減少理由として有報が挙げる減損損失や事業譲渡益・売却益は、金額を伴う説明になるため本文には書かず、純利益の金額のみを記載した。
- businessModel: 中期計画の数値目標（KPI・配当方針の数値など）は投資・配当の語に当たるため本文に書いていない。戦略は定性的に要約した。
- businessStructure: 事業の並び順は、セグメント注記の2026年3月期「外部顧客への売上高」の大きい順（香辛・調味加工食品事業126,812百万円→外食事業65,393百万円→海外食品事業62,860百万円→その他食品関連事業45,418百万円→健康食品事業16,323百万円）。5つとも報告セグメントである。
- businessStructure: 株式会社デリカシェフの連結除外（2026年1月15日、株式譲渡）は当事業年度中の出来事のため、その他食品関連事業の説明に事実として記載した。提出後の予定事項ではないため needsReview には入れていない。
- businessStructure: 金額はすべてセグメント注記の外部顧客への売上高（百万円）で、MD&Aのセグメント間取引消去前の金額（合計ベース）とは異なる。
- history: 沿革は年月と事象が同じ行に印字された表で、崩れた表ではないため行順の対応づけは不要だった。
- history: 創業時の資本金197,500円は、文章規則（資本金の金額は書かない）に従い記載していない。
- history: 工場の竣工、研究所の設置、小規模な子会社の設立・清算などの行は省いた（奈良工場・関東工場の竣工、朝岡スパイスの子会社化、マロニーの子会社化、ギャバンの子会社化など）。主要な事業の転機と上場・社名変更・持株会社化を優先して17件を収録した。
- history: 1988年の決算期変更（11月30日→3月31日）は5年間の数値の範囲より前の出来事であり、沿革の事実としてのみ記載した。現在の系列に影響する決算期変更ではないため needsReview には入れていない。
- industry: 主たる事業は香辛・調味加工食品事業（外部顧客への売上高126,812百万円、連結の約4割）を中心とする食品の製造販売であり、food を主たる業界とした。
- industry: 外食事業は報告セグメントとして独立開示されているが、閉じた分類にレストラン運営に合う値がなく、食品グループの事業として food に含めた。entertainment は付けていない。
- industry: その他食品関連事業（食材の輸出入販売・輸送）は報告セグメントだが、グループ内向けの機能を含む複合的な区分で金額も食品事業と一体のため、trading や transportation は付けていない。
- industry: 閉じた分類に主たる事業が合う値があるため taxonomyGaps は付けていない。
- relatedCompanies: 結んだのは2社だけである。壱番屋は【関係会社の状況】の連結子会社、加藤産業は【関連情報】の主要な顧客として相手固有の売上高が印字されている。
- relatedCompanies: ichibanya: 【関係会社の状況】で連結子会社（外食事業、議決権51.00％）と印字されており、subsidiary として結んだ。
- relatedCompanies: kato-sangyo: 【関連情報】の主要な顧客として売上高36,756百万円（関連セグメント：香辛・調味加工食品事業、健康食品事業）が印字されており、customer として結んだ。特定投資株式の保有目的は定型句だが、主要な顧客としての開示が関係性の根拠である。
- relatedCompanies: mitsubishi-shokuhin: 【関連情報】の主要な顧客として売上高17,931百万円が印字されるが、候補の listing が「（コードリストにない）」であり上場区分を確認できないため結ばなかった。なお、特定投資株式は当事業年度に売却し、期末時点では保有していない。
- relatedCompanies: ajinomoto: 特定投資株式の保有目的は全銘柄共通の定型句（「戦略的な取引関係の維持・強化を目的として保有しております」）のみ。2001年に設立した合弁会社上海ハウス味の素食品社は2010年に清算済みで、過去の事項のため結ばなかった。
- relatedCompanies: tbs-holdings: 特定投資株式の保有目的が全銘柄共通の定型句（「戦略的な取引関係の維持・強化」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: oriental-land: tbs-holdings と同じく、保有目的が定型句（「戦略的な取引関係の維持・強化」）のみのため結ばなかった。
- relatedCompanies: nissin-foods-holdings: tbs-holdings と同じく、保有目的が定型句（「戦略的な取引関係の維持・強化」）のみのため結ばなかった。
- relatedCompanies: nisshin-seifun-group: 特定投資株式の保有目的が全銘柄共通の定型句（「原材料仕入における協力関係の維持・強化を目的として保有しております」）のみのため結ばなかった。
- relatedCompanies: toyo-seikan-group-holdings: nisshin-seifun-group と同じく、保有目的が定型句（「原材料仕入における協力関係の維持・強化」）のみのため結ばなかった。
- relatedCompanies: toyota-tsusho: nisshin-seifun-group と同じく、保有目的が定型句（「原材料仕入における協力関係の維持・強化」）のみのため結ばなかった。
- relatedCompanies: dai-nippon-printing: nisshin-seifun-group と同じく、保有目的が定型句（「原材料仕入における協力関係の維持・強化」）のみのため結ばなかった。
- relatedCompanies: takasago-international: nisshin-seifun-group と同じく、保有目的が定型句（「原材料仕入における協力関係の維持・強化」）のみのため結ばなかった。
- relatedCompanies: semba-tohka-industries: nisshin-seifun-group と同じく、保有目的が定型句（「原材料仕入における協力関係の維持・強化」）のみのため結ばなかった。
- relatedCompanies: dynapac: nisshin-seifun-group と同じく、保有目的が定型句（「原材料仕入における協力関係の維持・強化」）のみのため結ばなかった。
- relatedCompanies: hisaka-works: 特定投資株式の保有目的が定型句（「設備関係取引における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 保有目的が「金融・資金取引における協力関係の維持・強化」で、資金調達が理由のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group: mitsubishi-ufj-financial-group と同じく、金融・資金取引が理由のため結ばなかった。
- relatedCompanies: itochu-shokuhin: 候補の listing が「（コードリストにない）」であるうえ、公開買付けに応じたことにより本有価証券報告書提出日現在で全株式を売却済みのため結ばなかった。
- relatedCompanies: yaoko: 候補の listing が「（コードリストにない）」。保有は2025年10月1日の株式移転でブルーゾーンホールディングスに置き換わっており、当社が保有する相手ではないため結ばなかった。
- relatedCompanies: nousouken: 候補の listing が「（コードリストにない）」であるうえ、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: aeon: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: seven-and-i-holdings: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: medical-ikkou-group: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: h2o-retailing: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: central-forest-group: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: yamae-group-holdings: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: united-super-markets-holdings: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: ohki-healthcare-holdings: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: trial-holdings: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: life: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: arcs: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: valor-holdings: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: blue-zones-holdings: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: heiwado: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: yoshinoya-holdings: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: mammy-mart-holding: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: axial-retailing: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: oie-sangyo: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: albis: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: okuwa: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: yamazawa: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: retail-partners: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: maruyoshi-center: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: eco-s: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: maruichi: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「製品販売における協力関係の維持・強化を目的として保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: blue-zones-holdings（補足）: 保有株式数は4,400株と小さく、2025年10月1日の株式移転によりヤオコーから置き換わった保有である。
- relatedCompanies: seki: 「情報セキュリティ」などの一般語の断片一致で、セキ株式会社への言及ではないため結ばなかった。
- relatedCompanies: port: 「人材ポートフォリオ」の断片一致のため結ばなかった。
- relatedCompanies: career: 「キャリア採用」の断片一致のため結ばなかった。
- relatedCompanies: innovation: 「イノベーションを創出する」の断片一致のため結ばなかった。
- relatedCompanies: base-4481: 「連結ベース」の断片一致のため結ばなかった。
- relatedCompanies: daiwa: 奈良県大和郡山市の地名や、子会社化した堀江大和屋への言及で、株式会社大和への言及ではないため結ばなかった。
- relatedCompanies: kamigumi: 該当する固有名詞の記載がなく、一般語の断片一致のため結ばなかった。
- relatedCompanies: slogan: 「スローガン」という一般語の一致のため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス感染症」への言及で、株式会社コロナへの言及ではないため結ばなかった。
- relatedCompanies: garden: 米国子会社の所在地「ガーデングローブ」の断片一致のため結ばなかった。
- relatedCompanies: ishin: 一般語の断片一致のため結ばなかった。
- relatedCompanies: nac: 製造設備の表中の断片一致のため結ばなかった。
- relatedCompanies: rent: 「タレントマネジメント」などの断片一致のため結ばなかった。
- relatedCompanies: stream: 「メインストリーム」の断片一致のため結ばなかった。
- relatedCompanies: the-lead: 「リードする役割」の断片一致のため結ばなかった。
- relatedCompanies: 候補にない相手（記録のみ）: F-LINE株式会社は【関係会社の状況】の持分法適用関連会社（議決権26.08％、当社グループの製品の一部を輸送）だが、未上場で候補にないため結ばなかった。
- relatedCompanies: 候補にない相手（記録のみ）: サンヨー缶詰株式会社は持分法適用関連会社（議決権30.97％、当社グループの製品の一部を製造）だが、未上場で候補にないため結ばなかった。
- relatedCompanies: 候補にない相手（記録のみ）: 【大株主の状況】の上位は信託銀行、創業家系のハウス興産株式会社・株式会社HKL（いずれも未上場）、財団、銀行、保険会社であり、結べる事業会社の大株主はいなかった。
- relatedCompanies: 候補にない相手（記録のみ）: 株式会社ギャバン（2004年業務提携、2016年に子会社化し現ハウスギャバン株式会社）、株式会社武蔵野（デリカシェフの譲渡先）はいずれも未上場で候補にないため結ばなかった。
- terms: 登録候補（助言のみ）: バリューチェーン（VC）（スパイス系・大豆系・機能性素材系の3つを軸とする会社の経営概念）、ウコンの力（健康食品の主力商品）、C1000（健康食品事業の飲料ブランド）、バーモントカレー（1963年発売のカレールウの主力ブランド）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
