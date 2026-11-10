# 三菱製鋼 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三菱製鋼株式会社 |
| 証券コード | 5632 |
| docID（データを取り出した文書） | `S100YCQQ` |
| 原本 docID | `S100YCQQ` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCQQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三菱製鋼株式会社 / 5632 / docID S100YCQQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsubishi-steel-mfg: 10 件の数値を有報XBRLと照合
有報: 三菱製鋼株式会社 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YCQQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
mitsubishi-steel-mfg: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は、主要な経営指標等の注記に印字された2022年改正会計基準（法人税、住民税及び事業税等に関する会計基準等）の第101期期首からの適用と、2024年3月期指標への遡及適用の事実のみを記録したものです。除外対象の金額は書いていません。
- businessModel: 連結の従業員数3,864人は主要な経営指標等の印字（第102期）によります。flow の revenue に挙げた事業別金額は、セグメント注記の外部顧客への売上高の印字どおりです（各事業の印字値の合計と連結売上高との差は有報の丸めによるものです）。
- businessModel: Wikipedia（「三菱製鋼」）は証券コードで同一性を確認しましたが、補足として使う情報がなかったため出典には加えていません。
- businessStructure: name は表紙の「三菱製鋼株式会社」から「株式会社」を除いた「三菱製鋼」としました。listings の市場区分は表紙の印字（東京証券取引所プライム市場）どおりです。
- businessStructure: 事業の並びは、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順（ばね→特殊鋼鋼材→機器装置→素形材）とし、報告セグメントに含まれない「その他の事業」を最後に置きました。各事業の金額はセグメント注記の外部顧客への売上高の印字どおりで、セグメント利益は書いていません。
- businessStructure: children は【事業の内容】の主要営業品目の区分と、特殊鋼鋼材については【経営方針】が分ける国内鋼材事業・海外鋼材事業の区分に沿って分けました。金額が独立して開示されていないため、children には金額を書いていません。
- history: 沿革表の一部は年月セルと事象文が分かれて印字される崩れた形でした。年月のセルと事象の数が一致する箇所（1991年10月・1992年3月の2セルと MSM US INC.設立・室蘭特殊鋼設立の2事象、1992年4月・1993年2月の2セルと三菱製鋼磁材吸収・千葉製作所設置の2事象）は、行順に対応づけました。この対応づけで1992年4月の三菱製鋼磁材株式会社の吸収合併は、沿革の項目としては採用しませんでした。
- history: 1904年・1917年・1919年・1942年の出来事は、沿革の冒頭の前身に関する記述（年月表ではない文章）から採りました。
- history: 資本金などの財務数値は沿革に書いていません。
- industry: 主たる業界は、特殊鋼鋼材とばねを中心とする鉄鋼メーカーであることから素材の加工に最も近い化学（chemicals）を暫定としました。閉じた分類に鉄鋼・金属の区分がないため、taxonomyGaps に記録しています。
- industry: 機器装置事業など、売上高が独立して開示されている他の事業についても、鉄鋼・金属の範囲内の事業であるため独立した業界は付けていません。
- relatedCompanies: 株式会社めぶきフィナンシャルグループ： 特定投資株式に名前がありますが、保有目的が主要金融機関との関係構築による安定的な資金調達であり、金融機関の資金調達の関係は結ばないため対象外としました。
- relatedCompanies: 株式会社三菱UFJフィナンシャル・グループ： 特定投資株式に名前がありますが、保有目的が資金調達のための金融機関との関係構築のため結びませんでした。
- relatedCompanies: 株式会社百十四銀行： 特定投資株式に名前がありますが、銀行で、保有目的が資金調達のための関係構築のため結びませんでした。
- relatedCompanies: 株式会社東邦銀行： 特定投資株式に名前がありましたが、当事業年度に売却済みで、銀行でもあるため結びませんでした。
- relatedCompanies: 株式会社シンニッタン： 特定投資株式に名前がありますが、当事業年度に売却済みのため結びませんでした。候補のニッタは、この「シンニッタン」の部分一致による誤マッチです。
- relatedCompanies: PT. INDOSPRING, Tbk： 特定投資株式に名前があり、自動車用ばねの製造技術に関する技術提携と当社海外鋼材製品の販売先としての関係が印字されていますが、候補リストに無い（インドネシアの上場会社）ため結びませんでした。
- relatedCompanies: 明治安田生命保険相互会社・東京海上日動火災保険株式会社： 大株主の状況に名前がありますが、保険会社で純投資のため結びませんでした。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社（信託口・役員報酬BIP信託口）、STATE STREET BANK AND TRUST COMPANY、UBS AG、INTERACTIVE BROKERS LLC： 大株主の状況に名前がありますが、信託口・常任代理人（カストディアン）のため結びませんでした。候補のトラストは日本マスタートラスト信託銀行の部分一致による誤マッチで、listing も上場ではありません。
- relatedCompanies: エン株式会社（エン・ジャパン）： 「エンゲージメント」など一般語の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社コア： 「コア技術」など一般語の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社イノベーション： 「イノベーション」一般語の誤マッチのため結びませんでした。
- relatedCompanies: ポート株式会社： 「事業ポートフォリオ」の部分一致による誤マッチのため結びませんでした。
- relatedCompanies: 株式会社ビジョン： 「中長期ビジョン」など一般語の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社キャリア： 「キャリア支援」など一般語の誤マッチのため結びませんでした。
- relatedCompanies: セキ株式会社： 「セキュリティ」などの部分一致による誤マッチのため結びませんでした。
- relatedCompanies: 株式会社ゼロ： 「ゼロエミッション」の部分一致による誤マッチのため結びませんでした。
- relatedCompanies: パス株式会社： 「パーパス」の部分一致による誤マッチのため結びませんでした。
- relatedCompanies: 株式会社レイ： 「ロールプレイング」の部分一致による誤マッチのため結びませんでした。
- relatedCompanies: ベース株式会社： 「営業利益ベース」の部分一致による誤マッチのため結びませんでした。
- relatedCompanies: イシン株式会社： 一般語の部分一致による誤マッチのため結びませんでした。
- relatedCompanies: 株式会社イムラ： 一般語の部分一致による誤マッチのため結びませんでした。
- terms: 用語の助言はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 三菱製鋼の主たる業界 → 提案: steel-and-metals（鉄鋼・金属）。売上高の中心は特殊鋼鋼材と、その鋼材を加工するばね・素形材であり、鉄鋼メーカーとしての事業ですが、閉じた分類に鉄鋼・金属に合う値がないため、素材の加工に最も近い chemicals を暫定の主たる業界としました。
