# クラシル — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | クラシル株式会社 |
| 証券コード | 299A |
| docID（データを取り出した文書） | `S100YH46` |
| 原本 docID | `S100YH46` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH46.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | クラシル株式会社 / 299A / docID S100YH46（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kurashiru: 2 件の数値を有報XBRLと照合
有報: クラシル株式会社 有価証券報告書－第13期(2025/04/01－2026/03/31) (docID S100YH46)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kurashiru: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「クラシル株式会社（旧会社名　dely株式会社）」が EDINET の提出者名「クラシル株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（例：売上高17,001,320千円→17,001百万円）。切り上げはしていない。
- businessModel: 第13期が連結初年度のため、前期との比較増減率は印字がなく記載していない。
- businessModel: パックの「財務諸表の組替え」注意について、本文の各節を確認したが組替え・修正再表示の注記は見つからなかった。経営指標等の注記１は連結財務諸表の作成開始（第13期より）の説明のみで、これを financialNotes に記録した。
- businessModel: 地域ごとの売上高（日本11,120百万円、シンガポール4,741百万円、その他1,138百万円）は本文には書かず、ここに記録する。
- businessModel: 主要な顧客ごとの金額（Google Asia Pacific Pte.Ltd. 2,404百万円、TIKTOK PTE.LTD. 1,929百万円）は本文には割合のみを書き、金額はここに記録する。両社とも非上場の外国法人で候補リストに無いため関連企業には結んでいない。
- businessModel: MD&Aに印字された売上総利益・経常利益・Non-GAAP営業利益の金額は、本文に書ける数値の範囲外のため記載していない。
- businessStructure: 商号変更（2025年10月１日、dely株式会社からクラシル株式会社へ）は当期中に完了し期末体制に反映されているため、沿革と本項目の前提にのみ記録し、needsReviewには入れていない。
- businessStructure: 親会社は【関係会社の状況】にソフトバンクグループ株式会社、ソフトバンクグループジャパン株式会社、ソフトバンク株式会社、Ａホールディングス株式会社、LINEヤフー株式会社の５社が印字されている。このうち関連企業として結んだのは候補リストにあるLINEヤフー株式会社とソフトバンクグループ株式会社のみで、残り３社は related-candidates.json に無い（Ａホールディングス株式会社は非上場）ため結んでいない。
- businessStructure: 連結子会社はATF株式会社（議決権所有割合100％）の１社のみで、自社グループの子会社のため関連企業には結んでいない。
- businessStructure: suppliers はこのツリーのスキーマに無いため省略した。個別の仕入先への依存の印字はない。
- history: 沿革から省いた行：2015年３月キュレーションメディア事業の開始（2016年のリニューアル行に統合）、2016年７月・2020年11月の本社移転、2018年７月の株式会社スタートアウツの完全子会社化（2019年１月に清算済み）、2019年７月の株式会社Basecampの完全子会社化（2021年３月に清算済み）、2023年11月の人材プラットフォーム事業「クラシルジョブ」の開始（現在の【事業の内容】に記載がなく、単独の事業として扱わなかった）。
- history: 沿革の行には資本金の額を書いていない。
- industry: 主たる業界は、単一セグメントのプラットフォーム事業のうち販売実績が最大のメディア領域（広告・課金を中心とするメディアサービス）に基づき media とした。購買領域・その他領域は同一セグメント内の領域区分で、独立した金額開示のある別セグメントではないため業界は足していない。
- relatedCompanies: vision：企業ビジョンの文中の「ビジョン」という一般語への一致で、株式会社ビジョンへの言及ではない。
- relatedCompanies: nissin：コードリストに無く、新株予約権等の文中の部分一致で、株式会社日新への言及ではない。
- relatedCompanies: en：従業員のエンゲージメント等の一般語への部分一致で、エン株式会社への言及ではない（ambiguous）。
- relatedCompanies: seki：情報セキュリティ等の一般語への部分一致で、セキ株式会社への言及ではない（ambiguous）。
- relatedCompanies: cota：コタエル信託（時価発行新株予約権信託の受託者）への部分一致で、コタ株式会社への言及ではない（ambiguous）。
- relatedCompanies: port：サポート等の一般語への部分一致で、ポート株式会社への言及ではない。
- relatedCompanies: land：ブランド等の一般語への部分一致で、株式会社ランドへの言及ではない。
- relatedCompanies: cover：クライアントを「カバー」するという一般語への一致で、カバー株式会社への言及ではない。
- relatedCompanies: rent：タレント等の一般語への部分一致で、株式会社レントへの言及ではない。
- relatedCompanies: base-4481：ユーザーベース等の一般語への一致で、ベース株式会社への言及ではない。
- relatedCompanies: king：マーケティング等の一般語への部分一致で、株式会社キングへの言及ではない。
- relatedCompanies: suzuki-6785：大株主の個人「鈴木祐人」への一致で、株式会社鈴木への言及ではない（ambiguous）。
- relatedCompanies: tein：エンターテインメント等の一般語への部分一致で、株式会社テインへの言及ではない。
- relatedCompanies: japan-exchange-group：日本取引所グループの業種別分類への言及のみで、取引・提携・資本関係の記載はない。
- relatedCompanies: macromill：コードリストに無く、調査委託先としての１回限りの言及のみで、関係性として結ぶ根拠が足りない。
- relatedCompanies: ray：レイヤーズ・コンサルティングへの部分一致で、株式会社レイへの言及ではない（ambiguous）。
- relatedCompanies: rhythm：リスクの記載中の一般語への一致で、リズム株式会社への言及ではない。
- relatedCompanies: trust：コードリストに無く、日本マスタートラスト信託銀行株式会社（信託口）の信託口への一致で、信託口は結ばない。
- relatedCompanies: will：コンピューターウィルス等の一般語への部分一致で、株式会社ウィルへの言及ではない。
- relatedCompanies: ソフトバンク株式会社・ソフトバンクグループジャパン株式会社・Ａホールディングス株式会社も【関係会社の状況】に親会社として印字されているが、候補リストに無いため結んでいない（事実は businessStructure の warnings にも記録）。
- terms: 助言のみの工程。用語の追加提案は無い。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、2026年５月26日開催の取締役会において、クリエイターマネジメント事業を新設会社へ承継させる新設分割（効力発生日2026年８月１日予定）と、新設会社及び連結子会社であるATF株式会社による共同株式移転（効力発生日2026年８月31日予定）により中間持株会社ALホールディングス株式会社（仮称）を設立する組織再編を決議した旨が印字されています。本登録は2026年３月31日現在の体制に基づきます。
- businessStructure: 重要な後発事象として、2026年５月26日開催の取締役会において、クリエイターマネジメント事業を新設会社へ承継させる新設分割（効力発生日2026年８月１日予定）と、新設会社及び連結子会社であるATF株式会社による共同株式移転（効力発生日2026年８月31日予定）により中間持株会社ALホールディングス株式会社（仮称）を設立する組織再編を決議した旨が印字されています。本登録は2026年３月31日現在の体制に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
