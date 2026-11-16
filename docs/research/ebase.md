# ｅＢＡＳＥ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ｅＢＡＳＥ株式会社 |
| 証券コード | 3835 |
| docID（データを取り出した文書） | `S100YEPQ` |
| 原本 docID | `S100YEPQ` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEPQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ｅＢＡＳＥ株式会社 / 3835 / docID S100YEPQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ebase: 10 件の数値を有報XBRLと照合
有報: ｅＢＡＳＥ株式会社 有価証券報告書－第25期(2025/04/01－2026/03/31) (docID S100YEPQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ebase: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「eBASE株式会社」が EDINET の提出者名「ｅＢＡＳＥ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は付けていない。主要な経営指標等の推移に注記はなく、表示方法の変更（連結キャッシュ・フロー計算書における「差入保証金の差入による支出」及び「差入保証金の回収による収入」の独立掲記と前連結会計年度の組替え）は表示方法の変更のみで、前期有報との指標照合でも全系列に差異はなかったため、warnings のみの扱いとした。
- businessModel: セグメント利益、ＭＤ＆Ａの段階利益の金額と増減理由、キャッシュ・フローの金額、設備の帳簿価額、連結子会社の主要な損益情報等は本文に書いていない。
- businessModel: 経営方針で最重要視するとされる経営指標（経常利益の持続的成長）は利益指標の目標であるため、本文と perspectives のいずれにも書いていない。戦略は定性的に書いた。
- businessModel: eBASE-PLUS事業のＭＤ＆Ａの売上高2,679百万円はセグメント間取引消去前の金額であり、本文ではセグメント情報の外部顧客への売上高2,668百万円を用いた。
- businessModel: 売上高の前連結会計年度比3.85％減は、ＭＤ＆Ａの販売実績のセグメント合計の前年同期比△3.85％の印字に基づく。
- businessStructure: 設備の状況では、本社・東京支社・香川開発センターとデータセンター２か所がeBASE事業、eBASE-NeXT株式会社の本社がeBASE事業、eBASE-PLUS株式会社の本社ほか３営業所がeBASE-PLUS事業と印字されている。帳簿価額は書いていない。
- businessStructure: eBASE事業の収益の分解情報の内訳（パッケージソフト、カスタマイズ、ライセンス＆サポート、クラウドサービス、その他）の千円単位の合計は、セグメントの外部顧客への売上高と３千円異なる印字であり、そのまま記載した。百万円への切捨て後の内訳合計もセグメント金額とは一致しない。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。【事業の内容】に個別の仕入先名は印字されていない。
- businessStructure: 株式会社ＫＳＰ－ＳＰは2026年３月31日現在のグループ構成には含まれていない（needsReview に記録）。
- history: 【沿革】のうち、2003年５月の東京支社の新設、2010年４月の香川開発センターの新設、2015年６月の監査等委員会設置会社への移行は、主要な事業の転機ではないため沿革の項目にはしていない。
- history: Wikipedia は found: false であり、何も補完していない。
- industry: 主たる業界は it とした。eBASE事業（パッケージソフトウエア、クラウドサービス）とeBASE-PLUS事業（ＩＴ開発アウトソーシング）のいずれもＩＴサービスであり、ＤＥＩの別記事業も cte であるため直接当てはまる（暫定ではない）。
- industry: eBASE-PLUS事業は受託開発や運用管理等の人材を伴うサービスを含むが、ＩＴ開発アウトソーシングとして開示されており、人材サービス専業ではないため、human-resources は付けていない。
- relatedCompanies: makiya（株式会社マキヤ）は、【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】に既存顧客として社名と具体的なサービスの活用が印字されているため customer として結んだ。販売金額は説明に書いていない。
- relatedCompanies: base-4481（ベース株式会社）は結ばなかった。「ベースに」「連結ベース」等の一般的な文言の一致のみである。
- relatedCompanies: port（ポート株式会社）は結ばなかった。「サポート」の部分文字列の一致のみである。
- relatedCompanies: en（エン株式会社）は結ばなかった。部分文字列の一致のみである（ambiguous）。
- relatedCompanies: core（株式会社コア）は結ばなかった。「コアコンピタンス」という一般的な文言の一致のみである（ambiguous）。
- relatedCompanies: seki（セキ株式会社）は結ばなかった。「セキュリティ」の部分文字列の一致のみである（ambiguous）。
- relatedCompanies: corona（株式会社コロナ）は結ばなかった。新型コロナウイルス感染症のリスク記述における文言の一致のみである。
- relatedCompanies: frontier（株式会社フロンティア）は結ばなかった。設備の状況に印字されるのは株式会社ＩＤＣフロンティアであり、別の法人である。データセンターの賃借先としての記載のみで、事業上の取引・提携の説明も印字されていない。
- relatedCompanies: career（株式会社キャリア）は結ばなかった。「キャリア層」等の一般的な文言の一致のみである。
- relatedCompanies: cover（カバー株式会社）は結ばなかった。「カバーされている」という一般的な文言の一致のみである。
- relatedCompanies: innovation（株式会社イノベーション）は結ばなかった。「イノベーションの促進」という一般的な文言の一致のみである。
- relatedCompanies: land（株式会社ランド）は結ばなかった。「ブランド」の部分文字列の一致のみである。
- relatedCompanies: trust（株式会社トラスト）は結ばなかった。コードリストにない候補であり、大株主の状況に印字されるのは日本マスタートラスト信託銀行株式会社（信託口）という信託の受託者である。
- relatedCompanies: i-x-knowledge（アイエックス・ナレッジ株式会社）は結ばなかった。2015年にeBASE-PLUS株式会社が同社の九州事業所部門を譲り受けた沿革上の取引先であり、現在の取引・提携・資本関係は印字されていない（譲受の事実は沿革に記録）。
- relatedCompanies: ray（株式会社レイ）は結ばなかった。「リプレイス」の部分文字列の一致のみである（ambiguous）。
- relatedCompanies: ricoh（株式会社リコー）は結ばなかった。「リコール」の部分文字列の一致のみである。
- relatedCompanies: the-lead（株式会社リード）は結ばなかった。「リードタイム」という一般的な文言の一致のみである。
- relatedCompanies: 株式会社ヨークベニマル、株式会社ハーモニック、株式会社寺岡精工は、【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】に顧客や協業の相手先として印字されているが、related-candidates.json の候補にないため結んでいない。
- relatedCompanies: 株式会社ＫＳＰ－ＳＰは、期末後に子会社化が予定される相手先だが、候補にないため結んでいない（事実は needsReview に記録）。
- relatedCompanies: 特定投資株式及びみなし保有株式は「該当事項はありません」と【株式の保有状況】に印字されている。政策保有株式は非上場株式のみである。自社の連結子会社は結んでいない。
- terms: 助言のみ。用語候補: ワンソースマルチユース、商材ebisu、MDM eBASE、DBP eBASE、トライアングルピラミッド（Ｔ-Pyramid）

## 要確認（status に反映）

- businessModel: 2026年４月28日開催の取締役会で、株式会社ＫＳＰ－ＳＰの発行済株式の74.8％を取得する株式譲渡契約の締結が決議され、2026年６月末に同社を子会社化する予定であることが、連結財務諸表の注記（重要な後発事象）及び【事業の内容】に印字されています。本登録は2026年３月31日現在のグループ構成（当社及び連結子会社２社）に基づいており、子会社化後の取扱いは人の確認が必要です。
- businessStructure: 2026年４月28日開催の取締役会で、株式会社ＫＳＰ－ＳＰの発行済株式の74.8％を取得する株式譲渡契約の締結が決議され、2026年６月末に同社を子会社化する予定であることが、連結財務諸表の注記（重要な後発事象）及び【事業の内容】に印字されています。本登録は2026年３月31日現在のグループ構成（当社及び連結子会社２社）に基づいており、子会社化後の取扱いは人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
