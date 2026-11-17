# Value Creation — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | バリュークリエーション株式会社 |
| 証券コード | 9238 |
| docID（データを取り出した文書） | `S100YRA4` |
| 原本 docID | `S100Y7MG` |
| 提出日（原本） | 2026-05-29 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100YRA4, S100Y7L9, S100Y7L2／有効文書 S100YRA4（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YRA4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | バリュークリエーション株式会社 / 9238 / docID S100Y7MG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 6 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
value-creation: 10 件の数値を有報XBRLと照合
有報: バリュークリエーション株式会社 訂正有価証券報告書－第18期(2025/03/01－2026/02/28) (docID S100YRA4)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-02-28","previousFiling":2438401000,"latestFiling":2281787000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-02-28","previousFiling":2823748000,"latestFiling":2524390000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-02-29","previousFiling":2948333000,"latestFiling":2655578000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-02-28","previousFiling":3431976000,"latestFiling":3071001000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2022-02-28","previousFiling":16668000,"latestFiling":-142231000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2023-02-28","previousFiling":86032000,"latestFiling":91432000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2024-02-29","previousFiling":114358000,"latestFiling":171515000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2025-02-28","previousFiling":86373000,"latestFiling":119383000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-02-28","previousFiling":28319000,"latestFiling":-128294000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-02-28","previousFiling":121270000,"latestFiling":127368000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-02-29","previousFiling":166750000,"latestFiling":248812000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-02-28","previousFiling":131657000,"latestFiling":282218000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-02-28","previousFiling":3927390000,"latestFiling":1259114000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-02-28","previousFiling":3290867000,"latestFiling":1425821000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-02-29","previousFiling":3628388000,"latestFiling":1771869000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-02-28","previousFiling":4304988000,"latestFiling":1793704000},{"key":"NetAssetsSummaryOfBusinessResults|2022-02-28","previousFiling":61260000,"latestFiling":-229893000},{"key":"NetAssetsSummaryOfBusinessResults|2023-02-28","previousFiling":147292000,"latestFiling":-138460000},{"key":"NetAssetsSummaryOfBusinessResults|2024-02-29","previousFiling":509247000,"latestFiling":280650000},{"key":"NetAssetsSummaryOfBusinessResults|2025-02-28","previousFiling":581816000,"latestFiling":386230000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第18期(2025/03/01－2026/02/28)、docID S100YRA4）を有効文書としてこのパックを作った。原本は docID S100Y7MG。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutParentCompanyEtcOfReportingCompanyTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 訂正有価証券報告書－第17期(2024/03/01－2025/02/28) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第16期(2023/03/01－2024/02/29) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
value-creation: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…」を掲げ、クライアントの「企業価値と利益を最大化すること」に向けた多角的なソ…）

## エージェントの判断記録（fragment warnings）

- businessModel: 第18期の有価証券報告書には訂正報告書（docID S100YRA4、2026年7月17日提出）が提出されており、本登録は訂正報告書を有効文書として作成し、出典も訂正報告書に付けています。訂正で変わったのは提出会社の親会社等の情報に関するテキストブロックのみで、財務の数値・本文・主要な経営指標等に変更はなく、原本（docID S100Y7MG）と主要財務（5系列・従業員数）が同一であることを証拠パックの照合で確認しています。
- businessModel: 前期有報との照合で、売上高・当期純利益・総資産・純資産の過年度数値に差異があります。これは、ジー・プラン株式会社との取引に含まれていた架空循環取引について、実在性を確認できなかった取引の売上高及びその他の科目を過年度にわたって修正したためであり、本登録は当期有報（訂正後）の印字値を採用しています。経緯は needsReview にも記載しています。
- businessModel: 本件に伴い、会社は財務報告に係る内部統制に開示すべき重要な不備があったと判断し、2026年5月29日付で第16期及び第17期の内部統制報告書の訂正報告書も提出しています。再発防止策（成果物開示要件の厳格化、下流取引先に対する受注能力審査の制度化等）は今後の実施事項のため、本文には書かずここに記録します。
- businessModel: 会社が重視する客観的な指標には利益に関する指標が含まれるため、戦略の本文には数値目標を書かず、取引継続率約97％の事実のみを競争優位の分析に記載しています。中期的な数値目標の開示はありません。
- businessModel: 資本金は第17期の157,839千円から第18期は52,444千円へ減少しています（主要な経営指標等の印字どおり）。また、当事業年度に自己株式の取得を行っています。いずれも資本政策の事項のため本文には書かず、ここに記録します。
- businessModel: 暗号資産の売買に関する収益等が計上されていますが、報告セグメントとして開示された事業ではないため、本文には書かずここに記録します。
- businessModel: 第14期及び第15期は純資産額がマイナスでした（主要な経営指標等の印字どおり）。第16期に東京証券取引所グロース市場へ上場しています。過年度の数値そのものは訂正後の印字値をそのまま登録しています。
- businessModel: 主要な経営指標等の注記3～10（潜在株式調整後1株当たり当期純利益の非開示理由、自己資本比率・自己資本利益率・株価収益率・配当性向の非開示理由、従業員数の定義等）は表示・算定の事項のため、financialNotesにはせずここに記録します。
- businessStructure: 関係会社の状況は「該当事項はありません」で、子会社・関連会社はありません。連結財務諸表も作成していません。
- businessStructure: 広告媒体の仕入れ先は、検索連動型広告等を提供するプラットフォーム事業者ですが、本ツリーのスキーマでは suppliers キーを省略するため、ここに記録します。個別の仕入先名は事業の内容に明示されていません。
- businessStructure: 主な相手先別の販売実績では、前事業年度に株式会社スタイルワンが総販売実績の10.5％を占めましたが、当事業年度は10％未満のため金額の記載が省略されています。
- history: 沿革のうち、本社移転（2015年・2016年・2024年）、プライバシーマークの認証取得（2012年）、フランチャイズ事業の開始（2011年）とストレッチアップ事業の開始（2014年）、「人生に役立つ」を網羅するサイト「Mola」のオープン（2020年）、YMAAマーク制度の認定（2020年）、日本インタラクティブ広告協会への入会（2022年）とデジタル広告品質認証機構の認証取得（2022年）、三井住友海上火災保険株式会社との代理店委託契約（2022年）は、事業の転機ではないため沿革には含めていません。
- history: 沿革に記載のある業務提携契約の締結（2020年リビン・テクノロジーズ株式会社、2023年かっこ株式会社・株式会社アズーム・空き家活用株式会社、2024年株式会社ストレージ王・株式会社スマテン・株式会社AlbaLink・株式会社マーケットエンタープライズ・株式会社フィル・カンパニー）と、川崎市との連携協定（2023年・2025年）、株式会社オリコとの「解体の窓口ローン」の商品化（2024年）は、個別の提携・協定の締結であり沿革には含めていません（かっこ株式会社との関係は relatedCompanies に記載）。
- history: 「解体の窓口」の加盟社数・マッチング希望者数の節目（2022年～2025年）、解体エージェントへのAIシミュレーションモデルの搭載（2024年）、Uber Eatsにおける売上向上を目的とするコンサルティング事業の開始（2024年）、特定建設業の許可取得（2025年）は沿革には含めていません。
- industry: 不動産DX事業は不動産領域のマッチングプラットフォームの運営であり、不動産の売買・賃貸そのものではないため、real-estate は付けていません。
- relatedCompanies: 提出会社の親会社等の情報に、金融商品取引法第24条の７第１項に規定する親会社等は合同会社ひまわりと記載されており、大株主の状況でも56.50％を保有する筆頭株主ですが、非上場の合同会社で候補にはないためリンクしていません。
- relatedCompanies: 架空循環取引の相手方であるジー・プラン株式会社は非上場で候補にはなく、その親会社であるKDDI株式会社自体とは取引・提携・資本関係の記載がないため、いずれもリンクしていません（本件の経緯は businessModel の needsReview に記載）。
- relatedCompanies: 沿革の代理店委託契約（2022年）の相手方は三井住友海上火災保険株式会社であり、上場持株会社であるMS&ADインシュアランスグループホールディングスとは別法人格のため、置き換えてリンクしていません。
- relatedCompanies: 沿革に業務提携契約の締結が記載されているリビン・テクノロジーズ株式会社（2020年）、株式会社アズーム（2023年）、株式会社ストレージ王、株式会社マーケットエンタープライズ、株式会社フィル・カンパニー（いずれも2024年）は、沿革上の提携締結の記載のみで、現在の取引・資本関係の記載がないためリンクしていません。株式会社オリコとの「解体の窓口ローン」の商品化（2024年）も同様です。
- relatedCompanies: 株式会社デジタルプラスは、2025年4月にデジタルマーケティング支援事業を譲り受けた相手方であり、継続的な取引・提携・資本関係の記載がないためリンクしていません。Dad株式会社（LISMA事業の譲渡元）も非上場で候補にはありません。
- relatedCompanies: 売掛金の相手先別内訳に記載のある株式会社コナカ、株式会社LLL、株式会社フラットは、債権残高の内訳としての記載のみで、個別の取引・提携関係の記載がないためリンクしていません。主な相手先別の販売実績に前事業年度の主要顧客として記載のある株式会社スタイルワンは非上場で候補にはありません。
- relatedCompanies: 大株主の株式会社アンビション・ベンチャーズ（0.55％）は非上場で候補にはないためリンクしていません。その他の大株主は個人、証券会社の共有口等です。
- relatedCompanies: 当社は投資株式を保有しておらず（純投資目的・純投資目的以外のいずれも該当事項なし）、政策保有株式の開示はありません。
- relatedCompanies: 株式会社電通は、広告費統計の引用元としての記載のみで、関係はありません。
- terms: 助言: 用語「運用型広告」は、インターネットのユーザーに対し、リアルタイムに入札額やクリエイティブ、ターゲット等を変更・改善しながら配信する広告を指します。検索連動型広告、ディスプレイ広告、インフィード広告が含まれ、同社のマーケティングDX事業の中核サービスです。
- terms: 助言: 用語「レガシー業界」は、総務省の調査研究に基づき、2020年時点でDXに取り組みがない企業数が全体の75％以上の業界を「取り組みが遅れている業界」として同社が定義する呼び方で、マーケティングDX事業の主な支援対象を表します。
- terms: 助言: 用語「解体の窓口」は、同社が運営する解体業者マッチングメディアの名称です。物件を解体したいユーザーと解体業者をマッチングし、解体業者同士が安値の見積もりを競う「逆オークション」の仕組みを採用しています。
- terms: 助言: 用語「取引継続率」は、前月から当月に継続した社数と、過去に取引があった先で当月に取引を再開した社数を分子、前月の取引社数を分母として算出する同社の指標で、マーケティングDX事業の顧客との関係の継続度合いを表します。

## 要確認（status に反映）

- businessModel: 2023年８月25日付で普通株式１株につき20株の割合で、2024年３月16日付で普通株式１株につき２株の割合で株式分割を行っています。主要な経営指標等の注記に、第14期の数値は当該株式分割が第14期の期首に行われたと仮定して算出されている旨が記載されています。本登録は株式分割後の株式数に基づく指標で登録しています。
- businessModel: ジー・プラン株式会社との取引に架空循環取引が含まれていたことが特別調査委員会の調査で判明し、実在性を確認できなかった取引について売上高及びその他の科目の過年度修正を行うとともに、2026年５月29日付で第16期・第17期を含む過年度の有価証券報告書及び内部統制報告書の訂正報告書を提出しています。本登録の過年度数値は、訂正後の数値で登録しています。
- businessModel: 当事業年度は当期純損失を計上し、主要取引先との取引停止等の影響もあって、会社は継続企業の前提に重要な疑義を生じさせるような事象又は状況が存在していると認識しています。一方で、当事業年度末の現金及び現金同等物の残高から今後12ヶ月間の資金繰りに重要な懸念がないとして、継続企業の前提に関する重要な不確実性は認められないと判断しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] バリュークリエーションのマーケティングDX事業（運用型広告を中心とするマーケティング支援） → 提案: 広告・マーケティング（インターネット広告・マーケティング支援）。最大の報告セグメントであるマーケティングDX事業（2026年2月期の外部顧客への売上高2,779百万円で売上高全体の約9割）は、運用型広告の運用を中心とする広告・マーケティング支援であり、報道・出版・放送といった媒体の運営でも、IT・ソフトウェアの提供でもない。閉じた分類（INDUSTRY_IDS）に広告・マーケティングの区分が無く、最も近い media を暫定の主たる業界とした。アドウェイズ、売れるネット広告社グループなど広告支援事業者の先例と同じ事情。不動産DX事業（347百万円）は解体業者のマッチングプラットフォームであり、media の範疇で捉えている。
