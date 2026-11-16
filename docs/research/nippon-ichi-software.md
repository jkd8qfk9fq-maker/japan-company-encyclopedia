# 日本一ソフトウェア — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社日本一ソフトウェア |
| 証券コード | 3851 |
| docID（データを取り出した文書） | `S100YLU7` |
| 原本 docID | `S100YLU7` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLU7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社日本一ソフトウェア / 3851 / docID S100YLU7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-ichi-software: 10 件の数値を有報XBRLと照合
有報: 株式会社日本一ソフトウェア 有価証券報告書－第33期(2025/04/01－2026/03/31) (docID S100YLU7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-ichi-software: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全系列で差異なし（訂正なし）。訂正有報はなく、重要な後発事象は「該当事項はありません」。
- businessModel: 売上高の減少理由は、MD&Aの印字どおりパッケージタイトルの販売タイトル数の減少とした。
- businessModel: 経営方針で重要な指標とされる舞台利益の概念や、国内販売本数の目標以外の数値目標は、本文には売上高と純損失のみを記載する方針のため perspectives の strategy.disclosed の範囲にとどめた。セグメント利益、キャッシュ・フローの金額、総資産・純資産の金額は書いていない。
- businessModel: 受注実績については、受注高及び受注残高の金額に重要性がない旨が印字されており、金額は書いていない。
- businessStructure: 報告セグメントはエンターテインメント事業・学生寮・その他事業の2つで、外部顧客への売上高の大きいエンターテインメント事業を先に並べた。セグメント利益は書いていない。
- businessStructure: セグメント別売上高の切り捨て合計（3,485百万円＋120百万円＝3,605百万円）と連結売上高3,606百万円との1百万円の差は、千円単位の印字額の切り捨てによるもので、印字のとおり記載した。
- businessStructure: 設備と事業の対応は【主要な設備の状況】のセグメント欄の印字どおり（本社・NIS America, Inc.はエンターテインメント事業、株式会社楽しみチームは学生寮・その他事業）。帳簿価額は書いていない。
- businessStructure: 連結子会社は6社（NIS America, Inc.、株式会社STUDIO ToOeuf、Nippon Ichi Software Vietnam Co., Ltd.、株式会社楽しみチーム、株式会社システムソフト・ベータ、株式会社名古屋グラフィックスタジオ）で、いずれも当社の子会社であるため関連企業には結んでいない。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。個別の仕入先名は【事業の内容】に印字されていない。
- history: 沿革表の後半は、年月セル（9件）と事象文（9件）が分かれて印字される崩れた表であり、数が一致したため行順で対応づけた。対応づけ：2015年3月＝PlayStation4向け発売開始、2015年4月＝ベトナム子会社設立、2016年7月＝株式会社フォグの子会社化、2017年3月＝Nintendo Switch向け発売開始、2018年5月＝株式会社たのしみチーム設立、2019年12月＝株式会社システムソフト・ベータ設立、2021年2月＝PlayStation5向け発売開始、2022年4月＝スタンダード市場移行、2022年11月＝株式会社名古屋グラフィックスタジオ設立。
- history: 行順対応づけのうち、PlayStation4向け発売開始（2015年）、株式会社フォグの子会社化（2016年、2022年3月に清算）、株式会社システムソフト・ベータ設立（2019年）、PlayStation5向け発売開始（2021年）は、沿革への収録を見送り、ここに記録した。
- history: そのほか収録を見送った項目：各ゲーム機向けタイトルの発売開始（PlayStation、PlayStation2、PlayStationPortable、PlayStation3、ニンテンドーDS、Wii、ニンテンドー3DS、PlayStationVita）、本社の移転（2003年、2008年）、エンターテインメント事業部用建物の完成（2005年）、アミューズメント施設運営と業務用ゲーム機器の発売開始（2007年）、株式会社システムプリズマの子会社化（2007年、2016年に吸収合併）、株式会社ディオンエンターテインメントの設立（2011年、後に商号変更のうえ2021年に清算）。
- history: 沿革の印字にある資本金の金額は、沿革に資本金を書かない規則のため記載していない。
- history: Wikipediaの記事「日本一ソフトウェア」（証券コード3851で一致）は旧社名が有限会社プリズム企画である旨を述べるが、有報の沿革にも同じ事実が印字されているため、補足には使わなかった。
- industry: 主たる業界は entertainment とした。エンターテインメント事業（家庭用ゲームソフトの開発・製造・販売）が外部顧客への売上高の大部分を占め、事業の実体であるため直接当てはまる。
- industry: 学生寮・その他事業は学生寮の運営を行う独立した報告セグメントとして金額が開示されているが、閉じた分類に合う値がないため、最も近い real-estate を暫定で2つ目に付け、taxonomyGaps に記録した。
- industry: DEIの別記事業は cte である。
- relatedCompanies: en（4849、ambiguous）：「エンターテインメント事業」等の部分文字列のみで、エン株式会社についての取引・提携の記載はないため結ばなかった。
- relatedCompanies: tein（7217）：「エンターテインメント」の部分文字列のみで、株式会社テインについての記載はないため結ばなかった。
- relatedCompanies: rhythm（7769）：前身の社名「プリズム」の部分文字列のみで、リズム株式会社についての記載はないため結ばなかった。
- relatedCompanies: systemsoft（7527）：印字があるのは当社の連結子会社である株式会社システムソフト・ベータで、株式会社システムソフトとは別の法人であり、当社の子会社は関連企業に結ばないため結ばなかった。
- relatedCompanies: land（8918）：「ブランド価値」等の部分文字列のみで、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: base-4481（4481）：「営業利益ベース」等の語句のみで、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: juroku-financial-group（7380）：特定投資株式として保有が印字されているが、保有目的は当社の主要金融機関との取引関係の維持であり、資金調達先の金融機関であるため結ばなかった。
- relatedCompanies: amuse（4301）：「アミューズメント施設運営」という一般語のみで、株式会社アミューズについての記載はないため結ばなかった。
- relatedCompanies: nissin（9066）：現在のコードリストにない相手であり、新株予約権の行使期間の印字に含まれる部分文字列のみで、株式会社日新についての記載はないため結ばなかった。
- relatedCompanies: port（7047）：旧子会社名「エンターテインメントサポート」の部分文字列のみで、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: ray（4317、ambiguous）：「プレイステーション」等の部分文字列のみで、株式会社レイについての記載はないため結ばなかった。
- relatedCompanies: ricoh（7752）：「リコール」という一般語のみで、株式会社リコーについての記載はないため結ばなかった。
- relatedCompanies: seki（7857、ambiguous）：「セキュリティ」等の部分文字列のみで、セキ株式会社についての記載はないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手：SONY INTERACTIVE ENTERTAINMENT AMERICA（2026年3月期の主要な顧客として印字があるが候補にない）、KOEI TECMO AMERICA CORPORATION（前期の主要な顧客として印字があるが候補にない）、株式会社セガ（【重要な契約等】に商標許諾の供与契約の印字があるが候補にない）。
- relatedCompanies: 有限会社ローゼンクイーン商会は2026年3月31日現在で発行済株式の46.30％を保有する大株主として印字されているが、非上場の法人であり候補にもないため結ばなかった。なお【関係会社の状況】に親会社の記載はない。
- terms: セグメント名の「エンターテインメント事業」「学生寮・その他事業」は有報の表記どおりに用いた。
- terms: 「プリニークラブ」は当社が運営するカードゲームショップの名称として有報に印字されている。
- terms: 「ゲームは作品ではなく商品である」は当社の創業理念として有報の【経営方針、経営環境及び対処すべき課題等】に印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 日本一ソフトウェア（nippon-ichi-software）の学生寮・その他事業（学生寮の運営） → 提案: 学生寮・宿泊施設運営。学生寮の運営に直接当てはまる業界区分が閉じた分類にないため、不動産運営に最も近い real-estate を暫定とした。
