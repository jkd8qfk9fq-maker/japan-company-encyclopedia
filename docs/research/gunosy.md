# Gunosy — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｇｕｎｏｓｙ |
| 証券コード | 6047 |
| docID（データを取り出した文書） | `S100YYKZ` |
| 原本 docID | `S100YYKZ` |
| 提出日（原本） | 2026-08-25 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYKZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｇｕｎｏｓｙ / 6047 / docID S100YYKZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gunosy: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｇｕｎｏｓｙ 有価証券報告書－第14期(2025/06/01－2026/05/31) (docID S100YYKZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
gunosy: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Gunosy」が EDINET の提出者名「株式会社Ｇｕｎｏｓｙ」と違います
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…据え、メディア事業全体として安定的な利益創出が可能な事業体制の構築を進めると…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と当期純利益だけです。経営指標として印字された投資関連の指標や目標値は、投資指標の目標のため本文にも perspectives にも書いていません。
- businessModel: financialNotes は連結経営指標等の注記５（暫定的な会計処理の確定）だけを入れました。注記１から４は表示方法や算定方法の事項のため入れていません。
- businessModel: セグメントの売上高はセグメント注記の外部顧客への売上高を使い、MD&Aに印字されたセグメント間取引を含む金額は使っていません。
- businessModel: 期間後の資本準備金の額の減少（2026年7月15日取締役会決議、2026年10月16日効力発生予定）は資本政策の決議のため warnings のみの記録とし、needsReview には入れていません。配当の決議予定も同様です。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（メディア事業5,470百万円、Gホールディングス事業944百万円、新規事業26百万円）です。セグメント利益は書いていません。MD&Aに印字された新規事業の売上高30百万円はセグメント間取引を含む金額のため使っていません。
- businessStructure: 外部顧客への売上高の3事業の合計は6,440百万円となり、連結売上高6,441百万円と1百万円ずれます。印字の数値をそのまま書いています。
- businessStructure: 従来はメディア事業のみの単一セグメントでしたが、当連結会計年度よりメディア事業、Gホールディングス事業、新規事業の3セグメントに変更されています。前連結会計年度のセグメント情報は変更後の区分で作成されています。
- businessStructure: このツリーの旧スキーマに従い suppliers は省略しています。
- businessStructure: 連結子会社は7社です。株式会社ゲームエイト（メディア事業・新規事業、議決権100.0％）、株式会社digwell（新規事業、100.0％）、合同会社Gunosy Capital（その他、100.0％）、株式会社Gunosy Capital（その他、100.0％）、Gunosy投資事業組合（その他、100.0％）、株式会社S8Plus（新規事業、60.0％）、株式会社Gホールディングス（Gホールディングス事業、100.0％）です。
- businessStructure: 設備と事業の対応は有報のセグメント欄どおりです。提出会社の東京本社はメディア事業・新規事業・全社（共通）の連記行のためどの事業にも結びつけていません。株式会社Gホールディングスの東京本社はGホールディングス事業です。帳簿価額は書いていません。
- businessStructure: 上場市場は2026年5月に東京証券取引所プライム市場からスタンダード市場へ市場変更しています。表紙の印字どおりスタンダード市場で記録しています。
- history: 沿革は有報の【沿革】の印字どおりに年単位で記録し、月は書いていません。本社移転や清算・株式売却などの項目は、事業の転機となるものに絞って省いています。
- industry: DEIの別記事業は「cte」ですが、事業の実体に合わせて分類しました（このツリーのゲートに合わせ industryId キーで記録）。
- industry: media を主としました。メディア事業が2026年5月期の外部顧客への売上高の大部分（5,470百万円）を占め、ニュースキュレーションサービスやゲームメディアの運営が中核のためです。直接の適合であり暫定分類ではないため、taxonomyGaps には記録していません。
- industry: entertainment を2番目に付けました。Gホールディングス事業は報告セグメントとして独立した外部売上高（944百万円）が開示される、IPライセンスに基づくスマートフォンゲームのパブリッシング・運営の事業であるためです。
- industry: 新規事業（外部顧客への売上高26百万円）はアプリ外決済と開示業務支援クラウドの混在した小規模な区分のため、業界は付けていません。
- relatedCompanies: kddi（KDDI株式会社）: 大株主の状況に事業会社として載り、関連当事者情報にも主要株主（会社等）として営業上の取引が印字されるため major-shareholder として結びました。顧客としての関係と業務提携の事実も説明に含めています。売上高の金額は説明に書いていません。
- relatedCompanies: cyberagent（株式会社サイバーエージェント）: 沿革に2018年の合弁会社株式会社VIDPOOLの設立が印字されるだけです。同社は2021年に清算結了しており、現在の取引・提携の記述がないため結んでいません。
- relatedCompanies: port（ポート）・career（キャリア）・core（コア）・en（エン）・base-4481（ベース）・land（ランド）・ray（レイ）・rhythm（リズム）・freee（フリー）・king（キング）・path（パス）・seki（セキ）: 一般語や事業用語の一致（ポートフォリオ、キャリア採用、コアキャッシュ領域、検索エンジンなど）だけで、有報にその相手との取引・提携・資本関係の記述がないため結んでいません。core と en と ray と path と seki は ambiguous の候補でもあります。
- relatedCompanies: trust（トラスト）・nissin（日新）: 候補の listing がコードリストにない相手で、文脈も信託口の名称などの一致のため結んでいません。nissin は ambiguous の候補でもあります。
- relatedCompanies: kyocera（京セラ）・toyota（トヨタ自動車）: KDDI社の大株主として後発事象の相手先概要に印字されるだけの、KDDI社側の情報であり、当社との関係の記述がないため結んでいません。
- relatedCompanies: zero（ゼロ）: ambiguous の候補で、計上額をゼロとする算定の文脈の一致のため結んでいません。
- relatedCompanies: 候補一覧にないため結んでいない相手: Mediavine, Inc.（メディア事業の主要な顧客）、Google LLC（前期の主要な顧客）、ソニーペイメントサービス株式会社（株式会社S8Plusの合弁相手）。大株主の他の相手は個人と信託銀行（信託口）のみで、結べる事業会社はKDDI株式会社だけです。連結子会社7社は自社の子会社のため結んでいません。
- terms: 用語の助言のみです。対象となりうる用語は「情報キュレーション」「CPC課金型広告」「CPM課金型広告」「アドネットワーク」などですが、本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

- businessModel: KDDI株式会社との間で締結していた業務提携契約について、2026年７月15日開催の取締役会で解消を決議し、同日付で解消に関する基本合意の覚書を締結しています。「auサービスToday」に関する業務提携は2027年３月31日をもって解消する予定です。登録は2026年５月31日現在の事業構造で行っており、期間後の提携解消の反映には人の確認が必要です。
- businessStructure: KDDI株式会社との間で締結していた業務提携契約について、2026年７月15日開催の取締役会で解消を決議し、同日付で解消に関する基本合意の覚書を締結しています。「auサービスToday」に関する業務提携は2027年３月31日をもって解消する予定です。登録は2026年５月31日現在の事業構造で行っており、期間後の提携解消の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
