# 日本軽金属ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本軽金属ホールディングス株式会社 |
| 証券コード | 5703 |
| docID（データを取り出した文書） | `S100YFJY` |
| 原本 docID | `S100YFJY` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFJY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本軽金属ホールディングス株式会社 / 5703 / docID S100YFJY（id は英語表記「Nippon Light Metal Holdings Company, Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-light-metal-holdings: 10 件の数値を有報XBRLと照合
有報: 日本軽金属ホールディングス株式会社 有価証券報告書－第14期(2025/04/01－2026/03/31) (docID S100YFJY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nippon-light-metal-holdings: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…3期連続の増収増益で、は前期比26.0％増…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…0％増）です。会社は、3期連続の増収増益だったと説明しています。地金の市況の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIで確認（第14期、2025年4月1日〜2026年3月31日）。変則決算・決算期変更はない。
- businessModel: brief.mdの注意（組替え・遡及適用の記載）を踏まえ、前期有報との重複年度が全て一致していることだけを確認した。本文の比較は前期比（印字の増減率）のみ使った。
- businessModel: 『3期連続の増収増益』はMD&Aの印字。
- businessModel: 利益はセグメント利益・営業利益・経常利益を本文に書いていない（方針）。
- businessModel: perspectives（戦略・強み）は省いた。
- businessStructure: 事業の並びは注記の外部顧客への売上高の順（183,583／177,660／113,011／111,219百万円）。MD&Aの掲載順（板・押出が2番目）とは異なる。
- businessStructure: 各区分の説明に出てくる子会社名は【関係会社の状況】と【事業の内容】の印字による。電極箔を板・押出に含めるのはMD&Aの『電子材料部門』が板、押出製品セグメントに書かれていることによる。
- businessStructure: 営業利益・セグメント利益は方針により書いていない。
- history: 沿革の1939年〜2010年は有報が『日本軽金属(株)（株式移転完全子会社）の沿革』として印字した参考記載。当社自身の沿革は2012年10月以降の3行。
- history: 沿革表は年月と事象が正しく対応して印字されており、崩れていない。
- history: 1974年〜1991年の合併・営業譲受（日軽アルミ、日軽圧延、ニッカル押出、日軽化工など）、2005年の東海アルミ箔の子会社化、2009年6月の名古屋・福岡・札幌の上場廃止は、読者の理解への寄与が小さいため省いた。
- industry: 最大の報告セグメントはアルミナ・化成品、地金（外部顧客への売上高が最大）。素材メーカーとして最も近い既存値のchemicalsを暫定で選んだ。
- industry: 半導体製造装置向けの需要は市場環境の文脈でのみ書かれているため、semiconductorsは付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業との同一性を確かめられないため、結ばなかった。
- relatedCompanies: 【関係会社の状況】の子会社・持分法適用関連会社はいずれも掲載済みの上場企業として確認できない。親会社・その他の関係会社の記載もない。
- relatedCompanies: いすゞ自動車（沿革の日本フルハーフの共同設立）は過去の1回の出来事で、現在の取引・資本関係の印字がないため結ばない。リオ・ティント・アルキャン・インクも1952年の技術提携のみで同様。
- terms: 用語の追加候補（助言）：アルミナ（ボーキサイトから取り出す酸化アルミニウム）、二次合金（アルミのくずを再生してつくる合金）、押出（おしだし）形材、純粋持株会社。既存の用語ids は確認していないため、リンクは使っていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 日本軽金属ホールディングス（アルミニウム総合メーカー） → 提案: metals（非鉄金属・素材）。アルミニウムの地金・板・押出・箔が事業の中心で、化学の区分では言い切れない。
