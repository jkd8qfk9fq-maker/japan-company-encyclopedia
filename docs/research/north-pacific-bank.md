# 北洋銀行 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社北洋銀行 |
| 証券コード | 8524 |
| docID（データを取り出した文書） | `S100YBAP` |
| 原本 docID | `S100YBAP` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBAP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社北洋銀行 / 8524 / docID S100YBAP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
north-pacific-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社北洋銀行 有価証券報告書－第170期(2025/04/01－2026/03/31) (docID S100YBAP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第168期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
north-pacific-bank: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高にあたる数値は有報の印字どおり連結経常収益とし、2026年3月期235,927百万円・前期150,637百万円を使った。増加の理由はMD&Aの印字（貸出金利息や預け金利息の増加など）に基づく。
- businessModel: 前期の窓に訂正有価証券報告書－第168期(2023/04/01－2024/03/31)があるが、前期有報との修正再表示チェックは経常収益・純利益・利益・総資産・純資産・従業員数の全項目で一致しており、5年分の数値に不整合はないため、warningsのみの扱いとした。決算期変更・変則決算・会計基準の変更はないため、financialNotesは空にした。
- businessModel: キャリアバンク株式会社の公開買付けは、窓内の別文書ではなく有報自体の【重要な契約等】と【重要な後発事象】（連結・個別）に経緯が印字されており、買付期間は2026年4月21日に終了し、2026年4月28日に連結子会社化が完了したことを同記載で確認した。スクイーズアウト手続は提出日現在も予定のため、完了とは書かずneedsReviewに入れた。
- businessModel: 新中期経営計画の数値目標（親会社株主に帰属する当期純利益500億円程度、連結ROE、連結コアOHR、連結RORA）は、利益の水準や投資の語にあたるため、戦略の文章には書いていない。
- businessModel: wikipedia.jsonの抜粋は、第二地方銀行という分類と上場市場など有報の記載と重なる内容のみのため未使用とした。
- businessStructure: 事業の並びはセグメント注記の外部顧客に対する経常収益（2026年3月期）の大きい順（銀行業204,906百万円、リース業24,417百万円）。「その他」は有報が報告セグメントに含まれないと明記する区分のため最後に置いた（6,645百万円）。
- businessStructure: 報告セグメント（銀行業・リース業）の合計229,324百万円に「その他」6,645百万円を加えると235,969百万円で、連結経常収益235,927百万円との差42百万円は貸倒引当金戻入益の調整額（セグメント注記の注4）であり、印字の数値をそのまま引用した。
- businessStructure: 【関連情報】のサービスごとの情報（貸出業務88,590百万円、有価証券投資業務73,920百万円、リース業務24,374百万円、その他49,042百万円）は「その他」の区分を含むグループ全体の内訳であり、銀行業セグメントの内訳ではないため、銀行業の子区分の金額には使っていない。子区分には金額が独立して開示されていない会社・業務だけを金額なしで書いた。
- businessStructure: 売上高にあたる数値は銀行のため経常収益とし、セグメント注記の印字どおりの金額を使った。
- businessStructure: 札幌証券取引所については、表紙が市場区分を印字していないため listings の market を書いていない（東京証券取引所はプライム市場と印字）。
- businessStructure: ノースパシフィック株式会社は議決権の所有割合が43.7％であるが、【関係会社の状況】で連結子会社とされているため、その区分どおり子区分に記載した。
- history: 【沿革】の末尾「2020年４月2022年４月株式会社北海道共創パートナーズを完全子会社化東京証券取引所の市場区分見直しに伴いプライム市場へ移行」は、年月2つと事象2件の数が一致するため行順に対応づけた（2020年＝北海道共創パートナーズの完全子会社化、2022年＝プライム市場への移行）。historyには年のみを記録した。
- history: 第1種優先株式の発行総額や取得額などの金額は、本文の規則により書かず、発行と取得・消却の事実のみを記録した。
- history: 採用しなかった沿革の行：1918年（小樽無尽株式会社への商号変更）、1989年（東京証券取引所市場第二部上場）、1991年（東京証券取引所市場第一部上場）、2011年（本店移転）。いずれも主要な転機として2012年の合併・上場や2022年のプライム市場移行を優先したため。
- history: 2026年のキャリアバンク株式会社の連結子会社化は【沿革】には載っておらず、【関係会社の状況】の注7、【重要な契約等】及び【重要な後発事象】の記載に基づき、後発事象として採用した。
- industry: 報告セグメントの銀行業が2026年3月期の外部顧客に対する経常収益の約87％（204,906百万円／235,927百万円）を占め、リース業と「その他」の区分もリース・信用保証・証券などの金融サービスであるため、financeを主たる業界とし単一とした。
- relatedCompanies: 候補「キャリアバンク」（career-bank）は、公開買付けにより2026年4月28日に当行の連結子会社となった会社だが、候補リストの listing が「（コードリストにない）」となっているため結んでいない。経緯は businessModel の needsReview と history に記録した。
- relatedCompanies: 特定投資株式の候補（ain-holdings、air-water、arcs、ce-holdings、daiichi、daiwa-house-industry、ecomic、electric-power-development、hokkaidenko、hokkaido-chuo-bus、hokkaido-gas、hokkan-holdings、hokuryo、hokuyaku-takeyama-holdings、hokuyu-lucky、idemitsu-kosan、insight、kanamoto、kimura、kuwazawa-holdings、loginet-japan、medical-system-network、mitsubishi-estate、nagawa、nakamichi-leasing、narasaki-sangyo、nichiryo-baking、nippon-beet-sugar-manufacturing、nippon-paper-industries、nitori-holdings、oenon-holdings、oji-holdings、sapporo-holdings、shoei-foods、sougou-shouken、sumitomo-realty-and-development、taiheiyo-kouhatsu、the-japan-steel-works、tomoku、tsuchiya-holdings、wellnet）は、いずれも保有目的が全銘柄共通の定型文（北海道内に本社及び事業基盤を有し、雇用創出、地域経済の活性化に寄与し、中長期的に保有することによって当行の企業価値向上に資するため保有）で、相手ごとに異なる取引・提携の内容が印字されていないため結ばなかった。
- relatedCompanies: 候補「ほくほくフィナンシャルグループ」（hokuhoku-financial-group）は保有株式数が100株のみで、保有目的も「取引関係の維持・強化のため」という定型句であり、銀行でもあるため結ばなかった。
- relatedCompanies: 候補「東京海上ホールディングス」（tokio-marine-holdings）、「日本ハム」（nh-foods）、「SOMPOホールディングス」（sompo-holdings）は、当事業年度の特定投資株式の株式数が「－」（保有なし）となっており、保険会社でもあるため結ばなかった。
- relatedCompanies: 候補「アトラエ」（atrae）は、従業員エンゲージメントの測定値が同社の提供する「Wevox」によるものである旨が人事面の説明に印字されるだけで、提携や継続的な取引関係の記載がないため結ばなかった。
- relatedCompanies: 【大株主の状況】（2026年3月31日現在）で事業会社は北海道電力株式会社（6.19％）だけだが、候補リストにないため major-shareholder のリンクは作っていない。その他の上位は信託銀行の信託口、相互保険会社、従業員持株会などである。
- relatedCompanies: 【関係会社の状況】に載る連結子会社6社（株式会社札幌北洋リース、株式会社札幌北洋カード、北洋ビジネスサービス株式会社、ノースパシフィック株式会社、北洋証券株式会社、株式会社北海道共創パートナーズ）はいずれも非上場で候補リストになく、結んでいない。
- relatedCompanies: 候補「エン」（en）は「エンゲージメント」への、「ポート」（port）は「サポート」への、「ビジョン」（vision）は「長期ビジョン」への、「コア」（core）は「コア粗利益・コアOHR」への、「ベース」（base-4481）は「連結ベース」への、「ゼロ」（zero）は「ネットゼロ」への、「フリー」（freee）は「フリーダイヤル」への、「パス」（path）は「キャリアパス」への、「セキ」（seki）は「セキュリティ」への、「カバー」（cover）は「業務のカバー」への、「IC」（ic）は「ICカード」への、「リード」（the-lead）は「リードする」への、「イノベーション」（innovation）は「イノベーションを支援」への、「レック」（lec）は「フレックスタイム」への、「No.1」（no-1）は標語「地銀グループNo.1」への、「レイ」（ray）は「プレイヤー」への、「リスキル」（reskill）は「リスキル（学び直し）」への、「電算」（densan）は「電算センター」への、「イシン」（ishin）は「債務者格付」への、「ランド」（land）は「ブランドスローガン」への、「スローガン」（slogan）は「ブランドスローガン」への、「リックス」（rix）は「スキルマトリックス」への断片一致であり、いずれも相手企業についての記載ではないため結ばなかった。
- relatedCompanies: 候補「日新」（nissin）と「トラスト」（trust）は候補リストの listing が「（コードリストにない）」であり、一致箇所も新株予約権の記載と日本マスタートラスト信託銀行（信託口）の名称の一部であるため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言扱い（登録は別工程）。経常収益、信用保証、政策保有株式、公開買付けを、この会社の事業と直近の出来事を理解するうえで中心的な語として選んだ。

## 要確認（status に反映）

- businessModel: 期後のグループ再編（公開買付けによる子会社化）：2026年3月3日の取締役会決議に基づく公開買付けにより、キャリアバンク株式会社（証券コード4834、札幌証券取引所本則市場）の普通株式852,487株を取得し、議決権比率88.26％で2026年4月28日に同社を連結子会社化した。当エントリーは2026年3月31日現在のグループ構成で記載している。また、完全子会社化に向けたスクイーズアウト手続の実施が予定されており、実行された場合は同社は上場廃止となる見込みである。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
