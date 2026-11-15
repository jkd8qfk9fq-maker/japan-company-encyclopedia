# セルシス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社セルシス |
| 証券コード | 3663 |
| docID（データを取り出した文書） | `S100XVIW` |
| 原本 docID | `S100XVIW` |
| 提出日（原本） | 2026-03-31 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVIW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社セルシス / 3663 / docID S100XVIW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
celsys: 10 件の数値を有報XBRLと照合
有報: 株式会社セルシス 有価証券報告書－第14期(2025/01/01－2025/12/31) (docID S100XVIW)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-12-31","previousFiling":6890802000,"latestFiling":726700000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-12-31","previousFiling":7543175000,"latestFiling":2759213000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":8091099000,"latestFiling":6007631000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":8204959000,"latestFiling":7143207000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":1419431000,"latestFiling":204336000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":1605351000,"latestFiling":616598000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":1404526000,"latestFiling":2242489000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":2279315000,"latestFiling":2985598000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":8344670000,"latestFiling":5495704000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":10156963000,"latestFiling":9592356000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":8551524000,"latestFiling":8683188000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":8431270000,"latestFiling":8156658000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":6576186000,"latestFiling":5218760000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":8224794000,"latestFiling":7783822000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":6660116000,"latestFiling":6844905000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":5418795000,"latestFiling":5264919000},{"key":"NumberOfEmployees|2021-12-31","previousFiling":260,"latestFiling":19},{"key":"NumberOfEmployees|2022-12-31","previousFiling":278,"latestFiling":203},{"key":"NumberOfEmployees|2023-12-31","previousFiling":237,"latestFiling":191},{"key":"NumberOfEmployees|2024-12-31","previousFiling":253,"latestFiling":207}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
celsys: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記７（2022年９月１日付で特定子会社かつ完全子会社の株式会社セルシスを吸収合併し、純粋持株会社から事業持株会社へ移行したことにより、第11期の経営指標等は第10期と比較して大幅に変動している旨）は、2022年12月期の２つ目の注記候補です。同年度は収益認識に関する会計基準の適用（注記８）を financialNotes に記録し、注記７は全文をこの warnings に記録しました。
- businessModel: 前期有報（第13期）の経営指標との数値の差異は、前期有報の指標が連結財務諸表に基づく数値であったのに対し、本有報の提出会社の経営指標等が単体決算の数値であること（注記９: 第13期まで連結財務諸表を作成）、および2022年９月の吸収合併による事業範囲の変化によるもので、訂正ではありません。当期の印字の数値を使用しています。
- businessModel: 財務諸表の組替えについて、抽出した注記の範囲では表示方法の変更に当たる記載は確認できず、識別できる表示上の変更は報告セグメントの変更（２セグメントから単一セグメントへの統合と分野への再定義）のみで、経営指標の算定基礎の変更ではないため warnings のみの扱いとしました。
- businessModel: 重要な後発事象として印字された自己株式の消却（2026年３月６日取締役会決議、2026年３月16日に普通株式1,500,000株を消却）は資本政策に関する事項のため、本文には書かず warnings に記録しました。
- businessModel: 中期経営計画の重要なKPIとして印字された自己資本当期純利益率（ROE）の目標値と、目標とする経営指標の数値は、投資・利益の指標であるため本文と perspectives には書いていません。
- businessModel: Wikipedia の記事「セルシス」は証券コードで同一性を確認しましたが、冒頭文は本社の所在地と事業の概要という有報の事実の言い換えにとどまるため、補足には使用していません。
- businessStructure: 報告セグメントは単一セグメントです。分野別の売上高はMD&Aの分野別売上高の印字（クリエイターサポート8,122,870千円／クリエイタープラットフォーム1,348,768千円、合計9,471,638千円で印字の売上高と一致）に基づきます。百万円への切り捨て後の分野合計（8,122＋1,348＝9,470百万円）は印字の売上高9,471百万円と１百万円差がありますが、切り捨てによる差異としてそのまま印字しています。セグメント利益は書いていません。
- businessStructure: 【関連情報】の製品及びサービスごとの情報は、単一の製品・サービスの区分が売上高の90％を超えるため省略されています。地域ごとの売上高（日本4,553百万円／米国1,327百万円／その他3,591百万円）は事業区分ではないため、事業の子区分にはしていません。
- businessStructure: 【主要な設備の状況】は本社（東京都新宿区）のみで、単一セグメントのためセグメント別の記載が省略されており、特定の分野には結びつけていません。帳簿価額は書いていません。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先名の印字はなく、提供形態として各種デバイス業者及び小売業者を通じた提供が記載されているのみです。
- businessStructure: 【関係会社の状況】は「該当事項はありません」であり、子会社・関連会社は登録していません。一方で【沿革】には2025年８月に英国ロンドンに子会社のCELSYS UK Ltd.を設立した旨が印字されており、この点は needsReview に記録しました。
- history: 沿革は年月まで印字されていますが、規則により年のみで登録しています。資本金の金額は書いていません。
- history: 省いた項目: 1993年以降の各言語版の提供開始（英語版・中国語版・フランス語版・スペイン語版・韓国語版・ドイツ語版・ポルトガル語版・インドネシア語版・タイ語版）、2009年の「IllustStudio」発売、2011年の名古屋証券取引所の上場廃止、2015年の「ComicStudio」「IllustStudio」販売終了、2019年の株式会社カンデラジャパン設立とCandera America Inc.設立、2022年の株式会社ＣＬＩＰソリューションズ設立と株式会社andDC3への商号変更、2024年の株式会社シージェイの清算結了です。
- history: 1991年設立の株式会社セルシスは、2012年に共同株式移転で設立された持株会社（アートスパークホールディングス株式会社）が2022年に吸収合併し、商号を株式会社セルシスに変更したものです。本文ではこの経緯が分かるよう各年次の出来事として記録しました。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、制作アプリ「CLIP STUDIO PAINT」の開発・提供と会員制Webサービス等のプラットフォーム提供が事業の中核であるため it としました。閉じた分類に直接当たるため、暫定分類や taxonomyGaps はありません。
- industry: 電子書籍ビューア等の流通ソリューションもソフトウェアの提供であり、独立した業界は付けていません。
- relatedCompanies: 候補 japan-securities-finance（日本証券金融株式会社）は、2025年12月31日現在で発行済株式（自己株式を除く）の4.31％を保有する大株主ですが、証券金融会社であり、取引・提携の記載はないためリンクしていません。
- relatedCompanies: 候補 mti（株式会社エムティーアイ）は、特定投資株式として800株を保有していますが、保有目的が「取引関係円滑化のため」という定型的な文言のみで、個別の取引・提携の印字がないためリンクしていません。
- relatedCompanies: 候補 m-up-holdings（株式会社エムアップホールディングス）は、特定投資株式として前期は20,000株を保有していましたが、当事業年度に保有がなくなり（売却）ためリンクしていません。
- relatedCompanies: 候補 port（ポート株式会社）は「サポート」、候補 en（株式会社エン・ジャパン、ambiguous）は「エンゲージメント」等の一般語、候補 lec（株式会社レック）は名古屋証券取引所「セントレックス」の部分文字列、候補 suzuki-6785（ambiguous）は役員の姓「鈴木」、候補 vision（株式会社ビジョン）は経営ビジョンの「ビジョン」の語、候補 career（株式会社キャリア）は「キャリア採用」の語、候補 core（株式会社コア、ambiguous）は「共通コアエンジン」の語、候補 seki（セキ株式会社、ambiguous）は「セキュリティ」等の語の一致であり、いずれも当該会社との関係を示す記載ではありません。
- relatedCompanies: 候補 friendly（株式会社フレンドリー）と候補 trust（株式会社トラスト）はコードリストにない（上場を確認できない）ためリンクしていません。いずれも本文中の一般語（サステナビリティ方針の「フレンドリー」、信託銀行名）の一致にとどまります。
- relatedCompanies: 候補外の関係として、大株主のLINE Digital Frontier株式会社（発行済株式の10.67％を保有）は未上場の法人であり候補にないためリンクしていません。WEBTOON Entertainment Inc.とは2021年12月に資本業務提携契約を締結していますが、候補にないためリンクしていません。かつて共同持株会社であった株式会社エイチアイ（現株式会社ミックウェア オートモーティブ）は2021年に全株式を売却済みであり、候補にないためリンクしていません。
- relatedCompanies: 2025年８月に設立した子会社のCELSYS UK Ltd.は自社グループのため結んでいません。
- terms: 助言のみの工程です。用語候補: 「CLIP STUDIO PAINT」（当社のイラスト・マンガ・Webtoon・アニメーション制作アプリ）、「CREATOR JOURNEY」（クリエイターとオーディエンスの活動の歩みを表す当社の概念）、「クリエイターエコノミー」（作品をつくるクリエイターとそれを楽しむオーディエンスの活動で生まれる市場）、「ボリュームライセンス」（プロの制作スタジオや教育機関向けの使用許諾の提供形態）、「サブスクリプションモデル」（継続利用料の提供形態）。いずれも本文で使った語で、有報の説明に基づきます。

## 要確認（status に反映）

- businessModel: 2021年７月１日に普通株式１株を４株に分割しており、主要な経営指標等の株式関連の指標は、当該分割が第10期の期首に行われたものと仮定して算定して印字されています（主要な経営指標等の推移の注記に記載）。本登録はこの算定後の数値に基づいています。
- businessStructure: 【沿革】には2025年８月に英国ロンドンに子会社CELSYS UK Ltd.を設立したと印字されていますが、【関係会社の状況】は「該当事項はありません」となっており、本登録では子会社を登録していません。子会社の取扱いは人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
