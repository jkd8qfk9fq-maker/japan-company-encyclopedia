# フジ・メディア・ホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社フジ・メディア・ホールディングス |
| 証券コード | 4676 |
| docID（データを取り出した文書） | `S100YHYX` |
| 原本 docID | `S100YHYX` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHYX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社フジ・メディア・ホールディングス / 4676 / docID S100YHYX（id は英語表記「FUJI MEDIA HOLDINGS, INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fuji-media-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社フジ・メディア・ホールディングス 有価証券報告書－第85期(2025/04/01－2026/03/31) (docID S100YHYX)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fuji-media-holdings: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空。brief の「財務諸表の組替え」の記載を見たが、前期有報との重複年度は全て一致しており、変則決算・会計基準の変更も無い。
- businessModel: 営業損益・経常損益・セグメント利益・総資産・純資産・自己株式の金額、政策保有株式の売却額は規則により本文に書いていない。
- businessModel: 売上高の主な相手先は㈱電通と㈱博報堂（MD&Aの印字。前期有報の㈱博報堂ＤＹメディアパートナーズは2025年4月に経営統合し㈱博報堂）。
- businessModel: 財務の理由説明に出る「同社の事案」は有報が具体的な内容を書かないので「事案」とだけ書いた。
- businessStructure: 決算期は2026年3月期（表紙のDEIの当事業年度終了日 2026-03-31）。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高（メディア・コンテンツ349,876／都市開発・観光192,859百万円）。「その他事業」は有報が報告セグメントに含まれないと書くので売上9,129百万円でも末尾に置いた。
- businessStructure: children の区分は【事業の内容】が名指しする区分で、金額が独立して開示されていないため、㈱フジテレビジョンと㈱サンケイビルの会社単位の売上高を除き金額を書いていない。
- businessStructure: 子会社の数は【事業の内容】の印字（子会社85社・関連会社50社）があるが、本文には使っていない。
- businessStructure: listings は表紙の東京証券取引所プライム市場のみ。
- history: 【沿革】の表は年月と事象の対応が崩れていない。1959年の行は1958年12月の社名変更と同じ段落にまとめた。
- history: 2025年7月の㈱dinosへの商号変更は【沿革】ではなくMD&Aの記載（2025年7月1日付）による。
- history: 【沿革】に1995年の㈱フジサンケイグループ本社の吸収合併、2009年の㈱セシールの連結子会社化などもあるが、10件に絞って省いた。
- industry: 主たる業界は外部顧客への売上高が最大のメディア・コンテンツ事業（349,876百万円）でメディア。都市開発・観光事業は報告セグメントとして開示（192,859百万円）されているので不動産を2つ目に付けた。ホテル運営の区分は用意が無く、不動産に含めた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの企業idを確認できないため、誰も結んでいない。
- relatedCompanies: 東宝㈱（大株主、2026年3月31日現在12.77％）: 候補ファイルが無く同一性を確認できない。有報は取引・提携を述べておらず、major-shareholder の候補。
- relatedCompanies: 関西テレビ放送㈱（持分法適用関連会社、議決権25.0％）・㈱WOWOW（同20.9％）: 上場かどうか・掲載済みかを確認できない。掲載済みなら affiliate の候補。
- relatedCompanies: ㈱文化放送・㈱NTTドコモ・㈱ヤクルト本社・東海テレビ放送㈱（大株主）: 持株比率だけで、事業会社としての取引・提携の記載が無い。
- relatedCompanies: ㈱電通・㈱博報堂: 主な販売先として売上の記載があるが、候補ファイルが無く同一性を確認できない。customer の候補。
- terms: 用語の助言: 「認定放送持株会社」（放送局を子会社として持つ持株会社の制度）、「FNS（フジネットワークシステム）」、「基幹放送」、「持分法適用関連会社」、「オフバランス化」は、読者に説明があると分かりやすい用語。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
