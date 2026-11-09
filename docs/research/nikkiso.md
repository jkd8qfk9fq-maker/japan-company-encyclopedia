# 日機装 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日機装株式会社 |
| 証券コード | 6376 |
| docID（データを取り出した文書） | `S100XU3R` |
| 原本 docID | `S100XU3R` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU3R.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日機装株式会社 / 6376 / docID S100XU3R（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 42 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nikkiso: 10 件の数値を有報XBRLと照合
有報: 日機装株式会社 有価証券報告書－第85期(2025/01/01－2025/12/31) (docID S100XU3R)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nikkiso: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: セグメント区分の変更（工業部門から医療部門への一部事業の移し替え、前期数値の組み替え）は、5年間の売上収益・当期利益の系列には影響しないため、needsReview ではなく financialNotes に事実として記録した。
- businessModel: MD&Aに、2025年をもって深紫外線LED事業およびCRRT（急性血液浄化療法）事業からの撤退を概ね完了したこと、ヘルスケア事業の事業撤退を決定したことが印字されている。いずれも有報提出前の当期中の事業再編であり、提出後の予定事項ではないため needsReview には入れなかった。
- businessModel: 前事業年度に一部ポンプ製品の耐圧検査の一部未実施が確認され、特別調査委員会の調査で品質保証・品質管理体制の不備が指摘されたこと、製品の安全性および業績への重大な影響はないことが確認され、再発防止策を策定・実行中であることが【経営方針、経営環境及び対処すべき課題等】に印字されている。本文には書かず、ここに記録した。
- businessModel: 「NIKKISO 2028」の数値目標のうち売上収益目標のみを引用し、営業利益・ROEの目標は文章の規則により書かなかった。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。訂正有報もない。
- businessModel: Wikipedia（「日機装」）の冒頭は有報の記載の範囲を超える補足（旧社名・ブランド名・創業の経緯など）を含まないため、使わなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上収益（2025年12月期）の大きい順とした（工業部門136,750百万円→医療部門78,891百万円）。2部門はいずれも報告セグメントで、報告セグメントに含まれない「その他」区分はない。
- businessStructure: 工業部門の内訳であるインダストリアル事業・航空宇宙事業と、医療部門を構成するメディカル事業は【事業の内容】の区分どおり children とした。インダストリアル事業・航空宇宙事業だけの外部売上収益は開示されていないため、金額は書かず、その旨を各説明に明記した。
- businessStructure: セグメント注記の工業部門の概要には深紫外線LEDおよび関連製品も挙げられているが、MD&Aに2025年をもって深紫外線LED事業からの撤退を概ね完了した旨が印字されているため、children には独立した事業として立てなかった。
- businessStructure: 上場市場は表紙の印字（東京証券取引所プライム市場）どおりとした。
- history: 【沿革】後半の崩れた表（2017年3月・2017年8月・2018年10月の年月セル3件と、宮崎日機装設立・Cryogenic Industriesグループ取得・宮崎日機装の航空宇宙工場完成の事象3件）は、年月と事象の数が一致するため行順に対応づけた。このうち航空宇宙工場完成は設備の行として落とした。
- history: 落とした行（子会社設立・工場完成・本店移転など）: 1955年 技術導入と国産化への移行、1956年 本社および工場完成、1960年 東村山工場完成、1968年 本社屋完成と本店移転、1973年 日機装エイコー設立・Nikkiso Deutschland設立、1974年 静岡工場完成、1987年 複合材製品工場完成、1995年 金沢製作所完成、1996年 Nikkiso LNG Testing設立、1997年 Nikkiso Medical GmbH設立、1998年 R&Dセンター総合館完成、2000年 Microtrac, Inc.設立、2001年 Nikkiso Vietnam MFG設立、2003年 大阪証券取引所市場第一部上場廃止、2006年 MeSys GmbH取得、2008年 Nikkiso Vietnam, Inc.設立、2009年 LEWA Management取得、2011年 本店移転・日本ベル取得、2013年 Geveke B.V.取得、2014年 金沢製作所の工場完成・白山工場完成、2018年 宮崎日機装の航空宇宙工場完成、2019年 福機装股份有限公司設立、2020年 M.E.Nikkiso Vietnam設立・Nikkiso Medical America設立、2021年 宮崎日機装のインダストリアル工場完成・Cryogenic Industriesグループの組織改編・「M.ReT 宮崎」完成、2023年 NIKKISO Medical Europe GmbH設立。
- history: 資本金の金額は文章の規則により書かなかった。
- industry: 主たる業界は、売上収益の約6割を占める工業部門（産業用特殊ポンプ・システム、極低温機器、精密機器など機械・装置の製造販売）に合わせ、machinery（機械）とした。東証の業種分類は精密機器である。
- industry: 医療部門（血液透析関連製品）は売上収益の約37％を占めるが、閉じた分類に医療機器を表す値がないため industries には付けず、taxonomyGaps に記録した。
- industry: 精密機器事業の中に電子部品製造関連装置（セラミック基板製造システムなど）があるが、金額が独立して開示されていないため、semiconductors（半導体）は付けなかった。
- industry: 航空宇宙事業は工業部門の中で金額が独立して開示されていないため、独立した業界は付けなかった。
- relatedCompanies: 特定投資株式の保有目的は、全銘柄を通じて「当社○○事業に関わる安定した取引関係の維持・拡大を目的として保有」という定型文（対象事業名のみが異なる）で、相手ごとに異なる具体的な取引内容は印字されていない。執筆指示により、保有目的が全銘柄共通の定型句だけの相手は結ばないため、株式の保有状況のみに現れる候補はすべて結ばなかった。
- relatedCompanies: 太平電業（taihei-dengyo-kaisha）: 特定投資株式1,144,950株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 住友不動産（sumitomo-realty-and-development）: 特定投資株式292,000株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 日揮ホールディングス（jgc-holdings）: 特定投資株式1,077,602株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: シンフォニアテクノロジー（sinfonia-technology）: 特定投資株式178,600株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 岩谷産業（iwatani）: 特定投資株式961,600株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 新日本空調（shin-nippon-air-technologies）: 特定投資株式483,800株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 西華産業（seika）: 特定投資株式475,950株。保有目的は取引関係の維持・強化という定型句で、当事業年度に一部売却も実施されており、具体的な取引は印字されていないため結ばなかった。
- relatedCompanies: オークマ（okuma）: 特定投資株式297,200株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 東京応化工業（tokyo-ohka-kogyo）: 特定投資株式178,200株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 日本光電工業（nihon-kohden）: 特定投資株式485,200株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 因幡電機産業（inaba-denki-sangyo）: 特定投資株式297,600株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: サンワテクノス（sun-wa-technos）: 特定投資株式155,907株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 三信電気（sanshin-electronics）: 特定投資株式75,400株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 三菱鉛筆（mitsubishi-pencil）: 特定投資株式36,400株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 東亜ディーケーケー（dkk-toa）: 特定投資株式33,000株。保有目的は定型句のみのため結ばなかった。
- relatedCompanies: 三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group）: 保有目的が資金調達および資金決済などの金融取引であり、銀行・金融機関は資金調達が理由なら結ばないため結ばなかった。
- relatedCompanies: しずおかフィナンシャルグループ（shizuoka-financial-group）: 保有目的が資金調達および資金決済などの金融取引のため結ばなかった。
- relatedCompanies: みずほフィナンシャルグループ（mizuho-financial-group）: 保有目的が資金調達および資金決済などの金融取引のため結ばなかった。
- relatedCompanies: MS&ADインシュアランスグループホールディングス（ms-and-ad-insurance-group-holdings）: 保有目的が保険取引を主としたものであり、当事業年度に全て売却済みのため結ばなかった。
- relatedCompanies: 三井住友トラストグループ（sumitomo-mitsui-trust-group）: 当事業年度に全て売却済みのため結ばなかった。
- relatedCompanies: 北陸電力（hokuriku-electric-power）: サステナビリティの節に、北陸電力の委託する発電事業者が新たに開発する太陽光発電所から環境価値（非化石証書）を20年間調達する旨の記載はあるが、北陸電力自身との取引とは印字されておらず、相手が発電事業者側であるため結ばなかった。
- relatedCompanies: セキ（seki）: ambiguous な候補で、一致は「セキュリティ」などの語の断片のみ。セキ株式会社との取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: ステップ（step）: 「次のステップとして」という一般的な語への一致のみのため結ばなかった。
- relatedCompanies: エン（en）: ambiguous な候補で、「エンジニアリング」などの語の断片への一致のみのため結ばなかった。
- relatedCompanies: レック（lec）: 「フレックス」などの語の断片への一致のみのため結ばなかった。
- relatedCompanies: ポート（port）: 「ポートフォリオ」という語への一致のみのため結ばなかった。
- relatedCompanies: ビジョン（vision）: 「長期ビジョン」という語への一致のみのため結ばなかった。
- relatedCompanies: あらた（arata）: 「あらためて」という語への一致のみのため結ばなかった。
- relatedCompanies: ベース（base-4481）: 「時価ベース」という語への一致のみのため結ばなかった。
- relatedCompanies: キャリア（career）: 「キャリアアップ」という語への一致のみのため結ばなかった。
- relatedCompanies: コロナ（corona）: 「新型コロナウイルス感染症」という語への一致のみのため結ばなかった。
- relatedCompanies: 日新（nissin）: コードリストにない相手で、一致も新株予約権等の定型文中の断片のみのため結ばなかった。
- relatedCompanies: ゼロ（zero）: ambiguous な候補で、「ネット・ゼロ」という語への一致のみのため結ばなかった。
- relatedCompanies: カバー（cover）: 「カバーする」という動詞への一致のみのため結ばなかった。
- relatedCompanies: イノベーション（innovation）: 「イノベーション創出」という語への一致のみのため結ばなかった。
- relatedCompanies: レイ（ray）: ambiguous な候補で、本店所在地「恵比寿ガーデンプレイスタワー」の一部などへの一致のみのため結ばなかった。
- relatedCompanies: ガーデン（garden）: 本店所在地「恵比寿ガーデンプレイスタワー」への一致のみのため結ばなかった。
- relatedCompanies: フューチャー（future）: 自社製品である透析通信システム「フューチャーネット」の名称への一致のみのため結ばなかった。
- relatedCompanies: ランド（land）: 「ブランド」という語への一致のみのため結ばなかった。
- relatedCompanies: トルク（torq）: 自社製品の部品名「トルクボックス」への一致のみのため結ばなかった。
- relatedCompanies: 候補外の注記: 特定投資株式で最大の保有は山東威高血液浄化制品股份有限公司（10,485,839株。持分法適用会社である威高日機装（威海）透析機器有限公司の関係先とみられるが、候補リストにない外国法人）。株式会社ダイフク（453,000株）も保有目的が定型句のみで、候補リストにない。【大株主の状況】の上位は信託銀行・持株会・保険会社・銀行のみで、事業会社の大株主はいない。連結子会社43社・持分法適用会社4社はすべて有価証券報告書を提出していない会社である。
- terms: 助言: 「極低温ポンプ」は用語集に未登録の可能性があります。LNGなどの液化ガスを扱う同社の中核製品（サブマージドポンプ等）で、インダストリアル事業の中心のため、登録候補になります。
- terms: 助言: 「CFRP（炭素繊維強化プラスチック）」は航空宇宙事業の主要素材・製品を表す用語で、同社の事業説明に繰り返し現れるため、登録候補になります。
- terms: 助言: 「ダイアライザー」は血液透析に使う中空糸型透析器を指す同社メディカル事業の中心製品の用語で、登録候補になります。
- terms: 助言: 「キャンドモータポンプ」は同社の産業用ポンプの代表的な製品形態を指す用語で、登録候補になります。
- terms: 助言: 「特定投資株式」は政策保有株式の開示区分を指す用語で、関連企業の判断材料になるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 日機装の医療部門（血液透析関連製品） → 提案: 医療機器。医療部門は血液透析装置・ダイアライザーなどの医療機器の製造販売で売上収益の約37％を占めるが、閉じた分類に医療機器を表す値がないため、主たる業界である machinery のみを付け、医療部門の業界は暫定的に表せていない。
