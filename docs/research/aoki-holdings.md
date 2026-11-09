# ＡＯＫＩホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＡＯＫＩホールディングス |
| 証券コード | 8214 |
| docID（データを取り出した文書） | `S100YFPQ` |
| 原本 docID | `S100YFPQ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFPQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＡＯＫＩホールディングス / 8214 / docID S100YFPQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
aoki-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ＡＯＫＩホールディングス 有価証券報告書－第50期(2025/04/01－2026/03/31) (docID S100YFPQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
aoki-holdings: 本文の金額 18 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社AOKIホールディングス」が EDINET の提出者名「株式会社ＡＯＫＩホールディングス」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に財務諸表の組替えの記載があるが、修正再表示チェックは重複年度の全行で一致し、売上高・当期純利益の範囲に変更はないため、financialNotes には記載していない。
- businessModel: 中期経営計画の数値目標のうち、営業利益・営業利益率・ＲＯＩＣ・ＲＯＥ・ＥＰＳ・ＰＢＲは文章規則により記載していない。
- businessStructure: ファッション事業の内訳は、セグメント情報の収益の分解情報では「ファッション」1行のため、販売実績の製品区分（重衣料・中衣料・軽衣料・レディース・その他）を children とし、売上高は販売実績の印字どおりに記載した。
- businessStructure: 不動産賃貸事業の収益の分解情報には区分名の印字がないため children は設けず、外部顧客への売上高2,202百万円を説明文に記載した。
- businessStructure: 「その他」の区分は報告セグメントに含まれない事業セグメント（広告関連事業等）のため、売上順の最後に置いた。
- history: 設立時の資本金は文章規則により記載していない。
- history: 子会社レベルの出来事（2003年のトリイの子会社化と2005年の合併、2007年のエムエックスの子会社化、2009年・2010年の吸収合併、2011年の本店移転、2005年のアニヴェルセルのジャスダック上場など）は採用しなかった。
- history: 2022年の行は、プライム市場への移行とランシステムの子会社化の2件を1行にまとめた。
- industry: 主たる業界は、外部顧客への売上高が最も大きいファッション事業（小売専門店「ＡＯＫＩ」「ＯＲＩＨＩＣＡ」）で決めた。エンターテイメント事業は報告セグメントとして独立開示があるため2つ目に付けた。
- relatedCompanies: frontier（株式会社フロンティア）は、連結子会社「快活フロンティア」の名称と一致するだけで、同一の会社ではないため結ばない。
- relatedCompanies: アニヴェルセルＨＯＬＤＩＮＧＳは2026年3月31日現在の大株主（38.51％）でその他の関係会社だが、非上場で関連候補にないため結ばない。
- relatedCompanies: エクシングはカラオケ機器の調達先として第一興商と並んで印字されているが、非上場で関連候補にないため結ばない。
- relatedCompanies: トレイデアーリは2026年3月31日現在の大株主（5.10％）だが、非上場で関連候補にないため結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行・日本カストディ銀行は信託口のため結ばない。
- relatedCompanies: en、core、kel、seki、ray、zero は曖昧な断片一致のため結ばない。base-4481、port、space、corona、career、lec、vis、create、fuller、idea-consultants、innovation、land-business、step、the-lead、vision は断片一致のみのため結ばない。aeon-mall、trust はコードリストにないため結ばない。
- relatedCompanies: 政策保有株式は、保有目的が純投資目的以外のものは該当事項なしのため、株式保有を根拠とする関連企業はない。
- terms: 助言: 「快活ＣＬＵＢ」は用語集の登録候補になります。複合カフェの業態で、エンターテイメント事業の中核を担います。
- terms: 助言: 「ＦｉＴ24」は用語集の登録候補になります。24時間型フィットネスジムの業態です。
- terms: 助言: 「ＯＲＩＨＩＣＡ」は用語集の登録候補になります。ビジネス＆ビジカジのトータルコーディネートショップの業態です。
- terms: 助言: 「コート・ダジュール」は用語集の登録候補になります。カラオケルームの業態です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
