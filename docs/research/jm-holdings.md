# ＪＭホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＪＭホールディングス |
| 証券コード | 3539 |
| docID（データを取り出した文書） | `S100Z9E6` |
| 原本 docID | `S100Z9E6` |
| 提出日（原本） | 2026-10-27 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z9E6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＪＭホールディングス / 3539 / docID S100Z9E6（S100WWAM から新しい有報に更新。旧成果物は pipeline/analysis/superseded/jm-holdings-S100WWAM/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z9E6） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jm-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ＪＭホールディングス 有価証券報告書－第48期(2025/08/01－2026/07/31) (docID S100Z9E6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
jm-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社JMホールディングス」が EDINET の提出者名「株式会社ＪＭホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 表示方法の変更の注記は、営業外収益の「受取利息」の独立掲記だけで、売上高と当期純利益の範囲に変更はないため、financialNotes には追加していない。修正再表示チェックも重複年度の全行で一致した。
- businessModel: 2025年11月1日付の普通株式1株につき2株の株式分割は、1株当たり数値のみのため、financialNotes には追加していない。
- businessModel: 重要な後発事象の自己株式の取得（2026年9月11日取締役会決議、194万株・20億円を上限、2026年9月14日～2027年7月31日）は資本政策のため、needsReview には入れていない。
- businessModel: 中期経営計画の営業利益15,000百万円、経常利益15,100百万円、親会社株主に帰属する当期純利益9,100百万円の目標値は、利益区分の金額のため本文には書いていない。売上高経常利益率4％以上の目標も利益区分のため書いていない。
- businessModel: フィデリティの大量保有報告は、会社が実質所有を確認できていないため大株主の状況に含まれておらず、関連企業には結んでいない。
- businessModel: Wikipedia の記事はジャパンミートのもので、有報にない補足として使う事実がなかったため使っていない。
- businessStructure: 業態ごとの売上高は印字されていないため、children には金額を書いていません。
- industry: スーパーマーケット事業が売上高の大半を占めるため、小売を主たる業界としました。その他事業は報告セグメントに含まれず売上高も小さいため、業界は付けていません。
- relatedCompanies: エスフーズは1,000株・計上額2百万円と小規模で、保有目的が「業界動向等の情報収集のため」の情報収集のみのため結んでいません。
- relatedCompanies: スーパーバリューはコードリストになく掲載企業リストにないため結んでいません。
- relatedCompanies: 連結子会社10社はすべて非上場のため、子会社として結んでいません。
- relatedCompanies: como・base-4481・en・corona・ishin・showcase・core・land・trust は語の断片一致のみのため結んでいません。
- relatedCompanies: フィデリティの大量保有報告は、会社が実質所有を確認できていないため大株主の状況に含まれておらず、結んでいません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
