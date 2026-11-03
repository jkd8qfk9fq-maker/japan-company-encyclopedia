# 住友ファーマ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 住友ファーマ株式会社 |
| 証券コード | 4506 |
| docID（データを取り出した文書） | `S100YH3M` |
| 原本 docID | `S100YH3M` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH3M.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 住友ファーマ株式会社 / 4506 / docID S100YH3M（id は英語表記「Sumitomo Pharma Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sumitomo-pharma: 10 件の数値を有報XBRLと照合
有報: 住友ファーマ株式会社 有価証券報告書－第206期(2025/04/01－2026/03/31) (docID S100YH3M)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sumitomo-pharma: 本文の金額 17 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…当期の最終損益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益と当期利益は brief の5年表・注記の印字値です。当期利益の名称は『親会社の所有者に帰属する当期利益』です。
- businessModel: financialNotes は文字列の配列にしました。スキーマが文字列を要求する場合は結合してください。
- businessModel: 売上構成の『日本の医療機関・薬局向け』は有報に販売先の記載が無いため一般的な表現にとどめ、必要なら削る候補です。
- businessModel: ライセンス収入・合弁相手との契約の詳細は重要な契約の節を読んでいないため書いていません。
- businessStructure: 並び順は注記「事業セグメント」の外部顧客への売上収益の大きい順（北米337,923／日本92,365／アジア23,006百万円）。報告セグメントは3つだけで、その他の区分はありません。
- businessStructure: セグメント利益（コアセグメント利益）は本文に書いていません。
- businessStructure: アジアは2025年7月の承継で連結から外れたため、前期比の減収は事業再編の影響を含みます。
- businessStructure: related-candidates.json が証拠パックに無かったため、関連企業は有報の【関係会社の状況】とリポジトリの掲載一覧から判断しました。
- history: 沿革の表は崩れておらず、年月と事象が対応しているため、そのまま使いました。
- history: 1947年の五協産業設立、1968年の鈴鹿工場、1971年の総合研究所などは紙幅のため省きました。
- industry: 3つの報告セグメント（日本・北米・アジア）はすべて医療用医薬品の製造、仕入、販売のため、医薬品のみにしました。
- relatedCompanies: related-candidates.json が無かったため、掲載済み企業は src/data/companies の存在で確認しました（sumitomo-chemical, marubeni）。
- relatedCompanies: marubeni：丸紅ファーマシューティカルズ株式会社（持分法適用関連会社）の共同出資者は丸紅グローバルファーマ株式会社で、有報に丸紅株式会社の名は無く、同一性の根拠が足りないため結びません。
- relatedCompanies: 丸紅ファーマシューティカルズ、S-RACMO、RACTHERA、住友ファーマプロモ、Sumitomo Pharma America：非上場または掲載対象外のため結びません。
- relatedCompanies: Cencora, McKesson, Cardinal Health：米国法人のため結びません。
- terms: 助言のみ。本文に [[term:...]] リンクは使っていません。用語集に『オーソライズド・ジェネリック』『合弁会社』『持分法適用関連会社』があれば、今後の説明で役立ちます。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
