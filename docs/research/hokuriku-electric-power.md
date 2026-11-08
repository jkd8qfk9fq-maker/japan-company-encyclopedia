# 北陸電力 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 北陸電力株式会社 |
| 証券コード | 9505 |
| docID（データを取り出した文書） | `S100YE68` |
| 原本 docID | `S100YE68` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE68.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 北陸電力株式会社 / 9505 / docID S100YE68（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 28 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hokuriku-electric-power: 10 件の数値を有報XBRLと照合
有報: 北陸電力株式会社 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YE68)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hokuriku-electric-power: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…の増加や水力発電量の増加などによって利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意「財務諸表の組替えの記載がある」については、抽出された本文ファイルの中に該当する注記を特定できず、前期有報との修正再表示チェックは全行一致だったため、組替えに関する注記は書かなかった。第98期の経営指標に暫定的な会計処理の確定による見直しが反映されている点は、【主要な経営指標等の推移】の注記に基づき financialNotes に記載した。
- businessModel: 財務目標（連結経常利益の金額目標・自己資本比率・ＲＯＥ）は、利益（売上高・当期純利益以外）と投資の語に関する規則に従い、perspectives には書かなかった。
- businessModel: 従業員数は第101期から区分が見直されており（【主要な経営指標等の推移】の注記）、第102期は北陸電気工事の持分法適用会社への変更などで1,267人減少している。数値そのものは機械が扱うため本文には書かなかった。
- businessStructure: 事業の並び順は報告セグメントの外部顧客への売上高（2026年3月期）の大きい順とし、報告セグメントに含まれない「その他」（71,928百万円）は、送配電事業（58,325百万円）より大きいが規則どおり最後に置いた。
- businessStructure: listings の market は表紙の印字「東京証券取引所プライム市場」から「プライム」とした。
- businessStructure: Wikipedia の抜粋は通称（陸電）などの補足情報のみで、有報の記載と重なるためエントリーには使わなかった。
- history: 【沿革】の表で年月セルが3つ（2009年８月、2014年６月、2017年３月）続けて印字され事象文と分かれていた箇所は、年月と事象の数が同じ（3件ずつ）ため記載順に対応づけた（パワー・アンド・ＩＴ設立、北陸エルネスの子会社化、北陸電力ビズ・エナジーソリューション設立）。
- history: 設立時の資本金額は、金額の記載規則に従い本文に書かなかった。
- history: 次の行は採らなかった: 1953年 大阪証券取引所市場第一部への上場と日本海コンクリート工業の設立、1968年 富山共同火力発電の設立、1970年 北陸発電工事の設立、1973年 福井共同火力発電の設立、1974年 北電産業の設立、1980年・1986年 共同火力発電会社の株式譲受、1982年 北電設備サービスの設立、1987年 北電情報システムサービスと北電営業サービスの設立、1990年 北電アルフの設立、1991年 北陸アーバンの設立、1992年 日本海環境サービスの設立、1995年 アステル北陸の設立、2001年 北電産業と北陸アーバンの合併・北電技術コンサルタントの設立・アステル北陸の営業譲渡と解散、2006年 北陸通信ネットワークの完全子会社化、2019年 北電産業と北陸電気商事の合併、2020年 北陸電力ウィズスマイルの設立・日本海建興の子会社化・北陸電力ビジネス・インベストメントの設立、2021年 フレデリッシュの設立・北電産業小松ビルの設立（子会社の設立・商号変更などの細目が中心のため、会社の転機となる出来事を優先した）。
- industry: 主たる業界は、売上の中心である発電・販売事業と送配電事業から energy（エネルギー）とした。情報・通信などの事業は「その他」に含まれる一部門で、独立した開示がないため業界を足さなかった。
- relatedCompanies: career: 社名の断片が「キャリア形成」などの一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: port: 社名の断片が一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: base-4481: 社名の断片が「データベース」などの一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: en: 社名の断片が「エンゲージメント」などの一般語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: ray: 社名の断片が「ブレイン」などの語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: cci-group: 特定投資株式として「安定的な資金調達」を目的に保有する金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: core: 社名の断片が「コアタイム」などの一般語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: electric-power-development: 経営方針の中で電源開発一般を述べる文脈に社名が現れるだけで、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: frontier: 社名の断片が「フロンティア人材」などの一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: lec: 社名の断片が一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: the-first-bank-of-toyama: 特定投資株式として保有する金融機関（【大株主の状況】にも載る）であり、資金調達の文脈のため結ばなかった。
- relatedCompanies: fuji-electric: 特定投資株式の表に載るのみで、保有目的は定型的な「安定的な資材調達」だけであり、その相手についての具体的な取引の記載がないため結ばなかった。
- relatedCompanies: hokuhoku-financial-group: 特定投資株式として「安定的な資金調達」を目的に保有する金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式として「安定的な資金調達」を目的に保有する金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: mizuho-financial-group: 特定投資株式として「安定的な資金調達」を目的に保有する金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: seiren: 特定投資株式の表に載るのみで、保有目的は定型的な「地域発展への貢献」だけであり、その相手についての具体的な取引の記載がないため結ばなかった。
- relatedCompanies: the-japan-steel-works: 特定投資株式の表に載るのみで、保有目的は定型的な「安定的な資材調達」だけであり、その相手についての具体的な取引の記載がないため結ばなかった。
- relatedCompanies: zero: 社名の断片が「ゼロエミッション」などの一般語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: ana-holdings: 特定投資株式の表に載るのみで、保有目的は定型的な「地域発展への貢献」だけであり、その相手についての具体的な取引の記載がないため結ばなかった。
- relatedCompanies: asia-air-survey: 特定投資株式の表に載るのみで、保有目的は定型的な「安定的な資材調達」だけであり、その相手についての具体的な取引の記載がないため結ばなかった。
- relatedCompanies: como: 社名の断片が「霞が関コモンゲート」などの一般語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: ishin: 社名の断片が法令名などの一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: keio: 特定投資株式の表に載るのみで、保有目的は定型的な「取引関係の維持・強化」だけであり、その相手についての具体的な取引の記載がないため結ばなかった。
- relatedCompanies: seki: 社名の断片が一般語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式として「安定的な資金調達」を目的に保有する金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: the-bank-of-toyama: 特定投資株式として「安定的な資金調達」を目的に保有する金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: the-fukui-bank: 特定投資株式として「安定的な資金調達」を目的に保有する金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: west-japan-railway: 特定投資株式の表に載るのみで、保有目的は定型的な「地域発展への貢献」だけであり、その相手についての具体的な取引の記載がないため結ばなかった。
- terms: 助言: 「一般送配電事業」は用語集に未登録です。送配電網を運営し、託送供給などを行う事業で、この会社の送配電事業そのものを指す中心用語のため、登録候補になります。
- terms: 助言: 「託送」も未登録です。他の電気事業者が送配電網を使って電気を送る仕組みで、送配電事業の収益の中心であり、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
