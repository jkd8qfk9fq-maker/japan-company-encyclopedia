# ｐｌｕｓｚｅｒｏ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ｐｌｕｓｚｅｒｏ |
| 証券コード | 5132 |
| docID（データを取り出した文書） | `S100XHEY` |
| 原本 docID | `S100XHEY` |
| 提出日（原本） | 2026-01-26 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHEY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ｐｌｕｓｚｅｒｏ / 5132 / docID S100XHEY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
pluszero: 10 件の数値を有報XBRLと照合
有報: 株式会社ｐｌｕｓｚｅｒｏ 有価証券報告書－第8期(2024/11/01－2025/10/31) (docID S100XHEY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
pluszero: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社pluszero」が EDINET の提出者名「株式会社ｐｌｕｓｚｅｒｏ」と違います
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…しています。プロジェクト型で獲得した利益に基づいて、AEIに関する研究への継…）

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年10月期の2件目の注記（同年度は1件目の株式分割の注記を financialNotes に採用）: 「「収益認識に関する会計基準」（企業会計基準第29号　2020年３月31日）等を第５期の期首から適用しており、第５期以降に係る主要な経営指標等については、当該会計基準等を適用した後の指標等となっております。」
- businessModel: MD&Aの利益ライン（営業利益・経常利益・税引前当期純利益・特別損失）の金額・増減率・理由は本文に書いていない。本文の財務数値は売上高と当期純利益のみ。売上高の増加理由（製造業・情報通信業顧客向けの契約単価等の増加）は記載した。
- businessModel: 管理指標である売上総利益率や、AEI関連売上比率・サービス型売上比率の目標水準は投資・収益性の指標目標に当たるため strategy には書いていない（AEI関連売上比率の実績推移のみ industryPosition に記載）。
- businessModel: 重要な後発事象として、新株予約権（第７回）の発行が2025年12月24日の取締役会で決議され、2026年１月21日に割当が完了している。期間後の資本政策の決議・実施であるため warnings のみとし、needsReview には入れていない。
- businessModel: 前期有報との修正再表示照合は全系列で差異なし（証拠パックの restatementCheck で確認）。訂正有報はなく、会計方針の変更も「該当事項はありません」と印字されている。
- businessStructure: 単一セグメントのため、子区分は【関連情報】の製品及びサービスごとの情報が記載省略（単一区分が90％超）であることから、収益認識関係の注記に印字された売上分解（AEI関連売上・その他売上）を用いた。
- businessStructure: 設備は本社（東京都世田谷区）のみが主要な設備として印字されており、単一セグメントのためセグメント別の記載は省略されている。本社をソリューション提供事業の拠点とした。
- businessStructure: このツリーの旧スキーマに従い suppliers キーは省略した。有報に特定の仕入先の印字はない。
- history: 沿革は印字された年月表の行順どおりに年単位で記載した。資本金額は書いていない。
- history: 落とした行: 2018年８月の株式会社formalogicの設立と2019年10月の同社の清算（自然言語処理に特化した子会社の新設分割と清算で、現在の単一事業の転機ではないため）、2019年６月の本社移転（拠点の変遷のため）。
- industry: 主たる業界は it とした。単一セグメントのソリューション提供事業はAI/DXソリューションの提供であり、売上全体を占めるため。
- industry: DEIの別記事業は CTE である。
- relatedCompanies: taya（株式会社田谷）: 一致箇所は「世田谷区」の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: nissin（株式会社日新）: 候補の listing がコードリストになく、一致箇所も新株予約権に関する定型文の部分一致のみのため結ばない。
- relatedCompanies: base-4481（ベース株式会社）: 一致箇所は「ルールベース」等の一般的な技術用語の部分一致のみのため結ばない。
- relatedCompanies: innovation（株式会社イノベーション）: 一致箇所は「技術的イノベーション」という一般的な語句のみのため結ばない。
- relatedCompanies: seki（セキ株式会社）: 一致箇所は「セキュリティ」の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: trust（株式会社トラスト）: 印字される主要な顧客は株式会社トラストバンクであり、株式会社トラストとは別の法人であるため結ばない。株式会社トラストバンク自体は候補一覧にないため関連企業には結ばない。
- relatedCompanies: en（エン株式会社）: 一致箇所は「エンジニア」の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: vision（株式会社ビジョン）: 一致箇所は「ビジョン」という一般的な語句のみのため結ばない。
- relatedCompanies: rhythm（リズム株式会社）: 一致箇所はXAIの説明文中の部分一致のみのため結ばない。
- relatedCompanies: nipro（ニプロ株式会社）: 一致箇所は「株式会社ユニプロ」の部分一致のみのため結ばない。ユニプロ自体は候補一覧にない。
- relatedCompanies: port（ポート株式会社）: 一致箇所は「ポートフォリオ」の部分一致のみのため結ばない。
- relatedCompanies: giken（株式会社技研製作所）: 【株式の保有状況】の特定投資株式は「該当事項はありません」と印字されており、取引・提携の印字もないため結ばない。
- relatedCompanies: land（株式会社ランド）: 一致箇所は「ブランド」の部分一致のみのため結ばない。
- relatedCompanies: marubeni（丸紅株式会社）: 印字される業務提携の相手は丸紅情報システムズ株式会社であり、丸紅株式会社とは別の法人のため結ばない。
- relatedCompanies: ray（株式会社レイ）: 一致箇所は「AIロールプレイ」の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: shinpo（シンポ株式会社）: 候補の listing がコードリストになく、一致箇所も「シンポジウム」の部分一致のみのため結ばない。
- relatedCompanies: 候補外のため結ばない相手: アップセルテクノロジィーズ株式会社（2023年６月に資本業務提携を開始。候補一覧にない）、株式会社ユニーク及び株式会社ユニプロ（沿革に登場する事業譲受・参画の関係先。候補一覧にない）。
- terms: 用語の助言: 「AEI（Artificial Elastic Intelligence）」は、同社が独自に定義する「柔軟な人工知能」で、特定のジャンルに限定することによって機械が人間のように意味を理解できるようになることを目指す技術を指します。「仮想人材派遣」は、ユーザーから見て人間が対応しているように感じる対話システムである「仮想人材」を、メール・電話・チャット・テレビ会議・ロボット等を通して提供するサービスを指します。「N4（Neo Non-loss Normalized Network）」は、自然言語を機械が処理可能な形に変換した際の意味の表現形式を指します。「PSFデータ（Parametric Semantic Frame）」は、単語等の持つ意味をパラメータ形式で表現したデータベースを指します。「パーソナライズ要約」は、対話相手の利用可能語彙に応じた要約・言換技術を指します。「第４世代AI」は、ディープラーニングと知識・記号推論の融合により、意味理解に基づく高い推論精度と高い解釈性を両立させることを目指すAIの概念を指します。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2022年４月19日付で普通株式１株につき２株の割合で、2024年５月１日付で普通株式１株につき３株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessStructure: 主要な経営指標等の推移の注記に、2022年４月19日付で普通株式１株につき２株の割合で、2024年５月１日付で普通株式１株につき３株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
