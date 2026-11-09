# 品川リフラ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 品川リフラ株式会社 |
| 証券コード | 5351 |
| docID（データを取り出した文書） | `S100YFV6` |
| 原本 docID | `S100YFV6` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFV6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 品川リフラ株式会社 / 5351 / docID S100YFV6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shinagawa-refra: 10 件の数値を有報XBRLと照合
有報: 品川リフラ株式会社 有価証券報告書－第192期(2025/04/01－2026/03/31) (docID S100YFV6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shinagawa-refra: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「品川リフラ株式会社（旧会社名　品川リフラクトリーズ株式会社）」が EDINET の提出者名「品川リフラ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載がありますが、表示方法の変更（保険配当金56百万円・助成金収入20百万円・固定資産税20百万円を「その他」へ、半成工事102百万円を仕掛品へ）によるもので、売上高・当期純利益の範囲に変化はなく、修正再表示チェックでも前期有報との全行一致を確認したため、financialNoteは書きませんでした。
- businessModel: 第190期において企業結合に係る暫定的な会計処理の確定を行っていますが、修正再表示チェックで全行一致を確認し、売上高・当期純利益の範囲に変化がないため、financialNoteは書きませんでした。
- businessModel: 2026年3月期の売上高1,777億38百万円と前年同期比23.4％増は、MD&Aの印字どおりです。
- businessStructure: 札幌証券取引所にも上場していますが、市場区分の印字がないため、listingsにはexchangeのみを記載しました。
- industry: 主たる事業は耐火物・断熱材・ファインセラミックスで、東証の業種分類はガラス・土石製品ですが、閉じた分類に合う値がないため、最も近いchemicalsを暫定で主たる業界としました。先端機材セグメントで半導体製造装置関連製品を事業として開示しているため、semiconductorsを2つ目に付けました。
- relatedCompanies: JFEスチール株式会社は当社の株式の34.85％を保有する筆頭株主で、2026年3月期の売上高53,059百万円の主要な顧客ですが、related-candidates.jsonにないため結べませんでした。親会社のJFEホールディングス株式会社をother-affiliated-companyとして結びました。
- relatedCompanies: 特定投資株式の表に載る相手（みずほフィナンシャルグループ、三井住友フィナンシャルグループ、七十七銀行、ちゅうぎんフィナンシャルグループ、横浜フィナンシャルグループ、めぶきフィナンシャルグループ、大和証券グループ本社、第一ライフグループ、太平洋セメント、大同特殊鋼、三菱ケミカルグループ、三菱重工業、合同製鐵、中山製鋼所、愛知製鋼、タクマ）は、保有目的が「取引関係の維持、強化」の定型句のみで、具体的な取引の印字がないため結びませんでした。
- relatedCompanies: 大株主の状況に載る信託銀行（日本マスタートラスト信託銀行、日本カストディ銀行、三井住友信託銀行）、みずほ銀行、日本生命保険、富国生命保険は金融機関の純投資のため結びませんでした。品川リフラ社員持株会は会社ではないため結びませんでした。
- relatedCompanies: 連結子会社42社・関連会社6社はすべて非上場または海外法人のため結びませんでした。
- relatedCompanies: en、ランド、ビジョン、セキ、ポート、コア、ステップ、パス、ゼロ、イノベーション、ベースなどは断片一致のみで、関連企業として結ぶ根拠がありません。
- relatedCompanies: イソライト工業株式会社（断熱材事業の連結子会社、議決権100％）は非上場のため結べませんでした。
- terms: 新たに提案する用語はありません。耐火物、モールドパウダー、築炉工事などの事業用語は本文で説明しています。

## 要確認（status に反映）

- businessModel: 連結子会社のShinagawa Refractories Australasia Pty Ltd.のクイナナ工場について、西オーストラリア州政府による土地収用と工場移転が決まり、2026年3月4日に土地の引渡しを完了しました。補償額は35.7百万豪ドル（約3,897百万円）で、譲渡益約3,712百万円を2027年3月期第1四半期に特別利益として計上する予定です。新工場は2028年9月頃の稼働開始を予定しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 品川リフラの主たる業界 → 提案: glass-and-ceramics。東証の業種分類はガラス・土石製品で、耐火物・断熱材・ファインセラミックスが主たる事業のため、chemicalsでは言い表せません。
