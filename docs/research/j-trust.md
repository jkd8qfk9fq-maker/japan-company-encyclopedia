# Jトラスト — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | Ｊトラスト株式会社 |
| 証券コード | 8508 |
| docID（データを取り出した文書） | `S100XSDT` |
| 原本 docID | `S100XSDT` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSDT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | Ｊトラスト株式会社 / 8508 / docID S100XSDT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
j-trust: 10 件の数値を有報XBRLと照合
有報: Ｊトラスト株式会社 有価証券報告書－第50期(2025/01/01－2025/12/31) (docID S100XSDT)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp030000-asr_E03724-000:OperatingRevenueIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":128170000000,"latestFiling":127395000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":8368000000,"latestFiling":8637000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業・財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
j-trust: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「Jトラスト株式会社」が EDINET の提出者名「Ｊトラスト株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックで差異のあった2024年12月期の営業収益（前期有報128,170百万円、当有報127,395百万円）は、非継続事業への分類に伴う組替えによるもので、financialNotesに記録しています。2024年12月期の税引前利益の差異も同じ組替えによるものです。
- businessModel: 経営指標の数値目標は本文の規則により記載していません。
- businessModel: 自己株式の取得及び消却（2025年5月14日決議、2025年12月12日に取得期間延長を決議）は日常的な資本政策のため、needsReviewには入れていません。
- businessStructure: 報告セグメントの名称は、当連結会計年度に連結子会社であるJ Trust Credit NBFIの全株式を譲渡したことに伴い、「韓国及びモンゴル金融事業」から「韓国金融事業」に変更しています。登録は変更後の名称と構成で記載しています。
- businessStructure: 投資事業の外部顧客への営業収益6百万円は、セグメント計196百万円からセグメント間の内部営業収益190百万円を差し引いた金額です。
- businessStructure: セグメントごとの外部顧客への営業収益の合計と、セグメント計の印字には1百万円から2百万円の差がありますが、有報の印字どおりに記載しています。
- businessStructure: 「その他」の区分は報告セグメントに含まれない事業セグメントのため、売上順にかかわらず最後に配置しています。
- history: 沿革表は崩れておらず、年月と事象の対応づけに行順の推測は使っていません。
- history: 株式の取得株数や自己株式の消却株数は、沿革の本文には記載していません。
- history: Wikipediaの記事冒頭は本社所在地と持株会社としての位置づけのみで、いずれも有報で確認できる内容のため使用していません。
- industry: 主たる業界は、営業収益の大半を占める金融事業で決めました。不動産事業は報告セグメントとして営業収益15,719百万円が開示されているため、2つ目の業界として不動産を付けました。
- relatedCompanies: trust（株式会社トラスト）：「Jトラスト」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: land（株式会社ランド）：「Jグランド」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: port（ポート株式会社）：「ホールディング体制」「サポート」などの一般語の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: career（株式会社キャリア）：「キャリアアップ」などの一般語の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: base-4481（ベース株式会社）：「連結ベース」などの一般語の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: rent（株式会社レント）：「ライブレント」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: step（株式会社ステップ）：「5ステップアプローチ」などの一般語の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: en（エン株式会社）：「エンターテインメント」の部分一致で、ambiguousのため結ばない。
- relatedCompanies: seki（セキ株式会社）：「セキュリティシステム」の部分一致で、ambiguousのため結ばない。
- relatedCompanies: tein（株式会社テイン）：「エンターテインメント」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: ray（株式会社レイ）：「フレイアクリニック」の部分一致で、ambiguousのため結ばない。
- relatedCompanies: corona（株式会社コロナ）：「コロナ禍」の一般語で、同社そのものの記載ではないため結ばない。
- relatedCompanies: espoir（株式会社エスポア）：前連結会計年度にエスポア株式を売却した過去1回限りの取引で、継続的な取引・提携の印字がないため結ばない。
- relatedCompanies: nansin（株式会社ナンシン）：「リファイナンシング」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: zenkoku-hosho（全国保証株式会社）：2005年に親会社となった過去の関係で、現在の取引・資本関係の印字がないため結ばない。
- relatedCompanies: core（株式会社コア）：「コア領域」の一般語で、ambiguousのため結ばない。
- relatedCompanies: hs-holdings（HSホールディングス株式会社）：2022年にエイチ・エス証券の全株式を譲り受けた過去1回限りの取引で、継続的な取引・提携の印字がないため結ばない。
- relatedCompanies: king（株式会社キング）：「プライベートバンキング」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: no-1（株式会社No．1）：インドネシアの銀行規制の番号の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: vision（株式会社ビジョン）：経営の「ビジョン」という一般語で、同社そのものの記載ではないため結ばない。
- relatedCompanies: 大株主の状況に載るNLHD株式会社（30.43％、代表取締役社長の資産管理会社）は非上場で候補データになく、ジャパンポケット株式会社、株式会社エスファイナンス、株式会社表参道キャピタル、公益財団法人藤澤記念財団も非上場のため結ばない。信託銀行などの保管機関は純投資のため結ばない。
- terms: 助言: 用語「信用保証」（銀行や信用金庫などの金融機関が行う貸付に対して保証を行う業務）は、この会社の中核事業を示す語として用語集への追加候補と考える。
- terms: 助言: 用語「債権回収」（金融機関などから買い取った貸付債権を回収する業務）は、この会社の中核事業を示す語として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
