# ビジョナル — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ビジョナル株式会社 |
| 証券コード | 4194 |
| docID（データを取り出した文書） | `S100Z8ZJ` |
| 原本 docID | `S100Z8ZJ` |
| 提出日（原本） | 2026-10-21 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z8ZJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ビジョナル株式会社 / 4194 / docID S100Z8ZJ（S100WW0V から新しい有報に更新。旧成果物は pipeline/analysis/superseded/visional-S100WW0V/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z8ZJ） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
visional: 10 件の数値を有報XBRLと照合
有報: ビジョナル株式会社 有価証券報告書－第7期(2025/08/01－2026/07/31) (docID S100Z8ZJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
visional: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: identity: universe の docID S100WW0V（第6期、2025年10月提出）は古く、パイプラインの identity 工程が新しい有報（第7期、docID S100Z8ZJ、2026年10月21日提出、決算期2026年7月31日）を採用したため、登録は第7期有報に基づく。staleness hold や後発文書の保留は発生しなかった（otherFilingsInWindow は空）。
- businessModel: 証拠パックの注意（財務諸表の組替えの記載がある）について、抽出テキスト内に組替え・表示方法の変更の注記文は確認できず、前期有報との修正再表示チェックも全行一致したため、financialNotes には経営指標等の注記に印字された暫定的な会計処理の確定のみを記載した。
- businessModel: Thinkings株式会社の子会社化（2025年10月1日）は当期中の出来事で期末の構成に反映済みのため、needsReview ではなく沿革と事業の記載に含めた。
- businessModel: セグメント利益・事業別の営業損益の金額と増減率は、規則により本文に書かなかった。
- businessStructure: セグメント別の外部顧客への売上高はセグメント注記の値を用いた。HR Techの内訳（BizReach事業・HRMOS事業・その他）はセグメント注記に印字された収益の分解情報の値を用いた。
- businessStructure: Incubationのサービス別売上高は印字されていないため、各サービスの金額は書かず、セグメント合計のみを記載した。
- businessStructure: セグメント注記の外部顧客への売上高の単純合計（93,807＋5,488＝99,295百万円）と連結売上高99,300百万円との差は、有報の調整額・丸めによるもので、印字どおりとした。
- history: 沿革は有報の記載どおり、子会社である株式会社ビズリーチの沿革と併せて記載されているものを用いた。
- history: 2007年の株式会社ビズリーチ設立の行に印字された資本金の金額は、規則により記載しなかった。
- history: オフィス開設・移転などの軽微な行は省いた。
- industry: 売上高の9割超を占めるHR Techセグメント（転職プラットフォーム・人材活用サービス）が主たる事業であるため human-resources を主たる業界とした。『HRMOS』シリーズのSaaS提供とIncubationのDXプラットフォーム群は情報サービスとしての性格も持つため、it を2つ目に付けた。
- relatedCompanies: rent（レント）: 「タレント」等の一般語句の部分一致であり、株式会社レントへの言及はないため結ばなかった。
- relatedCompanies: succeed（サクシード）: 『M&Aサクシード』は自社グループのサービス名であり、運営する株式会社M&Aサクシードは連結子会社（グループ会社）のため、株式会社サクシードとは結ばなかった。
- relatedCompanies: seki（セキ）: 「セキュリティ」等の語句の部分一致（ambiguous）であり、セキ株式会社への言及はないため結ばなかった。
- relatedCompanies: career（キャリア）: 「キャリア」は一般名詞として使われているのみで、株式会社キャリアへの言及はないため結ばなかった。
- relatedCompanies: nissin（日新）: EDINETコードリストになく、印字も一般語句の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: port（ポート）: 「プラットフォーム」等の語句の部分一致であり、ポート株式会社への言及はないため結ばなかった。
- relatedCompanies: en（エン）: 「エンジン」等の語句の部分一致（ambiguous）であり、株式会社エンへの言及はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 一般語句の部分一致であり、株式会社ベースへの言及はないため結ばなかった。
- relatedCompanies: land（ランド）: 一般語句の部分一致であり、株式会社ランドへの言及はないため結ばなかった。
- relatedCompanies: path（パス）: 一般語句の部分一致（ambiguous）であり、株式会社パスへの言及はないため結ばなかった。
- relatedCompanies: lec（レック）: 一般語句の部分一致であり、株式会社レックへの言及はないため結ばなかった。
- relatedCompanies: kddi（KDDI）: 2015年の株式会社ルクサの株式売却の相手方として沿革に記載された過去の取引のみで、現在の取引・提携関係の印字がないため結ばなかった。
- relatedCompanies: core（コア）: 一般語句の部分一致（ambiguous）であり、株式会社コアへの言及はないため結ばなかった。
- relatedCompanies: corona（コロナ）: 一般語句の部分一致であり、株式会社コロナへの言及はないため結ばなかった。
- relatedCompanies: freee（フリー）: 「フリー」は一般語句の部分一致であり、フリー株式会社への言及はないため結ばなかった。
- relatedCompanies: king（キング）: 一般語句の部分一致であり、キング株式会社への言及はないため結ばなかった。
- relatedCompanies: the-lead（リード）: 一般語句の部分一致であり、株式会社リードへの言及はないため結ばなかった。
- relatedCompanies: trust（トラスト）: EDINETコードリストになく、対象外のため結ばなかった。
- relatedCompanies: friendly（フレンドリー）: EDINETコードリストになく、一般語句の部分一致のため結ばなかった。
- relatedCompanies: 連結子会社13社と株式会社スタンバイを含む関連会社6社はグループ会社のため関連企業としては結ばなかった（株式会社スタンバイは事業の内容と沿革に記載）。
- terms: 助言: 用語「ダイレクトリクルーティング」は、企業が人材紹介会社に任せるのではなく、人材採用プラットフォームを通じて求職者へ直接アプローチし主体的に採用する活動を指す当社グループの造語（商標登録番号：第6002236号）。
- terms: 助言: 用語「HRMOS（ハーモス）」は、採用管理・タレントマネジメント・勤怠・経費・労務・給与の各システムからなる人財活用プラットフォームのシリーズ名。
- terms: 助言: 用語「ARR」は Annual Recurring Revenue の略で、各四半期末の月末の月額継続課金額（MRR）を12倍して算出する指標。
- terms: 助言: 用語「プラチナスカウト」は、『BizReach』で面談・面接が確約される特別なスカウトメールの仕組み。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
