# エフ・ジェー・ネクストホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＦＪネクストホールディングス |
| 証券コード | 8935 |
| docID（データを取り出した文書） | `S100YS0Y` |
| 原本 docID | `S100YKKI` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YS0Y／有効文書 S100YS0Y（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YS0Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＦＪネクストホールディングス / 8935 / docID S100YKKI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fj-next-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ＦＪネクストホールディングス 訂正有価証券報告書－第46期(2025/04/01－2026/03/31) (docID S100YS0Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第46期(2025/04/01－2026/03/31)、docID S100YS0Y）を有効文書としてこのパックを作った。原本は docID S100YKKI。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
fj-next-holdings: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社FJネクストホールディングス」が EDINET の提出者名「株式会社ＦＪネクストホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年3月期の数値は訂正有価証券報告書（docID S100YS0Y）によるものです。原本（docID S100YKKI）と主要財務は同一で、訂正は役員の状況に関する節のみのため、数値への影響はありません。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項はありません」と印字されています。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順です。セグメント利益は記載していません。
- businessStructure: 「その他」は報告セグメントに含まれない区分のため、事業の並びの最後に置いています。
- businessStructure: 不動産開発事業の内訳区分の売上高の合計は127,724百万円ですが、報告セグメントの外部顧客への売上高は127,725百万円と印字されており、1百万円の差があります。有報の丸めによるもので、印字どおりに記載しています。
- businessStructure: 報告セグメントの外部顧客への売上高の合計は142,371百万円ですが、連結売上高は142,374百万円と印字されており、3百万円の差があります。有報の丸めによるもので、印字どおりに記載しています。
- history: 2013年5月の行には「株式会社エフ・ジェー不動産販売を吸収合併」と「伊豆高原支店を静岡県伊東市に開設」が並んで印字されています。伊豆高原支店の開設は1995年12月の沿革と重なるため、2013年5月は吸収合併のみを沿革に加えました。
- industry: 主たる業界は、外部顧客への売上高が最も大きい不動産開発事業の内容から不動産としました。
- industry: 建設事業は報告セグメントとして独立して開示されているため、建設を2つ目の業界としました。
- industry: 旅館事業には閉じた分類に合う区分が無いため、業界を付けていません。
- relatedCompanies: ガーラ: 「ガーラマンションシリーズ」のブランド名の部分一致のため結びませんでした。
- relatedCompanies: セキ: 「セキュリティ」の部分一致のため結びませんでした。
- relatedCompanies: ランド: 「ブランド」の部分一致のため結びませんでした。
- relatedCompanies: ベース: 「時価ベースの自己資本比率」などの一般語のため結びませんでした。
- relatedCompanies: エン: 「レジリエンス」などの部分一致のため結びませんでした。
- relatedCompanies: キャリア: 「自律的なキャリア形成」の一般語のため結びませんでした。
- relatedCompanies: ポート: 「事業ポートフォリオ」の部分一致のため結びませんでした。
- relatedCompanies: 鈴木: 取締役の個人名のため結びませんでした。
- relatedCompanies: レイ: 「ロールプレイング」の部分一致のため結びませんでした。
- relatedCompanies: トラスト: 日本マスタートラスト信託銀行は信託銀行で、金融機関の純投資のため結びませんでした。
- relatedCompanies: ウィル: 「ウィルミントン」の部分一致のため結びませんでした。
- relatedCompanies: 大和: 「割当先大和証券」の記載は大和証券のことで、株式会社大和とは別会社のため結びませんでした。
- relatedCompanies: 大株主の状況に載るエム・エム・ヨーク、肥田幸春、松濤投資倶楽部などは、related-candidates.jsonに含まれていないため結びませんでした。
- relatedCompanies: 連結子会社7社（ＦＪネクスト、ＦＪネクストレジデンシャル、エフ・ジェー・コミュニティ、レジテックコーポレーション、ＦＪリゾートマネジメント、アライドライフ、伊東一碧管理サービス）: いずれも非上場のため結びませんでした。
- terms: 用語候補として、ガーラマンションシリーズ、ガーラ・レジデンスシリーズ、資産運用型マンション、別荘地管理事業があります。いずれも既存の用語集には無いため、本文ではリンク記法を使っていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
