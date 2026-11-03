# 三越伊勢丹ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社三越伊勢丹ホールディングス |
| 証券コード | 3099 |
| docID（データを取り出した文書） | `S100YD7C` |
| 原本 docID | `S100YD7C` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD7C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社三越伊勢丹ホールディングス / 3099 / docID S100YD7C（id は英語表記「Isetan Mitsukoshi Holdings Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
isetan-mitsukoshi-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社三越伊勢丹ホールディングス 有価証券報告書－第18期(2025/04/01－2026/03/31) (docID S100YD7C)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
isetan-mitsukoshi-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 利益は営業利益・経常利益・セグメント利益を本文に書いていない。brief の注意（財務諸表の組替え）は、前期有報との重複年度が全て一致しているため、basis は付けていない。
- businessModel: MD&Aの2026年4月の事業承継（フードクラフト）は提出後の期に属するため使っていない。
- businessStructure: 決算期は表紙のDEIから2026年3月期。並びは外部顧客への売上高の大きい順（百貨店446,776、不動産22,199、クレジット・金融・友の会20,969）で、報告セグメントに含まれない「その他」は最後。MD&Aの順（百貨店・クレジット・不動産）とは違う。
- businessStructure: listings：福岡証券取引所は2024年3月20日に上場廃止（沿革）のため含めない。表紙は東京証券取引所プライム市場のみ。
- businessStructure: セグメント利益（営業利益ベース）は本文に書いていない。拠点・設備の事業対応は書いていない。
- history: 個別店舗の閉店（吉祥寺店、新宿アルコット店、千葉店など）は省いた。2009年10月の福岡証券取引所への上場申請は、上場廃止の行で扱うため独立の行にしていない。
- industry: 売上の大半は百貨店業の報告セグメント（外部顧客への売上高446,776百万円）のため小売を主たる業界とした。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みで上場の相手を確認できないため、結ばなかった。
- relatedCompanies: 関係会社の状況の子会社・関連会社（ジェイアール西日本伊勢丹、新光三越百貨股份有限公司、野村不動産三越伊勢丹開発合同会社など）は、候補ファイルに無く上場の確認もできないため結んでいない。
- terms: 助言：用語集に「外商」「識別顧客」「友の会」があれば有用。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
