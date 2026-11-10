# ファルテック — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ファルテック |
| 証券コード | 7215 |
| docID（データを取り出した文書） | `S100YEJ6` |
| 原本 docID | `S100YEJ6` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEJ6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ファルテック / 7215 / docID S100YEJ6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
faltec: 10 件の数値を有報XBRLと照合
有報: 株式会社ファルテック 有価証券報告書－第22期(2025/04/01－2026/03/31) (docID S100YEJ6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
faltec: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年3月期に親会社株主に帰属する当期純損失となった理由として、経営者による分析は当社及び海外子会社の事業用資産に係る減損損失の計上を挙げています。減損損失の金額は本文に書かず、理由のみを記録しました。
- businessModel: 経営上の目標の達成状況を判断するための指標（収益性・財務安定性・効率性の各比率）は、比率のためperspectivesの本文には書きませんでした。
- businessModel: 重要な後発事象は連結・個別とも該当事項がなく、株式分割の記載もありません。前期有報との照合では5年間の主要な経営指標等の全行が一致し、変則決算・決算期変更もないため、financialNotesは空としました。
- businessModel: wikipedia.jsonは企業一覧の記事であり、当社の補足情報は得られなかったため使いませんでした。
- businessStructure: 報告セグメントは地域別（日本、アジア、北米他）の区分であり、事業別の区分ではありません。そのため並び順はセグメント注記の外部顧客への売上高の大きい順（日本59,233百万円、北米他7,461百万円、アジア6,507百万円）とし、各地域で取り扱う事業を【事業の内容】の表どおり子区分に記録しました。
- businessStructure: 【関連情報】の製品及びサービスごとの情報（自動車外装部品・純正用品事業53,961百万円、自動車関連機器事業19,241百万円）は報告セグメントではないため、事業の並びには使わず、businessModelのperspectivesに記録しました。
- history: 沿革から省いた行: 1939年12月の橋本鉄工株式会社の設立（1917年の橋本鉄工所の創設と重なるため）、1968年11月の館林工場、1975年12月の福島工場、1977年4月の九州犀川工場、1983年4月の九州苅田工場の各操業開始（個別の工場の操業開始は採らないため）、2005年8月の本社所在地の神奈川県川崎市への移転、2014年12月の市場第一部銘柄への指定（2022年のスタンダード市場への移行で代表させたため）、2017年12月の株式会社北九州ファルテックの設立（国内子会社の設立は主要な進出に限るため）、2023年5月の三河事業所の操業開始。
- history: 沿革には資本金の金額は印字されておらず、書いていません。
- history: TPR株式会社が親会社となった出来事は【沿革】ではなく【事業の内容】の「親会社グループにおける当社の位置付け」に印字されているため、その行だけlocatorを【事業の内容】としました。
- industry: 報告セグメントは地域別のため、製品及びサービスごとの情報で判断しました。自動車外装部品・純正用品事業が外部顧客への売上高53,961百万円と大半を占めるため、automotiveを主分類としました。第二の業界は付けませんでした。
- relatedCompanies: tpr: 【関係会社の状況】の親会社であり、議決権の55.54％を所有しています。大株主の状況では発行済株式（自己株式を除く）に対する割合が55.53％と印字されており、基準が異なるため、それぞれの印字どおりに記録しました。
- relatedCompanies: en: 「エンジンスターター」等の一般語への一致のみで、取引・提携・資本関係の記載がないため結びませんでした。
- relatedCompanies: tear: 連結子会社である株式会社アルティアの名称の一部への一致のみのため結びませんでした。
- relatedCompanies: cover: 「ミリ波レーダーカバー」等の製品名への一致のみのため結びませんでした。
- relatedCompanies: the-lead: 経営理念の「時代をリードする」という表現への一致のみのため結びませんでした。
- relatedCompanies: zero: サステナビリティの「ネットゼロ」の文脈への一致のみのため結びませんでした。
- relatedCompanies: base-4481: 「営業利益ベース」等の表記への一致のみのため結びませんでした。
- relatedCompanies: king: 製品名「イルミキッキングプレート」への一致のみのため結びませんでした。
- relatedCompanies: core: 「コア技術」という一般語への一致のみのため結びませんでした。
- relatedCompanies: corona: 「新型コロナウイルス」という感染症の名称への一致のみのため結びませんでした。
- relatedCompanies: daiwa: 大株主の常任代理人として大和証券株式会社が印字されているのみで、取引・提携・資本関係の記載がないため結びませんでした。
- relatedCompanies: ricoh: 「リコール」という一般語への一致のみのため結びませんでした。
- relatedCompanies: rion: 沿革の「オリオンテクノ」の名称の一部への一致のみのため結びませんでした。
- relatedCompanies: seki: 「セキュリティ」等の一般語への一致のみのため結びませんでした。
- relatedCompanies: SRG GLOBAL, LLCは大株主（4.03％）ですが、related-candidates.jsonに無く、米国の会社であるため結びませんでした。タイの連結子会社は同社との合弁事業です。
- relatedCompanies: 株式会社JCUは大株主（1.92％）ですが、related-candidates.jsonに無く、取引・提携の記載もないため結びませんでした。
- relatedCompanies: 三菱電線工業株式会社は2014年に電子部品事業の譲受を受けた相手ですが、related-candidates.jsonに無く、一過性の事業譲受のみのため結びませんでした。
- terms: 助言: 用語『ミリ波レーダーカバー（RADOME）』は、車両のミリ波レーダーを覆う樹脂製のカバー部品のことです。レーダーの電波を通しながら外観を整える役割があり、当社グループの自動車外装部品の主力製品の一つです。
- terms: 助言: 用語『TCU（テレマティクス・コミュニケーション・ユニット）』は、車両と外部の通信を行う車載通信ユニットのことです。当社グループは自動車純正用品として取り扱っています。
- terms: 助言: 用語『FPS（ファルテック・プロダクション・システム）』は、当社グループ独自の生産活動の名称です。効率的な生産方法をグローバルで追求する取組みを指します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
