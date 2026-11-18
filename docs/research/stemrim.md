# ステムリム — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ステムリム |
| 証券コード | 4599 |
| docID（データを取り出した文書） | `S100ZFB4` |
| 原本 docID | `S100ZA4E` |
| 提出日（原本） | 2026-10-27 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | S100ZFB4／有効文書 S100ZFB4（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100ZFB4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ステムリム / 4599 / docID S100ZA4E（S100WW19 から新しい有報に更新。旧成果物は pipeline/analysis/superseded/stemrim-S100WW19/） |
| edinet | completed | 0 | pack + draft 再作成（S100ZA4E） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 7 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
stemrim: 7 件の数値を有報XBRLと照合
有報: 株式会社ステムリム 訂正有価証券報告書－第21期(2025/08/01－2026/07/31) (docID S100ZFB4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第21期(2025/08/01－2026/07/31)、docID S100ZFB4）を有効文書としてこのパックを作った。原本は docID S100ZA4E。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはChangesInNumberOfIssuedSharesStatedCapitalEtcTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
stemrim: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空にしました。主要な経営指標等の注記（当期純損失のため潜在株式調整後1株当たり利益・自己資本利益率・株価収益率を記載しない旨、株主総利回りの比較指標の名称変更、市場移行に伴う最高・最低株価の注記）はいずれも表示事項であり、会計基準の変更・株式分割・変則決算はありません。
- businessModel: 有効文書は訂正有価証券報告書（S100ZFB4、2026年11月11日提出）です。原本（S100ZA4E）との差異は発行済株式総数・資本金等の推移のテキストブロックのみで、財務数値と本文は同一（record-only）と証拠パックで確認済みのため、needsReview には入れていません。出典は訂正有報の値で記載しています。
- businessModel: 【重要な後発事象】はストック・オプションとしての新株予約権の発行（2026年9月の取締役会決議と発行）のみで、資本政策の手続のため warnings のみとしました（金額は書いていません）。
- businessModel: 2026年7月30日に効力が発生した減資は期中の資本政策の手続であり、資本金の金額は本文に書いていません。
- businessModel: MD&Aに印字された研究開発費、販売費及び一般管理費、補助金収入、現金及び預金などの金額は、本文の財務数値は事業収益と当期純利益だけとする規則のため書いていません。
- businessStructure: 単一セグメント（再生誘導医薬®事業）のため、セグメント情報の記載は省略されています。children は【事業の内容】のパイプライン区分（レダセムチド、全身投与型新規ペプチドTRIM3・TRIM4、局所投与型新規ペプチドTRIM5、幹細胞遺伝子治療SR-GT1）から作りました。区分ごとの金額は独立して開示されていないため、金額は書いていません。
- businessStructure: 急性期脳梗塞のグローバル後期第Ⅱ相試験は主要評価項目を達成しなかったことが【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】に記載されています。本文では試験が終了した事実のみを書きました。
- businessStructure: 設備は本社・彩都ラボ（大阪府茨木市）、大阪大学ラボと再生誘導医学協働研究所（いずれも大阪府吹田市）で、いずれも単一セグメントの研究拠点のため特定の事業区分には結びつけていません。帳簿価額は書いていません。
- businessStructure: 【関係会社の状況】は該当事項がなく、子会社・関連会社はありません。
- history: 沿革のうち、本社・ラボの移転や増床、科学技術振興機構A-STEPや新エネルギー・産業技術総合開発機構、日本医療研究開発機構の事業採択、個別の治験の開始・終了の多くは、転機となる出来事だけを選んだため省きました。
- history: 2026年の2件の試験終了は2026年9月の出来事で、決算日（2026年7月31日）の後ですが、有報の沿革そのものに印字されているため沿革どおりに登録しました。
- history: 設立時や増資の資本金の金額は、沿革に金額を書かない規則のため書いていません。
- industry: 再生誘導医薬®事業の単一セグメントで、医薬品の研究開発が事業の全てであるため pharmaceuticals を primary にしました。他の業界は付けていません。
- relatedCompanies: shionogi-and-co: ライセンス契約と共同研究、大株主の三つの根拠があるため結びました。関係の中心は導出契約のため business-partner とし、持株比率は説明に併記しました。
- relatedCompanies: nissin: コードリストになく、新株予約権の行使期間の文中の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: seki: ambiguous で、「セキュリティ研修」などの部分文字列の一致だけのため結びませんでした。
- relatedCompanies: innovation: 「大阪大学最先端医療イノベーションセンター」という施設名の一致だけで、株式会社イノベーションについての記載はないため結びませんでした。
- relatedCompanies: lec: 「フレックスタイム」という一般語の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: core: ambiguous で、「スコア」という一般語の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: en: ambiguous で、「エンドトキシン」という用語の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: base-4481: 「データベース」という一般語の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: insight: 「サイトカイン」という用語の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: land: 「神戸ポートアイランド」という地名の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: no-1: 引用文献の番号表記の一致だけのため結びませんでした。
- relatedCompanies: path: ambiguous で、社名そのものについての記載が確認できないため結びませんでした。
- relatedCompanies: port: 「神戸ポートアイランド」や「ポートフォリオ」などの部分文字列の一致だけのため結びませんでした。
- relatedCompanies: 大阪大学は共同研究の相手方で、レダセムチド等の独占的実施権の許諾元ですが、国立大学法人で関連企業の候補にないため結んでいません。事実は本文と沿革に記載しました。
- relatedCompanies: 【株式の保有状況】は該当事項がなく、政策保有株式はありません。大株主のうち事業会社は塩野義製薬のみで、他は個人と証券会社です。
- terms: 助言のみ。本文で使った用語の候補: 再生誘導医薬®、レダセムチド、間葉系幹細胞、HMGB1、ライセンスアウト、マイルストーン、ロイヤリティ、医師主導治験、希少疾病用医薬品、再生医療です。
- terms: wikipedia.json は医薬品の企業一覧の記事に証券コードで一致しただけで、当社そのものの記事ではないため、補足には使いませんでした。

## 要確認（status に反映）

- businessModel: 事業収益は主要な経営指標等の推移で第19期（2024年7月期）から第21期（2026年7月期）まで「－」と印字され計上がなく、5年表の売上は当該3年度をnullとしています。売上が複数年度空欄である取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
