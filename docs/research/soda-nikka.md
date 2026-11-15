# ソーダニッカ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ソーダニッカ株式会社 |
| 証券コード | 8158 |
| docID（データを取り出した文書） | `S100YFPG` |
| 原本 docID | `S100YFPG` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFPG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ソーダニッカ株式会社 / 8158 / docID S100YFPG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
soda-nikka: 10 件の数値を有報XBRLと照合
有報: ソーダニッカ株式会社 有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YFPG)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
soda-nikka: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象（株式会社日進の吸収合併）は、連結財務諸表・財務諸表のいずれの注記にも印字されており、needsReviewに記録した。重要な契約等は「該当事項はありません」で、重要な設備の新設等もない。研究開発活動も「該当事項はありません」である。
- businessModel: 前期有報との修正再表示チェックは全行一致（差異なし）で、経営指標等の注記にも遡及適用や会計方針の変更に関する注記はないため、financialNotesは付けていない。変則決算の印字（irregularPeriods）もない。
- businessModel: 経営成績の分析に印字された中間の利益の金額や特別損益の金額と内訳は本文に書いていない。本文の財務数値は連結売上高と親会社株主に帰属する当期純利益だけである。
- businessModel: 中期経営計画「Go forward STAGE3」の最終年度目標（連結当期純利益や株主還元に関する比率などの数値）は、将来に関する事項と比率のため本文に転記していない。経営方針に印字された「資本コストや株価を意識した経営」の言及も、投資用語の観点から本文には引用していない。
- businessModel: 3セグメントの外部顧客への売上高の印字値の合計は66,691百万円で、連結売上高の印字値66,692百万円と1百万円異なる（印字値の丸めによる差異）。品目別販売実績の内訳の合計も印字値の丸めにより連結売上高と一致しないため、内訳の合計には触れていない。
- businessModel: 保有株式の銘柄数の増減理由に印字された株式分割は、いずれも保有先の会社（日鉄鉱業、大日精化工業）自身の株式分割であり、当社の株式分割ではない。当社の株式分割の印字はない。
- businessModel: wikipedia.json は記事「ソーダニッカ」が見つかり、有報に無い出自（戦前の販売統制会社）への言及があるが、有報の沿革は1947年の曹達商事株式会社の設立から始まっており、有報に基づく登録の原則から出典には加えていない。
- businessStructure: 事業の並びは報告セグメントの外部顧客への売上高の大きい順（化学品事業44,319百万円、機能材事業14,490百万円、その他事業7,882百万円）とした。3セグメントの印字値の合計は66,691百万円で、連結売上高の印字値66,692百万円と1百万円異なる（印字値の丸めによる差異で、そのまま印字どおりに記載した）。
- businessStructure: 連結子会社は2026年3月31日現在の8社で、株式会社日進を含む。株式会社日進は2026年4月1日に当社へ吸収合併され解散している（決算日後の出来事のため、needsReviewに記録した）。
- businessStructure: セグメント利益などの中間の利益の金額は書いていない。子会社ごとの金額は独立して開示されていないため、その旨を明記した。
- history: 沿革の表は年月と事象が本文中に連続して印字されており、各行の日付は事象文の冒頭に含まれる形で対応づけた。
- history: 沿革の冒頭の営業所開設の行（名古屋・小樽・大阪・富士・仙台・小倉・高松など）や、広島営業所の支店昇格、駐在員事務所の開設などの行は、主要な出来事を選ぶ中で省いた。
- history: 沿革の末尾に印字された2026年4月の株式会社日進の吸収合併は決算日（2026年3月31日）後の出来事のため、沿革の行としては独立させず、株式会社日進の子会社化の行と needsReview に記録した。本登録は2026年3月31日現在の構造に基づく。
- history: title に会社リンク記法は使っていない。資本金の額は沿革に印字がなく、書いていない。
- industry: 化学品専門商社であり、東京証券取引所の業種分類も卸売業であるため、主たる業界は trading とした（卸売会社の先例と同じ）。取扱品目は無機薬品・有機薬品・合成樹脂などの化学品が中心（化学品事業と機能材事業で外部顧客への売上高の約9割）のため、第二の業界として chemicals を付けた。その他事業の不動産賃貸は規模が小さいため、業界は付けていない。
- relatedCompanies: 結んだ関連企業は0社である。特定投資株式の保有目的は全銘柄を通じて「仕入先及び販売先企業との関係強化のため」「販売先企業との関係強化のため」「仕入先企業との関係強化のため」「金融機関との関係強化のため」のいずれかの定型句のみで、銘柄ごとに個別化された取引内容や提携の事実の印字がないため、定型句だけでは結ばない先例（コア、ダイナパック）に従い、候補の特定投資株式の銘柄はいずれも結ばなかった。対象は alps-alpine、astellas-pharma、daicel、dainichiseika-color-and-chemicals-mfg、daio-paper、dks、furukawa、hokuetsu、imuraya-group、kaneka、kanto-denka-kogyo、kumiai-chemical-industry、lion、mitsubishi-chemical-group、mitsubishi-gas-chemical、nankai-chemical-industry、nichicon、nippon-kayaku、nippon-paper-industries、nippon-soda、nissan-chemical-corporatiom、nittetsu-mining、nitto-boseki、oji-holdings、okura-industrial、rengo、sakai-chemical-industry、shikoku-kasei-holdings、sumitomo-chemical、toagosei、tokai-carbon、tokuyama、taiyo-kisokogyo などである。
- relatedCompanies: 大株主のうち候補に含まれる central-glass（4.89％）、osaka-soda（1.95％）、tosoh（1.81％）、nippon-beet-sugar-manufacturing（1.53％）、kureha（1.27％）についても、当社との関係の印字は上記の定型句による相互の株式保有にとどまり、個別の提携等の事実がないため結ばなかった。大株主の筆頭は信託口（7.28％）で、候補に含まれない AGC株式会社（4.89％）、株式会社ADEKA（4.23％）についても、関係の印字は同じ定型句の株式保有のみのため結んでいない。ADEKAは特定投資株式の最大の保有銘柄でもあるが、保有目的は定型句のみである。
- relatedCompanies: 金融機関の持株会社である mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group、resona-holdings は、保有目的が「金融機関との関係強化のため」の定型句のみで、取引銀行そのものとも別の法人であるため結ばなかった。
- relatedCompanies: daiichi-sankyo と sharp は、当事業年度に保有株式数がゼロとなった（売却済み）ため結ばなかった。
- relatedCompanies: trust（日本マスタートラスト信託銀行株式会社（信託口））は信託口であり、関連企業としては結ばなかった。port、vision、base-4481、step、seki（ambiguous）、suzuki-6785（ambiguous）は一般語・人名の一致のみである。nac は、印字されるのがレゾナック・ホールディングス株式会社であり、株式会社ナックとは別の会社のため結ばなかった。
- relatedCompanies: 連結子会社8社（ソーダニッカビジネスサポート株式会社、曹達日化商貿（上海）有限公司、PT.SODA NIKKA INDONESIA、株式会社日本包装、SODA NIKKA VIETNAM CO.,LTD.、モリス株式会社、株式会社日進、株式会社野津商店）はグループ内の会社のため、関連企業としては結ばなかった。
- terms: 助言: 用語「ケミカルセンター」は、同社が化学品の保管・出荷のために各地に展開する、タンク等を備えた物流拠点の呼び方で、沿革と主要な設備の状況に印字されている（富士田子の浦、広島大野、仙台七ヶ浜、釧路など）。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、当社の完全子会社である株式会社日進の吸収合併が印字されている。株式会社日進は中部・関西・北陸地区において包装資材・機器等の販売を行う、その他事業の連結子会社である。2025年11月17日開催の取締役会で吸収合併が決議され、2026年4月1日に当社を存続会社とする吸収合併により株式会社日進は解散した。本登録は2026年3月31日現在の構造（連結子会社8社、株式会社日進を含む）に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
