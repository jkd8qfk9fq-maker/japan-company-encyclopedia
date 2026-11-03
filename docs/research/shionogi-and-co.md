# 塩野義製薬 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 塩野義製薬株式会社 |
| 証券コード | 4507 |
| docID（データを取り出した文書） | `S100Z43Z` |
| 原本 docID | `S100YF57` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100Z43Z／有効文書 S100Z43Z（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z43Z.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 塩野義製薬株式会社 / 4507 / docID S100YF57（id は英語表記「Shionogi &amp; Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shionogi-and-co: 10 件の数値を有報XBRLと照合
有報: 塩野義製薬株式会社 訂正有価証券報告書－第161期(2025/04/01－2026/03/31) (docID S100Z43Z)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第161期(2025/04/01－2026/03/31)、docID S100Z43Z）を有効文書としてこのパックを作った。原本は docID S100YF57。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはNotesRelatedPartiesConsolidatedFinancialStatementsIFRSTextBlock・RemunerationEtcPaidByGroupToEachDirectorOrOtherOfficerTextBlock・RemunerationForDirectorsAndOtherOfficersTextBlock・BaseRemunerationRemunerationEtcByCategoryOfDirectorsAndOtherOfficers・OtherRemunerationEtcByCategoryOfDirectorsAndOtherOfficers・TotalAmountOfRemunerationEtcPaidByGroupRemunerationEtcPaidByGroupToEachDirectorOrOtherOfficer・TotalAmountOfRemunerationEtcRemunerationEtcByCategoryOfDirectorsAndOtherOfficers（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shionogi-and-co: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 収入源の4つの金額はMD&Aの印字（億円）のまま使い、合計は書いていない。ViiVからの配当金（524億円）は売上収益ではなく金額も書いていない。
- businessModel: 利益の段は、本文で使えるのが当期純利益だけのため、親会社の所有者に帰属する当期利益だけを書いた。
- businessModel: 訂正有報は record-only（原本と数値・本文が同一）のため needsReview にしていない。財務諸表の組替え注記は、5年の数値が前期有報と一致しており、basis は不要と判断した。
- businessStructure: 単一セグメント（セグメント情報の開示は省略）のため、事業は医療用医薬品1つとし、MD&Aが分けて金額を印字する4つの収入源を children にした。並びは印字金額（2,613億／1,235億／650億／173億円）の大きい順。4つの合計は売上収益全体と一致する保証がないため、合計は書いていない。
- businessStructure: ViiV Healthcareからの配当金収入（524億円）は売上収益ではなく金額も書かず、存在だけを説明に記した。
- businessStructure: セグメント注記の地域別売上（日本152,107／欧州298,810／北米33,088／その他15,670百万円）は顧客所在地の区分でMD&Aの収入源の区分と一致しないため使っていない。
- businessStructure: 財務諸表の組替え・遡及適用の注記は、前期との5年数値が一致しており、事業説明に影響しないため basis は不要と判断した。
- history: 沿革の表は年月と事象が連結された形で印字されており、年月と事象の対応が明確な行だけを使った。1963年の台湾塩野義製薬設立など、ここに載せなかった行は省略した（誤りではなく選別）。
- history: 2020年の平安塩野義2社は、沿革に出資相手の記載がないため、相手は書いていない。
- industry: 医療用医薬品の単一セグメントのため、医薬品のみとした。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる掲載済みの上場企業がないため、結ばなかった。
- relatedCompanies: ViiV Healthcare Ltd.（持分法適用関連会社、21.7％）、F. Hoffmann-La Roche Ltd、日本たばこ産業（JT医薬事業の承継元）、田辺ファーマ（エダラボン事業の承継元）は、候補ファイルに無く同一性が確認できないため結んでいない。連結子会社（鳥居薬品など）は非上場または掲載外。
- terms: 用語の助言：ロイヤリティー（特許などの使用料）、ライセンス契約、導出（開発した薬の権利を他社に渡すこと）、持分法適用関連会社、共同支配企業、コ・プロモーション（複数社での共同販促）、後発医薬品、長時間作用型注射製剤（LAI製剤）は、読者に補足があると分かりやすい。既存の用語集に無ければ追加を検討してほしい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
