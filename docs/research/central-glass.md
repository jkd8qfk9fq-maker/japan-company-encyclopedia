# セントラル硝子 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | セントラル硝子株式会社 |
| 証券コード | 4044 |
| docID（データを取り出した文書） | `S100YGND` |
| 原本 docID | `S100YGND` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGND.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | セントラル硝子株式会社 / 4044 / docID S100YGND（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 26 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
central-glass: 10 件の数値を有報XBRLと照合
有報: セントラル硝子株式会社 有価証券報告書－第112期(2025/04/01－2026/03/31) (docID S100YGND)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
central-glass: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 後発事象は、連結・個別とも「該当事項はありません」と印字されています。
- businessStructure: 報告セグメントは当連結会計年度より従来の2区分から4区分に変更され、前連結会計年度のセグメント情報は変更後の区分により作成しています。
- businessStructure: 「その他」の事業は報告セグメントに含まれない区分のため、事業の並びの最後に置いています。
- history: 2025年の沿革は、年月が1つで事象が2つ並ぶ行のため、清算と株式譲渡を1件にまとめています。
- industry: 主たる業界は、外部顧客への売上高が最も大きいガラス事業の内容から判断しました。閉じた分類にガラスの区分が無いため、化学を暫定とし、taxonomyGapsにガラスの区分を提案しました。
- industry: 半導体プロセス用高純度ガスを事業として開示しているため、半導体を2つ目の業界としました。
- relatedCompanies: ステップ: 「5ステップアプローチ」の一般語のため結びませんでした。
- relatedCompanies: エン: 「セントラルエンジニアリング」の部分一致のため結びませんでした。
- relatedCompanies: ベース: 「塩安をベースとする」の一般語のため結びませんでした。
- relatedCompanies: レック: 「デュープレックス法」の部分一致のため結びませんでした。
- relatedCompanies: イオン: 「リチウムイオン」の部分一致のため結びませんでした。
- relatedCompanies: ゼロ: 「発生ゼロ」の一般語のため結びませんでした。
- relatedCompanies: フリー: 「PFASフリー」の一般語のため結びませんでした。
- relatedCompanies: ポート: 「事業ポートフォリオ」の部分一致のため結びませんでした。
- relatedCompanies: ビジョン: 「VISION 2030」の一般語のため結びませんでした。
- relatedCompanies: コモ: 「コモディティ・スワップ」の部分一致のため結びませんでした。
- relatedCompanies: パス: 「パーパス」の部分一致のため結びませんでした。
- relatedCompanies: セキ: 「サイバーセキュリティ」の部分一致のため結びませんでした。
- relatedCompanies: スローガン: 「スローガン」の一般語のため結びませんでした。
- relatedCompanies: キャリア: 「自律的キャリア形成」の一般語のため結びませんでした。
- relatedCompanies: コア: 「コア技術」の一般語のため結びませんでした。
- relatedCompanies: イシン: 有報の本文に具体的な取引・提携が印字されていないため結びませんでした。
- relatedCompanies: オロ: 「PFAS」の部分一致のため結びませんでした。
- relatedCompanies: ランド: 「ブランド」の部分一致のため結びませんでした。
- relatedCompanies: レント: 「タレントマネジメント」の部分一致のため結びませんでした。
- relatedCompanies: みずほフィナンシャルグループ: 特定投資株式の保有目的が「主に財務に係る取引」であり、金融機関との資金調達・財務取引を理由に結ばないため結びませんでした。
- relatedCompanies: 三井住友フィナンシャルグループ: 特定投資株式の保有目的が「主に財務に係る取引」であり、金融機関との資金調達・財務取引を理由に結ばないため結びませんでした。
- relatedCompanies: 三井住友トラストグループ: 特定投資株式の保有目的が「主に財務に係る取引」であり、金融機関との資金調達・財務取引を理由に結ばないため結びませんでした。
- relatedCompanies: 山口フィナンシャルグループ: 特定投資株式の保有目的が「主に財務に係る取引」であり、金融機関との資金調達・財務取引を理由に結ばないため結びませんでした。
- relatedCompanies: 山口銀行: 大株主の状況に2.53%で載る金融機関ですが、related-candidates.jsonに含まれておらず、金融機関の純投資のため結びませんでした。
- relatedCompanies: 連結子会社20社（セントラルグラスファイバー、セントラル化成、セントラル・サンゴバン、セントラル硝子販売、セントラル硝子プロダクツ、セントラル硝子工事、三重硝子工業、日本特殊硝子、東商セントラル、セントラルエンジニアリング、セントラル硝子プラントサービス、セントラルガラスチェコ、セントラルガラスインターナショナル、シンクェストラボラトリーズ、基佳電子材料、基佳電子材料シンガポール、浙江中硝康鵬化学、上海中硝商貿、ジェイセル、韓国セントラル硝子）: いずれも非上場のため結びませんでした。
- relatedCompanies: 持分法適用関連会社（江西天賜中硝新材料有限公司ほか3社）: いずれも非上場のため結びませんでした。
- terms: 用語候補として、PFASフリー、VISION 2030、スペシャリティ・マテリアルズ・カンパニー、Phase 1、Phase 2があります。いずれも既存の用語集には無いため、本文ではリンク記法を使っていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] セントラル硝子の主たる業界 → 提案: glass。外部顧客への売上高が最も大きい報告セグメントはガラス事業ですが、閉じた分類にガラスの区分が無いため、電子材料・エネルギー材料・ライフ＆ヘルスケアの3部門も化学製品であることから化学を暫定としました。
