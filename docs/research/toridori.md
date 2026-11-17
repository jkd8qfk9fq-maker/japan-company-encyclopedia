# 株式会社トリドリ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社トリドリ |
| 証券コード | 9337 |
| docID（データを取り出した文書） | `S100XQKR` |
| 原本 docID | `S100XQKR` |
| 提出日（原本） | 2026-03-18 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XQKR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社トリドリ / 9337 / docID S100XQKR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toridori: 10 件の数値を有報XBRLと照合
有報: 株式会社トリドリ 有価証券報告書－第10期(2025/01/01－2025/12/31) (docID S100XQKR)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toridori: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記１（代理人取引に係る売上高は、顧客から受け取る額からインフルエンサー等に支払う額を控除した純額で表示）は表示方法の事実のため、financialNotesではなくここに記録します。
- businessModel: 表示方法の変更により、前連結会計年度の連結財務諸表の組替えが行われています（「預り金」の独立掲記とキャッシュ・フロー計算書の内訳変更）。主要な経営指標等への影響はなく、前期有報との照合でも全系列に差異がなかったため、warningsのみとしました。
- businessModel: 主要な経営指標等の注記２〜５（潜在株式調整後１株当たり当期純利益・自己資本利益率・株価収益率を記載しない理由、従業員数の定義）は表示事項のため、ここに記録します。
- businessModel: 会社が重要な経営指標と位置づけるのは売上総利益と「toridori base」の顧客数・顧客当たりの指標であり、利益指標を含むため、本文と戦略には数値目標として書かず、存在のみをここに記録します。
- businessModel: 経営成績等の分析に印字された取扱高（9,051百万円）は会社定義の総額であり売上高ではないため、本文には書いていません。
- businessModel: 関係会社の状況の注記にある連結子会社GIVIN・niksの主要な損益情報等は子会社の個別数値のため、本文には書いていません。
- businessModel: 経営成績等の分析の利益ラインの金額と理由は本文に書いていません。
- businessStructure: セグメント情報は単一セグメントのため有報では記載が省略されており、領域別の外部顧客への売上高は【セグメント情報等】の関連情報（製品及びサービスごとの情報）から採りました。
- businessStructure: suppliersキーは旧スキーマのため省略しました。「toridori made」ではアパレルやコスメ等の品目を主に外注を活用して生産している旨が経営成績等の分析に記載されています。
- history: 沿革のうち、2016年の株式会社OTOZUREの設立（活動支援・純広告仲介の受託子会社）、2019年の同社の吸収合併、2022年のセレクトブランドECショップCRAMMYの運営開始は、主要な事業の転機ではないため落とし、ここに列挙します。
- history: 沿革には年月まで印字されていますが、monthキーは書かず年だけを記録しました。資本金額は沿革に書いていません。
- industry: インフルエンス・プラットフォーム事業は広告・マーケティングの事業であり、閉じた分類に適合する区分がないため、最も近い media を暫定の主たる業界とし、taxonomyGaps に記録しました（needsReview には書いていません）。
- relatedCompanies: en（エン）は本文中の一般語句との一致であり曖昧な候補のため、結びませんでした。
- relatedCompanies: land（ランド）は「ブランド」の部分一致のため、結びませんでした。
- relatedCompanies: base-4481（ベース）は「データベース」の部分一致のため、結びませんでした。
- relatedCompanies: seki（セキ）は「セキュリティ」の部分一致であり曖昧な候補のため、結びませんでした。
- relatedCompanies: lec（レック）は「フレックスタイム」の部分一致のため、結びませんでした。
- relatedCompanies: port（ポート）は「サポート」「プロモーション」の部分一致のため、結びませんでした。
- relatedCompanies: cota（コタ）は「コタエル信託」（役職員向けの信託）の部分一致であり曖昧な候補のため、結びませんでした。
- relatedCompanies: nissin（日新）はコードリストにない候補であり、新株予約権の記載中の部分一致のため、結びませんでした。
- relatedCompanies: rent（レント）は「タレントキャスティング」の部分一致のため、結びませんでした。
- relatedCompanies: career（キャリア）は「キャリア形成」の部分一致のため、結びませんでした。
- relatedCompanies: trust（トラスト）はコードリストにない候補であり、信託銀行の保管口座名の部分一致のため、結びませんでした。
- relatedCompanies: 大株主のうち株式会社日本カストディ銀行（信託口）と日本マスタートラスト信託銀行株式会社（信託口）は保管・信託口であり、Global Catalyst Partners Japan２号投資事業有限責任組合は投資ファンド、NOMURA INTERNATIONAL PLC・GOLDMAN SACHS INTERNATIONAL・BNY GCM CLIENT ACCOUNTは外国の保管口座のため、いずれも結びませんでした。
- relatedCompanies: 連結子会社6社（株式会社GIVIN・株式会社OverFlow・株式会社niks・株式会社トリドリIS・株式会社blends・株式会社Vooster）は自社の子会社のため、関連企業には含めませんでした。

## 要確認（status に反映）

- businessModel: 2022年10月11日付で普通株式１株につき20株の割合で株式分割を行っています。主要な経営指標等の注記に、第６期の数値は当該株式分割が第６期の期首に行われたと仮定して算出されている旨が記載されています。本登録は株式分割後の株式数に基づく指標で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 株式会社トリドリのインフルエンス・プラットフォーム事業 → 提案: 広告・マーケティング（インフルエンサーマーケティング）。単一セグメントであるインフルエンス・プラットフォーム事業（2025年12月期の売上高5,372百万円）は、インフルエンサーと企業を結ぶプラットフォームの運営と、成果報酬型広告や広告代理など広告会社の事業であり、報道・出版・放送といった媒体の運営そのものではない。閉じた分類（INDUSTRY_IDS）に広告・マーケティングの区分が無く、最も近い media を暫定とした。デジタリフト、売れるネット広告社グループなど広告支援の先例と同じ事情である。
