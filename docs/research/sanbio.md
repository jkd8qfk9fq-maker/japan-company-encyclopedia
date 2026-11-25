# サンバイオ — research log

Registered: 2026-11-25（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | サンバイオ株式会社 |
| 証券コード | 4592 |
| docID（データを取り出した文書） | `S100XZTW` |
| 原本 docID | `S100XZTW` |
| 提出日（原本） | 2026-04-20 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-23 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XZTW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | サンバイオ株式会社 / 4592 / docID S100XZTW（id は英語表記「SanBio Company Limited」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 0 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanbio: 5 件の数値を有報XBRLと照合
有報: サンバイオ株式会社 有価証券報告書－第13期(2025/02/01－2026/01/31) (docID S100XZTW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sanbio: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高が全年度ないため、revenue の段は金額ではなく計上がない事実を書いた
- businessModel: perspectives は、会社の説明と事実の切り分けが難しい段階のため省いた
- businessStructure: 単一セグメントのため、製品区分はの開発パイプラインの記載から children にした
- businessStructure: 関連情報に製品・サービスごとの情報の開示がないため、事業別の金額は書いていない
- history: SanBio, Inc.側の沿革（2001年設立など）は本文に統合して使った項目のみで、重複する臨床試験の節目は省いた
- relatedCompanies: SanBio, Inc.（連結子会社、議決権100.0％、2026年１月31日現在）は未上場のため結ばなかった
- relatedCompanies: Ocumension (Hong Kong) Limited（2020年３月に網膜疾患の中華圏における共同開発の業務提携契約を締結）は、候補一覧（related-candidates.json）がパックに無く同一性を確認できないため結ばなかった
- relatedCompanies: D&P Bioinnovations, Inc（2021年11月に食道再生インプラントの開発及び商業化に関する業務提携契約を締結）は、候補一覧が無く同一性を確認できないため結ばなかった
- terms: 用語の助言のみの工程のため data は空。細胞治療薬・他家移植などの用語はの用語解説で読めるため、リンク記法は使っていない

## 要確認（status に反映）

- businessModel: 事業収益が主要な経営指標等の推移で全年度「－」のため、財務の売上は全年度nullとしています。売上が全年度空欄である取扱いには人の確認が必要です
- businessModel: アクーゴ®の薬価収載と発売（2026年５月の見込み）および初出荷（翌連結会計年度の下半期の見込み）は有報に記載された提出後の予定事項で、完了したかどうかは確認できていません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
