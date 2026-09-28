# ニッスイ — research log

Registered: 2026-09-28（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ニッスイ |
| 証券コード | 1332 |
| docID | `S100YHOQ` |
| 提出日 | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHOQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ニッスイ / 1332 / docID S100YHOQ（id は英語表記「Nissui Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | pending | 0 |  |
| businessModel | pending | 0 |  |
| history | pending | 0 |  |
| industry | pending | 0 |  |
| relatedCompanies | pending | 0 |  |
| terms | pending | 0 |  |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 3 |  |

## 数値の照合（verify-financials.mjs）

```
nissui: 10 件の数値を有報XBRLと照合
有報: 株式会社ニッスイ 有価証券報告書－第111期(2025/04/01－2026/03/31) (docID S100YHOQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nissui: 本文の金額 0 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

なし。

## 要確認（status に反映）

なし。
