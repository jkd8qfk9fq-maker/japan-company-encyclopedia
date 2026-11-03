# 東武鉄道 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東武鉄道株式会社 |
| 証券コード | 9001 |
| docID（データを取り出した文書） | `S100YQNE` |
| 原本 docID | `S100Y8FK` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YQNE／有効文書 S100YQNE（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YQNE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東武鉄道株式会社 / 9001 / docID S100Y8FK（id は英語表記「TOBU RAILWAY CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tobu-railway: 10 件の数値を有報XBRLと照合
有報: 東武鉄道株式会社 訂正有価証券報告書－第206期(2025/04/01－2026/03/31) (docID S100YQNE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第206期(2025/04/01－2026/03/31)、docID S100YQNE）を有効文書としてこのパックを作った。原本は docID S100Y8FK。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはPlannedAdditionsRetirementsEtcOfFacilitiesTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tobu-railway: 本文の金額 24 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [filing-as-subject] financials[4].note: 有報を主語にしない（事業や出来事を直接述べ、根拠は出典欄に任せる）（…訂正有価証券報告書が有効文書で、原本（第206期）と主要…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務の組替えの記載はありますが、前期有報と重複年度が一致しているため basis は付けませんでした。
- businessModel: 営業利益・経常利益・セグメント利益は方針により書いていません。MD&Aの業種別営業収益は内部収益を含むため、business model では報告セグメントの外部顧客への営業収益を使いました。
- businessModel: financialNotes の連結範囲は【事業の内容】の印字です。
- businessModel: financialNotes は変則決算ではなく、訂正の事実の記録として書きました。
- businessStructure: 並びは【セグメント情報】の外部顧客への営業収益（2026年3月期）の順です。運輸216,011、レジャー188,693、流通165,445、不動産45,948、その他39,336（百万円）。5つとも報告セグメントです。
- businessStructure: children の金額は【経営者による財政状態、経営成績及びキャッシュ・フローの分析】の業種別営業収益の印字値です。セグメント間の内部収益を含むため、報告セグメントの外部顧客への営業収益とは測り方が異なり、合計も一致しません（調整額あり）。children の並びはその金額の大きい順です。
- businessStructure: 訂正有価証券報告書は record-only 分類（原本S100Y8FKと本文・主要財務が同一）です。出典はこの訂正有報にしました。MD&Aには提出日が2026年6月22日と印字されています。
- businessStructure: 利益系の数値（営業利益・セグメント利益など）は方針により書いていません。
- history: 沿革の表は年月と事象が正しく対応して読めたので、行順どおり使いました。主な出来事を抜粋しています。
- history: 1931年と1962年などは、同じ話題の複数行を1項目にまとめています。年は最初の出来事の年です。
- history: 1946年の東武林業（現・東武建設）、1960年代以降の個別店舗、2002年の東武バス設立などは省きました（一部は事業構造の説明に反映済み）。
- industry: 主たる業界は最大の報告セグメントの運輸事業（外部顧客への営業収益216,011百万円）で決めました。流通事業（165,445百万円）と不動産事業（45,948百万円）は報告セグメントとして開示があるため追加しました。レジャー事業（188,693百万円）は合う値がなく、旅行・ホテルは運輸・不動産に近いと見て追加していません。
- relatedCompanies: 証拠パックに related-candidates.json がなく、同一性を確かめられる掲載済みの上場企業がないため、結びませんでした。
- relatedCompanies: 【関係会社の状況】に載る子会社（東武トップツアーズ㈱、㈱東武ストアなど）は非上場または上場廃止（㈱東武ストアは2018年10月に上場廃止）で、候補にありません。
- relatedCompanies: 沿革の乗入れ先（東京地下鉄、東急電鉄、相鉄など）は相互乗入れの事実のみで、候補にないため結びませんでした。
- terms: 助言: 「相互乗入れ運転」「直通運転」「営業キロ」「乗車効率」「定期・定期外」「報告セグメント」が用語集の候補です。既存の用語との重複は確認していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 東武鉄道のレジャー事業（ホテル・スカイツリー・旅行業） → 提案: 観光・レジャー・ホテル。2番目に大きい報告セグメントのレジャー事業に当てはまる業界が閉じた分類にない
