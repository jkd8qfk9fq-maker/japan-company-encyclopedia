# HENNGE — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＨＥＮＮＧＥ株式会社 |
| 証券コード | 4475 |
| docID（データを取り出した文書） | `S100XCC9` |
| 原本 docID | `S100XCC9` |
| 提出日（原本） | 2025-12-24 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XCC9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＨＥＮＮＧＥ株式会社 / 4475 / docID S100XCC9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hennge: 10 件の数値を有報XBRLと照合
有報: ＨＥＮＮＧＥ株式会社 有価証券報告書－第29期(2024/10/01－2025/09/30) (docID S100XCC9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hennge: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「HENNGE株式会社」が EDINET の提出者名「ＨＥＮＮＧＥ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記（注１〜注３）のうち、千円表示の端数処理、潜在株式が存在しないこと、従業員数は就業人員であることは表示上の事項のため financialNotes には書いていません。株式分割（注４）と収益認識基準の適用（注５）だけを financialNotes に書きました。
- businessModel: 【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の段階利益の金額・増減率・理由、キャッシュ・フローの金額、財政状態の内訳金額は書いていません。売上高の増減率と売上区分別の売上高だけを本文に使いました。
- businessModel: 売上高の合計は、主要な経営指標等の千円額（10,923,564千円）を切り捨てると10,923百万円ですが、本文では【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】に印字された10,924百万円と、売上区分別の印字額（10,259百万円＋665百万円＝10,924百万円）で統一しました。
- businessModel: 経営指標として重視されるLTV・ARR・契約企業数・契約ユーザ数・解約率の数値は、契約・運用指標のため本文には書いていません（方針としてのARRへの着目だけを perspectives の strategy に書きました）。
- businessModel: 【重要な後発事象】の自己株式の取得（2025年11月21日の取締役会決議に基づく取得で、提出日までに取得を終了）は資本政策の決議・実施のため、本文にも needsReview にも入れず、ここに記録します。金額と株式数は書いていません。
- businessModel: 前期有報との修正再表示チェックは全系列で差異ゼロでした。訂正有報はありません（訂正の有無はDEIで false）。
- businessStructure: 当社グループは単一セグメントであり、セグメント別の記載は省略されています。事業は【事業の内容】の売上区分（HENNGE One事業／プロフェッショナル・サービス及びその他事業）の2区分で記載し、金額は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の販売実績に印字された売上区分別の金額を用いました。子区分（Identity／DLP／Cybersecurity、Customers Mail Cloud）の金額は独立して開示されていません。
- businessStructure: このツリーのスキーマには suppliers キーがないため、仕入先に関する事実はここに記録します。【事業等のリスク】に、HENNGE Oneの提供基盤としてAWS（Amazon Web Services）を利用している旨が印字されていますが、個別の仕入先としての取引条件は印字されていません。
- businessStructure: 連結子会社は台灣惠頂益股份有限公司（台湾、議決権所有割合100％、特定子会社）とHENNGE Inc.（米国、議決権所有割合51％）の2社で、いずれもHENNGE One事業を担います。自社の子会社のため関連企業には結んでいません。
- businessStructure: 主要な設備は本社（東京都渋谷区）の事務所設備等のみで、単一セグメントのため事業全体に結びつけました。設備の帳簿価額や年間賃借料は書いていません。
- businessStructure: 主要な顧客ごとの情報は【関連情報】に印字されています（関連企業は relatedCompanies に記載）。国内の外部顧客への売上高が90％を超えるため、地域ごとの情報は省略されています。
- history: 【沿革】から省いた項目と理由：株式会社への組織変更（1997年、形態変更のみ）、ISMS（ISO27001）認証取得（2007年、認証）、大阪・名古屋・福岡の各ブランチオフィスの開設・移転（2015〜2025年、拠点）、「HENNGE Workstyle」「Chromo Education」「CHROMO（クロモ）」「SumaMachi（スマまち）」等の個別サービスの販売開始（2019〜2021年、個別製品）、「HENNGE Lock」の提供開始（2020年、機能）、「HENNGE Connect」の提供開始と「tadrill」の提供開始（2022年、機能・個別製品。HENNGE Connectは事業構造に記載）、「HENNGE Secure Download for Box」の提供開始（2023年、機能）、Edition変更・価格改定（2024年、料金施策）、「HDE Controller」のサービス終了（2024年、終了）、File DLP・Tadrillの機能提供とプロビジョニング機能の提供開始（2024年、機能）、「Tadrill Lite」の提供開始（2025年、機能）、IssueHunt株式会社への出資（2025年、【経営方針、経営環境及び対処すべき課題等】に記載の事業投資で、沿革の項目としては米国子会社設立に集約）、Customers Mail CloudのAWS Marketplace提供開始（2025年、販路）。
- history: 【沿革】末尾の注記にある事業年度末日後の事象（2025年11月の広島ブランチオフィス開設と、Customers Mail CloudのAWS認定ソフトウェア認定）は、決算期後の出来事のため沿革には入れず、ここに記録します。
- history: 2025年3月にHENNGE OneのARRが100億円を突破した旨が【沿革】に印字されていますが、ARRは契約・運用指標のため沿革の本文には書いていません。
- history: 沿革の表は年月と事象が対応して印字されており、年だけを取り出して記載しました。資本金の金額は書いていません。
- industry: DEIの別記事業は「cte」ですが、事業の実体に合わせて分類しました（このツリーのゲートに合わせ industryId キーで記録）。
- industry: it を主としました。自社開発のソフトウエアをSaaSとして提供する事業が中核のためです。
- industry: telecommunications は付けませんでした。メール配信サービスを提供しますが、電気通信事業者として回線を提供する事業ではないためです。
- industry: 合う区分が閉じた集合に無い事業はなく、直接の適合のため taxonomyGaps には記録していません。
- relatedCompanies: en：ambiguous の候補で、「エンタープライズ」等の部分文字列の一致のみであり、エン株式会社についての記載はないため結びませんでした。
- relatedCompanies: secure：「セキュアなアクセス」等の一般語の一致のみで、株式会社セキュアについての記載はないため結びませんでした。
- relatedCompanies: core：ambiguous の候補で、「コア・バリュー」等の一般語の一致のみであり、株式会社コアについての記載はないため結びませんでした。
- relatedCompanies: kohsoku：ambiguous の候補で、「高速に配信」等の一般語の一致のみであり、株式会社高速についての記載はないため結びませんでした。
- relatedCompanies: port：「サポート」等の部分文字列の一致のみで、ポート株式会社についての記載はないため結びませんでした。
- relatedCompanies: nissin：コードリストにない候補で、一致箇所も新株予約権の行使期間等の文章中の語であるため結びませんでした（ambiguous）。
- relatedCompanies: path：ambiguous の候補で、「パスワード」等の部分文字列の一致のみであり、パス株式会社についての記載はないため結びませんでした。
- relatedCompanies: vision：「ビジョン」等の一般語の一致のみで、株式会社ビジョンについての記載はないため結びませんでした。
- relatedCompanies: base-4481：「クラウドベース」等の部分文字列の一致のみで、ベース株式会社についての記載はないため結びませんでした。
- relatedCompanies: innovation：「イノベーション」等の一般語の一致のみで、株式会社イノベーションについての記載はないため結びませんでした。
- relatedCompanies: the-lead：「リード投資家」等の一般語の一致のみで、株式会社リードについての記載はないため結びませんでした。
- relatedCompanies: land：「ブランド」等の部分文字列の一致のみで、株式会社ランドについての記載はないため結びませんでした。
- relatedCompanies: lec：「フレックス」等の部分文字列の一致のみで、レック株式会社についての記載はないため結びませんでした。
- relatedCompanies: ray：ambiguous の候補で、「AWSマーケットプレイス」等の文章中の語の一致のみであり、株式会社レイについての記載はないため結びませんでした。
- relatedCompanies: career：「キャリア形成」等の一般語の一致のみで、株式会社キャリアについての記載はないため結びませんでした。
- relatedCompanies: taya：ambiguous の候補で、大株主の個人の住所（東京都世田谷区）との一致のみであり、株式会社田谷についての記載はないため結びませんでした。
- relatedCompanies: zero：ambiguous の候補で、「ゼロコストオプション」等の文章中の語の一致のみであり、株式会社ゼロについての記載はないため結びませんでした。
- relatedCompanies: 候補外で結ばなかった相手：SB C&S株式会社は【関連情報】の主要な顧客ごとの情報と主な相手先別の販売実績に主要な相手先として掲載されていますが、related-candidates.json に無いため結んでいません。株式会社サンブリッジコーポレーションは合弁会社HENNGE Inc.の共同出資者ですが、候補に無いため結んでいません。株式会社kickflowは沿革に資本業務提携の記載がありますが、候補に無いため結んでいません。IssueHunt株式会社とRunetale株式会社への出資の記載がありますが、いずれも候補に無く、非上場の出資先のため結んでいません。連結子会社の台灣惠頂益股份有限公司とHENNGE Inc.は自社の子会社のため結んでいません。大株主は創業者ら個人と信託口・常任代理人経由の金融機関等が中心で、事業会社の大株主として結べる相手はありませんでした。特定投資株式の銘柄ごとの情報は「該当事項はありません」でした。
- terms: 用語の提案（助言のみ）：「SaaS（Software as a Service）」（パッケージソフトウエアをクラウドサービスとしてネットワーク経由で提供する形態。同社の事業形態の中核）、「シングルサインオン」（単一のIDとパスワードで複数のクラウドサービスへ横断的にログインできる仕組み。HENNGE One Identityの中核機能）、「サブスクリプション型のリカーリング・レベニューモデル」（利用期間に応じた料金を利用アカウント単位で定期購読の形で受け取り、解約されない限り収益が積み上がる同社の課金モデル）、「デバイス証明書」（端末にあらかじめ入れておき、ログイン時に検査することで接続元を限定する電子証明書）、「ARR（Annual Recurring Revenue）」（月末時点の月額利用料金を12倍して年額に換算した年間契約金額の総額。同社が重視する指標）。

## 要確認（status に反映）

- businessModel: 2022年１月１日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第25期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
