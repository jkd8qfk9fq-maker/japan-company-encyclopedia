# Sharing Innovations — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｓｈａｒｉｎｇ　Ｉｎｎｏｖａｔｉｏｎｓ |
| 証券コード | 4178 |
| docID（データを取り出した文書） | `S100XS7T` |
| 原本 docID | `S100XS7T` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XS7T.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｓｈａｒｉｎｇ　Ｉｎｎｏｖａｔｉｏｎｓ / 4178 / docID S100XS7T（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sharing-innovations: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｓｈａｒｉｎｇ　Ｉｎｎｏｖａｔｉｏｎｓ 有価証券報告書－第18期(2025/01/01－2025/12/31) (docID S100XS7T)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sharing-innovations: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Sharing Innovations」が EDINET の提出者名「株式会社Ｓｈａｒｉｎｇ　Ｉｎｎｏｖａｔｉｏｎｓ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記１（2021年３月の上場に伴う潜在株式の期中平均株価の算定方法）と注記２（従業員数は契約社員を含む就業人員数である旨）は表示事項のため、financialNotes には入れず、ここに記録します。
- businessModel: セグメントの金額はセグメント注記の外部顧客への売上高（収益分解情報）を使っています。MD&Aに印字されたデジタルトランスフォーメーション事業の売上高4,088百万円はセグメント間の内部売上高を含む数値のため使っていません。
- businessModel: デジタルトランスフォーメーション事業の収益分解のうち「その他」217百万円は当期に新たに現れた区分で、前期は該当がありません。セグメント利益の金額は書いていません。
- businessModel: 経営方針に印字された客観的な指標（売上総利益、営業利益、営業利益成長率および国内クラウド市場の成長率と同程度という目標）は、利益・投資に関する指標のため、本文と perspectives には金額・目標値を書かず、戦略は定性的に記載しました。
- businessModel: MD&Aの段階利益の金額と増減理由、キャッシュ・フローの金額、受注高・受注残高の金額は書いていません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」でした。【株式の保有状況】は、純投資目的・純投資目的以外のいずれの投資株式も保有していない旨の印字のみです。
- businessModel: Wikipedia のパック内記事は「親子上場を行っている企業一覧」という一覧記事で当社自身の記事ではないため、補足には使っていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先名の印字はありません（開発の一部を他社主導プロジェクトへの参画や外部協力企業の人員で担う旨の一般的な記載のみ）。
- businessStructure: 【主要な設備の状況】の本社（東京都渋谷区）は「全社共通」の設備として印字されており、特定の事業には結びつけていません。帳簿価額は書いていません。
- businessStructure: プラットフォーム事業の外部売上高はセグメント注記の収益分解で全額「その他」区分に計上されており、「ウラーラ」単独の金額は開示されていないため、子の金額は書いていません。
- history: 設立時の資本金の金額は書いていません（沿革への資本金額の記載は行わない規則のため）。
- history: 省略した行：本社の移転（2014年・2017年・2020年）、株式会社グローバル・リサーチからのITソリューション事業の譲受（2018年）、株式会社エス・エス・アヴェニューの子会社化と事業の吸収分割による承継（2018年）、株式会社ファンステージ・株式会社クラフトリッジの子会社化と事業承継（2019年）、株式会社ライフテクノロジーの吸収合併（2019年）、Salesforce関連の受賞（2020年・2021年）、株式会社アップオンデマンドの子会社化と事業承継（2021年・2022年）、株式会社コンティニューの子会社化と事業承継（2023年）、Dataiku・クアルトリクス・Dotdigital・Gainsightとのパートナー契約とERP Cloud 360コンソーシアムへの参画（2023年～2025年）は、個別の提携・受賞・承継として列挙にとどめ、独立した沿革項目にはしていません。
- industry: DEIの別記事業は「cte」ですが、事業の実体に合わせて分類しました（このツリーのゲートに合わせ industryId キーで記録）。
- industry: it を主としました。デジタルトランスフォーメーション事業（システムソリューションとクラウドインテグレーション）が外部売上高の91.1％を占めるためです。直接の適合であり暫定分類ではないため、taxonomyGaps には記録していません。
- industry: entertainment は付けませんでした。プラットフォーム事業は占いアプリの運営ですが、外部売上高は396百万円で全体の8.9％にとどまり、主たる事業ではないためです。
- industry: human-resources は付けませんでした。人材はシステムソリューションの顧客の業種の一つとして挙がっているにすぎず、人材サービス事業として独立した開示はないためです。
- relatedCompanies: base-4481：「データベース」の部分文字列の一致のみで、ベース株式会社についての取引・提携・資本関係の記載はないため結びませんでした。
- relatedCompanies: core：「コアバリュー」の部分一致（ambiguous）のみで、株式会社コアについての記載はないため結びませんでした。
- relatedCompanies: innovation：ミッション文中の一般語「イノベーション」の一致のみで、株式会社イノベーションについての記載はないため結びませんでした。
- relatedCompanies: career：「キャリア開発」という一般語の一致のみで、株式会社キャリアについての記載はないため結びませんでした。
- relatedCompanies: en：「エンジニア」等の部分文字列の一致（ambiguous）のみで、エン株式会社についての記載はないため結びませんでした。
- relatedCompanies: nissin：新株予約権の条文中の一致（ambiguous）のみで、コードリストにもない相手のため結びませんでした。
- relatedCompanies: port：「サポート」の部分文字列の一致のみで、ポート株式会社についての記載はないため結びませんでした。
- relatedCompanies: seki：「セキュリティ」の部分文字列の一致（ambiguous）のみで、セキ株式会社についての記載はないため結びませんでした。
- relatedCompanies: garden：本社所在地の建物名「恵比寿ガーデンプレイスタワー」の一部の一致のみで、株式会社ガーデンについての記載はないため結びませんでした。
- relatedCompanies: japan-post-holdings：Salesforce製品の利用企業の例示として日本郵政グループの名が挙がっているだけで、当社との取引・提携・資本関係の記載はないため結びませんでした。
- relatedCompanies: toyota：Salesforce製品の利用企業の例示としてトヨタ自動車の名が挙がっているだけで、当社との取引・提携・資本関係の記載はないため結びませんでした。
- relatedCompanies: matsui-securities：【大株主の状況】に証券会社として発行済株式の0.5％を保有する株主として載っているだけで、純投資の保有であり事業会社としての取引・提携の記載はないため結びませんでした。
- relatedCompanies: ray：部分文字列の一致（ambiguous）のみで、株式会社レイについての記載はないため結びませんでした。
- relatedCompanies: suzuki-6785：【大株主の状況】の個人株主「鈴木昭久」の氏名との一致（ambiguous）のみで、株式会社鈴木についての記載はないため結びませんでした。
- relatedCompanies: will：「コンピューターウィルス」の部分文字列の一致のみで、株式会社ウィルについての記載はないため結びませんでした。
- relatedCompanies: 自社の連結子会社（株式会社G clef、株式会社インタームーブ、Coznet合同会社、SHARING INNOVATIONS VIETNAM CO.,LTD.）は関連企業としては結びません。【大株主の状況】の事業会社は親会社の株式会社Orchestra Holdingsのみで、他は証券会社と個人です。【株式の保有状況】は投資株式を保有していない旨の印字で、政策保有株式はありません。
- terms: 用語の提案（助言のみ）：「クラウドインテグレーション」（クラウドサービスの導入を支援するサービス）、「ウラーラ」（同社グループが運営するチャット占いアプリの名称）、「準委任契約」（成果物の完成ではなく業務の遂行自体に対価が支払われる契約形態）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
