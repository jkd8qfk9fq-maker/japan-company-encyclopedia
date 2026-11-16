# ＴＤＳＥ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＴＤＳＥ株式会社 |
| 証券コード | 7046 |
| docID（データを取り出した文書） | `S100YJTH` |
| 原本 docID | `S100YJTH` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJTH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＴＤＳＥ株式会社 / 7046 / docID S100YJTH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tdse: 10 件の数値を有報XBRLと照合
有報: ＴＤＳＥ株式会社 有価証券報告書－第13期(2025/04/01－2026/03/31) (docID S100YJTH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
tdse: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「TDSE株式会社」が EDINET の提出者名「ＴＤＳＥ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えに関する判断: 前期有報との修正再表示照合は全6系列（売上高・当期純利益・利益・総資産・純資産・従業員数）で差異ゼロだった。本文中の組替えに当たる記載は、販売費及び一般管理費の内訳で「情報処理費」を当事業年度から主な内訳として表示し前事業年度の金額も併記した表示方法の変更のみで、主要な経営指標等の数値に影響しない表示上の変更のため、financialNotes には入れず本 warnings に記録した。
- businessModel: 経営指標等の注記1～6は、連結財務諸表を作成していないこと、潜在株式の取扱い、持分法適用の関連会社がないこと、従業員数の定義、株価の市場区分に関する表示事項であり、financialNotes には入れなかった。
- businessModel: 経営者による分析に印字された売上高以外の損益項目の金額・増減理由（費用の内訳を含む）は本文に書かなかった。売上高の増加理由は印字どおりプロダクトサービスとAIエージェントサービスの拡大によった。
- businessModel: 2026年4月開始の新中期経営計画「SHIFT2028」の数値目標（売上高の目標額、ストック型収益や生成AIエージェント関連の比率目標）は投資指標に当たるため、本文・perspectives のいずれにも書かなかった。
- businessStructure: 単一セグメント（ビッグデータ・AIソリューション事業）のため、事業は1つとし、【事業の内容】が分類する「コンサルティングサービス」「プロダクトサービス」を子区分とした。製品及びサービスごとの情報は、単一の製品・サービスの区分の外部顧客への売上高が売上高の90％を超えるため有報で省略されており、2サービス別の売上高は開示されていないので、子区分に金額は書かなかった。
- businessStructure: 当社は連結財務諸表を作成しておらず、【関係会社の状況】は「該当事項はありません」。数値はすべて提出会社単体のものである。
- businessStructure: 主要な設備は本社（東京都新宿区）のみで、事業との対応は単一セグメントのため結びつけていない。
- businessStructure: suppliers（仕入先）は本ツリーの旧スキーマに無いため省略した。プロダクトサービスの仕入製品（QUID製品等）の事実は事業の説明に含めた。
- history: 沿革表は年月と事象が対応して印字されており、行順の対応づけは不要だった。年月は落として年のみで登録した。
- history: 落とした行（列挙）: 2013年 早稲田大学との産学連携開始、2015年 日本マイクロソフトとのIoT分野での協業、2017年 東京電力パワーグリッドとの共同開発開始、2019年 DataRobotとのパートナー契約、2020年 Google Cloud上でのCognigyサービス提供・東北電力ネットワーク向け架空送電線画像解析AIの導入、2021年 熊本市およびコロナワクチン接種予約ボットの導入事例・QAジェネレーターの提供開始、2022年 はせがわのDX推進支援・TDSE Eyeの提供開始、2023年 中期経営計画「MISSION2025」の開始・GPT活用Cognigyのリリース・Rival IQの提供開始・NetBaseへのAI Search搭載・Quidブランドへのサービス名変更・QAジェネレータークラウド版の提供・LLM活用支援サービスの提供開始、2024年 Databricksのサービス提供開始・TDSE KAIZODEの提供開始・QUID製品のアップグレード・Dify開発元との国内初パートナー契約。これらは個別の製品・サービス提供や導入事例であり、会社の転機とは切り分けた。
- history: 2026年4月の新中期経営計画「SHIFT2028」の始動と営業・技術組織の再編は決算日（2026年3月31日）後の事項である。中期経営計画の数値目標は投資指標に当たるため本文に書かず、本登録は2026年3月31日時点の構成に基づく（warnings のみの扱いとした）。
- history: 資本金の金額は沿革に書かない規則のため、設立時等の資本金額は転記していない。
- industry: 単一セグメント（ビッグデータ・AIソリューション事業）は、データ分析・AIモデル構築のコンサルティングとAI製品の提供であり、閉じた分類の it が直接当てはまるため主分類とした。コンサルティングと製品で売上の内訳が開示されていないため、第2の業界は付けなかった。taxonomyGaps は無い。
- relatedCompanies: fast-retailing: 【主要な顧客ごとの情報】と販売実績の相手先別内訳に正式名称で印字された主要な顧客のため customer として結んだ。
- relatedCompanies: mitsubishi-research-institute: 【沿革】に2024年10月の業務提携が印字されているため business-partner として結んだ。
- relatedCompanies: gdep-advance: 【沿革】の2025年6月のサービス開始と、経営者による分析の「ジーデップ・アドバンス社と協業し」との印字があるため business-partner として結んだ。
- relatedCompanies: 株式会社リクルート: 主要な顧客（2026年3月期の販売実績の15.5％）だが、related-candidates.json に含まれないため結べなかった。親会社のリクルートホールディングスへのすり替えはしていない。
- relatedCompanies: 株式会社エヌ・ティ・ティ・データ（NTTデータ）: 2017年の資本参加・業務提携先であり、2026年3月31日現在の大株主（7.64％）でもあるが、現在のEDINETコードリストで非上場のため結ばなかった。売掛金の相手先別内訳にも載っている。
- relatedCompanies: あいおいニッセイ同和損害保険株式会社: 2017年の資本参加・業務提携先であり大株主（7.64％）でもあるが、非上場で候補にも含まれないため結ばなかった。
- relatedCompanies: 株式会社テクノスジャパン: 2026年3月31日現在の筆頭株主（18.15％）だが、非上場で候補に含まれないため結ばなかった。
- relatedCompanies: acom / dentsu-soken / softbank / the-kansai-electric-power: 売掛金の相手先別内訳に載るだけで、取引関係を述べる記載が相手ごとに独立していないため結ばなかった。
- relatedCompanies: tohoku-electric-power: 有報が印字するのは東北電力ネットワーク株式会社（2020年11月の導入事例）であり、候補の東北電力株式会社とは別の法人であるため結ばず、すり替えもしていない。
- relatedCompanies: grid: 有報が印字するのは東京電力パワーグリッド株式会社（2017年の共同開発）であり、候補の株式会社グリッドとは別の法人であるため結ばなかった。
- relatedCompanies: hasegawa: 【沿革】の2022年2月のDX推進支援の印字のみで、継続的な取引関係を述べる記載がないため結ばなかった。
- relatedCompanies: en / core / vision / land / lec / port / rhythm / step / ray / freee / kohsoku / innovation / insight / corona / secure / daiwa / rakus: 一般語・部分一致で機械抽出されたもので、各社との関係を述べる記載がないため結ばなかった。
- terms: 助言のみ（この断片では用語を登録しない）: 「AIエージェント」は【事業の内容】【経営方針】の中心用語で、生成AIを活用した判断・実行・運用までを支援する仕組みとして使われているため、用語集への追加を提案する。
- terms: 助言のみ: 「RAG（Retrieval-Augmented Generation）」は【事業の内容】で略語の展開とともに使われているため、用語集への追加を提案する。
- terms: 助言のみ: 「データサイエンティスト」は当社の専門人材を指す中心用語のため、用語集への追加を提案する。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
