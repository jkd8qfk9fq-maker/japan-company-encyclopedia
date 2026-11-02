# 三菱瓦斯化学 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三菱瓦斯化学株式会社 |
| 証券コード | 4182 |
| docID（データを取り出した文書） | `S100YOVV` |
| 原本 docID | `S100YEUU` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YOVV／有効文書 S100YOVV（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YOVV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三菱瓦斯化学株式会社 / 4182 / docID S100YEUU（id は英語表記「MITSUBISHI GAS CHEMICAL COMPANY,INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 4 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsubishi-gas-chemical: 10 件の数値を有報XBRLと照合
有報: 三菱瓦斯化学株式会社 訂正有価証券報告書－第99期(2025/04/01－2026/03/31) (docID S100YOVV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第99期(2025/04/01－2026/03/31)、docID S100YOVV）を有効文書としてこのパックを作った。原本は docID S100YEUU。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitsubishi-gas-chemical: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businesses[0].description: 売上高と当期純利益以外の利益に触れていないか確認する（…サーバー向けの基板材料が伸びて増収・増益でした。一方、ポリカーボネートなどの…）
- 確認: [other-profit-wording] businesses[1].description: 売上高と当期純利益以外の利益に触れていないか確認する（…タキシレンジアミンの競争激化で減収・減益でした。オルソキシレンチェーンからは…）
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…。電子材料などの機能化学品事業部門は増益でした。中期経営計画「Grow UP…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は変則決算・会計基準の変更が無いため書いていない。純損失の金額は MD&A が億円の表のセルにしか印字していないため本文に書かず、売上高は百万円で印字された738,243を使った。
- businessModel: 地域別売上高の表は『アジア』の見出しの下に中国・その他の小列があり、数値の対応を確定できないため書いていない。
- businessModel: 営業利益・経常利益・セグメント利益・持分法損益・減損損失の金額は書いていない。ROIC・ROE・自己資本比率などの指標も書いていない。
- businessModel: [[term:…]] リンクは存在を確かめられないため使っていない。
- businessModel: 子会社84社・関連会社31社は【事業の内容】冒頭の印字（期末日の記載はなく、決算期末の2026年3月31日の数と読んだ）。
- businessStructure: 決算期は表紙DEIで2026年3月期（第99期、通常の12か月）。有効文書は訂正有報（S100YOVV、原本S100YEUU）。パックの注意どおり record-only の訂正（役員の状況のみ）で、事業・数値に影響しないため needsReview にしていない。
- businessStructure: 並び順はセグメント注記の外部顧客への売上高: 機能化学品447,999＞グリーン・エネルギー＆ケミカル277,904＞その他12,339（その他は報告セグメントに属さない区分なので最後）。MD&Aの段落の順（グリーン・エネルギー＆ケミカルが先）には従っていない。
- businessStructure: セグメント利益・営業利益・持分法損益・減損損失の金額は本文に書かず、増益・減益の方向だけ書いた。
- businessStructure: 財務諸表の組替えの記載はタイの有形固定資産の独立掲記（表示方法の変更）のみで、売上高・セグメント売上高の範囲には影響しない。
- businessStructure: 製品の括弧書き（半導体向け薬液、ポリカーボネートなど）は MD&A と関係会社の状況に出る名称から採った。
- history: 【沿革】全行のうち10行を選んだ。省いたのは個別の海外子会社の設立（シンガポール・米国・タイ・上海など）、榎工場、旧尿素・樹脂会社の合併・操業、社内カンパニー制・執行役員制、フィルシート統合などの細目。
- history: significance は沿革と事業の内容・関係会社の状況から読める事実に限った。
- industry: primary は chemicals。2つの報告セグメント（機能化学品、グリーン・エネルギー＆ケミカル）はどちらも化学品の製造・販売で、売上の大半を占める。
- industry: semiconductors は2つ目。機能化学品事業部門の無機化学品（半導体向け薬液）と電子材料（半導体パッケージ用BT材料）を事業として開示しているため。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業との同一性を確かめられないため、1社も結んでいない。
- relatedCompanies: ㈱ＪＳＰ: 持分法適用関連会社（議決権47.6％）で有報提出会社だが、候補ファイルが無く掲載済みかどうかを確認できない。
- relatedCompanies: 三菱ケミカルグループ㈱: 保有株式の表で『機能化学品事業における合弁パートナー、重要な販売先、仕入先』と述べられるが、取引の向きが印字されておらず、候補ファイルでの同一性確認ができない。
- relatedCompanies: 三菱商事㈱: 保有株式の表で『グリーン・エネルギー＆ケミカル事業における合弁パートナー、重要な販売先、仕入先』とあるが、同じ理由で結んでいない。
- relatedCompanies: 伊藤忠商事㈱: 沿革にブルネイのメタノール合弁を設立した旨のみ（2006年の過去の出来事）で、現在の関係の印字が確認できず、結んでいない。
- relatedCompanies: 大塚ホールディングス㈱: 保有株式の表の定型の保有目的のみで、同じ理由で結んでいない（子会社はエムジーシー大塚ケミカル㈱だが、同社は大塚グループの会社かどうか有報に印字がない）。
- terms: 用語の助言: メタノール、過酸化水素、エンジニアリングプラスチックス（ポリカーボネート・ポリアセタール）、BT材料（半導体パッケージ用基板材料）、メタキシレンジアミンは、初めて読む人に説明があると分かりやすい用語です。既存の用語ID は確認していないため、リンクは付けていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
