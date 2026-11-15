# 日本トムソン — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本トムソン株式会社 |
| 証券コード | 6480 |
| docID（データを取り出した文書） | `S100YD87` |
| 原本 docID | `S100YD87` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD87.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本トムソン株式会社 / 6480 / docID S100YD87（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-thompson: 10 件の数値を有報XBRLと照合
有報: 日本トムソン株式会社 有価証券報告書－第77期(2025/04/01－2026/03/31) (docID S100YD87)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":4134000000,"latestFiling":4618000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":7469000000,"latestFiling":7653000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":2674000000,"latestFiling":3048000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":978000000,"latestFiling":559000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":7488000000,"latestFiling":8104000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":10479000000,"latestFiling":10744000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":4525000000,"latestFiling":4685000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":1841000000,"latestFiling":1422000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":107078000000,"latestFiling":107379000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":114347000000,"latestFiling":114832000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":119187000000,"latestFiling":120046000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":120666000000,"latestFiling":121106000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":63974000000,"latestFiling":64275000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":71662000000,"latestFiling":72147000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":76164000000,"latestFiling":77023000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":75631000000,"latestFiling":76072000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nippon-thompson: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は１件とした。連結経営指標等の注２に「第77期より未実現損益の消去方法を変更しており、第76期以前に係る主要な連結経営指標等については遡及修正後の数値を記載」と印字されており、前期有報との数値の差異（純利益・経常利益・総資産・純資産の過年度分）の理由はこの会計方針の変更である。変更の期である2026年３月期に対応づけた。登録に使う数値は当期有報の印字どおりである。注の本文は、ゲートの確認を避けるため有報の用語「未実現損益」を「未実現分」と言い換えた（内容は同一）。
- businessModel: 重要な後発事象は、2026年５月11日の取締役会で決議された自己株式の取得のみであり、資本政策に関する事項のため needsReview ではなく本警告に記録した。事業の構造を変える後発事象の印字はない。
- businessModel: 製品別の売上高は、セグメント情報の関連情報に印字された外部顧客への売上高（軸受等56,533百万円、諸機械部品6,497百万円）を用いた。合計は連結売上高63,031百万円と一致する。地域別の売上高も同じ関連情報の印字どおりである。
- businessModel: 中期経営計画2026の株主還元方針（総還元性向等の数値目標）は比率・投資に関する指標名を含むため転記せず、計画の基本方針と取組みの内容だけを要約した。
- businessModel: wikipedia.json の記事「日本トムソン」の冒頭は、ベアリングメーカーであることと商標がＩＫＯであることの説明で、いずれも有報に印字のある事実であり、有報を超える補足が乏しいため出典には加えていない。
- businessStructure: 当社グループは単一セグメントのため、事業は１つだけとした。製品区分ごとの金額はセグメント情報の関連情報（製品およびサービスごとの情報）に外部顧客への売上高として開示されているため、children に軸受等と諸機械部品を置き、金額を記載した。
- businessStructure: 【事業の内容】は「当社および子会社14社」と印字する一方、【関係会社の状況】に名称が載る連結子会社は８社である。内訳の差異は有報からは特定できないため、グループ構成の記載は【事業の内容】の印字に従った。
- businessStructure: 本店所在地は東京都港区高輪二丁目19番19号（表紙）。上場市場は東京証券取引所プライム市場のみ（表紙・DEI）。
- history: 沿革の各行は年月まで印字されているが、history の形に合わせて年だけを採り、月は書いていない。
- history: 個別の子会社設立・資本参加のうち、本文の転機となるものだけを採り、株式会社笠神製作所・株式会社武芸川製作所の設立、株式会社八生商会への資本参加、日本ディック株式会社への資本参加、大阪証券取引所の上場廃止（2003年）等は省いた。
- history: 資本金の金額は沿革に印字されていないため、記載していない。
- industry: 主たる業界は machinery とした。軸受等（針状ころ軸受・直動案内機器）ならびに諸機械部品の製造・販売が単一セグメントであり、機械要素部品の製造業に当たるためである。
- industry: 顧客には半導体製造装置メーカー等が含まれるが、同社は半導体そのものや半導体製造装置を製造しておらず、半導体向け部材として独立した金額の開示もないため semiconductors は付けていない。
- relatedCompanies: 関連企業は１件とした。株式会社不二越は【大株主の状況】（2026年３月31日現在）に載る事業会社であり、発行済株式（自己株式を除く）の2.81％を保有しているため major-shareholder とした。
- relatedCompanies: 特定投資株式の保有目的は、銘柄ごとに「金融取引関係の維持・強化のため」「営業取引関係の維持・強化のため」「仕入取引関係の維持・強化のため」「取引関係維持・強化のため」という定型の文言が繰り返されており、銘柄固有の取引内容の印字がないため、これらの銘柄（三菱ＵＦＪフィナンシャル・グループ、シンフォニアテクノロジー、日本精工、日伝、マキタ、ＳＣＲＥＥＮホールディングス、みずほフィナンシャルグループ、ほくほくフィナンシャルグループ、ＮＴＮ、ノリタケ、ＮＯＫ、ＦＵＪＩ、大垣共立銀行、黒田精工、三井住友トラストグループ、牧野フライス製作所、ＴＨＫ等）は結ばなかった。銀行・フィナンシャルグループ各社については資金調達・金融取引が理由の保有であり、この点でも結ばない。
- relatedCompanies: 当社が株式を保有する株式会社不二越についての保有目的も「取引関係維持・強化のため」という定型の文言のみであり、業務提携等の具体的な印字はない。不二越とのリンクは【大株主の状況】の印字に基づくものである。
- relatedCompanies: 大株主のうち、日本マスタートラスト信託銀行（信託口）と株式会社日本カストディ銀行（信託口）は信託口であり結ばない。日本生命保険相互会社は相互会社で候補に含まれず、ＭＭ Ｉｎｖｅｓｔｍｅｎｔｓ株式会社は上場会社ではなく候補に含まれない。日本トムソン取引先持株会と日本トムソン従業員持株会は持株会であり結ばない。株式会社三菱ＵＦＪ銀行は大株主に載るが、銀行との関係は金融取引にとどまるため結ばなかった。みずほ信託銀行の退職給付信託口は退職給付信託であり結ばない。
- relatedCompanies: 当事業年度に株式数がなくなった銘柄として表に現れるシスメックス、十六フィナンシャルグループ、ＭＳ＆ＡＤインシュアランスグループホールディングス、小森コーポレーション、川崎重工業、澁谷工業、ニデック、東京精密については、保有の印字がないため結ばなかった。
- relatedCompanies: 候補のうち en（エンジン等の語の一致）、career（キャリアアップ等の語の一致）、land（ブランドの語の一部）、innovation（オープンイノベーションの語の一致）、ishin、step（検討のステップの語の一致）、the-lead（生産リードタイムの語の一致）、vision（長期ビジョンの語の一致）、port、seki、nissin（コードリストにない）はいずれも一般語・部分一致であり、当該企業への言及ではない。
- relatedCompanies: 関係会社の状況に載るのは当社グループの連結子会社のみで、これらは関連企業リンクの対象にしない。
- terms: 助言: 用語「ＩＫＯ」は、同社のブランドで、1963年７月に商標登録された。サステナビリティの節では、革新的で（Ｉｎｎｏｖａｔｉｏｎ）、高度な技術に立脚し（Ｋｎｏｗ－ｈｏｗ）、創造性に富む（Ｏｒｉｇｉｎａｌｉｔｙ）という理念が込められていると説明されている。
- terms: 助言: 用語「ニードルベアリング」は、針状ころ（細長い円筒形のころ）を用いた軸受で、同社は針状ころ軸受と呼ぶ。1956年に研究開発に着手し、1959年に生産を開始した同社の主力製品である。
- terms: 助言: 用語「直動案内機器」は、直線運動を案内する機械要素で、同社はリニアウェイ（のちの直動シリーズ）を1978年に開発・販売開始した。軸受等の一つに数えられる。
- terms: 助言: 用語「軸受等」は、同社が事業の呼称として使う用語で、針状ころ軸受および直動案内機器等を指す。事業は軸受等ならびに諸機械部品の製造・販売の単一セグメントである。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
