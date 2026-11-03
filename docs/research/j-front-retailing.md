# J.フロント リテイリング — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | Ｊ．フロント　リテイリング株式会社 |
| 証券コード | 3086 |
| docID（データを取り出した文書） | `S100Y6K0` |
| 原本 docID | `S100Y6K0` |
| 提出日（原本） | 2026-05-26 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6K0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | Ｊ．フロント　リテイリング株式会社 / 3086 / docID S100Y6K0（id は英語表記「J.FRONT RETAILING Co.,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
j-front-retailing: 10 件の数値を有報XBRLと照合
有報: Ｊ．フロント　リテイリング株式会社 有価証券報告書－第19期(2025/03/01－2026/02/28) (docID S100Y6K0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
j-front-retailing: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「J.フロント リテイリング株式会社」が EDINET の提出者名「Ｊ．フロント　リテイリング株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 最上位の description は営業利益などを含まない一文で、セグメント名と沿革の事実から書いた。
- businessModel: 利益の段は、方針により親会社の所有者に帰属する当期利益だけを書き、税引前利益やセグメント利益は書かなかった。
- businessModel: 地域別の売上収益は、本邦が大部分を占めるとして有報が記載を省略している。主要な顧客の記載は見つけていないため、特定の顧客は書いていない。
- businessModel: perspectives（戦略・強み）は省略した。
- businessStructure: 並び順は【セグメント情報】の外部収益（2026年2月期）に従い、百貨店267,744／SC66,027／デベロッパー60,198／決済・金融4,276百万円の順。「その他」（46,839百万円）は報告セグメントに含まれない区分と有報が書くため、金額が決済・金融より大きくても最後に置いた。
- businessStructure: 決算期は表紙のDEIから2026年2月期。会計基準はIFRSで、売上高は有報の「売上収益」。
- businessStructure: 2024年9月1日のグループ内組織再編で、「その他」のＪ.フロントＯＮＥパートナーの運営事業の一部をデベロッパー事業へ移管し、前期期首に遡って修正している（segment-changes）。本文は当期の値だけを使い、前期との比較は書いていない。
- businessStructure: セグメント利益、セグメント資産などの金額は方針により本文に書いていない。
- businessStructure: 取引所は表紙の「東京証券取引所プライム市場／名古屋証券取引所プレミア市場」から。
- history: 沿革には小さな会社の設立・合併・清算が多数あり、グループの形を変えた主な出来事だけを選んだ。選ばなかったものの例：2008年の大丸装工などの合併、2009〜2020年の各社の吸収合併や清算。
- history: 各行の「significance」は、有報の事実から読める範囲に限った。
- industry: 主たる業界は、外部収益の大半を占める百貨店事業（267,744百万円、2026年2月期）で retail とした。SC事業（ショッピングセンターの運営）も小売業の枠に入れた。
- industry: デベロッパー事業は不動産の開発・販売・管理・運営を行う報告セグメント（外部収益60,198百万円）として開示されているため、real-estate を2つ目に付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みで本文に社名がある候補を機械的に確認できなかったため、関連企業は結ばなかった。
- relatedCompanies: 【関係会社の状況】の連結子会社・持分法適用関連会社は、いずれも有報の提出会社ではない非上場の会社で、上場企業としての掲載対象ではない。
- relatedCompanies: 沿革に出てくるイオン、エディオン、ワールドホールディングス、ダンシンダイナーは、過去の株式譲渡の相手先で、現在の取引・提携の記述がないため結ばない。
- terms: 助言のみ。今回の本文ではリンク記法を使っていないため、必須の用語はない。
- terms: 新設を提案する候補：持株会社、百貨店とショッピングセンター（SC）の違い。いずれも既存の用語集にあるかは確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
