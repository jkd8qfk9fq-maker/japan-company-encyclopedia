# 高砂香料工業 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 高砂香料工業株式会社 |
| 証券コード | 4914 |
| docID（データを取り出した文書） | `S100YGT4` |
| 原本 docID | `S100YGT4` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGT4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 高砂香料工業株式会社 / 4914 / docID S100YGT4（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 42 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takasago-international: 10 件の数値を有報XBRLと照合
有報: 高砂香料工業株式会社 有価証券報告書－第100期(2025/04/01－2026/03/31) (docID S100YGT4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
takasago-international: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造、販売などの費用を差し引いた残りが利益になります。2026年3月期のは9,…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報と全系列一致（差異なし）。組替えに関する警告はパックに無かった。
- businessModel: 2025年10月１日付で普通株式１株につき５株の株式分割を実施しているが、影響は１株当たり指標のみで、５年間の売上高・純利益等の系列には影響しないため financialNotes には入れず、ここに記録する。
- businessModel: 中期経営計画NGP-2の数値目標（DOE・配当性向を含む）は文章の規則により本文に引用していない。基本方針のみを perspectives に記載した。
- businessModel: MD&Aに印字された営業利益・経常利益・セグメント利益・部門別営業利益の金額と増減率は、文章の規則により本文に書いていない。売上高と親会社株主に帰属する当期純利益のみを引用した。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されており、提出後の予定事項はない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高（2026年3月期）の大きい順（日本76,968百万円、米州55,575百万円、アジア50,153百万円、欧州42,395百万円）。4つとも報告セグメントであり、「その他」にあたる区分はない。各セグメントには香料事業のほか不動産賃貸等のその他の活動も含まれる旨がセグメント概要に印字されている。
- businessStructure: 製品区分（フレーバー、フレグランス、アロマイングリディエンツ、ファインケミカル）は全地域共通の品目であり、金額は【関連情報】で連結全体でのみ開示されているため、地域別セグメントの children にはしていない。
- businessStructure: 米州のTakasago International Corporation (U.S.A.)とアジアのTakasago International (Singapore) Pte. Ltd.の売上高は【関係会社の状況】の注記に印字された売上高（連結会社相互間の内部売上高を除く）であり、いずれも売上高である。
- businessStructure: listings の market は、表紙の「東京証券取引所プライム市場」の印字による。
- history: 【沿革】は年月と事象がインラインで対になって印字されており、年単位で採用した。落とした行: 本社移転（1920年７月、1962年４月、1980年12月、1998年11月）、支店・出張所の開設・改称（1927年７月、1956年11月、1957年４月）、磐田工場竣工（1968年11月）、鹿島工場竣工（1980年３月）、国内子会社の設立（1977年１月 高栄産業、1985年９月 高砂フードプロダクツ、1986年11月 高砂インターナショナルコーポレーション）、米国子会社の合併・改称（1987年10月）、平塚の新総合研究所竣工（1993年６月）、高砂珈琲の吸収合併（1997年６月）、Wessel Fragrances,Inc.からの事業譲受（2008年11月）、ブラジルの新事業所開設（2011年10月）、高砂香料西日本工場の設立（2013年７月）、シンガポール子会社の新事業所移転（2014年３月）、三原工場竣工（2015年10月）。
- history: Wikipediaの記事は「日本最大の香料メーカー」「世界シェア５番目」等の順位・シェアを含むため、文章の規則により順位・数値は使わず、出典にも加えていない。
- industry: 主たる業界は、全ての報告セグメントが香料（フレーバー、フレグランス、香料素材、精密化学品）の製造・販売であることから chemicals とした。東京証券取引所の業種も化学に分類されている。
- industry: フレーバーは飲料・食品メーカーへ販売する素材であり、同社自身が食品を製造・販売するものではないため food は付けていない。
- industry: ファインケミカルには医薬品中間体を含むが、製品別の売上高は9,106百万円と小さく、報告セグメントは地域別のみで独立した医薬品事業の開示はないため pharmaceuticals は付けていない。
- relatedCompanies: lion: 製品販売取引が印字され、保有株式数も1,309,485株と実質的な規模であるため customer として結んだ。
- relatedCompanies: t-hasegawa: 製品販売取引及び原料購買取引の両方が印字されているため、向きを一方に寄せず business-partner とした判断を記録する。
- relatedCompanies: riken-vitamin: 保有は6,798株と小さいが、保有目的が製品販売取引と相手固有に印字されており、100株・計上額０百万円の情報収集目的の保有には当たらないため customer として結んだ。
- relatedCompanies: mitsubishi-ufj-financial-group: 結ばなかった。特定投資株式の保有目的が「資金調達取引等」であり、資金調達が理由の金融機関のため。【大株主の状況】に載る株式会社三菱ＵＦＪ銀行（2026年3月31日現在4.9％）も金融機関のため major-shareholder として結んでいない。
- relatedCompanies: iyogin-holdings: 結ばなかった。保有目的が「資金調達取引等」のため。
- relatedCompanies: mebuki-financial-group: 結ばなかった。保有目的が「資金調達取引等」のため。
- relatedCompanies: the-kiyo-bank: 結ばなかった。保有目的が「資金調達取引等」の銀行のため。【大株主の状況】に2.4％で載るが、金融機関のため結んでいない。
- relatedCompanies: shizuoka-financial-group: 結ばなかった。保有目的が「資金調達取引等」のため。
- relatedCompanies: yokohama-financial-group: 結ばなかった。保有目的が「資金調達取引等」のため。
- relatedCompanies: marusan-securities: 結ばなかった。保有目的が「金融取引等」であり、証券会社との金融取引が理由のため。
- relatedCompanies: hisamitsu-pharmaceutical: 結ばなかった。当事業年度に全て売却しており、2026年3月31日現在で保有していないため（listing もコードリストにない）。
- relatedCompanies: ajinomoto: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: asahi-group-holdings: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: astena-holdings: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: daisho: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: dks: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: earth: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: ezaki-glico: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: fumakilla: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: imuraya-group: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: ito-en: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: kanro: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: megmilk-snow-brand: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: morinaga-and-co: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: rohto-pharmaceutical: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: s-t: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: the-nisshin-oillio-group: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため。
- relatedCompanies: tokio-marine-holdings: 結ばなかった。当事業年度に全て売却しており、期末時点で保有していないため（保険会社でもある）。
- relatedCompanies: en: 結ばなかった。「アロマイングリディエンツ」等の語の断片の一致（ambiguous）で、有報はエン株式会社について取引・提携を述べていないため。
- relatedCompanies: innovation: 結ばなかった。「オープンイノベーション」の語の一致のため。
- relatedCompanies: port: 結ばなかった。「製品ポートフォリオ」の語の一致のため。
- relatedCompanies: zero: 結ばなかった。「ネットゼロ目標」の語の一致（ambiguous）のため。
- relatedCompanies: core: 結ばなかった。「スコアリング」等の語の断片の一致（ambiguous）のため。
- relatedCompanies: seki: 結ばなかった。「セキュリティ」等の語の断片の一致（ambiguous）のため。
- relatedCompanies: base-4481: 結ばなかった。「プラントベース食品」の語の一致のため。
- relatedCompanies: slogan: 結ばなかった。「スローガンとする」の語の一致のため。
- relatedCompanies: trust: 結ばなかった。コードリストになく、一致は日本マスタートラスト信託銀行（信託口）の名称の一部であるため。
- relatedCompanies: freee: 結ばなかった。「リスクフリーレート」の語の一致のため。
- relatedCompanies: land: 結ばなかった。「ブランド」の語の一部であるため。
- relatedCompanies: ricoh: 結ばなかった。「リコール」の語の一致のため。
- relatedCompanies: tis: 結ばなかった。一致は自社の連結子会社Takasago International (Singapore) Pte. Ltd.の略称「TIS」の印字であり、TIS株式会社ではないため。
- relatedCompanies: 候補外の注記: 株式会社meito（753,096株、製品販売取引）と株式会社ＡＤＥＫＡ（285,200株、製品販売取引及び原料購買取引）は特定投資株式に印字されているが、候補リストにないため結んでいない。持分法適用関連会社の厦門華日食品有限公司（議決権42.00％）は未上場であり対象外。連結子会社42社はいずれも未上場である。
- terms: 助言: 「フレーバー」は用語集の登録候補になります。飲料、冷菓、菓子、調理加工食品等に使用される食品用の香料を指し、同社の最大の品目です。
- terms: 助言: 「フレグランス」は用語集の登録候補になります。衣料用洗剤・柔軟剤、香粧品、芳香剤等に使用される香料を指します。
- terms: 助言: 「アロマイングリディエンツ」は用語集の登録候補になります。メントール、ムスク等の香料素材そのものを指し、同社は素材の合成も手がけています。
- terms: 助言: 「ファインケミカル」は用語集の登録候補になります。医薬品中間体、触媒、有機電子材料等の精密化学品を指します。
- terms: 助言: 「特定投資株式」は用語集の登録候補になります。純投資目的以外で保有する他社の株式を指し、保有目的とあわせて有報に開示されます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
