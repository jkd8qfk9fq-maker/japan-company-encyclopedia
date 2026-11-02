# 稲畑産業 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 稲畑産業株式会社 |
| 証券コード | 8098 |
| docID（データを取り出した文書） | `S100YB2W` |
| 原本 docID | `S100YB2W` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YB2W.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 稲畑産業株式会社 / 8098 / docID S100YB2W（id は英語表記「Inabata &amp; Co.,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
inabata-and-co: 10 件の数値を有報XBRLと照合
有報: 稲畑産業株式会社 有価証券報告書－第165期(2025/04/01－2026/03/31) (docID S100YB2W)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
inabata-and-co: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: customers の『日本以外の売上が半分以上』は地域別売上高（日本350,004 / 合計832,745百万円）から読める事実。
- businessModel: 営業利益・経常利益は規則により本文に書かず、profit 段は当期純利益のみ。
- businessModel: financialNotes は変則決算・会計基準変更が無いため省略。
- businessModel: 2027年3月期の業績予想は書いていない。
- businessStructure: businesses の並びは【セグメント情報】2026年3月期の外部顧客への売上高の大きい順：合成樹脂407,974 > 情報電子239,336 > 化学品125,137 > 生活産業60,115百万円。『その他』（不動産賃貸業、181百万円）は報告セグメントに含まれない区分なので最後。
- businessStructure: shortNameEn の Inabata は有報の英訳名『Inabata & Co.,Ltd.』と社名の通称から。ブランド名を別に確認できる資料は証拠パックにない。
- businessStructure: wikipedia.json は証拠パックに無く、使っていない。
- businessStructure: children は使っていない。複数セグメントのため。
- history: 沿革は有報【沿革】から主要な出来事を選んだ。海外拠点の設立は代表例のみ。
- history: 1973年の東京・大阪両証券取引所市場第一部銘柄への指定は1961年の上場の項に含めた。
- industry: 主たる業界は商社（trading）。全報告セグメントが商品の販売を主とする。
- industry: chemicals は化学品・合成樹脂の2セグメントが売上の過半を占めるため付けた。
- industry: semiconductors は情報電子セグメントの主な商品に『半導体・液晶材料』が明記され、報告セグメント単位で開示があるため2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックに存在せず、同一性（掲載済みの上場企業か）を確認できないため、結んだ相手はない。
- relatedCompanies: 住友化学（大株主、2026年3月31日現在の持株比率10.42％）：有報は大株主の状況に載せているが、関係会社の状況に親会社・その他の関係会社としての区分記載がなく、候補一覧にも無い。同一性の根拠が足りないため結ばない。
- relatedCompanies: 住友ファーマ：沿革の1984年の共同出資・営業譲渡のみで、現在の取引関係の記載が無い。過去の出来事なので結ばない。
- relatedCompanies: アルバック成膜（持分法適用関連会社）、クリーン・アシスト（持分法適用関連会社）：非上場の可能性があり、候補一覧にも無く、同一性を確認できないため結ばない。
- terms: 用語集への追加候補（助言のみ）：樹脂コンパウンド（樹脂に着色などの加工をした材料）、専門商社（特定分野の商品に強い商社）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
