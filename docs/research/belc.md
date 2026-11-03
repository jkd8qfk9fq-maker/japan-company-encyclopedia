# ベルク — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ベルク |
| 証券コード | 9974 |
| docID（データを取り出した文書） | `S100Y4X3` |
| 原本 docID | `S100Y4X3` |
| 提出日（原本） | 2026-05-20 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y4X3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ベルク / 9974 / docID S100Y4X3（id は英語表記「Belc CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
belc: 10 件の数値を有報XBRLと照合
有報: 株式会社ベルク 有価証券報告書－第67期(2025/03/01－2026/02/28) (docID S100Y4X3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
belc: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 利益は売上と当期純利益だけを書いた。有報は営業利益・経常利益・売上総利益などを印字しているが、規則により本文に出していない。
- businessModel: 商品別の販売実績は MD&A の表から。営業収益（売上高と営業収入の合計）は売上高と別なので使っていない。
- businessModel: financialNotes は変則決算・会計基準変更がないため空。
- businessStructure: 決算期は表紙のDEIから2026年2月期（第67期、2025年3月1日〜2026年2月28日）。訂正なし、修正再表示なし。
- businessStructure: 単一セグメントで【関連情報】の製品区分も省略されているため、children には MD&A の「商品別売上状況」（金額・前年比が印字されている唯一の区分）を使い、2026年2月期の売上高の大きい順に並べた。有報の表の並びは青果・海産・精肉・デリカ・一般食品・菓子・雑貨・グロサリーギフトで、そのまま写していない。
- businessStructure: 商品別の「生鮮計」「グロサリー計」は計の行なので children にしなかった。各区分にどの商品が入るかは有報に説明がなく、書いていない。
- businessStructure: 営業収入（6,917百万円）を含む営業収益423,432百万円は売上高と別の概念なので、本文では売上高416,514百万円を使った。
- businessStructure: おおやファーム株式会社との資本提携（2025年4月）は有報の沿革に名称だけがあり、事業内容の説明がないため書かなかった。
- history: 沿革の表は年月と事象が正しく対応して読めたため、そのまま使った。
- history: 1年に複数の出来事がある年（1994、2008、2022、2025）は1項目にまとめた。1990年代前半のセンター開設、2002〜2005年の拡張、2014年のチルドセンター、2016年のトレーニングセンターなどの設備関連は省いた。
- history: 2025年4月のおおやファーム株式会社との資本提携は、有報に相手の事業内容や出資割合の説明がないため、名称と契約締結のみ書いた。
- industry: 小売業のみの単一セグメント（食品スーパー）のため retail。
- relatedCompanies: イオン株式会社：有報が業務・資本提携（2006年7月）と取締役1名の受入れ（2007年5月〜）を述べ、関係性の根拠はある。ただし証拠パックに related-candidates.json が無く、同一性（掲載済み・上場）を確認できないため結ばなかった。有報自身が「関係会社の状況」には記載していないと書いている。
- relatedCompanies: 連結子会社4社（ホームデリカ、ジョイテック、マルイチ水産ＬＴＤ、ナカムラ米販）：related-candidates.json が無く、掲載済み上場企業かを確認できないため結ばなかった（いずれも非上場の子会社とみられる）。
- relatedCompanies: おおやファーム株式会社：沿革に資本提携契約の締結だけがあり、取引・提携の内容の説明がないため結ばなかった。
- relatedCompanies: イオンフィナンシャルサービス㈱：関連当事者注記にクレジット業務委託等があるが、資金・決済の取引で、候補ファイルもないため結ばなかった。
- terms: 用語の候補：ドミナント出店（特定地域に集中して出店し店舗密度を高める戦略）、プライベートブランド（自社開発商品）、自社物流。既存の用語集に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
