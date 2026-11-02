# しまむら — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社しまむら |
| 証券コード | 8227 |
| docID（データを取り出した文書） | `S100Y2PP` |
| 原本 docID | `S100Y2PP` |
| 提出日（原本） | 2026-05-12 |
| 決算期 | 2026-02-20 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y2PP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社しまむら / 8227 / docID S100Y2PP（id は英語表記「SHIMAMURA CO., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shimamura: 10 件の数値を有報XBRLと照合
有報: 株式会社しまむら 有価証券報告書－第73期(2025/02/21－2026/02/20) (docID S100Y2PP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shimamura: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIで確認（2025年2月21日〜2026年2月20日、2026年2月期）。変則決算ではない。
- businessModel: 営業利益・経常利益は有報に印字があるが、規則に従い本文には書かなかった。
- businessModel: CLOSSHI・ASEAN生産比率はMD&Aのしまむら事業の記述による。
- businessModel: 店舗数2,233（国内）・45（台湾）・2,278（合計）はMD&Aの都道府県別表の印字。
- businessStructure: 報告セグメントは「日本」「海外」の2つ（地域別）。外部顧客への売上高は日本689,702百万円・海外10,332百万円で、この順に並べた。
- businessStructure: 日本の children の5業態は【事業の内容】が挙げる業態で、業態別の売上高と店舗数は MD&A の印字（セグメント注記の金額ではない）。並びは売上高の大きい順（しまむら→バースデイ→アベイル→シャンブル→ディバロ）で、有報の記載順とは異なる。
- businessStructure: products は MD&A の売上実績表にある事業部門名を使った（しまむらの8部門、アベイルの4部門、バースデイの3部門）。シャンブル・ディバロは表に部門が無いため【事業の内容】の商品説明の語を使った。表は部門行のあとに事業の合計行（しまむら・アベイル・バースデイ）が来る形式なので、部門は直後の合計行の事業に対応づけた。
- businessStructure: listings の market「プライム」は表紙の『東京証券取引所プライム市場』による。
- businessStructure: name は表紙の会社名から法人格を除いた。
- history: 沿革表の一部は年月セルが続けて印字されている（2009年6月/8月、2015年12月/2016年12月、2016年12月/2017年11月、2020年10月〜2021年11月）。2009年は年月2つと事象2つが対応するため行順で対応づけた（6月＝簡易株式交換で完全子会社化、8月＝合併）。ただし簡易株式交換の月は印字順の判断で、アベイルの項は年のみで記した。
- history: 2015〜2017年・2021年1〜4月（新本社ビル）の崩れた行は、日付を他の節で裏付けられないため使わなかった（2016年12月の2,000店舗達成のみ、店舗数の記録としてまとめて引用した。これは事象文に年月が印字されている行）。
- history: 2011年の上海子会社の項の「2020年に全店閉店」は有報の沿革の括弧書き。
- industry: 売上のほぼすべてが衣料品を主とするチェーンストアの小売（報告セグメントは日本・海外とも小売）のため、retail のみ。
- relatedCompanies: related-candidates.json は証拠パックに存在しない（候補なし）。
- relatedCompanies: 思夢樂股份有限公司（連結子会社・議決権100.0％）は台湾の非上場会社で、掲載済み上場企業ではないため結ばない。
- relatedCompanies: 【事業の内容】の系統図の注記（主要株主・代表取締役が役員の近親者である会社）は社名が本文にない。
- terms: 用語集への追加候補（助言）：プライベートブランド（PB）、ジョイントデベロップメントブランド（JB）、チェーンストア、集中仕入、ファッションモール。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
