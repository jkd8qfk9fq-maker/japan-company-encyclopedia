# ココペリ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ココペリ |
| 証券コード | 4167 |
| docID（データを取り出した文書） | `S100YKE7` |
| 原本 docID | `S100YKE7` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKE7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ココペリ / 4167 / docID S100YKE7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kokopelli: 8 件の数値を有報XBRLと照合
有報: 株式会社ココペリ 有価証券報告書－第19期(2025/04/01－2026/03/31) (docID S100YKE7)
前期有報との比較: 18 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
すべて一致しました。
kokopelli: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記２（従業員数の数え方）、注記３・４（潜在株式調整後指標や比率を記載しない理由）は表示方法の事項のため warnings のみとし、financialNotes には連結財務諸表の作成開始（注記１）だけを記録しました。
- businessModel: 注記５・６は第19期の損失の理由に関するもので、段階利益の理由や金額には触れない方針のため本文・financialNotes には書いていません。売上高の減少理由だけを、経営成績の分析の印字に基づいて flow の revenue に書きました。
- businessModel: 前期有報との修正再表示照合は６系列すべて差異ゼロでした（訂正なし）。
- businessModel: 期間後の2026年６月24日の取締役会で決議されたストック・オプションとしての新株予約権の発行は資本政策の手続きのため、warnings のみとし、needsReview には入れていません。
- businessModel: 経営成績の分析にある営業損失・経常損失・キャッシュ・フロー等の金額と理由、設備の帳簿価額は書いていません。
- businessStructure: 単一セグメント（ビジネスプラットフォーム事業）のため、セグメント別の金額はありません。【関連情報】の製品及びサービスごとの情報も、単一の製品・サービスの区分が売上高の90％を超えるため省略されており、サービス別の金額は開示されていません。そのため children には金額を書かず、その旨を各説明に明記しました。
- businessStructure: SIAM KOKOPELLI Co., Ltd.は2025年12月に合弁で設立された持分法適用関連会社で、期間中の出来事のため、2026年３月31日現在のグループ構成（連結子会社２社・関連会社１社）で登録しています。
- businessStructure: 設備は本社（東京都千代田区）等が単一セグメントに属するため特定のサービスには結びつけず、事業全体のものとしました。帳簿価額は書いていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマに無いため省略しました。【事業の内容】に個別の仕入先名の記載はありません。
- businessStructure: 【関係会社の状況】の注記にあるキー・ポイント株式会社の主要な損益情報等（個別の売上高など）は子会社単体の数値であり、本文には書いていません。
- history: 設立時の資本金の金額は沿革に印字されていますが、資本金の金額は書かない規則のため省略しました。
- history: 本社移転（2008年渋谷区、2010年港区、2014年千代田区麹町、2022年紀尾井町）、2016年のAI企業評価アルゴリズム「FAI」の開発（2019年の項目で言及）、2025年５月の「BMポータル」のリリースは、history には入れず省略しました（「BMポータル」は businessStructure に記載しています）。
- history: 沿革の年月と事象は表の行順が対応しており、そのまま行順で対応づけました。
- industry: DEIの別記事業は「cte」ですが、事業の実体は中小企業向け経営支援プラットフォーム等のSaaS提供であり、it を正としました。it は直接の適合であり暫定分類ではないため、taxonomyGaps には記録していません（このツリーのゲートに合わせ industryId キーで記録しています）。
- industry: finance は付けていません。地域金融機関を顧客・提携先としてプラットフォームを提供する事業であり、金融機関そのものではないためです。
- industry: human-resources は付けていません。福利厚生クーポンサイト「FUKURI」は「Big Advance」の一機能であり、独立した金額が開示される人材・福利厚生事業ではないためです。
- relatedCompanies: port： 「ビジネスプラットフォーム」の部分文字列の一致のみで、ポート株式会社についての取引・提携・資本関係の記載はないため結びませんでした。
- relatedCompanies: seki： 「セキュリティ」の部分文字列の一致（ambiguous）のみで、セキ株式会社についての記載はないため結びませんでした。
- relatedCompanies: nissin： 現在のコードリストにない上、新株予約権の条件文中の部分文字列の一致（ambiguous）のみで、株式会社日新についての記載はないため結びませんでした。
- relatedCompanies: vision： 「ミッション・ビジョン」という一般語の一致のみで、株式会社ビジョンについての記載はないため結びませんでした。
- relatedCompanies: career： 「キャリアパス」という一般語の一致のみで、株式会社キャリアについての記載はないため結びませんでした。
- relatedCompanies: en： 「エンジニア」の部分文字列の一致（ambiguous）のみで、エン株式会社についての記載はないため結びませんでした。
- relatedCompanies: rhythm： 「アルゴリズム」の部分文字列の一致のみで、リズム株式会社についての記載はないため結びませんでした。
- relatedCompanies: path： 「キャリアパス」の部分文字列の一致（ambiguous）のみで、パス株式会社についての記載はないため結びませんでした。
- relatedCompanies: core： 自社サービス名「CoreBAE（コアベイ）」の部分文字列の一致（ambiguous）のみで、株式会社コアについての記載はないため結びませんでした。
- relatedCompanies: lec： 「フレックス」の部分文字列の一致のみで、レック株式会社についての記載はないため結びませんでした。
- relatedCompanies: transaction： 収益構造を説明する一般語「トランザクション」の一致のみで、株式会社トランザクションについての記載はないため結びませんでした。
- relatedCompanies: 候補にない相手： 日本ユニシス株式会社は2019年に業務提携契約を締結し「CoreBAE」を共同でリリースしていますが、候補一覧にないため結んでいません（history には出来事として記載）。ＴＩＳ株式会社は【大株主の状況】に載る事業会社（2026年３月31日現在2.5％）ですが、候補一覧にないため結んでいません。リロクラブとは福利厚生クーポンサイト「FUKURI」の利用クーポン拡充で業務提携が戦略に印字されていますが、候補一覧にないため結んでいません。
- relatedCompanies: 自社の連結子会社（株式会社ココペリ経営サポート、キー・ポイント株式会社）と持分法適用関連会社（SIAM KOKOPELLI Co., Ltd.）は関連企業としては結びません。【株式の保有状況】は「該当事項はありません」で、政策保有株式はありません。
- terms: 用語の提案（助言のみ）：「Big Advance」（地域金融機関と連携し、その取引先の中小企業に経営支援機能を提供するプラットフォーム）、「レベニューシェア」（提携先が顧客から受領する利用料等の一定割合を受け取る収益方式）、「チャーンレート（解約率）」（当月解約企業数を前月末有料会員企業数で割って算出する指標）、「AIエージェント」（複数のAI技術を組み合わせ、自律的な意思決定や行動を支援するシステム）、「FUKURI」（会員企業の従業員向け福利厚生クーポンサイト）、「DX Solutions」（金融機関や中小企業のデジタル化を支援するサービス群）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
