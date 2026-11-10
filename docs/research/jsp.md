# ジェイエスピー — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジェイエスピー |
| 証券コード | 7942 |
| docID（データを取り出した文書） | `S100YEL0` |
| 原本 docID | `S100YEL0` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEL0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジェイエスピー / 7942 / docID S100YEL0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 26 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jsp: 10 件の数値を有報XBRLと照合
有報: 株式会社ジェイエスピー 有価証券報告書－第68期(2025/04/01－2026/03/31) (docID S100YEL0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
jsp: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社ジェイエスピー（商号　株式会社JSP）」が EDINET の提出者名「株式会社ジェイエスピー」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報と重複する全行が一致し、決算期の変更や変則決算もないため、financialNotesは空にしました。
- businessModel: 中期経営計画の定量目標のうち売上高（2027年3月期に160,000百万円）は本文に書ける数値のためstrategyに記載しましたが、営業利益や営業利益率の目標は本文に書けない利益の指標のため記載せず、判断をここに記録します。長期ビジョン『VISION2027』の2027年度の定量的ビジョン（売上高180,000百万円等）も同様に記載していません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」で、提出後の文書もないため、needsReviewはありません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期：ビーズ事業95,905百万円、押出事業49,550百万円）の大きい順です。報告セグメントはこの2つだけです。
- businessStructure: childrenは【事業の内容】とMD&Aの製品区分（高機能材製品・発泡性ビーズ製品／生活資材製品・産業資材製品・建築土木資材製品）によります。区分ごとの金額は独立して開示されていないため、金額は書いていません。
- businessStructure: グループは当社と国内子会社11社、海外子会社27社、関連会社4社及びその他の関係会社1社で構成されます（2026年3月31日現在）。子会社・関連会社は非上場のため関連企業には含めず、事業構造側にだけ書きました。
- businessStructure: 事業区分はセグメントと同一の区分です（【事業の内容】の記載どおり）。
- history: 沿革表の2016年2月と2019年8月の行は、年月セルが2つ続けて印字され事象文と分かれている崩れた表でした。年月の数（2件）と事象の数（2件）が一致し、事象文中の稼働開始日（2月1日・8月1日）もそれぞれの月と一致するため、行順に対応づけて記載しました。
- history: Wikipediaの冒頭は三菱瓦斯化学を持分法適用関連会社と説明していますが、有報では2026年3月31日現在で「その他の関係会社」とされており、有報の記載を優先しました。Wikipediaの補足は使っていません。
- industry: 主たる業界は、発泡プラスチック製品の製造販売が事業の中心であるため chemicals（化学）としました。閉じた分類に合う値があるため、taxonomyGapsはありません。
- industry: 発泡プラスチックはプラスチック製品の製造であり、自動車部品など用途先の業界（automotive等）は付けていません。売上は報告セグメント単位で製品別に開示されており、用途別の業界付けはしませんでした。
- relatedCompanies: 三菱瓦斯化学（mitsubishi-gas-chemical）: 【関係会社の状況】で「その他の関係会社」と区分され、原材料仕入等の取引が印字されているため other-affiliated-company として結びました。議決権の被所有割合は47.74％（2026年3月31日現在、間接所有0.30％を含む）です。
- relatedCompanies: ダイナパック（dynapac）: 特定投資株式の表に載るだけで、保有目的は取引関係の維持・強化という定型句のみで、同社との取引を本文が述べていないため結びませんでした。
- relatedCompanies: クミアイ化学工業（kumiai-chemical-industry）: 特定投資株式の表に載るだけで、保有目的は定型句のみのため結びませんでした。
- relatedCompanies: 日本電気硝子（nippon-electric-glass）: 特定投資株式の表に載るだけで、保有目的は定型句のみのため結びませんでした。
- relatedCompanies: 住友林業（sumitomo-forestry）: 保有株式の表に載るだけで、保有目的は取引関係の維持という定型句のみのため結びませんでした。
- relatedCompanies: ヤマエグループホールディングス（yamae-group-holdings）: 特定投資株式の表に載るだけで、保有目的は定型句のみのため結びませんでした。
- relatedCompanies: 伊藤忠商事（itochu）: 有報に出るのは子会社JSP Advanced Materials (Wuxi) Co.,LTD.への共同出資者である伊藤忠商事（香港）有限公司で、同社自身ではなく、同社との取引・提携の記載もないため結びませんでした。
- relatedCompanies: 日本瓦斯（nippon-gas）: 沿革に出る「日本瓦斯化学工業株式会社」は三菱瓦斯化学の旧称であり、日本瓦斯株式会社（8174）とは別の会社のため結びませんでした。
- relatedCompanies: キャリア（career）・パス（path）: 「キャリアパス」など人事制度の一般語で、両社への言及ではありません。
- relatedCompanies: エン（en）: 「成長エンジン」などの一般語で、エン株式会社への言及ではありません。
- relatedCompanies: ビジョン（vision）: 長期ビジョン『VISION2027』などの一般語で、株式会社ビジョンへの言及ではありません。
- relatedCompanies: セキ（seki）: 「情報セキュリティ」の部分一致で、セキ株式会社への言及ではありません。
- relatedCompanies: ステップ（step）: 収益認識の「5ステップアプローチ」の一般語で、株式会社ステップへの言及ではありません。
- relatedCompanies: ポート（port）: 「ポートフォリオ」の部分一致で、ポート株式会社への言及ではありません。
- relatedCompanies: ベース（base-4481）: 「ビーズ発泡技術をベースに」という一般語で、ベース株式会社への言及ではありません。
- relatedCompanies: コア（core）: 「押出発泡技術をコアとして」という一般語で、株式会社コアへの言及ではありません。
- relatedCompanies: レイ（ray）: 「ディスプレイ」の部分一致で、株式会社レイへの言及ではありません。
- relatedCompanies: ゼロ（zero）: 「実質ゼロGHG排出量」などの目標の表現で、株式会社ゼロへの言及ではありません。
- relatedCompanies: コロナ（corona）: リスク情報の「新型コロナウイルス」という感染症の名称で、株式会社コロナへの言及ではありません。
- relatedCompanies: イノベーション（innovation）: 「イノベーションの創出」という一般語で、株式会社イノベーションへの言及ではありません。
- relatedCompanies: ランド（land）: 「ブランド」の部分一致で、株式会社ランドへの言及ではありません。
- relatedCompanies: レック（lec）: 「フレックスタイム」の部分一致で、レック株式会社への言及ではありません。
- relatedCompanies: リックス（rix）: 「スキルマトリックス」の部分一致で、リックス株式会社への言及ではありません。
- relatedCompanies: トラスト（trust）: 大株主の日本マスタートラスト信託銀行（信託口）の名称の一部であり、候補自体も上場会社ではないため結びませんでした。信託口は純投資でもあります。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）5.63％は信託の純投資のため結びませんでした。
- relatedCompanies: 連結子会社（株式会社JSPパッケージング等）と持分法適用関連会社（山陰化成工業株式会社等）は、いずれも非上場のため関連企業には含めていません。
- terms: 用語候補： ARPRO（発泡ポリプロピレンビーズとその成型品の製品ブランドで、同社の主力製品です)、スチロダイア（発泡性ポリスチレンの製品ブランド)、ミラフォーム（発泡ポリスチレンボードの製品ブランドで、建築・住宅の断熱材などに使われます)、ミラマット（発泡ポリエチレンシートの製品ブランド)、スチレンペーパー（発泡ポリスチレンシートの製品ブランドで、食品容器に使われます)、発泡ビーズ（樹脂をビーズ状に発泡させた素材で、成型品の原料になります)——いずれも有報の本文で同社が繰り返し使う語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
