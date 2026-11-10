# 市光工業 — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 市光工業株式会社 |
| 証券コード | 7244 |
| docID（データを取り出した文書） | `S100XTYP` |
| 原本 docID | `S100XTYP` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTYP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 市光工業株式会社 / 7244 / docID S100XTYP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ichikoh-industries: 10 件の数値を有報XBRLと照合
有報: 市光工業株式会社 有価証券報告書－第96期(2025/01/01－2025/12/31) (docID S100XTYP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ichikoh-industries: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 地域別売上高の内訳の単純合計は117,086百万円で、印字の連結売上高117,089百万円と3百万円異なるが、有報の丸めとして印字どおり記載した。
- businessModel: 中期経営計画の数値目標（2030年度に売上高1,350億円、営業利益率の目標）は将来の数値目標のため、本文・perspectivesには含めず、戦略の内容のみを記載した。
- businessModel: 親会社のヴァレオ・マネジメントとヴァレオ・エス・イーはフランスの会社で関連企業候補データになく、日本の上場会社ではないため関連企業には結ばず、役割をbusinessModelとindustryPositionに記録した。2025年5月31日にヴァレオ・バイエンがヴァレオ・マネジメントに商号変更している。
- businessModel: 2025年8月にインドのTata AutoComp Systems Limitedと、インドで50対50の合弁会社を設立する合弁契約を締結した。同社はインドの未上場会社で関連企業候補データになく関連企業には結ばず、契約の事実は重要な契約等の開示に基づきperspectivesの戦略にインド市場への参入として反映し、ここに記録した。
- businessModel: 証拠パックの財務諸表の組替えの注意は、税効果会計の注記で繰延税金資産の内訳の表示方法を変更し（「賞与引当金」を「その他」に含める）、前事業年度の注記の組替えを行ったものである。5年間の主要な経営指標（売上高・経常利益・当期純利益・総資産・純資産・従業員数）には影響せず、前期有報との修正再表示チェックも全行一致したため、financialNotesには記載せず、判断の経緯をここに記録した。
- businessModel: 前期有報との修正再表示チェックは全行一致した。経営指標の注記にある会計基準の適用（収益認識基準等）と、セグメント変更の事実はfinancialNotesに記録した。
- businessModel: 主要な顧客の割合43.8％・11.6％はMD&Aの販売実績の注記の印字によった。
- businessStructure: 当社グループは自動車部品事業の単一セグメントであり、事業は1区分のみとした。セグメント別の記載は有報でも省略されている。
- businessStructure: childrenは【事業の内容】に印字された2つの製品の流れ（自動車メーカー向けの自動車用照明製品等、アフターマーケット向けの自動車用バルブやワイパー等）によった。製品及びサービスごとの情報は、単一の製品・サービスの区分の外部顧客への売上高が連結売上高の90％を超えるため有報で省略されており、childrenに金額は記載していない。
- businessStructure: 前連結会計年度までは「自動車部品事業」「用品事業」の2区分だったが、用品事業のPIAA株式会社の全株式譲渡（2024年8月）により、当連結会計年度から単一セグメントに変更された（businessModelのfinancialNotesに記録）。
- history: 沿革表は年月と事象が対応する通常形式で、全44行を収録した。
- history: 1968年の合併の行に印字された資本金額は、沿革テキスト内の財務金額となるため記載していない。
- history: 2025年8月のTata AutoComp Systems Limitedとの合弁契約締結は沿革表に載っていないため沿革には入れず、businessModelのperspectivesとwarningsに記録した。
- history: Wikipediaの補足は、順位・シェア等の数値に関する記述が中心で、有報で確認できる内容と重なるため使用しなかった。
- industry: 主たる業界は automotive（自動車）とした。自動車部品事業の単一セグメントで、自動車用照明製品等の製造・販売が事業の全額を占め、閉じた分類に収まるため taxonomyGaps はない。
- relatedCompanies: 親会社のヴァレオ・マネジメント（2025年12月31日現在、発行済株式（自己株式を除く）の61.08％を保有）と、その親会社のヴァレオ・エス・イー（議決権の61.11％を間接保有）は、フランスの会社で関連企業候補データになく、日本の上場会社ではないため結ばなかった。役割はbusinessModelとindustryPositionに記録した。
- relatedCompanies: 連結子会社4社（九州市光工業株式会社、イチコウ・マレーシア・ＳＤＮ．ＢＨＤ．、ＰＴ．イチコウ・インドネシア、イチコウ・インダストリーズ・タイランドＣＯ．，ＬＴＤ．）と持分法適用関連会社2社（ヴァレオ市光ホールディング、法雷奥市光（中国）車灯有限公司）は、いずれも有価証券報告書を提出していない会社で候補データになく、結ばなかった。
- relatedCompanies: 2025年8月に合弁契約を締結したTata AutoComp Systems Limitedはインドの未上場会社で候補データになく、結ばなかった。役割はbusinessModelに記録した。
- relatedCompanies: 候補 land（株式会社ランド）は、タイの所在地表記（タイランド）などの部分一致で、同社との取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: 候補 base-4481（ベース株式会社）は、「連結ベース」などの一般語との一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 en（エン株式会社、ambiguous）は、親会社の社名「ヴァレオ・マネジメント」の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 i-ll（株式会社アイル）は、「アイルランド」の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 ricoh（株式会社リコー）は、「リコール」の部分一致（事業等のリスクの記載）で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 career（株式会社キャリア）は、「キャリア開発」の一般語との一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 core（株式会社コア、ambiguous）は、「スコア」の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 innovation（株式会社イノベーション）は、「イノベーションによる成長」の一般語との一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 seki（セキ株式会社、ambiguous）は、常任代理人の名称（セキュリティーズ・サービシズ・オペレーションズ）の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 trust（株式会社トラスト）は、コードリストにない相手であり、大株主の日本マスタートラスト信託銀行（信託口）の表記との一致でもあるため結ばなかった。信託銀行の信託口は純投資であり結ばない。
- relatedCompanies: 候補 frontier（株式会社フロンティア）は、「フロンティアとして」の一般語との一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 port（ポート株式会社）は、「サポート」の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補 step（株式会社ステップ）は、「ステップとして」の一般語との一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 大株主のうちヴァレオ・マネジメント以外は、信託銀行の信託口、カストディ口座、金融機関の純投資であり、事業会社としての関係の印字がないため結ばなかった。特定投資株式は該当事項がなく、政策保有株式からの候補もない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報に説明のある当社グループ固有のものに限った（助言のみ）。

## 要確認（status に反映）

- businessModel: 親会社グループのValeo India Private LimitedのＶＬＳ事業について、譲受契約の締結を予定しています（時期は示されていません）。本登録の内容は2025年12月31日現在の構成に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
