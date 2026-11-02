# セイノーホールディングス — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | セイノーホールディングス株式会社 |
| 証券コード | 9076 |
| docID（データを取り出した文書） | `S100YI52` |
| 原本 docID | `S100YI52` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI52.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | セイノーホールディングス株式会社 / 9076 / docID S100YI52（id は英語表記「SEINO HOLDINGS CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
seino-holdings: 10 件の数値を有報XBRLと照合
有報: セイノーホールディングス株式会社 有価証券報告書－第105期(2025/04/01－2026/03/31) (docID S100YI52)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
seino-holdings: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから2026年3月期。連結の数値を使った。前期有報との重複年度は一致（修正再表示なし）。本文に財務諸表の組替えの記載があるとの注意があったが、売上高・純利益は前期と一致しており、financialNotes には書かなかった。
- businessModel: 売上高・純利益・外部顧客への売上高は印字の百万円表記のまま引用した。前期の純利益19,253百万円はbrief.mdの5年表の値。
- businessModel: perspectives は書かなかった（空）。
- businessStructure: 並び順は【セグメント情報】2026年3月期の外部顧客への売上高の順（輸送630,890、自動車販売110,346、物品販売40,926、不動産賃貸2,456）。「その他」（28,345）は有報が報告セグメントに含まれない区分と書くため最後に置いた。
- businessStructure: 輸送事業の子区分（国内輸送・国際輸送）は【事業の内容】の記述の区分で、金額は有報に独立して開示されていない。担当会社の対応は有報の記載（国内・国際の社数）に基づく。
- businessStructure: listings: 表紙が「東京証券取引所プライム市場」「名古屋証券取引所プレミア市場」と印字しているため市場区分まで書いた。
- businessStructure: 子会社の内訳: 連結子会社91社、非連結子会社4社、関連会社20社（【事業の内容】）。セグメント別の社数は重複して数えられている（例: 不動産賃貸の16社は輸送などの会社と同じ）ため合算しない。
- businessStructure: related-candidates.json が証拠パックに無かった。
- history: 沿革の表は年月と事象が1行ずつ連続しており、そのまま読めた。2009年4月の行は年月が事象の後に並ぶ崩れがあるが、本文の選択には使っていない。
- history: 沿革から10件を選んだ。省いたもの: 商標統合、ISO取得、各種の株式交換・吸収合併の個別の行、2013年の福山通運との災害協定、2024年5月の日本郵便との基本合意（以上は主要な転機として選ばなかったもの）。
- history: 2026年4月のＡＺ－ＣＯＭ丸和との基本合意は提出後ではなく提出前の出来事で、有報の記載どおり。
- industry: 主な業界は transportation。輸送事業の外部顧客への売上高630,890百万円が連結812,965百万円の大部分を占める。
- industry: automotive: 自動車販売事業（外部顧客への売上高110,346百万円）が独立した報告セグメント。トラック・乗用車の販売と修理でメーカーではないが、近い値として付けた。
- industry: real-estate: 不動産賃貸事業（外部顧客への売上高2,456百万円）が報告セグメントとして独立して開示されている。
- industry: 「その他」区分（住宅販売・タクシー・旅行代理店など）は報告セグメントに含まれないため業界を足していない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、結んだ相手はいない。
- relatedCompanies: 福山通運㈱: 有報は業務提携（2013年3月、2026年4月の合弁会社設立）を述べるが、候補一覧が無く上場・掲載済みの確認ができないため結ばなかった。
- relatedCompanies: ＳＧホールディングス㈱: 沿革に2019年8月の業務連携の検討の基本合意と、保有株式（6,000株、取引関係の維持・強化）があるのみで、現在の関係の記載が足りないため結ばなかった。
- relatedCompanies: ＡＺ－ＣＯＭ丸和ホールディングス㈱: 2026年4月に業務提携の基本合意書を締結とあるのみで、候補一覧が無く、提携内容の記載が足りないため結ばなかった。
- relatedCompanies: 日本郵便㈱: 2024年5月の幹線輸送の共同運行の基本合意のみで、上場企業でないため結ばなかった。
- relatedCompanies: ㈱阪急阪神エクスプレス（持分法適用関連会社、34.01％）、西濃シェンカー㈱（同40.00％）など: 非上場のため結ばなかった。阪急阪神ホールディングス㈱は2017年12月に資本・業務提携契約を結んだ沿革の記載のみで、現在の関係の記載が足りない。
- terms: 用語の助言: 「純粋持株会社」「路線トラック輸送」「貨物利用運送事業」「3PL」「報告セグメント」「持分法適用関連会社」は読者に説明があると分かりやすい。既存の用語集に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
