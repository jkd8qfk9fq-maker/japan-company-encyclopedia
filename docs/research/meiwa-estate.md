# 明和地所 — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 明和地所株式会社 |
| 証券コード | 8869 |
| docID（データを取り出した文書） | `S100YJF1` |
| 原本 docID | `S100YJF1` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJF1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 明和地所株式会社 / 8869 / docID S100YJF1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
meiwa-estate: 10 件の数値を有報XBRLと照合
有報: 明和地所株式会社 有価証券報告書－第40期(2025/04/01－2026/03/31) (docID S100YJF1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
meiwa-estate: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 当連結会計年度より、従来「分譲事業」に含まれていた一部の土地売却等の「土地・建物」取引を「流通事業」に含める方法に変更した。前連結会計年度のセグメント情報は変更後の区分に基づき作成されており、5年間の指標への影響はないため、financialNotesには記載せず、ここに記録する。
- businessModel: 報告セグメントの外部顧客への売上高の合計は、印字の計89,978百万円に対し各セグメントの合計は89,977百万円となり、1百万円の差は有報の丸めによるものである。印字の合計を用いた。
- businessModel: MD&Aの分譲事業・流通事業の売上内訳（分譲マンション、土地・建物、手数料等）は事業分野別の内訳であり、childrenには金額を記載せず、記述のみとした。
- businessModel: 中期経営計画2027の期間中の株主還元方針（配当性向30％を目処）は資本政策の事項のため要約には入れず、ここに記録する。
- businessModel: 2027年3月期の連結業績予想は予想のため要約には入れず、ここに記録する。
- businessModel: 有報は自社の調達先について一般名詞での記述がなく、用地取得の相手先も特定されていないため、suppliersは記載しない。
- businessModel: 前連結会計年度に株式を取得し連結子会社化した株式会社坂惣商店は、当連結会計年度末の連結子会社3社の名称に含まれておらず、清算の記載もパックにないため、期末時点の扱いを書かなかった。
- businessModel: タケイチバリュアブル不動産及び立川木材市場の清算結了（2026年3月27日）は期中に完了したため、沿革に記載した。
- businessModel: 会計基準の変更や修正再表示はなく、セグメント区分の変更は表示の変更のみのため、financialNotesは空とした。
- businessStructure: グループの構成は、当社及び関係会社4社（連結子会社3社、非連結子会社1社）です。非連結子会社は明和地所住宅販売株式会社で、重要性がないため事業の内容の図及び文章には記載されていません。
- businessStructure: 「その他」の区分は報告セグメントに含まれない事業セグメントであり、住設企画販売事業等を含みます。childrenの金額は記載していません（MD&Aの内訳は事業分野別の金額のため）。
- history: 2006年12月、2008年4月、2015年4月は、それぞれ1つの年月セルに2つの事象が印字されており、年月と事象の数が合わないため、年月セルに続く事象文をその年月の出来事として2行に分けて記載した。
- history: 2018年10月と2019年7月の2つの年月セルに、名古屋支店の開設と明和リアルエステートの吸収合併の2つの事象文が続けて印字されており、行順で対応づけた。
- history: 1990年4月の吸収合併と社名変更は、1つの事象として1行に記載した。
- history: 沿革に資本金の記載はないため、設立時の資本金額は記載していない。
- history: 2026年の清算結了の行は、沿革ではなく【連結の範囲の変更】の記載に基づく。
- industry: 報告セグメントは分譲事業、流通事業、管理事業、賃貸事業の4つで、いずれも不動産関連のため、不動産のみとした。海外の外部顧客への売上高はなく、地域ごとの情報は省略されている。
- relatedCompanies: ana-holdings：特定投資株式に17,400株が載るのみで、保有目的は株主優待制度利用による出張時の経費削減であり、当社との取引・提携・資本関係の事実がないため結ばない。
- relatedCompanies: port：関連候補の文脈は「明和地所ライフサポート」の一部など、一般語の部分一致であり、ポート株式会社との取引の事実がないため結ばない。
- relatedCompanies: base-4481：文脈は「ベースとした金額」など一般語の部分一致であり、ベース株式会社との取引の事実がないため結ばない。
- relatedCompanies: land：文脈は「ブランドロゴ」の部分一致であり、株式会社ランドとの取引の事実がないため結ばない。
- relatedCompanies: en：ambiguousであり、一般語の部分一致のため結ばない。
- relatedCompanies: s-t：文脈は「リアルエステート」の部分一致であり、エステー株式会社との取引の事実がないため結ばない。
- relatedCompanies: suzuki-6785：文脈は役員名「鈴木真」の姓の一致であり、株式会社鈴木との取引の事実がないため結ばない。
- relatedCompanies: taya：文脈は大株主表の住所・氏名の部分一致であり、株式会社田谷との取引の事実がないため結ばない。
- relatedCompanies: trust：文脈は日本マスタートラスト信託銀行の部分一致であり、かつコードリストにないため結ばない。
- relatedCompanies: zero：文脈は「ネットゼロ」の部分一致であり、ambiguousのため結ばない。
- relatedCompanies: ray：文脈は「リプレイス」の部分一致であり、ambiguousのため結ばない。
- relatedCompanies: space：文脈は大株主表の「㈱スペース・Ｐ」の部分一致であり、株式会社スペースとは別の法人で、㈱スペース・Ｐ自体も関連候補にないため結ばない。
- relatedCompanies: tryt：文脈は「アセットライト」の部分一致であり、かつコードリストにないため結ばない。
- relatedCompanies: 大株主の筆頭株主である株式会社英興発（37.32％）は非上場で関連候補になく、エントリもないため結ばない。ＳＭＢＣ日興証券、㈱スペース・Ｐ、㈱ＧＴ、㈱ＦＵＫＵも非上場で関連候補にないため結ばない。信託銀行2行は信託業務に係る保有で純投資のため結ばない。個人株主は結ばない。
- relatedCompanies: 連結子会社3社（明和地所コミュニティ、明和地所ファイナンス、明和地所ライフサポート）は当社グループ自身の子会社であり、関連企業のリンクとはしない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
