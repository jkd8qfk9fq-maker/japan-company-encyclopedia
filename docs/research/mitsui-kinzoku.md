# 三井金属 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三井金属株式会社 |
| 証券コード | 5706 |
| docID（データを取り出した文書） | `S100YBQV` |
| 原本 docID | `S100YBQV` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBQV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 三井金属株式会社 / 5706 / docID S100YBQV |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsui-kinzoku: 10 件の数値を有報XBRLと照合
有報: 三井金属株式会社 有価証券報告書－第101期(2025/04/01－2026/03/31) (docID S100YBQV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitsui-kinzoku: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「三井金属株式会社(旧会社名　三井金属鉱業株式会社)」が EDINET の提出者名「三井金属株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 営業利益・経常利益・セグメント利益は本文に書かない方針で省いた。
- businessModel: 従業員数は12,097人から8,188人に減ったが、理由の印字を確認していないため本文には書かなかった。
- businessStructure: 事業の並びは外部顧客への売上高の順（機能材料→金属→その他の事業→自動車部品）。
- businessStructure: 2025年4月1日付の組織改編で報告セグメントを『モビリティ』から『自動車部品』に変更。前期は変更後の区分で組み替え済み。
- businessStructure: related-candidates.json が証拠パックに無いため、関連企業は選べなかった。
- history: 沿革の表は崩れておらず、年月と事象は印字どおりに対応づけた。重要な出来事を選んで載せた。
- industry: 報告セグメント（機能材料・金属）の素材メーカーで、最も近い値として chemicals を暫定選択。半導体はパッケージ基板向け極薄銅箔・半導体装置保護膜材料を機能材料の製品として開示しているため2つ目に付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業の一覧と照合できないため、関連企業は結ばなかった。
- relatedCompanies: パンパシフィック・カッパー㈱（持分法適用関連会社、32.2%）: 有報に関係はあるが、候補ファイルで上場企業としての同一性を確認できない。
- relatedCompanies: 三井住友金属鉱山伸銅㈱（持分法適用関連会社、50.0%）: 同上。
- relatedCompanies: パウダーテック㈱・㈱ナカボーテック（持分法適用関連会社）: 同上。
- relatedCompanies: JX金属・住友金属鉱山: 沿革の共同出資の記述のみで、候補ファイルでの同一性を確認できず、過去の設立時の提携のため結ばなかった。
- terms: 用語の候補（助言のみ）: 電解銅箔・キャリア付極薄銅箔、排ガス浄化触媒、スパッタリングターゲット、製錬（受託製錬）、持分法適用関連会社、報告セグメント。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 三井金属の主たる業界 → 提案: non-ferrous-metals（非鉄金属・素材）。売上の大半が非鉄金属の製錬・金属と、電子材料用の銅箔・触媒などの素材で、化学や機械などの既存区分に収まらない。
