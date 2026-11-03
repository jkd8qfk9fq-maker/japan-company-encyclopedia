# 東建コーポレーション — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東建コーポレーション株式会社 |
| 証券コード | 1766 |
| docID（データを取り出した文書） | `S100YS6C` |
| 原本 docID | `S100YS6C` |
| 提出日（原本） | 2026-07-24 |
| 決算期 | 2026-04-30 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YS6C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東建コーポレーション株式会社 / 1766 / docID S100YS6C（id は英語表記「TOKEN CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
token: 10 件の数値を有報XBRLと照合
有報: 東建コーポレーション株式会社 有価証券報告書－第50期(2025/05/01－2026/04/30) (docID S100YS6C)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
token: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 純利益は金額を書かず、前期比の方向だけにした（15,778百万円から16,161百万円）。
- businessStructure: 事業の並びは外部顧客への売上高の順（不動産賃貸、建設、報告セグメントに含まれないその他）。
- businessStructure: related-candidates.json は証拠パックに無かった。
- industry: 外部売上は不動産賃貸事業が建設事業より大きいため、不動産を主たる業界にした。
- relatedCompanies: 光通信（hikari-tsushin）: 【関係会社の状況】でその他の関係会社（被所有27.2％、2026年4月30日現在）だが、証拠パックに related-candidates.json が無く、同一性の機械確認ができないため結ばなかった。候補ファイルがあれば other-affiliated-company で結べる。
- relatedCompanies: 光通信ＫＫ投資事業有限責任組合: 大株主だが投資ファンドのため結ばない。
- terms: 用語候補: サブリース（一括借り上げ）、マスターリース。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
