# アース製薬 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アース製薬株式会社 |
| 証券コード | 4985 |
| docID（データを取り出した文書） | `S100XSLS` |
| 原本 docID | `S100XSLS` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSLS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アース製薬株式会社 / 4985 / docID S100XSLS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
earth: 10 件の数値を有報XBRLと照合
有報: アース製薬株式会社 有価証券報告書－第102期(2025/01/01－2025/12/31) (docID S100XSLS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
earth: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年改正会計基準を2025年12月期の期首から適用し、2024年12月期の数値は遡及適用後のものです。改訂チェックで前期有報との全行一致を確認し、売上高・当期純利益の範囲に変化がないため、financialNoteは書きませんでした。
- businessModel: 2025年12月期から園芸用品を虫ケア用品から分離して表示する方法に変更し、2024年12月期も組み替えて表示しています。売上高の範囲に変化がないため、financialNoteは書きませんでした。
- businessModel: 中期経営計画の定量目標には営業利益70億円と親会社株主に帰属する当期純利益43億円もありますが、利益の数値は本文に書かないため、売上高の目標1,700億円のみを書きました。
- businessModel: バスクリンの吸収合併は2026年1月1日に完了し、有価証券報告書の提出日（2026年3月24日）より前に完了しているため、沿革に記録し、needsReviewには入れていません。
- businessStructure: 子セグメントの売上高（虫ケア用品61,386百万円、日用品65,717百万円、園芸用品7,594百万円、ペット用品・その他10,565百万円）の合計は145,262百万円で、家庭用品事業の外部売上高145,263百万円と1百万円の差がありますが、有報の印字どおりです。
- history: 沿革は15件までに絞り、2023年のBARTH事業の譲受けや2025年2月のプロトリーフの子会社化などの行は割愛しました。
- industry: 日用品の製造販売が主たる事業で、東証の業種分類でも化学に属するため、chemicalsを主たる業界としました。総合環境衛生事業はサービス事業ですが、閉じた分類に合う値がないため業界は付けていません。
- relatedCompanies: PALTACは主要な顧客で2025年12月期の売上高45,667百万円を占めるが、related-candidates.jsonにないため結ばず。
- relatedCompanies: 主要な顧客の「㈱大木」は大木ヘルスケアホールディングスの子会社で、related-candidates.jsonには大木ヘルスケアホールディングスのみがあるため、主要顧客としては結ばず（同社は特定投資株式の保有目的に基づきcustomerとして結んだ）。
- relatedCompanies: ちゅうぎんフィナンシャルグループは取引金融機関のため結ばず（銀行ルール）。
- relatedCompanies: エンチョーとウエルシアホールディングスは株式交換により株式数が0株となったため結ばず。
- relatedCompanies: トライアルホールディングスは2024年12月期に保有目的を純投資目的に変更したため、取引・提携の根拠がなく結ばず。
- relatedCompanies: land、zero、career、port、base-4481、path、seki、core、corona、garden、king、no-1、sloganは断片一致のみのため結ばず。
- relatedCompanies: s-tは、有報の「大塚エステート」が上場のエステー株式会社とは別会社のため結ばず。
- relatedCompanies: 大株主の大塚製薬、大塚製薬工場、大鵬薬品工業は非上場のため結ばず（大塚ホールディングスはその他の関係会社として結んだ）。
- relatedCompanies: 連結子会社13社はすべて非上場のため結ばず。
- terms: 新たに提案する用語はありません。虫ケア用品、衛生管理サービスなどの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
