# GMOインターネット — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＧＭＯインターネット株式会社 |
| 証券コード | 4784 |
| docID（データを取り出した文書） | `S100XRMD` |
| 原本 docID | `S100XRMD` |
| 提出日（原本） | 2026-03-18 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRMD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＧＭＯインターネット株式会社 / 4784 / docID S100XRMD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 11 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gmo-internet: 10 件の数値を有報XBRLと照合
有報: ＧＭＯインターネット株式会社 有価証券報告書－第27期(2025/01/01－2025/12/31) (docID S100XRMD)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-12-31","previousFiling":34524631000,"latestFiling":34524000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-12-31","previousFiling":16629012000,"latestFiling":16629000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":14903840000,"latestFiling":14903000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":12997730000,"latestFiling":12997000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-12-31","previousFiling":328213000,"latestFiling":328000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-12-31","previousFiling":395970000,"latestFiling":395000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-12-31","previousFiling":40343000,"latestFiling":40000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":-4845000,"latestFiling":-4000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":542519000,"latestFiling":542000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":746798000,"latestFiling":746000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":180288000,"latestFiling":180000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":151921000,"latestFiling":151000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":11631256000,"latestFiling":11631000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":12423478000,"latestFiling":12423000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":10847704000,"latestFiling":10847000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":10356245000,"latestFiling":10356000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":5205871000,"latestFiling":5205000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":5434375000,"latestFiling":5434000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":5242038000,"latestFiling":5242000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":5246693000,"latestFiling":5246000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
gmo-internet: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「GMOインターネット株式会社」が EDINET の提出者名「ＧＭＯインターネット株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックの差異はすべて、金額の表示単位を千円単位から百万円単位に変更したことによる端数の差であり、指標の訂正ではない。第27期より表示単位を百万円単位に変更し、比較のため第26期以前についても百万円単位に変更している。これは表示方法の変更のため financialNotes には入れず、ここに記録する。
- businessModel: セグメントの外部顧客への売上高の合計（65,864百万円＋12,490百万円＋193百万円＝78,547百万円）と印字の売上高78,548百万円との1百万円の差は、表示単位の端数によるもので、印字の合計を用いた。
- businessModel: MD&Aのセグメントごとの売上高は内部売上高を含む金額（インターネットインフラ事業65,993百万円、インターネット広告・メディア事業13,166百万円）のため、構造・本文の金額には使わず、セグメント注記の外部顧客への売上高を用いた。
- businessModel: 報告セグメントごとの減損損失242百万円とのれんの当期償却額153百万円は、本文の数値ルールに従い本文に書かず、ここに記録する。
- businessModel: LINEヤフー株式会社と株式会社エポスカードは前連結会計年度の主要な顧客だが、2025年12月期の主要な顧客ごとの情報には10%以上を占める相手先がないため、関連企業としてはリンクせず、industryPosition に記録した。
- businessModel: GMOプロダクトプラットフォーム株式会社は特定投資株式として138,381株を保有しているが、保有目的の印字に具体的な取引や提携の内容がなく、「事業連携の維持・強化」の文言のみのため、関連企業としてはリンクせず、ここに記録する。
- businessModel: 連結子会社のGMO NIKKO株式会社の売上高8,973百万円は連結売上高の10%を超えるが、グループ内の会社であるため関連企業としてはリンクせず、ここに記録する。
- businessModel: 2025年3月に親会社から取得した海外子会社8社は期中の出来事であり、2025年12月31日現在の連結範囲に含まれているため、history と businessStructure に記録した。
- businessModel: 連結子会社のGMOソリューションパートナー株式会社は2025年1月1日をもって当社を存続会社とする吸収合併により消滅し、連結の範囲から除外された。期中の出来事のため history に記録した。
- businessModel: 有報の附属資料として掲載されている親会社GMOインターネットグループ株式会社の財務諸表中の「重要な後発事象」（会社分割による持株会社体制への移行、自己株式の取得・消却、重要な子会社の株式及び債権の譲渡）は親会社のものであり、当社のものではない。当社自身の重要な後発事象は、連結・個別ともに「該当事項はありません」と印字されている。
- businessModel: 当社の株式分割の印字はない。
- businessStructure: 当社グループは当社と連結子会社12社により構成されています。連結子会社にはGMO NIKKO株式会社、GMOインサイト株式会社のほか、2025年3月に株式を取得した海外子会社8社が含まれます。
- businessStructure: 連結子会社のGMO NIKKO株式会社は、売上高が連結売上高の10%を超える主要な連結子会社です。グループ内の会社であるため関連企業としてはリンクしていません。
- businessStructure: 本社は東京都渋谷区道玄坂1丁目2番3号にあり、登記上の本店所在地は東京都渋谷区桜丘町26番1号です。
- history: 設立時の資本金額は本文の数値ルールに従い記載していません。
- history: 沿革の細かな子会社の設立・合併・売却の行は、事業構造への影響が小さいものは省略しています。省略した行の内容は事業構造の警告に記録しています。
- industry: 主たる業界は it とした。最大の報告セグメントであるインターネットインフラ事業（外部顧客への売上高65,864百万円）はドメイン、クラウド・レンタルサーバー、インターネット接続などのインターネット基盤サービスであり、業種一覧では it（情報通信・ソフトウェア・ITサービス）が最も近い。
- industry: 第2の業界として media を付けた。インターネット広告・メディア事業（外部顧客への売上高12,490百万円）が独立した報告セグメントとして開示されている。
- industry: インターネット接続（プロバイダー）事業は報告セグメントではなくインフラ事業の一部で金額が独立して開示されていないため、telecommunicationsは付けなかった。金融事業は当社にはなく、親会社GMOインターネットグループの事業であるため finance は付けなかった。
- relatedCompanies: LINEヤフー株式会社は前連結会計年度の主要な顧客（売上高2,227百万円）だが、2025年12月期は売上高の10%以上を占める相手先がなく、当期の取引の印字がないため、関連企業としてはリンクせず、industryPosition に記録した。株式会社エポスカードも同様に前連結会計年度の主要な顧客（売上高1,404百万円）だが、2025年12月期の印字がないためリンクしなかった。
- relatedCompanies: GMOプロダクトプラットフォーム株式会社は特定投資株式として138,381株を保有しているが、保有目的の印字に具体的な取引や提携の内容がなく、「事業連携の維持・強化」の文言のみのため、関連企業としてはリンクしなかった。
- relatedCompanies: 株式会社兼松は2000年に兼松コンピューターシステムと株式会社マグフォースを設立した際の相手先だが、現在の取引関係の印字がないためリンクしなかった。株式会社まぐまぐは1999年の営業開始時の広告販売先だが、現在の取引関係の印字がないためリンクしなかった。シャープ株式会社は2007年に『メルモ』を譲り受けた相手先だが、現在の取引関係の印字がないためリンクしなかった。株式会社ファンコミュニケーションズは2021年にポイントメディア事業「colleee」を事業譲受した相手先だが、現在の取引関係の印字がないためリンクしなかった。
- relatedCompanies: GMO NIKKO株式会社、GMOインサイト株式会社、GMOユナイトエックス株式会社及び海外子会社8社は当社の連結子会社であり、グループ内の会社であるため関連企業としてはリンクしなかった。GMOドリームウェーブ株式会社は持分法適用関連会社だが、上場企業ではなく関連候補にもないためリンクしなかった。
- relatedCompanies: 「セキ」「エン」「ランド」「ゼロ」「キャリア」「ポート」「ビジョン」「ティア」「ベース」「イノベーション」「田谷」「リード」「リズム」「シード」「スペース」などの候補は、一般語や部分一致によるもので、該当する取引関係の印字がないためリンクしなかった。
- terms: 助言: 用語「GMOSSP」は、業界最大級の接続先を誇る広告配信プラットフォームです。
- terms: 助言: 用語「GMO GPUクラウド」は、AI・機械学習の開発基盤となるGPUホスティングサービスです。
- terms: 助言: 用語「岩盤ストック収益」は、インターネット産業が続く限り無くならない、無くてはならない継続課金型の商材による強固な収益基盤のことです。
- terms: 助言: 用語「ドメイン」は、インターネットにおける住所となるものです。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
