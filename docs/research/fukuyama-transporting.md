# 福山通運 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 福山通運株式会社 |
| 証券コード | 9075 |
| docID（データを取り出した文書） | `S100YIXL` |
| 原本 docID | `S100YIXL` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIXL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 福山通運株式会社 / 9075 / docID S100YIXL（id は英語表記「FUKUYAMA TRANSPORTING CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 7 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fukuyama-transporting: 10 件の数値を有報XBRLと照合
有報: 福山通運株式会社 有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YIXL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第77期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第76期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第74期(2021/04/01－2022/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第75期(2022/04/01－2023/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第73期(2020/04/01－2021/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fukuyama-transporting: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高・当期純利益は brief.md の5年表（XBRL）の値。セグメント別売上高は【セグメント情報】の外部顧客への売上高。
- businessModel: 売上増減の理由は本工程では md-and-a を読んでおらず、書いていない。
- businessStructure: 並び順は【セグメント情報】の外部顧客への売上高の大きい順（運送244,573、貸切27,807、流通加工23,700、国際15,244）。「その他」は報告セグメントに含まれない区分のため最後。
- businessStructure: 運送事業と貸切事業は【事業の内容】では一体の区分だが、セグメント情報では別個に表示されているため、2つに分けた。
- businessStructure: 区分ごとの子会社数は【事業の内容】の印字どおり（重複して複数区分に数えられる会社がある）。
- businessStructure: Wikipedia は使っていない（有報で足りるため）。
- history: 沿革は表が崩れておらず、年月と事象が対応している。連絡運輸の提携や子会社設立の多くは数が多いため省いた。
- history: 近鉄グループホールディングスとの1960年の資本提携は、沿革に印字された過去の出来事のため history には入れず、関連企業にも結んでいない。
- industry: 運送事業が外部顧客への売上高の最大の区分のため、運輸を主たる業界にした。
- relatedCompanies: 近鉄グループホールディングス: 1960年の資本提携は沿革の過去の出来事のみで、現在の関係を述べる記載がなく結ばない。
- relatedCompanies: セイノーホールディングス: 2013年の業務提携は沿革の1行のみで、現在の取引・提携内容の記載がなく結ばない。
- relatedCompanies: 乾汽船: 2021年の業務提携は沿革の1行のみで結ばない。
- relatedCompanies: ANAホールディングス・トヨタ自動車・いすゞ自動車・SOMPOホールディングス・住友不動産ほか政策保有株式の相手: 保有株式の表に載るだけで、取引関係の記載が相手ごとにないため結ばない。
- relatedCompanies: 三菱UFJ・みずほ・野村ホールディングス: 退職給付信託の保有で関係なし。
- relatedCompanies: エン・パス・コアほか一般名詞に一致した候補: 社名の偶然の一致で同一性の根拠がなく結ばない。
- relatedCompanies: 日本生命・広島銀行は金融機関で、候補にもないため結ばない。大創産業は候補になく結ばない。
- terms: 助言: 「特別積合せ」「3PL」「利用運送」「連絡運輸」は読者に説明があると助かる用語。登録の有無は未確認のため、リンクは本文に使っていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
