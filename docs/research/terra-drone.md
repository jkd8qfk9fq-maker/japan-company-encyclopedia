# Terra Drone — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | Ｔｅｒｒａ　Ｄｒｏｎｅ株式会社 |
| 証券コード | 278A |
| docID（データを取り出した文書） | `S100Z0VE` |
| 原本 docID | `S100XY8O` |
| 提出日（原本） | 2026-04-30 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | S100Z0VE／有効文書 S100Z0VE（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z0VE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | Ｔｅｒｒａ　Ｄｒｏｎｅ株式会社 / 278A / docID S100XY8O（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
terra-drone: 8 件の数値を有報XBRLと照合
有報: Ｔｅｒｒａ　Ｄｒｏｎｅ株式会社 訂正有価証券報告書－第10期(2025/02/01－2026/01/31) (docID S100Z0VE)
前期有報との比較: 18 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第10期(2025/02/01－2026/01/31)、docID S100Z0VE）を有効文書としてこのパックを作った。原本は docID S100XY8O。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはNotesTaxEffectAccountingConsolidatedFinancialStatementsTextBlock・NotesTaxEffectAccountingFinancialStatementsTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 前期の窓に 訂正有価証券報告書－第9期(2024/02/01－2025/01/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
terra-drone: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「Terra Drone株式会社」が EDINET の提出者名「Ｔｅｒｒａ　Ｄｒｏｎｅ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（S100Z0VE、2026年9月7日提出）である。証拠パックの機械照合で、原本（S100XY8O）との差異は税効果会計に関する注記のテキストのみで、財務の数値と本文は同一（record-only）と分類されたため、訂正に伴う数値の差し替えや financialNote は行わず、出典は訂正有報の値とした。
- businessModel: 第9期の訂正有価証券報告書が前期の窓にあるが、前期有報との重複年度の修正再表示チェックは全系列で差異なし（6行一致）であり、主要な経営指標等への影響はないため warnings のみの記録とした。
- businessModel: 主要な経営指標等の推移の注記事項には、決算期の変更や会計基準の変更など年度に紐づく事実の印字がないため、financialNotes は空とした。株式分割の注記は needsReview に記録した。
- businessModel: MD&Aの営業損失・経常損失・セグメント損失などの金額と増減理由、減損損失や火災関連損失引当金の金額は、本文の財務数値を売上高と当期純利益に限る規則により書いていない。2025年12月にインドネシア子会社で火災事故が発生し従業員の命が失われた事実はMD&Aに印字されているが、引当金等の金額と結びつく財務的事項のため本文には書かず、ここに事実のみ記録する。
- businessModel: 経営上の目標の達成状況を判断するための客観的な指標等（売上高、営業利益、調整後営業利益）は利益指標を含む経営目標であるため、本文にも perspectives にも数値目標は書いていない。
- businessModel: 地域ごとの売上高（日本・欧州・アジア・その他）は機械側の地域別処理に委ね、本文には書いていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした（ドローンソリューション4,162,664千円、運航管理619,920千円）。子事業の測量・点検・農業は【事業の内容】の事業区分であり、金額は独立して開示されていないため金額は書いていない。
- businessStructure: セグメントの外部顧客への売上高の合計は4,782,584千円で、印字の連結売上高4,782,585千円と1千円異なる。印字の数値をそのまま記載した。
- businessStructure: グループ構成は2026年1月31日現在（当社、連結子会社10社、持分法適用会社1社）で登録した。2026年2月のTerra Global株式会社の消滅とAloft Technologies, Inc.の持分法適用関連会社からの除外は期後の変動として businessModel の needsReview に記録した。
- businessStructure: このツリーのスキーマには suppliers キーがないため仕入先は記載していない。【事業の内容】に特定の仕入先名の印字はない（産業用ドローンを仕入れる旨の一般的な記述のみ）。
- businessStructure: 主要顧客は【事業の内容】のセグメント別一覧の印字（建設・電力各社、政府、農業各社、石油・ガス・化学品各社、保険会社等）に基づく。外部顧客への売上高の10％以上を占める相手先はない旨が【関連情報】に印字されている。
- history: 沿革表の全ての行は年月と事象が対応して印字されている。次の行は主要な転機ではないため落とした: 各拠点の開設・移転（九州・北海道・関西・西日本）、Terra Mapper・Terra Roofer・Terra Lidar One/X/Dual/R・Terra SLAM RTK等の製品発売、BIM/CIMツールの販売開始、PT. Terra Drone Indonesiaとのデットエクイティスワップ2回と追加出資、Unifly NVへの第2〜4回出資と転換社債の転換、ISMS認証の取得、日本スタートアップ大賞2025の受賞、書籍の発売、クマよけスプレー搭載ドローンの開発・提供、サウジアラビアのアラムコとの覚書締結。
- history: 2023年のJ-KISS型資金調達は金額（18.5億円）を書かずに出来事だけを記録した。資本金の金額は沿革に書かない規則による。
- history: 【沿革】の末尾に、2020年7月までの間に当社が出資や子会社・JV設立を行った海外企業が計20社あり、いずれもその後売却・清算・閉鎖を行った旨が印字されている。個別の社名の印字はないため、沿革の項目としては記録していない。
- industry: 主たる業界は、売上高の87％を占めるドローンソリューション（自社開発のドローンやレーザスキャナ等の機器の開発・販売を含む）について、閉じた分類にドローンに合う値がないため、自社で機器を設計・開発する面から最も近い machinery を暫定とした。分類の不足は taxonomyGaps に記録した。
- industry: 運航管理セグメントはUTM（ソフトウェアプラットフォーム）の開発・提供であるため、副次的な業界として it を付けた。
- industry: DEIの別記事業は CTE（その他）である。
- relatedCompanies: 候補 modec（三井海洋開発株式会社）は、FPSOでのドローン板厚計測の共同実施と共同研究開発契約の印字があるため business-partner として結んだ。
- relatedCompanies: 候補 first-brothers（ファーストブラザーズ株式会社）は【大株主の状況】（2026年1月31日現在）に1.14％を保有する事業会社として印字されるため major-shareholder として結んだ。
- relatedCompanies: 候補 mitsui-and-co（三井物産株式会社）、tokyo-century（東京センチュリー株式会社）、seika（西華産業株式会社）は、いずれも新株予約権・優先株式の第三者割当の割当先として印字される資金調達の相手方であり、当期の取引・提携の印字がないため結ばなかった。
- relatedCompanies: 候補 nissin は ambiguous でコードリストになく、新株予約権の文脈の一般語の部分一致である。候補 port、base-4481、en、the-lead、seki、taya、career、core、corona、kohsoku、land、path、rent、ricoh、arata、vision は一般語・地名・用語の部分一致のみ（サポート、農地面積ベース、エンジニア、世界をリード、セキュリティ、世田谷区、キャリアパス、コアバリュー、新型コロナウイルス感染症、高速道路、英語表記、キャリアパス、タレント、リコール、あらためて、ビジョン）であり、候補 global-information は市場調査資料の出典名のみでコードリストになく、候補 software-service はUTM市場の定義文中の一般名詞であるため、いずれも結ばなかった。
- relatedCompanies: 【大株主の状況】（2026年1月31日現在）の筆頭株主テラ株式会社（39.67％）とSAUDI ARAMCO ENTREPRENEURSHIP VENTURES COMPANY LIMITED（4.69％）は非上場であり関連企業候補に含まれていない。その他の上位は個人株主と投資事業有限責任組合である。
- relatedCompanies: 候補に含まれていない取引先として、九州電力送配電株式会社（AIを搭載したドローン自動鉄塔点検システムの導入先）、PT. Yanmar Diesel Indonesia（自社開発の農業用ドローンの販売パートナー契約、2025年8月）、SMART Tbk（肥料散布事業の契約相手先）が【事業の内容】に印字されているが、いずれも関連企業候補に含まれていないため結んでいない。
- relatedCompanies: 【株式の保有状況】に特定投資株式の個別銘柄の印字はなく、政策保有株式に基づく候補はいない。
- relatedCompanies: 当社の連結子会社・持分法適用会社（Unifly NV、Aloft Technologies, Inc. 等）は自社グループの会社であるため関連企業としては結んでいない。
- terms: 用語候補（助言のみ）: UTM（無人航空機運航管理システム。ドローンの運航を管理するプラットフォーム）、低空域経済圏（ドローンや空飛ぶクルマなどのエアモビリティが飛行する高度の経済圏を指す当社の定義した用語）、Terra Lidar（自社開発のドローン搭載型UAVレーザスキャナ）、Terra Xross 1（自社開発の屋内点検用ドローン）、Terra UTドローン（超音波で非破壊の板厚点検が可能な自社開発ドローン）、FPSO（浮体式海洋石油・ガス生産貯蔵積出設備）、レベル4飛行（有人地帯におけるドローンの目視外飛行）、テラ群戦略（段階出資とM&Aで世界のドローン関連企業を取り込む当社の成長戦略）。

## 要確認（status に反映）

- businessModel: 当社は2024年７月25日付で普通株式１株につき100株の割合で株式分割を行っています。主要な経営指標等の株式関連の指標は、当該分割が第７期の期首に行われたと仮定して算定して印字されています（主要な経営指標等の推移の注記に記載）。本登録はこの算定後の数値に基づいています。
- businessModel: 2026年２月に、連結子会社のTerra Global株式会社は当社との吸収合併により消滅し、持分法適用関連会社のAloft Technologies, Inc.は当社の全保有株式の第三者への譲渡により持分法適用関連会社から除外されています（【事業の内容】及び【関係会社の状況】に印字）。本登録は2026年１月31日現在のグループ構成に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] テラドローン（terra-drone）のドローンソリューション事業・運航管理事業 → 提案: ドローン・無人航空機。産業用ドローンの開発・販売と、ドローンを活用した測量・点検・農業サービス、ドローン運航管理システム（UTM）の提供が事業の実体だが、閉じた分類（INDUSTRY_IDS）にドローン・無人航空機に当たる区分が無いため、業界を付けず分類の不足として記録するのではなく、自社開発の機器の面から最も近い machinery を暫定とし、UTMの面から it を副次的に付けた。
