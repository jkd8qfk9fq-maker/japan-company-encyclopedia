# 福田組 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社福田組 |
| 証券コード | 1899 |
| docID（データを取り出した文書） | `S100XT0V` |
| 原本 docID | `S100XT0V` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT0V.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社福田組 / 1899 / docID S100XT0V（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fukuda: 10 件の数値を有報XBRLと照合
有報: 株式会社福田組 有価証券報告書－第99期(2025/01/01－2025/12/31) (docID S100XT0V)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fukuda: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益以外の財務数値は本文の規則により書きませんでした。
- businessModel: financialNotesには、主要な経営指標等の注記に印字された収益認識に関する会計基準の適用（第96期の期首から）の事実だけを書きました。
- businessModel: 数値目標は本文の規則により strategy には書きませんでした。
- businessStructure: 事業はセグメント注記の外部顧客への売上高の大きい順に並べました。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: 「その他」の区分は報告セグメントに含まれていない事業セグメントで、福祉関連事業等を含みます。
- businessStructure: 建設事業の内訳の「その他」は、【事業の内容】にある建設工事関連資機材の賃貸や製造販売などの記載をもとに説明しました。
- history: 沿革は【沿革】の記載から15件を選びました。資本金の金額は本文の規則により書きませんでした。
- industry: 主たる業界は、建設事業が売上高の大半を占めることから建設としました。
- industry: 不動産事業が報告セグメントであることから、不動産を2つ目に付けました。
- relatedCompanies: イオンモールは完成工事の発注者として名前がありますが、コードリストに上場がなく、個別の工事ごとの取引のため結びませんでした。
- relatedCompanies: 東日本旅客鉄道は完成工事（信越線新潟駅付近高架化）の発注者ですが、1回限りの工事の取引のため結びませんでした。
- relatedCompanies: レックは、有報の「レックス」が連結子会社の株式会社レックスで、レック株式会社とは別会社です。断片一致のため結びませんでした。
- relatedCompanies: セキ・エン・レイは断片一致のみで、社名の一致する取引・提携の記載がないため結びませんでした。
- relatedCompanies: 東北電力・第四北越フィナンシャルグループ・三菱ＵＦＪフィナンシャル・グループ・みずほフィナンシャルグループ・三井住友フィナンシャルグループ・豊田通商・北陸瓦斯・コメリ・共立メンテナンス・三菱瓦斯化学・MS＆ADインシュアランスグループホールディングス・ニチレキグループ・リンコーコーポレーション・大光銀行・あいちフィナンシャルグループ・アークランズ・ブルボン・コスモエネルギーホールディングス・ケーズホールディングス・京葉瓦斯・明和地所・日本精機・T＆Dホールディングス・バイタルケーエスケー・ホールディングス・ジャックスは、株式の保有状況に載っているだけで、保有目的が全銘柄共通の定型句のため結びませんでした。
- relatedCompanies: ユアテックは、大株主の状況の注記で同社の子会社が当社株式を保有しているとあるだけで、当社との直接の取引・提携の記載がないため結びませんでした。
- relatedCompanies: トラストは、日本マスタートラスト信託銀行が信託口の大株主で、事業会社ではないため結びませんでした。
- relatedCompanies: ビジョン・キャリア・カバー・ポート・スローガン・ステップ・ガーデン・イノベーション・キングは断片一致のみで、社名の一致する取引・提携の記載がないため結びませんでした。
- relatedCompanies: 日本道路はコードリストになく、会議の報文発表の文脈でのみ名前があるため結びませんでした。
- relatedCompanies: 大株主の株式会社第四北越銀行（2025年12月31日現在2.33％）は金融機関のため結びませんでした。
- relatedCompanies: 連結子会社25社・関連会社4社はすべて非上場のため結びませんでした。福田道路などは【関係会社の状況】に載る連結子会社・持分法適用関連会社です。
- terms: 新たに提案する用語はありません。「フクダグループスピリット」や「中期経営計画2030」は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
