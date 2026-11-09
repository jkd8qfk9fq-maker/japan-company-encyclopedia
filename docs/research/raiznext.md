# レイズネクスト — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | レイズネクスト株式会社 |
| 証券コード | 6379 |
| docID（データを取り出した文書） | `S100YDME` |
| 原本 docID | `S100YDME` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDME.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | レイズネクスト株式会社 / 6379 / docID S100YDME（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
raiznext: 10 件の数値を有報XBRLと照合
有報: レイズネクスト株式会社 有価証券報告書－第122期(2025/04/01－2026/03/31) (docID S100YDME)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
raiznext: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に財務諸表の組替えの記載がありますが、組替えは顧客との契約から生じる収益の分解情報（タンクの独立表示）のみで、修正再表示チェックで前期有報との重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotesには書きません。
- businessModel: 重要な後発事象の記載は有報に見当たりません。2026年4月の関西事業所の新設は沿革に印字されているため、historyに記録しました。
- businessModel: タンク分野の完成工事高は2026年3月期より独立表示され、前期分は変更後の区分に組替えて表示されています。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。単一セグメントのため、工事種類別の完成工事高をエンジニアリング業の内訳として記載しました。
- businessStructure: エンジニアリング業174,489百万円とその他事業41百万円の合計は174,530百万円となり、有報の合計174,531百万円と1百万円異なりますが、有報の丸めによるもので、印字の数値をそのまま記載しました。
- businessStructure: タンクは2026年3月期より独立して表示されるようになり、前連結会計年度の工事種類別内訳は変更後の区分に組替えて表示されています。
- history: 1966年は大阪事業所と千葉事業所の開設を1件にまとめました。
- industry: 主たる業界は、エンジニアリング業が単一の報告セグメントで、東証の業種分類も建設業であることから建設としました。
- industry: 半導体関連設備の受注は事業機会の文脈での記載にとどまるため、半導体は付けていません。
- relatedCompanies: ADEKA：特定投資株式の保有目的に「当社のエンジニアリング業における顧客」との印字があるが、related-candidates.jsonにないため結ばない。
- relatedCompanies: 北越コーポレーション：特定投資株式の保有目的が「同社との取引関係の維持・強化を図るため」の定型句のみで、当事業年度に保有株式を全て売却しているため結ばない。
- relatedCompanies: 佐藤食品工業：特定投資株式の保有目的が定型句のみで、当事業年度に保有株式を全て売却しているため結ばない。
- relatedCompanies: 茨城日鉱建設、JX金属プラント佐賀関、双葉製作所、西海エンジニアリング・サービス：持分法を適用しない関連会社だが、すべて非上場のため結ばない。
- relatedCompanies: 連結子会社7社：すべて非上場のため結ばない。
- relatedCompanies: UH Partners 2投資事業有限責任組合、光通信KK投資事業有限責任組合、エスアイエル投資事業有限責任組合、レイズネクスト従業員持株会、レイズネクスト取引先持株会、BBH FOR FIDELITY LOW-PRICED STOCK FUND、エフティグループ：大株主だが、投資事業有限責任組合・持株会・外国ファンド・非上場のため結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）、日本カストディ銀行（信託口）：信託銀行のため結ばない。
- relatedCompanies: エン、レイ、ビジョン、ベース、コア、セキ、レック、キャリア、フレンドリー、イムラ、ランド、ポート、トラスト：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- terms: 新たに提案する用語はありません。メンテナンス、タンク、エンジニアリングなどの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
