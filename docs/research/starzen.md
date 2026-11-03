# スターゼン — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | スターゼン株式会社 |
| 証券コード | 8043 |
| docID（データを取り出した文書） | `S100YIM9` |
| 原本 docID | `S100YIM9` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIM9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | スターゼン株式会社 / 8043 / docID S100YIM9（id は英語表記「Starzen Company Limited」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
starzen: 10 件の数値を有報XBRLと照合
有報: スターゼン株式会社 有価証券報告書－第87期(2025/04/01－2026/03/31) (docID S100YIM9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
starzen: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: customers の「量販店」「外食企業」「食品メーカー」は、沿革の量販店向け販売部門・日本マクドナルドとの取引契約・加工食品の位置づけから置いた一般的な区分。有報に顧客構成の記載はない（10％以上の顧客なしのみ）。
- businessModel: 財務の補足は株式分割のみ。決算期の変更・変則決算はない。
- businessStructure: 報告セグメントは食肉関連事業のみ。単一セグメントのため【関連情報】の製品区分を children にした（食肉・加工食品・ハム・ソーセージ・その他の売上順）。
- businessStructure: 「その他の事業」は報告セグメントではないので最後に置いた。金額は MD&A の事業部門別表の印字。
- history: 沿革は約60行のうち主要な出来事を選んだ。省いたのは工場・営業所の新設、細かな子会社の設立・再編。
- history: 2026年4月の出来事は決算期末後で、沿革に完了形で印字されているため掲載した。
- industry: 報告セグメントは食肉関連事業のみで売上の大半を占めるため、食品を主たる業界にした。
- relatedCompanies: related-candidates.json が証拠パックに無かったため、三井物産は【関係会社の状況】の印字と src/data/companies/mitsui-and-co.json の存在で同一性を確認した。上場区分は未確認（東証上場の総合商社）。
- relatedCompanies: プライフーズ: 持分法適用関連会社だが related-candidates.json で上場の同一性を確認できず結ばない。
- relatedCompanies: 日本マクドナルドホールディングス: 保有株式の表に載るのみ（営業取引関係維持が目的の定型記載）で、取引の向き・内容が有報で述べられておらず結ばない。
- relatedCompanies: その他の子会社・関連会社（非上場）は上場企業ではないため対象外。
- terms: 助言: 用語として「部分肉」「枝肉」「肥育」「持分法適用関連会社」「その他の関係会社」「Wagyu（和牛の輸出）」が説明対象になりうる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
