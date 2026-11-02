# 日清製粉グループ本社 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社日清製粉グループ本社 |
| 証券コード | 2002 |
| docID（データを取り出した文書） | `S100YE6A` |
| 原本 docID | `S100YE6A` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE6A.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社日清製粉グループ本社 / 2002 / docID S100YE6A（id は英語表記「NISSHIN SEIFUN GROUP INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nisshin-seifun-group: 10 件の数値を有報XBRLと照合
有報: 株式会社日清製粉グループ本社 有価証券報告書－第182期(2025/04/01－2026/03/31) (docID S100YE6A)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nisshin-seifun-group: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は百万円の印字どおりで、億円への書き換えはしていない。
- businessModel: 前期の純利益34,684百万円は、brief の5年間の数値で前期有報との一致を確認済み。
- businessModel: 財務諸表の組替えの記載が注意に出ていたが、前期有報と重複年度が全て一致しているため、basis は付けていない。financialNotes は書いていない。
- businessModel: セグメント利益は営業利益ベースで方針により書いていない。
- businessStructure: 並び順はセグメント注記の2026年3月期の外部顧客への売上高: 製粉428,533 > 食品216,620 > 中食・惣菜164,552（百万円）。「その他」55,298は報告セグメントに含まれないと明記されているため最後。
- businessStructure: children は使っていない（セグメント別の製品区分に金額の独立開示がないため）。
- businessStructure: セグメント利益は営業利益ベースだが、方針により本文には書いていない。
- businessStructure: 報告セグメントの変更はなく、配賦基準の変更（全社共通費用）はセグメント利益のみに関わるため本文に書いていない。
- businessStructure: name は表紙の商号「株式会社日清製粉グループ本社」から法人格を除いた。shortNameEn は英訳名「NISSHIN SEIFUN GROUP INC.」から INC. を除いた。
- history: 沿革表の1996年は「1996年4月」「1996年10月」の年月が連続して印字され、事象（日清キョーリン製薬の合弁運営開始、Medallion Foods設立）が後ろにまとまる崩れた表。他の節で日付を裏付けられないため、この2行は採用しなかった。
- history: 2021年の項は、2020年3月の事業譲渡と2021年3月の生産終了を1項目にまとめ、年は事業終了の2021年とした。
- history: 2005年のイニシオフーズによる三幸の吸収合併など細かな行は省略した。
- industry: 報告セグメントの製粉・食品・中食・惣菜がいずれも食品の製造・販売で、売上の大半を占めるため food のみ。その他事業（エンジニアリング等）は報告セグメント外で業界を足していない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業との同一性を確かめられないため、結んだ関連企業はない。
- relatedCompanies: 日本ロジテム㈱: 持分法適用会社（議決権25.9％、うち間接20.8％）で有価証券報告書提出会社と印字されているが、候補ファイルが無く掲載済みか確認できないため結ばなかった。
- relatedCompanies: 日清丸紅飼料㈱（持分法適用会社・議決権40.0％）: 上場ではない旨の確認ができず、候補にもないため結ばなかった。
- relatedCompanies: ホクレン農業協同組合連合会（日清製粉㈱が業務提携契約）: 上場企業ではないため結ばなかった。
- relatedCompanies: 大株主の状況は金融機関・信託銀行・運用会社が中心で、事業会社の大株主はないため major-shareholder は結ばなかった。
- terms: 用語の追加候補: プレミックス（小麦粉に砂糖・油脂などを加えて、水や卵を足すだけで調理できるようにした粉）、ふすま（小麦を挽くときに出る副製品）、持株会社、中間持株会社、特約店、中食（弁当・惣菜など買ってすぐ食べられる調理済み食品）。
- terms: 既存の用語に同じ語があるかは、今回は確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
