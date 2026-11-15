# 村上開明堂 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社村上開明堂 |
| 証券コード | 7292 |
| docID（データを取り出した文書） | `S100YHRX` |
| 原本 docID | `S100YHRX` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHRX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社村上開明堂 / 7292 / docID S100YHRX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
murakami: 10 件の数値を有報XBRLと照合
有報: 株式会社村上開明堂 有価証券報告書－第83期(2025/04/01－2026/03/31) (docID S100YHRX)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
murakami: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみで、セグメント利益・営業利益・経常利益の金額や増減率は書いていない。
- businessModel: financialNotes は空配列とした。変則決算・決算期変更はなく（経営指標は第79期から第83期まで3月期でそろっている）、前期有報との修正再表示チェックも全行一致したためである。
- businessStructure: 報告セグメントは所在地別の「日本」「アジア」「北米」の3区分で、セグメント注記の外部顧客への売上高の大きい順に並べた。3区分の合計115,651百万円は連結売上高と一致し、端数差はない。
- businessStructure: 製品及びサービスごとの情報は、単一の製品・サービスの区分の外部顧客への売上高が連結売上高の90％を超えるため有報で記載が省略されており、製品別の金額は書いていない。
- history: 沿革表は年月と事象が対応する通常形式で、全30行を収録した。同じ年に複数の事象がある1967年（11月：藤枝工場設立、12月：三菱重工業との取引開始）と2022年4月（村上開明堂東日本の子会社化、スタンダード市場への移行）は、事象ごとに分けて記録した。
- history: 設立時の資本金額は沿革に印字されていない。
- history: wikipedia.json の補足（自動車用バックミラー製造で国内首位という記述）は順位に当たるため使用しなかった。
- industry: 主たる業界は automotive とした。所在地別セグメントのため製品別の売上高は開示されていないが、単一の製品・サービスの区分が連結売上高の90％を超えており、売上高の大半が自動車用バックミラーであることによる。
- industry: ファインガラス（オプトロニクス事業）は金額が独立して開示されていないため、副たる業界は付けていない。閉じた分類に該当値があるため taxonomyGaps は無い。
- relatedCompanies: 株式会社ステップ：収益認識の「5ステップアプローチ」という一般語の誤抽出であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: エン株式会社（旧エン・ジャパン）：「エンゲージメント」の部分一致で ambiguous であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: セキ株式会社：一般語の部分一致で ambiguous であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: 株式会社コア：一般語「コア」の部分一致で ambiguous であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: 株式会社キャリア：「キャリア形成」という一般語の誤抽出であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: ベース株式会社：「連結ベース」という一般語の誤抽出であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: フリー株式会社：「CO2フリー電気」の部分一致であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: 株式会社ゼロ：「実質ゼロ」という一般語の誤抽出で ambiguous であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: ポート株式会社：「ポートフォリオ」の部分一致であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: 株式会社レイ：一般語の部分一致で ambiguous であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: 株式会社リコー：「リコール」の部分一致であり、取引・提携の記載はないため結ばなかった。
- relatedCompanies: 株式会社鈴木：沿革の「鈴木自動車工業」は現在のスズキ株式会社を指し、株式会社鈴木とは別法人のため結ばなかった（スズキ株式会社を結んだ）。
- relatedCompanies: 三菱重工業株式会社：沿革の「三菱重工業（現・三菱自動車工業）」は有報自身が現在の三菱自動車工業を指す記載であり、三菱重工業そのものとの取引の印字はないため結ばず、三菱自動車工業株式会社を結んだ。
- relatedCompanies: スルガ銀行株式会社：主要取引銀行として資金取引を行っており、また大株主（2026年3月31日現在2.91％）でもあるが、銀行との関係は金融取引に当たるため結ばなかった。
- relatedCompanies: 株式会社三菱UFJフィナンシャル・グループ：主力取引銀行である傘下の銀行との資金・外為取引が保有目的であり、金融取引のため結ばなかった。傘下の株式会社三菱UFJ銀行は大株主（2026年3月31日現在5.02％）だが、金融機関の保有のため結ばなかった。
- relatedCompanies: 株式会社しずおかフィナンシャルグループ：主力取引銀行である傘下の銀行との資金取引が保有目的であり、金融取引のため結ばなかった。
- relatedCompanies: 株式会社清水銀行：主要取引銀行として資金取引を行っていることが保有目的であり、金融取引のため結ばなかった。
- relatedCompanies: 三井住友トラストグループ株式会社：当社の株主名簿管理人であることが保有目的であり、事業上の取引・提携ではないため結ばなかった。
- relatedCompanies: 東海東京フィナンシャル・ホールディングス株式会社：金融サービス及び情報収集が保有目的であり、金融取引のため結ばなかった。
- relatedCompanies: 東京海上ホールディングス株式会社：主に保険関係の取引を行っていることが保有目的であり、保険取引のため結ばなかった。
- relatedCompanies: 大株主の株式会社豊英社（2026年3月31日現在16.05％）は代表取締役社長の資産管理会社で非上場のため結ばなかった。株式会社中島屋ホテルズ（同3.97％）も非上場で候補データにないため結ばなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
