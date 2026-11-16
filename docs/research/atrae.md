# アトラエ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アトラエ |
| 証券コード | 6194 |
| docID（データを取り出した文書） | `S100XAZ6` |
| 原本 docID | `S100XAZ6` |
| 提出日（原本） | 2025-12-17 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XAZ6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アトラエ / 6194 / docID S100XAZ6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
atrae: 10 件の数値を有報XBRLと照合
有報: 株式会社アトラエ 有価証券報告書－第22期(2024/10/01－2025/09/30) (docID S100XAZ6)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-09-30","previousFiling":4464211000,"latestFiling":4464611000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-09-30","previousFiling":6588053000,"latestFiling":6336793000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-09-30","previousFiling":7757523000,"latestFiling":7299491000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-09-30","previousFiling":8598696000,"latestFiling":7641907000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-09-30","previousFiling":1005868000,"latestFiling":1061789000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-09-30","previousFiling":1059276000,"latestFiling":1107442000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-09-30","previousFiling":922591000,"latestFiling":850717000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-09-30","previousFiling":1543616000,"latestFiling":1646110000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-09-30","previousFiling":6404851000,"latestFiling":6424168000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-09-30","previousFiling":7400069000,"latestFiling":7428602000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":7149650000,"latestFiling":7029013000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":7218703000,"latestFiling":7234921000},{"key":"NetAssetsSummaryOfBusinessResults|2021-09-30","previousFiling":5111711000,"latestFiling":5172288000},{"key":"NetAssetsSummaryOfBusinessResults|2022-09-30","previousFiling":5926697000,"latestFiling":6039336000},{"key":"NetAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":5551825000,"latestFiling":5596925000},{"key":"NetAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":5309331000,"latestFiling":5325549000},{"key":"NumberOfEmployees|2021-09-30","previousFiling":77,"latestFiling":70},{"key":"NumberOfEmployees|2022-09-30","previousFiling":98,"latestFiling":86},{"key":"NumberOfEmployees|2023-09-30","previousFiling":104,"latestFiling":91}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
atrae: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] financials[3].note: 売上高と当期純利益以外の利益に触れていないか確認する（…1期までの持分法を適用した場合の投資利益、営業活動によるキャッシュ・フロー、…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益だけとした。営業利益・経常利益の金額や増減理由、税引前当期純利益、株式報酬費用、設備の帳簿価額、借入未実行残高などは書かなかった。金額は印字の千円額を百万円未満切り捨てで表記した（売上高7,634百万円、当期純利益1,171百万円、前期の当期純利益704百万円）。
- businessModel: 前期有報（第21期）との突き合わせで売上高・利益・総資産・純資産・従業員数に差異が出たのは、前期有報で突き合わせ対象となったのが連結経営指標等の数値だったためである。今期有報の5年表は提出会社の経営指標等で一貫しており、登録する数値は今期有報の印字どおりとした。
- businessModel: 経営指標等の注記のうち、配当を実施していない期間の配当額・配当性向の非表示、株式分割による権利落後の株価である旨、従業員数は就業人員である旨、第21期の潜在株式調整後1株当たり当期純利益の非表示、株主総利回りの比較指標の変更（第21期より配当込みTOPIX）は表示事項のため警告に留めた。株式分割そのものは needsReview に記録した。
- businessModel: 重要な後発事象の資本金及び資本準備金の額の減少（2025年11月13日取締役会決議、2025年12月19日開催予定の定時株主総会に付議、効力発生は2026年1月30日予定）は、純資産の部の科目間の振替で資本政策に関する事項のため、本文には書かず警告に留めた。
- businessModel: 経営上の目標の達成状況を判断するための客観的な指標として売上高と生産性（社員一人当たり売上高）が挙げられていますが、数値目標は本文にも perspectives にも書かなかった。
- businessModel: Wikipediaの記事「アトラエ」は見つかりましたが、冒頭文は有報の事業内容の言い換えにとどまるため使わなかった。
- businessStructure: 単一セグメントのため、事業の金額はセグメント情報等【関連情報】の製品及びサービスごとの情報の外部顧客への売上高を用い、印字の千円額を百万円未満切り捨てで表記した（Green 4,425百万円、Wevox 3,154百万円、新規事業その他54百万円）。切り捨て後の部分合計は7,633百万円となり、印字の合計7,634百万円と1百万円差があるが、印字の合計をそのまま用いた。
- businessStructure: suppliers はこのツリーの旧スキーマに無いため書かなかった。仕入先・外注先の個別名は【事業の内容】に記載がなく、主な資産及び負債の内容の買掛金・未払金の相手先一覧に載る企業名は残高一覧の記載のみのため、事業構造にも関連企業にも結ばなかった。
- businessStructure: 設備は本社のみで、単一セグメントのためセグメント別の記載が省略されている。本社設備を People Tech事業に結びつけ、帳簿価額や賃借料は書かなかった。
- businessStructure: 報告セグメントは従来「People Tech事業」と「Sports Tech事業」の2区分でしたが、前事業年度に Sports Tech事業に含めていた株式会社アルティーリの株式の一部を譲渡し、同社が連結の範囲から外れたため、当事業年度から People Tech事業の単一セグメントに変更されています。登録は2025年9月30日現在の単一セグメント構造で行った。
- history: 沿革の表は年月セルと事象文が分かれて印字されている箇所があり、年月（「〃」を含む）と事象の数が同じ箇所は行順で対応づけた（2016年6月・9月、2017年3月・5月、2018年6月・2020年5月・7月、2021年2月・9月、2021年10月・2022年4月・5月・2023年10月・2024年7月の各ブロック）。採用した行のうちSMBC Wevoxの設立とアルティーリの株式譲渡は、【関係会社の状況】と【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】でも裏付けられる。年月は落として年のみを記録し、資本金の金額は書かなかった。
- history: 落とした行: 2003年11月・2005年5月・2006年2月・2010年10月・2014年7月・2020年5月の本社移転、2005年4月の商号変更（I&Gパートナーズへの変更は中間の商号のため）、2007年2月・2011年9月のGreenのウェブサイト全面リニューアル、2008年1月のモバイルサイト提供開始、2012年12月・2013年4月のソーシャルリクルーティングサービス「JobShare」の開始と全雇用形態対応、2015年12月のYentaクローズドベータ版リリース、2016年9月のWevox立ち上げの意思決定、2017年3月のYenta有料プランのリリース、2021年2月のGreenのAndroid版アプリのリリース、2021年9月のYenta Web版のリリース、2021年10月のアルティーリ千葉のBリーグ新規参入、2022年5月の「Wevox組織カルチャー」の提供開始。いずれも拠点の移転やサービスの細目であり、事業の転機ではないため。
- industry: 主たる業界は human-resources とした。単一セグメントの People Tech事業は、求人メディア「Green」や組織力向上プラットフォーム「Wevox」など人材サービスそのものであり、閉じた分類の人材サービスに直接当たるため暫定とはしなかった。
- relatedCompanies: eucalia（株式会社ユカリア）: 特定投資株式として保有し、保有目的には「Wevox」の医療業界への導入推進に必要な知見の獲得という個別の事業シナジーの説明があるが、相手との取引や提携そのものの記載はなく、関係は政策保有株式の保有にとどまるため結ばなかった。
- relatedCompanies: cyberagent（株式会社サイバーエージェント）: 主な資産及び負債の内容の未払金の相手先一覧に載るのみで、個別の取引の説明がないため結ばなかった。
- relatedCompanies: crowdworks（株式会社クラウドワークス）: 主な資産及び負債の内容の買掛金の相手先一覧に載るのみで、個別の取引の説明がないため結ばなかった。
- relatedCompanies: dai-nippon-printing（大日本印刷株式会社）・shimizu（清水建設株式会社）: 主な資産及び負債の内容の相手先一覧に載るのみで、個別の取引の説明がないため結ばなかった。
- relatedCompanies: en（エン・ジャパン）・innovation（イノベーション）・career（キャリア）・vision（ビジョン）・base-4481（ベース）・port（ポート）・land（ランド）・lec（レック）・king（キング）・corona（コロナ）: エンゲージメント、オープンイノベーション、キャリア、新型コロナウイルス感染症など一般語・部分一致のため結ばなかった。
- relatedCompanies: core（コア）・ray（レイ）・rikei（理経）: 社名の部分一致のみで、当社との関係の記載がないため結ばなかった（ambiguous の候補）。
- relatedCompanies: suzuki-6785（鈴木）: 取締役CFOの姓との一致のため結ばなかった。
- relatedCompanies: secure（セキュア）: セキュリティ等の語句との部分一致のため結ばなかった。
- relatedCompanies: nissin（日新）・trust（トラスト）: コードリストにない候補であり、日本マスタートラスト信託銀行（信託口）等の信託口の記載との一致のため結ばなかった。
- relatedCompanies: 候補に無い相手: 合同会社ラウレアは2025年9月30日現在の筆頭株主（29.96％）ですが、創業者の資産管理会社とみられ候補に無いため結ばず警告に留めた。SMBC Wevox株式会社と株式会社アルティーリは当社の関連会社であり、候補にも無いため結ばなかった。グーグル合同会社、株式会社Hakuhodo DY ONE、株式会社UPSIDERホールディングスは相手先一覧に載るのみで候補に無いため結ばなかった。ニュートン・インベストメント・マネジメント・ジャパン株式会社は大量保有報告書の記載のみで、大株主の状況には含まれていないため結ばなかった。
- terms: 助言: 用語「成功報酬型」は、求人広告の掲載時点で料金が発生するのではなく、求職者が求人企業へ入社した段階で成功報酬が発生する料金体系を指すものとして、事業の内容で説明されています。
- terms: 助言: 用語「エンゲージメント」は、組織に対する自発的な貢献意欲や主体的に仕事に取り組んでいる心理状態を評価した指標として、事業の内容で説明されています。
- terms: 助言: 用語「People Tech」は、「テクノロジーによって人の可能性を拡げる事業」を表す当社の再定義した呼び名として、事業の内容と経営方針で説明されています。
- terms: 助言: 用語「書類選考通過率」は、「書類選考に通過する件数÷書類選考に応募する件数」で算出する当社の管理指標として、事業の内容で説明されています。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2021年４月１日付で普通株式１株につき２株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
