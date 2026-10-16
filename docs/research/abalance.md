# Abalance — research log

Registered: 2026-10-01（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | Ａｂａｌａｎｃｅ株式会社 |
| 証券コード | 3856 |
| docID | `S100YXMA` |
| 提出日 | 2026-08-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YXMA.pdf / `asbj-equity-method-affiliate-practical-issues` https://www.asb-j.jp/jp/wp-content/uploads/sites/4/zaigai2018-05.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | Ａｂａｌａｎｃｅ株式会社 / 3856 / docID S100YXMA（id は英語表記「Abalance Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 6 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 7 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 1 | 出典 2 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
abalance: 10 件の数値を有報XBRLと照合
有報: Ａｂａｌａｎｃｅ株式会社 有価証券報告書－第27期(2025/04/01－2026/03/31) (docID S100YXMA)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":92122000000,"latestFiling":91929000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":215284000000,"latestFiling":215236000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":208972000000,"latestFiling":198420000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":72417000000,"latestFiling":62828000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":806000000,"latestFiling":575000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":4965000000,"latestFiling":4857000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":9530000000,"latestFiling":11041000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":951000000,"latestFiling":-314000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":1418000000,"latestFiling":1840000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":14038000000,"latestFiling":14390000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":24894000000,"latestFiling":463000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":3737000000,"latestFiling":2454000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":85121000000,"latestFiling":84503000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":143691000000,"latestFiling":142621000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":150173000000,"latestFiling":149117000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":145802000000,"latestFiling":146809000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":7947000000,"latestFiling":7968000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":22771000000,"latestFiling":23019000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":42432000000,"latestFiling":45592000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":43338000000,"latestFiling":45002000000}]
利益・総資産・純資産・従業員数: 15 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
注意: 訂正有価証券報告書－第26期(2024/07/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第25期(2023/07/01－2024/06/30) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第24期(2022/07/01－2023/06/30) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第23期(2021/07/01－2022/06/30) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第22期(2020/07/01－2021/06/30) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
abalance: 本文の金額 17 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「asbj-equity-method-affiliate-practical-issues」: EDINET 以外のホスト（www.asb-j.jp）。一次資料かどうかは人が確認すること
- 出典「asbj-equity-method-affiliate-practical-issues」はどこからも引用されていません
- 正式名称「Abalance株式会社」が EDINET の提出者名「Ａｂａｌａｎｃｅ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 一文の説明（description）は「ベトナム国やエチオピア国などで太陽光パネル・セルを製造し、太陽光発電所の販売や売電もおこなう会社。」（49文字、句点1つ）としました。エチオピア国の工場はセル（太陽光パネルの上流工程）の生産拠点（生産能力4GW）で、パネル自体の生産拠点ではありません（ベトナム国・米国テキサス州がパネル生産）。『太陽光パネル・セルを製造』とすることで、国ごとの製品を厳密に区別しすぎず、かつ『エチオピアでパネルを作っている』という誤りを避けました。
- businessModel: 業績（経営成績）に関する説明は、当社が前連結会計年度に決算期変更を実施し、前連結会計年度が9か月の変則決算となったため、有価証券報告書自体が『増減額及び前年同期比(％)を記載せず説明しております』と明記していることに合わせ、前期比の記述を含めていません（businessStructure工程の既存の警告と同じ注意点です）。
- businessModel: flowの『company』段階で引用した『連結子会社43社』『持分法適用関連会社6社』は、【連結財務諸表作成のための基本となる重要な事項】の『(1) 連結子会社の数　43社』『(1) 持分法適用の関連会社数　6社』から引用した数値で、【関係会社の状況】に個別名で挙がる社数（連結子会社15社＋その他24社、持分法適用関連会社6社）とは数え方の単位が異なります（【関係会社の状況】は主要な会社のみを個別記載し、残りを『その他24社』とまとめているため）。本文には【連結財務諸表作成のための基本となる重要な事項】の43社・6社という総数のみを引用しました。
- businessModel: flowの『revenue』段階の『報告セグメントに含まれないその他522百万円』は、業種分類（industries）工程の判断とも共通する注記（注1「その他」の区分は報告セグメントに含まれないＩＴ事業、光触媒事業、建設機械の国内及び海外への販売・レンタル事業及び水素エネルギーを活用した貯蔵システムの開発事業であります）に基づいています。
- businessModel: [[term:consolidated-subsidiary|...]]・[[term:segment|...]]は、src/data/terms/に既に登録済みの用語のみにリンクしました（2026-10-01時点で確認済み：annual-securities-report, back-end-process, consolidated-subsidiary, discontinued-operations, earnings-release, foundry, front-end-process, ifrs, image-sensor, segment, semiconductor-manufacturing-equipment, semiconductor, sogo-shosha, subsidiary, waferの15件）。『持分法適用関連会社』は未登録のため、terms工程でproposedTermsとして提案するにとどめ、本文中にはリンクを書いていません（提案中の用語にはリンクしないという規則のとおりです）。
- businessModel: 業界分類（industries）、関連企業（relatedCompanies）は担当外のため、このフラグメントには書いていません。
- businessStructure: shortNameEn「ABALANCE」は英訳名（nameEn: Abalance Corporation）から法人語尾のCorporationを除いて大文字にしたもので、有報にこの表記そのものの印字はありません。A&A MATERIALやADVANTESTなど既存エントリーの命名規則に従いました。
- businessStructure: name「Abalance」は、会社名（表紙）「Abalance株式会社」から株式会社を除いたラテン文字表記で、有報の英訳名表記（Abalance Corporation、DEIの提出者名（英語表記）と同一）とも整合します。
- businessStructure: listingsのmarket「スタンダード」は、DEIの「上場金融商品取引所名又は登録認可金融商品取引業協会名」が「東京証券取引所(スタンダード市場)」と取引所名と市場区分をまとめて印字していることに基づきます（取引所名だけの印字ではないため記載可）。figures-only登録時点で既に同じ値が機械的に入っていますが、本工程でも有報原文から確認しました。
- businessStructure: 太陽光パネル製造事業・グリーンエネルギー事業・その他の並び順は、【セグメント情報】の「外部顧客への売上高」（当連結会計年度：111,768／7,879／522百万円）に基づく降順です。「その他」は有報の注1「報告セグメントに含まれない事業セグメントであり…」との記載により、金額の大小によらずこの並びでも最後に来ます。
- businessStructure: グリーンエネルギー事業のdescriptionに引用した内訳（物品販売5,555百万円、売電及びO&M収入等2,160百万円）は経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析（MD&A）の原文をそのまま引用したものですが、合計すると7,715百万円となり、同じ文が示す区分の売上高7,879百万円と164百万円一致しません。有報自身がこの2つの内訳を網羅的な分解として提示しているかは本文からは判断できないため、children（下位区分）としては立てず、本文中の言及にとどめました。
- businessStructure: 当社は前連結会計年度に決算期変更を実施し、前連結会計年度（2024年７月１日～2025年３月31日）が9か月の変則決算となったため、有報のMD&Aは『以下の経営成績に関する説明において、増減額及び前年同期比(％)を記載せず説明しております』と明記しています。この工程のdescriptionにも前期比の数値・割合は含めていません。
- businessStructure: 業界分類（industries）、ビジネスモデル（businessModel）は担当外のため、このフラグメントには書いていません。
- history: 沿革表（history.txt）は年月1件につき事象の文が1つ以上続く通常の形式（崩れていない）でした。6つの年月（2017年3月、2022年3月、2023年10月、2024年1月、2024年11月、2025年3月）には複数の事象文が続けて印字されていますが、間に別の年月が挟まっていないため、それぞれ同一年月のものとして1つのHistoryEventにまとめました。対応づけに疑いのある崩れたテーブルではないため、落とした行はありません。
- history: 2019年設立の株式会社鯤コーポレーションは、有報の沿革表に「(現日本光触媒センター株式会社)」との注記があり、現在の社名を補記しました。
- history: TOYO SOLAR Company Limitedの設立（2022年11月）には沿革表に「(現社名)」との注記があり、設立時とは別の名称であった可能性がありますが、有報は旧社名を記載していないため、推測で補っていません。
- history: 山陽パワー合同会社、バーディフュエルセルズ合同会社、WWB Thang Long Corporation、株式会社サンシャインティーズ、WIN POWER Ltd.は、現在の【関係会社の状況】（関係会社4社の一覧及び「その他24社」）に個別名での記載が見当たらず、現況は有価証券報告書からは確認できません。各該当イベントのsignificanceには、当時の文脈のみを記述し、現在も存続しているとは述べていません。
- history: 2023年6月に子会社化した「大衡村太陽光発電所合同会社」と、【関係会社の状況】にある「大衡村太陽光発電所匿名組合事業」は法人格の呼称が異なり（合同会社 と 匿名組合事業）、同一の事業体かどうかは有価証券報告書からは断定できないため、両者を同一のものとして結び付ける記述はしていません。
- history: 当社は2026年7月31日開示で東京証券取引所の監理銘柄（審査中）に指定されています（経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析に記載）。沿革表（有報の【沿革】欄）自体にはこの指定に関する記載がなく、businessStructure/history工程の担当フィールドにも該当しないため、このフラグメントのdataには含めていません。他工程（risk/governance関連）やレビュー時の参考情報として記録しておきます。
- history: 当社は前連結会計年度に決算期変更を実施し、前連結会計年度が9か月の変則決算（2024年7月1日～2025年3月31日）となったことがMD&Aに記載されています。沿革表自体にはこの決算期変更の日付を示す行がなく、history工程のdataには含めていません。
- industry: energyのみを単一の業界としました。報告セグメントは太陽光パネル製造事業（売上高111,768百万円）とグリーンエネルギー事業（同7,879百万円）の2つで、どちらも太陽光発電・再生可能エネルギーに属する事業であり、INDUSTRY_IDSに『再生可能エネルギー』専用の区分がないため、どちらもenergyに含めました（inpex.jsonが石油・ガス開発でenergy単独になっている前例と同じ扱いです）。
- industry: 太陽光パネルの製造はセル・インゴット・ウエハの内製化を含み、半導体のウエハ・セル工程と語彙が近い（用語は『terms』工程で検討）ものの、有価証券報告書はこれを半導体産業としてではなく太陽光発電（再生可能エネルギー）のサプライチェーンの一部として説明しており、半導体の製造装置や電子部品としての開示はありません。既存の分類慣例（東京エレクトロン・アドバンテスト等は半導体『製造装置』を対象とする半導体業界）とは性質が異なるため、semiconductorsは付けていません。
- industry: 『その他』区分（売上高522百万円、セグメント損失139百万円）はIT事業・光触媒事業・建設機械の国内及び海外への販売・レンタル事業・水素エネルギーを活用した貯蔵システムの開発事業を含みますが、有価証券報告書はこれらを合算した522百万円しか開示しておらず、個別の事業ごとの金額は開示されていません。金額が独立して開示されていない事業に業界を足さないという規則（例: it, constructionを追加しない）に従い、『その他』を理由にした追加の業界は付けていません。
- industry: businessModel、relatedCompaniesは担当外のため、このフラグメントには書いていません。
- relatedCompanies: この工程を書く直前に src/data/companies/index.ts を読み直しました（7,673行、変化なし）。明治機械株式会社は id『meiji-machine』、証券コード6334、商号『明治機械株式会社』、上場区分『東証スタンダード市場』で登録済みであることを確認し、有価証券報告書の【関係会社の状況】の記載（東京都千代田区、資本金100百万円、グリーンエネルギー事業、議決権所有割合36.3%(-)）と一致することを確認しました。
- relatedCompanies: src/data/companies/toyo.json（id『toyo』）は株式会社東陽テクニカ（証券コード8151、東証プライム）で、Abalanceの連結子会社TOYO Company Limited（英国領ケイマン諸島、議決権所有割合55.4%、2024年7月に米国ナスダック上場）とは同音異表記の別法人です。社名の一致だけで結びつけないよう、意図的にリンクしていません。
- relatedCompanies: ㈱紀陽銀行（src/data/companies/the-kiyo-bank.jsonとして登録済み、id『the-kiyo-bank』）は【株式の保有状況】の政策保有株式の表にありますが、保有目的が『安定した資金調達先の確保のために保有しております』という資金調達を理由とする銀行保有（株式数500株、貸借対照表計上額10百万円）であるため、銀行・保険会社を資金調達・保険取引目的では結ばないという規則により結んでいません。
- relatedCompanies: 持分法適用関連会社6社のうち明治機械株式会社以外の5社（東陽パワー株式会社、陽上パワー株式会社、常陽パワー匿名組合事業、日本シナジー電力匿名組合事業、北海道クリーンエネルギー蓄電合同会社）は、有価証券報告書にも上場している旨の注記がなく（明治機械株式会社だけに『(注)３．明治機械株式会社は、有価証券報告書を提出しております。』という注記があります）、src/data/companies/にも対応するエントリーが見当たらないため結んでいません。匿名組合事業・合同会社の形態のものはそもそも株式上場になじまない事業体です。
- relatedCompanies: 連結子会社であるVietnam Sunergy Joint Stock Company（VSUN）、TOYO Company Limited、TOYO SOLAR Company Limited、FUJI SOLAR株式会社、WWB株式会社、株式会社バローズ、株式会社カンパニオソーラー、日本未来エナジー株式会社、J.MIRAI株式会社、株式会社フレックスホールディングス、PV Repower株式会社等は、いずれも独立した上場会社ではなく（TOYOは米国ナスダック上場で、本百科事典が対象とする日本の証券取引所の上場企業には当たりません）、本百科事典に個別のページを持たないためrelatedCompaniesには含めていません。これらはbusinessStructure・history工程の本文で既に言及済みです。
- relatedCompanies: 明治機械株式会社との関係は、出資（36.3%の議決権所有）と役員の兼任のみが有価証券報告書に記載されており、商流（どちらが売り手・買い手か）や業務提携の内容は記載されていません。business-partnerは『filing documents a transaction... without saying who sells to whom』（取引の存在は書かれているが向きだけが書かれていない場合）のための分類ですが、明治機械の場合は取引そのものの記載がないため、business-partnerではなく、有価証券報告書が明記する事業区分の一致（グリーンエネルギー事業）に基づいてsame-industryとしました。
- relatedCompanies: 業務モデル（businessModel）、業界（industries）は担当外のため、このフラグメントには書いていません。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は助言のみで、companySchemaにrequiredTermIds・proposedTermsという項目はありません。書いても組み立て時に捨てられ、捨てた旨の警告が出るのは想定どおりです（docs/pipeline.mdのterms工程の説明のとおり）。
- terms: requiredTermIdsの2件：segment（セグメント）はbusinessModel工程の売上高・利益の説明、consolidated-subsidiary（連結子会社）はbusinessModel工程の『連結子会社43社』の説明に、それぞれ[[term:...]]リンクとして実際に使用しています。
- terms: proposedTermsは『持分法適用関連会社』の1件にとどめました。説明文（description）は実務対応報告第24号を直接引用したものではなく、企業会計基準委員会（ASBJ）・関連会社の一般的な定義（出資・人事・資金・取引等の関係を通じて財務及び営業の方針決定に重要な影響を与えられる会社）を踏まえた一般的な説明です。一次資料のPDF本文はこのセッションから直接取得できなかった（WebFetchがjpx.co.jpと同様のアクセス制限を受けたわけではなく未検証）ため、厳密な逐語引用ではないことを明記します。正式な用語登録時には実務対応報告第24号またはASBJの会計基準を直接確認することを推奨します。
- terms: 『政策保有株式』の用語提案は見送りました。本会社の有価証券報告書の政策保有株式の表には㈱紀陽銀行1件のみが記載されており、資金調達目的（銀行）のため relatedCompanies 工程では結んでいません。この会社のページ上で政策保有株式の概念がrelatedCompaniesの出典として使われることがないため、他社（a-and-a-materialやaisin等）のterms工程で既に提案されている語ですが、このページを理由にした重複提案はしていません。
- terms: 担当外の重要な気付き（needsReviewを参照）：当社は2026年7月31日付で東京証券取引所から監理銘柄（審査中）に指定されています。有価証券報告書の【事業等のリスク】及び【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】に記載があり、東京証券取引所自身の適時開示一覧（jpx.co.jp、検索結果の見出し『監理銘柄（審査中）の指定：Ａｂａｌａｎｃｅ（株）』2026年7月31日付）でも存在が確認できましたが、当該ページ本文はWebFetchがHTTP 403を返したため本文までは直接確認できていません。企業会計上の用語ではなく、この会社固有の規制上の出来事であるため、proposedTermsとしては提案せず、下のneedsReviewに記録しました。

## 要確認（status に反映）

- terms: 当社は2026年7月31日付で東京証券取引所から監理銘柄（審査中）に指定されています（有価証券報告書の【事業等のリスク】のガバナンス・内部管理体制の項、及び【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の『１．ガバナンス体制及び内部統制の改善・強化』に記載）。businessStructure・history・businessModel・industry・relatedCompanies・termsのいずれの工程にもこの指定を表すフィールドがなく、現状では組み立て後のエントリーのどこにも反映されません。読者が投資判断でなく『この会社を理解する』ために読むページであっても、上場廃止リスクの審査対象になっているという事実は重要度が高いと考えられるため、人による確認と、status（published / needs-attention）の判断を推奨します。businessStructure工程（abalance-businessStructure.json）も同じ趣旨の警告を既に記録しています。
