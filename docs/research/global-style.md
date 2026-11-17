# グローバルスタイル — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | グローバルスタイル株式会社 |
| 証券コード | 7126 |
| docID（データを取り出した文書） | `S100YTVJ` |
| 原本 docID | `S100YTVJ` |
| 提出日（原本） | 2026-10-22 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YTVJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | グローバルスタイル株式会社 / 7126 / docID S100YTVJ（S100WVWR から新しい有報に更新。旧成果物は pipeline/analysis/superseded/global-style-S100WVWR/） |
| edinet | completed | 0 | pack + draft 再作成（S100YTVJ） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
global-style: 10 件の数値を有報XBRLと照合
有報: グローバルスタイル株式会社 有価証券報告書－第79期(2025/08/01－2026/07/31) (docID S100YTVJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
global-style: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記に会計基準の変更や表示方法の変更の記載はなく、前期有報との数値の突合でも全系列で差異がなかったため、financialNotes は付けていません。注記のうち記念配当（第75期）や従業員数の定義、第79期の配当が株主総会の決議事項であることは表示事項として扱いました。
- businessModel: 当事業年度に一部の固定資産の耐用年数の誤りを修正し減価償却費が減少したことは、MD&A（販売費及び一般管理費の説明）にのみ記載された事項であり、経営指標の注記ではないため、financialNotes にはせず、ここに記録します。金額は本文に書いていません。
- businessModel: MD&Aの利益面の金額（利益の各段階の金額）や受注実績の金額は本文に書いていません。本文の金額は売上高と当期純利益だけです。
- businessModel: 仕入先については、経営方針に「国内外縫製工場とのネットワーク強化」とあるだけで個別の仕入先名の記載がないため、このツリーの旧スキーマに従い suppliers は付けず、事業系統図にも個別名はありません。
- businessStructure: 当社は単一セグメントであり、店舗業態ごとの売上高は開示されていません。子要素には金額を付けていません。
- businessStructure: 店舗数は2026年7月31日現在の有報の印字どおりで、5業態の合計（11＋19＋1＋8＋2）は41店舗と一致します。
- businessStructure: 【関係会社の状況】は該当事項がなく、連結子会社・関連会社はありません。
- history: 沿革表は抽出時に年と出来事の対応がずれて印字されていたため、行の順序で対応づけ、上場年は主要な経営指標等の注記5（2021年8月24日にJASDAQ（スタンダード）市場へ上場）で裏付けました。この対応で、2019年8月がCOMFORT 1号店のオープン、2021年8月が上場、2022年11月が商号変更となります。
- history: 次の行は沿革に登録していません：1959年の本社移転、2007年のタンゴヤホールディングス株式会社の設立、2008年のルビナッチジャパン株式会社の設立と株式会社デパーチュアへの商号変更。資本金の金額は沿革に書いていません。
- industry: 主たる事業はオーダースーツ等の企画・販売（店舗小売）であり、閉じた分類の retail に直接当てはまるため、暫定分類は付けていません。単一セグメントのため副次的な業界も付けていません。
- relatedCompanies: 三菱地所は、有報に名前が出ているのが子会社の三菱地所プロパティマネジメント株式会社であり、三菱地所株式会社とは別の法人です。親会社への読み替えはせず、結んでいません。
- relatedCompanies: そのほかの候補（land・seki・zett・base-4481・freee・garden・en・nissin・the-lead）は、いずれも「ブランド」「クローゼット」「フリーWi-Fi」「ヒルズガーデン」などの一般語や建物名の部分一致であり、当該会社との取引・提携・資本関係を示す記載がないため結んでいません。seki と en は候補リストでも ambiguous とされ、nissin はコードリストにありません。
- relatedCompanies: 【関係会社の状況】は該当事項がなく、特定投資株式も該当事項がありません。主要な顧客ごとの情報の開示もありません。
- terms: 用語の助言のみです。対象となりうる用語は「プライベートフィッティングルーム（採寸や生地選びを個室で行える店舗設備）」「GSクローゼット（当社店舗で購入したスーツ・コート等のクリーニング、保管、修理やサイズ調整ができるアプリ会員向けサービス）」「ガチスーツ（プレゼンテーションや結婚式など、その場にふさわしい一着として訴求する当社のマーケティング上の定義）」です。本文では有報の説明に沿って書いています。

## 要確認（status に反映）

- businessModel: 2023年2月1日付で普通株式1株につき2株の割合で株式分割を行っています（主要な経営指標等の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
