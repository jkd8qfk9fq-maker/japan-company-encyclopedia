# 参天製薬 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 参天製薬株式会社 |
| 証券コード | 4536 |
| docID（データを取り出した文書） | `S100YDH1` |
| 原本 docID | `S100YDH1` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDH1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 参天製薬株式会社 / 4536 / docID S100YDH1（id は英語表記「SANTEN PHARMACEUTICAL CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
santen-pharmaceutical: 10 件の数値を有報XBRLと照合
有報: 参天製薬株式会社 有価証券報告書－第114期(2025/04/01－2026/03/31) (docID S100YDH1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
santen-pharmaceutical: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 戦略と強み（perspectives）は書かなかった。
- businessModel: 「目の薬を中心に」は沿革の「大学目薬」と有報の眼科製品・眼科領域の記述に基づく。
- businessModel: 本文の財務は売上収益と親会社の所有者に帰属する当期利益のみ。MD&Aのコア営業利益・営業利益は書かなかった。
- businessStructure: 単一セグメントのため、【関連情報】の製品区分を children にした。売上の大きい順に並べた。
- businessStructure: 製品区分ごとの製品名は有報の事業の内容に印字がないため products は書かなかった。
- history: 沿革表は年月と事項が正しく対応していたため、そのまま使った。工場の増設や事務所の移転など細かい項目は省いた。
- industry: 単一セグメントで、売上の大半は医療用医薬品。医薬品のみとした。
- relatedCompanies: 株式会社スズケン: 主な販売先として売上が印字されているが、related-candidates.json が無く同一性を確認できないため結ばなかった。
- relatedCompanies: 株式会社メディセオ: 同上。
- relatedCompanies: Harrow Health, Inc.: 2023年の一部製品の資産譲渡で、過去1回限りの取引のため結ばなかった。
- relatedCompanies: Merck & Co., Inc.: 2014年の譲受けで過去1回限りのため結ばなかった。
- relatedCompanies: 親会社・その他の関係会社の記載はなく、大株主の事業会社は証拠パックで確認できなかった。
- terms: 用語の追加提案: 薬価改定、長期収載品、後発医薬品（ジェネリック）、選定療養、IFRS、コアベース（有報が独自に使う指標）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
