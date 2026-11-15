# トヨクモ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | トヨクモ株式会社 |
| 証券コード | 4058 |
| docID（データを取り出した文書） | `S100XS1A` |
| 原本 docID | `S100XS1A` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XS1A.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | トヨクモ株式会社 / 4058 / docID S100XS1A（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toyokumo: 4 件の数値を有報XBRLと照合
有報: トヨクモ株式会社 有価証券報告書－第16期(2025/01/01－2025/12/31) (docID S100XS1A)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
すべて一致しました。
toyokumo: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは1件です。主要な経営指標等の推移の注記1（第15期より連結財務諸表を作成）を2024年12月期の注記として記録しました。注記2（潜在株式が存在しないこと）、注記3（従業員数の数え方）、注記4（第15期の自己資本利益率は連結初年度のため期末自己資本に基づくこと）は表示事項のため、warningsに留めました。株式分割の記載は有報のどこにもありません。
- businessModel: 提出後の2026年２月13日の取締役会で自己株式の取得（上限150,000株・300百万円、2026年２月16日から５月29日までの市場買付）が決議され、２月末までに23,600株を取得済みです。資本政策の手続きのため、needsReviewにはせずwarningsに留め、金額は本文に書いていません。
- businessModel: 株式会社プロジェクト・モードの株式取得（2025年１月、子会社化）は当期中の出来事であり、期末のグループ構成（連結子会社2社）に反映済みのため、needsReviewにはしていません。取得に伴うのれん等の金額は本文に書いていません。
- businessModel: 経営方針の目標とする経営指標等は有償契約数・MRR・チャーンレートという運営指標であり、数値目標は印字されていないため、戦略は定性的に記載しました。段階利益の金額と増減理由、EBITDA、キャッシュ・フローの金額、受注の金額、設備の帳簿価額は記載していません。
- businessStructure: 単一セグメントのため、製品及びサービスごとの情報は有報で記載が省略されており、サービス別の金額は開示されていません。childrenには金額を書いていません。
- businessStructure: 販売は直販と代理店等の販売パートナー経由の間販の両方があります。【関連情報】の主要な顧客ごとの情報にはSB C&S株式会社とダイワボウ情報システム株式会社が掲載されていますが、related-candidatesに含まれないため関連企業には結んでいません。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略しました。個別の仕入先名は【事業の内容】に印字されていません。
- businessStructure: 本社設備は単一セグメントのため事業への帰属は事業全体とし、帳簿価額と年間賃借料は記載していません。国内子会社の設備は有報で記載が省略されています。
- businessStructure: 株式会社プロジェクト・モードは2026年１月に神奈川県川崎市から東京都品川区へ移転しています（提出後の移転であり、期末の構成に影響しません）。
- history: 本社移転（2015年４月 東京都港区芝、2017年１月 東京都品川区西五反田、2021年９月 東京都品川区上大崎）は沿革の項目として取り上げず、ここに記録しました。情報マネジメントシステム（ISO/IEC 27001）の認証取得（2015年９月）も同様です。
- history: 個別サービスの提供開始のうち、プリントクリエイター（2014年４月）、kViewer（2014年９月）、kBackup（2014年11月）、タイムスタンプ for kintone（2016年３月）、フォームブリッジ（2017年７月）、kMailer（2018年１月）、データコレクト（2020年３月）は、kintone連携サービスの系譜として2012年の項目に集約し、個別の項目にはしていません。
- history: 資本金の金額は沿革に書いていません。
- industry: DEIの別記事業は「cte」ですが、本文の事業内容は法人向けクラウドサービス（SaaS）の開発・販売であり、it を正としました。
- industry: it は事業内容への直接の適合であり、暫定分類ではないため taxonomyGaps には記録していません。
- industry: human-resources は付けていません。人事労務のサービスそのものではなく、企業向けのソフトウエアサービスを提供する事業者であるためです。
- relatedCompanies: en: 「エンタープライズ」などの部分文字列の一致のみで、エン株式会社についての取引・提携・資本関係の記載はないため結んでいません（ambiguous）。
- relatedCompanies: port: 「サポート」「レポート」などの部分文字列の一致のみで、ポート株式会社についての記載はないため結んでいません。
- relatedCompanies: corona: 「新型コロナウイルス」の一致のみで、株式会社コロナについての記載はないため結んでいません。
- relatedCompanies: taya: 大株主の住所「東京都世田谷区」の部分文字列の一致のみで、株式会社田谷についての記載はないため結んでいません（ambiguous）。
- relatedCompanies: base-4481: 「約定日ベース」という一般表現の一致のみで、ベース株式会社についての記載はないため結んでいません。
- relatedCompanies: seki: 「情報セキュリティ」の部分文字列の一致のみで、セキ株式会社についての記載はないため結んでいません（ambiguous）。
- relatedCompanies: tokyu: 大株主の住所にある「渋谷道玄坂東急ビル」の部分文字列の一致のみで、東急株式会社についての記載はないため結んでいません（ambiguous）。
- relatedCompanies: SB C&S株式会社とダイワボウ情報システム株式会社は【関連情報】の主要な顧客ごとの情報に掲載される主要な販売相手先（総販売実績に対する割合はそれぞれ12.0％、10.8％）ですが、related-candidatesに含まれないため結んでいません。
- relatedCompanies: 株式会社ナノバンクは2025年12月31日現在の大株主（45.66％）ですが、候補に含まれないため結んでいません。
- relatedCompanies: 保有目的が純投資目的以外の目的である投資株式は非上場株式１銘柄のみで、個別銘柄名の開示はありません。
- relatedCompanies: 連結子会社のトヨクモクラウドコネクト株式会社と株式会社プロジェクト・モードは自社の子会社のため結んでいません。
- terms: 用語の提案（助言のみ）：「kintone」（サイボウズ株式会社が提供する、業務アプリケーションを構築できるクラウドサービス）、「チャーンレート」（サービスにおける解約率を表す指標）、「MRR」（Monthly Recurring Revenue。毎月継続して生じる収益を表す指標）、「ストック型ビジネス」（有償契約数の増加により継続的に収益が積み上がるビジネスモデル）、「ナレッジマネジメント」（個々の経験やノウハウを共有し、再利用できるように管理すること）、「安否確認サービス」（災害時に従業員等の安否を確認し、情報共有を行うサービス）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
