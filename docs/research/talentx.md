# TalentX — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＴａｌｅｎｔＸ |
| 証券コード | 330A |
| docID（データを取り出した文書） | `S100YGDN` |
| 原本 docID | `S100YGDN` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGDN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＴａｌｅｎｔＸ / 330A / docID S100YGDN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
talentx: 2 件の数値を有報XBRLと照合
有報: 株式会社ＴａｌｅｎｔＸ 有価証券報告書－第8期(2025/04/01－2026/03/31) (docID S100YGDN)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
talentx: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社TalentX」が EDINET の提出者名「株式会社ＴａｌｅｎｔＸ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 当期の有報は訂正されていません（summary.json: amendments status none、DEIの訂正フラグすべてfalse、checkedThrough 2026-11-12）。
- businessModel: 修正再表示チェックは、前期（第7期）が単独決算で連結指標の重複行がないため突合行数が0件でした。連結財務諸表の作成は第8期から開始しており、主要な経営指標等の注記にも組替えや修正再表示の記載は確認できないため、warningsのみの扱いとし、financialNotesには連結開始の注記（注記1）を2026年3月期として記録しました。数値の差し替えは行っていません。
- businessModel: MD&Aの営業利益・経常利益・売上総利益の金額とその分析、キャッシュ・フローの金額、経営指標として開示されたARR・ARPA・売上高総利益率・調整後営業利益率などの投資・利益指標は、本文の数値を売上高と当期純利益に限る規則および投資指標を書かない規則により記載していません。
- businessModel: 2026年5月21日の取締役会で決議され、2026年6月24日の定時株主総会で承認された資本金の額の減少は、提出後の資本政策事項のため、重要な後発事象として本文には書かず、ここに記録します。
- businessModel: 前期は単独決算のため、売上高と純利益に前期比較の増減率は印字されておらず、記載していません。
- businessModel: perspectivesのindustryPositionは、市場規模の数値が外部調査の引用に基づくため、省略しました。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため付けていません。個別の仕入先名は有報に印字されていません。
- businessStructure: 当社グループは「採用マーケティング事業」の単一セグメントです。セグメント注記では製品及びサービスごとの情報も単一区分が売上高の90％を超えるため省略されており、各モジュール・サービスの独立した金額の開示はありません。そのため金額は事業全体の売上高のみを記載しました。
- businessStructure: 【事業の内容】では事業名が「AI採用プラットフォーム事業」の単一セグメントとも印字されていますが、セグメント注記・販売実績の事業名である「採用マーケティング事業」を事業名として採用しました。
- businessStructure: 設備はすべて単一セグメントに属します。本社（東京都新宿区、従業員137人）と株式会社Crepeの本社（東京都千代田区、従業員3人）が印字されていますが、事業が単一のため個別の事業には結びつけていません。帳簿価額は書いていません。
- businessStructure: 連結子会社は株式会社Crepe1社（議決権の所有割合100％）です。2025年10月に全株式を取得しました。
- businessStructure: Wikipediaの記事は見つかりませんでした（wikipedia.json: found=false）。補足には使っていません。
- history: 沿革に印字された第三者割当増資（2018年8月、2021年2月）は資本金額を含む資本政策事項のため、沿革には入れていません。
- history: 本社移転（2018年9月、2021年8月）、プライバシーマーク認証の取得（2018年12月）、リファラル採用研究所の設立（2021年9月）、AI X Lab.の設立（2024年7月）、個別機能のリリース（MyRefer Alumni、Hotフラグ機能、AI OCR機能、社内広報オートメーション機能、オートメーション機能、AI求人マッチング機能、MyReferとMyBrandの連携機能）は、転機となる出来事に絞るため沿革に入れず、ここに列挙します。
- history: 沿革の年月と事象は表の行順が対応しており、崩れた表ではないため、そのまま行順で対応づけました。
- industry: 単一セグメント「採用マーケティング事業」の実体は、企業の採用活動を支援する人材サービスをソフトウェアで提供するものであるため、主たる業界を human-resources とし、SaaSプラットフォームの提供であることから it を2つ目に付けました。閉じた分類で言い表せるため、taxonomyGaps はありません。
- relatedCompanies: rent（株式会社レント）: 「タレント」の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: career（株式会社キャリア）: 「パーソルキャリア株式会社」（別法人）や一般語「キャリア」への言及のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: suzuki-6785（株式会社鈴木）: ambiguous。代表取締役社長である鈴木貴史の人名であり、同社への言及ではないため結びませんでした。
- relatedCompanies: base-4481（ベース株式会社）: 「データベース」等の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」という一般語のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: path（パス株式会社）: ambiguous。「パーパス」等の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: seki（セキ株式会社）: ambiguous。「セキュリティ」の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: land（株式会社ランド）: 「ブランド」の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: port（ポート株式会社）: 「サポート」の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: en（エン株式会社）: ambiguous。「エンゲージメント」の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: core（株式会社コア）: ambiguous。自社のAI基盤の名称「AI Core」等の用語であり、同社への言及ではないため結びませんでした。
- relatedCompanies: freee（フリー株式会社）: 「フリーランス」の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: ray（株式会社レイ）: ambiguous。「レイヤー」の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: persol-holdings（パーソルホールディングス株式会社）: 沿革に2018年8月の第三者割当増資の割当先として1回だけ印字されていますが、過去の資本調達であり、現在の取引・資本関係の印字はありません。MBOの相手方は同社の子会社であるパーソルキャリア株式会社（別法人）のため、結びませんでした。
- relatedCompanies: technologies（株式会社テクノロジーズ）: 図表の出典である「みずほリサーチ＆テクノロジーズ株式会社」（別法人）の部分一致のみで、同社への言及ではないため結びませんでした。
- relatedCompanies: 【大株主の状況】（2026年3月31日現在）の事業会社は株式会社SBI証券・楽天証券株式会社などの証券会社（純投資）で、関連企業として結ぶ相手はありませんでした。【株式の保有状況】に結ぶべき政策保有の相手もありませんでした。
- terms: 用語の助言のみです。対象となりうる用語は「リファラル採用」「タレントプール」「アルムナイ採用」「タレントアクイジション」ですが、本文では有報の注記に基づく平易な説明を事業説明の中に含めており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
