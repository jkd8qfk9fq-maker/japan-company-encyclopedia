# コスモスイニシア — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社コスモスイニシア |
| 証券コード | 8844 |
| docID（データを取り出した文書） | `S100YCZ3` |
| 原本 docID | `S100YCZ3` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCZ3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社コスモスイニシア / 8844 / docID S100YCZ3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cosmos-initia: 10 件の数値を有報XBRLと照合
有報: 株式会社コスモスイニシア 有価証券報告書－第57期(2025/04/01－2026/03/31) (docID S100YCZ3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
cosmos-initia: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: エビデンスパックの注意（本文に「財務諸表の組替え」の記載がある）について、修正再表示チェックでは前期有報と重複する8行すべてが一致し、連結経営指標等の数値に影響する組替えはパック内の本文ファイルで特定できなかったため、financialNotes には記録しなかった。
- businessModel: 2026年2月に持分法適用会社であった株式会社WOOCを連結子会社化したことに伴う段階取得に係る差益352百万円が特別利益として計上されているが、本文の金額は売上高と当期純利益のみとするため本文には書かず、この警告に記録する。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（ソリューション63,601百万円、レジデンシャル48,288百万円、宿泊29,068百万円、工事8,337百万円）とした。children の金額は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の事業別内訳（セグメント間の内部売上高又は振替高を含む数値）による。
- industry: 主たる業界は、住宅や収益不動産の開発・販売を中心とする事業構成から不動産（real-estate）とした。閉じた分類に当てはまる区分があるため taxonomyGap は記録しなかった。
- relatedCompanies: 候補「ベース」（ベース株式会社）は「セグメント損益は営業損益ベース」などの一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「セキ」（セキ株式会社）は ambiguous な一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ポート」（ポート株式会社）は「コスモスライフサポート」の「サポート」の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ビジョン」（株式会社ビジョン）は長期ビジョン「Vision 2035」の「ビジョン」の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「キング」（株式会社キング）は「コワーキング」の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「スペース」（株式会社スペース）は「コワーキングスペース」の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「キャリア」（株式会社キャリア）は人的資本に関する記述中の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「エン」（エン株式会社）は ambiguous な一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「イノベーション」（株式会社イノベーション）は「オープンイノベーション」の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「リード」（株式会社リード）は自社ブランド「コスモリード」「リードシー」の名称の一致であり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 候補「コア」（株式会社コア）は「人のコアな生活基盤」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「コロナ」（株式会社コロナ）は「コロナ禍」の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「フリー」（フリー株式会社）は「ジェンダーフリー」の一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 連結子会社14社及び持分法適用関連会社2社（Tin Nghia Land Investment Joint Stock Companyほか）はいずれも未上場のため、関連企業には含めなかった。
- terms: 助言: 用語「サブリース」（借り受けた不動産をさらに第三者へ転貸すること）と「アパートメントホテル」（キッチンなどを備え、家族やグループの中長期滞在に対応するホテル形態）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
