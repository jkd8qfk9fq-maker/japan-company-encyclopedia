# VTホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＶＴホールディングス株式会社 |
| 証券コード | 7593 |
| docID（データを取り出した文書） | `S100YEXL` |
| 原本 docID | `S100YEXL` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEXL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＶＴホールディングス株式会社 / 7593 / docID S100YEXL（id は英語表記「VT HOLDINGS CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
vt-holdings: 10 件の数値を有報XBRLと照合
有報: ＶＴホールディングス株式会社 有価証券報告書－第44期(2025/04/01－2026/03/31) (docID S100YEXL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
vt-holdings: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「VTホールディングス株式会社」が EDINET の提出者名「ＶＴホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 売上の内訳は「製品及びサービスに関する情報」の印字どおり。「その他」1,026百万円は省略。
- businessModel: 戦略・強みの節は書けるだけの開示を読んでいないため省略した。
- businessStructure: セグメント注記の「その他」（グループ全社管理部門等、外部顧客への売上収益200百万円）は事業ではないため事業に含めていない。
- businessStructure: 新車・中古車などの製品区分は自動車販売関連事業の製品として記載し、子の事業とはしていない。
- history: 2011年は沿革表で月が欠けた崩れ行（2011年2月・2011年10月）があり、南アフリカ会社の子会社化のみ採用した。2012年4月の英国会社の行は同年として採用。
- history: 2014年の「2014年10月」「2014年12月」の行は事象の対応が崩れているため採用していない。
- industry: 自動車販売関連事業が外部顧客への売上収益の大半（357,041百万円／388,733百万円）を占めるため automotive のみ。住宅関連事業に対応する業界値は construction / real-estate があるが、報告セグメントとしては1割未満のため付けていない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業として確認できる相手がいないため、関連企業は結んでいない。
- relatedCompanies: 株式会社トラスト（完全子会社）、AMGホールディングス（議決権43.49%・実質支配）、株式会社ワイズホールディングス（持分法適用関連会社35.46%）は関係会社の状況に載るが、掲載済み企業の候補として確認できないため見送り。
- relatedCompanies: 本田技研工業・日産自動車はディーラー契約の相手だが、有報に取引の向きの記載がなく、候補にも無いため結んでいない。
- terms: 用語の助言: 「持株会社」「ディーラー」「インポーター（輸入車の輸入販売）」は初めて読む人に説明があると分かりやすい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
