# 信越ポリマー — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 信越ポリマー株式会社 |
| 証券コード | 7970 |
| docID（データを取り出した文書） | `S100YE3Y` |
| 原本 docID | `S100YE3Y` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-16 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE3Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 信越ポリマー株式会社 / 7970 / docID S100YE3Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
shin-etsu-polymer: 10 件の数値を有報XBRLと照合
有報: 信越ポリマー株式会社 有価証券報告書－第66期(2025/04/01－2026/03/31) (docID S100YE3Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shin-etsu-polymer: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空配列とした。有報の「表示方法の変更」は、連結損益計算書における営業外収益の「受取配当金」の独立掲記と、連結キャッシュ・フロー計算書における一部項目の「その他」への集約に伴う前年度の組替えのみで、売上高・経常利益・当期純利益・総資産・純資産の5年経営指標には影響しない。前期有報との修正再表示チェックも全行一致したため、ノートには入れず、この判断経緯をここに記録した。
- businessModel: 中期経営計画「SEP G&G 2029」の2030年3月期の数値目標は将来の目標値のため、本文・perspectives には書かなかった。
- businessModel: Wikipedia の記事には順位にあたる記述があるが、順位・シェアは使わない規則のため使用せず、創業の経緯も有報で確認できるため、Wikipedia は出典に加えなかった。
- businessStructure: 事業の並びはセグメント情報の外部顧客への売上高の大きい順（精密成形品事業59,773百万円、電子デバイス事業25,726百万円、住環境・生活資材事業21,513百万円）。「その他」は報告セグメントに含まれない区分（工事関連事業など）のため最後に置いた。
- businessStructure: 事業の内容の事業区分とセグメント情報における事業区分の内容は同一である旨が有報に印字されている。children は事業の内容に印字された主要製品の区分どおりとし、金額が独立して開示されていない区分には金額を書かなかった。
- history: 沿革表は年月と事象が対応する通常形式で、全33行を収録した。設立行に資本金額の印字はない。
- industry: 主たる業界は chemicals（化学）とした。取引所の業種区分が化学であり、親会社の信越化学工業から塩化ビニル樹脂やシリコーンを仕入れて樹脂加工品を製造する樹脂加工メーカーであることが根拠。売上の過半を占める精密成形品事業は樹脂の精密成形品である。
- industry: semiconductors は、精密成形品事業で半導体関連容器とキャリアテープ関連製品を事業として開示しているため2つ目に付けた。electronics は、自動車・電子機器向けの入力デバイスやコネクター関連製品を扱う電子デバイス事業の開示があるため付けた。
- relatedCompanies: 三菱UFJフィナンシャル・グループ、みずほフィナンシャルグループ、八十二長野銀行は特定投資株式に載るが、いずれも主要取引金融機関としての保有であり、資金調達等の金融取引が理由のため結ばなかった。
- relatedCompanies: 三菱商事は、沿革で1993年の蘇州、2007年のインドの合弁設立の相手として印字されるが、両合弁とも後に当社の全額出資に変更されており、現在の取引・提携の印字がないため結ばなかった。
- relatedCompanies: 積水化学工業は、2023年11月に南陽工場を含む塩ビ管等事業の譲渡先として印字されるが、1回限りの事業譲渡であり、現在の取引・提携の印字がないため結ばなかった。
- relatedCompanies: 大株主として印字される「光通信KK投資事業有限責任組合」は投資事業組合であり、株式会社光通信そのものではないため、光通信は結ばなかった。
- relatedCompanies: リコーは、候補の一致が「シリコーン」などの語の部分一致であり、株式会社リコーへの言及はないため結ばなかった。
- relatedCompanies: キャリア、ベース、レイ、イノベーション、スローガン、コア、コロナ、エン、フリーは、製品名や一般語の部分一致による誤抽出のため結ばなかった。
- relatedCompanies: 南陽は「南陽工場」の工場名の一致、サンエーは旧子会社「株式会社サンエース」の部分一致で、いずれも候補の会社とは別法人のため結ばなかった。
- relatedCompanies: トラストは、日本マスタートラスト信託銀行（信託口）の信託保有で純投資にあたり、コードリストにもないため結ばなかった。
- relatedCompanies: 信越半導体は親会社の子会社で、製品の一部を販売していることが事業の内容に印字されているが、未上場で候補データにないため結ばず、役割を businessModel の flow に記録した。
- relatedCompanies: 連結子会社16社はすべて未上場で候補データにないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報に説明・経緯のある当社グループ固有の製品名に限った（助言のみ）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
