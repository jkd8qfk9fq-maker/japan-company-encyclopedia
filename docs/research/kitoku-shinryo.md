# 木徳神糧 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 木徳神糧株式会社 |
| 証券コード | 2700 |
| docID（データを取り出した文書） | `S100XSQ8` |
| 原本 docID | `S100XSQ8` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSQ8.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E6%9C%A8%E5%BE%B3%E7%A5%9E%E7%B3%9E

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 木徳神糧株式会社 / 2700 / docID S100XSQ8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kitoku-shinryo: 10 件の数値を有報XBRLと照合
有報: 木徳神糧株式会社 有価証券報告書－第78期(2025/01/01－2025/12/31) (docID S100XSQ8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kitoku-shinryo: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年改正会計基準を第78期の期首から適用し、第77期の指標は遡及適用後の値ですが、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotesには書きません。
- businessModel: 2025年7月1日付で普通株式1株につき5株の割合で株式分割を行いました。資本政策の事象のためneedsReviewには入れていません。
- businessModel: 重要な後発事象は該当事項なしと印字されています。
- businessModel: 経営上の目標の達成状況を判断するための客観的な指標として自己資本当期純利益率が印字されていますが、投資の語のためstrategyには書きませんでした。
- businessModel: 長期ビジョンの国内米穀の仕入シェア10％の目標は、数値目標のためstrategyには書きませんでした。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。
- businessStructure: 米穀事業の内訳（精米、玄米、その他）の金額は、経営成績の状況の米穀事業の内容の表に印字されたものです。
- businessStructure: 鶏卵事業、飼料事業、食品事業の内訳には金額が独立して開示されていないため、金額を書いていません。
- history: 社名は創業者の木村徳兵衛に由来します（Wikipediaの補足）。
- history: 1950年は設立（3月）と本社移転（4月）の2件が印字されていますが、設立の1件を採用しました。
- history: 沿革は主な出来事15件を選びました。2016年の本社機能の移転と2023年の本店所在地の移転は採用しませんでした。
- industry: 主たる業界は、米穀を中心とする食品の卸売が主たる事業であることから食品としました。東証の業種分類は卸売業です。
- relatedCompanies: 日本マクドナルドホールディングス：被合弁会社が過去に不動産賃貸をしていた関係で持株会に加入していたもので、現行の取引・提携の印字がないため結ばない。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ、三井住友フィナンシャルグループ、ちゅうぎんフィナンシャルグループ：主要取引銀行であることが保有目的のため結ばない（銀行ルール）。
- relatedCompanies: あかつき本社：取引先であるあかつき証券の親会社で、有価証券の管理が保有目的のため結ばない。
- relatedCompanies: 大株主の事業会社（濱田精麦、神明ホールディングス、大和産業、全国農業協同組合連合会、ヤマエ久野）は非上場のため結ばない。金融機関の大株主（三菱ＵＦＪ銀行、三井住友銀行、農林中央金庫）は結ばない。
- relatedCompanies: 主要な顧客の農林水産省と日本デリカフーズ協同組合は上場企業ではないため結ばない。イトーヨーカ堂はセブン＆アイ・ホールディングスの子会社で、同社を関連企業として結んでいる。
- relatedCompanies: 連結子会社3社と持分法適用関連会社1社はすべて非上場のため結ばない。
- relatedCompanies: ランド、メック、ベース、鈴木、エン、ポート、コロナ、カバー、キング、ステップ、田谷、ビジョン：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 大和：有報の大和は大和産業株式会社で、掲載企業の大和（8247）とは別会社のため結ばない。
- terms: 新たに提案する用語はありません。ミニマム・アクセス米、たんぱく質調整米などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
