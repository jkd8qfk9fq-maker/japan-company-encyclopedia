# コメリ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社コメリ |
| 証券コード | 8218 |
| docID（データを取り出した文書） | `S100YJBF` |
| 原本 docID | `S100YJBF` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJBF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社コメリ / 8218 / docID S100YJBF（id は英語表記「KOMERI CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 1 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
komeri: 10 件の数値を有報XBRLと照合
有報: 株式会社コメリ 有価証券報告書－第65期(2025/04/01－2026/03/31) (docID S100YJBF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第64期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
komeri: 本文の金額 1 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2027年3月期の見通しの数値は営業利益を含むため書かなかった。営業収益は印字ラベルが売上高及び営業収入のため増減率のみ使用。
- businessStructure: 報告セグメントはホームセンター事業のみ。その他事業の売上は販売実績表に印字があるが報告セグメントではないため最後に置いた。
- businessStructure: セグメント別の金額は本文に書かない（金額の独立開示がある区分だけ売上は可だが、簡潔さのため省略）。
- history: 沿革は有報の年表から主要な出来事を選んだ。合併・子会社設立の多くは省いた。
- industry: 売上の大半を占めるホームセンター事業（店舗小売）から小売を選んだ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業の候補を確認できないため結ばなかった。連結子会社（北星産業・ビット・エイ・コメリキャピタル・ライフコメリ・ムービータイム）は非上場のため対象外。農業協同組合は上場企業ではない。
- terms: 用語候補: PB商品（プライベートブランド）、ドミナント出店、BOPIS（ネットで注文し店舗で受け取る方式）。既存の用語集に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
