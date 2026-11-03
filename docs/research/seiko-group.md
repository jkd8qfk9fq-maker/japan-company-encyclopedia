# セイコーグループ — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | セイコーグループ株式会社 |
| 証券コード | 8050 |
| docID（データを取り出した文書） | `S100YHM2` |
| 原本 docID | `S100YHM2` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHM2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | セイコーグループ株式会社 / 8050 / docID S100YHM2（id は英語表記「SEIKO GROUP CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
seiko-group: 10 件の数値を有報XBRLと照合
有報: セイコーグループ株式会社 有価証券報告書－第165期(2025/04/01－2026/03/31) (docID S100YHM2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
seiko-group: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 戦略・強みの perspectives は有報の該当節を読まず省いた。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高（218,009 / 59,846 / 55,063百万円）の順。「その他」は報告セグメントに含まれないため最後。
- businessStructure: 2025年4月1日付でセイコータイムクリエーション㈱を『システムソリューション事業』に、セイコーフューチャークリエーション㈱を『その他』に変更した旨が有報にある。
- history: 沿革表は年月と事象が文章形式で印字されており、そのまま対応づけた。多数ある五輪の公式計時担当・海外子会社設立などは省いた。
- industry: 最大の報告セグメントはウオッチ・宝飾で、合う業界が無いため、電子デバイスも持つ electronics を暫定の主業界にした。システムソリューション事業は報告セグメントなので it を追加。
- relatedCompanies: related-candidates.json が証拠パックに無かったため、同一性は src/data/companies に seiko-epson・ohara が存在することで確認した。
- relatedCompanies: ㈱ジーダット: 持分法適用関連会社（21.2%）だが、掲載済み企業に見当たらないため結ばない。
- relatedCompanies: 三光起業・服部家個人・日本マスタートラスト信託銀行・第一生命: 事業会社として取引・提携の記載が無い、または金融機関の純投資のため結ばない。
- terms: 用語の助言: 持株会社、クオーツ、スプリングドライブ、水晶振動子、キャッシュレス、IoT は読者に説明があると分かりやすい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] セイコーグループの主力のウオッチ・時計事業 → 提案: 時計・精密機器（または消費財）。売上最大のウオッチ・クロック・宝飾事業を表す業界が閉じた分類に無い。
