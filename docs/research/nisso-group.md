# 日創グループ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日創グループ株式会社 |
| 証券コード | 3440 |
| docID（データを取り出した文書） | `S100X6MC` |
| 原本 docID | `S100X6MC` |
| 提出日（原本） | 2025-11-26 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X6MC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日創グループ株式会社 / 3440 / docID S100X6MC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nisso-group: 10 件の数値を有報XBRLと照合
有報: 日創グループ株式会社 有価証券報告書－第42期(2024/09/01－2025/08/31) (docID S100X6MC)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-08-31","previousFiling":7534636000,"latestFiling":7534000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-08-31","previousFiling":7374639000,"latestFiling":7374000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-08-31","previousFiling":12548788000,"latestFiling":12548000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-08-31","previousFiling":17694365000,"latestFiling":17694000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-08-31","previousFiling":427125000,"latestFiling":427000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-08-31","previousFiling":154632000,"latestFiling":154000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-08-31","previousFiling":1523307000,"latestFiling":1523000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-08-31","previousFiling":1094600000,"latestFiling":1094000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-08-31","previousFiling":528604000,"latestFiling":528000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-08-31","previousFiling":396760000,"latestFiling":396000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-08-31","previousFiling":416454000,"latestFiling":416000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-08-31","previousFiling":1362680000,"latestFiling":1362000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-08-31","previousFiling":12220672000,"latestFiling":12220000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-08-31","previousFiling":14482132000,"latestFiling":14482000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-08-31","previousFiling":21886443000,"latestFiling":21886000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-08-31","previousFiling":22405569000,"latestFiling":22405000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-08-31","previousFiling":9735120000,"latestFiling":9735000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-08-31","previousFiling":9727988000,"latestFiling":9727000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-08-31","previousFiling":11163929000,"latestFiling":11163000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-08-31","previousFiling":12058966000,"latestFiling":12058000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nisso-group: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「日創グループ株式会社（旧会社名　日創プロニティ株式会社）」が EDINET の提出者名「日創グループ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は経営指標等・セグメント情報・MD&Aの百万円の印字をそのまま使った（換算・切り捨てはしていない）。セグメント別の外部顧客への売上高は、金属加工8,002百万円、建設6,796百万円、タイル4,782百万円、化成品2,734百万円、その他709百万円で、報告セグメント計と連結売上高との間には印字上の調整額と丸めの差異があるため、連結売上高は印字の23,037百万円をそのまま引用した。
- businessModel: 第42期より金額の表示単位を千円単位から百万円単位に変更し、第41期以前も百万円単位に組み替えて表示しているため、前期有報との修正再表示チェックの差異はすべて百万円未満の端数差異であり、経営指標の基礎の変更ではない。表示だけの変更のため financialNote にはせず、ここに記録する。
- businessModel: 「法人税、住民税及び事業税等に関する会計基準」（企業会計基準第27号）等を第42期の期首から適用しているが、当該会計方針の変更による連結財務諸表への影響はないと印字されているため、financialNote にはしなかった。
- businessModel: 第4次中期経営計画の定量目標（最終年度の売上高300億円、EBITDA27億円、ROE8％）と、会社が重視する経営指標（EBITDA、ROE）は、投資指標や損益指標の目標であるため本文と戦略には書かず、ここに記録する。中期経営戦略の第4項目の正式名称は「資本コストや株価を意識した経営の推進（ROE8％）」で、本文では投資の語を除いて要約した。
- businessModel: MD&Aに印字されたセグメント利益、受注高・受注残高、キャッシュ・フローの内訳、自己資本比率は本文に書かなかった（売上高と純利益のみ）。
- businessModel: 株式会社泉製作所は2025年6月に株式を取得して連結子会社としたが、みなし取得日が2025年8月31日（当連結会計年度末）のため、当期の化成品事業の売上高に同社の業績は含まれていない。この事実は businessStructure の化成品事業の説明と沿革に記録した。
- businessModel: 提出後の経過確認（2026年11月13日、EDINETで確認）: 第43期（2026年8月期）の有価証券報告書は法定提出期限（2026年11月30日）前で未提出であり、前期の提出日は11月26日だった。当社は2026年4月に半期報告書、同年10月まで臨時報告書を提出しており、提出が止まっている状態ではない。パイプラインの14か月ルールによる保留はこの確認をもって承認（ack）し、第42期の有報で登録を進めた。
- businessModel: Wikipediaの記事は証券コードで同一性を確認できたが、抜粋は有報の事実の言い換えにとどまるため使わなかった。
- businessModel: suppliers はこのツリーのスキーマに無いため付けていない。有報に個別の仕入先名の開示はない。
- businessStructure: 本登録は2025年8月31日現在の体制に基づく。当社と連結子会社13社、非連結子会社3社、関連会社2社でグループを構成する。【関係会社の状況】には連結子会社13社のみが個別に印字され、非連結子会社と関連会社は個別名称が印字されていないため、本文では社数を記すにとどめた。
- businessStructure: 2025年6月1日付で会社分割による持株会社体制へ移行し、当社は日創プロニティ株式会社から日創グループ株式会社に、金属加工事業を承継した日創プロニティ分割準備株式会社は日創プロニティ株式会社に、それぞれ商号を変更した。【関係会社の状況】の日創プロニティ株式会社は承継後の事業会社である。
- businessStructure: 報告セグメントの「ゴム加工事業」は、大鳳株式会社、フォームテックス株式会社及び株式会社泉製作所が連結子会社となったことに伴い、当期より「化成品事業」に名称変更された（セグメント情報への影響はないと印字されている）。
- businessStructure: 【関係会社の状況】に印字された日創エンジニアリング株式会社（売上高6,796百万円）とニッタイ工業株式会社（売上高4,782百万円）の主要な損益情報等は各子会社の数値であり、セグメント売上高と同額の売上高以外は本文に書かなかった。
- businessStructure: 福岡証券取引所については、表紙に市場区分の印字がないため listings の market を付けていない（2019年に本則市場へ市場変更したことは沿革に記録）。
- businessStructure: 提出後の経過確認（2026年11月13日、EDINETで確認）: 第43期（2026年8月期）の有価証券報告書は法定提出期限（2026年11月30日）前で未提出であり、前期の提出日は11月26日だった。当社は2026年4月に半期報告書、同年10月まで臨時報告書を提出しており、提出が止まっている状態ではない。パイプラインの14か月ルールによる保留はこの確認をもって承認（ack）し、第42期の有報で登録を進めた。
- history: 沿革表は年月と事象が対応して印字されており、行順で対応づけた。1978年の創業は沿革の前文の印字に基づく。
- history: 次の行は主要な転機ではないため落とした: 各工場の開設・増棟・移転・閉鎖（1986年福岡工場、1991年志免工場、1996年篠栗工場、2014年福島工場、2022年福島工場第2棟など）、営業所の開設・閉鎖（1999年鹿児島出張所、2011年東京営業所、2011年大阪営業所、2013年仙台営業所、2014年福島営業所）、2000年のISO9001認証取得、2020年の本店所在地の移転。
- history: 子会社の株式取得のうち、綾目精機株式会社（2017年）、株式会社ダイリツ（2018年）、株式会社ワタナベテクノス（2023年）、カナエテ株式会社の設立と株式会社Japonlineの事業譲受（2023年）、シキファニチア株式会社（2024年、非連結子会社）、株式会社たなかハウジングの株式取得と日創不動産株式会社への商号変更（2025年、非連結子会社）、株式会社穴井工務店（2025年、非連結子会社）は、事業の転機として扱った取得と分けてここに記録し、沿革の行にはしなかった。子会社間の吸収合併（2022年の株式会社壹会、2023年の株式会社エヌ・テクノスとエヌ・トレーディング株式会社、2024年の株式会社壹会）もグループ内の再編のため行にしていない。
- history: 沿革に資本金の金額は印字されておらず、行にも含めていない。
- industry: 主たる業界は machinery とした。最大の報告セグメントは金属加工事業（外部売上高8,002百万円）で、金属製品の企画・設計・加工・製造・販売であり、閉じた分類に金属製品製造の区分が無いため、製造業として最も近い machinery を選んだ。建設事業（6,796百万円）があるため construction を、ゴム・ウレタン・樹脂成型製品の化成品事業（2,734百万円）があるため chemicals を、それぞれ2つ目以降に付けた。タイル事業は建材の製造販売で、construction の範囲として扱い、独立の区分は付けていない。分類で言い表せない不足はないため taxonomyGaps は空とした。
- relatedCompanies: 株式会社大林組（obayashi、1802）は、セグメント情報の主要な顧客ごとの情報とMD&Aの相手先別販売実績に、建設事業の相手先として印字されているため customer として結んだ。説明文には金額を書いていない。
- relatedCompanies: 日清紡ホールディングス（nisshinbo-holdings、3105）、タカラスタンダード（takara-standard、7981）、ノザワ（nozawa、5237）は、連結子会社の大鳳株式会社が保有する特定投資株式で、3銘柄とも保有目的が「営業上の取引関係維持の強化」で同一の定型文であり、個別の取引内容の印字がないため結ばなかった。なお、提出会社自身は政策保有目的の上場株式を保有していないと印字されている。
- relatedCompanies: ニッタ（nitta、5186）は、自社の連結子会社ニッタイ工業株式会社の社名の一部に一致したもので、ニッタ株式会社との関係の印字はないため結ばなかった。
- relatedCompanies: エン（en、4849）は日創エンジニアリング株式会社の社名の一部、ビジョン（vision、9416）はグループビジョンの語、レイ（ray、4317）は太陽電池アレイの語の一部、ベース（base-4481、4481）は「営業利益ベース」の語、コア（core、2359）は理念説明の「コア」の語、コロナ（corona、5909）は新型コロナウイルス感染症の文脈、リックス（rix、7525）はスキル・マトリックスの語の一部にそれぞれ一致したもので、いずれも当該企業との関係の印字がないため結ばなかった。
- relatedCompanies: 山大（yamadai、7426）は役員の氏名の一部に一致したもので、コードリストにもないため結ばなかった。
- relatedCompanies: 大株主の状況（2025年8月31日現在）に載るNTi company株式会社（18.55％）は非上場で候補に無く、株式会社福岡銀行（2.99％）と株式会社商工組合中央金庫（1.99％）は金融機関で資金調達の関係にとどまるため、いずれも結ばなかった。その他の大株主は個人である。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 助言: 用語は有報の事業の内容に定義が印字されている当社グループの製品用語に限った。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
