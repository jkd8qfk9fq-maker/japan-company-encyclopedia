# ナフコ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ナフコ |
| 証券コード | 2790 |
| docID（データを取り出した文書） | `S100YJ0H` |
| 原本 docID | `S100YJ0H` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ0H.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ナフコ / 2790 / docID S100YJ0H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nafco: 10 件の数値を有報XBRLと照合
有報: 株式会社ナフコ 有価証券報告書－第57期(2025/04/01－2026/03/31) (docID S100YJ0H)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
nafco: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 第56期事業年度からの表示方法の変更により、主要な経営指標等の売上高が営業収益に変更されています。修正再表示チェックで全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotesは書きませんでした。
- businessModel: 重要な後発事象の資金借入（2026年4月17日取締役会決議、3行から計9,500百万円、運転資金）は資本政策のため、needsReviewには入れていません。
- businessModel: いわき小名浜店の新設（2026年4月完成予定）は1店舗の出店計画のため、needsReviewには入れていません。
- businessStructure: セグメントの並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: 「その他」の区分は報告セグメントに含まれない商品区分セグメントで、内容はカー用品、乗り物、ペット用品、灯油他です。
- businessStructure: 当事業年度より報告セグメントの区分が変更され、一部商品が「資材・DIY・園芸用品」から「生活用品」へ移っています。前事業年度の数値は変更後の区分で組み替えたものです。
- businessStructure: 営業収益は売上高と営業収入を合わせたもので、セグメント売上高の合計174,477百万円とは一致しません。
- history: 沿革は15件を選びました。年月は年のみを記載しています。
- industry: 主たる業界は、売上高の大半を占める3つの報告セグメントがいずれも商品の小売販売であることから小売としました。東証の業種分類も小売業です。
- relatedCompanies: あらたは、買掛金の相手先別内訳に1,430百万円の記載があるのみで、仕入取引の継続性を示す印字がないため結ばず。
- relatedCompanies: 三井物産・トラスコ中山は、買掛金の相手先別内訳に記載があるのみのため結ばず。
- relatedCompanies: エコートレーディング・山善・ナイス・welzoは、電子記録債務の相手先別内訳に記載があるのみのため結ばず。
- relatedCompanies: ネットスターズは、売掛金の相手先別内訳に記載があるのみで、決済代行による債権のため顧客として結ばず。
- relatedCompanies: 大日本印刷は、支払手形の相手先別内訳に記載があるのみのため結ばず。
- relatedCompanies: オカムラは、設備関係支払手形の相手先別内訳に記載があるのみのため結ばず。
- relatedCompanies: 西日本フィナンシャルホールディングス・ふくおかフィナンシャルグループは、特定投資株式の表に載るのみで、保有目的が主要取引金融機関としての資金調達のため結ばず。
- relatedCompanies: ゼンリン・T&Dホールディングス・第一交通産業・第一生命ホールディングス・九州リースサービス・スターフライヤーは、特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句（「営業取引があり、安定的な取引関係の維持・強化を目的に保有」）のため結ばず。
- relatedCompanies: 深勝興産は大株主（31.57％、2026年3月31日現在）だが非上場のため結ばず。TYFホールディングスも大株主（2.32％、2026年3月31日現在）だが非上場のため結ばず。
- relatedCompanies: 非連結子会社2社（ナフコ商品センター・マツサキホームセンター）はすべて非上場のため結ばず。
- relatedCompanies: ポート・ベース・ランド・レイ・セキ・スペース・フライヤーは断片一致のみのため結ばず。
- terms: 新たに提案する用語はありません。資材・DIY・園芸用品、生活用品、家具・ホームファッション用品などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
