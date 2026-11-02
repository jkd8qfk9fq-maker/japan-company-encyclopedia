# サンドラッグ — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サンドラッグ |
| 証券コード | 9989 |
| docID（データを取り出した文書） | `S100YL7Q` |
| 原本 docID | `S100YL7Q` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL7Q.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サンドラッグ / 9989 / docID S100YL7Q（id は英語表記「SUNDRUG CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sundrug: 10 件の数値を有報XBRLと照合
有報: 株式会社サンドラッグ 有価証券報告書－第63期(2025/04/01－2026/03/31) (docID S100YL7Q)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sundrug: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 利益の段は当期純利益だけを書きました。営業利益・経常利益・セグメント利益は規則により書いていません。
- businessModel: 「店舗を訪れる一般の消費者」は小売店舗の事業であることからの記述で、有報が顧客層を明記しているわけではありません。
- businessModel: customers の「フランチャイズ等の店舗」は、フランチャイズ等37店が有報に印字されていることによります。
- businessStructure: 事業は報告セグメント2つを外部顧客への売上高の大きい順（ドラッグストア478,404、ディスカウントストア364,108百万円）に並べました。
- businessStructure: ドラッグストア事業の子どもは店舗数の内訳（直営店・子会社3社・フランチャイズ等）で分けました。金額は独立して開示されていないため書いていません。
- businessStructure: ドラッグストア事業に含まれる㈱サンドラッグ・ドリームワークス（管理業務等を担う特例子会社）、㈱ピュマージ、㈱サンドラッグエースは店舗数の内訳に出てこないため子どもにしていません。
- businessStructure: 設備欄のうち「本部他」「物流センター」はドラッグストア事業の区分に印字されていますが、店舗数の内訳ではないため直営店の説明には含めていません。
- businessStructure: Wikipedia（wikipedia.json）は無かったため使っていません。
- history: 沿革は表が崩れておらず、年月と事項が対応して読めたため、そのまま採りました。
- history: 資本金の金額が出る1994年・1997年の増資の行は、金額を書かない規則のため取り上げていません。
- history: 1998年の項（コミネ子会社化・いちやまマート）は1996年の項にまとめました。
- industry: 報告セグメントはドラッグストア事業とディスカウントストア事業のどちらも店舗での小売なので、retail 1つにしました。調剤・医薬品の販売は小売の中の商品であり、pharmaceuticals は付けていません。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、関連企業は結んでいません。
- relatedCompanies: ㈱キリン堂ホールディングス: 持分法適用関連会社だが、候補ファイルが無く上場かどうかも確かめられない。結ばない。
- relatedCompanies: ㈱アークス: 2016年の合弁会社設立という過去の出来事が沿革にあるだけで、現在の取引関係の印字がない。結ばない。
- relatedCompanies: ㈱島忠: 2020年に商品供給を開始したとだけあり、取引の向きや内容の印字がない。結ばない。
- relatedCompanies: BCPE KNIGHT CAYMAN,L.P.・BCPE KNIGHT GP2,LLC・㈱BCJ-47: 投資事業組合・投資会社で、上場企業ではない。結ばない。
- terms: この工程は助言のみです。本文に [[term:...]] リンクは使っていません。用語集に追加するなら、フランチャイズ（他社に店名や商品の供給を認める仕組み）、持分法適用会社、調剤（薬局で処方箋にもとづき薬を調合すること）が、この会社の読者に役立ちます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
