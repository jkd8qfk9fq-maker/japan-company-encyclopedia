# 神鋼商事 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 神鋼商事株式会社 |
| 証券コード | 8075 |
| docID（データを取り出した文書） | `S100YEV4` |
| 原本 docID | `S100YEV4` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEV4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 神鋼商事株式会社 / 8075 / docID S100YEV4（id は英語表記「Shinsho Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shinsho: 10 件の数値を有報XBRLと照合
有報: 神鋼商事株式会社 有価証券報告書－第108期(2025/04/01－2026/03/31) (docID S100YEV4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
shinsho: 本文の金額 18 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 神戸製鋼所向け売上高は主要な相手先別販売実績（2026年3月期42,682百万円、7.0％）の印字。10％未満のため『10％以上の相手先なし』と併記。
- businessModel: 営業利益・経常利益は方針に従い書いていません。
- businessModel: 『日本が約3分の2』は日本389,622百万円÷608,142百万円からの読み取りで、有報が割合を印字しているわけではありません。
- businessStructure: 報告セグメントは「金属」「機械・溶接」の2つで、その下に鉄鋼・アルミ・銅・原料・機械・溶接の5ユニットがあります。並びは2026年3月期の外部顧客への売上高（金属515,691／機械・溶接92,250／その他199百万円。ユニットは鉄鋼250,092／アルミ・銅187,946／原料77,652／機械63,726／溶接28,524百万円）に従いました。「その他」は報告セグメントに含まれない区分なので最後です。
- businessStructure: 決算期は2026年3月期（第108期）。表紙が印字する市場区分は東京証券取引所プライム市場のみ。
- businessStructure: 「その他」の事業内容は有報に記載がなく、説明に金額と区分の性格だけを書きました。
- businessStructure: セグメント利益・営業利益などは方針に従い本文に書いていません。
- businessStructure: 設備の対応は【主要な設備の状況】のセグメント欄どおり（Grand Blanc＝鉄鋼、Kobelco Trading Australia＝原料、蘇州神商金属＝アルミ・銅）。
- history: 沿革の表は年月と概要が読み取れる形で、崩れていません。多数の海外現地法人設立は代表例のみ採りました。
- history: 1946年の設立場所は有報が『大阪市東区（現・大阪市中央区）』と印字しています。
- industry: 全報告セグメントが商品の売買（鉄鋼・非鉄・原料・機械・溶接）のため商社のみ。
- relatedCompanies: related-candidates.json は証拠パックに存在しないため、掲載済み企業として src/data/companies/kobe-steel.json の存在だけを確認して選びました。
- relatedCompanies: 大阪精工・アジア化工は持分法適用関連会社ですが非上場・未掲載のため結んでいません。
- terms: 助言: 専門商社、特殊鋼、非鉄金属、資源循環、PVD装置は用語候補になりうるが、本文にはリンクを置いていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
