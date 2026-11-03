# 三協立山 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三協立山株式会社 |
| 証券コード | 5932 |
| docID（データを取り出した文書） | `S100YYN7` |
| 原本 docID | `S100YYN7` |
| 提出日（原本） | 2026-08-26 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYN7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三協立山株式会社 / 5932 / docID S100YYN7（id は英語表記「Sankyo Tateyama,Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
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
sankyo-tateyama: 10 件の数値を有報XBRLと照合
有報: 三協立山株式会社 有価証券報告書－第81期(2025/06/01－2026/05/31) (docID S100YYN7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sankyo-tateyama: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 営業利益・経常利益・セグメント利益と、減損損失・特別損益の金額は方針により本文に書いていない。
- businessModel: 欧州子会社の2027年5月期の収益貢献見込みは将来予想のため書いていない。
- businessStructure: 並びは【セグメント情報】2026年5月期の外部顧客への売上高の順（建材167,537 > 国際79,221 > マテリアル67,729 > 商業施設42,599百万円）。『その他』は報告セグメントに含まれない区分なので最後。
- businessStructure: 事業の内容の記載順は建材・マテリアル・商業施設・国際だが、売上順に並べ替えた。
- businessStructure: shortNameEn は表紙の英訳名 Sankyo Tateyama,Inc. から法人格を除いた。
- history: 沿革表は『年月＋事象』が連続する形式で、読み取りに問題はなかった。工場の竣工や子会社設立などは省いた。
- history: 『significance』の1948年・1960年・2006年の記述は、沿革の改称・合併の事実から読める範囲に限った。
- industry: 最大の報告セグメントは建材事業（外部顧客への売上高の約47％）。ビル・住宅建材とエクステリアを扱うため、最も近い construction を主たる業界にした。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる掲載済みの上場企業がないため、結んだ相手はいない。
- relatedCompanies: 連結子会社・持分法適用関連会社（三協テック、ビニフレーム工業、協和紙工業など）は有報上は上場企業として確認できない。
- relatedCompanies: アイシン、山下設計は内窓設置型ペロブスカイト太陽電池ユニットの共同開発先だが、候補ファイルに無く、1回の共同開発だけでは関係性の根拠が足りないため結ばない。
- terms: 助言: 「アルミ押出形材」「サッシ」「エクステリア」「アルミ地金」は読者に説明があると分かりやすい用語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 三協立山の主たる業界 → 提案: 建材・非鉄金属（アルミ加工）。アルミ建材とアルミ押出形材のメーカーで、建設業そのものではなく、閉じた分類に合う値がありません。
