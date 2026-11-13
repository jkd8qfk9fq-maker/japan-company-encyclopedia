# アイ・エス・ビー — research log

Registered: 2026-11-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アイ・エス・ビー |
| 証券コード | 9702 |
| docID（データを取り出した文書） | `S100XU2G` |
| 原本 docID | `S100XU2G` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU2G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アイ・エス・ビー / 9702 / docID S100XU2G（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
isb: 10 件の数値を有報XBRLと照合
有報: 株式会社アイ・エス・ビー 有価証券報告書－第56期(2025/01/01－2025/12/31) (docID S100XU2G)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-12-31","previousFiling":26176541000,"latestFiling":26176000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-12-31","previousFiling":28952996000,"latestFiling":28952000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":32388135000,"latestFiling":32388000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":33954594000,"latestFiling":33954000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-12-31","previousFiling":1110276000,"latestFiling":1110000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-12-31","previousFiling":1423943000,"latestFiling":1423000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-12-31","previousFiling":1472540000,"latestFiling":1472000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":2032475000,"latestFiling":2032000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":1940740000,"latestFiling":1940000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":2401159000,"latestFiling":2401000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":2810548000,"latestFiling":2810000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":2892784000,"latestFiling":2892000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":14361754000,"latestFiling":14361000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":16458681000,"latestFiling":16458000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":17988876000,"latestFiling":17988000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":19800748000,"latestFiling":19942000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":9557814000,"latestFiling":9557000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":10682814000,"latestFiling":10682000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":11821579000,"latestFiling":11821000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":13504395000,"latestFiling":13504000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
isb: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 再表示チェックの差異のうち、売上高・当期純利益・純資産等の2021年から2024年の差異はいずれも100万円未満で、主要な経営指標等が百万円単位で印字されることによる丸めの差異である。例外は2024年12月期の総資産で、前期有報の19,800,748千円から19,942百万円へ変わっており、これは株式会社AMBCの企業結合に係る暫定的な会計処理の確定（取得原価の当初配分額の重要な見直し）によるもので、理由が【主要な経営指標等の推移】の注記と（企業結合等関係）に印字されているため、2024年12月期のfinancialNotesに記録した。2022年12月期のfinancialNotesは同推移表の注記（収益認識基準の適用）に基づく。financialNotesは年度ごとに1件ずつで、重複による脱落はない。
- businessModel: 中長期経営計画2030に印字された2030年12月期の目標数値（連結売上高500億円以上など）と財務指標の目標は、計画・目標の数値であり投資の語を含むものもあるため、本文とperspectivesには転記せず、計画の名称・テーマ・重点戦略の定性的な内容のみを記載した。
- businessModel: 当期の配当は2026年3月27日開催予定の定時株主総会で決議する予定と印字されている（提出日時点では予定）。資本政策に関する予定事項であるためneedsReviewではなく本warningsに記録し、本文には記載していない。重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。
- businessModel: 調達先（suppliers）は【事業等のリスク】の調達先に関する記載に基づき、会社が自社の調達について使う一般名詞（ビジネス・パートナー、調達先）だけを記載した。個別の取引先の社名は印字されていないため記載していない。
- businessModel: MD&Aのセグメント別売上高（情報サービス事業315億８百万円、セキュリティシステム事業55億12百万円）は内部売上高を含むセグメント計ではなく外部顧客への売上高と同額であり、セグメント情報の外部顧客への売上高（31,508百万円、5,512百万円）と一致するため、本文では百万円印字のセグメント金額を用いた。セグメント利益の金額と増減理由は本文に記載していない。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高の大きい順（情報サービス事業31,508百万円、セキュリティシステム事業5,512百万円、合計37,020百万円で連結売上高と一致）とした。MD&Aのセグメント別売上高も同じ外部顧客ベースの金額である。
- businessStructure: 情報サービス事業の子区分（ソフトウェア開発、フィールドサービス、その他）は【事業の内容】の主要な事業内容の区分に基づくもので、報告セグメントではなく、区分ごとの売上高は開示されていないため金額は記載していない。
- businessStructure: グループは当社と連結子会社10社（株式会社エス・エム・シー、ノックスデータ株式会社、株式会社スリーエス、株式会社アート、アートサービス株式会社、コンピュータハウス株式会社、株式会社T-stock、株式会社テイクス、株式会社AMBC、ISB VIETNAM COMPANY LIMITED）で構成される（【事業の内容】・【関係会社の状況】）。
- history: 設立時・子会社化時の資本金の金額は、禁止金額に当たるため沿革には記載していない。
- history: 沿革表の2013年から2014年にかけての部分は年月と事象の対応が崩れて印字されている（2013年８月イー・ストーム株式会社解散、2014年１月の行、2014年８月株式会社札幌システムサイエンスの子会社化と株式会社ＩＳＢパーソナルサービスの解散が連記）。株式会社札幌システムサイエンスの子会社化は現在の連結子会社・株式会社スリーエスとして【関係会社の状況】で裏付けられるため2014年の行として採用し、解散した2社の行は対応が確実でないため沿革には独立させず本warningsに記録した。
- history: 多数ある営業所・事業所の設置や移転、認証取得の行は、会社の転機となるもの（データセンター設置など）に絞って記載した。
- industry: 主たる業界はitとした。情報サービス事業が外部顧客への売上高31,508百万円と連結売上高37,020百万円の大半を占め、ソフトウェア開発とITインフラ運用が中核である。セキュリティシステム事業（5,512百万円）は出入管理機器の開発・販売を含むが、情報サービスと一体のIT関連事業であり、閉じた集合に独立した区分もないため副次業界は付けていない。
- relatedCompanies: 関連候補の15件はいずれも関連付けしなかった。seki（セキ）は「セキュリティシステム事業」等の一般語の一致、en（エン）は一般語の一致、career（キャリア）は「キャリア形成支援」等の一般語の一致、core（コア）は一般語の一致、zero（ゼロ）は「ネットゼロ」等の一般語の一致、daiwa（大和）は神奈川県大和市の地名の一致、innovation（イノベーション）とvision（ビジョン）とbase-4481（ベース）とland（ランド）とrent（レント）は一般語の一致、nippon-kinzoku（日本金属）は労働組合名「日本金属製造情報通信労働組合」の一致、freee（フリー）は「リスクフリー」の語の一致、suzuki-6785（鈴木）は個人株主の氏名の一致、trust（トラスト）は「日本マスタートラスト信託銀行（信託口）」の語の一致であり、当社がその相手について取引・提携・資本関係を述べている箇所はない。
- relatedCompanies: 株式会社ＫＳＫ（ksk）の株式99,000株を特定投資株式として保有しているが、保有目的は「業界動向等の情報収集のために保有」と印字されるのみで、取引・提携の事実は印字されておらず、関連候補にも含まれていないため関連付けしなかった。
- relatedCompanies: 第一生命ホールディングス株式会社の株式23,600株を特定投資株式として保有しているが、保有目的は同社グループの第一生命保険株式会社との保険取引等における取引関係の維持・強化であり、保険取引を理由とする保有は関連付けの対象としないため関連付けしなかった。同社は関連候補にも含まれていない。
- relatedCompanies: 株式会社第一情報システムズは【大株主の状況】に所有株式数180千株、割合1.57％（2025年12月31日現在）の事業会社株主として印字されているが、関連候補に含まれておらず、当社が同社との取引・提携を述べている箇所もないため関連付けしなかった。
- relatedCompanies: その他の大株主は、有限会社若尾商事（未上場）、信託銀行の信託口、従業員持株会、個人であり、関連付けの対象はない。自社グループの連結子会社10社は関連付けの対象としていない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
