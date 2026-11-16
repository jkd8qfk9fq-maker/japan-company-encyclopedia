# ケミプロ化成 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ケミプロ化成株式会社 |
| 証券コード | 4960 |
| docID（データを取り出した文書） | `S100YIYR` |
| 原本 docID | `S100YIYR` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIYR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ケミプロ化成株式会社 / 4960 / docID S100YIYR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
chemipro-kasei-kaisha: 10 件の数値を有報XBRLと照合
有報: ケミプロ化成株式会社 有価証券報告書－第45期(2025/04/01－2026/03/31) (docID S100YIYR)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
chemipro-kasei-kaisha: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: パックの警告（本文に財務諸表の組替えの記載）について: 指標の注記（注1〜5）は非連結であること、潜在株式がないこと、持分法注記の省略、株価の市場、株式給付信託の取扱いという表示事項のみで、会計方針の変更や組替えの具体的な注記は見当たらず、前期有報との照合も全6系列で差異ゼロだったため、financialNotes には記録しなかった。
- businessModel: 中期経営計画の経営目標（経常利益率・自己資本利益率・自己資本比率の目標値）は投資・経営指標の目標であるため、本文にも perspectives にも数値を書いていない。
- businessModel: MD&Aの利益面の金額と理由（営業利益・経常利益・税引前当期純利益・特別利益等）は本文に書いていない。売上高の増減と理由のみを書いた。
- businessModel: 発行済株式総数と資本金は5年間を通じて変わっておらず、株式分割・株式併合の注記もない。
- businessModel: suppliers キーはこのツリーの旧スキーマにないため省略した。
- businessStructure: 関連会社ハリマトランジット株式会社（兵庫県相生市、議決権の27％を所有）は化学品事業に属し、当社製品の原材料の購入と工場用地の賃貸に関わる会社である。当社自身の関連会社であり、開示候補にもないため relatedCompanies には結んでいない。
- businessStructure: 本社は【主要な設備の状況】で「全社」とされているため、特定の事業には結びつけていない。
- businessStructure: セグメント外部売上高の単純合計（化学品事業8,018百万円＋ホーム産業事業927百万円）は8,945百万円で、印字の売上高合計8,946百万円とは千円単位の切捨てにより1百万円異なる。印字の数値をそのまま使っている。
- businessStructure: suppliers キーはこのツリーの旧スキーマにないため省略した。仕入関係の事実は、関連会社ハリマトランジットが当社製品の原材料の購入に関わる旨を【関係会社の状況】が記載していることにとどまる。
- history: 沿革のうち次の行は本編から省いた: 1985年 竹内シーピー化学の設立、1987年 ケミプロファインケミカルの設立、1989年 ケミプロインターメディエイトの設立（いずれも子会社の設立で、後の吸収合併の行で代表させた）、1992年10月 ケミプロインターメディエイトの吸収合併、1994年・1999年・2000年のISO登録・移行、1996年 アイエスシー化学の100％子会社化（1997年の吸収合併に含めた）、2007年 ケミプロファインケミカルの吸収合併、2013年 東京証券取引所市場第二部への移行（市場統合に伴う形式的な移行）。
- history: 1992年の合併は、形式上の存続会社（旧ゼリア株式会社、後のシーピーゼット株式会社）が実質上の存続会社であるケミプロ化成株式会社を吸収合併したもので、沿革の記載は実質上の存続会社についてのものである旨が有報に明記されている。
- history: 資本金の金額は沿革に書いていない。
- industry: 主たる業界は chemicals とした。化学品事業が2026年3月期売上高の約9割を占め、ホーム産業事業も木材保存薬剤という化学製品の製造販売であるためである。
- industry: DEIの別記事業は CTE と印字されているが、事業の実態は化学品の製造販売であるため chemicals を採った。
- relatedCompanies: base-4481: 「取引高ベース」という一般語の部分一致のみで、同社への言及ではないため結んでいない。
- relatedCompanies: rix: 「マトリックスコミュニケーション」の部分一致のみのため結んでいない。
- relatedCompanies: zett: 旧商号「シーピーゼット株式会社」の部分一致のみで、同社への言及ではないため結んでいない。
- relatedCompanies: asahi-kasei: 有報の相手先は旭化成ファインケム株式会社であり、旭化成株式会社とは別の法人のため結んでいない（親会社への読み替えはしていない）。
- relatedCompanies: como: 「コモディティ化」の部分一致のみのため結んでいない。
- relatedCompanies: core: 「コア事業」という一般語の部分一致のみのため結んでいない。
- relatedCompanies: frontier: 中期経営計画のタスクフォース名「NEWフロンティア」の一致のみのため結んでいない。
- relatedCompanies: innovation: 「イノベーション」という一般語の一致のみのため結んでいない。
- relatedCompanies: ishihara-sangyo-kaisha: 1982年にアイエスシー化学株式会社を共同出資で設立した経緯はあるが、同社は1997年に当社が吸収合併しており、現在の取引・資本関係の記載がないため結んでいない。
- relatedCompanies: mitsui-chemicals: 有報の買掛金相手先は三井化学グロップ&ライフソリューションであり、三井化学株式会社とは別の法人のため結んでいない。
- relatedCompanies: mizuho-financial-group: 特定投資株式として保有するが、メインバンクとの関係で、安定的な資金調達体制の維持等が保有目的であり、資金調達が理由のため結んでいない。
- relatedCompanies: resona-holdings: 特定投資株式として保有するが、主要金融機関の親会社であり、安定的な資金調達体制の維持等が保有目的で、資金調達が理由のため結んでいない。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式として保有するが、主要金融機関の一つとの関係で、安定的な資金調達体制の維持等が保有目的であり、資金調達が理由のため結んでいない。
- relatedCompanies: nafco: 債権・債務の内訳表に相手先として現れるのみで、取引や提携の具体的な記載がないため結んでいない。
- relatedCompanies: seki: 「情報セキュリティ」の部分一致のみのため結んでいない。
- relatedCompanies: slogan: 「スローガン」という一般語の一致のみのため結んでいない。
- relatedCompanies: sojitz: 買掛金の相手先内訳に現れるのみで、提携等の記載がないため結んでいない。
- relatedCompanies: tayca: 有報の相手先はテイカ商事株式会社であり、テイカ株式会社とは別の法人のため結んでいない。
- relatedCompanies: toyota-tsusho: 特定投資株式として保有していたが、当事業年度にすべて売却済みのため結んでいない。
- relatedCompanies: vision: 「中長期ビジョン」という一般語の一致のみのため結んでいない。
- relatedCompanies: 候補にないため結んでいない相手: ＢＡＳＦジャパン株式会社（2026年3月期の主要な顧客であり、2026年3月31日現在で発行済株式の7.64％を保有する大株主でもあるが、開示候補にない）、ハリマトランジット株式会社（当社の関連会社で非上場）、三菱ケミカル株式会社・旭化成ファインケム株式会社（買掛金等の相手先として印字されるが候補にない）。
- terms: 助言のみ。用語としては「紫外線吸収剤」「木材保存薬剤」「受託製造」「有機EL材料」「ファインケミカル」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
