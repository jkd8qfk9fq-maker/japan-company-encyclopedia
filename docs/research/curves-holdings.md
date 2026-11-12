# カーブスホールディングス — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カーブスホールディングス |
| 証券コード | 7085 |
| docID（データを取り出した文書） | `S100X61U` |
| 原本 docID | `S100X61U` |
| 提出日（原本） | 2025-11-21 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X61U.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カーブスホールディングス / 7085 / docID S100X61U（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
curves-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社カーブスホールディングス 有価証券報告書－第17期(2024/09/01－2025/08/31) (docID S100X61U)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-08-31","previousFiling":24681001000,"latestFiling":24681000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-08-31","previousFiling":27509600000,"latestFiling":27509000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-08-31","previousFiling":30022487000,"latestFiling":30022000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-08-31","previousFiling":35465349000,"latestFiling":35465000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-08-31","previousFiling":1129682000,"latestFiling":1129000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-08-31","previousFiling":2247804000,"latestFiling":2247000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-08-31","previousFiling":2551368000,"latestFiling":2551000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-08-31","previousFiling":3566938000,"latestFiling":3566000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-08-31","previousFiling":1716826000,"latestFiling":1716000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-08-31","previousFiling":3311130000,"latestFiling":3311000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-08-31","previousFiling":3841914000,"latestFiling":3841000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-08-31","previousFiling":5472521000,"latestFiling":5472000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-08-31","previousFiling":36284867000,"latestFiling":36284000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-08-31","previousFiling":38352203000,"latestFiling":38352000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-08-31","previousFiling":39111385000,"latestFiling":39111000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-08-31","previousFiling":41374875000,"latestFiling":41374000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-08-31","previousFiling":9163608000,"latestFiling":9163000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-08-31","previousFiling":12355949000,"latestFiling":12355000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-08-31","previousFiling":15070159000,"latestFiling":15070000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-08-31","previousFiling":19409333000,"latestFiling":19409000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
curves-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、連結経営指標等とセグメント情報の関連情報の百万円単位の印字どおりに転記しました。MD&Aの億円単位の記述は本文には使っていません。
- businessModel: 前期有報との主要経営指標の差異は、すべての項目で百万円未満の端数の差のみであり、修正再表示ではないことを確認しました。登録に使う数値は当期有報の印字どおりです。
- businessModel: 表示方法の変更による前連結会計年度の財務諸表の組替え（契約負債の独立掲記など）は、表示の変更のみで5年間の主要な経営指標等の数値に影響しないため、financialNotesには記録せず、ここに記録しました。
- businessModel: 収益認識に関する会計基準の適用（第14期期首から）と法人税等に関する会計基準の適用（当連結会計年度期首から、指標への影響なし）は、連結経営指標等の注記の印字に基づきfinancialNotesに記録しました。第14期は2022年8月期に当たります。
- businessModel: 戦略のdisclosedに書いた中期ビジョンの数値は店舗数と会員数のコミットターゲットだけとし、売上高などの金額の目標は転記していません。
- businessModel: 仕入先は、重要な契約等の節がプロテイン等の製造委託を印字している「プロテイン等メーカー」だけを一般名詞で書きました。フィットネス機器などの調達先は、自社の調達についての一般名詞の印字が確認できないため書いていません。
- businessModel: MD&Aが印字するチェーン売上高856億円はフランチャイズ店を含めた末端売上の合計額であり、連結売上高ではないため、本文の売上高には使っていません。
- businessStructure: 報告セグメントはカーブス事業のみの単一セグメントのため、事業はカーブス事業の1つとし、childrenはセグメント情報の関連情報（製品及びサービスごとの情報）の外部顧客への売上高の大きい順（ショッピング売上23,080百万円、フランチャイズ関連売上等14,485百万円）に並べました。2区分の合計は37,565百万円で、印字された合計37,566百万円と1百万円異なりますが、有報の丸めによるものとして印字どおりに記載しました。
- businessStructure: 国内と海外の区分は事業の内容の記載（国内カーブス事業、海外カーブス事業）によりますが、区分ごとの外部顧客への売上高がセグメント関連情報には印字されていないため、childrenにはしませんでした。
- businessStructure: グループ構成は2025年8月31日現在の印字によります。連結子会社は株式会社カーブスジャパン、株式会社ハイ・スタンダード、Curves International, Inc.、Curves Europe B.V.、CFW Operations Europe Limited、Curves International of Spain, S.A.、KIMOSCAPE(PTY)LTDの7社、非連結子会社はFemale Fitness (Louth) Limited、Female Fitness (Dublin) Limitedの2社です。子会社の資本金の金額は本文には書いていません。
- businessStructure: nameは表紙の社名から「株式会社」を除きました。listingsの市場は表紙の印字（東京証券取引所 プライム市場）によります。
- history: 沿革の各行は年月まで印字されていますが、historyの形に月は書けないため年に畳み、月はdescriptionに残しました。子会社などの資本金の金額は書いていません。
- history: 2024年4月の行について、沿革の節はFemale Fitness (Louth) Limitedの子会社化と新設を同じ社名で印字していますが、事業の内容の節は「2024年4月に子会社化したFemale Fitness (Louth) Limitedおよび、新設したFemale Fitness (Dublin) Limited」と印字しているため、新設された会社はDublinの方と判断し、本文のhistoryには新設の社名を特定せずに記録しました。
- history: Wikipediaの記事「カーブス」の冒頭はブランドが1992年にアメリカ合衆国で誕生した女性専用フィットネスクラブであるという1文だけであり、補足として使える経緯は沿革の節の記載で足りるため、Wikipediaは使っていません。
- industry: 主たる業界はentertainmentとしました。フィットネスクラブの運営は閉じた集合に直接の値がなく、スポーツクラブを運営するセントラルスポーツの掲載例と同じ性質のレジャー・サービス事業であるため、最も近い既存値で表しました。taxonomy gapは記録していません。
- industry: 事業はカーブス事業の単一セグメントであり、会員向け物販も同じ事業の中の区分であるため、第2の業界は付けていません。
- relatedCompanies: 関連企業は1社も結んでいません。候補ごとに足りない根拠は次のとおりです。
- relatedCompanies: コシダカホールディングス（koshidaka-holdings）: 沿革に当社の設立と2020年3月のスピンオフによる分離独立が印字されていますが、現在の関係会社の状況にも大株主の状況にも載っておらず、現在の資本関係や取引関係の印字がないため結んでいません。設立と分離独立は沿革に記録しました。
- relatedCompanies: 群馬銀行（the-gunma-bank）: 重要な契約等にシンジケートローン契約の締結先の1行として印字されていますが、資金調達の相手であり、取引・提携の関係として結ぶ根拠にはならないため結んでいません。
- relatedCompanies: テイン（tein）: 会員向け商品名「カーブスプロテイン」の一部としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: ポート（port）: 「サポート」などの語の一部としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: No.1（no-1）: 「安全・安心No.1を目指す」などの表現としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: ベース（base-4481）: 「連結ベース」などの表現としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: ランド（land）: 国名などの一部としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: ビジョン（vision）: 「中期ビジョン」などの普通名詞としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: キャリア（career）: 「キャリアプラン」などの普通名詞としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: フリー（freee）: 経営指標の名称の一部としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: アイル（i-ll）: 「アイルランド」の一部としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: トラスト（trust）: 大株主の状況の信託銀行の名称の一部としての一致であり、コードリストにない相手でもあるため結んでいません。信託口の保有は純投資の保管であり、関係として結びません。
- relatedCompanies: コロナ（corona）: 「新型コロナウイルス感染症」の一部としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: カバー（cover）: 「カバーする」という動詞としての一致であり、会社についての印字ではないため結んでいません。
- relatedCompanies: エン（en）: 「エンゲージメント」の一部としての一致で、同一性も曖昧なため結んでいません。
- relatedCompanies: 平和（heiwa）: 大株主の住所「平和町」の一部としての一致で、同一性も曖昧なため結んでいません。
- relatedCompanies: 田谷（taya）: 住所「世田谷区」の一部としての一致で、同一性も曖昧なため結んでいません。
- relatedCompanies: ゼロ（zero）: 「ゼロとして」という表現としての一致で、同一性も曖昧なため結んでいません。
- relatedCompanies: グループの連結子会社と非連結子会社（カーブスジャパン、ハイ・スタンダード、Curves International, Inc.など）は、自社グループの会社であるため関連企業リンクにはしていません。事業の内容と関係会社の状況に構成を記録しました。
- relatedCompanies: 大株主の状況の首位である株式会社ヨウザンは掲載済み企業の候補に含まれておらず、資産管理会社である株式会社ティーワイエヌなども候補にないため、結んでいません。
- terms: 助言: 用語「グローバルフランチャイザー」は、フランチャイズチェーンにおける世界総本部を指します（事業の内容の注記に印字）。
- terms: 助言: 用語「マスターフランチャイズ」は、本部から一定地域での事業権を受けて、その地域で加盟店展開を行う仕組みを指し、当社グループではカーブスジャパンが日本での独占事業権を持ち、海外では各国のマスターフランチャイジーが対象地域を担います（事業の内容と重要な契約等に印字）。
- terms: 助言: 用語「スピンオフ」は、親会社が保有する子会社株式を現物配当により自社株主に分配して分離する方法を指し、当社グループは2020年3月にこの方法でコシダカホールディングスグループから分離独立しました（沿革に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
