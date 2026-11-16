# キットアライブ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社キットアライブ |
| 証券コード | 5039 |
| docID（データを取り出した文書） | `S100XU41` |
| 原本 docID | `S100XU41` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU41.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社キットアライブ / 5039 / docID S100XU41（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kitalive: 10 件の数値を有報XBRLと照合
有報: 株式会社キットアライブ 有価証券報告書－第10期(2025/01/01－2025/12/31) (docID S100XU41)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
kitalive: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注３に、2022年７月11日付で普通株式１株につき500株の割合で株式分割を行った旨が記載されている。financialNotes は同じ年度の最初の１件のみが保持されるため、2022年12月期の financialNote には収益認識に関する会計基準の適用（注11）を入れ、株式分割の注記は全文をここに記録し、取扱いは needsReview に入れた。
- businessModel: MD&Aの利益の金額・増減理由は、本文の数値が売上高と当期純利益に限られるため書いていない。受注高・受注残高の金額も書いていない。
- businessModel: 事業の内容に印字された売上総利益率は、本文と perspectives に利益率を書かない規則のため記載していない。
- businessModel: Wikipediaの記事（「キットアライブ」）は有報の記載を超える補足を含まないため使っていない。
- businessModel: 株式会社テラスカイの子会社化は2025年10月の期中の出来事であり、2025年12月31日現在の【関係会社の状況】に親会社として印字されている構成のまま登録した。重要な後発事象は「該当事項はありません」だった。
- businessStructure: このツリーの旧スキーマに従い、suppliers キーは省略した。仕入の事実として、親会社の株式会社テラスカイからSalesforceライセンスの仕入・購入をしていることが【関係会社の状況】に印字されている。
- businessStructure: 単一セグメントのためセグメント別の設備記載はなく、本社（札幌市北区、従業員57人）と東京事業所（東京都中央区、同6人）がクラウドソリューション事業に属するものとして扱った。設備の帳簿価額は金額の規則により記載していない。
- businessStructure: 製品・サービスごとの情報のクラウドソリューション908,858千円とライセンス販売15,774千円を百万円未満切り捨てにすると合計923百万円となり、印字の売上高合計924百万円と1百万円差がある。千円単位の切捨てによるもので、印字の区分と合計をそのまま記載した。
- history: 設立時の資本金50,000千円は、沿革に資本金の金額を書かない規則のため記載していない。
- history: 2016年10月の事業譲渡と東京事業所設立は沿革表の別々の行のため、項目を分けている。
- history: 2007年と2010年の項目は、沿革の前文に印字された、株式会社ウイン・コンサル内での事業の源流である。当社の母体となった経緯として記録した。
- industry: 主たる業界は it とした。クラウドソリューション事業（単一セグメント）の全売上がSalesforceを基盤としたITサービスの提供であり、閉じた分類の it が直接当てはまるため暫定ではない。DEIの別記事業はCTEである。２つ目の業界は付けていない。
- relatedCompanies: terrasky: 【関係会社の状況】の区分どおり parent とした。2025年10月の市場買付による追加取得で子会社化され、期末現在の構成がそのまま印字されている。
- relatedCompanies: dentsu-soken: セグメント情報等の【主要な顧客ごとの情報】に当事業年度の主要な顧客として印字されているため customer とした。
- relatedCompanies: beex: 親会社の子会社であり、【関連当事者情報】に個別の取引の内容が印字されているため business-partner とした。
- relatedCompanies: en: ambiguous な候補。一般語「エンジニア」等への部分一致で、エン株式会社への言及はないため結ばなかった。
- relatedCompanies: seki: ambiguous な候補。「セキュリティ」等への部分一致で、セキ株式会社への言及はないため結ばなかった。
- relatedCompanies: corona: 新型コロナウイルス感染症の文言への一致で、株式会社コロナへの言及はないため結ばなかった。
- relatedCompanies: base-4481: 「インターネットをベースとした」等の一般語への一致で、ベース株式会社への言及はないため結ばなかった。
- relatedCompanies: core: ambiguous な候補。「コアバリュー」の文言への一致で、株式会社コアへの言及はないため結ばなかった。
- relatedCompanies: innovation: 印字されたのは株式会社シナプスイノベーション（前事業年度の主要な顧客）で、候補の株式会社イノベーションとは別の法人のため結ばなかった。
- relatedCompanies: nissin: コードリストになく ambiguous な候補。新株予約権の注記の文言への一致で、株式会社日新との関係は印字されていないため結ばなかった。
- relatedCompanies: port: 「サポート」等の一般語への部分一致で、ポート株式会社への言及はないため結ばなかった。
- relatedCompanies: vision: Salesforceのフレームワークにおける「ビジョン」という文言への一致で、株式会社ビジョンへの言及はないため結ばなかった。
- relatedCompanies: ray: ambiguous な候補。一般語への部分一致で、株式会社レイへの言及はないため結ばなかった。
- relatedCompanies: altech: 買掛金の相手先別内訳に現れるだけで、取引・提携の関係を述べる記載はないため結ばなかった。
- relatedCompanies: arata: 「顧客と共にあらたな世界を切り拓こう」という文言への部分一致で、株式会社あらたへの言及はないため結ばなかった。
- relatedCompanies: hikari-tsushin: 大株主として印字されたのは光通信ＫＫ投資事業有限責任組合（所有割合4.79％）で、候補の株式会社光通信とは別の法人であり、投資事業有限責任組合のため結ばなかった。
- relatedCompanies: idea-consultants: 理念の文言等への部分一致で、いであ株式会社への言及はないため結ばなかった。
- relatedCompanies: japan-post-holdings: Salesforceの用語解説で利用企業の例として日本郵政グループに触れているだけで、当社との取引・提携の記載はないため結ばなかった。
- relatedCompanies: king: 「コンピュータクラッキング」等の文言への部分一致で、株式会社キングへの言及はないため結ばなかった。
- relatedCompanies: money-forward: 売掛金の相手先別内訳に現れるだけで、主要な顧客としての開示や提携の記載はないため結ばなかった。
- relatedCompanies: 候補にないため結んでいない相手: 株式会社NTTデータ北海道とNECソリューションイノベータ株式会社は当事業年度の主要な顧客として印字されているが候補にない。株式会社シナプスイノベーションと労働金庫連合会は前事業年度の主要な顧客である。株式会社スカイ365は親会社の子会社で関連当事者取引が印字されているが候補にない。株式会社ウイン・コンサルは設立時の出資元で事業譲渡元であり、大株主（4.78％）だが非上場で候補にない。Salesforce, Inc.と株式会社セールスフォース・ジャパンは基盤サービスとライセンスの提供元だが候補にない。候補の ntt（NTT株式会社）は、印字された株式会社NTTデータ北海道とは別の法人のため結んでいない。
- terms: 助言: 「Salesforce」は、Salesforce, Inc.が開発・提供するクラウドサービスの総称です。営業支援（SFA）・顧客関係管理（CRM）の「Sales Cloud」を中核として、マーケティング、データ分析、カスタマーサポートなど幅広いサービスを含みます。
- terms: 助言: 「AppExchange」は、Salesforce, Inc.が運営する、Salesforce上で動くビジネスアプリケーションのマーケットプレイスです。構築したSaaS型アプリケーションをここで販売・マーケティングできます。
- terms: 助言: 「ビジネスデザイナー」は、ITを活用したビジネスの企画・立案・推進等を担い、DXを推進する人材を指す言葉です。同社は、ITエンジニアが全工程を担い顧客と直接対話する経験を通じて、この人材の育成を進めています。
- terms: 助言: 「もっとアライブ」は、同社独自の自己啓発支援制度です。１人あたり年間最大60時間まで、残業時間を利用して自習することができます。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2022年７月11日付で普通株式１株につき500株の株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessStructure: 主要な経営指標等の推移の注記に、2022年７月11日付で普通株式１株につき500株の株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
