# ミルボン — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ミルボン |
| 証券コード | 4919 |
| docID（データを取り出した文書） | `S100XZ4Q` |
| 原本 docID | `S100XTTF` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XZ4Q／有効文書 S100XZ4Q（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XZ4Q.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ミルボン / 4919 / docID S100XTTF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
milbon: 10 件の数値を有報XBRLと照合
有報: 株式会社ミルボン 訂正有価証券報告書－第66期(2025/01/01－2025/12/31) (docID S100XZ4Q)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第66期(2025/01/01－2025/12/31)、docID S100XZ4Q）を有効文書としてこのパックを作った。原本は docID S100XTTF。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（ManagementAnalysisOfFinancialPositionOperatingResultsAndCashFlowsTextBlock・ShareholdingsTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
milbon: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100XZ4Q、2026年4月15日提出）であり、原本（docID S100XTTF）との差異は本文（経営成績等の分析と株式の保有状況のテキストブロック）の変更のみで、売上高・親会社株主に帰属する当期純利益・総資産額・純資産額・従業員数の5年表の数値はすべて同一であることを証拠パックの照合で確認した。登録は訂正後の本文に基づき、出典は訂正有報の表題・URL・提出日で登録した。数値に影響がないため訂正に関するfinancialNoteは記録せず、本警告に記録した。
- businessModel: 証拠パックの「本文に財務諸表の組替えの記載がある」との注意について、修正再表示チェックでは前期有報と重複する全行が一致し、パック内の本文ファイルで連結経営指標等に影響する組替えは特定できなかったため、financialNotesには記録しなかった。
- businessModel: 金額は有報の千円印字を切り捨てで百万円にそろえて転記した（切り上げはしていない）。製品別・地域別・主要な顧客ごとの金額はセグメント情報の関連情報の印字に基づく。
- businessModel: 中期事業構想（2022-2026）の2026年度目標のうち、本文の文章の規則で書ける売上高目標（54,800百万円）のみをstrategyのdisclosedに引用し、その他の目標数値は転記しなかった。
- businessModel: 調達先については、有報が自社の調達について一般名詞の調達先を述べていないため、suppliersは書いていない。
- businessModel: 当連結会計年度の自己株式の取得と消却は期中に完了し期末の資本構成に反映済みの資本政策であるため、needsReviewには入れず本警告に記録した。重要な後発事象は、連結・個別のいずれも「該当する事項はありません」と印字されている。
- businessModel: 主要な販売先の株式会社トピー商事、株式会社ガモウ、株式会社MASS-HDはいずれも非上場で百科事典の関連候補に含まれないため関連企業としては結ばず、事実をflowとindustryPositionに記録した。
- businessStructure: 当社グループは化粧品の製造、販売の単一セグメントであるため、事業の構造は【関連情報】の製品及びサービスごとの情報の5区分を、外部顧客への売上高の大きい順にchildrenとして並べた。
- businessStructure: 連結子会社はMILBON USA, INC.、Milbon Trading(Shanghai)Co., Ltd.、Milbon Korea Co., Ltd.、MILBON (THAILAND)CO., LTD.、MILBON MALAYSIA SDN. BHD.、MILBON VIETNAM CO., LTD.、MILBON SINGAPORE PTE. LTD.、Milbon (Zhejiang) Cosmetics Co., Ltd.、Milbon Europe GmbHの9社で、このほかに持分法適用関連会社が1社ある（【関係会社の状況】に印字）。子会社の資本金の金額は転記していない。
- businessStructure: 金額は有報の千円印字を切り捨てで百万円にそろえて転記した（切り上げはしていない）。
- history: 沿革は有報の印字に基づき、設立・上場・海外展開・合弁設立などの主要な出来事に絞って選定した。支店開設・工場新設・個別製品の発売等の行は一部を省略した。
- history: 2017年12月の決算日変更（12月20日から12月31日へ）は5年表（2021年12月期から2025年12月期）より前の出来事で、5年表の各期はすべて12か月の期間であるため、historyと本警告に記録し、needsReviewには入れなかった。
- history: 沿革に印字された子会社設立時の資本金の金額は転記していない。
- industry: 主たる業界は、化粧品の製造、販売が主たる事業であることに基づき、閉じた分類に化粧品の区分がないため、掲載済みの化粧品会社（コーセーホールディングス、花王、資生堂等）と同じくchemicalsを暫定とした。
- relatedCompanies: 株式会社トピー商事（主要な販売先、2025年12月期の売上高6,724百万円）、株式会社ガモウ（同4,425百万円）、株式会社MASS-HD（同3,670百万円）は非上場で関連候補に含まれないため結ばず、事実をbusinessModelに記録した。
- relatedCompanies: 鴻池資産管理株式会社は2025年12月31日現在で当社株式の8.75％を保有する大株主だが、資産管理会社であり関連候補に含まれないため結ばなかった。
- relatedCompanies: 当社の連結子会社9社と持分法適用関連会社1社（コーセーミルボンコスメティクス株式会社）は当社グループ自身の会社であり、関連候補に含まれないため結ばなかった。
- relatedCompanies: 候補「en」（エン株式会社）はambiguousで、「エンドユーザー」等の一般語の部分一致であり、同社との取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: 候補「land」（株式会社ランド）は「ブランド」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ishin」（イシン株式会社）は一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「innovation」（株式会社イノベーション）は「サロンソーシャルイノベーション」等の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「base-4481」（ベース株式会社）は「ベースアップ」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「freee」（フリー株式会社）は「フリーセッション」等の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「rix」（リックス株式会社）はURL中の文字列等の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「vision」（株式会社ビジョン）は「グローバルビジョン」等の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「zero」（株式会社ゼロ）はambiguousで、「人権侵害ゼロ」等の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「bleach」（株式会社ブリーチ）は「ヘアブリーチ」という製品の一般名詞の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「career」（株式会社キャリア）は「キャリアガイダンス」等の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「path」（パス株式会社）はambiguousで、「パスワード」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「tac」（TAC株式会社）はコードリストになく、当社の製品開発システムの名称「TAC製品開発システム」の一致であり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 候補「core」（株式会社コア）はambiguousで、一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「idea-consultants」（いであ株式会社）は一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「king」（株式会社キング）は「ワーキング」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「no-1」（株式会社No．1）は「アジアNo.1」という目標の表記の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「port」（ポート株式会社）は「サポート」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ray」（株式会社レイ）はambiguousで、一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「seki」（セキ株式会社）はambiguousで、一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「slogan」（スローガン株式会社）は「コーポレートスローガン」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「trust」（株式会社トラスト）はコードリストになく、信託銀行の名称の部分一致であり、関係の記載はないため結ばなかった。信託銀行の信託口は純投資の保有であり結ばない。
- relatedCompanies: 候補「arata」（株式会社あらた）は「あらためて」という一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「cota」（コタ株式会社）はambiguousで、「インコタームズ」等の一般語の部分一致であり、同社との取引・提携の記載はないため結ばなかった。
- relatedCompanies: 候補「ricoh」（株式会社リコー）は製品名の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「tein」（株式会社テイン）は成分名等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- terms: 助言: 用語「フィールドパーソン」は、美容室への教育活動を中核に、美容室やエンドユーザーの声を聴いて課題の発見と提案を行う当社の営業部員の呼称で、9ヶ月間に及ぶ社内研修を経て活動します（経営方針に印字）。
- terms: 助言: 用語「TAC製品開発システム」は、美容室の現場で成功しているヘアデザイナーの成功技術を標準化し、それをサポートする製品を創る当社独自の製品開発の仕組みです（経営方針・研究開発活動に印字）。
- terms: 助言: 用語「オージュア」は、日本の風土・文化・毛髪特性から生まれた当社のプレミアムブランドです（沿革に印字）。
- terms: 助言: 用語「スタジオ」は、美容師向け講習会場のことです（沿革の注記に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 株式会社ミルボン（milbon）の業界（化粧品の製造・販売） → 提案: 化粧品・日用品（化粧品や理美容用品を製造・販売する会社）。有報は、化粧品の製造、販売を主な事業とする単一セグメントで、ヘアケア用剤・染毛剤・パーマネントウェーブ用剤・化粧品の区分を書いている。閉じた分類に化粧品・理美容にあたる区分が無く、最も近いchemicalsを暫定とした。掲載済みの化粧品会社（kose-holdings、kao、shiseido等）も同じ暫定の当てはめになっている。
