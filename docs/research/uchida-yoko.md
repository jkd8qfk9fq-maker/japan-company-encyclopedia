# 内田洋行 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社内田洋行 |
| 証券コード | 8057 |
| docID（データを取り出した文書） | `S100Z6XO` |
| 原本 docID | `S100Z6XO` |
| 提出日（原本） | 2026-10-09 |
| 決算期 | 2026-07-20 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z6XO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社内田洋行 / 8057 / docID S100Z6XO（S100WU40 から新しい有報に更新。旧成果物は pipeline/analysis/superseded/uchida-yoko-S100WU40/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z6XO） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
uchida-yoko: 10 件の数値を有報XBRLと照合
有報: 株式会社内田洋行 有価証券報告書－第88期(2025/07/21－2026/07/20) (docID S100Z6XO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
uchida-yoko: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives は書き切る根拠を読んでいないため省いた。
- businessModel: 売上増の理由は md-and-a を読んでいないため書いていない。
- businessStructure: 並び順は2026年7月期の外部顧客への売上高の大きい順（情報204,447→公共161,038→オフィス59,172）。『その他』は報告セグメントに含まれない区分なので最後。
- businessStructure: 【事業の内容】末尾の事業系統図は図で、内容は確認していない。
- businessStructure: listings は表紙の『東京証券取引所プライム市場』による。
- history: 沿革の表は年月と事象が連続した文として読めるため、そのまま対応させた。
- history: 1941年の設立や1950年の合併など、本文に使わなかった行は省略した。
- industry: 最大の報告セグメントが情報関連事業（ICT・システム構築）のため it を主とした。公共関連事業にも教育ICTが含まれる。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み・上場の同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: 富士通㈱: 1972年の包括提携と協力関係は印字されているが、候補ファイルで同一性を確認できなかった。
- relatedCompanies: ㈱稲葉製作所: オフィス関連事業の主要な仕入先と印字されているが、同じ理由で結ばなかった。
- relatedCompanies: 子会社・関連会社は有報の表のとおり非上場の会社なので対象外。
- terms: 助言: 用語候補は ICT、システムインテグレーション、基幹業務システム。既存の用語集の有無は確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
