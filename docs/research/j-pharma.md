# ジェイファーマ — research log

Registered: 2026-11-25（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ジェイファーマ株式会社 |
| 証券コード | 520A |
| docID（データを取り出した文書） | `S100YJUW` |
| 原本 docID | `S100YJUW` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-23 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJUW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ジェイファーマ株式会社 / 520A / docID S100YJUW（id は英語表記「J-Pharma Co.,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 0 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
j-pharma: 5 件の数値を有報XBRLと照合
有報: ジェイファーマ株式会社 有価証券報告書－第21期(2025/04/01－2026/03/31) (docID S100YJUW)
利益・総資産・純資産・従業員数: 20 件を照合
注意: business.txt はEDINETのCSVが3万字で打ち切っており、末尾が欠けている。欠けた部分を根拠に使わないこと
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
j-pharma: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高が全年度ないため、revenue の段は金額ではなく計上がない事実を書いた
- businessModel: business.txt の末尾が欠けているため、パイプラインの細部は沿革とMD&Aで裏付けられる範囲に限った
- businessModel: perspectives は、会社の説明と事実の切り分けが難しい段階のため省いた
- businessStructure: 単一セグメントのため、開発パイプラインの記載から children にした
- businessStructure: business.txt はEDINETのCSVが3万字で打ち切られ末尾が欠けているため、欠けた部分は根拠に使っていない
- history: 沿革には公的助成事業への採択なども並ぶが、臨床開発と提携・上場の節目に絞った
- relatedCompanies: 関係会社の状況は「該当事項はありません」で、関係会社は存在しない
- relatedCompanies: 大原薬品工業株式会社（2019年４月にナンブランラトのライセンス及び共同開発に関する契約を締結）は、候補一覧（related-candidates.json）がパックに無く同一性を確認できないため結ばなかった
- terms: 用語の助言のみの工程のため data は空。トランスポーター・LAT1などの用語はの用語解説で読めるため、リンク記法は使っていない

## 要確認（status に反映）

- businessModel: 事業収益が主要な経営指標等の推移で全年度「－」のため、財務の売上は全年度nullとしています。売上が全年度空欄である取扱いには人の確認が必要です

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
