# セーレン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | セーレン株式会社 |
| 証券コード | 3569 |
| docID（データを取り出した文書） | `S100YH1G` |
| 原本 docID | `S100YH1G` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH1G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | セーレン株式会社 / 3569 / docID S100YH1G（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
seiren: 10 件の数値を有報XBRLと照合
有報: セーレン株式会社 有価証券報告書－第154期(2025/04/01－2026/03/31) (docID S100YH1G)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
seiren: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に財務諸表の組替えの記載がありますが、修正再表示チェックで前期有報との重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotesには書きません。
- businessModel: 2026年5月13日の取締役会で自己株式の取得を決議したことは、提出後の資本政策のため needsReview には入れていません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。
- businessStructure: 当連結会計年度より報告セグメントの区分を変更しており、前連結会計年度の数値は変更後の区分に基づき作成したものが記載されています。
- businessStructure: セグメント利益の金額は本文に書かないため、事業の説明には含めていません。
- history: 1973年は商号変更と市場第一部指定替の2件を1件にまとめました。
- history: 2005年はＫＢセーレン株式会社の設立とカネボウ株式会社の繊維事業の営業譲受の2件を1件にまとめました。
- history: 2012年はインドとインドネシアの子会社設立の2件を1件にまとめました。
- history: 2005年5月の行に「大阪証券取引所市場第一部上場廃止」の事象が日付なしで印字されているため採用しませんでした。
- industry: 主たる業界は、外部顧客への売上高が最も大きい報告セグメントである車輌資材が自動車・鉄道車輌の内装材であることから automotive としました。
- industry: セーレンアドバンストマテリアルズ株式会社がシリコンウェーハの成膜加工やＳＯＩウェーハの製造販売を行い、エレクトロニクス事業の製品として開示されているため、2つ目に semiconductors を付けました。
- industry: エレクトロニクス事業が導電性素材や電子機器、人工衛星を扱う報告セグメントとして独立開示されているため、3つ目に electronics を付けました。
- relatedCompanies: 久光製薬：2026年3月31日現在、当社の株式1,090千株（1.85％）を所有する大株主だが、EDINETコードリストになく上場を確認できないため結ばない。
- relatedCompanies: トヨタ自動車、本田技研工業、三菱自動車工業、ゴールドウイン、アシックス、クラレ、ヨネックス、フクビ化学工業、立川ブラインド工業、トーソー、三谷産業、大東建託、清水建設、豊田通商：特定投資株式の保有目的が「主に○○事業における中長期的な関係強化等」の定型句のみで、具体的な取引の印字がないため結ばない。
- relatedCompanies: ほくほくフィナンシャルグループ、北陸電力、第一生命ホールディングス、みずほフィナンシャルグループ、三井住友フィナンシャルグループ、三井住友トラストグループ：金融機関のため結ばない。
- relatedCompanies: ユニチカ：2026年1月に岡崎事業所の繊維事業を承継した新会社の株式を取得した相手だが、買収・譲渡の相手方は結ばないため結ばない。
- relatedCompanies: 日新：上場でないため結ばない。
- relatedCompanies: キャリア、キング、エン、ステップ、イシン、ベース、ゼロ、フリー、イノベーション、ランド、コア、クリエイト、レック、ミサワ、プラネット、ポート、クイック、リコー、リックス、セキ、ベルテクスコーポレーション：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 連結子会社26社、非連結子会社3社、関連会社1社：すべて非上場のため結ばない。
- terms: 新たに提案する用語はありません。Viscotecs®などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 繊維事業 → 提案: textiles。東証の業種分類は繊維製品で、繊維技術を軸とする会社だが、閉じた分類に繊維を表す値がない。売上高の最も大きい報告セグメントは車輌資材のため automotive を暫定とした。
