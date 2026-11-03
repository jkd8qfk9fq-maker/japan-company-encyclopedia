# IDOM — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＩＤＯＭ |
| 証券コード | 7599 |
| docID（データを取り出した文書） | `S100Y6I6` |
| 原本 docID | `S100Y64O` |
| 提出日（原本） | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100Y6I6／有効文書 S100Y6I6（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6I6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＩＤＯＭ / 7599 / docID S100Y64O（id は英語表記「IDOM Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
idom: 10 件の数値を有報XBRLと照合
有報: 株式会社ＩＤＯＭ 訂正有価証券報告書－第32期(2025/03/01－2026/02/28) (docID S100Y6I6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第32期(2025/03/01－2026/02/28)、docID S100Y6I6）を有効文書としてこのパックを作った。原本は docID S100Y64O。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
idom: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社IDOM」が EDINET の提出者名「株式会社ＩＤＯＭ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益は本文に書かない規則のため、利益は当期純利益だけにした。
- businessModel: ユー・エス・エスは主要な顧客として売上高と割合が印字されているが、取引の内容（卸売など）は印字がない。
- businessModel: 訂正有報の分類は record-only。遡及適用に関する記載は本文のセグメント・MD&Aの範囲では見つからず、basis は付けなかった。
- businessStructure: 事業の並びは外部顧客への売上高の順（日本553,744百万円、その他9,030百万円）。
- businessStructure: 日本の children は金額が独立して開示されていないため、金額を書いていない。
- businessStructure: wikipedia.json と related-candidates.json はパックに無かった。
- history: 沿革の表は2014年6月〜2015年1月の行と、2017年6月〜2025年6月の行で年月と事象が分かれて印字されている。2017年6月〜2019年8月は年月3つと事象3つで数が合うが、2020年4月以降は年月12に対し事象13で合わない。
- history: 2020年4月以降の行は、他の節で日付を裏付けられた2025年6月の株式会社IDOM Career Connectionsの設立（関係会社の状況に2025年6月23日）だけを使い、ほかは落とした。落とした行: クルマ支援、IDOM CaaS Technology設立、NOREL・GO2GO事業の承継、FMG設立、モトーレングランツ・モトーレングローバルの株式譲渡、紺綬褒章、本店移転、プライム市場への移行、豪州事業の株式売却、ガリバーインシュアランスの吸収合併、IDOM Digital Drive設立。
- history: 2014年6月・2015年1月の豪州・NZ関連の行と2015年9月の豪州買収は、数が合う年月が確認できないため、現在の事業に結びつく行だけを残して省いた。2017年6月〜2019年8月の3行（攻めのIT経営銘柄、AWMグループ取得、GO2GO開始）も省いた。
- industry: 一般消費者への小売が主要な販路のため小売を主たる業界にした。中古車・新車の販売なので自動車を2つ目に付けた。
- relatedCompanies: 株式会社ユー・エス・エス: 主要な顧客として売上高の印字はあるが、related-candidates.json がパックに無く上場の同一性を確認できず、取引の内容も印字がない。結ばない。
- relatedCompanies: 子会社（Gulliver USA, Inc.ほか計8社）: いずれも非上場で、掲載済み企業ではない。結ばない。
- terms: 用語の候補: オートオークション（MD&Aが小売・卸売単価の上昇の理由に挙げる）、中古車小売、リース・レンタル。いずれも助言のみで、登録はしない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
