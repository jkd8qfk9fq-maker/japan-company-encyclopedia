# ビーブレイクシステムズ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ビーブレイクシステムズ |
| 証券コード | 3986 |
| docID（データを取り出した文書） | `S100Z448` |
| 原本 docID | `S100Z448` |
| 提出日（原本） | 2026-09-28 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z448.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ビーブレイクシステムズ / 3986 / docID S100Z448（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bbreak-systems: 10 件の数値を有報XBRLと照合
有報: 株式会社ビーブレイクシステムズ 有価証券報告書－第24期(2025/07/01－2026/06/30) (docID S100Z448)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
bbreak-systems: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 株式分割（2026年1月1日、1株につき3株）の注記は needsReview に入れ、指標算定の前提として financialNotes（2022年6月期）にも記録した。
- businessModel: セグメント利益や段階利益の金額・増減理由、受注高・受注残高の金額、キャッシュ・フローの金額は書いていない。売上高の増減率はMD&Aの印字どおり。
- businessModel: 2025年6月期のSI事業の外部売上高は、収益認識関係の注記（650,870千円）とセグメント注記（650,869千円）で1千円異なりますが、セグメント注記の値を採用しました。当事業年度は両注記で一致しています。
- businessModel: 経営方針の目標指標である技術者稼働率は投資・利益指標ではないものの数値目標として本文には書かず、戦略は定性的に書いた。
- businessStructure: 報告セグメントの並びは、セグメント注記の外部顧客への売上高の大きい順（パッケージ事業735百万円、システムインテグレーション事業650百万円）とした。内部売上高は無い。
- businessStructure: MA-EYESとJ-Fusionソリューション、Humalanceには金額が独立して開示されていないため、金額を書いていない。
- businessStructure: 主要な設備は本社のみで、セグメント欄は「全社（共通）」のため、どの事業にも結びつけなかった。帳簿価額は書いていない。
- businessStructure: 技術者は両事業のプロジェクトに対応し、繁忙に応じて配置を変更する体制のため、事業ごとの人員は分けていない。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。【事業の内容】に個別の仕入先名は印字されておらず、SI事業で委託先となるビジネスパートナーも個別名は無い。
- history: 沿革表は年月と事象が同じ流れに印字されており、行順の対応づけは不要だった。
- history: 資本金の増資（2004年・2005年・2007年・2017年）は資本金額を含むため落とした。
- history: 本社移転（2007年・2023年）、関西支社と名古屋営業所の開設（2014年・2015年）、派遣事業の届出・許可（2005年・2016年）、有料職業紹介事業許可（2021年、Humalanceコネクトの開始として記載）、プライバシーマーク取得（2007年）、オープンソース「ExCella」公開（2009年）、監査等委員会設置会社への移行（2023年）、ISMS認証取得（2025年）は落とし、ここに記録した。
- history: wikipedia.json は業界の一覧ページのみで、同社の記事ではないため使わなかった。
- industry: 主たる業界は it とした。両セグメントともソフトウェアの開発・提供とシステム開発サービスであり、直接当たる。
- industry: human-resources は付けなかった。Humalanceの案件紹介・職業紹介はシステムインテグレーション事業の一部で、金額が独立して開示されていない。
- industry: DEIの別記事業は cte である。
- relatedCompanies: internet-initiative-japan（株式会社インターネットイニシアティブ）：【セグメント情報等】の主要な顧客ごとの情報と、MD&Aの主な相手先別販売実績に主要な顧客として印字されているため customer として結んだ。金額や割合は説明に書いていない。
- relatedCompanies: cerespo（株式会社セレスポ）：売掛金の相手先別内訳に載るだけで、取引関係の記述が独立していない内訳表のみのため結ばなかった。
- relatedCompanies: techmatrix（テクマトリックス株式会社）・tokai-soft（東海ソフト株式会社）・xnet（株式会社エックスネット）・nihon-knowledge（日本ナレッジ株式会社）：売掛金や未払費用の相手先内訳表に載るのみで、取引・提携の記述が無いため結ばなかった。なお内訳表の印字は「日本ナレッジスペース」という名称である。
- relatedCompanies: hikari-tsushin（株式会社光通信）：大株主として印字されるのは光通信KK投資事業有限責任組合という投資事業有限責任組合で、株式会社光通信とは別の法人格のため結ばなかった。
- relatedCompanies: system-integrator（株式会社システムインテグレータ）：有報の印字は一般名詞の「システムインテグレーター」（事業形態の説明と注記）であり、同社との取引の記述は無いため結ばなかった。
- relatedCompanies: en（エン株式会社）・seki（セキ株式会社）・freee（フリー株式会社）・lec（レック株式会社）・ray（株式会社レイ）・base-4481（ベース株式会社）・ai（株式会社エーアイ）・eyez（株式会社アイズ）・corona（株式会社コロナ）・port（株式会社ポート）・rent（株式会社レント）・space（株式会社スペース）・taya（株式会社タヤ）・vision（株式会社ビジョン）：いずれも部分一致や一般語（エンジニア、セキュリティ、フリーランス、フレックスタイム、bBreakの表記、標準パッケージをベースに、MA-EYESの読み、コロナ禍、技術レポート、フリーレント、スペースという語、世田谷区、ビジョンという理念の語）のみで、同社との関係の記載は無いため結ばなかった。
- relatedCompanies: SAP社の日本法人出身者が創業メンバーであることは沿革・事業の経緯として本文にあるが、SAP社自体は候補に含まれず、現在の取引・提携の記述も無いため結ばなかった。
- relatedCompanies: 関係会社は無く（【関係会社の状況】は該当事項なし）、政策保有株式の開示も無い。
- terms: 用語の助言：「MA-EYES」（同社の主力クラウドERP）、「セミオーダー」（基盤を用意し顧客固有部分を開発する同社の開発手法）、「Humalance」（同社のフリーランス向け案件紹介サイト）、「J-Fusion」（同社のシステム開発・稼動環境ソフトウエア）は用語集の候補になりうる。
- terms: 助言のみで、データは追加していない。

## 要確認（status に反映）

- businessModel: 2026年1月1日付で普通株式1株につき3株の株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第20期の期首に行われたと仮定して指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2026年1月1日付で普通株式1株につき3株の株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第20期の期首に行われたと仮定して指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
