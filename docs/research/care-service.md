# ケアサービス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ケアサービス |
| 証券コード | 2425 |
| docID（データを取り出した文書） | `S100YIQF` |
| 原本 docID | `S100YIQF` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIQF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ケアサービス / 2425 / docID S100YIQF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
care-service: 10 件の数値を有報XBRLと照合
有報: 株式会社ケアサービス 有価証券報告書－第35期(2025/04/01－2026/03/31) (docID S100YIQF)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":8965751000,"latestFiling":8884452000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":9237179000,"latestFiling":9164321000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":9637271000,"latestFiling":9573037000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":9862197000,"latestFiling":9841014000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":327327000,"latestFiling":349907000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":475633000,"latestFiling":509015000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":556550000,"latestFiling":564272000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":581272000,"latestFiling":558905000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":3239733000,"latestFiling":3239265000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":3510537000,"latestFiling":3531372000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":3857381000,"latestFiling":3882086000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":4119351000,"latestFiling":4110674000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":2018108000,"latestFiling":2021451000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":2316192000,"latestFiling":2340955000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":2642717000,"latestFiling":2666865000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":2923418000,"latestFiling":2914741000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":1014,"latestFiling":998},{"key":"NumberOfEmployees|2023-03-31","previousFiling":1039,"latestFiling":1024},{"key":"NumberOfEmployees|2024-03-31","previousFiling":1073,"latestFiling":1063}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
care-service: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は印字どおりに書いた。売上高と当期純利益はMD&Aの百万円印字（9,217百万円、115百万円）。前期比の増減率もMD&Aの印字どおり（売上高6.3％減、当期純利益62.7％減）。セグメント売上高は販売実績の千円印字を百万円に切り捨て（6,365,684千円→6,365百万円、2,851,542千円→2,851百万円）。
- businessModel: 営業利益・経常利益の金額と増減率、セグメント利益の金額は、規則により本文に書かなかった。
- businessModel: 経営の目標とする指標（経常利益率の向上を目指す旨が経営方針に印字されている）は、対象指標の金額・率を本文や strategy に書かない規則により書かなかった。
- businessModel: 2026年６月16日公表の中期経営計画については、数値目標を書かない規則により本文と strategy に書かなかった。2027年３月期以降の設備の新設等は同計画に基づき四半期開示資料等で公表する予定と、有報の設備の状況に印字されている。
- businessModel: 証拠パックの修正再表示チェックで、前期有報と今期有報の５年間の指標（売上高、利益、総資産、純資産、従業員数）に差異が検出された。今期有報の主要な経営指標等の注記が明示する遡及適用は「法人税、住民税及び事業税等に関する会計基準」等の第33期への適用であり、また同社は第34期まで連結財務諸表を作成し、第35期から個別財務諸表のみを作成している。登録する数値はすべて今期有報の印字どおりとし、比較可能性に関する事実は financialNotes に書いた。
- businessModel: 配当額や配当性向などの投資指標は規則により書かなかった。
- businessStructure: セグメント売上高は【販売実績】の印字（千円）を百万円に切り捨てて書いた（在宅介護サービス事業6,365,684千円→6,365百万円、シニア向け総合サービス事業2,851,542千円→2,851百万円）。切り捨て後の2事業の合計は9,216百万円で、印字の合計9,217,227千円（9,217百万円）と1百万円異なる（切り捨てによる差異）。
- businessStructure: このツリーのスキーマには suppliers が無いため書かなかった。有報に主要な仕入先の開示はなく、買掛金の相手先別内訳に名前があるのみである。
- businessStructure: 事業所数は2026年3月31日現在で合計111事業所（主要な設備の状況）。在宅介護サービス事業はデイサービス43事業所、訪問入浴15事業所、居宅介護支援13事業所など、シニア向け総合サービス事業はエンゼルケア32事業所である。
- businessStructure: 主要な顧客である東京都国民健康保険団体連合会（2026年3月期の売上高5,088,376千円、割合55.2％）は公的な介護報酬の支払機関で、掲載企業の候補ではないため関連企業にはせず、顧客の事実として businessModel に書いた。
- history: 沿革の設立時資本金（1991年の株式会社ケアサービス設立時の資本金10,000千円）は、資本金額を沿革に書かない規則により省いた。上海・北京の子会社設立時の資本金も同様に省いた。
- history: 小規模な拠点の開設・移転のうち、事業の転機とならないもの（1992年のケアセンターおおもり開設、1999年の本店移転と事業所開設、2001年のCDC東京事業所・居宅支援下北沢開設、2003年のレンタル大田開設、2005年の複合事業所開設、2007年の高専賃大宮公園開設、2014年の配食池上センター開設と本店移転、2016年の訪問看護おおた開設、2017年の小規模多機能型居宅介護西蒲田開設、2018年のやさしい手からの訪問入浴事業の譲受、2020年のクレアバーグからの訪問看護事業の譲受と広域社会福祉会からの訪問介護事業の譲受）は省略し、設立・合併・上場・事業開始・子会社の取得と清算を中心に選んだ。
- history: 2013年と2017年の株式分割は沿革の出来事として記録した。主要な経営指標等の注記に分割を前提とした算定の記載はない。
- industry: 主たる業界は、在宅介護サービス事業（2026年3月期の売上高6,365百万円、全体の約７割）を占める介護サービスに閉じた分類の値が無いため、先行する介護・福祉系の掲載会社（AHCグループ、AIAIグループ、アンビスホールディングス）の先例に合わせて retail を暫定とした。サービス事業所を運営する会社の分類としては当てはめにすぎない。
- industry: シニア向け総合サービス事業（同2,851百万円）は独立した報告セグメントとして金額が開示されており、その中心は葬儀に伴う湯灌・納棺などのエンゼルケアサービスであるため、funeral-memorial を２つ目に付けた。
- relatedCompanies: 候補 en（エン株式会社、ambiguous）：「エンゼルケアサービス」の語の部分一致であり、同社についての取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: 候補 career（株式会社キャリア）：「キャリアパス」など人材育成の文脈の一般語の一致であり、同社についての記載がないため結ばなかった。
- relatedCompanies: 候補 path（パス株式会社、ambiguous）：「キャリアパス」の語の部分一致であり、同社についての記載がないため結ばなかった。
- relatedCompanies: 候補 port（ポート株式会社）：「サポート」（施設探しのサポート）の語の部分一致であり、同社についての記載がないため結ばなかった。
- relatedCompanies: 候補 base-4481（ベース株式会社）：「営業利益ベース」の語の部分一致であり、同社についての記載がないため結ばなかった。
- relatedCompanies: 候補 otsuka（株式会社大塚商会）：【主な資産及び負債の内容】の買掛金と未払金の相手先別内訳に名前があるのみで、取引の内容や提携を述べた記載がないため結ばなかった。
- relatedCompanies: 候補 tanseisha（株式会社丹青社）：買掛金の相手先別内訳に名前があるのみで、取引の内容や提携を述べた記載がないため結ばなかった。
- relatedCompanies: 候補 create（クリエイト株式会社）：売掛金の相手先別内訳にある「株式会社ライフクリエイト」の部分一致であり、候補のクリエイト株式会社そのものについての記載がないため結ばなかった。
- relatedCompanies: 候補 land（株式会社ランド）：「ブランド」の語の部分一致であり、同社についての記載がないため結ばなかった。
- relatedCompanies: 候補 sanno（株式会社山王、ambiguous）：大株主である有限会社友愛の住所（東京都大田区山王）の地名の一致であり、同社についての記載がないため結ばなかった。
- relatedCompanies: 候補 taya（株式会社田谷、ambiguous）：「世田谷区」の地名の部分一致であり、同社についての記載がないため結ばなかった。
- relatedCompanies: 大株主のうち有限会社友愛（2026年３月31日現在、発行済株式（自己株式を除く）の総数に対する割合43.83％）は非上場の会社で候補に含まれず、東京海上日動火災保険株式会社（同1.75％）は保険会社で純投資とみられるため、いずれも関連企業にしなかった。
- relatedCompanies: 当社は投資株式を保有していない（株式の保有状況）と印字されており、政策保有株式に基づく関連付けは行わなかった。
- terms: 用語の助言のみ：エンゼルケア、湯灌、CDCサービス、通所介護（デイサービス）、訪問入浴、居宅介護支援（ケアプラン）、小規模多機能型居宅介護、クリーンサービス（生前整理・遺品整理）、ドミナント出店は、この会社の事業を説明する中核の語として各成果物で一貫して使った。既存の用語IDとの対応は機械側の照合に委ねる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ケアサービス（care-service）の主たる業界（在宅介護サービス事業） → 提案: 介護・ヘルスケアサービス（介護サービス事業所の運営）。有報は、通所介護・訪問入浴・訪問介護・訪問看護・居宅介護支援などを内容とする在宅介護サービス事業（2026年3月期の売上高6,365百万円）と、エンゼルケアを中心とするシニア向け総合サービス事業（2,851百万円）の２つを報告セグメントとして挙げる。閉じた分類に介護・ヘルスケアサービスの区分が無く、retail は商品を仕入れて売る小売を指す例が多いため、サービス事業所を運営する会社の分類としては暫定の当てはめにすぎない。
