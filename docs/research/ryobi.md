# リョービ — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リョービ株式会社 |
| 証券コード | 5851 |
| docID（データを取り出した文書） | `S100XT40` |
| 原本 docID | `S100XT40` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT40.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リョービ株式会社 / 5851 / docID S100XT40（id は英語表記「RYOBI LIMITED」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ryobi: 10 件の数値を有報XBRLと照合
有報: リョービ株式会社 有価証券報告書－第114期(2025/01/01－2025/12/31) (docID S100XT40)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ryobi: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年12月期は通期の通常決算で、変則決算・会計基準の変更はないため financialNotes は省きました（2018年の決算期変更は沿革に記載）。
- businessModel: ダイカスト業界での順位やシェアは有報に書かれていないため、perspectives は地域別売上の事実だけの analysis にとどめ、disclosed・strategy・competitiveAdvantage は省きました。
- businessModel: 営業利益・経常利益・セグメント利益は本文に書いていません。
- businessStructure: 報告セグメントはダイカスト・住建機器・印刷機器の3つ。並びは2025年12月期の外部顧客への売上高（ダイカスト274,310／印刷機器23,667／住建機器10,874百万円）に従い、MD&Aの順（住建機器が印刷機器より先）とは変えました。「その他」は注記が『報告セグメントに含まれない』と書くため、260百万円で末尾に置きました。
- businessStructure: フォード・モーターとゼネラルモーターズは関連情報で関連するセグメントがダイカストと印字されているため、ダイカストの顧客にしました。
- businessStructure: ダイカストの製品のうち、アルミニウム二次合金地金・アルミニウム鍛造製品は関係会社の状況の営業上の取引欄（生野㈱・豊栄工業㈱）に基づきます。
- businessStructure: 住建機器の担い手は【事業の内容】の表（当社と利優比建筑科技（大連）有限公司の2社）によります。製品の内訳ごとの金額は開示がないため書いていません。
- businessStructure: 拠点・設備と事業の対応は書いていません（facilities は使っていません）。
- history: 沿革の表は崩れておらず、年月と事象は1対1で読めました。数多い海外子会社の設立や出資は代表的なものにまとめ、残りは省きました。
- history: 2000年の項は、2000年6月（園芸用機器）、8月（電動工具）、9月（釣具）、2001年8月・2002年3月（欧州・オセアニアの販売会社）の譲渡をまとめたものです。
- industry: 売上の88.7％を占めるダイカストは、有報が「自動車等の部品として使用されるダイカスト製品」と説明し、主要顧客もフォード・モーターとゼネラルモーターズなので automotive を主にしました。住建機器・印刷機器は金額の小さい報告セグメントで、対応する業界値（機械が近い）もあるものの追加していません。
- relatedCompanies: 証拠パックに related-candidates.json がなく、掲載済み企業から選べる候補が機械抽出されていないため、関連企業は結びませんでした。
- relatedCompanies: 京セラ：2018年1月のパワーツール事業の営業譲渡と、合弁会社（京瓷利優比（大連））の会社分割が沿革にあるだけで、現在の取引・資本関係の記載を確認できず、過去の一回限りの取引は結ばない規則のため見送りました。
- relatedCompanies: 三菱重工機械システム：リョービＭＨＩグラフィックテクノロジーの合弁相手として沿革に社名がありますが、candidates になく、同一性（掲載済み上場企業か）を確かめられないため結びませんでした。
- relatedCompanies: フォード・モーター、ゼネラルモーターズ：主要顧客ですが、掲載済みの日本の上場企業ではないため結べません。
- terms: 用語の追加候補（助言）：「ダイカスト」（溶かした金属を金型に流し込んで部品をつくる方法）、「ギガキャスト」（大型部品を一体でつくるダイカスト）、「ドアクローザ」、「オフセット印刷機」。本文では用語リンクを使っていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
