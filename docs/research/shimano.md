# シマノ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社シマノ |
| 証券コード | 7309 |
| docID（データを取り出した文書） | `S100XQSE` |
| 原本 docID | `S100XQSE` |
| 提出日（原本） | 2026-03-17 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XQSE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社シマノ / 7309 / docID S100XQSE（id は英語表記「SHIMANO INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shimano: 10 件の数値を有報XBRLと照合
有報: 株式会社シマノ 有価証券報告書－第119期(2025/01/01－2025/12/31) (docID S100XQSE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shimano: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 地域別売上（2025年12月期、顧客所在地基準）はヨーロッパ206,403百万円が最大。金額は本文に書かず、最大の地域だけ記した。
- businessModel: 営業利益・経常利益は本文規則により書いていない。戦略・強みの perspectives は証拠パックの該当節を読んでいないため省いた。
- businessModel: brief.md に財務諸表の組替えの記載があるが、前期有報との重複年度は全て一致のため financialNotes は空。
- businessStructure: 並び順はセグメント注記の外部顧客への売上高（自転車部品354,972 > 釣具110,832 > その他439）。事業の内容の3事業はセグメント区分と同一と明記されている。
- businessStructure: 事業系統図は画像で本文に無いため、図にしかない流れは書いていない。
- businessStructure: セグメント利益（営業利益ベース）は本文規則により書いていない。
- businessStructure: listings の market はDEI/表紙の「東京証券取引所プライム市場」から。
- history: 沿革は多数の子会社設立・合併があるため、事業・海外展開・上場・社名・本社整備の節目だけを選んだ。
- industry: 売上の大半（354,972百万円/466,243百万円）は自転車部品。合う区分が無いため、金属部品を製造する最も近い machinery を暫定にした。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる掲載済み企業が無い。関係会社は全て非上場の子会社（有報に上場会社なしと記載）のため結んでいない。
- relatedCompanies: 政策保有株式の三菱UFJフィナンシャル・グループは現預金・為替取引など金融情報収集目的の保有で、取引の向きが事業上の関係ではないため結ばない。
- relatedCompanies: 最大の取引先 PAUL LANGE & CO. OHG（売上高の11.6％）は候補に無く、上場の確認もできないため結ばない。
- terms: 用語の追加提案: コンポーネント（変速機・ブレーキなど自転車部品をまとめた呼び方）、市場在庫（流通段階にある完成車・部品の在庫）、ロウイング（ボート競技）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] シマノの自転車部品・釣具事業 → 提案: スポーツ・レジャー用品（または自転車・二輪部品）。自転車部品と釣具は既存の業界区分に当てはまらない。
