# イビデン — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | イビデン株式会社 |
| 証券コード | 4062 |
| docID（データを取り出した文書） | `S100YFCS` |
| 原本 docID | `S100YC4B` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YFCS／有効文書 S100YFCS（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFCS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | イビデン株式会社 / 4062 / docID S100YC4B（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 35 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ibiden: 10 件の数値を有報XBRLと照合
有報: イビデン株式会社 訂正有価証券報告書－第173期(2025/04/01－2026/03/31) (docID S100YFCS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第173期(2025/04/01－2026/03/31)、docID S100YFCS）を有効文書としてこのパックを作った。原本は docID S100YC4B。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはCorporateGovernanceCompanyWithAuditAndSupervisoryCommitteeTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock・MetricsAndTargetsClimateChangeTextBlock・OverviewOfCorporateGovernanceTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
ibiden: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…たモノづくり改革などに取り組むことで利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみとし、営業利益・経常利益・セグメント利益などの金額は書かなかった。
- businessModel: 修正再表示チェックは前期有報との重複年度が全項目一致し、決算期変更・変則決算もないため financialNotes は空にした。
- businessModel: 2026年1月1日付の株式分割（普通株式1株につき2株）は1株当たり指標にのみ関わるため、本文にも financialNotes にも書かなかった。
- businessModel: 中期経営計画については5本の活動の柱の内容だけを書き、数値目標は書かなかった。
- businessStructure: 事業の並び順は、報告セグメント（電子243,316百万円→セラミック82,554百万円、2026年3月期の外部顧客への売上高順）を先に並べ、有報が「報告セグメントに含まれない」と書く「その他」（90,330百万円）は金額がより大きいが規則により最後に置いた。
- businessStructure: 上場市場は表紙の印字（東京証券取引所プライム市場・名古屋証券取引所プレミア市場）どおりとした。
- businessStructure: 出典は有効文書である訂正有価証券報告書（docID S100YFCS、2026年6月22日提出、原本 S100YC4B）とし、本文は訂正後の文面を含む証拠パックから書いた。訂正は分類 record-only（財務・本文は原本と同一、差異はガバナンス等の節のみ）であるため、パックの注意どおり needsReview には入れなかった。
- history: 沿革は有報【沿革】の印字どおり年月から年だけを取り、主要な出来事に絞った。各地の工場開設や販売子会社の設立など、事業の転換点でない項目は一部省略した。
- history: 2025年の大野事業場が電子事業の生産設備であることは【主要な設備の状況】の印字に基づく。
- history: Wikipedia は創業の経緯が有報【沿革】と重なる内容のみで、補足に使える有報外の事実が乏しかったため使わなかった。
- industry: 主たる業界は、売上高の過半を占める電子事業（パッケージ基板などの電子部品）から electronics とした。
- industry: 半導体向けの部材であるパッケージ基板を事業として開示しているため、semiconductors を2つ目に付けた。
- industry: セラミック事業は自動車排気系部品のほか特殊炭素製品・ファインセラミックスなど分野が複数にわたるため、automotive は付けなかった。
- relatedCompanies: 【関係会社の状況】に載る子会社29社と持分法適用関連会社1社（いぶき水力発電株式会社）はいずれも未上場で候補にないため結ばなかった。主要な顧客のNVIDIA Corp.、Intel Corp.、Advanced Micro Devices Inc.は外国会社で候補にないため結ばなかった。
- relatedCompanies: career: 「キャリア構築」等の一般語と自社子会社「株式会社イビデンキャリア・テクノ」の名称の部分一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: land: 自社子会社「イビデンフィリピンランドホールディングス」の名称の部分一致で、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: zero: 「温室効果ガス排出の実質ゼロ」など一般語の一致で、株式会社ゼロについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」など一般語の部分一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: denyo: 自社子会社の名称等の部分一致で、デンヨー株式会社についての記載はないため結ばなかった。
- relatedCompanies: en: 自社子会社「イビデンエンジニアリング」の名称等の部分一致で、エン株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: cover: 「拠点をカバーした」など一般語の一致で、カバー株式会社についての記載はないため結ばなかった。
- relatedCompanies: vision: 「環境ビジョン2050」等の一般語と自社子会社「株式会社いえ・VISION」の名称の一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: daiwa: 大量保有報告書における大和アセットマネジメント株式会社とその共同保有者の記載のみで、取引・提携の記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: ic: 「ICパッケージ基板」など製品名の部分一致で、株式会社ICについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: mec: 自社子会社「マイクロメック株式会社」の名称の部分一致で、メック株式会社についての記載はないため結ばなかった。
- relatedCompanies: suzuki-6785: 役員の氏名の一致で、株式会社鈴木についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: the-ogaki-kyoritsu-bank: 【大株主の状況】に1.54％の記載があるが金融機関であり、特定投資株式の保有目的も資金調達のためであるため結ばなかった。
- relatedCompanies: toyota-industries-6201: 【大株主の状況】に4.45％（2026年3月31日現在）を保有する事業会社だが、候補データの listing が「上場」でないため結ばなかった。なお当社が保有していた同社株式は当事業年度に売却済みである。
- relatedCompanies: core: 「コア事業」など一般語の一致で、株式会社コアについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: i-ll: ブラックロック系ファンドの名称の部分一致で、株式会社アイルについての記載はないため結ばなかった。
- relatedCompanies: ishin: 「社内カーボンプライシング」等の表記の部分一致で、イシン株式会社についての記載はないため結ばなかった。
- relatedCompanies: rix: 「スキル・マトリックス」等の部分一致で、リックス株式会社についての記載はないため結ばなかった。
- relatedCompanies: the-lead: 「開発リードタイム」等の部分一致で、株式会社リードについての記載はないため結ばなかった。
- relatedCompanies: freee: 「フリーキャッシュ・フロー」の部分一致で、フリー株式会社についての記載はないため結ばなかった。
- relatedCompanies: juroku-financial-group: 特定投資株式の保有目的が資金調達のためであり、金融機関であるため結ばなかった。
- relatedCompanies: kohsoku: 「高速伝送」等の部分一致で、株式会社高速についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: misonoza-theatrical: 特定投資株式として4,000株を保有するが、保有目的が地域の芸術・文化振興への支援であり取引関係の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 大量保有報告書（変更報告書）における共同保有の記載のみで、取引・提携の記載がないため結ばなかった。
- relatedCompanies: ms-and-ad-insurance-group-holdings: 特定投資株式の保有目的が保険取引のためであり、保険取引が理由の保険会社は結ばない規則により結ばなかった。
- relatedCompanies: nissin: 株式関連の表記等の部分一致で、株式会社日新についての記載はなく、listing も「上場」でないため結ばなかった。
- relatedCompanies: ray: ブラックロック系ファンドの名称等の部分一致で、株式会社レイについての記載はないため結ばなかった。
- relatedCompanies: seino-holdings: 特定投資株式として28,154株を保有し、子会社を通じた自動車の燃料販売やメンテナンスの取引の記載はあるが、保有規模が小さく子会社の付随的な取引にとどまるため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有目的が資金調達のためであり、金融機関であるため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式の保有目的が資金調達のためであり、金融機関であるため結ばなかった。
- relatedCompanies: sun-messe: 特定投資株式として55,000株を保有し、社内広報誌などの印刷の取引の記載はあるが、小規模な間接業務の取引にとどまるため結ばなかった。
- relatedCompanies: teikoku-tsushin-kogyo: 当社が保有していた株式は当事業年度に売却済みで、現在の取引・資本関係の記載がないため結ばなかった。
- relatedCompanies: toyota: 特定投資株式として5,500株を保有し、セラミック分野における自動車関連事業の取引の記載はあるが、保有株数が僅少で取引関係を結ぶ根拠として弱いため結ばなかった。
- relatedCompanies: 結んだ5社は、いずれも特定投資株式の銘柄ごとの保有目的に、相手ごとの具体的な取引内容（ガス・露光装置・メッキ薬品の購入、造園工事の受注、エネルギー取引）が印字されている相手に限った。資金調達・保険取引が目的の金融機関・保険会社と、保有目的に取引の記載がない相手は結んでいない。
- terms: 助言: 「DPF」は用語集に未登録です。ディーゼル・パティキュレート・フィルターの略で、自動車の排気系部品としてセラミック事業の中心製品の一つであり、有報の経営成績の分析でも繰り返し使われているため、登録候補になります。
- terms: 助言: 「AFP」は用語集に未登録です。触媒担体保持・シール材を指すこの会社の略称で、セラミック事業の製品区分として有報に繰り返し現れるため、登録候補になります。
- terms: 助言: 「イビテクノ」は用語集に未登録です。経営方針で「共有すべき行動精神」の一つとして「イビテクノの進化」が掲げられている、この会社独自の技術・ものづくりを指す言葉であるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
