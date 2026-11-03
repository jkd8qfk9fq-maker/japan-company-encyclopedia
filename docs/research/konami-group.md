# コナミグループ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | コナミグループ株式会社 |
| 証券コード | 9766 |
| docID（データを取り出した文書） | `S100YKX5` |
| 原本 docID | `S100YKX5` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKX5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | コナミグループ株式会社 / 9766 / docID S100YKX5（id は英語表記「KONAMI GROUP CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
konami-group: 10 件の数値を有報XBRLと照合
有報: コナミグループ株式会社 有価証券報告書－第54期(2025/04/01－2026/03/31) (docID S100YKX5)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
konami-group: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 戦略・強み（perspectives）は MD&A を読まずに書くと推測になるため省きました。
- businessModel: 地域別売上は所在地基準で、日本352,015／米国84,202百万円は印字の値です。
- businessStructure: 並び順は2026年3月期の外部顧客に対する売上高（デジタル370,225／スポーツ49,146／ゲーミング43,062／アーケード25,295百万円）の順。「その他」は報告セグメントに含まれない区分なので末尾に置きました（5,949百万円）。
- businessStructure: 表紙は東京証券取引所（プライム市場）とロンドン証券取引所を印字しています。ロンドンは取引所の値（tse / nse / fse / sse）に無いため listings に入れていません。
- businessStructure: 「その他」の事業内容は注記が「遊技機事業等」と書くところまでで、products は遊技機だけにしました。株式会社コナミアミューズメントの国内位置づけは事業の内容の表（その他・国内）に基づきます。
- businessStructure: 「売上の大部分」は370,225と連結計493,677百万円の関係の言い換えで、割合は書いていません。
- businessStructure: リソルホールディングスの持株比率20％と事業の位置づけは【関係会社の状況】の印字です。
- history: 沿革は印字された年月どおりに採りました。1984年・1982年・2020年の項目は同じ分野の出来事を一つにまとめています（2020年の項目の年は2019年12月の業務開始を含むため、年は2020年としました）。
- history: 本店移転、各種施設の完成、社長交代などは主要でないものとして省きました。
- industry: 売上の大半を占めるデジタルエンタテインメント事業（ゲーム）で entertainment を主たる業界にしました。報告セグメント単位で独立した業界を足すほどの開示（it など）は選びませんでした。
- relatedCompanies: リソルホールディングス株式会社（持分法適用関連会社、議決権20％、スポーツ事業での出資提携、役員兼任あり）は関係性の根拠はありますが、証拠パックに related-candidates.json が無く、掲載済み企業・上場の確認ができないため結びませんでした。掲載済みと確認できれば affiliate で結べます。
- relatedCompanies: 子会社（コナミデジタルエンタテインメントなど）は上場会社ではなく掲載対象ではないため結んでいません。
- terms: 用語の助言：純粋持株会社、報告セグメント、IFRS、吸収分割、持分法適用会社、カジノマネジメントシステム、eスポーツ、遊技機（パチンコ・パチスロ向けの機器）が読者に説明のいる語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
