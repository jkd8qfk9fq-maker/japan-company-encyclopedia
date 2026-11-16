# クラウディアホールディングス — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社クラウディアホールディングス |
| 証券コード | 3607 |
| docID（データを取り出した文書） | `S100X5IQ` |
| 原本 docID | `S100X5IQ` |
| 提出日（原本） | 2025-11-21 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | S100X5IV, S100X5IX, S100X5IY, S100X5IZ, S100X5J1（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X5IQ.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%87%E3%82%A3%E3%82%A2%E3%83%9B%E3%83%BC%E3%83%AB%E3%83%87%E3%82%B0%E3%82%B9

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社クラウディアホールディングス / 3607 / docID S100X5IQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 6 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kuraudia-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社クラウディアホールディングス 有価証券報告書－第49期(2024/09/01－2025/08/31) (docID S100X5IQ)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-08-31","previousFiling":7015542000,"latestFiling":7015000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-08-31","previousFiling":9507932000,"latestFiling":9507000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-08-31","previousFiling":11521559000,"latestFiling":11521000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-08-31","previousFiling":13219210000,"latestFiling":13219000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-08-31","previousFiling":-810807000,"latestFiling":-810000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-08-31","previousFiling":824382000,"latestFiling":824000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-08-31","previousFiling":562006000,"latestFiling":562000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-08-31","previousFiling":192515000,"latestFiling":192000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-08-31","previousFiling":-405549000,"latestFiling":-405000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-08-31","previousFiling":686475000,"latestFiling":686000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-08-31","previousFiling":617016000,"latestFiling":617000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-08-31","previousFiling":388416000,"latestFiling":388000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-08-31","previousFiling":13785061000,"latestFiling":13785000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-08-31","previousFiling":13577541000,"latestFiling":13577000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-08-31","previousFiling":11898842000,"latestFiling":11898000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-08-31","previousFiling":12813168000,"latestFiling":12813000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-08-31","previousFiling":2368645000,"latestFiling":2368000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-08-31","previousFiling":3136871000,"latestFiling":3136000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-08-31","previousFiling":3695726000,"latestFiling":3695000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-08-31","previousFiling":3829440000,"latestFiling":3829000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第48期(2023/09/01－2024/08/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第47期(2022/09/01－2023/08/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第46期(2021/09/01－2022/08/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第45期(2020/09/01－2021/08/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第44期(2019/09/01－2020/08/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kuraudia-holdings: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…社是として「お客さまの利益を創る」「社会奉仕」「社員の生活向上…）

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の（注）1（潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していない旨）と（注）2（第45期は親会社株主に帰属する当期純損失のため株価収益率を記載していない旨）は指標の読み方に関する注記であり、financialNotes には入れず、ここに記録する。
- businessModel: 過去の有報との指標の差異は、前回有報のサマリーXBRLが円単位の正確値（例：2021年8月期の売上高7,015,542,000円）であるのに対し、当期有報のサマリーXBRLが百万円単位に丸めた値（7,015,000,000円）であることによるもので、印字精度では全ての指標が一致する。指標の訂正ではないため、financialNotes・needsReview には入れず、ここに記録する。
- businessModel: 2025年11月20日に第44期から第48期までの訂正有価証券報告書（S100X5J1、S100X5IZ、S100X5IY、S100X5IX、S100X5IV）が提出されている。第48期の訂正（S100X5IV）と原報告書（S100UU3Z）のサマリーXBRLを全142項目で比較し、経営指標等に差異がないことを確認した。指標に影響しない訂正のため、ここに記録するに留める。
- businessModel: 連結子会社の株式会社クラウディアと株式会社クラウディアコスチュームサービスの個別の損益情報が【関係会社の状況】に印字されているが、子会社の数値は本文の数値ではないため記載していない。
- businessModel: 【重要な契約等】のシンジケートローン契約（アレンジャーは株式会社三井住友銀行、コ・アレンジャーは株式会社みずほ銀行）は資金調達に関する契約であり、本文・関連企業には記載していない。
- businessModel: MD&Aに印字された販売費及び一般管理費や各利益段階の数値は、本文では売上高と当期純利益のみを用いる方針のため記載していない。受注実績の数値も記載していない。
- businessStructure: 事業部門別の売上高は、セグメント情報等の【関連情報】製品及びサービスごとの情報（外部顧客への売上高）によった。コンシューマー事業部門10,584百万円とホールセール事業部門3,006百万円の合計は13,590百万円で、印字された連結売上高13,591百万円と1百万円の差がある（千円単位の切り捨てによる差）。いずれも印字どおりに記載した。
- businessStructure: コンシューマー事業部門の内訳（MD&A印字）は衣裳取扱収入3,351百万円、リゾート挙式売上高1,479百万円、式場運営収入3,434百万円、写真・映像・美容等売上高2,318百万円で、合計は10,582百万円となり、関連情報の同部門の外部顧客への売上高10,584百万円と2百万円の差がある。いずれも印字どおりに記載した。ホールセール事業部門の内訳（製・商品売上高1,306百万円とレンタル収入等1,700百万円）の合計は同部門の売上高3,006百万円と一致する。
- businessStructure: 株式会社クラウディアが行うインナーの製造及び販売（インナー専門店「The D」）は事業系統図に示されておらず、金額の開示もないため、独立した事業としては記載せず、沿革にのみ記録した。
- businessStructure: 【重要な契約等】に、連結子会社の株式会社クラウディアコスチュームサービス及び内田写真株式会社と株式会社アルカンシエル（非上場）との業務提携契約（同社が運営する結婚式場における衣裳販売・貸衣裳・美容サービス、写真・映像サービス及びこれに付帯する業務）が印字されている。相手先は掲載対象企業ではないため関連企業には結ばず、ここに記録する。
- businessStructure: 設備の状況に印字された各拠点の帳簿価額は記載していない。
- businessStructure: 主力ブランド「シェーナ・ドゥーノ」（神田うのプロデュース）の事実は有報に印字がなく、Wikipediaの記事からの補足である。有報の数値には一切用いていない。
- history: 本社の移転（1982年）、支店の新設（1984年・1987年）、青島工場のISO9001認証取得（2001年）、リース事業部の移転（2013年）、「銀座クチュールNAOCO 銀座店」の移転（2013年）、東京証券取引所と大阪証券取引所の市場統合に伴う記載（2013年）、株式会社クラウディアブライダルサービスの当社への吸収合併（2017年3月）は、事業の転機ではないため沿革には含めなかった。
- history: 1976年の設立時の資本金2百万円は、金額を沿革に書かない方針のため記載していない。
- history: 沿革の年月は有報の印字どおりだが、登録は年単位のため月は項目に含めていない。
- industry: 主たる業界は entertainment（暫定）とした。ブライダル事業の単一セグメントのうち、式場運営・挙式・写真映像・美容・リゾート挙式などのサービスが中心のコンシューマー事業部門が、外部顧客への売上高10,584百万円と連結売上高13,591百万円の過半を占めるため。
- industry: ホールセール事業部門（婚礼衣裳の企画・製造・卸売、外部顧客への売上高3,006百万円）は衣裳の製造・卸売だが、閉じた分類に繊維・アパレルの区分が無く、実態と異なる区分を付けることを避けるため副分類は付けなかった。分類の不足は taxonomyGaps に記録した。
- industry: funeral-memorial は葬儀・墓地の区分であり、婚礼とは異なるライフイベントであるため採用しなかった。
- relatedCompanies: ines（アイネス）: 当社の式場ブランド「アイネス ヴィラノッツェ」の名称の一致のみで、株式会社アイネスとの関係の記載はないため結ばなかった。
- relatedCompanies: lec（レック）: 「フレックスタイム」の部分一致のみで、同社との関係の記載はないため結ばなかった。
- relatedCompanies: en（エン）: ambiguousな候補で、「エンドユーザー」の部分一致のみであり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「連結ベース」という一般語の部分一致のみで、同社との関係の記載はないため結ばなかった。
- relatedCompanies: core（コア）: ambiguousな候補で、「ものづくりをコアとし」という一般語の部分一致のみであり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: cover（カバー）: 「損害保険にてカバーする」という一般語の部分一致のみで、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 最大株主の有限会社クラエンタープライズ（所有株式数の割合38.98％）は非上場で掲載対象企業ではないため、関連企業には結ばなかった。株式会社三井住友銀行（同1.40％）はシンジケートローンのアレンジャーでもある金融機関で、大株主としての記載に留まるため結ばなかった。
- terms: 助言: 用語「アイネス ヴィラノッツェ」は、当社グループの結婚式場のブランド名（宝ケ池・沖縄・宮古島）で、【事業の内容】や【沿革】に印字されています。
- terms: 助言: 用語「銀座クチュールNAOCO」は、株式会社クラウディアコスチュームサービスが運営する直営のドレスショップの店舗名で、【事業の内容】に印字されています。
- terms: 助言: 用語「The D」は、株式会社クラウディアが運営するインナー専門店の店舗名で、【沿革】に印字されています。

## 要確認（status に反映）

- businessStructure: 2025年8月に設立した連結子会社「大神宮会館クラウディア株式会社」（東京都千代田区）は、東京大神宮の挙式施設「東京大神宮 大神宮会館」の運営を目的とする会社であり、2026年4月より運営開始予定と印字されている。運営開始は決算日後であるため、2025年8月31日現在の構造で登録した。運営開始後の構造は次期の有報で確認されたい。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] クラウディアホールディングス（kuraudia-holdings）のブライダル事業（婚礼衣裳の製造・卸売と挙式関連サービス） → 提案: ブライダル（婚礼関連サービス・婚礼衣裳）。ブライダル事業は外部顧客への売上高13,591百万円の単一セグメントで、コンシューマー事業部門（10,584百万円）は式場運営・挙式・写真映像・美容・リゾート挙式のサービス、ホールセール事業部門（3,006百万円）は婚礼衣裳の企画・製造・卸売である。閉じた分類（INDUSTRY_IDS）に婚礼・ブライダルに当たる区分が無く、サービスの比重が大きいことから entertainment を暫定の主分類とした。婚礼専門の事業会社を表す区分として新設を提案する。
