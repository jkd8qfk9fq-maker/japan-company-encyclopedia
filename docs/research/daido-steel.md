# 大同特殊鋼 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大同特殊鋼株式会社 |
| 証券コード | 5471 |
| docID（データを取り出した文書） | `S100YNEC` |
| 原本 docID | `S100YNEC` |
| 提出日（原本） | 2026-06-30 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YNEC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大同特殊鋼株式会社 / 5471 / docID S100YNEC（id は英語表記「Daido Steel Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daido-steel: 10 件の数値を有報XBRLと照合
有報: 大同特殊鋼株式会社 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YNEC)
前期有報との比較: 36 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daido-steel: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上は『売上収益』（IFRS）、純利益は『親会社の所有者に帰属する当期利益』を採った（MD&Aの印字）。過去の日本基準の系列とは別。
- businessModel: 組替え: 有報の組替えは連結キャッシュ・フロー計算書の表示方法の変更（契約負債の増減額・子会社の取得による支出の独立掲記）で、売上・純利益の連続性に影響しないため financialNotes には簡単に触れるだけにした。
- businessModel: 営業利益・調整後営業利益・税引前利益・各セグメントの利益、資産・資本の金額は方針により本文に書いていない。
- businessModel: flow.revenue の『各約2,000億円』は有報のセグメント売上（207,781・199,753百万円）の概数。
- businessModel: 競争優位・業界内の位置づけは有報に会社自身の整理が見つからなかったため perspectives から省いた。
- businessStructure: 決算期は表紙のDEIから2026年3月期。会計基準はIFRS。報告セグメントは5つで、すべてセグメント注記の外部顧客への売上収益の大きい順（207,781 / 199,753 / 117,937 / 26,625 / 26,031百万円）に並べた。報告セグメントに含まれない区分はない。
- businessStructure: セグメント利益・セグメント資産などは本文に書いていない。製品ごとの売上は開示がないため金額を書いていない。
- businessStructure: listings: 表紙が東京証券取引所プライム市場と名古屋証券取引所プレミア市場を印字している。
- businessStructure: Wikipedia（wikipedia.json）は証拠パックにないため使っていない。
- history: 沿革は【沿革】の印字から主な出来事を選んだ。表は崩れておらず、年月と事象が対応している。
- history: 2024年3月の匿名組合の連結除外、2021年の子会社合併など小さな組織再編は省いた。
- industry: 売上の大半は素材（特殊鋼鋼材・機能材料）の2セグメントなので、素材系に最も近い chemicals を暫定の主業界にした。鉄鋼の区分が無いため taxonomyGaps に記録。
- industry: automotive は、自動車部品・産業機械部品が報告セグメントとして開示され、主要需要先が自動車関連のため2つ目に付けた。
- industry: 半導体は戦略の成長分野として書かれるだけで事業として開示がないため付けていない。
- relatedCompanies: 証拠パックに related-candidates.json が無いため、掲載済み企業との同一性を確認できず、誰も結んでいない。
- relatedCompanies: 日本精線（連結子会社・50.6％）: 同一性を確認できる候補ファイルが無い。有報には提出会社の注記あり。subsidiary の候補。
- relatedCompanies: フジオーゼックス（連結子会社・54.3％）: 同上。subsidiary の候補。
- relatedCompanies: 東北特殊鋼（持分法適用会社・34.3％）: 同上。affiliate の候補。
- relatedCompanies: 日本高周波鋼業（連結子会社・100.0％、2026年2月に全株式取得）: 同上。subsidiary の候補。
- relatedCompanies: 大株主・政策保有株式: 結ぶ根拠を確認していない。
- terms: 用語の候補（助言）: 特殊鋼、構造用鋼、工具鋼、ステンレス鋼、高合金、希土類磁石（重希土類フリー）、型鍛造・自由鍛造、精密鋳造、電気炉（アーク炉）、IFRS、持分法適用会社。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 大同特殊鋼の主業界（特殊鋼・鉄鋼） → 提案: steel-metals 鉄鋼・非鉄金属。特殊鋼メーカーに合う業界が閉じた分類に無い
