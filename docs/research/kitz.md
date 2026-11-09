# キッツ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社キッツ |
| 証券コード | 6498 |
| docID（データを取り出した文書） | `S100XS6X` |
| 原本 docID | `S100XS6X` |
| 提出日（原本） | 2026-03-19 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XS6X.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社キッツ / 6498 / docID S100XS6X（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kitz: 10 件の数値を有報XBRLと照合
有報: 株式会社キッツ 有価証券報告書－第112期(2025/01/01－2025/12/31) (docID S100XS6X)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kitz: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 表示方法の変更（ベトナムの有形固定資産の区分掲記）は、売上高・当期純利益の範囲に変化がなく、修正再表示チェックで全行一致のため financialNote は書きませんでした。
- businessModel: 重要な後発事象（KITZ Corp. of America の固定資産の譲渡、2026年1月28日付で譲渡完了）は固定資産の譲渡であり、事業構成に影響しないため warnings のみに記録しました。
- businessStructure: 事業の並び順は、2025年12月期の外部顧客への売上高の大きい順です。「その他」は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: 伸銅品事業は2026年1月1日より「メタルソリューション事業」にセグメント名称を変更しています。名称のみの変更で、2025年12月期の記載は伸銅品事業のままです。
- history: 沿革の表で、2015年11月と2018年4月、2023年9月と2024年3月の年月セルと事象文が分かれて印字されていたため、行順で対応づけました（2015年11月→ブラジル子会社の取得、2018年4月→韓国子会社の取得、2023年9月→韓国子会社の吸収合併、2024年3月→指名委員会等設置会社への移行）。
- history: 1944年7月1日の不二家航空電機株式会社としての設立は、有報で実質上の存続会社は1951年設立の株式会社北澤製作所とされているため、沿革の起点は1951年としました。
- industry: 主たる業界は、売上高の大半を占めるバルブ事業と東証の業種分類（機械）から機械としました。
- industry: 半導体製造装置向けのバルブや半導体薬液用フィルターなどを事業として開示しているため、半導体を2つ目に付けました。
- relatedCompanies: ヤマトとアルコニックスは得意先と仕入先の両方の向きが印字されています。得意先を主として customer とし、仕入先でもある旨を説明文に書きました。
- relatedCompanies: PILLARはバルブ事業の主要仕入先と印字されていますが、related-candidates.json にないため結びませんでした。
- relatedCompanies: CKサンエツ・SANEI・日本伸銅・オーケーエム・ユーグレナは100〜1,000株の僅少な保有で、株主・投資家向け情報の取得のみが目的のため結びませんでした。
- relatedCompanies: タクマと第一生命ホールディングスは当事業年度に全株式を売却済みのため結びませんでした。
- relatedCompanies: Unimech Group Berhadは資本業務提携先ですが、海外の非上場法人のため結びませんでした。
- relatedCompanies: 大株主の状況に載るのは信託銀行・保険会社・持株会などで、事業会社の大株主として結べる相手はありませんでした。
- relatedCompanies: 親会社等はありません。
- relatedCompanies: en・vision・seki・core・suzuki-6785・zero・port・base-4481・innovation・land・slogan・king・trust・freee・path・the-lead・kohsoku・rix・cota・rent・ricoh・secomは断片一致のみで、取引・提携・資本関係の印字がないため結びませんでした。
- relatedCompanies: fujiya（不二家）は1944年の設立時の社名に関する歴史的事実のみで、現在の取引関係の印字がないため結びませんでした。
- relatedCompanies: arata（あらた）は「あらためて」の断片一致のみのため結びませんでした。
- terms: 新たに提案する用語はありません。バルブ、伸銅品、濾過関連製品などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
