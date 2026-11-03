# 住友ベークライト — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 住友ベークライト株式会社 |
| 証券コード | 4203 |
| docID（データを取り出した文書） | `S100YITP` |
| 原本 docID | `S100YE8L` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YITP／有効文書 S100YITP（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YITP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 住友ベークライト株式会社 / 4203 / docID S100YE8L（id は英語表記「Sumitomo Bakelite Company Limited」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sumitomo-bakelite: 10 件の数値を有報XBRLと照合
有報: 住友ベークライト株式会社 訂正有価証券報告書－第135期(2025/04/01－2026/03/31) (docID S100YITP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第135期(2025/04/01－2026/03/31)、docID S100YITP）を有効文書としてこのパックを作った。原本は docID S100YE8L。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはAuditorsResponseKAMConsolidatedTextBlock・AuditorsResponseKAMNonConsolidatedTextBlock・DescriptionIncludingReasonKAMConsolidatedTextBlock・DescriptionIncludingReasonKAMNonConsolidatedTextBlock・IndependentAuditorsReportConsolidatedTextBlock・IndependentAuditorsReportNonConsolidatedTextBlock・KeyAuditMattersConsolidatedTextBlock・KeyAuditMattersNonConsolidatedTextBlock・SameAsKAMForConsolidatedFSKAMNonConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sumitomo-bakelite: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: customers は個別の販売先名が印字されていないため、事業の分野で書いた。
- businessModel: 遡及修正の注記は読んでおらず、financialNotes は前期有報との一致という確認済みの事実だけを書いた。
- businessModel: 営業利益・税引前利益・事業利益は本文に書いていない。
- businessStructure: 決算期は表紙のDEIで確認した：第135期、2026年3月31日終了、IFRS、連結決算あり。通常の12か月決算。
- businessStructure: 並び順の根拠（セグメント注記・外部顧客への売上収益、2026年3月期、百万円）：クオリティオブライフ関連製品107,189＞半導体関連材料106,396＞高機能プラスチック105,490。その他792は報告セグメントではないので最後。MD&A・【事業の内容】の並び（半導体・高機能・QOL）には従っていない。
- businessStructure: 訂正有報はrecord-only（監査報告・KAM関連のみ）で、本文・数値は原本と同一のため、出典は訂正有報（有効文書）とした。needsReviewにはしない。
- businessStructure: 前期の売上収益や増減率は計算して書いていない。セグメント損益・資産は本文に書いていない。
- businessStructure: 地域別売上や顧客は、10％以上の相手先がないため customers は書かない。
- history: 沿革の表は2列（日本ベークライト・住友化工材工業）で崩れていたが、各行の年月と事象は1対1で読めたので行順で対応づけた。1949年3月・1950年5月の株式上場は、どちらの会社の事象か表から確定できないため省いた。
- history: 1938年8月の合成樹脂工業所設立は1944年の社名変更の説明に含めた。工場・研究所の開設（1940年、1962年、1984年、1991年など）、他の海外子会社設立（1990年、1995年、1998年、2007年）、2002年・2003年の買収は選別のため省いた。
- history: 2026年1月の京セラ関連の新設会社株式の取得は2026年10月予定と印字されているため、完了とは書かず予定とした。
- industry: 3つの報告セグメントの売上はほぼ同規模で、樹脂・プラスチックの素材メーカーなので主たる業界を化学とした。半導体関連材料は報告セグメントとして開示しているため半導体を2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックにないため、掲載済み上場企業との同一性を確認できず、結んでいない。
- relatedCompanies: ＡＧＣ株式会社: 事業譲受（過去の1回限りの取引）で、候補ファイルにも無いため結ばない。
- relatedCompanies: 京セラ株式会社: 新設会社の株式取得契約（提出後の予定事項）で、候補ファイルにも無いため結ばない。
- relatedCompanies: 子会社は非上場で、掲載済み企業ではないため結ばない。
- terms: 用語の助言: フェノール樹脂、エポキシ樹脂成形材料（半導体封止材）、ポリカーボネート、IFRSの語を用語集に置くと読みやすい。

## 要確認（status に反映）

- history: 京セラのケミカル事業の一部を承継する新設会社の株式取得は、有報で2026年10月予定。提出後に実施済みか人が確認する必要がある。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
