# シップヘルスケアホールディングス — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | シップヘルスケアホールディングス株式会社 |
| 証券コード | 3360 |
| docID（データを取り出した文書） | `S100YJZ3` |
| 原本 docID | `S100YJZ3` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJZ3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | シップヘルスケアホールディングス株式会社 / 3360 / docID S100YJZ3（id は英語表記「SHIP HEALTHCARE HOLDINGS,INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ship-healthcare-holdings: 10 件の数値を有報XBRLと照合
有報: シップヘルスケアホールディングス株式会社 有価証券報告書－第34期(2025/04/01－2026/03/31) (docID S100YJZ3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ship-healthcare-holdings: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: profit 段は5年表の利益行が経常利益のため迷ったが、本文の財務数値の規則に従い当期純利益で書いた。
- businessModel: perspectives は有報の戦略・強みの節を読んでいないため省いた。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の大きい順（メディカルサプライ、トータルパックプロデュース、ライフケア、調剤薬局）。
- businessStructure: shortNameEn は英訳名 SHIP HEALTHCARE HOLDINGS,INC. から HOLDINGS,INC. を落とした表記。
- businessStructure: セグメント利益・のれん・減損などの数値は本文に書いていない。
- history: 沿革は多数の子会社化・設立の行があるため、事業の柱が分かる出来事に絞った。
- industry: 売上の大半はメディカルサプライ事業（診療材料・医療機器の販売）で、医療・ヘルスケアに最も近い pharmaceuticals を暫定で選んだ。医薬品メーカーではないため taxonomyGaps に記録した。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業との同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: 株式会社チャーム・ケア・コーポレーション（持分法適用関連会社、議決権29.4％）: 関係性は有報にあるが、候補ファイルが無く同一性・上場区分を確認できないため結ばない。
- terms: 助言のみ。本文にリンク記法は使っていない。用語集の新規提案候補は「ＳＰＤ（院内物流代行システム）」。本文では説明を添えて書いている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] シップヘルスケアホールディングスの主たる業界 → 提案: 医療機器・ヘルスケアサービス（医療用品の販売・介護・調剤薬局を含む区分）。診療材料・医療機器の販売が売上の大半で、介護施設運営・調剤薬局も持つため、既存の業界区分では正確に言えない。
