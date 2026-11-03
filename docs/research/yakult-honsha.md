# ヤクルト本社 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ヤクルト本社 |
| 証券コード | 2267 |
| docID（データを取り出した文書） | `S100YCBJ` |
| 原本 docID | `S100YCBJ` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCBJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ヤクルト本社 / 2267 / docID S100YCBJ（id は英語表記「YAKULT HONSHA CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yakult-honsha: 10 件の数値を有報XBRLと照合
有報: 株式会社ヤクルト本社 有価証券報告書－第74期(2025/04/01－2026/03/31) (docID S100YCBJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
yakult-honsha: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は、変則決算・会計基準の変更がないため書かなかった。
- businessModel: perspectives（戦略・強み）は、この作業では読み込んでいないため省いた。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順（日本220,386、アジア・オセアニア136,209、米州91,120、その他事業26,014、ヨーロッパ12,694）。
- businessStructure: その他事業は報告セグメントの表に売上高とともに載っているため、売上順に置いた。
- businessStructure: 米州・アジア・オセアニアのうち、メキシコ・中国などの国別売上は事業の説明に書かなかった。
- history: 沿革の表は年月と事象が連続して印字されていたが、行の対応は取れているため全行を読めた。主要な出来事だけを選んで載せた。
- history: 1980年の二部上場は1981年の一部上場の項にまとめた。
- industry: 売上の大半は飲料および食品製造販売事業の各地域区分のため、食品のみとした。化粧品・医薬品は金額が独立して開示されていないため業界を足していない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、結んだ相手は無い。
- relatedCompanies: 【関係会社の状況】に載る子会社・関連会社（東京ヤクルト販売、ヤクルト球団、韓国ヤクルトなど）は、候補に無く上場の確認もできないため結ばなかった。
- relatedCompanies: グループダノンとの提携は2013年に終了しており、過去の提携のため結ばなかった。
- terms: 用語の助言: 「持分法適用会社」「連結子会社」「報告セグメント」は読者がつまずきやすい語。辞書に無ければ追加を検討する。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
