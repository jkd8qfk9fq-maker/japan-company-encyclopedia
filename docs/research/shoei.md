# SHOEI — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＳＨＯＥＩ |
| 証券コード | 7839 |
| docID（データを取り出した文書） | `S100XC55` |
| 原本 docID | `S100XC55` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XC55.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＳＨＯＥＩ / 7839 / docID S100XC55（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shoei: 10 件の数値を有報XBRLと照合
有報: 株式会社ＳＨＯＥＩ 有価証券報告書－第69期(2024/10/01－2025/09/30) (docID S100XC55)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shoei: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社SHOEI」が EDINET の提出者名「株式会社ＳＨＯＥＩ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（売上高32,363,623千円→32,363百万円、親会社株主に帰属する当期純利益6,318,367千円→6,318百万円、品目別販売実績も同様）。切り捨てのため品目別の合計（32,362百万円）は連結売上高（32,363百万円）と1百万円差が生じるが、印字どおりとした。
- businessModel: 財務諸表の組替えは、繰延税金資産の注記における表示方法の変更（製品保証引当金の独立掲記、長期未払金のその他への統合）と、個別損益計算書における設備賃貸料の独立掲記のみであり、5年間の経営指標に影響しない。前期有報との修正再表示チェックも全系列で一致したため、financialNoteは書かなかった。
- businessModel: 2025年11月14日開催の取締役会で、自己株式の取得（25億円又は1,700千株を上限）を決議した旨が重要な後発事象に記載されている。期末後の資本政策の決議のため、本文には書かず警告に記録した。
- businessModel: 連結子会社間の吸収合併は needsReview に記録した。登録は期末時点の体制に基づく。
- businessModel: 自己資本利益率（ROE）や売上総利益率、配当性向などの投資指標とその目標値は、本文・戦略に書かなかった。受注高・期末受注残高も本文に書かなかった。
- businessModel: 本ツリーのスキーマに suppliers キーが無いため、businessModel に suppliers は書かなかった。仕入先に関する個別の印字も本文にはない。
- businessModel: 地域別の売上高は、セグメント情報の地域ごとの情報（日本5,655,869千円、欧州・北米・アジア・その他）に依拠し、本文では金額を書かず海外が大半を占める旨のみを記した。
- businessStructure: 単一セグメント（ヘルメット関連事業）のため、子区分はMD&Aの品目別販売実績（二輪乗車用ヘルメット28,347,855千円、官需用ヘルメット110,339千円、その他3,905,428千円）に基づく。セグメント関連情報の製品及びサービスごとの情報は、単一の製品・サービス区分が外部顧客への売上高の90％超のため省略されている。
- businessStructure: 連結子会社は7社（海外6社、国内1社）。SHOEI ASIA CO.,LTD.は議決権の所有割合が49.0％だが、実質的に支配しているため子会社とされている。海外子会社は欧州・タイの販売代理店と中国の市場調査・マーケティングを担い、株式会社SHOEI SALES JAPANが国内の販売店運営とマーケティングを担う。
- businessStructure: 生産拠点は提出会社の茨城工場（茨城県稲敷市、従業員255人）と岩手工場（岩手県一関市、従業員292人）。設備の帳簿価額は本文に書かなかった。
- businessStructure: 連結子会社間の吸収合併（SHOEI DISTRIBUTION GMBH存続、SHOEI (EUROPA) GMBH消滅）は重要な後発事象として開示されており、businessModel の needsReview に記録した。本登録は期末時点の体制（両社とも連結子会社として記載）に基づく。
- history: 沿革は年月と事象文が連記された崩れた表のため、年月と事象の数が対応することを確認し、行順で対応づけた。
- history: 1959年の設立時の資本金60万円は、沿革に資本金額を書かないため省略した。1989年の有限会社南小梨ペインティングの子会社化と2006年の同社との合併、ショールームの開設（2021年大阪、2022年横浜、2023年京都・福岡、2025年札幌）等の軽微な事項は省略した。
- history: SHOEI SAFETY HELMET CORPORATIONは2023年9月に解散している旨を1968年の行に併記した。
- industry: 単一セグメント（ヘルメット関連事業）のみのため、業界は1つだけとした。製造会社であることから暫定で machinery とし、分類の不足は taxonomyGaps に記録した。
- relatedCompanies: kuraray（株式会社クラレ）: 【大株主の状況】に2025年9月30日現在で960千株・1.8％の保有が印字されるが、取引・提携・保有目的の記載がなく、関係を裏付ける記述がないため結ばなかった。
- relatedCompanies: meiwa（明和産業株式会社）: 【大株主の状況】に2025年9月30日現在で1,600千株・3.0％の保有が印字されるが、取引・提携・保有目的の記載がなく、関係を裏付ける記述がないため結ばなかった。
- relatedCompanies: 岡田商事株式会社: 主要な販売先（2025年9月期の販売実績4,037,281千円）であり大株主（1.4％）でもあるが、未上場で related-candidates.json に無いため結ばなかった。販売先としての事実は businessModel に記載した。
- relatedCompanies: HELMET HOUSE INC.: 主要な販売先（2025年9月期の販売実績4,701,838千円）だが、未上場で related-candidates.json に無いため結ばなかった。販売先としての事実は businessModel に記載した。
- relatedCompanies: land（株式会社ランド）: 「ランド」は地名等の部分一致で、正式名称の印字がないため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 「新型コロナ禍」の文脈でのみ現れるため結ばなかった。
- relatedCompanies: lec（レック株式会社）: 人名等の部分一致のため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「従来モデルベース」の部分一致のため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア」は育児・介護との両立施策の一般語として現れるため結ばなかった。
- relatedCompanies: cacco（かっこ株式会社）: 「かっこいい」の部分一致のため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: 日本マスタートラスト信託銀行（信託口）の部分一致で、信託口の純投資のため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 製品名「ワイバーンゼロ」の部分一致で ambiguous のため結ばなかった。
- relatedCompanies: core（株式会社コア）: 「コアなファン」の一般語の部分一致で ambiguous のため結ばなかった。
- relatedCompanies: cover（カバー株式会社）: 「カバーしていく」の動詞の部分一致のため結ばなかった。
- relatedCompanies: en（エン）: 部分一致で ambiguous のため結ばなかった。
- relatedCompanies: no-1（株式会社No.1）・port（株式会社ポート）: 本文に正式名称での言及が確認できないため結ばなかった。
- relatedCompanies: 当社は株式の保有状況（政策保有株式）について「該当事項はありません」としており、保有株式を根拠とする関連付けも行わなかった。連結子会社7社は自社グループのため結ばなかった。
- terms: 助言: 用語「プレミアムヘルメット」は、高品質で高付加価値の二輪乗車用ヘルメットを指す当社の呼称で、事業の内容に印字されています。
- terms: 助言: 用語「SHOEI Gallery」は、当社グループが運営する直営ショールームの名称で、東京・大阪・横浜・京都・福岡・札幌のほか、海外ではパリとバルセロナにあります（沿革・経営方針に印字）。
- terms: 助言: 用語「Made in Japanで勝負します」は、経営方針の一つで、造形・製品開発、品質保証、生産の全てを国内に置く方針を指します。

## 要確認（status に反映）

- businessModel: 2023年4月1日付で普通株式1株につき2株の株式分割を行った。主要な経営指標等の株式関連指標は、当該株式分割が第65期（2021年9月期）の期首に行われたものと仮定して算定されている。
- businessModel: 連結子会社間の吸収合併が重要な後発事象に記載されている。SHOEI DISTRIBUTION GMBHを存続会社、SHOEI (EUROPA) GMBHを消滅会社とする吸収合併について、企業結合日を2025年7月1日として、2025年11月13日に合併契約を締結し、同年11月18日に登記が完了した。期末時点の関係会社の状況では両社とも連結子会社として記載されており、本登録は期末時点の体制に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] SHOEIの主たる業界 → 提案: apparel-accessories（ヘルメット等の用品・装備品）。乗車用ヘルメットの製造販売が事業の全てであり、閉じた分類にヘルメットや二輪用品等の装備品を表す値がないため、製造業として最も近い machinery を暫定とした。
