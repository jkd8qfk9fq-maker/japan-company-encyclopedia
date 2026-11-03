# 大王製紙 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大王製紙株式会社 |
| 証券コード | 3880 |
| docID（データを取り出した文書） | `S100YJ8D` |
| 原本 docID | `S100YJ8D` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ8D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大王製紙株式会社 / 3880 / docID S100YJ8D（id は英語表記「Daio Paper Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daio-paper: 10 件の数値を有報XBRLと照合
有報: 大王製紙株式会社 有価証券報告書－第115期(2025/04/01－2026/03/31) (docID S100YJ8D)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daio-paper: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: businessModel の locator・sourceIds は business.txt と segments.txt（【事業の内容】【セグメント情報】）に基づく。
- businessModel: 顧客の種類は有報に印字が乏しいため、印字のある地域や販売会社だけを書いた。
- businessStructure: 事業の並びは【セグメント情報】の外部顧客への売上高の大きい順。「その他」は報告セグメントに含まれない区分なので最後。
- businessStructure: 有報に顧客の種類の印字は無いので、紙・板紙事業の customers は推測せず、印字が無い旨を書いた。
- history: 沿革の表は正常に年月と事象が対応していたので、そのまま使った。
- history: 2012年の連結子会社数の変更や各工場の抄紙機増設などは細かいため省いた。
- industry: 紙・パルプは閉じた分類に無く、素材系で最も近い chemicals を暫定にした。報告セグメントは紙・板紙と家庭用品で、どちらも製紙。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業との同一性を確かめられないので、結んだ相手はいない。
- relatedCompanies: 北越コーポレーション: 戦略的業務提携と相互の株式保有（2026年3月）が印字されているが、候補ファイルに無く掲載済みか確認できないため結ばなかった。
- relatedCompanies: 連結子会社31社・持分法適用関連会社の東京紙パルプ交易: 上場企業としての同定ができず、結ばなかった。
- terms: 用語集への追加候補（助言のみ）: 板紙、抄紙機、衛生用紙、セルロースナノファイバー（CNF）、フェミニンケア用品。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 大王製紙の主たる業界 → 提案: paper-pulp（紙・パルプ）。売上の大半は紙・板紙と衛生用紙で、化学には当たらない。
