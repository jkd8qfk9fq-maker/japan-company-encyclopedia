# Ａｒｅｎｔ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ａｒｅｎｔ |
| 証券コード | 5254 |
| docID（データを取り出した文書） | `S100Z4WQ` |
| 原本 docID | `S100Z4WQ` |
| 提出日（原本） | 2026-09-29 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z4WQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ａｒｅｎｔ / 5254 / docID S100Z4WQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
arent: 10 件の数値を有報XBRLと照合
有報: 株式会社Ａｒｅｎｔ 有価証券報告書－第14期(2025/07/01－2026/06/30) (docID S100Z4WQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
arent: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Arent」が EDINET の提出者名「株式会社Ａｒｅｎｔ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益だけです。他の利益段階の金額や増減率、総資産・純資産の金額、設備の帳簿価額は書いていません。
- businessModel: 前期有報との主要な経営指標等の照合では6つの系列すべてで差異がありませんでした。注記にある財務諸表の組替えは、営業外収益の「その他」に含めていたキャッシュバック収入を独立掲記するための表示方法の変更に伴うもので、売上高や純利益の数値に影響しないため、financialNotes には入れず warnings に記録しました。
- businessModel: セグメント利益の測定方法の変更（前期のセグメント情報を変更後の測定方法で表示し直したことを含む）も、表示・測定方法に関する事項のため本文には書いていません。
- businessModel: 2022年11月18日の株式分割については、分割そのものの事実を financialNotes（2023年6月期）と needsReview に記録し、1株当たり指標の遡及計算に関する部分は表示事項として扱いました。主要な経営指標等の推移の他の注記（上場前の期中平均株価が把握できないこと、種類株主に対する残余財産の分配額の控除など）も表示事項のため warnings に留めました。
- businessModel: 自己株式の取得は資本政策の事項として warnings のみに留め、本文や perspectives には書いていません。
- businessModel: 経営上の目標として印字された利益段階の指標や市場シェアの目標値は、投資・利益指標の目標にあたるため本文や perspectives には書いていません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。継続企業の前提に関する注記もありません。
- businessStructure: セグメント名称は当期より「プロダクト共創開発」から「DX事業」、「自社プロダクト」から「プロダクト事業」に変更されています（金額への影響はない旨が印字されています）。また、従来の報告セグメント「共創プロダクト販売」は当期に該当する取引がないため報告セグメントから除外されています。登録は当期の2セグメント構成で行いました。
- businessStructure: 主要な設備は東京オフィス、浜松オフィス、株式会社建設ドットウェブの本社及び支店・営業所で、いずれもセグメント欄は「全社共通」のため、特定の事業には結びつけていません。帳簿価額も書いていません。
- businessStructure: 株式会社PlantStreamは2025年3月に完全子会社化され、2025年10月に当社が吸収合併したため、2026年6月30日現在の連結子会社9社には含まれません。
- businessStructure: このツリーの旧スキーマに合わせ suppliers キーは省略しました。【事業の内容】に特定の仕入先の印字はありません（Autodesk社はBIMツール「Revit」の提供元として製品の文脈で言及されるのみです）。
- history: 沿革の表は年月と事象が順に印字されており、行順に対応づけて読みました。年月は書かず年だけを記録しています。資本金の金額も書いていません。
- history: 落とした行: 2018年8月の複数代表体制、2021年4月の「PlantStream®」リリース、2024年1月の「LightningBIM ファミリ管理」リリース、2024年8月の株式会社VestOneから株式会社Arent AIへの商号変更と生成AIへの事業転換、2025年8月の製品リリース3件（現場支援型スマート工程ソフト「PROCOLLA」、Revitアドイン「LightningBIM AI Agent」、AIツール「PlantStream AIDE」）、2025年10月のArent Solutions Inc.設立、2025年11月のArent Software S.A.設立、2026年5月の製品リリース2件（AI会議アシスタント「KageMee」、アドインシリーズ「ASPO」）。
- history: Wikipediaの記事（Arent）の冒頭は有報の事業説明と重なる内容のみで、有報にない補足として使える旧社名・通称等の情報がないため使っていません。出典にも加えていません。
- industry: 主たる業界は、建設業界向けのDX支援（コンサルティング・システム開発）とソフトウエアのライセンス販売が事業の実体であり、建設工事そのものを行う会社ではないため、閉じた分類の it に直接当てはまります（DEIの別記事業もCTE）。暫定ではないため taxonomyGaps はありません。このツリーのゲートに合わせ、業界行は industryId キーで記録しています。
- relatedCompanies: takasago-thermal-engineering（高砂熱学工業）: 【主要な顧客ごとの情報】に直近2期とも印字され、【事業の内容】でも主要な顧客として安定的な取引の継続が印字されているため customer として結びました。売上高の金額は説明に書いていません。
- relatedCompanies: obayashi（大林組）: 同社と共同開発した製品「PROCOLLA」が当社の現行製品として印字されているため、business-partner として結びました。
- relatedCompanies: nisshinbo-holdings（日清紡ホールディングス）: 2021年3月に株式会社VestOne（現 株式会社Arent AI）を共同出資で設立した経緯は沿革に印字されていますが、同社は現在当社の100％子会社であり、現在の取引・資本関係の印字がないため、過去の共同出資のみでは結びませんでした。
- relatedCompanies: hikari-tsushin（光通信）: 大株主の状況に印字されるのは「光通信KK投資事業有限責任組合」で、株式会社光通信とは別法人格の投資組合のため結びませんでした。
- relatedCompanies: en（エン）: ambiguous の候補で、「エンジニア」など一般語の部分一致のみです。結んでいません。
- relatedCompanies: suzuki-6785（鈴木）: 第三者算定機関である鈴木一貴公認会計士事務所の個人名の部分一致のみです。結んでいません。
- relatedCompanies: base-4481（ベース）: 「キャッシュ・フローベース」など一般語の部分一致のみです。結んでいません。
- relatedCompanies: lec（レック）: 「フレックスタイム」の部分一致のみです。結んでいません。
- relatedCompanies: seki（セキ）: ambiguous の候補で、「セキュリティ」など一般語の部分一致のみです。結んでいません。
- relatedCompanies: kohsoku（高速）: 「高速化」という一般語の部分一致のみです。結んでいません。
- relatedCompanies: king（キング）: 「建設業売上高ランキング」の部分一致のみです。結んでいません。
- relatedCompanies: rhythm（リズム）: 「アルゴリズム」の部分一致のみです。結んでいません。
- relatedCompanies: the-lead（リード）: 「マドリード」など地名・一般語の部分一致のみです。結んでいません。
- relatedCompanies: core（コア）: ambiguous の候補で、「コアメンバー」の部分一致のみです。結んでいません。
- relatedCompanies: corona（コロナ）: 新型コロナウイルス感染症の文脈のみです。結んでいません。
- relatedCompanies: cota（コタ）: ambiguous の候補で、信託の名称「コタエル信託」の部分一致のみです。結んでいません。
- relatedCompanies: cover（カバー）: 「カバー」という一般語の部分一致のみです。結んでいません。
- relatedCompanies: nissin（日新）: コードリストにない候補で、新株予約権の文脈の部分一致のみです。結んでいません。
- relatedCompanies: port（ポート）: 「リリース」等の文脈の部分一致のみです。結んでいません。
- relatedCompanies: vision（ビジョン）: 「ビジョン」という一般語のみです。結んでいません。
- relatedCompanies: 候補にないため結んでいません: 千代田化工建設株式会社（株式会社PlantStreamの合弁相手ですが候補一覧にありません）、Autodesk社（BIMツール「Revit」の提供元、海外企業）。株式会社PlantStreamをはじめとする連結子会社は自社の子会社のため結んでいません。大株主は個人と投資事業有限責任組合のみで、結べる事業会社はありません。
- terms: 用語の助言のみです。対象となりうる用語は「暗黙知（経験や勘に基づく、言語化が難しい知識）」「BIM（建物の形状と属性情報を併せ持つ建物情報モデル）」「SaaS」「PoC（概念実証）」「MVP（実用最小限の製品）」「アジャイル開発」「アドイン（ソフトウエアへ機能を追加するプログラム）」などですが、本文では事業説明の中に意味を含めて平易に書いており、独立した用語データは作成していません。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2022年11月18日付で普通株式１株につき40株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessStructure: 主要な経営指標等の推移の注記に、2022年11月18日付で普通株式１株につき40株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
