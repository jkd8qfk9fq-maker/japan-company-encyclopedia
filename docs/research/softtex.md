# ソフトテックス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ソフトテックス |
| 証券コード | 550A |
| docID（データを取り出した文書） | `S100YA88` |
| 原本 docID | `S100YA88` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YA88.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ソフトテックス / 550A / docID S100YA88（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
softtex: 10 件の数値を有報XBRLと照合
有報: 株式会社ソフトテックス 有価証券報告書－第43期(2025/04/01－2026/03/31) (docID S100YA88)
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
softtex: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aに印字された営業利益・経常利益の金額と増減率は、本文に書いていません（本文の財務数値は売上高と当期純利益だけです）。
- businessModel: 中期経営計画の目標値（売上高45億円、従業員数400名、売上高経常利益率、自己資本比率など）は、投資指標・利益率の目標のため本文やperspectivesに書いていません。
- businessModel: 受注高・受注残高の金額は書いていません。
- businessModel: 証拠パックの修正再表示チェックは、前期の有報が窓内に見つからず実施されていません。訂正有報はなく（amendments status は none）、経営指標の注記に組替えの記載もないため、warnings のみとしました。
- businessModel: 経営指標の注記のうち、株式分割の注記は financialNotes に着地させました。その他の注記（非上場であったための株価関係指標や株主総利回りの省略、監査の対象範囲など）は表示事項として warnings のみとしました。
- businessStructure: 当社はシステム開発関連事業の単一セグメントです。事業の並びは、セグメント注記の「製品及びサービスごとの情報」の外部顧客への売上高の大きい順（ソフトウェア開発サービス2,656,629千円、医療ITサービス983,001千円）としました。
- businessStructure: サービス内の区分（請負開発・技術者支援、ORCA支援・電子カルテ連携）は売上構成比のみの開示で、金額が独立して開示されていないため、各区分に金額を書かず、その旨を明記しました。
- businessStructure: 主要な設備は単一セグメントで全社共通のため、特定のサービスに結びつけませんでした。帳簿価額は書いていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。個別の仕入先は【事業の内容】に印字されていません。
- history: 本社・営業所・オフィスの移転、開設、統合、改称の行（1986年、1988年、1997年、2007年6月、2007年8月の札幌事業所開設、2018年9月、2020年4月の沖縄オフィス開設、2024年4月）は落としました。
- history: プライバシーマークの認証取得（2009年）とISO9001の認証取得（2023年）は落としました。
- history: 2026年4月の第三者割当増資は資本政策の事項であり、沿革の資本金額も書いていないため落としました。
- history: 設立時の資本金額は沿革に書いていません。
- industry: 主たる業界は、ソフトウェア開発サービスと医療ITサービスというシステム開発そのものが事業の実体であり、閉じた分類の it に直接当てはまります（DEIの別記事業もCTE）。暫定ではないため taxonomyGaps はありません。このツリーのゲートに合わせ、業界行は industryId キーで記録しています。
- relatedCompanies: miroku-jyoho-service（ミロク情報サービス）: 【大株主の状況】に載る事業会社の主要株主であり、業務・資本提携も印字されているため major-shareholder として結びました。
- relatedCompanies: kimura-unity（キムラユニティー）: 【大株主の状況】に載る事業会社の主要株主であり、業務・資本提携も印字されているため major-shareholder として結びました。
- relatedCompanies: seki（セキ）: 「セキュリティ」などの一般語の部分一致のみで、相手についての記述がないため結んでいません。
- relatedCompanies: port（ポート）: 「サポート」の部分一致のみのため結んでいません。
- relatedCompanies: en（エン）: 「エンジニア」などの一般語の部分一致のみのため結んでいません。
- relatedCompanies: base-4481（ベース）: 「ベースとした」などの一般語の部分一致のみのため結んでいません。
- relatedCompanies: kohsoku（高速）: 「超高速開発」の部分一致のみのため結んでいません。
- relatedCompanies: suzuki-6785（鈴木）: 役員の氏名の一致のみのため結んでいません。
- relatedCompanies: career（キャリア）: 人材育成の文脈の一般語の一致のみのため結んでいません。
- relatedCompanies: core（コア）: 「コア事業」の一般語の一致のみのため結んでいません。
- relatedCompanies: innovation（イノベーション）: 政府の戦略名の一致のみのため結んでいません。
- relatedCompanies: land（ランド）: 一般語の部分一致のみのため結んでいません。
- relatedCompanies: corona（コロナ）: 一般語の一致のみのため結んでいません。
- relatedCompanies: ic（IC）: 一般語の部分一致のみのため結んでいません。
- relatedCompanies: planet（プラネット）: 印字されているのは2007年に吸収合併した株式会社システムプラネットであり、上場のプラネット株式会社とは別の法人のため結んでいません。
- relatedCompanies: ricoh（リコー）: 印字されているのは子会社のリコージャパン株式会社で、買掛金の相手先内訳に載るのみのため結んでいません。
- relatedCompanies: slogan（スローガン）: 一般語の一致のみのため結んでいません。
- relatedCompanies: tear（ティア）: 一般語の部分一致のみのため結んでいません。
- relatedCompanies: vision（ビジョン）: 一般語の一致のみのため結んでいません。
- relatedCompanies: wingarc1st（ウイングアーク1st）: 買掛金の相手先内訳に載るのみで、事業の内容で取引の役割が述べられていないため結んでいません。
- relatedCompanies: 候補にない相手: JBCC株式会社は【主要な顧客ごとの情報】に載る主要な顧客ですが、related-candidates.json にないため結んでいません。株式会社トヨタシステムズも主要な顧客ですが候補にないため結んでいません。日本医師会ORCA管理機構株式会社はORCAの連携先ですが候補にないため結んでいません。
- terms: 用語の助言のみです。対象となりうる用語は「モダナイゼーション（稼働中のIT資産を活かしながら古いシステムを最新の技術やクラウド環境へ移行すること）」「レガシーシステム」「リバースエンジニアリング」「基幹系システム」「情報系システム」「RPA」「アジャイル」「超高速開発（ローコード開発）」「レセプト（診療報酬明細書）」「ORCA（日医標準レセプトソフト）」「オープン系」「ホスト系」などですが、有報の用語解説に沿って本文の中で平易に説明しており、独立した用語データは作成していません。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2025年11月17日付で普通株式１株につき100株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessStructure: 主要な経営指標等の推移の注記に、2025年11月17日付で普通株式１株につき100株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
