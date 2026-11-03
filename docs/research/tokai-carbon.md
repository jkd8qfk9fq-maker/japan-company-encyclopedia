# 東海カーボン — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東海カーボン株式会社 |
| 証券コード | 5301 |
| docID（データを取り出した文書） | `S100XU85` |
| 原本 docID | `S100XU85` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU85.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東海カーボン株式会社 / 5301 / docID S100XU85（id は英語表記「TOKAI CARBON CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokai-carbon: 10 件の数値を有報XBRLと照合
有報: 東海カーボン株式会社 有価証券報告書－第164期(2025/01/01－2025/12/31) (docID S100XU85)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":-56736000000,"latestFiling":-56485000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":640753000000,"latestFiling":643517000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":325158000000,"latestFiling":324740000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tokai-carbon: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: customers のうち『半導体向けの製造に関わる会社』『アルミニウム製錬会社』『製鋼会社』は、MD&Aの各事業の説明（ソリッドSiCフォーカスリング、アルミ電解炉用カソード、電気製鋼炉用黒鉛電極）の用途から読める範囲で記した。個別の販売先は印字がなく、売上高10％以上の相手先もない。
- businessModel: financialNotes の前期有報の値（567億3千6百万円）は brief.md の修正再表示チェックによる。有報本文はこの差を『暫定的な会計処理の確定を反映』と説明している。
- businessModel: Vision 2030 の目標のうちEBITDAマージン・ROICは投資指標に近いので書かず、売上高5,000億円だけを引いた。
- businessStructure: 決算期は表紙DEIで2025年1月1日〜2025年12月31日（2025年12月期）、Japan GAAP、連結あり。上場は表紙の東京証券取引所プライム市場。
- businessStructure: 並び順は【セグメント情報】の外部顧客への売上高（百万円）：カーボンブラック147,093＞スメルティング＆ライニング61,751＞ファインカーボン55,969＞黒鉛電極37,573＞工業炉10,728。その他事業9,843は報告セグメントに含まれないため最後。【事業の内容】は「６事業」と書くが、セグメント注記は報告セグメント5つ＋その他。
- businessStructure: セグメント利益は金額・増減とも本文に書いていない。
- businessStructure: 2024年12月期の数値は企業結合の暫定的な会計処理の確定を反映した後の金額で、前期比は有報の印字をそのまま使った。
- businessStructure: customers は書いていない：売上高の10％以上を占める相手先がなく、個別の販売先は印字がない（カーボンブラックの主要顧客がタイヤメーカーという記述だけ使用）。
- history: 沿革の表は年月と事象が正しく対応して印字されている。会社の事業の話題に関係の深い14件を選び、小規模な子会社設立などは省いた。
- history: 2026年1月1日の子会社の合併・商号変更（Tokai Carbon GS, Inc.）は決算期後の出来事で、沿革の事項としては取り上げていない。
- industry: 主たる業界は、売上の最大の報告セグメントであるカーボンブラック事業（素材）に合わせて化学とした。
- industry: 半導体は、ファインカーボン事業がメモリ半導体向けのソリッドSiCフォーカスリングを製品として開示しているため2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックにない（読めなかった）ため、掲載済み企業と同一性を確認できる相手がなく、結んだ関連企業はない。
- relatedCompanies: 株式会社ブリヂストン：タイのカーボンブラック会社の株式の譲渡元だが、2025年9月の1回限りの取引で、候補ファイルでの同一性確認もできないため結ばない。
- relatedCompanies: 子会社・関連会社は【関係会社の状況】にすべて非上場の子会社で、掲載済み上場企業ではない。
- terms: 用語集への追加候補（助言のみ）：カーボンブラック、黒鉛電極、電気製鋼炉、ソリッドSiC、フォーカスリング、アルミ電解用カソード、等方性黒鉛材。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 東海カーボン（炭素製品全般） → 提案: 素材・非鉄金属（炭素・黒鉛などの素材）。カーボンブラック・黒鉛電極など炭素素材が事業の中心で、閉じた分類では化学が最も近いが、素材全般の区分があれば合う。
