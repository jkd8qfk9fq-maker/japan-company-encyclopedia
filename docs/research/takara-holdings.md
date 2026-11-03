# 宝ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 宝ホールディングス株式会社 |
| 証券コード | 2531 |
| docID（データを取り出した文書） | `S100YINV` |
| 原本 docID | `S100YINV` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YINV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 宝ホールディングス株式会社 / 2531 / docID S100YINV（id は英語表記「TAKARA HOLDINGS INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takara-holdings: 10 件の数値を有報XBRLと照合
有報: 宝ホールディングス株式会社 有価証券報告書－第115期(2025/04/01－2026/03/31) (docID S100YINV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
takara-holdings: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 利益の分析・セグメント利益は本文に書かない規則のため省いた。
- businessModel: 後発事象のタカラバイオ完全子会社化と借入・自己株式取得は、金額を含むため本文に書かず needsReview に記録した。
- businessStructure: 並び順は2026年3月期の外部顧客への売上高の大きい順。「その他」は報告セグメントに含まれない区分のため最後。
- businessStructure: children の金額は有報に独立して開示されていないため書いていない。
- history: 沿革表の1925年以降の多数の行（工場の買収・統合など）は、会社の全体像に影響が小さいため省いた。
- history: 2026年のタカラバイオ完全子会社化は後発事象として扱い、沿革には入れていない（businessModel の financialNotes 側で触れる）。
- industry: 売上の大半は酒類・調味料と日本食材卸（宝酒造と宝酒造インターナショナル）のため food を主たる業界とした。
- industry: タカラバイオグループは報告セグメントだが売上の約1割で、試薬・機器・CDMOは医薬品に近いものの閉じた分類に研究支援・バイオ試薬が無いため、2つ目の業界は付けていない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: タカラバイオ株式会社: 有報の関係会社表に連結子会社として載る（上場企業）が、候補ファイルにないため結んでいない。2026年6月12日に上場廃止の予定事項でもある。
- terms: 用語候補（助言のみ）: 持株会社、CDMO（医薬品・再生医療等製品の開発製造受託）、本みりん、スコッチウイスキー、スクイーズアウト。

## 要確認（status に反映）

- businessModel: 提出後の重要な後発事象: 2026年2月に公開買付けを決議し、2026年4月6日に成立、2026年6月12日にタカラバイオが上場廃止（完全子会社化）。有報の関係会社表はタカラバイオの議決権所有割合を60.91％（提出日現在は100％となる予定）と印字している。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 宝ホールディングスのタカラバイオグループ（試薬・機器・CDMO） → 提案: バイオ・ライフサイエンス。試薬・研究機器・受託サービスを事業とする報告セグメントがあるが、既存の業界値では言い表せない。
