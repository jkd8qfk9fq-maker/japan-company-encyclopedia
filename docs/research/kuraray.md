# クラレ — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社クラレ |
| 証券コード | 3405 |
| docID（データを取り出した文書） | `S100XSSZ` |
| 原本 docID | `S100XSSZ` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSSZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 株式会社クラレ / 3405 / docID S100XSSZ |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kuraray: 10 件の数値を有報XBRLと照合
有報: 株式会社クラレ 有価証券報告書－第145期(2025/01/01－2025/12/31) (docID S100XSSZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kuraray: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙DEIの2025年12月期。summary.json の fiscalYearChange は null、irregularPeriods は空、修正再表示なし。
- businessModel: 金額は売上高（セグメント注記・地域ごとの情報）と当期純利益（MD&A）のみ。営業利益・経常利益・減損損失額・総資産などは書いていない。前期比の％はMD&Aの印字（売上高2.2％減、当期純利益76.5％減）。
- businessModel: 地域ごとの売上高の合計は808,447百万円で印字の合計と一致する。
- businessModel: financialNotes は空。変則決算・会計基準の変更はない。
- businessModel: 投資家向けの指標（時価ベースの自己資本比率・株主還元方針・自己株式の取得）は書いていない。2026年2月の自己株式取得の決議は後発事象。
- businessModel: [[term:…]] リンクは存在を確認していないため使っていない。
- businessStructure: 決算期は表紙DEIの第145期（2025年1月1日〜2025年12月31日）、Japan GAAP、連結あり。訂正報告書なし（summary.json amendments status none）。上場は表紙の『東京証券取引所プライム市場』。
- businessStructure: 並び順は【セグメント情報】の外部顧客への売上高（2025年12月期）：ビニルアセテート387,169＞機能材料202,208＞トレーディング67,343＞イソプレン61,057＞繊維56,265。『その他』34,404は報告セグメントに含まれない区分なので最後。MD&Aの順（ビニルアセテート・イソプレン・機能材料…）には従っていない。
- businessStructure: 【関連情報】の製品区分別売上高（ビニルアセテート398,582、機能材料205,579、イソプレン76,941、繊維87,314）はトレーディング子会社の売上を各製品区分へ配分した値で、セグメント注記の外部顧客への売上高と異なる。並びと金額は報告セグメントの値を使い、製品区分の値は書いていない。
- businessStructure: 営業利益・セグメント利益・減損損失・資産などの金額は本文に書いていない。MD&Aの利益面の説明は省いた。
- businessStructure: 2025年5月1日にクラレクラフレックス㈱を吸収合併した（関係会社の状況の注記）。繊維セグメントの不織布は、関連情報の製品例から2025年12月期で消えている。
- businessStructure: children は使っていない（複数セグメントの会社）。
- history: 沿革は有報の【沿革】の表から、事業の柱になった出来事（創業・主要製品の生産開始・買収・上場）を12件選んだ。そのほかの工場の操業開始・子会社の設立は省いた。
- history: 1983年・1991年・1996年・2000年の米国子会社の社名変更・再編（Kuraray America, Inc. など）は複雑なので、年表の項目にしていない。
- industry: primary は chemicals の1つ。売上の大半を占めるビニルアセテート（外部顧客への売上高 387,169百万円）、イソプレン、機能材料はいずれも樹脂・化学品の製造・販売。
- industry: semiconductors は付けていない。有報の製品説明・MD&Aに半導体向けの部材を事業として挙げる記述は、読んだ範囲（事業の内容・セグメント・MD&A）にない。光学用ポバールフィルムはテレビ向け。
- industry: 繊維（人工皮革・ビニロン、外部顧客への売上高 56,265百万円）は報告セグメントで独立しているが、化学繊維の区分が閉じた値にない。textiles 相当の区分が欲しいが、主たる業界は chemicals の範囲で暫定に扱い、taxonomyGaps に書いた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業との同一性を確認できないため、結んだ相手はない。
- relatedCompanies: クラレノリタケデンタル㈱の株式を持つ株式会社ノリタケカンパニーリミテド（現 ノリタケ）は、沿革に社名が出る共同出資の相手だが、有報は現在の出資比率を印字しておらず（連結子会社 議決権の所有割合 66.7％のみ）、候補ファイルにも無いため結ばなかった。
- relatedCompanies: PTT Global Chemical Public Company Ltd.・住友商事㈱はKuraray GC Advanced Materials Co., Ltd.の共同出資者（2018年の沿革）だが、候補ファイルが無く同一性を確認できないため結ばなかった。日本合成化学工業㈱はPOVAL ASIA PTE LTDの共同出資の相手（1996年）だが、2008年に全株式を取得済みで過去の関係のため結ばなかった。
- terms: 助言のみ。読者に説明が要りそうな用語: ポバール（ポリビニルアルコール）、ＥＶＯＨ樹脂（エバール、ガスバリア性）、ＰＶＢ（ポリビニルブチラール）、熱可塑性エラストマー、メタクリル樹脂、活性炭、人工皮革、ビニロン、報告セグメント、連結子会社、持分法適用会社。定義は有報にないので、登録時に別途一次資料で確認すること。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] クラレの繊維事業（ビニロン・人工皮革・面ファスナー） → 提案: 繊維・素材（化学繊維・人工皮革を含む区分）。2025年12月期の外部顧客への売上高56,265百万円の報告セグメントだが、閉じた集合に繊維を表す区分が無い。
