# カメイ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | カメイ株式会社 |
| 証券コード | 8037 |
| docID（データを取り出した文書） | `S100YKU0` |
| 原本 docID | `S100YKU0` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKU0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | カメイ株式会社 / 8037 / docID S100YKU0（id は英語表記「KAMEI CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kamei: 10 件の数値を有報XBRLと照合
有報: カメイ株式会社 有価証券報告書－第113期(2025/04/01－2026/03/31) (docID S100YKU0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kamei: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから2026年3月期（連結、Japan GAAP）。前期有報との重複年度は一致で修正再表示なし。brief の『財務諸表の組替え』の注意は確認したが、売上高の範囲が変わった記載はないため basis は付けていない。
- businessModel: 売上高・各セグメントの金額と前期比は販売実績表とセグメント注記で突き合わせた。地域別売上高は【関連情報】の印字どおり。
- businessModel: 有報は自社を『商社』とは書いていないため、そう書いていない。仕入先・仕入れ額の内訳の説明は本文の範囲にとどめた。
- businessStructure: 並び順は2026年3月期の外部顧客への売上高の大きい順：エネルギー279,608、海外・貿易91,164、自動車80,258、建設関連48,376、食料39,141、ファーマシー20,395、ペット14,475。【事業の内容】は8事業が報告セグメントと同一と書くが、セグメント注記は報告セグメントを7つとし、『その他』は報告セグメントに含まれないと書くため、『その他』は最後に置いた。
- businessStructure: 各前期比はMD&Aの販売実績表（前年同期比）による。セグメント利益・営業利益は書いていない。
- businessStructure: 子会社・関連会社の数は本文に使っていない。事業の系統図は図でありテキストに含まれず、確認していない。
- history: 沿革の全行は取り上げていない。省いた行：1953年の富士運輸倉庫株式会社の設立、1954年の重油直輸入、1955年の日本石油瓦斯との特約、1965年の本社移転、1989年の決算期変更、2003年・2013年・2023年の創業周年。
- history: 1989年3月に決算期を12月31日から3月31日に変更した旨を沿革は書いている（本文には使っていない）。
- industry: 主たる業界は、売上の最も大きい報告セグメントであるエネルギー事業（石油製品・LPガス）で決めた。海外・貿易事業は輸出入を行うため trading、自動車関連事業はディーラー事業のため automotive を付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を機械抽出で確認できる相手がいないため、結んだ相手はない。
- relatedCompanies: ENEOS株式会社（特約店）、トヨタ自動車株式会社（系列ディーラー）、太平洋セメント、キリンビールは有報が取引・契約を述べるが、候補ファイルが無く上場の確認ができないため結ばなかった。
- relatedCompanies: 株式会社宮城テレビ放送（持分法適用関連会社、議決権22.5％）は上場の確認ができないため結ばなかった。
- terms: 用語の追加提案：特約店（石油元売会社などから商品の販売権を受けて販売する店）、持分法適用関連会社。既存用語との重複は確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
