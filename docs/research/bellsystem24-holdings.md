# ベルシステム24ホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ベルシステム２４ホールディングス |
| 証券コード | 6183 |
| docID（データを取り出した文書） | `S100Y5Z2` |
| 原本 docID | `S100Y5Z2` |
| 提出日（原本） | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5Z2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ベルシステム２４ホールディングス / 6183 / docID S100Y5Z2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 30 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bellsystem24-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ベルシステム２４ホールディングス 有価証券報告書－第12期(2025/03/01－2026/02/28) (docID S100Y5Z2)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
bellsystem24-holdings: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社ベルシステム24ホールディングス」が EDINET の提出者名「株式会社ベルシステム２４ホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 「その他」の事業は報告セグメントに含まれない区分のため、事業の並びの最後に置いています。
- businessModel: 後発事象は、連結・個別とも「該当事項はありません」と印字されています。
- businessStructure: セグメント別の金額は、セグメント注記の外部顧客への売上収益を用いています。
- businessStructure: 「その他」は報告セグメントに含まれない区分のため、事業の並びの最後に置いています。
- businessStructure: 従業員数は、2024年2月期より有期労働契約から無期転換した無期契約社員数を外書として表示する方法に変更したため、2024年2月期以降の表示がそれ以前と異なります。
- history: 沿革の表で年月と事象が分かれて印字されていた行は、年月と事象の数が一致することを確認して行順で対応づけました。
- industry: 主たる業界は、売上収益の大半を占めるＣＲＭ事業の内容から判断しました。閉じた分類にコンタクトセンター・ＢＰＯの区分が無いため、人材サービスを暫定とし、taxonomyGapsにコンタクトセンター・アウトソーシングの区分を提案しました。
- relatedCompanies: TOPPAN: 2026年2月28日現在14.28%を保有する大株主で、2017年11月に資本業務提携を結んでいますが、related-candidates.jsonに含まれていないため結びませんでした。
- relatedCompanies: ＣＴＣファーストコンタクト: 持分法適用関連会社（48.0%）ですが非上場のため結びませんでした。
- relatedCompanies: ＴＢネクストコミュニケーションズ: 持分法適用関連会社（49.0%）ですが非上場のため結びませんでした。
- relatedCompanies: True Touch: 持分法適用関連会社（49.9%）ですが非上場のため結びませんでした。
- relatedCompanies: 連結子会社８社（ベルシステム24、スカパー・カスタマーリレーションズ、Horizon One、BELLSYSTEM24 VIETNAM、鈴華、シンカー、ベル・ソレイユ、他１社）: いずれも非上場のため結びませんでした。
- relatedCompanies: 千趣会: 特定投資株式の保有目的が「取引関係等の円滑化のため」の定型句のみで、具体的な取引が印字されていないため結びませんでした。
- relatedCompanies: ウェルネスコミュニケーションズ: 特定投資株式の保有目的が「取引関係等の円滑化のため」の定型句のみで、具体的な取引が印字されていないため結びませんでした。
- relatedCompanies: シグマクシス・ホールディングス: ＣＴＣファーストコンタクト株式の一部譲渡の相手ですが、継続的な取引・提携が印字されていないため結びませんでした。
- relatedCompanies: ナイス: 「ナイスジャパン」はNICE CXone MpowerのＯＥＭ提供元ですが、ナイス株式会社（8089）とは別会社のため結びませんでした。
- relatedCompanies: シンカ: 「シンカ」は株式会社シンカーの部分一致の誤マッチのため結びませんでした。
- relatedCompanies: キャリア: 「キャリア」は「キャリアパス」の一般語のため結びませんでした。
- relatedCompanies: エン: 「エン」は「エンジニア」の部分一致のため結びませんでした。
- relatedCompanies: パス: 「パス」は「キャリアパス」の部分一致のため結びませんでした。
- relatedCompanies: コア: 「コア」は「コア業務」の一般語のため結びませんでした。
- relatedCompanies: イノベーション: 「イノベーション」は一般語のため結びませんでした。
- relatedCompanies: レイ: 「レイ」は一般語・部分一致の誤マッチのため結びませんでした。
- relatedCompanies: ポート: 「ポート」は「カスタマーサポート」などの部分一致のため結びませんでした。
- relatedCompanies: ステップ: 「ステップ」は「昇進ステップ」の一般語のため結びませんでした。
- relatedCompanies: ベース: 「ベース」は「連結ベース」の一般語のため結びませんでした。
- relatedCompanies: キング: 「キング」は一般語・部分一致の誤マッチのため結びませんでした。
- relatedCompanies: レント: 「レント」は「タレント」の部分一致のため結びませんでした。
- relatedCompanies: トラスト: 「トラスト」は日本マスタートラスト信託銀行の部分一致のため結びませんでした。
- relatedCompanies: レック: 「レック」は「フレックスタイム制度」の部分一致のため結びませんでした。
- relatedCompanies: セキ: 「セキ」は一般語・部分一致の誤マッチのため結びませんでした。
- relatedCompanies: ランド: 「ランド」は一般語・部分一致の誤マッチのため結びませんでした。
- relatedCompanies: フリー: 「フリー」は「リスクフリーレート」の部分一致のため結びませんでした。
- relatedCompanies: ビジョン: 「ビジョン」は一般語のため結びませんでした。
- relatedCompanies: ゼロ: 「ゼロ」は「ネット・ゼロ」の一般語のため結びませんでした。
- relatedCompanies: スペース: 「スペース」は「執務スペース」の一般語のため結びませんでした。
- relatedCompanies: 田谷: 「田谷」は「世田谷区」の部分一致のため結びませんでした。
- terms: 用語候補として、BellCloud+CX、ヒトトナリＡＩ、Knowledge Generator、Hybrid Operation Loop、Co-MR、ＢＡ Intelligence、NICE CXone Mpowerがあります。いずれも既存の用語集には無いため、本文ではリンク記法を使っていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ベルシステム24ホールディングスの主たる業界 → 提案: contact-center-outsourcing。主たる事業はコンタクトセンター業務を中心とするＣＲＭ事業で、企業の顧客対応や業務プロセスを受託するアウトソーシングです。閉じた分類にコンタクトセンター・ＢＰＯの区分が無いため、労働集約型のアウトソーシングに最も近い人材サービスを暫定としました。
