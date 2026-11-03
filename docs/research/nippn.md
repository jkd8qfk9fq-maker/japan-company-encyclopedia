# ニップン — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ニップン |
| 証券コード | 2001 |
| docID（データを取り出した文書） | `S100YIC9` |
| 原本 docID | `S100YIC9` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIC9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ニップン / 2001 / docID S100YIC9（id は英語表記「NIPPN CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippn: 10 件の数値を有報XBRLと照合
有報: 株式会社ニップン 有価証券報告書－第202期(2025/04/01－2026/03/31) (docID S100YIC9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippn: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives（戦略・強み）は書かなかった。
- businessModel: 主要な顧客は【関連情報】に伊藤忠商事（製粉・食品事業）とファミリーマート（食品事業）が印字されている。金額は書かなかった。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順（食品事業 > 製粉事業）。『その他』は有報が報告セグメントに含まれないと書く区分なので最後に置いた。
- businessStructure: セグメント別の金額は本文に書かなかった（売上高の増減理由は有報の該当節で確認できる範囲に限るため）。
- businessStructure: ニップンロジスは事業の内容の節では持分法適用会社ではなく関係会社の表に載る。事業の位置付けはその他事業として扱った。
- businessStructure: wikipedia.json は証拠パックに無く、使っていない。
- history: 沿革末尾の表が崩れ、年月セル4つ（2023年5月・2024年7月・2025年4月・2026年2月）と事象4つ（Utah Flour Milling出資・NIPPN Vietnam設立・畑中食品の連結子会社化・知多工場完成）が分かれて印字されていた。数が同じなので行順で対応づけた。
- history: wikipedia.json は証拠パックに無く、使っていない。
- industry: 報告セグメントの製粉事業・食品事業はどちらも食品に当たる。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、結ばなかった。
- relatedCompanies: 伊藤忠商事: 主要顧客として有報に印字があるが、候補ファイルが無く同一性を確認できない。
- relatedCompanies: 株式会社ファミリーマート: 主要顧客として有報に印字があるが、候補ファイルが無く同一性を確認できない（上場会社でもない）。
- terms: 用語の候補: プレミックス（小麦粉に砂糖や油脂などを混ぜ合わせた調理用の粉）、ふすま（小麦を粉にするときに出る外皮）、特約店（メーカーと特約を結んで商品を売る卸売業者）、中食（持ち帰りや配達で食べる調理済みの食事）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
