# ガーラ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ガーラ |
| 証券コード | 4777 |
| docID（データを取り出した文書） | `S100Z8OS` |
| 原本 docID | `S100XVK0` |
| 提出日（原本） | 2026-03-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XVTL, S100Y86A, S100Z8OS／有効文書 S100Z8OS（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z8OS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ガーラ / 4777 / docID S100XVK0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gala: 10 件の数値を有報XBRLと照合
有報: 株式会社ガーラ 訂正有価証券報告書－第33期(2025/01/01－2025/12/31) (docID S100Z8OS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2023-12 の期は 9 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
注意: 訂正有価証券報告書（訂正有価証券報告書－第33期(2025/01/01－2025/12/31)、docID S100Z8OS）を有効文書としてこのパックを作った。原本は docID S100XVK0。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（MajorShareholdersTextBlock・OverviewOfAffiliatedEntitiesTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
gala: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本有報は訂正有価証券報告書（S100Z8OS）であり、主要株主の状況と関係会社の状況の記載が訂正されています。経営指標等はいずれの訂正でも変更されていないことを原本（S100XVK0）のXBRLと突き合わせて確認し、本文は訂正後の文書に基づいて書きました。
- businessModel: 期間後の出来事として、2026年２月６日開催の取締役会で資本金及び資本準備金の額の減少並びに剰余金の処分を決議し、2026年３月28日開催の定時株主総会で承認可決されています。資本政策の決議のため warnings のみとし、登録は2025年12月31日現在の構成で行っています。
- businessModel: 【事業等のリスク】には、株式会社ツリーフルについて、連結業績への関与度が低下していることから、関与度の更なる低減を含めたグループ内における位置付けの見直しを検討している旨が記載されています。将来の検討事項であり、期間後の構造変更の決定ではないため warnings のみとしました。
- businessModel: 主要な経営指標等の注記２（2023年12月期が９か月間）を financialNotes に記録しました。注記１（潜在株式調整後１株当たり当期純利益に関する事項）は表示事項のため warnings のみとしました。
- businessModel: 主要な経営指標等について前期有報との照合で全系列に差異はなく、本文中に遡及適用に言及する注記は確認できませんでした。そのため financialNotes には決算期変更による９か月間の注記のみを記録しました。
- businessModel: MD&Aの売上高と親会社株主に帰属する当期純損失以外の金額（利益の各段階、キャッシュ・フロー、資産・負債）は書いていません。「営業利益の計上を最も重要な経営目標とする」との経営目標も、投資指標にあたる数値目標ではないものの利益段階の目標であるため、本文にも perspectives にも書いていません。
- businessStructure: 報告セグメントは日本・韓国の地域別であり、事業別の売上高は【セグメント情報等】の製品及びサービスごとの情報に開示された内訳を用いました。日本セグメントの事業別売上高は独立して開示されていないため、日本セグメントの子事業には金額を書いていません。
- businessStructure: 【連結損益計算書関係】の売上高の内訳では、オンラインゲーム事業の数値にHTML5ゲーム事業が含まれており、【セグメント情報等】の内訳と分類が異なるため、金額はセグメント情報の内訳を用いました。
- businessStructure: その他の関係会社であるMegazone Cloud Corporation（被所有割合36.0％）とその親会社Megazone Corporationとの取引（債務保証や共同マーケティングの契約など）がありますが、事業の構造には影響しないため、ここには記録しませんでした。
- history: 沿革に印字された出来事のうち、2000年の米国関連会社の設立、2005年の韓国支店の設置、2007年のGala Lab Corp.の設立、2009年のガーラモバイルの子会社化、2012年のガーラポケット設立、2014年の吸収合併、2017年のGala Lab Corp.の商号変更、2018年のスマートフォンアプリ事業の開始、2024年の韓国支店の新設など、比較的小さな出来事は登録しませんでした。
- history: 沿革に印字された設立時の資本金や上場時の資本金などの資本金額は、沿革には書きませんでした。
- history: 沿革の2008年２月の株式会社ベクトルとの業務・資本提携は、過去の一度限りの提携であり、現在の関係を示す記載がないため、沿革にも関連会社にも記録しませんでした。
- industry: 主たる業界は entertainment としました。報告セグメントは日本・韓国の地域別ですが、売上高の大半を占める韓国セグメントの中心がオンラインゲーム・HTML5ゲーム・スマートフォンアプリのゲーム事業によるものです（このツリーのゲートに合わせ industryId キーで記録）。
- industry: クラウド関連事業やツリーハウスリゾート事業、VFX事業は、報告セグメント単位で売上高が独立して開示されているわけではないため、2つ目以降の業界は付けませんでした。
- relatedCompanies: step: 「ステップ」の語の部分一致のみのため結びませんでした。
- relatedCompanies: port: 「サポート」の語の部分一致のみのため結びませんでした。
- relatedCompanies: ray: 曖昧な候補で、「プレイ」などの語の部分一致のみのため結びませんでした。
- relatedCompanies: path: 曖昧な候補で、「プラットフォーム」などの語の部分一致のみのため結びませんでした。
- relatedCompanies: base-4481: 「営業損益ベース」などの語の部分一致のみのため結びませんでした。
- relatedCompanies: lec: 「フレックス」の語の部分一致のみのため結びませんでした。
- relatedCompanies: freee: 「CO2フリー電気」の語の部分一致のみのため結びませんでした。
- relatedCompanies: grid: 「マイクログリッド」の語の部分一致のみのため結びませんでした。
- relatedCompanies: hit: 「大ヒット」の語の部分一致のみのため結びませんでした。
- relatedCompanies: i-ll: 「アイルランド」の地名の部分一致のみのため結びませんでした。
- relatedCompanies: innovation: 「イノベーションの推進」という一般的な語の一致のみのため結びませんでした。
- relatedCompanies: king: 「ハッキング」の語の部分一致のみのため結びませんでした。
- relatedCompanies: land: 「アイルランド」の地名の部分一致のみのため結びませんでした。
- relatedCompanies: vector-holdings: 沿革に2008年２月の業務・資本提携が印字されていますが、過去の一度限りの提携であり、現在の取引・資本関係を示す記載がないため結びませんでした。
- relatedCompanies: vision: 「ビジョン」という一般的な語の一致のみのため結びませんでした。
- relatedCompanies: その他の関係会社であるMegazone Cloud Corporation（被所有割合36.0％、筆頭株主）とその親会社Megazone Corporation（当社の借入に対する債務保証、共同マーケティングの契約）は、関連会社の候補に含まれていないため結べませんでした。
- relatedCompanies: 重要な契約等の相手方であるWemade Connect Co., Ltd.（「ラグナロク ユニバース」の開発に関する協業契約、主要な顧客でもあります）と株式会社グラビティ、主要な顧客であるYong Film Inc.は、関連会社の候補に含まれていないため結べませんでした。
- relatedCompanies: 政策保有株式は該当事項がなく、純投資目的の投資株式のみが印字されているため、株式の保有状況からは結びませんでした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 継続企業の前提について、【事業等のリスク】に「継続企業の前提に関する重要事象等」として、営業損失及び親会社株主に帰属する当期純損失の計上が継続しており、継続企業の前提に重要な疑義を生じさせるような事象又は状況が存在する旨が記載されています（同社は、対応策を実施することにより、継続企業の前提に関する重要な不確実性は認められないと判断しています）。継続企業の前提に関する記載の取扱いには人の確認が必要です。
- 財務: 変則決算。2023-12 の期は 9 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
